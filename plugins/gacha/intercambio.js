import { gacha } from "../../src/gacha.js";
import { 
  participantForms, 
  addAllForms, 
  normalizeJid, 
  jidToNumber,
  lidToJid 
} from "../../src/jid.js";

const TRADE_TIMEOUT = 60_000;

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

  const reason = quoted && !mention ? args.join(" ") : args.slice(1).join(" ");
  return { jid, reason };
}

export default [
  {
    command: ["intercambio", "trade", "tr"],
    category: "gacha",
    description: "Propone un intercambio de personajes. Uso: .trade @usuario <tuID> <suID>",
    async execute({ sock, msg, remoteJid, args, reply }) {
      let rawJid = null;

      const targetResult = getTarget(msg, args);
      if (targetResult?.jid) {
        rawJid = targetResult.jid;
      }

      if (!rawJid) {
        const mentionArg = args.find(arg => arg.includes('@'));
        if (mentionArg) {
          const match = mentionArg.match(/@(\d+)/);
          if (match) {
            rawJid = match[1] + '@lid';
          }
        }
      }

      if (!rawJid && msg.quoted) {
        const quotedSender = msg.quoted.key?.participant || msg.quoted.key?.remoteJid;
        if (quotedSender) {
          rawJid = normalizeJid(quotedSender);
        }
      }

      if (!rawJid) {
        return reply("❓ Menciona al usuario con quien tradear. Ej: *.trade @usuario 12 34*");
      }

      let meta;
      try { meta = await sock.groupMetadata(remoteJid); } catch { return reply("❌ No se pudo obtener info del grupo."); }

      const participant = findParticipant(meta.participants, rawJid);
      if (!participant) return reply("⚠️ Ese usuario no está en el grupo.");

      let targetJid = participant.jid;
      if (!targetJid) {
        targetJid = lidToJid(participant.id);
      }
      targetJid = normalizeJid(targetJid);
      if (!targetJid) return reply("❌ No se pudo determinar el JID del destinatario.");

      const senderJid = normalizeJid(msg.key.participant || msg.key.remoteJid);
      if (!senderJid) return reply("❌ No se pudo identificar tu usuario.");

      if (targetJid === senderJid) return reply("⚠️ No puedes tradear contigo mismo.");

      const ids = args.filter(x => !x.includes("@") && /^\d+$/.test(x));
      const myId = parseInt(ids[0]);
      const theirId = parseInt(ids[1]);

      if (!myId || !theirId) {
        return reply("❓ Indica los IDs. Ej: *.trade @usuario <tuID> <suID>*");
      }

      const [myOwns, theirOwns] = await Promise.all([
        gacha.userOwnsCharacter(senderJid, myId),
        gacha.userOwnsCharacter(targetJid, theirId),
      ]);

      if (!myOwns) return reply(`⚠️ No tienes el personaje con ID *${myId}* en tu harem.`);
      if (!theirOwns) return reply(`⚠️ +${jidToNumber(targetJid)} no tiene el personaje con ID *${theirId}*.`);

      const [myChar, theirChar] = await Promise.all([
        gacha.searchCharacter(String(myId)),
        gacha.searchCharacter(String(theirId)),
      ]);

      global._pendingTrades ?? (global._pendingTrades = new Map());

      const tradeKey = `${remoteJid}__${senderJid}__${targetJid}`;
      global._pendingTrades.set(tradeKey, {
        from: senderJid,
        to: targetJid,
        myChar,
        theirChar,
        expiresAt: Date.now() + TRADE_TIMEOUT,
      });
      setTimeout(() => global._pendingTrades?.delete(tradeKey), TRADE_TIMEOUT);

      await sock.sendMessage(remoteJid, {
        text:
          `🔀 *Propuesta de intercambio*\n\n` +
          `Ofrece: *${myChar.name}* (${myChar.series}) · 💴 ${myChar.value.toLocaleString()} ¥\n` +
          `Pide: *${theirChar.name}* (${theirChar.series}) · 💴 ${theirChar.value.toLocaleString()} ¥\n\n` +
          `@${jidToNumber(targetJid)} responde *.aceptar* o *.rechazar* en 60s`,
        mentions: [targetJid],
      }, { quoted: msg });
    },
  },

  {
    command: ["aceptar", "accept"],
    category: "gacha",
    description: "Acepta un intercambio pendiente.",
    async execute({ sock, msg, remoteJid, jidToNumber, reply }) {
      const senderJid = normalizeJid(msg.key.participant || msg.key.remoteJid);
      if (!senderJid) return reply("❌ No se pudo identificar tu usuario.");

      global._pendingTrades ?? (global._pendingTrades = new Map());

      const trade = [...global._pendingTrades.entries()].find(
        ([k, v]) => k.startsWith(remoteJid) && v.to === senderJid
      );

      if (!trade) return reply("⚠️ No tienes ningún intercambio pendiente.");

      const [tradeKey, { from, to, myChar, theirChar, expiresAt }] = trade;

      if (Date.now() > expiresAt) {
        global._pendingTrades.delete(tradeKey);
        return reply("⏰ La propuesta de intercambio expiró.");
      }

      try {
        await gacha.removeCharacter(from, myChar.id);
        await gacha.removeCharacter(to, theirChar.id);
        await gacha.giveCharacter(to, myChar.id);
        await gacha.giveCharacter(from, theirChar.id);

        global._pendingTrades.delete(tradeKey);

        await reply(
          `✅ *Intercambio completado.*\n\n` +
          `+${jidToNumber(from)} recibió: *${theirChar.name}*\n` +
          `+${jidToNumber(to)} recibió: *${myChar.name}*`
        );
      } catch (e) {
        await reply(`❌ Error al completar el intercambio: ${e.message}`);
      }
    },
  },

  {
    command: ["rechazar", "decline"],
    category: "gacha",
    description: "Rechaza un intercambio pendiente.",
    async execute({ msg, remoteJid, reply }) {
      const senderJid = normalizeJid(msg.key.participant || msg.key.remoteJid);
      if (!senderJid) return reply("❌ No se pudo identificar tu usuario.");

      global._pendingTrades ?? (global._pendingTrades = new Map());

      const trade = [...global._pendingTrades.entries()].find(
        ([k, v]) => k.startsWith(remoteJid) && v.to === senderJid
      );

      if (!trade) return reply("⚠️ No tienes ningún intercambio pendiente.");

      const [tradeKey, { myChar, theirChar }] = trade;
      global._pendingTrades.delete(tradeKey);

      await reply(`❌ Intercambio rechazado. *${myChar.name}* ↔ *${theirChar.name}*`);
    },
  },
];
