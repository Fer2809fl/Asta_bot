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

// ========== BANCO DE PREGUNTAS ==========
const preguntas = [
    { pregunta: '¿Cuál es el planeta más grande del sistema solar?', opciones: ['Saturno', 'Júpiter', 'Neptuno', 'Urano'], correcta: 1, categoria: '🌌 Ciencia' },
    { pregunta: '¿En qué año llegó el hombre a la Luna?', opciones: ['1965', '1972', '1969', '1971'], correcta: 2, categoria: '🚀 Historia' },
    { pregunta: '¿Cuántos huesos tiene el cuerpo humano adulto?', opciones: ['206', '213', '198', '220'], correcta: 0, categoria: '🧬 Biología' },
    { pregunta: '¿Cuál es el país más grande del mundo por superficie?', opciones: ['China', 'Canadá', 'EE.UU.', 'Rusia'], correcta: 3, categoria: '🌍 Geografía' },
    { pregunta: '¿Quién escribió "Cien Años de Soledad"?', opciones: ['Pablo Neruda', 'Mario Vargas Llosa', 'Gabriel García Márquez', 'Jorge Luis Borges'], correcta: 2, categoria: '📚 Literatura' },
    { pregunta: '¿Cuál es el océano más grande del mundo?', opciones: ['Atlántico', 'Índico', 'Ártico', 'Pacífico'], correcta: 3, categoria: '🌊 Geografía' },
    { pregunta: '¿Cuántos colores tiene el arcoíris?', opciones: ['5', '6', '7', '8'], correcta: 2, categoria: '🌈 Ciencia' },
    { pregunta: '¿En qué país está la Torre Eiffel?', opciones: ['Italia', 'España', 'Francia', 'Alemania'], correcta: 2, categoria: '🗼 Cultura' },
    { pregunta: '¿Cuál es el elemento químico con símbolo Au?', opciones: ['Plata', 'Cobre', 'Hierro', 'Oro'], correcta: 3, categoria: '⚗️ Química' },
    { pregunta: '¿Cuántos jugadores tiene un equipo de fútbol en cancha?', opciones: ['9', '10', '11', '12'], correcta: 2, categoria: '⚽ Deportes' },
    { pregunta: '¿Cuál es la capital de Japón?', opciones: ['Osaka', 'Tokio', 'Kioto', 'Hiroshima'], correcta: 1, categoria: '🌍 Geografía' },
    { pregunta: '¿Cuánto mide una milla en kilómetros?', opciones: ['1.2', '1.6', '2.0', '1.4'], correcta: 1, categoria: '📐 Matemáticas' },
    { pregunta: '¿Qué animal es el más rápido en tierra?', opciones: ['León', 'Guepardo', 'Tigre', 'Caballo'], correcta: 1, categoria: '🐆 Animales' },
    { pregunta: '¿Cuánto dura un partido de fútbol regular?', opciones: ['80 min', '90 min', '100 min', '85 min'], correcta: 1, categoria: '⚽ Deportes' },
    { pregunta: '¿Cuál es el metal más abundante en la corteza terrestre?', opciones: ['Hierro', 'Aluminio', 'Cobre', 'Silicio'], correcta: 1, categoria: '⚗️ Química' },
    { pregunta: '¿Qué planeta es conocido como el planeta rojo?', opciones: ['Venus', 'Júpiter', 'Marte', 'Mercurio'], correcta: 2, categoria: '🌌 Ciencia' },
    { pregunta: '¿En qué continente está Egipto?', opciones: ['Asia', 'Europa', 'África', 'Oceanía'], correcta: 2, categoria: '🌍 Geografía' },
    { pregunta: '¿Cuántos lados tiene un hexágono?', opciones: ['5', '6', '7', '8'], correcta: 1, categoria: '📐 Matemáticas' },
    { pregunta: '¿Quién pintó la Mona Lisa?', opciones: ['Miguel Ángel', 'Rafael', 'Leonardo Da Vinci', 'Botticelli'], correcta: 2, categoria: '🎨 Arte' },
    { pregunta: '¿Cuál es el idioma más hablado en el mundo?', opciones: ['Inglés', 'Español', 'Hindi', 'Mandarín'], correcta: 3, categoria: '🗣️ Cultura' },
    { pregunta: '¿Cuántos continentes hay en el mundo?', opciones: ['5', '6', '7', '8'], correcta: 2, categoria: '🌍 Geografía' },
    { pregunta: '¿Cuál es el hueso más largo del cuerpo humano?', opciones: ['Húmero', 'Tibia', 'Fémur', 'Radio'], correcta: 2, categoria: '🧬 Biología' },
    { pregunta: '¿Qué país ganó el primer Mundial de Fútbol en 1930?', opciones: ['Brasil', 'Argentina', 'Italia', 'Uruguay'], correcta: 3, categoria: '⚽ Deportes' },
    { pregunta: '¿A qué velocidad viaja la luz?', opciones: ['200,000 km/s', '300,000 km/s', '250,000 km/s', '350,000 km/s'], correcta: 1, categoria: '🔬 Física' },
    { pregunta: '¿Cuántos años dura un período presidencial en México?', opciones: ['4 años', '5 años', '6 años', '7 años'], correcta: 2, categoria: '🏛️ Política' },
]

// Estado de partidas activas
if (!global.triviaGames) global.triviaGames = new Map()

// Temporizadores activos por chat
if (!global.triviaTimers) global.triviaTimers = new Map()

const TIEMPO_RESPUESTA = 30000 // 30 segundos

const handler = async (m, { conn, command, text, args, usedPrefix }) => {
    const rcanal = await getRcanal()
    const chatId = m.chat
    const letras = ['A', 'B', 'C', 'D']

    switch (command) {

        // ===== INICIAR TRIVIA =====
        case 'trivia':
        case 'pregunta': {
            if (global.triviaGames.has(chatId)) {
                const g = global.triviaGames.get(chatId)
                const p = g.preguntaActual
                const opciones = p.opciones.map((o, i) => `ׅㅤ𓏸𓈒ㅤׄ *${letras[i]})* ${o}`).join('\n')
                return conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ 🧠 ׄ ⬭ *¡ᴘʀᴇɢᴜɴᴛᴀ ᴀᴄᴛɪᴠᴀ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜⚠️* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴘʀᴇɢᴜɴᴛᴀ* :: ${p.pregunta}\n\n${opciones}\n\nׅㅤ𓏸𓈒ㅤׄ *ʀᴇꜱᴘᴏɴᴅᴇ* :: \`${usedPrefix}resp A/B/C/D\`\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                    contextInfo: { ...rcanal }
                }, { quoted: m })
            }

            // Elegir pregunta aleatoria no repetida
            const usadas = []
            const pool = preguntas.filter(p => !usadas.includes(p.pregunta))
            const elegida = pool[Math.floor(Math.random() * pool.length)]

            const game = {
                preguntaActual: elegida,
                puntuaciones: {},
                respondieron: new Set(),
                preguntaNum: 1,
                iniciador: m.sender
            }
            global.triviaGames.set(chatId, game)

            const opciones = elegida.opciones.map((o, i) => `ׅㅤ𓏸𓈒ㅤׄ *${letras[i]})* ${o}`).join('\n')

            await conn.sendMessage(m.chat, {
                text: `> . ﹡ ﹟ 🧠 ׄ ⬭ *¡ᴛʀɪᴠɪᴀ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🧠* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴄᴀᴛᴇɢᴏʀíᴀ* :: ${elegida.categoria}
ׅㅤ𓏸𓈒ㅤׄ *ᴘʀᴇɢᴜɴᴛᴀ #${game.preguntaNum}*

> ## \`❓ ${elegida.pregunta}\`

${opciones}

ׅㅤ𓏸𓈒ㅤׄ *ʀᴇꜱᴘᴏɴᴅᴇ* :: \`${usedPrefix}resp A\` \`${usedPrefix}resp B\` ...
ׅㅤ𓏸𓈒ㅤׄ *ᴛɪᴇᴍᴘᴏ* :: 30 ꜱᴇɢᴜɴᴅᴏꜱ ⏳

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
                contextInfo: { ...rcanal }
            }, { quoted: m })

            // Timer para revelar respuesta automáticamente
            const timer = setTimeout(async () => {
                if (!global.triviaGames.has(chatId)) return
                const g = global.triviaGames.get(chatId)
                const correctaIdx = g.preguntaActual.correcta
                const correctaTexto = g.preguntaActual.opciones[correctaIdx]

                await conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ 🧠 ׄ ⬭ *¡ᴛɪᴇᴍᴘᴏ ᴀɢᴏᴛᴀᴅᴏ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜⏰* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ʀᴇꜱᴘᴜᴇꜱᴛᴀ* :: *${letras[correctaIdx]}) ${correctaTexto}* ✅
ׅㅤ𓏸𓈒ㅤׄ *ɴᴀᴅɪᴇ ʀᴇꜱᴘᴏɴᴅɪᴏ́* :: ꜱᴇ ᴀᴄᴀʙᴏ́ ᴇʟ ᴛɪᴇᴍᴘᴏ

ׅㅤ𓏸𓈒ㅤׄ *ꜱɪɢᴜɪᴇɴᴛᴇ* :: \`${usedPrefix}trivia\` ᴘᴀʀᴀ ᴏᴛʀᴀ ᴘʀᴇɢᴜɴᴛᴀ

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
                    contextInfo: { ...rcanal }
                })
                global.triviaGames.delete(chatId)
                global.triviaTimers.delete(chatId)
            }, TIEMPO_RESPUESTA)

            global.triviaTimers.set(chatId, timer)
            break
        }

        // ===== RESPONDER =====
        case 'resp':
        case 'respuesta':
        case 'r': {
            if (!global.triviaGames.has(chatId)) {
                return conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ 🧠 ׄ ⬭ *¡ꜱɪɴ ᴛʀɪᴠɪᴀ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❌* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ɪɴɪᴄɪᴀʀ* :: \`${usedPrefix}trivia\`\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                    contextInfo: { ...rcanal }
                }, { quoted: m })
            }

            const g = global.triviaGames.get(chatId)

            if (g.respondieron.has(m.sender)) {
                return conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ 🧠 ׄ ⬭ *¡ʏᴀ ʀᴇꜱᴘᴏɴᴅɪꜱᴛᴇ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜⚠️* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴇꜱᴛᴀᴅᴏ* :: ᴡᴀɪᴛɪɴɢ ᴏᴛʀᴏꜱ ᴊᴜɢᴀᴅᴏʀᴇꜱ...\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                    contextInfo: { ...rcanal }
                }, { quoted: m })
            }

            const respuesta = text?.trim().toUpperCase().charAt(0)
            if (!['A', 'B', 'C', 'D'].includes(respuesta)) {
                return conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ 🧠 ׄ ⬭ *¡ʀᴇꜱᴘᴜᴇꜱᴛᴀ ɪɴᴠáʟɪᴅᴀ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❌* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴇᴊᴇᴍᴘʟᴏ* :: \`${usedPrefix}resp A\` ᴏ \`${usedPrefix}resp B\`\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                    contextInfo: { ...rcanal }
                }, { quoted: m })
            }

            const idxRespuesta = letras.indexOf(respuesta)
            const esCorrecta = idxRespuesta === g.preguntaActual.correcta

            g.respondieron.add(m.sender)
            if (esCorrecta) {
                g.puntuaciones[m.sender] = (g.puntuaciones[m.sender] || 0) + 10
            }

            const correctaTexto = g.preguntaActual.opciones[g.preguntaActual.correcta]

            // Cancelar timer y terminar pregunta
            if (global.triviaTimers.has(chatId)) {
                clearTimeout(global.triviaTimers.get(chatId))
                global.triviaTimers.delete(chatId)
            }
            global.triviaGames.delete(chatId)

            // Tabla de puntuaciones
            const rankEntries = Object.entries(g.puntuaciones).sort((a, b) => b[1] - a[1])
            const ranking = rankEntries.length > 0
                ? rankEntries.slice(0, 5).map((e, i) => `ׅㅤ𓏸𓈒ㅤׄ *${i + 1}.* @${e[0].split('@')[0]} :: ${e[1]}pts`).join('\n')
                : 'ׅㅤ𓏸𓈒ㅤׄ _ɴᴀᴅɪᴇ ᴄᴏɴ ᴘᴜɴᴛᴏꜱ ᴀúɴ_'

            await conn.sendMessage(m.chat, {
                text: `> . ﹡ ﹟ 🧠 ׄ ⬭ *¡${esCorrecta ? 'ᴄᴏʀʀᴇᴄᴛᴏ' : 'ɪɴᴄᴏʀʀᴇᴄᴛᴏ'}!* ${esCorrecta ? '✅' : '❌'}

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜${esCorrecta ? '🎉' : '❌'}* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴊᴜɢᴀᴅᴏʀ* :: @${m.sender.split('@')[0]}
ׅㅤ𓏸𓈒ㅤׄ *ʀᴇꜱᴘᴜᴇꜱᴛᴀ* :: *${letras[g.preguntaActual.correcta]}) ${correctaTexto}* ✅
ׅㅤ𓏸𓈒ㅤׄ *ᴘᴜɴᴛᴏꜱ* :: ${esCorrecta ? '+10 🏆' : '+0'}

> ## \`🏆 ᴛᴀʙʟᴀ ᴅᴇ ʀᴇꜱᴜʟᴛᴀᴅᴏꜱ\`

${ranking}

ׅㅤ𓏸𓈒ㅤׄ *ꜱɪɢᴜɪᴇɴᴛᴇ* :: \`${usedPrefix}trivia\` ᴘᴀʀᴀ ᴏᴛʀᴀ ᴘʀᴇɢᴜɴᴛᴀ

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
                contextInfo: {
                    mentionedJid: [m.sender, ...rankEntries.map(e => e[0])],
                    ...rcanal
                }
            }, { quoted: m })
            break
        }

        // ===== STOP TRIVIA =====
        case 'stoptrivia': {
            if (!global.triviaGames.has(chatId)) return
            if (global.triviaTimers.has(chatId)) {
                clearTimeout(global.triviaTimers.get(chatId))
                global.triviaTimers.delete(chatId)
            }
            global.triviaGames.delete(chatId)
            await conn.sendMessage(m.chat, {
                text: `> . ﹡ ﹟ 🧠 ׄ ⬭ *¡ᴛʀɪᴠɪᴀ ᴛᴇʀᴍɪɴᴀᴅᴀ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🏁* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴇꜱᴛᴀᴅᴏ* :: ᴊᴜᴇɢᴏ ᴄᴀɴᴄᴇʟᴀᴅᴏ\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                contextInfo: { ...rcanal }
            }, { quoted: m })
            break
        }
    }
}

handler.help = ['trivia', 'pregunta']
handler.tags = ['fun', 'games']
handler.command = ['trivia', 'pregunta', 'resp', 'respuesta', 'r', 'stoptrivia']
handler.group = true
handler.reg = true

export default handler
