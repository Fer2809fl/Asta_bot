import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { createJsonStore } from "./jsonStore.js";

const FILE = join(dirname(fileURLToPath(import.meta.url)), "../database/groupConfig.json");
const store = createJsonStore(FILE, { defaultValue: {}, debounceMs: 300, label: "GroupConfig" });

function getDefault() {
  return {
    botEnabled: true,
    primaryBot: null,
    welcome: true,
    bye: true,
    restrictedCmds: [],
    welcomeMsg: null,
    byeMsg: null,
  };
}

export const groupConfig = {
  get(groupJid) {
    const data = store.data;
    if (!data[groupJid]) {
      data[groupJid] = getDefault();
      store.markDirty();
    }
    const def = getDefault();
    let modified = false;
    for (const [key, val] of Object.entries(def)) {
      if (data[groupJid][key] === undefined) {
        data[groupJid][key] = val;
        modified = true;
      }
    }
    if (modified) store.markDirty();
    return data[groupJid];
  },

  update(groupJid, updater) {
    const data = store.data;
    if (!data[groupJid]) data[groupJid] = getDefault();
    const def = getDefault();
    for (const [key, val] of Object.entries(def)) {
      if (data[groupJid][key] === undefined) data[groupJid][key] = val;
    }
    updater(data[groupJid]);
    store.markDirty();
    return data[groupJid];
  },

  isBotEnabled(groupJid) {
    return this.get(groupJid).botEnabled !== false;
  },
  setBotEnabled(groupJid, enabled) {
    return this.update(groupJid, (s) => { s.botEnabled = enabled; });
  },

  getPrimary(groupJid) {
    return this.get(groupJid).primaryBot || null;
  },
  setPrimary(groupJid, botJid) {
    return this.update(groupJid, (s) => { s.primaryBot = botJid; });
  },
  clearPrimary(groupJid) {
    return this.update(groupJid, (s) => { s.primaryBot = null; });
  },

  getWelcome(groupJid) {
    const cfg = this.get(groupJid);
    return { welcome: cfg.welcome !== false, bye: cfg.bye !== false };
  },
  setWelcome(groupJid, value) {
    return this.update(groupJid, (s) => { s.welcome = value; });
  },
  setBye(groupJid, value) {
    return this.update(groupJid, (s) => { s.bye = value; });
  },

  getWelcomeMsg(groupJid) {
    return this.get(groupJid).welcomeMsg || null;
  },
  setWelcomeMsg(groupJid, msg) {
    return this.update(groupJid, (s) => { s.welcomeMsg = msg; });
  },
  getByeMsg(groupJid) {
    return this.get(groupJid).byeMsg || null;
  },
  setByeMsg(groupJid, msg) {
    return this.update(groupJid, (s) => { s.byeMsg = msg; });
  },

  getRestricted(groupJid) {
    return this.get(groupJid).restrictedCmds || [];
  },
  addRestricted(groupJid, cmd) {
    return this.update(groupJid, (s) => {
      s.restrictedCmds = s.restrictedCmds || [];
      const c = cmd.toLowerCase().trim();
      if (!s.restrictedCmds.includes(c)) s.restrictedCmds.push(c);
    });
  },
  removeRestricted(groupJid, cmd) {
    return this.update(groupJid, (s) => {
      s.restrictedCmds = (s.restrictedCmds || []).filter(
        (c) => c !== cmd.toLowerCase().trim()
      );
    });
  },
  isRestricted(groupJid, cmd) {
    const list = this.get(groupJid).restrictedCmds || [];
    return list.includes(cmd.toLowerCase().trim());
  },

  flush() {
    store.flush();
  },
};

process.on("exit", () => groupConfig.flush());
