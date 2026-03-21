import { generateWAMessageFromContent } from '@whiskeysockets/baileys'
import * as fs from 'fs'

var handler = async (m, { conn, text, participants, isOwner, isAdmin }) => {
    if (!m.quoted && !text) return conn.reply(m.chat, 
        `> . ﹡ ﹟ 📢 ׄ ⬭ *ʜɪᴅᴇᴛᴀɢ*\n\n` +
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 🏷️ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴏ* :: ${usedPrefix}hidetag <mensaje>\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴏ* :: Responde a un mensaje con ${usedPrefix}hidetag\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ɴᴏᴛᴀ* :: Menciona a todos los miembros del grupo`, m)

    let mentionedJid = await m.mentionedJid
    let users = participants.map(u => conn.decodeJid(u.id))
    let htextos = text ? text : (m.quoted && m.quoted.text) ? m.quoted.text : "¡¡¡Hola!!!"
    
    if ((mentionedJid && mentionedJid.length) || (m.quoted && m.quoted.mentionedJid && m.quoted.mentionedJid.length)) {
        let copy = htextos
        let list = mentionedJid || m.quoted.mentionedJid
        for (let i = 0; i < list.length; i++) {
            let num = list[i].split('@')[0]
            copy = copy.replace(/@\S+/, '@' + num)
        }
        htextos = copy
    }

    try { 
        let q = m.quoted ? m.quoted : m || m.text || m.sender
        let c = m.quoted ? await m.getQuotedObj() : m.msg || m.text || m.sender
        let msg = conn.cMod(m.chat, generateWAMessageFromContent(m.chat, { [m.quoted ? q.mtype : 'extendedTextMessage']: m.quoted ? c.message[q.mtype] : { text: '' || c } }, { quoted: null, userJid: conn.user.id }), htextos || q.text, conn.user.jid, { mentions: users })
        await conn.relayMessage(m.chat, msg.message, { messageId: msg.key?.id || undefined })
    } catch {
        let users = participants.map(u => conn.decodeJid(u.id))
        let quoted = m.quoted ? m.quoted : m
        let mime = (quoted.msg || quoted).mimetype || ''
        let isMedia = /image|video|sticker|audio/.test(mime)
        let more = String.fromCharCode(8206)
        let masss = more.repeat(850)
        
        if ((isMedia && quoted.mtype === 'imageMessage') && htextos) {
            var mediax = await quoted.download?.()
            conn.sendMessage(m.chat, { 
                image: mediax, 
                caption: 
                    `> . ﹡ ﹟ 📢 ׄ ⬭ *ʜɪᴅᴇᴛᴀɢ*\n\n` +
                    `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 🖼️ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
                    `ׅㅤ𓏸𓈒ㅤׄ *ᴍᴇɴsᴀᴊᴇ* :: ${htextos}`, 
                mentions: users 
            }, { quoted: null })
            
        } else if ((isMedia && quoted.mtype === 'videoMessage') && htextos) {
            var mediax = await quoted.download?.()
            conn.sendMessage(m.chat, { 
                video: mediax, 
                mimetype: 'video/mp4', 
                caption: 
                    `> . ﹡ ﹟ 📢 ׄ ⬭ *ʜɪᴅᴇᴛᴀɢ*\n\n` +
                    `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 🎬 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
                    `ׅㅤ𓏸𓈒ㅤׄ *ᴍᴇɴsᴀᴊᴇ* :: ${htextos}`, 
                mentions: users 
            }, { quoted: null })
            
        } else if ((isMedia && quoted.mtype === 'audioMessage') && htextos) {
            var mediax = await quoted.download?.()
            conn.sendMessage(m.chat, { 
                audio: mediax, 
                mimetype: 'audio/mp4', 
                fileName: 'Hidetag.mp3', 
                mentions: users 
            }, { quoted: null })
            
        } else if ((isMedia && quoted.mtype === 'stickerMessage') && htextos) {
            var mediax = await quoted.download?.()
            conn.sendMessage(m.chat, { 
                sticker: mediax, 
                mentions: users 
            }, { quoted: null })
            
        } else {
            await conn.relayMessage(m.chat, { 
                extendedTextMessage: { 
                    text: 
                        `> . ﹡ ﹟ 📢 ׄ ⬭ *ʜɪᴅᴇᴛᴀɢ*\n\n` +
                        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 💬 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
                        `ׅㅤ𓏸𓈒ㅤׄ *ᴍᴇɴsᴀᴊᴇ* :: ${htextos}\n` +
                        `${masss}`, 
                    contextInfo: { mentionedJid: users }
                }
            })
        }
    }
}

handler.help = ['hidetag']
handler.tags = ['grupo']
handler.command = ['hidetag', 'notificar', 'notify', 'tag']
handler.group = true
handler.admin = true

export default handler
