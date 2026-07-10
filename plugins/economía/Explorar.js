import { db } from "../../src/database.js";

const COOLDOWN = 35 * 60 * 1000; // 35 min

// Cada evento define su propia recompensa. "find" es opcional: agrega un recurso random.
const EVENTS = [
  {
    text: "Encontraste un cofre abandonado entre los arbustos.",
    coins: [80, 200], xp: 20,
  },
  {
    text: "Cruzaste un río y hallaste monedas antiguas en la orilla.",
    coins: [50, 150], xp: 15,
  },
  {
    text: "Te topaste con un mercader ambulante que te dio una propina.",
    coins: [30, 100], xp: 10,
  },
  {
    text: "Descubriste una cueva pequeña con vetas de mineral.",
    coins: [20, 60], xp: 18, find: { type: "minerals", options: ["carbon", "hierro"] },
  },
  {
    text: "Encontraste un árbol caído lleno de madera aprovechable.",
    coins: [10, 40], xp: 16, find: { type: "madera", options: ["pino", "roble"] },
  },
  {
    text: "Hallaste un estanque escondido con peces saltando.",
    coins: [10, 40], xp: 16, find: { type: "fish", options: ["comun", "raro"] },
  },
  {
    text: "Exploraste unas ruinas viejas sin encontrar gran cosa, pero aprendiste algo.",
    coins: [5, 25], xp: 25,
  },
  {
    text: "Te perdiste un rato, pero al final encontraste el camino de regreso.",
    coins: [0, 15], xp: 8,
  },
  {
    text: "Una tormenta repentina te obligó a refugiarte, perdiste tiempo pero no recursos.",
    coins: [0, 10], xp: 5,
  },
  {
    text: "Encontraste una vieja mochila con algo de dinero adentro.",
    coins: [100, 280], xp: 22,
  },
];

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default [
  {
    command: ["explorar", "explore", "exploracion"],
    description: "🧭 Explora el mundo y encuentra monedas, XP y recursos al azar.",
    async execute({ senderRaw, reply }) {
      const user = db.getUser(senderRaw);
      const now = Date.now();
      const cooldowns = user.cooldowns ?? {};

      if (now - (cooldowns.explorar ?? 0) < COOLDOWN) {
        const remaining = COOLDOWN - (now - cooldowns.explorar);
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        return reply(`\`🧭 EXPLORAR\`

\`✘ ERROR ›\` Todavía estás descansando del último viaje.
\`⏱️ VUELVE EN ›\` *${minutes}m ${seconds}s*`);
      }

      const event = EVENTS[Math.floor(Math.random() * EVENTS.length)];
      const reward = randInt(...event.coins);
      let hallazgoTexto = "";

      db.updateUser(senderRaw, (u) => {
        u.cooldowns ??= {};
        u.cooldowns.explorar = now;
        u.coins = (u.coins ?? 100) + reward;

        if (event.find) {
          const item = event.find.options[Math.floor(Math.random() * event.find.options.length)];
          const cantidad = randInt(1, 2);

          if (event.find.type === "minerals") {
            u.minerals ??= {};
            u.minerals[item] = (u.minerals[item] ?? 0) + cantidad;
            hallazgoTexto = `\n\`⛏️ ENCONTRASTE ›\` *${cantidad}x ${item}*`;
          } else if (event.find.type === "madera") {
            u.madera ??= { pino: 0, roble: 0, caoba: 0, ebano: 0 };
            u.madera[item] = (u.madera[item] ?? 0) + cantidad;
            hallazgoTexto = `\n\`🪵 ENCONTRASTE ›\` *${cantidad}x ${item}*`;
          } else if (event.find.type === "fish") {
            u.fish ??= {};
            u.fish[item] = (u.fish[item] ?? 0) + cantidad;
            hallazgoTexto = `\n\`🎣 ENCONTRASTE ›\` *${cantidad}x ${item}*`;
          }
        }
      });

      const { leveledUp, newLevel } = db.addXp(senderRaw, event.xp);

      const monedasTexto = reward > 0 ? `\`💰 GANADO ›\` *${reward}* monedas\n` : "";

      await reply(`\`🧭 EXPLORACIÓN\`

\`✦ ›\` ${event.text}

${monedasTexto}\`✨ XP ›\` *+${event.xp}*${hallazgoTexto}${leveledUp ? `\n\n\`⭐ SUBISTE AL NIVEL ${newLevel}\`` : ""}`);
    },
  },
];
