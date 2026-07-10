export default [
  {
    command: ["unwarn", "perdonar"],
    description: "Quita los avisos de un usuario.",
    adminOnly: true,
    async execute({ sock, msg, remoteJid, args, jidToNumber, warns, getTarget, reply }) {
      const { jid } = getTarget(msg, args);
      if (!jid) return reply("⚠️ Menciona, responde o pon el número del usuario.");

      warns.reset(remoteJid, jid);
      await sock.sendMessage(
        remoteJid,
        { text: `✅ Se quitaron los avisos de +${jidToNumber(jid)}.`, mentions: [jid] },
        { quoted: msg }
      );
    },
  },
];
