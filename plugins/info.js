import { jidToNumber } from "../src/jid.js";

export default [
  {
    command: ["info", "infogrupo"],
    description: "Muestra información del grupo.",
    async execute({ sock, remoteJid, reply }) {
      let groupMeta = null;
      try {
        groupMeta = await sock.groupMetadata(remoteJid);
      } catch {
        return reply("❌ No se pudo obtener la información del grupo.");
      }

      const participants = groupMeta.participants;
      const admins = participants.filter((p) => p.admin).length;

      const adminList = participants
        .filter((p) => p.admin)
        .map((p) => {
          const numero = jidToNumber(p.jid || p.id);
          const tag = p.admin === "superadmin" ? "👑" : "🛡️";
          return `  ${tag} +${numero}`;
        })
        .join("\n");

      const text =
        `📋 *${groupMeta.subject}*\n` +
        `👥 Participantes: ${participants.length}\n` +
        `🛡️ Admins: ${admins}\n` +
        (adminList ? `${adminList}\n` : "") +
        `📝 Descripción: ${groupMeta.desc || "Sin descripción"}`;

      await reply(text);
    },
  },
];
