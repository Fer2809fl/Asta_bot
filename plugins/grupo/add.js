import moment from 'moment-timezone'

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
    if (!text) return conn.reply(m.chat, 
        `> . ﹡ ﹟ 👥 ׄ ⬭ *ᴀɢʀᴇɢᴀʀ ᴜsᴜᴀʀɪᴏ*\n\n` +
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 📩 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴏ* :: ${usedPrefix}${command} <número>\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴇᴊᴇᴍᴘʟᴏ* :: ${usedPrefix}${command} 584123456789\n\n` +
        `> ✦ Sin *+* ni espacios ni código de país`, m)

    if (text.includes('+')) return conn.reply(m.chat, 
        `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴇʀʀᴏʀ*\n\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴅᴇᴛᴀʟʟᴇ* :: Ingrese el número sin el símbolo *+*`, m)

    if (isNaN(text)) return conn.reply(m.chat, 
        `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴇʀʀᴏʀ*\n\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴅᴇᴛᴀʟʟᴇ* :: Solo números, sin código de país ni espacios`, m)

    let group = m.chat
    let link = 'https://chat.whatsapp.com/' + await conn.groupInviteCode(group)
    let tag = m.sender ? '@' + m.sender.split('@')[0] : 'Usuario'
    const chatLabel = m.isGroup ? (await conn.getName(m.chat) || 'Grupal') : 'Privado'
    const horario = `${moment.tz('America/Caracas').format('DD/MM/YYYY hh:mm:ss A')}`

    const invite = 
        `> . ﹡ ﹟ 📨 ׄ ⬭ *ɪɴᴠɪᴛᴀᴄɪᴏ́ɴ ᴅᴇ ɢʀᴜᴘᴏ*\n\n` +
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 🎟️ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴅᴇ* :: ${tag}\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ɢʀᴜᴘᴏ* :: ${chatLabel}\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ғᴇᴄʜᴀ* :: ${horario}\n\n` +
        `> ✦ *ʟɪɴᴋ* :: ${link}`

    await conn.reply(`${text}@s.whatsapp.net`, invite, m, { mentions: [m.sender] })
    
    m.reply(
        `> . ﹡ ﹟ ✅ ׄ ⬭ *ᴇxɪᴛᴏ*\n\n` +
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 📤 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴇsᴛᴀᴅᴏ* :: Invitación enviada correctamente\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴅᴇsᴛɪɴᴀᴛᴀʀɪᴏ* :: ${text}@s.whatsapp.net`)
}

handler.help = ['invite']
handler.tags = ['group']
handler.command = ['add', 'agregar', 'añadir']
handler.group = true
handler.botAdmin = true
handler.reg = true

export default handler
