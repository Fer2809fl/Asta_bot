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

const regex = /^(?:https:\/\/|git@)github\.com\/([^\/]+)\/([^\/]+?)(?:\.git)?$/i

const handler = async (m, { conn, usedPrefix, text }) => {
    const rcanal = await getRcanal()

    if (!text) return conn.sendMessage(m.chat, {
        text: `> . ﹡ ﹟ 🐙 ׄ ⬭ *¡ɢɪᴛᴄʟᴏɴᴇ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🐙* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴏ 1* :: \`#gitclone (url repo)\`
ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴏ 2* :: \`#gitclone (nombre repo)\`
ׅㅤ𓏸𓈒ㅤׄ *ᴇᴊᴇᴍᴘʟᴏ* :: \`#gitclone baileys\`

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
        contextInfo: { ...rcanal }
    }, { quoted: m })

    try {
        await m.react('🕒')
        let info = ''
        let image
        let zipBuffer, zipName
        let repos = []
        const match = text.match(regex)

        if (match) {
            const [, user, repo] = match
            const repoRes = await fetch(`https://api.github.com/repos/${user}/${repo}`)
            const zipRes = await fetch(`https://api.github.com/repos/${user}/${repo}/zipball`)
            const repoData = await repoRes.json()
            zipName = zipRes.headers.get('content-disposition')?.match(/filename=(.*)/)?.[1]
            if (!zipName) zipName = `${repo}-${user}.zip`
            zipBuffer = await zipRes.buffer()
            repos.push(repoData)
            image = 'https://raw.githubusercontent.com/Fer280809/Adiciones/main/Contenido/1745610598914.jpeg'
        } else {
            const res = await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(text)}`)
            const json = await res.json()
            if (!json.items?.length) return conn.sendMessage(m.chat, {
                text: `> . ﹡ ﹟ 🐙 ׄ ⬭ *¡ɢɪᴛᴄʟᴏɴᴇ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❌* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴇʀʀᴏʀ* :: ꜱɪɴ ʀᴇꜱᴜʟᴛᴀᴅᴏꜱ ᴘᴀʀᴀ ᴇꜱᴀ ʙúꜱǫᴜᴇᴅᴀ\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                contextInfo: { ...rcanal }
            }, { quoted: m })
            repos = json.items
            image = await (await fetch(repos[0].owner.avatar_url)).buffer()
        }

        info = repos.map((repo, index) => {
            return `> . ﹡ ﹟ 🐙 ׄ ⬭ *¡ɢɪᴛʜᴜʙ ɪɴꜰᴏ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🐙* ㅤ֢ㅤ⸱ㅤᯭִ*
ׅㅤ𓏸𓈒ㅤׄ *ʀᴇꜱᴜʟᴛᴀᴅᴏ* :: ${index + 1}
ׅㅤ𓏸𓈒ㅤׄ *ᴄʀᴇᴀᴅᴏʀ* :: ${repo.owner.login}
ׅㅤ𓏸𓈒ㅤׄ *ɴᴏᴍʙʀᴇ* :: ${repo.name}
ׅㅤ𓏸𓈒ㅤׄ *ᴄʀᴇᴀᴅᴏ* :: ${formatDate(repo.created_at)}
ׅㅤ𓏸𓈒ㅤׄ *ᴀᴄᴛᴜᴀʟɪᴢᴀᴅᴏ* :: ${formatDate(repo.updated_at)}
ׅㅤ𓏸𓈒ㅤׄ *👁 ᴠɪꜱɪᴛᴀꜱ* :: ${repo.watchers}
ׅㅤ𓏸𓈒ㅤׄ *🍴 ꜰᴏʀᴋꜱ* :: ${repo.forks}
ׅㅤ𓏸𓈒ㅤׄ *⭐ ᴇꜱᴛʀᴇʟʟᴀꜱ* :: ${repo.stargazers_count}
ׅㅤ𓏸𓈒ㅤׄ *🐞 ɪꜱꜱᴜᴇꜱ* :: ${repo.open_issues}
ׅㅤ𓏸𓈒ㅤׄ *ᴅᴇꜱᴄ* :: ${repo.description || 'Sin descripción'}
ׅㅤ𓏸𓈒ㅤׄ *ᴇɴʟᴀᴄᴇ* :: ${repo.clone_url}

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`
        }).join('\n━━━━━━━━━━━━━━\n')

        await conn.sendFile(m.chat, image, 'github_info.jpg', info.trim(), m)
        if (zipBuffer && zipName) await conn.sendFile(m.chat, zipBuffer, zipName, null, m)
        await m.react('✔️')
    } catch (e) {
        await m.react('✖️')
        conn.sendMessage(m.chat, {
            text: `> . ﹡ ﹟ 🐙 ׄ ⬭ *¡ᴇʀʀᴏʀ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❌* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴇʀʀᴏʀ* :: ${e.message}\nׅㅤ𓏸𓈒ㅤׄ *ʀᴇᴘᴏʀᴛ* :: \`${usedPrefix}report\`\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
            contextInfo: { ...rcanal }
        }, { quoted: m })
    }
}

handler.help = ['gitclone']
handler.tags = ['github']
handler.command = ['gitclone']
handler.group = true
handler.reg = true

export default handler

function formatDate(n, locale = 'es') {
    const d = new Date(n)
    return d.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}
