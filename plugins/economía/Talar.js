import { db } from "../../src/database.js";

const COOLDOWN = 25 * 60 * 1000; // 25 min

// Tipos de madera por rareza (igual de estructura que minerals/fish)
const WOODS = [
  { name: "pino", chance: 0.50, xp: 8 },
  { name: "roble", chance: 0.28, xp: 14 },
  { name: "caoba", chance: 0.15, xp: 22 },
  { name: "ebano", chance: 0.07, xp: 35 },
];

const FLAVOR = [
  "Talaste un árbol en el bosque cercano.",
  "Encontraste un tronco caído y lo cortaste en trozos.",
  "Subiste a la copa de un árbol para talarlo con cuidado.",
  "Un leñador veterano te enseñó una técnica rápida de corte.",
  "Talaste varios árboles pequeños de una sola pasada.",
];

function rollWood() {
  const roll = Math.random();
  let acc = 0;
  for (const w of WOODS) {
    acc += w.chance;
    if (roll <= acc) return w;
  }
  return WOODS[0];
}

export default [
  {
    command: ["talar", "cortarmadera", "lenador"],
    description: "🪓 Tala árboles para conseguir madera y ganar XP.",
    async execute({ senderRaw, reply }) {
      const user = db.getUser(senderRaw);
      const now = Date.now();
      const cooldowns = user.cooldowns ?? {};

      if (now - (cooldowns.talar ?? 0) < COOLDOWN) {
        const remaining = COOLDOWN - (now - cooldowns.talar);
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        return reply(`\`🪓 TALAR\`

\`✘ ERROR ›\` Tu hacha aún está en mantenimiento.
\`⏱️ VUELVE EN ›\` *${minutes}m ${seconds}s*`);
      }

      const wood = rollWood();
      const cantidad = Math.floor(Math.random() * 3) + 1;
      const frase = FLAVOR[Math.floor(Math.random() * FLAVOR.length)];

      db.updateUser(senderRaw, (u) => {
        u.cooldowns ??= {};
        u.cooldowns.talar = now;
        u.madera ??= { pino: 0, roble: 0, caoba: 0, ebano: 0 };
        u.madera[wood.name] = (u.madera[wood.name] ?? 0) + cantidad;
      });

      const { leveledUp, newLevel } = db.addXp(senderRaw, wood.xp);

      await reply(`\`🪓 ¡MADERA OBTENIDA!\`

\`✦ ›\` ${frase}

\`🪵 CONSEGUISTE ›\` *${cantidad}x ${wood.name}*
\`✨ XP ›\` *+${wood.xp}*${leveledUp ? `\n\n\`⭐ SUBISTE AL NIVEL ${newLevel}\`` : ""}`);
    },
  },
];
