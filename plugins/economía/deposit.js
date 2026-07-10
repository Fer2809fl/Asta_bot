import { db } from "../../src/database.js";

export default [
  {
    command: ["dep", "depositar"],
    description: "Deposita monedas al banco.",
    async execute({ senderRaw, args, reply }) {
      if (!args[0]) {
        return reply(`\`🏦 DEPÓSITO\`

\`✘ ERROR ›\` Especifica la cantidad.

> _Ejemplo: *!dep 50* o *!dep all*_`);
      }

      let status = false, depAmt = 0, finalCoins = 0, finalBank = 0;

      db.updateUser(senderRaw, (u) => {
        let toDeposit = args[0] === "all" ? u.coins : parseInt(args[0]);
        if (isNaN(toDeposit) || toDeposit <= 0 || u.coins < toDeposit) return;

        u.coins -= toDeposit;
        u.bank = (u.bank ?? 0) + toDeposit;
        depAmt = toDeposit;
        finalCoins = u.coins;
        finalBank = u.bank;
        status = true;
      });

      if (!status) {
        return reply(`\`🏦 DEPÓSITO\`

\`✘ ERROR ›\` Cantidad inválida o sin fondos.

> _Usa *!bal* para ver tu saldo_`);
      }

      const texto = `\`🏦 ¡DEPÓSITO EXITOSO!\`

\`💰 DEPOSITADO ›\` *${depAmt}* monedas
\`👛 CARTERA ›\` *${finalCoins}*
\`🏦 BANCO ›\` *${finalBank}*`;

      await reply(texto);
    },
  },
];
