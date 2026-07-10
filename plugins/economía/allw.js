import { db } from "../../src/database.js";

const COOLDOWN = 24 * 60 * 60 * 1000; // 24h

// ---------- Mismos datos que usan los comandos individuales ----------

const JOBS = [
  { text: "Repartiste pedidos de comida.", min: 40, max: 150, xp: 8 },
  { text: "Programaste una app para un cliente.", min: 100, max: 350, xp: 18 },
  { text: "Diste clases particulares.", min: 60, max: 200, xp: 12 },
  { text: "Trabajaste como mesero/a en un restaurante.", min: 30, max: 120, xp: 6 },
  { text: "Reparaste una computadora.", min: 80, max: 250, xp: 15 },
  { text: "Hiciste un turno de taxi.", min: 50, max: 180, xp: 10 },
  { text: "Vendiste artesanías en el mercado.", min: 20, max: 90, xp: 5 },
  { text: "Grabaste un video viral.", min: 150, max: 500, xp: 25 },
];

const ANIMALS = [
  { name: "🐰 Conejo", chance: 0.35, minCoins: 30, maxCoins: 100, xp: 8 },
  { name: "🦌 Ciervo", chance: 0.22, minCoins: 80, maxCoins: 250, xp: 15 },
  { name: "🦊 Zorro", chance: 0.15, minCoins: 120, maxCoins: 350, xp: 20 },
  { name: "🐺 Lobo", chance: 0.12, minCoins: 150, maxCoins: 450, xp: 25 },
  { name: "🐻 Oso", chance: 0.08, minCoins: 250, maxCoins: 700, xp: 35 },
  { name: "🐉 Dragón", chance: 0.03, minCoins: 800, maxCoins: 2500, xp: 80 },
  { name: "💨 Nada", chance: 0.05, minCoins: 0, maxCoins: 0, xp: 3 },
];

const MINERALS = [
  { key: "carbon", name: "🪨 Carbón", chance: 0.4, xp: 5 },
  { key: "hierro", name: "🔩 Hierro", chance: 0.28, xp: 8 },
  { key: "cobre", name: "🔌 Cobre", chance: 0.18, xp: 10 },
  { key: "oro", name: "🪙 Oro", chance: 0.1, xp: 20 },
  { key: "diamante", name: "💎 Diamante", chance: 0.04, xp: 50 },
];

const FISH = [
  { key: "comun", name: "🐟 Común", chance: 0.5, xp: 4 },
  { key: "raro", name: "🐠 Raro", chance: 0.3, xp: 10 },
  { key: "epico", name: "🦑 Épico", chance: 0.15, xp: 25 },
  { key: "legendario", name: "🧜‍♂️ Legendario", chance: 0.05, xp: 60 },
];

const FINDS = [
  { emoji: "🪨", text: "Solo encontraste piedras...", min: 5, max: 20, xp: 2 },
  { emoji: "🥫", text: "¡Una lata antigua!", min: 15, max: 50, xp: 5 },
  { emoji: "🔑", text: "¡Una llave misteriosa!", min: 30, max: 100, xp: 8 },
  { emoji: "💍", text: "¡Un anillo de oro!", min: 100, max: 300, xp: 15 },
  { emoji: "🏺", text: "¡Una urna antigua!", min: 200, max: 600, xp: 25 },
  { emoji: "👑", text: "¡Una corona real!", min: 500, max: 1500, xp: 60 },
  { emoji: "💎", text: "¡DIAMANTE GIGANTE!", min: 1000, max: 3000, xp: 80 },
];

const WOODS = [
  { name: "pino", chance: 0.5, xp: 8 },
  { name: "roble", chance: 0.28, xp: 14 },
  { name: "caoba", chance: 0.15, xp: 22 },
  { name: "ebano", chance: 0.07, xp: 35 },
];

const EVENTS = [
  { text: "Encontraste un cofre abandonado entre los arbustos.", coins: [80, 200], xp: 20 },
  { text: "Cruzaste un río y hallaste monedas antiguas en la orilla.", coins: [50, 150], xp: 15 },
  { text: "Te topaste con un mercader ambulante que te dio una propina.", coins: [30, 100], xp: 10 },
  { text: "Descubriste una cueva pequeña con vetas de mineral.", coins: [20, 60], xp: 18, find: { type: "minerals", options: ["carbon", "hierro"] } },
  { text: "Encontraste un árbol caído lleno de madera aprovechable.", coins: [10, 40], xp: 16, find: { type: "madera", options: ["pino", "roble"] } },
  { text: "Hallaste un estanque escondido con peces saltando.", coins: [10, 40], xp: 16, find: { type: "fish", options: ["comun", "raro"] } },
  { text: "Exploraste unas ruinas viejas sin encontrar gran cosa, pero aprendiste algo.", coins: [5, 25], xp: 25 },
  { text: "Te perdiste un rato, pero al final encontraste el camino de regreso.", coins: [0, 15], xp: 8 },
  { text: "Una tormenta repentina te obligó a refugiarte, perdiste tiempo pero no recursos.", coins: [0, 10], xp: 5 },
  { text: "Encontraste una vieja mochila con algo de dinero adentro.", coins: [100, 280], xp: 22 },
];

const BEG_SCENARIOS = [
  { text: "Un anciano generoso te dio unas monedas.", min: 30, max: 120, xp: 8 },
  { text: "Un turista extranjero te regaló algo.", min: 50, max: 200, xp: 12 },
  { text: "Un empresario te dio propina.", min: 100, max: 400, xp: 18 },
  { text: "Un niño te compartió su dinero del almuerzo.", min: 20, max: 80, xp: 5 },
  { text: "Nadie te hizo caso hoy...", min: 10, max: 30, xp: 3 },
  { text: "¡Un youtuber te donó en directo!", min: 200, max: 800, xp: 25 },
  { text: "Un perro callejero te guió a un tesoro.", min: 80, max: 300, xp: 15 },
  { text: "¡Una celebridad te reconoció!", min: 300, max: 1000, xp: 35 },
  { text: "Encontraste monedas en una fuente.", min: 40, max: 150, xp: 10 },
];

const CRIMES = [
  "Robaste un banco exitosamente.",
  "Hackeaste una cuenta bancaria corporativa.",
  "Vendiste información secreta al mejor postor.",
  "Secuestraste un camión de valores blindado.",
  "Estafaste a un millonario en línea.",
  "Saqueaste una tienda de lujo.",
  "Interceptaste un envío de diamantes.",
];

const CRIME_FAILS = [
  "¡Te atrapó la policía!",
  "¡Activaste una alarma silenciosa!",
  "¡Un testigo te identificó en cámara!",
  "¡Te traicionó tu cómplice!",
  "¡La puerta estaba cerrada con llave!",
  "¡Un perro guardián te mordió!",
];

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickWeighted(list) {
  const roll = Math.random();
  let acc = 0;
  for (const item of list) {
    acc += item.chance;
    if (roll <= acc) return item;
  }
  return list[list.length - 1];
}

export default [
  {
    command: ["allw", "workall", "trabajartodo"],
    description: "💪 Ejecuta todas tus actividades de ganancia en un solo golpe (1 vez cada 24h).",
    async execute({ senderRaw, reply }) {
      const user = db.getUser(senderRaw);
      const now = Date.now();

      if (now - (user.cooldowns?.allw ?? 0) < COOLDOWN) {
        const remaining = COOLDOWN - (now - user.cooldowns.allw);
        const hours = Math.floor(remaining / 3600000);
        const minutes = Math.floor((remaining % 3600000) / 60000);
        return reply(`\`💪 ALL WORK\`

\`✘ ERROR ›\` Ya usaste todas tus actividades hoy.
\`⏱️ VUELVE EN ›\` *${hours}h ${minutes}m*`);
      }

      let totalCoins = 0;
      let totalXp = 0;
      const lines = [];

      // 💼 Trabajar
      const job = JOBS[Math.floor(Math.random() * JOBS.length)];
      const jobReward = randInt(job.min, job.max);
      totalCoins += jobReward;
      totalXp += job.xp;
      lines.push(`\`💼 TRABAJAR ›\` ${job.text}\n\`   💰 ›\` *+${jobReward}* monedas`);

      // 🏹 Cazar
      const animal = pickWeighted(ANIMALS);
      const huntSuccess = animal.name !== "💨 Nada";
      const huntReward = huntSuccess ? randInt(animal.minCoins, animal.maxCoins) : 0;
      totalCoins += huntReward;
      totalXp += animal.xp;
      lines.push(`\`🏹 CAZAR ›\` ${animal.name}${huntSuccess ? `\n\`   💰 ›\` *+${huntReward}* monedas` : ""}`);

      // ⛏️ Minar
      const mineral = pickWeighted(MINERALS);
      const mineralAmount = randInt(1, 3);
      totalXp += mineral.xp;
      lines.push(`\`⛏️ MINAR ›\` ${mineral.name} x*${mineralAmount}*`);

      // 🎣 Pescar
      const fish = pickWeighted(FISH);
      const fishAmount = randInt(1, 3);
      totalXp += fish.xp;
      lines.push(`\`🎣 PESCAR ›\` ${fish.name} x*${fishAmount}*`);

      // ⛏️ Excavar
      const find = FINDS[Math.floor(Math.random() * FINDS.length)];
      const digReward = randInt(find.min, find.max);
      totalCoins += digReward;
      totalXp += find.xp;
      lines.push(`\`⛏️ EXCAVAR ›\` ${find.emoji} ${find.text}\n\`   💰 ›\` *+${digReward}* monedas`);

      // 🪓 Talar
      const wood = pickWeighted(WOODS);
      const woodAmount = randInt(1, 3);
      totalXp += wood.xp;
      lines.push(`\`🪓 TALAR ›\` *${woodAmount}x ${wood.name}*`);

      // 🧭 Explorar
      const event = EVENTS[Math.floor(Math.random() * EVENTS.length)];
      const eventReward = randInt(...event.coins);
      totalCoins += eventReward;
      totalXp += event.xp;
      let exploreFind = null;
      if (event.find) {
        exploreFind = event.find.options[Math.floor(Math.random() * event.find.options.length)];
      }
      lines.push(`\`🧭 EXPLORAR ›\` ${event.text}${eventReward > 0 ? `\n\`   💰 ›\` *+${eventReward}* monedas` : ""}`);

      // 🙏 Mendigar
      const scenario = BEG_SCENARIOS[Math.floor(Math.random() * BEG_SCENARIOS.length)];
      const begReward = randInt(scenario.min, scenario.max);
      totalCoins += begReward;
      totalXp += scenario.xp;
      lines.push(`\`🙏 MENDIGAR ›\` ${scenario.text}\n\`   💰 ›\` *+${begReward}* monedas`);

      // 🦹 Crimen
      const crimeSuccess = Math.random() < 0.5;
      let crimeText = "";
      let crimeFine = 0;
      if (crimeSuccess) {
        const crimeReward = randInt(200, 1000);
        totalCoins += crimeReward;
        totalXp += 35;
        const crime = CRIMES[Math.floor(Math.random() * CRIMES.length)];
        crimeText = `\`🦹 CRIMEN ›\` ${crime}\n\`   💰 ›\` *+${crimeReward}* monedas`;
      } else {
        crimeFine = Math.min(user.coins ?? 100, randInt(80, 300));
        totalCoins -= crimeFine;
        const fail = CRIME_FAILS[Math.floor(Math.random() * CRIME_FAILS.length)];
        crimeText = `\`🚔 CRIMEN ›\` ${fail}\n\`   💸 ›\` *-${crimeFine}* monedas`;
      }
      lines.push(crimeText);

      // ---------- Guardar todo en una sola actualización ----------
      db.updateUser(senderRaw, (u) => {
        u.coins = Math.max(0, (u.coins ?? 100) + totalCoins);
        u.cooldowns ??= {};
        u.cooldowns.allw = now;

        if (huntSuccess) {
          u.hunts ??= {};
          u.hunts[animal.name] = (u.hunts[animal.name] ?? 0) + 1;
        }

        u.minerals ??= { carbon: 0, hierro: 0, cobre: 0, oro: 0, diamante: 0 };
        u.minerals[mineral.key] = (u.minerals[mineral.key] ?? 0) + mineralAmount;

        u.fish ??= { comun: 0, raro: 0, epico: 0, legendario: 0 };
        u.fish[fish.key] = (u.fish[fish.key] ?? 0) + fishAmount;

        u.digs ??= {};
        u.digs[find.emoji] = (u.digs[find.emoji] ?? 0) + 1;

        u.madera ??= { pino: 0, roble: 0, caoba: 0, ebano: 0 };
        u.madera[wood.name] = (u.madera[wood.name] ?? 0) + woodAmount;

        if (exploreFind) {
          if (event.find.type === "minerals") {
            u.minerals[exploreFind] = (u.minerals[exploreFind] ?? 0) + 1;
          } else if (event.find.type === "madera") {
            u.madera[exploreFind] = (u.madera[exploreFind] ?? 0) + 1;
          } else if (event.find.type === "fish") {
            u.fish[exploreFind] = (u.fish[exploreFind] ?? 0) + 1;
          }
        }
      });

      if (db.checkMissionProgress) {
        db.checkMissionProgress(senderRaw, "cazar", 1);
        db.checkMissionProgress(senderRaw, "minar", 1);
        db.checkMissionProgress(senderRaw, "pescar", 1);
        db.checkMissionProgress(senderRaw, "trabajar", 1);
      }

      const { leveledUp, newLevel } = db.addXp(senderRaw, totalXp);

      const texto = `\`💪 ALL WORK — RESUMEN\`

${lines.join("\n\n")}

\`💰 TOTAL GANADO ›\` *${totalCoins}* monedas
\`✨ XP TOTAL ›\` *+${totalXp}*${leveledUp ? `\n\n\`⭐ SUBISTE AL NIVEL ${newLevel}\`` : ""}

> _Usa *!allw* de nuevo en 24h._`;

      await reply(texto);
    },
  },
];