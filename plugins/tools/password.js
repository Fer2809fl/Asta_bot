export default [
  {
    command: ["password", "contraseña", "genpass"],
    description: "Genera una contraseña segura aleatoria. Ej: !password 16",
    async execute({ reply, args }) {
      const longitud = Math.min(Math.max(parseInt(args[0]) || 16, 8), 64);
      const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}";
      let pass = "";
      for (let i = 0; i < longitud; i++) {
        pass += chars[Math.floor(Math.random() * chars.length)];
      }

      const text = `
🔐 *ASTA — Generador de Contraseña*
› Longitud: *${longitud} caracteres*
› Contraseña: *${pass}*
⚠️ _No compartas esta contraseña con nadie._
`.trim();
      await reply(text);
    },
  },
];
