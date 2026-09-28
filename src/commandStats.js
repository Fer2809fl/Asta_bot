import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const ROOT = dirname(fileURLToPath(import.meta.url));
const FILE = join(ROOT, "../database/commandStats.json");

function ensureFile() {
  const dir = dirname(FILE);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  if (!existsSync(FILE)) writeFileSync(FILE, "{}", "utf8");
}

function readStats() {
  ensureFile();
  try {
    const data = JSON.parse(readFileSync(FILE, "utf8"));
    return data && typeof data === "object" ? data : {};
  } catch {
    return {};
  }
}

function writeStats(data) {
  ensureFile();
  try {
    writeFileSync(FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (e) {
    console.error("[CommandStats] No se pudo guardar:", e.message);
  }
}

export function registerCommands(commands = []) {
  const stats = readStats();
  for (const command of commands) {
    const name = String(command || "").toLowerCase().trim();
    if (name && typeof stats[name] !== "number") stats[name] = 0;
  }
  writeStats(stats);
  global.commandStats = stats;
  return stats;
}

export function incrementCommand(command) {
  const name = String(command || "").toLowerCase().trim();
  if (!name) return;
  const stats = readStats();
  stats[name] = (Number(stats[name]) || 0) + 1;
  writeStats(stats);
  global.commandStats = stats;
}

export function getCommandStats() {
  const stats = readStats();
  global.commandStats = stats;
  return stats;
}

export function getCommandList() {
  return Object.keys(getCommandStats());
}
