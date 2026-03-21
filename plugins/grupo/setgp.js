import { makeWASocket } from '@whiskeysockets/baileys'

const handler = async (m, { conn, args, text, command, usedPrefix }) => {
    try {
        switch (command) {
            case 'gpbanner': 
            case 'groupimg': {
                const q = m.quoted || m
                const mime = (q.msg || q).mimetype || ''
                
                if (!/image\/(png|jpe?g)/.test(mime)) return m.reply(
                    `> . ﹡ ﹟ 🖼️ ׄ ⬭ *ᴄᴀᴍʙɪᴀʀ ɪᴍᴀɢᴇɴ*\n\n` +
                    `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ ⚠️ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
                    `ׅㅤ𓏸𓈒ㅤׄ *ᴇʀʀᴏʀ* :: Debes adjuntar una imagen\n` +
                    `ׅㅤ𓏸𓈒ㅤׄ *ғᴏʀᴍᴀᴛᴏ* :: PNG o JPG/JPEG\n` +
                    `ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴏ* :: Responde a una imagen con ${usedPrefix}${command}`)
                
                const img = await q.download()
                if (!img) return m.reply(
                    `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴅᴇsᴄᴀʀɢᴀ ғᴀʟʟɪᴅᴀ*\n\n` +
                    `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 🚫 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
                    `ׅㅤ𓏸𓈒ㅤׄ *ᴅᴇᴛᴀʟʟᴇ* :: No se pudo descargar la imagen`)
                
                await m.react('🕒')
                await conn.updateProfilePicture(m.chat, img)
                await m.react('✅')
                
                m.reply(
                    `> . ﹡ ﹟ 🖼️ ׄ ⬭ *ɪᴍᴀɢᴇɴ ᴀᴄᴛᴜᴀʟɪᴢᴀᴅᴀ*\n\n` +
                    `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ ✅ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
                    `ׅㅤ𓏸𓈒ㅤׄ *ɢʀᴜᴘᴏ* :: ${await conn.getName(m.chat)}\n` +
                    `ׅㅤ𓏸𓈒ㅤׄ *ᴀᴄᴄɪᴏ́ɴ* :: Imagen de perfil cambiada correctamente`)
                break
            }
            
            case 'gpdesc': 
            case 'groupdesc': {
                if (!args.length) return m.reply(
                    `> . ﹡ ﹟ 📝 ׄ ⬭ *ᴄᴀᴍʙɪᴀʀ ᴅᴇsᴄʀɪᴘᴄɪᴏ́ɴ*\n\n` +
                    `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ ⚠️ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
                    `ׅㅤ𓏸𓈒ㅤׄ *ᴇʀʀᴏʀ* :: Debes escribir una descripción\n` +
                    `ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴏ* :: ${usedPrefix}${command} <descripción>\n` +
                    `ׅㅤ𓏸𓈒ㅤׄ *ᴇᴊᴇᴍᴘʟᴏ* :: ${usedPrefix}${command} Bienvenidos al grupo oficial`)
                
                await m.react('🕒')
                await conn.groupUpdateDescription(m.chat, args.join(' '))
                await m.react('✅')
                
                m.reply(
                    `> . ﹡ ﹟ 📝 ׄ ⬭ *ᴅᴇsᴄʀɪᴘᴄɪᴏ́ɴ ᴀᴄᴛᴜᴀʟɪᴢᴀᴅᴀ*\n\n` +
                    `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ ✅ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
                    `ׅㅤ𓏸𓈒ㅤׄ *ɢʀᴜᴘᴏ* :: ${await conn.getName(m.chat)}\n` +
                    `ׅㅤ𓏸𓈒ㅤׄ *ɴᴜᴇᴠᴀ ᴅᴇsᴄ* :: ${args.join(' ').substring(0, 50)}${args.join(' ').length > 50 ? '...' : ''}`)
                break
            }
            
            case 'gpname': 
            case 'groupname': {
                if (!text) return m.reply(
                    `> . ﹡ ﹟ ✏️ ׄ ⬭ *ᴄᴀᴍʙɪᴀʀ ɴᴏᴍʙʀᴇ*\n\n` +
                    `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ ⚠️ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
                    `ׅㅤ𓏸𓈒ㅤׄ *ᴇʀʀᴏʀ* :: Debes escribir un nombre\n` +
                    `ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴏ* :: ${usedPrefix}${command} <nombre>\n` +
                    `ׅㅤ𓏸𓈒ㅤׄ *ᴇᴊᴇᴍᴘʟᴏ* :: ${usedPrefix}${command} Asta Bot Official`)
                
                await m.react('🕒')
                await conn.groupUpdateSubject(m.chat, text)
                await m.react('✅')
                
                m.reply(
                    `> . ﹡ ﹟ ✏️ ׄ ⬭ *ɴᴏᴍʙʀᴇ ᴀᴄᴛᴜᴀʟɪᴢᴀᴅᴏ*\n\n` +
                    `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ ✅ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
                    `ׅㅤ𓏸𓈒ㅤׄ *ᴀɴᴛᴇs* :: ${await conn.getName(m.chat)}\n` +
                    `ׅㅤ𓏸𓈒ㅤׄ *ᴀʜᴏʀᴀ* :: ${text}`)
                break
            }
        }
    } catch (e) {
        await m.react('❌')
        m.reply(
            `> . ﹡ ﹟ ❌ ׄ ⬭ *ᴇʀʀᴏʀ*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ ⚠️ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴅᴇᴛᴀʟʟᴇ* :: ${e.message}\n\n` +
            `> ✦ *ʀᴇᴘᴏʀᴛᴀʀ* :: ${usedPrefix}report`)
    }
}

handler.help = ['gpbanner', 'groupimg', 'gpdesc', 'groupdesc', 'gpname', 'groupname']
handler.tags = ['grupo']
handler.command = ['gpbanner', 'groupimg', 'gpdesc', 'groupdesc', 'gpname', 'groupname']
handler.group = true
handler.admin = true
handler.botAdmin = true
handler.reg = true

export default handler
