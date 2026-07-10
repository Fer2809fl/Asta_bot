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
const isUrl = (t) => /https?:\/\/\S+/i.test(t)

const getExtFromMime = (mime) => {
    if (/webp/i.test(mime)) return 'webp'
    if (/png/i.test(mime)) return 'png'
    if (/gif/i.test(mime)) return 'gif'
    if (/jpe?g/i.test(mime)) return 'jpg'
    if (/mp4|webm|mov|avi|mkv/i.test(mime)) return 'mp4'
    return 'bin'
}

const isAnimatedWebp = (buf) =>
    Buffer.isBuffer(buf) && buf.length >= 32 &&
    (buf.indexOf(Buffer.from('ANIM')) !== -1 || buf.indexOf(Buffer.from('ANMF')) !== -1)

const isValidImage = (buf) => {
    if (!Buffer.isBuffer(buf) || buf.length < 4) return false
    if (buf[0] === 0xFF && buf[1] === 0xD8) return true
    if (buf[0] === 0x89 && buf[1] === 0x50) return true
    if (buf[0] === 0x47 && buf[1] === 0x49) return true
    if (buf[0] === 0x52 && buf[1] === 0x49) return true
    return false
}

const runFFmpeg = (inputPath, outputPath, videoFilter) => new Promise((resolve, reject) => {
    const args = [
        '-y', '-i', inputPath,
        '-vf', videoFilter || 'scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=0x00000000,format=yuva420p',
        '-an', '-fps_mode', 'passthrough',
        '-c:v', 'libwebp_anim', '-preset', 'picture',
        '-compression_level', '6', '-q:v', '70', '-loop', '0', outputPath
    ]
    const proc = spawn(FFMPEG_PATH, args, { stdio: ['ignore', 'pipe', 'pipe'] })
    let err = ''
    proc.stderr.on('data', d => err += d.toString())
    proc.on('close', code => code === 0 ? resolve(outputPath) : reject(new Error(err.slice(-300))))
    proc.on('error', (err) => reject(new Error(`Error con ffmpeg: ${err.message}`)))
})

const buildFilters = (effects) => {
    const W = 512, H = 512
    const f = []
    const shape = effects.find(e => e.type === 'shape')?.value
    const fx = effects.filter(e => e.type === 'effect').map(e => e.value)

    if (shape === 'cover') {
        f.push(`scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H}`)
    } else {
        f.push(`scale=${W}:${H}:force_original_aspect_ratio=decrease`)
        f.push(`pad=${W}:${H}:(ow-iw)/2:(oh-ih)/2:color=0x00000000`)
    }
    f.push('format=rgba')

    for (const e of fx) {
        switch (e) {
            case 'blur': f.push('gblur=sigma=5'); break
            case 'sepia': f.push('colorchannelmixer=.393:.769:.189:0:.349:.686:.168:0:.272:.534:.131'); break
            case 'sharpen': f.push('unsharp=5:5:1.0:5:5:0.0'); break
            case 'brighten': f.push('eq=brightness=0.05'); break
            case 'darken': f.push('eq=brightness=-0.05'); break
            case 'invert': case 'negate': f.push('negate'); break
            case 'grayscale': f.push('hue=s=0'); break
            case 'rotate90': f.push('transpose=1'); break
            case 'rotate180': f.push('rotate=PI'); break
            case 'flip': f.push('hflip'); break
            case 'flop': f.push('vflip'); break
            case 'tint': f.push('colorchannelmixer=1:0:0:0:0:0.5:0:0:0:0:0.5'); break
        }
    }

    if (shape === 'mirror') f.push('hflip')
    if (shape === 'border') f.push(`drawbox=x=0:y=0:w=${W}:h=${H}:color=white@0.9:t=10`)
    if (shape === 'frame') f.push(`drawbox=x=15:y=15:w=${W - 30}:h=${H - 30}:color=white@0.7:t=8`)

    if (shape && !['cover', 'contain', 'mirror', 'border', 'frame'].includes(shape)) {
        const cx = W / 2, cy = H / 2, r = Math.min(W, H) / 2
        let a = ''
        switch (shape) {
            case 'circle': a = `if(lte((X-${cx})*(X-${cx})+(Y-${cy})*(Y-${cy}),${r * r}),255,0)`; break
            case 'triangle': a = `if(gte(Y,${H * .1})*lte(Y,${H * .9})*lte(abs(X-${cx}),((${H * .9}-Y)*0.6)),255,0)`; break
            case 'star': a = `if(lte(hypot(X-${cx},Y-${cy}),${W * .25}+${W * .1}*cos(5*atan2(Y-${cy},X-${cx}))),255,0)`; break
            case 'roundrect': a = `if(lte(pow(max(25-X,0,X-${W - 25},25-Y,0,Y-${H - 25}),2)+pow(max(50-hypot(X-25,Y-25),50-hypot(X-${W - 25},Y-25),50-hypot(X-25,Y-${H - 25}),50-hypot(X-${W - 25},Y-${H - 25})),2),0),255,0)`; break
            case 'hexagon': a = `if(lte(hypot(X-${cx},Y-${cy}),${W * .4}*cos(PI/6)/cos(mod(atan2(Y-${cy},X-${cx}),PI/3)-PI/6)),255,0)`; break
            case 'diamond': a = `if(lte(abs(X-${cx})+abs(Y-${cy}),${r}),255,0)`; break
            case 'wave': a = `if(lte(abs(Y-(${cy}+${H * .05}*sin(X*0.05))),${H * .4}),255,0)`; break
            case 'octagon': a = `if(lte(hypot(X-${cx},Y-${cy}),${W * .4}*cos(PI/8)/cos(mod(atan2(Y-${cy},X-${cx}),PI/4)-PI/8)),255,0)`; break
            case 'pentagon': a = `if(lte(hypot(X-${cx},Y-${cy}),${W * .4}*cos(PI/5)/cos(mod(atan2(Y-${cy},X-${cx}),2*PI/5)-PI/5)),255,0)`; break
            case 'ellipse': a = `if(lte(((X-${cx})*(X-${cx}))/(${(W * .45) ** 2})+((Y-${cy})*(Y-${cy}))/(${(H * .4) ** 2}),1),255,0)`; break
            case 'cross': a = `if(gt((abs(X-${cx})<<=${W * .15})*(abs(Y-${cy})<<=${H * .45})+(abs(Y-${cy})<<=${H * .15})*(abs(X-${cx})<<=${W * .45}),0),255,0)`; break
            case 'heart': a = `if(lte(pow((X-${cx})/(${W * .3})*(X-${cx})/(${W * .3})+(Y-${cy})/(${H * .3})*(Y-${cy})/(${H * .3})-1,3)-((X-${cx})/(${W * .3})*(X-${cx})/(${W * .3}))*pow((Y-${cy})/(${H * .3}),3),0),255,0)`; break
        }
        if (a) f.push(`geq=r='r(X,Y)':g='g(X,Y)':b='b(X,Y)':a='${a}'`)
    }
    f.push('format=yuva420p')
    return f.join(',')
}

// ═══════════════════════════════════════════════════════════════
// CONFIGURACIÓN POR DEFECTO DEL STICKER
// ═══════════════════════════════════════════════════════════════

const DEFAULT_STICKER_CONFIG = {
    packname: '✦ Asta Bot ✦',
    author: 'Creado por Asta',
    bio: 'Sticker creado con Asta Bot | +524183357841'
}

export default [
    {
        command: ['sticker', 's', 'stiker'],
        description: 'Crea stickers con efectos',
        category: 'Stickers',

        async execute({ sock, remoteJid, reply, text, m, quoted, quotedMediaFromChat }) {
            const messageKey = m?.key || { remoteJid }
            const args = text?.trim().split(/\s+/) || []

            if (args[0] === '-list') {
                return reply([
                    'ꕥ *Lista de Formas y Efectos:*\n',
                    '✦ *Formas:*',
                    '-c circular | -t triangular | -s estrella | -r esquinas redondeadas',
                    '-h hexagonal | -d diamante | -f marco | -b borde',
                    '-w onda | -m espejo | -o octogonal | -y pentagonal',
                    '-e elíptico | -z cruz | -v corazón | -x cover | -i contain\n',
                    '✧ *Efectos:*',
                    '-blur | -sepia | -sharpen | -brighten | -darken | -invert',
                    '-grayscale | -rotate90 | -rotate180 | -flip | -flop | -negate | -tint\n',
                    '📌 *Modos de uso:*',
                    '• Responde a una imagen/video con .s',
                    '• Menciona "imagen", "video", "sticker", "foto"',
                    '• Envía .s + URL',
                    '• Envía imagen con caption .s\n',
                    '📝 *Personalizar:*',
                    '• .s Pack | Autor',
                    '• .s -c -blur Mi Pack | Mi Autor'
                ].join('\n'))
            }

            let mediaObj = null
            let mime = ''

            if (m?.message?.imageMessage) {
                mediaObj = m.message.imageMessage
                mime = mediaObj.mimetype || 'image/jpeg'
            } else if (m?.message?.videoMessage) {
                mediaObj = m.message.videoMessage
                mime = mediaObj.mimetype || 'video/mp4'
            } else if (m?.message?.stickerMessage) {
                mediaObj = m.message.stickerMessage
                mime = mediaObj.mimetype || 'image/webp'
            }

            if (!mediaObj && quoted) {
                if (quoted.imageMessage) {
                    mediaObj = quoted.imageMessage
                    mime = mediaObj.mimetype || 'image/jpeg'
                } else if (quoted.videoMessage) {
                    mediaObj = quoted.videoMessage
                    mime = mediaObj.mimetype || 'video/mp4'
                } else if (quoted.stickerMessage) {
                    mediaObj = quoted.stickerMessage
                    mime = mediaObj.mimetype || 'image/webp'
                }
            }

            if (!mediaObj && quotedMediaFromChat) {
                mediaObj = quotedMediaFromChat.media
                mime = quotedMediaFromChat.mime
            }

            const urlArg = args.find(isUrl)

            if (!mediaObj && !urlArg) {
                return reply([
                    '⚠️ *No encontré ninguna imagen o video*',
                    '',
                    '📌 *Para usar el comando sticker:*',
                    '• Responde a una imagen/video/sticker con .s',
                    '• Menciona: "imagen", "video", "sticker", "foto"',
                    '  Ejemplo: .s usa la ultima foto',
                    '• URL: .s https://ejemplo.com/imagen.jpg',
                    '• Envía imagen con caption .s',
                    '',
                    '📝 *Personalizar:*',
                    '• .s Pack | Autor',
                    '',
                    '💡 Usa *.s -list* para ver los efectos'
                ].join('\n'))
            }

            const shapeMap = {
                '-c': 'circle', '-t': 'triangle', '-s': 'star', '-r': 'roundrect',
                '-h': 'hexagon', '-d': 'diamond', '-f': 'frame', '-b': 'border',
                '-w': 'wave', '-m': 'mirror', '-o': 'octagon', '-y': 'pentagon',
                '-e': 'ellipse', '-z': 'cross', '-v': 'heart', '-x': 'cover', '-i': 'contain',
            }
            const effectMap = {
                '-blur': 'blur', '-sepia': 'sepia', '-sharpen': 'sharpen',
                '-brighten': 'brighten', '-darken': 'darken', '-invert': 'invert',
                '-grayscale': 'grayscale', '-rotate90': 'rotate90', '-rotate180': 'rotate180',
                '-flip': 'flip', '-flop': 'flop', '-negate': 'negate', '-tint': 'tint',
            }

            const textArgs = args.filter(a => !isUrl(a) && !shapeMap[a] && !effectMap[a])
            const metaText = textArgs.join(' ').trim()

            const [packRaw, authorRaw] = metaText.split(/[•|]/).map(p => p?.trim())

            const pack = packRaw || DEFAULT_STICKER_CONFIG.packname
            const author = authorRaw !== undefined ? authorRaw : DEFAULT_STICKER_CONFIG.author

            const effects = []
            for (const a of args) {
                if (shapeMap[a]) effects.push({ type: 'shape', value: shapeMap[a] })
                else if (effectMap[a]) effects.push({ type: 'effect', value: effectMap[a] })
            }

            const tmpFiles = []
            const addTmp = (p) => p && tmpFiles.push(p)
            const clean = () => tmpFiles.forEach(safeUnlink)

            try {
                // Solo reacción, sin mensajes
                try { await sock.sendMessage(remoteJid, { react: { text: '🕒', key: messageKey } }) } catch { }

                let inputPath, isWebp = false

                if (mediaObj) {
                    const type = /video/.test(mime) ? 'video' : /webp/.test(mime) ? 'sticker' : 'image'

                    if (/video/.test(mime) && (mediaObj.seconds || 0) > 20) {
                        await reply('⚠️ El video no puede exceder los 20 segundos.')
                        return clean()
                    }

                    const stream = await downloadContentFromMessage(mediaObj, type)
                    const chunks = []
                    for await (const c of stream) chunks.push(c)
                    const buf = Buffer.concat(chunks)

                    isWebp = /webp/.test(mime)
                    const ext = isWebp ? 'webp' : getExtFromMime(mime)
                    inputPath = path.join(tmpDir, `sticker-in-${Date.now()}.${ext}`)
                    addTmp(inputPath)
                    fs.writeFileSync(inputPath, buf)

                    // Si es webp animado sin efectos, enviar directo
                    if (isWebp && isAnimatedWebp(buf) && effects.length === 0) {
                        await sock.sendMessage(remoteJid, {
                            sticker: buf,
                            packname: pack,
                            author: author
                        })
                        try { await sock.sendMessage(remoteJid, { react: { text: '✅', key: messageKey } }) } catch { }
                        return clean()
                    }
                } else if (urlArg) {
                    // Descarga silenciosa
                    const res = await fetch(urlArg, {
                        signal: AbortSignal.timeout(30000),
                        redirect: 'follow',
                        headers: { 'User-Agent': 'Mozilla/5.0' }
                    })
                    if (!res.ok) throw new Error(`Error al descargar: ${res.status}`)
                    const buf = Buffer.from(await res.arrayBuffer())

                    if (!isValidImage(buf)) throw new Error('El archivo no es una imagen válida')

                    let ext = 'jpg'
                    if (buf[0] === 0x89 && buf[1] === 0x50) ext = 'png'
                    else if (buf[0] === 0x47 && buf[1] === 0x49) ext = 'gif'
                    else if (buf[0] === 0x52 && buf[1] === 0x49) ext = 'webp'

                    isWebp = ext === 'webp'
                    inputPath = path.join(tmpDir, `sticker-url-${Date.now()}.${ext}`)
                    addTmp(inputPath)
                    fs.writeFileSync(inputPath, buf)
                }

                // Crear sticker
                const outputPath = path.join(tmpDir, `sticker-out-${Date.now()}.webp`)
                addTmp(outputPath)

                const vf = buildFilters(effects)
                await runFFmpeg(inputPath, outputPath, vf)

                // Enviar SOLO el sticker
                await sock.sendMessage(remoteJid, {
                    sticker: fs.readFileSync(outputPath),
                    packname: pack,
                    author: author
                })

                // Reacción de éxito
                try { await sock.sendMessage(remoteJid, { react: { text: '✅', key: messageKey } }) } catch { }

            } catch (e) {
                console.error('Error:', e)
                try { await sock.sendMessage(remoteJid, { react: { text: '❌', key: messageKey } }) } catch { }
                await reply(`❌ Error: ${e.message || 'Error desconocido'}`)
            } finally {
                clean()
            }
        }
    }
]