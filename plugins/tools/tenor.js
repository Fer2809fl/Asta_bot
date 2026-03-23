import fetch from 'node-fetch'
import baileys from '@whiskeysockets/baileys'

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

async function sendAlbumMessage(jid, medias, options = {}) {
    if (typeof jid !== "string") throw new TypeError(`jid must be string, received: ${jid}`)
    if (!Array.isArray(medias) || medias.length < 2) throw new RangeError("Minimum 2 media required")
    for (const media of medias) {
        if (!media.type || (media.type !== "image" && media.type !== "video")) throw new TypeError(`Invalid media type: ${media.type}`)
        if (!media.data || (!media.data.url && !Buffer.isBuffer(media.data))) throw new TypeError(`Invalid media data`)
    }
    const caption = options.text || options.caption || ""
    const delay = !isNaN(options.delay) ? options.delay : 500
    delete options.text
    delete options.caption
    delete options.delay
    const album = baileys.generateWAMessageFromContent(jid, {
        messageContextInfo: {},
        albumMessage: {
            expectedImageCount: medias.filter(m => m.type === "image").length,
            expectedVideoCount: medias.filter(m => m.type === "video").length,
            ...(options.quoted ? {
                contextInfo: {
                    remoteJid: options.quoted.key.remoteJid,
                    fromMe: options.quoted.key.fromMe,
                    stanzaId: options.quoted.key.id,
                    participant: options.quoted.key.participant || options.quoted.key.remoteJid,
                    quotedMessage: options.quoted.message
                }
            } : {})
        }
    }, {})
    await conn.relayMessage(album.key.remoteJid, album.message, { messageId: album.key.id })
    for (let i = 0; i < medias.length; i++) {
        const { type, data } = medias[i]
        const mediaMsg = await baileys.generateWAMessage(album.key.remoteJid, {
            [type]: data,
            ...(i === 0 ? { caption } : {})
        }, { upload: conn.waUploadToServer })
        mediaMsg.message.messageContextInfo = {
            messageAssociation: { associationType: 1, parentMessageKey: album.key }
        }
        await conn.relayMessage(mediaMsg.key.remoteJid, mediaMsg.message, { messageId: mediaMsg.key.id })
        await baileys.delay(delay)
    }
    return album
}

const handler = async (m, { conn, text, usedPrefix }) => {
    const rcanal = await getRcanal()

    if (!text) return conn.sendMessage(m.chat, {
        text: `> . ﹡ ﹟ 🎞️ ׄ ⬭ *¡ᴛᴇɴᴏʀ ɢɪꜰ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🎞️* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴏ* :: \`#tenor (búsqueda)\`
ׅㅤ𓏸𓈒ㅤׄ *ᴇᴊᴇᴍᴘʟᴏ* :: \`#tenor anime fight\`
ׅㅤ𓏸𓈒ㅤׄ *ᴍáx* :: 10 ɢɪꜰꜱ ᴘᴏʀ ʙúꜱǫᴜᴇᴅᴀ

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
        contextInfo: { ...rcanal }
    }, { quoted: m })

    try {
        await m.react('🕒')
        const res = await fetch(`${global.APIs.delirius.url}/search/tenor?q=${text}`)
        const json = await res.json()
        const gifs = json.data

        if (!gifs || gifs.length < 2) {
            await m.react('✖️')
            return conn.sendMessage(m.chat, {
                text: `> . ﹡ ﹟ 🎞️ ׄ ⬭ *¡ᴛᴇɴᴏʀ ɢɪꜰ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❌* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴇʀʀᴏʀ* :: ꜱɪɴ ʀᴇꜱᴜʟᴛᴀᴅᴏꜱ\nׅㅤ𓏸𓈒ㅤׄ *ʙúꜱǫᴜᴇᴅᴀ* :: ${text}\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                contextInfo: { ...rcanal }
            }, { quoted: m })
        }

        const maxItems = Math.min(gifs.length, 10)
        const medias = gifs.slice(0, maxItems).map(gif => ({ type: 'video', data: { url: gif.mp4 } }))

        const caption = `> . ﹡ ﹟ 🎞️ ׄ ⬭ *¡ɢɪꜰꜱ ᴇɴᴄᴏɴᴛʀᴀᴅᴏꜱ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🎞️* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ʙúꜱǫᴜᴇᴅᴀ* :: ${text}
ׅㅤ𓏸𓈒ㅤׄ *ʀᴇꜱᴜʟᴛᴀᴅᴏꜱ* :: ${maxItems}

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim()

        await sendAlbumMessage(m.chat, medias, { caption, quoted: m })
        await m.react('✔️')
    } catch (e) {
        await m.react('✖️')
        conn.sendMessage(m.chat, {
            text: `> . ﹡ ﹟ 🎞️ ׄ ⬭ *¡ᴇʀʀᴏʀ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❌* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴇʀʀᴏʀ* :: ${e.message}\nׅㅤ𓏸𓈒ㅤׄ *ʀᴇᴘᴏʀᴛ* :: \`${usedPrefix}report\`\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
            contextInfo: { ...rcanal }
        }, { quoted: m })
    }
}

handler.help = ['tenor']
handler.tags = ['tools']
handler.command = ['tenorsearch', 'tenor']
handler.reg = true

export default handler
