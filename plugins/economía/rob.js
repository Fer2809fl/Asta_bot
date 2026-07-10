import { db } from "../../src/database.js";
import { 
  participantForms, 
  addAllForms, 
  normalizeJid, 
  jidToNumber,
  lidToJid 
} from "../../src/jid.js";

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
    command: ["rob", "robar"],
    description: "Intenta robarle monedas a otro usuario.",
    async execute({ sock, msg, remoteJid, args, reply }) {
      // ─── CONFIGURACIÓN DEL ROBO ──────────────────────────
      const CONFIG = {
        
        SUCCESS_RATE: 0.5,

        STEAL_MIN_PERCENT: 10,   // 10%
        STEAL_MAX_PERCENT: 40,   // 40%
 
        FINE_MIN: 30,   // 30 monedas
        FINE_MAX: 100,  // 100 monedas

        VICTIM_MIN_COINS: 50,   // La víctima debe tener al menos X monedas
        THIEF_MIN_COINS: 50,    // El ladrón debe tener al menos X monedas

        COOLDOWN_TIME: 30 * 60 * 1000, // 30 minutos
      };

      const senderJid = normalizeJid(msg.key.participant || msg.key.remoteJid);
      if (!senderJid) return reply("❌ No se pudo identificar tu usuario.");

      const senderData = db.getUser(senderJid);
      const cooldownKey = 'rob';
      const lastRob = senderData.cooldowns?.[cooldownKey] || 0;
      const timeLeft = lastRob + CONFIG.COOLDOWN_TIME - Date.now();

      if (timeLeft > 0) {
        const minutes = Math.ceil(timeLeft / 60000);
        const seconds = Math.ceil((timeLeft % 60000) / 1000);
        const timeStr = minutes > 0 ? `${minutes} minuto${minutes > 1 ? 's' : ''}` : `${seconds} segundo${seconds > 1 ? 's' : ''}`;
        return reply(`⏳ Debes esperar *${timeStr}* para robar nuevamente.`);
      }

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
        return reply("⚠️ Menciona o responde al usuario que quieres robar.");
      }

      let meta;
      try {
        meta = await sock.groupMetadata(remoteJid);
      } catch {
        return reply("❌ No se pudo obtener la información del grupo.");
      }

      const participant = findParticipant(meta.participants, rawJid);
      if (!participant) {
        return reply("⚠️ Ese usuario no está en el grupo.");
      }

      let targetJid = participant.jid;
      if (!targetJid) {
        targetJid = lidToJid(participant.id);
      }
      targetJid = normalizeJid(targetJid);
      if (!targetJid) return reply("❌ No se pudo determinar el JID del destinatario.");

      if (senderJid === targetJid) {
        return reply("⚠️ No puedes robarte a ti mismo.");
      }

      const target = db.getUser(targetJid);
      if (target.coins < CONFIG.VICTIM_MIN_COINS) {
        return reply(`⚠️ La víctima no tiene suficientes monedas (mínimo ${CONFIG.VICTIM_MIN_COINS} monedas).`);
      }

      if (senderData.coins < CONFIG.THIEF_MIN_COINS) {
        return reply(`⚠️ Necesitas al menos ${CONFIG.THIEF_MIN_COINS} monedas en cartera para pagar la fianza si te atrapan.`);
      }

      const success = Math.random() < CONFIG.SUCCESS_RATE;
      
      db.updateUser(senderJid, (u) => {
        u.cooldowns ??= {};
        u.cooldowns[cooldownKey] = Date.now();
      });

      if (success) {
        const percent = Math.floor(Math.random() * (CONFIG.STEAL_MAX_PERCENT - CONFIG.STEAL_MIN_PERCENT + 1)) + CONFIG.STEAL_MIN_PERCENT;
        const stolen = Math.floor((target.coins * percent) / 100);
        
        db.updateUser(targetJid, (u) => { u.coins -= stolen; });
        db.updateUser(senderJid, (u) => { u.coins = (u.coins ?? 100) + stolen; });
        
        const targetNumber = jidToNumber(targetJid) || targetJid.split('@')[0];
        await reply(`🎯 ¡Robo exitoso! Le robaste *${stolen}* monedas a +${targetNumber} (${percent}% de su cartera).`);
      } else {
        const fine = Math.floor(Math.random() * (CONFIG.FINE_MAX - CONFIG.FINE_MIN + 1)) + CONFIG.FINE_MIN;
        const fineFinal = Math.min(senderData.coins, fine);
        
        db.updateUser(senderJid, (u) => { u.coins -= fineFinal; });
        db.updateUser(targetJid, (u) => { u.coins = (u.coins ?? 100) + fineFinal; });
        
        const targetNumber = jidToNumber(targetJid) || targetJid.split('@')[0];
        await reply(`👮 ¡Te atraparon! Tuviste que pagar una multa de *${fineFinal}* monedas a +${targetNumber}.`);
      }
    },
  },
];
