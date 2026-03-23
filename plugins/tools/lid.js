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

let handler = async function (m, { conn, groupMetadata }) {
    const rcanal = await getRcanal()
    const participantList = groupMetadata.participants || []
    const mentionedJid = await m.mentionedJid
    const userId = mentionedJid.length > 0
        ? mentionedJid[0]
        : (m.quoted ? await m.quoted.sender : m.sender)
    const participant = participantList.find(p => p.id === userId)

    await m.react('🕒')

    if (participant) {
        await conn.sendMessage(m.chat, {
            text: `> . ﹡ ﹟ 🆔 ׄ ⬭ *¡ɪɴꜰᴏ ʟɪᴅ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🆔* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴜꜱᴜᴀʀɪᴏ* :: @${userId.split('@')[0]}
ׅㅤ𓏸𓈒ㅤׄ *ʟɪᴅ* :: \`${participant.lid || 'No disponible'}\`
ׅㅤ𓏸𓈒ㅤׄ *ᴊɪᴅ* :: \`${userId}\`

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
            contextInfo: {
                mentionedJid: [userId],
                ...rcanal
            }
        }, { quoted: m })
        await m.react('✔️')
    } else {
        await conn.sendMessage(m.chat, {
            text: `> . ﹡ ﹟ 🆔 ׄ ⬭ *¡ᴇʀʀᴏʀ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❌* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴇʀʀᴏʀ* :: ɴᴏ ꜱᴇ ᴇɴᴄᴏɴᴛʀᴏ́ ᴇʟ ʟɪᴅ

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
            contextInfo: { ...rcanal }
        }, { quoted: m })
        await m.react('✖️')
    }
}

handler.command = ['lid', 'mylid']
handler.help = ['mylid', 'lid']
handler.tags = ['tools']
handler.group = true
handler.reg = true

export default handler
