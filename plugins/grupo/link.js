export default [
  {
    command: ["link", "linkgrupo"],
    description: "Envía el link de invitación del grupo.",
    adminOnly: true,
    botAdmin: true,
    async execute({ sock, msg, remoteJid, reply }) {
      try {
        const code = await sock.groupInviteCode(remoteJid);
        await sock.sendMessage(
          remoteJid,
          { text: `🔗 *Link del grupo:*\n\nhttps://chat.whatsapp.com/${code}` },
          { quoted: msg }
        );
      } catch {
        await reply("❌ No pude obtener el link. Verifica que el bot sea admin.");
      }
    },
  },
];
