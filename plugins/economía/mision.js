import { db } from "../../src/database.js";

const MISSIONS = [
  { id: "cazar", desc: "🏹 Cazar 3 veces", goal: 3, reward: 200, xp: 20 },
  { id: "minar", desc: "⛏️ Minar 3 veces", goal: 3, reward: 200, xp: 20 },
  { id: "pescar", desc: "🎣 Pescar 3 veces", goal: 3, reward: 200, xp: 20 },
  { id: "trabajar", desc: "💼 Trabajar 2 veces", goal: 2, reward: 250, xp: 25 },
];

export default [
  {
    command: ["mision", "misiones", "mission"],
    description: "📋 Ve y reclama tus misiones diarias.",
    async execute({ senderRaw, args, reply }) {
      const user = db.getUser(senderRaw);
      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1000;

      user.missions ??= { progress: {}, claimed: {}, resetAt: now + oneDay };

      if (now > user.missions.resetAt) {
        db.updateUser(senderRaw, (u) => {
          u.missions = { progress: {}, claimed: {}, resetAt: now + oneDay };
        });
        user.missions = db.getUser(senderRaw).missions;
      }

      if (args[0] === "reclamar" || args[0] === "claim") {
        let totalReward = 0, totalXp = 0, claimedCount = 0;

        for (const mission of MISSIONS) {
          const progress = user.missions.progress[mission.id] ?? 0;
          if (!user.missions.claimed[mission.id] && progress >= mission.goal) {
            totalReward += mission.reward;
            totalXp += mission.xp;
            claimedCount++;
            user.missions.claimed[mission.id] = true;
          }
        }

        if (claimedCount === 0) {
          return reply(`\`📋 MISIONES\`

\`✘ ERROR ›\` No tienes misiones completadas para reclamar.

> _Usa *!mision* para ver tu progreso._`);
        }

        db.updateUser(senderRaw, (u) => {
          u.coins = (u.coins ?? 100) + totalReward;
          u.missions = user.missions;
        });

        const { leveledUp, newLevel } = db.addXp(senderRaw, totalXp);

        return reply(`\`🎉 ¡MISIONES RECLAMADAS!\`

\`📦 COMPLETADAS ›\` *${claimedCount}*
\`💰 TOTAL ›\` *${totalReward}* monedas
\`✨ XP ›\` *+${totalXp}*${leveledUp ? `\n\n\`⭐ SUBISTE AL NIVEL ${newLevel}\`` : ""}`);
      }

      const remaining = user.missions.resetAt - now;
      const hours = Math.floor(remaining / 3600000);
      const minutes = Math.floor((remaining % 3600000) / 60000);

      const lineas = MISSIONS.map((m) => {
        const progress = user.missions.progress[m.id] ?? 0;
        const claimed = user.missions.claimed[m.id];
        const completed = progress >= m.goal;
        if (claimed) return `\`✅ ${m.desc}\` — Reclamado`;
        if (completed) return `\`🎁 ${m.desc}\` — *${m.reward}* monedas (¡Listo!)`;
        return `\`🔸 ${m.desc}\` — ${Math.min(progress, m.goal)}/${m.goal}`;
      }).join("\n");

      const texto = `\`📋 MISIONES DIARIAS\`

${lineas}

\`⏱️ SE RENUEVAN EN ›\` *${hours}h ${minutes}m*

> _Usa *!mision reclamar* para cobrar._`;

      await reply(texto);
    },
  },
];
