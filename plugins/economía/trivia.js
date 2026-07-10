import { db } from "../../src/database.js";

const TRIVIA_TIMEOUT = 3 * 60 * 1000; // 3 min para responder antes de que expire
const COOLDOWN = 5 * 60 * 1000;

const QUESTIONS = [
  { q: "¿Cuál es el planeta más grande del sistema solar?", a: ["jupiter"] },
  { q: "¿Cuántos continentes hay en el mundo?", a: ["7", "siete"] },
  { q: "¿En qué país se encuentra la Torre Eiffel?", a: ["francia"] },
  { q: "¿Cuál es el océano más grande del mundo?", a: ["pacifico"] },
  { q: "¿Cuántos lados tiene un hexágono?", a: ["6", "seis"] },
  { q: "¿Cuál es el idioma más hablado del mundo?", a: ["chino", "mandarin"] },
  { q: "¿En qué año llegó el hombre a la luna?", a: ["1969"] },
  { q: "¿Cuál es el metal líquido a temperatura ambiente?", a: ["mercurio"] },
  { q: "¿Cuántos huesos tiene el cuerpo humano adulto?", a: ["206"] },
  { q: "¿Qué animal es el más grande del mundo?", a: ["ballena azul", "ballena"] },
  { q: "¿Cuál es la capital de Japón?", a: ["tokio", "tokyo"] },
  { q: "¿Cuántos jugadores tiene un equipo de fútbol en cancha?", a: ["11", "once"] },
  { q: "¿Qué gas respiramos principalmente para vivir?", a: ["oxigeno"] },
  { q: "¿Cuál es el río más largo del mundo?", a: ["nilo", "amazonas"] },
  { q: "¿Cuántos colores tiene el arcoíris?", a: ["7", "siete"] },
  { q: "¿En qué continente está Egipto?", a: ["africa"] },
  { q: "¿Cuál es el hueso más largo del cuerpo humano?", a: ["femur"] },
  { q: "¿Qué instrumento se usa para ver las estrellas?", a: ["telescopio"] },
  { q: "¿Cuántas patas tiene una araña?", a: ["8", "ocho"] },
  { q: "¿Cuál es la moneda oficial de Japón?", a: ["yen"] },
];

function normalize(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quita tildes
    .replace(/[^a-z0-9\s]/g, "")     // quita signos de puntuación
    .trim();
}

export default [
  {
    command: ["trivia", "pregunta"],
    description: "🧠 Responde trivia y gana monedas.",
    async execute({ senderRaw, args, reply }) {
      const user = db.getUser(senderRaw);
      const now = Date.now();

      // Si hay una pregunta activa pero ya expiró, se limpia y aplica cooldown normal
      if (user.triviaActive && now - (user.triviaActive.startedAt ?? 0) > TRIVIA_TIMEOUT) {
        db.updateUser(senderRaw, (u) => {
          u.triviaActive = null;
          u.cooldowns ??= {};
          u.cooldowns.trivia = now;
        });
        user.triviaActive = null;
      }

      if (!user.triviaActive && now - (user.cooldowns?.trivia ?? 0) < COOLDOWN) {
        const remaining = COOLDOWN - (now - user.cooldowns.trivia);
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        return reply(`\`🧠 TRIVIA\`

\`⏱️ ESPERA ›\` *${minutes}m ${seconds}s* para la siguiente pregunta.`);
      }

      if (!user.triviaActive) {
        const question = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
        db.updateUser(senderRaw, (u) => {
          u.triviaActive = { ...question, startedAt: now };
        });

        return reply(`\`🧠 TRIVIA\`

\`❓ PREGUNTA ›\` ${question.q}
\`⏱️ TIEMPO ›\` *3 minutos*

> _Responde con *!trivia <respuesta>*_`);
      }

      if (!args[0]) {
        return reply(`\`🧠 TRIVIA\`

\`❓ PREGUNTA ›\` ${user.triviaActive.q}

> _Responde con *!trivia <respuesta>*_`);
      }

      const answer = normalize(args.join(" "));
      const correct = user.triviaActive.a.some((a) => normalize(a) === answer);

      db.updateUser(senderRaw, (u) => {
        u.triviaActive = null;
        u.cooldowns ??= {};
        u.cooldowns.trivia = now;
      });

      if (correct) {
        const reward = Math.floor(Math.random() * (250 - 100 + 1)) + 100;
        db.updateUser(senderRaw, (u) => { u.coins = (u.coins ?? 100) + reward; });
        const { leveledUp, newLevel } = db.addXp(senderRaw, 20);

        return reply(`\`🧠 ¡RESPUESTA CORRECTA! ✅\`

\`💰 GANADO ›\` *${reward}* monedas
\`✨ XP ›\` *+20*${leveledUp ? `\n\n\`⭐ SUBISTE AL NIVEL ${newLevel}\`` : ""}`);
      }

      const texto = `\`🧠 ¡RESPUESTA INCORRECTA! ❌\`

\`✘ ERROR ›\` No era la respuesta correcta.

> _Usa *!trivia* para intentar con una nueva pregunta._`;

      await reply(texto);
    },
  },
];
