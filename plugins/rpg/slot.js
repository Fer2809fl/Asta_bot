import fetch from 'node-fetch'
import { delay } from '@whiskeysockets/baileys'
async function getRcanal() {
    try { const thumb = await (await fetch(global.icono)).buffer(); return { isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: global.channelRD?.id || "120363399175402285@newsletter", serverMessageId: '', newsletterName: global.channelRD?.name || "『𝕬𝖘𝖙𝖆-𝕭𝖔𝖙』" }, externalAdReply: { title: global.botname || 'ᴀsᴛᴀ-ʙᴏᴛ', body: global.dev || 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ ғᴇʀɴᴀɴᴅᴏ', mediaType: 1, mediaUrl: global.redes, sourceUrl: global.redes, thumbnail: thumb, showAdAttribution: false, containsAutoReply: true, renderLargerThumbnail: false } } } catch { return {} }
}
const handler = async (m, { args, usedPrefix, command, conn }) => {
    const rcanal = await getRcanal(), currency = global.currency || '¥enes'
    if (!global.db.data.chats[m.chat].economy && m.isGroup) return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ 🚫 ׄ ⬭ *ᴇᴄᴏɴᴏᴍɪ́ᴀ ᴅᴇsᴀᴄᴛɪᴠᴀᴅᴀ*\n\nׅㅤ𓏸𓈒ㅤׄ Actívala con *${usedPrefix}economy on*`, contextInfo: rcanal }, { quoted: m })
    const users = global.db.data.users[m.sender]; users.lastslot ??= 0
    if (!args[0] || isNaN(args[0]) || parseInt(args[0]) <= 0) return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ 🎰 ׄ ⬭ *sʟᴏᴛs*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴜsᴏ* :: *${usedPrefix + command} 500*\nׅㅤ𓏸𓈒ㅤׄ Mínimo 100 ${currency}`, contextInfo: rcanal }, { quoted: m })
    const apuesta = parseInt(args[0])
    if (Date.now() - users.lastslot < 10000) return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ ⏳ ׄ ⬭ *ᴄᴏᴏʟᴅᴏᴡɴ*\n\nׅㅤ𓏸𓈒ㅤׄ Espera *${fmt(users.lastslot + 10000 - Date.now())}*.`, contextInfo: rcanal }, { quoted: m })
    if (apuesta < 100) return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴇʀʀᴏʀ*\n\nׅㅤ𓏸𓈒ㅤׄ Mínimo 100 ${currency}.`, contextInfo: rcanal }, { quoted: m })
    if (users.coin < apuesta) return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ 💸 ׄ ⬭ *sɪɴ ғᴏɴᴅᴏs*\n\nׅㅤ𓏸𓈒ㅤׄ No tienes suficientes ${currency}.`, contextInfo: rcanal }, { quoted: m })
    const emojis = ['✾', '❃', '❁']
    const rand = () => Array.from({ length: 3 }, () => emojis[Math.floor(Math.random() * emojis.length)])
    const slotLine = (x, y, z) => `${x[0]} : ${y[0]} : ${z[0]}\n${x[1]} : ${y[1]} : ${z[1]}\n${x[2]} : ${y[2]} : ${z[2]}`
    let { key } = await conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ 🎰 ׄ ⬭ *sʟᴏᴛs*\n\nׅㅤ𓏸𓈒ㅤׄ Girando...` }, { quoted: m })
    for (let i = 0; i < 5; i++) {
        const [x, y, z] = [rand(), rand(), rand()]
        await conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ 🎰 ׄ ⬭ *sʟᴏᴛs*\n\n${slotLine(x, y, z)}`, edit: key }, { quoted: m })
        await delay(300)
    }
    const [x, y, z] = [rand(), rand(), rand()]
    let resultado, ganancia = 0
    if (x[0] === y[0] && y[0] === z[0]) { ganancia = apuesta; users.coin += ganancia; resultado = `✅ *Ganaste ¥${(apuesta * 2).toLocaleString()} ${currency}*` }
    else if (x[0] === y[0] || x[0] === z[0] || y[0] === z[0]) { users.coin += 10; resultado = `🔶 *Casi! +¥10 ${currency} de consolación*` }
    else { users.coin -= apuesta; resultado = `❌ *Perdiste ¥${apuesta.toLocaleString()} ${currency}*` }
    users.lastslot = Date.now()
    await conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ 🎰 ׄ ⬭ *sʟᴏᴛs*\n\n${slotLine(x, y, z)}\n\nׅㅤ𓏸𓈒ㅤׄ ${resultado}`, edit: key }, { quoted: m })
}
handler.help = ['slot']; handler.tags = ['rpg']; handler.command = ['slot']
handler.group = true; handler.reg = true
export default handler
function fmt(ms) { const s = Math.ceil(ms/1000), m = Math.floor((s%3600)/60), sec = s%60; return [m&&`${m}m`, `${sec}s`].filter(Boolean).join(' ') }
