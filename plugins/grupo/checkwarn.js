export default [
  {
    command: ["verwarn", "advertencias"],
    description: "Muestra los avisos de un usuario.",
    async execute({ sock, msg, remoteJid, senderRaw, args, jidToNumber, warns, getTarget }) {
      const target = getTarget(msg, args).jid || senderRaw;
      const max = global.maxWarns ?? 3;

      await sock.sendMessage(
        remoteJid,
        { text: `📋 +${jidToNumber(target)} tiene ${warns.get(remoteJid, target)}/${max} avisos.`, mentions: [target] },
        { quoted: msg }
      );
    },
  },
];
