import fs from 'fs'
import path from 'path'
import { spawn } from 'child_process'
import fetch from 'node-fetch'
import { downloadContentFromMessage } from '@fer2809fl/baileys'
import ffmpegPath from 'ffmpeg-static'

const FFMPEG_PATH = ffmpegPath || 'ffmpeg'
const tmpDir = path.resolve(process.cwd(), 'tmp')
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true })

const safeUnlink = (p) => { try { fs.existsSync(p) && fs.unlinkSync(p) } catch { } }

const removeBgAPI = async (imageBuffer) => {
    try {
        const formData = new FormData()
        const blob = new Blob([imageBuffer], { type: 'image/jpeg' })
        formData.append('image_file', blob)
        formData.append('size', 'auto')

        const res = await fetch('https://api.remove.bg/v1.0/removebg', {
            method: 'POST',
            headers: { 'X-Api-Key': 'X3XBqnqVsSK3H1vNLeNxxAPh' },
            body: formData
        })

        if (res.ok) return Buffer.from(await res.arrayBuffer())
    } catch { }

    try {
        const base64 = imageBuffer.toString('base64')
        const res = await fetch('https://api.backgrounderase.net/v1/api', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: `data:image/jpeg;base64,${base64}` })
        })

        if (res.ok) {
            const data = await res.json()
            if (data.image) return Buffer.from(data.image, 'base64')
        }
    } catch { }

    try {
        const formData = new FormData()
        const blob = new Blob([imageBuffer], { type: 'image/jpeg' })
        formData.append('file', blob)

        const res = await fetch('https://api8.backgroundcut.net/api/upload', {
            method: 'POST',
            body: formData
        })

        if (res.ok) {
            const data = await res.json()
            if (data.url) {
                const imgRes = await fetch(data.url)
                return Buffer.from(await imgRes.arrayBuffer())
            }
        }
    } catch { }

    throw new Error('No se pudo quitar el fondo con ninguna API')
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

export default [
    {
        command: ['rmbg', 'removebg', 'sinfondo', 'nobg', 'sb'],
        description: 'Quita el fondo de una imagen y la convierte en sticker',
        category: 'Stickers',

        async execute({ sock, remoteJid, reply, text, m, quoted, quotedMediaFromChat }) {
            const messageKey = m?.key || { remoteJid }
            const args = text?.trim().split(/\s+/) || []

            let mediaObj = null
            let mime = ''

            if (m?.message?.imageMessage) {
                mediaObj = m.message.imageMessage
                mime = mediaObj.mimetype || 'image/jpeg'
            }

            if (!mediaObj && quoted) {
                if (quoted.imageMessage) {
                    mediaObj = quoted.imageMessage
                    mime = mediaObj.mimetype || 'image/jpeg'
                } else if (quoted.stickerMessage) {
                    mediaObj = quoted.stickerMessage
                    mime = mediaObj.mimetype || 'image/webp'
                }
            }

            if (!mediaObj && quotedMediaFromChat) {
                mediaObj = quotedMediaFromChat.media
                mime = quotedMediaFromChat.mime
            }

            if (!mediaObj) {
                return reply('Responde a una imagen con .rmbg para quitar el fondo')
            }

            if (/video/.test(mime)) {
                return reply('Solo funciona con imágenes, no videos')
            }

            const metaText = args.join(' ').trim()
            const [packRaw, authorRaw] = metaText.split(/[•|]/).map(p => p?.trim())
            const pack = packRaw || '✦ Asta Bot ✦'
            const author = authorRaw !== undefined ? authorRaw : 'Sin Fondo'

            const tmpFiles = []
            const addTmp = (p) => p && tmpFiles.push(p)
            const clean = () => tmpFiles.forEach(safeUnlink)

            try {
                try { await sock.sendMessage(remoteJid, { react: { text: '🕒', key: messageKey } }) } catch { }

                const stream = await downloadContentFromMessage(mediaObj, 'image')
                const chunks = []
                for await (const c of stream) chunks.push(c)
                const imageBuf = Buffer.concat(chunks)

                const inputPath = path.join(tmpDir, `rmbg-in-${Date.now()}.jpg`)
                addTmp(inputPath)
                fs.writeFileSync(inputPath, imageBuf)

                let stickerBuf

                try {
                    const noBgBuf = await removeBgAPI(imageBuf)

                    const noBgPath = path.join(tmpDir, `rmbg-nobg-${Date.now()}.png`)
                    addTmp(noBgPath)
                    fs.writeFileSync(noBgPath, noBgBuf)

                    const outputPath = path.join(tmpDir, `rmbg-out-${Date.now()}.webp`)
                    addTmp(outputPath)
                    await imageToSticker(noBgPath, outputPath)
                    stickerBuf = fs.readFileSync(outputPath)

                } catch (apiError) {
                    const outputPath = path.join(tmpDir, `rmbg-out-${Date.now()}.webp`)
                    addTmp(outputPath)
                    await imageToSticker(inputPath, outputPath)
                    stickerBuf = fs.readFileSync(outputPath)
                }

                await sock.sendMessage(remoteJid, {
                    sticker: stickerBuf,
                    packname: pack,
                    author: author
                })

                try { await sock.sendMessage(remoteJid, { react: { text: '✅', key: messageKey } }) } catch { }

            } catch (e) {
                console.error('Error en rmbg:', e)
                try { await sock.sendMessage(remoteJid, { react: { text: '❌', key: messageKey } }) } catch { }
                await reply(`Error: ${e.message}`)
            } finally {
                clean()
            }
        }
    }
]