// src/groupEvents.js
import {
  normalizeJid,
  jidToNumber,
  lidToJid,
  participantForms,
  addAllForms,
} from "./jid.js";
import { adminManager } from "./adminManager.js";

// Igual que findParticipant en rob.js: busca dentro de meta.participants
// el objeto cuyo id/lid coincida con el jid crudo que llegó del evento.
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

// Resuelve un participante crudo del evento a un jid normalizado real.
// Prioriza el match contra meta.participants (igual que top10.js);
// si no está en metadata (ej: acaba de salir del grupo), usa lidToJid
// como respaldo directo sobre el string crudo.
function resolveParticipant(raw, metaParticipants) {
  const found = metaParticipants ? findParticipant(metaParticipants, raw) : null;

  let targetJid = found?.jid;
  if (!targetJid && found?.id) targetJid = lidToJid(found.id);
  if (!targetJid) targetJid = lidToJid(raw);
  if (!targetJid) targetJid = raw;

  return normalizeJid(targetJid) || targetJid;
}

function displayNumber(jid) {
  return jidToNumber(jid) || jid?.split("@")[0]?.split(":")[0] || "?";
}

export function handleGroupEvents(sock) {
  // ─── CAMBIOS EN EL GRUPO: nombre, descripción, foto, config ───
  sock.ev.on("groups.update", async (updates) => {
    for (const update of updates) {
      const groupJid = update.id;
      if (!groupJid) continue;

      try {
        if (update.subject) {
          await sock.sendMessage(groupJid, {
            text:
`\`📝 GRUPO ACTUALIZADO\`

\`✦ CAMBIO ›\` *Nombre del grupo*
\`🏷️ NUEVO NOMBRE ›\` *${update.subject}*`
          });
        }

        if (update.desc !== undefined) {
          await sock.sendMessage(groupJid, {
            text:
`\`📝 GRUPO ACTUALIZADO\`

\`✦ CAMBIO ›\` *Descripción del grupo*
\`📄 NUEVA DESCRIPCIÓN ›\`
${update.desc?.trim() ? update.desc.trim() : "_Sin descripción_"}`
          });
        }

        if (update.imgUrl !== undefined) {
          await sock.sendMessage(groupJid, {
            text:
`\`🖼️ GRUPO ACTUALIZADO\`

\`✦ CAMBIO ›\` *Foto del grupo*
\`ℹ️ INFO ›\` *Se estableció una nueva foto de perfil.*`
          });
        }

        if (update.announce !== undefined) {
          await sock.sendMessage(groupJid, {
            text:
`\`⚙️ GRUPO ACTUALIZADO\`

\`✦ CAMBIO ›\` *Modo de mensajes*
\`🔒 ESTADO ›\` *${update.announce ? "Solo admins pueden escribir" : "Todos pueden escribir"}*`
          });
        }

        if (update.restrict !== undefined) {
          await sock.sendMessage(groupJid, {
            text:
`\`⚙️ GRUPO ACTUALIZADO\`

\`✦ CAMBIO ›\` *Edición del grupo*
\`🔒 ESTADO ›\` *${update.restrict ? "Solo admins editan info del grupo" : "Todos pueden editar info del grupo"}*`
          });
        }
      } catch (e) {
        console.error("[groupEvents:groups.update]", e.message);
      }
    }
  });

  // ─── PARTICIPANTES: entra, sale, promovido, degradado ───
  sock.ev.on("group-participants.update", async ({ id: groupJid, participants, action }) => {
    if (!groupJid || !participants?.length) return;

    adminManager.invalidate(groupJid);

    if (action !== "promote" && action !== "demote") return;

    try {
      // Metadata fresca del grupo, igual que top10.js.
      let meta = null;
      try {
        meta = await sock.groupMetadata(groupJid);
      } catch {
        meta = null;
      }

      const resueltos = participants
        .map((raw) => resolveParticipant(raw, meta?.participants))
        .filter(Boolean);

      if (!resueltos.length) return;

      const lineas = resueltos
        .map((jid, i) => `*${i + 1}.* @${displayNumber(jid)}`)
        .join("\n");

      let titulo = "";
      let subtitulo = "";

      switch (action) {
        case "promote":
          titulo = "👑 NUEVO ADMIN";
          subtitulo = "Ahora son administradores del grupo.";
          break;
        case "demote":
          titulo = "📉 ADMIN REMOVIDO";
          subtitulo = "Ya no son administradores del grupo.";
          break;
      }

      const texto =
`\`${titulo}\`

${lineas}

\`ℹ️ INFO ›\` *${subtitulo}*`;

      await sock.sendMessage(groupJid, { text: texto, mentions: resueltos });
    } catch (e) {
      console.error("[groupEvents:group-participants.update]", e.message);
    }
  });
}
