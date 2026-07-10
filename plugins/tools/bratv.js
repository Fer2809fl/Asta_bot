// src/commands/Stickers/bratv.js
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

const convertToAnimatedWebp = (input, output) => new Promise((resolve, reject) => {
    ffmpeg(input)
        .outputOptions([
            '-vf', 'scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=0x00000000,format=rgba,format=yuva420p',
            '-c:v', 'libwebp_anim',
            '-preset', 'picture',
            '-compression_level', '6',
            '-q:v', '70',
            '-loop', '0'
        ])
        .toFormat('webp')
        .on('end', () => resolve(output))
        .on('error', (err) => reject(err))
        .save(output)
})

export default [
    {
        command: ['bratv'],
        description: 'Crea sticker brat animado',
        category: 'Stickers',

        async execute({ sock, remoteJid, reply, text }) {
            const prompt = text?.trim()
            if (!prompt) return reply('⚠️ *Falta texto*\n\n> Ejemplo: .bratv Hola Mundo')

            const tmpFiles = []
            const clean = () => tmpFiles.forEach(safeUnlink)

            try {
                await sock.sendMessage(remoteJid, { react: { text: '🕒', key: { remoteJid } } })

                const buffer = await fetchBuffer(`https://skyzxu-brat.hf.space/brat-animated?text=${encodeURIComponent(prompt)}`)

                const tmpMp4 = path.join(tmpDir, `bratv-${Date.now()}.mp4`)
                tmpFiles.push(tmpMp4)
                fs.writeFileSync(tmpMp4, buffer)

                const webpPath = path.join(tmpDir, `bratv-${Date.now()}.webp`)
                tmpFiles.push(webpPath)
                await convertToAnimatedWebp(tmpMp4, webpPath)
                safeUnlink(tmpMp4)

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