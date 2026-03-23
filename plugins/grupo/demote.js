var handler = async (m, { conn, participants, usedPrefix, command }) => {
    let mentionedJid = await m.mentionedJid
    let user = mentionedJid && mentionedJid.length ? mentionedJid[0] : m.quoted && await m.quoted.sender ? await m.quoted.sender : null
    
    if (!user) return conn.reply(m.chat, 
        `> . ﹡ ﹟ 👑 ׄ ⬭ *ᴅᴇᴍᴏᴠᴇʀ ᴜsᴜᴀʀɪᴏ*\n\n` +
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ ⚠️ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴏ* :: ${usedPrefix}${command} @usuario\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴏ* :: Responde a un mensaje con ${usedPrefix}${command}`, m)
    
    try {
        const groupInfo = await conn.groupMetadata(m.chat)
        const ownerGroup = groupInfo.owner || m.chat.split`-`[0] + '@s.whatsapp.net'
        const ownerBot = global.owner[0][0] + '@s.whatsapp.net'
        
        if (user === conn.user.jid) return conn.reply(m.chat, 
            `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴀᴄᴄɪᴏ́ɴ ɴᴏ ᴘᴇʀᴍɪᴛɪᴅᴀ*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 🤖 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴍᴏᴛɪᴠᴏ* :: No puedo remover mis propios permisos de administrador`, m)
            
        if (user === ownerGroup) return conn.reply(m.chat, 
            `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴀᴄᴄɪᴏ́ɴ ɴᴏ ᴘᴇʀᴍɪᴛɪᴅᴀ*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 👑 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴍᴏᴛɪᴠᴏ* :: No puedo remover al propietario del grupo`, m)
            
        if (user === ownerBot) return conn.reply(m.chat, 
            `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴀᴄᴄɪᴏ́ɴ ɴᴏ ᴘᴇʀᴍɪᴛɪᴅᴀ*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 🔒 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴍᴏᴛɪᴠᴏ* :: No puedo remover al propietario del bot`, m)
        
        // Verificar si el usuario es admin (misma lógica que kick pero para admin)
        let isAdmin = false
        for (let p of participants) {
            // Comparar JIDs normalizados (sin el sufijo)
            const participantJid = p.id.split('@')[0]
            const userJid = user.split('@')[0]
            if (participantJid === userJid) {
                // Verificar si es admin (admin puede ser 'admin', 'superadmin', o true)
                if (p.admin === 'admin' || p.admin === 'superadmin' || p.admin === true) {
                    isAdmin = true
                }
                break
            }
        }
        
        if (!isAdmin) {
            return conn.reply(m.chat, 
                `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴀᴄᴄɪᴏ́ɴ ɴᴏ ᴘᴇʀᴍɪᴛɪᴅᴀ*\n\n` +
                `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 👤 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
                `ׅㅤ𓏸𓈒ㅤׄ *ᴍᴏᴛɪᴠᴏ* :: El usuario @${user.split('@')[0]} no es administrador del grupo`, m, { mentions: [user] })
        }
        
        await conn.groupParticipantsUpdate(m.chat, [user], 'demote')
        
        conn.reply(m.chat, 
            `> . ﹡ ﹟ 👑 ׄ ⬭ *ᴜsᴜᴀʀɪᴏ ᴅᴇᴍᴏᴠɪᴅᴏ*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ ✅ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴜᴀʀɪᴏ* :: @${user.split('@')[0]}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴀᴅᴍɪɴ* :: @${m.sender.split('@')[0]}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴀᴄᴄɪᴏ́ɴ* :: Ya no es administrador del grupo`, m, { mentions: [user, m.sender] })
            
    } catch (e) {
        conn.reply(m.chat, 
            `> . ﹡ ﹟ ❌ ׄ ⬭ *ᴇʀʀᴏʀ*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ ⚠️ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴅᴇᴛᴀʟʟᴇ* :: ${e.message}\n\n` +
            `> ✦ *ʀᴇᴘᴏʀᴛᴀʀ* :: ${usedPrefix}report`, m)
    }
}

handler.help = ['demote']
handler.tags = ['grupo']
handler.command = ['demote', 'quitaradmin', 'descender', 'removeradmin']
handler.admin = true
handler.group = true
handler.botAdmin = true

export default handler