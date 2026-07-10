function safeEval(expr) {
  const sanitized = expr.replace(/[^0-9+\-*/.%() ]/g, "");
  if (!sanitized) throw new Error("Expresión inválida");
  return Function(`"use strict"; return (${sanitized})`)();
}

export default [
  {
    command: ["calc", "calcular", "math"],
    description: "Evalúa una expresión matemática. Ej: !calc 25 * 4 + 10",
    async execute({ reply, args }) {
      if (!args.length)
        return reply("❌ Uso: `!calc <expresión>`\nEjemplo: `!calc 100 / 4 * 3`");

      const expr = args.join(" ");
      let resultado;
      try {
        resultado = safeEval(expr);
      } catch {
        return reply(`❌ Expresión inválida: *${expr}*`);
      }

      const text = `
🧮 *ASTA — Calculadora*
› Expresión: *${expr}*
› Resultado: *${resultado}*
`.trim();
      await reply(text);
    },
  },
];
