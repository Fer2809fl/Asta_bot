// plugins/report.js
import { feedbackDB } from "../../src/feedbackDB.js";
import { notificarAyudantes } from "../../src/sugerenciasHelpers.js";

export default [
  {
    command: ["report", "reportar", "reportarbug", "bug"],
    category: "sugerencias",
    description: "Agrega un reporte de error a la lista.",
    async execute({ text, senderRaw, remoteJid, isGroup, reply, jidToNumber, sock, usedPrefix }) {
      if (!text) {
        return reply(`🐞 Escribe así:\n*${usedPrefix}report* <descripción del error>`);
      }
      const item = feedbackDB.crear({
        tipo: "bug",
        texto: text,
        autor: senderRaw,
        autorNumero: jidToNumber(senderRaw),
        grupoOrigen: isGroup ? remoteJid : null,
      });
      await reply(`✅ Tu reporte se agregó a la lista.\n🆔 ID: *${item.id}*`);
      await notificarAyudantes(sock, item);
    },
  },
];
