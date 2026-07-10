import {
  normalizeJid,
  participantForms,
  addAllForms,
  lidToJid,
} from "../../src/jid.js";

export function parseDuration(str) {
  if (!str) return null;
  const match = String(str).match(/^(\d+)\s*(s|seg\w*|m|min\w*|h|horas?|d|dias?|días?)?$/i);
  if (!match) return null;

  const value = parseInt(match[1], 10);
  const unit = (match[2] || "m").toLowerCase();

  if (unit.startsWith("s")) return value * 1000;
  if (unit.startsWith("h")) return value * 60 * 60 * 1000;
  if (unit.startsWith("d")) return value * 24 * 60 * 60 * 1000;
  return value * 60 * 1000; // por defecto: minutos
}

export function formatDuration(ms) {
  if (!ms) return "indefinido (hasta que se le quite el mute)";
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;

  const parts = [];
  if (h) parts.push(`${h}h`);
  if (m) parts.push(`${m}m`);
  if (s && !h) parts.push(`${s}s`);
  return parts.join(" ") || "0s";
}

// Junta menciones (@user), el participante citado, y como último recurso
// el patrón "@1234567890" escrito a mano en el texto (igual que en rob.js).
export function getMentionedOrQuoted(msg, args) {
  const ctx = msg.message?.extendedTextMessage?.contextInfo;
  const mentioned = ctx?.mentionedJid || [];
  const quotedParticipant = ctx?.participant;

  const jids = new Set();

  for (const j of mentioned) {
    const norm = normalizeJid(j);
    if (norm) jids.add(norm);
  }

  if (jids.size === 0 && quotedParticipant) {
    const norm = normalizeJid(quotedParticipant);
    if (norm) jids.add(norm);
  }

  if (jids.size === 0) {
    for (const arg of args) {
      if (arg.includes("@")) {
        const match = arg.match(/@(\d+)/);
        if (match) jids.add(`${match[1]}@s.whatsapp.net`);
      }
    }
  }

  if (jids.size === 0 && /^\d+$/.test(args[0] || "")) {
    jids.add(`${args[0].replace(/\D/g, "")}@s.whatsapp.net`);
  }

  return [...jids];
}

// ─── Resolución de JID real (misma lógica que rob.js) ───────────
// Busca al participante en el grupo (por cualquiera de sus formas:
// jid normal, @lid, etc.) y devuelve su JID real de número, igual
// que hace rob.js, para que mute/unmute usen siempre el mismo
// identificador consistente (no el @lid crudo).
export function findParticipant(participants, targetJid) {
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

export function resolveParticipantJid(participants, rawJid) {
  const participant = findParticipant(participants, rawJid);
  if (!participant) return null;

  let targetJid = participant.jid;
  if (!targetJid) {
    targetJid = lidToJid(participant.id);
  }
  return normalizeJid(targetJid);
}
