import { db } from "../../src/database.js";

const FINDS = [
  { emoji: "🪨", text: "Solo encontraste piedras...", min: 5, max: 20, xp: 2 },
  { emoji: "🥫", text: "¡Una lata antigua!", min: 15, max: 50, xp: 5 },
  { emoji: "🔑", text: "¡Una llave misteriosa!", min: 30, max: 100, xp: 8 },
  { emoji: "💍", text: "¡Un anillo de oro!", min: 100, max: 300, xp: 15 },
  { emoji: "🏺", text: "¡Una urna antigua!", min: 200, max: 600, xp: 25 },
  { emoji: "👑", text: "¡Una corona real!", min: 500, max: 1500, xp: 60 },
  { emoji: "💎", text: "¡DIAMANTE GIGANTE!", min: 1000, max: 3000, xp: 80 },
];

export default [
  {
    command: ["dig", "excavar", "cavar", "pala"],
    description: "⛏️ Excava en busca de tesoros ocultos.",
    async execute({ senderRaw, reply }) {
      const user = db.getUser(senderRaw);
      const now = Date.now();
      const cooldown = 8 * 60 * 1000;

      if (now - (user.cooldowns?.dig ?? 0) < cooldown) {
        const remaining = cooldown - (now - user.cooldowns.dig);
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        return reply(`\`⛏️ EXCAVAR\`

\`✘ ERROR ›\` El terreno está agotado.
\`⏱️ VUELVE EN ›\` *${minutes}m ${seconds}s*`);
      }

      const find = FINDS[Math.floor(Math.random() * FINDS.length)];
      const reward = Math.floor(Math.random() * (find.max - find.min + 1)) + find.min;

      db.updateUser(senderRaw, (u) => {
        u.coins = (u.coins ?? 100) + reward;
        u.cooldowns ??= {};
        u.cooldowns.dig = now;
        u.digs ??= {};
        u.digs[find.emoji] = (u.digs[find.emoji] ?? 0) + 1;
      });

      const { leveledUp, newLevel } = db.addXp(senderRaw, find.xp);

      const texto = `\`⛏️ EXCAVAR\`

\`✦ HALLAZGO ›\` ${find.emoji} *${find.text}*

\`💰 GANADO ›\` *${reward}* monedas
\`✨ XP ›\` *+${find.xp}*${leveledUp ? `\n\n\`⭐ SUBISTE AL NIVEL ${newLevel}\`` : ""}`;

      await reply(texto);
    },
  },
];
