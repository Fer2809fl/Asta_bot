import { areJidsSameUser, jidNormalizedUser } from '@whiskeysockets/baileys'

const handler = async (m, { conn, args, usedPrefix, command }) => {
    let who
    
    // Prioridad 1: Mención explícita (@usuario)
    if (m.mentionedJid && m.mentionedJid.length > 0) {
        who = m.mentionedJid[0]
    } 
    // Prioridad 2: Respondiendo a un mensaje
    else if (m.quoted && m.quoted.sender) {
        // m.quoted.sender ya es síncrono gracias al getter en simple.js
        who = m.quoted.sender
    } 
    // Prioridad 3: Número como argumento de texto
    else if (args[0]) {
        let numero = args[0].replace(/[^0-9]/g, '')
        if (numero.length >= 10) {
            who = numero + '@s.whatsapp.net'
        }
    }

    // Normalizar el JID (quita :xx si existe y asegura formato correcto)
    if (who) {
        who = jidNormalizedUser(who)
    }

    if (!who) {
        return conn.reply(m.chat, 
            `> . ﹡ ﹟ ⬆️ ׄ ⬭ *ᴘʀᴏᴍᴏᴠᴇʀ ᴀ ᴀᴅᴍɪɴ*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ ⚠️ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴏ* :: ${usedPrefix}${command} @usuario\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴏ* :: Responde a un mensaje con ${usedPrefix}${command}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ɴᴏᴛᴀ* :: Asegúrate de que el usuario esté en el grupo`, m)
    }

    // Verificar que no se promueva a sí mismo
    if (areJidsSameUser(who, m.sender)) {
        return conn.reply(m.chat, 
            `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴀᴄᴄɪᴏ́ɴ ɪɴᴠᴀ́ʟɪᴅᴀ*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 🚫 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴍᴏᴛɪᴠᴏ* :: No puedes promoverte a ti mismo`, m)
    }
    
    // Verificar que no sea el bot
    if (areJidsSameUser(who, conn.user.jid)) {
        return conn.reply(m.chat, 
            `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴀᴄᴄɪᴏ́ɴ ɪɴᴠᴀ́ʟɪᴅᴀ*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 🤖 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴍᴏᴛɪᴠᴏ* :: No puedo promoverme a mí mismo`, m)
    }

    try {
        // Obtener metadata del grupo
        const groupInfo = await conn.groupMetadata(m.chat)
        
        // Buscar al participante usando areJidsSameUser para comparación segura
        const participant = groupInfo.participants.find(p => areJidsSameUser(p.id, who))
        
        if (!participant) {
            return conn.reply(m.chat, 
                `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴜsᴜᴀʀɪᴏ ɴᴏ ᴇɴᴄᴏɴᴛʀᴀᴅᴏ*\n\n` +
                `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 🔍 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
                `ׅㅤ𓏸𓈒ㅤׄ *ᴇsᴛᴀᴅᴏ* :: El usuario no está en el grupo\n` +
                `ׅㅤ𓏸𓈒ㅤׄ *ᴊɪᴅ* :: ${who.split('@')[0]}`, m)
        }
            
        if (participant.admin) {
            return conn.reply(m.chat, 
                `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ʏᴀ ᴇs ᴀᴅᴍɪɴ*\n\n` +
                `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 🛡️ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
                `ׅㅤ𓏸𓈒ㅤׄ *ᴇsᴛᴀᴅᴏ* :: El usuario ya es administrador`, m)
        }

        // Intentar promover
        await conn.groupParticipantsUpdate(m.chat, [who], 'promote')
        
        // Obtener nombre del usuario
        let name = who.split('@')[0]
        try {
            const contact = await conn.getName(who)
            if (contact) name = contact
        } catch (e) {
            // Si falla obtener nombre, usar el número
        }

        return conn.reply(m.chat, 
            `> . ﹡ ﹟ ⬆️ ׄ ⬭ *ᴀᴅᴍɪɴɪsᴛʀᴀᴅᴏʀ ᴘʀᴏᴍᴏᴠɪᴅᴏ*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 👑 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴜᴀʀɪᴏ* :: ${name}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ɴᴜ́ᴍᴇʀᴏ* :: @${who.split('@')[0]}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴀᴄᴄɪᴏ́ɴ* :: Ascendido a administrador\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴘᴏʀ* :: @${m.sender.split('@')[0]}`, m, { mentions: [who, m.sender] })
        
    } catch (error) {
        console.error('Error detallado en promote:', error)
        
        // Mensaje de error más específico
        let errorMsg = error.message || 'Error desconocido'
        if (error.data === 500 || error.output?.statusCode === 500) {
            errorMsg = 'Error interno de WhatsApp. Intenta nuevamente en unos segundos.'
        }
        
        return conn.reply(m.chat, 
            `> . ﹡ ﹟ ❌ ׄ ⬭ *ᴇʀʀᴏʀ*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ ⚠️ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴅᴇᴛᴀʟʟᴇ* :: ${errorMsg}\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 💡 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴛɪᴘ* :: Menciona al usuario con @ antes del número`, m)
    }
}

handler.help = ['promote', 'ascender', 'admin', 'daradmin']
handler.tags = ['group']
handler.command = ['promote', 'ascender', 'admin', 'daradmin', 'darpoder']
handler.admin = true
handler.group = true
handler.botAdmin = true

export default handler
