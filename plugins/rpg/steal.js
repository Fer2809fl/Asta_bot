import fetch from 'node-fetch'
async function getRcanal() {
    try { const thumb = await (await fetch(global.icono)).buffer(); return { isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: global.channelRD?.id || "120363399175402285@newsletter", serverMessageId: '', newsletterName: global.channelRD?.name || "『𝕬𝖘𝖙𝖆-𝕭𝖔𝖙』" }, externalAdReply: { title: global.botname || 'ᴀsᴛᴀ-ʙᴏᴛ', body: global.dev || 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ ғᴇʀɴᴀɴᴅᴏ', mediaType: 1, mediaUrl: global.redes, sourceUrl: global.redes, thumbnail: thumb, showAdAttribution: false, containsAutoReply: true, renderLargerThumbnail: false } } } catch { return {} }
}
const handler = async (m, { conn, usedPrefix, command }) => {
    const rcanal = await getRcanal(), currency = global.currency || '¥enes'
    if (!global.db.data.chats[m.chat].economy && m.isGroup) return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ 🚫 ׄ ⬭ *ᴇᴄᴏɴᴏᴍɪ́ᴀ ᴅᴇsᴀᴄᴛɪᴠᴀᴅᴀ*\n\nׅㅤ𓏸𓈒ㅤׄ Actívala con *${usedPrefix}economy on*`, contextInfo: rcanal }, { quoted: m })
    const user = global.db.data.users[m.sender]; user.lastrob ??= 0
    if (Date.now() < user.lastrob) return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ ⏳ ׄ ⬭ *ᴄᴏᴏʟᴅᴏᴡɴ*\n\nׅㅤ𓏸𓈒ㅤׄ Espera *${fmt(user.lastrob - Date.now())}* para *${usedPrefix + command}*.`, contextInfo: rcanal }, { quoted: m })
    let mentionedJid = await m.mentionedJid
    let who = mentionedJid?.[0] || (m.quoted ? await m.quoted.sender : null)
    if (!who) return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ʀᴏʙᴀʀ*\n\nׅㅤ𓏸𓈒ㅤׄ Menciona a alguien para robarle.`, contextInfo: rcanal }, { quoted: m })
    if (!(who in global.db.data.users)) return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴇʀʀᴏʀ*\n\nׅㅤ𓏸𓈒ㅤׄ El usuario no está en la base de datos.`, contextInfo: rcanal }, { quoted: m })
    let name = await (async () => global.db.data.users[who].name || (async () => { try { const n = await conn.getName(who); return typeof n === 'string' && n.trim() ? n : who.split('@')[0] } catch { return who.split('@')[0] } })())()
    const target = global.db.data.users[who]; target.coin ??= 0; target.bank ??= 0
    if (Date.now() - (target.lastwork || 0) < 3600000) return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ɪᴍᴘᴏsɪʙʟᴇ*\n\nׅㅤ𓏸𓈒ㅤׄ Solo puedes robarle a alguien inactivo por más de 1 hora.`, contextInfo: { mentionedJid: [who], ...rcanal } }, { quoted: m })
    const rob = Math.floor(Math.random() * 1001) + 2000
    if (target.coin < rob) return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ 💸 ׄ ⬭ *sɪɴ ᴅɪɴᴇʀᴏ*\n\nׅㅤ𓏸𓈒ㅤׄ *${name}* no tiene suficiente en cartera.`, contextInfo: { mentionedJid: [who], ...rcanal } }, { quoted: m })
    user.coin += rob; target.coin -= rob; user.lastrob = Date.now() + 7200000
    await conn.sendMessage(m.chat, {
        text:
            `> . ﹡ ﹟ 🥷 ׄ ⬭ *ʀᴏʙᴏ ᴇxɪᴛᴏsᴏ*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜💰* ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴠɪ́ᴄᴛɪᴍᴀ* :: @${who.split('@')[0]}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ʀᴏʙᴀᴅᴏ* :: ¥${rob.toLocaleString()} ${currency}`,
        contextInfo: { mentionedJid: [who], ...rcanal }
    }, { quoted: m })
}
handler.help = ['rob']; handler.tags = ['rpg']; handler.command = ['robar', 'steal', 'rob']
handler.group = true; handler.reg = true
export default handler
function fmt(ms) { const s = Math.ceil(ms / 1000), h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60; return [h && `${h}h`, m && `${m}m`, `${sec}s`].filter(Boolean).join(' ') }
