import fetch from 'node-fetch'
async function getRcanal() {
    try { const thumb = await (await fetch(global.icono)).buffer(); return { isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: global.channelRD?.id || "120363399175402285@newsletter", serverMessageId: '', newsletterName: global.channelRD?.name || "『𝕬𝖘𝖙𝖆-𝕭𝖔𝖙』" }, externalAdReply: { title: global.botname || 'ᴀsᴛᴀ-ʙᴏᴛ', body: global.dev || 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ ғᴇʀɴᴀɴᴅᴏ', mediaType: 1, mediaUrl: global.redes, sourceUrl: global.redes, thumbnail: thumb, showAdAttribution: false, containsAutoReply: true, renderLargerThumbnail: false } } } catch { return {} }
}
var handler = async (m, { conn, usedPrefix }) => {
    const rcanal = await getRcanal(), currency = global.currency || '¥enes'
    if (!global.db.data.chats[m.chat].economy && m.isGroup) return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ 🚫 ׄ ⬭ *ᴇᴄᴏɴᴏᴍɪ́ᴀ ᴅᴇsᴀᴄᴛɪᴠᴀᴅᴀ*\n\nׅㅤ𓏸𓈒ㅤׄ Actívala con *${usedPrefix}economy on*`, contextInfo: rcanal }, { quoted: m })
    let user = global.db.data.users[m.sender], gap = 604800000, now = Date.now()
    user.weeklyStreak ??= 0; user.lastWeeklyGlobal ??= 0; user.coin ??= 0; user.exp ??= 0; user.lastweekly ??= 0
    if (now < user.lastweekly) { const wait = fmt(Math.floor((user.lastweekly - now)/1000)); return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ ⏳ ׄ ⬭ *ᴡᴇᴇᴋʟʏ*\n\nׅㅤ𓏸𓈒ㅤׄ Ya reclamaste tu semanal.\nׅㅤ𓏸𓈒ㅤׄ Vuelve en *${wait}*`, contextInfo: rcanal }, { quoted: m }) }
    const lost = user.weeklyStreak >= 1 && now - user.lastWeeklyGlobal > gap * 1.5; if (lost) user.weeklyStreak = 0
    if (now - user.lastWeeklyGlobal >= gap) { user.weeklyStreak = Math.min(user.weeklyStreak + 1, 30); user.lastWeeklyGlobal = now }
    const coins = Math.min(40000 + (user.weeklyStreak - 1) * 5000, 185000)
    user.coin += coins; user.exp += Math.floor(Math.random() * 151) + 50; user.lastweekly = now + gap
    await conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ 💰 ׄ ⬭ *ᴡᴇᴇᴋʟʏ*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜✅* ㅤ֢ㅤ⸱ㅤᯭִ*\nׅㅤ𓏸𓈒ㅤׄ *💸 ʀᴇᴄᴏᴍᴘᴇɴsᴀ* :: ¥${coins.toLocaleString()} ${currency}\nׅㅤ𓏸𓈒ㅤׄ *📅 sᴇᴍᴀɴᴀ* :: ${user.weeklyStreak}\nׅㅤ𓏸𓈒ㅤׄ *🔹 sɪɢᴜɪᴇɴᴛᴇ* :: +¥${Math.min(40000 + user.weeklyStreak * 5000, 185000).toLocaleString()}\n${lost ? 'ׅㅤ𓏸𓈒ㅤׄ *⚠️* Perdiste tu racha semanal' : ''}`, contextInfo: rcanal }, { quoted: m })
}
handler.help = ['weekly']; handler.tags = ['rpg']; handler.command = ['weekly', 'semanal']; handler.group = true; handler.reg = true
export default handler
function fmt(t) { const d=Math.floor(t/86400),h=Math.floor((t%86400)/3600),m=Math.floor((t%3600)/60),s=t%60; return [d&&`${d}d`,h&&`${h}h`,m&&`${m}m`,`${s}s`].filter(Boolean).join(' ') }
