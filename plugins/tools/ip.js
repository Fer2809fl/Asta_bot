import axios from 'axios'
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

let handler = async (m, { conn, usedPrefix, text }) => {
    const rcanal = await getRcanal()

    if (!text) return conn.sendMessage(m.chat, {
        text: `> . ﹡ ﹟ 🌐 ׄ ⬭ *¡ɪᴘ ʟᴏᴏᴋᴜᴘ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🌐* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴏ* :: \`#ip (dirección)\`
ׅㅤ𓏸𓈒ㅤׄ *ᴇᴊᴇᴍᴘʟᴏ* :: \`#ip 8.8.8.8\`

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
        contextInfo: { ...rcanal }
    }, { quoted: m })

    try {
        await m.react('🕒')
        const res = await axios.get(`http://ip-api.com/json/${text}?fields=status,message,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,isp,org,as,mobile,hosting,query`)
        const d = res.data
        if (String(d.status) !== "success") throw new Error(d.message || "Falló")

        let txt = `> . ﹡ ﹟ 🌐 ׄ ⬭ *¡ɪɴꜰᴏ ɪᴘ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🌐* ㅤ֢ㅤ⸱ㅤᯭִ*
ׅㅤ𓏸𓈒ㅤׄ *ɪᴘ* :: \`${d.query}\`
ׅㅤ𓏸𓈒ㅤׄ *ᴘᴀíꜱ* :: ${d.country} (${d.countryCode})
ׅㅤ𓏸𓈒ㅤׄ *ᴘʀᴏᴠɪɴᴄɪᴀ* :: ${d.regionName} (${d.region})
ׅㅤ𓏸𓈒ㅤׄ *ᴄɪᴜᴅᴀᴅ* :: ${d.city}
ׅㅤ𓏸𓈒ㅤׄ *ᴅɪꜱᴛʀɪᴛᴏ* :: ${d.district || 'N/A'}
ׅㅤ𓏸𓈒ㅤׄ *ᴄ.ᴘ* :: ${d.zip || 'N/A'}
ׅㅤ𓏸𓈒ㅤׄ *ᴢᴏɴᴀ ʜᴏʀᴀʀɪᴀ* :: ${d.timezone}

> ## \`ɪɴꜰᴏ ᴀᴠᴀɴᴢᴀᴅᴀ 🔎\`

ׅㅤ𓏸𓈒ㅤׄ *ɪꜱᴘ* :: ${d.isp}
ׅㅤ𓏸𓈒ㅤׄ *ᴏʀɢᴀɴɪᴢᴀᴄɪᴏ́ɴ* :: ${d.org}
ׅㅤ𓏸𓈒ㅤׄ *ᴀꜱ* :: ${d.as}
ׅㅤ𓏸𓈒ㅤׄ *ᴍᴏʙɪʟᴇ* :: ${d.mobile ? '✅ ꜱí' : '❌ ɴᴏ'}
ׅㅤ𓏸𓈒ㅤׄ *ʜᴏꜱᴛɪɴɢ* :: ${d.hosting ? '✅ ꜱí' : '❌ ɴᴏ'}

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`

        await conn.sendMessage(m.chat, {
            text: txt.trim(),
            contextInfo: { ...rcanal }
        }, { quoted: m })
        await m.react('✔️')
    } catch (error) {
        await m.react('✖️')
        conn.sendMessage(m.chat, {
            text: `> . ﹡ ﹟ 🌐 ׄ ⬭ *¡ᴇʀʀᴏʀ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❌* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴇʀʀᴏʀ* :: ${error.message}
ׅㅤ𓏸𓈒ㅤׄ *ʀᴇᴘᴏʀᴛ* :: \`${usedPrefix}report\`

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
            contextInfo: { ...rcanal }
        }, { quoted: m })
    }
}

handler.help = ['ip <dirección ip>']
handler.tags = ['owner']
handler.command = ['ip']
handler.reg = true

export default handler
