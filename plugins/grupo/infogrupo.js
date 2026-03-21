import { promises as fs } from 'fs'

const handler = async (m, { conn, participants, groupMetadata }) => {
    const chat = global.db.data.chats[m.chat]
    const pp = await conn.profilePictureUrl(m.chat, 'image').catch(() => 'https://files.catbox.moe/xr2m6u.jpg')
    const { antiLink, detect, welcome, sWelcome, sBye, modoadmin, nsfw, isBanned, economy, gacha } = chat
    const groupAdmins = participants.filter(p => p.admin)
    const owner = groupMetadata.owner || groupAdmins.find(p => p.admin === 'superadmin')?.id || m.chat.split`-`[0] + '@s.whatsapp.net'
    const creador = (!owner || owner.startsWith('1203') || owner.length < 15) ? 'No encontrado' : `@${owner.split('@')[0]}`
    const rawPrimary = typeof chat.primaryBot === 'string' ? chat.primaryBot : ''
    const botprimary = rawPrimary.endsWith('@s.whatsapp.net') ? `@${rawPrimary.split('@')[0]}` : 'Aleatorio'
    const totalreg = Object.keys(global.db.data.users).length

    const text = 
        `> . ﹡ ﹟ 👑 ׄ ⬭ *ɪɴғᴏʀᴍᴀᴄɪᴏ́ɴ ᴅᴇʟ ɢʀᴜᴘᴏ*\n\n` +
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 📋 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ɴᴏᴍʙʀᴇ* :: ${groupMetadata.subject}\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴄʀᴇᴀᴅᴏʀ* :: ${creador}\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴍɪᴇᴍʙʀᴏs* :: ${participants.length}\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴀᴅᴍɪɴs* :: ${groupAdmins.length}\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ʀᴇɢɪsᴛʀᴀᴅᴏs* :: ${totalreg.toLocaleString()}\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ʙᴏᴛ ᴘʀɪɴᴄɪᴘᴀʟ* :: ${botprimary}\n\n` +
        
        `> . ﹡ ﹟ ⚙️ ׄ ⬭ *ᴏᴘᴄɪᴏɴᴇs ᴅᴇʟ ʙᴏᴛ*\n\n` +
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 🛠️ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *${global.botname || 'Bot'}* :: ${isBanned ? '⭕ ᴅᴇsᴀᴄᴛɪᴠᴀᴅᴏ' : '🟢 ᴀᴄᴛɪᴠᴀᴅᴏ'}\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴡᴇʟᴄᴏᴍᴇ* :: ${welcome ? '🟢 ᴀᴄᴛɪᴠᴀᴅᴏ' : '⭕ ᴅᴇsᴀᴄᴛɪᴠᴀᴅᴏ'}\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴀʟᴇʀᴛᴀs* :: ${detect ? '🟢 ᴀᴄᴛɪᴠᴀᴅᴏ' : '⭕ ᴅᴇsᴀᴄᴛɪᴠᴀᴅᴏ'}\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴀɴᴛɪ-ʟɪɴᴋ* :: ${antiLink ? '🟢 ᴀᴄᴛɪᴠᴀᴅᴏ' : '⭕ ᴅᴇsᴀᴄᴛɪᴠᴀᴅᴏ'}\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴏɴʟʏ-ᴀᴅᴍɪɴ* :: ${modoadmin ? '🟢 ᴀᴄᴛɪᴠᴀᴅᴏ' : '⭕ ᴅᴇsᴀᴄᴛɪᴠᴀᴅᴏ'}\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ɴsғᴡ* :: ${nsfw ? '🟢 ᴀᴄᴛɪᴠᴀᴅᴏ' : '⭕ ᴅᴇsᴀᴄᴛɪᴠᴀᴅᴏ'}\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ɢᴀᴄʜᴀ* :: ${gacha ? '🟢 ᴀᴄᴛɪᴠᴀᴅᴏ' : '⭕ ᴅᴇsᴀᴄᴛɪᴠᴀᴅᴏ'}\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴇᴄᴏɴᴏᴍʏ* :: ${economy ? '🟢 ᴀᴄᴛɪᴠᴀᴅᴏ' : '⭕ ᴅᴇsᴀᴄᴛɪᴠᴀᴅᴏ'}\n\n` +
        
        `> . ﹡ ﹟ 💬 ׄ ⬭ *ᴍᴇɴsᴀᴊᴇs ᴄᴏɴғɪɢᴜʀᴀᴅᴏs*\n\n` +
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 📝 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴡᴇʟᴄᴏᴍᴇ* :: ${(sWelcome || 'Sin mensaje configurado').replace(/{usuario}/g, `@${m.sender.split('@')[0]}`).replace(/{grupo}/g, groupMetadata.subject).replace(/{desc}/g, groupMetadata.desc || 'Sin descripción')}\n\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ʙʏᴇ* :: ${(sBye || 'Sin mensaje configurado').replace(/{usuario}/g, `@${m.sender.split('@')[0]}`).replace(/{grupo}/g, groupMetadata.subject).replace(/{desc}/g, groupMetadata.desc || 'Sin descripción')}`

    conn.sendFile(m.chat, pp, 'infogrupo.jpg', text, m, false, { mentions: [owner, rawPrimary, m.sender] })
}

handler.help = ['infogrupo']
handler.tags = ['grupo']
handler.command = ['infogrupo', 'gp']
handler.group = true

export default handler
