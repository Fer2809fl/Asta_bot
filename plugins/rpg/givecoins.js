import fetch from 'node-fetch'
async function getRcanal() {
    try { const thumb = await (await fetch(global.icono)).buffer(); return { isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: global.channelRD?.id || "120363399175402285@newsletter", serverMessageId: '', newsletterName: global.channelRD?.name || "『𝕬𝖘𝖙𝖆-𝕭𝖔𝖙』" }, externalAdReply: { title: global.botname || 'ᴀsᴛᴀ-ʙᴏᴛ', body: global.dev || 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ ғᴇʀɴᴀɴᴅᴏ', mediaType: 1, mediaUrl: global.redes, sourceUrl: global.redes, thumbnail: thumb, showAdAttribution: false, containsAutoReply: true, renderLargerThumbnail: false } } } catch { return {} }
}
async function handler(m, { conn, args, usedPrefix, command }) {
    const rcanal = await getRcanal(), currency = global.currency || '¥enes'
    if (!global.db.data.chats[m.chat].economy && m.isGroup) return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ 🚫 ׄ ⬭ *ᴇᴄᴏɴᴏᴍɪ́ᴀ ᴅᴇsᴀᴄᴛɪᴠᴀᴅᴀ*\n\nׅㅤ𓏸𓈒ㅤׄ Actívala con *${usedPrefix}economy on*`, contextInfo: rcanal }, { quoted: m })
    let mentionedJid = await m.mentionedJid
    const who = m.quoted ? await m.quoted.sender : (mentionedJid?.[0]) || (args[1] ? (args[1].replace(/[@ .+-]/g, '') + '@s.whatsapp.net') : '')
    if (!args[0]) return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ 💸 ׄ ⬭ *ᴛʀᴀɴsғᴇʀɪʀ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴜsᴏ* :: *${usedPrefix + command} 25000 @mención*`, contextInfo: rcanal }, { quoted: m })
    if (!who) return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴇʀʀᴏʀ*\n\nׅㅤ𓏸𓈒ㅤׄ Menciona a alguien para transferirle ${currency}.`, contextInfo: rcanal }, { quoted: m })
    if (!(who in global.db.data.users)) return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴇʀʀᴏʀ*\n\nׅㅤ𓏸𓈒ㅤׄ El usuario no está en la base de datos.`, contextInfo: rcanal }, { quoted: m })
    let user = global.db.data.users[m.sender], recipient = global.db.data.users[who]
    user.coin ??= 0; user.bank ??= 0; recipient.coin ??= 0; recipient.bank ??= 0
    let count = Math.max(10, parseInt(args[0]) || 10)
    if (user.bank < count) return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ 💸 ׄ ⬭ *sɪɴ ғᴏɴᴅᴏs*\n\nׅㅤ𓏸𓈒ㅤׄ No tienes suficientes ${currency} en el banco.\nׅㅤ𓏸𓈒ㅤׄ *Banco* :: ¥${user.bank.toLocaleString()}`, contextInfo: rcanal }, { quoted: m })
    user.bank -= count; recipient.bank += count; if (isNaN(user.bank)) user.bank = 0
    let name = await (async () => global.db.data.users[who].name || (async () => { try { const n = await conn.getName(who); return typeof n === 'string' && n.trim() ? n : who.split('@')[0] } catch { return who.split('@')[0] } })())()
    await conn.sendMessage(m.chat, {
        text: `> . ﹡ ﹟ 💸 ׄ ⬭ *ᴛʀᴀɴsғᴇʀᴇɴᴄɪᴀ ᴇxɪᴛᴏsᴀ*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜✅* ㅤ֢ㅤ⸱ㅤᯭִ*\nׅㅤ𓏸𓈒ㅤׄ *💰 ᴇɴᴠɪᴀᴅᴏ* :: ¥${count.toLocaleString()} ${currency}\nׅㅤ𓏸𓈒ㅤׄ *👤 ʀᴇᴄᴇᴘᴛᴏʀ* :: @${who.split('@')[0]}\nׅㅤ𓏸𓈒ㅤׄ *🏦 ᴛᴜ ʙᴀɴᴄᴏ* :: ¥${user.bank.toLocaleString()} ${currency}`,
        contextInfo: { mentionedJid: [who], ...rcanal }
    }, { quoted: m })
}
handler.help = ['pay']; handler.tags = ['rpg']; handler.command = ['pay', 'coinsgive', 'givecoins']
handler.group = true; handler.reg = true
export default handler
