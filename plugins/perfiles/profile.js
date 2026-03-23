import { xpRange } from '../../lib/levelling.js'
import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix }) => {
    try {
        let texto = await m.mentionedJid
        let userId = texto?.length > 0 ? texto[0] : (m.quoted ? await m.quoted.sender : m.sender)

        if (!global.db.data.users) global.db.data.users = {}
        if (!global.db.data.characters) global.db.data.characters = {}
        if (!global.db.data.users[userId]) global.db.data.users[userId] = {}

        const user = global.db.data.users[userId]

        let name = await (async () => {
            return user.name || (async () => {
                try {
                    const n = await conn.getName(userId)
                    return typeof n === 'string' && n.trim() ? n : userId.split('@')[0]
                } catch { return userId.split('@')[0] }
            })()
        })()

        const cumpleanos = user.birth || 'Sin especificar 🎂'
        const genero = user.genre || 'Sin especificar ⚥'
        const pareja = user.marry
        const casado = await (async () => {
            if (!pareja) return 'Nadie 💔'
            return global.db.data.users[pareja]?.name?.trim() ||
                await conn.getName(pareja)
                    .then(n => typeof n === 'string' && n.trim() ? n : pareja.split('@')[0])
                    .catch(() => pareja.split('@')[0])
        })()
        const description = user.description || 'Sin descripción 😶'
        const exp = user.exp || 0
        const nivel = user.level || 0
        const coin = user.coin || 0
        const bank = user.bank || 0
        const total = coin + bank
        const sorted = Object.entries(global.db.data.users)
            .map(([k, v]) => ({ ...v, jid: k }))
            .sort((a, b) => (b.level || 0) - (a.level || 0))
        const rank = sorted.findIndex(u => u.jid === userId) + 1
        const datos = xpRange(nivel, global.multiplier)
        const progreso = `${exp - datos.min} / ${datos.xp} _(${Math.floor(((exp - datos.min) / datos.xp) * 100)}%)_`
        const premium = user.premium || global.prems.map(v => v.replace(/\D+/g, '') + '@s.whatsapp.net').includes(userId)
        const isLeft = premium
            ? (global.prems.includes(userId.split('@')[0]) ? 'Permanente ♾️'
                : (user.premiumTime ? await formatTime(user.premiumTime - Date.now()) : '—'))
            : '—'
        const favId = user.favorite
        const favLine = favId && global.db.data.characters?.[favId]
            ? `\nׅㅤ𓏸𓈒ㅤׄ *ᴄʟᴀɪᴍ ғᴀᴠ* :: ${global.db.data.characters[favId].name || '???'}`
            : ''
        const ownedIDs = Object.entries(global.db.data.characters)
            .filter(([, c]) => c.user === userId)
            .map(([id]) => id)
        const haremCount = ownedIDs.length
        const haremValue = ownedIDs.reduce((acc, id) => {
            const char = global.db.data.characters[id] || {}
            return acc + (typeof char.value === 'number' ? char.value : 0)
        }, 0)

        // ===== OBTENER FOTO DE PERFIL COMO BUFFER =====
        const ppUrl = await conn.profilePictureUrl(userId, 'image')
            .catch(() => global.icono || '')

        let ppBuffer = Buffer.alloc(0)
        try {
            const res = await fetch(ppUrl)
            if (res.ok) ppBuffer = await res.buffer()
        } catch {
            try {
                if (global.icono) {
                    const res = await fetch(global.icono)
                    if (res.ok) ppBuffer = await res.buffer()
                }
            } catch {}
        }

        const text =
            `> . ﹡ ﹟ 👤 ׄ ⬭ *ᴘᴇʀғɪʟ*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜✨* ㅤ֢ㅤ⸱ㅤᯭִ* — *${name}*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴅᴇsᴄʀɪᴘᴄɪᴏ́ɴ* :: ${description}\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜📋* ㅤ֢ㅤ⸱ㅤᯭִ* — *ᴅᴀᴛᴏs*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *🎂 ᴄᴜᴍᴘʟᴇ* :: ${cumpleanos}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *⚥ ɢᴇ́ɴᴇʀᴏ* :: ${genero}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *💖 ᴘᴀʀᴇᴊᴀ* :: ${casado}\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜📊* ㅤ֢ㅤ⸱ㅤᯭִ* — *ᴇsᴛᴀᴅɪ́sᴛɪᴄᴀs*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *🌱 XP* :: ${exp.toLocaleString()}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *🏆 ɴɪᴠᴇʟ* :: ${nivel}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *🎖️ ʀᴀɴɢᴏ* :: #${rank}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *📊 ᴘʀᴏɢʀᴇsᴏ* :: ${progreso}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *💎 ᴘʀᴇᴍɪᴜᴍ* :: ${premium ? `✔️ (${isLeft})` : '✖️'}\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜💰* ㅤ֢ㅤ⸱ㅤᯭִ* — *ᴇᴄᴏɴᴏᴍɪ́ᴀ*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *👑 ʜᴀʀᴇᴍ* :: ${haremCount} personajes\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *💰 ᴠᴀʟᴏʀ ʜᴀʀᴇᴍ* :: ${haremValue.toLocaleString()}` +
            favLine + `\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *¥ ᴄᴏɪɴs* :: ${total.toLocaleString()} ${global.currency || '¥enes'}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *🛠️ ᴄᴏᴍᴀɴᴅᴏs* :: ${user.commands || 0}`

        // ===== ENVIAR CON FOTO DE PERFIL COMO PREVISUALIZACIÓN GRANDE =====
        await conn.sendMessage(m.chat, {
            text: text,
            contextInfo: {
                mentionedJid: [userId],
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: global.channelRD?.id || "120363399175402285@newsletter",
                    serverMessageId: '',
                    newsletterName: global.channelRD?.name || "『𝕬𝖘𝖙𝖆-𝕭𝖔𝖙』"
                },
                externalAdReply: {
                    title: name,
                    body: `${global.botname || 'ᴀsᴛᴀ-ʙᴏᴛ'} • Perfil`,
                    mediaType: 1,
                    mediaUrl: global.redes || '',
                    sourceUrl: global.redes || '',
                    thumbnail: ppBuffer,
                    showAdAttribution: false,
                    containsAutoReply: true,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: m })

    } catch (error) {
        console.error(error)
        await conn.sendMessage(m.chat, {
            text:
                `> . ﹡ ﹟ ❌ ׄ ⬭ *ᴇʀʀᴏʀ*\n\n` +
                `ׅㅤ𓏸𓈒ㅤׄ Se produjo un problema: ${error.message}\n` +
                `ׅㅤ𓏸𓈒ㅤׄ Usa *${usedPrefix || '#'}report* para reportarlo.`
        }, { quoted: m })
    }
}

handler.help = ['profile']
handler.tags = ['rg']
handler.command = ['profile', 'perfil', 'perfíl']
handler.group = true
handler.reg = true

export default handler

async function formatTime(ms) {
    if (ms <= 0) return 'Expirado'
    let s = Math.floor(ms / 1000), min = Math.floor(s / 60), h = Math.floor(min / 60), d = Math.floor(h / 24)
    let months = Math.floor(d / 30), weeks = Math.floor((d % 30) / 7)
    s %= 60; min %= 60; h %= 24; d %= 7
    let t = months ? [`${months} mes${months > 1 ? 'es' : ''}`]
        : weeks ? [`${weeks} semana${weeks > 1 ? 's' : ''}`]
        : d ? [`${d} día${d > 1 ? 's' : ''}`] : []
    if (h) t.push(`${h}h`)
    if (min) t.push(`${min}m`)
    if (s) t.push(`${s}s`)
    return t.join(' ') || '0s'
}