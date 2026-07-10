export default [
  {
    command: ["contar", "chars", "length"],
    description: "Cuenta caracteres, palabras y líneas de un texto.",
    async execute({ reply, args, msg }) {
      const texto =
        msg?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.conversation ||
        args.join(" ");

      if (!texto)
        return reply("❌ Escribe un texto o responde a un mensaje.\nEjemplo: `!contar Hola mundo`");

      const chars = texto.length;
      const palabras = texto.trim().split(/\s+/).filter(Boolean).length;
      const lineas = texto.split("\n").length;
      const sinEspacios = texto.replace(/\s/g, "").length;

      const text = `
📊 *ASTA — Contador de Texto*
› Caracteres (total): *${chars}*
› Caracteres (sin espacios): *${sinEspacios}*
› Palabras: *${palabras}*
› Líneas: *${lineas}*
`.trim();
      await reply(text);
    },
  },
];
