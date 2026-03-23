import fetch from 'node-fetch'
async function getRcanal() {
    try { const thumb = await (await fetch(global.icono)).buffer(); return { isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: global.channelRD?.id || "120363399175402285@newsletter", serverMessageId: '', newsletterName: global.channelRD?.name || "『𝕬𝖘𝖙𝖆-𝕭𝖔𝖙』" }, externalAdReply: { title: global.botname || 'ᴀsᴛᴀ-ʙᴏᴛ', body: global.dev || 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ ғᴇʀɴᴀɴᴅᴏ', mediaType: 1, mediaUrl: global.redes, sourceUrl: global.redes, thumbnail: thumb, showAdAttribution: false, containsAutoReply: true, renderLargerThumbnail: false } } } catch { return {} }
}
let handler = async (m, { conn, usedPrefix, command }) => {
    const rcanal = await getRcanal(), currency = global.currency || '¥enes'
    if (!global.db.data.chats[m.chat].economy && m.isGroup) return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ 🚫 ׄ ⬭ *ᴇᴄᴏɴᴏᴍɪ́ᴀ ᴅᴇsᴀᴄᴛɪᴠᴀᴅᴀ*\n\nׅㅤ𓏸𓈒ㅤׄ Actívala con *${usedPrefix}economy on*`, contextInfo: rcanal }, { quoted: m })
    let user = global.db.data.users[m.sender]; user.lastslut ??= 0; user.coin ??= 0
    const cooldown = 5 * 60 * 1000
    if (Date.now() < user.lastslut) return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ ⏳ ׄ ⬭ *ᴄᴏᴏʟᴅᴏᴡɴ*\n\nׅㅤ𓏸𓈒ㅤׄ Espera *${fmt(user.lastslut - Date.now())}* para *${usedPrefix + command}*.`, contextInfo: rcanal }, { quoted: m })
    user.lastslut = Date.now() + cooldown
    const evento = pick(slut)
    let cantidad
    if (evento.tipo === 'victoria') { cantidad = Math.floor(Math.random() * 1501) + 4000; user.coin += cantidad }
    else { cantidad = Math.floor(Math.random() * 1001) + 3000; user.coin -= cantidad; if (user.coin < 0) user.coin = 0 }
    await conn.sendMessage(m.chat, {
        text:
            `> . ﹡ ﹟ 😈 ׄ ⬭ *sʟᴜᴛ — ${evento.tipo === 'victoria' ? '✅ ɢᴀɴᴀsᴛᴇ' : '❌ ᴘᴇʀᴅɪsᴛᴇ'}*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜${evento.tipo === 'victoria' ? '💰' : '💸'}* ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ ${evento.mensaje}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *${evento.tipo === 'victoria' ? '💎 ɢᴀɴᴀsᴛᴇ' : '💸 ᴘᴇʀᴅɪsᴛᴇ'}* :: ¥${cantidad.toLocaleString()} ${currency}`,
        contextInfo: rcanal
    }, { quoted: m })
}
handler.help = ['slut']; handler.tags = ['rpg']; handler.command = ['slut', 'prostituirse']
handler.group = true; handler.reg = true
export default handler
function fmt(ms) { const s = Math.ceil(ms/1000), m = Math.floor((s%3600)/60), sec = s%60; return [m&&`${m}m`, `${sec}s`].filter(Boolean).join(' ') }
function pick(list) { return list[Math.floor(Math.random()*list.length)] }
const slut = [
{ tipo: 'victoria', mensaje: "Le acaricias el pene a un cliente habitual y ganaste." },
{ tipo: 'victoria', mensaje: "Te vistieron de neko kawai en público, ganaste." },
{ tipo: 'victoria', mensaje: "Eres la maid del admin por un día, ganaste." },
{ tipo: 'victoria', mensaje: "Dejaste que un extraño te toque por dinero, ganaste." },
{ tipo: 'victoria', mensaje: "Tu SuggarDaddy te pagó bien hoy, ganaste." },
{ tipo: 'victoria', mensaje: "Los integrantes del grupo te recompensaron generosamente, ganaste." },
{ tipo: 'victoria', mensaje: "Un enano se culio tu pierna, ganaste." },
{ tipo: 'derrota', mensaje: "Intentaste cobrarle al cliente equivocado y te denunciaron, perdiste." },
{ tipo: 'derrota', mensaje: "El admin te bloqueó después del servicio, perdiste." },
{ tipo: 'derrota', mensaje: "La SuggarMommy te dejó por una waifu nueva, perdiste." },
{ tipo: 'derrota', mensaje: "Te manosearon sin pagar nada, perdiste." },
{ tipo: 'derrota', mensaje: "El cliente se arrepintió en el último segundo, perdiste." }
]
