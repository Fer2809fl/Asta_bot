import { gacha } from "../../src/gacha.js";
import { db } from "../../src/database.js";

export default [
  {
    command: ["sellwaifu", "sw", "venderwaifu"],
    category: "gacha",
    description: "Vende un personaje de tu harem por monedas. Uso: .sw <ID>",
    async execute({ senderRaw, args, reply }) {
      const id = parseInt(args[0]);

      if (!id) {
        return reply("❓ Indica el ID del personaje. Ej: *.sw 42*\nUsa *.harem* para ver tus IDs.");
      }

      const owns = await gacha.userOwnsCharacter(senderRaw, id);
      if (!owns) {
        return reply("⚠️ No tienes ese personaje en tu harem.");
      }

      const char = await gacha.searchCharacter(String(id));
      if (!char) {
        return reply("❌ Personaje no encontrado.");
      }

      const ganancia = Math.floor(char.value * 0.6);

      await gacha.removeCharacter(senderRaw, id);

      // FIX: usar updateUser() como hace daily.js en lugar de addCoins()
      db.updateUser(senderRaw, (u) => {
        u.coins = (u.coins ?? 0) + ganancia;
      });

      await reply(
        `💸 Vendiste a *${char.name}*.\n` +
        `📖 Serie: ${char.series}\n` +
        `💴 Recibiste: *${ganancia.toLocaleString()} monedas* (60% del valor)`
      );
    },
  },
];
