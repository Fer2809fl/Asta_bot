import axios from 'axios'
import fs from 'fs'
import path from 'path'

const tmpDir = path.resolve(process.cwd(), 'tmp')
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true })

const fetchJson = async (url) => {
    const res = await axios.get(url, { timeout: 15000 })
    return res.data
}

const downloadToFile = async (url, dest) => {
    const res = await axios({
        url,
        method: 'GET',
        responseType: 'stream',
        timeout: 45000,
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    })
    return new Promise((resolve, reject) => {
        const writer = fs.createWriteStream(dest)
        res.data.pipe(writer)
        writer.on('finish', resolve)
        writer.on('error', reject)
    })
}

const normalizeAlyacore = (res) => {
    if (!res || !res.status || !res.data) throw new Error('Alyacore no devolvió resultados')
    const downloadUrl = res.data.dl
    if (!downloadUrl) throw new Error('Alyacore: No se encontró enlace')
    return { url: downloadUrl, type: res.data.type || 'video', title: res.data.title || null, username: res.data.username || null, motor: 'Alyacore' }
}

const normalizeDelirius = (res) => {
    if (!res || !res.status) throw new Error('Delirius no devolvió datos')
    const d = res.data
    const downloadUrl = d?.download || d?.url || (d?.list && d.list[0]?.url) || res.result
    if (!downloadUrl) throw new Error('Delirius: No se encontró enlace')
    let type = 'video'
    if (d?.type) type = d.type
    else if (/\.(jpg|jpeg|png|webp)/i.test(downloadUrl)) type = 'image'
    return { url: downloadUrl, type, title: d?.title || null, username: d?.username || null, motor: 'Delirius' }
}

const normalizeStellar = (res) => {
    if (!res || !res.status) throw new Error('StellarWA no devolvió resultados')
    const d = res.data || res.resultado || res.result
    if (!d) throw new Error('StellarWA: No se encontraron datos')
    const downloadUrl = d.dl || d.download || d.url || (d.resultados && d.resultados[0]?.url)
    if (!downloadUrl) throw new Error('StellarWA: No se encontró enlace')
    return { url: downloadUrl, type: d.type || 'video', title: d.title || null, username: d.username || null, motor: 'StellarWA' }
}

export default [
    {
        command: ['ig', 'instagram', 'igdl', 'reels', 'igtv'],
        description: 'Descarga videos e imágenes de Instagram',
        category: 'Descargas',

        async execute({ sock, remoteJid, reply, text, m }) {
            const messageKey = m?.key || { remoteJid }
            let url = text?.trim() || ''

            if (!url) return reply('Ingresa el enlace de Instagram\nEjemplo: .ig https://www.instagram.com/reel/xxx/')

            url = url.replace(/\/reels\//i, '/reel/')

            try { await sock.sendMessage(remoteJid, { react: { text: '⏳', key: messageKey } }) } catch { }

            const tempId = Date.now()
            let tempPath = ''

            try {
                const results = await Promise.allSettled([
                    fetchJson(`https://api.alyacore.xyz/dl/instagram?url=${encodeURIComponent(url)}&key=oboe`).then(normalizeAlyacore),
                    fetchJson(`https://api.delirius.store/download/instagram?url=${encodeURIComponent(url)}`).then(normalizeDelirius),
                    fetchJson(`https://api.stellarwa.xyz/dl/instagram?url=${encodeURIComponent(url)}&key=api-7dSKm`).then(normalizeStellar)
                ])

                const successfulMetadata = results
                    .filter(r => r.status === 'fulfilled' && r.value)
                    .map(r => r.value)

                if (successfulMetadata.length === 0) throw new Error('Todos los servidores fallaron')

                let downloaded = false
                let finalMetadata = null

                for (const metadata of successfulMetadata) {
                    const { url: downloadUrl, type } = metadata
                    const isReel = url.includes('/reel/') || url.includes('/reels/') || type === 'reel'
                    const isImage = !isReel && (type === 'image' || type === 'photo' || /\.(jpg|jpeg|png)/i.test(downloadUrl))
                    const fileExt = isImage ? 'jpg' : 'mp4'
                    const attemptPath = path.join(tmpDir, `ig-${tempId}.${fileExt}`)

                    try {
                        await downloadToFile(downloadUrl, attemptPath)
                        if (fs.existsSync(attemptPath) && fs.statSync(attemptPath).size > 0) {
                            downloaded = true
                            tempPath = attemptPath
                            finalMetadata = { ...metadata, isReel, isImage }
                            break
                        }
                    } catch {
                        try { if (fs.existsSync(attemptPath)) fs.unlinkSync(attemptPath) } catch { }
                        try {
                            const fetchRes = await fetch(downloadUrl)
                            if (fetchRes.ok) {
                                const buffer = Buffer.from(await fetchRes.arrayBuffer())
                                fs.writeFileSync(attemptPath, buffer)
                                if (fs.existsSync(attemptPath) && fs.statSync(attemptPath).size > 0) {
                                    downloaded = true
                                    tempPath = attemptPath
                                    finalMetadata = { ...metadata, isReel, isImage }
                                    break
                                }
                            }
                        } catch {
                            try { if (fs.existsSync(attemptPath)) fs.unlinkSync(attemptPath) } catch { }
                        }
                    }
                }

                if (!downloaded) {
                    const fb = successfulMetadata[0]
                    finalMetadata = {
                        ...fb,
                        isReel: url.includes('/reel/') || url.includes('/reels/') || fb.type === 'reel',
                        isImage: !(url.includes('/reel/') || url.includes('/reels/')) && (fb.type === 'image' || fb.type === 'photo' || /\.(jpg|jpeg)/i.test(fb.url))
                    }
                }

                const { title, username, motor: finalMotor, isReel, isImage } = finalMetadata
                const typeLabel = isImage ? 'Imagen' : isReel ? 'Reel' : 'Video'

                let caption = `📸 Instagram\n`
                if (title) caption += `📝 ${title.slice(0, 50)}${title.length > 50 ? '...' : ''}\n`
                if (username) caption += `👤 @${username}\n`
                caption += `🎞️ ${typeLabel}\n⚙️ ${finalMotor}`

                if (isImage) {
                    if (downloaded) {
                        await sock.sendMessage(remoteJid, { image: fs.readFileSync(tempPath), caption }, { quoted: m })
                    } else {
                        await sock.sendMessage(remoteJid, { image: { url: finalMetadata.url }, caption }, { quoted: m })
                    }
                } else {
                    if (downloaded) {
                        await sock.sendMessage(remoteJid, { video: fs.readFileSync(tempPath), mimetype: 'video/mp4', caption }, { quoted: m })
                    } else {
                        await sock.sendMessage(remoteJid, { video: { url: finalMetadata.url }, mimetype: 'video/mp4', caption }, { quoted: m })
                    }
                }

                try { await sock.sendMessage(remoteJid, { react: { text: '✅', key: messageKey } }) } catch { }

                if (downloaded && fs.existsSync(tempPath)) {
                    try { fs.unlinkSync(tempPath) } catch { }
                }

            } catch (e) {
                console.error('Error en ig:', e)
                if (tempPath && fs.existsSync(tempPath)) {
                    try { fs.unlinkSync(tempPath) } catch { }
                }
                try { await sock.sendMessage(remoteJid, { react: { text: '❌', key: messageKey } }) } catch { }
                await reply(`Error: ${e.message || 'No se pudo descargar'}`)
            }
        }
    }
]