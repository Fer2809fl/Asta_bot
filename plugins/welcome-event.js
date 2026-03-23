import { createCanvas, loadImage } from '@napi-rs/canvas'
import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'

const W = 720
const H = 290

// =================== ANTI-DUPLICADOS ===================
const recentEvents = new Map()
const DEDUP_TTL = 10000 // 10 segundos

function isDuplicate(chatId, rawId, stub) {
    const key = `${chatId}|${rawId}|${stub}`
    const now = Date.now()
    const last = recentEvents.get(key)
    if (last && now - last < DEDUP_TTL) return true
    recentEvents.set(key, now)
    if (recentEvents.size > 300) {
        for (const [k, v] of recentEvents) {
            if (now - v > DEDUP_TTL * 2) recentEvents.delete(k)
        }
    }
    return false
}

// =================== CACHÉ DE LIDs ===================
const lidCache = new Map()

/**
 * Recibe un JID que puede ser @lid o @s.whatsapp.net
 * Si es @lid, busca en los participantes del grupo el JID real
 * Si no lo encuentra, devuelve el LID tal cual (para no crashear)
 */
async function resolverJid(conn, rawJid, groupMetadata) {
    if (!rawJid) return null

    // Ya es un JID normal
    if (rawJid.endsWith('@s.whatsapp.net')) return rawJid

    // No es LID, agregar sufijo si falta
    if (!rawJid.endsWith('@lid')) {
        return rawJid.includes('@') ? rawJid : rawJid + '@s.whatsapp.net'
    }

    // Es un @lid — buscar en caché primero
    if (lidCache.has(rawJid)) return lidCache.get(rawJid)

    // Buscar en los participantes del grupo
    if (groupMetadata?.participants?.length) {
        for (const p of groupMetadata.participants) {
            const pJid = p.jid || p.id || ''
            // Intentar comparar lid dentro del objeto participante
            if (p.lid && p.lid === rawJid) {
                lidCache.set(rawJid, pJid)
                return pJid
            }
        }

        // Segundo intento: usar onWhatsApp para resolver
        for (const p of groupMetadata.participants) {
            const pJid = p.jid || p.id || ''
            if (!pJid || !pJid.endsWith('@s.whatsapp.net')) continue
            try {
                const info = await conn.onWhatsApp(pJid)
                const foundLid = info?.[0]?.lid
                if (foundLid && foundLid === rawJid) {
                    lidCache.set(rawJid, pJid)
                    return pJid
                }
                // Guardar todos los que encontremos en caché
                if (foundLid) lidCache.set(foundLid, pJid)
            } catch { continue }
        }
    }

    // No se pudo resolver — devolver null para usar número del LID como fallback
    console.log(`[WELCOME] ⚠️ No se pudo resolver LID: ${rawJid}`)
    return null
}

// =================== IMÁGENES DEFAULT ===================
const DEFAULT_AVATARS = [
    'https://i.ibb.co/cK4vXkpx/image.jpg',
    'https://i.ibb.co/mVTk4pf2/image.jpg',
    'https://i.ibb.co/631z3PP/image.jpg',
    'https://i.ibb.co/QvZQRFDw/image.jpg',
    'https://i.ibb.co/mg4cFrr/image.jpg',
    'https://i.ibb.co/6JvJFQbN/image.jpg',
]

function getRandomDefault() {
    return DEFAULT_AVATARS[Math.floor(Math.random() * DEFAULT_AVATARS.length)]
}

// =================== FOTO DE PERFIL ===================
async function getFotoPerfil(conn, jid) {
    // Si el JID es válido intentar obtener foto
    if (jid && jid.endsWith('@s.whatsapp.net')) {
        try {
            const url = await conn.profilePictureUrl(jid, 'image')
            if (url) {
                const res = await fetch(url)
                if (res.ok) return Buffer.from(await res.arrayBuffer())
            }
        } catch {}
        try {
            const url = await conn.profilePictureUrl(jid, 'preview')
            if (url) {
                const res = await fetch(url)
                if (res.ok) return Buffer.from(await res.arrayBuffer())
            }
        } catch {}
    }
    // Default aleatorio
    try {
        const res = await fetch(getRandomDefault())
        if (res.ok) return Buffer.from(await res.arrayBuffer())
    } catch {}
    return null
}

// =================== FOTO DEL GRUPO ===================
async function getFotoGrupo(conn, jid) {
    try {
        const url = await conn.profilePictureUrl(jid, 'image')
        if (!url) return null
        const res = await fetch(url)
        if (!res.ok) return null
        return Buffer.from(await res.arrayBuffer())
    } catch { return null }
}

// =================== NOMBRE ===================
function getDisplayName(conn, jid, fallbackNumber) {
    if (jid) {
        const contact = conn.contacts?.[jid]
        if (contact) {
            return contact.notify || contact.name || contact.short || contact.verifiedName || null
        }
    }
    return fallbackNumber || (jid ? jid.split('@')[0] : 'Usuario')
}

// =================== RCANAL (estilo canal como play.js) ===================
async function getRcanal() {
    try {
        const thumb = await (await fetch(global.icono)).buffer()
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
                mediaUrl: global.redes || global.group,
                sourceUrl: global.redes || global.group,
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

// =================== ÍCONO PERSONA ===================
function drawPersonIcon(ctx, x, y, color) {
    ctx.save()
    ctx.fillStyle = color
    ctx.beginPath(); ctx.arc(x + 7, y + 5, 4.5, 0, Math.PI * 2); ctx.fill()
    ctx.beginPath(); ctx.arc(x + 7, y + 20, 7, Math.PI, 0); ctx.fill()
    ctx.restore()
}

// =================== GENERAR IMAGEN ===================
async function generateWelcomeImage({ userAvatar, groupPhoto, userName, memberCount, isBye = false }) {
    const canvas = createCanvas(W, H)
    const ctx = canvas.getContext('2d')
    const accent = isBye ? '#ff2255' : '#22ee77'

    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(0, 0, W, H)

    if (groupPhoto) {
        try {
            const bg = await loadImage(groupPhoto)
            ctx.globalAlpha = 0.12
            ctx.drawImage(bg, 0, 0, W, H)
            ctx.globalAlpha = 1
        } catch {}
    }

    ctx.save()
    ctx.beginPath(); ctx.rect(0, 0, 105, 105); ctx.clip()
    ctx.strokeStyle = '#1c1c1c'; ctx.lineWidth = 5
    for (let i = -105; i < 210; i += 13) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i + 105, 105); ctx.stroke()
    }
    ctx.restore()

    ctx.strokeStyle = '#181820'; ctx.lineWidth = 2
    ctx.strokeRect(1, 1, W - 2, H - 2)

    const avSize = 178, avX = 38, avY = H / 2 - avSize / 2
    const pivotX = avX + avSize / 2, pivotY = avY + avSize / 2, angle = -0.035

    ctx.save()
    ctx.translate(pivotX, pivotY); ctx.rotate(angle); ctx.translate(-pivotX, -pivotY)
    ctx.fillStyle = '#050510'; ctx.fillRect(avX, avY, avSize, avSize)
    if (userAvatar) {
        try {
            const av = await loadImage(userAvatar)
            ctx.drawImage(av, avX, avY, avSize, avSize)
        } catch {}
    }
    ctx.restore()

    const cOff = 9, cX = avX - cOff, cY = avY - cOff
    const cW = avSize + cOff * 2, cH = avSize + cOff * 2, cL = 30
    ctx.save()
    ctx.translate(pivotX, pivotY); ctx.rotate(angle); ctx.translate(-pivotX, -pivotY)
    ctx.strokeStyle = accent; ctx.lineWidth = 3
    ctx.shadowColor = accent; ctx.shadowBlur = 10; ctx.lineCap = 'butt'
    ctx.beginPath(); ctx.moveTo(cX + cL, cY);       ctx.lineTo(cX, cY);      ctx.lineTo(cX, cY + cL);      ctx.stroke()
    ctx.beginPath(); ctx.moveTo(cX + cW - cL, cY);  ctx.lineTo(cX + cW, cY); ctx.lineTo(cX + cW, cY + cL); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(cX, cY + cH - cL);  ctx.lineTo(cX, cY + cH); ctx.lineTo(cX + cL, cY + cH); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(cX + cW - cL, cY + cH); ctx.lineTo(cX + cW, cY + cH); ctx.lineTo(cX + cW, cY + cH - cL); ctx.stroke()
    ctx.restore()

    const TX = 268
    drawPersonIcon(ctx, W - 102, 11, '#bbbbbb')
    drawPersonIcon(ctx, W - 86, 11, '#bbbbbb')
    ctx.save(); ctx.font = 'bold 12px Arial'; ctx.fillStyle = '#aaaaaa'; ctx.textAlign = 'left'
    ctx.fillText('ASTA BOT', W - 72, 26); ctx.restore()

    ctx.save(); ctx.font = 'bold 80px Impact'; ctx.textAlign = 'left'
    ctx.fillStyle = isBye ? '#ff4466' : '#ffffff'
    ctx.shadowColor = 'rgba(0,0,0,0.7)'; ctx.shadowOffsetX = 3; ctx.shadowOffsetY = 3; ctx.shadowBlur = 0
    ctx.transform(1, 0, -0.06, 1, 0, 0)
    ctx.fillText(isBye ? 'GOODBYE' : 'WELCOME', TX + 5, 148)
    ctx.restore()

    const toY = 168
    ctx.save(); ctx.strokeStyle = '#404050'; ctx.lineWidth = 1.5
    ctx.beginPath(); ctx.moveTo(TX, toY - 3); ctx.lineTo(TX + 70, toY - 3); ctx.stroke()
    ctx.font = 'bold 13px Arial'; ctx.fillStyle = '#777788'; ctx.textAlign = 'left'
    ctx.fillText(' TO ', TX + 70, toY)
    ctx.beginPath(); ctx.moveTo(TX + 98, toY - 3); ctx.lineTo(TX + 168, toY - 3); ctx.stroke()
    ctx.restore()

    const displayName = userName.length > 16 ? userName.slice(0, 14) + '..' : userName
    ctx.save(); ctx.font = 'bold 26px Arial'; ctx.fillStyle = '#ddddee'; ctx.textAlign = 'left'
    ctx.fillText('@' + displayName + '..', TX, 207); ctx.restore()

    const idText = userName.length > 20 ? userName.slice(0, 18) + '...' : userName + '...'
    ctx.save(); ctx.font = '16px Arial'; ctx.fillStyle = '#444455'; ctx.textAlign = 'left'
    ctx.fillText(idText, TX, 232); ctx.restore()

    const badgeText = memberCount + 'th member'
    ctx.save(); ctx.font = 'bold 14px Arial'
    const bw = ctx.measureText(badgeText).width + 28
    ctx.fillStyle = isBye ? '#150005' : '#060f09'
    ctx.beginPath(); ctx.roundRect(TX, 250, bw, 28, 3); ctx.fill()
    ctx.strokeStyle = accent; ctx.lineWidth = 1.5
    ctx.shadowColor = accent; ctx.shadowBlur = 7; ctx.stroke()
    ctx.shadowBlur = 0; ctx.fillStyle = '#ffffff'; ctx.textAlign = 'left'
    ctx.fillText(badgeText, TX + 14, 269); ctx.restore()

    return canvas.toBuffer('image/png')
}

// =================== BUILD WELCOME ===================
export async function buildWelcome(conn, realJid, rawNumber, groupMetadata, chat) {
    const groupName = groupMetadata.subject || 'el grupo'
    const memberCount = groupMetadata.participants?.length || 0
    const numero = rawNumber || (realJid ? realJid.split('@')[0] : 'Usuario')
    const userName = getDisplayName(conn, realJid, numero)

    const [userAvatar, groupPhoto] = await Promise.all([
        getFotoPerfil(conn, realJid),
        getFotoGrupo(conn, groupMetadata.id)
    ])

    const imageBuffer = await generateWelcomeImage({ userAvatar, groupPhoto, userName, memberCount, isBye: false })

    const defaultCaption = [
        `> . ﹡ ﹟ 🎉 ׄ ⬭ *ʙɪᴇɴᴠᴇɴɪᴅᴏ/ᴀ*`,
        ``,
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜👋* ㅤ֢ㅤ⸱ㅤᯭִ*`,
        `ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴜᴀʀɪᴏ* :: @${numero}`,
        `ׅㅤ𓏸𓈒ㅤׄ *ɢʀᴜᴘᴏ* :: ${groupName}`,
        `ׅㅤ𓏸𓈒ㅤׄ *ᴍɪᴇᴍʙʀᴏ #* :: ${memberCount}`,
        ``,
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜📌* ㅤ֢ㅤ⸱ㅤᯭִ*`,
        `ׅㅤ𓏸𓈒ㅤׄ ᴛᴇ ᴅᴀᴍᴏs ʟᴀ ʙɪᴇɴᴠᴇɴɪᴅᴀ ᴀ *${groupName}* 🌟`,
        `ׅㅤ𓏸𓈒ㅤׄ ʟᴇᴇ ʟᴀs ʀᴇɢʟᴀs ʏ ᴅɪsꜰʀᴜᴛᴀ ᴄᴏɴ ɴᴏsᴏᴛʀᴏs ✨`
    ].join('\n')

    const caption = (chat.sWelcome && chat.sWelcome.trim())
        ? chat.sWelcome
            .replace(/{usuario}/g, '@' + numero).replace(/@user/gi, '@' + numero)
            .replace(/{grupo}/g, groupName).replace(/@grupo/gi, groupName)
            .replace(/{desc}/g, groupMetadata.desc || 'Sin descripción')
            .replace(/{cantidad}/g, memberCount).replace(/@count/gi, memberCount)
        : defaultCaption

    const mentions = realJid ? [realJid] : []
    return { imageBuffer, caption, mentions }
}

// =================== BUILD BYE ===================
export async function buildBye(conn, realJid, rawNumber, groupMetadata, chat) {
    const groupName = groupMetadata.subject || 'el grupo'
    const memberCount = groupMetadata.participants?.length || 0
    const numero = rawNumber || (realJid ? realJid.split('@')[0] : 'Usuario')
    const userName = getDisplayName(conn, realJid, numero)

    const [userAvatar, groupPhoto] = await Promise.all([
        getFotoPerfil(conn, realJid),
        getFotoGrupo(conn, groupMetadata.id)
    ])

    const imageBuffer = await generateWelcomeImage({ userAvatar, groupPhoto, userName, memberCount, isBye: true })

    const defaultCaption = [
        `> . ﹡ ﹟ 👋 ׄ ⬭ *ʜᴀsᴛᴀ ʟᴜᴇɢᴏ*`,
        ``,
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜😢* ㅤ֢ㅤ⸱ㅤᯭִ*`,
        `ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴜᴀʀɪᴏ* :: @${numero}`,
        `ׅㅤ𓏸𓈒ㅤׄ *ɢʀᴜᴘᴏ* :: ${groupName}`,
        `ׅㅤ𓏸𓈒ㅤׄ *ᴍɪᴇᴍʙʀᴏs* :: ${memberCount}`,
        ``,
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜💫* ㅤ֢ㅤ⸱ㅤᯭִ*`,
        `ׅㅤ𓏸𓈒ㅤׄ *${userName}* ʜᴀ ᴀʙᴀɴᴅᴏɴᴀᴅᴏ ᴇʟ ɢʀᴜᴘᴏ 💔`,
        `ׅㅤ𓏸𓈒ㅤׄ ᴇsᴘᴇʀᴀᴍᴏs ᴠᴇʀᴛᴇ ᴅᴇ ɴᴜᴇᴠᴏ ᴘʀᴏɴᴛᴏ 🌙`
    ].join('\n')

    const caption = (chat.sBye && chat.sBye.trim())
        ? chat.sBye
            .replace(/{usuario}/g, '@' + numero).replace(/@user/gi, '@' + numero)
            .replace(/{grupo}/g, groupName).replace(/@grupo/gi, groupName)
            .replace(/{desc}/g, groupMetadata.desc || 'Sin descripción')
            .replace(/{cantidad}/g, memberCount).replace(/@count/gi, memberCount)
        : defaultCaption

    const mentions = realJid ? [realJid] : []
    return { imageBuffer, caption, mentions }
}

// =================== PLUGIN PRINCIPAL ===================
let handler = m => m

handler.all = async function (m) {
    try {
        if (!m.messageStubType) return
        if (!m.chat?.endsWith('@g.us')) return

        // CRÍTICO: usar 'this' para que SubBots funcionen correctamente
        const conn = this
        if (!conn?.sendMessage) return

        if (!global.db?.data) return

        // Inicializar chat con welcome: true por defecto
        if (!global.db.data.chats[m.chat]) {
            global.db.data.chats[m.chat] = {
                isBanned: false, isMute: false,
                welcome: true,
                sWelcome: '', sBye: '',
                detect: true, modoadmin: false,
                antiLink: true, nsfw: false,
                economy: true, gacha: true
            }
        }

        const chat = global.db.data.chats[m.chat]
        if (chat.welcome === undefined || chat.welcome === null) chat.welcome = true
        if (!chat.welcome) return

        const stub = m.messageStubType
        const rawParams = m.messageStubParameters || []
        if (!rawParams.length) return

        const isJoin  = stub === 27 || stub === 31
        const isLeave = stub === 28 || stub === 32 || stub === 160

        if (!isJoin && !isLeave) return

        // Obtener metadata del grupo (con reintentos)
        let groupMetadata = null
        for (let i = 1; i <= 3; i++) {
            try {
                groupMetadata = await conn.groupMetadata(m.chat)
                if (groupMetadata?.participants) break
            } catch {
                if (i < 3) await new Promise(r => setTimeout(r, 1500 * i))
            }
        }
        if (!groupMetadata) {
            console.error('[WELCOME] No se pudo obtener groupMetadata')
            return
        }

        // Obtener rcanal una sola vez para todos los participantes
        const rcanal = await getRcanal()

        for (const rawJid of rawParams) {
            if (!rawJid) continue

            // ANTI-DUPLICADOS usando el JID crudo (antes de resolver)
            if (isDuplicate(m.chat, rawJid, stub)) {
                console.log(`[WELCOME] 🔁 Duplicado ignorado: ${rawJid} stub=${stub}`)
                continue
            }

            // Resolver LID → JID real
            const realJid = await resolverJid(conn, rawJid, groupMetadata)

            // Número de teléfono para mostrar (del JID crudo si no resolvió)
            const rawNumber = rawJid.split('@')[0]

            console.log(`[WELCOME] stub=${stub} rawJid=${rawJid} → realJid=${realJid || 'no resuelto'}`)

            try {
                if (isJoin) {
                    const { imageBuffer, caption, mentions } = await buildWelcome(
                        conn, realJid, rawNumber, groupMetadata, chat
                    )
                    await conn.sendMessage(m.chat, {
                        image: imageBuffer,
                        caption,
                        mentions,
                        contextInfo: rcanal
                    })
                    console.log(`[WELCOME] ✅ Bienvenida → ${realJid || rawJid}`)

                } else if (isLeave) {
                    const { imageBuffer, caption, mentions } = await buildBye(
                        conn, realJid, rawNumber, groupMetadata, chat
                    )
                    await conn.sendMessage(m.chat, {
                        image: imageBuffer,
                        caption,
                        mentions,
                        contextInfo: rcanal
                    })
                    console.log(`[WELCOME] ✅ Despedida → ${realJid || rawJid}`)
                }

            } catch (e) {
                console.error(`[WELCOME] Error enviando a ${rawJid}:`, e.message)
            }
        }

    } catch (e) {
        console.error('[WELCOME] Error general:', e.stack || e.message)
    }
}

export default handler