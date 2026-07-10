import { adminManager } from "../../src/adminManager.js";

export default [
  {
    command: ["modoadmin", "adminmode"],
    description: "Activa o desactiva el modo admin: si está activo, solo los administradores pueden usar al bot en el grupo; para los demás, es como si el bot no existiera.",
    adminOnly: true,
    groupOnly: true,
    async execute({ remoteJid, args, reply }) {
      const opcion = (args[0] || "").toLowerCase();

      if (opcion === "on" || opcion === "activar") {
        adminManager.enableAdminMode(remoteJid);
        return reply(
          "🛡️ *Modo admin* activado.\n\n" +
          "Solo los administradores podrán usar al bot en este grupo; para los demás usuarios, es como si el bot no estuviera."
        );
      }

      if (opcion === "off" || opcion === "desactivar") {
        adminManager.disableAdminMode(remoteJid);
        return reply("✅ *Modo admin* desactivado. Todos pueden volver a usar al bot con normalidad.");
      }

      const estado = adminManager.isAdminModeEnabled(remoteJid) ? "activado ✅" : "desactivado ❌";
      return reply(
        `🛡️ *Modo admin*: ${estado}\n\n` +
        `Usa *.modoadmin on* o *.modoadmin off* para cambiarlo.`
      );
    },
  },
];
