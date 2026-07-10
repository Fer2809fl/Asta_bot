import axios from 'axios'

const FDL_API = 'https://fdown.isuru.eu.org/download'
const VKR_API = 'https://vkrdownloader.vercel.app/download'
const COBALT_API = 'https://api.cobalt.tools/'

const fbRegex = /(?:https?:\/\/)?(?:www\.|m\.|web\.)?(?:facebook\.com|fb\.watch|fb\.me)\//i

const descargarConFDL = async (url) => {
    const { data } = await axios.post(FDL_API,
        { url, quality: 'best' },
        {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 60000
        }
    )

    if (data.status === 'error') throw new Error(data.message || 'FDL error')
    if (!data.download_url) throw new Error('Sin URL de descarga en FDL')

    return {
        downloadUrl: data.download_url,
        title: data.video_info?.title || 'Facebook Video',
        creator: data.video_info?.uploader || 'Facebook'
    }
}

const descargarConVKR = async (url) => {
    const { data } = await axios.get(VKR_API, {
        params: { url },
        headers: {
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 60000
    })

    const dlUrl = data.download_url || data.url || data.video || data.link
    if (!dlUrl) throw new Error('Sin URL de descarga en VKrDownloader')

    return {
        downloadUrl: dlUrl,
        title: data.title || 'Facebook Video',
        creator: data.author || data.uploader || 'Facebook'
    }
}

const descargarConCobalt = async (url) => {
    const { data } = await axios.post(COBALT_API, { url }, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 30000
    })
    if (data.status === 'error') throw new Error(data.error?.code || 'Cobalt error')
    if (data.url || data.tunnel) return {
        downloadUrl: data.url || data.tunnel,
        title: 'Facebook Video',
        creator: 'Facebook'
    }
    throw new Error('Sin URL en respuesta de cobalt')
}

export default [
    {
        command: ['facebook', 'fb', 'fbdl'],
        description: 'Descarga videos de Facebook',
        category: 'Descargas',

        async execute({ sock, remoteJid, reply, text, m }) {
            const messageKey = m?.key || { remoteJid }
            const url = text?.trim() || ''

            if (!url) return reply('Ingresa la URL de Facebook\nEjemplo: .fb https://www.facebook.com/reel/997680349278130/')

            if (!fbRegex.test(url)) return reply('URL de Facebook no válida')

            try { await sock.sendMessage(remoteJid, { react: { text: '⏳', key: messageKey } }) } catch { }

            let result = null
            const errors = []

            try {
                result = await descargarConFDL(url)
            } catch (e1) {
                errors.push(`FDL: ${e1.message}`)
                try {
                    result = await descargarConVKR(url)
                } catch (e2) {
                    errors.push(`VKR: ${e2.message}`)
                    try {
                        result = await descargarConCobalt(url)
                    } catch (e3) {
                        errors.push(`Cobalt: ${e3.message}`)
                    }
                }
            }

            if (!result) {
                try { await sock.sendMessage(remoteJid, { react: { text: '❌', key: messageKey } }) } catch { }
                return reply(`No se pudo descargar el video\nAsegúrate que sea público y la URL válida`)
            }

            try {
                await sock.sendMessage(remoteJid, {
                    video: { url: result.downloadUrl },
                    caption: `📘 Facebook\n📝 ${result.title}\n👤 ${result.creator}`
                }, { quoted: m })
                try { await sock.sendMessage(remoteJid, { react: { text: '✅', key: messageKey } }) } catch { }
            } catch (sendErr) {
                try { await sock.sendMessage(remoteJid, { react: { text: '❌', key: messageKey } }) } catch { }
                await reply(`Error enviando el video: ${sendErr.message}`)
            }
        }
    }
]