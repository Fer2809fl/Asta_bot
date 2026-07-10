import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { createJsonStore } from "./jsonStore.js";

const FILE = join(dirname(fileURLToPath(import.meta.url)), "../database/mutes.json");
const store = createJsonStore(FILE, { defaultValue: {}, debounceMs: 300, label: "Mute" });

export const muteManager = {
  mute(groupJid, userJid, durationMs = null) {
    const data = store.data;
    data[groupJid] ??= {};
    data[groupJid][userJid] = {
      mutedAt: Date.now(),
      expiresAt: durationMs ? Date.now() + durationMs : null,
    };
    store.markDirty();
  },

  unmute(groupJid, userJid) {
    const data = store.data;
    if (data[groupJid]?.[userJid]) {
      delete data[groupJid][userJid];
      store.markDirty();
      return true;
    }
    return false;
  },

  isMuted(groupJid, userJid) {
    const data = store.data;
    const entry = data[groupJid]?.[userJid];
    if (!entry) return false;

    if (entry.expiresAt && Date.now() >= entry.expiresAt) {
      delete data[groupJid][userJid];
      store.markDirty();
      return false;
    }
    return true;
  },

  getRemaining(groupJid, userJid) {
    const data = store.data;
    const entry = data[groupJid]?.[userJid];
    if (!entry) return null;
    if (!entry.expiresAt) return null;
    return Math.max(0, entry.expiresAt - Date.now());
  },

  list(groupJid) {
    return store.data[groupJid] || {};
  },

  flush() {
    store.flush();
  },
};

process.on("exit", () => muteManager.flush());
