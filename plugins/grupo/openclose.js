export default [
  {
    command: ["open", "abrir"],
    description: "Abre el grupo para que todos puedan enviar mensajes.",
    adminOnly: true,
    botAdmin: true,
    async execute({ sock, remoteJid, reply }) {
      try {
        await sock.groupSettingUpdate(remoteJid, "not_announcement");
        await reply("✅ Grupo *abierto*. Todos pueden enviar mensajes.");
      } catch {
        await reply("❌ No pude abrir el grupo. Verifica que el bot sea admin.");
      }
    },
  },
  {
    command: ["close", "cerrar"],
    description: "Cierra el grupo para que solo admins puedan enviar mensajes.",
    adminOnly: true,
    botAdmin: true,
    async execute({ sock, remoteJid, reply }) {
      try {
        await sock.groupSettingUpdate(remoteJid, "announcement");
        await reply("🔒 Grupo *cerrado*. Solo admins pueden enviar mensajes.");
      } catch {
        await reply("❌ No pude cerrar el grupo. Verifica que el bot sea admin.");
      }
    },
  },
];
