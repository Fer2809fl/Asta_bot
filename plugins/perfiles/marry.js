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

let proposals = {}

let handler = async (m, { conn, command }) => {
    const rcanal = await getRcanal()

    try {
        const sender = m.sender
        const mentionedJid = await m.mentionedJid
        const mentionedUser = mentionedJid?.[0] || m.quoted?.sender

        if (!mentionedUser) {
            return conn.sendMessage(m.chat, {
                text:
                    `> . ﹡ ﹟ 💌 ׄ ⬭ *ᴍᴀʀʀʏ*\n\n` +
                    `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜⚠️* ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
                    `ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴏ* :: #marry @usuario\n` +
                    `ׅㅤ𓏸𓈒ㅤׄ *ᴏ* :: Responde a un mensaje con #marry\n` +
                    `ׅㅤ𓏸𓈒ㅤׄ *ᴅɪᴠᴏʀᴄɪᴏ* :: #divorce @usuario`,
                contextInfo: rcanal
            }, { quoted: m })
        }

        if (mentionedUser === sender) {
            return conn.sendMessage(m.chat, {
                text:
                    `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴇʀʀᴏʀ*\n\n` +
                    `ׅㅤ𓏸𓈒ㅤׄ No puedes proponerte matrimonio a ti mismo.`,
                contextInfo: rcanal
            }, { quoted: m })
        }

        const senderData = global.db.data.users[sender]
        const targetData = global.db.data.users[mentionedUser]

        // ===== DIVORCE =====
        if (command === 'divorce') {
            if (senderData.marry !== mentionedUser) {
                return conn.sendMessage(m.chat, {
                    text:
                        `> . ﹡ ﹟ 💔 ׄ ⬭ *ᴅɪᴠᴏʀᴄɪᴏ*\n\n` +
                        `ׅㅤ𓏸𓈒ㅤׄ No estás casado/a con @${mentionedUser.split('@')[0]}.`,
                    contextInfo: { mentionedJid: [mentionedUser], ...rcanal }
                }, { quoted: m })
            }
            senderData.marry = ''
            if (targetData) targetData.marry = ''
            return conn.sendMessage(m.chat, {
                text:
                    `> . ﹡ ﹟ 💔 ׄ ⬭ *ᴅɪᴠᴏʀᴄɪᴏ*\n\n` +
                    `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜😢* ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
                    `ׅㅤ𓏸𓈒ㅤׄ *${senderData.name}* y *${targetData?.name || mentionedUser.split('@')[0]}* se han divorciado.\n` +
                    `ׅㅤ𓏸𓈒ㅤׄ Que cada quien encuentre su camino 💔`,
                contextInfo: { mentionedJid: [mentionedUser, sender], ...rcanal }
            }, { quoted: m })
        }

        // ===== YA CASADOS =====
        if (senderData.marry === mentionedUser) {
            return conn.sendMessage(m.chat, {
                text:
                    `> . ﹡ ﹟ 💖 ׄ ⬭ *ᴍᴀʀʀʏ*\n\n` +
                    `ׅㅤ𓏸𓈒ㅤׄ Ya estás casado/a con *${targetData?.name || mentionedUser.split('@')[0]}* 💍`,
                contextInfo: { mentionedJid: [mentionedUser], ...rcanal }
            }, { quoted: m })
        }

        // ===== ACEPTAR PROPUESTA =====
        if (proposals[sender] && proposals[sender] === mentionedUser) {
            delete proposals[sender]
            senderData.marry = mentionedUser
            if (targetData) targetData.marry = sender

            return conn.sendMessage(m.chat, {
                text:
                    `> . ﹡ ﹟ 💍 ׄ ⬭ *¡ᴍᴀᴛʀɪᴍᴏɴɪᴏ!*\n\n` +
                    `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🎉* ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
                    `ׅㅤ𓏸𓈒ㅤׄ 👰 *${senderData.name}*\n` +
                    `ׅㅤ𓏸𓈒ㅤׄ 🤵 *${targetData?.name || mentionedUser.split('@')[0]}*\n\n` +
                    `> ✧ ¡Se han casado! Que disfruten su luna de miel 🥂💌`,
                contextInfo: { mentionedJid: [sender, mentionedUser], ...rcanal }
            }, { quoted: m })
        }

        // ===== ENVIAR PROPUESTA =====
        // Si el objetivo ya propuso al remitente, aceptar automáticamente
        if (proposals[mentionedUser] && proposals[mentionedUser] === sender) {
            delete proposals[mentionedUser]
            senderData.marry = mentionedUser
            if (targetData) targetData.marry = sender

            return conn.sendMessage(m.chat, {
                text:
                    `> . ﹡ ﹟ 💍 ׄ ⬭ *¡ᴍᴀᴛʀɪᴍᴏɴɪᴏ!*\n\n` +
                    `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🎉* ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
                    `ׅㅤ𓏸𓈒ㅤׄ 👰 *${senderData.name}*\n` +
                    `ׅㅤ𓏸𓈒ㅤׄ 🤵 *${targetData?.name || mentionedUser.split('@')[0]}*\n\n` +
                    `> ✧ ¡Se han casado! Que disfruten su luna de miel 🥂💌`,
                contextInfo: { mentionedJid: [sender, mentionedUser], ...rcanal }
            }, { quoted: m })
        }

        // Nueva propuesta
        proposals[sender] = mentionedUser
        setTimeout(() => {
            if (proposals[sender] === mentionedUser) delete proposals[sender]
        }, 2 * 60 * 1000)

        return conn.sendMessage(m.chat, {
            text:
                `> . ﹡ ﹟ 💌 ׄ ⬭ *ᴘʀᴏᴘᴜᴇsᴛᴀ ᴅᴇ ᴍᴀᴛʀɪᴍᴏɴɪᴏ*\n\n` +
                `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜💖* ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
                `ׅㅤ𓏸𓈒ㅤׄ *${senderData.name}* le propone matrimonio a @${mentionedUser.split('@')[0]}\n\n` +
                `> ✧ *ᴀᴄᴇᴘᴛᴀʀ* :: Responde con *#marry @${sender.split('@')[0]}*\n` +
                `> ✧ *ᴇxᴘɪʀᴀ* :: En 2 minutos ⏳`,
            contextInfo: { mentionedJid: [sender, mentionedUser], ...rcanal }
        }, { quoted: m })

    } catch (error) {
        console.error(error)
        return conn.sendMessage(m.chat, {
            text:
                `> . ﹡ ﹟ ❌ ׄ ⬭ *ᴇʀʀᴏʀ*\n\n` +
                `ׅㅤ𓏸𓈒ㅤׄ Se produjo un problema: ${error.message}`,
            contextInfo: rcanal
        }, { quoted: m })
    }
}

handler.tags = ['fun']
handler.command = ['marry', 'divorce']
handler.help = ['marry', 'divorce']
handler.reg = true

export default handler
