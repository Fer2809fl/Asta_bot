import acrcloud from "acrcloud"
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

const acr = new acrcloud({
    host: "identify-ap-southeast-1.acrcloud.com",
    access_key: "ee1b81b47cf98cd73a0072a761558ab1",
    access_secret: "ya9OPe8onFAnNkyf9xMTK8qRyMGmsghfuHrIMmUI"
})

let handler = async (m, { conn, usedPrefix }) => {
    const rcanal = await getRcanal()
    let q = m.quoted ? m.quoted : m

    if (!q.mimetype || (!q.mimetype.includes("audio") && !q.mimetype.includes("video"))) {
        return conn.sendMessage(m.chat, {
            text: `> . ﹡ ﹟ 🎧 ׄ ⬭ *¡ꜱʜᴀᴢᴀᴍ ᴍᴜꜱɪᴄ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🎧* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴏ* :: ʀᴇꜱᴘᴏɴᴅᴇ ᴀ ᴜɴ ᴀᴜᴅɪᴏ/ᴠɪᴅᴇᴏ
ׅㅤ𓏸𓈒ㅤׄ *ᴄᴏᴍᴀɴᴅᴏꜱ* :: \`#shazam\` \`#whatmusic\`
ׅㅤ𓏸𓈒ㅤׄ *ɴᴏᴛᴀ* :: ɪᴅᴇɴᴛɪꜰɪᴄᴀ ᴄᴜᴀʟǫᴜɪᴇʀ ᴄᴀɴᴄɪᴏ́ɴ

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
            contextInfo: { ...rcanal }
        }, { quoted: m })
    }

    let buffer = await q.download()
    try {
        await m.react('🕒')
        let data = await whatmusic(buffer)

        if (!data.length) {
            await m.react('✖️')
            return conn.sendMessage(m.chat, {
                text: `> . ﹡ ﹟ 🎧 ׄ ⬭ *¡ꜱʜᴀᴢᴀᴍ ᴍᴜꜱɪᴄ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❌* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴇʀʀᴏʀ* :: ɴᴏ ꜱᴇ ɪᴅᴇɴᴛɪꜰɪᴄᴏ́ ʟᴀ ᴄᴀɴᴄɪᴏ́ɴ
ׅㅤ𓏸𓈒ㅤׄ *ꜱᴜɢ* :: ᴜꜱᴀ ᴜɴ ᴀᴜᴅɪᴏ ᴍáꜱ ᴄʟᴀʀᴏ

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
                contextInfo: { ...rcanal }
            }, { quoted: m })
        }

        let cap = `> . ﹡ ﹟ 🎧 ׄ ⬭ *¡ᴄᴀɴᴄɪᴏ́ɴ ɪᴅᴇɴᴛɪꜰɪᴄᴀᴅᴀ!*\n\n`

        for (let result of data) {
            const enlaces = Array.isArray(result.url) ? result.url.filter(x => x) : []
            cap += `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🎵* ㅤ֢ㅤ⸱ㅤᯭִ*\n`
            cap += `ׅㅤ𓏸𓈒ㅤׄ *ᴛíᴛᴜʟᴏ* :: ${result.title}\n`
            cap += `ׅㅤ𓏸𓈒ㅤׄ *ᴀʀᴛɪꜱᴛᴀ* :: ${result.artist}\n`
            cap += `ׅㅤ𓏸𓈒ㅤׄ *ᴅᴜʀᴀᴄɪᴏ́ɴ* :: ${result.duration}\n`
            if (enlaces.length) {
                cap += `\n> ## \`ᴇɴʟᴀᴄᴇꜱ 🔗\`\n\n`
                enlaces.forEach(e => cap += `ׅㅤ𓏸𓈒ㅤׄ ${e}\n`)
            }
        }

        cap += `\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`

        const thumbRes = await fetch('https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1742781294508.jpeg')
        const thumbnailBuffer = Buffer.from(await thumbRes.arrayBuffer())

        await conn.relayMessage(m.chat, {
            extendedTextMessage: {
                text: cap.trim(),
                contextInfo: {
                    externalAdReply: {
                        title: '✧ Whats • Music ✧',
                        body: global.dev,
                        mediaType: 1,
                        previewType: 0,
                        renderLargerThumbnail: true,
                        thumbnail: thumbnailBuffer,
                        sourceUrl: global.redes
                    },
                    ...rcanal
                }
            }
        }, { quoted: m })
        await m.react('✔️')
    } catch (error) {
        await m.react('✖️')
        conn.sendMessage(m.chat, {
            text: `> . ﹡ ﹟ 🎧 ׄ ⬭ *¡ᴇʀʀᴏʀ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❌* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴇʀʀᴏʀ* :: ${error.message}
ׅㅤ𓏸𓈒ㅤׄ *ʀᴇᴘᴏʀᴛ* :: \`${usedPrefix}report\`

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
            contextInfo: { ...rcanal }
        }, { quoted: m })
    }
}

handler.help = ["whatmusic"]
handler.tags = ["tools"]
handler.command = ["whatmusic", "shazam"]
handler.group = true
handler.reg = true

export default handler

async function whatmusic(buffer) {
    let res = await acr.identify(buffer)
    let data = res?.metadata
    if (!data || !Array.isArray(data.music)) return []
    return data.music.map(a => ({
        title: a.title,
        artist: a.artists?.[0]?.name || "Desconocido",
        duration: toTime(a.duration_ms),
        url: Object.keys(a.external_metadata || {}).map(i =>
            i === "youtube" ? "▶️ https://youtu.be/" + a.external_metadata[i].vid :
            i === "deezer" ? "🎵 https://www.deezer.com/us/track/" + a.external_metadata[i].track.id :
            i === "spotify" ? "🟢 https://open.spotify.com/track/" + a.external_metadata[i].track.id : ""
        ).filter(Boolean)
    }))
}

function toTime(ms) {
    if (!ms || typeof ms !== "number") return "00:00"
    let m = Math.floor(ms / 60000)
    let s = Math.floor((ms % 60000) / 1000)
    return [m, s].map(v => v.toString().padStart(2, "0")).join(":")
}
