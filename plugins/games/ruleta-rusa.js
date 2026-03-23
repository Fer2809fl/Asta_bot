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

// Consecuencias del "disparo" (cosas graciosas, nada real)
const castigos = [
    'Escribe "Soy el/la más bonito/a del grupo" 5 veces 😘',
    'Cambia tu foto de perfil por una fea por 10 minutos 😂',
    'Manda un audio cantando una canción a tu elección 🎤',
    'Escribe un párrafo con los codos ⌨️',
    'Confiesa algo que nunca hayas dicho en este grupo 😳',
    'Deja que alguien del grupo escriba tu estado por 5 minutos 📝',
    'Manda la foto más fea que tengas guardada en galería 🤳',
    'Describe a alguien del grupo con solo 3 emojis 🎭',
    'Escribe el nombre de tu crush actual 💘',
    'Haz 20 sentadillas y manda un audio como prueba 🏋️',
    'Imita a alguien del grupo en audio y que adivinen 🎭',
    'Cuéntanos tu secreto más inofensivo 🤫',
    'Manda un audio contando el último chisme que sepas 🗣️',
    'Escribe "Te amo [nombre de alguien del grupo]" 💕',
    'Ponte un nombre gracioso en el grupo por 1 hora 😄',
]

if (!global.ruletaGames) global.ruletaGames = new Map()

const delay = ms => new Promise(r => setTimeout(r, ms))

const handler = async (m, { conn, command, text, args, usedPrefix, participants }) => {
    const rcanal = await getRcanal()
    const chatId = m.chat

    switch (command) {

        // ===== RULETA RUSA SOLO =====
        case 'ruleta':
        case 'rusa': {
            await m.react('🔫')
            await delay(1500)

            // 1 en 6 de probabilidad
            const disparo = Math.floor(Math.random() * 6) === 0
            const castigo = castigos[Math.floor(Math.random() * castigos.length)]
            const animacion = ['🔄', '💫', '⚡', '🌀']
            const aniRand = animacion[Math.floor(Math.random() * animacion.length)]

            if (disparo) {
                await m.react('💥')
                await conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ 🔫 ׄ ⬭ *¡ʙᴀɴɢ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜💥* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴊᴜɢᴀᴅᴏʀ* :: @${m.sender.split('@')[0]}
ׅㅤ𓏸𓈒ㅤׄ *ʀᴇꜱᴜʟᴛᴀᴅᴏ* :: 💥 *¡ᴅɪꜱᴘᴀʀᴏ!*
ׅㅤ𓏸𓈒ㅤׄ *ᴄᴀꜱᴛɪɢᴏ* :: _${castigo}_

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
                    contextInfo: {
                        mentionedJid: [m.sender],
                        ...rcanal
                    }
                }, { quoted: m })
            } else {
                await m.react('😮‍💨')
                await conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ 🔫 ׄ ⬭ *¡ꜱᴀʟᴠᴀᴅᴏ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜😅* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴊᴜɢᴀᴅᴏʀ* :: @${m.sender.split('@')[0]}
ׅㅤ𓏸𓈒ㅤׄ *ʀᴇꜱᴜʟᴛᴀᴅᴏ* :: 😮‍💨 *¡ᴄáᴍᴀʀᴀ ᴠᴀᴄíᴀ!*
ׅㅤ𓏸𓈒ㅤׄ *ᴠɪᴅᴀꜱ* :: ꜱɪɢᴜᴇꜱ ᴇɴ ᴘɪᴇ

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
                    contextInfo: {
                        mentionedJid: [m.sender],
                        ...rcanal
                    }
                }, { quoted: m })
            }
            break
        }

        // ===== RULETA GRUPAL =====
        case 'gruporuleta':
        case 'ruletagrupo': {
            if (global.ruletaGames.has(chatId)) {
                return conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ 🔫 ׄ ⬭ *¡ᴊᴜᴇɢᴏ ᴀᴄᴛɪᴠᴏ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜⚠️* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴇꜱᴛᴀᴅᴏ* :: ʏᴀ ʜᴀʏ ᴜɴᴀ ᴘᴀʀᴛɪᴅᴀ ᴀᴄᴛɪᴠᴀ\nׅㅤ𓏸𓈒ㅤׄ *ᴅɪꜱᴘᴀʀᴀʀ* :: \`${usedPrefix}disparar\`\nׅㅤ𓏸𓈒ㅤׄ *ᴛᴇʀᴍɪɴᴀʀ* :: \`${usedPrefix}stopruleta\`\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                    contextInfo: { ...rcanal }
                }, { quoted: m })
            }

            const ps = participants.filter(p => p.id !== conn.user.jid).map(p => p.id)
            if (ps.length < 2) return conn.sendMessage(m.chat, {
                text: `> . ﹡ ﹟ 🔫 ׄ ⬭ *¡ᴇʀʀᴏʀ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❌* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴇʀʀᴏʀ* :: ꜱᴇ ɴᴇᴄᴇꜱɪᴛᴀɴ ᴀʟ ᴍᴇɴᴏꜱ 2 ᴘᴇʀꜱᴏɴᴀꜱ\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                contextInfo: { ...rcanal }
            }, { quoted: m })

            // Balas: 1 real entre 6 posiciones
            const posBalas = Math.floor(Math.random() * 6)
            const jugadores = [...ps].sort(() => Math.random() - 0.5)

            global.ruletaGames.set(chatId, {
                jugadores,
                turno: 0,
                posicion: 0,
                posBala: posBalas,
                vivos: new Set(jugadores),
                iniciador: m.sender
            })

            const lista = jugadores.map((j, i) => `ׅㅤ𓏸𓈒ㅤׄ *${i + 1}.* @${j.split('@')[0]}`).join('\n')

            await conn.sendMessage(m.chat, {
                text: `> . ﹡ ﹟ 🔫 ׄ ⬭ *¡ʀᴜʟᴇᴛᴀ ʀᴜꜱᴀ ɢʀᴜᴘᴀʟ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🔫* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴊᴜɢᴀᴅᴏʀᴇꜱ* :: ${jugadores.length}
ׅㅤ𓏸𓈒ㅤׄ *ʙᴀʟᴀꜱ* :: 1 ᴅᴇ 6 🔴
ׅㅤ𓏸𓈒ㅤׄ *ʀᴇɢʟᴀꜱ* :: ᴄᴀᴅᴀ ᴜɴᴏ ᴅɪꜱᴘᴀʀᴀ ᴇɴ ᴏʀᴅᴇɴ

> ## \`ᴏʀᴅᴇɴ ᴅᴇ ᴛᴜʀɴᴏꜱ 📋\`

${lista}

ׅㅤ𓏸𓈒ㅤׄ *ᴅɪꜱᴘᴀʀᴀʀ* :: \`${usedPrefix}disparar\`
ׅㅤ𓏸𓈒ㅤׄ *@${jugadores[0].split('@')[0]}* ᴇᴍᴘɪᴇᴢᴀ ᴛú 🎯

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
                contextInfo: {
                    mentionedJid: jugadores,
                    ...rcanal
                }
            }, { quoted: m })
            break
        }

        // ===== DISPARAR EN GRUPAL =====
        case 'disparar':
        case 'jalar': {
            if (!global.ruletaGames.has(chatId)) {
                return conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ 🔫 ׄ ⬭ *¡ꜱɪɴ ᴊᴜᴇɢᴏ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❌* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ɪɴɪᴄɪᴀʀ* :: \`${usedPrefix}ruletagrupo\`\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                    contextInfo: { ...rcanal }
                }, { quoted: m })
            }

            const g = global.ruletaGames.get(chatId)
            const jugadorTurno = g.jugadores[g.turno % g.jugadores.length]

            // Verificar si es el turno del usuario
            if (m.sender !== jugadorTurno) {
                return conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ 🔫 ׄ ⬭ *¡ɴᴏ ᴇꜱ ᴛᴜ ᴛᴜʀɴᴏ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜⚠️* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴛᴜʀɴᴏ ᴅᴇ* :: @${jugadorTurno.split('@')[0]}\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                    contextInfo: {
                        mentionedJid: [jugadorTurno],
                        ...rcanal
                    }
                }, { quoted: m })
            }

            await m.react('🔫')
            await delay(2000)

            const disparo = g.posicion === g.posBala
            g.posicion++
            g.turno++

            if (disparo) {
                // Eliminado
                g.vivos.delete(m.sender)
                const castigo = castigos[Math.floor(Math.random() * castigos.length)]
                await m.react('💥')

                await conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ 🔫 ׄ ⬭ *¡ᴇʟɪᴍɪɴᴀᴅᴏ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜💥* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴇʟɪᴍɪɴᴀᴅᴏ* :: @${m.sender.split('@')[0]} 💀
ׅㅤ𓏸𓈒ㅤׄ *ᴄᴀꜱᴛɪɢᴏ* :: _${castigo}_
ׅㅤ𓏸𓈒ㅤׄ *ᴠɪᴠᴏꜱ* :: ${g.vivos.size}

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
                    contextInfo: {
                        mentionedJid: [m.sender],
                        ...rcanal
                    }
                }, { quoted: m })

                // Si queda 1 vivo → ganador
                if (g.vivos.size === 1) {
                    const ganador = [...g.vivos][0]
                    global.ruletaGames.delete(chatId)

                    return conn.sendMessage(m.chat, {
                        text: `> . ﹡ ﹟ 🔫 ׄ ⬭ *¡ꜱᴜᴘᴇʀᴠɪᴠɪᴇɴᴛᴇ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🏆* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ɢᴀɴᴀᴅᴏʀ* :: @${ganador.split('@')[0]} 🏆
ׅㅤ𓏸𓈒ㅤׄ *ᴇꜱᴛᴀᴅᴏ* :: úɴɪᴄᴏ ꜱᴜᴘᴇʀᴠɪᴠɪᴇɴᴛᴇ ✅

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
                        contextInfo: {
                            mentionedJid: [ganador],
                            ...rcanal
                        }
                    })
                }

                // Recargar revólver (nueva bala en nueva posición)
                g.posBala = Math.floor(Math.random() * 6)
                g.posicion = 0

                const siguiente = [...g.vivos][0]
                await conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ 🔫 ׄ ⬭ *¡ʀᴇᴄᴀʀɢᴀᴅᴏ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🔄* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ꜱɪɢᴜɪᴇɴᴛᴇ* :: @${siguiente.split('@')[0]}\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                    contextInfo: {
                        mentionedJid: [siguiente],
                        ...rcanal
                    }
                })

            } else {
                await m.react('😮‍💨')
                // Siguiente turno (solo entre vivos)
                const vivosArr = g.jugadores.filter(j => g.vivos.has(j))
                const siguiente = vivosArr[g.turno % vivosArr.length]

                await conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ 🔫 ׄ ⬭ *¡ꜱᴀʟᴠᴀᴅᴏ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜😅* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴊᴜɢᴀᴅᴏʀ* :: @${m.sender.split('@')[0]} 😮‍💨
ׅㅤ𓏸𓈒ㅤׄ *ʀᴇꜱᴜʟᴛᴀᴅᴏ* :: ᴄáᴍᴀʀᴀ ᴠᴀᴄíᴀ ✅
ׅㅤ𓏸𓈒ㅤׄ *ᴠɪᴠᴏꜱ* :: ${g.vivos.size}
ׅㅤ𓏸𓈒ㅤׄ *ꜱɪɢᴜɪᴇɴᴛᴇ* :: @${siguiente.split('@')[0]} 🎯

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
                    contextInfo: {
                        mentionedJid: [m.sender, siguiente],
                        ...rcanal
                    }
                }, { quoted: m })
            }
            break
        }

        // ===== STOP RULETA =====
        case 'stopruleta': {
            if (!global.ruletaGames.has(chatId)) return
            global.ruletaGames.delete(chatId)
            await conn.sendMessage(m.chat, {
                text: `> . ﹡ ﹟ 🔫 ׄ ⬭ *¡ᴊᴜᴇɢᴏ ᴛᴇʀᴍɪɴᴀᴅᴏ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🏁* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴇꜱᴛᴀᴅᴏ* :: ʀᴜʟᴇᴛᴀ ᴛᴇʀᴍɪɴᴀᴅᴀ\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                contextInfo: { ...rcanal }
            }, { quoted: m })
            break
        }
    }
}

handler.help = ['ruleta', 'rusa']
handler.tags = ['fun', 'games']
handler.command = ['ruleta', 'rusa', 'gruporuleta', 'ruletagrupo', 'disparar', 'jalar', 'stopruleta']
handler.group = true
handler.reg = true

export default handler
