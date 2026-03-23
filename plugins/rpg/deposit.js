import fetch from 'node-fetch'
async function getRcanal() {
    try { const thumb = await (await fetch(global.icono)).buffer(); return { isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: global.channelRD?.id || "120363399175402285@newsletter", serverMessageId: '', newsletterName: global.channelRD?.name || "『𝕬𝖘𝖙𝖆-𝕭𝖔𝖙』" }, externalAdReply: { title: global.botname || 'ᴀsᴛᴀ-ʙᴏᴛ', body: global.dev || 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ ғᴇʀɴᴀɴᴅᴏ', mediaType: 1, mediaUrl: global.redes, sourceUrl: global.redes, thumbnail: thumb, showAdAttribution: false, containsAutoReply: true, renderLargerThumbnail: false } } } catch { return {} }
}
let handler = async (m, { args, usedPrefix, command, conn }) => {
    const rcanal = await getRcanal(), currency = global.currency || '¥enes'
    if (!global.db.data.chats[m.chat].economy && m.isGroup) return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ 🚫 ׄ ⬭ *ᴇᴄᴏɴᴏᴍɪ́ᴀ ᴅᴇsᴀᴄᴛɪᴠᴀᴅᴀ*\n\nׅㅤ𓏸𓈒ㅤׄ Actívala con *${usedPrefix}economy on*`, contextInfo: rcanal }, { quoted: m })
    let user = global.db.data.users[m.sender]; user.coin ??= 0; user.bank ??= 0
    if (!args[0]) return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ 🏦 ׄ ⬭ *ᴅᴇᴘᴏsɪᴛᴀʀ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴜsᴏ* :: *${usedPrefix + command} 25000*\nׅㅤ𓏸𓈒ㅤׄ *ᴏ* :: *${usedPrefix + command} all*`, contextInfo: rcanal }, { quoted: m })
    let count
    if (args[0] === 'all') {
        count = parseInt(user.coin)
        if (!count) return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ 💸 ׄ ⬭ *sɪɴ ғᴏɴᴅᴏs*\n\nׅㅤ𓏸𓈒ㅤׄ No tienes ${currency} en cartera.`, contextInfo: rcanal }, { quoted: m })
    } else {
        count = parseInt(args[0])
        if (isNaN(count) || count < 1) return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴇʀʀᴏʀ*\n\nׅㅤ𓏸𓈒ㅤׄ Cantidad inválida.`, contextInfo: rcanal }, { quoted: m })
        if (user.coin < count) return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ 💸 ׄ ⬭ *sɪɴ ғᴏɴᴅᴏs*\n\nׅㅤ𓏸𓈒ㅤׄ Solo tienes *¥${user.coin.toLocaleString()} ${currency}* en cartera.`, contextInfo: rcanal }, { quoted: m })
    }
    user.coin -= count; user.bank += count
    await conn.sendMessage(m.chat, {
        text:
            `> . ﹡ ﹟ 🏦 ׄ ⬭ *ᴅᴇᴘᴏsɪᴛᴏ ᴇxɪᴛᴏsᴏ*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜✅* ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *💰 ᴅᴇᴘᴏsɪᴛᴀᴅᴏ* :: ¥${count.toLocaleString()} ${currency}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *🪙 ᴄᴀʀᴛᴇʀᴀ* :: ¥${user.coin.toLocaleString()} ${currency}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *🏦 ʙᴀɴᴄᴏ* :: ¥${user.bank.toLocaleString()} ${currency}`,
        contextInfo: rcanal
    }, { quoted: m })
}
handler.help = ['depositar']; handler.tags = ['rpg']; handler.command = ['deposit', 'depositar', 'd', 'dep']
handler.group = true; handler.reg = true
export default handler
