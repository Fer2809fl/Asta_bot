import { db } from "../../src/database.js";

export default [
  {
    command: ["double", "doble", "dobleonada", "dn"],
    description: "🎲 Doble o nada. Apuesta todo y duplica (o pierde).",
    async execute({ senderRaw, args, reply }) {
      const user = db.getUser(senderRaw);
      const betStr = args[0];

      if (!betStr) {
        return reply(`\`🎲 DOBLE O NADA\`

\`📜 PROBABILIDAD ›\` 50%
\`📜 GANAR ›\` Duplicas tu apuesta
\`📜 PERDER ›\` Pierdes todo

> _Uso: *!double <cantidad>* o *!double all*_
> _Saldo: *${user.coins ?? 100}* monedas_`);
      }

      let bet = betStr === "all" ? (user.coins ?? 100) : parseInt(betStr);
      if (isNaN(bet) || bet <= 0) return reply(`\`🎲 DOBLE O NADA\`\n\n\`✘ ERROR ›\` Apuesta inválida.`);
      if ((user.coins ?? 100) < bet) {
        return reply(`\`🎲 SIN FONDOS\`

\`💰 TU SALDO ›\` *${user.coins ?? 100}* monedas
\`💰 NECESITAS ›\` *${bet}* monedas`);
      }

      const win = Math.random() < 0.5;

      let resultado;
      if (win) {
        const winnings = bet * 2;
        db.updateUser(senderRaw, (u) => { u.coins = (u.coins ?? 100) - bet + winnings; });
        const { leveledUp, newLevel } = db.addXp(senderRaw, Math.floor(bet * 0.2));
        resultado = `\`✅ ¡DOBLE!\`\n\`💰 GANADO ›\` *${winnings}* monedas${leveledUp ? `\n\n\`⭐ SUBISTE AL NIVEL ${newLevel}\`` : ""}`;
      } else {
        db.updateUser(senderRaw, (u) => { u.coins = (u.coins ?? 100) - bet; });
        resultado = `\`❌ ¡NADA!\`\n\`💰 PERDIDO ›\` *${bet}* monedas`;
      }

      const texto = `\`🎲 DOBLE O NADA\`

\`💰 APUESTA ›\` *${bet}* monedas
\`🎲 LANZANDO...\`

${resultado}`;

      await reply(texto);
    },
  },
];
