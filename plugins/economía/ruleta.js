import { db } from "../../src/database.js";

const REDS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

function spinRoulette() {
  const number = Math.floor(Math.random() * 37); // 0-36
  let color = "verde";
  if (number !== 0) color = REDS.includes(number) ? "rojo" : "negro";
  return { number, color };
}

export default [
  {
    command: ["ruleta", "roulette"],
    description: "🎡 Apuesta a color, par o impar en la ruleta.",
    async execute({ senderRaw, args, reply }) {
      const user = db.getUser(senderRaw);

      if (args.length < 2) {
        return reply(`\`🎡 RULETA\`

\`📜 OPCIONES ›\` rojo, negro, par, impar
\`📜 ROJO/NEGRO ›\` Paga *x2*
\`📜 PAR/IMPAR ›\` Paga *x2*
\`📜 EL 0 ›\` Siempre pierde (salvo apueste a "verde")

> _Uso: *!ruleta <opción> <cantidad>*_
> _Ejemplo: *!ruleta rojo 100*_
> _Saldo: *${user.coins ?? 100}* monedas_`);
      }

      const choice = args[0].toLowerCase();
      let bet = args[1] === "all" ? (user.coins ?? 100) : parseInt(args[1]);
      if (isNaN(bet) || bet <= 0) return reply(`\`🎡 RULETA\`\n\n\`✘ ERROR ›\` Apuesta inválida.`);
      if ((user.coins ?? 100) < bet) {
        return reply(`\`🎡 SIN FONDOS\`

\`💰 TU SALDO ›\` *${user.coins ?? 100}* monedas
\`💰 NECESITAS ›\` *${bet}* monedas`);
      }
      if (!["rojo", "negro", "par", "impar", "verde"].includes(choice)) {
        return reply(`\`🎡 RULETA\`\n\n\`✘ ERROR ›\` Elige *rojo*, *negro*, *par* o *impar*.`);
      }

      const { number, color } = spinRoulette();
      const isEven = number !== 0 && number % 2 === 0;

      let win = false;
      if (choice === "rojo" || choice === "negro") win = choice === color;
      else if (choice === "par") win = isEven;
      else if (choice === "impar") win = number !== 0 && !isEven;
      else if (choice === "verde") win = color === "verde";

      let resultado;
      if (win) {
        const multiplier = choice === "verde" ? 14 : 2;
        const winnings = Math.floor(bet * multiplier);
        db.updateUser(senderRaw, (u) => { u.coins = (u.coins ?? 100) - bet + winnings; });
        const { leveledUp, newLevel } = db.addXp(senderRaw, Math.floor(bet * 0.15));
        resultado = `\`✅ ¡GANASTE!\`\n\`💰 GANADO ›\` *${winnings}* monedas${leveledUp ? `\n\n\`⭐ SUBISTE AL NIVEL ${newLevel}\`` : ""}`;
      } else {
        db.updateUser(senderRaw, (u) => { u.coins = (u.coins ?? 100) - bet; });
        resultado = `\`❌ ¡PERDISTE!\`\n\`💰 PERDIDO ›\` *${bet}* monedas`;
      }

      const texto = `\`🎡 RULETA\`

\`🎯 ELEGISTE ›\` *${choice.toUpperCase()}*
\`🔢 SALIÓ ›\` *${number}* (${color})

${resultado}`;

      await reply(texto);
    },
  },
];
