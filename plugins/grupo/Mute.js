import { muteManager } from "../../src/muteManager.js";
import { jidToNumber } from "../../src/jid.js";
import {
  parseDuration,
  formatDuration,
  getMentionedOrQuoted,
  resolveParticipantJid,
} from "./Muteutils.js";

export default [
  {
    command: ["mute", "silenciar"],
    description: "Silencia a los usuarios mencionados: se les eliminan los mensajes durante el tiempo indicado (o hasta que se les quite el mute con .unmute).",
    adminOnly: true,
    botAdmin: true,
    groupOnly: true,
    async execute({ sock, msg, remoteJid, args, reply }) {
      const rawTargets = getMentionedOrQuoted(msg, args);
      if (rawTargets.length === 0) {
        return reply(
          "⚠️ Menciona, responde o pon el número de la persona que quieres mutear.\n\n" +
          "Ej: *.mute @user 10m* (o *.mute @user* para mute indefinido)"
        );
      }

      // ─── Resolver cada mención al JID real (igual que rob.js) ───
      let meta;
      try {
        meta = await sock.groupMetadata(remoteJid);
      } catch {
        return reply("❌ No se pudo obtener la información del grupo.");
      }

      const targets = [];
      for (const rawJid of rawTargets) {
        const resolved = resolveParticipantJid(meta.participants, rawJid);
        if (resolved) targets.push(resolved);
      }

      if (targets.length === 0) {
        return reply("⚠️ Ese usuario no está en el grupo.");
      }

      const maybeDuration = args.find(
        (a) => !a.includes("@") && /^\d+\s*(s|seg\w*|m|min\w*|h|horas?|d|dias?|días?)?$/i.test(a)
      );
      const durationMs = parseDuration(maybeDuration);

      const numbers = [];
      for (const jid of targets) {
        muteManager.mute(remoteJid, jid, durationMs);
        numbers.push(jidToNumber(jid) || jid.split("@")[0]);
      }

      await sock.sendMessage(
        remoteJid,
        {
          text:
            `🔇 Se silenció a ${numbers.map((n) => `+${n}`).join(", ")} por *${formatDuration(durationMs)}*.\n\n` +
            `Sus mensajes en este grupo serán eliminados automáticamente.`,
          mentions: targets,
        },
        { quoted: msg }
      );
    },
  },
];
