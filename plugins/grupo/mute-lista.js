var handler = async (m, { conn }) => {
  try {
    // Verificar estructura de datos
    if (!global.db.data.chats?.[m.chat]?.mutes) {
      return conn.reply(m.chat, 
        `> . ﹡ ﹟ ✅ ׄ ⬭ *ʟɪsᴛᴀ ᴅᴇ sɪʟᴇɴᴄɪᴀᴅᴏs*\n\n` +
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 📭 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴇsᴛᴀᴅᴏ* :: No hay usuarios silenciados en este grupo`, m)
    }
    
    const chatMutes = global.db.data.chats[m.chat].mutes
    const mutedUsers = Object.keys(chatMutes)
    
    // Filtrar mutes expirados
    const now = Date.now()
    for (let user of mutedUsers) {
      const muteData = chatMutes[user]
      if (muteData.expiresAt && muteData.expiresAt < now) {
        delete chatMutes[user]
      }
    }
    
    // Obtener lista actualizada
    const currentMuted = Object.keys(chatMutes)
    
    if (currentMuted.length === 0) {
      return conn.reply(m.chat, 
        `> . ﹡ ﹟ ✅ ׄ ⬭ *ʟɪsᴛᴀ ᴅᴇ sɪʟᴇɴᴄɪᴀᴅᴏs*\n\n` +
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 📭 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴇsᴛᴀᴅᴏ* :: No hay usuarios silenciados en este grupo`, m)
    }
    
    let list = 
      `> . ﹡ ﹟ 🔇 ׄ ⬭ *ᴜsᴜᴀʀɪᴏs sɪʟᴇɴᴄɪᴀᴅᴏs*\n\n` +
      `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 📋 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
      `ׅㅤ𓏸𓈒ㅤׄ *ᴛᴏᴛᴀʟ* :: ${currentMuted.length} usuarios\n\n` +
      `> ✦ *ʟɪsᴛᴀ* ::\n\n`
    
    for (let user of currentMuted) {
      const data = chatMutes[user]
      const name = data.name || user.split('@')[0]
      const mutedBy = data.mutedBy ? `@${data.mutedBy.split('@')[0]}` : 'Desconocido'
      const mutedAt = new Date(data.mutedAt).toLocaleString()
      
      if (data.expiresAt) {
        const expiresIn = data.expiresAt - now
        const timeLeft = expiresIn > 0 ? `⏳ ${formatTime(expiresIn)}` : '⭕ Expirado'
        list += 
          `> . ﹡ ﹟ 🔇 ׄ ⬭ *ᴜsᴜᴀʀɪᴏ*\n` +
          `ׅㅤ𓏸𓈒ㅤׄ *ɴᴏᴍʙʀᴇ* :: @${user.split('@')[0]} (${name})\n` +
          `ׅㅤ𓏸𓈒ㅤׄ *ᴛɪᴇᴍᴘᴏ* :: ${timeLeft}\n` +
          `ׅㅤ𓏸𓈒ㅤׄ *sɪʟᴇɴᴄɪᴀᴅᴏ ᴘᴏʀ* :: ${mutedBy}\n` +
          `ׅㅤ𓏸𓈒ㅤׄ *ғᴇᴄʜᴀ* :: ${mutedAt}\n\n`
      } else {
        list += 
          `> . ﹡ ﹟ 🔇 ׄ ⬭ *ᴜsᴜᴀʀɪᴏ*\n` +
          `ׅㅤ𓏸𓈒ㅤׄ *ɴᴏᴍʙʀᴇ* :: @${user.split('@')[0]} (${name})\n` +
          `ׅㅤ𓏸𓈒ㅤׄ *ᴛɪᴇᴍᴘᴏ* :: ♾️ Indefinido\n` +
          `ׅㅤ𓏸𓈒ㅤׄ *sɪʟᴇɴᴄɪᴀᴅᴏ ᴘᴏʀ* :: ${mutedBy}\n` +
          `ׅㅤ𓏸𓈒ㅤׄ *ғᴇᴄʜᴀ* :: ${mutedAt}\n\n`
      }
    }
    
    conn.reply(m.chat, list.trim(), m, { mentions: currentMuted })
    
  } catch (e) {
    console.error('Error en mutelist:', e)
    conn.reply(m.chat, 
      `> . ﹡ ﹟ ❌ ׄ ⬭ *ᴇʀʀᴏʀ*\n\n` +
      `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ ⚠️ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
      `ׅㅤ𓏸𓈒ㅤׄ *ᴅᴇᴛᴀʟʟᴇ* :: Error al obtener la lista de silenciados`, m)
  }
}

function formatTime(ms) {
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

handler.help = ['mutelist']
handler.tags = ['grupo']
handler.command = ['mutelist', 'listamute', 'muteados']
handler.admin = true
handler.group = true

export default handler
