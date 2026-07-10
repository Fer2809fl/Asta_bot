// src/commands/Stickers/brat.js
import fs from 'fs'
import path from 'path'
import ffmpeg from 'fluent-ffmpeg'
import ffmpegStatic from 'ffmpeg-static'

ffmpeg.setFfmpegPath(ffmpegStatic)

const tmpDir = path.resolve(process.cwd(), 'tmp')
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true })

const safeUnlink = (p) => { try { fs.existsSync(p) && fs.unlinkSync(p) } catch { } }

const fetchBuffer = async (url, timeout = 30000) => {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeout)
    try {
        const res = await fetch(url, { signal: controller.signal })
        clearTimeout(timer)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return Buffer.from(await res.arrayBuffer())
    } catch (err) {
        clearTimeout(timer)
        throw err
    }
}

const convertToWebp = (input, output) => new Promise((resolve, reject) => {
    ffmpeg(input)
        .outputOptions([
            '-vf', 'scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=0x00000000,format=rgba',
            '-c:v', 'libwebp',
            '-preset', 'picture',
            '-compression_level', '6',
            '-q:v', '70'
        ])
        .toFormat('webp')
        .on('end', () => resolve(output))
        .on('error', (err) => reject(err))
        .save(output)
})

export default [
    {
        command: ['brat'],
        description: 'Crea sticker brat con texto',
        category: 'Stickers',

        async execute({ sock, remoteJid, reply, text }) {
            const prompt = text?.trim()
            if (!prompt) return reply('⚠️ *Falta texto*\n\n> Ejemplo: .brat Hola Mundo')

            const tmpFiles = []
            const clean = () => tmpFiles.forEach(safeUnlink)

            try {
                await sock.sendMessage(remoteJid, { react: { text: '🕒', key: { remoteJid } } })

                const buffer = await fetchBuffer(`https://skyzxu-brat.hf.space/brat?text=${encodeURIComponent(prompt)}`)

                const tmpPng = path.join(tmpDir, `brat-${Date.now()}.png`)
                tmpFiles.push(tmpPng)
                fs.writeFileSync(tmpPng, buffer)

                const webpPath = path.join(tmpDir, `brat-${Date.now()}.webp`)
                tmpFiles.push(webpPath)
                await convertToWebp(tmpPng, webpPath)
                safeUnlink(tmpPng)

                await sock.sendMessage(remoteJid, { sticker: fs.readFileSync(webpPath) })
                await sock.sendMessage(remoteJid, { react: { text: '✅', key: { remoteJid } } })

            } catch (e) {
                await sock.sendMessage(remoteJid, { react: { text: '❌', key: { remoteJid } } })
                return reply(`❌ *Error:* ${e.message || e}`)
            } finally {
                clean()
            }
        }
    }
]