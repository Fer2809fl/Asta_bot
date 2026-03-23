import { generateWAMessageFromContent } from '@whiskeysockets/baileys'
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

let handler = async (m, { conn, text }) => {
    const rcanal = await getRcanal()

    if (!m.quoted && !text) return conn.sendMessage(m.chat, {
        text: `> . ﹡ ﹟ 🗣️ ׄ ⬭ *¡ʀᴇᴘᴇᴛɪᴅᴏʀ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🗣️* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴏ* :: \`#say (texto)\`
ׅㅤ𓏸𓈒ㅤׄ *ᴀʟᴛᴇʀɴ* :: ʀᴇꜱᴘᴏɴᴅᴇ ᴀ ᴜɴ ᴍꜱᴊ
ׅㅤ𓏸𓈒ㅤׄ *ᴄᴏᴍᴀɴᴅᴏ* :: \`#say\` \`#decir\`

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
        contextInfo: { ...rcanal }
    }, { quoted: m })

    let mentionedJid = await m.mentionedJid
    let htextos = text ? text : (m.quoted && m.quoted.text) ? m.quoted.text : "¡¡¡Hola!!!"

    if ((mentionedJid && mentionedJid.length) || (m.quoted && m.quoted.mentionedJid && m.quoted.mentionedJid.length)) {
        let copy = htextos
        let list = mentionedJid || m.quoted.mentionedJid
        for (let i = 0; i < list.length; i++) {
            copy = copy.replace(/@\S+/, '@' + list[i].split('@')[0])
        }
        htextos = copy
    }

    let users = mentionedJid?.length ? mentionedJid : m.quoted?.mentionedJid?.length ? m.quoted.mentionedJid : []
    let mentions = users.map(jid => conn.decodeJid(jid))

    try {
        let msg = generateWAMessageFromContent(m.chat, {
            extendedTextMessage: {
                text: htextos,
                contextInfo: {
                    mentionedJid: mentions,
                    ...rcanal
                }
            }
        }, { quoted: null, userJid: conn.user.id })
        await conn.relayMessage(m.chat, msg.message, { messageId: msg.key?.id || undefined })
    } catch {
        let quoted = m.quoted ? m.quoted : m
        let mime = (quoted.msg || quoted).mimetype || ''
        let isMedia = /image|video|sticker|audio/.test(mime)
        if (isMedia && quoted.mtype === 'imageMessage' && htextos) {
            let mediax = await quoted.download?.()
            conn.sendMessage(m.chat, { image: mediax, caption: htextos, mentions, contextInfo: { ...rcanal } }, { quoted: null })
        } else if (isMedia && quoted.mtype === 'videoMessage' && htextos) {
            let mediax = await quoted.download?.()
            conn.sendMessage(m.chat, { video: mediax, mimetype: 'video/mp4', caption: htextos, mentions, contextInfo: { ...rcanal } }, { quoted: null })
        } else if (isMedia && quoted.mtype === 'audioMessage') {
            let mediax = await quoted.download?.()
            conn.sendMessage(m.chat, { audio: mediax, mimetype: 'audio/mp4', fileName: 'audio.mp4', mentions }, { quoted: null })
        } else if (isMedia && quoted.mtype === 'stickerMessage') {
            let mediax = await quoted.download?.()
            conn.sendMessage(m.chat, { sticker: mediax, mentions }, { quoted: null })
        } else {
            await conn.relayMessage(m.chat, {
                extendedTextMessage: {
                    text: `${htextos}\n`,
                    contextInfo: { mentionedJid: mentions, ...rcanal }
                }
            })
        }
    }
}

handler.help = ['say']
handler.command = ['say', 'decir']
handler.tags = ['tools']
handler.group = true
handler.reg = true

export default handler
