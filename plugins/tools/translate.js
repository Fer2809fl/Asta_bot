import translate from '@vitalets/google-translate-api'
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

const handler = async (m, { conn, args, usedPrefix }) => {
    const rcanal = await getRcanal()
    const defaultLang = 'es'

    if (!args || !args[0]) {
        if (m.quoted && m.quoted.text) {
            args = [defaultLang, m.quoted.text]
        } else {
            return conn.sendMessage(m.chat, {
                text: `> . ﹡ ﹟ 🌍 ׄ ⬭ *¡ᴛʀᴀᴅᴜᴄᴛᴏʀ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🌍* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴏ* :: \`#translate (idioma) (texto)\`
ׅㅤ𓏸𓈒ㅤׄ *ᴇᴊᴇᴍᴘʟᴏ* :: \`#translate en Hola mundo\`

> ## \`ᴄᴏ́ᴅɪɢᴏꜱ ᴅᴇ ɪᴅɪᴏᴍᴀ 🌐\`

ׅㅤ𓏸𓈒ㅤׄ *es* :: ᴇꜱᴘᴀɴ̃ᴏʟ
ׅㅤ𓏸𓈒ㅤׄ *en* :: ɪɴɢʟéꜱ
ׅㅤ𓏸𓈒ㅤׄ *fr* :: ꜰʀᴀɴᴄéꜱ
ׅㅤ𓏸𓈒ㅤׄ *de* :: ᴀʟᴇᴍáɴ
ׅㅤ𓏸𓈒ㅤׄ *ja* :: ᴊᴀᴘᴏɴéꜱ
ׅㅤ𓏸𓈒ㅤׄ *pt* :: ᴘᴏʀᴛᴜɢᴜéꜱ
ׅㅤ𓏸𓈒ㅤׄ *it* :: ɪᴛᴀʟɪᴀɴᴏ
ׅㅤ𓏸𓈒ㅤׄ *ru* :: ʀᴜꜱᴏ
ׅㅤ𓏸𓈒ㅤׄ *zh* :: ᴄʜɪɴᴏ
ׅㅤ𓏸𓈒ㅤׄ *ko* :: ᴄᴏʀᴇᴀɴᴏ

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
                contextInfo: { ...rcanal }
            }, { quoted: m })
        }
    }

    let lang = args[0]
    let text = args.slice(1).join(' ')
    if ((args[0] || '').length !== 2) {
        lang = defaultLang
        text = args.join(' ')
    }

    try {
        await m.react('🕒')
        const result = await translate(`${text}`, { to: lang, autoCorrect: true })
        await conn.sendMessage(m.chat, {
            text: `> . ﹡ ﹟ 🌍 ׄ ⬭ *¡ᴛʀᴀᴅᴜᴄᴄɪᴏ́ɴ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🌍* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ɪᴅɪᴏᴍᴀ* :: \`${lang}\`
ׅㅤ𓏸𓈒ㅤׄ *ᴏʀɪɢɪɴᴀʟ* :: ${text}
ׅㅤ𓏸𓈒ㅤׄ *ᴛʀᴀᴅᴜᴄᴄɪᴏ́ɴ* :: ${result.text}

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
            contextInfo: { ...rcanal }
        }, { quoted: m })
        await m.react('✔️')
    } catch (error) {
        await m.react('✖️')
        conn.sendMessage(m.chat, {
            text: `> . ﹡ ﹟ 🌍 ׄ ⬭ *¡ᴇʀʀᴏʀ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❌* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴇʀʀᴏʀ* :: ${error.message}
ׅㅤ𓏸𓈒ㅤׄ *ʀᴇᴘᴏʀᴛ* :: \`${usedPrefix}report\`

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
            contextInfo: { ...rcanal }
        }, { quoted: m })
    }
}

handler.help = ['translate']
handler.tags = ['tools']
handler.command = ['translate', 'traducir', 'trad']
handler.group = true
handler.reg = true

export default handler
