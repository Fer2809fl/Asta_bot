import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { normalizeJid } from "./jid.js";
import { createJsonStore } from "./jsonStore.js";

const FILE = join(dirname(fileURLToPath(import.meta.url)), "../database/warns.json");
const store = createJsonStore(FILE, { defaultValue: {}, debounceMs: 300, label: "Warns" });

export const warns = {
  get: (g, u) => store.data[g]?.[u] ?? 0,
  add(g, u) {
    const data = store.data;
    data[g] ??= {};
    data[g][u] = (data[g][u] ?? 0) + 1;
    store.markDirty();
    return data[g][u];
  },
  reset(g, u) {
    const data = store.data;
    delete data[g]?.[u];
    store.markDirty();
  },
  flush() {
    store.flush();
  },
};

process.on("exit", () => warns.flush());

export function getTarget(msg, args) {
  const ctx = msg.message?.extendedTextMessage?.contextInfo;
  const mention = ctx?.mentionedJid?.[0];
  const quoted = ctx?.participant;

  let jid = null;
  if (mention) jid = normalizeJid(mention);
  else if (quoted) jid = normalizeJid(quoted);
  else if (/^\d/.test(args[0] || "")) jid = `${args[0].replace(/\D/g, "")}@s.whatsapp.net`;

  const reason = (mention || (jid && !quoted)) ? args.slice(1).join(" ") : args.join(" ");
  return { jid, reason };
}
