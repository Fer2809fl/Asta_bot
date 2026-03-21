// Sistema para iniciar/parar el comando kicknum
global.kicknumRunning = global.kicknumRunning || {}

const handler = async (m, { conn, args, participants, usedPrefix, command, isBotAdmin }) => {
  try {
    const bot = global.db.data.settings[conn.user.jid] || {}

    // Comando para detener
    if (command === 'stopkicknum') {
      if (!global.kicknumRunning[m.chat]) 
        return m.reply(
          `> . ﹡ ﹟ ⚠️ ׄ ⬭ *sɪɴ ᴘʀᴏᴄᴇsᴏ*\n\n` +
          `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 🛑 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
          `ׅㅤ𓏸𓈒ㅤׄ *ᴇsᴛᴀᴅᴏ* :: No hay ningún proceso de kicknum en ejecución`)
      
      global.kicknumRunning[m.chat] = false
      return m.reply(
        `> . ﹡ ﹟ ✅ ׄ ⬭ *ᴘʀᴏᴄᴇsᴏ ᴅᴇᴛᴇɴɪᴅᴏ*\n\n` +
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 🛑 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴀᴄᴄɪᴏ́ɴ* :: Eliminación detenida correctamente`)
    }

    // Validaciones para el comando kicknum y listnum
    if (!args[0]) return conn.reply(m.chat, 
      `> . ﹡ ﹟ 📞 ׄ ⬭ *ᴋɪᴄᴋɴᴜᴍ / ʟɪsᴛɴᴜᴍ*\n\n` +
      `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ ⚠️ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
      `ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴏ* :: ${usedPrefix}${command} <prefijo>\n` +
      `ׅㅤ𓏸𓈒ㅤׄ *ᴇᴊᴇᴍᴘʟᴏ* :: ${usedPrefix}${command} 212`, m)
      
    if (isNaN(args[0])) return conn.reply(m.chat, 
      `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴘʀᴇғɪᴊᴏ ɪɴᴠᴀ́ʟɪᴅᴏ*\n\n` +
      `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 🚫 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
      `ׅㅤ𓏸𓈒ㅤׄ *ᴅᴇᴛᴀʟʟᴇ* :: Solo se permiten números`, m)

    const lol = args[0].replace(/[+]/g, '')
    const ps = participants.map(u => u.id).filter(v => v !== conn.user.jid && v.startsWith(lol))

    if (ps.length === 0) return m.reply(
      `> . ﹡ ﹟ 📭 ׄ ⬭ *sɪɴ ʀᴇsᴜʟᴛᴀᴅᴏs*\n\n` +
      `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 🔍 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
      `ׅㅤ𓏸𓈒ㅤׄ *ᴘʀᴇғɪᴊᴏ* :: +${lol}\n` +
      `ׅㅤ𓏸𓈒ㅤׄ *ᴇsᴛᴀᴅᴏ* :: No hay números con este prefijo en el grupo`)

    const numeros = ps.map(v => `ׅㅤ𓏸𓈒ㅤׄ 📱 @${v.replace(/@.+/, '')}`)
    const delay = ms => new Promise(res => setTimeout(res, ms))

    switch (command) {
      case 'listanum':
      case 'listnum':
        return conn.reply(m.chat, 
          `> . ﹡ ﹟ 📋 ׄ ⬭ *ʟɪsᴛᴀ ᴅᴇ ɴᴜ́ᴍᴇʀᴏs*\n\n` +
          `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 📞 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
          `ׅㅤ𓏸𓈒ㅤׄ *ᴘʀᴇғɪᴊᴏ* :: +${lol}\n` +
          `ׅㅤ𓏸𓈒ㅤׄ *ᴛᴏᴛᴀʟ* :: ${ps.length} números\n\n` +
          `> ✦ *ʟɪsᴛᴀ* ::\n${numeros.join('\n')}`, m, { mentions: ps })

      case 'kicknum': {
        if (!isBotAdmin) return m.reply(
          `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴘᴇʀᴍɪsᴏs ɪɴsᴜғɪᴄɪᴇɴᴛᴇs*\n\n` +
          `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 🛡️ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
          `ׅㅤ𓏸𓈒ㅤׄ *ʀᴇǫᴜɪsɪᴛᴏ* :: El bot necesita ser administrador`)
          
        if (!bot.restrict) return m.reply(
          `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ʀᴇsᴛʀɪᴄᴄɪᴏ́ɴ ᴅᴇsᴀᴄᴛɪᴠᴀᴅᴀ*\n\n` +
          `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 🔒 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
          `ׅㅤ𓏸𓈒ㅤׄ *ᴇsᴛᴀᴅᴏ* :: El modo restricción está desactivado`)

        if (global.kicknumRunning[m.chat]) 
          return m.reply(
            `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴘʀᴏᴄᴇsᴏ ᴇɴ ᴄᴜʀsᴏ*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ ⏳ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴀᴄᴄɪᴏ́ɴ* :: Ya hay una eliminación activa\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴅᴇᴛᴇɴᴇʀ* :: ${usedPrefix}stopkicknum`)

        global.kicknumRunning[m.chat] = true
        m.reply(
          `> . ﹡ ﹟ 🚨 ׄ ⬭ *ᴇʟɪᴍɪɴᴀᴄɪᴏ́ɴ ɪɴɪᴄɪᴀᴅᴀ*\n\n` +
          `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ ⚠️ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
          `ׅㅤ𓏸𓈒ㅤׄ *ᴘʀᴇғɪᴊᴏ* :: +${lol}\n` +
          `ׅㅤ𓏸𓈒ㅤׄ *ᴛᴀʀɢᴇᴛ* :: ${ps.length} usuarios\n` +
          `ׅㅤ𓏸𓈒ㅤׄ *ɪɴᴛᴇʀᴠᴀʟᴏ* :: 3 segundos\n` +
          `ׅㅤ𓏸𓈒ㅤׄ *ᴅᴇᴛᴇɴᴇʀ* :: ${usedPrefix}stopkicknum`)

        for (const user of ps) {
          if (!global.kicknumRunning[m.chat]) {
            m.reply(
              `> . ﹡ ﹟ 🛑 ׄ ⬭ *ᴘʀᴏᴄᴇsᴏ ᴅᴇᴛᴇɴɪᴅᴏ*\n\n` +
              `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ ⏹️ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
              `ׅㅤ𓏸𓈒ㅤׄ *ʀᴀᴢᴏ́ɴ* :: Detenido por el administrador`)
            break
          }

          try {
            await conn.groupParticipantsUpdate(m.chat, [user], 'remove')
            await delay(3000)
          } catch (err) {
            console.error(err)
          }
        }

        global.kicknumRunning[m.chat] = false
        m.reply(
          `> . ﹡ ﹟ ✅ ׄ ⬭ *ᴘʀᴏᴄᴇsᴏ ғɪɴᴀʟɪᴢᴀᴅᴏ*\n\n` +
          `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 🧹 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
          `ׅㅤ𓏸𓈒ㅤׄ *ᴘʀᴇғɪᴊᴏ* :: +${lol}\n` +
          `ׅㅤ𓏸𓈒ㅤׄ *ᴇsᴛᴀᴅᴏ* :: Eliminación completada`)
        break
      }
    }

  } catch (e) {
    console.error(e)
    m.reply(
      `> . ﹡ ﹟ ❌ ׄ ⬭ *ᴇʀʀᴏʀ*\n\n` +
      `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ ⚠️ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
      `ׅㅤ𓏸𓈒ㅤׄ *ᴅᴇᴛᴀʟʟᴇ* :: ${e.message}`)
  }
}

// Definición de comandos
handler.command = ['kicknum', 'listnum', 'listanum', 'stopkicknum']
handler.group = true
handler.botAdmin = true
handler.admin = true
handler.fail = null

export default handler
