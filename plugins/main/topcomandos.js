export default [
  {
    command: ["topcomandos", "topcomandosall"],
    description: "Muestra el top y toda la lista de comandos con sus ejecuciones.",
    async execute({ reply, sock }) {
      const stats = global.commandStats || {};
      const entries = Object.entries(stats)
        .sort((a, b) =>
          (Number(b[1]) || 0) - (Number(a[1]) || 0) ||
          a[0].localeCompare(b[0])
        );

      const total = entries.reduce(
        (sum, [, count]) => sum + (Number(count) || 0),
        0
      );

      const botname = sock.botname || global.botname || "Asta Bot";
      const rawPrefix = sock.prefix || global.prefix || ".";
      const prefix = Array.isArray(rawPrefix) ? (rawPrefix[0] || ".") : rawPrefix;

      if (!entries.length) {
        return reply(
`╔══════════════════════════════╗
║      📊 *TOP COMANDOS*       ║
╠══════════════════════════════╣
║ 🤖 *Bot:* ${botname}
║ 📈 *Total:* 0 ejecuciones
║ 🧩 *Comandos:* 0
╚══════════════════════════════╝

> Todavía no hay ejecuciones registradas.`
        );
      }

      const lines = entries.map(([name, count], i) =>
        `║ ${String(i + 1).padStart(3, " ")}. ${prefix}${name} — *${Number(count) || 0}* veces`
      );

      const header =
`╔══════════════════════════════╗
║      📊 *TOP COMANDOS*       ║
╠══════════════════════════════╣
║ 🤖 *Bot:* ${botname}
║ 📈 *Total:* ${total} ejecuciones
║ 🧩 *Comandos:* ${entries.length}
╠══════════════════════════════╣
`;

      const footer =
`╚══════════════════════════════╝
> *Número = veces ejecutado*
> Usa *${prefix}topcomandos* para actualizar.`;

      const chunks = [];
      let current = header;

      for (const line of lines) {
        if ((current + line + "\n" + footer).length > 3800) {
          chunks.push(current + "╚══════════════════════════════╝");
          current = header;
        }
        current += line + "\n";
      }

      chunks.push(current + footer);

      for (const chunk of chunks) {
        await reply(chunk);
      }
    }
  }
];
