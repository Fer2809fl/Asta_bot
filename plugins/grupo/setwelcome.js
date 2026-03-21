import { fileURLToPath, pathToFileURL } from 'url'
import path from 'path'

const { buildWelcome, buildBye } = await import(
  pathToFileURL(process.cwd() + '/plugins/welcome-event.js').href
)

const handler = async (m, { conn, command, usedPrefix, text, groupMetadata }) => {
  const chat = global.db.data.chats[m.chat]

  if (command === 'setgp') {
    return m.reply(
      `> . ﹡ ﹟ ⚙️ ׄ ⬭ *ᴄᴏɴғɪɢᴜʀᴀᴄɪᴏ́ɴ ᴅᴇ ɢʀᴜᴘᴏ*\n\n` +
      `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 🛠️ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
      `ׅㅤ𓏸𓈒ㅤׄ *ᴄᴏᴍᴀɴᴅᴏs* ::\n\n` +
      `> ✦ *sᴇᴛᴡᴇʟᴄᴏᴍᴇ* ::\n` +
      `ׅㅤ𓏸𓈒ㅤׄ ${usedPrefix}setwelcome <texto>\n` +
      `ׅㅤ𓏸𓈒ㅤׄ Configurar mensaje de bienvenida\n\n` +
      `> ✦ *sᴇᴛʙʏᴇ* ::\n` +
      `ׅㅤ𓏸𓈒ㅤׄ ${usedPrefix}setbye <texto>\n` +
      `ׅㅤ𓏸𓈒ㅤׄ Configurar mensaje de despedida\n\n` +
      `> ✦ *ᴛᴇsᴛ* ::\n` +
      `ׅㅤ𓏸𓈒ㅤׄ ${usedPrefix}testwelcome\n` +
      `ׅㅤ𓏸𓈒ㅤׄ ${usedPrefix}testbye\n\n` +
      `> . ﹡ ﹟ 📋 ׄ ⬭ *ᴠᴀʀɪᴀʙʟᴇs*\n\n` +
      `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 📝 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
      `ׅㅤ𓏸𓈒ㅤׄ *{usuario}* :: Menciona al usuario\n` +
      `ׅㅤ𓏸𓈒ㅤׄ *{grupo}*   :: Nombre del grupo\n` +
      `ׅㅤ𓏸𓈒ㅤׄ *{desc}*    :: Descripción del grupo\n` +
      `ׅㅤ𓏸𓈒ㅤׄ *{cantidad}*:: Número de miembros\n\n` +
      `> ✧ *ᴡᴇʟᴄᴏᴍᴇ* :: ${usedPrefix}welcome enable/disable`
    )
  }

  if (command === 'setwelcome') {
    if (!text) {
      return m.reply(
        `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴛᴇxᴛᴏ ʀᴇǫᴜᴇʀɪᴅᴏ*\n\n` +
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 🚫 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴇʀʀᴏʀ* :: Falta el mensaje de bienvenida\n\n` +
        `> ✦ *ᴇᴊᴇᴍᴘʟᴏ* ::\n` +
        `ׅㅤ𓏸𓈒ㅤׄ ${usedPrefix}setwelcome Hola {usuario}!\n` +
        `ׅㅤ𓏸𓈒ㅤׄ Bienvenido a {grupo}`
      )
    }
    chat.sWelcome = text
    chat.welcome  = true
    return m.reply(
      `> . ﹡ ﹟ ✅ ׄ ⬭ *ʙɪᴇɴᴠᴇɴɪᴅᴀ ɢᴜᴀʀᴅᴀᴅᴀ*\n\n` +
      `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 🎉 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
      `ׅㅤ𓏸𓈒ㅤׄ *ᴍᴇɴsᴀᴊᴇ* :: ${text.substring(0, 50)}${text.length > 50 ? '...' : ''}\n\n` +
      `> ✧ *ᴘʀᴏʙᴀʀ* :: ${usedPrefix}testwelcome`
    )
  }

  if (command === 'setbye') {
    if (!text) {
      return m.reply(
        `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴛᴇxᴛᴏ ʀᴇǫᴜᴇʀɪᴅᴏ*\n\n` +
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 🚫 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴇʀʀᴏʀ* :: Falta el mensaje de despedida\n\n` +
        `> ✦ *ᴇᴊᴇᴍᴘʟᴏ* ::\n` +
        `ׅㅤ𓏸𓈒ㅤׄ ${usedPrefix}setbye Adios {usuario}`
      )
    }
    chat.sBye    = text
    chat.welcome = true
    return m.reply(
      `> . ﹡ ﹟ ✅ ׄ ⬭ *ᴅᴇsᴘᴇᴅɪᴅᴀ ɢᴜᴀʀᴅᴀᴅᴀ*\n\n` +
      `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 👋 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
      `ׅㅤ𓏸𓈒ㅤׄ *ᴍᴇɴsᴀᴊᴇ* :: ${text.substring(0, 50)}${text.length > 50 ? '...' : ''}\n\n` +
      `> ✧ *ᴘʀᴏʙᴀʀ* :: ${usedPrefix}testbye`
    )
  }

  if (command === 'testwelcome') {
    await m.react('🕒')
    if (!chat.sWelcome || chat.sWelcome.trim() === '') {
      await m.reply(
        `> . ﹡ ﹟ ⚠️ ׄ ⬭ *sɪɴ ᴄᴏɴғɪɢᴜʀᴀᴄɪᴏ́ɴ*\n\n` +
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 📭 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴇsᴛᴀᴅᴏ* :: Usando diseño predeterminado\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴄᴏɴғɪɢᴜʀᴀʀ* :: ${usedPrefix}setwelcome <texto>`)
    }
    try {
      const grupoInfo = await conn.groupMetadata(m.chat).catch(() => groupMetadata)
      const { imageBuffer, caption, mentions } = await buildWelcome(conn, m.sender, grupoInfo, chat)
      await conn.sendMessage(m.chat, { image: imageBuffer, caption, mentions }, { quoted: m })
      await m.react('✅')
    } catch (error) {
      console.error('Error en testwelcome:', error)
      await m.reply(
        `> . ﹡ ﹟ ❌ ׄ ⬭ *ᴇʀʀᴏʀ*\n\n` +
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ ⚠️ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴅᴇᴛᴀʟʟᴇ* :: ${error.message}`)
      await m.react('❌')
    }
    return
  }

  if (command === 'testbye') {
    await m.react('🕒')
    if (!chat.sBye || chat.sBye.trim() === '') {
      await m.reply(
        `> . ﹡ ﹟ ⚠️ ׄ ⬭ *sɪɴ ᴄᴏɴғɪɢᴜʀᴀᴄɪᴏ́ɴ*\n\n` +
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 📭 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴇsᴛᴀᴅᴏ* :: Usando diseño predeterminado\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴄᴏɴғɪɢᴜʀᴀʀ* :: ${usedPrefix}setbye <texto>`)
    }
    try {
      const grupoInfo = await conn.groupMetadata(m.chat).catch(() => groupMetadata)
      const { imageBuffer, caption, mentions } = await buildBye(conn, m.sender, grupoInfo, chat)
      await conn.sendMessage(m.chat, { image: imageBuffer, caption, mentions }, { quoted: m })
      await m.react('✅')
    } catch (error) {
      console.error('Error en testbye:', error)
      await m.reply(
        `> . ﹡ ﹟ ❌ ׄ ⬭ *ᴇʀʀᴏʀ*\n\n` +
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ ⚠️ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴅᴇᴛᴀʟʟᴇ* :: ${error.message}`)
      await m.react('❌')
    }
    return
  }
}

handler.help    = ['setwelcome', 'setbye', 'testwelcome', 'testbye', 'setgp']
handler.tags    = ['group']
handler.command = ['setwelcome', 'setbye', 'testwelcome', 'testbye', 'setgp']
handler.admin    = true
handler.group    = true
handler.botAdmin = true

export default handler
