import { db } from "../../src/database.js";

const OUTCOMES = [
  { text: "Encontraste un billete en la calle.", min: 50, max: 150, xp: 6 },
  { text: "Ganaste un pequeño sorteo local.", min: 100, max: 300, xp: 12 },
  { text: "Un desconocido te invitó comida y algo de dinero.", min: 30, max: 100, xp: 5 },
  { text: "¡Tu número de la suerte salió premiado!", min: 300, max: 900, xp: 30 },
  { text: "Encontraste una moneda antigua valiosa.", min: 150, max: 500, xp: 18 },
  { text: "Hoy no fue tu día de suerte...", min: 0, max: 20, xp: 2 },
  { text: "¡GOLPE DE SUERTE MASIVO!", min: 1000, max: 2500, xp: 70 },
];

export default [
  {
    command: ["lucky", "suerte"],
    description: "🍀 Prueba tu suerte una vez cada 12 horas.",
    async execute({ senderRaw, reply }) {
      const user = db.getUser(senderRaw);
      const now = Date.now();
      const cooldown = 12 * 60 * 60 * 1000;

      if (now - (user.cooldowns?.lucky ?? 0) < cooldown) {
        const remaining = cooldown - (now - user.cooldowns.lucky);
        const hours = Math.floor(remaining / 3600000);
        const minutes = Math.floor((remaining % 3600000) / 60000);
        return reply(`\`🍀 SUERTE\`

\`✘ ERROR ›\` Ya probaste tu suerte hoy.
\`⏱️ VUELVE EN ›\` *${hours}h ${minutes}m*`);
      }

      const outcome = OUTCOMES[Math.floor(Math.random() * OUTCOMES.length)];
      const reward = Math.floor(Math.random() * (outcome.max - outcome.min + 1)) + outcome.min;

      db.updateUser(senderRaw, (u) => {
        u.coins = (u.coins ?? 100) + reward;
        u.cooldowns ??= {};
        u.cooldowns.lucky = now;
      });

      const { leveledUp, newLevel } = db.addXp(senderRaw, outcome.xp);

      const texto = `\`🍀 PRUEBA DE SUERTE\`

\`✦ RESULTADO ›\` *${outcome.text}*

\`💰 GANADO ›\` *${reward > 0 ? reward : "Nada 😢"}* ${reward > 0 ? "monedas" : ""}
\`✨ XP ›\` *+${outcome.xp}*${leveledUp ? `\n\n\`⭐ SUBISTE AL NIVEL ${newLevel}\`` : ""}`;

      await reply(texto);
    },
  },
];
