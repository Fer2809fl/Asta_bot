import fetch from 'node-fetch'
async function getRcanal() {
    try { const thumb = await (await fetch(global.icono)).buffer(); return { isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: global.channelRD?.id || "120363399175402285@newsletter", serverMessageId: '', newsletterName: global.channelRD?.name || "『𝕬𝖘𝖙𝖆-𝕭𝖔𝖙』" }, externalAdReply: { title: global.botname || 'ᴀsᴛᴀ-ʙᴏᴛ', body: global.dev || 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ ғᴇʀɴᴀɴᴅᴏ', mediaType: 1, mediaUrl: global.redes, sourceUrl: global.redes, thumbnail: thumb, showAdAttribution: false, containsAutoReply: true, renderLargerThumbnail: false } } } catch { return {} }
}
let handler = async (m, { conn, args, usedPrefix, command }) => {
    const rcanal = await getRcanal(), currency = global.currency || '¥enes', botname = global.botname || 'ᴀsᴛᴀ-ʙᴏᴛ'
    if (!global.db.data.chats[m.chat].economy && m.isGroup) return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ 🚫 ׄ ⬭ *ᴇᴄᴏɴᴏᴍɪ́ᴀ ᴅᴇsᴀᴄᴛɪᴠᴀᴅᴀ*\n\nׅㅤ𓏸𓈒ㅤׄ Actívala con *${usedPrefix}economy on*`, contextInfo: rcanal }, { quoted: m })
    const user = global.db.data.users[m.sender]
    const userName = await (async () => global.db.data.users[m.sender].name || (async () => { try { const n = await conn.getName(m.sender); return typeof n==='string'&&n.trim()?n:m.sender.split('@')[0] } catch { return m.sender.split('@')[0] } })())()
    const tiempoEspera = 15 * 1000, ahora = Date.now()
    if (user.lastApuesta && ahora - user.lastApuesta < tiempoEspera) { const r = user.lastApuesta + tiempoEspera - ahora; return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ ⏳ ׄ ⬭ *ᴄᴏᴏʟᴅᴏᴡɴ*\n\nׅㅤ𓏸𓈒ㅤׄ Espera *${fmt(r)}* para *${usedPrefix + command}*.`, contextInfo: rcanal }, { quoted: m }) }
    if (!args[0]) return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ 🎰 ׄ ⬭ *ᴄᴀsɪɴᴏ*\n\nׅㅤ𓏸𓈒ㅤׄ Ingresa la cantidad a apostar.\nׅㅤ𓏸𓈒ㅤׄ *Ejemplo* :: *${usedPrefix + command} 100*`, contextInfo: rcanal }, { quoted: m })
    let count = parseInt(args[0])
    if (isNaN(count) || count < 1) return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴇʀʀᴏʀ*\n\nׅㅤ𓏸𓈒ㅤׄ Cantidad inválida.`, contextInfo: rcanal }, { quoted: m })
    if (user.coin < count) return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ 💸 ׄ ⬭ *sɪɴ ғᴏɴᴅᴏs*\n\nׅㅤ𓏸𓈒ㅤׄ No tienes *¥${count.toLocaleString()} ${currency}*.`, contextInfo: rcanal }, { quoted: m })
    user.lastApuesta = ahora
    let Aku = Math.floor(Math.random() * 101), Kamu = Math.floor(Math.random() * 55), ganancia = 0
    user.coin -= count
    let resultado
    if (Aku > Kamu) { resultado = `*Perdiste ¥${count.toLocaleString()} ${currency}*` }
    else { ganancia = count * 2; user.coin += ganancia; resultado = `*Ganaste ¥${ganancia.toLocaleString()} ${currency}*` }
    await conn.sendMessage(m.chat, {
        text: `> . ﹡ ﹟ 🎰 ׄ ⬭ *ᴄᴀsɪɴᴏ*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🎲* ㅤ֢ㅤ⸱ㅤᯭִ*\nׅㅤ𓏸𓈒ㅤׄ *${botname}* :: ${Aku}\nׅㅤ𓏸𓈒ㅤׄ *${userName}* :: ${Kamu}\n\nׅㅤ𓏸𓈒ㅤׄ ${resultado}`,
        contextInfo: rcanal
    }, { quoted: m })
}
handler.help = ['casino']; handler.tags = ['economy']; handler.command = ['apostar', 'casino']; handler.group = true; handler.reg = true
export default handler
function fmt(ms) { const s=Math.ceil(ms/1000),m=Math.floor((s%3600)/60),sec=s%60; return [m&&`${m}m`,`${sec}s`].filter(Boolean).join(' ') }
