import { db } from "../../src/database.js";
import { participantForms, addAllForms, normalizeJid, jidToNumber, lidToJid } from "../../src/jid.js";

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

  const amountArgs = quoted && !mention ? args : args.slice(1);
  return { jid, amountArgs };
}

export default [
  {
    command: ["transfer", "transferir", "enviar", "pay"],
    description: "💸 Envía monedas a otro usuario.",
    async execute({ sock, msg, remoteJid, senderRaw, args, reply }) {
      const { jid: rawJid, amountArgs } = getTarget(msg, args);

      if (!rawJid) {
        return reply(`\`💸 TRANSFERENCIA\`

\`✘ ERROR ›\` Menciona o responde al usuario que quieres enviar monedas.

> _Uso: *!transfer @user <cantidad>*_`);
      }

      let meta;
      try {
        meta = await sock.groupMetadata(remoteJid);
      } catch {
        return reply(`\`💸 TRANSFERENCIA\`\n\n\`✘ ERROR ›\` No se pudo obtener la información del grupo.`);
      }

      const participant = findParticipant(meta.participants, rawJid);
      if (!participant) {
        return reply(`\`💸 TRANSFERENCIA\`\n\n\`✘ ERROR ›\` Ese usuario no está en el grupo.`);
      }

      let targetJid = participant.jid || lidToJid(participant.id);
      targetJid = normalizeJid(targetJid);
      if (!targetJid) {
        return reply(`\`💸 TRANSFERENCIA\`\n\n\`✘ ERROR ›\` No se pudo determinar el JID del destinatario.`);
      }

      if (senderRaw === targetJid) {
        return reply(`\`💸 TRANSFERENCIA\`\n\n\`✘ ERROR ›\` No puedes enviarte monedas a ti mismo.`);
      }

      const sender = db.getUser(senderRaw);
      const amountStr = amountArgs[0];
      let amount = amountStr === "all" ? (sender.coins ?? 100) : parseInt(amountStr);

      if (isNaN(amount) || amount <= 0) {
        return reply(`\`💸 TRANSFERENCIA\`\n\n\`✘ ERROR ›\` Cantidad inválida.`);
      }
      if ((sender.coins ?? 100) < amount) {
        return reply(`\`💸 SIN FONDOS\`

\`💰 TU SALDO ›\` *${sender.coins ?? 100}* monedas
\`💰 NECESITAS ›\` *${amount}* monedas`);
      }

      db.updateUser(senderRaw, (u) => { u.coins -= amount; });
      db.updateUser(targetJid, (u) => { u.coins = (u.coins ?? 100) + amount; });

      const targetNumber = jidToNumber(targetJid) || targetJid.split("@")[0];

      const texto = `\`💸 ¡TRANSFERENCIA EXITOSA!\`

\`💰 ENVIADO ›\` *${amount}* monedas
\`📤 PARA ›\` +${targetNumber}`;

      await reply(texto);
    },
  },
];
