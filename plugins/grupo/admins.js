export default [
  {
    command: ["admins", "administradores", "listadmins"],
    description: "Muestra la lista de administradores del grupo.",
    async execute({ sock, msg, remoteJid, jidToNumber, reply }) {
      let meta;
      try {
        meta = await sock.groupMetadata(remoteJid);
      } catch {
        return reply("❌ No se pudo obtener la información del grupo.");
      }

      const admins = meta.participants.filter(
        (p) => p.admin === "admin" || p.admin === "superadmin"
      );

      if (admins.length === 0) return reply("⚠️ No se encontraron administradores.");

      const lista = admins
        .map((p) => {
          const tag = p.admin === "superadmin" ? "👑" : "🛡️";
          return `${tag} @${jidToNumber(p.id)}`;
        })
        .join("\n");

      await sock.sendMessage(
        remoteJid,
        {
          text: `👥 *Administradores del grupo:*\n\n${lista}`,
          mentions: admins.map((p) => p.id),
        },
        { quoted: msg }
      );
    },
  },
];
