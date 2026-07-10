import { gacha } from "../../src/gacha.js";

export default [
  {
    command: ["buscar", "search", "waifu"],
    category: "gacha",
    description: "Busca un personaje en tu harem por nombre o ID.",
    async execute({ senderRaw, args, reply }) {
      const query = args.join(" ").trim();

      if (!query) {
        return reply("❓ Escribe un nombre o ID. Ej: *.buscar rem*");
      }

      const chars = await gacha.getUserCharacters(senderRaw);
      const q = query.toLowerCase();

      const results = chars.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.series.toLowerCase().includes(q) ||
        String(c.id) === q
      );

      if (results.length === 0) {
        return reply(`❌ No encontré *${query}* en tu harem.`);
      }

      const lines = results.slice(0, 10).map(c => {
        const g = c.gender === "Masculino" ? "♂" : "♀";
        return `${g} *${c.name}* — ${c.series}\n   💴 ${c.value.toLocaleString()} ¥ · ID: ${c.id}`;
      });

      const extra = results.length > 10 ? `\n...y ${results.length - 10} más` : "";

      await reply(`🔍 *Resultados para "${query}":*\n\n${lines.join("\n\n")}${extra}`);
    },
  },
];
