import { db } from "../../src/database.js";

export default [
  {
    command: ["giveaway", "sorteo", "regalar", "donar"],
    description: "🎁 Crea un sorteo de monedas para todos en el grupo.",
    async execute({ senderRaw, args, reply }) {
      const user = db.getUser(senderRaw);
      const amountStr = args[0];

      if (!amountStr) {
        return reply(`\`🎁 SORTEO\`

\`📜 INFO ›\` Crea un sorteo de monedas.

> _Uso: *!giveaway <cantidad>*_
> _Ejemplo: *!giveaway 500*_
> _Saldo: *${user.coins ?? 100}* monedas_`);
      }

      const amount = parseInt(amountStr);
      if (isNaN(amount) || amount <= 0) return reply(`\`🎁 SORTEO\`\n\n\`✘ ERROR ›\` Cantidad inválida.`);
      if ((user.coins ?? 100) < amount) {
        return reply(`\`🎁 SIN FONDOS\`

\`💰 TU SALDO ›\` *${user.coins ?? 100}* monedas
\`💰 NECESITAS ›\` *${amount}* monedas`);
      }

      db.updateUser(senderRaw, (u) => { u.coins = (u.coins ?? 100) - amount; });

      const participants = Math.floor(Math.random() * 5) + 3;
      const prizePerPerson = Math.floor(amount / participants);
      const leftover = amount - prizePerPerson * participants;

      if (leftover > 0) {
        db.updateUser(senderRaw, (u) => { u.coins = (u.coins ?? 100) + leftover; });
      }

      const { leveledUp, newLevel } = db.addXp(senderRaw, 50);

      const texto = `\`🎁 ¡SORTEO! 🎉\`

\`💰 APORTADO ›\` *${amount}* monedas
\`👥 GANADORES ›\` *${participants}* personas
\`💰 CADA UNO ›\` *${prizePerPerson}* monedas${leftover > 0 ? `\n\`💰 SOBRANTE ›\` *${leftover}* monedas (para ti)` : ""}

\`✨ GRACIAS POR TU GENEROSIDAD 🎉\`${leveledUp ? `\n\n\`⭐ SUBISTE AL NIVEL ${newLevel}\`` : ""}`;

      await reply(texto);
    },
  },
];
