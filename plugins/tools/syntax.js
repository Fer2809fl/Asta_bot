import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import fetch from 'node-fetch'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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

var handler = async (m, { usedPrefix }) => {
    const rcanal = await getRcanal()
    try {
        await m.react('🕒')
        conn.sendPresenceUpdate('composing', m.chat)

        const baseDir = process.cwd()
        const pluginsDir = path.join(baseDir, 'plugins')

        if (!fs.existsSync(pluginsDir)) {
            return conn.sendMessage(m.chat, {
                text: `> . ﹡ ﹟ 🔍 ׄ ⬭ *¡ꜱʏɴᴛᴀx ᴄʜᴇᴄᴋ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❌* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴇʀʀᴏʀ* :: ᴄᴀʀᴘᴇᴛᴀ \`plugins\` ɴᴏ ᴇɴᴄᴏɴᴛʀᴀᴅᴀ
ׅㅤ𓏸𓈒ㅤׄ *ᴅɪʀᴇᴄᴛᴏʀɪᴏ* :: ${baseDir}

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
                contextInfo: { ...rcanal }
            }, { quoted: m })
        }

        function getAllJSFiles(dir, baseDir = dir) {
            let results = []
            try {
                const items = fs.readdirSync(dir)
                for (const item of items) {
                    const fullPath = path.join(dir, item)
                    const relativePath = path.relative(baseDir, fullPath)
                    try {
                        const stat = fs.statSync(fullPath)
                        if (stat.isDirectory()) {
                            if (!item.includes('node_modules') && !item.startsWith('.') && item !== 'tmp' && item !== 'temp') {
                                results = results.concat(getAllJSFiles(fullPath, baseDir))
                            }
                        } else if (stat.isFile() && item.endsWith('.js')) {
                            results.push({ fullPath, relativePath, fileName: item })
                        }
                    } catch {}
                }
            } catch (e) { console.error(`Error al leer ${dir}:`, e.message) }
            return results
        }

        const allFiles = getAllJSFiles(pluginsDir)
        const totalFiles = allFiles.length

        if (totalFiles === 0) {
            return conn.sendMessage(m.chat, {
                text: `> . ﹡ ﹟ 🔍 ׄ ⬭ *¡ꜱʏɴᴛᴀx ᴄʜᴇᴄᴋ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❌* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴇʀʀᴏʀ* :: ꜱɪɴ ᴀʀᴄʜɪᴠᴏꜱ .js ᴇɴᴄᴏɴᴛʀᴀᴅᴏꜱ\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                contextInfo: { ...rcanal }
            }, { quoted: m })
        }

        await m.react('🔍')

        let hasErrors = false
        let filesWithErrors = 0
        let errorsText = ''
        let filesChecked = 0

        for (const fileInfo of allFiles) {
            filesChecked++
            const { fullPath, relativePath } = fileInfo
            const displayPath = `plugins/${relativePath}`
            if (filesChecked % 10 === 0) conn.sendPresenceUpdate('composing', m.chat)
            try {
                let importPath = path.isAbsolute(fullPath) ? fullPath : path.resolve(fullPath)
                await import(`file://${importPath}`)
            } catch (error) {
                hasErrors = true
                filesWithErrors++
                let errorMsg = error.message
                if (errorMsg.length > 120) errorMsg = errorMsg.substring(0, 120) + '...'
                errorMsg = errorMsg.replace(process.cwd(), '').replace(__dirname, '')
                errorsText += `ׅㅤ𓏸𓈒ㅤׄ *❌ ${displayPath}*\n_↳ ${errorMsg}_\n\n`
            }
        }

        const statusEmoji = hasErrors ? '⚠️' : '✅'
        let response = `> . ﹡ ﹟ 🔍 ׄ ⬭ *¡ꜱʏɴᴛᴀx ᴄʜᴇᴄᴋ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🔍* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴛᴏᴛᴀʟ ᴀʀᴄʜɪᴠᴏꜱ* :: ${totalFiles}
ׅㅤ𓏸𓈒ㅤׄ *ᴠᴇʀɪꜰɪᴄᴀᴅᴏꜱ* :: ${filesChecked}
ׅㅤ𓏸𓈒ㅤׄ *ᴄᴏɴ ᴇʀʀᴏʀᴇꜱ* :: ${filesWithErrors}
ׅㅤ𓏸𓈒ㅤׄ *ꜱɪɴ ᴇʀʀᴏʀᴇꜱ* :: ${totalFiles - filesWithErrors}
ׅㅤ𓏸𓈒ㅤׄ *ᴇꜱᴛᴀᴅᴏ* :: ${statusEmoji} ${hasErrors ? 'ꜱᴇ ᴇɴᴄᴏɴᴛʀᴀʀᴏɴ ᴇʀʀᴏʀᴇꜱ' : '¡ᴛᴏᴅᴏ ᴄᴏʀʀᴇᴄᴛᴏ!'}

> ## \`ᴅᴇᴛᴀʟʟᴇꜱ ${hasErrors ? '⚠️' : '✅'}\`

${hasErrors ? errorsText : 'ׅㅤ𓏸𓈒ㅤׄ *✅ ᴛᴏᴅᴏꜱ ʟᴏꜱ ᴀʀᴄʜɪᴠᴏꜱ ᴇꜱᴛáɴ ʟɪᴍᴘɪᴏꜱ* 🎉'}
> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`

        if (response.length > 3500) {
            const parts = []
            let current = ''
            for (const line of response.split('\n')) {
                if ((current + line + '\n').length > 3500) {
                    parts.push(current)
                    current = line + '\n'
                } else {
                    current += line + '\n'
                }
            }
            if (current) parts.push(current)
            for (let i = 0; i < parts.length; i++) {
                await conn.sendMessage(m.chat, {
                    text: `${parts[i].trim()}\n\n_[ᴘᴀʀᴛᴇ ${i + 1}/${parts.length}]_`,
                    contextInfo: { ...rcanal }
                }, { quoted: m })
                await new Promise(r => setTimeout(r, 500))
            }
        } else {
            await conn.sendMessage(m.chat, {
                text: response.trim(),
                contextInfo: { ...rcanal }
            }, { quoted: m })
        }

        await m.react(hasErrors ? '⚠️' : '✅')
    } catch (err) {
        await m.react('💥')
        conn.sendMessage(m.chat, {
            text: `> . ﹡ ﹟ 🔍 ׄ ⬭ *¡ᴇʀʀᴏʀ ᴄʀíᴛɪᴄᴏ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜💥* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴇʀʀᴏʀ* :: ${err.message}
ׅㅤ𓏸𓈒ㅤׄ *ᴛɪᴘᴏ* :: ${err.name}
ׅㅤ𓏸𓈒ㅤׄ *ʀᴇᴘᴏʀᴛ* :: \`${usedPrefix}report\`

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
            contextInfo: { ...rcanal }
        }, { quoted: m })
    }
}

handler.command = ['syntax', 'detectar', 'errores', 'syntaxcheck', 'check', 'verificar']
handler.help = ['syntax']
handler.tags = ['tools']
handler.rowner = true
handler.reg = true

export default handler
