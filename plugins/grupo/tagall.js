const handler = async (m, { isOwner, isAdmin, conn, text, participants, args, command }) => {
    const pesan = args.join` `
    const oi = pesan || 'Sin mensaje especificado'
    
    let teks = 
        `> . ﹡ ﹟ 📢 ׄ ⬭ *ᴍᴇɴᴄɪᴏ́ɴ ɢᴇɴᴇʀᴀʟ*\n\n` +
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 🗣️ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴛᴀʀɢᴇᴛ* :: ${participants.length} miembros\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴍᴇɴsᴀᴊᴇ* :: ${oi}\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴀᴅᴍɪɴ* :: @${m.sender.split('@')[0]}\n\n` +
        `> ✦ *ʟɪsᴛᴀ ᴅᴇ ᴍɪᴇᴍʙʀᴏs* ::\n\n`
    
    for (const mem of participants) {
        teks += `ׅㅤ𓏸𓈒ㅤׄ 👤 @${mem.id.split('@')[0]}\n`
    }
    
    teks += `\n> ✧ *${global.botname || 'ᴀsᴛᴀ-ʙᴏᴛ'}* :: ${global.vs || 'v1.0.0'}`

    conn.sendMessage(m.chat, { text: teks, mentions: participants.map((a) => a.id) })
}

handler.help = ['todos']
handler.tags = ['group']
handler.command = ['todos', 'invocar', 'tagall']
handler.admin = true
handler.group = true

export default handler
