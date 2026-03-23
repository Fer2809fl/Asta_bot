import { canLevelUp, xpRange } from '../../lib/levelling.js'
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

let handler = async (m, { conn }) => {
    const rcanal = await getRcanal()
    let mentionedJid = await m.mentionedJid
    let who = mentionedJid[0] || (m.quoted ? await m.quoted.sender : m.sender)
    let user = global.db.data.users[who]

    if (!user) {
        return conn.sendMessage(m.chat, {
            text: `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴇʀʀᴏʀ*\n\nׅㅤ𓏸𓈒ㅤׄ No se encontraron datos del usuario.`,
            contextInfo: rcanal
        }, { quoted: m })
    }

    let name = await (async () => {
        return user.name?.trim() || (await conn.getName(who)
            .then(n => typeof n === 'string' && n.trim() ? n : who.split('@')[0])
            .catch(() => who.split('@')[0]))
    })()

    let { min, xp } = xpRange(user.level, global.multiplier)
    let before = user.level * 1

    while (canLevelUp(user.level, user.exp, global.multiplier)) user.level++

    if (before !== user.level) {
        const txt =
            `> . ﹡ ﹟ 🎉 ׄ ⬭ *¡ˢᵘʙɪᴅᴀ ᴅᴇ ɴɪᴠᴇʟ!*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🏆* ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴜᴀʀɪᴏ* :: ${name}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ɴɪᴠᴇʟ ᴀɴᴛᴇʀɪᴏʀ* :: ${before}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ɴɪᴠᴇʟ ᴀᴄᴛᴜᴀʟ* :: ${user.level}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ғᴇᴄʜᴀ* :: ${new Date().toLocaleString('es-MX')}\n\n` +
            `> ✧ *ɴᴏᴛᴀ* :: Cuanto más interactúes con el Bot, mayor será tu nivel.`

        return conn.sendMessage(m.chat, {
            text: txt,
            contextInfo: { mentionedJid: [who], ...rcanal }
        }, { quoted: m })
    }

    let users = Object.entries(global.db.data.users).map(([key, value]) => ({ ...value, jid: key }))
    let sortedLevel = users.sort((a, b) => (b.level || 0) - (a.level || 0))
    let rank = sortedLevel.findIndex(u => u.jid === who) + 1
    const progreso = `${user.exp - min} / ${xp} _(${Math.floor(((user.exp - min) / xp) * 100)}%)_`

    const txt =
        `> . ﹡ ﹟ 📊 ׄ ⬭ *ɴɪᴠᴇʟ*\n\n` +
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜⭐* ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴜᴀʀɪᴏ* :: ${name}\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ɴɪᴠᴇʟ* :: ${user.level}\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴇxᴘᴇʀɪᴇɴᴄɪᴀ* :: ${user.exp.toLocaleString()} XP\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴘʀᴏɢʀᴇsᴏ* :: ${progreso}\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴘᴜᴇsᴛᴏ* :: #${rank} de ${sortedLevel.length}\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴄᴏᴍᴀɴᴅᴏs* :: ${user.commands || 0}`

    await conn.sendMessage(m.chat, {
        text: txt,
        contextInfo: { mentionedJid: [who], ...rcanal }
    }, { quoted: m })
}

handler.help = ['levelup']
handler.tags = ['rpg']
handler.command = ['nivel', 'lvl', 'level', 'levelup']
handler.group = true
handler.reg = true

export default handler
