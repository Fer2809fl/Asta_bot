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

let handler = async (m, { conn }) => {
    const rcanal = await getRcanal()

    if (!m.quoted) return conn.sendMessage(m.chat, {
        text: `> . ﹡ ﹟ 🖼️ ׄ ⬭ *¡ꜱᴛɪᴄᴋᴇʀ ᴀ ɪᴍᴀɢᴇɴ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🖼️* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴏ* :: ᴄɪᴛᴀ ᴜɴ ꜱᴛɪᴄᴋᴇʀ ᴄᴏɴ \`#toimg\`
ׅㅤ𓏸𓈒ㅤׄ *ᴄᴏᴍᴀɴᴅᴏꜱ* :: \`#toimg\` \`#jpg\` \`#img\`

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
        contextInfo: { ...rcanal }
    }, { quoted: m })

    await m.react('🕒')
    let imgBuffer = await m.quoted.download()

    if (!imgBuffer) {
        await m.react('✖️')
        return conn.sendMessage(m.chat, {
            text: `> . ﹡ ﹟ 🖼️ ׄ ⬭ *¡ᴇʀʀᴏʀ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❌* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴇʀʀᴏʀ* :: ɴᴏ ꜱᴇ ᴘᴜᴅᴏ ᴅᴇꜱᴄᴀʀɢᴀʀ ᴇʟ ꜱᴛɪᴄᴋᴇʀ

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
            contextInfo: { ...rcanal }
        }, { quoted: m })
    }

    await conn.sendMessage(m.chat, {
        image: imgBuffer,
        caption: `> . ﹡ ﹟ 🖼️ ׄ ⬭ *¡ɪᴍᴀɢᴇɴ ʟɪꜱᴛᴀ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🖼️* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴇꜱᴛᴀᴅᴏ* :: ꜱᴛɪᴄᴋᴇʀ ᴄᴏɴᴠᴇʀᴛɪᴅᴏ ✅
ׅㅤ𓏸𓈒ㅤׄ *ɴᴏᴛᴀ* :: ᴀǫᴜí ᴛɪᴇɴᴇꜱ ฅ^•ﻌ•^ฅ

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
        contextInfo: { ...rcanal }
    }, { quoted: m })
    await m.react('✔️')
}

handler.help = ['toimg']
handler.tags = ['tools']
handler.command = ['toimg', 'jpg', 'img']
handler.reg = true

export default handler
