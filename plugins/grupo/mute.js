var handler = async (m, { conn, participants, usedPrefix, command, text }) => {
  let mentionedJid = m.mentionedJid || []
  let user = mentionedJid[0] || (m.quoted && m.quoted.sender) || null

  if (!user) return conn.reply(m.chat, 
    `> . ﹡ ﹟ 🔇 ׄ ⬭ *sɪʟᴇɴᴄɪᴀʀ ᴜsᴜᴀʀɪᴏ*\n\n` +
    `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ ⚠️ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
    `ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴏ* :: ${usedPrefix}${command} @usuario [tiempo]\n` +
    `ׅㅤ𓏸𓈒ㅤׄ *ᴛɪᴇᴍᴘᴏ* :: [número][s/m/h/d]\n` +
    `ׅㅤ𓏸𓈒ㅤׄ *ᴇᴊᴇᴍᴘʟᴏs* ::\n` +
    `   • ${usedPrefix}${command} @usuario 10m\n` +
    `   • ${usedPrefix}${command} @usuario 2h\n` +
    `   • ${usedPrefix}${command} @usuario 1d\n` +
    `   • ${usedPrefix}${command} @usuario (indefinido)`, m)

  // Extraer tiempo del comando
  let time = text.match(/(\d+)([smhd])/i)
  let duration = 0
  let durationText = '♾️ ɪɴᴅᴇғɪɴɪᴅᴀᴍᴇɴᴛᴇ'

  if (time) {
    let value = parseInt(time[1])
    let unit = time[2].toLowerCase()

    switch(unit) {
      case 's':
        duration = value * 1000
        durationText = `${value}s`
        break
      case 'm':
        duration = value * 60 * 1000
        durationText = `${value}m`
        break
      case 'h':
        duration = value * 60 * 60 * 1000
        durationText = `${value}h`
        break
      case 'd':
        duration = value * 24 * 60 * 60 * 1000
        durationText = `${value}d`
        break
    }
  }

  try {
    const groupInfo = await conn.groupMetadata(m.chat)
    const ownerGroup = groupInfo.owner || m.chat.split`-`[0] + '@s.whatsapp.net'
    const ownerBot = global.owner[0][0] + '@s.whatsapp.net'

    // Verificaciones de seguridad
    if (user === conn.user.jid) return conn.reply(m.chat, 
      `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴀᴄᴄɪᴏ́ɴ ɴᴏ ᴘᴇʀᴍɪᴛɪᴅᴀ*\n\n` +
      `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 🤖 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
      `ׅㅤ𓏸𓈒ㅤׄ *ᴍᴏᴛɪᴠᴏ* :: No puedo silenciar al bot`, m)
      
    if (user === ownerGroup) return conn.reply(m.chat, 
      `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴀᴄᴄɪᴏ́ɴ ɴᴏ ᴘᴇʀᴍɪᴛɪᴅᴀ*\n\n` +
      `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 👑 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
      `ׅㅤ𓏸𓈒ㅤׄ *ᴍᴏᴛɪᴠᴏ* :: No puedo silenciar al propietario del grupo`, m)
      
    if (user === ownerBot) return conn.reply(m.chat, 
      `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴀᴄᴄɪᴏ́ɴ ɴᴏ ᴘᴇʀᴍɪᴛɪᴅᴀ*\n\n` +
      `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 🔒 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
      `ׅㅤ𓏸𓈒ㅤׄ *ᴍᴏᴛɪᴠᴏ* :: No puedo silenciar al propietario del bot`, m)

    // Verificar si el usuario es admin
    const isAdmin = participants.find(p => p.id === user)?.admin
    if (isAdmin) return conn.reply(m.chat, 
      `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴀᴄᴄɪᴏ́ɴ ɴᴏ ᴘᴇʀᴍɪᴛɪᴅᴀ*\n\n` +
      `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 🛡️ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
      `ׅㅤ𓏸𓈒ㅤׄ *ᴍᴏᴛɪᴠᴏ* :: No puedo silenciar a un administrador`, m)

    // Inicializar estructura de datos si no existe
    if (!global.db.data.chats) global.db.data.chats = {}
    if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
    if (!global.db.data.chats[m.chat].mutes) global.db.data.chats[m.chat].mutes = {}

    // Verificar si ya está muteado
    if (global.db.data.chats[m.chat].mutes[user]) {
      const muteData = global.db.data.chats[m.chat].mutes[user]
      const remainingTime = muteData.expiresAt ? Math.max(0, muteData.expiresAt - Date.now()) : null
      
      if (remainingTime === null) {
        return conn.reply(m.chat, 
          `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ʏᴀ sɪʟᴇɴᴄɪᴀᴅᴏ*\n\n` +
          `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 🔇 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
          `ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴜᴀʀɪᴏ* :: @${user.split('@')[0]}\n` +
          `ׅㅤ𓏸𓈒ㅤׄ *ᴇsᴛᴀᴅᴏ* :: Ya está silenciado ♾️ indefinidamente`, m, { mentions: [user] })
      } else if (remainingTime > 0) {
        const timeLeft = formatTime(remainingTime)
        return conn.reply(m.chat, 
          `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ʏᴀ sɪʟᴇɴᴄɪᴀᴅᴏ*\n\n` +
          `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ ⏳ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
          `ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴜᴀʀɪᴏ* :: @${user.split('@')[0]}\n` +
          `ׅㅤ𓏸𓈒ㅤׄ *ᴛɪᴇᴍᴘᴏ ʀᴇsᴛᴀɴᴛᴇ* :: ${timeLeft}`, m, { mentions: [user] })
      }
    }

    // Registrar el mute
    global.db.data.chats[m.chat].mutes[user] = {
      mutedAt: Date.now(),
      mutedBy: m.sender,
      duration: duration,
      expiresAt: duration > 0 ? Date.now() + duration : null,
      name: await conn.getName(user).catch(() => user.split('@')[0])
    }

    // Mensaje de confirmación
    await conn.reply(m.chat, 
      `> . ﹡ ﹟ 🔇 ׄ ⬭ *ᴜsᴜᴀʀɪᴏ sɪʟᴇɴᴄɪᴀᴅᴏ*\n\n` +
      `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ ✅ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
      `ׅㅤ𓏸𓈒ㅤׄ *ᴛᴀʀɢᴇᴛ* :: @${user.split('@')[0]}\n` +
      `ׅㅤ𓏸𓈒ㅤׄ *ᴅᴜʀᴀᴄɪᴏ́ɴ* :: ${durationText}\n` +
      `ׅㅤ𓏸𓈒ㅤׄ *ᴀᴅᴍɪɴ* :: @${m.sender.split('@')[0]}\n` +
      `ׅㅤ𓏸𓈒ㅤׄ *ᴇsᴛᴀᴅᴏ* :: No podrá enviar mensajes en este grupo`, m, {
      mentions: [user, m.sender]
    })

    // Si hay duración, programar unmute automático
    if (duration > 0) {
      setTimeout(() => {
        if (global.db.data.chats[m.chat]?.mutes?.[user]) {
          delete global.db.data.chats[m.chat].mutes[user]
          conn.reply(m.chat, 
            `> . ﹡ ﹟ 🔊 ׄ ⬭ *sɪʟᴇɴᴄɪᴏ ᴇxᴘɪʀᴀᴅᴏ*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ ⏰ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴜᴀʀɪᴏ* :: @${user.split('@')[0]}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴇsᴛᴀᴅᴏ* :: El silencio ha expirado, ya puede hablar`, m, {
            mentions: [user]
          }).catch(() => null)
        }
      }, duration)
    }

  } catch (e) {
    console.error('Error en mute:', e)
    conn.reply(m.chat, 
      `> . ﹡ ﹟ ❌ ׄ ⬭ *ᴇʀʀᴏʀ*\n\n` +
      `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ ⚠️ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
      `ׅㅤ𓏸𓈒ㅤׄ *ᴅᴇᴛᴀʟʟᴇ* :: ${e.message}\n\n` +
      `> ✦ *ʀᴇᴘᴏʀᴛᴀʀ* :: ${usedPrefix}report`, m)
  }
}

// Función auxiliar para formatear tiempo
function formatTime(ms) {
  if (ms < 1000) return '0s'
  
  const seconds = Math.floor((ms / 1000) % 60)
  const minutes = Math.floor((ms / (1000 * 60)) % 60)
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24)
  const days = Math.floor(ms / (1000 * 60 * 60 * 24))
  
  const parts = []
  if (days > 0) parts.push(`${days}d`)
  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0) parts.push(`${minutes}m`)
  if (seconds > 0) parts.push(`${seconds}s`)
  
  return parts.join(' ') || '0s'
}

handler.help = ['mute <@user> [tiempo]']
handler.tags = ['grupo']
handler.command = ['mute', 'silenciar', 'callar']
handler.admin = true
handler.group = true
handler.botAdmin = true

export default handler
