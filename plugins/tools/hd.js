import fs from 'fs'
import FormData from 'form-data'
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

const handler = async (m, { conn }) => {
    const rcanal = await getRcanal()
    try {
        const q = m.quoted ? m.quoted : m
        const mime = (q.msg || q).mimetype || ''

        if (!mime) return conn.sendMessage(m.chat, {
            text: `> . ﹡ ﹟ 🖼️ ׄ ⬭ *¡ꜱᴜʙɪʀ ɪᴍᴀɢᴇɴ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🖼️* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴏ* :: ʀᴇꜱᴘᴏɴᴅᴇ ᴀ ᴜɴᴀ *ɪᴍᴀɢᴇɴ*
ׅㅤ𓏸𓈒ㅤׄ *ᴄᴏᴍᴀɴᴅᴏꜱ* :: \`#hd\` \`#uguu\`
ׅㅤ𓏸𓈒ㅤׄ *ʜᴏꜱᴛ* :: uguu.se

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
            contextInfo: { ...rcanal }
        }, { quoted: m })

        await m.react('⏳')
        const media = await q.download?.() || await q.downloadMedia?.()
        const filePath = `./temp_${Date.now()}.jpg`
        fs.writeFileSync(filePath, media)

        const form = new FormData()
        form.append('file', fs.createReadStream(filePath))

        const res = await fetch('https://uguu.se/upload.php', { method: 'POST', body: form })
        const result = await res.json().catch(() => ({}))

        if (!result.url) throw new Error('No se pudo subir la imagen a uguu.se')
        fs.unlinkSync(filePath)

        await conn.sendMessage(m.chat, {
            text: `> . ﹡ ﹟ 🖼️ ׄ ⬭ *¡ɪᴍᴀɢᴇɴ ꜱᴜʙɪᴅᴀ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🖼️* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴇꜱᴛᴀᴅᴏ* :: ꜱᴜʙɪᴅᴀ ᴇxɪᴛᴏꜱᴀᴍᴇɴᴛᴇ ✅
ׅㅤ𓏸𓈒ㅤׄ *ᴇɴʟᴀᴄᴇ* :: ${result.url}
ׅㅤ𓏸𓈒ㅤׄ *ʜᴏꜱᴛ* :: uguu.se

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
            contextInfo: { ...rcanal }
        }, { quoted: m })
        await m.react('✅')
    } catch (e) {
        if (fs.existsSync(`./temp_${Date.now()}.jpg`)) fs.unlinkSync(`./temp_${Date.now()}.jpg`)
        await m.react('✖️')
        conn.sendMessage(m.chat, {
            text: `> . ﹡ ﹟ 🖼️ ׄ ⬭ *¡ᴇʀʀᴏʀ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❌* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴇʀʀᴏʀ* :: ${e.message}\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
            contextInfo: { ...rcanal }
        }, { quoted: m })
    }
}

handler.help = ['uguu', 'hd']
handler.tags = ['tools']
handler.command = ['uguu', 'hd']
handler.owner = false
handler.limit = false
handler.reg = true

export default handler
