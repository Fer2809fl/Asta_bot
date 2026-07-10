import { db } from "../../src/database.js";

export default [
  {
    command: ["invest", "invertir", "inversion", "bolsa"],
    description: "📈 Invierte monedas y gana (o pierde) según el mercado.",
    async execute({ senderRaw, args, reply }) {
      const user = db.getUser(senderRaw);
      const now = Date.now();
      const cooldown = 4 * 60 * 60 * 1000;

      if (now - (user.cooldowns?.invest ?? 0) < cooldown) {
        const remaining = cooldown - (now - user.cooldowns.invest);
        const hours = Math.floor(remaining / 3600000);
        const minutes = Math.floor((remaining % 3600000) / 60000);
        return reply(`\`📈 INVERSIÓN\`

\`✘ ERROR ›\` Espera *${hours}h ${minutes}m* para invertir de nuevo.`);
      }

      if (!args[0]) {
        return reply(`\`📈 INVERSIÓN\`

\`📜 40% ›\` Ganas *x2.5*
\`📜 30% ›\` Ganas *x1.5*
\`📜 20% ›\` Pierdes *50%*
\`📜 10% ›\` Pierdes *todo*

> _Uso: *!invest <cantidad>*_
> _Saldo: *${user.coins ?? 100}* monedas_`);
      }

      let bet = args[0] === "all" ? (user.coins ?? 100) : parseInt(args[0]);
      if (isNaN(bet) || bet <= 0) return reply(`\`📈 INVERSIÓN\`\n\n\`✘ ERROR ›\` Inversión inválida.`);
      if ((user.coins ?? 100) < bet) {
        return reply(`\`📈 SIN FONDOS\`

\`💰 TU SALDO ›\` *${user.coins ?? 100}* monedas
\`💰 NECESITAS ›\` *${bet}* monedas`);
      }

      const roll = Math.random();
      let multiplier, resultText, resultEmoji;

      if (roll < 0.4) { multiplier = 2.5; resultText = "¡El mercado subió! ¡Gran ganancia!"; resultEmoji = "🚀"; }
      else if (roll < 0.7) { multiplier = 1.5; resultText = "El mercado tuvo buen rendimiento."; resultEmoji = "📈"; }
      else if (roll < 0.9) { multiplier = 0.5; resultText = "El mercado bajó. Perdiste la mitad."; resultEmoji = "📉"; }
      else { multiplier = 0; resultText = "¡CRASH! Perdiste toda la inversión."; resultEmoji = "💥"; }

      const result = Math.floor(bet * multiplier);
      db.updateUser(senderRaw, (u) => {
        u.coins = (u.coins ?? 100) - bet + result;
        u.cooldowns ??= {};
        u.cooldowns.invest = now;
      });

      const xpGain = multiplier >= 1 ? 40 : 10;
      const { leveledUp, newLevel } = db.addXp(senderRaw, xpGain);

      const texto = `\`📈 INVERSIÓN\`

${resultEmoji} *${resultText}*

\`💰 INVERTIDO ›\` *${bet}* monedas
\`📊 MULTIPLICADOR ›\` x${multiplier}
\`💵 RESULTADO ›\` *${result}* monedas
\`📈 GANANCIA/PÉRDIDA ›\` *${result - bet}* monedas
\`✨ XP ›\` *+${xpGain}*${leveledUp ? `\n\n\`⭐ SUBISTE AL NIVEL ${newLevel}\`` : ""}`;

      await reply(texto);
    },
  },
];
