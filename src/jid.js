import {
  jidNormalizedUser,
  lidToJid,
  isLidUser,
  resolveJid,
} from "@fer2809fl/baileys";

export function normalizeJid(jid) {
  if (!jid || typeof jid !== "string") return jid;
  let result = jidNormalizedUser(jid);
  if (isLidUser(result)) result = lidToJid(result);
  return result;
}

export function jidToNumber(jid) {
  const normalized = normalizeJid(jid);
  return normalized ? normalized.split("@")[0] : "";
}

export function participantForms(participant) {
  const forms = new Set();
  for (const raw of [participant?.id, participant?.jid, participant?.lid]) {
    addAllForms(forms, raw);
  }
  return forms;
}

export function addAllForms(set, raw) {
  if (!raw || typeof raw !== "string") return;
  try {
    const norm = jidNormalizedUser(raw);
    set.add(norm);
    set.add(norm.split("@")[0]);
    if (isLidUser(norm)) {
      const asPn = lidToJid(norm);
      set.add(asPn);
      set.add(asPn.split("@")[0]);
    }
  } catch {
    set.add(raw);
    set.add(raw.split("@")[0]);
  }
}

export { resolveJid, jidNormalizedUser, lidToJid, isLidUser };
