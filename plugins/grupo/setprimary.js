import ws from 'ws'

const handler = async (m, { conn, usedPrefix, args }) => {
    const chat = global.db.data.chats[m.chat]

    // ============= SETPRIMARY OFF =============
    if (args[0]?.toLowerCase() === 'off') {
        if (!chat.primaryBot) {
            return conn.reply(m.chat,
                `> . ﹡ ﹟ ⚠️ ׄ ⬭ *sɪɴ ʙᴏᴛ ᴘʀɪɴᴄɪᴘᴀʟ*\n\n` +
                `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ ℹ️ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
                `ׅㅤ𓏸𓈒ㅤׄ *ᴇsᴛᴀᴅᴏ* :: No hay bot principal configurado en este grupo`, m)
        }
        const anterior = chat.primaryBot
        chat.primaryBot = null
        return conn.reply(m.chat,
            `> . ﹡ ﹟ ✅ ׄ ⬭ *ʙᴏᴛ ᴘʀɪɴᴄɪᴘᴀʟ ʀᴇᴍᴏᴠɪᴅᴏ*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 🔓 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴀɴᴛᴇʀɪᴏʀ* :: @${anterior.split('@')[0]}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴇsᴛᴀᴅᴏ* :: Todos los bots pueden responder ahora\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ɢʀᴜᴘᴏ* :: ${await conn.getName(m.chat)}`, m, { mentions: [anterior] })
    }

    // ============= VER ESTADO ACTUAL =============
    if (args[0]?.toLowerCase() === 'status' || args[0]?.toLowerCase() === 'info') {
        if (!chat.primaryBot) {
            return conn.reply(m.chat,
                `> . ﹡ ﹟ 🤖 ׄ ⬭ *ᴇsᴛᴀᴅᴏ ʙᴏᴛ ᴘʀɪɴᴄɪᴘᴀʟ*\n\n` +
                `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ ℹ️ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
                `ׅㅤ𓏸𓈒ㅤׄ *ᴇsᴛᴀᴅᴏ* :: Sin bot principal — todos los bots responden`, m)
        }

        // Verificar si el bot principal sigue conectado
        const activeBots = getActiveBots()
        const isActive = activeBots.includes(chat.primaryBot)

        return conn.reply(m.chat,
            `> . ﹡ ﹟ 🤖 ׄ ⬭ *ᴇsᴛᴀᴅᴏ ʙᴏᴛ ᴘʀɪɴᴄɪᴘᴀʟ*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ ${isActive ? '🟢' : '🔴'} ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ʙᴏᴛ* :: @${chat.primaryBot.split('@')[0]}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴄᴏɴᴇxɪᴏ́ɴ* :: ${isActive ? 'Conectado ✅' : 'Desconectado ❌ (se desactivó automáticamente)'}`, m, { mentions: [chat.primaryBot] })
    }

    // ============= LISTAR BOTS DISPONIBLES =============
    const activeBots = getActiveBots()

    if (!args[0] && !m.quoted && !(await m.mentionedJid)?.length) {
        if (activeBots.length === 0) {
            return conn.reply(m.chat,
                `> . ﹡ ﹟ ⚠️ ׄ ⬭ *sɪɴ ʙᴏᴛs ᴅɪsᴘᴏɴɪʙʟᴇs*\n\n` +
                `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ ℹ️ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
                `ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴏ* :: ${usedPrefix}setprimary @bot\n` +
                `ׅㅤ𓏸𓈒ㅤׄ *ᴅᴇsᴀᴄᴛɪᴠᴀʀ* :: ${usedPrefix}setprimary off\n` +
                `ׅㅤ𓏸𓈒ㅤׄ *ᴇsᴛᴀᴅᴏ* :: ${usedPrefix}setprimary status`, m)
        }

        const botList = activeBots.map(jid => `ׅㅤ𓏸𓈒ㅤׄ @${jid.split('@')[0]}`).join('\n')
        const currentPrimary = chat.primaryBot
            ? `ׅㅤ𓏸𓈒ㅤׄ *ᴀᴄᴛᴜᴀʟ* :: @${chat.primaryBot.split('@')[0]}\n\n`
            : `ׅㅤ𓏸𓈒ㅤׄ *ᴀᴄᴛᴜᴀʟ* :: Sin bot principal\n\n`

        return conn.reply(m.chat,
            `> . ﹡ ﹟ 🤖 ׄ ⬭ *sᴇᴛᴘʀɪᴍᴀʀʏ*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ ⚙️ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
            currentPrimary +
            `> ✦ *ʙᴏᴛs ᴅɪsᴘᴏɴɪʙʟᴇs*\n` +
            botList + `\n\n` +
            `> ✧ *ᴄᴏᴍᴀɴᴅᴏs*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴇsᴛᴀʙʟᴇᴄᴇʀ* :: ${usedPrefix}setprimary @bot\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴅᴇsᴀᴄᴛɪᴠᴀʀ* :: ${usedPrefix}setprimary off`, m, { mentions: activeBots })
    }

    // ============= ESTABLECER BOT PRINCIPAL =============
    const mentionedJid = await m.mentionedJid
    const who = mentionedJid?.[0] || (m.quoted ? await m.quoted.sender : null)

    if (!who) return conn.reply(m.chat,
        `> . ﹡ ﹟ 🤖 ׄ ⬭ *sᴇᴛᴘʀɪᴍᴀʀʏ*\n\n` +
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ ⚠️ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴏ* :: ${usedPrefix}setprimary @subbot\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴅᴇsᴀᴄᴛɪᴠᴀʀ* :: ${usedPrefix}setprimary off\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴇsᴛᴀᴅᴏ* :: ${usedPrefix}setprimary status`, m)

    if (!activeBots.includes(who)) return conn.reply(m.chat,
        `> . ﹡ ﹟ ⚠️ ׄ ⬭ *sᴏᴄᴋᴇᴛ ɪɴᴠᴀ́ʟɪᴅᴏ*\n\n` +
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 🚫 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴜᴀʀɪᴏ* :: @${who.split('@')[0]}\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴇsᴛᴀᴅᴏ* :: No es un bot activo de ${global.botname || 'ᴀsᴛᴀ-ʙᴏᴛ'}`, m, { mentions: [who] })

    if (chat.primaryBot === who) return conn.reply(m.chat,
        `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ʏᴀ ᴇs ᴘʀɪɴᴄɪᴘᴀʟ*\n\n` +
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ ⏳ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ʙᴏᴛ* :: @${who.split('@')[0]}\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴇsᴛᴀᴅᴏ* :: Ya está establecido como principal en este grupo`, m, { mentions: [who] })

    try {
        chat.primaryBot = who
        conn.reply(m.chat,
            `> . ﹡ ﹟ 🤖 ׄ ⬭ *ʙᴏᴛ ᴘʀɪɴᴄɪᴘᴀʟ ᴇsᴛᴀʙʟᴇᴄɪᴅᴏ*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ ✅ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ɴᴜᴇᴠᴏ ʙᴏᴛ* :: @${who.split('@')[0]}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ɢʀᴜᴘᴏ* :: ${await conn.getName(m.chat)}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴀᴅᴍɪɴ* :: @${m.sender.split('@')[0]}\n\n` +
            `> ✧ *ɴᴏᴛᴀ* :: Solo este bot responderá en este grupo\n` +
            `> ✧ *ᴅᴇsᴀᴄᴛɪᴠᴀʀ* :: ${usedPrefix}setprimary off`, m, { mentions: [who, m.sender] })
    } catch (e) {
        conn.reply(m.chat,
            `> . ﹡ ﹟ ❌ ׄ ⬭ *ᴇʀʀᴏʀ*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ ⚠️ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴅᴇᴛᴀʟʟᴇ* :: ${e.message}`, m)
    }
}

// Función auxiliar para obtener bots activos
function getActiveBots() {
    const bots = [...new Set([
        ...global.conns
            .filter(c => c.user && c.ws?.socket && c.ws.socket.readyState !== 3)
            .map(c => c.user.jid)
    ])]
    if (global.conn?.user?.jid && !bots.includes(global.conn.user.jid)) {
        bots.push(global.conn.user.jid)
    }
    return bots
}

handler.help = ['setprimary']
handler.tags = ['grupo']
handler.command = ['setprimary']
handler.group = true
handler.admin = true

export default handler