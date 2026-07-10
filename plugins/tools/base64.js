export default [
  {
    command: ["base64", "b64encode", "encodeb64"],
    description: "Codifica o decodifica texto en Base64. Ej: !base64 encode Hola",
    async execute({ reply, args }) {
      if (args.length < 2)
        return reply("❌ Uso: `!base64 <encode|decode> <texto>`");

      const [modo, ...resto] = args;
      const texto = resto.join(" ");

      let resultado;
      try {
        if (modo === "encode") {
          resultado = Buffer.from(texto).toString("base64");
        } else if (modo === "decode") {
          resultado = Buffer.from(texto, "base64").toString("utf-8");
        } else {
          return reply("❌ Modo inválido. Usa `encode` o `decode`.");
        }
      } catch {
        return reply("❌ No se pudo procesar el texto.");
      }

      const text = `
🔤 *ASTA — Base64*
› Modo: *${modo}*
› Entrada: *${texto}*
› Resultado: *${resultado}*
`.trim();
      await reply(text);
    },
  },
];
