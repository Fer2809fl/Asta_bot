export default [
  {
    command: ["timer", "temporizador", "countdown"],
    description: "Inicia una cuenta regresiva. Ej: !timer 30s / !timer 5m",
    async execute({ reply, args }) {
      if (!args.length)
        return reply("❌ Uso: `!timer <tiempo>`\nEjemplos: `!timer 30s`, `!timer 5m`, `!timer 1h`");

      const input = args[0].toLowerCase();
      const match = input.match(/^(\d+)(s|m|h)$/);
      if (!match) return reply("❌ Formato inválido. Usa `30s`, `5m` o `1h`.");

      const [, num, unidad] = match;
      const ms = { s: 1000, m: 60_000, h: 3_600_000 }[unidad] * parseInt(num);

      if (ms > 3_600_000) return reply("❌ Máximo 1 hora por temporizador.");

      await reply(`⏱️ Temporizador iniciado: *${num}${unidad}*. Te avisaré cuando termine.`);
      setTimeout(async () => {
        await reply(`✅ *¡Tiempo!* Tu temporizador de *${num}${unidad}* terminó.`);
      }, ms);
    },
  },
];
