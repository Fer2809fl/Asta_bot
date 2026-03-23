import fetch from 'node-fetch'
async function getRcanal() {
    try { const thumb = await (await fetch(global.icono)).buffer(); return { isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: global.channelRD?.id || "120363399175402285@newsletter", serverMessageId: '', newsletterName: global.channelRD?.name || "『𝕬𝖘𝖙𝖆-𝕭𝖔𝖙』" }, externalAdReply: { title: global.botname || 'ᴀsᴛᴀ-ʙᴏᴛ', body: global.dev || 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ ғᴇʀɴᴀɴᴅᴏ', mediaType: 1, mediaUrl: global.redes, sourceUrl: global.redes, thumbnail: thumb, showAdAttribution: false, containsAutoReply: true, renderLargerThumbnail: false } } } catch { return {} }
}
let handler = async (m, { conn, usedPrefix, command }) => {
    const rcanal = await getRcanal(), currency = global.currency || '¥enes'
    if (!global.db.data.chats[m.chat].economy && m.isGroup) return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ 🚫 ׄ ⬭ *ᴇᴄᴏɴᴏᴍɪ́ᴀ ᴅᴇsᴀᴄᴛɪᴠᴀᴅᴀ*\n\nׅㅤ𓏸𓈒ㅤׄ Actívala con *${usedPrefix}economy on*`, contextInfo: rcanal }, { quoted: m })
    let user = global.db.data.users[m.sender], cooldown = 2 * 60 * 1000
    user.lastwork ??= 0
    if (Date.now() < user.lastwork) return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ ⏳ ׄ ⬭ *ᴄᴏᴏʟᴅᴏᴡɴ*\n\nׅㅤ𓏸𓈒ㅤׄ Espera *${fmt(user.lastwork - Date.now())}* para *${usedPrefix + command}*.`, contextInfo: rcanal }, { quoted: m })
    user.lastwork = Date.now() + cooldown
    let rsl = Math.floor(Math.random() * 1501) + 2000
    user.coin += rsl
    await conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ 💼 ׄ ⬭ *ᴛʀᴀʙᴀᴊᴏ*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜✅* ㅤ֢ㅤ⸱ㅤᯭִ*\nׅㅤ𓏸𓈒ㅤׄ ${pick(trabajo)}\nׅㅤ𓏸𓈒ㅤׄ *💰 ɢᴀɴᴀsᴛᴇ* :: ¥${rsl.toLocaleString()} ${currency}`, contextInfo: rcanal }, { quoted: m })
}
handler.help = ['work']; handler.tags = ['economy']; handler.command = ['w', 'work', 'chambear', 'chamba', 'trabajar']; handler.group = true; handler.reg = true
export default handler
function fmt(ms) { const s=Math.ceil(ms/1000),m=Math.floor((s%3600)/60),sec=s%60; return [m&&`${m}m`,`${sec}s`].filter(Boolean).join(' ') }
function pick(list) { return list[Math.floor(Math.random()*list.length)] }
const trabajo = ["Trabajas como cortador de galletas y ganas","Trabaja para una empresa militar privada, ganando","Trabajas todo el día en la empresa por","Diseñaste un logo para una empresa por","Trabajas como podador de arbustos y ganas","Trabajas como artista callejera y ganas","Reparaste un tanque averiado y la tripulación te pagó","Reparas las máquinas recreativas y recibes","Hiciste trabajos ocasionales en la ciudad y ganaste","Limpias moho tóxico de la ventilación y ganas","Trabajas como zoólogo y ganas","Vendiste sándwiches y obtuviste","Trabajas en Disneyland disfrazado y ganas","Desarrollas juegos para ganarte la vida y ganas","Trabajas como escritor de galletas de la fortuna y ganas","Revisas tu bolso y vendes artículos inútiles, ganaste","Trabajas 10 minutos en un Pizza Hut local. Ganaste"]
