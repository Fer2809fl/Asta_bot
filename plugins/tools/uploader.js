import fetch from 'node-fetch'
import uploadImage from '../../lib/uploadImage.js'
import { FormData, Blob } from "formdata-node"
import { fileTypeFromBuffer } from "file-type"
import crypto from "crypto"

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

const handler = async (m, { conn, command, usedPrefix }) => {
    const rcanal = await getRcanal()
    try {
        let q = m.quoted ? m.quoted : m
        let mime = (q.msg || q).mimetype || ''

        switch (command) {
            case 'tourl': {
                if (!mime) return conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ 🔗 ׄ ⬭ *¡ꜱᴜʙɪʀ ᴀ ᴜʀʟ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🔗* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴏ* :: ʀᴇꜱᴘᴏɴᴅᴇ ᴀ ᴜɴᴀ ɪᴍᴀɢᴇɴ/ᴠɪᴅᴇᴏ
ׅㅤ𓏸𓈒ㅤׄ *ᴄᴏᴍᴀɴᴅᴏ* :: \`#tourl\`
ׅㅤ𓏸𓈒ㅤׄ *ʀᴇꜱᴜʟᴛᴀᴅᴏ* :: ᴇɴʟᴀᴄᴇ ᴅɪʀᴇᴄᴛᴏ

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
                    contextInfo: { ...rcanal }
                }, { quoted: m })
                await m.react('🕒')
                const media = await q.download()
                const link = await uploadImage(media)
                const txt = `> . ﹡ ﹟ 🔗 ׄ ⬭ *¡ᴀʀᴄʜɪᴠᴏ ꜱᴜʙɪᴅᴏ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🔗* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴇɴʟᴀᴄᴇ* :: ${link}
ׅㅤ𓏸𓈒ㅤׄ *ᴛᴀᴍᴀɴ̃ᴏ* :: ${formatBytes(media.length)}
ׅㅤ𓏸𓈒ㅤׄ *ᴇxᴘɪʀᴀ* :: ɴᴏ ᴇxᴘɪʀᴀ ✅

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`
                await conn.sendMessage(m.chat, {
                    text: txt.trim(),
                    contextInfo: { ...rcanal }
                }, { quoted: m })
                await m.react('✔️')
                break
            }
            case 'catbox': {
                if (!mime) return conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ 📦 ׄ ⬭ *¡ᴄᴀᴛʙᴏx ᴜᴘʟᴏᴀᴅᴇʀ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜📦* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴏ* :: ʀᴇꜱᴘᴏɴᴅᴇ ᴀ ᴜɴᴀ ɪᴍᴀɢᴇɴ/ᴠɪᴅᴇᴏ
ׅㅤ𓏸𓈒ㅤׄ *ᴄᴏᴍᴀɴᴅᴏ* :: \`#catbox\`
ׅㅤ𓏸𓈒ㅤׄ *ʜᴏꜱᴛ* :: catbox.moe

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
                    contextInfo: { ...rcanal }
                }, { quoted: m })
                await m.react('🕒')
                const media = await q.download()
                const link = await catbox(media)
                const txt = `> . ﹡ ﹟ 📦 ׄ ⬭ *¡ᴄᴀᴛʙᴏx ʟɪꜱᴛᴏ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜📦* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴇɴʟᴀᴄᴇ* :: ${link}
ׅㅤ𓏸𓈒ㅤׄ *ᴛᴀᴍᴀɴ̃ᴏ* :: ${formatBytes(media.length)}
ׅㅤ𓏸𓈒ㅤׄ *ʜᴏꜱᴛ* :: catbox.moe ✅

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`
                await conn.sendMessage(m.chat, {
                    text: txt.trim(),
                    contextInfo: { ...rcanal }
                }, { quoted: m })
                await m.react('✔️')
                break
            }
        }
    } catch (error) {
        await m.react('✖️')
        conn.sendMessage(m.chat, {
            text: `> . ﹡ ﹟ 🔗 ׄ ⬭ *¡ᴇʀʀᴏʀ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❌* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴇʀʀᴏʀ* :: ${error.message}
ׅㅤ𓏸𓈒ㅤׄ *ʀᴇᴘᴏʀᴛ* :: \`${usedPrefix}report\`

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
            contextInfo: { ...rcanal }
        }, { quoted: m })
    }
}

handler.help = ['tourl', 'catbox']
handler.tags = ['tools']
handler.command = ['tourl', 'catbox']
handler.reg = true

export default handler

function formatBytes(bytes) {
    if (bytes === 0) return '0 B'
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i]}`
}

async function catbox(content) {
    const { ext, mime } = (await fileTypeFromBuffer(content)) || {}
    const blob = new Blob([content.toArrayBuffer()], { type: mime })
    const formData = new FormData()
    const randomBytes = crypto.randomBytes(5).toString("hex")
    formData.append("reqtype", "fileupload")
    formData.append("fileToUpload", blob, randomBytes + "." + ext)
    const response = await fetch("https://catbox.moe/user/api.php", {
        method: "POST",
        body: formData,
        headers: { "User-Agent": "Mozilla/5.0 (X11; Linux x86_64)" }
    })
    return await response.text()
}
