import fetch from 'node-fetch'
async function getRcanal() {
    try { const thumb = await (await fetch(global.icono)).buffer(); return { isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: global.channelRD?.id || "120363399175402285@newsletter", serverMessageId: '', newsletterName: global.channelRD?.name || "『𝕬𝖘𝖙𝖆-𝕭𝖔𝖙』" }, externalAdReply: { title: global.botname || 'ᴀsᴛᴀ-ʙᴏᴛ', body: global.dev || 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ ғᴇʀɴᴀɴᴅᴏ', mediaType: 1, mediaUrl: global.redes, sourceUrl: global.redes, thumbnail: thumb, showAdAttribution: false, containsAutoReply: true, renderLargerThumbnail: false } } } catch { return {} }
}
let handler = async (m, { conn, usedPrefix, command }) => {
    const rcanal = await getRcanal(), currency = global.currency || '¥enes'
    if (!global.db.data.chats[m.chat].economy && m.isGroup) return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ 🚫 ׄ ⬭ *ᴇᴄᴏɴᴏᴍɪ́ᴀ ᴅᴇsᴀᴄᴛɪᴠᴀᴅᴀ*\n\nׅㅤ𓏸𓈒ㅤׄ Actívala con *${usedPrefix}economy on*`, contextInfo: rcanal }, { quoted: m })
    let user = global.db.data.users[m.sender]; user.lastcrime ??= 0; user.coin ??= 0
    const cooldown = 8 * 60 * 1000, ahora = Date.now()
    if (ahora < user.lastcrime) return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ ⏳ ׄ ⬭ *ᴄᴏᴏʟᴅᴏᴡɴ*\n\nׅㅤ𓏸𓈒ㅤׄ Espera *${fmt(user.lastcrime - ahora)}* para *${usedPrefix + command}*.`, contextInfo: rcanal }, { quoted: m })
    user.lastcrime = ahora + cooldown
    const evento = pick(crimen)
    let cantidad
    if (evento.tipo === 'victoria') { cantidad = Math.floor(Math.random() * 1501) + 6000; user.coin += cantidad }
    else { cantidad = Math.floor(Math.random() * 1501) + 4000; user.coin -= cantidad; if (user.coin < 0) user.coin = 0 }
    await conn.sendMessage(m.chat, {
        text: `> . ﹡ ﹟ 🦹 ׄ ⬭ *ᴄʀɪᴍᴇɴ — ${evento.tipo === 'victoria' ? '✅ ᴇ́xɪᴛᴏ' : '❌ ғᴀʟʟɪᴅᴏ'}*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜${evento.tipo === 'victoria' ? '💰' : '💸'}* ㅤ֢ㅤ⸱ㅤᯭִ*\nׅㅤ𓏸𓈒ㅤׄ ${evento.mensaje}\nׅㅤ𓏸𓈒ㅤׄ *${evento.tipo === 'victoria' ? '💎 ɢᴀɴᴀsᴛᴇ' : '💸 ᴘᴇʀᴅɪsᴛᴇ'}* :: ¥${cantidad.toLocaleString()} ${currency}`,
        contextInfo: rcanal
    }, { quoted: m })
}
handler.tags = ['economy']; handler.help = ['crimen']; handler.command = ['crimen', 'crime']; handler.group = true; handler.reg = true
export default handler
function fmt(ms) { const s=Math.ceil(ms/1000),m=Math.floor((s%3600)/60),sec=s%60; return [m&&`${m}m`,`${sec}s`].filter(Boolean).join(' ') }
function pick(list) { return list[Math.floor(Math.random()*list.length)] }
const crimen = [
{ tipo: 'victoria', mensaje: "Hackeaste un cajero automático usando un exploit del sistema." },
{ tipo: 'victoria', mensaje: "Te infiltraste como técnico en una mansión y robaste joyas." },
{ tipo: 'victoria', mensaje: "Simulaste una transferencia bancaria falsa y obtuviste fondos." },
{ tipo: 'victoria', mensaje: "Vaciaste una cartera olvidada en un restaurante sin que nadie lo notara." },
{ tipo: 'victoria', mensaje: "Te hiciste pasar por repartidor y sustrajiste un paquete de colección." },
{ tipo: 'victoria', mensaje: "Falsificaste entradas VIP y accediste a un área con objetos exclusivos." },
{ tipo: 'victoria', mensaje: "Engañaste a un coleccionista vendiéndole una réplica como pieza original." },
{ tipo: 'derrota', mensaje: "Intentaste vender un reloj falso, pero el comprador notó el engaño." },
{ tipo: 'derrota', mensaje: "Hackeaste una cuenta bancaria, pero olvidaste ocultar tu IP." },
{ tipo: 'derrota', mensaje: "Robaste una mochila, pero una cámara oculta capturó todo el acto." },
{ tipo: 'derrota', mensaje: "Te infiltraste en una tienda, pero el sistema silencioso activó la alarma." },
{ tipo: 'derrota', mensaje: "Intentaste vender documentos secretos, pero eran falsos." }
]
