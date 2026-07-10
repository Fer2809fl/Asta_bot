import axios from 'axios'
import yts from 'yt-search'
import fs from 'fs'
import path from 'path'
import NodeCache from 'node-cache'
import { ytmp3 as vredenYtmp3, ytmp4 as vredenYtmp4 } from '@vreden/youtube_scraper'
import { youtube as btchYoutube } from 'btch-downloader'
import pkg from '@fer2809fl/baileys'
const { proto, generateWAMessageFromContent, prepareWAMessageMedia, WA_DEFAULT_EPHEMERAL } = pkg
const tmpDir = path.resolve(process.cwd(), 'tmp')
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true })

async function getImageBuffer(source) {
    try {
        if (!source) return null
        if (source.startsWith?.('http')) {
            const res = await fetch(source)
            if (!res.ok) return null
            return Buffer.from(await res.arrayBuffer())
        }
    } catch { }
    return null
}

async function sendInteractive(sock, msg, remoteJid, interactiveMessage) {
    const messageContent = proto.Message.fromObject({
        viewOnceMessage: {
            message: {
                messageContextInfo: {
                    deviceListMetadata: {},
                    deviceListMetadataVersion: 2
                },
                interactiveMessage
            }
        }
    })

    const built = await generateWAMessageFromContent(remoteJid, messageContent, {
        userJid: sock.user?.jid,
        quoted: msg,
        ephemeralExpiration: WA_DEFAULT_EPHEMERAL
    })

    await sock.relayMessage(remoteJid, built.message, { messageId: built.key.id })
}

async function sendResultButtons(sock, m, remoteJid, result, wm) {
    const caption = `\`🎵 RESULTADO ENCONTRADO\`

\`📺 TÍTULO ›\` ${result.title}
\`👤 CANAL ›\` ${result.author?.name || 'Unknown'}
\`⏱️ DURACIÓN ›\` ${result.timestamp || 'N/A'}
\`👁️ VISTAS ›\` ${result.views?.toLocaleString() || 'N/A'}

> _Elige una opción para descargar:_`

    const thumbBuffer = await getImageBuffer(result.thumbnail)
    let header = { title: '🎬 YouTube', hasMediaAttachment: false }

    if (thumbBuffer) {
        try {
            const media = await prepareWAMessageMedia(
                { image: thumbBuffer },
                { upload: sock.waUploadToServer }
            )
            header = { title: '🎬 YouTube', hasMediaAttachment: true, imageMessage: media.imageMessage }
        } catch {
            header = { title: '🎬 YouTube', hasMediaAttachment: false }
        }
    }

    try {
        await sendInteractive(sock, m, remoteJid, {
            body: { text: caption },
            footer: { text: wm || 'Asta-Bot' },
            header,
            nativeFlowMessage: {
                buttons: [
                    {
                        name: 'cta_url',
                        buttonParamsJson: JSON.stringify({
                            display_text: '🔗 Ver en YouTube',
                            url: result.url,
                            merchant_url: result.url
                        })
                    },
                    {
                        name: 'quick_reply',
                        buttonParamsJson: JSON.stringify({ display_text: '🎧 Audio', id: 'play1' })
                    },
                    {
                        name: 'quick_reply',
                        buttonParamsJson: JSON.stringify({ display_text: '🎬 Video', id: 'play2' })
                    },
                    {
                        name: 'quick_reply',
                        buttonParamsJson: JSON.stringify({ display_text: '📁 Audio Doc', id: 'play3' })
                    },
                    {
                        name: 'quick_reply',
                        buttonParamsJson: JSON.stringify({ display_text: '📁 Video Doc', id: 'play4' })
                    }
                ],
                messageParamsJson: ''
            }
        })
    } catch (err) {
        console.error('[Play] Error al enviar botones, usando envío normal:', err.message)
        if (thumbBuffer) {
            await sock.sendMessage(remoteJid, { image: thumbBuffer, caption }, { quoted: m })
        } else {
            await sock.sendMessage(remoteJid, { text: caption }, { quoted: m })
        }
    }
}
const AUDIO_APIS = [
    { name: 'Vreden', fetch: async (videoUrl) => { const d = await vredenYtmp3(videoUrl); return d?.status && d?.download?.url ? d.download.url : null } },
    { name: 'Btch', fetch: async (videoUrl) => { const d = await btchYoutube(videoUrl); return d?.status && d?.mp3 ? d.mp3 : null } }
]
const VIDEO_APIS = [
    { name: 'Vreden', fetch: async (videoUrl) => { const d = await vredenYtmp4(videoUrl); return d?.status && d?.download?.url ? d.download.url : null } },
    { name: 'Btch', fetch: async (videoUrl) => { const d = await btchYoutube(videoUrl); return d?.status && d?.mp4 ? d.mp4 : null } }
]
const userCache = new NodeCache({ stdTTL: 86400, checkperiod: 3600 })
const searchYouTube = async (query) => {
    const search = await yts(query)
    return search.videos.length > 0 ? search.videos[0] : null
}
const downloadToTmp = async (url, ext) => {
    const tmpPath = path.join(tmpDir, `yt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`)
    const { data: stream } = await axios.get(url, { responseType: 'stream', timeout: 120000 })
    const writer = fs.createWriteStream(tmpPath)
    stream.pipe(writer)
    await new Promise((resolve, reject) => {
        writer.on('finish', resolve)
        writer.on('error', reject)
    })
    return tmpPath
}
const tryDownloadApis = async (videoUrl, apis) => {
    for (const api of apis) {
        try {
            const downloadUrl = await api.fetch(videoUrl)
            if (downloadUrl) return { downloadUrl, apiName: api.name }
        } catch { continue }
    }
    throw new Error('Todos los servidores de descarga están caídos')
}
const formatMap = {
    'play': { type: 'audio', doc: false, ext: 'mp3', infoOnly: true },
    'play1': { type: 'audio', doc: false, ext: 'mp3' },
    'play2': { type: 'video', doc: false, ext: 'mp4' },
    'play3': { type: 'audio', doc: true, ext: 'mp3' },
    'play4': { type: 'video', doc: true, ext: 'mp4' },
    'ytmp3': { type: 'audio', doc: false, ext: 'mp3' },
    'mp3': { type: 'audio', doc: false, ext: 'mp3' },
    'ytaudio': { type: 'audio', doc: false, ext: 'mp3' },
    'ytmp4': { type: 'video', doc: false, ext: 'mp4' },
    'mp4': { type: 'video', doc: false, ext: 'mp4' },
    'ytvideo': { type: 'video', doc: false, ext: 'mp4' },
    'playdoc': { type: 'audio', doc: true, ext: 'mp3' },
    'mp3doc': { type: 'audio', doc: true, ext: 'mp3' },
    'playvideodoc': { type: 'video', doc: true, ext: 'mp4' },
    'mp4doc': { type: 'video', doc: true, ext: 'mp4' }
}
const extractUrl = (text) => {
    if (!text) return null
    const match = text.match(/https?:\/\/(?:www\.)?(?:youtube\.com|youtu\.be)\/[^\s]+/)
    return match ? match[0] : null
}
const extractQuery = (text) => {
    if (!text) return ''
    return text.replace(/https?:\/\/(?:www\.)?(?:youtube\.com|youtu\.be)\/[^\s]+/g, '').trim()
}
const sanitizeFilename = (name = 'video') => {
    return name.replace(/[\\/:*?"<>|]+/g, '').trim().slice(0, 100)
}
export default [
    {
        command: ['play', 'play1', 'play2', 'play3', 'play4', 'ytmp3', 'mp3', 'ytaudio', 'ytmp4', 'mp4', 'ytvideo', 'playdoc', 'mp3doc', 'playvideodoc', 'mp4doc'],
        description: 'Descarga música y videos de YouTube',
        category: 'Descargas',
        async execute({ sock, remoteJid, reply, text, command, m }) {
            const messageKey = m?.key || { remoteJid }
            const config = formatMap[command] || formatMap['play']
            const rawText = (text || '').trim()
            const urlEnTexto = extractUrl(rawText)
            const queryLimpia = extractQuery(rawText)
            let tmpFile = null
            try {
                if (config.infoOnly || command === 'play') {
                    if (!queryLimpia && !urlEnTexto) {
                        return reply(`Ejemplo: .play Bad Bunny\n.play https://youtu.be/xxx`)
                    }
                    try { await sock.sendMessage(remoteJid, { react: { text: '🔍', key: messageKey } }) } catch { }
                    let result
                    if (urlEnTexto) {
                        try {
                            const videoId = urlEnTexto.split('v=')[1]?.split('&')[0] || urlEnTexto.split('/').pop()
                            const search = await yts({ videoId })
                            result = search.videos?.[0] || null
                        } catch {
                            result = null
                        }
                    } else {
                        result = await searchYouTube(queryLimpia)
                    }
                    if (!result) {
                        try { await sock.sendMessage(remoteJid, { react: { text: '❌', key: messageKey } }) } catch { }
                        return reply(`No se encontraron resultados para: "${queryLimpia || urlEnTexto}"`)
                    }
                    userCache.set(`yt_${m.sender}`, {
                        url: result.url,
                        title: result.title,
                        thumbnail: result.thumbnail,
                        author: result.author?.name || 'Unknown',
                        timestamp: result.timestamp || 'N/A',
                        views: result.views || 0,
                        seconds: result.seconds || 0
                    })
                    const wm = sock.wm || global.wm || 'Asta-Bot'
                    await sendResultButtons(sock, m, remoteJid, result, wm)
                    try { await sock.sendMessage(remoteJid, { react: { text: '✅', key: messageKey } }) } catch { }
                    return
                }
                let finalUrl = urlEnTexto
                let cachedData = null
                if (!finalUrl) {
                    cachedData = userCache.get(`yt_${m.sender}`)
                    if (cachedData?.url) finalUrl = cachedData.url
                } else {
                    cachedData = userCache.get(`yt_${m.sender}`)
                }
                if (!finalUrl && queryLimpia) {
                    try { await sock.sendMessage(remoteJid, { react: { text: '🔍', key: messageKey } }) } catch { }
                    const result = await searchYouTube(queryLimpia)
                    if (result) {
                        finalUrl = result.url
                        cachedData = {
                            url: result.url,
                            title: result.title,
                            thumbnail: result.thumbnail,
                            author: result.author?.name || 'Unknown',
                            timestamp: result.timestamp || 'N/A',
                            views: result.views || 0,
                            seconds: result.seconds || 0
                        }
                        userCache.set(`yt_${m.sender}`, cachedData)
                    }
                }
                if (!finalUrl) {
                    try { await sock.sendMessage(remoteJid, { react: { text: '❌', key: messageKey } }) } catch { }
                    return reply(`Usa .play <nombre> primero o .${command} <url>`)
                }
                const totalMinutes = (cachedData?.seconds || 0) / 60
                if (totalMinutes >= 45) {
                    try { await sock.sendMessage(remoteJid, { react: { text: '⚠️', key: messageKey } }) } catch { }
                    return reply('El video es demasiado largo (máx 45 min)')
                }
                try { await sock.sendMessage(remoteJid, { react: { text: '⏳', key: messageKey } }) } catch { }
                const apis = config.type === 'audio' ? AUDIO_APIS : VIDEO_APIS
                const { downloadUrl } = await tryDownloadApis(finalUrl, apis)
                const title = cachedData?.title || 'YouTube'
                const fileName = sanitizeFilename(title)
                tmpFile = await downloadToTmp(downloadUrl, config.ext)
                const fileBuffer = fs.readFileSync(tmpFile)
                if (config.type === 'audio') {
                    if (config.doc) {
                        await sock.sendMessage(remoteJid, {
                            document: fileBuffer,
                            mimetype: 'audio/mpeg',
                            fileName: `${fileName}.${config.ext}`
                        }, { quoted: m })
                    } else {
                        await sock.sendMessage(remoteJid, {
                            audio: fileBuffer,
                            mimetype: 'audio/mpeg',
                            ptt: false,
                            fileName: `${fileName}.${config.ext}`
                        }, { quoted: m })
                    }
                } else {
                    if (config.doc) {
                        await sock.sendMessage(remoteJid, {
                            document: fileBuffer,
                            mimetype: 'video/mp4',
                            fileName: `${fileName}.${config.ext}`
                        }, { quoted: m })
                    } else {
                        await sock.sendMessage(remoteJid, {
                            video: fileBuffer,
                            mimetype: 'video/mp4',
                            caption: `🎬 ${title}`,
                            fileName: `${fileName}.${config.ext}`
                        }, { quoted: m })
                    }
                }
                try { await sock.sendMessage(remoteJid, { react: { text: '✅', key: messageKey } }) } catch { }
            } catch (e) {
                console.error('Error en play:', e)
                try { await sock.sendMessage(remoteJid, { react: { text: '❌', key: messageKey } }) } catch { }
                let errorMsg = `Error: ${e.message || 'No se pudo descargar'}`
                if (e.code === 'ECONNABORTED') errorMsg = 'La descarga tardó demasiado'
                else if (e.message?.includes('todos los servidores')) errorMsg = 'Todos los servidores están caídos'
                await reply(errorMsg)
            } finally {
                if (tmpFile && fs.existsSync(tmpFile)) {
                    try { fs.unlinkSync(tmpFile) } catch { }
                }
            }
        }
    }
]