import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { normalizeJid } from "./jid.js";
import { createJsonStore } from "./jsonStore.js";

const FILE = join(dirname(fileURLToPath(import.meta.url)), "../database/users.json");
const store = createJsonStore(FILE, { defaultValue: {}, debounceMs: 500, label: "DB" });

function defaultUser() {
  return {
    coins: 100,
    bank: 0,
    xp: 0,
    level: 1,
    minerals: { carbon: 0, hierro: 0, cobre: 0, oro: 0, diamante: 0 },
    fish: { comun: 0, raro: 0, epico: 0, legendario: 0 },
    cooldowns: { work: 0, daily: 0, mine: 0, fish: 0, mission: 0 },
    missions: { current: null, completed: 0 },
  };
}

function ensureFields(user) {
  user.fish ??= { comun: 0, raro: 0, epico: 0, legendario: 0 };
  user.missions ??= { current: null, completed: 0 };
  user.cooldowns ??= { work: 0, daily: 0, mine: 0, fish: 0, mission: 0 };
  user.cooldowns.fish ??= 0;
  user.cooldowns.mission ??= 0;
  if (user.coins < 0) user.coins = 0;
  if (user.bank < 0) user.bank = 0;
}

export const db = {
  getUser(userJid) {
    const norm = normalizeJid(userJid);
    const data = store.data;
    if (!data[norm]) {
      data[norm] = defaultUser();
      store.markDirty();
    }
    ensureFields(data[norm]);
    return data[norm];
  },

  updateUser(userJid, updater) {
    const norm = normalizeJid(userJid);
    const data = store.data;
    data[norm] ??= defaultUser();
    ensureFields(data[norm]);
    updater(data[norm]);
    if (data[norm].coins < 0) data[norm].coins = 0;
    if (data[norm].bank < 0) data[norm].bank = 0;
    store.markDirty();
    return data[norm];
  },

  checkMissionProgress(userJid, actionType, amount = 1) {
    let text = "";
    this.updateUser(userJid, (u) => {
      if (!u.missions?.current) return;
      const m = u.missions.current;
      if (m.type === actionType) {
        m.progress += amount;
        if (m.progress >= m.target) {
          u.coins = (u.coins ?? 100) + m.reward;
          text = `\n\n🎯 *¡Misión Completada!* \nEntregaste lo requerido y ganaste *${m.reward}* monedas.`;
          u.missions.completed = (u.missions.completed ?? 0) + 1;
          u.missions.current = null;
        }
      }
    });
    return text;
  },

  addXp(userJid, amount) {
    let leveledUp = false;
    let newLevel = 1;
    this.updateUser(userJid, (user) => {
      user.xp = (user.xp ?? 0) + amount;
      let xpNeeded = user.level * 150;
      while (user.xp >= xpNeeded) {
        user.xp -= xpNeeded;
        user.level = (user.level ?? 1) + 1;
        newLevel = user.level;
        leveledUp = true;
        xpNeeded = user.level * 150;
      }
    });
    return { leveledUp, newLevel };
  },

  flush() {
    store.flush();
  },
};

process.on("exit", () => db.flush());
process.on("SIGINT", () => { db.flush(); process.exit(); });
process.on("SIGTERM", () => { db.flush(); process.exit(); });
