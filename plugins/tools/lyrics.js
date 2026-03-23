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
        text: `> . ﹡ ﹟ 🎵 ׄ ⬭ *¡ʟʏʀɪᴄꜱ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🎵* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴏ* :: \`#lyrics (canción)\`
ׅㅤ𓏸𓈒ㅤׄ *ᴇᴊᴇᴍᴘʟᴏ* :: \`#lyrics Shape of You\`

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
        contextInfo: { ...rcanal }
    }, { quoted: m })

    try {
        await m.react('🕒')
        let res = await fetch(`${global.APIs.delirius.url}/search/lyrics?query=${encodeURIComponent(text)}`)
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`)
        let json = await res.json()

        if (!json.status || !json.data?.lyrics) {
            await m.react('✖️')
            return conn.sendMessage(m.chat, {
                text: `> . ﹡ ﹟ 🎵 ׄ ⬭ *¡ʟʏʀɪᴄꜱ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❌* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴇʀʀᴏʀ* :: ɴᴏ ꜱᴇ ᴇɴᴄᴏɴᴛʀᴏ́ ʟᴀ ʟᴇᴛʀᴀ
ׅㅤ𓏸𓈒ㅤׄ *ᴄᴀɴᴄɪᴏ́ɴ* :: ${text}

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
                contextInfo: { ...rcanal }
            }, { quoted: m })
        }

        let { title, artists, lyrics, image, url } = json.data
        let caption = `> . ﹡ ﹟ 🎵 ׄ ⬭ *¡ʟᴇᴛʀᴀ ᴅᴇ ᴄᴀɴᴄɪᴏ́ɴ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🎵* ㅤ֢ㅤ⸱ㅤᯭִ*
ׅㅤ𓏸𓈒ㅤׄ *ᴛíᴛᴜʟᴏ* :: ${title}
ׅㅤ𓏸𓈒ㅤׄ *ᴀʀᴛɪꜱᴛᴀ* :: ${artists}

> ## \`ʟᴇᴛʀᴀ 📝\`

${lyrics}`

        if (caption.length > 4000) caption = caption.slice(0, 3990) + '...'
        caption += `\n\n↯ [ᴠᴇʀ ᴇɴ ᴍᴜꜱɪxᴍᴀᴛᴄʜ](${url})\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`

        await conn.sendMessage(m.chat, {
            image: { url: image },
            caption: caption.trim(),
            contextInfo: {
                mentionedJid: [m.sender],
                ...rcanal
            }
        }, { quoted: m })
        await m.react('✔️')
    } catch (error) {
        await m.react('✖️')
        conn.sendMessage(m.chat, {
            text: `> . ﹡ ﹟ 🎵 ׄ ⬭ *¡ᴇʀʀᴏʀ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❌* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴇʀʀᴏʀ* :: ${error.message}
ׅㅤ𓏸𓈒ㅤׄ *ʀᴇᴘᴏʀᴛ* :: \`${usedPrefix}report\`

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
            contextInfo: { ...rcanal }
        }, { quoted: m })
    }
}

handler.command = ['lyrics']
handler.help = ['lyrics']
handler.tags = ['tools']
handler.reg = true

export default handler
