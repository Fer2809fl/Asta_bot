import { db } from "../../src/database.js";

export default [
  {
    command: ["daily", "diario"],
    description: "Reclama tu recompensa diaria de monedas.",
    async execute({ senderRaw, reply }) {
      const user = db.getUser(senderRaw);
      const now = Date.now();
      const cooldown = 24 * 60 * 60 * 1000;

      if (now - (user.cooldowns?.daily ?? 0) < cooldown) {
        const remaining = cooldown - (now - user.cooldowns.daily);
        const hours = Math.floor(remaining / 3600000);
        const minutes = Math.floor((remaining % 3600000) / 60000);
        return reply(`\`🎁 RECOMPENSA DIARIA\`

\`✘ ERROR ›\` Ya reclamaste tu recompensa.
\`⏱️ VUELVE EN ›\` *${hours}h ${minutes}m*`);
      }

      const reward = Math.floor(Math.random() * (500 - 200 + 1)) + 200;
      db.updateUser(senderRaw, (u) => {
        u.coins = (u.coins ?? 100) + reward;
        u.cooldowns ??= {};
        u.cooldowns.daily = now;
      });

      const { leveledUp, newLevel } = db.addXp(senderRaw, 20);

      const texto = `\`🎁 ¡RECOMPENSA DIARIA!\`

\`💰 GANADO ›\` *${reward}* monedas
\`✨ XP ›\` *+20*${leveledUp ? `\n\n\`⭐ SUBISTE AL NIVEL ${newLevel}\`` : ""}`;

      await reply(texto);
    },
  },
];
