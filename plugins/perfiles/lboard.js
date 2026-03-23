import { xpRange } from '../../lib/levelling.js'
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

let handler = async (m, { conn, args }) => {
    const rcanal = await getRcanal()
    let users = Object.entries(global.db.data.users).map(([key, value]) => ({ ...value, jid: key }))
    let sorted = users.sort((a, b) => (b.exp || 0) - (a.exp || 0))
    const page = Math.max(1, Math.min(parseInt(args[0]) || 1, Math.ceil(sorted.length / 10)))
    const startIndex = (page - 1) * 10
    const endIndex = startIndex + 10
    const slice = sorted.slice(startIndex, endIndex)

    let text = `> . ﹡ ﹟ 🏆 ׄ ⬭ *ʟᴇᴀᴅᴇʀʙᴏᴀʀᴅ*\n\n`
    text += `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜⭐* ㅤ֢ㅤ⸱ㅤᯭִ* — *ᴛᴏᴘ ᴜsᴜᴀʀɪᴏs*\n`

    for (let i = 0; i < slice.length; i++) {
        const { jid, exp, level } = slice[i]
        let name = await (async () => {
            return global.db.data.users[jid]?.name || (async () => {
                try {
                    const n = await conn.getName(jid)
                    return typeof n === 'string' && n.trim() ? n : jid.split('@')[0]
                } catch { return jid.split('@')[0] }
            })()
        })()
        const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${startIndex + i + 1}.`
        text += `\nׅㅤ𓏸𓈒ㅤׄ ${medal} *${name}*\n`
        text += `ׅㅤ𓏸𓈒ㅤׄ ❖ XP :: *${(exp || 0).toLocaleString()}*  ❖ LVL :: *${level || 0}*\n`
    }

    text += `\n> ✦ Página *${page}* de *${Math.ceil(sorted.length / 10)}*`
    if (page < Math.ceil(sorted.length / 10)) {
        text += `\n> ➨ Siguiente :: *#leaderboard ${page + 1}*`
    }

    await conn.sendMessage(m.chat, {
        text: text.trim(),
        contextInfo: rcanal,
        mentions: conn.parseMention(text)
    }, { quoted: m })
}

handler.help = ['lboard']
handler.tags = ['rpg']
handler.command = ['lboard', 'top', 'lb', 'leaderboard']
handler.group = true
handler.reg = true

export default handler
