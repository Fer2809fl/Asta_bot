let handler = async (m, { conn, usedPrefix, command, args, isROwner, isOwner, isAdmin }) => {
    let chat = global.db.data.chats[m.chat]

    if (command === 'bot') {
        // Info general si no se pone argumento
        if (args.length === 0) {
            const estado = chat.isBanned ? '⭕ ᴅᴇsᴀᴄᴛɪᴠᴀᴅᴏ' : '🟢 ᴀᴄᴛɪᴠᴀᴅᴏ'
            const info = 
                `> . ﹡ ﹟ 🤖 ׄ ⬭ *ɢᴇsᴛɪᴏ́ɴ ᴅᴇʟ ʙᴏᴛ*\n\n` +
                `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ ⚙️ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
                `ׅㅤ𓏸𓈒ㅤׄ *ᴇsᴛᴀᴅᴏ* :: ${estado}\n\n` +
                `> ✦ *ᴄᴏᴍᴀɴᴅᴏs* ::\n` +
                `ׅㅤ𓏸𓈒ㅤׄ *ᴀᴄᴛɪᴠᴀʀ* :: ${usedPrefix}bot on\n` +
                `ׅㅤ𓏸𓈒ㅤׄ *ᴅᴇsᴀᴄᴛɪᴠᴀʀ* :: ${usedPrefix}bot off`
            return conn.reply(m.chat, info, m)
        }

        // Solo owners y admins pueden usar bot on/off
        if (!isROwner && !isOwner && !isAdmin) {
            return conn.reply(m.chat,
                `> . ﹡ ﹟ 🔒 ׄ ⬭ *ᴀᴄᴄᴇsᴏ ᴅᴇɴᴇɢᴀᴅᴏ*\n\n` +
                `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 🚫 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
                `ׅㅤ𓏸𓈒ㅤׄ *Motivo* :: Solo los administradores pueden gestionar el bot.`, m)
        }

        // Desactivar Bot
        if (args[0].toLowerCase() === 'off') {
            // El owner principal SIEMPRE puede desactivar
            // Los admins normales NO pueden desactivar si ya está activo y el owner no lo permite
            if (chat.isBanned) {
                return conn.reply(m.chat, 
                    `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴀᴅᴠᴇʀᴛᴇɴᴄɪᴀ*\n\n` +
                    `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 🚫 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
                    `ׅㅤ𓏸𓈒ㅤׄ *ᴇsᴛᴀᴅᴏ* :: El bot ya estaba desactivado`, m)
            }
            chat.isBanned = true
            return conn.reply(m.chat, 
                `> . ﹡ ﹟ 🚫 ׄ ⬭ *ʙᴏᴛ ᴅᴇsᴀᴄᴛɪᴠᴀᴅᴏ*\n\n` +
                `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ ⭕ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
                `ׅㅤ𓏸𓈒ㅤׄ *ᴀᴄᴄɪᴏ́ɴ* :: Has desactivado el bot correctamente\n` +
                `ׅㅤ𓏸𓈒ㅤׄ *ɢʀᴜᴘᴏ* :: ${await conn.getName(m.chat)}`, m)
        } 
        // Activar Bot
        else if (args[0].toLowerCase() === 'on') {
            if (!chat.isBanned) {
                return conn.reply(m.chat, 
                    `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴀᴅᴠᴇʀᴛᴇɴᴄɪᴀ*\n\n` +
                    `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 🟢 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
                    `ׅㅤ𓏸𓈒ㅤׄ *ᴇsᴛᴀᴅᴏ* :: El bot ya estaba activado`, m)
            }
            chat.isBanned = false
            return conn.reply(m.chat, 
                `> . ﹡ ﹟ ✅ ׄ ⬭ *ʙᴏᴛ ᴀᴄᴛɪᴠᴀᴅᴏ*\n\n` +
                `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 🟢 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
                `ׅㅤ𓏸𓈒ㅤׄ *ᴀᴄᴄɪᴏ́ɴ* :: Has activado el bot correctamente\n` +
                `ׅㅤ𓏸𓈒ㅤׄ *ɢʀᴜᴘᴏ* :: ${await conn.getName(m.chat)}`, m)
        }
    }
}

handler.help = ['bot']
handler.tags = ['grupo']
handler.command = ['bot']
// REMOVIDO handler.admin = true — el check de permisos se hace dentro del handler
// para que el owner siempre pueda activarlo aunque el bot esté "desactivado"

export default handler