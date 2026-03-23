import fetch from 'node-fetch'
async function getRcanal() {
    try { const thumb = await (await fetch(global.icono)).buffer(); return { isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: global.channelRD?.id || "120363399175402285@newsletter", serverMessageId: '', newsletterName: global.channelRD?.name || "『𝕬𝖘𝖙𝖆-𝕭𝖔𝖙』" }, externalAdReply: { title: global.botname || 'ᴀsᴛᴀ-ʙᴏᴛ', body: global.dev || 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ ғᴇʀɴᴀɴᴅᴏ', mediaType: 1, mediaUrl: global.redes, sourceUrl: global.redes, thumbnail: thumb, showAdAttribution: false, containsAutoReply: true, renderLargerThumbnail: false } } } catch { return {} }
}
const handler = async (m, { conn, text, command, usedPrefix }) => {
    const rcanal = await getRcanal(), currency = global.currency || '¥enes'
    if (!global.db.data.chats[m.chat].economy && m.isGroup) return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ 🚫 ׄ ⬭ *ᴇᴄᴏɴᴏᴍɪ́ᴀ ᴅᴇsᴀᴄᴛɪᴠᴀᴅᴀ*\n\nׅㅤ𓏸𓈒ㅤׄ Actívala con *${usedPrefix}economy on*`, contextInfo: rcanal }, { quoted: m })
    const user = global.db.data.users[m.sender]
    if (!text) return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ 🪙 ׄ ⬭ *ᴄᴏɪɴғʟɪᴘ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴜsᴏ* :: *${usedPrefix + command} 150 cara*\nׅㅤ𓏸𓈒ㅤׄ Opciones: *cara* o *cruz*`, contextInfo: rcanal }, { quoted: m })
    const args = text.trim().split(/\s+/)
    if (!args[0] || !args[1]) return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴇʀʀᴏʀ*\n\nׅㅤ𓏸𓈒ㅤׄ Formato: *${usedPrefix + command} 150 cruz*`, contextInfo: rcanal }, { quoted: m })
    const cantidad = parseFloat(args[0]), eleccion = args[1].toLowerCase()
    if (isNaN(cantidad)) return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴇʀʀᴏʀ*\n\nׅㅤ𓏸𓈒ㅤׄ Cantidad inválida.`, contextInfo: rcanal }, { quoted: m })
    if (Math.abs(cantidad) < 100) return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴇʀʀᴏʀ*\n\nׅㅤ𓏸𓈒ㅤׄ Mínimo 100 ${currency}.`, contextInfo: rcanal }, { quoted: m })
    if (!['cara', 'cruz'].includes(eleccion)) return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴇʀʀᴏʀ*\n\nׅㅤ𓏸𓈒ㅤׄ Solo *cara* o *cruz*.`, contextInfo: rcanal }, { quoted: m })
    if (cantidad > user.coin) return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ 💸 ׄ ⬭ *sɪɴ ғᴏɴᴅᴏs*\n\nׅㅤ𓏸𓈒ㅤׄ Tienes *¥${user.coin.toLocaleString()} ${currency}*.`, contextInfo: rcanal }, { quoted: m })
    const resultado = Math.random() < 0.5 ? 'cara' : 'cruz', acierto = resultado === eleccion
    const cambio = acierto ? cantidad : -cantidad
    user.coin += cambio; if (user.coin < 0) user.coin = 0
    await conn.sendMessage(m.chat, {
        text: `> . ﹡ ﹟ 🪙 ׄ ⬭ *ᴄᴏɪɴғʟɪᴘ*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜${acierto ? '✅' : '❌'}* ㅤ֢ㅤ⸱ㅤᯭִ*\nׅㅤ𓏸𓈒ㅤׄ *ᴍᴏɴᴇᴅᴀ* :: ${resultado.charAt(0).toUpperCase() + resultado.slice(1)}\nׅㅤ𓏸𓈒ㅤׄ *ᴇʟᴇᴄᴄɪᴏ́ɴ* :: ${eleccion.charAt(0).toUpperCase() + eleccion.slice(1)}\nׅㅤ𓏸𓈒ㅤׄ *ʀᴇsᴜʟᴛᴀᴅᴏ* :: ${acierto ? '✅ Ganaste' : '❌ Perdiste'} ¥${Math.abs(cambio).toLocaleString()} ${currency}`,
        contextInfo: rcanal
    }, { quoted: m })
}
handler.help = ['cf']; handler.tags = ['economy']; handler.command = ['cf', 'suerte', 'coinflip', 'flip']; handler.group = true; handler.reg = true
export default handler
