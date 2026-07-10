import NodeCache from "node-cache";
import { addAllForms, participantForms, jidNormalizedUser } from "./jid.js";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const participantCache = new NodeCache({ stdTTL: 1800, checkperiod: 300, useClones: false });
const botFacesCache    = new NodeCache({ stdTTL: 3600, useClones: false });
const _fetchingGroups  = new Map();

async function fetchParticipants(sock, jid) {
  const cached = participantCache.get(jid);
  if (cached) return cached;

  if (_fetchingGroups.has(jid)) return _fetchingGroups.get(jid);

  const promise = (async () => {
    try {
      const metadata = await sock.groupMetadata(jid);
      const result = (metadata.participants || []).map((p) => ({
        ...p,
        forms: participantForms(p),
      }));
      participantCache.set(jid, result);
      return result;
    } catch {
      return [];
    } finally {
      _fetchingGroups.delete(jid);
    }
  })();

  _fetchingGroups.set(jid, promise);
  return promise;
}

function getBotFaces(sock) {
  const mainId = sock.user?.id ? jidNormalizedUser(sock.user.id) : "default";
  const cached = botFacesCache.get(mainId);
  if (cached) return cached;

  const faces = new Set();
  addAllForms(faces, sock.user?.id);
  addAllForms(faces, sock.user?.lid);

  botFacesCache.set(mainId, faces);
  return faces;
}

function hasAnyForm(participantForms, otherForms) {
  for (const f of participantForms) {
    if (otherForms.has(f)) return true;
  }
  return false;
}

// ========== MODO ADMIN (persistencia por grupo) ==========
// Si un grupo tiene el modo admin activo, solo los admins pueden usar al bot.
const __dirname = dirname(fileURLToPath(import.meta.url));
const ADMIN_MODE_DB_DIR = join(__dirname, "../database");
const ADMIN_MODE_DB_FILE = join(ADMIN_MODE_DB_DIR, "adminMode.json");

let _adminModeCache = null;

function loadAdminMode() {
  if (_adminModeCache) return _adminModeCache;
  try {
    if (!existsSync(ADMIN_MODE_DB_DIR)) mkdirSync(ADMIN_MODE_DB_DIR, { recursive: true });
    if (!existsSync(ADMIN_MODE_DB_FILE)) writeFileSync(ADMIN_MODE_DB_FILE, JSON.stringify({}), "utf-8");
    _adminModeCache = JSON.parse(readFileSync(ADMIN_MODE_DB_FILE, "utf-8"));
  } catch {
    _adminModeCache = {};
  }
  return _adminModeCache;
}

function saveAdminMode() {
  try {
    writeFileSync(ADMIN_MODE_DB_FILE, JSON.stringify(_adminModeCache, null, 2), "utf-8");
  } catch { }
}

export const adminManager = {
  isAdmin: async (sock, jid, userJid) => {
    if (!jid || !userJid) return false;
    try {
      const participants = await fetchParticipants(sock, jid);
      const userFaces = new Set();
      addAllForms(userFaces, userJid);

      for (const p of participants) {
        if (p.admin !== "admin" && p.admin !== "superadmin") continue;
        if (hasAnyForm(p.forms, userFaces)) return true;
      }

      return false;
    } catch {
      return false;
    }
  },

  isBotAdmin: async (sock, jid) => {
    if (!jid) return false;
    try {
      const [participants, botFaces] = await Promise.all([
        fetchParticipants(sock, jid),
        Promise.resolve(getBotFaces(sock)),
      ]);

      for (const p of participants) {
        if (p.admin !== "admin" && p.admin !== "superadmin") continue;
        if (hasAnyForm(p.forms, botFaces)) return true;
      }

      return false;
    } catch {
      return false;
    }
  },

  isSuperAdmin: async (sock, jid, participant) => {
    try {
      const participants = await fetchParticipants(sock, jid);
      const userFaces = new Set();
      addAllForms(userFaces, participant);

      const p = participants.find((p) => hasAnyForm(p.forms, userFaces));
      return p?.admin === "superadmin";
    } catch {
      return false;
    }
  },

  invalidate: (jid) => {
    participantCache.del(jid);
  },

  invalidateAll: () => {
    botFacesCache.flushAll();
    participantCache.flushAll();
  },

  // ─── MODO ADMIN ───
  isAdminModeEnabled: (jid) => {
    return !!loadAdminMode()[jid];
  },

  enableAdminMode: (jid) => {
    const data = loadAdminMode();
    data[jid] = true;
    saveAdminMode();
  },

  disableAdminMode: (jid) => {
    const data = loadAdminMode();
    delete data[jid];
    saveAdminMode();
  },
};
