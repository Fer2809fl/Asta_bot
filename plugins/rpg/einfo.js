import fetch from 'node-fetch'
async function getRcanal() {
    try { const thumb = await (await fetch(global.icono)).buffer(); return { isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: global.channelRD?.id || "120363399175402285@newsletter", serverMessageId: '', newsletterName: global.channelRD?.name || "『𝕬𝖘𝖙𝖆-𝕭𝖔𝖙』" }, externalAdReply: { title: global.botname || 'ᴀsᴛᴀ-ʙᴏᴛ', body: global.dev || 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ ғᴇʀɴᴀɴᴅᴏ', mediaType: 1, mediaUrl: global.redes, sourceUrl: global.redes, thumbnail: thumb, showAdAttribution: false, containsAutoReply: true, renderLargerThumbnail: false } } } catch { return {} }
}

function formatTime(ms) {
    if (!ms || ms <= 0 || isNaN(ms)) return '✅ Disponible'
    const s = Math.ceil(ms / 1000), d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60
    return [d && `${d}d`, h && `${h}h`, m && `${m}m`, `${sec}s`].filter(Boolean).join(' ')
}

let handler = async (m, { conn }) => {
    const rcanal = await getRcanal(), currency = global.currency || '¥enes'
    const userData = global.db.data.users[m.sender]
    if (!userData) return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴇʀʀᴏʀ*\n\nׅㅤ𓏸𓈒ㅤׄ No se encontraron datos de economía.`, contextInfo: rcanal }, { quoted: m })
    userData.coin ??= 0; userData.bank ??= 0
    const now = Date.now()
    const times = {
        '💼 Work': userData.lastwork, '😈 Slut': userData.lastslut, '🦹 Crime': userData.lastcrime,
        '🥷 Steal': userData.lastrob, '📅 Daily': userData.lastDaily, '🗓 Weekly': userData.lastweekly,
        '📆 Monthly': userData.lastmonthly, '📦 Cofre': userData.lastcofre,
        '⚔️ Adventure': userData.lastAdventure, '🏰 Dungeon': userData.lastDungeon,
        '🎣 Fish': userData.lastFish, '⛏️ Mine': userData.lastmine
    }
    const username = await (async () => { try { const n = await conn.getName(m.sender); return n || m.sender.split('@')[0] } catch { return m.sender.split('@')[0] } })()
    const cooldowns = Object.entries(times).map(([key, value]) => {
        const remaining = typeof value === 'number' ? value - now : 0
        return `ׅㅤ𓏸𓈒ㅤׄ *${key}* :: ${formatTime(remaining)}`
    }).join('\n')
    await conn.sendMessage(m.chat, {
        text:
            `> . ﹡ ﹟ ⏱️ ׄ ⬭ *ɪɴғᴏ ᴇᴄᴏɴᴏᴍɪ́ᴀ*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜👤* ㅤ֢ㅤ⸱ㅤᯭִ* — *${username}*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜⏳* ㅤ֢ㅤ⸱ㅤᯭִ* — *ᴄᴏᴏʟᴅᴏᴡɴs*\n` +
            cooldowns + `\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜💰* ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *💎 ᴛᴏᴛᴀʟ* :: ¥${(userData.coin + userData.bank).toLocaleString()} ${currency}`,
        contextInfo: rcanal
    }, { quoted: m })
}
handler.tags = ['economy']; handler.help = ['einfo']; handler.command = ['economy', 'infoeconomy', 'einfo']
handler.reg = true
export default handler
