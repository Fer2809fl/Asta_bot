import { db } from "../../src/database.js";

const BOUNTIES = [
  { id: "mine5", desc: "⛏️ Minar 5 veces", reward: 500, check: (u) => (u.minerals ? Object.values(u.minerals).reduce((a, b) => a + b, 0) : 0) >= 5 },
  { id: "fish10", desc: "🎣 Pescar 10 peces en total", reward: 600, check: (u) => (u.fish ? Object.values(u.fish).reduce((a, b) => a + b, 0) : 0) >= 10 },
  { id: "work20", desc: "💼 Trabajar 20 veces", reward: 800, check: () => false },
  { id: "rich", desc: "💰 Tener 10,000 monedas en total", reward: 2000, check: (u) => ((u.coins ?? 0) + (u.bank ?? 0)) >= 10000 },
  { id: "level10", desc: "⭐ Alcanzar nivel 10", reward: 1500, check: (u) => (u.level ?? 1) >= 10 },
  { id: "hunt5", desc: "🏹 Cazar 5 animales", reward: 700, check: (u) => (u.hunts ? Object.values(u.hunts).reduce((a, b) => a + b, 0) : 0) >= 5 },
  { id: "daily7", desc: "📅 Reclamar daily 7 días seguidos", reward: 1000, check: () => false },
  { id: "slots50", desc: "🎰 Jugar slots 50 veces", reward: 1200, check: () => false },
];

export default [
  {
    command: ["bounty", "recompensa", "objetivo", "logros"],
    description: "🎯 Mira y reclama recompensas por logros especiales.",
    async execute({ senderRaw, args, reply }) {
      const user = db.getUser(senderRaw);
      user.bounties ??= {};

      if (args[0] === "reclamar" || args[0] === "claim") {
        let totalReward = 0;
        let claimedCount = 0;

        for (const bounty of BOUNTIES) {
          if (!user.bounties[bounty.id] && bounty.check(user)) {
            totalReward += bounty.reward;
            claimedCount++;
            user.bounties[bounty.id] = true;
          }
        }

        if (claimedCount === 0) {
          return reply(`\`🎯 RECOMPENSAS\`

\`✘ ERROR ›\` No tienes recompensas disponibles.

> _Usa *!bounty* para ver tu progreso._`);
        }

        db.updateUser(senderRaw, (u) => {
          u.coins = (u.coins ?? 100) + totalReward;
          u.bounties = user.bounties;
        });

        const { leveledUp, newLevel } = db.addXp(senderRaw, claimedCount * 30);

        const texto = `\`🎉 ¡RECOMPENSAS RECLAMADAS!\`

\`📦 RECOMPENSAS ›\` *${claimedCount}*
\`💰 TOTAL ›\` *${totalReward}* monedas
\`✨ XP ›\` *+${claimedCount * 30}*${leveledUp ? `\n\n\`⭐ SUBISTE AL NIVEL ${newLevel}\`` : ""}`;

        return reply(texto);
      }

      const lineas = BOUNTIES.map((bounty) => {
        const claimed = user.bounties[bounty.id];
        const completed = bounty.check(user);
        if (claimed) return `\`✅ ${bounty.desc}\` — Reclamado`;
        if (completed) return `\`🎁 ${bounty.desc}\` — *${bounty.reward}* monedas (¡Listo!)`;
        return `\`🔒 ${bounty.desc}\` — *${bounty.reward}* monedas`;
      }).join("\n");

      const texto = `\`🎯 RECOMPENSAS ESPECIALES\`

${lineas}

> _Usa *!bounty reclamar* para cobrar._`;

      await reply(texto);
    },
  },
];
