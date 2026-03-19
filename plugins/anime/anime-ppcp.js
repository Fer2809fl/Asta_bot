import fetch from "node-fetch"

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

let handler = async (m, { conn, usedPrefix }) => {
    const rcanal = await getRcanal()
    
    try {
        await m.react('🕒')
        let data = await (await fetch('https://raw.githubusercontent.com/ShirokamiRyzen/WAbot-DB/main/fitur_db/ppcp.json')).json()
        let cita = data[Math.floor(Math.random() * data.length)]
        
        let cowi = await (await fetch(cita.cowo)).buffer()
        await conn.sendMessage(m.chat, {
            image: cowi,
            caption: `> . ﹡ ﹟ ♂️ ׄ ⬭ *ᴍᴀsᴄᴜʟɪɴᴏ*`,
            contextInfo: rcanal
        }, { quoted: m })
        
        let ciwi = await (await fetch(cita.cewe)).buffer()
        await conn.sendMessage(m.chat, {
            image: ciwi,
            caption: `> . ﹡ ﹟ ♀️ ׄ ⬭ *ғᴇᴍᴇɴɪɴᴏ*`,
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

handler.help = ['ppcouple']
handler.tags = ['anime']
handler.command = ['ppcp', 'ppcouple']
handler.group = true
handler.reg = true 

export { handler as default }
