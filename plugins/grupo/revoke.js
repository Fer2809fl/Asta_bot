var handler = async (m, { conn }) => {
    let res = await conn.groupRevokeInvite(m.chat)
    let gruf = m.chat
    let newLink = 'https://chat.whatsapp.com/' + await conn.groupInviteCode(gruf)
    
    conn.reply(m.sender, 
        `> . ﹡ ﹟ 🔄 ׄ ⬭ *ᴇɴʟᴀᴄᴇ ʀᴇsᴛᴀʙʟᴇᴄɪᴅᴏ*\n\n` +
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ ✅ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ɢʀᴜᴘᴏ* :: ${await conn.getName(m.chat)}\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴀᴄᴄɪᴏ́ɴ* :: Enlace anterior revocado\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ɴᴜᴇᴠᴏ* :: ${newLink}\n\n` +
        `> ✧ *ɴᴏᴛᴀ* :: El enlace anterior ya no funciona. Usa solo este nuevo enlace.`, m)
}

handler.help = ['revoke']
handler.tags = ['grupo']
handler.command = ['revoke', 'restablecer']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler
