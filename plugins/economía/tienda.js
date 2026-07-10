import { db } from "../../src/database.js";

const ITEMS = [
  { id: "titulo_rico", name: "👑 Título 'Rico'", price: 2000, desc: "Un título especial para tu perfil." },
  { id: "reduce_cooldown", name: "⏱️ Reductor de Cooldown", price: 1500, desc: "Reduce 50% el cooldown de trabajo por 24h." },
  { id: "doble_xp", name: "✨ Doble XP", price: 1800, desc: "Duplica la XP ganada por 24h." },
  { id: "seguro_robo", name: "🛡️ Seguro Anti-Robo", price: 1200, desc: "Protege tus monedas de robos por 24h." },
  { id: "suerte_extra", name: "🍀 Suerte Extra", price: 1000, desc: "Aumenta 10% tu probabilidad de éxito por 24h." },
];

export default [
  {
    command: ["tienda", "shop", "comprar"],
    description: "🛒 Compra mejoras y objetos con tus monedas.",
    async execute({ senderRaw, args, reply }) {
      const user = db.getUser(senderRaw);

      if (!args[0]) {
        const lineas = ITEMS.map((item, i) => `\`${i + 1}. ${item.name} ›\` *${item.price}* monedas\n\`   ${item.desc}\``).join("\n\n");

        return reply(`\`🛒 TIENDA\`

${lineas}

> _Uso: *!tienda <número>*_
> _Saldo: *${user.coins ?? 100}* monedas_`);
      }

      const choice = parseInt(args[0]) - 1;
      if (isNaN(choice) || choice < 0 || choice >= ITEMS.length) {
        return reply(`\`🛒 TIENDA\`

\`✘ ERROR ›\` Opción inválida.

> _Usa *!tienda* para ver los ítems disponibles._`);
      }

      const item = ITEMS[choice];
      if ((user.coins ?? 100) < item.price) {
        return reply(`\`🛒 SIN FONDOS\`

\`💰 TU SALDO ›\` *${user.coins ?? 100}* monedas
\`💰 NECESITAS ›\` *${item.price}* monedas`);
      }

      const now = Date.now();
      db.updateUser(senderRaw, (u) => {
        u.coins -= item.price;
        u.perks ??= {};
        u.perks[item.id] = now + 24 * 60 * 60 * 1000;
      });

      const texto = `\`🛒 ¡COMPRA EXITOSA!\`

\`📦 ADQUIRISTE ›\` ${item.name}
\`💰 PAGASTE ›\` *${item.price}* monedas

> _${item.desc}_`;

      await reply(texto);
    },
  },
];
