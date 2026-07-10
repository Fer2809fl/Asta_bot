import { existsSync, mkdirSync, writeFileSync, readFileSync, unlinkSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { downloadContentFromMessage } from "@fer2809fl/baileys";
import { db } from "../../src/database.js";
import { participantForms, addAllForms, normalizeJid, jidToNumber } from "../../src/jid.js";

const PROFILE_DIR = join(dirname(fileURLToPath(import.meta.url)), "../../database/profiles");
const MAX_MEDIA_BYTES = 8 * 1024 * 1024; // 8MB límite razonable para foto/video de perfil

function findParticipant(participants, targetJid) {
  const targetForms = new Set();
  addAllForms(targetForms, targetJid);
  for (const p of participants) {
    const pForms = participantForms(p);
    for (const form of targetForms) {
      if (pForms.has(form)) return p;
    }
  }
  return null;
}

function getTarget(msg, args) {
  const ctx = msg.message?.extendedTextMessage?.contextInfo;
  const mention = ctx?.mentionedJid?.[0];
  const quoted = ctx?.participant;

  let jid = null;
  if (mention) jid = normalizeJid(mention);
  else if (quoted) jid = normalizeJid(quoted);
  else if (/^\d/.test(args[0] || "")) jid = `${args[0].replace(/\D/g, "")}@s.whatsapp.net`;

  return { jid };
}

async function resolveTarget({ msg, remoteJid, senderRaw, args, sock }) {
  let targetJid = senderRaw;
  let isSelf = true;

  const { jid: rawJid } = getTarget(msg, args);
  if (rawJid) {
    try {
      const meta = await sock.groupMetadata(remoteJid);
      const participant = findParticipant(meta.participants, rawJid);
      targetJid = participant ? participant.id : rawJid;
    } catch {
      targetJid = rawJid;
    }
    isSelf = false;
  }

  return { targetJid, isSelf };
}

function baseMediaPath(jid) {
  const num = jidToNumber(jid) || jid.split("@")[0].split(":")[0];
  return join(PROFILE_DIR, num);
}

// Devuelve la media de perfil actual: puede ser una imagen (.jpg) o un video en loop (.mp4)
function getProfileMedia(jid) {
  const base = baseMediaPath(jid);
  const videoPath = `${base}.mp4`;
  const imagePath = `${base}.jpg`;
  if (existsSync(videoPath)) return { type: "video", path: videoPath };
  if (existsSync(imagePath)) return { type: "image", path: imagePath };
  return { type: null, path: null };
}

function clearOtherMedia(jid, keepType) {
  const base = baseMediaPath(jid);
  const videoPath = `${base}.mp4`;
  const imagePath = `${base}.jpg`;
  if (keepType !== "video" && existsSync(videoPath)) {
    try { unlinkSync(videoPath); } catch {}
  }
  if (keepType !== "image" && existsSync(imagePath)) {
    try { unlinkSync(imagePath); } catch {}
  }
}

// ---------- Utilidades de cumpleaños ----------

function calcularEdad(dia, mes, anio) {
  const hoy = new Date();
  let edad = hoy.getFullYear() - anio;
  const mesActual = hoy.getMonth() + 1;
  const diaActual = hoy.getDate();
  if (mesActual < mes || (mesActual === mes && diaActual < dia)) edad--;
  return edad;
}

function parseFechaCumple(texto) {
  const match = (texto || "").trim().match(/^(\d{1,2})[/\-](\d{1,2})[/\-](\d{4})$/);
  if (!match) return null;
  const dia = parseInt(match[1], 10);
  const mes = parseInt(match[2], 10);
  const anio = parseInt(match[3], 10);

  const anioActual = new Date().getFullYear();
  if (mes < 1 || mes > 12) return null;
  const diasEnMes = new Date(anio || anioActual, mes, 0).getDate();
  if (dia < 1 || dia > diasEnMes) return null;
  if (anio < 1900 || anio > anioActual) return null;

  return { dia, mes, anio };
}

function formatFechaCumple(cumple) {
  const dd = String(cumple.dia).padStart(2, "0");
  const mm = String(cumple.mes).padStart(2, "0");
  return `${dd}/${mm}/${cumple.anio}`;
}

// Revisa a todos los usuarios y envía "Feliz cumpleaños" por privado a quien cumpla años hoy.
// Pensada para ser llamada una vez al día (p. ej. con un setInterval/cron) desde tu archivo
// principal del bot, donde sí tienes acceso a `sock`.
//
// Requiere que exista `db.getAllUsers()` devolviendo un array de usuarios con al menos
// `{ jid, profile }`. Si tu database.js no tiene ese método, agrégalo (normalmente es solo
// devolver todas las entradas guardadas).
export async function checkCumpleanosHoy(sock) {
  if (typeof db.getAllUsers !== "function") {
    console.warn("[perfil] checkCumpleanosHoy: falta implementar db.getAllUsers() en database.js");
    return;
  }

  const hoy = new Date();
  const diaHoy = hoy.getDate();
  const mesHoy = hoy.getMonth() + 1;
  const anioHoy = hoy.getFullYear();

  const usuarios = db.getAllUsers();
  for (const u of usuarios) {
    const cumple = u.profile?.cumple;
    if (!cumple) continue;
    if (cumple.dia !== diaHoy || cumple.mes !== mesHoy) continue;
    if (u.profile?.ultimoSaludoCumple === anioHoy) continue; // ya se le felicitó este año

    const edad = calcularEdad(cumple.dia, cumple.mes, cumple.anio);
    const num = jidToNumber(u.jid) || u.jid.split("@")[0];

    try {
      await sock.sendMessage(u.jid, {
        text: `╔╼━┈━┈━╌━┈━┈━┈❥⪼
║ 🎉 *¡FELIZ CUMPLEAÑOS!* 🎂
║
║ Hoy +${num} cumple *${edad}* años ✦
║ ¡Que tengas un día increíble! 🥳
╚╼━┈━┈━╌━┈━┈━┈❥⪼`,
      });

      db.updateUser(u.jid, (usr) => {
        usr.profile ??= {};
        usr.profile.ultimoSaludoCumple = anioHoy;
      });
    } catch (err) {
      console.error("[perfil] Error enviando saludo de cumpleaños:", err);
    }
  }
}

// ---------- Descarga de media desde URL o mensaje citado ----------

async function descargarDesdeUrl(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`No se pudo descargar la URL (status ${res.status})`);

  const contentType = res.headers.get("content-type") || "";
  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  let tipo = null;
  if (contentType.startsWith("video")) tipo = "video";
  else if (contentType.startsWith("image")) tipo = "image";
  else {
    // fallback por extensión si el content-type no ayuda
    const pathname = new URL(url).pathname.toLowerCase();
    if (/\.(mp4|mov|webm|3gp)$/.test(pathname)) tipo = "video";
    else if (/\.(jpg|jpeg|png|webp)$/.test(pathname)) tipo = "image";
  }

  if (!tipo) throw new Error("No se reconoce el tipo de archivo de la URL (usa imagen o video).");

  return { buffer, tipo };
}

async function descargarDesdeMensaje(msg) {
  const quotedMsg = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
  const videoMessage = msg.message?.videoMessage || quotedMsg?.videoMessage;
  const imageMessage = msg.message?.imageMessage || quotedMsg?.imageMessage;

  const mediaMessage = videoMessage || imageMessage;
  if (!mediaMessage) return null;

  const tipo = videoMessage ? "video" : "image";
  const stream = await downloadContentFromMessage(mediaMessage, tipo);
  let buffer = Buffer.from([]);
  for await (const chunk of stream) {
    buffer = Buffer.concat([buffer, chunk]);
  }

  return { buffer, tipo };
}

export default [
  {
    command: ["perfil", "level", "nivel", "profile"],
    description: "👤 Muestra tu perfil: nivel, bio, edad, cumpleaños, pareja y foto/video.",
    async execute({ sock, msg, remoteJid, senderRaw, args, reply }) {
      const { targetJid, isSelf } = await resolveTarget({ msg, remoteJid, senderRaw, args, sock });

      const user = db.getUser(targetJid);
      const num = jidToNumber(targetJid) || targetJid.split("@")[0].split(":")[0];
      const xpNeeded = user.level * 150;
      const perfil = user.profile ?? {};

      let parejaTexto = "Soltero/a";
      let parejaJid = null;
      if (perfil.married) {
        parejaJid = perfil.married;
        const parejaNum = jidToNumber(perfil.married) || perfil.married.split("@")[0];
        parejaTexto = `@${parejaNum}`;
      }

      let edadTexto = "No especificada";
      if (perfil.cumple) {
        edadTexto = `${calcularEdad(perfil.cumple.dia, perfil.cumple.mes, perfil.cumple.anio)} años`;
      } else if (perfil.edad) {
        edadTexto = `${perfil.edad} años`;
      }

      const cumpleTexto = perfil.cumple ? formatFechaCumple(perfil.cumple) : "No especificado";
      const bioTexto = perfil.bio ? perfil.bio : "Sin biografía. Usa !setbio <texto> para poner una.";

      const texto = `╔╼━┈━┈━╌━┈━┈━┈❥⪼
║ *✦ Perfil de ››* @${num}
║
╰╼⪼ ☘︎ \`MIS ESTADÍSTICAS::\`
║ ✦ *Nivel  ››* *${user.level}*
║ ✎ *XP  ››* *${user.xp}/${xpNeeded}*
║
╠╼╌⪼ \`SOBRE MÍ  ˙ (ू•ᴗ•ू )\`
║
║ 𖤹 *EDAD  ››* *${edadTexto}*
║ ฅ *CUMPLEAÑOS  ››* *${cumpleTexto}*
║ ❁ *PAREJA  ››* ${parejaTexto}
║ ☕︎︎ *BIOGRAFÍA ››* ${bioTexto}
╚╼━┈━┈━╌━┈━┈━┈❥⪼`;

      const mentions = [targetJid];
      if (parejaJid) mentions.push(parejaJid);

      const media = getProfileMedia(targetJid);

      if (media.type === "video") {
        try {
          const buffer = readFileSync(media.path);
          return sock.sendMessage(
            remoteJid,
            { video: buffer, caption: texto, gifPlayback: true, mentions },
            { quoted: msg }
          );
        } catch {
          // si falla el video, cae al texto plano
        }
      } else if (media.type === "image") {
        try {
          const buffer = readFileSync(media.path);
          return sock.sendMessage(
            remoteJid,
            { image: buffer, caption: texto, mentions },
            { quoted: msg }
          );
        } catch {
          // si falla la imagen, cae al texto plano
        }
      }

      await sock.sendMessage(remoteJid, { text: texto, mentions }, { quoted: msg });
    },
  },
  {
    command: ["setbio", "biografia", "bio"],
    description: "📝 Cambia la biografía de tu perfil.",
    async execute({ senderRaw, args, reply }) {
      const texto = args.join(" ").trim();
      if (!texto) {
        return reply(`\`📝 BIO\`

\`✘ ERROR ›\` Escribe el texto que quieres poner.
> _Ejemplo: !setbio Amante de los gatos 🐱_`);
      }
      if (texto.length > 150) {
        return reply(`\`📝 BIO\`

\`✘ ERROR ›\` Tu biografía no puede tener más de *150* caracteres.`);
      }

      db.updateUser(senderRaw, (u) => {
        u.profile ??= {};
        u.profile.bio = texto;
      });

      await reply(`\`📝 BIO ACTUALIZADA ✅\`

\`✦ NUEVA BIO ›\` _${texto}_`);
    },
  },
  {
    command: ["setedad", "edad"],
    description: "🎂 Cambia la edad mostrada en tu perfil (se ignora si ya pusiste tu cumpleaños con !setcumple).",
    async execute({ senderRaw, args, reply }) {
      const edad = parseInt(args[0], 10);
      if (!args[0] || isNaN(edad) || edad < 13 || edad > 99) {
        return reply(`\`🎂 EDAD\`

\`✘ ERROR ›\` Escribe una edad válida entre *13* y *99*.
> _Ejemplo: !setedad 21_`);
      }

      db.updateUser(senderRaw, (u) => {
        u.profile ??= {};
        u.profile.edad = edad;
      });

      await reply(`\`🎂 EDAD ACTUALIZADA ✅\`

\`✦ NUEVA EDAD ›\` *${edad}* años`);
    },
  },
  {
    command: ["setcumple", "cumple", "cumpleanos"],
    description: "🎉 Pon tu fecha de cumpleaños (DD/MM/AAAA). Tu edad se calculará sola y se te felicitará ese día.",
    async execute({ senderRaw, args, reply }) {
      const cumple = parseFechaCumple(args[0]);
      if (!cumple) {
        return reply(`\`🎉 CUMPLEAÑOS\`

\`✘ ERROR ›\` Escribe tu fecha en formato *DD/MM/AAAA*.
> _Ejemplo: !setcumple 15/08/2001_`);
      }

      db.updateUser(senderRaw, (u) => {
        u.profile ??= {};
        u.profile.cumple = cumple;
        delete u.profile.ultimoSaludoCumple; // por si cambia la fecha, que pueda felicitarse de nuevo este año
      });

      const edad = calcularEdad(cumple.dia, cumple.mes, cumple.anio);

      await reply(`\`🎉 CUMPLEAÑOS ACTUALIZADO ✅\`

\`✦ FECHA ›\` *${formatFechaCumple(cumple)}*
\`✦ EDAD CALCULADA ›\` *${edad}* años

> _El día de tu cumpleaños te enviaré un saludo especial 🎂_`);
    },
  },
  {
    command: ["setfoto", "perfilfoto"],
    description: "🖼️ Cambia la foto o video de perfil. Responde a una imagen/video, o pon una URL: !setfoto <url>.",
    async execute({ msg, senderRaw, args, reply }) {
      let descarga = null;

      const url = args[0];
      if (url && /^https?:\/\//i.test(url)) {
        try {
          descarga = await descargarDesdeUrl(url);
        } catch (err) {
          return reply(`\`🖼️ FOTO/VIDEO DE PERFIL\`

\`✘ ERROR ›\` No se pudo descargar la URL: ${err.message}`);
        }
      } else {
        descarga = await descargarDesdeMensaje(msg);
      }

      if (!descarga) {
        return reply(`\`🖼️ FOTO/VIDEO DE PERFIL\`

\`✘ ERROR ›\` Responde a una imagen o video con este comando, o usa *!setfoto <url>*.
> _El video se mostrará siempre en reproducción (loop) en tu perfil._`);
      }

      if (descarga.buffer.length > MAX_MEDIA_BYTES) {
        return reply(`\`🖼️ FOTO/VIDEO DE PERFIL\`

\`✘ ERROR ›\` El archivo pesa demasiado (máx. ${MAX_MEDIA_BYTES / (1024 * 1024)}MB).`);
      }

      try {
        if (!existsSync(PROFILE_DIR)) mkdirSync(PROFILE_DIR, { recursive: true });

        const base = baseMediaPath(senderRaw);
        const destino = descarga.tipo === "video" ? `${base}.mp4` : `${base}.jpg`;
        writeFileSync(destino, descarga.buffer);
        clearOtherMedia(senderRaw, descarga.tipo);

        const tipoTexto = descarga.tipo === "video" ? "Video (en loop)" : "Imagen";
        await reply(`\`🖼️ ${tipoTexto.toUpperCase()} ACTUALIZADO ✅\`

> _Usa *!perfil* para verla._`);
      } catch (err) {
        console.error("Error al guardar media de perfil:", err);
        await reply(`\`🖼️ FOTO/VIDEO DE PERFIL\`

\`✘ ERROR ›\` No se pudo guardar el archivo, intenta de nuevo.`);
      }
    },
  },
];
