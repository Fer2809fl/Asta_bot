import fetch from 'node-fetch'

async function getRcanal() {
    try {
        const thumb = await (await fetch(global.icono)).buffer()
        return { isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: global.channelRD?.id || "120363399175402285@newsletter", serverMessageId: '', newsletterName: global.channelRD?.name || "『𝕬𝖘𝖙𝖆-𝕭𝖔𝖙』" }, externalAdReply: { title: global.botname || 'ᴀsᴛᴀ-ʙᴏᴛ', body: global.dev || 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ ғᴇʀɴᴀɴᴅᴏ', mediaType: 1, mediaUrl: global.redes, sourceUrl: global.redes, thumbnail: thumb, showAdAttribution: false, containsAutoReply: true, renderLargerThumbnail: false } }
    } catch { return {} }
}

let handler = async (m, { conn, usedPrefix }) => {
    const rcanal = await getRcanal()
    const currency = global.currency || '¥enes'

    if (!global.db.data.chats[m.chat].economy && m.isGroup)
        return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ 🚫 ׄ ⬭ *ᴇᴄᴏɴᴏᴍɪ́ᴀ ᴅᴇsᴀᴄᴛɪᴠᴀᴅᴀ*\n\nׅㅤ𓏸𓈒ㅤׄ Un *administrador* puede activarla con *${usedPrefix}economy on*`, contextInfo: rcanal }, { quoted: m })

    let mentionedJid = await m.mentionedJid
    let who = mentionedJid?.[0] || (m.quoted ? await m.quoted.sender : m.sender)

    if (!(who in global.db.data.users))
        return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴇʀʀᴏʀ*\n\nׅㅤ𓏸𓈒ㅤׄ El usuario no está registrado en la base de datos.`, contextInfo: rcanal }, { quoted: m })

    let name = await (async () => global.db.data.users[who].name || (async () => { try { const n = await conn.getName(who); return typeof n === 'string' && n.trim() ? n : who.split('@')[0] } catch { return who.split('@')[0] } })())()
    let user = global.db.data.users[who]
    user.coin = user.coin || 0; user.bank = user.bank || 0
    const total = user.coin + user.bank

    await conn.sendMessage(m.chat, {
        text:
            `> . ﹡ ﹟ 💰 ׄ ⬭ *ʙᴀʟᴀɴᴄᴇ*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜💳* ㅤ֢ㅤ⸱ㅤᯭִ* — *${name}*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *🪙 ᴄᴀʀᴛᴇʀᴀ* :: ¥${user.coin.toLocaleString()} ${currency}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *🏦 ʙᴀɴᴄᴏ* :: ¥${user.bank.toLocaleString()} ${currency}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *💵 ᴛᴏᴛᴀʟ* :: ¥${total.toLocaleString()} ${currency}\n\n` +
            `> ✧ Protege tu dinero con *${usedPrefix}deposit*`,
        contextInfo: { mentionedJid: [who], ...rcanal }
    }, { quoted: m })
}

handler.help = ['bal']; handler.tags = ['rpg']; handler.command = ['bal', 'balance', 'bank']
handler.group = true; handler.reg = true
export default handler
