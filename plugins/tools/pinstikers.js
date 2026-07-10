import fs from 'fs'
import path from 'path'
import { spawn } from 'child_process'
import fetch from 'node-fetch'
import ffmpegPath from 'ffmpeg-static'

const FFMPEG_PATH = ffmpegPath || 'ffmpeg'
const tmpDir = path.resolve(process.cwd(), 'tmp')
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true })

const safeUnlink = (p) => { try { fs.existsSync(p) && fs.unlinkSync(p) } catch { } }

const isValidImage = (buf) => {
    if (!Buffer.isBuffer(buf) || buf.length < 4) return false
    if (buf[0] === 0xFF && buf[1] === 0xD8) return true
    if (buf[0] === 0x89 && buf[1] === 0x50) return true
    if (buf[0] === 0x47 && buf[1] === 0x49) return true
    if (buf[0] === 0x52 && buf[1] === 0x49) return true
    return false
}

const imageToSticker = (inputPath, outputPath) => new Promise((resolve, reject) => {
    const args = [
        '-y', '-i', inputPath,
        '-vf', 'scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=0x00000000,format=yuva420p',
        '-an', '-c:v', 'libwebp_anim', '-preset', 'picture',
        '-compression_level', '6', '-q:v', '70', '-loop', '0', outputPath
    ]
    const proc = spawn(FFMPEG_PATH, args, { stdio: ['ignore', 'pipe', 'pipe'] })
    let err = ''
    proc.stderr.on('data', d => err += d.toString())
    proc.on('close', code => code === 0 ? resolve(outputPath) : reject(new Error(err.slice(-300))))
    proc.on('error', (err) => reject(new Error(`Error con ffmpeg: ${err.message}`)))
})

const downloadImage = async (url) => {
    const res = await fetch(url, {
        signal: AbortSignal.timeout(15000),
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    })
    if (!res.ok) throw new Error(`Error ${res.status}`)
    const buf = Buffer.from(await res.arrayBuffer())
    if (!isValidImage(buf)) throw new Error('Imagen no válida')
    return buf
}

const sentCache = new Map() // key: `${remoteJid}:${query}` -> Set of urls already sent

const getCacheKey = (remoteJid, query) => `${remoteJid}:${query.toLowerCase().trim()}`

const pickNextUrls = (urls, key) => {
    let used = sentCache.get(key)
    if (!used) {
        used = new Set()
        sentCache.set(key, used)
    }

    let available = urls.filter(u => !used.has(u))
    if (available.length === 0) {
        // Ya se enviaron todos los resultados disponibles: reiniciamos el ciclo
        used.clear()
        available = urls
    }

    // Orden aleatorio para no repetir siempre el mismo primero
    for (let i = available.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [available[i], available[j]] = [available[j], available[i]]
    }

    return { available, used }
}

const searchPinterest = async (query) => {
    const searchQuery = `stickers de ${query}`

    const apis = [
        {
            url: `https://api.stellarwa.xyz/search/pinterest?query=${encodeURIComponent(searchQuery)}&key=api-7dSKm`,
            extract: (r) => (r.data || r.data?.data || []).map(i => i.hd || i.image || i.url).filter(Boolean)
        },
        {
            url: `https://rest.apicausas.xyz/api/v1/buscadores/pinterest?apikey=oboe&q=${encodeURIComponent(searchQuery)}`,
            extract: (r) => (r.data || []).map(i => i.hd || i.image || i.url).filter(Boolean)
        },
        {
            url: `https://api.delirius.store/search/pinterestv2?text=${encodeURIComponent(searchQuery)}`,
            extract: (r) => (r.data || []).map(i => i.hd || i.image || i.url).filter(Boolean)
        }
    ]

    for (const api of apis) {
        try {
            const res = await fetch(api.url)
            if (!res.ok) continue
            const data = await res.json()
            const urls = api.extract(data)
            if (urls.length > 0) return urls.slice(0, 20)
        } catch { continue }
    }

    throw new Error('No se encontraron resultados')
}

export default [
    {
        command: ['sp'],
        description: 'Busca stickers en Pinterest',
        category: 'Stickers',

        async execute({ sock, remoteJid, reply, text, m }) {
            const messageKey = m?.key || { remoteJid }
            const query = text?.trim() || ''

            if (!query) {
                return reply('.sp gatos kawaii\n.sp anime\n.sp flores bonitas')
            }

            const tmpFiles = []
            const clean = () => tmpFiles.forEach(safeUnlink)

            try {
                try { await sock.sendMessage(remoteJid, { react: { text: '🔍', key: messageKey } }) } catch { }

                const urls = await searchPinterest(query)
                const cacheKey = getCacheKey(remoteJid, query)
                const { available, used } = pickNextUrls(urls, cacheKey)

                let sticker = null
                let chosenUrl = null

                for (const url of available) {
                    try {
                        const imageBuf = await downloadImage(url)
                        const imgPath = path.join(tmpDir, `sp-${Date.now()}.jpg`)
                        tmpFiles.push(imgPath)
                        fs.writeFileSync(imgPath, imageBuf)

                        const stickerPath = path.join(tmpDir, `sp-${Date.now()}.webp`)
                        tmpFiles.push(stickerPath)
                        await imageToSticker(imgPath, stickerPath)

                        sticker = fs.readFileSync(stickerPath)
                        chosenUrl = url
                        break
                    } catch { continue }
                }

                if (!sticker) {
                    await reply('No se encontraron stickers')
                    return clean()
                }

                used.add(chosenUrl)

                await sock.sendMessage(remoteJid, {
                    sticker,
                    packname: '✦ Asta Bot ✦',
                    author: 'Pinterest Stickers'
                })

                try { await sock.sendMessage(remoteJid, { react: { text: '✅', key: messageKey } }) } catch { }

            } catch (e) {
                console.error('Error en sp:', e)
                try { await sock.sendMessage(remoteJid, { react: { text: '❌', key: messageKey } }) } catch { }
                await reply(`Error: ${e.message}`)
            } finally {
                clean()
            }
        }
    }
]