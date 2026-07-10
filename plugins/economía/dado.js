import { db } from "../../src/database.js";

const DICE_EMOJIS = ["", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

export default [
  {
    command: ["dado", "dice", "dados"],
    description: "🎲 Apuesta lanzando dados contra el bot.",
    async execute({ senderRaw, args, reply }) {
      const user = db.getUser(senderRaw);
      const betStr = args[0];

      if (!betStr) {
        return reply(`\`🎲 JUEGO DE DADOS\`

\`📜 REGLAS ›\` Tú y el bot lanzan un dado (1-6)
\`📜 GANAR ›\` Mayor número gana *x1.8*
\`📜 EMPATE ›\` Recuperas tu apuesta

> _Uso: *!dado <cantidad>* o *!dado all*_
> _Saldo: *${user.coins ?? 100}* monedas_`);
      }

      let bet = betStr === "all" ? (user.coins ?? 100) : parseInt(betStr);
      if (isNaN(bet) || bet <= 0) return reply(`\`🎲 JUEGO DE DADOS\`\n\n\`✘ ERROR ›\` Apuesta inválida.`);
      if ((user.coins ?? 100) < bet) {
        return reply(`\`🎲 SIN FONDOS\`

\`💰 TU SALDO ›\` *${user.coins ?? 100}* monedas
\`💰 NECESITAS ›\` *${bet}* monedas`);
      }

      const playerRoll = Math.floor(Math.random() * 6) + 1;
      const botRoll = Math.floor(Math.random() * 6) + 1;

      let resultado;
      if (playerRoll > botRoll) {
        const winnings = Math.floor(bet * 1.8);
        db.updateUser(senderRaw, (u) => { u.coins = (u.coins ?? 100) - bet + winnings; });
        const { leveledUp, newLevel } = db.addXp(senderRaw, Math.floor(bet * 0.15));
        resultado = `\`✅ ¡GANASTE!\`\n\`💰 RECIBES ›\` *${winnings}* monedas${leveledUp ? `\n\n\`⭐ SUBISTE AL NIVEL ${newLevel}\`` : ""}`;
      } else if (playerRoll < botRoll) {
        db.updateUser(senderRaw, (u) => { u.coins = (u.coins ?? 100) - bet; });
        resultado = `\`❌ ¡PERDISTE!\`\n\`💰 PERDIDO ›\` *${bet}* monedas`;
      } else {
        resultado = `\`🤝 ¡EMPATE!\`\n\`💰 RECUPERAS ›\` *${bet}* monedas`;
      }

      const texto = `\`🎲 JUEGO DE DADOS\`

\`🎲 TÚ ›\` ${DICE_EMOJIS[playerRoll]} *${playerRoll}*
\`🎲 BOT ›\` ${DICE_EMOJIS[botRoll]} *${botRoll}*

${resultado}`;

      await reply(texto);
    },
  },
];
