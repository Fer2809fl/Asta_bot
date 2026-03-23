import fetch from 'node-fetch'
import { format } from 'util'

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

let handler = async (m, { conn, text }) => {
    const rcanal = await getRcanal()
    if (m.fromMe) return

    if (!/^https?:\/\//.test(text)) return conn.sendMessage(m.chat, {
        text: `> . ﹡ ﹟ 🌐 ׄ ⬭ *¡ꜰᴇᴛᴄʜ ᴡᴇʙ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🌐* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴏ* :: \`#get (url)\`
ׅㅤ𓏸𓈒ㅤׄ *ᴇᴊᴇᴍᴘʟᴏ* :: \`#get https://example.com\`
ׅㅤ𓏸𓈒ㅤׄ *ɴᴏᴛᴀ* :: ᴏʙᴛɪᴇɴᴇ ᴄᴏɴᴛᴇɴɪᴅᴏ ᴛᴇxᴛᴏ/ᴊꜱᴏɴ

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
        contextInfo: { ...rcanal }
    }, { quoted: m })

    await m.react('🕒')
    let res = await fetch(text)
    if (res.headers.get('content-length') > 100 * 1024 * 1024 * 1024) throw `Content-Length: ${res.headers.get('content-length')}`
    if (!/text|json/.test(res.headers.get('content-type'))) return conn.sendFile(m.chat, text, 'file', text, m)

    let txt = await res.buffer()
    try {
        txt = format(JSON.parse(txt + ''))
    } catch {
        txt = txt + ''
    } finally {
        conn.sendMessage(m.chat, {
            text: `> . ﹡ ﹟ 🌐 ׄ ⬭ *¡ʀᴇꜱᴘᴜᴇꜱᴛᴀ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🌐* ㅤ֢ㅤ⸱ㅤᯭִ*
ׅㅤ𓏸𓈒ㅤׄ *ᴜʀʟ* :: ${text}

> ## \`ᴄᴏɴᴛᴇɴɪᴅᴏ 📋\`

${txt.slice(0, 3000)}${txt.length > 3000 ? '\n...' : ''}

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
            contextInfo: { ...rcanal }
        }, { quoted: m })
        await m.react('✔️')
    }
}

handler.help = ['get']
handler.tags = ['tools']
handler.command = ['fetch', 'get']
handler.reg = true

export default handler
