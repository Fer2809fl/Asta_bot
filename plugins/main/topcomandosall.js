export default [
  {
    command: ["topcomandosall"],
    description: "Muestra todos los comandos y cuántas veces se han ejecutado.",
    async execute({ reply, sock }) {
      const stats = global.commandStats || {};
      const entries = Object.entries(stats)
        .sort((a, b) => (Number(b[1]) || 0) - (Number(a[1]) || 0) || a[0].localeCompare(b[0]));

      const total = entries.reduce((sum, [, count]) => sum + (Number(count) || 0), 0);
      const botname = sock.botname || global.botname || "Asta Bot";
      const prefix = Array.isArray(sock.prefix || global.prefix)
        ? (sock.prefix || global.prefix)[0]
        : (sock.prefix || global.prefix || ".");

      if (!entries.length) {
        return reply(
          `╔═══〔 📊 TOP COMANDOS 〕═══╗
║ 🤖 *Bot:* ${botname}
║ 📈 *Ejecuciones:* 0
╚══════════════════════════╝

> Todavía no hay comandos registrados.`
        );
      }

      const lines = entries.map(([name, count], i) =>
        `║ ${String(i + 1).padStart(3, " ")}. ${prefix}${name} — *${Number(count) || 0}* veces`
      );

      const chunks = [];
      const header = `╔══════════════════════════════╗
║      📊 *TOP COMANDOS ALL*      ║
╠══════════════════════════════╣
║ 🤖 *Bot:* ${botname}
║ 📈 *Total:* ${total} ejecuciones
║ 🧩 *Comandos:* ${entries.length}
╠══════════════════════════════╣
`;
      const footer = `╚══════════════════════════════╝
> *Número = veces ejecutado*
> Usa *${prefix}topcomandosall* para actualizar la lista.`;

      let current = header;
      for (const line of lines) {
        if ((current + line + "\n" + footer).length > 3800) {
          chunks.push(current + "╚══════════════════════════════╝");
          current = "╔══════════════════════════════╗\n";
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
