import fetch from 'node-fetch'

async function getRcanal() {
    try {
        const thumb = await (await fetch(global.icono)).buffer()
        return { isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: global.channelRD?.id || "120363399175402285@newsletter", serverMessageId: '', newsletterName: global.channelRD?.name || "『𝕬𝖘𝖙𝖆-𝕭𝖔𝖙』" }, externalAdReply: { title: global.botname || 'ᴀsᴛᴀ-ʙᴏᴛ', body: global.dev || 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ ғᴇʀɴᴀɴᴅᴏ', mediaType: 1, mediaUrl: global.redes, sourceUrl: global.redes, thumbnail: thumb, showAdAttribution: false, containsAutoReply: true, renderLargerThumbnail: false } }
    } catch { return {} }
}

let handler = async (m, { conn, args, usedPrefix }) => {
    const rcanal = await getRcanal()
    const currency = global.currency || '¥enes'

    if (!global.db.data.chats[m.chat].economy && m.isGroup)
        return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ 🚫 ׄ ⬭ *ᴇᴄᴏɴᴏᴍɪ́ᴀ ᴅᴇsᴀᴄᴛɪᴠᴀᴅᴀ*\n\nׅㅤ𓏸𓈒ㅤׄ Un *administrador* puede activarla con *${usedPrefix}economy on*`, contextInfo: rcanal }, { quoted: m })

    const users = Object.entries(global.db.data.users)
        .map(([jid, data]) => ({ jid, coin: data.coin || 0, bank: data.bank || 0, name: data.name || jid.split('@')[0] }))
        .filter(u => (u.coin + u.bank) > 0)
        .sort((a, b) => (b.coin + b.bank) - (a.coin + a.bank))

    const totalPages = Math.ceil(users.length / 10)
    const page = Math.max(1, Math.min(parseInt(args[0]) || 1, totalPages))
    const slice = users.slice((page - 1) * 10, page * 10)
    const medals = ['🥇', '🥈', '🥉']

    let text = `> . ﹡ ﹟ 💎 ׄ ⬭ *ʀᴀɴᴋɪɴɢ ᴅᴇ ʀɪǫᴜᴇᴢᴀ*\n\n`
    text += `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜💰* ㅤ֢ㅤ⸱ㅤᯭִ* — *ᴛᴏᴘ ${currency}*\n`

    for (let i = 0; i < slice.length; i++) {
        const { jid, coin, bank, name } = slice[i]
        const total = coin + bank
        const pos = (page - 1) * 10 + i + 1
        let userName = name
        try { const n = await conn.getName(jid); if (n?.trim()) userName = n.trim() } catch {}
        const medal = pos <= 3 ? medals[pos - 1] : `${pos}.`
        text += `\nׅㅤ𓏸𓈒ㅤׄ ${medal} *${userName}*\n`
        text += `ׅㅤ𓏸𓈒ㅤׄ 💰 Total :: ¥${total.toLocaleString()} | 💵 ¥${coin.toLocaleString()} | 🏦 ¥${bank.toLocaleString()}\n`
    }

    text += `\n> ✦ Página *${page}* de *${totalPages}*`
    if (page < totalPages) text += `\n> ➨ Siguiente :: *${usedPrefix}baltop ${page + 1}*`

    await conn.sendMessage(m.chat, { text, contextInfo: rcanal }, { quoted: m })
}

handler.help = ['baltop']; handler.tags = ['rpg']; handler.command = ['baltop', 'eboard', 'economyboard']
handler.group = true; handler.reg = true
export default handler
