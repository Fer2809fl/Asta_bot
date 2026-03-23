import { sticker } from '../../lib/sticker.js'
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

let handler = async (m, { conn, args, usedPrefix, command }) => {
    const rcanal = await getRcanal()
    let stiker = false
    let userId = m.sender
    let packstickers = global.db.data.users[userId] || {}
    let texto1 = packstickers.text1 || global.packsticker || 'Sticker'
    let texto2 = packstickers.text2 || global.packsticker2 || 'Bot'

    try {
        let q = m.quoted ? m.quoted : m
        let mime = (q.msg || q).mimetype || q.mediaType || q.mtype || ''
        if (!mime) {
            if (q.message?.imageMessage) mime = 'image'
            else if (q.message?.videoMessage) mime = 'video'
            else if (q.message?.stickerMessage) mime = 'webp'
        }
        let txt = args.join(' ')

        if (/webp|image|video/g.test(mime)) {
            if (!q.download) return conn.sendMessage(m.chat, {
                text: `> . ﹡ ﹟ 🎭 ׄ ⬭ *¡ᴇʀʀᴏʀ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❌* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴇʀʀᴏʀ* :: ɴᴏ ꜱᴇ ᴘᴜᴅᴏ ᴅᴇꜱᴄᴀʀɢᴀʀ ᴇʟ ᴀʀᴄʜɪᴠᴏ

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
                contextInfo: { ...rcanal }
            }, { quoted: m })

            if (/video/.test(mime)) {
                const seconds = (q.msg || q).seconds || 0
                if (seconds > 16) return conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ 🎭 ׄ ⬭ *¡ᴇʀʀᴏʀ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❌* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴇʀʀᴏʀ* :: ᴠɪᴅᴇᴏ ᴍáx. *15 ꜱᴇɢᴜɴᴅᴏꜱ*
ׅㅤ𓏸𓈒ㅤׄ *ᴅᴜʀᴀᴄɪᴏ́ɴ* :: ${seconds}s

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
                    contextInfo: { ...rcanal }
                }, { quoted: m })
            }

            await m.react('🕓')
            let buffer = await q.download()
            if (!buffer || buffer.length === 0) throw new Error('Buffer vacío')
            let marca = txt ? txt.split(/[•|]/).map(p => p.trim()) : [texto1, texto2]
            if (marca.length === 1) marca.push(texto2)
            stiker = await sticker(buffer, null, marca[0], marca[1])

        } else if (args[0] && isUrl(args[0])) {
            await m.react('🕓')
            stiker = await sticker(false, args[0], texto1, texto2)
        } else {
            return conn.sendMessage(m.chat, {
                text: `> . ﹡ ﹟ 🎭 ׄ ⬭ *¡ᴄʀᴇᴀᴅᴏʀ ᴅᴇ ꜱᴛɪᴄᴋᴇʀ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🎭* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴏ 1* :: ʀᴇꜱᴘᴏɴᴅᴇ ᴀ ɪᴍᴀɢᴇɴ/ᴠɪᴅᴇᴏ
ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴏ 2* :: \`#s (url imagen)\`
ׅㅤ𓏸𓈒ㅤׄ *ᴛᴇxᴛᴏ* :: \`#s Texto1 | Texto2\`
ׅㅤ𓏸𓈒ㅤׄ *ᴍáx ᴠɪᴅᴇᴏ* :: 15 ꜱᴇɢᴜɴᴅᴏꜱ

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
                contextInfo: { ...rcanal }
            }, { quoted: m })
        }

    } catch (e) {
        await m.react('✖️')
        return conn.sendMessage(m.chat, {
            text: `> . ﹡ ﹟ 🎭 ׄ ⬭ *¡ᴇʀʀᴏʀ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❌* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴇʀʀᴏʀ* :: ${e.message}
ׅㅤ𓏸𓈒ㅤׄ *ɴᴏᴛᴀ* :: ᴠᴇʀɪꜰɪᴄᴀ ǫᴜᴇ ffmpeg ᴇꜱᴛé ɪɴꜱᴛᴀʟᴀᴅᴏ

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
            contextInfo: { ...rcanal }
        }, { quoted: m })
    } finally {
        if (stiker && Buffer.isBuffer(stiker) && stiker.length > 0) {
            await conn.sendFile(m.chat, stiker, 'sticker.webp', '', m, false, { asSticker: true })
            await m.react('✅')
        } else if (stiker !== false) {
            await m.react('✖️')
            conn.sendMessage(m.chat, {
                text: `> . ﹡ ﹟ 🎭 ׄ ⬭ *¡ᴇʀʀᴏʀ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❌* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴇʀʀᴏʀ* :: ɴᴏ ꜱᴇ ᴘᴜᴅᴏ ᴄʀᴇᴀʀ ᴇʟ ꜱᴛɪᴄᴋᴇʀ
ׅㅤ𓏸𓈒ㅤׄ *ꜱᴜɢ* :: ɪɴᴛᴇɴᴛᴀ ᴄᴏɴ ᴏᴛʀᴀ ɪᴍᴀɢᴇɴ

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
                contextInfo: { ...rcanal }
            }, { quoted: m })
        }
    }
}

handler.help = ['sticker']
handler.tags = ['sticker']
handler.command = ['s', 'sticker', 'stiker']
handler.reg = true

export default handler

const isUrl = (text) => {
    return text.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)(jpe?g|gif|png|webp|mp4)/, 'gi'))
}
