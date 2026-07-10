import { db } from "../../src/database.js";

const VALUES = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

const drawCard = () => VALUES[Math.floor(Math.random() * VALUES.length)];

function cardValue(card) {
  if (["J", "Q", "K"].includes(card)) return 10;
  if (card === "A") return 11;
  return parseInt(card);
}

function handValue(hand) {
  let total = 0, aces = 0;
  for (const card of hand) {
    total += cardValue(card);
    if (card === "A") aces++;
  }
  while (total > 21 && aces > 0) { total -= 10; aces--; }
  return total;
}

const formatHand = (hand) => hand.map((c) => `[${c}]`).join(" ");

export default [
  {
    command: ["blackjack", "bj", "21", "veintiuno"],
    description: "🃏 Juega Blackjack (21) contra el bot.",
    async execute({ senderRaw, args, reply }) {
      const user = db.getUser(senderRaw);
      const betStr = args[0];

      if (!betStr) {
        return reply(`\`🃏 BLACKJACK\`

\`📜 REGLAS ›\` Acércate a *21* sin pasarte
\`📜 CARTAS ›\` J, Q, K = 10 | A = 11 o 1
\`📜 BLACKJACK ›\` Paga *x2.5*
\`📜 GANAR ›\` Paga *x2*

> _Uso: *!blackjack <cantidad>* o *!bj all*_
> _Saldo: *${user.coins ?? 100}* monedas_`);
      }

      let bet = betStr === "all" ? (user.coins ?? 100) : parseInt(betStr);
      if (isNaN(bet) || bet <= 0) return reply(`\`🃏 BLACKJACK\`\n\n\`✘ ERROR ›\` Apuesta inválida.`);
      if ((user.coins ?? 100) < bet) {
        return reply(`\`🃏 SIN FONDOS\`

\`💰 TU SALDO ›\` *${user.coins ?? 100}* monedas
\`💰 NECESITAS ›\` *${bet}* monedas`);
      }

      const playerHand = [drawCard(), drawCard()];
      const botHand = [drawCard(), drawCard()];
      const pVal = handValue(playerHand);
      const bVal = handValue(botHand);

      if (pVal === 21 && bVal !== 21) {
        const winnings = Math.floor(bet * 2.5);
        db.updateUser(senderRaw, (u) => { u.coins = (u.coins ?? 100) - bet + winnings; });
        const { leveledUp, newLevel } = db.addXp(senderRaw, Math.floor(bet * 0.3));

        return reply(`\`🃏 ¡BLACKJACK NATURAL!\`

\`🎴 TU MANO ›\` *${formatHand(playerHand)}* = *${pVal}*
\`🎴 BOT ›\` *${formatHand(botHand)}* = *${bVal}*

\`💰 GANADO ›\` *${winnings}* monedas${leveledUp ? `\n\n\`⭐ SUBISTE AL NIVEL ${newLevel}\`` : ""}`);
      }

      if (pVal > 21) {
        db.updateUser(senderRaw, (u) => { u.coins = (u.coins ?? 100) - bet; });
        return reply(`\`🃏 ¡TE PASASTE!\`

\`🎴 TU MANO ›\` *${formatHand(playerHand)}* = *${pVal}*
\`💰 PERDIDO ›\` *${bet}* monedas`);
      }

      let botTotal = bVal;
      while (botTotal < 17) {
        botHand.push(drawCard());
        botTotal = handValue(botHand);
      }

      let resultado;
      if (botTotal > 21 || pVal > botTotal) {
        const winnings = Math.floor(bet * 2);
        db.updateUser(senderRaw, (u) => { u.coins = (u.coins ?? 100) - bet + winnings; });
        const { leveledUp, newLevel } = db.addXp(senderRaw, Math.floor(bet * 0.2));
        resultado = `\`✅ ¡GANASTE!\`\n\`💰 RECIBES ›\` *${winnings}* monedas${leveledUp ? `\n\n\`⭐ SUBISTE AL NIVEL ${newLevel}\`` : ""}`;
      } else if (pVal === botTotal) {
        resultado = `\`🤝 ¡EMPATE!\`\n\`💰 RECUPERAS ›\` *${bet}* monedas`;
      } else {
        db.updateUser(senderRaw, (u) => { u.coins = (u.coins ?? 100) - bet; });
        resultado = `\`❌ ¡PERDISTE!\`\n\`💰 PERDIDO ›\` *${bet}* monedas`;
      }

      const texto = `\`🃏 BLACKJACK\`

\`🎴 TÚ ›\` *${formatHand(playerHand)}* = *${pVal}*
\`🎴 BOT ›\` *${formatHand(botHand)}* = *${botTotal}*

${resultado}`;

      await reply(texto);
    },
  },
];
