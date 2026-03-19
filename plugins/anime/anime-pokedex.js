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

let handler = async (m, { conn, text, usedPrefix }) => {
    const rcanal = await getRcanal()
    
    if (!text) return conn.sendMessage(m.chat, {
        text: `ׅㅤ𓏸𓈒ㅤׄ ❗ *ᴜsᴏ* :: ${usedPrefix}pokedex <ɴᴏᴍʙʀᴇ ᴅᴇʟ ᴘᴏᴋᴇᴍᴏɴ>\nׅㅤ𓏸𓈒ㅤׄ *ᴇᴊᴇᴍᴘʟᴏ* :: ${usedPrefix}pokedex ᴘɪᴋᴀᴄʜᴜ`,
        contextInfo: rcanal
    }, { quoted: m })

    try {
        await m.react('🕒')
        const url = `https://some-random-api.com/pokemon/pokedex?pokemon=${encodeURIComponent(text)}`
        const response = await fetch(url)
        const json = await response.json()
        
        if (!response.ok) {
            await m.react('❌')
            return conn.sendMessage(m.chat, {
                text: `ׅㅤ𓏸𓈒ㅤׄ ⚠️ *ᴇʀʀᴏʀ* :: ᴘᴏᴋᴇᴍᴏɴ ɴᴏ ᴇɴᴄᴏɴᴛʀᴀᴅᴏ`,
                contextInfo: rcanal
            }, { quoted: m })
        }

        const caption = 
            `> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴘᴏᴋᴇᴅᴇx - ɪɴғᴏʀᴍᴀᴄɪᴏɴ*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🎮* ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ɴᴏᴍʙʀᴇ* :: ${json.name}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ɪᴅ* :: ${json.id}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴛɪᴘᴏ* :: ${json.type}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ʜᴀʙɪʟɪᴅᴀᴅᴇs* :: ${json.abilities}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴛᴀᴍᴀɴ̃ᴏ* :: ${json.height}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴘᴇsᴏ* :: ${json.weight}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴅᴇsᴄʀɪᴘᴄɪᴏɴ* :: ${json.description}\n\n` +
            `> . ﹡ ﹟ 🔍 ׄ ⬭ *ᴍᴀs ᴅᴇᴛᴀʟʟᴇs*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴇɴʟᴀᴄᴇ* :: https://www.pokemon.com/es/pokedex/${json.name.toLowerCase()}`

        await conn.sendMessage(m.chat, {
            text: caption,
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

handler.help = ['pokedex']
handler.tags = ['fun']
handler.command = ['pokedex']
handler.group = true
handler.reg = true

export { handler as default }
