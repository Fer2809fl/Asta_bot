import axios from 'axios'
import fs from 'fs'
import path from 'path'

const tmpDir = path.resolve(process.cwd(), 'tmp')
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true })

const isUrl = (text) => /^https?:\/\//i.test(text)
const isSpotifyUrl = (text) => /(?:https?:\/\/)?(?:open\.)?spotify\.com\/(?:track|album|playlist|episode)\//i.test(text)

const downloadSpotify = async (url) => {
    const apis = [
        {
            url: `https://api.delirius.store/download/spotify?url=${encodeURIComponent(url)}`,
            extract: (data) => ({
                title: data.data?.title || data.title,
                artist: data.data?.artist || data.artist,
                album: data.data?.album || data.album,
                download: data.data?.download || data.data?.url || data.download,
                thumbnail: data.data?.image || data.data?.thumbnail || data.image,
                duration: data.data?.duration || data.duration
            })
        },
        {
            url: `https://api.stellarwa.xyz/dl/spotify?url=${encodeURIComponent(url)}&key=api-7dSKm`,
            extract: (data) => ({
                title: data.data?.title || data.title,
                artist: data.data?.artist || data.artist,
                album: data.data?.album || data.album,
                download: data.data?.dl || data.data?.download || data.download,
                thumbnail: data.data?.image || data.data?.thumbnail || data.image,
                duration: data.data?.duration || data.duration
            })
        },
        {
            url: `https://api.alyacore.xyz/dl/spotify?url=${encodeURIComponent(url)}&key=oboe`,
            extract: (data) => ({
                title: data.data?.title || data.title,
                artist: data.data?.artist || data.artist,
                album: data.data?.album || data.album,
                download: data.data?.dl || data.data?.download || data.download,
                thumbnail: data.data?.image || data.data?.thumbnail || data.image,
                duration: data.data?.duration || data.duration
            })
        }
    ]

    for (const api of apis) {
        try {
            const { data } = await axios.get(api.url, { timeout: 30000 })
            const result = api.extract(data)
            if (result.download) return result
        } catch { continue }
    }

    throw new Error('No se pudo descargar de Spotify')
}

const downloadToTmp = async (url, ext) => {
    const tmpPath = path.join(tmpDir, `spotify-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`)
    const res = await fetch(url)
    if (!res.ok) throw new Error('Error descargando archivo')
    const buffer = Buffer.from(await res.arrayBuffer())
    fs.writeFileSync(tmpPath, buffer)
    return tmpPath
}

export default [
    {
        command: ['spotify', 'spdl', 'spotifydl'],
        description: 'Descarga música de Spotify',
        category: 'Descargas',

        async execute({ sock, remoteJid, reply, text, m }) {
            const messageKey = m?.key || { remoteJid }
            const query = text?.trim() || ''
            let tmpFile = null

            if (!query) return reply('Ejemplo: .spotify https://open.spotify.com/track/xxx')

            if (!isSpotifyUrl(query)) return reply('Ingresa una URL válida de Spotify\nEjemplo: https://open.spotify.com/track/xxx')

            try {
                try { await sock.sendMessage(remoteJid, { react: { text: '🔍', key: messageKey } }) } catch { }

                const dl = await downloadSpotify(query)

                if (!dl.download) throw new Error('No se pudo obtener el audio')

                const infoText = `🎵 ${dl.title || 'Spotify'}\n🎤 ${dl.artist || 'Desconocido'}\n💿 ${dl.album || 'Single'}\n⏱️ ${dl.duration || 'N/A'}`

                if (dl.thumbnail) {
                    try {
                        await sock.sendMessage(remoteJid, { image: { url: dl.thumbnail }, caption: infoText }, { quoted: m })
                    } catch {
                        await sock.sendMessage(remoteJid, { text: infoText }, { quoted: m })
                    }
                } else {
                    await sock.sendMessage(remoteJid, { text: infoText }, { quoted: m })
                }

                try { await sock.sendMessage(remoteJid, { react: { text: '⏳', key: messageKey } }) } catch { }

                tmpFile = await downloadToTmp(dl.download, 'mp3')

                await sock.sendMessage(remoteJid, {
                    audio: fs.readFileSync(tmpFile),
                    mimetype: 'audio/mpeg',
                    ptt: false,
                    fileName: `${(dl.title || 'spotify').replace(/[\\/:*?"<>|]/g, '')} - ${(dl.artist || 'artist').replace(/[\\/:*?"<>|]/g, '')}.mp3`
                }, { quoted: m })

                try { await sock.sendMessage(remoteJid, { react: { text: '✅', key: messageKey } }) } catch { }

            } catch (e) {
                console.error('Error en spotify:', e)
                try { await sock.sendMessage(remoteJid, { react: { text: '❌', key: messageKey } }) } catch { }
                await reply(`Error: ${e.message || 'No se pudo descargar'}`)
            } finally {
                if (tmpFile && fs.existsSync(tmpFile)) {
                    try { fs.unlinkSync(tmpFile) } catch { }
                }
            }
        }
    }
]