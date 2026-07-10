import { db } from "../../src/database.js";

export default [
  {
    command: ["afk", "ausente", "away"],
    description: "😴 Activa modo AFK. Nadie podrá mencionarte en este grupo.",
    async execute({ senderRaw, remoteJid, args, reply }) {
      const user = db.getUser(senderRaw);
      const now = Date.now();
      user.afkGroups ??= {};

      if (user.afkGroups[remoteJid]?.active) {
        const { start } = user.afkGroups[remoteJid];
        const elapsed = now - start;
        const hours = Math.floor(elapsed / 3600000);
        const minutes = Math.floor((elapsed % 3600000) / 60000);
        const reward = Math.min(hours * 30 + Math.floor(minutes / 2), 1000);

        db.updateUser(senderRaw, (u) => {
          u.coins = (u.coins ?? 100) + reward;
          u.afkGroups[remoteJid] = { active: false, start: 0, reason: "" };
        });

        const { leveledUp, newLevel } = db.addXp(senderRaw, Math.floor(reward / 5));

        const texto = `\`👋 ¡BIENVENIDO/A DE VUELTA!\`

\`⏱️ TIEMPO AFK ›\` *${hours}h ${minutes}m*
\`💰 RECOMPENSA ›\` *${reward}* monedas
\`📍 GRUPO ›\` *Este grupo*${leveledUp ? `\n\n\`⭐ SUBISTE AL NIVEL ${newLevel}\`` : ""}`;

        return reply(texto);
      }

      const reason = args.join(" ") || "Sin motivo";
      db.updateUser(senderRaw, (u) => {
        u.afkGroups ??= {};
        u.afkGroups[remoteJid] = { active: true, start: now, reason };
      });

      const texto = `\`😴 MODO AFK ACTIVADO\`

\`📝 MOTIVO ›\` *${reason}*
\`📍 GRUPO ›\` *Este grupo*

> _Usa *!afk* de nuevo al regresar para cobrar._
> _Si alguien te menciona, les avisaré que estás ausente._`;

      await reply(texto);
    },
  },
];
