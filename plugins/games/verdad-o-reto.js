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

// ========== BANCO DE PREGUNTAS Y RETOS ==========
const verdades = [
    '¿Cuál es tu mayor vergüenza?',
    '¿Alguna vez le has mentido a alguien en este grupo?',
    '¿Tienes crush en alguien de aquí?',
    '¿Cuál es la cosa más rara que has buscado en internet?',
    '¿Cuál es tu peor defecto?',
    '¿Has llorado por una película o serie?',
    '¿Cuál fue tu peor calificación en la escuela?',
    '¿A quién de este grupo bloquearías primero?',
    '¿Has fingido estar enfermo para no ir a clases o al trabajo?',
    '¿Cuál es tu mayor miedo?',
    '¿Tienes algún hábito secreto que nadie sabe?',
    '¿Has chismeado sobre alguien de este chat?',
    '¿Cuánto tiempo llevas sin bañarte?',
    '¿Has tenido un sueño raro con alguien de este grupo?',
    '¿Cuál es la mentira más grande que has dicho?',
    '¿Has stalkeado a alguien en redes sociales?',
    '¿Cuál es tu peor recuerdo de la escuela?',
    '¿Cuántos ex tienes?',
    '¿Has mandado un mensaje al chat equivocado?',
    '¿Tienes algo que nunca le has contado a tus papás?',
    '¿Cuál es la cosa más estúpida que has hecho por amor?',
    '¿Alguna vez has copiado en un examen?',
    '¿Qué canción escuchas cuando estás triste?',
    '¿Has fingido que no viste el mensaje de alguien para no contestar?',
    '¿Cuál es tu snack favorito que comes a escondidas?',
    '¿Has hablado mal de alguien de este grupo?',
    '¿Cuál es tu mayor inseguridad?',
    '¿Has llegado tarde a algo importante?',
    '¿Tienes deudas?',
    '¿Qué es lo más creepy que has hecho?',
]

const retos = [
    'Escribe un mensaje de amor al último contacto que te escribió.',
    'Cambia tu foto de perfil por una fea por 5 minutos.',
    'Manda un audio cantando una canción.',
    'Cuéntales un secreto que nadie sabe.',
    'Escribe algo gracioso en tu estado de WhatsApp por 10 minutos.',
    'Imita a alguien del grupo y que adivinen quién es.',
    'Escribe un poema de amor para alguien del grupo.',
    'Deja que alguien del grupo escriba un mensaje en tu nombre.',
    'Manda un meme de ti mismo hecho a mano.',
    'Di los nombres de tus ex en orden.',
    'Escribe "Me gusta la piña en la pizza" en tu estado por 5 minutos.',
    'Haz 10 sentadillas y manda una foto como prueba.',
    'Escribe una confesión que nunca hayas dicho en voz alta.',
    'Manda tu foto más fea de la galería.',
    'Llama a alguien al azar de tus contactos y canta "feliz cumpleaños".',
    'Escribe con los codos un párrafo completo.',
    'Manda un audio hablando como bebé por 1 minuto.',
    'Cuenta un chiste y si nadie se ríe, haz otro reto.',
    'Cambia tu nombre del grupo por uno que elija otro participante.',
    'Manda el último meme que tienes guardado.',
    'Haz una imitación de un animal en audio.',
    'Escribe un mensaje de "te amo" a tu contacto número 5.',
    'Manda una selfie con cara de susto.',
    'Cuéntanos el chisme más reciente que sabes.',
    'Describe a alguien del grupo con solo emojis.',
    'Manda un audio de 30 segundos hablando sin parar.',
    'Escribe el nombre de tu crush actual.',
    'Haz una reverencia y manda foto como prueba.',
    'Escribe en el chat tu contraseña favorita (sin las que uses de verdad).',
    'Manda un audio contando un chiste malo.',
]

// ========== ESTADO DEL JUEGO ==========
// Guardamos partidas activas por chat
if (!global.vorGames) global.vorGames = new Map()

const handler = async (m, { conn, command, text, args, usedPrefix, participants, groupMetadata }) => {
    const rcanal = await getRcanal()
    const chatId = m.chat

    const pick = arr => arr[Math.floor(Math.random() * arr.length)]

    switch (command) {

        // ===== VERDAD =====
        case 'verdad':
        case 'truth': {
            const pregunta = pick(verdades)
            const mentionedJid = await m.mentionedJid
            const target = mentionedJid?.[0] || (m.quoted ? await m.quoted.sender : m.sender)
            const nombre = await conn.getName(target).catch(() => target.split('@')[0])

            await conn.sendMessage(m.chat, {
                text: `> . ﹡ ﹟ 🎭 ׄ ⬭ *¡ᴠᴇʀᴅᴀᴅ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🎭* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴊᴜɢᴀᴅᴏʀ* :: @${target.split('@')[0]}
ׅㅤ𓏸𓈒ㅤׄ *ᴛɪᴘᴏ* :: 🟢 ᴠᴇʀᴅᴀᴅ

> ## \`ᴘʀᴇɢᴜɴᴛᴀ 🎯\`

_${pregunta}_

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
                contextInfo: {
                    mentionedJid: [target],
                    ...rcanal
                }
            }, { quoted: m })
            break
        }

        // ===== RETO =====
        case 'reto':
        case 'dare': {
            const retoTexto = pick(retos)
            const mentionedJid = await m.mentionedJid
            const target = mentionedJid?.[0] || (m.quoted ? await m.quoted.sender : m.sender)

            await conn.sendMessage(m.chat, {
                text: `> . ﹡ ﹟ 🎭 ׄ ⬭ *¡ʀᴇᴛᴏ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🎯* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴊᴜɢᴀᴅᴏʀ* :: @${target.split('@')[0]}
ׅㅤ𓏸𓈒ㅤׄ *ᴛɪᴘᴏ* :: 🔴 ʀᴇᴛᴏ

> ## \`ᴛᴜ ʀᴇᴛᴏ 🔥\`

_${retoTexto}_

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
                contextInfo: {
                    mentionedJid: [target],
                    ...rcanal
                }
            }, { quoted: m })
            break
        }

        // ===== VERDAD O RETO (aleatorio) =====
        case 'vor':
        case 'votd':
        case 'truthordare': {
            const mentionedJid = await m.mentionedJid
            const target = mentionedJid?.[0] || (m.quoted ? await m.quoted.sender : m.sender)
            const esVerdad = Math.random() < 0.5
            const contenido = esVerdad ? pick(verdades) : pick(retos)
            const emoji = esVerdad ? '🟢' : '🔴'
            const tipo = esVerdad ? 'ᴠᴇʀᴅᴀᴅ' : 'ʀᴇᴛᴏ'
            const titulo = esVerdad ? 'ᴘʀᴇɢᴜɴᴛᴀ 🎯' : 'ᴛᴜ ʀᴇᴛᴏ 🔥'

            await conn.sendMessage(m.chat, {
                text: `> . ﹡ ﹟ 🎭 ׄ ⬭ *¡ᴠᴇʀᴅᴀᴅ ᴏ ʀᴇᴛᴏ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🎭* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴊᴜɢᴀᴅᴏʀ* :: @${target.split('@')[0]}
ׅㅤ𓏸𓈒ㅤׄ *ᴛᴇ ᴛᴏᴄᴀ* :: ${emoji} *${tipo.toUpperCase()}*

> ## \`${titulo}\`

_${contenido}_

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
                contextInfo: {
                    mentionedJid: [target],
                    ...rcanal
                }
            }, { quoted: m })
            break
        }

        // ===== INICIAR JUEGO EN RONDA =====
        case 'juegouvor':
        case 'iniciarvor': {
            if (global.vorGames.has(chatId)) {
                return conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ 🎭 ׄ ⬭ *¡ᴊᴜᴇɢᴏ ᴇɴ ᴄᴜʀꜱᴏ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜⚠️* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴇꜱᴛᴀᴅᴏ* :: ʏᴀ ʜᴀʏ ᴜɴ ᴊᴜᴇɢᴏ ᴀᴄᴛɪᴠᴏ\nׅㅤ𓏸𓈒ㅤׄ *ᴛᴇʀᴍɪɴᴀʀ* :: \`${usedPrefix}terminarvor\`\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                    contextInfo: { ...rcanal }
                }, { quoted: m })
            }

            const ps = participants.map(p => p.id).filter(p => p !== conn.user.jid)
            if (ps.length < 2) return conn.sendMessage(m.chat, {
                text: `> . ﹡ ﹟ 🎭 ׄ ⬭ *¡ᴇʀʀᴏʀ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❌* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴇʀʀᴏʀ* :: ɴᴇᴄᴇꜱɪᴛᴀꜱ ᴀʟ ᴍᴇɴᴏꜱ 2 ᴊᴜɢᴀᴅᴏʀᴇꜱ\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                contextInfo: { ...rcanal }
            }, { quoted: m })

            // Mezclar jugadores
            const jugadores = [...ps].sort(() => Math.random() - 0.5)
            global.vorGames.set(chatId, { jugadores, turno: 0, ronda: 1 })

            const listaJugadores = jugadores.map((j, i) => `ׅㅤ𓏸𓈒ㅤׄ *${i + 1}.* @${j.split('@')[0]}`).join('\n')

            await conn.sendMessage(m.chat, {
                text: `> . ﹡ ﹟ 🎭 ׄ ⬭ *¡ᴊᴜᴇɢᴏ ɪɴɪᴄɪᴀᴅᴏ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🎮* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴊᴜɢᴀᴅᴏʀᴇꜱ* :: ${jugadores.length}
ׅㅤ𓏸𓈒ㅤׄ *ᴍᴏᴅᴏ* :: ᴠᴇʀᴅᴀᴅ ᴏ ʀᴇᴛᴏ 🎭

> ## \`ᴏʀᴅᴇɴ ᴅᴇ ᴛᴜʀɴᴏꜱ 📋\`

${listaJugadores}

ׅㅤ𓏸𓈒ㅤׄ *ꜱɪɢᴜɪᴇɴᴛᴇ* :: \`${usedPrefix}girar\` ᴘᴀʀᴀ ᴇᴍᴘᴇᴢᴀʀ
ׅㅤ𓏸𓈒ㅤׄ *ᴛᴇʀᴍɪɴᴀʀ* :: \`${usedPrefix}terminarvor\`

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
                contextInfo: {
                    mentionedJid: jugadores,
                    ...rcanal
                }
            }, { quoted: m })
            break
        }

        // ===== GIRAR (siguiente turno) =====
        case 'girar':
        case 'spin': {
            if (!global.vorGames.has(chatId)) {
                return conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ 🎭 ׄ ⬭ *¡ꜱɪɴ ᴊᴜᴇɢᴏ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❌* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴇꜱᴛᴀᴅᴏ* :: ɴᴏ ʜᴀʏ ᴊᴜᴇɢᴏ ᴀᴄᴛɪᴠᴏ\nׅㅤ𓏸𓈒ㅤׄ *ɪɴɪᴄɪᴀʀ* :: \`${usedPrefix}juegouvor\`\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                    contextInfo: { ...rcanal }
                }, { quoted: m })
            }

            const game = global.vorGames.get(chatId)
            const jugadorActual = game.jugadores[game.turno % game.jugadores.length]
            const esVerdad = Math.random() < 0.5
            const contenido = esVerdad ? pick(verdades) : pick(retos)
            const emoji = esVerdad ? '🟢' : '🔴'
            const tipo = esVerdad ? 'ᴠᴇʀᴅᴀᴅ' : 'ʀᴇᴛᴏ'
            const titulo = esVerdad ? 'ᴘʀᴇɢᴜɴᴛᴀ 🎯' : 'ᴛᴜ ʀᴇᴛᴏ 🔥'

            // Avanzar turno
            game.turno++
            if (game.turno % game.jugadores.length === 0) game.ronda++

            // Siguiente jugador
            const siguiente = game.jugadores[game.turno % game.jugadores.length]

            await conn.sendMessage(m.chat, {
                text: `> . ﹡ ﹟ 🎭 ׄ ⬭ *¡ᴛᴜʀɴᴏ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🎭* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴊᴜɢᴀᴅᴏʀ* :: @${jugadorActual.split('@')[0]}
ׅㅤ𓏸𓈒ㅤׄ *ᴛᴇ ᴛᴏᴄᴀ* :: ${emoji} *${tipo.toUpperCase()}*
ׅㅤ𓏸𓈒ㅤׄ *ʀᴏɴᴅᴀ* :: ${game.ronda}

> ## \`${titulo}\`

_${contenido}_

> ## \`ꜱɪɢᴜɪᴇɴᴛᴇ ᴛᴜʀɴᴏ 👇\`

ׅㅤ𓏸𓈒ㅤׄ *@${siguiente.split('@')[0]}* ᴜꜱᴀ \`${usedPrefix}girar\` ᴄᴜᴀɴᴅᴏ ᴛᴇ ᴛᴏǫᴜᴇ

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
                contextInfo: {
                    mentionedJid: [jugadorActual, siguiente],
                    ...rcanal
                }
            }, { quoted: m })
            break
        }

        // ===== TERMINAR JUEGO =====
        case 'terminarvor':
        case 'stopvor': {
            if (!global.vorGames.has(chatId)) {
                return conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ 🎭 ׄ ⬭ *¡ꜱɪɴ ᴊᴜᴇɢᴏ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❌* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴇꜱᴛᴀᴅᴏ* :: ɴᴏ ʜᴀʏ ᴊᴜᴇɢᴏ ᴀᴄᴛɪᴠᴏ\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                    contextInfo: { ...rcanal }
                }, { quoted: m })
            }
            const game = global.vorGames.get(chatId)
            global.vorGames.delete(chatId)

            await conn.sendMessage(m.chat, {
                text: `> . ﹡ ﹟ 🎭 ׄ ⬭ *¡ᴊᴜᴇɢᴏ ᴛᴇʀᴍɪɴᴀᴅᴏ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🏁* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ʀᴏɴᴅᴀꜱ ᴊᴜɢᴀᴅᴀꜱ* :: ${game.ronda}
ׅㅤ𓏸𓈒ㅤׄ *ᴛᴜʀɴᴏꜱ ᴛᴏᴛᴀʟᴇꜱ* :: ${game.turno}
ׅㅤ𓏸𓈒ㅤׄ *ᴇꜱᴛᴀᴅᴏ* :: ᴊᴜᴇɢᴏ ꜰɪɴᴀʟɪᴢᴀᴅᴏ ✅

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
                contextInfo: { ...rcanal }
            }, { quoted: m })
            break
        }

        // ===== MENÚ / AYUDA =====
        default: {
            await conn.sendMessage(m.chat, {
                text: `> . ﹡ ﹟ 🎭 ׄ ⬭ *¡ᴠᴇʀᴅᴀᴅ ᴏ ʀᴇᴛᴏ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🎭* ㅤ֢ㅤ⸱ㅤᯭִ*

> ## \`ᴄᴏᴍᴀɴᴅᴏꜱ ꜱᴏʟᴏ 📋\`

ׅㅤ𓏸𓈒ㅤׄ *#verdad* [@user] :: ᴘʀᴇɢᴜɴᴛᴀ ᴀʟᴇᴀᴛᴏʀɪᴀ
ׅㅤ𓏸𓈒ㅤׄ *#reto* [@user] :: ʀᴇᴛᴏ ᴀʟᴇᴀᴛᴏʀɪᴏ
ׅㅤ𓏸𓈒ㅤׄ *#vor* [@user] :: ᴀʟᴇᴀᴛᴏʀɪᴏ (ᴠᴇʀᴅᴀᴅ ᴏ ʀᴇᴛᴏ)

> ## \`ᴍᴏᴅᴏ ᴊᴜᴇɢᴏ ᴇɴ ɢʀᴜᴘᴏ 🎮\`

ׅㅤ𓏸𓈒ㅤׄ *#juegouvor* :: ɪɴɪᴄɪᴀʀ ᴊᴜᴇɢᴏ ᴇɴ ʀᴏɴᴅᴀꜱ
ׅㅤ𓏸𓈒ㅤׄ *#girar* :: ꜱɪɢᴜɪᴇɴᴛᴇ ᴛᴜʀɴᴏ
ׅㅤ𓏸𓈒ㅤׄ *#terminarvor* :: ᴛᴇʀᴍɪɴᴀʀ ᴊᴜᴇɢᴏ

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
                contextInfo: { ...rcanal }
            }, { quoted: m })
        }
    }
}

handler.help = ['verdad', 'reto', 'vor']
handler.tags = ['fun', 'games']
handler.command = ['verdad', 'truth', 'reto', 'dare', 'vor', 'votd', 'truthordare', 'juegouvor', 'iniciarvor', 'girar', 'spin', 'terminarvor', 'stopvor']
handler.group = true
handler.reg = true

export default handler
