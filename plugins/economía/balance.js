import { db } from "../../src/database.js";
import { participantForms, addAllForms, normalizeJid, jidToNumber } from "../../src/jid.js";

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

function getTarget(msg, args) {
  const ctx = msg.message?.extendedTextMessage?.contextInfo;
  const mention = ctx?.mentionedJid?.[0];
  const quoted = ctx?.participant;

  let jid = null;
  if (mention) jid = normalizeJid(mention);
  else if (quoted) jid = normalizeJid(quoted);
  else if (/^\d/.test(args[0] || "")) jid = `${args[0].replace(/\D/g, "")}@s.whatsapp.net`;

  return { jid };
}

export default [
  {
    command: ["bal", "balance", "cartera", "monedas"],
    description: "Muestra tu balance actual de monedas y banco.",
    async execute({ sock, msg, remoteJid, senderRaw, args, reply }) {
      let targetJid = senderRaw;
      let isSelf = true;

      const { jid: rawJid } = getTarget(msg, args);
      if (rawJid) {
        try {
          const meta = await sock.groupMetadata(remoteJid);
          const participant = findParticipant(meta.participants, rawJid);
          targetJid = participant ? participant.id : rawJid;
        } catch {
          targetJid = rawJid;
        }
        isSelf = false;
      }

      const user = db.getUser(targetJid);
      const num = jidToNumber(targetJid) || targetJid.split("@")[0].split(":")[0];
      const coins = user.coins ?? 100;
      const bank = user.bank ?? 0;
      const total = coins + bank;

      const texto = `\`🪙 ${isSelf ? "TU BALANCE" : `BALANCE DE +${num}`}\`

\`💰 MONEDAS ›\` *${coins.toLocaleString()}*
\`🏦 BANCO ›\` *${bank.toLocaleString()}*
\`📊 TOTAL ›\` *${total.toLocaleString()}*

> _Usa *!dep* para guardar y *!with* para retirar_`;

      await reply(texto);
    },
  },
];
