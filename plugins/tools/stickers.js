import { sticker, addExif } from '../../lib/sticker.js'
import axios from 'axios'
import fetch from 'node-fetch'

async function getRcanal() {
    try {
        const thumb = await (await fetch(global.icono)).buffer()
        return {
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: global.channelRD?.id || "120363399175402285@newsletter",
                serverMessageId: '',
                newsletterName: global.channelRD?.name || "『𝕬𝖘𝖙𝖆-𝕭𝖔𝖙』"
            },
            externalAdReply: {
                title: global.botname || 'ᴀsᴛᴀ-ʙᴏᴛ',
                body: global.dev || 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ ғᴇʀɴᴀɴᴅᴏ',
                mediaType: 1,
                mediaUrl: global.redes,
                sourceUrl: global.redes,
                thumbnail: thumb,
                showAdAttribution: false,
                containsAutoReply: true,
                renderLargerThumbnail: true
            }
        }
    } catch { return {} }
}

const delay = (ms) => new Promise(r => setTimeout(r, ms))

const fetchSticker = async (text, attempt = 1) => {
    try {
        const res = await axios.get(`https://skyzxu-brat.hf.space/brat`, { params: { text }, responseType: 'arraybuffer' })
        return res.data
    } catch (e) {
        if (e.response?.status === 429 && attempt <= 3) {
            await delay((e.response.headers['retry-after'] || 5) * 1000)
            return fetchSticker(text, attempt + 1)
        }
        throw e
    }
}

const fetchStickerVideo = async (text) => {
    const res = await axios.get(`https://skyzxu-brat.hf.space/brat-animated`, { params: { text }, responseType: 'arraybuffer' })
    if (!res.data) throw new Error('Error al obtener el video de la API.')
    return res.data
}

const fetchJson = (url) => fetch(url).then(r => r.json())

const handler = async (m, { conn, text, args, command, usedPrefix }) => {
    const rcanal = await getRcanal()

    const errMsg = (titulo, emoji, msg) => ({
        text: `> . ﹡ ﹟ ${emoji} ׄ ⬭ *¡ᴇʀʀᴏʀ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❌* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴇʀʀᴏʀ* :: ${msg}\nׅㅤ𓏸𓈒ㅤׄ *ʀᴇᴘᴏʀᴛ* :: \`${usedPrefix}report\`\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
        contextInfo: { ...rcanal }
    })

    try {
        let userId = m.sender
        let packstickers = global.db.data.users[userId] || {}
        let texto1 = packstickers.text1 || global.packsticker
        let texto2 = packstickers.text2 || global.packsticker2

        switch (command) {

            // ========== BRAT ==========
            case 'brat': {
                text = m.quoted?.text || text
                if (!text) return conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ 🖤 ׄ ⬭ *¡ʙʀᴀᴛ ꜱᴛɪᴄᴋᴇʀ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🖤* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴏ* :: \`#brat (texto)\`
ׅㅤ𓏸𓈒ㅤׄ *ᴇᴊᴇᴍᴘʟᴏ* :: \`#brat hola mundo\`
ׅㅤ𓏸𓈒ㅤׄ *ᴀʟᴛᴇʀɴ* :: ʀᴇꜱᴘᴏɴᴅᴇ ᴀ ᴜɴ ᴍꜱᴊ

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
                    contextInfo: { ...rcanal }
                }, { quoted: m })
                await m.react('🕒')
                const buffer = await fetchSticker(text)
                const stiker = await sticker(buffer, false, texto1, texto2)
                if (!stiker) throw new Error('ɴᴏ ꜱᴇ ᴘᴜᴅᴏ ɢᴇɴᴇʀᴀʀ ᴇʟ ꜱᴛɪᴄᴋᴇʀ')
                await conn.sendMessage(m.chat, { sticker: stiker }, { quoted: m })
                await m.react('✔️')
                break
            }

            // ========== BRATV ==========
            case 'bratv': {
                text = m.quoted?.text || text
                if (!text) return conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ 🖤 ׄ ⬭ *¡ʙʀᴀᴛ ᴀɴɪᴍᴀᴅᴏ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🖤* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴏ* :: \`#bratv (texto)\`
ׅㅤ𓏸𓈒ㅤׄ *ᴇᴊᴇᴍᴘʟᴏ* :: \`#bratv hola mundo\`
ׅㅤ𓏸𓈒ㅤׄ *ɴᴏᴛᴀ* :: ɢᴇɴᴇʀᴀ ꜱᴛɪᴄᴋᴇʀ ᴀɴɪᴍᴀᴅᴏ

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
                    contextInfo: { ...rcanal }
                }, { quoted: m })
                await m.react('🕒')
                const videoBuffer = await fetchStickerVideo(text)
                const stickerBuffer = await sticker(videoBuffer, null, texto1, texto2)
                await conn.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: m })
                await m.react('✔️')
                break
            }

            // ========== EMOJIMIX ==========
            case 'emojimix': {
                if (!args[0]) return conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ 🎨 ׄ ⬭ *¡ᴇᴍᴏᴊɪ ᴍɪx!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🎨* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴏ* :: \`#emojimix emoji1+emoji2\`
ׅㅤ𓏸𓈒ㅤׄ *ᴇᴊᴇᴍᴘʟᴏ* :: \`#emojimix 👻+👀\`
ׅㅤ𓏸𓈒ㅤׄ *ɴᴏᴛᴀ* :: ᴄᴏᴍʙɪɴᴀ 2 ᴇᴍᴏᴊɪꜱ ᴇɴ ᴜɴᴏ

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
                    contextInfo: { ...rcanal }
                }, { quoted: m })
                let [emoji1, emoji2] = text.split`+`
                await m.react('🕒')
                const res = await fetchJson(`https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(emoji1)}_${encodeURIComponent(emoji2)}`)
                if (!res.results?.length) throw new Error('ꜱɪɴ ʀᴇꜱᴜʟᴛᴀᴅᴏꜱ ᴘᴀʀᴀ ᴇꜱᴀ ᴄᴏᴍʙɪɴᴀᴄɪᴏ́ɴ')
                for (let result of res.results) {
                    let stiker = await sticker(false, result.url, texto1, texto2)
                    await conn.sendMessage(m.chat, { sticker: stiker }, { quoted: m })
                }
                await m.react('✔️')
                break
            }

            // ========== QC ==========
            case 'qc': {
                let textFinal = args.join(' ') || m.quoted?.text
                if (!textFinal) return conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ 💬 ׄ ⬭ *¡ǫᴜᴏᴛᴇ ꜱᴛɪᴄᴋᴇʀ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜💬* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴏ* :: \`#qc (texto)\`
ׅㅤ𓏸𓈒ㅤׄ *ᴇᴊᴇᴍᴘʟᴏ* :: \`#qc Este es mi mensaje\`
ׅㅤ𓏸𓈒ㅤׄ *ᴍáx* :: 30 ᴄᴀʀᴀᴄᴛᴇʀᴇꜱ

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
                    contextInfo: { ...rcanal }
                }, { quoted: m })
                let target = m.quoted ? await m.quoted.sender : m.sender
                const pp = await conn.profilePictureUrl(target).catch(() => 'https://telegra.ph/file/24fa902ead26340f3df2c.png')
                const nombre = await (async () =>
                    global.db.data.users[target]?.name ||
                    await conn.getName(target).catch(() => target.split('@')[0])
                )()
                let frase = textFinal.replace(new RegExp(`@${target.split('@')[0]}`, 'g'), '')
                if (frase.length > 30) {
                    await m.react('✖️')
                    return conn.sendMessage(m.chat, {
                        text: `> . ﹡ ﹟ 💬 ׄ ⬭ *¡ᴇʀʀᴏʀ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❌* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴇʀʀᴏʀ* :: ᴍáx. *30 ᴄᴀʀᴀᴄᴛᴇʀᴇꜱ*
ׅㅤ𓏸𓈒ㅤׄ *ᴛᴜ ᴛᴇxᴛᴏ* :: ${frase.length} ᴄᴀʀᴀᴄᴛᴇʀᴇꜱ

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
                        contextInfo: { ...rcanal }
                    }, { quoted: m })
                }
                await m.react('🕒')
                const quoteObj = {
                    type: 'quote', format: 'png', backgroundColor: '#000000',
                    width: 512, height: 768, scale: 2,
                    messages: [{ entities: [], avatar: true, from: { id: 1, name: nombre, photo: { url: pp } }, text: frase, replyMessage: {} }]
                }
                const json = await axios.post('https://bot.lyo.su/quote/generate', quoteObj, { headers: { 'Content-Type': 'application/json' } })
                const buffer = Buffer.from(json.data.result.image, 'base64')
                const stiker = await sticker(buffer, false, texto1, texto2)
                if (stiker) {
                    await conn.sendMessage(m.chat, { sticker: stiker }, { quoted: m })
                    await m.react('✔️')
                }
                break
            }

            // ========== TAKE / WM ==========
            case 'take': case 'wm': {
                if (!m.quoted) return conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ ✏️ ׄ ⬭ *¡ʀᴇɴᴏᴍʙʀᴀʀ ꜱᴛɪᴄᴋᴇʀ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜✏️* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴏ* :: ʀᴇꜱᴘᴏɴᴅᴇ ᴀ ᴜɴ ꜱᴛɪᴄᴋᴇʀ
ׅㅤ𓏸𓈒ㅤׄ *ꜱᴏʟᴏ ᴘᴀᴄᴋ* :: \`#take NuevoNombre\`
ׅㅤ𓏸𓈒ㅤׄ *ᴘᴀᴄᴋ + ᴀᴜᴛᴏʀ* :: \`#take Pack • Autor\`

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
                    contextInfo: { ...rcanal }
                }, { quoted: m })
                await m.react('🕒')
                const stickerData = await m.quoted.download()
                if (!stickerData) {
                    await m.react('✖️')
                    return conn.sendMessage(m.chat, errMsg('✏️', '✏️', 'ɴᴏ ꜱᴇ ᴘᴜᴅᴏ ᴅᴇꜱᴄᴀʀɢᴀʀ ᴇʟ ꜱᴛɪᴄᴋᴇʀ'), { quoted: m })
                }
                const parts = text.split(/[\u2022|]/).map(p => p.trim())
                const exif = await addExif(stickerData, parts[0] || texto1, parts[1] || texto2)
                await conn.sendMessage(m.chat, { sticker: exif }, { quoted: m })
                await m.react('✔️')
                break
            }
        }
    } catch (e) {
        await m.react('✖️')
        conn.sendMessage(m.chat, {
            text: `> . ﹡ ﹟ 🎨 ׄ ⬭ *¡ᴇʀʀᴏʀ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❌* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴇʀʀᴏʀ* :: ${e.message}
ׅㅤ𓏸𓈒ㅤׄ *ʀᴇᴘᴏʀᴛ* :: \`${usedPrefix}report\`

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
            contextInfo: { ...rcanal }
        }, { quoted: m })
    }
}

handler.tags = ['sticker']
handler.help = ['brat', 'bratv', 'emojimix', 'qc', 'take', 'wm']
handler.command = ['brat', 'bratv', 'emojimix', 'qc', 'take', 'wm']
handler.reg = true

export default handler
