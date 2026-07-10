const conversiones = {
  // Longitud
  "km-mi": (v) => v * 0.621371,
  "mi-km": (v) => v * 1.60934,
  "m-ft":  (v) => v * 3.28084,
  "ft-m":  (v) => v / 3.28084,
  "cm-in": (v) => v / 2.54,
  "in-cm": (v) => v * 2.54,
  // Peso
  "kg-lb": (v) => v * 2.20462,
  "lb-kg": (v) => v / 2.20462,
  "g-oz":  (v) => v / 28.3495,
  "oz-g":  (v) => v * 28.3495,
  // Volumen
  "l-gal":  (v) => v * 0.264172,
  "gal-l":  (v) => v / 0.264172,
  // Temperatura
  "c-f": (v) => v * 9 / 5 + 32,
  "f-c": (v) => (v - 32) * 5 / 9,
  "c-k": (v) => v + 273.15,
  "k-c": (v) => v - 273.15,
  "f-k": (v) => (v - 32) * 5 / 9 + 273.15,
  "k-f": (v) => (v - 273.15) * 9 / 5 + 32,
};

export default [
  {
    command: ["unidad", "convertiruni", "uni"],
    description: "Convierte unidades comunes. Ej: !unidad 10 km mi",
    async execute({ reply, args }) {
      if (args.length < 3)
        return reply(
          "❌ Uso: `!unidad <valor> <de> <a>`\n" +
          "Unidades: km, mi, m, ft, cm, in, kg, lb, g, oz, l, gal, c, f, k"
        );

      const [valorRaw, de, a] = args;
      const valor = parseFloat(valorRaw);
      if (isNaN(valor)) return reply("❌ El valor debe ser un número.");

      const clave = `${de.toLowerCase()}-${a.toLowerCase()}`;
      const fn = conversiones[clave];
      if (!fn)
        return reply(`❌ Conversión *${de} → ${a}* no soportada.\nRevisa las unidades con \`!unidad\``);

      const resultado = fn(valor).toFixed(4).replace(/\.?0+$/, "");

      const text = `
📐 *ASTA — Conversor de Unidades*
› *${valor} ${de.toUpperCase()}* =
› *${resultado} ${a.toUpperCase()}*
`.trim();
      await reply(text);
    },
  },
];
