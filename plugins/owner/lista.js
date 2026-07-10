// plugins/lista.js
import { feedbackDB } from "../../src/feedbackDB.js";
import { candidatosNumero, tieneAcceso } from "../../src/sugerenciasHelpers.js";

export default [
  {
    command: ["lista", "listasug", "listasugerencias", "versugerencias"],
    category: "sugerencias",
    description: "Muestra la lista de ideas y reportes (ayudantes y owner).",
    async execute({ senderRaw, msg, reply, jidToNumber, isOwner }) {
      const candidatos = candidatosNumero(msg, senderRaw, jidToNumber);
      if (!tieneAcceso(candidatos, senderRaw, isOwner)) {
        return reply("⚠️ Esta lista es solo para los ayudantes y el owner.");
      }

      const items = feedbackDB.listarTodos();
      if (!items.length) return reply("📭 La lista está vacía.");

      const ideas = items.filter((i) => i.tipo === "idea");
      const bugs = items.filter((i) => i.tipo === "bug");
      const fmt = (i) => `🆔 ${i.id}\n👤 +${i.autorNumero}\n📝 ${i.texto}`;

      const texto =
        `📋 *LISTA DE IDEAS Y REPORTES*\n\n` +
        `💡 *Ideas (${ideas.length})*\n${ideas.map(fmt).join("\n\n") || "Ninguna"}\n\n` +
        `🐛 *Reportes (${bugs.length})*\n${bugs.map(fmt).join("\n\n") || "Ninguno"}\n\n` +
        `Usa *quitar <ID>* cuando ya esté resuelto.`;

      await reply(texto);
    },
  },
];
