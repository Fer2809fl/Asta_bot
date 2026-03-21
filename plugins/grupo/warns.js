const handler = async (m, { conn, text, command, usedPrefix }) => {
    try {
        const pp = await conn.profilePictureUrl(m.chat, 'image').catch(() => 'https://files.catbox.moe/xr2m6u.jpg')
        let mentionedJid = await m.mentionedJid
        let who = mentionedJid && mentionedJid.length ? mentionedJid[0] : m.quoted && await m.quoted.sender ? await m.quoted.sender : null
        
        const user = global.db.data.users[m.sender]
        const usuario = conn.user.jid.split`@`[0] + '@s.whatsapp.net'
        const groupInfo = await conn.groupMetadata(m.chat)
        const ownerGroup = groupInfo.owner || m.chat.split`-`[0] + '@s.whatsapp.net'
        const ownerBot = global.owner[0][0] + '@s.whatsapp.net'
        
        switch (command) {
            case 'advertencia': 
            case 'warn': 
            case 'addwarn': {
                if (!who || typeof who !== 'string' || !who.includes('@')) {
                    return m.reply(
                        `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴀᴅᴠᴇʀᴛᴇɴᴄɪᴀ*\n\n` +
                        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 🚫 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
                        `ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴏ* :: ${usedPrefix}${command} @usuario [motivo]\n` +
                        `ׅㅤ𓏸𓈒ㅤׄ *ᴇᴊᴇᴍᴘʟᴏ* :: ${usedPrefix}${command} @usuario Spam\n` +
                        `ׅㅤ𓏸𓈒ㅤׄ *ɴᴏᴛᴀ* :: El motivo es opcional`, m)
                }
                
                const msgtext = text?.trim() || ''
                const partes = msgtext.split(/\s+/)
                const tieneMencion = partes.some(part => part.startsWith('@'))
                const motivo = tieneMencion ? partes.filter(part => !part.startsWith('@')).join(' ').trim() || 'Sin especificar' : msgtext || 'Sin especificar'
                
                if (who === conn.user.jid) return conn.reply(m.chat, 
                    `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴀᴄᴄɪᴏ́ɴ ɴᴏ ᴘᴇʀᴍɪᴛɪᴅᴀ*\n\n` +
                    `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 🤖 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
                    `ׅㅤ𓏸𓈒ㅤׄ *ᴍᴏᴛɪᴠᴏ* :: No puedo ponerle advertencias al bot`, m)
                    
                if (who === ownerGroup) return conn.reply(m.chat, 
                    `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴀᴄᴄɪᴏ́ɴ ɴᴏ ᴘᴇʀᴍɪᴛɪᴅᴀ*\n\n` +
                    `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 👑 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
                    `ׅㅤ𓏸𓈒ㅤׄ *ᴍᴏᴛɪᴠᴏ* :: No puedo darle advertencias al propietario del grupo`, m)
                    
                if (who === ownerBot) return conn.reply(m.chat, 
                    `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴀᴄᴄɪᴏ́ɴ ɴᴏ ᴘᴇʀᴍɪᴛɪᴅᴀ*\n\n` +
                    `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 🔒 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
                    `ׅㅤ𓏸𓈒ㅤׄ *ᴍᴏᴛɪᴠᴏ* :: No puedo darle advertencias al propietario del bot`, m)
                
                user.warn = (user.warn || 0) + 1
                
                await m.reply(
                    `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴀᴅᴠᴇʀᴛᴇɴᴄɪᴀ ᴀᴘʟɪᴄᴀᴅᴀ*\n\n` +
                    `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 🚨 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
                    `ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴜᴀʀɪᴏ* :: @${who.split`@`[0]}\n` +
                    `ׅㅤ𓏸𓈒ㅤׄ *ᴍᴏᴛɪᴠᴏ* :: ${motivo}\n` +
                    `ׅㅤ𓏸𓈒ㅤׄ *ᴀᴅᴠᴇʀᴛᴇɴᴄɪᴀs* :: ${user.warn}/3\n\n` +
                    `${user.warn >= 3 ? '> ⚠️ *ᴀᴠɪsᴏ* :: La próxima será expulsión' : ''}`, null, { mentions: [who] })
                
                if (user.warn >= 3) {
                    user.warn = 0
                    await m.reply(
                        `> . ﹡ ﹟ 🚫 ׄ ⬭ *ʟɪᴍɪᴛᴇ ᴅᴇ ᴀᴅᴠᴇʀᴛᴇɴᴄɪᴀs*\n\n` +
                        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 👢 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
                        `ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴜᴀʀɪᴏ* :: @${who.split`@`[0]}\n` +
                        `ׅㅤ𓏸𓈒ㅤׄ *ᴛᴏᴛᴀʟ* :: 3/3 advertencias\n` +
                        `ׅㅤ𓏸𓈒ㅤׄ *ᴀᴄᴄɪᴏ́ɴ* :: Expulsado del grupo`, null, { mentions: [who] })
                    await conn.groupParticipantsUpdate(m.chat, [who], 'remove')
                }
                break
            }
            
            case 'delwarn': 
            case 'unwarn': {
                if (!who) return m.reply(
                    `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ǫᴜɪᴛᴀʀ ᴀᴅᴠᴇʀᴛᴇɴᴄɪᴀ*\n\n` +
                    `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 🚫 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
                    `ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴏ* :: ${usedPrefix}${command} @usuario`, m)
                    
                if (mentionedJid.includes(conn.user.jid)) return
                if (user.warn === 0) return m.reply(
                    `> . ﹡ ﹟ ⚠️ ׄ ⬭ *sɪɴ ᴀᴅᴠᴇʀᴛᴇɴᴄɪᴀs*\n\n` +
                    `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 📭 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
                    `ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴜᴀʀɪᴏ* :: @${who.split`@`[0]}\n` +
                    `ׅㅤ𓏸𓈒ㅤׄ *ᴇsᴛᴀᴅᴏ* :: No tiene advertencias`, m, { mentions: [who] })
                    
                user.warn -= 1
                await m.reply(
                    `> . ﹡ ﹟ ✅ ׄ ⬭ *ᴀᴅᴠᴇʀᴛᴇɴᴄɪᴀ ǫᴜɪᴛᴀᴅᴀ*\n\n` +
                    `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 🔄 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
                    `ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴜᴀʀɪᴏ* :: @${who.split`@`[0]}\n` +
                    `ׅㅤ𓏸𓈒ㅤׄ *ᴀᴅᴠᴇʀᴛᴇɴᴄɪᴀs* :: ${user.warn}/3`, null, { mentions: [who] })
                break
            }
            
            case 'listadv': 
            case 'advlist': {
                const adv = Object.entries(global.db.data.chats[m.chat].users).filter(([_, u]) => u.warn)
                const warns = global.db.data.chats[m.chat].users.warn || 0
                
                let listadvs = 
                    `> . ﹡ ﹟ 📋 ׄ ⬭ *ʟɪsᴛᴀ ᴅᴇ ᴀᴅᴠᴇʀᴛɪᴅᴏs*\n\n` +
                    `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 📊 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
                    `ׅㅤ𓏸𓈒ㅤׄ *ᴛᴏᴛᴀʟ* :: ${adv.length} usuarios\n\n` +
                    `> ✦ *ᴜsᴜᴀʀɪᴏs* ::\n`
                
                if (adv.length > 0) {
                    listadvs += adv.map(([jid, user]) => 
                        `ׅㅤ𓏸𓈒ㅤׄ ⚠️ @${jid.split`@`[0]} :: ${user.warn}/3`
                    ).join('\n')
                } else {
                    listadvs += `ׅㅤ𓏸𓈒ㅤׄ 📭 No hay usuarios advertidos`
                }
                
                listadvs += `\n\n> ✧ *ᴛᴏᴛᴀʟ* :: ${warns ? `${warns}/3` : '0/3'} advertencias`
                
                await conn.sendMessage(m.chat, { image: { url: pp }, caption: listadvs, mentions: await conn.parseMention(listadvs) }, { quoted: m })
                break
            }
        }
    } catch (error) {
        m.reply(
            `> . ﹡ ﹟ ❌ ׄ ⬭ *ᴇʀʀᴏʀ*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ ⚠️ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴅᴇᴛᴀʟʟᴇ* :: ${error.message}\n\n` +
            `> ✦ *ʀᴇᴘᴏʀᴛᴀʀ* :: ${usedPrefix}report`)
    }
}

handler.command = ['advertencia', 'warn', 'addwarn', 'delwarn', 'unwarn', 'listadv', 'advlist']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler
