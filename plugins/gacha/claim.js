import { gacha } from "../../src/gacha.js";

export default [
  {
    command: ["claim", "c"],
    category: "gacha",
    description: "Reclama el personaje del roll respondiendo su imagen.",
    async execute({ msg, senderRaw, reply }) {
      const quotedId = msg.message?.extendedTextMessage?.contextInfo?.stanzaId;

      if (!quotedId) {
        return reply("↩️ Responde a la imagen del personaje que quieres reclamar.");
      }

      global._rwPending ?? (global._rwPending = new Map());
      const claimKey = global._rwPending.get(quotedId);

      if (!claimKey) {
        return reply("⏰ Este personaje ya no está disponible o expiró.");
      }

      global._pendingClaims ?? (global._pendingClaims = new Map());
      const pending = global._pendingClaims.get(claimKey);

      if (!pending || Date.now() > pending.expiresAt) {
        global._pendingClaims.delete(claimKey);
        global._rwPending.delete(quotedId);
        return reply("⏰ El tiempo para reclamar expiró.");
      }

      const { char } = pending;

      try {
        await gacha.giveCharacter(senderRaw, char.id);

        global._pendingClaims.delete(claimKey);
        global._rwPending.delete(quotedId);

        await reply(
          `✅ *${char.name}* fue añadido a tu harem.\n` +
          `⚥ Género: ${char.gender}\n` +
          `📖 Serie: ${char.series}\n` +
          `💴 Valor: ${char.value.toLocaleString()} ¥`
        );
      } catch (e) {
        if (e.message === "CHARACTER_ALREADY_OWNED") {
          return reply(`⚠️ Ya tienes a *${char.name}* en tu harem.`);
        }
        await reply(`❌ Error al reclamar: ${e.message}`);
      }
    },
  },
];
