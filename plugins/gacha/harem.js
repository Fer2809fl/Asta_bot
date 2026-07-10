import { gacha } from "../../src/gacha.js";

const PAGE_SIZE = 10;

function formatUser(jid) {
  return jid.split("@")[0];
}

export default [
  {
    command: ["harem", "h"],
    category: "gacha",
    description: "Ver tu harem de personajes reclamados.",
    async execute({ sock, msg, remoteJid, senderRaw, args, reply }) {
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]
        ?? msg.message?.extendedTextMessage?.contextInfo?.participant;

      const targetJid = mentioned ?? senderRaw;
      const isOwn = targetJid === senderRaw;
      const page = Math.max(1, parseInt(args[0]) || 1);
      const offset = (page - 1) * PAGE_SIZE;

      let chars;
      try {
        chars = await gacha.getUserCharacters(targetJid);
      } catch (e) {
        return reply(`❌ Error al obtener el harem: ${e.message}`);
      }

      if (!chars || chars.length === 0) {
        const who = isOwn ? "No tienes" : `*${formatUser(targetJid)}* no tiene`;
        return reply(`${who} ningún personaje aún. Usa *.rw* para hacer un roll y *.claim* para reclamar.`);
      }

      const totalPages = Math.ceil(chars.length / PAGE_SIZE);
      if (page > totalPages) {
        return reply(`⚠️ Solo hay *${totalPages}* página${totalPages !== 1 ? "s" : ""}.`);
      }

      const slice = chars.slice(offset, offset + PAGE_SIZE);

      const header = isOwn
        ? `💞 *Tu Harem* — ${chars.length} personaje${chars.length !== 1 ? "s" : ""}`
        : `💞 *Harem de ${formatUser(targetJid)}* — ${chars.length} personaje${chars.length !== 1 ? "s" : ""}`;

      const lines = slice.map((c, i) => {
        const num = offset + i + 1;
        const g = c.gender === "Masculino" ? "♂" : "♀";
        return `*${num}.* ${g} *${c.name}*\n    📖 ${c.series} · 💴 ${c.value.toLocaleString()} ¥ · ID: ${c.id}`;
      });

      const footer = totalPages > 1
        ? `\nPágina *${page}/${totalPages}* — *.harem ${page + 1}* para ver más`
        : "";

      await reply([header, "", ...lines, footer].join("\n"));
    },
  },
];
