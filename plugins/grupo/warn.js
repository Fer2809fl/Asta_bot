export default [
  {
    command: ["warn", "advertir"],
    description: "Da un aviso a un usuario. Al llegar al máximo, es expulsado.",
    adminOnly: true,
    botAdmin: true,
    async execute({ sock, msg, remoteJid, args, jidToNumber, warns, getTarget, reply }) {
      const { jid, reason } = getTarget(msg, args);
      if (!jid) return reply("⚠️ Menciona, responde o pon el número del usuario a advertir.");

      const max = global.maxWarns ?? 3;
      const total = warns.add(remoteJid, jid);
      const motivo = reason ? `\n📝 Motivo: ${reason}` : "";

      if (total >= max) {
        warns.reset(remoteJid, jid);
        await sock.sendMessage(remoteJid, {
          text: `🚫 +${jidToNumber(jid)} alcanzó ${max} avisos y fue expulsado.${motivo}`,
          mentions: [jid],
        });
        await sock.groupParticipantsUpdate(remoteJid, [jid], "remove")
          .catch(() => reply("⚠️ No pude expulsar al usuario, revisa mis permisos."));
        return;
      }

      await sock.sendMessage(
        remoteJid,
        { text: `⚠️ +${jidToNumber(jid)} recibió un aviso (${total}/${max})${motivo}`, mentions: [jid] },
        { quoted: msg }
      );
    },
  },
];
