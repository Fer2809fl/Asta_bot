import { db } from "../../src/database.js";
import { jidToNumber } from "../../src/jid.js";

const MEDALS = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];

/**
 * Intenta obtener TODOS los usuarios sin importar cómo esté
 * implementado tu database.js. Prueba, en orden:
 *  1. db.getAllUsers()
 *  2. db.getAll()
 *  3. db.all
 *  4. db.data.users (patrón lowdb: { users: { jid: {...} } })
 *  5. db.users (objeto o Map en memoria)
 *  6. db.data (objeto plano jid -> user, sin wrapper "users")
 *
 * Si tu database.js usa otro nombre, dime cuál es el método/propiedad
 * real y ajusto esta función a 3 líneas.
 */
function getAllUsersSafe() {
  try {
    if (typeof db.getAllUsers === "function") {
      const res = db.getAllUsers();
      if (res && Object.keys(res).length) return normalizeUsers(res);
    }
  } catch {}

  try {
    if (typeof db.getAll === "function") {
      const res = db.getAll();
      if (res && Object.keys(res).length) return normalizeUsers(res);
    }
  } catch {}

  try {
    if (db.all) return normalizeUsers(db.all);
  } catch {}

  try {
    if (db.data?.users) return normalizeUsers(db.data.users);
  } catch {}

  try {
    if (db.users) return normalizeUsers(db.users);
  } catch {}

  try {
    if (db.data && typeof db.data === "object") return normalizeUsers(db.data);
  } catch {}

  return [];
}

// Convierte tanto Map como objeto plano { jid: {...} } o array [{...}] a un array uniforme
function normalizeUsers(source) {
  let entries = [];

  if (source instanceof Map) {
    entries = [...source.entries()].map(([jid, u]) => ({ ...u, jid: u.jid || u.id || jid }));
  } else if (Array.isArray(source)) {
    entries = source;
  } else if (typeof source === "object" && source !== null) {
    entries = Object.entries(source).map(([jid, u]) => ({ ...u, jid: u.jid || u.id || jid }));
  }

  // Filtra basura: solo objetos que realmente parecen usuarios (tienen coins o bank)
  return entries.filter(
    (u) => u && typeof u === "object" && ("coins" in u || "bank" in u)
  );
}

export default [
  {
    command: ["lb", "leaderboard", "ricos", "ranking", "baltop"],
    description: "🏆 Muestra el top 10 de usuarios más ricos.",
    async execute({ senderRaw, reply }) {
      const self = db.getUser(senderRaw);
      const allUsers = getAllUsersSafe();

      if (!allUsers || allUsers.length === 0) {
        return reply(`\`🏆 RANKING\`

\`✘ ERROR ›\` El ranking global no está disponible (no se encontró la lista de usuarios en la base de datos).

\`💰 TU CARTERA ›\` *${self.coins ?? 100}*
\`🏦 TU BANCO ›\` *${self.bank ?? 0}*
\`📊 TU TOTAL ›\` *${(self.coins ?? 100) + (self.bank ?? 0)}*`);
      }

      const sorted = allUsers
        .map((u) => ({ ...u, total: (u.coins ?? 0) + (u.bank ?? 0) }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 10);

      const lineas = sorted
        .map((u, i) => {
          const num = jidToNumber(u.jid || u.id) || "???";
          const marker = (u.jid || u.id) === senderRaw ? " ⬅️ TÚ" : "";
          return `${MEDALS[i]} +${num}\n\`💰 ${u.total.toLocaleString()}\` monedas${marker}`;
        })
        .join("\n\n");

      const myRank = sorted.findIndex((u) => (u.jid || u.id) === senderRaw);
      const posicion =
        myRank >= 0
          ? `*#${myRank + 1}*`
          : `No estás en el top 10 aún. (Tu total: *${(self.coins ?? 0) + (self.bank ?? 0)}*)`;

      const texto = `\`🏆 TOP 10 MÁS RICOS\`

${lineas}

\`📍 TU POSICIÓN ›\` ${posicion}`;

      await reply(texto);
    },
  },
];
