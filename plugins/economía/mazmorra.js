import { db } from "../../src/database.js";

const COOLDOWN = 40 * 60 * 1000; // 40 min

// Mazmorras por nivel mínimo requerido. Entre más alta, más riesgo y más recompensa.
const DUNGEONS = [
  {
    name: "Cueva Abandonada",
    minLevel: 1,
    enemy: "Rata Gigante",
    coins: [40, 120],
    xp: 15,
    winChance: 0.85,
    lossPenalty: [10, 30],
    mineralDrop: { name: "carbon", chance: 0.5, amount: [1, 3] },
  },
  {
    name: "Bosque Maldito",
    minLevel: 3,
    enemy: "Lobo Espectral",
    coins: [100, 250],
    xp: 30,
    winChance: 0.75,
    lossPenalty: [30, 70],
    mineralDrop: { name: "hierro", chance: 0.45, amount: [1, 2] },
  },
  {
    name: "Ruinas Sumergidas",
    minLevel: 6,
    enemy: "Kraken Menor",
    coins: [200, 450],
    xp: 55,
    winChance: 0.65,
    lossPenalty: [60, 130],
    mineralDrop: { name: "cobre", chance: 0.4, amount: [1, 2] },
  },
  {
    name: "Fortaleza en Llamas",
    minLevel: 10,
    enemy: "Caballero Carbonizado",
    coins: [350, 700],
    xp: 90,
    winChance: 0.55,
    lossPenalty: [100, 220],
    mineralDrop: { name: "oro", chance: 0.3, amount: [1, 2] },
  },
  {
    name: "Abismo del Dragón",
    minLevel: 15,
    enemy: "Dragón Ancestral",
    coins: [600, 1200],
    xp: 150,
    winChance: 0.45,
    lossPenalty: [180, 400],
    mineralDrop: { name: "diamante", chance: 0.2, amount: [1, 1] },
  },
];

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default [
  {
    command: ["mazmorra", "mazmorras", "dungeon"],
    description: "⚔️ Explora una mazmorra, enfréntate a un enemigo y gana monedas, XP y minerales.",
    async execute({ senderRaw, args, reply }) {
      const user = db.getUser(senderRaw);
      const now = Date.now();
      const cooldowns = user.cooldowns ?? {};

      if (now - (cooldowns.mazmorra ?? 0) < COOLDOWN) {
        const remaining = COOLDOWN - (now - cooldowns.mazmorra);
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        return reply(`\`⚔️ MAZMORRAS\`

\`✘ ERROR ›\` Aún estás recuperando fuerzas.
\`⏱️ VUELVE EN ›\` *${minutes}m ${seconds}s*`);
      }

      const disponibles = DUNGEONS.filter((d) => user.level >= d.minLevel);
      if (!disponibles.length) {
        return reply(`\`⚔️ MAZMORRAS\`

\`✘ ERROR ›\` Necesitas al menos nivel *${DUNGEONS[0].minLevel}* para entrar a una mazmorra.`);
      }

      // Si el usuario pide una mazmorra en concreto por nombre/índice, se busca; si no, la más alta disponible que pueda hacer
      let dungeon;
      if (args[0]) {
        const query = args.join(" ").toLowerCase();
        dungeon = disponibles.find((d) => d.name.toLowerCase().includes(query));
        if (!dungeon) {
          const lista = disponibles.map((d) => `\`  ⚔️ ${d.name} ›\` requiere nivel *${d.minLevel}*`).join("\n");
          return reply(`\`⚔️ MAZMORRAS DISPONIBLES\`

${lista}

> _Usa *!mazmorra <nombre>* para elegir una._`);
        }
      } else {
        dungeon = disponibles[disponibles.length - 1];
      }

      db.updateUser(senderRaw, (u) => {
        u.cooldowns ??= {};
        u.cooldowns.mazmorra = now;
      });

      const gano = Math.random() < dungeon.winChance;

      if (gano) {
        const reward = randInt(...dungeon.coins);
        let mineralTexto = "";

        db.updateUser(senderRaw, (u) => {
          u.coins = (u.coins ?? 100) + reward;
          if (Math.random() < dungeon.mineralDrop.chance) {
            const cantidad = randInt(...dungeon.mineralDrop.amount);
            u.minerals ??= {};
            u.minerals[dungeon.mineralDrop.name] = (u.minerals[dungeon.mineralDrop.name] ?? 0) + cantidad;
            mineralTexto = `\n\`⛏️ DROP ›\` *${cantidad}x ${dungeon.mineralDrop.name}*`;
          }
        });

        const { leveledUp, newLevel } = db.addXp(senderRaw, dungeon.xp);

        return reply(`\`⚔️ ${dungeon.name.toUpperCase()}\`

\`👹 ENEMIGO ›\` *${dungeon.enemy}*
\`🏆 RESULTADO ›\` ¡Lo derrotaste!

\`💰 GANADO ›\` *${reward}* monedas
\`✨ XP ›\` *+${dungeon.xp}*${mineralTexto}${leveledUp ? `\n\n\`⭐ SUBISTE AL NIVEL ${newLevel}\`` : ""}`);
      }

      const perdida = randInt(...dungeon.lossPenalty);
      db.updateUser(senderRaw, (u) => {
        u.coins = Math.max(0, (u.coins ?? 100) - perdida);
      });

      return reply(`\`⚔️ ${dungeon.name.toUpperCase()}\`

\`👹 ENEMIGO ›\` *${dungeon.enemy}*
\`💀 RESULTADO ›\` Fuiste derrotado y tuviste que huir.

\`💸 PERDISTE ›\` *${perdida}* monedas

> _Sube de nivel o intenta de nuevo más tarde._`);
    },
  },
];
