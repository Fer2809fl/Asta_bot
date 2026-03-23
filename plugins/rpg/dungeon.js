import fetch from 'node-fetch'
async function getRcanal() {
    try { const thumb = await (await fetch(global.icono)).buffer(); return { isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: global.channelRD?.id || "120363399175402285@newsletter", serverMessageId: '', newsletterName: global.channelRD?.name || "『𝕬𝖘𝖙𝖆-𝕭𝖔𝖙』" }, externalAdReply: { title: global.botname || 'ᴀsᴛᴀ-ʙᴏᴛ', body: global.dev || 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ ғᴇʀɴᴀɴᴅᴏ', mediaType: 1, mediaUrl: global.redes, sourceUrl: global.redes, thumbnail: thumb, showAdAttribution: false, containsAutoReply: true, renderLargerThumbnail: false } } } catch { return {} }
}
let handler = async (m, { conn, command, usedPrefix }) => {
    const rcanal = await getRcanal(), currency = global.currency || '¥enes'
    if (!global.db.data.chats[m.chat].economy && m.isGroup) return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ 🚫 ׄ ⬭ *ᴇᴄᴏɴᴏᴍɪ́ᴀ ᴅᴇsᴀᴄᴛɪᴠᴀᴅᴀ*\n\nׅㅤ𓏸𓈒ㅤׄ Actívala con *${usedPrefix}economy on*`, contextInfo: rcanal }, { quoted: m })
    let user = global.db.data.users[m.sender]
    if (!user) global.db.data.users[m.sender] = user = { health: 100, coin: 0, bank: 0, exp: 0, lastDungeon: 0 }
    user.health ??= 100; user.coin ??= 0; user.bank ??= 0; user.exp ??= 0; user.lastDungeon ??= 0
    if (user.health < 5) return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ ❤️ ׄ ⬭ *sɪɴ sᴀʟᴜᴅ*\n\nׅㅤ𓏸𓈒ㅤׄ No tienes salud para la mazmorra.\nׅㅤ𓏸𓈒ㅤׄ Usa *${usedPrefix}heal* para curarte.`, contextInfo: rcanal }, { quoted: m })
    const ahora = Date.now(), cooldown = 18 * 60 * 1000
    if (ahora < user.lastDungeon) return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ ⏳ ׄ ⬭ *ᴄᴏᴏʟᴅᴏᴡɴ*\n\nׅㅤ𓏸𓈒ㅤׄ Espera *${fmt(user.lastDungeon - ahora)}* para *${usedPrefix + command}*.`, contextInfo: rcanal }, { quoted: m })
    user.lastDungeon = ahora + cooldown
    const evento = pick(eventos)
    let monedas, experiencia, salud
    if (evento.tipo === 'victoria') {
        monedas = Math.floor(Math.random() * 3001) + 12000; experiencia = Math.floor(Math.random() * 71) + 30; salud = Math.floor(Math.random() * 3) + 8
        user.coin += monedas; user.exp += experiencia; user.health -= salud
    } else if (evento.tipo === 'derrota') {
        monedas = Math.floor(Math.random() * 2001) + 6000; experiencia = Math.floor(Math.random() * 31) + 40; salud = Math.floor(Math.random() * 3) + 8
        user.coin -= monedas; user.exp -= experiencia; user.health -= salud
        if (user.coin < 0) user.coin = 0; if (user.exp < 0) user.exp = 0
    } else {
        experiencia = Math.floor(Math.random() * 61) + 30; user.exp += experiencia
    }
    if (user.health < 0) user.health = 0
    const icon = evento.tipo === 'victoria' ? '⚔️' : evento.tipo === 'derrota' ? '💀' : '🗺️'
    const txt = evento.tipo === 'trampa'
        ? `> . ﹡ ﹟ 🗺️ ׄ ⬭ *ᴍᴀᴢᴍᴏʀʀᴀ*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜📖* ㅤ֢ㅤ⸱ㅤᯭִ*\nׅㅤ𓏸𓈒ㅤׄ ${evento.mensaje}\nׅㅤ𓏸𓈒ㅤׄ *XP* :: +${experiencia}`
        : `> . ﹡ ﹟ ${icon} ׄ ⬭ *ᴍᴀᴢᴍᴏʀʀᴀ — ${evento.tipo === 'victoria' ? 'ᴠɪᴄᴛᴏʀɪᴀ' : 'ᴅᴇʀʀᴏᴛᴀ'}*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜${evento.tipo === 'victoria' ? '💰' : '💸'}* ㅤ֢ㅤ⸱ㅤᯭִ*\nׅㅤ𓏸𓈒ㅤׄ ${evento.mensaje}\nׅㅤ𓏸𓈒ㅤׄ *${currency}* :: ${evento.tipo === 'victoria' ? '+' : '-'}¥${monedas.toLocaleString()}\nׅㅤ𓏸𓈒ㅤׄ *XP* :: ${evento.tipo === 'victoria' ? '+' : '-'}${experiencia}\nׅㅤ𓏸𓈒ㅤׄ *❤️ Salud* :: -${salud} (quedan ${user.health})`
    await conn.sendMessage(m.chat, { text: txt, contextInfo: rcanal }, { quoted: m })
    await global.db.write()
}
handler.tags = ['rpg']; handler.help = ['dungeon']; handler.command = ['dungeon', 'mazmorra']
handler.group = true; handler.reg = true
export default handler
function fmt(ms) { const s = Math.ceil(ms/1000), m = Math.floor((s%3600)/60), sec = s%60; return [m&&`${m}m`, `${sec}s`].filter(Boolean).join(' ') }
function pick(list) { return list[Math.floor(Math.random()*list.length)] }
const eventos = [
{ tipo: 'victoria', mensaje: 'Derrotaste al guardián de las ruinas y reclamaste el tesoro antiguo,' },
{ tipo: 'victoria', mensaje: 'Descifraste los símbolos rúnicos y obtuviste recompensas ocultas,' },
{ tipo: 'victoria', mensaje: 'El espíritu de la reina ancestral te bendice con una gema de poder,' },
{ tipo: 'victoria', mensaje: 'Superas la prueba de los espejos oscuros y recibes un artefacto único,' },
{ tipo: 'victoria', mensaje: 'Derrotas a un gólem de obsidiana y desbloqueas un acceso secreto,' },
{ tipo: 'victoria', mensaje: 'Purificas el altar corrompido y recibes una bendición ancestral,' },
{ tipo: 'derrota', mensaje: 'Un espectro maldito te drena energía antes de que puedas escapar,' },
{ tipo: 'derrota', mensaje: 'Una criatura informe te roba parte de tu botín en la oscuridad,' },
{ tipo: 'derrota', mensaje: 'Pierdes el control de una reliquia y provocas tu propia caída,' },
{ tipo: 'trampa', mensaje: 'Activaste una trampa, pero logras evitar el daño y aprendes algo nuevo.' },
{ tipo: 'trampa', mensaje: 'Caes en una ilusión, fortaleces tu mente sin obtener riquezas.' }
]
