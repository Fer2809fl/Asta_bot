import { existsSync, readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import pkg from '@fer2809fl/baileys'

const { proto, generateWAMessageFromContent, prepareWAMessageMedia, WA_DEFAULT_EPHEMERAL } = pkg

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOCAL_LOGO = resolve(__dirname, "../lib/menu.jpg");

async function getImageBuffer(source) {
  try {
    if (!source) return null;
    if (source.startsWith?.("http")) {
      const res = await fetch(source);
      if (!res.ok) return null;
      return Buffer.from(await res.arrayBuffer());
    }
    if (existsSync(source)) return readFileSync(source);
  } catch { }
  return null;
}

async function sendInteractive(sock, msg, remoteJid, interactiveMessage) {
    const messageContent = proto.Message.fromObject({
        viewOnceMessage: {
            message: {
                messageContextInfo: {
                    deviceListMetadata: {},
                    deviceListMetadataVersion: 2
                },
                interactiveMessage
            }
        }
    })

    const built = await generateWAMessageFromContent(remoteJid, messageContent, {
        userJid: sock.user?.jid,
        quoted: msg,
        ephemeralExpiration: WA_DEFAULT_EPHEMERAL
    })

    await sock.relayMessage(remoteJid, built.message, { messageId: built.key.id })
}

async function sendMenuWithButtons(sock, msg, remoteJid, { menuText, botname, wm, canalUrl, grupoUrl, logoBuffer, mentions }) {
    let header = { title: botname || 'Asta Bot', hasMediaAttachment: false }

    if (logoBuffer) {
        try {
            const media = await prepareWAMessageMedia(
                { image: logoBuffer },
                { upload: sock.waUploadToServer }
            )
            header = {
                title: botname || 'Asta Bot',
                hasMediaAttachment: true,
                imageMessage: media.imageMessage
            }
        } catch {
            header = { title: botname || 'Asta Bot', hasMediaAttachment: false }
        }
    }

    await sendInteractive(sock, msg, remoteJid, {
        body: { text: menuText },
        footer: { text: wm || 'Asta Bot' },
        header,
        contextInfo: mentions?.length ? { mentionedJid: mentions } : undefined,
        nativeFlowMessage: {
            buttons: [
                {
                    name: 'cta_url',
                    buttonParamsJson: JSON.stringify({
                        display_text: '📢 Canal',
                        url: canalUrl,
                        merchant_url: canalUrl
                    })
                },
                {
                    name: 'cta_url',
                    buttonParamsJson: JSON.stringify({
                        display_text: '👥 Grupo',
                        url: grupoUrl,
                        merchant_url: grupoUrl
                    })
                },
                {
                    name: 'quick_reply',
                    buttonParamsJson: JSON.stringify({
                        display_text: '👑 Creador',
                        id: 'creadores'
                    })
                },
                {
                    name: 'quick_reply',
                    buttonParamsJson: JSON.stringify({
                        display_text: '🤖 Supbot',
                        id: 'code'
                    })
                }
            ],
            messageParamsJson: ''
        }
    })
}

export default [
  {
    command: ["menu", "help", "comandos", "menú", "allmenu"],
    description: "Muestra el menú de comandos del bot.",
    async execute({ sock, msg, remoteJid, senderRaw, reply }) {
      const prefix = Array.isArray(global.prefix)
        ? global.prefix[0]
        : (global.prefix ?? "!");
      const p = prefix;
      const user = senderRaw?.split("@")[0]?.split(":")[0] || "usuario";
      const uptime = clockString(process.uptime() * 1000);

      const botname = sock.botname || global.botname || "Asta";
      const wm = sock.wm || global.wm || "Asta-Bot";
      const logo = sock.logo || global.logo;
      const ownername = sock.ownername || global.ownername || global.dev || "Bot";
      const canal = sock.canal || global.canal;
      const grupo = sock.grupo || global.grupo;
      const version = global.version || "2.0.0";
      const type = global.type || "Multi-Device";
      const sistema = global.sistema || "Node.js";
      const usersCount = global.usersCount || "∞";
      const url = global.repo || (canal?.url) || "https://github.com/";

      const menuText = `> 「✦」*¡Hola!* @${user}. *Soy* ${botname}*, aquí tienes la lista de comandos (๑•ᴗ•๑).*

╔┅┉✦┉┅✦┅┉✦┉┅✦┉┅┅❥⧽
║. .┊⩩﹕*𝙾𝚆𝙽𝙴𝚁 »* ${ownername}
║. .┊⩩﹕*𝙱𝙾𝚃 𝙽𝙰𝙼𝙴 »* ${botname}
║. .┊⩩﹕*𝚃𝚈𝙿𝙴 »* ${type}
║. .┊⩩﹕*𝚅𝙴𝚁𝚂𝙸𝙾𝙽 »* ${version}
║. .┊⩩﹕*𝚂𝙸𝚂𝚃𝙴𝙼 »* ${sistema}
║. .┊⩩﹕*𝚄𝙿𝚃𝙸𝙼𝙴 »* ${uptime}
║. .┊⩩﹕*𝚄𝚂𝙴𝚁𝚂 »* ${usersCount}
║. .┊⩩﹕*𝚄𝚁𝙻 »* ${url}
╚┅┉✦┉┅✦┅┉✦┉┅✦┉┅┅❥⧽
> Vincula un *Sub-Bot* con tu número utilizando *.code* o *.qr*
ˏ⸉ˋ‿̩͙‿̩̩̽‿̩͙‿̩̥̩‿̩̩̽‿̩͙‿̩̩̽‿̩͙‿̩̩̽‿̩͙‿̩͙‿̩̩̽‿̩͙‿̩̥̩‿̩̩̽‿̩͙'⸊ˎ

「🌟」*LISTA DE COMANDOS::*

╔⚎⚎⊹ *｟ INFORMACIÓN ⚔️ ｠* ⊹⚎╼❥⧽⧽
■*${p}ping*
> ✦ » Estado del bot
■*${p}menu*
> ✦ » Ver este menú
■*${p}info* / *${p}infogrupo*
> ✦ » Info del grupo y lista de admins
■*${p}creadores*
> ✦ » Contactos de los creadores del bot
╚⚎⚎⊹ *⧼ ${wm} ⧽* ⊹⚎╼❥⧽⧽

╔⚎⚎⊹ *｟ GRUPOS 👥 ｠* ⊹⚎╼❥⧽⧽
■*${p}tagall [texto]*
> ✦ » Mencionar a todos
■*${p}hidetag [texto]*
> ✦ » Mención oculta a todos
■*${p}admins*
> ✦ » Lista de administradores
■*${p}miembros*
> ✦ » Total de miembros y admins
■*${p}link*
> ✦ » Link de invitación del grupo
■*${p}resetlink*
> ✦ » Reiniciar link de invitación
■*${p}open*
> ✦ » Abrir grupo (todos escriben)
■*${p}close*
> ✦ » Cerrar grupo (solo admins)
■*${p}kick @user*
> ✦ » Expulsar usuario
■*${p}promote @user*
> ✦ » Hacer admin
■*${p}demote @user*
> ✦ » Quitar admin
■*${p}setname [nombre]*
> ✦ » Cambiar nombre del grupo
■*${p}setdesc [texto]*
> ✦ » Cambiar descripción del grupo
■*${p}setppgroup*
> ✦ » Cambiar foto del grupo (responde imagen)
■*${p}descgrupo*
> ✦ » Ver descripción actual del grupo
■*${p}fotogrupo*
> ✦ » Ver foto actual del grupo
■*${p}idgrupo*
> ✦ » Ver ID interno del grupo
╚⚎⚎⊹ *⧼ ${wm} ⧽* ⊹⚎╼❥⧽⧽

╔⚎⚎⊹ *｟ BIENVENIDA 👋 ｠* ⊹⚎╼❥⧽⧽
■*${p}welcome on/off*
> ✦ » Activar/desactivar bienvenida
■*${p}welcome bye on/off*
> ✦ » Activar/desactivar despedida
■*${p}welcome msg <texto>*
> ✦ » Personalizar mensaje de bienvenida
■*${p}welcome byemsg <texto>*
> ✦ » Personalizar mensaje de despedida
■*${p}welcome vars*
> ✦ » Ver variables disponibles ({usuario}, {grupo}...)
■*${p}welcome test*
> ✦ » Probar cómo luce la bienvenida
╚⚎⚎⊹ *⧼ ${wm} ⧽* ⊹⚎╼❥⧽⧽

╔⚎⚎⊹ *｟ REGLAS 📋 ｠* ⊹⚎╼❥⧽⧽
■*${p}reglas*
> ✦ » Ver reglas del grupo
■*${p}setreglas [texto]*
> ✦ » Guardar reglas del grupo
■*${p}delreglas*
> ✦ » Eliminar reglas del grupo
╚⚎⚎⊹ *⧼ ${wm} ⧽* ⊹⚎╼❥⧽⧽

╔⚎⚎⊹ *｟ ADVERTENCIAS ⚠️ ｠* ⊹⚎╼❥⧽⧽
■*${p}warn @user [motivo]*
> ✦ » Advertir usuario
■*${p}unwarn @user*
> ✦ » Quitar advertencias
■*${p}verwarn @user*
> ✦ » Ver advertencias de un usuario
╚⚎⚎⊹ *⧼ ${wm} ⧽* ⊹⚎╼❥⧽⧽

╔⚎⚎⊹ *｟ MODERACIÓN 🛡️ ｠* ⊹⚎╼❥⧽⧽
■*${p}mute @user [tiempo]*
> ✦ » Silenciar usuario (borra sus mensajes; sin tiempo = indefinido)
■*${p}unmute @user*
> ✦ » Quitar el silencio a un usuario
■*${p}modoadmin on/off*
> ✦ » Solo admins pueden usar al bot en el grupo
■*${p}antilink on/off*
> ✦ » Activar/desactivar bloqueo de links
■*${p}antilink add/del <plataforma>*
> ✦ » Agregar o quitar un link de la lista bloqueada
■*${p}antilink list*
> ✦ » Ver la lista de links bloqueados
╚⚎⚎⊹ *⧼ ${wm} ⧽* ⊹⚎╼❥⧽⧽

╔⚎⚎⊹ *｟ BOT ⚙️ ｠* ⊹⚎╼❥⧽⧽
■*${p}bot*
> ✦ » Ver estado del bot en el grupo
■*${p}bot on*
> ✦ » Activar el bot en el grupo
■*${p}bot off*
> ✦ » Desactivar el bot en el grupo
■*${p}setprimary*
> ✦ » Este bot será el primario del grupo
■*${p}setprimary @bot*
> ✦ » Otro bot como primario
■*${p}primaryoff*
> ✦ » Quitar bot primario (todos responden)
■*${p}restrict <cmd>*
> ✦ » Restringir comando globalmente (owner)
■*${p}cmdon <cmd>*
> ✦ » Liberar comando globalmente (owner)
■*${p}botsesion off*
> ✦ » Apagar bot en TODOS los grupos (owner)
■*${p}botsesion on*
> ✦ » Prender bot en TODOS los grupos (owner)
╚⚎⚎⊹ *⧼ ${wm} ⧽* ⊹⚎╼❥⧽⧽

╔⚎⚎⊹ *｟ UTILIDADES 🛠️ ｠* ⊹⚎╼❥⧽⧽
■*${p}hora <ciudad>*
> ✦ » Hora y fecha actual de una ciudad
■*${p}calc <expr>*
> ✦ » Calculadora matemática
■*${p}clima <ciudad>*
> ✦ » Clima actual de una ciudad
■*${p}moneda <cant> <DE> <A>*
> ✦ » Conversor de divisas
■*${p}unidad <val> <de> <a>*
> ✦ » Conversor de unidades
■*${p}timer <tiempo>*
> ✦ » Cuenta regresiva
■*${p}password [longitud]*
> ✦ » Genera contraseña segura
■*${p}contar <texto>*
> ✦ » Cuenta caracteres, palabras y líneas
■*${p}random [min] [max]* / *${p}aleatorio*
> ✦ » Número aleatorio
■*${p}base64 <encode|decode> <texto>*
> ✦ » Codifica o decodifica en Base64
■*${p}sticker* / *${p}s*
> ✦ » Crea stickers con efectos (imagen o video)
■*${p}brat [texto]*
> ✦ » Crea sticker estilo brat con texto
■*${p}bratv [texto]*
> ✦ » Crea sticker brat animado
■*${p}rmbg* / *${p}removebg*
> ✦ » Quita el fondo de una imagen y la convierte en sticker
■*${p}sp [búsqueda]*
> ✦ » Busca stickers en Pinterest
■*${p}read* / *${p}reenviar*
> ✦ » Reenvía el multimedia de un mensaje de vista única
╚⚎⚎⊹ *⧼ ${wm} ⧽* ⊹⚎╼❥⧽⧽

╔⚎⚎⊹ *｟ ECONOMÍA 🪙 ｠* ⊹⚎╼❥⧽⧽
■*${p}bal*
> ✦ » Ver tus monedas y banco
■*${p}daily*
> ✦ » Reclamar recompensa diaria
■*${p}w*
> ✦ » Trabajar para ganar monedas
■*${p}dep [cantidad]*
> ✦ » Guardar en banco
■*${p}with [cantidad]*
> ✦ » Retirar del banco
■*${p}transfer @user [cantidad]*
> ✦ » Enviar monedas
■*${p}rob @user*
> ✦ » Intentar robar monedas
■*${p}mision*
> ✦ » Ver o pedir misiones de bot
■*${p}inv*
> ✦ » Ver minerales, peces y gacha
■*${p}allw*
> ✦ » Ejecutar todas tus actividades de ganancia en un solo golpe (1 vez cada 24h)
■*${p}invest [cantidad]*
> ✦ » Invertir monedas y ganar (o perder) según el mercado
■*${p}farm*
> ✦ » Cultivar y cosechar para ganar monedas
■*${p}infow*
> ✦ » Ver el tiempo de reutilización de cada actividad
╚⚎⚎⊹ *⧼ ${wm} ⧽* ⊹⚎╼❥⧽⧽

╔⚎⚎⊹ *｟ MINERÍA / PESCA / TALA ⛏️🎣🪓 ｠* ⊹⚎╼❥⧽⧽
■*${p}minar*
> ✦ » Buscar minerales y ganar XP
■*${p}dig* / *${p}excavar*
> ✦ » Excavar en busca de tesoros ocultos
■*${p}pescar*
> ✦ » Pescar peces y ganar XP
■*${p}talar* / *${p}cortarmadera*
> ✦ » Talar árboles y conseguir madera
■*${p}vender [item/todo]*
> ✦ » Vender minerales, peces o madera
╚⚎⚎⊹ *⧼ ${wm} ⧽* ⊹⚎╼❥⧽⧽

╔⚎⚎⊹ *｟ AVENTURA ⚔️ ｠* ⊹⚎╼❥⧽⧽
■*${p}explorar* / *${p}explore*
> ✦ » Explora el mundo y encuentra monedas, XP y recursos al azar
■*${p}mazmorra [nombre]* / *${p}dungeon*
> ✦ » Explora una mazmorra y gana monedas, XP y minerales
╚⚎⚎⊹ *⧼ ${wm} ⧽* ⊹⚎╼❥⧽⧽

╔⚎⚎⊹ *｟ JUEGOS DE APUESTA 🎰 ｠* ⊹⚎╼❥⧽⧽
■*${p}slots [cantidad/all]*
> ✦ » Tragamonedas
■*${p}dado [cantidad/all]*
> ✦ » Dados vs bot
■*${p}ruleta [color/par/impar] [cantidad]*
> ✦ » Ruleta
■*${p}blackjack [cantidad/all]*
> ✦ » 21 vs bot
■*${p}coinflip [cara/cruz] [cantidad]*
> ✦ » Cara o cruz
■*${p}highlow [cantidad]* / *${p}hl*
> ✦ » Adivina si el siguiente número es mayor o menor
■*${p}guess [número]*
> ✦ » Adivina un número del 1 al 10, gana monedas
■*${p}double [cantidad]* / *${p}dn*
> ✦ » Doble o nada, apuesta todo y duplica (o pierde)
╚⚎⚎⊹ *⧼ ${wm} ⧽* ⊹⚎╼❥⧽⧽

╔⚎⚎⊹ *｟ RECOMPENSAS 🎁 ｠* ⊹⚎╼❥⧽⧽
■*${p}lucky*
> ✦ » Prueba tu suerte (12h)
■*${p}beg*
> ✦ » Pide limosna
■*${p}crime*
> ✦ » Crimen de alto riesgo
■*${p}hunt*
> ✦ » Cazar animales salvajes
■*${p}trivia [respuesta]*
> ✦ » Trivia con premio
■*${p}afk [motivo]*
> ✦ » Modo ausente con recompensa
╚⚎⚎⊹ *⧼ ${wm} ⧽* ⊹⚎╼❥⧽⧽

╔⚎⚎⊹ *｟ TIENDA Y RANKINGS 🛒🏆 ｠* ⊹⚎╼❥⧽⧽
■*${p}tienda [item]*
> ✦ » Comprar mejoras
■*${p}giveaway [cantidad]*
> ✦ » Sorteo grupal
■*${p}lb*
> ✦ » Top 10 más ricos
■*${p}top10* / *${p}toppendejos*
> ✦ » Menciona a 10 random del grupo con título random
■*${p}bounty*
> ✦ » Recompensas por logros
╚⚎⚎⊹ *⧼ ${wm} ⧽* ⊹⚎╼❥⧽⧽

╔⚎⚎⊹ *｟ INTELIGENCIA ARTIFICIAL 🧠 ｠* ⊹⚎╼❥⧽⧽
■*${p}chatgpt* / *${p}ia [pregunta]*
> ✦ » Hablar con ChatGPT
■*${p}copilot* / *${p}copi [pregunta]*
> ✦ » Hablar con Copilot
■*${p}gemini* / *${p}genai [pregunta]*
> ✦ » Hablar con Gemini
■*${p}imagen* / *${p}draw [descripción]*
> ✦ » Generar imagen con IA
■*${p}voz* / *${p}textoaudio [texto]*
> ✦ » Texto a audio (TTS)
╚⚎⚎⊹ *⧼ ${wm} ⧽* ⊹⚎╼❥⧽⧽

╔⚎⚎⊹ *｟ DOWNLOADS 📥 ｠* ⊹⚎╼❥⧽⧽
■*${p}play [nombre/url]*
> ✦ » Buscar en YouTube (muestra info)
■*${p}play1* / *${p}play2*
> ✦ » Descargar Audio / Video de YouTube
■*${p}play3* / *${p}play4*
> ✦ » Audio / Video como documento
■*${p}tiktok* / *${p}tt [búsqueda/link]*
> ✦ » Descargar video de TikTok
■*${p}ttmp3 [link/búsqueda]*
> ✦ » Descargar solo el audio de un video de TikTok
■*${p}spotify [búsqueda/link]*
> ✦ » Descargar música de Spotify
■*${p}apk [nombre]*
> ✦ » Buscar y descargar aplicaciones APK
■*${p}facebook* / *${p}fb [link]*
> ✦ » Descargar video de Facebook
■*${p}instagram* / *${p}ig [link]*
> ✦ » Descargar video/foto de Instagram
■*${p}pinterest* / *${p}pin [búsqueda]*
> ✦ » Buscar imágenes en Pinterest
■*${p}shazam*
> ✦ » Identificar canción citando nota de voz o video
╚⚎⚎⊹ *⧼ ${wm} ⧽* ⊹⚎╼❥⧽⧽

╔⚎⚎⊹ *｟ GACHA 🎴 ｠* ⊹⚎╼❥⧽⧽
■*${p}rw*
> ✦ » Roll de personaje aleatorio
■*${p}claim*
> ✦ » Reclamar personaje (responde la imagen)
■*${p}harem [página]*
> ✦ » Ver tu colección de personajes
■*${p}perfil* / *${p}profile*
> ✦ » Ver tu nivel, XP, bio y pareja
■*${p}setbio [texto]* / *${p}bio*
> ✦ » Cambiar la biografía de tu perfil
■*${p}setedad [edad]*
> ✦ » Cambiar la edad mostrada en tu perfil
■*${p}setcumple [DD/MM/AAAA]*
> ✦ » Poner tu cumpleaños (calcula tu edad y te felicita ese día)
■*${p}setfoto [url]*
> ✦ » Cambiar la foto o video de perfil (responde imagen/video o pon URL)
■*${p}pfp [@user]* / *${p}avatar*
> ✦ » Ver la foto de perfil de alguien
■*${p}buscar [nombre/ID]*
> ✦ » Buscar personaje en tu harem
■*${p}sellwaifu <ID>*
> ✦ » Vender un personaje por monedas
■*${p}trade @user <tuID> <suID>*
> ✦ » Proponer intercambio
■*${p}aceptar* / *${p}rechazar*
> ✦ » Responder a un intercambio
╚⚎⚎⊹ *⧼ ${wm} ⧽* ⊹⚎╼❥⧽⧽

╔⚎⚎⊹ *｟ MATRIMONIO 💍 ｠* ⊹⚎╼❥⧽⧽
■*${p}marry [@user]* / *${p}casar*
> ✦ » Proponer matrimonio (cuesta 5,000 monedas)
■*${p}aceptarboda*
> ✦ » Aceptar una propuesta pendiente
■*${p}rechazarboda*
> ✦ » Rechazar una propuesta pendiente
■*${p}divorciar* / *${p}divorcio*
> ✦ » Terminar tu matrimonio actual
╚⚎⚎⊹ *⧼ ${wm} ⧽* ⊹⚎╼❥⧽⧽

╔⚎⚎⊹ *｟ REACCIONES 🎭 ｠* ⊹⚎╼❥⧽⧽
■*${p}hug [@user]*
> ✦ » Abrazar
■*${p}kiss [@user]*
> ✦ » Besar
■*${p}pat [@user]*
> ✦ » Palmadita
■*${p}slap [@user]*
> ✦ » Cachetada
■*${p}punch [@user]*
> ✦ » Golpe
■*${p}bite [@user]*
> ✦ » Morder
■*${p}kill [@user]*
> ✦ » Matar
■*${p}wave [@user]*
> ✦ » Saludar
■*${p}cry*
> ✦ » Llorar
■*${p}happy*
> ✦ » Feliz
■*${p}sad*
> ✦ » Triste
■*${p}angry*
> ✦ » Enojado
■*${p}blush*
> ✦ » Sonrojarse
■*${p}love [@user]*
> ✦ » Amar
■*${p}shy*
> ✦ » Tímido
■*${p}scared*
> ✦ » Asustado
■*${p}bored*
> ✦ » Aburrido
■*${p}sleep*
> ✦ » Dormir
■*${p}eat*
> ✦ » Comer
■*${p}coffee [@user]*
> ✦ » Tomar café
■*${p}drunk*
> ✦ » Borracho
■*${p}facepalm*
> ✦ » Facepalm
■*${p}run*
> ✦ » Correr
■*${p}walk*
> ✦ » Caminar
■*${p}bath*
> ✦ » Bañarse
■*${p}spit [@user]*
> ✦ » Escupir
■*${p}smoke*
> ✦ » Fumar
╚⚎⚎⊹ *⧼ ${wm} ⧽* ⊹⚎╼❥⧽⧽

╔⚎⚎⊹ *｟ SUBBOTS 🤖 ｠* ⊹⚎╼❥⧽⧽
■*${p}code*
> ✦ » Iniciar sub-bot con código de vinculación
■*${p}qr*
> ✦ » Iniciar sub-bot con código QR
■*${p}stopbot*
> ✦ » Detener tu sesión de sub-bot
■*${p}bots* / *${p}botslist*
> ✦ » Ver lista de sub-bots activos
■*${p}setbotname* / *${p}nombre <nombre>*
> ✦ » Cambiar nombre del bot en WhatsApp
■*${p}setbotbio [texto]*
> ✦ » Cambiar biografía/estado del bot
■*${p}setbotpp*
> ✦ » Cambiar foto de perfil citando una imagen
■*${p}setbotlogo [url]*
> ✦ » Cambiar logo del menú del sub-bot
■*${p}setbotwm [texto]*
> ✦ » Cambiar marca de agua del menú
■*${p}setboticono [emoji]*
> ✦ » Cambiar icono del sub-bot
■*${p}addowner @tag*
> ✦ » Agregar administrador al sub-bot
■*${p}delowner @tag*
> ✦ » Quitar administrador del sub-bot
╚⚎⚎⊹ *⧼ ${wm} ⧽* ⊹⚎╼❥⧽⧽

╔⚎⚎⊹ *｟ SUGERENCIAS Y REPORTES 💡 ｠* ⊹⚎╼❥⧽⧽
■*${p}sug [texto]*
> ✦ » Agregar una idea o sugerencia
■*${p}report [texto]*
> ✦ » Reportar un error o bug
■*${p}lista*
> ✦ » Ver la lista de ideas y reportes (ayudantes y owner)
■*${p}quitar [ID]*
> ✦ » Marcar una sugerencia/reporte como resuelto (ayudantes u owner)
╚⚎⚎⊹ *⧼ ${wm} ⧽* ⊹⚎╼❥⧽⧽

╔⚎⚎⊹ *｟ OWNER 👑 ｠* ⊹⚎╼❥⧽⧽
■*${p}update* / *${p}actualizar*
> ✦ » Actualizar bot desde GitHub
╚⚎⚎⊹ *⧼ ${wm} ⧽* ⊹⚎╼❥⧽⧽`.trim();

      let logoBuffer = null;
      try {
        if (existsSync(LOCAL_LOGO)) logoBuffer = readFileSync(LOCAL_LOGO);
        if (!logoBuffer) logoBuffer = await getImageBuffer(logo);
      } catch {
        logoBuffer = null;
      }

      const mentions = [senderRaw?.split(":")[0]?.split("@")[0] + "@s.whatsapp.net"];

      try {
        await sendMenuWithButtons(sock, msg, remoteJid, {
          menuText,
          botname,
          wm,
          canalUrl: canal?.url,
          grupoUrl: grupo,
          logoBuffer,
          mentions,
        });
      } catch (err) {
        console.error(`[Menu] Error al enviar botones, usando envío normal:`, err.message);
        try {
          if (logoBuffer) {
            await sock.sendMessage(
              remoteJid,
              { image: logoBuffer, caption: menuText, mentions },
              { quoted: msg }
            );
          } else {
            await sock.sendMessage(
              remoteJid,
              { text: menuText, mentions },
              { quoted: msg }
            );
          }
        } catch (err2) {
          console.error(`[Menu] Error:`, err2.message);
          await reply(menuText);
        }
      }
    },
  },
];

function clockString(ms) {
  const s = Math.floor((ms / 1000) % 60);
  const m = Math.floor((ms / (1000 * 60)) % 60);
  const h = Math.floor((ms / (1000 * 60 * 60)) % 24);
  return `${h}h ${m}m ${s}s`;
}
