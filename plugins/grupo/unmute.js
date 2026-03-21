var handler = async (m, { conn, usedPrefix, command }) => {
  let mentionedJid = m.mentionedJid || []
  let user = mentionedJid[0] || (m.quoted && m.quoted.sender) || null

  if (!user) return conn.reply(m.chat, 
    `> . ﹡ ﹟ 🔊 ׄ ⬭ *ᴅᴇsᴍᴜᴛᴇᴀʀ ᴜsᴜᴀʀɪᴏ*\n\n` +
    `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ ⚠️ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
    `ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴏ* :: ${usedPrefix}${command} @usuario\n` +
    `ׅㅤ𓏸𓈒ㅤׄ *ᴏ* :: Responde a un mensaje con ${usedPrefix}${command}`, m)

  try {
    // Verificar si existe la estructura de datos
    if (!global.db.data.chats?.[m.chat]?.mutes?.[user]) {
      return conn.reply(m.chat, 
        `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ʏᴀ ᴘᴜᴇᴅᴇ ʜᴀʙʟᴀʀ*\n\n` +
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 📭 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴜᴀʀɪᴏ* :: @${user.split('@')[0]}\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴇsᴛᴀᴅᴏ* :: Este usuario no está silenciado`, m, { mentions: [user] })
    }

    // Remover el mute
    delete global.db.data.chats[m.chat].mutes[user]

    // Mensaje de confirmación
    await conn.reply(m.chat, 
      `> . ﹡ ﹟ 🔊 ׄ ⬭ *ᴜsᴜᴀʀɪᴏ ᴅᴇsᴍᴜᴛᴇᴀᴅᴏ*\n\n` +
      `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ ✅ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
      `ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴜᴀʀɪᴏ* :: @${user.split('@')[0]}\n` +
      `ׅㅤ𓏸𓈒ㅤׄ *ᴀᴅᴍɪɴ* :: @${m.sender.split('@')[0]}\n` +
      `ׅㅤ𓏸𓈒ㅤׄ *ᴇsᴛᴀᴅᴏ* :: Ya puede enviar mensajes nuevamente`, m, {
      mentions: [user, m.sender]
    })

  } catch (e) {
    console.error('Error en unmute:', e)
    conn.reply(m.chat, 
      `> . ﹡ ﹟ ❌ ׄ ⬭ *ᴇʀʀᴏʀ*\n\n` +
      `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ ⚠️ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
      `ׅㅤ𓏸𓈒ㅤׄ *ᴅᴇᴛᴀʟʟᴇ* :: ${e.message}\n\n` +
      `> ✦ *ʀᴇᴘᴏʀᴛᴀʀ* :: ${usedPrefix}report`, m)
  }
}

handler.help = ['unmute <@user>']
handler.tags = ['grupo']
handler.command = ['unmute', 'desmutear', 'dessilenciar']
handler.admin = true
handler.group = true
handler.botAdmin = true

export default handler
