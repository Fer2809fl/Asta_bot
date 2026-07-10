import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const FILE = join(dirname(fileURLToPath(import.meta.url)), "../database/groups.json");

function load() {
  try {
    return JSON.parse(readFileSync(FILE, "utf-8"));
  } catch {
    return {};
  }
}

function save(data) {
  if (!existsSync(dirname(FILE))) mkdirSync(dirname(FILE), { recursive: true });
  writeFileSync(FILE, JSON.stringify(data, null, 2));
}

export const groupDb = {
  get(groupJid) {
    const data = load();
    if (!data[groupJid]) {
      data[groupJid] = { welcome: true, bye: true };
      save(data);
    }
    return data[groupJid];
  },

  update(groupJid, updater) {
    const data = load();
    data[groupJid] ??= { welcome: true, bye: true };
    updater(data[groupJid]);
    save(data);
    return data[groupJid];
  }
};
