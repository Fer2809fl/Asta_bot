import fetch from 'node-fetch'
async function getRcanal() {
    try { const thumb = await (await fetch(global.icono)).buffer(); return { isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: global.channelRD?.id || "120363399175402285@newsletter", serverMessageId: '', newsletterName: global.channelRD?.name || "『𝕬𝖘𝖙𝖆-𝕭𝖔𝖙』" }, externalAdReply: { title: global.botname || 'ᴀsᴛᴀ-ʙᴏᴛ', body: global.dev || 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ ғᴇʀɴᴀɴᴅᴏ', mediaType: 1, mediaUrl: global.redes, sourceUrl: global.redes, thumbnail: thumb, showAdAttribution: false, containsAutoReply: true, renderLargerThumbnail: false } } } catch { return {} }
}
const handler = async (m, { conn, text, command, usedPrefix }) => {
    const rcanal = await getRcanal(), currency = global.currency || '¥enes'
    if (!global.db.data.chats[m.chat].economy && m.isGroup) return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ 🚫 ׄ ⬭ *ᴇᴄᴏɴᴏᴍɪ́ᴀ ᴅᴇsᴀᴄᴛɪᴠᴀᴅᴀ*\n\nׅㅤ𓏸𓈒ㅤׄ Actívala con *${usedPrefix}economy on*`, contextInfo: rcanal }, { quoted: m })
    const users = global.db.data.users[m.sender]
    if (!text) return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ 🎡 ׄ ⬭ *ʀᴜʟᴇᴛᴀ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴜsᴏ* :: *${usedPrefix + command} 2500 red*\nׅㅤ𓏸𓈒ㅤׄ Colores: *red* o *black*`, contextInfo: rcanal }, { quoted: m })
    const args = text.trim().split(" ")
    if (args.length !== 2) return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴇʀʀᴏʀ*\n\nׅㅤ𓏸𓈒ㅤׄ Formato: *${usedPrefix + command} 2500 red*`, contextInfo: rcanal }, { quoted: m })
    let coin = parseInt(args[0]), color = args[1].toLowerCase()
    if (isNaN(coin) || coin <= 0) return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴇʀʀᴏʀ*\n\nׅㅤ𓏸𓈒ㅤׄ Cantidad inválida.`, contextInfo: rcanal }, { quoted: m })
    if (!['black','red'].includes(color)) return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴇʀʀᴏʀ*\n\nׅㅤ𓏸𓈒ㅤׄ Solo *black* o *red*.`, contextInfo: rcanal }, { quoted: m })
    if (coin > users.coin) return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ 💸 ׄ ⬭ *sɪɴ ғᴏɴᴅᴏs*\n\nׅㅤ𓏸𓈒ㅤׄ No tienes suficientes ${currency}.`, contextInfo: rcanal }, { quoted: m })
    const resultColor = Math.random() < 0.5 ? 'black' : 'red', win = color === resultColor
    if (win) users.coin += coin; else users.coin -= coin
    const colorEmoji = resultColor === 'red' ? '🔴' : '⚫'
    await conn.sendMessage(m.chat, {
        text: `> . ﹡ ﹟ 🎡 ׄ ⬭ *ʀᴜʟᴇᴛᴀ*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜${colorEmoji}* ㅤ֢ㅤ⸱ㅤᯭִ*\nׅㅤ𓏸𓈒ㅤׄ *ʀᴇsᴜʟᴛᴀᴅᴏ* :: ${colorEmoji} ${resultColor}\nׅㅤ𓏸𓈒ㅤׄ *ᴇʟᴇᴄᴄɪᴏ́ɴ* :: ${color}\nׅㅤ𓏸𓈒ㅤׄ *${win ? '✅ ɢᴀɴᴀsᴛᴇ' : '❌ ᴘᴇʀᴅɪsᴛᴇ'}* :: ¥${coin.toLocaleString()} ${currency}`,
        contextInfo: rcanal
    }, { quoted: m })
}
handler.help = ['ruleta2']; handler.tags = ['economy']; handler.command = ['ruleta2', 'roulette2', 'rt2']; handler.group = true; handler.reg = true
export default handler
