import path from 'path'
import fs from 'fs'
import fetch from 'node-fetch'

const defaultConfig = {
    name: null,
    prefix: null,
    sinprefix: false,
    mode: 'public',
    antiPrivate: false,
    gponly: false,
    antiSpam: true,
    cooldown: 3000,
    logo: null,
    logoUrl: null
}

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

const handler = async (m, { conn, command, usedPrefix, text, args }) => {
    const rcanal = await getRcanal()

    const isSubBot = conn.user?.jid !== global.conn?.user?.jid
    const subBotData = global.activeSubBots?.get(conn.user?.jid)
    const isSubBotOwner = subBotData?.socket?.subConfig?.owner === m.sender
    const isFernando = global.fernando
        ?.map(v => v.replace(/\D/g, "") + "@s.whatsapp.net")
        .includes(m.sender)

    if (!isSubBotOwner && !isFernando) {
        return conn.sendMessage(m.chat, {
            text: `> . ﹡ ﹟ 🔒 ׄ ⬭ *¡ꜱɪɴ ᴘᴇʀᴍɪꜱᴏ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❌* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴇʀʀᴏʀ* :: ꜱᴏʟᴏ ᴇʟ ᴏᴡɴᴇʀ ᴅᴇ ᴇꜱᴛᴇ ꜱᴜʙʙᴏᴛ ᴘᴜᴇᴅᴇ ᴜꜱᴀʀ ᴇꜱᴛᴏ

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
            contextInfo: { ...rcanal }
        }, { quoted: m })
    }

    if (!isSubBot && !['restartbot', 'reiniciarbot', 'cleanbot', 'limpiarbot'].includes(command)) {
        return conn.sendMessage(m.chat, {
            text: `> . ﹡ ﹟ 🤖 ׄ ⬭ *¡ꜱᴏʟᴏ ꜱᴜʙʙᴏᴛ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❌* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴇʀʀᴏʀ* :: ᴇꜱᴛᴇ ᴄᴏᴍᴀɴᴅᴏ ꜱᴏʟᴏ ᴇꜱᴛá ᴅɪꜱᴘᴏɴɪʙʟᴇ ᴘᴀʀᴀ ꜱᴜʙʙᴏᴛꜱ

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
            contextInfo: { ...rcanal }
        }, { quoted: m })
    }

    try {
        const userId = conn.user.jid.split('@')[0]
        const sessionPath = path.join(`./${global.jadi || 'Sessions/SubBot'}/`, userId)
        const configPath = path.join(sessionPath, 'config.json')

        let currentConfig = {}
        try {
            if (fs.existsSync(configPath)) {
                currentConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
            }
        } catch {}

        const displayConfig = { ...defaultConfig, ...currentConfig }

        const saveConfig = (newConfig) => {
            const configToSave = {
                ...currentConfig,
                ...newConfig,
                updatedAt: new Date().toISOString(),
                owner: currentConfig.owner || m.sender,
                createdAt: currentConfig.createdAt || new Date().toISOString(),
                jid: currentConfig.jid || conn.user.jid
            }
            if (!fs.existsSync(sessionPath)) fs.mkdirSync(sessionPath, { recursive: true })
            fs.writeFileSync(configPath, JSON.stringify(configToSave, null, 2))
            if (conn.subConfig) Object.assign(conn.subConfig, configToSave)
            if (global.activeSubBots.has(conn.user.jid)) {
                const entry = global.activeSubBots.get(conn.user.jid)
                if (entry?.socket) entry.socket.subConfig = configToSave
            }
            return configToSave
        }

        const parseBoolean = (val) => {
            if (!val) return null
            if (['on','enable','true','1','si','sí','activar','yes'].includes(val.toLowerCase())) return true
            if (['off','disable','false','0','no','desactivar'].includes(val.toLowerCase())) return false
            return null
        }

        switch (command) {

            // ============= CONFIG =============
            case 'config': {
                if (!args[0]) {
                    return conn.sendMessage(m.chat, {
                        text: `> . ﹡ ﹟ ⚙️ ׄ ⬭ *¡ᴄᴏɴꜰɪɢ ꜱᴜʙʙᴏᴛ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜⚙️* ㅤ֢ㅤ⸱ㅤᯭִ*
ׅㅤ𓏸𓈒ㅤׄ *ɴᴏᴍʙʀᴇ* :: ${displayConfig.name || 'ᴘᴏʀ ᴅᴇꜰᴇᴄᴛᴏ'}
ׅㅤ𓏸𓈒ㅤׄ *ᴘʀᴇꜰɪᴊᴏ* :: ${displayConfig.prefix || 'ɢʟᴏʙᴀʟ'}
ׅㅤ𓏸𓈒ㅤׄ *ꜱɪɴ ᴘʀᴇꜰɪᴊᴏ* :: ${displayConfig.sinprefix ? '✅' : '❌'}
ׅㅤ𓏸𓈒ㅤׄ *ᴍᴏᴅᴏ* :: ${displayConfig.mode === 'private' ? '🔐 ᴘʀɪᴠᴀᴅᴏ' : '🔓 ᴘúʙʟɪᴄᴏ'}
ׅㅤ𓏸𓈒ㅤׄ *ᴀɴᴛɪ-ᴘʀɪᴠᴀᴅᴏ* :: ${displayConfig.antiPrivate ? '✅' : '❌'}
ׅㅤ𓏸𓈒ㅤׄ *ᴀɴᴛɪ-ꜱᴘᴀᴍ* :: ${displayConfig.antiSpam ? '✅' : '❌'}
ׅㅤ𓏸𓈒ㅤׄ *ᴄᴏᴏʟᴅᴏᴡɴ* :: ${displayConfig.cooldown}ᴍꜱ
ׅㅤ𓏸𓈒ㅤׄ *ʟᴏɢᴏ* :: ${displayConfig.logo ? '📁 ʟᴏᴄᴀʟ' : displayConfig.logoUrl ? '🔗 ᴜʀʟ' : '❌ ᴅᴇꜰᴇᴄᴛᴏ'}

> ## \`ᴄᴏᴍᴀɴᴅᴏꜱ ᴅᴇ ᴄᴏɴꜰɪɢ ⚙️\`

ׅㅤ𓏸𓈒ㅤׄ *#config nombre* \`texto\`
ׅㅤ𓏸𓈒ㅤׄ *#config prefix* \`símbolo\`
ׅㅤ𓏸𓈒ㅤׄ *#config sinprefix* \`on/off\`
ׅㅤ𓏸𓈒ㅤׄ *#config modo* \`public/private\`
ׅㅤ𓏸𓈒ㅤׄ *#config logo* \`url/ruta/none\`
ׅㅤ𓏸𓈒ㅤׄ *#config cooldown* \`ms\`
ׅㅤ𓏸𓈒ㅤׄ *#config reset confirmar*

> ## \`ᴀᴄᴄɪᴏɴᴇꜱ ᴅᴇʟ ꜱᴜʙʙᴏᴛ ⚡\`

ׅㅤ𓏸𓈒ㅤׄ *#restartbot* :: ʀᴇɪɴɪᴄɪᴀʀ (ᴍᴀɴᴛɪᴇɴᴇ ᴄᴏɴꜰɪɢ ʏ ꜱᴇꜱɪᴏ́ɴ)
ׅㅤ𓏸𓈒ㅤׄ *#cleanbot* :: ʟɪᴍᴘɪᴀʀ ᴄᴀᴄʜé ʏ ʀᴇɪɴɪᴄɪᴀʀ

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
                        contextInfo: { ...rcanal }
                    }, { quoted: m })
                }

                const action = args[0]?.toLowerCase()
                const value = args.slice(1).join(' ').trim()

                switch (action) {
                    case 'nombre': {
                        if (!value) return conn.sendMessage(m.chat, {
                            text: `> . ﹡ ﹟ ⚙️ ׄ ⬭ *¡ᴇʀʀᴏʀ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❌* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴜsᴏ* :: \`#config nombre NuevoNombre\`\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                            contextInfo: { ...rcanal }
                        }, { quoted: m })
                        const newName = value.slice(0, 25)
                        saveConfig({ name: newName })
                        return conn.sendMessage(m.chat, {
                            text: `> . ﹡ ﹟ ⚙️ ׄ ⬭ *¡ɴᴏᴍʙʀᴇ ᴀᴄᴛᴜᴀʟɪᴢᴀᴅᴏ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜✅* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ɴᴏᴍʙʀᴇ* :: ${newName}\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                            contextInfo: { ...rcanal }
                        }, { quoted: m })
                    }

                    case 'prefix': case 'prefijo': {
                        if (!value) return conn.sendMessage(m.chat, {
                            text: `> . ﹡ ﹟ ⚙️ ׄ ⬭ *¡ᴇʀʀᴏʀ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❌* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴜsᴏ* :: \`#config prefix .\`\nׅㅤ𓏸𓈒ㅤׄ *ʀᴇꜱᴇᴛ* :: \`#config prefix reset\`\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                            contextInfo: { ...rcanal }
                        }, { quoted: m })
                        if (['reset', 'default', 'none'].includes(value.toLowerCase())) {
                            saveConfig({ prefix: null })
                            return conn.sendMessage(m.chat, {
                                text: `> . ﹡ ﹟ ⚙️ ׄ ⬭ *¡ᴘʀᴇꜰɪᴊᴏ ʀᴇɪɴɪᴄɪᴀᴅᴏ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜✅* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴘʀᴇꜰɪᴊᴏ* :: ᴜꜱᴀɴᴅᴏ ɢʟᴏʙᴀʟ\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                                contextInfo: { ...rcanal }
                            }, { quoted: m })
                        }
                        const newPrefix = value.charAt(0)
                        if (/[a-zA-Z0-9]/.test(newPrefix)) return conn.sendMessage(m.chat, {
                            text: `> . ﹡ ﹟ ⚙️ ׄ ⬭ *¡ᴇʀʀᴏʀ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❌* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴇʀʀᴏʀ* :: ɴᴏ ᴜꜱᴇꜱ ʟᴇᴛʀᴀꜱ ᴏ ɴúᴍᴇʀᴏꜱ\nׅㅤ𓏸𓈒ㅤׄ *ᴇᴊᴇᴍᴘʟᴏꜱ* :: \`. ! # /\`\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                            contextInfo: { ...rcanal }
                        }, { quoted: m })
                        saveConfig({ prefix: newPrefix })
                        return conn.sendMessage(m.chat, {
                            text: `> . ﹡ ﹟ ⚙️ ׄ ⬭ *¡ᴘʀᴇꜰɪᴊᴏ ᴀᴄᴛᴜᴀʟɪᴢᴀᴅᴏ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜✅* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴘʀᴇꜰɪᴊᴏ* :: \`${newPrefix}\`\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                            contextInfo: { ...rcanal }
                        }, { quoted: m })
                    }

                    case 'sinprefix': case 'sinprefijo': {
                        const bool = parseBoolean(value)
                        if (bool === null) return conn.sendMessage(m.chat, {
                            text: `> . ﹡ ﹟ ⚙️ ׄ ⬭ *¡ᴇʀʀᴏʀ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❌* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴜsᴏ* :: \`#config sinprefix on/off\`\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                            contextInfo: { ...rcanal }
                        }, { quoted: m })
                        saveConfig({ sinprefix: bool })
                        return conn.sendMessage(m.chat, {
                            text: `> . ﹡ ﹟ ⚙️ ׄ ⬭ *¡ᴀᴄᴛᴜᴀʟɪᴢᴀᴅᴏ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜${bool ? '✅' : '❌'}* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ꜱɪɴ ᴘʀᴇꜰɪᴊᴏ* :: ${bool ? 'ᴀᴄᴛɪᴠᴀᴅᴏ ✅\n_ᴇꜱᴄʀɪʙᴇ ᴇʟ ᴄᴏᴍᴀɴᴅᴏ ꜱɪɴ ᴘʀᴇꜰɪᴊᴏ_' : 'ᴅᴇꜱᴀᴄᴛɪᴠᴀᴅᴏ ❌'}\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                            contextInfo: { ...rcanal }
                        }, { quoted: m })
                    }

                    case 'modo': {
                        if (!['public', 'private'].includes(value?.toLowerCase())) return conn.sendMessage(m.chat, {
                            text: `> . ﹡ ﹟ ⚙️ ׄ ⬭ *¡ᴇʀʀᴏʀ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❌* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴜsᴏ* :: \`#config modo public/private\`\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                            contextInfo: { ...rcanal }
                        }, { quoted: m })
                        saveConfig({ mode: value.toLowerCase() })
                        return conn.sendMessage(m.chat, {
                            text: `> . ﹡ ﹟ ⚙️ ׄ ⬭ *¡ᴍᴏᴅᴏ ᴀᴄᴛᴜᴀʟɪᴢᴀᴅᴏ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜✅* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴍᴏᴅᴏ* :: ${value.toLowerCase() === 'private' ? '🔐 ᴘʀɪᴠᴀᴅᴏ' : '🔓 ᴘúʙʟɪᴄᴏ'}\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                            contextInfo: { ...rcanal }
                        }, { quoted: m })
                    }

                    case 'logo': case 'icono': case 'foto': {
                        if (!value || ['none','default','remove','quitar','eliminar'].includes(value.toLowerCase())) {
                            saveConfig({ logo: null, logoUrl: null })
                            return conn.sendMessage(m.chat, {
                                text: `> . ﹡ ﹟ ⚙️ ׄ ⬭ *¡ʟᴏɢᴏ ᴇʟɪᴍɪɴᴀᴅᴏ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜✅* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ʟᴏɢᴏ* :: ᴜꜱᴀɴᴅᴏ ᴘᴏʀ ᴅᴇꜰᴇᴄᴛᴏ\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                                contextInfo: { ...rcanal }
                            }, { quoted: m })
                        }
                        const isUrl = value.startsWith('http://') || value.startsWith('https://')
                        if (isUrl) {
                            saveConfig({ logo: null, logoUrl: value })
                            return conn.sendMessage(m.chat, {
                                text: `> . ﹡ ﹟ ⚙️ ׄ ⬭ *¡ʟᴏɢᴏ ᴜʀʟ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜✅* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ʟᴏɢᴏ* :: 🔗 ᴜʀʟ ɢᴜᴀʀᴅᴀᴅᴀ\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                                contextInfo: { ...rcanal }
                            }, { quoted: m })
                        }
                        const logoPath = path.resolve(value)
                        if (!fs.existsSync(logoPath)) return conn.sendMessage(m.chat, {
                            text: `> . ﹡ ﹟ ⚙️ ׄ ⬭ *¡ᴀʀᴄʜɪᴠᴏ ɴᴏ ᴇɴᴄᴏɴᴛʀᴀᴅᴏ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❌* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ʀᴜᴛᴀ* :: ${value}\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                            contextInfo: { ...rcanal }
                        }, { quoted: m })
                        saveConfig({ logo: value, logoUrl: null })
                        return conn.sendMessage(m.chat, {
                            text: `> . ﹡ ﹟ ⚙️ ׄ ⬭ *¡ʟᴏɢᴏ ʟᴏᴄᴀʟ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜✅* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ʟᴏɢᴏ* :: 📁 ${value}\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                            contextInfo: { ...rcanal }
                        }, { quoted: m })
                    }

                    case 'cooldown': case 'cd': {
                        const ms = parseInt(value)
                        if (isNaN(ms) || ms < 0 || ms > 60000) return conn.sendMessage(m.chat, {
                            text: `> . ﹡ ﹟ ⚙️ ׄ ⬭ *¡ᴇʀʀᴏʀ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❌* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴜsᴏ* :: \`#config cooldown 0-60000\`\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                            contextInfo: { ...rcanal }
                        }, { quoted: m })
                        saveConfig({ cooldown: ms })
                        return conn.sendMessage(m.chat, {
                            text: `> . ﹡ ﹟ ⚙️ ׄ ⬭ *¡ᴄᴏᴏʟᴅᴏᴡɴ ᴀᴄᴛᴜᴀʟɪᴢᴀᴅᴏ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜✅* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴄᴏᴏʟᴅᴏᴡɴ* :: ${ms}ᴍꜱ\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                            contextInfo: { ...rcanal }
                        }, { quoted: m })
                    }

                    case 'reset': {
                        const confirm = args[1]?.toLowerCase()
                        if (confirm !== 'confirmar' && confirm !== 'si') return conn.sendMessage(m.chat, {
                            text: `> . ﹡ ﹟ ⚙️ ׄ ⬭ *¡ᴄᴏɴꜰɪʀᴍᴀ ᴇʟ ʀᴇꜱᴇᴛ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜⚠️* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴀᴠɪꜱᴏ* :: ᴇꜱᴛᴏ ʀᴇɪɴɪᴄɪᴀ ᴛᴏᴅᴀ ʟᴀ ᴄᴏɴꜰɪɢᴜʀᴀᴄɪᴏ́ɴ\nׅㅤ𓏸𓈒ㅤׄ *ᴄᴏɴꜰɪʀᴍᴀʀ* :: \`#config reset confirmar\`\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                            contextInfo: { ...rcanal }
                        }, { quoted: m })
                        const essentialData = {
                            owner: currentConfig.owner || m.sender,
                            createdAt: currentConfig.createdAt || new Date().toISOString(),
                            jid: currentConfig.jid || conn.user.jid,
                            ...defaultConfig
                        }
                        fs.writeFileSync(configPath, JSON.stringify(essentialData, null, 2))
                        if (conn.subConfig) Object.assign(conn.subConfig, essentialData)
                        return conn.sendMessage(m.chat, {
                            text: `> . ﹡ ﹟ ⚙️ ׄ ⬭ *¡ᴄᴏɴꜰɪɢ ʀᴇɪɴɪᴄɪᴀᴅᴀ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🔄* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴇꜱᴛᴀᴅᴏ* :: ᴛᴏᴅᴏꜱ ʟᴏꜱ ᴠᴀʟᴏʀᴇꜱ ʀᴇꜱᴛᴀʙʟᴇᴄɪᴅᴏꜱ\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                            contextInfo: { ...rcanal }
                        }, { quoted: m })
                    }

                    default:
                        return conn.sendMessage(m.chat, {
                            text: `> . ﹡ ﹟ ⚙️ ׄ ⬭ *¡ᴏᴘᴄɪᴏ́ɴ ᴅᴇꜱᴄᴏɴᴏᴄɪᴅᴀ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❌* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴏᴘᴄɪᴏ́ɴ* :: \`${action}\` ɴᴏ ᴇxɪꜱᴛᴇ\nׅㅤ𓏸𓈒ㅤׄ *ᴠᴇʀ ᴏᴘᴄɪᴏɴᴇꜱ* :: \`#config\`\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                            contextInfo: { ...rcanal }
                        }, { quoted: m })
                }
            }

            // ============= RESTART BOT (sin borrar config ni sesión) =============
            case 'restartbot': case 'reiniciarbot': {
                await conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ 🔄 ׄ ⬭ *¡ʀᴇɪɴɪᴄɪᴀɴᴅᴏ ꜱᴜʙʙᴏᴛ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🔄* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴇꜱᴛᴀᴅᴏ* :: ʀᴇɪɴɪᴄɪᴀɴᴅᴏ ᴄᴏɴᴇxɪᴏ́ɴ...
ׅㅤ𓏸𓈒ㅤׄ *ꜱᴇꜱɪᴏ́ɴ* :: ꜱᴇ ᴍᴀɴᴛɪᴇɴᴇ ✅
ׅㅤ𓏸𓈒ㅤׄ *ᴄᴏɴꜰɪɢ* :: ꜱᴇ ᴍᴀɴᴛɪᴇɴᴇ ✅
ׅㅤ𓏸𓈒ㅤׄ *ᴛɪᴇᴍᴘᴏ* :: ~5 ꜱᴇɢᴜɴᴅᴏꜱ ⏳

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
                    contextInfo: { ...rcanal }
                }, { quoted: m })

                const savedConfigBeforeRestart = { ...currentConfig }

                try {
                    const subEntry = global.activeSubBots.get(conn.user.jid)
                    if (subEntry?.socket) {
                        const subSock = subEntry.socket
                        subSock.ev.removeAllListeners()
                        if (subSock.ws?.readyState === 1) subSock.ws.close()
                        const idx = global.conns.indexOf(subSock)
                        if (idx > -1) global.conns.splice(idx, 1)
                        global.activeSubBots.delete(conn.user.jid)
                    }
                } catch {}

                await new Promise(r => setTimeout(r, 2000))

                const { AstaJadiBot } = await import('./serbot.js')
                await AstaJadiBot({
                    pathAstaJadiBot: sessionPath,
                    m,
                    conn: global.conn,
                    args: [],
                    usedPrefix,
                    command: 'qr',
                    userId,
                    maxReconnectAttempts: 5,
                    isReconnect: false,
                    isAutoStart: true,
                    savedConfig: savedConfigBeforeRestart
                })
                break
            }

            // ============= CLEAN BOT (limpiar caché + reiniciar) =============
            case 'cleanbot': case 'limpiarbot': {
                await conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ 🧹 ׄ ⬭ *¡ʟɪᴍᴘɪᴀɴᴅᴏ ᴄᴀᴄʜé!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🧹* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴘᴀꜱᴏ 1* :: ᴇʟɪᴍɪɴᴀɴᴅᴏ ᴄᴀᴄʜé ᴅᴇ ᴄʟᴀᴠᴇꜱ...
ׅㅤ𓏸𓈒ㅤׄ *ᴘᴀꜱᴏ 2* :: ʀᴇɪɴɪᴄɪᴀɴᴅᴏ ᴄᴏɴᴇxɪᴏ́ɴ...
ׅㅤ𓏸𓈒ㅤׄ *ꜱᴇꜱɪᴏ́ɴ* :: ꜱᴇ ᴍᴀɴᴛɪᴇɴᴇ ✅
ׅㅤ𓏸𓈒ㅤׄ *ᴄᴏɴꜰɪɢ* :: ꜱᴇ ᴍᴀɴᴛɪᴇɴᴇ ✅
ׅㅤ𓏸𓈒ㅤׄ *ᴛɪᴇᴍᴘᴏ* :: ~10 ꜱᴇɢᴜɴᴅᴏꜱ ⏳

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
                    contextInfo: { ...rcanal }
                }, { quoted: m })

                const savedConfigBeforeClean = { ...currentConfig }

                try {
                    const subEntry = global.activeSubBots.get(conn.user.jid)
                    if (subEntry?.socket) {
                        const subSock = subEntry.socket
                        subSock.ev.removeAllListeners()
                        if (subSock.ws?.readyState === 1) subSock.ws.close()
                        const idx = global.conns.indexOf(subSock)
                        if (idx > -1) global.conns.splice(idx, 1)
                        global.activeSubBots.delete(conn.user.jid)
                    }
                } catch {}

                // Borrar caché de claves (los que hacen al bot lento)
                const filesToDelete = [
                    'pre-key-store.json',
                    'sender-key-store.json',
                    'session-store.json',
                    'app-state-sync-key-store.json',
                    'store.json'
                ]
                for (const f of filesToDelete) {
                    try {
                        const fp = path.join(sessionPath, f)
                        if (fs.existsSync(fp)) fs.unlinkSync(fp)
                    } catch {}
                }
                // Archivos tmp y log
                try {
                    const allFiles = fs.readdirSync(sessionPath)
                    for (const f of allFiles) {
                        if (f.endsWith('.tmp') || f.endsWith('.log')) {
                            try { fs.unlinkSync(path.join(sessionPath, f)) } catch {}
                        }
                    }
                } catch {}

                await new Promise(r => setTimeout(r, 3000))

                const { AstaJadiBot: AJB } = await import('./serbot.js')
                await AJB({
                    pathAstaJadiBot: sessionPath,
                    m,
                    conn: global.conn,
                    args: [],
                    usedPrefix,
                    command: 'qr',
                    userId,
                    maxReconnectAttempts: 5,
                    isReconnect: false,
                    isAutoStart: true,
                    savedConfig: savedConfigBeforeClean
                })
                break
            }

            // ============= ANTI PRIVADO =============
            case 'antiprivado': case 'antiprivate': {
                const bool = parseBoolean(text || args[0])
                if (bool === null) return conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ 🚫 ׄ ⬭ *¡ᴀɴᴛɪ-ᴘʀɪᴠᴀᴅᴏ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🚫* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴇꜱᴛᴀᴅᴏ* :: ${displayConfig.antiPrivate ? '✅ ᴀᴄᴛɪᴠᴀᴅᴏ' : '❌ ᴅᴇꜱᴀᴄᴛɪᴠᴀᴅᴏ'}\nׅㅤ𓏸𓈒ㅤׄ *ᴀᴄᴛɪᴠᴀʀ* :: \`#antiprivado on\`\nׅㅤ𓏸𓈒ㅤׄ *ᴅᴇꜱᴀᴄᴛɪᴠᴀʀ* :: \`#antiprivado off\`\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                    contextInfo: { ...rcanal }
                }, { quoted: m })
                saveConfig({ antiPrivate: bool })
                return conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ 🚫 ׄ ⬭ *¡ᴀɴᴛɪ-ᴘʀɪᴠᴀᴅᴏ ${bool ? 'ᴀᴄᴛɪᴠᴀᴅᴏ' : 'ᴅᴇꜱᴀᴄᴛɪᴠᴀᴅᴏ'}!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜${bool ? '✅' : '❌'}* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴇꜱᴛᴀᴅᴏ* :: ${bool ? '🔒 ꜱᴏʟᴏ ᴏᴡɴᴇʀ ᴇɴ ᴘʀɪᴠᴀᴅᴏ' : '🔓 ᴛᴏᴅᴏꜱ ᴘᴜᴇᴅᴇɴ ᴇꜱᴄʀɪʙɪʀ'}\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                    contextInfo: { ...rcanal }
                }, { quoted: m })
            }

            // ============= ANTI SPAM =============
            case 'antispam': case 'antiflood': {
                const bool = parseBoolean(text || args[0])
                if (bool === null) return conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ 🛡️ ׄ ⬭ *¡ᴀɴᴛɪ-ꜱᴘᴀᴍ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🛡️* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴇꜱᴛᴀᴅᴏ* :: ${displayConfig.antiSpam ? '✅ ᴀᴄᴛɪᴠᴀᴅᴏ' : '❌ ᴅᴇꜱᴀᴄᴛɪᴠᴀᴅᴏ'}\nׅㅤ𓏸𓈒ㅤׄ *ᴄᴏᴏʟᴅᴏᴡɴ* :: ${displayConfig.cooldown}ᴍꜱ\nׅㅤ𓏸𓈒ㅤׄ *ᴀᴄᴛɪᴠᴀʀ* :: \`#antispam on\`\nׅㅤ𓏸𓈒ㅤׄ *ᴅᴇꜱᴀᴄᴛɪᴠᴀʀ* :: \`#antispam off\`\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                    contextInfo: { ...rcanal }
                }, { quoted: m })
                saveConfig({ antiSpam: bool })
                return conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ 🛡️ ׄ ⬭ *¡ᴀɴᴛɪ-ꜱᴘᴀᴍ ${bool ? 'ᴀᴄᴛɪᴠᴀᴅᴏ' : 'ᴅᴇꜱᴀᴄᴛɪᴠᴀᴅᴏ'}!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜${bool ? '✅' : '❌'}* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴇꜱᴛᴀᴅᴏ* :: ${bool ? `🛡️ ᴘʀᴏᴛᴇᴄᴄɪᴏ́ɴ ᴀᴄᴛɪᴠᴀ (${displayConfig.cooldown}ᴍꜱ)` : '⚠️ ꜱɪɴ ᴘʀᴏᴛᴇᴄᴄɪᴏ́ɴ ᴀɴᴛɪ-ꜱᴘᴀᴍ'}\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                    contextInfo: { ...rcanal }
                }, { quoted: m })
            }

            default:
                return conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ ❌ ׄ ⬭ *¡ᴄᴏᴍᴀɴᴅᴏ ᴅᴇꜱᴄᴏɴᴏᴄɪᴅᴏ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❌* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴠᴇʀ ᴄᴏᴍᴀɴᴅᴏꜱ* :: \`#config\`\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                    contextInfo: { ...rcanal }
                }, { quoted: m })
        }

    } catch (error) {
        console.error('Error en sockets.js:', error)
        return conn.sendMessage(m.chat, {
            text: `> . ﹡ ﹟ ❌ ׄ ⬭ *¡ᴇʀʀᴏʀ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❌* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴇʀʀᴏʀ* :: ${error.message}\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
            contextInfo: { ...rcanal }
        }, { quoted: m })
    }
}

handler.help = ['config', 'restartbot', 'cleanbot', 'antiprivado', 'antispam']
handler.tags = ['serbot', 'owner']
handler.command = ['config', 'antiprivado', 'antiprivate', 'antispam', 'antiflood', 'restartbot', 'reiniciarbot', 'cleanbot', 'limpiarbot']
handler.group = false
handler.private = false

export default handler