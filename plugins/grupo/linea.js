import axios from "axios"

let handler = async (m, { conn, args, usedPrefix }) => {
    const pp = await conn.profilePictureUrl(m.chat, 'image').catch((_) => 'https://files.catbox.moe/xr2m6u.jpg')
    
    try {
        let id = args?.[0]?.match(/\d+\-\d+@g.us/) || m.chat
        const participantesUnicos = Object.values(conn.chats[id]?.messages || {})
            .map((item) => item.key.participant)
            .filter((value, index, self) => self.indexOf(value) === index)
        
        const participantesOrdenados = participantesUnicos
            .filter(participante => participante)
            .sort((a, b) => {
                if (a && b) {
                    return a.split("@")[0].localeCompare(b.split("@")[0])
                }
                return 0
            })
        
        const listaEnLinea = participantesOrdenados
            .map((k) => `ׅㅤ𓏸𓈒ㅤׄ 🟢 @${k.split("@")[0]}`)
            .join("\n") || `ׅㅤ𓏸𓈒ㅤׄ 📭 No hay usuarios en línea`

        await conn.sendMessage(m.chat, { 
            image: { url: pp }, 
            caption: 
                `> . ﹡ ﹟ 🟢 ׄ ⬭ *ᴜsᴜᴀʀɪᴏs ᴇɴ ʟɪ́ɴᴇᴀ*\n\n` +
                `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 📊 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
                `ׅㅤ𓏸𓈒ㅤׄ *ɢʀᴜᴘᴏ* :: ${await conn.getName(m.chat)}\n` +
                `ׅㅤ𓏸𓈒ㅤׄ *ᴛᴏᴛᴀʟ* :: ${participantesOrdenados.length} usuarios\n\n` +
                `> ✦ *ʟɪsᴛᴀ* ::\n${listaEnLinea}\n\n` +
                `> ✧ *ᴅᴇᴠ* :: ${global.dev || 'ᴀsᴛᴀ-ʙᴏᴛ'}`, 
            contextInfo: { mentionedJid: participantesOrdenados }
        }, { quoted: m })
        
    } catch (error) {
        await m.reply(
            `> . ﹡ ﹟ ❌ ׄ ⬭ *ᴇʀʀᴏʀ*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ ⚠️ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴅᴇᴛᴀʟʟᴇ* :: ${error.message}\n\n` +
            `> ✦ *ʀᴇᴘᴏʀᴛᴀʀ* :: ${usedPrefix}report`)
    }
}

handler.help = ["listonline"]
handler.tags = ["owner"]
handler.command = ["listonline", "online", "linea", "enlinea"]
handler.group = true

export default handler
