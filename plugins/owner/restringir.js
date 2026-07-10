import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const GLOBAL_RESTRICT_FILE = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../database/globalRestricted.json"
);

function loadGlobal() {
  try {
    return JSON.parse(readFileSync(GLOBAL_RESTRICT_FILE, "utf-8"));
  } catch {
    return { restrictedCmds: [] };
  }
}

function saveGlobal(data) {
  const dir = dirname(GLOBAL_RESTRICT_FILE);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(GLOBAL_RESTRICT_FILE, JSON.stringify(data, null, 2));
}

export function getGlobalRestricted() {
  return loadGlobal().restrictedCmds || [];
}

function addGlobalRestricted(cmd) {
  const data = loadGlobal();
  data.restrictedCmds = data.restrictedCmds || [];
  const c = cmd.toLowerCase().trim();
  if (!data.restrictedCmds.includes(c)) data.restrictedCmds.push(c);
  saveGlobal(data);
}

function removeGlobalRestricted(cmd) {
  const data = loadGlobal();
  data.restrictedCmds = (data.restrictedCmds || []).filter(
    (c) => c !== cmd.toLowerCase().trim()
  );
  saveGlobal(data);
}

export default [
  {
    command: ["restrict", "restringir", "cmdoff", "cmdon"],
    description: "🌐 Restringe o libera un comando globalmente en todos los grupos y bots.",
    async execute({ sock, msg, remoteJid, args, command, usedPrefix, reply, senderRaw }) {

      const senderNum = senderRaw?.split("@")[0]?.split(":")[0];
      const isGlobalOwner =
        (msg.key.fromMe && !sock.isSubBot) ||
        global.owners?.some(([num]) => num === senderNum);

      if (!isGlobalOwner) {
        return reply("⛔ Solo el *global owner* puede restringir o liberar comandos.");
      }

      const isReleasing = command === "cmdon";

      const targetCmdRaw = args[0];
      const targetCmd = targetCmdRaw
        ?.toLowerCase()
        ?.replace(/^[.!\\/]/, "")
        ?.trim();

      if (!targetCmd) {
        const list = getGlobalRestricted();

        const listText =
          list.length === 0
            ? "  _Ninguno por ahora._"
            : list.map((c) => `  • ${usedPrefix}${c}`).join("\n");

        return reply(
          `🌐 *Comandos restringidos globalmente*\n` +
          `━━━━━━━━━━━━━━━━━━━━\n` +
          `${listText}\n\n` +
          `📌 *Uso:*\n` +
          `  • *${usedPrefix}restrict <cmd>* — Restringir en todos los grupos y bots\n` +
          `  • *${usedPrefix}cmdon <cmd>* — Liberar en todos los grupos y bots\n\n` +
          `_Cuando un comando está restringido, cualquier usuario que intente usarlo recibirá aviso de mantenimiento. Solo el global owner puede ejecutarlo._`
        );
      }

      const list = getGlobalRestricted();

      if (isReleasing) {
        if (!list.includes(targetCmd)) {
          return reply(
            `ℹ️ El comando *${usedPrefix}${targetCmd}* no está restringido globalmente.`
          );
        }
        removeGlobalRestricted(targetCmd);
        return reply(
          `✅ *${usedPrefix}${targetCmd}* fue *liberado* globalmente.\n` +
          `> Todos los usuarios pueden usarlo nuevamente en cualquier grupo y bot.`
        );
      }

      if (list.includes(targetCmd)) {
        return reply(
          `ℹ️ El comando *${usedPrefix}${targetCmd}* ya está restringido globalmente.`
        );
      }
      addGlobalRestricted(targetCmd);
      return reply(
        `🌐🔒 *${usedPrefix}${targetCmd}* fue *restringido globalmente*.\n` +
        `> Nadie excepto el global owner puede usarlo en ningún grupo ni bot.`
      );
    },
  },
];