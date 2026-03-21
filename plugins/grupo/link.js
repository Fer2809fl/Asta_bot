var handler = async (m, { conn, args }) => {
    let group = m.chat
    const pp = await conn.profilePictureUrl(group, 'image').catch((_) => 'https://files.catbox.moe/xr2m6u.jpg')
    let link = 'https://chat.whatsapp.com/' + await conn.groupInviteCode(group)
    
    let message = 
        `> . ﹡ ﹟ 🔗 ׄ ⬭ *ʟɪɴᴋ ᴅᴇʟ ɢʀᴜᴘᴏ*\n\n` +
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 📨 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ɴᴏᴍʙʀᴇ* :: ${await conn.getName(group)}\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴄᴏ́ᴅɪɢᴏ* :: ${link.split('/').pop()}\n\n` +
        `> ✦ *ʟɪɴᴋ* :: ${link}\n\n` +
        `> ✧ *ɴᴏᴛᴀ* :: Usa este enlace para invitar a nuevos miembros`

    await conn.sendMessage(group, { image: { url: pp }, caption: message })
}

handler.help = ['link']
handler.tags = ['grupo']
handler.command = ['link', 'enlace']
handler.group = true
handler.botAdmin = true

export default handler
