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
                renderLargerThumbnail: true
            }
        }
    } catch { return {} }
}

export async function before(m, { conn }) {
    const rcanal = await getRcanal()
    const primaryBot = global.db.data.chats[m.chat].primaryBot
    if (primaryBot && conn.user.jid !== primaryBot) throw !1

    const user = global.db.data.users[m.sender]
    user.coin = user.coin || 0
    user.exp = user.exp || 0

    const formatTiempo = (ms) => {
        if (typeof ms !== 'number' || isNaN(ms)) return 'desconocido'
        const h = Math.floor(ms / 3600000)
        const min = Math.floor((ms % 3600000) / 60000)
        const s = Math.floor((ms % 60000) / 1000)
        const parts = []
        if (h) parts.push(`${h} ${h === 1 ? 'hora' : 'horas'}`)
        if (min) parts.push(`${min} ${min === 1 ? 'minuto' : 'minutos'}`)
        if (s || (!h && !min)) parts.push(`${s} ${s === 1 ? 'segundo' : 'segundos'}`)
        return parts.join(' ')
    }

    if (typeof user.afk === 'number' && user.afk > -1) {
        const ms = Date.now() - user.afk
        const horas = Math.floor(ms / 3600000)
        const coins = horas * 200
        const exps = horas * 30
        user.coin += coins
        user.exp += exps
        const tiempo = formatTiempo(ms)
        const recompensa = coins > 0
            ? `ׅㅤ𓏸𓈒ㅤׄ *ʀᴇᴄᴏᴍᴘᴇɴꜱᴀ* :: 💰 *${coins} ᴄᴏɪɴꜱ*\n`
            : ''

        await conn.sendMessage(m.chat, {
            text: `> . ﹡ ﹟ 💤 ׄ ⬭ *¡ʙɪᴇɴᴠᴇɴɪᴅᴏ ᴅᴇ ᴠᴜᴇʟᴛᴀ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜💤* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴜꜱᴜᴀʀɪᴏ* :: ${await conn.getName(m.sender)}
ׅㅤ𓏸𓈒ㅤׄ *ᴍᴏᴛɪᴠᴏ ᴀꜰᴋ* :: ${user.afkReason || 'ꜱɪɴ ᴇꜱᴘᴇᴄɪꜰɪᴄᴀʀ'}
ׅㅤ𓏸𓈒ㅤׄ *ᴛɪᴇᴍᴘᴏ ɪɴᴀᴄᴛɪᴠᴏ* :: ${tiempo}
${recompensa}
> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
            contextInfo: { ...rcanal }
        }, { quoted: m })

        user.afk = -1
        user.afkReason = ''
    }

    const quoted = m.quoted ? await m.quoted.sender : null
    const jids = [...new Set([...(await m.mentionedJid || []), ...(quoted ? [quoted] : [])])]

    for (const jid of jids) {
        const target = global.db.data.users[jid]
        if (!target || typeof target.afk !== 'number' || target.afk < 0) continue
        const ms = Date.now() - target.afk
        const tiempo = formatTiempo(ms)

        await conn.sendMessage(m.chat, {
            text: `> . ﹡ ﹟ 💤 ׄ ⬭ *¡ᴜꜱᴜᴀʀɪᴏ ᴀꜰᴋ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜💤* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴜꜱᴜᴀʀɪᴏ* :: ${await conn.getName(jid)}
ׅㅤ𓏸𓈒ㅤׄ *ᴍᴏᴛɪᴠᴏ* :: ${target.afkReason || 'ꜱɪɴ ᴇꜱᴘᴇᴄɪꜰɪᴄᴀʀ'}
ׅㅤ𓏸𓈒ㅤׄ *ᴛɪᴇᴍᴘᴏ ɪɴᴀᴄᴛɪᴠᴏ* :: ${tiempo}

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
            contextInfo: { ...rcanal }
        }, { quoted: m })
    }

    return true
}
