import { db } from "../../src/database.js";

export default [
  {
    command: ["highlow", "hl", "altobajo", "mayor"],
    description: "📊 Adivina si el siguiente número es mayor o menor.",
    async execute({ senderRaw, args, reply }) {
      const user = db.getUser(senderRaw);

      if (args.length < 2) {
        return reply(`\`📊 ALTO O BAJO\`

\`📜 REGLAS ›\` Se muestra un número (1-100)
\`📜 ADIVINA ›\` Si el siguiente es mayor o menor
\`📜 PAGO ›\` Acertar = *x2* tu apuesta

> _Uso: *!highlow <alto/bajo> <cantidad>*_
> _Ejemplo: *!highlow alto 100*_
> _Saldo: *${user.coins ?? 100}* monedas_`);
      }

      const choice = args[0].toLowerCase();
      let bet = args[1] === "all" ? (user.coins ?? 100) : parseInt(args[1]);
      if (isNaN(bet) || bet <= 0) return reply(`\`📊 ALTO O BAJO\`\n\n\`✘ ERROR ›\` Apuesta inválida.`);
      if ((user.coins ?? 100) < bet) {
        return reply(`\`📊 SIN FONDOS\`

\`💰 TU SALDO ›\` *${user.coins ?? 100}* monedas
\`💰 NECESITAS ›\` *${bet}* monedas`);
      }
      if (!["alto", "bajo", "high", "low"].includes(choice)) {
        return reply(`\`📊 ALTO O BAJO\`\n\n\`✘ ERROR ›\` Elige *alto* o *bajo*.`);
      }

      const current = Math.floor(Math.random() * 100) + 1;
      const next = Math.floor(Math.random() * 100) + 1;
      const isHigher = next > current;
      const win = choice === "alto" || choice === "high" ? isHigher : !isHigher;

      let resultado;
      if (win) {
        const winnings = Math.floor(bet * 2);
        db.updateUser(senderRaw, (u) => { u.coins = (u.coins ?? 100) - bet + winnings; });
        const { leveledUp, newLevel } = db.addXp(senderRaw, Math.floor(bet * 0.15));
        resultado = `\`✅ ¡ACERTASTE! 🎯\`\n\`💰 GANADO ›\` *+${winnings}* monedas${leveledUp ? `\n\n\`⭐ SUBISTE AL NIVEL ${newLevel}\`` : ""}`;
      } else {
        db.updateUser(senderRaw, (u) => { u.coins = (u.coins ?? 100) - bet; });
        resultado = `\`❌ ¡FALLASTE!\`\n\`💰 PERDIDO ›\` *${bet}* monedas`;
      }

      const texto = `\`📊 ALTO O BAJO\`

\`🔢 ACTUAL ›\` *${current}*
\`🎯 ELEGISTE ›\` *${choice.toUpperCase()}*
\`🔢 SIGUIENTE ›\` *${next}*

${resultado}`;

      await reply(texto);
    },
  },
];
