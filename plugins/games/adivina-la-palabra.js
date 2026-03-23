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

// ========== BANCO DE PALABRAS POR CATEGORÍA ==========
const palabras = {
    animales: [
        { word: 'elefante', hint: '🐘 Animal grande con trompa' },
        { word: 'jirafas', hint: '🦒 Animal de cuello largo' },
        { word: 'delfin', hint: '🐬 Mamífero marino inteligente' },
        { word: 'mariposa', hint: '🦋 Insecto con alas coloridas' },
        { word: 'cocodrilo', hint: '🐊 Reptil de agua y tierra' },
        { word: 'pingüino', hint: '🐧 Ave que no vuela, vive en el frío' },
        { word: 'camello', hint: '🐪 Animal del desierto con joroba' },
        { word: 'pulpo', hint: '🐙 Tiene 8 tentáculos' },
        { word: 'canguro', hint: '🦘 Lleva a su cría en una bolsa' },
        { word: 'murciélago', hint: '🦇 Mamífero que vuela de noche' },
    ],
    paises: [
        { word: 'mexico', hint: '🇲🇽 País de tacos y mariachis' },
        { word: 'argentina', hint: '🇦🇷 País del tango y Messi' },
        { word: 'japon', hint: '🇯🇵 País del sushi y anime' },
        { word: 'australia', hint: '🇦🇺 Continente y país a la vez' },
        { word: 'canada', hint: '🇨🇦 País del maple y el hockey' },
        { word: 'brasil', hint: '🇧🇷 País del carnaval y el fútbol' },
        { word: 'egipto', hint: '🇪🇬 País de las pirámides' },
        { word: 'grecia', hint: '🇬🇷 País de los dioses olímpicos' },
        { word: 'noruega', hint: '🇳🇴 País de los fiordos y la aurora boreal' },
        { word: 'tailandia', hint: '🇹🇭 País de los templos y la comida picante' },
    ],
    comida: [
        { word: 'hamburguesa', hint: '🍔 Pan con carne y verduras' },
        { word: 'spaghetti', hint: '🍝 Pasta italiana larga y delgada' },
        { word: 'sushi', hint: '🍣 Comida japonesa con arroz y pescado' },
        { word: 'tacos', hint: '🌮 Tortilla con relleno mexicano' },
        { word: 'paella', hint: '🥘 Arroz con mariscos español' },
        { word: 'churros', hint: '🥐 Masa frita con azúcar' },
        { word: 'guacamole', hint: '🥑 Salsa mexicana de aguacate' },
        { word: 'chocolate', hint: '🍫 Dulce de cacao' },
        { word: 'empanada', hint: '🥟 Masa rellena de carne u otras cosas' },
        { word: 'barbacoa', hint: '🍖 Carne cocinada a las brasas' },
    ],
    tecnologia: [
        { word: 'computadora', hint: '💻 Máquina para procesar información' },
        { word: 'smartphone', hint: '📱 Teléfono inteligente' },
        { word: 'internet', hint: '🌐 Red mundial de información' },
        { word: 'bluetooth', hint: '📡 Tecnología de conexión inalámbrica corta' },
        { word: 'algoritmo', hint: '🔢 Conjunto de instrucciones para resolver un problema' },
        { word: 'procesador', hint: '⚙️ Cerebro de una computadora' },
        { word: 'contraseña', hint: '🔑 Clave secreta de acceso' },
        { word: 'software', hint: '💾 Programas de computadora' },
        { word: 'pixel', hint: '🔲 Punto mínimo de una imagen digital' },
        { word: 'servidor', hint: '🖥️ Computadora que da servicios a otras' },
    ],
    deportes: [
        { word: 'futbol', hint: '⚽ Deporte más popular del mundo' },
        { word: 'basketball', hint: '🏀 Se mete la pelota en un aro alto' },
        { word: 'natacion', hint: '🏊 Deporte en el agua' },
        { word: 'atletismo', hint: '🏃 Carreras y lanzamientos en pista' },
        { word: 'karate', hint: '🥋 Arte marcial japonés' },
        { word: 'ciclismo', hint: '🚴 Deporte en bicicleta' },
        { word: 'voleibol', hint: '🏐 Se golpea la pelota sobre una red' },
        { word: 'boxeo', hint: '🥊 Deporte de combate con guantes' },
        { word: 'tenis', hint: '🎾 Se golpea una pelota con una raqueta' },
        { word: 'beisbol', hint: '⚾ Bate, pelota y bases' },
    ]
}

const todasLasCategorias = Object.keys(palabras)

// Estado de partidas activas
if (!global.wordGames) global.wordGames = new Map()

// Dibuja el tablero del juego
function dibujarTablero(palabra, letrasAdivinadas, errores) {
    const maxErrores = 6
    const vidas = maxErrores - errores

    // Muñeco ahorcado ASCII adaptado
    const estado = [
        '  ___\n |   |\n |\n |\n |\n_|_',
        '  ___\n |   |\n |   😟\n |\n |\n_|_',
        '  ___\n |   |\n |   😟\n |   |\n |\n_|_',
        '  ___\n |   |\n |   😟\n |  /|\n |\n_|_',
        '  ___\n |   |\n |   😟\n |  /|\\\n |\n_|_',
        '  ___\n |   |\n |   😟\n |  /|\\\n |  /\n_|_',
        '  ___\n |   |\n |   😵\n |  /|\\\n |  / \\\n_|_',
    ]

    const mostrado = palabra.split('').map(l => {
        if (l === ' ') return ' '
        return letrasAdivinadas.includes(l) ? l.toUpperCase() : '_'
    }).join(' ')

    const vidasEmoji = '❤️'.repeat(vidas) + '🖤'.repeat(errores)

    return { estado: estado[errores], mostrado, vidasEmoji, vidas }
}

const handler = async (m, { conn, command, text, args, usedPrefix, groupMetadata }) => {
    const rcanal = await getRcanal()
    const chatId = m.chat

    switch (command) {

        // ===== INICIAR JUEGO =====
        case 'ahorcado':
        case 'adivina':
        case 'palabra': {
            if (global.wordGames.has(chatId)) {
                const g = global.wordGames.get(chatId)
                const { estado, mostrado, vidasEmoji } = dibujarTablero(g.word, g.letras, g.errores)
                return conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ 🔤 ׄ ⬭ *¡ᴊᴜᴇɢᴏ ᴇɴ ᴄᴜʀꜱᴏ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜⚠️* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴘᴀʟᴀʙʀᴀ* :: \`${mostrado}\`\nׅㅤ𓏸𓈒ㅤׄ *ᴠɪᴅᴀꜱ* :: ${vidasEmoji}\nׅㅤ𓏸𓈒ㅤׄ *ᴀᴅɪᴠɪɴᴀʀ* :: \`${usedPrefix}letra X\`\nׅㅤ𓏸𓈒ㅤׄ *ᴛᴇʀᴍɪɴᴀʀ* :: \`${usedPrefix}stopadivinanza\`\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                    contextInfo: { ...rcanal }
                }, { quoted: m })
            }

            // Elegir categoría
            const catArg = args[0]?.toLowerCase()
            const cat = todasLasCategorias.includes(catArg) ? catArg : todasLasCategorias[Math.floor(Math.random() * todasLasCategorias.length)]
            const pool = palabras[cat]
            const elegida = pool[Math.floor(Math.random() * pool.length)]

            global.wordGames.set(chatId, {
                word: elegida.word,
                hint: elegida.hint,
                categoria: cat,
                letras: [],
                errores: 0,
                iniciador: m.sender,
                intentos: 0,
                maxErrores: 6
            })

            const { estado, mostrado, vidasEmoji } = dibujarTablero(elegida.word, [], 0)

            await conn.sendMessage(m.chat, {
                text: `> . ﹡ ﹟ 🔤 ׄ ⬭ *¡ᴀʜᴏʀᴄᴀᴅᴏ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🔤* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴄᴀᴛᴇɢᴏʀíᴀ* :: ${cat.toUpperCase()}
ׅㅤ𓏸𓈒ㅤׄ *ᴘɪꜱᴛᴀ* :: ${elegida.hint}
ׅㅤ𓏸𓈒ㅤׄ *ʟᴇᴛʀᴀꜱ* :: ${elegida.word.length} letras
ׅㅤ𓏸𓈒ㅤׄ *ᴠɪᴅᴀꜱ* :: ${vidasEmoji}

> ## \`ᴛᴀʙʟᴇʀᴏ 📋\`

\`\`\`${estado}\`\`\`

> ## \`ᴘᴀʟᴀʙʀᴀ 🔡\`

\`${mostrado}\`

ׅㅤ𓏸𓈒ㅤׄ *ꜱᴜɢɪᴇʀᴇ ᴜɴᴀ ʟᴇᴛʀᴀ* :: \`${usedPrefix}letra A\`
ׅㅤ𓏸𓈒ㅤׄ *ᴀᴅɪᴠɪɴᴀ ᴛᴏᴅᴀ* :: \`${usedPrefix}respuesta PALABRA\`

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
                contextInfo: { ...rcanal }
            }, { quoted: m })
            break
        }

        // ===== ADIVINAR LETRA =====
        case 'letra':
        case 'l': {
            if (!global.wordGames.has(chatId)) {
                return conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ 🔤 ׄ ⬭ *¡ꜱɪɴ ᴊᴜᴇɢᴏ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❌* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴇꜱᴛᴀᴅᴏ* :: ɴᴏ ʜᴀʏ ᴊᴜᴇɢᴏ ᴀᴄᴛɪᴠᴏ\nׅㅤ𓏸𓈒ㅤׄ *ɪɴɪᴄɪᴀʀ* :: \`${usedPrefix}ahorcado\`\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                    contextInfo: { ...rcanal }
                }, { quoted: m })
            }

            const letra = text?.toLowerCase().trim().charAt(0)
            if (!letra || !/[a-záéíóúüñ]/.test(letra)) {
                return conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ 🔤 ׄ ⬭ *¡ᴇʀʀᴏʀ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❌* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴇʀʀᴏʀ* :: ɪɴɢʀᴇꜱᴀ ᴜɴᴀ ʟᴇᴛʀᴀ ᴠáʟɪᴅᴀ\nׅㅤ𓏸𓈒ㅤׄ *ᴇᴊᴇᴍᴘʟᴏ* :: \`${usedPrefix}letra A\`\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                    contextInfo: { ...rcanal }
                }, { quoted: m })
            }

            const g = global.wordGames.get(chatId)

            if (g.letras.includes(letra)) {
                return conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ 🔤 ׄ ⬭ *¡ʏᴀ ɪɴᴛᴇɴᴛᴀᴅᴀ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜⚠️* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ʟᴇᴛʀᴀ* :: \`${letra.toUpperCase()}\` ʏᴀ ꜰᴜᴇ ᴜꜱᴀᴅᴀ\nׅㅤ𓏸𓈒ㅤׄ *ᴜꜱᴀᴅᴀꜱ* :: \`${g.letras.join(', ').toUpperCase()}\`\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                    contextInfo: { ...rcanal }
                }, { quoted: m })
            }

            g.letras.push(letra)
            g.intentos++

            const acierto = g.word.includes(letra)
            if (!acierto) g.errores++

            const { estado, mostrado, vidasEmoji, vidas } = dibujarTablero(g.word, g.letras, g.errores)

            // Revisar si ganó
            const gano = g.word.split('').every(l => g.letras.includes(l) || l === ' ')

            if (gano) {
                global.wordGames.delete(chatId)
                return conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ 🔤 ׄ ⬭ *¡ɢᴀɴᴀꜱᴛᴇ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🎉* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴊᴜɢᴀᴅᴏʀ* :: @${m.sender.split('@')[0]}
ׅㅤ𓏸𓈒ㅤׄ *ᴘᴀʟᴀʙʀᴀ* :: \`${g.word.toUpperCase()}\` ✅
ׅㅤ𓏸𓈒ㅤׄ *ɪɴᴛᴇɴᴛᴏꜱ* :: ${g.intentos}
ׅㅤ𓏸𓈒ㅤׄ *ᴇʀʀᴏʀᴇꜱ* :: ${g.errores}/6
ׅㅤ𓏸𓈒ㅤׄ *ᴠɪᴅᴀꜱ* :: ${vidasEmoji}

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
                    contextInfo: {
                        mentionedJid: [m.sender],
                        ...rcanal
                    }
                }, { quoted: m })
            }

            // Revisar si perdió
            if (vidas <= 0) {
                global.wordGames.delete(chatId)
                return conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ 🔤 ׄ ⬭ *¡ᴘᴇʀᴅɪꜱᴛᴇ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜😵* ㅤ֢ㅤ⸱ㅤᯭִ*

\`\`\`${estado}\`\`\`

ׅㅤ𓏸𓈒ㅤׄ *ᴘᴀʟᴀʙʀᴀ ᴇʀᴀ* :: \`${g.word.toUpperCase()}\`
ׅㅤ𓏸𓈒ㅤׄ *ᴘɪꜱᴛᴀ* :: ${g.hint}
ׅㅤ𓏸𓈒ㅤׄ *ɪɴᴛᴇɴᴛᴀ* :: \`${usedPrefix}ahorcado\` ᴘᴀʀᴀ ᴊᴜɢᴀʀ ᴏᴛʀᴀ ᴠᴇᴢ

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
                    contextInfo: { ...rcanal }
                }, { quoted: m })
            }

            // Continúa el juego
            const emoji = acierto ? '✅' : '❌'
            const msg = acierto
                ? `¡La letra *${letra.toUpperCase()}* está en la palabra!`
                : `La letra *${letra.toUpperCase()}* no está en la palabra.`

            await conn.sendMessage(m.chat, {
                text: `> . ﹡ ﹟ 🔤 ׄ ⬭ *¡${acierto ? 'ᴀᴄɪᴇʀᴛᴏ' : 'ᴇʀʀᴏʀ'}!* ${emoji}

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜${acierto ? '✅' : '❌'}* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ʟᴇᴛʀᴀ* :: \`${letra.toUpperCase()}\` ${emoji}
ׅㅤ𓏸𓈒ㅤׄ *ᴠɪᴅᴀꜱ* :: ${vidasEmoji}
ׅㅤ𓏸𓈒ㅤׄ *ᴜꜱᴀᴅᴀꜱ* :: \`${g.letras.join(' ').toUpperCase()}\`

> ## \`ᴛᴀʙʟᴇʀᴏ 📋\`

\`\`\`${estado}\`\`\`

\`${mostrado}\`

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
                contextInfo: { ...rcanal }
            }, { quoted: m })
            break
        }

        // ===== RESPUESTA COMPLETA =====
        case 'respuesta':
        case 'responder': {
            if (!global.wordGames.has(chatId)) {
                return conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ 🔤 ׄ ⬭ *¡ꜱɪɴ ᴊᴜᴇɢᴏ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❌* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ɪɴɪᴄɪᴀʀ* :: \`${usedPrefix}ahorcado\`\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                    contextInfo: { ...rcanal }
                }, { quoted: m })
            }

            if (!text) return conn.sendMessage(m.chat, {
                text: `> . ﹡ ﹟ 🔤 ׄ ⬭ *¡ᴜsᴏ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❌* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴜsᴏ* :: \`${usedPrefix}respuesta PALABRA\`\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                contextInfo: { ...rcanal }
            }, { quoted: m })

            const g = global.wordGames.get(chatId)
            const intento = text.toLowerCase().trim()

            if (intento === g.word) {
                global.wordGames.delete(chatId)
                await conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ 🔤 ׄ ⬭ *¡ᴄᴏʀʀᴇᴄᴛᴏ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🎉* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴊᴜɢᴀᴅᴏʀ* :: @${m.sender.split('@')[0]}
ׅㅤ𓏸𓈒ㅤׄ *ᴘᴀʟᴀʙʀᴀ* :: \`${g.word.toUpperCase()}\` ✅
ׅㅤ𓏸𓈒ㅤׄ *ᴍᴏᴅᴏ* :: ʀᴇꜱᴘᴜᴇꜱᴛᴀ ᴅɪʀᴇᴄᴛᴀ ⚡

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
                    contextInfo: {
                        mentionedJid: [m.sender],
                        ...rcanal
                    }
                }, { quoted: m })
            } else {
                g.errores++
                g.intentos++
                const { vidasEmoji, vidas, estado, mostrado } = dibujarTablero(g.word, g.letras, g.errores)
                if (vidas <= 0) {
                    global.wordGames.delete(chatId)
                    return conn.sendMessage(m.chat, {
                        text: `> . ﹡ ﹟ 🔤 ׄ ⬭ *¡ᴘᴇʀᴅɪꜱᴛᴇ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜😵* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ɪɴᴛᴇɴᴛᴀꜱᴛᴇ* :: \`${intento.toUpperCase()}\`\nׅㅤ𓏸𓈒ㅤׄ *ᴘᴀʟᴀʙʀᴀ ᴇʀᴀ* :: \`${g.word.toUpperCase()}\`\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                        contextInfo: { ...rcanal }
                    }, { quoted: m })
                }
                await conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ 🔤 ׄ ⬭ *¡ɪɴᴄᴏʀʀᴇᴄᴛᴏ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❌* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ɪɴᴛᴇɴᴛᴀꜱᴛᴇ* :: \`${intento.toUpperCase()}\`\nׅㅤ𓏸𓈒ㅤׄ *ᴠɪᴅᴀꜱ* :: ${vidasEmoji}\nׅㅤ𓏸𓈒ㅤׄ *ᴘᴀʟᴀʙʀᴀ* :: \`${mostrado}\`\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                    contextInfo: { ...rcanal }
                }, { quoted: m })
            }
            break
        }

        // ===== PISTA =====
        case 'pista': {
            if (!global.wordGames.has(chatId)) return
            const g = global.wordGames.get(chatId)
            await conn.sendMessage(m.chat, {
                text: `> . ﹡ ﹟ 🔤 ׄ ⬭ *¡ᴘɪꜱᴛᴀ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜💡* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴘɪꜱᴛᴀ* :: ${g.hint}\nׅㅤ𓏸𓈒ㅤׄ *ᴄᴀᴛᴇɢᴏʀíᴀ* :: ${g.categoria.toUpperCase()}\nׅㅤ𓏸𓈒ㅤׄ *ʟᴇᴛʀᴀꜱ* :: ${g.word.length}\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                contextInfo: { ...rcanal }
            }, { quoted: m })
            break
        }

        // ===== TERMINAR =====
        case 'stopadivinanza':
        case 'stopahor': {
            if (!global.wordGames.has(chatId)) return
            const g = global.wordGames.get(chatId)
            global.wordGames.delete(chatId)
            await conn.sendMessage(m.chat, {
                text: `> . ﹡ ﹟ 🔤 ׄ ⬭ *¡ᴊᴜᴇɢᴏ ᴛᴇʀᴍɪɴᴀᴅᴏ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🏁* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴘᴀʟᴀʙʀᴀ ᴇʀᴀ* :: \`${g.word.toUpperCase()}\`\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                contextInfo: { ...rcanal }
            }, { quoted: m })
            break
        }
    }
}

handler.help = ['ahorcado', 'adivina', 'palabra']
handler.tags = ['fun', 'games']
handler.command = ['ahorcado', 'adivina', 'palabra', 'letra', 'l', 'respuesta', 'responder', 'pista', 'stopadivinanza', 'stopahor']
handler.group = true
handler.reg = true

export default handler
