import fetch from 'node-fetch'
async function getRcanal() {
    try { const thumb = await (await fetch(global.icono)).buffer(); return { isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: global.channelRD?.id || "120363399175402285@newsletter", serverMessageId: '', newsletterName: global.channelRD?.name || "『𝕬𝖘𝖙𝖆-𝕭𝖔𝖙』" }, externalAdReply: { title: global.botname || 'ᴀsᴛᴀ-ʙᴏᴛ', body: global.dev || 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ ғᴇʀɴᴀɴᴅᴏ', mediaType: 1, mediaUrl: global.redes, sourceUrl: global.redes, thumbnail: thumb, showAdAttribution: false, containsAutoReply: true, renderLargerThumbnail: false } } } catch { return {} }
}
var handler = async (m, { conn, usedPrefix }) => {
    const rcanal = await getRcanal(), currency = global.currency || '¥enes'
    if (!global.db.data.chats[m.chat].economy && m.isGroup) return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ 🚫 ׄ ⬭ *ᴇᴄᴏɴᴏᴍɪ́ᴀ ᴅᴇsᴀᴄᴛɪᴠᴀᴅᴀ*\n\nׅㅤ𓏸𓈒ㅤׄ Actívala con *${usedPrefix}economy on*`, contextInfo: rcanal }, { quoted: m })
    let user = global.db.data.users[m.sender], gap = 2592000000, now = Date.now()
    user.monthlyStreak ??= 0; user.lastMonthlyGlobal ??= 0; user.coin ??= 0; user.exp ??= 0; user.lastmonthly ??= 0
    if (now < user.lastmonthly) { return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ ⏳ ׄ ⬭ *ᴍᴏɴᴛʜʟʏ*\n\nׅㅤ𓏸𓈒ㅤׄ Ya reclamaste tu mensual.\nׅㅤ𓏸𓈒ㅤׄ Vuelve en *${fmt(Math.floor((user.lastmonthly-now)/1000))}*`, contextInfo: rcanal }, { quoted: m }) }
    const lost = user.monthlyStreak >= 1 && now - user.lastMonthlyGlobal > gap * 1.5; if (lost) user.monthlyStreak = 0
    if (now - user.lastMonthlyGlobal >= gap) { user.monthlyStreak = Math.min(user.monthlyStreak + 1, 8); user.lastMonthlyGlobal = now }
    const coins = Math.min(60000 + (user.monthlyStreak - 1) * 5000, 95000)
    user.coin += coins; user.exp += Math.floor(Math.random() * 401) + 100; user.lastmonthly = now + gap
    await conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ 💰 ׄ ⬭ *ᴍᴏɴᴛʜʟʏ*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜✅* ㅤ֢ㅤ⸱ㅤᯭִ*\nׅㅤ𓏸𓈒ㅤׄ *💸 ʀᴇᴄᴏᴍᴘᴇɴsᴀ* :: ¥${coins.toLocaleString()} ${currency}\nׅㅤ𓏸𓈒ㅤׄ *📅 ᴍᴇs* :: ${user.monthlyStreak}\nׅㅤ𓏸𓈒ㅤׄ *🔹 sɪɢᴜɪᴇɴᴛᴇ* :: +¥${Math.min(60000 + user.monthlyStreak * 5000, 95000).toLocaleString()}\n${lost ? 'ׅㅤ𓏸𓈒ㅤׄ *⚠️* Perdiste tu racha mensual' : ''}`, contextInfo: rcanal }, { quoted: m })
}
handler.help = ['monthly']; handler.tags = ['rpg']; handler.command = ['monthly', 'mensual']; handler.group = true; handler.reg = true
export default handler
function fmt(t) { const d=Math.floor(t/86400),h=Math.floor((t%86400)/3600),m=Math.floor((t%3600)/60),s=t%60; return [d&&`${d}d`,h&&`${h}h`,m&&`${m}m`,`${s}s`].filter(Boolean).join(' ') }
