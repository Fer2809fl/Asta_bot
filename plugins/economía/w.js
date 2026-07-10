import { db } from "../../src/database.js";

const JOBS = [
  { text: "Repartiste pedidos de comida.", min: 40, max: 150, xp: 8 },
  { text: "Programaste una app para un cliente.", min: 100, max: 350, xp: 18 },
  { text: "Diste clases particulares.", min: 60, max: 200, xp: 12 },
  { text: "Trabajaste como mesero/a en un restaurante.", min: 30, max: 120, xp: 6 },
  { text: "Reparaste una computadora.", min: 80, max: 250, xp: 15 },
  { text: "Hiciste un turno de taxi.", min: 50, max: 180, xp: 10 },
  { text: "Vendiste artesanías en el mercado.", min: 20, max: 90, xp: 5 },
  { text: "Grabaste un video viral.", min: 150, max: 500, xp: 25 },
];

export default [
  {
    command: ["w", "trabajar", "work"],
    description: "💼 Trabaja para ganar monedas.",
    async execute({ senderRaw, reply }) {
      const user = db.getUser(senderRaw);
      const now = Date.now();
      const cooldown = 60 * 60 * 1000;

      if (now - (user.cooldowns?.work ?? 0) < cooldown) {
        const remaining = cooldown - (now - user.cooldowns.work);
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        return reply(`\`💼 TRABAJAR\`

\`✘ ERROR ›\` Aún estás cansado del último turno.
\`⏱️ VUELVE EN ›\` *${minutes}m ${seconds}s*`);
      }

      const job = JOBS[Math.floor(Math.random() * JOBS.length)];
      const reward = Math.floor(Math.random() * (job.max - job.min + 1)) + job.min;

      db.updateUser(senderRaw, (u) => {
        u.coins = (u.coins ?? 100) + reward;
        u.cooldowns ??= {};
        u.cooldowns.work = now;
      });

      const { leveledUp, newLevel } = db.addXp(senderRaw, job.xp);

      const texto = `\`💼 ¡TURNO COMPLETADO!\`

\`✦ TRABAJO ›\` *${job.text}*

\`💰 GANADO ›\` *${reward}* monedas
\`✨ XP ›\` *+${job.xp}*${leveledUp ? `\n\n\`⭐ SUBISTE AL NIVEL ${newLevel}\`` : ""}`;

      await reply(texto);
    },
  },
];
