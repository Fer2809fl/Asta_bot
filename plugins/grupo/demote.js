import { participantForms, addAllForms } from "../../src/jid.js";

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

export default [
  {
    command: ["demote", "degradar"],
    description: "Quita los permisos de administrador a un usuario.",
    adminOnly: true,
    botAdmin: true,
    async execute({ sock, msg, remoteJid, args, jidToNumber, getTarget, reply }) {
      const { jid: rawJid } = getTarget(msg, args);
      if (!rawJid) return reply("⚠️ Menciona o responde al usuario que quieres degradar.");

      let meta;
      try { meta = await sock.groupMetadata(remoteJid); } catch { return reply("❌ No se pudo obtener la información del grupo."); }

      const participant = findParticipant(meta.participants, rawJid);
      if (!participant) return reply("⚠️ Ese usuario no está en el grupo.");

      try {
        await sock.groupParticipantsUpdate(remoteJid, [participant.id], "demote");
        await sock.sendMessage(remoteJid, { text: `✅ @${jidToNumber(participant.id)} ya no es *administrador*.`, mentions: [participant.id] }, { quoted: msg });
      } catch {
        await reply("❌ No pude degradar al usuario. Verifica permisos del bot.");
      }
    },
  },
];
