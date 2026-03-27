process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1'

// ========== SILENCIAR ERRORES INTERNOS DE DEPENDENCIAS ==========
// Capturar y silenciar errores de libsignal/Baileys
const originalStderrWrite = process.stderr.write.bind(process.stderr)
process.stderr.write = (chunk, encoding, callback) => {
    const msg = chunk.toString()
    // Filtrar errores de libsignal y Baileys internos
    if (
        msg.includes('Bad MAC') ||
        msg.includes('Session error') ||
        msg.includes('Failed to decrypt message') ||
        msg.includes('libsignal') ||
        msg.includes('SessionCipher') ||
        msg.includes('MaxListenersExceededWarning') ||
        msg.includes('node-fetch') ||
        msg.includes('DeprecationWarning')
    ) {
        return true // No escribir nada
    }
    return originalStderrWrite(chunk, encoding, callback)
}

// Desactivar todas las advertencias de Node.js
process.removeAllListeners('warning')
process.on('warning', () => {})

// ========== SILENCIAR CONSOLE METHODS ==========
const originalLog = console.log
const originalInfo = console.info  
const originalWarn = console.warn

console.log = (...args) => {
    const msg = args.join(' ')
    if (/✖|❌|Error|error|FATAL|fatal|⚠|🚫|Failed|failed|✅ BOT CONECTADO/.test(msg)) {
        originalLog.apply(console, args)
    }
}

console.info = () => {}
console.warn = () => {}

// ========== IMPORTS PRINCIPALES ==========
import './settings.js'
import './plugins/funciones/_allfake.js'
import { createRequire } from 'module'
import { fileURLToPath, pathToFileURL } from 'url'
import { platform } from 'process'
import * as ws from 'ws'
import fs, { readdirSync, statSync, unlinkSync, existsSync, mkdirSync, readFileSync, rmSync, watch } from 'fs'
import yargs from 'yargs'
import { spawn } from 'child_process'
import lodash from 'lodash'
import { AstaJadiBot, autoStartSubBots, startPeriodicCacheClean } from './plugins/socket/serbot.js'
import chalk from 'chalk'
import syntaxerror from 'syntax-error'
import pino from 'pino'
import Pino from 'pino'
import path, { join } from 'path'
import { Boom } from '@hapi/boom'
import { makeWASocket, protoType, serialize } from './lib/simple.js'
import { Low, JSONFile } from 'lowdb'
import store from './lib/store.js'
const { proto } = (await import('@whiskeysockets/baileys')).default
import pkg from 'google-libphonenumber'
const { PhoneNumberUtil } = pkg
const phoneUtil = PhoneNumberUtil.getInstance()
const { DisconnectReason, useMultiFileAuthState, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, jidNormalizedUser } = await import('@whiskeysockets/baileys')
import readline from 'readline'
import NodeCache from 'node-cache'
import { initializeResourceSystem } from './lib/rpg/init-resources.js'

// ============= VARIABLES GLOBALES =============
if (!global.conns) global.conns = []
if (!global.subBotsData) global.subBotsData = new Map()

global.supConfig = {
    maxSubBots: 100,
    sessionTime: 45,
    cooldown: 120,
    autoClean: true,
    folder: "Sessions/SubBot",
}

const { CONNECTING } = ws
const { chain } = lodash
const PORT = process.env.PORT || process.env.SERVER_PORT || 3000

// ============= INICIO DEL BOT =============
// Forzar codificación UTF-8 en la consola
process.stdout.setEncoding('utf8');

// Banner ASCII personalizado - usar el nombre directamente de settings.js
const botName = global.botname || '『𝕬𝖘𝖙𝖆-𝕭𝖔𝖙』';
const botVersion = global.vs || '1.5';
const botAuthor = global.etiqueta || '𝕱𝖊𝖗𝖓𝖆𝖓𝖉𝖔';

const banner = `
   _____    _________________________    __________  __________________
  /  _  \\  /   _____/\\__    ___/  _  \\   \\______   \\ \\_____ \\__    ___/
 /  /_\\  \\ \\_____  \\   |    | /  /_\\  \\   |    |  _/ /   |   \\|    |   
/    |    \\/        \\  |    |/    |    \\  |    |   \\/    |    \\    |   
\\____|__  /_______  /  |____|\\____|__  /  |______  /\\_______  /____|   
        \\/        \\/                 \\/          \\/         \\/            

● 『𝒜𝓈𝓉𝒶-𝐵𝑜𝓉』
  ├─ Version: ${botVersion}
  └─ Autor: 𝐹𝑒𝓇𝓃𝒶𝓃𝒹𝑜

  By  •  The StudyBots
`;

originalLog(chalk.cyan(banner));
originalLog(chalk.gray(`\n▶ Iniciando sistema...\n`));

protoType()
serialize()

global.__filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') {
    return rmPrefix ? /file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL : pathToFileURL(pathURL).toString()
}
global.__dirname = function dirname(pathURL) {
    return path.dirname(global.__filename(pathURL, true))
}
global.__require = function require(dir = import.meta.url) {
    return createRequire(dir)
}

global.timestamp = { start: new Date }
const __dirname = global.__dirname(import.meta.url)
global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
global.prefix = new RegExp('^[#!./-]')

global.db = new Low(/https?:\/\//.test(opts['db'] || '') ? new cloudDBAdapter(opts['db']) : new JSONFile('database.json'))
global.DATABASE = global.db
global.loadDatabase = async function loadDatabase() {
    if (global.db.READ) {
        return new Promise((resolve) => setInterval(async function () {
            if (!global.db.READ) {
                clearInterval(this)
                resolve(global.db.data == null ? global.loadDatabase() : global.db.data)
            }
        }, 1 * 1000))
    }
    if (global.db.data !== null) return
    global.db.READ = true
    await global.db.read().catch(console.error)
    global.db.READ = null
    global.db.data = {
        users: {},
        chats: {},
        settings: {},
        ...(global.db.data || {})
    }
    global.db.chain = chain(global.db.data)
}
loadDatabase()

// ============= CONEXIÓN PRINCIPAL =============
const { state, saveCreds } = await useMultiFileAuthState(global.sessions)
const msgRetryCounterCache = new NodeCache({ stdTTL: 0, checkperiod: 0 })
const userDevicesCache = new NodeCache({ stdTTL: 0, checkperiod: 0 })
const { version } = await fetchLatestBaileysVersion()
let phoneNumber = global.botNumber
const methodCodeQR = process.argv.includes("qr")
const methodCode = !!phoneNumber || process.argv.includes("code")
const MethodMobile = process.argv.includes("mobile")
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (texto) => new Promise((resolver) => rl.question(texto, resolver))
let opcion

if (methodCodeQR) {
    opcion = '1'
}
if (!methodCodeQR && !methodCode && !fs.existsSync(`./${global.sessions}/creds.json`)) {
    do {
        opcion = await question(chalk.bold.white("Seleccione opción:\n") + chalk.blueBright("1. QR\n") + chalk.cyan("2. Código\n▶▶▶ "))
        if (!/^[1-2]$/.test(opcion)) {
            originalLog(chalk.bold.redBright(`✖ Solo 1 o 2`))
        }
    } while (opcion !== '1' && opcion !== '2' || fs.existsSync(`./${global.sessions}/creds.json`))
}

// Logger completamente silencioso
const silentLogger = pino({ level: 'silent' })

const connectionOptions = {
    logger: silentLogger,
    printQRInTerminal: opcion == '1' ? true : methodCodeQR ? true : false,
    mobile: MethodMobile,
    browser: ["Ubuntu", "Chrome", "20.0.04"],
    auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, silentLogger),
    },
    generateHighQualityLinkPreview: false,
    msgRetryCounterCache,
    userDevicesCache,
    version,
    syncFullHistory: false,
    fireInitQueries: false,
    shouldIgnoreJid: () => false,
    getMessage: async () => undefined,
    // Opciones adicionales para reducir logs
    retryRequestDelayMs: 250,
    maxMsgRetryCount: 5,
    connectTimeoutMs: 60000,
    keepAliveIntervalMs: 30000,
    emitOwnEvents: false,
}

global.conn = makeWASocket(connectionOptions)
conn.ev.on("creds.update", saveCreds)

if (!fs.existsSync(`./${global.sessions}/creds.json`)) {
    if (opcion === '2' || methodCode) {
        originalLog(chalk.yellow('[⚡] Modo código activado'))

        if (!conn.authState.creds.registered) {
            let addNumber
            if (!!phoneNumber) {
                addNumber = phoneNumber.replace(/[^0-9]/g, '')
            } else {
                do {
                    phoneNumber = await question(chalk.bgBlack(chalk.bold.greenBright(`[📱] Número WhatsApp:\n▶▶▶ `)))
                    phoneNumber = phoneNumber.replace(/\D/g, '')
                    if (!phoneNumber.startsWith('+')) phoneNumber = `+${phoneNumber}`
                } while (!await isValidPhoneNumber(phoneNumber))
                rl.close()
                addNumber = phoneNumber.replace(/\D/g, '')
            }

            originalLog(chalk.cyan('[⏳] Generando código...'))

            try {
                const cleanNumber = addNumber.replace('+', '')
                let codeBot = await conn.requestPairingCode(cleanNumber)

                if (codeBot) {
                    codeBot = codeBot?.match(/.{1,4}/g)?.join("-") || codeBot
                    originalLog(chalk.bold.white(chalk.bgMagenta(`\n═══════════════════════`)))
                    originalLog(chalk.bold.white(chalk.bgMagenta(`      📲 CÓDIGO WhatsApp   `)))
                    originalLog(chalk.bold.white(chalk.bgMagenta(`═══════════════════════`)))
                    originalLog(chalk.bold.white(chalk.bgGreen(`      ${codeBot}      `)))
                }
            } catch (error) {
                console.error(chalk.red(`✖ Error: ${error.message}`))
            }
        }
    }
}

conn.isInit = false
conn.well = false

let subBotsAutoStarted = false

if (!opts['test']) {
    setInterval(async () => {
        if (global.db.data) await global.db.write().catch(() => {})
    }, 60 * 1000)
}

// ============= RECONEXIÓN DE SUBBOTS =============
async function reconnectAllSubBots() {
    const subBotFolder = global.supConfig?.folder || 'Sessions/SubBot'
    if (!existsSync(subBotFolder)) return

    const sessions = readdirSync(subBotFolder).filter(f => {
        const fullPath = path.join(subBotFolder, f)
        return statSync(fullPath).isDirectory() && existsSync(path.join(fullPath, 'creds.json'))
    })

    if (!sessions.length) return

    for (const userId of sessions) {
        try {
            const sessionPath = path.join(subBotFolder, userId)
            const configPath = path.join(sessionPath, 'config.json')
            let savedConfig = {}
            if (existsSync(configPath)) savedConfig = JSON.parse(readFileSync(configPath, 'utf-8'))

            await AstaJadiBot({
                pathAstaJadiBot: sessionPath,
                m: null,
                conn: global.conn,
                args: [],
                usedPrefix: global.prefox || '#',
                command: 'qr',
                userId,
                maxReconnectAttempts: 5,
                isReconnect: true,
                isAutoStart: true,
                savedConfig
            })
            await new Promise(r => setTimeout(r, 2000))
        } catch (e) {
            console.error(chalk.red(`✖ Error reconectando ${userId}: ${e.message}`))
        }
    }
}

// ============= MANEJO DE CONEXIÓN =============
async function connectionUpdate(update) {
    const { connection, lastDisconnect } = update

    if (connection === "open") {
        const userName = conn.user.name || conn.user.verifiedName || "Usuario"
        
        // Mensaje de conexión estilo limpio consistente con el banner
        const connectedMsg = `
● ✅ Bot Conectado
  ├─ Usuario: ${userName}
  ├─ Número: ${conn.user.id.split(':')[0]}
  └─ Hora: ${new Date().toLocaleString('es-MX')}

  By  •  The StudyBots
`
        
        originalLog(chalk.green(connectedMsg))

        if (!subBotsAutoStarted) {
            subBotsAutoStarted = true
            setTimeout(async () => {
                try {
                    startPeriodicCacheClean()
                    await reconnectAllSubBots()
                } catch (e) {
                    console.error(chalk.red('✖ Error al reconectar subbots:'), e.message)
                }
            }, 3000)
        }
    }

    if (connection === "close") {
        const code = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode
        if (code && code !== DisconnectReason.loggedOut && conn?.ws.socket == null) {
            await global.reloadHandler(true).catch(console.error)
        }
        console.error(chalk.yellow("🔄 Reconectando bot principal..."))
        await global.reloadHandler(true).catch(console.error)
    }
}

// ============= MANEJO DE ERRORES =============
process.on('uncaughtException', (err) => {
    // Filtrar errores de libsignal
    if (err.message && (
        err.message.includes('Bad MAC') ||
        err.message.includes('Session error') ||
        err.message.includes('Failed to decrypt')
    )) return
    
    const errorMsg = `
● ⚠️ Error Detectado
  ├─ Tipo: ${err.name || 'Error desconocido'}
  ├─ Mensaje: ${err.message || 'Sin mensaje'}
  └─ Hora: ${new Date().toLocaleString('es-MX')}

  By  •  The StudyBots
`
    console.error(chalk.red(errorMsg))
    console.error(err)
})

let isInit = true
let handler = await import('./handler.js')

global.reloadHandler = async function (restartConn) {
    try {
        const Handler = await import(`./handler.js?update=${Date.now()}`).catch(console.error)
        if (Object.keys(Handler || {}).length) handler = Handler
    } catch (e) {
        console.error(e)
    }

    if (restartConn) {
        const oldChats = global.conn.chats
        try { global.conn.ws.close() } catch {}
        conn.ev.removeAllListeners()
        global.conn = makeWASocket(connectionOptions, { chats: oldChats })
        isInit = true
    }

    if (!isInit) {
        conn.ev.off('messages.upsert', conn.handler)
        conn.ev.off('connection.update', conn.connectionUpdate)
        conn.ev.off('creds.update', conn.credsUpdate)
    }

    conn.handler = handler.handler.bind(global.conn)
    conn.connectionUpdate = connectionUpdate.bind(global.conn)
    conn.credsUpdate = saveCreds.bind(global.conn, true)

    conn.ev.on('messages.upsert', conn.handler)
    conn.ev.on('connection.update', conn.connectionUpdate)
    conn.ev.on('creds.update', conn.credsUpdate)

    isInit = false
    return true
}

process.on('unhandledRejection', (reason) => {
    // Filtrar rechazos de libsignal
    if (reason && reason.message && (
        reason.message.includes('Bad MAC') ||
        reason.message.includes('Session error') ||
        reason.message.includes('Failed to decrypt')
    )) return
    
    const errorMsg = `
● ⚠️ Promesa Rechazada
  ├─ Razón: ${reason || 'Desconocida'}
  └─ Hora: ${new Date().toLocaleString('es-MX')}

  By  •  The StudyBots
`
    console.error(chalk.red(errorMsg))
})

// ============= CARGA DE PLUGINS =============
function getPluginFiles(dir, baseDir = dir) {
    let results = []
    if (!existsSync(dir)) return results

    const items = readdirSync(dir, { withFileTypes: true })

    for (const item of items) {
        const fullPath = join(dir, item.name)
        const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/')

        if (item.isDirectory()) {
            results = results.concat(getPluginFiles(fullPath, baseDir))
        } else if (item.isFile() && /\.js$/.test(item.name)) {
            results.push({
                fullPath,
                relativePath,
                folder: path.relative(__dirname, baseDir).replace(/\\/g, '/'),
                filename: item.name
            })
        }
    }
    return results
}

const pluginFolders = ['./plugins', './plugins2', './plugins3', './plugins4', './plugins5']
global.plugins = {}

async function filesInit() {
    let total = 0
    let errors = 0

    for (const folder of pluginFolders) {
        const folderPath = join(__dirname, folder)
        if (!existsSync(folderPath)) continue

        const pluginFiles = getPluginFiles(folderPath)

        for (const file of pluginFiles) {
            const pluginKey = `${folder}/${file.relativePath}`
            try {
                const fileUrl = pathToFileURL(file.fullPath).href
                const module = await import(fileUrl)
                const plugin = module.default !== undefined ? module.default : module
                if (plugin && (typeof plugin === 'function' || typeof plugin === 'object')) {
                    global.plugins[pluginKey] = plugin
                    total++
                } else {
                    errors++
                }
            } catch (e) {
                console.error(chalk.red(`✖ Error en ${pluginKey}: ${e.message}`))
                errors++
            }
        }
    }

    if (errors > 0) {
        originalLog(chalk.yellow(`⚠ Plugins con errores: ${errors}`))
    }
}

filesInit().catch(console.error)

// ============= RECARGA AUTOMÁTICA =============
global.reload = async (_ev, filename) => {
    if (!/\.js$/.test(filename)) return

    for (const folder of pluginFolders) {
        const folderPath = join(__dirname, folder)
        if (!existsSync(folderPath)) continue

        const searchFile = (dir, baseDir = dir) => {
            const items = readdirSync(dir, { withFileTypes: true })
            for (const item of items) {
                const fullPath = join(dir, item.name)
                const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/')

                if (item.isDirectory()) {
                    const found = searchFile(fullPath, baseDir)
                    if (found) return found
                } else if (item.name === filename) {
                    return { fullPath, relativePath }
                }
            }
            return null
        }

        const fileInfo = searchFile(folderPath)
        if (fileInfo) {
            const pluginKey = `${folder}/${fileInfo.relativePath}`

            const err = syntaxerror(readFileSync(fileInfo.fullPath), filename, {
                sourceType: 'module',
                allowAwaitOutsideFunction: true,
            })

            if (err) {
                delete global.plugins[pluginKey]
                return
            }

            try {
                const fileUrl = pathToFileURL(fileInfo.fullPath).href + `?update=${Date.now()}`
                const module = await import(fileUrl)
                const plugin = module.default !== undefined ? module.default : module
                global.plugins[pluginKey] = plugin
            } catch (e) {
                console.error(chalk.red(`✖ Error recargando ${pluginKey}: ${e.message}`))
                delete global.plugins[pluginKey]
            }
            return
        }
    }

    const existingKey = Object.keys(global.plugins).find(key => key.endsWith(`/${filename}`))
    if (existingKey) {
        delete global.plugins[existingKey]
    }
}

Object.freeze(global.reload)

for (const folder of pluginFolders) {
    const folderPath = join(__dirname, folder)
    if (existsSync(folderPath)) {
        watch(folderPath, { recursive: true }, global.reload)
    }
}

// ============= INICIAR HANDLER =============
await global.reloadHandler()

// ============= LIMPIEZA AUTOMÁTICA DE TMP =============
setInterval(() => {
    const tmpDir = join(__dirname, 'tmp')
    if (existsSync(tmpDir)) {
        const files = readdirSync(tmpDir)
        for (const file of files) {
            try {
                const filePath = join(tmpDir, file)
                const stats = statSync(filePath)
                if (Date.now() - stats.mtimeMs > 5 * 60 * 1000) {
                    unlinkSync(filePath)
                }
            } catch {}
        }
    }
}, 10 * 60 * 1000)

// ============= FUNCIONES AUXILIARES =============
async function isValidPhoneNumber(number) {
    try {
        number = number.replace(/\s+/g, '')
        if (number.startsWith('+521')) {
            number = number.replace('+521', '+52')
        }
        const parsedNumber = phoneUtil.parseAndKeepRawInput(number)
        return phoneUtil.isValidNumber(parsedNumber)
    } catch {
        return false
    }
}

initializeResourceSystem()
