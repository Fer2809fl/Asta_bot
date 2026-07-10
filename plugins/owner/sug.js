// plugins/sug.js
import { feedbackDB } from "../../src/feedbackDB.js";
import { notificarAyudantes } from "../../src/sugerenciasHelpers.js";

export default [
  {
    command: ["sug", "sugerir", "sugerencia", "idea"],
    category: "sugerencias",
    description: "Agrega una idea/sugerencia a la lista.",
    async execute({ text, senderRaw, remoteJid, isGroup, reply, jidToNumber, sock, usedPrefix }) {
      if (!text) {
        return reply(`✏️ Escribe así:\n*${usedPrefix}sug* <tu idea o sugerencia>`);
      }
      const item = feedbackDB.crear({
        tipo: "idea",
        texto: text,
        autor: senderRaw,
        autorNumero: jidToNumber(senderRaw),
        grupoOrigen: isGroup ? remoteJid : null,
      });
      await reply(`✅ Tu sugerencia se agregó a la lista.\n🆔 ID: *${item.id}*`);
      await notificarAyudantes(sock, item);
    },
  },
];
