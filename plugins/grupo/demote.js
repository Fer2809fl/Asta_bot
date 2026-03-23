import { areJidsSameUser } from '@whiskeysockets/baileys'

const handler = async (m, { conn, usedPrefix, command, text, groupMetadata }) => {
    // Verificar que se está en un grupo
    if (!m.isGroup) return conn.reply(m.chat, 
        `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴄᴏᴍᴀɴᴅᴏ ᴅᴇ ɢʀᴜᴘᴏ*\n\n` +
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 🚫 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴅᴇᴛᴀʟʟᴇ* :: Este comando solo funciona en grupos`, m)
    
    // Obtener metadata actualizada del grupo
    let metadata
    try {
        metadata = await conn.groupMetadata(m.chat)
    } catch (e) {
        return conn.reply(m.chat, 
            `> . ﹡ ﹟ ❌ ׄ ⬭ *ᴇʀʀᴏʀ*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ ⚠️ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴅᴇᴛᴀʟʟᴇ* :: No se pudo obtener información del grupo`, m)
    }
    
    const participants = metadata.participants || []
    
    // VERIFICAR QUE EL BOT ES ADMIN (CORRECCIÓN PRINCIPAL)
    const botJid = conn.user.jid
    const botParticipant = participants.find(p => areJidsSameUser(p.id, botJid))
    const isBotAdmin = botParticipant && (botParticipant.admin === 'admin' || botParticipant.admin === 'superadmin')
    
    if (!isBotAdmin) return conn.reply(m.chat, 
        `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ɴᴇᴄᴇsɪᴛᴏ ᴘᴇʀᴍɪsᴏs*\n\n` +
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 🤖 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴍᴏᴛɪᴠᴏ* :: Necesito ser administrador para degradar usuarios\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *sᴏʟᴜᴄɪᴏ́ɴ* :: Promuéveme a administrador primero`, m)
    
    // VERIFICAR QUE EL USUARIO QUE EJECUTA ES ADMIN
    const senderParticipant = participants.find(p => areJidsSameUser(p.id, m.sender))
    const isSenderAdmin = senderParticipant && (senderParticipant.admin === 'admin' || senderParticipant.admin === 'superadmin')
    
    if (!isSenderAdmin) return conn.reply(m.chat, 
        `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴀᴅᴍɪɴ ʀᴇǫᴜᴇʀɪᴅᴏ*\n\n` +
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 👤 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴅᴇᴛᴀʟʟᴇ* :: Solo los administradores pueden usar este comando`, m)
    
    // Obtener usuario a degradar (CORREGIDO: sin await innecesarios)
    let mentionedJid = m.mentionedJid
    let user = mentionedJid && mentionedJid.length ? mentionedJid[0] : 
               m.quoted ? m.quoted.sender : 
               text ? (text.replace(/[^0-9]/g, '') + '@s.whatsapp.net') : 
               null
    
    if (!user) return conn.reply(m.chat, 
        `> . ﹡ ﹟ ⬇️ ׄ ⬭ *ᴅᴇɢʀᴀᴅᴀʀ ᴀᴅᴍɪɴ*\n\n` +
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ ⚠️ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴏ* :: ${usedPrefix}${command} @usuario\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴏ* :: Responde a un mensaje con ${usedPrefix}${command}`, m)
    
    // Verificar que el usuario está en el grupo
    const targetParticipant = participants.find(p => areJidsSameUser(p.id, user))
    if (!targetParticipant) return conn.reply(m.chat, 
        `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴜsᴜᴀʀɪᴏ ɴᴏ ᴇɴᴄᴏɴᴛʀᴀᴅᴏ*\n\n` +
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 🔍 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴇsᴛᴀᴅᴏ* :: El usuario no está en el grupo`, m)
    
    // Verificar que el usuario es admin
    const isTargetAdmin = targetParticipant.admin === 'admin' || targetParticipant.admin === 'superadmin'
    if (!isTargetAdmin) return conn.reply(m.chat, 
        `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ɴᴏ ᴇs ᴀᴅᴍɪɴ*\n\n` +
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 🛡️ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴇsᴛᴀᴅᴏ* :: El usuario no es administrador`, m)
    
    // Verificar que no se intenta degradar al bot mismo
    if (areJidsSameUser(user, conn.user.jid)) return conn.reply(m.chat, 
        `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴀᴄᴄɪᴏ́ɴ ɴᴏ ᴘᴇʀᴍɪᴛɪᴅᴀ*\n\n` +
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 🤖 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴍᴏᴛɪᴠᴏ* :: No puedes degradar al bot`, m)
    
    // Verificar que no se intenta degradar al creador del grupo
    const ownerGroup = metadata.owner || m.chat.split`-`[0] + '@s.whatsapp.net'
    if (areJidsSameUser(user, ownerGroup)) return conn.reply(m.chat, 
        `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴀᴄᴄɪᴏ́ɴ ɴᴏ ᴘᴇʀᴍɪᴛɪᴅᴀ*\n\n` +
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 👑 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴍᴏᴛɪᴠᴏ* :: No puedes degradar al creador del grupo`, m)
    
    // Verificar que no se intenta degradar al propietario del bot
    const ownerBot = global.owner && global.owner[0] ? global.owner[0] + '@s.whatsapp.net' : null
    if (ownerBot && areJidsSameUser(user, ownerBot)) return conn.reply(m.chat, 
        `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴀᴄᴄɪᴏ́ɴ ɴᴏ ᴘᴇʀᴍɪᴛɪᴅᴀ*\n\n` +
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 🔒 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴍᴏᴛɪᴠᴏ* :: No puedes degradar al propietario del bot`, m)
    
    // Verificar que no se intenta degradar a un superadmin (creador)
    if (targetParticipant.admin === 'superadmin') return conn.reply(m.chat, 
        `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴀᴄᴄɪᴏ́ɴ ɴᴏ ᴘᴇʀᴍɪᴛɪᴅᴀ*\n\n` +
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 👑 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴍᴏᴛɪᴠᴏ* :: No se puede degradar al creador del grupo (superadmin)`, m)
    
    try {
        await conn.groupParticipantsUpdate(m.chat, [user], 'demote')
        
        // Obtener nombre del usuario
        let name = user.split('@')[0]
        try {
            const contact = await conn.getName(user)
            if (contact) name = contact
        } catch {}
        
        conn.reply(m.chat, 
            `> . ﹡ ﹟ ⬇️ ׄ ⬭ *ᴀᴅᴍɪɴ ᴅᴇɢʀᴀᴅᴀᴅᴏ*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ ✅ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴜᴀʀɪᴏ* :: ${name}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ɴᴜ́ᴍᴇʀᴏ* :: @${user.split('@')[0]}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴇsᴛᴀᴅᴏ* :: Descartado como administrador\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴀᴅᴍɪɴ* :: @${m.sender.split('@')[0]}`, m, { mentions: [user, m.sender] })
            
    } catch (e) {
        console.error('Error en demote:', e)
        conn.reply(m.chat, 
            `> . ﹡ ﹟ ❌ ׄ ⬭ *ᴇʀʀᴏʀ*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ ⚠️ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴅᴇᴛᴀʟʟᴇ* :: ${e.message || 'No se pudo degradar al usuario'}\n\n` +
            `> ✦ *ʀᴇᴘᴏʀᴛᴀʀ* :: ${usedPrefix}report`, m)
    }
}

handler.help = ['demote', 'degradar']
handler.tags = ['grupo']
handler.command = ['demote', 'degradar']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler
