import { areJidsSameUser, jidNormalizedUser } from '@whiskeysockets/baileys'

const handler = async (m, { conn, args, usedPrefix, command }) => {
    // Obtener usuario a promover y normalizar el JID
    let who = m.mentionedJid && m.mentionedJid[0] 
        ? m.mentionedJid[0] 
        : m.quoted ? m.quoted.sender 
        : args[0] ? (args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net') 
        : null

    // Normalizar el JID para asegurar formato correcto
    if (who) who = jidNormalizedUser(who)

    if (!who) return conn.reply(m.chat, 
        `> . ﹡ ﹟ ⬆️ ׄ ⬭ *ᴘʀᴏᴍᴏᴠᴇʀ ᴀ ᴀᴅᴍɪɴ*\n\n` +
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ ⚠️ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴏ* :: ${usedPrefix}${command} @usuario\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴏ* :: Responde a un mensaje con ${usedPrefix}${command}`, m)

    // Verificar que no se promueva a sí mismo
    if (areJidsSameUser(who, m.sender)) return conn.reply(m.chat, 
        `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴀᴄᴄɪᴏ́ɴ ɪɴᴠᴀ́ʟɪᴅᴀ*\n\n` +
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 🚫 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴍᴏᴛɪᴠᴏ* :: No puedes promoverte a ti mismo`, m)
    
    // Verificar que no sea el bot
    if (areJidsSameUser(who, conn.user.jid)) return conn.reply(m.chat, 
        `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴀᴄᴄɪᴏ́ɴ ɪɴᴠᴀ́ʟɪᴅᴀ*\n\n` +
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 🤖 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴍᴏᴛɪᴠᴏ* :: No puedo promoverme a mí mismo`, m)

    try {
        const groupInfo = await conn.groupMetadata(m.chat)
        const participant = groupInfo.participants.find(p => areJidsSameUser(p.id, who))
        
        if (!participant) return conn.reply(m.chat, 
            `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴜsᴜᴀʀɪᴏ ɴᴏ ᴇɴᴄᴏɴᴛʀᴀᴅᴏ*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 🔍 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴇsᴛᴀᴅᴏ* :: El usuario no está en el grupo`, m)
            
        if (participant.admin) return conn.reply(m.chat, 
            `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ʏᴀ ᴇs ᴀᴅᴍɪɴ*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 🛡️ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴇsᴛᴀᴅᴏ* :: El usuario ya es administrador`, m)

        await conn.groupParticipantsUpdate(m.chat, [who], 'promote')
        
        // Obtener nombre del usuario
        let name = who.split('@')[0]
        try {
            const contact = await conn.getName(who)
            if (contact) name = contact
        } catch {}

        conn.reply(m.chat, 
            `> . ﹡ ﹟ ⬆️ ׄ ⬭ *ᴀᴅᴍɪɴɪsᴛʀᴀᴅᴏʀ ᴘʀᴏᴍᴏᴠɪᴅᴏ*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 👑 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴜᴀʀɪᴏ* :: ${name}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ɴᴜ́ᴍᴇʀᴏ* :: @${who.split('@')[0]}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴀᴄᴄɪᴏ́ɴ* :: Ascendido a administrador\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴘᴏʀ* :: @${m.sender.split('@')[0]}`, m, { mentions: [who, m.sender] })
        
    } catch (error) {
        console.error('Error en promote:', error)
        conn.reply(m.chat, 
            `> . ﹡ ﹟ ❌ ׄ ⬭ *ᴇʀʀᴏʀ*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ ⚠️ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴅᴇᴛᴀʟʟᴇ* :: ${error.message || 'No se pudo promover al usuario'}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *sᴏʟᴜᴄɪᴏ́ɴ* :: Intenta usar el comando respondiendo al mensaje del usuario`, m)
    }
}

handler.help = ['promote', 'ascender', 'admin', 'daradmin']
handler.tags = ['group']
handler.command = ['promote', 'ascender', 'admin', 'daradmin', 'darpoder']
handler.admin = true
handler.group = true
handler.botAdmin = true

export default handler
