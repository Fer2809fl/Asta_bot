var handler = async (m, { conn, usedPrefix, command, text, groupMetadata }) => {
    let mentionedJid = await m.mentionedJid
    let user = mentionedJid && mentionedJid.length ? mentionedJid[0] : m.quoted && await m.quoted.sender ? await m.quoted.sender : null
    
    if (!user) return conn.reply(m.chat, 
        `> . ﹡ ﹟ ⬇️ ׄ ⬭ *ᴅᴇɢʀᴀᴅᴀʀ ᴀᴅᴍɪɴ*\n\n` +
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
            `ׅㅤ𓏸𓈒ㅤׄ *ᴍᴏᴛɪᴠᴏ* :: No puedes degradar al bot`, m)
            
        if (user === ownerGroup) return conn.reply(m.chat, 
            `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴀᴄᴄɪᴏ́ɴ ɴᴏ ᴘᴇʀᴍɪᴛɪᴅᴀ*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 👑 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴍᴏᴛɪᴠᴏ* :: No puedes degradar al creador del grupo`, m)
            
        if (user === ownerBot) return conn.reply(m.chat, 
            `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴀᴄᴄɪᴏ́ɴ ɴᴏ ᴘᴇʀᴍɪᴛɪᴅᴀ*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 🔒 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴍᴏᴛɪᴠᴏ* :: No puedes degradar al propietario del bot`, m)
        
        await conn.groupParticipantsUpdate(m.chat, [user], 'demote')
        
        conn.reply(m.chat, 
            `> . ﹡ ﹟ ⬇️ ׄ ⬭ *ᴀᴅᴍɪɴ ᴅᴇɢʀᴀᴅᴀᴅᴏ*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ ✅ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴜᴀʀɪᴏ* :: @${user.split('@')[0]}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴇsᴛᴀᴅᴏ* :: Descartado como administrador\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴀᴅᴍɪɴ* :: @${m.sender.split('@')[0]}`, m, { mentions: [user, m.sender] })
            
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
handler.command = ['demote', 'degradar']
handler.group = true
handler.admin = true
handler.botAdmin = true
handler.reg = true

export default handler
