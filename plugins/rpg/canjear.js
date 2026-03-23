import fetch from 'node-fetch'
import fs from 'fs'
async function getRcanal() {
    try { const thumb = await (await fetch(global.icono)).buffer(); return { isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: global.channelRD?.id || "120363399175402285@newsletter", serverMessageId: '', newsletterName: global.channelRD?.name || "『𝕬𝖘𝖙𝖆-𝕭𝖔𝖙』" }, externalAdReply: { title: global.botname || 'ᴀsᴛᴀ-ʙᴏᴛ', body: global.dev || 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ ғᴇʀɴᴀɴᴅᴏ', mediaType: 1, mediaUrl: global.redes, sourceUrl: global.redes, thumbnail: thumb, showAdAttribution: false, containsAutoReply: true, renderLargerThumbnail: false } } } catch { return {} }
}
let handler = async (m, { conn, usedPrefix, args }) => {
    const rcanal = await getRcanal(), currency = global.currency || '¥enes'
    const code = args[0]
    if (!code) return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ 🎟️ ׄ ⬭ *ᴄᴀɴᴊᴇᴀʀ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴜsᴏ* :: *${usedPrefix}canjear <código>*`, contextInfo: rcanal }, { quoted: m })
    const dbPath = './lib/economy_codes.json'
    if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, '{}')
    const codes = JSON.parse(fs.readFileSync(dbPath))
    if (!codes[code]) return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ ❌ ׄ ⬭ *ᴄᴏ́ᴅɪɢᴏ ɪɴᴠᴀ́ʟɪᴅᴏ*\n\nׅㅤ𓏸𓈒ㅤׄ El código no existe o ya expiró.`, contextInfo: rcanal }, { quoted: m })
    if (codes[code].usedBy.includes(m.sender)) return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ʏᴀ ᴜsᴀᴅᴏ*\n\nׅㅤ𓏸𓈒ㅤׄ Ya usaste este código anteriormente.`, contextInfo: rcanal }, { quoted: m })
    if (codes[code].usedBy.length >= codes[code].maxUses) {
        delete codes[code]; fs.writeFileSync(dbPath, JSON.stringify(codes, null, 2))
        return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ 🚫 ׄ ⬭ *ᴇxᴘɪʀᴀᴅᴏ*\n\nׅㅤ𓏸𓈒ㅤׄ Este código alcanzó su límite de usos.`, contextInfo: rcanal }, { quoted: m })
    }
    let user = global.db.data.users[m.sender]
    user.coin = (user.coin || 0) + codes[code].amount
    codes[code].usedBy.push(m.sender)
    fs.writeFileSync(dbPath, JSON.stringify(codes, null, 2))
    await conn.sendMessage(m.chat, {
        text:
            `> . ﹡ ﹟ 🎉 ׄ ⬭ *ᴄᴏ́ᴅɪɢᴏ ᴄᴀɴᴊᴇᴀᴅᴏ*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜✅* ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *🎟️ ᴄᴏ́ᴅɪɢᴏ* :: ${code}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *💰 ʀᴇᴄᴏᴍᴘᴇɴsᴀ* :: ¥${codes[code].amount.toLocaleString()} ${currency}`,
        contextInfo: rcanal
    }, { quoted: m })
}
handler.help = ['canjear']; handler.tags = ['economy']; handler.command = ['canjear']
handler.group = true; handler.reg = true
export default handler
