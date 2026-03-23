import fetch from 'node-fetch'
async function getRcanal() {
    try { const thumb = await (await fetch(global.icono)).buffer(); return { isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: global.channelRD?.id || "120363399175402285@newsletter", serverMessageId: '', newsletterName: global.channelRD?.name || "『𝕬𝖘𝖙𝖆-𝕭𝖔𝖙』" }, externalAdReply: { title: global.botname || 'ᴀsᴛᴀ-ʙᴏᴛ', body: global.dev || 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ ғᴇʀɴᴀɴᴅᴏ', mediaType: 1, mediaUrl: global.redes, sourceUrl: global.redes, thumbnail: thumb, showAdAttribution: false, containsAutoReply: true, renderLargerThumbnail: false } } } catch { return {} }
}
let handler = async (m, { conn, usedPrefix }) => {
    const rcanal = await getRcanal(), currency = global.currency || '¥enes'
    if (!global.db.data.chats[m.chat].economy && m.isGroup) return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ 🚫 ׄ ⬭ *ᴇᴄᴏɴᴏᴍɪ́ᴀ ᴅᴇsᴀᴄᴛɪᴠᴀᴅᴀ*\n\nׅㅤ𓏸𓈒ㅤׄ Actívala con *${usedPrefix}economy on*`, contextInfo: rcanal }, { quoted: m })
    let user = global.db.data.users[m.sender]
    if (!user) return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴇʀʀᴏʀ*\n\nׅㅤ𓏸𓈒ㅤׄ Usuario no registrado.`, contextInfo: rcanal }, { quoted: m })
    user.coin ??= 0; user.bank ??= 0; user.health ??= 100
    if (user.health >= 100) return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ ❤️ ׄ ⬭ *sᴀʟᴜᴅ*\n\nׅㅤ𓏸𓈒ㅤׄ Tu salud ya está al *100%*.`, contextInfo: rcanal }, { quoted: m })
    if (user.coin <= 0) return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ 💸 ׄ ⬭ *sɪɴ ғᴏɴᴅᴏs*\n\nׅㅤ𓏸𓈒ㅤׄ No tienes ${currency} para curarte.`, contextInfo: rcanal }, { quoted: m })
    const faltante = 100 - user.health
    const disponible = Math.floor(user.coin / 50)
    const curable = Math.min(faltante, disponible)
    user.health += curable; user.coin -= curable * 50; user.lastHeal = Date.now()
    await conn.sendMessage(m.chat, {
        text:
            `> . ﹡ ﹟ 💊 ׄ ⬭ *ᴄᴜʀᴀʀ*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜✅* ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *🩺 ʀᴇᴄᴜᴘᴇʀᴀᴅᴏ* :: +${curable} punto${curable !== 1 ? 's' : ''}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *❤️ sᴀʟᴜᴅ ᴀᴄᴛᴜᴀʟ* :: ${user.health}/100\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *💰 ᴄᴏsᴛᴏ* :: ¥${(curable * 50).toLocaleString()} ${currency}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *💎 ʀᴇsᴛᴀɴᴛᴇs* :: ¥${user.coin.toLocaleString()} ${currency}`,
        contextInfo: rcanal
    }, { quoted: m })
}
handler.help = ['heal']; handler.tags = ['rpg']; handler.command = ['heal', 'curar']
handler.group = true; handler.reg = true
export default handler
