import chalk from 'chalk'

const handler = async (m, { conn, usedPrefix, command, args, isOwner, isAdmin }) => {
    const chat = global.db.data.chats[m.chat]
    let type = command.toLowerCase()
    let isEnable = chat[type] !== undefined ? chat[type] : false

    if (args[0] === 'on' || args[0] === 'enable') {
        if (isEnable) return conn.reply(m.chat, `✅ El *${type}* ya estaba *activado* 😉`, m)
        isEnable = true
    } else if (args[0] === 'off' || args[0] === 'disable') {
        if (!isEnable) return conn.reply(m.chat, `❌ El *${type}* ya estaba *desactivado* 😅`, m)
        isEnable = false
    } else {
        return conn.reply(m.chat, `「✦」Un administrador puede activar o desactivar el *${command}* utilizando:\n\n🔹 _Activar_ » *${usedPrefix}${command} enable*\n🔹 _Desactivar_ » *${usedPrefix}${command} disable*\n\n💡 Estado actual » *${isEnable ? '✓ Activado' : '✗ Desactivado'}*`, m)
    }

    switch (type) {
        case 'welcome': case 'bienvenida':
            if (!m.isGroup) {
                if (!isOwner) { global.dfail('group', m, conn); throw false }
            } else if (!isAdmin) { global.dfail('admin', m, conn); throw false }
            chat.welcome = isEnable
            console.log(chalk.green(`[OPTIONS] welcome/bienvenida cambiado a ${isEnable} en ${m.chat}`))
            break
        case 'modoadmin': case 'onlyadmin':
            if (!m.isGroup) {
                if (!isOwner) { global.dfail('group', m, conn); throw false }
            } else if (!isAdmin) { global.dfail('admin', m, conn); throw false }
            chat.modoadmin = isEnable
            console.log(chalk.green(`[OPTIONS] modoadmin/onlyadmin cambiado a ${isEnable} en ${m.chat}`))
            break
        case 'detect': case 'alertas':
            if (!m.isGroup) {
                if (!isOwner) { global.dfail('group', m, conn); throw false }
            } else if (!isAdmin) { global.dfail('admin', m, conn); throw false }
            chat.detect = isEnable
            console.log(chalk.green(`[OPTIONS] detect/alertas cambiado a ${isEnable} en ${m.chat}`))
            break
        case 'antilink': case 'antienlace':
            if (!m.isGroup) {
                if (!isOwner) { global.dfail('group', m, conn); throw false }
            } else if (!isAdmin) { global.dfail('admin', m, conn); throw false }
            chat.antiLink = isEnable
            console.log(chalk.green(`[OPTIONS] antilink/antienlace cambiado a ${isEnable} en ${m.chat}`))
            break
        case 'nsfw': case 'modohorny':
            if (!m.isGroup) {
                if (!isOwner) { global.dfail('group', m, conn); throw false }
            } else if (!isAdmin) { global.dfail('admin', m, conn); throw false }
            chat.nsfw = isEnable
            console.log(chalk.green(`[OPTIONS] nsfw/modohorny cambiado a ${isEnable} en ${m.chat}`))
            break
        case 'economy': case 'economia':
            if (!m.isGroup) {
                if (!isOwner) { global.dfail('group', m, conn); throw false }
            } else if (!isAdmin) { global.dfail('admin', m, conn); throw false }
            chat.economy = isEnable
            console.log(chalk.green(`[OPTIONS] economy/economia cambiado a ${isEnable} en ${m.chat}`))
            break
        case 'rpg': case 'gacha':
            if (!m.isGroup) {
                if (!isOwner) { global.dfail('group', m, conn); throw false }
            } else if (!isAdmin) { global.dfail('admin', m, conn); throw false }
            chat.gacha = isEnable
            console.log(chalk.green(`[OPTIONS] rpg/gacha cambiado a ${isEnable} en ${m.chat}`))
            break
        case 'poke2': case 'pokesystem':
            if (!m.isGroup) {
                if (!isOwner) { global.dfail('group', m, conn); throw false }
            } else if (!isAdmin) { global.dfail('admin', m, conn); throw false }
            chat.pokes = isEnable
            console.log(chalk.green(`[OPTIONS] poke2/pokesystem cambiado a ${isEnable} en ${m.chat}`))
            break
    }

    chat[type] = isEnable
    conn.reply(m.chat, `🌟 Has *${isEnable ? 'activado' : 'desactivado'}* el *${type}* para este grupo ${isEnable ? '✨' : '⚠️'}`, m)
}

handler.help = ['welcome', 'bienvenida', 'modoadmin', 'onlyadmin', 'nsfw', 'modohorny', 'economy', 'economia', 'rpg', 'gacha', 'detect', 'alertas', 'antilink', 'antienlace', 'poke2', 'pokesystem']
handler.tags = ['nable']
handler.command = ['welcome', 'bienvenida', 'modoadmin', 'onlyadmin', 'nsfw', 'modohorny', 'economy', 'economia', 'rpg', 'gacha', 'detect', 'alertas', 'antilink', 'antienlace', 'poke2', 'pokesystem']
handler.group = true

export default handler