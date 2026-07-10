import { db } from "../../src/database.js";
import { participantForms, addAllForms, normalizeJid, jidToNumber } from "../../src/jid.js";

const PROPOSAL_TIMEOUT = 5 * 60 * 1000; // 5 min para aceptar
const RING_COST = 5000;

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

function numOf(jid) {
  return jidToNumber(jid) || jid.split("@")[0].split(":")[0];
}

export default [
  {
    command: ["marry", "casar", "casarme"],
    description: "💍 Propón matrimonio a alguien (mencionalo o responde su mensaje).",
    async execute({ sock, msg, remoteJid, senderRaw, args, reply }) {
      const { jid: rawJid } = getTarget(msg, args);
      if (!rawJid) {
        return reply(`\`💍 MATRIMONIO\`

\`✘ ERROR ›\` Menciona o responde a la persona con quien te quieres casar.
> _Ejemplo: !marry @persona_`);
      }

      let targetJid = rawJid;
      try {
        const meta = await sock.groupMetadata(remoteJid);
        const participant = findParticipant(meta.participants, rawJid);
        targetJid = participant ? participant.id : rawJid;
      } catch {}

      const senderNorm = normalizeJid(senderRaw);
      const targetNorm = normalizeJid(targetJid);

      if (senderNorm === targetNorm) {
        return reply(`\`💍 MATRIMONIO\`

\`✘ ERROR ›\` No puedes casarte contigo mismo/a.`);
      }

      const sender = db.getUser(senderRaw);
      const target = db.getUser(targetJid);

      if (sender.profile?.married) {
        return reply(`\`💍 MATRIMONIO\`

\`✘ ERROR ›\` Ya estás casado/a. Usa *!divorciar* si quieres terminar tu matrimonio actual.`);
      }
      if (target.profile?.married) {
        return reply(`\`💍 MATRIMONIO\`

\`✘ ERROR ›\` Esa persona ya está casada.`);
      }
      if ((sender.coins ?? 0) < RING_COST) {
        return reply(`\`💍 MATRIMONIO\`

\`✘ ERROR ›\` Necesitas *${RING_COST}* monedas para comprar el anillo.`);
      }

      const now = Date.now();
      db.updateUser(senderRaw, (u) => {
        u.profile ??= {};
        u.profile.proposalTo = targetJid;
        u.profile.proposalAt = now;
      });
      db.updateUser(targetJid, (u) => {
        u.profile ??= {};
        u.profile.proposalFrom = senderRaw;
        u.profile.proposalAt = now;
      });

      await reply(`\`💍 PROPUESTA DE MATRIMONIO\`

\`💌 DE ›\` +${numOf(senderRaw)}
\`💝 PARA ›\` +${numOf(targetJid)}

> _+${numOf(targetJid)}, usa *!aceptarboda* para decir que sí, o *!rechazarboda* para declinar. Tienes 5 minutos._`);
    },
  },
  {
    command: ["aceptarboda"],
    description: "💍 Acepta una propuesta de matrimonio pendiente.",
    async execute({ senderRaw, reply }) {
      const user = db.getUser(senderRaw);
      const proposerJid = user.profile?.proposalFrom;
      const now = Date.now();

      if (!proposerJid || now - (user.profile?.proposalAt ?? 0) > PROPOSAL_TIMEOUT) {
        return reply(`\`💍 MATRIMONIO\`

\`✘ ERROR ›\` No tienes ninguna propuesta pendiente.`);
      }

      const proposer = db.getUser(proposerJid);
      if ((proposer.coins ?? 0) < RING_COST) {
        db.updateUser(senderRaw, (u) => { delete u.profile.proposalFrom; delete u.profile.proposalAt; });
        db.updateUser(proposerJid, (u) => { delete u.profile.proposalTo; delete u.profile.proposalAt; });
        return reply(`\`💍 MATRIMONIO\`

\`✘ ERROR ›\` +${numOf(proposerJid)} ya no tiene monedas suficientes para el anillo. La propuesta se canceló.`);
      }

      const now2 = Date.now();
      db.updateUser(proposerJid, (u) => {
        u.coins = (u.coins ?? 0) - RING_COST;
        u.profile ??= {};
        u.profile.married = senderRaw;
        u.profile.marriedSince = now2;
        delete u.profile.proposalTo;
        delete u.profile.proposalAt;
      });
      db.updateUser(senderRaw, (u) => {
        u.profile ??= {};
        u.profile.married = proposerJid;
        u.profile.marriedSince = now2;
        delete u.profile.proposalFrom;
        delete u.profile.proposalAt;
      });

      await reply(`\`💍 ¡FELICIDADES! 🎉\`

\`💑 PAREJA ›\` +${numOf(proposerJid)} & +${numOf(senderRaw)}

> _Ahora son pareja oficial. Usa *!perfil* para verlo._`);
    },
  },
  {
    command: ["rechazarboda"],
    description: "💔 Rechaza una propuesta de matrimonio pendiente.",
    async execute({ senderRaw, reply }) {
      const user = db.getUser(senderRaw);
      const proposerJid = user.profile?.proposalFrom;

      if (!proposerJid) {
        return reply(`\`💔 MATRIMONIO\`

\`✘ ERROR ›\` No tienes ninguna propuesta pendiente.`);
      }

      db.updateUser(senderRaw, (u) => { delete u.profile.proposalFrom; delete u.profile.proposalAt; });
      db.updateUser(proposerJid, (u) => { delete u.profile.proposalTo; delete u.profile.proposalAt; });

      await reply(`\`💔 PROPUESTA RECHAZADA\`

> _Le rompiste el corazón a +${numOf(proposerJid)}._`);
    },
  },
  {
    command: ["divorciar", "divorcio"],
    description: "💔 Termina tu matrimonio actual.",
    async execute({ senderRaw, reply }) {
      const user = db.getUser(senderRaw);
      const partnerJid = user.profile?.married;

      if (!partnerJid) {
        return reply(`\`💔 DIVORCIO\`

\`✘ ERROR ›\` No estás casado/a con nadie.`);
      }

      db.updateUser(senderRaw, (u) => { delete u.profile.married; delete u.profile.marriedSince; });
      db.updateUser(partnerJid, (u) => { delete u.profile.married; delete u.profile.marriedSince; });

      await reply(`\`💔 DIVORCIO CONFIRMADO\`

\`✦ SEPARADOS ›\` +${numOf(senderRaw)} & +${numOf(partnerJid)}`);
    },
  },
];
