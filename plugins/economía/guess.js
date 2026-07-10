import { db } from "../../src/database.js";

export default [
  {
    command: ["guess", "adivina", "numero", "adivinar"],
    description: "🔢 Adivina un número del 1 al 10. ¡Gana monedas!",
    async execute({ senderRaw, args, reply }) {
      const user = db.getUser(senderRaw);
      const now = Date.now();
      const cooldown = 3 * 60 * 1000;

      if (now - (user.cooldowns?.guess ?? 0) < cooldown) {
        const remaining = cooldown - (now - user.cooldowns.guess);
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        return reply(`\`🔢 ADIVINA\`

\`⏱️ ESPERA ›\` *${minutes}m ${seconds}s* para jugar de nuevo.`);
      }

      if (!args[0]) {
        return reply(`\`🔢 ADIVINA EL NÚMERO\`

\`📜 REGLAS ›\` Adivina un número del 1 al 10
\`📜 ACIERTO ›\` *300* monedas
\`📜 CERCA (±1) ›\` *100* monedas

> _Uso: *!guess <número>*_
> _Ejemplo: *!guess 5*_`);
      }

      const guess = parseInt(args[0]);
      if (isNaN(guess) || guess < 1 || guess > 10) {
        return reply(`\`🔢 ADIVINA\`\n\n\`✘ ERROR ›\` Elige un número del 1 al 10.`);
      }

      const secret = Math.floor(Math.random() * 10) + 1;
      const diff = Math.abs(guess - secret);

      db.updateUser(senderRaw, (u) => {
        u.cooldowns ??= {};
        u.cooldowns.guess = now;
      });

      let resultado;
      if (guess === secret) {
        db.updateUser(senderRaw, (u) => { u.coins = (u.coins ?? 100) + 300; });
        const { leveledUp, newLevel } = db.addXp(senderRaw, 25);
        resultado = `\`✅ ¡ACERTASTE! 🎯\`\n\`💰 GANADO ›\` *300* monedas${leveledUp ? `\n\n\`⭐ SUBISTE AL NIVEL ${newLevel}\`` : ""}`;
      } else if (diff === 1) {
        db.updateUser(senderRaw, (u) => { u.coins = (u.coins ?? 100) + 100; });
        resultado = `\`🟡 ¡CERCA! (±1)\`\n\`💰 GANADO ›\` *100* monedas`;
      } else {
        resultado = `\`❌ ¡FALLASTE!\`\n\`💰 GANADO ›\` *Nada* 😢`;
      }

      const texto = `\`🔢 ADIVINA\`

\`🎯 TU NÚMERO ›\` *${guess}*
\`🎲 SECRETO ›\` *${secret}*

${resultado}`;

      await reply(texto);
    },
  },
];
