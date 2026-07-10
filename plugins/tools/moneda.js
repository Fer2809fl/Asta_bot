async function fetchMoneda(cantidad, de, a) {
  const res = await fetch(
    `https://api.frankfurter.app/latest?amount=${cantidad}&from=${de.toUpperCase()}&to=${a.toUpperCase()}`
  );
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.rates[a.toUpperCase()];
}

export default [
  {
    command: ["moneda", "currency", "convertir"],
    description: "Convierte entre monedas. Ej: !moneda 100 USD MXN",
    async execute({ reply, args }) {
      if (args.length < 3)
        return reply("❌ Uso: `!moneda <cantidad> <DE> <A>`\nEjemplo: `!moneda 100 USD MXN`");

      const [cantidad, de, a] = args;
      if (isNaN(cantidad)) return reply("❌ La cantidad debe ser un número.");

      let resultado;
      try {
        resultado = await fetchMoneda(cantidad, de, a);
      } catch (e) {
        return reply(`❌ ${e.message}\nVerifica los códigos de moneda (USD, MXN, EUR...)`);
      }

      const text = `
💱 *ASTA — Conversor de Monedas*
› *${cantidad} ${de.toUpperCase()}* =
› *${resultado} ${a.toUpperCase()}*
`.trim();
      await reply(text);
    },
  },
];
