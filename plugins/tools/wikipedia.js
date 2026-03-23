import axios from 'axios'
import cheerio from 'cheerio'
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

let handler = async (m, { conn, text, usedPrefix }) => {
    const rcanal = await getRcanal()

    if (!text) return conn.sendMessage(m.chat, {
        text: `> . ﹡ ﹟ 📖 ׄ ⬭ *¡ᴡɪᴋɪᴘᴇᴅɪᴀ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜📖* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴏ* :: \`#wiki (término)\`
ׅㅤ𓏸𓈒ㅤׄ *ᴇᴊᴇᴍᴘʟᴏ* :: \`#wiki México\`
ׅㅤ𓏸𓈒ㅤׄ *ɪᴅɪᴏᴍᴀ* :: ᴇꜱᴘᴀɴ̃ᴏʟ

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
        contextInfo: { ...rcanal }
    }, { quoted: m })

    try {
        await m.react('🕒')
        const link = await axios.get(`https://es.wikipedia.org/wiki/${encodeURIComponent(text)}`)
        const $ = cheerio.load(link.data)
        let titulo = $('#firstHeading').text().trim()
        let contenido = $('#mw-content-text > div.mw-parser-output').find('p').text().trim()
        if (contenido.length > 2000) contenido = contenido.slice(0, 1997) + '...'

        await conn.sendMessage(m.chat, {
            text: `> . ﹡ ﹟ 📖 ׄ ⬭ *¡ᴡɪᴋɪᴘᴇᴅɪᴀ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜📖* ㅤ֢ㅤ⸱ㅤᯭִ*
ׅㅤ𓏸𓈒ㅤׄ *ᴛéʀᴍɪɴᴏ* :: ${titulo}

> ## \`ɪɴꜰᴏʀᴍᴀᴄɪᴏ́ɴ 📋\`

${contenido}

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
            contextInfo: { ...rcanal }
        }, { quoted: m })
        await m.react('✔️')
    } catch (e) {
        await m.react('✖️')
        conn.sendMessage(m.chat, {
            text: `> . ﹡ ﹟ 📖 ׄ ⬭ *¡ᴇʀʀᴏʀ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❌* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴇʀʀᴏʀ* :: ${e.message}
ׅㅤ𓏸𓈒ㅤׄ *ʀᴇᴘᴏʀᴛ* :: \`${usedPrefix}report\`

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
            contextInfo: { ...rcanal }
        }, { quoted: m })
    }
}

handler.help = ['wikipedia']
handler.tags = ['tools']
handler.command = ['wiki', 'wikipedia']
handler.group = true
handler.reg = true

export default handler
