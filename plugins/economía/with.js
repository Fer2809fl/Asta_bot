import { db } from "../../src/database.js";

export default [
  {
    command: ["with", "retirar"],
    description: "Retira monedas del banco.",
    async execute({ senderRaw, args, reply }) {
      if (!args[0]) {
        return reply(`\`🏦 RETIRO\`

\`✘ ERROR ›\` Especifica la cantidad.

> _Ejemplo: *!with 50* o *!with all*_`);
      }

      let status = false, witAmt = 0, finalCoins = 0, finalBank = 0;

      db.updateUser(senderRaw, (u) => {
        let toWithdraw = args[0] === "all" ? (u.bank ?? 0) : parseInt(args[0]);
        if (isNaN(toWithdraw) || toWithdraw <= 0 || (u.bank ?? 0) < toWithdraw) return;

        u.bank -= toWithdraw;
        u.coins = (u.coins ?? 100) + toWithdraw;
        witAmt = toWithdraw;
        finalCoins = u.coins;
        finalBank = u.bank;
        status = true;
      });

      if (!status) {
        return reply(`\`🏦 RETIRO\`

\`✘ ERROR ›\` Cantidad inválida o sin fondos en el banco.

> _Usa *!bal* para ver tu saldo_`);
      }

      const texto = `\`🏦 ¡RETIRO EXITOSO!\`

\`💰 RETIRADO ›\` *${witAmt}* monedas
\`👛 CARTERA ›\` *${finalCoins}*
\`🏦 BANCO ›\` *${finalBank}*`;

      await reply(texto);
    },
  },
];
