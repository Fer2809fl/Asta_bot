import chalk from 'chalk'
import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'

// =================== CACHE DE LIDs ===================
const lidCache = new Map()

// =================== ANTI-DUPLICADOS ===================
const recentStubs = new Map()
const DEDUP_TTL = 8000 // 8 segundos

function isDuplicate(chatId, stubType, key = '') {
    const id = `${chatId}|${stubType}|${key}`
    const now = Date.now()
    const last = recentStubs.get(id)
    if (last && now - last < DEDUP_TTL) return true
    recentStubs.set(id, now)
    if (recentStubs.size > 300) {
        for (const [k, v] of recentStubs) {
            if (now - v > DEDUP_TTL * 2) recentStubs.delete(k)
        }
    }
    return false
}

// =================== RCANAL ===================
async function getRcanal() {
    try {
        const iconoUrl = global.icono || 'https://files.catbox.moe/xr2m6u.jpg'
        const thumb = await (await fetch(iconoUrl)).buffer()
        return {
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: global.channelRD?.id || '120363399175402285@newsletter',
                serverMessageId: '',
                newsletterName: global.channelRD?.name || "『𝕬𝖘𝖙𝖆-𝕭𝖔𝖙』"
            },
            externalAdReply: {
                title: global.botname || 'ᴀsᴛᴀ-ʙᴏᴛ',
                body: global.dev || 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ ғᴇʀɴᴀɴᴅᴏ',
                mediaType: 1,
                mediaUrl: global.redes || global.group || '',
                sourceUrl: global.redes || global.group || '',
                thumbnail: thumb,
                showAdAttribution: false,
                containsAutoReply: true,
                renderLargerThumbnail: false
            }
        }
    } catch {
        return {}
    }
}

// =================== RESOLVER LID → JID REAL ===================
async function resolverLid(rawJid, conn, groupMetadata) {
    if (!rawJid) return null

    const jid = rawJid.toString().trim()

    if (jid.endsWith('@s.whatsapp.net')) return jid
    if (!jid.includes('@')) return jid + '@s.whatsapp.net'
    if (!jid.endsWith('@lid')) return jid

    if (lidCache.has(jid)) return lidCache.get(jid)

    const lidNum = jid.split('@')[0]

    if (groupMetadata?.participants?.length) {
        for (const p of groupMetadata.participants) {
            const pJid = p.jid || p.id || ''
            if (p.lid && (p.lid === jid || p.lid.split('@')[0] === lidNum)) {
                lidCache.set(jid, pJid)
                return pJid
            }
        }

        for (const p of groupMetadata.participants) {
            const pJid = p.jid || p.id || ''
            if (!pJid.endsWith('@s.whatsapp.net')) continue
            try {
                const info = await conn.onWhatsApp(pJid)
                const foundLid = info?.[0]?.lid
                if (foundLid) {
                    lidCache.set(
                        foundLid.includes('@') ? foundLid : foundLid + '@lid',
                        pJid
                    )
                    if (foundLid.split('@')[0] === lidNum) {
                        return pJid
                    }
                }
            } catch { continue }
        }
    }

    console.log(chalk.yellow(`[INFO] LID no resuelto: ${jid}`))
    return null
}

function getNumero(jidOrLid) {
    if (!jidOrLid) return 'Usuario'
    return jidOrLid.split('@')[0]
}

// =================== PLUGIN PRINCIPAL ===================
const handler = m => m

handler.before = async function (m, { participants, groupMetadata }) {
    if (!m.messageStubType || !m.isGroup) return

    const primaryBot = global.db?.data?.chats?.[m.chat]?.primaryBot
    if (primaryBot && this.user.jid !== primaryBot) return

    // Inicializar chat si no existe
    if (!global.db.data.chats[m.chat]) {
        global.db.data.chats[m.chat] = {}
    }
    
    const chat = global.db.data.chats[m.chat]
    
    // Inicializar detect con valor por defecto true si no está definido
    if (chat.detect === undefined || chat.detect === null) {
        chat.detect = true
        console.log(chalk.yellow(`[INFOMSG] Inicializando detect=true en ${m.chat}`))
    }

    // VERIFICAR SI ESTÁ ACTIVADO
    if (!chat.detect) {
        console.log(chalk.gray(`[INFOMSG] detect desactivado en ${m.chat}, ignorando stub ${m.messageStubType}`))
        return
    }

    // Log para saber que llegó hasta aquí
    console.log(chalk.green(`[INFOMSG] Procesando stub ${m.messageStubType} en ${m.chat} (detect activado)`))

    const stub = m.messageStubType
    const rawParam = m.messageStubParameters?.[0] || ''
    const rawSender = m.sender || ''

    if (isDuplicate(m.chat, stub, rawParam)) {
        console.log(chalk.gray(`[INFO] Duplicado ignorado: stub=${stub} param=${rawParam}`))
        return
    }

    const meta = groupMetadata || await this.groupMetadata(m.chat).catch(() => null)

    const [usuarioJid, usersJid] = await Promise.all([
        resolverLid(rawSender, this, meta),
        resolverLid(rawParam, this, meta)
    ])

    const usuarioNum = getNumero(usuarioJid || rawSender)
    const usersNum = getNumero(usersJid || rawParam)

    const groupAdmins = (meta?.participants || participants || []).filter(p => p.admin)
    const adminJids = groupAdmins.map(v => v.id || v.jid).filter(Boolean)

    const pp = await this.profilePictureUrl(m.chat, 'image').catch(() => null)
        || global.banner
        || 'https://files.catbox.moe/xr2m6u.jpg'

    const rcanal = await getRcanal()

    const nombre = (
        `> . ﹡ ﹟ ✏️ ׄ ⬭ *CAMBIO DE NOMBRE*\n\n` +
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜👤* ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *Usuario* :: @${usuarioNum}\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *Nuevo nombre* :: ${rawParam}\n\n` +
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜📌* ㅤ֢ㅤ⸱ㅤᯭִ* — *Info*\n` +
        `ׅㅤ𓏸𓈒ㅤׄ El usuario ha cambiado su nombre en el grupo.`
    )

    const foto = (
        `> . ﹡ ﹟ 🖼️ ׄ ⬭ *CAMBIO DE FOTO*\n\n` +
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜📸* ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *Usuario* :: @${usuarioNum}\n\n` +
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🎨* ㅤ֢ㅤ⸱ㅤᯭִ* — *Info*\n` +
        `ׅㅤ𓏸𓈒ㅤׄ El usuario ha actualizado su foto de perfil.`
    )

    const edit = (
        `> . ﹡ ﹟ ⚙️ ׄ ⬭ *CONFIGURACIÓN EDITADA*\n\n` +
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🔧* ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *Usuario* :: @${usuarioNum}\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *Acción* :: ${rawParam === 'on' ? '✅ ACTIVADO' : '❌ DESACTIVADO'} la configuración del grupo\n\n` +
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜📌* ㅤ֢ㅤ⸱ㅤᯭִ* — *Info*\n` +
        `ׅㅤ𓏸𓈒ㅤׄ Se ha modificado la configuración del grupo.`
    )

    const newlink = (
        `> . ﹡ ﹟ 🔗 ׄ ⬭ *ENLACE ACTUALIZADO*\n\n` +
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🌐* ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *Usuario* :: @${usuarioNum}\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *Nuevo enlace* :: ${rawParam}\n\n` +
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜📌* ㅤ֢ㅤ⸱ㅤᯭִ* — *Info*\n` +
        `ׅㅤ𓏸𓈒ㅤׄ Se ha actualizado el enlace de invitación del grupo.`
    )

    const status = (
        `> . ﹡ ﹟ 🔔 ׄ ⬭ *ESTADO DEL GRUPO*\n\n` +
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜📢* ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *Usuario* :: @${usuarioNum}\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *Estado* :: ${rawParam === 'on' ? '✅ ACTIVADO' : '❌ DESACTIVADO'}\n\n` +
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜📌* ㅤ֢ㅤ⸱ㅤᯭִ* — *Info*\n` +
        `ׅㅤ𓏸𓈒ㅤׄ El estado del grupo ha sido modificado.`
    )

    const admingp = (
        `> . ﹡ ﹟ 👑 ׄ ⬭ *NUEVO ADMINISTRADOR*\n\n` +
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜⭐* ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *Usuario ascendido* :: @${usersNum}\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *Ascendido por* :: @${usuarioNum}\n\n` +
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜📌* ㅤ֢ㅤ⸱ㅤᯭִ* — *Info*\n` +
        `ׅㅤ𓏸𓈒ㅤׄ ¡Felicidades al nuevo administrador!`
    )

    const noadmingp = (
        `> . ﹡ ﹟ ⬇️ ׄ ⬭ *ADMINISTRADOR REMOVIDO*\n\n` +
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🔻* ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *Usuario removido* :: @${usersNum}\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *Removido por* :: @${usuarioNum}\n\n` +
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜📌* ㅤ֢ㅤ⸱ㅤᯭִ* — *Info*\n` +
        `ׅㅤ𓏸𓈒ㅤׄ El usuario ya no es administrador.`
    )

    const buildMentions = (...jids) =>
        [...jids, ...adminJids]
            .filter(j => j && j.endsWith('@s.whatsapp.net'))
            .filter((v, i, a) => a.indexOf(v) === i)

    if (stub === 2) {
        try {
            const uniqid = (m.isGroup ? m.chat : m.sender)?.split('@')[0]
            const sessionPath = `./${global.sessions || 'sessions'}/`
            if (fs.existsSync(sessionPath)) {
                const files = await fs.promises.readdir(sessionPath)
                for (const file of files) {
                    if (file.includes(uniqid)) {
                        await fs.promises.unlink(path.join(sessionPath, file))
                        console.log(
                            `${chalk.yellow.bold('✎ Delete!')} ${chalk.greenBright(`'${file}'`)}\n` +
                            chalk.redBright('Eliminado para evitar "undefined" en chat.')
                        )
                    }
                }
            }
        } catch (e) {
            console.error(chalk.red('Error limpiando sesión:'), e.message)
        }
        return
    }

    try {
        switch (stub) {
            case 21:
                await this.sendMessage(m.chat, {
                    text: nombre,
                    contextInfo: { ...rcanal, mentionedJid: buildMentions(usuarioJid) }
                }, { quoted: null })
                console.log(chalk.green(`[ALERTA] Evento 21 (nombre) enviado en ${m.chat}`))
                break
            case 22:
                await this.sendMessage(m.chat, {
                    image: { url: pp },
                    caption: foto,
                    contextInfo: { ...rcanal, mentionedJid: buildMentions(usuarioJid) }
                }, { quoted: null })
                console.log(chalk.green(`[ALERTA] Evento 22 (foto) enviado en ${m.chat}`))
                break
            case 23:
                await this.sendMessage(m.chat, {
                    text: newlink,
                    contextInfo: { ...rcanal, mentionedJid: buildMentions(usuarioJid) }
                }, { quoted: null })
                console.log(chalk.green(`[ALERTA] Evento 23 (enlace) enviado en ${m.chat}`))
                break
            case 25:
                await this.sendMessage(m.chat, {
                    text: edit,
                    contextInfo: { ...rcanal, mentionedJid: buildMentions(usuarioJid) }
                }, { quoted: null })
                console.log(chalk.green(`[ALERTA] Evento 25 (config) enviado en ${m.chat}`))
                break
            case 26:
                await this.sendMessage(m.chat, {
                    text: status,
                    contextInfo: { ...rcanal, mentionedJid: buildMentions(usuarioJid) }
                }, { quoted: null })
                console.log(chalk.green(`[ALERTA] Evento 26 (estado) enviado en ${m.chat}`))
                break
            case 29:
                await this.sendMessage(m.chat, {
                    text: admingp,
                    contextInfo: { ...rcanal, mentionedJid: buildMentions(usuarioJid, usersJid) }
                }, { quoted: null })
                console.log(chalk.green(`[ALERTA] Evento 29 (promoción) enviado en ${m.chat}`))
                break
            case 30:
                await this.sendMessage(m.chat, {
                    text: noadmingp,
                    contextInfo: { ...rcanal, mentionedJid: buildMentions(usuarioJid, usersJid) }
                }, { quoted: null })
                console.log(chalk.green(`[ALERTA] Evento 30 (remoción) enviado en ${m.chat}`))
                break
            default:
                if (![2, 27, 28, 31, 32, 160].includes(stub)) {
                    console.log(chalk.gray(`[INFO] messageStubType no manejado: ${stub}`),
                        m.messageStubParameters)
                }
        }
    } catch (e) {
        console.error(chalk.red('[_infomessage] Error enviando mensaje:'), e.message)
    }
}

export default handler