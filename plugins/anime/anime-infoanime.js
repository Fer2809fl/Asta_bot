import fetch from 'node-fetch'
import { lookup } from 'mime-types'

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

let handler = async (m, { conn, usedPrefix, command, text }) => {
    const rcanal = await getRcanal()
    
    if (!text) return conn.sendMessage(m.chat, {
        text: `ׅㅤ𓏸𓈒ㅤׄ ❗ *ᴜsᴏ* :: ${usedPrefix + command} <ɴᴏᴍʙʀᴇ ᴅᴇʟ ᴀɴɪᴍᴇ>\nׅㅤ𓏸𓈒ㅤׄ *ᴇᴊᴇᴍᴘʟᴏ* :: ${usedPrefix + command} ᴏɴᴇ ᴘɪᴇᴄᴇ`,
        contextInfo: rcanal
    }, { quoted: m })

    try {
        await m.react('🕒')
        let res = await fetch('https://api.jikan.moe/v4/manga?q=' + text)
        
        if (!res.ok) {
            await m.react('❌')
            return conn.sendMessage(m.chat, {
                text: `ׅㅤ𓏸𓈒ㅤׄ ⚠️ *ᴇʀʀᴏʀ* :: ɴᴏ sᴇ ᴇɴᴄᴏɴᴛʀᴀʀᴏɴ ʀᴇsᴜʟᴛᴀᴅᴏs`,
                contextInfo: rcanal
            }, { quoted: m })
        }

        let json = await res.json()
        let { chapters, title_japanese, url, type, score, members, background, status, volumes, synopsis, favorites } = json.data[0]
        let author = json.data[0].authors[0].name

        const caption = 
            `> . ﹡ ﹟ 🎴 ׄ ⬭ *ɪɴғᴏ - ᴀɴɪᴍᴇ*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜📖* ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴛɪᴛᴜʟᴏ* :: ${title_japanese}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴄᴀᴘɪᴛᴜʟᴏs* :: ${chapters || 'Desconocido'}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴛʀᴀɴsᴍɪsɪᴏɴ* :: ${type}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴇsᴛᴀᴅᴏ* :: ${status}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴠᴏʟᴜᴍᴇɴs* :: ${volumes || 'Desconocido'}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ғᴀᴠᴏʀɪᴛᴏs* :: ${favorites}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴘᴜɴᴛᴀᴊᴇ* :: ${score}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴍɪᴇᴍʙʀᴏs* :: ${members}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴀᴜᴛᴏʀ* :: ${author}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ғᴏɴᴅᴏ* :: ${background || 'No disponible'}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *sɪɴᴏᴘsɪs* :: ${synopsis}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴇɴʟᴀᴄᴇ* :: ${url}`

        await conn.sendMessage(m.chat, {
            image: { url: json.data[0].images.jpg.image_url },
            caption,
            contextInfo: rcanal
        }, { quoted: m })
        
        await m.react('✅')
        
    } catch (error) {
        await m.react('❌')
        conn.sendMessage(m.chat, {
            text: `ׅㅤ𓏸𓈒ㅤׄ ⚠️ *ᴇʀʀᴏʀ* :: ${error.message}\n\nׅㅤ𓏸𓈒ㅤׄ *ɪɴғᴏʀᴍᴀʀ* :: ᴜsᴀ *${usedPrefix}report* ᴘᴀʀᴀ ɪɴғᴏʀᴍᴀʀ ᴇʟ ᴘʀᴏʙʟᴇᴍᴀ`,
            contextInfo: rcanal
        }, { quoted: m })
    }
}

handler.help = ['infoanime']
handler.tags = ['anime']
handler.command = ['infoanime']
handler.group = true
handler.reg = true

export { handler as default }
