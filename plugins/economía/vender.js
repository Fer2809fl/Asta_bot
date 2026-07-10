import { db } from "../../src/database.js";

// Cada ítem sabe a qué categoría del usuario pertenece (minerals, fish, madera)
const ITEMS = {
  carbon: { price: 10, name: "🪨 Carbón", cat: "minerals" },
  hierro: { price: 20, name: "🔩 Hierro", cat: "minerals" },
  cobre: { price: 35, name: "🔌 Cobre", cat: "minerals" },
  oro: { price: 80, name: "🪙 Oro", cat: "minerals" },
  diamante: { price: 250, name: "💎 Diamante", cat: "minerals" },

  comun: { price: 8, name: "🐟 Común", cat: "fish" },
  raro: { price: 25, name: "🐠 Raro", cat: "fish" },
  epico: { price: 70, name: "🦑 Épico", cat: "fish" },
  legendario: { price: 200, name: "🧜‍♂️ Legendario", cat: "fish" },

  pino: { price: 6, name: "🌲 Pino", cat: "madera" },
  roble: { price: 15, name: "🪵 Roble", cat: "madera" },
  caoba: { price: 40, name: "🟤 Caoba", cat: "madera" },
  ebano: { price: 120, name: "⬛ Ébano", cat: "madera" },
};

const DEFAULTS = {
  minerals: { carbon: 0, hierro: 0, cobre: 0, oro: 0, diamante: 0 },
  fish: { comun: 0, raro: 0, epico: 0, legendario: 0 },
  madera: { pino: 0, roble: 0, caoba: 0, ebano: 0 },
};

function getStock(user) {
  return {
    ...DEFAULTS.minerals, ...(user.minerals ?? {}),
    ...DEFAULTS.fish, ...(user.fish ?? {}),
    ...DEFAULTS.madera, ...(user.madera ?? {}),
  };
}

export default [
  {
    command: ["vender", "sell"],
    description: "💱 Vende tus minerales, peces o madera por monedas.",
    async execute({ senderRaw, args, reply }) {
      const user = db.getUser(senderRaw);
      const stock = getStock(user);

      if (!args[0]) {
        const lineas = Object.keys(ITEMS)
          .map((key) => `\`${ITEMS[key].name} ›\` *${stock[key] ?? 0}* — 💰 ${ITEMS[key].price} c/u`)
          .join("\n");

        return reply(`\`💱 VENDER\`

${lineas}

> _Uso: *!vender <item>* o *!vender todo*_
> _Ejemplo: *!vender oro*_`);
      }

      const item = args[0].toLowerCase();

      if (item === "todo" || item === "all") {
        let total = 0;
        const detalle = [];

        db.updateUser(senderRaw, (u) => {
          u.minerals ??= { ...DEFAULTS.minerals };
          u.fish ??= { ...DEFAULTS.fish };
          u.madera ??= { ...DEFAULTS.madera };

          for (const key of Object.keys(ITEMS)) {
            const { cat, price, name } = ITEMS[key];
            const cantidad = u[cat][key] ?? 0;
            if (cantidad > 0) {
              const ganancia = cantidad * price;
              total += ganancia;
              detalle.push(`\`${name} ›\` *${cantidad}* → 💰 ${ganancia}`);
              u[cat][key] = 0;
            }
          }
          u.coins = (u.coins ?? 100) + total;
        });

        if (total === 0) {
          return reply(`\`💱 VENDER\`\n\n\`✘ ERROR ›\` No tienes nada para vender.`);
        }

        return reply(`\`💱 ¡VENTA TOTAL EXITOSA!\`

${detalle.join("\n")}

\`💰 TOTAL ›\` *${total}* monedas`);
      }

      if (!ITEMS[item]) {
        return reply(`\`💱 VENDER\`\n\n\`✘ ERROR ›\` Ese ítem no existe.`);
      }

      const { cat, price, name } = ITEMS[item];
      const cantidadDisponible = stock[item] ?? 0;
      if (cantidadDisponible <= 0) {
        return reply(`\`💱 VENDER\`\n\n\`✘ ERROR ›\` No tienes ${name} para vender.`);
      }

      const cantidad = args[1] === "all" || !args[1] ? cantidadDisponible : Math.min(parseInt(args[1]) || 0, cantidadDisponible);
      if (isNaN(cantidad) || cantidad <= 0) {
        return reply(`\`💱 VENDER\`\n\n\`✘ ERROR ›\` Cantidad inválida.`);
      }

      const ganancia = cantidad * price;

      db.updateUser(senderRaw, (u) => {
        u[cat] ??= { ...DEFAULTS[cat] };
        u[cat][item] -= cantidad;
        u.coins = (u.coins ?? 100) + ganancia;
      });

      const texto = `\`💱 ¡VENTA EXITOSA!\`

\`📦 VENDISTE ›\` ${name} x*${cantidad}*
\`💰 GANADO ›\` *${ganancia}* monedas`;

      await reply(texto);
    },
  },
];
