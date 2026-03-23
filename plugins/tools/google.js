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

let handler = async (m, { conn, text, usedPrefix, args }) => {
    const rcanal = await getRcanal()

    if (!text) return conn.sendMessage(m.chat, {
        text: `> . ﹡ ﹟ 🔍 ׄ ⬭ *¡ɢᴏᴏɢʟᴇ ꜱᴇᴀʀᴄʜ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🔍* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴏ* :: \`#google (término)\`
ׅㅤ𓏸𓈒ㅤׄ *ᴇᴊᴇᴍᴘʟᴏ* :: \`#google gatos curiosos\`
ׅㅤ𓏸𓈒ㅤׄ *ʀᴇꜱᴜʟᴛᴀᴅᴏꜱ* :: ᴍáx. 3 ᴘᴏʀ ᴅᴇꜰᴇᴄᴛᴏ

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
        contextInfo: { ...rcanal }
    }, { quoted: m })

    const apiUrl = `${global.APIs.delirius.url}/search/googlesearch?query=${encodeURIComponent(text)}`
    let maxResults = Number(args[1]) || 3

    try {
        await m.react('🕒')
        const response = await fetch(apiUrl)
        if (!response.ok) throw new Error('No se pudo conectar con la API')
        const result = await response.json()

        if (!result.status || !Array.isArray(result.data) || !result.data.length) {
            await m.react('✖️')
            return conn.sendMessage(m.chat, {
                text: `> . ﹡ ﹟ 🔍 ׄ ⬭ *¡ɢᴏᴏɢʟᴇ ꜱᴇᴀʀᴄʜ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❌* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴇʀʀᴏʀ* :: ꜱɪɴ ʀᴇꜱᴜʟᴛᴀᴅᴏꜱ
ׅㅤ𓏸𓈒ㅤׄ *ʙúꜱǫᴜᴇᴅᴀ* :: ${text}

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
                contextInfo: { ...rcanal }
            }, { quoted: m })
        }

        let txt = `> . ﹡ ﹟ 🔍 ׄ ⬭ *¡ʀᴇꜱᴜʟᴛᴀᴅᴏꜱ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🔍* ㅤ֢ㅤ⸱ㅤᯭִ*
ׅㅤ𓏸𓈒ㅤׄ *ʙúꜱǫᴜᴇᴅᴀ* :: ${text}
ׅㅤ𓏸𓈒ㅤׄ *ʀᴇꜱᴜʟᴛᴀᴅᴏꜱ* :: ${Math.min(result.data.length, maxResults)}

> ## \`ʀᴇꜱᴜʟᴛᴀᴅᴏꜱ 📋\`

`
        result.data.slice(0, maxResults).forEach((item, index) => {
            txt += `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜${index + 1}* ㅤ֢ㅤ⸱ㅤᯭִ*\n`
            txt += `ׅㅤ𓏸𓈒ㅤׄ *ᴛíᴛᴜʟᴏ* :: ${item.title || 'Sin título'}\n`
            txt += `ׅㅤ𓏸𓈒ㅤׄ *ᴅᴇꜱᴄ* :: ${item.description ? item.description.slice(0, 80) + '...' : 'Sin descripción'}\n`
            txt += `ׅㅤ𓏸𓈒ㅤׄ *ᴜʀʟ* :: ${item.url || 'Sin url'}\n\n`
        })

        txt += `> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`

        await conn.sendMessage(m.chat, {
            text: txt.trim(),
            contextInfo: { ...rcanal }
        }, { quoted: m })
        await m.react('✔️')
    } catch (error) {
        await m.react('✖️')
        conn.sendMessage(m.chat, {
            text: `> . ﹡ ﹟ 🔍 ׄ ⬭ *¡ᴇʀʀᴏʀ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❌* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴇʀʀᴏʀ* :: ${error.message}
ׅㅤ𓏸𓈒ㅤׄ *ʀᴇᴘᴏʀᴛ* :: \`${usedPrefix}report\`

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
            contextInfo: { ...rcanal }
        }, { quoted: m })
    }
}

handler.help = ['google']
handler.command = ['google']
handler.group = true
handler.reg = true

export default handler
