import fs from 'fs'
import path from 'path'

const tmpDir = path.resolve(process.cwd(), 'tmp')
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true })

const fetchJson = async (url) => {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
}

const firstSuccessful = async (promises) => {
    const errors = []
    for (const p of promises) {
        try {
            const result = await p
            if (result) return result
        } catch (e) {
            errors.push(e)
        }
    }
    throw new Error('Todos los servidores fallaron')
}

const normalize = (apiResult, motorName) => {
    if (!apiResult || !apiResult.status || !apiResult.data) {
        throw new Error(`[${motorName}] Respuesta inválida`)
    }
    const data = apiResult.data
    const name = data.name || 'App Desconocida'
    const packageId = data.package || data.id || 'com.unknown'
    const size = data.size || 'N/A'
    const lastUpdated = data.lastUpdated || data.publish || 'N/A'
    const banner = data.banner || data.image || null
    const dl = data.dl || data.download
    if (!dl) throw new Error(`[${motorName}] No se pudo obtener el enlace de descarga`)
    return { name, packageId, size, lastUpdated, banner, dl, motor: motorName }
}

export default [
    {
        command: ['apk', 'apkdl', 'apkdownload', 'app'],
        description: 'Busca y descarga aplicaciones APK',
        category: 'Descargas',

        async execute({ sock, remoteJid, reply, text, m }) {
            const messageKey = m?.key || { remoteJid }
            const query = text?.trim() || ''

            if (!query) return reply('Ingresa el nombre de la aplicación\nEjemplo: .apk WhatsApp')

            let cachePath = null
            let isCacheHit = false

            try {
                try { await sock.sendMessage(remoteJid, { react: { text: '🔍', key: messageKey } }) } catch { }

                const searchTasks = [
                    fetchJson(`https://api.stellarwa.xyz/search/apk?query=${encodeURIComponent(query)}&key=api-7dSKm`).then(r => normalize(r, 'StellarWA')),
                    fetchJson(`https://api.alyacore.xyz/search/apk?query=${encodeURIComponent(query)}&key=oboe`).then(r => normalize(r, 'Alyacore')),
                    fetchJson(`https://api.delirius.store/download/apk?query=${encodeURIComponent(query)}`).then(r => normalize(r, 'Delirius'))
                ]

                const metadata = await firstSuccessful(searchTasks)
                const { name, packageId, size, lastUpdated, banner, dl, motor } = metadata

                cachePath = path.join(tmpDir, `${packageId}.apk`)

                if (fs.existsSync(cachePath)) {
                    isCacheHit = true
                } else {
                    try { await sock.sendMessage(remoteJid, { react: { text: '⬇️', key: messageKey } }) } catch { }

                    const res = await fetch(dl)
                    if (!res.ok) throw new Error('Fallo al descargar APK')

                    const buffer = Buffer.from(await res.arrayBuffer())
                    fs.writeFileSync(cachePath, buffer)
                }

                const motorLabel = isCacheHit ? `${motor} (Caché)` : motor

                const caption = `📱 *${name}*\n🔖 ${packageId}\n📏 ${size}\n🗓️ ${lastUpdated}\n⚙️ ${motorLabel}`

                if (banner) {
                    await sock.sendMessage(remoteJid, { image: { url: banner }, caption: caption }, { quoted: m })
                } else {
                    await sock.sendMessage(remoteJid, { text: caption }, { quoted: m })
                }

                try { await sock.sendMessage(remoteJid, { react: { text: '📤', key: messageKey } }) } catch { }

                const apkBuffer = fs.readFileSync(cachePath)
                await sock.sendMessage(remoteJid, {
                    document: apkBuffer,
                    mimetype: 'application/vnd.android.package-archive',
                    fileName: `${name.replace(/[<>:"/\\|?*]/g, '')}.apk`
                }, { quoted: m })

                try { await sock.sendMessage(remoteJid, { react: { text: '✅', key: messageKey } }) } catch { }

            } catch (e) {
                console.error('Error en apk:', e)
                if (cachePath && fs.existsSync(cachePath) && !isCacheHit) {
                    try { fs.unlinkSync(cachePath) } catch { }
                }
                try { await sock.sendMessage(remoteJid, { react: { text: '❌', key: messageKey } }) } catch { }
                await reply(`Error: ${e.message || 'No se pudo descargar'}`)
            }
        }
    }
]