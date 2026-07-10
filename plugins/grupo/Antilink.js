import { antilinkManager } from "../../src/antilinkManager.js";

export default [
  {
    command: ["antilink"],
    description: "Bloquea links personalizados: elimina el mensaje y suma un aviso (warn) a quien los envíe.",
    adminOnly: true,
    botAdmin: true,
    groupOnly: true,
    async execute({ remoteJid, args, reply }) {
      const sub = (args[0] || "").toLowerCase();

      if (sub === "on" || sub === "activar") {
        antilinkManager.enable(remoteJid);
        return reply(
          "🔗🛡️ *Antilink* activado.\n\n" +
          "Los links que agregues a la lista serán eliminados automáticamente y sumarán un aviso (warn) a quien los envíe."
        );
      }

      if (sub === "off" || sub === "desactivar") {
        antilinkManager.disable(remoteJid);
        return reply("✅ *Antilink* desactivado.");
      }

      if (sub === "add" || sub === "agregar") {
        const platform = args.slice(1).join(" ").trim();
        if (!platform) {
          return reply(
            "⚠️ Escribe la plataforma o el inicio del link a bloquear.\n\n" +
            "Ej: *.antilink add chat.whatsapp.com*\n" +
            "Ej: *.antilink add https://sitio-sospechoso*"
          );
        }
        antilinkManager.add(remoteJid, platform);
        return reply(`✅ Se bloqueará cualquier link que contenga *"${platform.toLowerCase()}"*.`);
      }

      if (["del", "eliminar", "remove", "quitar"].includes(sub)) {
        const platform = args.slice(1).join(" ").trim();
        if (!platform) return reply("⚠️ Escribe la plataforma que quieres quitar de la lista.");
        const removed = antilinkManager.remove(remoteJid, platform);
        return reply(
          removed
            ? `🗑️ Se quitó *"${platform.toLowerCase()}"* de la lista bloqueada.`
            : "ℹ️ Esa plataforma no estaba en la lista."
        );
      }

      if (["list", "lista", "ver"].includes(sub)) {
        const platforms = antilinkManager.list(remoteJid);
        const estado = antilinkManager.isEnabled(remoteJid) ? "activado ✅" : "desactivado ❌";
        if (!platforms.length) {
          return reply(
            `📋 No hay plataformas bloqueadas configuradas (antilink: ${estado}).\n\n` +
            "Agrega una con *.antilink add <plataforma>*."
          );
        }
        return reply(
          `📋 *Plataformas bloqueadas* (antilink: ${estado}):\n\n` +
          platforms.map((p) => `• ${p}`).join("\n")
        );
      }

      const estado = antilinkManager.isEnabled(remoteJid) ? "activado ✅" : "desactivado ❌";
      return reply(
        `🔗 *ANTILINK*\n\n` +
        `Estado: ${estado}\n\n` +
        `*.antilink on* / *.antilink off* — activar o desactivar\n` +
        `*.antilink add <plataforma>* — bloquear una plataforma o inicio de link\n` +
        `*.antilink del <plataforma>* — quitarla de la lista\n` +
        `*.antilink list* — ver la lista actual\n\n` +
        `Al 3° link enviado (o al llegar al máximo de avisos configurado), se expulsa al usuario automáticamente.`
      );
    },
  },
];
