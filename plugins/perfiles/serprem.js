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
                mediaType: 1,
                mediaUrl: global.redes,
                sourceUrl: global.redes,
                thumbnail: thumb,
                showAdAttribution: false,
                containsAutoReply: true,
                renderLargerThumbnail: false
            }
        }
    } catch { return {} }
}

const pHora = 1000
const pDia = 10000
const pSemana = 25000
const pMes = 50000
const cHora = 20
const cDia = 200
const cSemana = 500
const cMes = 1000

let handler = async (m, { conn, usedPrefix, command, args }) => {
    const rcanal = await getRcanal()
    const currency = global.currency || '¥enes'

    if (!args[0]) {
        return conn.sendMessage(m.chat, {
            text:
                `> . ﹡ ﹟ 💎 ׄ ⬭ *ᴘʀᴇᴍɪᴜᴍ*\n\n` +
                `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜⭐* ㅤ֢ㅤ⸱ㅤᯭִ* — *ᴘʀᴇᴄɪᴏs*\n` +
                `ׅㅤ𓏸𓈒ㅤׄ *⏱️ ʜᴏʀᴀ* :: ${pHora} ${currency}\n` +
                `ׅㅤ𓏸𓈒ㅤׄ *📅 ᴅɪ́ᴀ* :: ${pDia} ${currency}\n` +
                `ׅㅤ𓏸𓈒ㅤׄ *📆 sᴇᴍᴀɴᴀ* :: ${pSemana} ${currency}\n` +
                `ׅㅤ𓏸𓈒ㅤׄ *🗓️ ᴍᴇs* :: ${pMes} ${currency}\n\n` +
                `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜💡* ㅤ֢ㅤ⸱ㅤᯭִ* — *ᴇᴊᴇᴍᴘʟᴏs*\n` +
                `ׅㅤ𓏸𓈒ㅤׄ *${usedPrefix + command} 1 h* → 1 hora\n` +
                `ׅㅤ𓏸𓈒ㅤׄ *${usedPrefix + command} 2 d* → 2 días\n` +
                `ׅㅤ𓏸𓈒ㅤׄ *${usedPrefix + command} 1 s* → 1 semana\n` +
                `ׅㅤ𓏸𓈒ㅤׄ *${usedPrefix + command} 1 m* → 1 mes`,
            contextInfo: rcanal
        }, { quoted: m })
    }

    const user = global.db.data.users[m.sender]
    let name = await (async () => {
        return user.name || (async () => {
            try {
                const n = await conn.getName(m.sender)
                return typeof n === 'string' && n.trim() ? n : m.sender.split('@')[0]
            } catch { return m.sender.split('@')[0] }
        })()
    })()

    if (isNaN(args[0])) {
        return conn.sendMessage(m.chat, {
            text:
                `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴇʀʀᴏʀ*\n\n` +
                `ׅㅤ𓏸𓈒ㅤׄ Solo se aceptan números.\n` +
                `ׅㅤ𓏸𓈒ㅤׄ *Ejemplo* :: ${usedPrefix + command} 1 h`,
            contextInfo: rcanal
        }, { quoted: m })
    }

    let kk = args[1]?.toLowerCase() || 'h'
    const precios = { h: pHora, d: pDia, s: pSemana, m: pMes }
    const comisiones = { h: cHora, d: cDia, s: cSemana, m: cMes }
    const tipos = { h: 'Hora(s)', d: 'Día(s)', s: 'Semana(s)', m: 'Mes(es)' }

    if (!precios[kk]) {
        return conn.sendMessage(m.chat, {
            text:
                `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴇʀʀᴏʀ*\n\n` +
                `ׅㅤ𓏸𓈒ㅤׄ Formato inválido. Opciones: *h, d, s, m*`,
            contextInfo: rcanal
        }, { quoted: m })
    }

    const precio = precios[kk]
    const comision = comisiones[kk]
    const total = (precio * args[0]) + (comision * args[0])

    if (user.coin < total) {
        return conn.sendMessage(m.chat, {
            text:
                `> . ﹡ ﹟ 💸 ׄ ⬭ *sɪɴ ғᴏɴᴅᴏs*\n\n` +
                `ׅㅤ𓏸𓈒ㅤׄ No tienes suficientes ${currency}.\n` +
                `ׅㅤ𓏸𓈒ㅤׄ *Necesitas* :: ${total.toLocaleString()} ${currency}\n` +
                `ׅㅤ𓏸𓈒ㅤׄ *Tienes* :: ${user.coin.toLocaleString()} ${currency}`,
            contextInfo: rcanal
        }, { quoted: m })
    }

    const tiempoMs = { h: 3600000, d: 86400000, s: 604800000, m: 2592000000 }[kk] * args[0]
    const now = Date.now()
    if (now < user.premiumTime) user.premiumTime += tiempoMs
    else user.premiumTime = now + tiempoMs

    user.premium = true
    user.coin -= total

    await conn.sendMessage(m.chat, {
        text:
            `> . ﹡ ﹟ 💎 ׄ ⬭ *ᴘʀᴇᴍɪᴜᴍ ᴀᴄᴛɪᴠᴀᴅᴏ*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜✅* ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *👤 ᴜsᴜᴀʀɪᴏ* :: ${name}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *⏳ ᴛɪᴇᴍᴘᴏ* :: ${args[0]} ${tipos[kk]}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *💰 ᴛᴏᴛᴀʟ ᴘᴀɢᴀᴅᴏ* :: ${total.toLocaleString()} ${currency}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *⚡ ᴄᴏᴍɪsɪᴏ́ɴ* :: ${(comision * args[0]).toLocaleString()} ${currency}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *💎 sᴀʟᴅᴏ ʀᴇsᴛᴀɴᴛᴇ* :: ${user.coin.toLocaleString()} ${currency}`,
        contextInfo: { mentionedJid: [m.sender], ...rcanal }
    }, { quoted: m })
}

handler.tags = ['rg']
handler.help = ['premium']
handler.command = ['vip', 'premium', 'prem']
handler.reg = true

export default handler
