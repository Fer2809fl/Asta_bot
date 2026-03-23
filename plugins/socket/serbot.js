const { useMultiFileAuthState, DisconnectReason, makeCacheableSignalKeyStore, fetchLatestBaileysVersion } = (await import("@whiskeysockets/baileys"))
import qrcode from "qrcode"
import NodeCache from "node-cache"
import fs from "fs"
import path from "path"
import pino from 'pino'
import chalk from 'chalk'
import * as ws from 'ws'
import { makeWASocket } from '../../lib/simple.js'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const imagenSerBot = 'https://files.catbox.moe/gptlxc.jpg'

let rtx = `╭─〔 💻 𝘼𝙎𝙏𝘼 𝘽𝙊𝙏 • 𝙈𝙊𝘿𝙊 𝙌𝙍 〕─╮
│
│  📲 Escanea este *QR* desde otro celular o PC
│  para convertirte en un *Sub-Bot Temporal* de Asta.
│
│  1️⃣  Pulsa los ⋮ tres puntos arriba a la derecha
│  2️⃣  Ve a *Dispositivos vinculados*
│  3️⃣  Escanea el QR y ¡listo! ⚡
│
│  ⏳  *Expira en 45 segundos.*
╰───────────────────────`

let rtx2 = `╭─[ 💻 𝘼𝙎𝙏𝘼 𝘽𝙊𝙏 • 𝙈𝙊𝘿𝙊 𝘾𝙊𝘿𝙀 ]─╮
│
│  🧠  Este es el *Modo CODE* de Asta Bot.
│  Ingresa el código desde otro celular o PC
│  para convertirte en un *Sub-Bot Temporal*.
│
│  1️⃣  Pulsa los ⋮ tres puntos arriba a la derecha
│  2️⃣  Entra en *Dispositivos vinculados*
│  3️⃣  Selecciona *Vincular con código de 8 dígitos*
│  4️⃣  Ingresa el código que aparecerá a continuación
│
│  ⏳  *Expira en 45 segundos.*
╰────────────────────────╯`

// ============= INICIALIZAR VARIABLES GLOBALES =============
if (!global.conns || !Array.isArray(global.conns)) {
    global.conns = []
}
if (!global.activeSubBots) global.activeSubBots = new Map()
if (!global.subBotsData) global.subBotsData = new Map()
if (!global.subBotReconnectAttempts) global.subBotReconnectAttempts = new Map()
if (!global.sentCodes) global.sentCodes = new Map()

// ============= FUNCIÓN PARA VERIFICAR CONEXIÓN =============
function isSubBotConnected(jid) {
    if (!global.conns || !Array.isArray(global.conns)) return false
    const targetJid = jid.split("@")[0]

    return global.conns.some(sock => {
        try {
            if (!sock || !sock.user || !sock.user.jid) return false
            const sockId = sock.user.jid.split("@")[0]
            const isMatch = sockId === targetJid
            const isConnected = sock.ws && (sock.ws.readyState === 1 || sock.ws.readyState === 0)
            return isMatch && isConnected
        } catch (e) {
            return false
        }
    })
}

// ============= AUTO-INICIO AL ARRANCAR =============
export async function autoStartSubBots() {
    const subBotFolder = global.supConfig?.folder || global.jadi || 'Sessions/SubBot'
    if (!fs.existsSync(subBotFolder)) return

    const sessions = fs.readdirSync(subBotFolder).filter(f => {
        const fullPath = path.join(subBotFolder, f)
        return fs.statSync(fullPath).isDirectory() &&
               fs.existsSync(path.join(fullPath, 'creds.json'))
    })

    if (!sessions.length) {
        console.log(chalk.gray('📭 Sin subbots guardados.'))
        return
    }

    console.log(chalk.cyan(`\n🔄 Restaurando ${sessions.length} subbot(s)...`))

    for (const userId of sessions) {
        try {
            const sessionPath = path.join(subBotFolder, userId)
            const configPath = path.join(sessionPath, 'config.json')
            let savedConfig = {}
            if (fs.existsSync(configPath)) {
                savedConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
            }
            await cleanSubBotCache(sessionPath)
            console.log(chalk.blue(`  ↳ Iniciando: ${userId}`))
            await AstaJadiBot({
                pathAstaJadiBot: sessionPath,
                m: null,
                conn: global.conn,
                args: [],
                usedPrefix: global.prefox || '#',
                command: 'qr',
                userId,
                maxReconnectAttempts: 5,
                isReconnect: false,
                isAutoStart: true,
                savedConfig
            })
            await new Promise(r => setTimeout(r, 2000))
        } catch (e) {
            console.error(chalk.red(`  ✖ Error restaurando ${userId}: ${e.message}`))
        }
    }
}

// ============= LIMPIEZA DE CACHÉ =============
export async function cleanSubBotCache(sessionPath) {
    try {
        const filesToClean = [
            'pre-key-store.json', 'sender-key-store.json',
            'session-store.json', 'app-state-sync-key-store.json'
        ]
        for (const file of filesToClean) {
            const fp = path.join(sessionPath, file)
            if (!fs.existsSync(fp)) continue
            try {
                const data = JSON.parse(fs.readFileSync(fp, 'utf-8'))
                const cutoff = Date.now() - 48 * 60 * 60 * 1000
                let changed = false
                if (typeof data === 'object' && data !== null) {
                    for (const key of Object.keys(data)) {
                        if (data[key]?.timestamp && data[key].timestamp < cutoff) {
                            delete data[key]; changed = true
                        }
                    }
                    if (changed) fs.writeFileSync(fp, JSON.stringify(data))
                }
            } catch {}
        }
        const tmpFiles = fs.readdirSync(sessionPath)
            .filter(f => f.endsWith('.tmp') || f.endsWith('.log') || f === 'store.json')
        for (const f of tmpFiles) { try { fs.unlinkSync(path.join(sessionPath, f)) } catch {} }
    } catch {}
}

// ============= LIMPIEZA PERIÓDICA =============
export function startPeriodicCacheClean() {
    const CACHE_CLEAN_INTERVAL = 20 * 60 * 1000
    setInterval(async () => {
        const subBotFolder = global.supConfig?.folder || global.jadi || 'Sessions/SubBot'
        if (!fs.existsSync(subBotFolder)) return
        const sessions = fs.readdirSync(subBotFolder)
            .filter(f => fs.statSync(path.join(subBotFolder, f)).isDirectory())
        for (const userId of sessions) {
            try { await cleanSubBotCache(path.join(subBotFolder, userId)) } catch {}
        }
    }, CACHE_CLEAN_INTERVAL)
}

// ============= HANDLER PRINCIPAL =============
let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!globalThis.db.data.settings[conn.user.jid].jadibotmd) {
        return m.reply(`ꕥ El Comando *${command}* está desactivado temporalmente.`)
    }

    const activeSubBotsCount = global.conns.filter(sock => {
        try {
            return sock?.user?.jid && 
                   sock.user.jid !== global.conn.user.jid &&
                   sock.ws?.readyState === 1
        } catch { return false }
    }).length

    const maxLimit = global.supConfig?.maxSubBots || 100

    if (activeSubBotsCount >= maxLimit) {
        return m.reply(
            `⚠️ *LÍMITE ALCANZADO*\n` +
            `• Activos: ${activeSubBotsCount}/${maxLimit}\n` +
            `📋 *${usedPrefix}listjadibot* - Ver lista\n` +
            `🗑️ *${usedPrefix}killall* - Limpiar inactivos`
        )
    }

    const userData = global.db.data.users[m.sender]
    const lastSub = userData?.Subs || 0
    const timeLeft = 120000 - (Date.now() - lastSub)

    if (timeLeft > 0) {
        return m.reply(`⏳ Espera ${msToTime(timeLeft)} para vincular otro Sub-Bot.`)
    }

    const userId = m.sender.split('@')[0]

    if (isSubBotConnected(m.sender)) {
        return m.reply(
            `⚠️ Ya tienes un SubBot activo.\n\n` +
            `• *${usedPrefix}kill ${userId}* - Eliminar\n` +
            `• *${usedPrefix}restartbot ${userId}* - Reiniciar`
        )
    }

    const pathAstaJadiBot = path.join(`./${global.jadi || 'Sessions/SubBot'}/`, userId)

    if (fs.existsSync(pathAstaJadiBot)) {
        try {
            fs.rmSync(pathAstaJadiBot, { recursive: true, force: true })
            await delay(1000)
        } catch (e) {
            console.error('Error limpiando sesión:', e)
        }
    }

    fs.mkdirSync(pathAstaJadiBot, { recursive: true })
    global.sentCodes.delete(userId)

    await AstaJadiBot({
        pathAstaJadiBot,
        m,
        conn,
        args,
        usedPrefix,
        command,
        userId,
        maxReconnectAttempts: 3,
        isReconnect: false,
        isAutoStart: false
    })

    global.db.data.users[m.sender].Subs = Date.now()
}

handler.help = ['qr', 'code']
handler.tags = ['serbot']
handler.command = ['qr', 'code']
export default handler

// ============= FUNCIÓN PRINCIPAL MEJORADA =============
export async function AstaJadiBot(options) {
    let { 
        pathAstaJadiBot, 
        m, 
        conn, 
        args, 
        usedPrefix, 
        command, 
        userId,
        maxReconnectAttempts = 3,
        isReconnect = false,
        isAutoStart = false,
        savedConfig = null
    } = options

    let reconnectAttempts = global.subBotReconnectAttempts.get(userId) || 0

    if (isReconnect) {
        reconnectAttempts++
        global.subBotReconnectAttempts.set(userId, reconnectAttempts)
        console.log(chalk.yellow(`🔄 Reintento ${reconnectAttempts}/${maxReconnectAttempts} para ${userId}`))

        if (reconnectAttempts > maxReconnectAttempts) {
            console.log(chalk.red(`❌ Máximos reintentos alcanzados para ${userId}`))
            if (m && !isAutoStart) {
                await m.reply?.(`❌ No se pudo reconectar el SubBot después de ${maxReconnectAttempts} intentos. Elimina la sesión y vuelve a vincular.`)
            }
            global.subBotReconnectAttempts.delete(userId)
            return cleanupSession(pathAstaJadiBot, userId)
        }
        await delay(5000 * reconnectAttempts)
    }

    if (command === 'code') {
        command = 'qr'
        args.unshift('code')
    }

    const mcode = args.some(arg => /^(--code|code)$/.test(arg?.trim()))
    args = args.map(arg => arg.replace(/^--code$|^code$/, '').trim()).filter(Boolean)

    const { version } = await fetchLatestBaileysVersion()
    const msgRetryCache = new NodeCache({ stdTTL: 0, checkperiod: 0 })
    const { state, saveCreds } = await useMultiFileAuthState(pathAstaJadiBot)

    const connectionOptions = {
        logger: pino({ level: "silent" }),
        printQRInTerminal: false,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }))
        },
        msgRetryCounterCache: msgRetryCache,
        browser: ['Ubuntu', 'Chrome', '20.0.04'],
        version,
        generateHighQualityLinkPreview: true,
        defaultQueryTimeoutMs: 60000,
        connectTimeoutMs: 60000,
        keepAliveIntervalMs: 30000,
        emitOwnEvents: true,
        fireInitQueries: true
    }

    let sock = makeWASocket(connectionOptions)

    const defaultConfig = {
        name: `SubBot-${userId}`,
        prefix: global.prefix?.toString() || '^[#./]',
        sinprefix: false,
        mode: 'public',
        antiPrivate: false,
        gponly: false,
        owner: m?.sender || null,
        createdAt: new Date().toISOString(),
        sessionPath: pathAstaJadiBot
    }

    const configPath = path.join(pathAstaJadiBot, 'config.json')
    let subBotConfig

    try {
        if (savedConfig && Object.keys(savedConfig).length > 0) {
            subBotConfig = savedConfig
        } else if (fs.existsSync(configPath)) {
            subBotConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
        } else {
            subBotConfig = defaultConfig
            fs.writeFileSync(configPath, JSON.stringify(subBotConfig, null, 2))
        }
    } catch {
        subBotConfig = defaultConfig
    }

    sock.subConfig = subBotConfig
    sock.userId = userId

    let qrTimer = null
    let connectionTimer = null
    let messageRetryTimer = null
    let codeSent = false

    const cleanup = async (fullCleanup = false) => {
        if (qrTimer) clearTimeout(qrTimer)
        if (connectionTimer) clearTimeout(connectionTimer)
        if (messageRetryTimer) clearInterval(messageRetryTimer)

        try {
            sock.ev.removeAllListeners()
            if (sock.ws?.readyState === 1) sock.ws.close()
        } catch (e) {
            console.error('Error en cleanup:', e)
        }

        if (fullCleanup) {
            await cleanupSession(pathAstaJadiBot, userId)
            global.subBotReconnectAttempts.delete(userId)
            global.sentCodes.delete(userId)
        }
    }

    if (!isReconnect && !isAutoStart) {
        connectionTimer = setTimeout(async () => {
            if (!sock.user) {
                console.log(chalk.yellow(`⏰ Timeout de conexión para ${userId}`))
                await cleanup(true)
                await m.reply?.('⏰ Tiempo de espera agotado. Intenta nuevamente.')
            }
        }, 120000)
    }

    // ============= MANEJO DE CONEXIÓN =============
    async function connectionUpdate(update) {
        const { connection, lastDisconnect, qr, isNewLogin } = update

        if (isNewLogin) {
            console.log(chalk.blue(`🆕 Nueva sesión detectada: ${userId}`))
        }

        if (qr && !sock.user) {
            if (global.sentCodes.has(userId) || codeSent) {
                console.log(chalk.yellow(`⚠️ Código/QR ya enviado previamente a ${userId}, ignorando...`))
                return
            }

            codeSent = true
            global.sentCodes.set(userId, {
                timestamp: Date.now(),
                type: mcode ? 'code' : 'qr'
            })

            if (mcode) {
                // MODO CODE - SEPARADO: imagen primero, luego código
                try {
                    const secret = await sock.requestPairingCode(userId)
                    const formattedCode = secret.match(/.{1,4}/g)?.join("-") || secret

                    // 1. Enviar imagen con instrucciones
                    await conn.sendMessage(m.chat, {
                        image: { url: imagenSerBot },
                        caption: rtx2.trim()
                    }, { quoted: m })

                    // 2. Enviar solo el código (sin preview)
                    const codeMsg = await conn.sendMessage(m.chat, {
                        text: `\`\`\`${formattedCode}\`\`\``
                    }, { quoted: m })

                    setTimeout(() => {
                        conn.sendMessage(m.chat, { delete: codeMsg.key }).catch(() => {})
                        global.sentCodes.delete(userId)
                    }, 45000)

                } catch (e) {
                    console.error('Error pairing code:', e)
                    global.sentCodes.delete(userId)
                    codeSent = false
                    await m.reply?.('❌ Error generando código. Intenta con QR: ' + usedPrefix + 'qr')
                }
            } else {
                // MODO QR
                try {
                    const qrBuffer = await qrcode.toBuffer(qr, { 
                        scale: 8, 
                        margin: 2,
                        errorCorrectionLevel: 'H'
                    })

                    const qrMsg = await conn.sendMessage(m.chat, {
                        image: qrBuffer,
                        caption: rtx.trim()
                    }, { quoted: m })

                    qrTimer = setTimeout(() => {
                        conn.sendMessage(m.chat, { delete: qrMsg.key }).catch(() => {})
                        global.sentCodes.delete(userId)
                    }, 45000)

                } catch (e) {
                    console.error('Error generando QR:', e)
                    global.sentCodes.delete(userId)
                    codeSent = false
                }
            }
            return
        }

        // ===== CONEXIÓN EXITOSA =====
        if (connection === 'open') {
            if (connectionTimer) clearTimeout(connectionTimer)
            global.subBotReconnectAttempts.delete(userId)
            global.sentCodes.delete(userId)

            const sessionData = {
                jid: sock.user.jid,
                name: sock.user.name || 'SubBot',
                userId: userId,
                owner: m?.sender || subBotConfig.owner,
                connectedAt: new Date().toISOString(),
                config: sock.subConfig
            }
            fs.writeFileSync(path.join(pathAstaJadiBot, 'session.json'), JSON.stringify(sessionData, null, 2))

            if (!global.conns.includes(sock)) global.conns.push(sock)
            global.activeSubBots.set(sock.user.jid, { socket: sock, userId, connectedAt: Date.now(), config: sock.subConfig })

            sock.subConfig.jid = sock.user.jid
            sock.subConfig.updatedAt = new Date().toISOString()
            fs.writeFileSync(configPath, JSON.stringify(sock.subConfig, null, 2))

            console.log(chalk.green.bold(
                `\n✅ SUBBOT CONECTADO\n` +
                `├─ User: ${sock.user.name}\n` +
                `├─ JID: ${sock.user.jid}\n` +
                `└─ Path: ${pathAstaJadiBot}\n`
            ))

            if (!isReconnect && !isAutoStart && m?.chat) {
                await conn.sendMessage(m.chat, {
                    text: `✅ *SubBot Conectado!*\n\n` +
                          `🤖 ${sock.user.name}\n` +
                          `📱 ${sock.user.jid.split('@')[0]}\n` +
                          `👤 Owner: @${m.sender.split('@')[0]}\n\n` +
                          `⚙️ Config: ${usedPrefix}config\n` +
                          `🗑️ Eliminar: ${usedPrefix}kill ${userId}`,
                    mentions: [m.sender]
                }).catch(() => {})
            }

            if (global.ch) {
                for (const ch of Object.values(global.ch)) {
                    if (ch?.endsWith('@newsletter')) {
                        await sock.newsletterFollow(ch).catch(() => {})
                    }
                }
            }
        }

        // ===== DESCONEXIÓN =====
        if (connection === 'close') {
            const statusCode = lastDisconnect?.error?.output?.statusCode || 
                              lastDisconnect?.error?.output?.payload?.statusCode

            console.log(chalk.yellow(`🔌 Desconexión ${userId}: ${statusCode}`))

            const shouldCleanup = [
                DisconnectReason.loggedOut,
                DisconnectReason.badSession,
                401, 403, 405
            ].includes(statusCode)

            const index = global.conns.indexOf(sock)
            if (index > -1) global.conns.splice(index, 1)
            global.activeSubBots.delete(sock.user?.jid)

            if (shouldCleanup) {
                console.log(chalk.red(`🗑️ Sesión inválida, limpiando: ${userId}`))
                await cleanup(true)
                if (m && !isAutoStart) {
                    await m.reply?.(`❌ Sesión inválida. Vuelve a vincular con ${usedPrefix}qr`)
                }
                return
            }

            if (reconnectAttempts < maxReconnectAttempts) {
                console.log(chalk.blue(`🔄 Reconectando ${userId}...`))
                await cleanup(false)
                await delay(Math.min(4000 * Math.pow(2, reconnectAttempts), 30000))
                await AstaJadiBot({
                    ...options,
                    isReconnect: true
                })
            } else {
                await cleanup(true)
                if (m && !isAutoStart) {
                    await m.reply?.(`❌ SubBot desconectado permanentemente.`)
                }
            }
        }
    }

    // ============= CARGAR HANDLER =============
    let handlerModule
    try {
        handlerModule = await import('../../handler.js')
    } catch (e) {
        console.error('Error cargando handler:', e)
    }

    const setupListeners = () => {
        if (handlerModule?.handler) {
            sock.handler = handlerModule.handler.bind(sock)
            sock.connectionUpdate = connectionUpdate.bind(sock)
            sock.credsUpdate = saveCreds.bind(sock)

            sock.ev.on("messages.upsert", sock.handler)
            sock.ev.on("connection.update", sock.connectionUpdate)
            sock.ev.on("creds.update", sock.credsUpdate)
        }
    }

    setupListeners()

    // Health check cada 30 segundos
    messageRetryTimer = setInterval(() => {
        if (sock.ws?.readyState === 3) {
            console.log(chalk.red(`💔 WebSocket cerrado detectado: ${userId}`))
            clearInterval(messageRetryTimer)
            connectionUpdate({ 
                connection: 'close', 
                lastDisconnect: { error: { output: { statusCode: 440 } } } 
            })
        }
    }, 30000)
}

// ============= FUNCIONES AUXILIARES =============
async function cleanupSession(sessionPath, userId) {
    try {
        if (fs.existsSync(sessionPath)) {
            fs.rmSync(sessionPath, { recursive: true, force: true })
            console.log(chalk.green(`🗑️ Sesión eliminada: ${userId}`))
        }
    } catch (e) {
        console.error('Error eliminando sesión:', e)
    }
    global.subBotsData.delete(userId)
    global.sentCodes.delete(userId)
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

function msToTime(duration) {
    const seconds = Math.floor((duration / 1000) % 60)
    const minutes = Math.floor((duration / (1000 * 60)) % 60)
    const hours = Math.floor((duration / (1000 * 60 * 60)) % 24)

    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`
    if (minutes > 0) return `${minutes}m ${seconds}s`
    return `${seconds}s`
}