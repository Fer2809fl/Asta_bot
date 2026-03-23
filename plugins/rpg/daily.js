import fetch from 'node-fetch'

async function getRcanal() {
    try {
        const thumb = await (await fetch(global.icono)).buffer()
        return { isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: global.channelRD?.id || "120363399175402285@newsletter", serverMessageId: '', newsletterName: global.channelRD?.name || "『𝕬𝖘𝖙𝖆-𝕭𝖔𝖙』" }, externalAdReply: { title: global.botname || 'ᴀsᴛᴀ-ʙᴏᴛ', body: global.dev || 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ ғᴇʀɴᴀɴᴅᴏ', mediaType: 1, mediaUrl: global.redes, sourceUrl: global.redes, thumbnail: thumb, showAdAttribution: false, containsAutoReply: true, renderLargerThumbnail: false } }
    } catch { return {} }
}

var handler = async (m, { conn, usedPrefix }) => {
    const rcanal = await getRcanal()
    const currency = global.currency || '¥enes'

    if (!global.db.data.chats[m.chat].economy && m.isGroup)
        return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ 🚫 ׄ ⬭ *ᴇᴄᴏɴᴏᴍɪ́ᴀ ᴅᴇsᴀᴄᴛɪᴠᴀᴅᴀ*\n\nׅㅤ𓏸𓈒ㅤׄ Actívala con *${usedPrefix}economy on*`, contextInfo: rcanal }, { quoted: m })

    let user = global.db.data.users[m.sender]
    let now = Date.now(), gap = 86400000, maxStreak = 200
    user.streak ??= 0; user.lastDailyGlobal ??= 0; user.coin ??= 0; user.exp ??= 0; user.lastDaily ??= 0

    if (now < user.lastDaily) {
        const wait = formatTime(Math.floor((user.lastDaily - now) / 1000))
        return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ ⏳ ׄ ⬭ *ᴅᴀɪʟʏ*\n\nׅㅤ𓏸𓈒ㅤׄ Ya reclamaste tu daily de hoy.\nׅㅤ𓏸𓈒ㅤׄ Vuelve en *${wait}*`, contextInfo: rcanal }, { quoted: m })
    }

    let lost = user.streak >= 1 && now - user.lastDailyGlobal > gap * 1.5
    if (lost) user.streak = 0
    if (now - user.lastDailyGlobal >= gap) { user.streak = Math.min(user.streak + 1, maxStreak); user.lastDailyGlobal = now }

    let reward = Math.min(20000 + (user.streak - 1) * 5000, 1015000)
    let expRandom = Math.floor(Math.random() * 81) + 20
    user.coin += reward; user.exp += expRandom; user.lastDaily = now + gap
    let nextReward = Math.min(20000 + user.streak * 5000, 1015000).toLocaleString()

    await conn.sendMessage(m.chat, {
        text:
            `> . ﹡ ﹟ 💰 ׄ ⬭ *ᴅᴀɪʟʏ*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜✅* ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *💸 ʀᴇᴄᴏᴍᴘᴇɴsᴀ* :: ¥${reward.toLocaleString()} ${currency}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *🗓 ᴅɪ́ᴀ* :: ${user.streak}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *🔹 ᴘʀᴏ́xɪᴍᴏ ᴅɪ́ᴀ* :: +¥${nextReward}\n` +
            (lost ? `ׅㅤ𓏸𓈒ㅤׄ *⚠️* Perdiste tu racha de días` : ''),
        contextInfo: rcanal
    }, { quoted: m })
}

handler.help = ['daily']; handler.tags = ['rpg']; handler.command = ['daily', 'diario']
handler.group = true; handler.reg = true
export default handler

function formatTime(t) { const h = Math.floor(t/3600), m = Math.floor((t%3600)/60), s = t%60; return [h&&`${h}h`, (m||h)&&`${m}m`, `${s}s`].filter(Boolean).join(' ') }
