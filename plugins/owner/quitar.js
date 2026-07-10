// plugins/quitar.js
import { feedbackDB } from "../../src/feedbackDB.js";
import { candidatosNumero, tieneAcceso, nombreTipo } from "../../src/sugerenciasHelpers.js";

export default [
  {
    command: ["quitar", "quitarsug", "listo", "solucionado"],
    category: "sugerencias",
    description: "Quita de la lista una sugerencia/reporte ya resuelto (ayudantes u owner).",
    async execute({ args, senderRaw, msg, reply, jidToNumber, sock, isOwner }) {
      const id = args[0];
      if (!id) return reply("⚠️ Falta el ID. Uso: *quitar <ID>*");

      const item = feedbackDB.obtener(id);
      if (!item) return reply("❌ Ese ID ya no existe en la lista.");

      const candidatos = candidatosNumero(msg, senderRaw, jidToNumber);
      if (!tieneAcceso(candidatos, senderRaw, isOwner)) {
        return reply("⚠️ Solo los ayudantes o el owner pueden quitar esto de la lista.");
      }

      feedbackDB.eliminar(id);
      await reply(`✅ *${id}* se quitó de la lista.`);

      if (item.autor) {
        try {
          await sock.sendMessage(item.autor, {
            text:
              `🛠️ Tu ${nombreTipo(item.tipo).toLowerCase()} *${id}* ya fue resuelta.\n` +
              `📝 ${item.texto}\n\n¡Gracias por tu aporte! 🙌`,
          });
        } catch {}
      }
    },
  },
];
