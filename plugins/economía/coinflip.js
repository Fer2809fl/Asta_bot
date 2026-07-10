import { db } from "../../src/database.js";

export default [
  {
    command: ["coinflip", "cf", "caraocruz"],
    description: "🪙 Apuesta lanzando una moneda (cara o cruz).",
    async execute({ senderRaw, args, reply }) {
      const user = db.getUser(senderRaw);

      if (args.length < 2) {
        return reply(`\`🪙 CARA O CRUZ\`

\`📜 REGLAS ›\` Elige *cara* o *cruz*
\`📜 PAGO ›\` Si aciertas, ganas *x1.9*
\`📜 PROBABILIDAD ›\` 50%

> _Uso: *!cf <cara/cruz> <cantidad>*_
> _Saldo: *${user.coins ?? 100}* monedas_`);
      }

      const choice = args[0].toLowerCase();
      let bet = args[1] === "all" ? (user.coins ?? 100) : parseInt(args[1]);
      if (isNaN(bet) || bet <= 0) return reply(`\`🪙 CARA O CRUZ\`\n\n\`✘ ERROR ›\` Apuesta inválida.`);
      if ((user.coins ?? 100) < bet) {
        return reply(`\`🪙 SIN FONDOS\`

\`💰 TU SALDO ›\` *${user.coins ?? 100}* monedas
\`💰 NECESITAS ›\` *${bet}* monedas`);
      }
      if (!["cara", "cruz", "heads", "tails"].includes(choice)) {
        return reply(`\`🪙 CARA O CRUZ\`\n\n\`✘ ERROR ›\` Elige *cara* o *cruz*.`);
      }

      const result = Math.random() < 0.5 ? "cara" : "cruz";
      const win = choice === result || (choice === "heads" && result === "cara") || (choice === "tails" && result === "cruz");

      let resultado;
      if (win) {
        const winnings = Math.floor(bet * 1.9);
        db.updateUser(senderRaw, (u) => { u.coins = (u.coins ?? 100) - bet + winnings; });
        const { leveledUp, newLevel } = db.addXp(senderRaw, Math.floor(bet * 0.1));
        resultado = `\`✅ ¡ACERTASTE!\`\n\`💰 GANADO ›\` *${winnings}* monedas${leveledUp ? `\n\n\`⭐ SUBISTE AL NIVEL ${newLevel}\`` : ""}`;
      } else {
        db.updateUser(senderRaw, (u) => { u.coins = (u.coins ?? 100) - bet; });
        resultado = `\`❌ ¡FALLASTE!\`\n\`💰 PERDIDO ›\` *${bet}* monedas`;
      }

      const texto = `\`🪙 CARA O CRUZ\`

\`🎯 ELEGISTE ›\` *${choice.toUpperCase()}*
\`🎲 RESULTADO ›\` *${result.toUpperCase()}*
\`💰 APUESTA ›\` *${bet}* monedas

${resultado}`;

      await reply(texto);
    },
  },
];
