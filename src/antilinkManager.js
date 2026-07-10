import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { createJsonStore } from "./jsonStore.js";

const FILE = join(dirname(fileURLToPath(import.meta.url)), "../database/antilink.json");
const store = createJsonStore(FILE, { defaultValue: {}, debounceMs: 300, label: "Antilink" });

function getGroup(groupJid) {
  const data = store.data;
  data[groupJid] ??= { enabled: false, platforms: [] };
  return data[groupJid];
}

export const antilinkManager = {
  isEnabled(groupJid) {
    return !!store.data[groupJid]?.enabled;
  },

  enable(groupJid) {
    getGroup(groupJid).enabled = true;
    store.markDirty();
  },

  disable(groupJid) {
    getGroup(groupJid).enabled = false;
    store.markDirty();
  },

  add(groupJid, platform) {
    const g = getGroup(groupJid);
    const clean = platform.toLowerCase().trim();
    if (!g.platforms.includes(clean)) g.platforms.push(clean);
    store.markDirty();
    return g.platforms;
  },

  remove(groupJid, platform) {
    const g = getGroup(groupJid);
    const clean = platform.toLowerCase().trim();
    const before = g.platforms.length;
    g.platforms = g.platforms.filter((p) => p !== clean);
    store.markDirty();
    return before !== g.platforms.length;
  },

  list(groupJid) {
    return getGroup(groupJid).platforms;
  },

  matchLink(groupJid, text) {
    if (!text) return null;
    const g = getGroup(groupJid);
    if (!g.platforms.length) return null;

    const lower = text.toLowerCase();
    for (const platform of g.platforms) {
      if (platform && lower.includes(platform)) return platform;
    }
    return null;
  },

  flush() {
    store.flush();
  },
};

process.on("exit", () => antilinkManager.flush());
