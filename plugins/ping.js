export default [
  {
    command: ["ping", "status"],
    description: "Muestra el ping del bot.",
    async execute({ sock, reply }) {
      const start = Date.now();
      await sock.sendPresenceUpdate("available");
      const ping = Date.now() - start;

      await reply(`🏓 *Ping:* ${ping} ms`);
    },
  },
];
