import { db } from "../../src/database.js";

const CRIMES = [
  "Robaste un banco exitosamente.",
  "Hackeaste una cuenta bancaria corporativa.",
  "Vendiste información secreta al mejor postor.",
  "Secuestraste un camión de valores blindado.",
  "Estafaste a un millonario en línea.",
  "Saqueaste una tienda de lujo.",
  "Interceptaste un envío de diamantes.",
];

const FAILS = [
  "¡Te atrapó la policía!",
  "¡Activaste una alarma silenciosa!",
  "¡Un testigo te identificó en cámara!",
  "¡Te traicionó tu cómplice!",
  "¡La puerta estaba cerrada con llave!",
  "¡Un perro guardián te mordió!",
];

export default [
  {
    command: ["crime", "crimen", "delito"],
    description: "🦹 Comete un crimen para ganar monedas. ¡Alto riesgo, alta recompensa!",
    async execute({ senderRaw, reply }) {
      const user = db.getUser(senderRaw);
      const now = Date.now();
      const cooldown = 30 * 60 * 1000;

      if (now - (user.cooldowns?.crime ?? 0) < cooldown) {
        const remaining = cooldown - (now - user.cooldowns.crime);
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        return reply(`\`🦹 CRIMEN\`

\`✘ ERROR ›\` La policía te vigila.
\`⏱️ COOLDOWN ›\` *${minutes}m ${seconds}s*`);
      }

      const success = Math.random() < 0.5;
      db.updateUser(senderRaw, (u) => {
        u.cooldowns ??= {};
        u.cooldowns.crime = now;
      });

      if (success) {
        const reward = Math.floor(Math.random() * (1000 - 200 + 1)) + 200;
        db.updateUser(senderRaw, (u) => { u.coins = (u.coins ?? 100) + reward; });
        const { leveledUp, newLevel } = db.addXp(senderRaw, 35);
        const crime = CRIMES[Math.floor(Math.random() * CRIMES.length)];

        const texto = `\`🦹 ¡CRIMEN EXITOSO!\`

\`✦ RESULTADO ›\` *${crime}*

\`💰 GANADO ›\` *${reward}* monedas
\`✨ XP ›\` *+35*${leveledUp ? `\n\n\`⭐ SUBISTE AL NIVEL ${newLevel}\`` : ""}`;

        await reply(texto);
      } else {
        const fine = Math.floor(Math.random() * (300 - 80 + 1)) + 80;
        const actualFine = Math.min(user.coins ?? 100, fine);
        db.updateUser(senderRaw, (u) => { u.coins = Math.max(0, (u.coins ?? 100) - actualFine); });
        const fail = FAILS[Math.floor(Math.random() * FAILS.length)];

        const texto = `\`🚔 ¡FUISTE ATRAPADO/A!\`

\`✘ RESULTADO ›\` *${fail}*

\`💰 MULTA ›\` *${actualFine}* monedas`;

        await reply(texto);
      }
    },
  },
];
