import { db } from "../../src/database.js";

const CROPS = [
  { name: "🌾 Trigo", time: 1, min: 20, max: 60, xp: 5 },
  { name: "🌽 Maíz", time: 2, min: 40, max: 120, xp: 10 },
  { name: "🍅 Tomate", time: 3, min: 80, max: 200, xp: 15 },
  { name: "🍓 Fresa", time: 4, min: 150, max: 400, xp: 25 },
  { name: "🍇 Uva", time: 5, min: 300, max: 800, xp: 40 },
  { name: "🎃 Calabaza", time: 6, min: 500, max: 1500, xp: 60 },
];

export default [
  {
    command: ["farm", "granja", "cultivar", "cosechar"],
    description: "🌾 Cultiva y cosecha para ganar monedas.",
    async execute({ senderRaw, args, reply }) {
      const user = db.getUser(senderRaw);
      const now = Date.now();

      if (user.farm?.planted && user.farm.harvestTime <= now) {
        const crop = CROPS.find((c) => c.name === user.farm.crop);
        if (crop) {
          const reward = Math.floor(Math.random() * (crop.max - crop.min + 1)) + crop.min;
          db.updateUser(senderRaw, (u) => {
            u.coins = (u.coins ?? 100) + reward;
            u.farm = { planted: false, crop: null, harvestTime: 0 };
          });
          const { leveledUp, newLevel } = db.addXp(senderRaw, crop.xp);

          return reply(`\`🌾 COSECHA\`

\`🌱 CULTIVO ›\` ${crop.name}
\`💰 GANADO ›\` *${reward}* monedas
\`✨ XP ›\` *+${crop.xp}*${leveledUp ? `\n\n\`⭐ SUBISTE AL NIVEL ${newLevel}\`` : ""}`);
        }
      }

      if (user.farm?.planted && user.farm.harvestTime > now) {
        const minutes = Math.floor((user.farm.harvestTime - now) / 60000);
        return reply(`\`🌾 GRANJA\`

\`🌱 CULTIVO ›\` ${user.farm.crop}
\`⏱️ LISTO EN ›\` *${minutes}m*

> _Usa *!farm* para cosechar._`);
      }

      if (!args[0]) {
        const opciones = CROPS.map((c, i) => `\`${i + 1}.\` ${c.name}\n\`   ⏱️ ${c.time}h | 💰 ${c.min}-${c.max} | ✨ +${c.xp} XP\``).join("\n\n");
        return reply(`\`🌾 GRANJA\`

\`📜 ELIGE QUÉ PLANTAR ›\`

${opciones}

> _Uso: *!farm <número>*_`);
      }

      const choice = parseInt(args[0]) - 1;
      if (isNaN(choice) || choice < 0 || choice >= CROPS.length) {
        return reply(`\`🌾 GRANJA\`

\`✘ ERROR ›\` Opción inválida.

> _Usa *!farm* para ver las opciones._`);
      }

      const crop = CROPS[choice];
      const harvestTime = now + crop.time * 3600 * 1000;
      db.updateUser(senderRaw, (u) => { u.farm = { planted: true, crop: crop.name, harvestTime }; });

      const texto = `\`🌾 GRANJA\`

\`🌱 PLANTASTE ›\` ${crop.name}
\`⏱️ COSECHA EN ›\` *${crop.time}h*
\`💰 GANANCIA ESTIMADA ›\` *${crop.min}-${crop.max}* monedas

> _Usa *!farm* en ${crop.time}h para cosechar._`;

      await reply(texto);
    },
  },
];
