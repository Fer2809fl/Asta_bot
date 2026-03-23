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
                renderLargerThumbnail: false
            }
        }
    } catch { return {} }
}

let handler = async (m, { conn, text }) => {
    const rcanal = await getRcanal()
    let who

    if (m.mentionedJid && m.mentionedJid.length > 0) {
        who = m.mentionedJid[0]
    } else if (m.quoted) {
        who = m.quoted.sender
    } else if (text) {
        let num = text.replace(/[^0-9]/g, '')
        if (num.length > 10) {
            who = num + '@s.whatsapp.net'
        } else {
            return conn.sendMessage(m.chat, {
                text:
                    `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴘғᴘ*\n\n` +
                    `ׅㅤ𓏸𓈒ㅤׄ Por favor envía un número válido.\n` +
                    `ׅㅤ𓏸𓈒ㅤׄ *Ejemplo* :: 521234567890`,
                contextInfo: rcanal
            }, { quoted: m })
        }
    } else {
        who = m.sender
    }

    try {
        let name = await (async () => {
            try {
                const n = await conn.getName(who)
                return typeof n === 'string' && n.trim() ? n : who.split('@')[0]
            } catch { return who.split('@')[0] }
        })()

        let pp = await conn.profilePictureUrl(who, 'image')
            .catch(() => 'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745522645448.jpeg')

        await m.react('🕒')

        await conn.sendMessage(m.chat, {
            image: { url: pp },
            caption:
                `> . ﹡ ﹟ 🖼️ ׄ ⬭ *ғᴏᴛᴏ ᴅᴇ ᴘᴇʀғɪʟ*\n\n` +
                `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜👤* ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
                `ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴜᴀʀɪᴏ* :: ${name}\n` +
                `ׅㅤ𓏸𓈒ㅤׄ *ɴᴜ́ᴍᴇʀᴏ* :: +${who.split('@')[0]}`,
            contextInfo: { mentionedJid: [who], ...rcanal }
        }, { quoted: m })

        await m.react('✔️')

    } catch (error) {
        console.error(error)
        await m.react('❌')
        conn.sendMessage(m.chat, {
            text:
                `> . ﹡ ﹟ ❌ ׄ ⬭ *ᴇʀʀᴏʀ*\n\n` +
                `ׅㅤ𓏸𓈒ㅤׄ No se pudo obtener la foto de perfil.\n` +
                `ׅㅤ𓏸𓈒ㅤׄ El usuario podría no tener foto o no está en WhatsApp.`,
            contextInfo: rcanal
        }, { quoted: m })
    }
}

handler.help = ['pfp [@usuario|número|respondiendo]']
handler.tags = ['tools']
handler.command = /^(pfp|getpic|fotoperfil|profilepic)$/i
handler.reg = true

export default handler
