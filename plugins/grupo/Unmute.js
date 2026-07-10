import { muteManager } from "../../src/muteManager.js";
import { normalizeJid, jidToNumber } from "../../src/jid.js";
import { resolveParticipantJid } from "./Muteutils.js";

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
    command: ["unmute", "quitarmute", "desmutear"],
    description: "Quita el mute a los usuarios mencionados.",
    adminOnly: true,
    botAdmin: true,
    groupOnly: true,
    async execute({ sock, msg, remoteJid, args, reply }) {
      // ─── Detección tipo rob.js ─────────────────────────────
      let rawJid = null;

      const targetResult = getTarget(msg, args);
      if (targetResult?.jid) {
        rawJid = targetResult.jid;
      }

      // Si no hay por contextInfo, buscar @número en args
      if (!rawJid) {
        const mentionArg = args.find(arg => arg.includes('@'));
        if (mentionArg) {
          const match = mentionArg.match(/@(\d+)/);
          if (match) {
            rawJid = match[1] + '@s.whatsapp.net';
          }
        }
      }

      // Si no hay, intentar quoted del mensaje respondido
      if (!rawJid && msg.quoted) {
        const quotedSender = msg.quoted.key?.participant || msg.quoted.key?.remoteJid;
        if (quotedSender) {
          rawJid = normalizeJid(quotedSender);
        }
      }

      // Si aún no hay, intentar número directo en args[0]
      if (!rawJid && /^\d/.test(args[0] || "")) {
        rawJid = `${args[0].replace(/\D/g, "")}@s.whatsapp.net`;
      }

      if (!rawJid) {
        return reply("⚠️ Menciona, responde o pon el número de la persona a la que quieres quitar el mute.");
      }

      // ─── Verificar que el usuario está en el grupo y resolver ──
      // su JID real (número), igual que hace rob.js, en vez de usar
      // el rawJid crudo (que puede venir como @lid).
      let meta;
      try {
        meta = await sock.groupMetadata(remoteJid);
      } catch {
        return reply("❌ No se pudo obtener la información del grupo.");
      }

      const targetJid = resolveParticipantJid(meta.participants, rawJid);
      if (!targetJid) {
        return reply("⚠️ Ese usuario no está en el grupo.");
      }

      const targets = [targetJid];

      // ─── Desmutear ─────────────────────────────────────────
      const removed = [];
      for (const jid of targets) {
        if (muteManager.unmute(remoteJid, jid)) removed.push(jid);
      }

      if (removed.length === 0) {
        return reply("ℹ️ Ninguno de esos usuarios estaba muteado.");
      }

      const numbers = removed.map((jid) => jidToNumber(jid) || jid.split("@")[0]);
      await sock.sendMessage(
        remoteJid,
        {
          text: `🔊 Se quitó el mute a ${numbers.map((n) => `+${n}`).join(", ")}.`,
          mentions: removed,
        },
        { quoted: msg }
      );
    },
  },
];
