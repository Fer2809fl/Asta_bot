import { db } from "../../src/database.js";

const SCENARIOS = [
  { text: "Un anciano generoso te dio unas monedas.", min: 30, max: 120, xp: 8 },
  { text: "Un turista extranjero te regaló algo.", min: 50, max: 200, xp: 12 },
  { text: "Un empresario te dio propina.", min: 100, max: 400, xp: 18 },
  { text: "Un niño te compartió su dinero del almuerzo.", min: 20, max: 80, xp: 5 },
  { text: "Nadie te hizo caso hoy...", min: 10, max: 30, xp: 3 },
  { text: "¡Un youtuber te donó en directo!", min: 200, max: 800, xp: 25 },
  { text: "Un perro callejero te guió a un tesoro.", min: 80, max: 300, xp: 15 },
  { text: "¡Una celebridad te reconoció!", min: 300, max: 1000, xp: 35 },
  { text: "Encontraste monedas en una fuente.", min: 40, max: 150, xp: 10 },
];

export default [
  {
    command: ["beg", "mendigar", "pedir", "limosna"],
    description: "🙏 Pide limosna en las calles. Puede que alguien te dé algo.",
    async execute({ senderRaw, reply }) {
      const user = db.getUser(senderRaw);
      const now = Date.now();
      const cooldown = 2 * 60 * 1000;

      if (now - (user.cooldowns?.beg ?? 0) < cooldown) {
        const remaining = cooldown - (now - user.cooldowns.beg);
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        return reply(`\`🙏 MENDIGAR\`

\`✘ ERROR ›\` La gente te ignora por ahora.
\`⏱️ COOLDOWN ›\` *${minutes}m ${seconds}s*`);
      }

      const scenario = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)];
      const reward = Math.floor(Math.random() * (scenario.max - scenario.min + 1)) + scenario.min;

      db.updateUser(senderRaw, (u) => {
        u.coins = (u.coins ?? 100) + reward;
        u.cooldowns ??= {};
        u.cooldowns.beg = now;
      });

      const { leveledUp, newLevel } = db.addXp(senderRaw, scenario.xp);

      const texto = `\`🙏 MENDIGAR\`

\`✦ RESULTADO ›\` *${scenario.text}*

\`💰 GANADO ›\` *${reward > 0 ? reward : "Nada 😢"}* ${reward > 0 ? "monedas" : ""}
\`✨ XP ›\` *+${scenario.xp}*${leveledUp ? `\n\n\`⭐ SUBISTE AL NIVEL ${newLevel}\`` : ""}`;

      await reply(texto);
    },
  },
];
