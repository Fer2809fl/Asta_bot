import fetch from 'node-fetch'

async function getRcanal() {
    try {
        const thumb = await (await fetch(global.icono)).buffer()
        return {
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: global.channelRD?.id || "120363399175402285@newsletter",
                serverMessageId: '',
                newsletterName: global.channelRD?.name || "『𝕬𝖘𝖙𝖆-𝕭𝖔𝖙』"
            },
            externalAdReply: {
                title: global.botname || 'ᴀsᴛᴀ-ʙᴏᴛ',
                body: global.dev || 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ ғᴇʀɴᴀɴᴅᴏ',
                mediaType: 1, mediaUrl: global.redes, sourceUrl: global.redes,
                thumbnail: thumb, showAdAttribution: false, containsAutoReply: true, renderLargerThumbnail: false
            }
        }
    } catch { return {} }
}

let handler = async (m, { conn, command, usedPrefix }) => {
    const rcanal = await getRcanal()
    const currency = global.currency || '¥enes'

    if (!global.db.data.chats[m.chat].economy && m.isGroup)
        return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ 🚫 ׄ ⬭ *ᴇᴄᴏɴᴏᴍɪ́ᴀ ᴅᴇsᴀᴄᴛɪᴠᴀᴅᴀ*\n\nׅㅤ𓏸𓈒ㅤׄ Un *administrador* puede activarla con *${usedPrefix}economy on*`, contextInfo: rcanal }, { quoted: m })

    let user = global.db.data.users[m.sender]
    if (!user) global.db.data.users[m.sender] = user = { coin: 0, bank: 0, exp: 0, health: 100, lastAdventure: 0 }
    user.coin ??= 0; user.bank ??= 0; user.exp ??= 0; user.health ??= 100; user.lastAdventure ??= 0

    if (user.health < 5)
        return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ ❤️ ׄ ⬭ *sɪɴ sᴀʟᴜᴅ*\n\nׅㅤ𓏸𓈒ㅤׄ No tienes suficiente salud para aventurarte.\nׅㅤ𓏸𓈒ㅤׄ Usa *${usedPrefix}heal* para curarte.`, contextInfo: rcanal }, { quoted: m })

    const cooldown = 20 * 60 * 1000
    const now = Date.now()
    if (now < user.lastAdventure) {
        const wait = formatTime(user.lastAdventure - now)
        return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ ⏳ ׄ ⬭ *ᴄᴏᴏʟᴅᴏᴡɴ*\n\nׅㅤ𓏸𓈒ㅤׄ Espera *${wait}* para usar *${usedPrefix + command}*.`, contextInfo: rcanal }, { quoted: m })
    }

    user.lastAdventure = now + cooldown
    const evento = pickRandom(aventuras)
    let monedas, experiencia, salud

    if (evento.tipo === 'victoria') {
        monedas = Math.floor(Math.random() * 3001) + 15000
        experiencia = Math.floor(Math.random() * 81) + 40
        salud = Math.floor(Math.random() * 6) + 10
        user.coin += monedas; user.exp += experiencia; user.health -= salud
    } else if (evento.tipo === 'derrota') {
        monedas = Math.floor(Math.random() * 2001) + 7000
        experiencia = Math.floor(Math.random() * 41) + 40
        salud = Math.floor(Math.random() * 6) + 10
        user.coin -= monedas; user.exp -= experiencia; user.health -= salud
        if (user.coin < 0) user.coin = 0
        if (user.exp < 0) user.exp = 0
    } else {
        experiencia = Math.floor(Math.random() * 61) + 30
        user.exp += experiencia
    }
    if (user.health < 0) user.health = 0

    const icon = evento.tipo === 'victoria' ? '⚔️' : evento.tipo === 'derrota' ? '💀' : '🗺️'
    const resultado = evento.tipo === 'neutro'
        ? `> . ﹡ ﹟ 🗺️ ׄ ⬭ *ᴀᴠᴇɴᴛᴜʀᴀ*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜📖* ㅤ֢ㅤ⸱ㅤᯭִ*\nׅㅤ𓏸𓈒ㅤׄ ${evento.mensaje}\nׅㅤ𓏸𓈒ㅤׄ *XP* :: +${experiencia}`
        : `> . ﹡ ﹟ ${icon} ׄ ⬭ *ᴀᴠᴇɴᴛᴜʀᴀ — ${evento.tipo === 'victoria' ? 'ᴠɪᴄᴛᴏʀɪᴀ' : 'ᴅᴇʀʀᴏᴛᴀ'}*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜${evento.tipo === 'victoria' ? '💰' : '💸'}* ㅤ֢ㅤ⸱ㅤᯭִ*\nׅㅤ𓏸𓈒ㅤׄ ${evento.mensaje}\nׅㅤ𓏸𓈒ㅤׄ *${currency}* :: ${evento.tipo === 'victoria' ? '+' : '-'}¥${monedas.toLocaleString()}\nׅㅤ𓏸𓈒ㅤׄ *XP* :: ${evento.tipo === 'victoria' ? '+' : '-'}${experiencia}\nׅㅤ𓏸𓈒ㅤׄ *❤️ Salud* :: -${salud} (quedan ${user.health})`

    await conn.sendMessage(m.chat, { text: resultado, contextInfo: rcanal }, { quoted: m })
    await global.db.write()
}

handler.tags = ['rpg']; handler.help = ['adventure']; handler.command = ['adventure', 'aventura']
handler.group = true; handler.reg = true
export default handler

function formatTime(ms) { const s = Math.ceil(ms/1000); const m = Math.floor((s%3600)/60); const sec = s%60; return [m && `${m}m`, `${sec}s`].filter(Boolean).join(' ') }
function pickRandom(list) { return list[Math.floor(Math.random() * list.length)] }
const aventuras = [
{ tipo: 'victoria', mensaje: 'Derrotaste a un ogro emboscado entre los árboles de Drakonia,' },
{ tipo: 'victoria', mensaje: 'Te conviertes en campeón del torneo de gladiadores de Valoria,' },
{ tipo: 'victoria', mensaje: 'Rescatas un libro mágico del altar de los Susurros,' },
{ tipo: 'victoria', mensaje: 'Liberas a aldeanos atrapados en las minas de Ulderan tras vencer a los trolls,' },
{ tipo: 'victoria', mensaje: 'Derrotas a un dragón joven en los acantilados de Flamear,' },
{ tipo: 'victoria', mensaje: 'Encuentras un relicario sagrado en las ruinas de Iskaria,' },
{ tipo: 'victoria', mensaje: 'Triunfas en el duelo contra el caballero corrupto de Invalion,' },
{ tipo: 'victoria', mensaje: 'Conquistas la fortaleza maldita de las Sombras Rojas sin sufrir bajas,' },
{ tipo: 'victoria', mensaje: 'Te infiltras en el templo del Vacío y recuperas el cristal del equilibrio,' },
{ tipo: 'victoria', mensaje: 'Resuelves el acertijo de la cripta eterna y obtienes un tesoro legendario,' },
{ tipo: 'derrota', mensaje: 'El hechicero oscuro te lanzó una maldición y huyes perdiendo recursos,' },
{ tipo: 'derrota', mensaje: 'Te extravías en la jungla de Zarkelia y unos bandidos te asaltan,' },
{ tipo: 'derrota', mensaje: 'Un basilisco te embiste y escapas herido sin botín,' },
{ tipo: 'derrota', mensaje: 'Fracasa tu incursión a la torre de hielo cuando caes en una trampa mágica,' },
{ tipo: 'derrota', mensaje: 'Pierdes orientación entre los portales del bosque espejo y terminas sin recompensa,' },
{ tipo: 'neutro', mensaje: 'Exploras ruinas antiguas y aprendes secretos ocultos sin hallar tesoros.' },
{ tipo: 'neutro', mensaje: 'Sigues la pista de un espectro pero desaparece entre la niebla.' },
{ tipo: 'neutro', mensaje: 'Acompañas a una princesa por los desiertos de Thaloria sin contratiempos.' }
]
