export default [
  {
    command: ["tagall", "mencionartodos"],
    description: "Menciona a todos los miembros del grupo.",
    adminOnly: true,
    async execute({ sock, msg, remoteJid, args, jidToNumber, reply }) {
      let meta;
      try {
        meta = await sock.groupMetadata(remoteJid);
      } catch {
        return reply("❌ No se pudo obtener la información del grupo.");
      }

      const lista = meta.participants.map((p) => `• @${jidToNumber(p.id)}`).join("\n");
      const titulo = args.join(" ") || "Atención todos";

      await sock.sendMessage(
        remoteJid,
        { text: `📢 *${titulo}*\n\n${lista}`, mentions: meta.participants.map((p) => p.id) },
        { quoted: msg }
      );
    },
  },
];
