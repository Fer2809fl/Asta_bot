import { areJidsSameUser } from '@whiskeysockets/baileys'

const handler = async (m, { conn, args, usedPrefix, command, groupMetadata }) => {
    // Verificar permisos
    if (!m.isGroup) return m.reply(
        `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴄᴏᴍᴀɴᴅᴏ ᴅᴇ ɢʀᴜᴘᴏ*\n\n` +
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 🚫 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴅᴇᴛᴀʟʟᴇ* :: Este comando solo funciona en grupos`)
    
    const botAdmin = await conn.groupMetadata(m.chat).then(m => m.participants.find(p => areJidsSameUser(p.id, conn.user.jid)))
    if (!botAdmin || !botAdmin.admin) return m.reply(
        `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴘᴇʀᴍɪsᴏs ɪɴsᴜғɪᴄɪᴇɴᴛᴇs*\n\n` +
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 🛡️ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ʀᴇǫᴜɪsɪᴛᴏ* :: Necesito ser administrador para usar este comando`)
    
    const senderAdmin = m.isGroup ? await conn.groupMetadata(m.chat).then(m => m.participants.find(p => areJidsSameUser(p.id, m.sender))) : null
    if (!senderAdmin || !senderAdmin.admin) return m.reply(
        `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴀᴅᴍɪɴ ʀᴇǫᴜᴇʀɪᴅᴏ*\n\n` +
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 👤 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ʀᴇǫᴜɪsɪᴛᴏ* :: Solo los administradores pueden usar este comando`)

    // Obtener usuario a promover
    let who = m.mentionedJid && m.mentionedJid[0] 
        ? m.mentionedJid[0] 
        : m.quoted ? m.quoted.sender 
        : args[0] ? (args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net') 
        : null

    if (!who) return m.reply(
        `> . ﹡ ﹟ ⬆️ ׄ ⬭ *ᴘʀᴏᴍᴏᴠᴇʀ ᴀ ᴀᴅᴍɪɴ*\n\n` +
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ ⚠️ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴏ* :: ${usedPrefix}${command} @usuario\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴏ* :: Responde a un mensaje con ${usedPrefix}${command}`)

    // Verificar que no se promueva a sí mismo
    if (areJidsSameUser(who, m.sender)) return m.reply(
        `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴀᴄᴄɪᴏ́ɴ ɪɴᴠᴀ́ʟɪᴅᴀ*\n\n` +
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 🚫 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴍᴏᴛɪᴠᴏ* :: No puedes promoverte a ti mismo`)
    
    // Verificar que no sea el bot
    if (areJidsSameUser(who, conn.user.jid)) return m.reply(
        `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴀᴄᴄɪᴏ́ɴ ɪɴᴠᴀ́ʟɪᴅᴀ*\n\n` +
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 🤖 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴍᴏᴛɪᴠᴏ* :: No puedo promoverme a mí mismo`)

    try {
        const participant = await conn.groupMetadata(m.chat).then(m => m.participants.find(p => areJidsSameUser(p.id, who)))
        
        if (!participant) return m.reply(
            `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴜsᴜᴀʀɪᴏ ɴᴏ ᴇɴᴄᴏɴᴛʀᴀᴅᴏ*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 🔍 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴇsᴛᴀᴅᴏ* :: El usuario no está en el grupo`)
            
        if (participant.admin) return m.reply(
            `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ʏᴀ ᴇs ᴀᴅᴍɪɴ*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 🛡️ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴇsᴛᴀᴅᴏ* :: El usuario ya es administrador`)

        await conn.groupParticipantsUpdate(m.chat, [who], 'promote')
        
        // Obtener nombre del usuario
        let name = who.split('@')[0]
        try {
            const contact = await conn.getName(who)
            if (contact) name = contact
        } catch {}

        m.reply(
            `> . ﹡ ﹟ ⬆️ ׄ ⬭ *ᴀᴅᴍɪɴɪsᴛʀᴀᴅᴏʀ ᴘʀᴏᴍᴏᴠɪᴅᴏ*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 👑 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴜᴀʀɪᴏ* :: ${name}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ɴᴜ́ᴍᴇʀᴏ* :: @${who.split('@')[0]}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴀᴄᴄɪᴏ́ɴ* :: Ascendido a administrador\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴘᴏʀ* :: @${m.sender.split('@')[0]}`, m, { mentions: [who, m.sender] })
        
    } catch (error) {
        console.error('Error en promote:', error)
        m.reply(
            `> . ﹡ ﹟ ❌ ׄ ⬭ *ᴇʀʀᴏʀ*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ ⚠️ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴅᴇᴛᴀʟʟᴇ* :: ${error.message || 'No se pudo promover al usuario'}`)
    }
}

handler.help = ['promote', 'ascender', 'admin', 'daradmin']
handler.tags = ['group']
handler.command = ['promote', 'ascender', 'admin', 'daradmin', 'darpoder']
handler.admin = true
handler.group = true
handler.botAdmin = true

export default handler
