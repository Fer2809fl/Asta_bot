let handler = async (m, { conn, command }) => {
    if (!m.quoted) {
        return conn.reply(m.chat, 
            `> . ﹡ ﹟ 🗑️ ׄ ⬭ *ᴇʟɪᴍɪɴᴀʀ ᴍᴇɴsᴀᴊᴇ*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ ⚠️ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴏ* :: Cita el mensaje que deseas eliminar\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴇᴊᴇᴍᴘʟᴏ* :: Responde a un mensaje con ${command}`, m)
    }
    
    try {
        let participant = m.message.extendedTextMessage.contextInfo.participant
        let stanzaId = m.message.extendedTextMessage.contextInfo.stanzaId
        
        await conn.sendMessage(m.chat, {
            delete: { 
                remoteJid: m.chat, 
                fromMe: false, 
                id: stanzaId, 
                participant: participant 
            }
        })
        
    } catch {
        await conn.sendMessage(m.chat, { delete: m.quoted.key })
    }
}

handler.help = ['delete']
handler.tags = ['grupo']
handler.command = ['del', 'delete']
handler.group = true
handler.admin = true
handler.botAdmin = true
handler.reg = true

export default handler
