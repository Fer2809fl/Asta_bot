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

let handler = async (m, { conn, text }) => {
    const rcanal = await getRcanal()
    let id = m.chat
    conn.math = conn.math ? conn.math : {}

    if (id in conn.math) {
        clearTimeout(conn.math[id][3])
        delete conn.math[id]
        m.reply('....')
    }

    if (!text) {
        return conn.sendMessage(m.chat, {
            text: `> . ﹡ ﹟ 🧮 ׄ ⬭ *¡ᴄᴀʟᴄᴜʟᴀᴅᴏʀᴀ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🧮* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴏ* :: \`#calcular (ecuación)\`
ׅㅤ𓏸𓈒ㅤׄ *ᴇᴊᴇᴍᴘʟᴏ* :: \`#calcular 5+3*2\`

> ## \`ꜱɪ́ᴍʙᴏʟᴏꜱ ᴅɪꜱᴘᴏɴɪʙʟᴇꜱ\`

ׅㅤ𓏸𓈒ㅤׄ *+* :: ꜱᴜᴍᴀ
ׅㅤ𓏸𓈒ㅤׄ *-* :: ʀᴇꜱᴛᴀ
ׅㅤ𓏸𓈒ㅤׄ *** :: ᴍᴜʟᴛɪᴘʟɪᴄᴀᴄɪᴏ́ɴ
ׅㅤ𓏸𓈒ㅤׄ */* :: ᴅɪᴠɪꜱɪᴏ́ɴ
ׅㅤ𓏸𓈒ㅤׄ *×* :: ᴍᴜʟᴛɪᴘʟɪᴄᴀʀ
ׅㅤ𓏸𓈒ㅤׄ *÷* :: ᴅɪᴠɪᴅɪʀ
ׅㅤ𓏸𓈒ㅤׄ *π* :: ᴘɪ
ׅㅤ𓏸𓈒ㅤׄ *e* :: ᴇᴜʟᴇʀ

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
            contextInfo: { ...rcanal }
        }, { quoted: m })
    }

    let val = text
        .replace(/[^0-9\-\/+*×÷πEe()piPI/]/g, '')
        .replace(/×/g, '*').replace(/÷/g, '/')
        .replace(/π|pi/gi, 'Math.PI').replace(/e/gi, 'Math.E')
        .replace(/\/+/g, '/').replace(/\++/g, '+').replace(/-+/g, '-')

    let format = val
        .replace(/Math\.PI/g, 'π').replace(/Math\.E/g, 'e')
        .replace(/\//g, '÷').replace(/\*×/g, '×')

    try {
        await m.react('🕒')
        let result = (new Function('return ' + val))()
        if (!result && result !== 0) throw result

        await conn.sendMessage(m.chat, {
            text: `> . ﹡ ﹟ 🧮 ׄ ⬭ *¡ʀᴇꜱᴜʟᴛᴀᴅᴏ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🧮* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴇᴄᴜᴀᴄɪᴏ́ɴ* :: \`${format}\`
ׅㅤ𓏸𓈒ㅤׄ *ʀᴇꜱᴜʟᴛᴀᴅᴏ* :: \`${result}\`

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
            contextInfo: { ...rcanal }
        }, { quoted: m })
        await m.react('✔️')
    } catch (e) {
        await m.react('✖️')
        conn.sendMessage(m.chat, {
            text: `> . ﹡ ﹟ 🧮 ׄ ⬭ *¡ᴇʀʀᴏʀ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❌* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴇʀʀᴏʀ* :: ᶠᵒʳᵐᵃᵗᵒ ɪɴᴄᴏʀʀᴇᴄᴛᴏ
ׅㅤ𓏸𓈒ㅤׄ *ᴘᴇʀᴍɪᴛɪᴅᴏ* :: 0-9 ʏ → \`- + * / × ÷ π e ( )\`

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
            contextInfo: { ...rcanal }
        }, { quoted: m })
    }
}

handler.help = ['cal']
handler.tags = ['tools']
handler.command = ['cal', 'calc', 'calcular', 'calculadora']
handler.group = true
handler.exp = 5
handler.reg = true

export default handler
