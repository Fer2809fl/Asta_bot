import { areJidsSameUser } from '@whiskeysockets/baileys'

var handler = async (m, { conn, text, participants, args, command, usedPrefix }) => {
    try {
        let member = participants.map(u => u.id)
        if (!text) {
            var sum = member.length
        } else {
            var sum = text
        }
        var total = 0
        var sider = []
        
        for (let i = 0; i < sum; i++) {
            let users = m.isGroup ? participants.find(u => u.id == member[i]) : {}
            if ((typeof global.db.data.users[member[i]] == 'undefined' || global.db.data.users[member[i]].chat == 0) && !users.isAdmin && !users.isSuperAdmin) {
                if (typeof global.db.data.users[member[i]] !== 'undefined') {
                    if (global.db.data.users[member[i]].whitelist == false) {
                        total++
                        sider.push(member[i])
                    }
                } else {
                    total++
                    sider.push(member[i])
                }
            }
        }
        
        const delay = time => new Promise(res => setTimeout(res, time))
        
        switch (command) {
            case 'inactivos': 
            case 'fantasmas': {
                if (total == 0) return conn.reply(m.chat, 
                    `> . ﹡ ﹟ ✅ ׄ ⬭ *ɢʀᴜᴘᴏ ᴀᴄᴛɪᴠᴏ*\n\n` +
                    `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 🌟 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
                    `ׅㅤ𓏸𓈒ㅤׄ *ᴇsᴛᴀᴅᴏ* :: No se encontraron fantasmas\n` +
                    `ׅㅤ𓏸𓈒ㅤׄ *ᴛᴏᴛᴀʟ* :: Todos los miembros son activos`, m)
                
                m.reply(
                    `> . ﹡ ﹟ 👻 ׄ ⬭ *ɪɴᴀᴄᴛɪᴠᴏs ᴅᴇᴛᴇᴄᴛᴀᴅᴏs*\n\n` +
                    `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 📊 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
                    `ׅㅤ𓏸𓈒ㅤׄ *ᴄᴀɴᴛɪᴅᴀᴅ* :: ${total} fantasmas\n\n` +
                    `> ✦ *ʟɪsᴛᴀ ᴅᴇ ɪɴᴀᴄᴛɪᴠᴏs* ::\n` +
                    `${sider.map(v => `ׅㅤ𓏸𓈒ㅤׄ 👤 @${v.replace(/@.+/, '')}`).join('\n')}\n\n` +
                    `> ✧ *ɴᴏᴛᴀ* :: El conteo inicia desde la activación del bot en este grupo.`, 
                    null, { mentions: sider })
                break
            }
            
            case 'kickinactivos': 
            case 'kickfantasmas': {
                if (total == 0) return conn.reply(m.chat, 
                    `> . ﹡ ﹟ ✅ ׄ ⬭ *ɢʀᴜᴘᴏ ᴀᴄᴛɪᴠᴏ*\n\n` +
                    `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 🌟 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
                    `ׅㅤ𓏸𓈒ㅤׄ *ᴇsᴛᴀᴅᴏ* :: No hay fantasmas para eliminar`, m)
                
                await m.reply(
                    `> . ﹡ ﹟ 🗑️ ׄ ⬭ *ᴇʟɪᴍɪɴᴀᴄɪᴏ́ɴ ᴅᴇ ɪɴᴀᴄᴛɪᴠᴏs*\n\n` +
                    `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ ⚠️ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
                    `ׅㅤ𓏸𓈒ㅤׄ *ᴛᴏᴛᴀʟ* :: ${total} serán eliminados\n` +
                    `ׅㅤ𓏸𓈒ㅤׄ *ɪɴᴛᴇʀᴠᴀʟᴏ* :: 10 segundos entre cada uno\n\n` +
                    `> ✦ *ʟɪsᴛᴀ* ::\n` +
                    `${sider.map(v => `ׅㅤ𓏸𓈒ㅤׄ 👻 @${v.replace(/@.+/, '')}`).join('\n')}`, 
                    null, { mentions: sider })
                
                await delay(1 * 10000)
                let chat = global.db.data.chats[m.chat]
                chat.welcome = false
                
                try {
                    let users = m.mentionedJid.filter(u => !areJidsSameUser(u, conn.user.id))
                    let kickedGhost = sider.map(v => v.id).filter(v => v !== conn.user.jid)
                    
                    for (let user of users)
                        if (user.endsWith('@s.whatsapp.net') && !(participants.find(v => areJidsSameUser(v.id, user)) || { admin: true }).admin) {
                            let res = await conn.groupParticipantsUpdate(m.chat, [user], 'remove')
                            kickedGhost.concat(res)
                            await delay(1 * 10000)
                        }
                        
                    // Confirmación final
                    m.reply(
                        `> . ﹡ ﹟ ✅ ׄ ⬭ *ᴇʟɪᴍɪɴᴀᴄɪᴏ́ɴ ᴄᴏᴍᴘʟᴇᴛᴀᴅᴀ*\n\n` +
                        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 🧹 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
                        `ׅㅤ𓏸𓈒ㅤׄ *ᴇʟɪᴍɪɴᴀᴅᴏs* :: ${total} fantasmas\n` +
                        `ׅㅤ𓏸𓈒ㅤׄ *ᴇsᴛᴀᴅᴏ* :: Grupo limpiado correctamente`, m)
                        
                } finally {
                    chat.welcome = true
                }
                break
            }
        }
    } catch (e) {
        m.reply(
            `> . ﹡ ﹟ ❌ ׄ ⬭ *ᴇʀʀᴏʀ*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ ⚠️ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴅᴇᴛᴀʟʟᴇ* :: ${e.message}\n\n` +
            `> ✦ *ʀᴇᴘᴏʀᴛᴀʀ* :: ${usedPrefix}report`)
    }
}

handler.tags = ['grupo']
handler.command = ['inactivos', 'fantasmas', 'kickinactivos', 'kickfantasmas']
handler.group = true
handler.botAdmin = true
handler.admin = true

export default handler

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
