import { db } from "../../src/database.js";

const SYMBOLS = ["🍒", "🍋", "🍇", "🔔", "⭐", "💎"];
const PAYOUTS = { "🍒": 1.5, "🍋": 2, "🍇": 3, "🔔": 5, "⭐": 8, "💎": 15 };

export default [
  {
    command: ["slots", "tragamonedas", "slot"],
    description: "🎰 Juega en la tragamonedas.",
    async execute({ senderRaw, args, reply }) {
      const user = db.getUser(senderRaw);
      const betStr = args[0];

      if (!betStr) {
        return reply(`\`🎰 TRAGAMONEDAS\`

\`📜 REGLAS ›\` 3 símbolos iguales = premio
\`📜 PAGOS ›\` 🍒 x1.5 | 🍋 x2 | 🍇 x3 | 🔔 x5 | ⭐ x8 | 💎 x15
\`📜 2 IGUALES ›\` Recuperas la mitad

> _Uso: *!slots <cantidad>* o *!slots all*_
> _Saldo: *${user.coins ?? 100}* monedas_`);
      }

      let bet = betStr === "all" ? (user.coins ?? 100) : parseInt(betStr);
      if (isNaN(bet) || bet <= 0) return reply(`\`🎰 TRAGAMONEDAS\`\n\n\`✘ ERROR ›\` Apuesta inválida.`);
      if ((user.coins ?? 100) < bet) {
        return reply(`\`🎰 SIN FONDOS\`

\`💰 TU SALDO ›\` *${user.coins ?? 100}* monedas
\`💰 NECESITAS ›\` *${bet}* monedas`);
      }

      const roll = () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      const spin = [roll(), roll(), roll()];

      let resultado;
      if (spin[0] === spin[1] && spin[1] === spin[2]) {
        const winnings = Math.floor(bet * PAYOUTS[spin[0]]);
        db.updateUser(senderRaw, (u) => { u.coins = (u.coins ?? 100) - bet + winnings; });
        const { leveledUp, newLevel } = db.addXp(senderRaw, Math.floor(bet * 0.2));
        resultado = `\`✅ ¡JACKPOT!\`\n\`💰 GANADO ›\` *${winnings}* monedas${leveledUp ? `\n\n\`⭐ SUBISTE AL NIVEL ${newLevel}\`` : ""}`;
      } else if (spin[0] === spin[1] || spin[1] === spin[2] || spin[0] === spin[2]) {
        const refund = Math.floor(bet * 0.5);
        db.updateUser(senderRaw, (u) => { u.coins = (u.coins ?? 100) - bet + refund; });
        resultado = `\`🟡 ¡2 IGUALES!\`\n\`💰 RECUPERAS ›\` *${refund}* monedas`;
      } else {
        db.updateUser(senderRaw, (u) => { u.coins = (u.coins ?? 100) - bet; });
        resultado = `\`❌ ¡PERDISTE!\`\n\`💰 PERDIDO ›\` *${bet}* monedas`;
      }

      const texto = `\`🎰 TRAGAMONEDAS\`

\`🎲 [ ${spin.join(" | ")} ]\`

${resultado}`;

      await reply(texto);
    },
  },
];
