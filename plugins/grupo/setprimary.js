import ws from 'ws'

const handler = async (m, { conn, usedPrefix }) => {
    const subBots = [...new Set([...global.conns.filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED).map((conn) => conn.user.jid)])]
    
    if (global.conn?.user?.jid && !subBots.includes(global.conn.user.jid)) {
        subBots.push(global.conn.user.jid)
    }
    
    const chat = global.db.data.chats[m.chat]
    const mentionedJid = await m.mentionedJid
    const who = mentionedJid[0] ? mentionedJid[0] : m.quoted ? await m.quoted.sender : false
    
    if (!who) return conn.reply(m.chat, 
        `> . ﹡ ﹟ 🤖 ׄ ⬭ *sᴇᴛᴘʀɪᴍᴀʀʏ*\n\n` +
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ ⚠️ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴏ* :: ${usedPrefix}setprimary @subbot\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴏ* :: Responde a un mensaje del subbot\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ғᴜɴᴄɪᴏ́ɴ* :: Establece el bot principal del grupo`, m)
    
    if (!subBots.includes(who)) return conn.reply(m.chat, 
        `> . ﹡ ﹟ ⚠️ ׄ ⬭ *sᴏᴄᴋᴇᴛ ɪɴᴠᴀ́ʟɪᴅᴏ*\n\n` +
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 🚫 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴜᴀʀɪᴏ* :: @${who.split('@')[0]}\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴇsᴛᴀᴅᴏ* :: No es un socket de ${global.botname || 'ᴀsᴛᴀ-ʙᴏᴛ'}`, m, { mentions: [who] })
    
    if (chat.primaryBot === who) {
        return conn.reply(m.chat, 
            `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ʏᴀ ᴇs ᴘʀɪɴᴄɪᴘᴀʟ*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ ⏳ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ʙᴏᴛ* :: @${who.split('@')[0]}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴇsᴛᴀᴅᴏ* :: Ya está establecido como principal en este grupo`, m, { mentions: [who] })
    }
    
    try {
        chat.primaryBot = who
        
        conn.reply(m.chat, 
            `> . ﹡ ﹟ 🤖 ׄ ⬭ *ʙᴏᴛ ᴘʀɪɴᴄɪᴘᴀʟ ᴇsᴛᴀʙʟᴇᴄɪᴅᴏ*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ ✅ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ɴᴜᴇᴠᴏ ʙᴏᴛ* :: @${who.split('@')[0]}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ɢʀᴜᴘᴏ* :: ${await conn.getName(m.chat)}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴀᴅᴍɪɴ* :: @${m.sender.split('@')[0]}\n\n` +
            `> ✧ *ɴᴏᴛᴀ* :: Todos los comandos de este grupo serán ejecutados por este bot`, m, { mentions: [who, m.sender] })
            
    } catch (e) {
        conn.reply(m.chat, 
            `> . ﹡ ﹟ ❌ ׄ ⬭ *ᴇʀʀᴏʀ*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ ⚠️ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴅᴇᴛᴀʟʟᴇ* :: ${e.message}\n\n` +
            `> ✦ *ʀᴇᴘᴏʀᴛᴀʀ* :: ${usedPrefix}report`, m)
    }
}

handler.help = ['setprimary']
handler.tags = ['grupo']
handler.command = ['setprimary']
handler.group = true
handler.admin = true

export default handler
