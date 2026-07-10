import {
  normalizeJid,
  jidToNumber,
  lidToJid,
  participantForms,
  addAllForms,
} from "../../src/jid.js";

// Igual que en rob.js / top10.js: busca el participante real dentro
// de meta.participants a partir de cualquier forma de su jid.
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

// Saca el jid objetivo desde: mención, mensaje respondido, o número en args.
function getTarget(msg, args) {
  const ctx = msg.message?.extendedTextMessage?.contextInfo;
  const mention = ctx?.mentionedJid?.[0];
  const quoted = ctx?.participant;

  if (mention) return normalizeJid(mention);
  if (quoted) return normalizeJid(quoted);
  if (/^\d/.test(args[0] || "")) {
    return `${args[0].replace(/\D/g, "")}@s.whatsapp.net`;
  }
  return null;
}

export default [
  {
    command: ["pfp", "fotoperfil", "avatar"],
    description: "📸 Envía la foto de perfil de la persona mencionada, respondida, o por número.",
    async execute({ sock, msg, remoteJid, args, senderRaw, reply }) {
      let targetJid = getTarget(msg, args) || senderRaw;
      targetJid = normalizeJid(targetJid) || targetJid;

      // En grupos, resuelve contra la metadata real para que el jid/lid
      // quede correcto (mismo patrón que rob.js y top10.js).
      if (remoteJid?.endsWith("@g.us")) {
        try {
          const meta = await sock.groupMetadata(remoteJid);
          const found = findParticipant(meta.participants, targetJid);
          if (found) {
            let resolved = found.jid;
            if (!resolved && found.id) resolved = lidToJid(found.id);
            if (resolved) targetJid = normalizeJid(resolved) || resolved;
          }
        } catch {
          // si falla la metadata, seguimos con el targetJid que ya teníamos
        }
      }

      const numero = jidToNumber(targetJid) || targetJid.split("@")[0];

      let url;
      try {
        url = await sock.profilePictureUrl(targetJid, "image");
      } catch {
        url = null;
      }

      if (!url) {
        return reply(
          `\`📸 PFP\`\n\n\`✘ ERROR ›\` +${numero} no tiene foto de perfil o es privada.`
        );
      }

      await sock.sendMessage(
        remoteJid,
        {
          image: { url },
          caption: `\`📸 FOTO DE PERFIL\`\n\n\`✦ USUARIO ›\` +${numero}`,
          mentions: [targetJid],
        },
        { quoted: msg }
      );
    },
  },
];