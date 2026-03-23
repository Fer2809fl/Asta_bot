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

let handler = async (m, { text, usedPrefix, command, conn }) => {
    const rcanal = await getRcanal()
    const userId = m.sender

    if (command === 'setmeta') {
        const packParts = text.split(/[\u2022|]/).map(part => part.trim())
        if (packParts.length < 2) {
            return conn.sendMessage(m.chat, {
                text:
                    `> . ﹡ ﹟ 🏷️ ׄ ⬭ *sᴇᴛᴍᴇᴛᴀ*\n\n` +
                    `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜⚠️* ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
                    `ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴏ* :: ${usedPrefix + command} Pack • Autor\n` +
                    `ׅㅤ𓏸𓈒ㅤׄ *ᴇᴊᴇᴍᴘʟᴏ* :: ${usedPrefix + command} MiPack • MiNombre`,
                contextInfo: rcanal
            }, { quoted: m })
        }
        const packText1 = packParts[0]
        const packText2 = packParts[1]
        if (!global.db.data.users[userId]) global.db.data.users[userId] = {}
        const packstickers = global.db.data.users[userId]
        packstickers.text1 = packText1
        packstickers.text2 = packText2
        await global.db.write()
        return conn.sendMessage(m.chat, {
            text:
                `> . ﹡ ﹟ ✅ ׄ ⬭ *ᴍᴇᴛᴀ ᴀᴄᴛᴜᴀʟɪᴢᴀᴅᴀ*\n\n` +
                `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🏷️* ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
                `ׅㅤ𓏸𓈒ㅤׄ *ᴘᴀᴄᴋ* :: ${packText1}\n` +
                `ׅㅤ𓏸𓈒ㅤׄ *ᴀᴜᴛᴏʀ* :: ${packText2}\n\n` +
                `> ✧ Tus stickers usarán esta meta por defecto`,
            contextInfo: rcanal
        }, { quoted: m })
    }

    if (command === 'delmeta') {
        if (!global.db.data.users[userId]?.text1 && !global.db.data.users[userId]?.text2) {
            return conn.sendMessage(m.chat, {
                text:
                    `> . ﹡ ﹟ ⚠️ ׄ ⬭ *sɪɴ ᴍᴇᴛᴀ*\n\n` +
                    `ׅㅤ𓏸𓈒ㅤׄ No tienes un pack de stickers configurado.`,
                contextInfo: rcanal
            }, { quoted: m })
        }
        const packstickers = global.db.data.users[userId]
        delete packstickers.text1
        delete packstickers.text2
        await global.db.write()
        return conn.sendMessage(m.chat, {
            text:
                `> . ﹡ ﹟ 🗑️ ׄ ⬭ *ᴍᴇᴛᴀ ᴇʟɪᴍɪɴᴀᴅᴀ*\n\n` +
                `ׅㅤ𓏸𓈒ㅤׄ Se restableció el pack de stickers por defecto.`,
            contextInfo: rcanal
        }, { quoted: m })
    }
}

handler.help = ['setmeta', 'delmeta']
handler.tags = ['tools']
handler.command = ['setmeta', 'delmeta']
handler.group = true
handler.reg = true

export default handler
