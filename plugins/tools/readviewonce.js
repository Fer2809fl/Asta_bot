import fetch from 'node-fetch'
let { downloadContentFromMessage } = (await import('@whiskeysockets/baileys'))

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

let handler = async (m, { conn, usedPrefix }) => {
    const rcanal = await getRcanal()
    let quoted = m.quoted

    if (!quoted) return conn.sendMessage(m.chat, {
        text: `> . ﹡ ﹟ 👁️ ׄ ⬭ *¡ʀᴇᴀᴅ ᴠɪᴇᴡᴏɴᴄᴇ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜👁️* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴏ* :: ʀᴇꜱᴘᴏɴᴅᴇ ᴀ ᴜɴ ᴍꜱᴊ ᴠɪᴇᴡᴏɴᴄᴇ
ׅㅤ𓏸𓈒ㅤׄ *ᴄᴏᴍᴀɴᴅᴏ* :: \`#readvo\`
ׅㅤ𓏸𓈒ㅤׄ *ɴᴏᴛᴀ* :: ꜱᴏʟᴏ ᴘʀᴇᴍɪᴜᴍ 🔐

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
        contextInfo: { ...rcanal }
    }, { quoted: m })

    try {
        await m.react('🕒')
        let viewOnceMessage = quoted.viewOnce
            ? quoted
            : quoted.mediaMessage?.imageMessage || quoted.mediaMessage?.videoMessage || quoted.mediaMessage?.audioMessage
        let messageType = viewOnceMessage.mimetype || quoted.mtype
        let stream = await downloadContentFromMessage(viewOnceMessage, messageType.split('/')[0])

        if (!stream) return conn.sendMessage(m.chat, {
            text: `> . ﹡ ﹟ 👁️ ׄ ⬭ *¡ᴇʀʀᴏʀ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❌* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴇʀʀᴏʀ* :: ɴᴏ ꜱᴇ ᴘᴜᴅᴏ ᴅᴇꜱᴄᴀʀɢᴀʀ ᴇʟ ᴄᴏɴᴛᴇɴɪᴅᴏ

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
            contextInfo: { ...rcanal }
        }, { quoted: m })

        let buffer = Buffer.from([])
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }

        const captionBase = `> . ﹡ ﹟ 👁️ ׄ ⬭ *¡ᴄᴏɴᴛᴇɴɪᴅᴏ ᴏʙᴛᴇɴɪᴅᴏ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜👁️* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴛɪᴘᴏ* :: ${messageType.includes('video') ? '🎥 ᴠɪᴅᴇᴏ' : messageType.includes('image') ? '🖼️ ɪᴍᴀɢᴇɴ' : '🔊 ᴀᴜᴅɪᴏ'}

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`

        if (messageType.includes('video')) {
            await conn.sendMessage(m.chat, {
                video: buffer,
                caption: captionBase.trim(),
                mimetype: 'video/mp4',
                contextInfo: { ...rcanal }
            }, { quoted: m })
        } else if (messageType.includes('image')) {
            await conn.sendMessage(m.chat, {
                image: buffer,
                caption: captionBase.trim(),
                contextInfo: { ...rcanal }
            }, { quoted: m })
        } else if (messageType.includes('audio')) {
            await conn.sendMessage(m.chat, {
                audio: buffer,
                mimetype: 'audio/ogg; codecs=opus',
                ptt: viewOnceMessage.ptt || false
            }, { quoted: m })
        }
        await m.react('✔️')
    } catch (e) {
        await m.react('✖️')
        conn.sendMessage(m.chat, {
            text: `> . ﹡ ﹟ 👁️ ׄ ⬭ *¡ᴇʀʀᴏʀ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❌* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴇʀʀᴏʀ* :: ${e.message}
ׅㅤ𓏸𓈒ㅤׄ *ʀᴇᴘᴏʀᴛ* :: \`${usedPrefix}report\`

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
            contextInfo: { ...rcanal }
        }, { quoted: m })
    }
}

handler.help = ['ver']
handler.tags = ['tools']
handler.command = ['readviewonce', 'read', 'readvo']
handler.premium = true
handler.reg = true

export default handler
