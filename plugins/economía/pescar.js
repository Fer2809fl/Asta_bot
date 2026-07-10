import { db } from "../../src/database.js";

const FISH = [
  { key: "comun", name: "🐟 Común", chance: 0.5, xp: 4 },
  { key: "raro", name: "🐠 Raro", chance: 0.3, xp: 10 },
  { key: "epico", name: "🦑 Épico", chance: 0.15, xp: 25 },
  { key: "legendario", name: "🧜‍♂️ Legendario", chance: 0.05, xp: 60 },
];

export default [
  {
    command: ["pescar", "fish", "pesca"],
    description: "🎣 Pesca peces que luego puedes vender.",
    async execute({ senderRaw, reply }) {
      const user = db.getUser(senderRaw);
      const now = Date.now();
      const cooldown = 6 * 60 * 1000;

      if (now - (user.cooldowns?.pescar ?? 0) < cooldown) {
        const remaining = cooldown - (now - user.cooldowns.pescar);
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        return reply(`\`🎣 PESCA\`

\`✘ ERROR ›\` La caña necesita descansar.
\`⏱️ VUELVE EN ›\` *${minutes}m ${seconds}s*`);
      }

      const roll = Math.random();
      let fish = FISH[0], accumulated = 0;
      for (const f of FISH) {
        accumulated += f.chance;
        if (roll <= accumulated) { fish = f; break; }
      }

      const amount = Math.floor(Math.random() * 3) + 1;

      db.updateUser(senderRaw, (u) => {
        u.cooldowns ??= {};
        u.cooldowns.pescar = now;
        u.fish ??= { comun: 0, raro: 0, epico: 0, legendario: 0 };
        u.fish[fish.key] = (u.fish[fish.key] ?? 0) + amount;
      });

      const { leveledUp, newLevel } = db.addXp(senderRaw, fish.xp);
      const missionReward = db.checkMissionProgress ? db.checkMissionProgress(senderRaw, "pescar", 1) : "";

      const texto = `\`🎣 ¡PESCA EXITOSA!\`

\`✦ PESCASTE ›\` ${fish.name} x*${amount}*
\`✨ XP ›\` *+${fish.xp}*${leveledUp ? `\n\n\`⭐ SUBISTE AL NIVEL ${newLevel}\`` : ""}${missionReward || ""}

> _Usa *!vender* para cambiar tus peces por monedas._`;

      await reply(texto);
    },
  },
];
