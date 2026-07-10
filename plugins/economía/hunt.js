import { db } from "../../src/database.js";

const ANIMALS = [
  { name: "🐰 Conejo", chance: 0.35, minCoins: 30, maxCoins: 100, xp: 8 },
  { name: "🦌 Ciervo", chance: 0.22, minCoins: 80, maxCoins: 250, xp: 15 },
  { name: "🦊 Zorro", chance: 0.15, minCoins: 120, maxCoins: 350, xp: 20 },
  { name: "🐺 Lobo", chance: 0.12, minCoins: 150, maxCoins: 450, xp: 25 },
  { name: "🐻 Oso", chance: 0.08, minCoins: 250, maxCoins: 700, xp: 35 },
  { name: "🐉 Dragón", chance: 0.03, minCoins: 800, maxCoins: 2500, xp: 80 },
  { name: "💨 Nada", chance: 0.05, minCoins: 0, maxCoins: 0, xp: 3 },
];

export default [
  {
    command: ["hunt", "cazar", "caza", "caceria"],
    description: "🏹 Caza animales salvajes para obtener recompensas.",
    async execute({ senderRaw, reply }) {
      const user = db.getUser(senderRaw);
      const now = Date.now();
      const cooldown = 10 * 60 * 1000;

      if (now - (user.cooldowns?.hunt ?? 0) < cooldown) {
        const remaining = cooldown - (now - user.cooldowns.hunt);
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        return reply(`\`🏹 CACERÍA\`

\`✘ ERROR ›\` Necesitas descansar.
\`⏱️ VUELVE EN ›\` *${minutes}m ${seconds}s*`);
      }

      const roll = Math.random();
      let caught = null, accumulated = 0;
      for (const animal of ANIMALS) {
        accumulated += animal.chance;
        if (roll <= accumulated) { caught = animal; break; }
      }

      db.updateUser(senderRaw, (u) => {
        u.cooldowns ??= {};
        u.cooldowns.hunt = now;
      });

      if (!caught || caught.name === "💨 Nada") {
        const { leveledUp, newLevel } = db.addXp(senderRaw, 3);
        return reply(`\`🏹 CACERÍA\`

\`✘ RESULTADO ›\` No encontraste nada... 😔
\`✨ XP ›\` *+3*${leveledUp ? `\n\n\`⭐ SUBISTE AL NIVEL ${newLevel}\`` : ""}`);
      }

      const reward = Math.floor(Math.random() * (caught.maxCoins - caught.minCoins + 1)) + caught.minCoins;

      db.updateUser(senderRaw, (u) => {
        u.coins = (u.coins ?? 100) + reward;
        u.hunts ??= {};
        u.hunts[caught.name] = (u.hunts[caught.name] ?? 0) + 1;
      });

      const { leveledUp, newLevel } = db.addXp(senderRaw, caught.xp);
      const missionReward = db.checkMissionProgress ? db.checkMissionProgress(senderRaw, "cazar", 1) : "";

      const texto = `\`🏹 ¡CAZA EXITOSA! 🎯\`

\`🎯 ATRAPASTE ›\` ${caught.name}
\`💰 RECOMPENSA ›\` *${reward}* monedas
\`✨ XP ›\` *+${caught.xp}*${leveledUp ? `\n\n\`⭐ SUBISTE AL NIVEL ${newLevel}\`` : ""}${missionReward || ""}`;

      await reply(texto);
    },
  },
];
