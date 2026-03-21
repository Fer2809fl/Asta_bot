var handler = async (m, { conn, participants, usedPrefix, command }) => {
    let mentionedJid = await m.mentionedJid
    let user = mentionedJid && mentionedJid.length ? mentionedJid[0] : m.quoted && await m.quoted.sender ? await m.quoted.sender : null
    
    if (!user) return conn.reply(m.chat, 
        `> . ﹡ ﹟ 👢 ׄ ⬭ *ᴇxᴘᴜʟsᴀʀ ᴜsᴜᴀʀɪᴏ*\n\n` +
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
            `ׅㅤ𓏸𓈒ㅤׄ *ᴍᴏᴛɪᴠᴏ* :: No puedo eliminar al bot del grupo`, m)
            
        if (user === ownerGroup) return conn.reply(m.chat, 
            `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴀᴄᴄɪᴏ́ɴ ɴᴏ ᴘᴇʀᴍɪᴛɪᴅᴀ*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 👑 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴍᴏᴛɪᴠᴏ* :: No puedo eliminar al propietario del grupo`, m)
            
        if (user === ownerBot) return conn.reply(m.chat, 
            `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴀᴄᴄɪᴏ́ɴ ɴᴏ ᴘᴇʀᴍɪᴛɪᴅᴀ*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 🔒 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴍᴏᴛɪᴠᴏ* :: No puedo eliminar al propietario del bot`, m)
        
        await conn.groupParticipantsUpdate(m.chat, [user], 'remove')
        
        conn.reply(m.chat, 
            `> . ﹡ ﹟ 👢 ׄ ⬭ *ᴜsᴜᴀʀɪᴏ ᴇxᴘᴜʟsᴀᴅᴏ*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ ✅ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴜᴀʀɪᴏ* :: @${user.split('@')[0]}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴀᴅᴍɪɴ* :: @${m.sender.split('@')[0]}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴀᴄᴄɪᴏ́ɴ* :: Expulsado del grupo`, m, { mentions: [user, m.sender] })
            
    } catch (e) {
        conn.reply(m.chat, 
            `> . ﹡ ﹟ ❌ ׄ ⬭ *ᴇʀʀᴏʀ*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ ⚠️ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴅᴇᴛᴀʟʟᴇ* :: ${e.message}\n\n` +
            `> ✦ *ʀᴇᴘᴏʀᴛᴀʀ* :: ${usedPrefix}report`, m)
    }
}

handler.help = ['kick']
handler.tags = ['grupo']
handler.command = ['kick', 'echar', 'hechar', 'sacar', 'ban']
handler.admin = true
handler.group = true
handler.botAdmin = true

export default handler
