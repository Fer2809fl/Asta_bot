import { exec } from 'child_process'
import fs from 'fs'
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

let handler = async (m, { conn, text, usedPrefix }) => {
    const rcanal = await getRcanal()

    if (!text) return conn.sendMessage(m.chat, {
        text: `> . ﹡ ﹟ 📦 ׄ ⬭ *¡ɴᴘᴍ ᴅᴏᴡɴʟᴏᴀᴅᴇʀ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜📦* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴏ* :: \`#npm (paquete)\`
ׅㅤ𓏸𓈒ㅤׄ *ᴄᴏɴ ᴠᴇʀꜱɪᴏ́ɴ* :: \`#npm (paquete), (versión)\`
ׅㅤ𓏸𓈒ㅤׄ *ᴇᴊᴇᴍᴘʟᴏ* :: \`#npm express, 4.18.0\`
ׅㅤ𓏸𓈒ㅤׄ *ɴᴏᴛᴀ* :: ꜱɪɴ ᴠᴇʀꜱɪᴏ́ɴ = ú ʟᴛɪᴍᴀ

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
        contextInfo: { ...rcanal }
    }, { quoted: m })

    async function npmdownloader(pkg, pkgver) {
        await m.react('🕒')
        const filePath = await new Promise((resolve, reject) => {
            exec(`npm pack ${pkg}@${pkgver}`, (error, stdout) => {
                if (error) { reject(error); return }
                resolve(stdout.trim())
            })
        })
        const fileName = filePath.split('/').pop()
        const data = await fs.promises.readFile(filePath)
        const Link = pkgver === 'latest'
            ? `https://www.npmjs.com/package/${pkg}`
            : `https://www.npmjs.com/package/${pkg}/v/${pkgver}`
        const pkgInfo = await new Promise((resolve, reject) => {
            exec(`npm view ${pkg} description`, (error, stdout) => {
                if (error) { reject('Sin descripción'); return }
                resolve(stdout.trim())
            })
        })
        let caption = `> . ﹡ ﹟ 📦 ׄ ⬭ *¡ᴘᴀǫᴜᴇᴛᴇ ᴅᴇꜱᴄᴀʀɢᴀᴅᴏ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜📦* ㅤ֢ㅤ⸱ㅤᯭִ*
ׅㅤ𓏸𓈒ㅤׄ *ᴘᴀǫᴜᴇᴛᴇ* :: ${fileName}
ׅㅤ𓏸𓈒ㅤׄ *ᴠᴇʀꜱɪᴏ́ɴ* :: ${pkgver}
ׅㅤ𓏸𓈒ㅤׄ *ᴅᴇꜱᴄ* :: ${pkgInfo}
ׅㅤ𓏸𓈒ㅤׄ *ʟɪɴᴋ* :: ${Link}

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`
        await conn.sendMessage(m.chat, {
            document: data,
            mimetype: "application/zip",
            fileName,
            caption: caption.trim(),
            contextInfo: { ...rcanal }
        }, { quoted: m })
        await fs.promises.unlink(filePath)
    }

    try {
        const [pkg, ver] = text.split(",")
        await npmdownloader(pkg.trim(), ver ? ver.trim() : 'latest')
        await m.react('✔️')
    } catch (error) {
        await m.react('✖️')
        conn.sendMessage(m.chat, {
            text: `> . ﹡ ﹟ 📦 ׄ ⬭ *¡ᴇʀʀᴏʀ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❌* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴇʀʀᴏʀ* :: ${error.message}
ׅㅤ𓏸𓈒ㅤׄ *ʀᴇᴘᴏʀᴛ* :: \`${usedPrefix}report\`

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
            contextInfo: { ...rcanal }
        }, { quoted: m })
    }
}

handler.help = ["npmdl"]
handler.tags = ["tools"]
handler.command = ["npmdownloader", "npmjs", "npmdl", "npm"]
handler.reg = true

export default handler
