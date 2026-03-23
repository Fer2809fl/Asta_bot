import fetch from 'node-fetch'
async function getRcanal() {
    try { const thumb = await (await fetch(global.icono)).buffer(); return { isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: global.channelRD?.id || "120363399175402285@newsletter", serverMessageId: '', newsletterName: global.channelRD?.name || "『𝕬𝖘𝖙𝖆-𝕭𝖔𝖙』" }, externalAdReply: { title: global.botname || 'ᴀsᴛᴀ-ʙᴏᴛ', body: global.dev || 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ ғᴇʀɴᴀɴᴅᴏ', mediaType: 1, mediaUrl: global.redes, sourceUrl: global.redes, thumbnail: thumb, showAdAttribution: false, containsAutoReply: true, renderLargerThumbnail: false } } } catch { return {} }
}
var handler = async (m, { conn, usedPrefix, command }) => {
    const rcanal = await getRcanal(), currency = global.currency || '¥enes'
    if (!global.db.data.chats[m.chat].economy && m.isGroup) return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ 🚫 ׄ ⬭ *ᴇᴄᴏɴᴏᴍɪ́ᴀ ᴅᴇsᴀᴄᴛɪᴠᴀᴅᴀ*\n\nׅㅤ𓏸𓈒ㅤׄ Actívala con *${usedPrefix}economy on*`, contextInfo: rcanal }, { quoted: m })
    let user = global.db.data.users[m.sender], now = Date.now(), gap = 86400000
    user.lastcofre ??= 0; user.coin ??= 0; user.exp ??= 0
    if (now < user.lastcofre) { const wait = fmt(Math.floor((user.lastcofre - now) / 1000)); return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ ⏳ ׄ ⬭ *ᴄᴏғʀᴇ*\n\nׅㅤ𓏸𓈒ㅤׄ Ya abriste tu cofre hoy.\nׅㅤ𓏸𓈒ㅤׄ Vuelve en *${wait}*`, contextInfo: rcanal }, { quoted: m }) }
    const reward = Math.floor(Math.random() * (60000 - 40000 + 1)) + 40000
    const expGain = Math.floor(Math.random() * 111) + 50
    user.coin += reward; user.exp += expGain; user.lastcofre = now + gap
    await conn.sendMessage(m.chat, {
        text:
            `> . ﹡ ﹟ 📦 ׄ ⬭ *ᴄᴏғʀᴇ ᴀʙɪᴇʀᴛᴏ*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜✨* ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ ${pick(cofres)}\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🎁* ㅤ֢ㅤ⸱ㅤᯭִ* — *ʀᴇᴄᴏᴍᴘᴇɴsᴀs*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *💰 ${currency}* :: +¥${reward.toLocaleString()}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *⭐ XP* :: +${expGain}`,
        contextInfo: rcanal
    }, { quoted: m })
}
handler.help = ['cofre']; handler.tags = ['economía']; handler.command = ['coffer', 'cofre', 'abrircofre', 'cofreabrir']
handler.group = true; handler.reg = true
export default handler
function fmt(t) { const h = Math.floor(t/3600), m = Math.floor((t%3600)/60), s = t%60; return [h&&`${h}h`, (m||h)&&`${m}m`, `${s}s`].filter(Boolean).join(' ') }
function pick(list) { return list[Math.floor(Math.random() * list.length)] }
const cofres = [
"Has encontrado un cofre antiguo en un barco hundido.",
"Descubriste un cofre decorado con intrincados grabados en una isla desierta.",
"Te topaste con un cofre mágico que se abre con una palabra secreta.",
"Encontraste un cofre de madera desgastada lleno de monedas de oro.",
"Desenterraste un cofre cubierto de lianas en una selva espesa.",
"Te adentraste en una cueva y hallaste un cofre lleno de joyas brillantes.",
"Un cofre misterioso apareció en la playa, lleno de tesoros de otro tiempo.",
"Descubriste un cofre escondido detrás de una cascada, rebosante de piedras preciosas.",
"Te topaste con un cofre encantado que guarda la historia de antiguos aventureros.",
"Encontraste un cofre de hierro forjado, custodiado por un viejo dragón.",
"Hallaste un cofre en el fondo de un lago, cubierto de algas y misterios.",
"Descubriste un cofre de cristal tallado, lleno de artefactos de poder."
]
