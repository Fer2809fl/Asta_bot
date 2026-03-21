let handler = async (m, { conn, usedPrefix, command }) => {
    let isClose = { 
        'open': 'not_announcement', 
        'abrir': 'not_announcement', 
        'close': 'announcement', 
        'cerrar': 'announcement', 
    }[command]

    await conn.groupSettingUpdate(m.chat, isClose)

    if (isClose === 'not_announcement') {
        m.reply(
            `> . ﹡ ﹟ 🔓 ׄ ⬭ *ɢʀᴜᴘᴏ ᴀʙɪᴇʀᴛᴏ*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ ✅ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴇsᴛᴀᴅᴏ* :: Chat abierto para todos\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴘᴇʀᴍɪsᴏs* :: Todos los miembros pueden enviar mensajes\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴀᴅᴍɪɴ* :: @${m.sender.split('@')[0]}`, m, { mentions: [m.sender] })
    } else if (isClose === 'announcement') {
        m.reply(
            `> . ﹡ ﹟ 🔒 ׄ ⬭ *ᴍᴏᴅᴏ sᴏʟᴏ ᴀᴅᴍɪɴs*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 🛡️ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴇsᴛᴀᴅᴏ* :: Chat cerrado\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴘᴇʀᴍɪsᴏs* :: Solo administradores pueden enviar mensajes\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴀᴅᴍɪɴ* :: @${m.sender.split('@')[0]}`, m, { mentions: [m.sender] })
    }
}

handler.help = ['open', 'close', 'abrir', 'cerrar']
handler.tags = ['grupo']
handler.command = ['open', 'close', 'abrir', 'cerrar']
handler.admin = true
handler.botAdmin = true

export default handler
