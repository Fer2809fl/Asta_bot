export default [
  {
    command: ["random", "aleatorio", "randnum"],
    description: "Genera un número aleatorio. Ej: !random / !random 1 100",
    async execute({ reply, args }) {
      const min = parseInt(args[0]) || 1;
      const max = parseInt(args[1]) || 6;

      if (min >= max) return reply("❌ El mínimo debe ser menor que el máximo.");

      const resultado = Math.floor(Math.random() * (max - min + 1)) + min;

      const text = `
🎲 *ASTA — Número Aleatorio*
› Rango: *${min} – ${max}*
› Resultado: *${resultado}*
`.trim();
      await reply(text);
    },
  },
];
