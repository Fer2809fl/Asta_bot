import { db } from "../../src/database.js";

const MINERALS = [
  { key: "carbon", name: "🪨 Carbón", chance: 0.4, xp: 5 },
  { key: "hierro", name: "🔩 Hierro", chance: 0.28, xp: 8 },
  { key: "cobre", name: "🔌 Cobre", chance: 0.18, xp: 10 },
  { key: "oro", name: "🪙 Oro", chance: 0.1, xp: 20 },
  { key: "diamante", name: "💎 Diamante", chance: 0.04, xp: 50 },
];

export default [
  {
    command: ["minar", "mine", "mineria"],
    description: "⛏️ Excava minerales que luego puedes vender.",
    async execute({ senderRaw, reply }) {
      const user = db.getUser(senderRaw);
      const now = Date.now();
      const cooldown = 6 * 60 * 1000;

      if (now - (user.cooldowns?.minar ?? 0) < cooldown) {
        const remaining = cooldown - (now - user.cooldowns.minar);
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        return reply(`\`⛏️ MINERÍA\`

\`✘ ERROR ›\` El pico necesita enfriarse.
\`⏱️ VUELVE EN ›\` *${minutes}m ${seconds}s*`);
      }

      const roll = Math.random();
      let mineral = MINERALS[0], accumulated = 0;
      for (const m of MINERALS) {
        accumulated += m.chance;
        if (roll <= accumulated) { mineral = m; break; }
      }

      const amount = Math.floor(Math.random() * 3) + 1;

      db.updateUser(senderRaw, (u) => {
        u.cooldowns ??= {};
        u.cooldowns.minar = now;
        u.minerals ??= { carbon: 0, hierro: 0, cobre: 0, oro: 0, diamante: 0 };
        u.minerals[mineral.key] = (u.minerals[mineral.key] ?? 0) + amount;
      });

      const { leveledUp, newLevel } = db.addXp(senderRaw, mineral.xp);
      const missionReward = db.checkMissionProgress ? db.checkMissionProgress(senderRaw, "minar", 1) : "";

      const texto = `\`⛏️ ¡MINERÍA EXITOSA!\`

\`✦ ENCONTRASTE ›\` ${mineral.name} x*${amount}*
\`✨ XP ›\` *+${mineral.xp}*${leveledUp ? `\n\n\`⭐ SUBISTE AL NIVEL ${newLevel}\`` : ""}${missionReward || ""}

> _Usa *!vender* para cambiar tus minerales por monedas._`;

      await reply(texto);
    },
  },
];
