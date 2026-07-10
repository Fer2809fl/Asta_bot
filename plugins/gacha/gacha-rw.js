import { gacha } from "../../src/gacha.js";
import { KonachanScraper } from "konachan-scraper";

const COOLDOWN = 15 * 60 * 1000;
const CLAIM_WINDOW = 20_000;

const rollLocks = new Map();

function cleanLocks() {
  const now = Date.now();
  for (const [k, t] of rollLocks) {
    if (now - t > 30_000) rollLocks.delete(k);
  }
}

function formatCooldown(ms) {
  const s = Math.ceil(ms / 1000);
  const min = Math.floor(s / 60);
  const sec = s % 60;
  if (min > 0 && sec > 0) return `${min}m ${sec}s`;
  if (min > 0) return `${min} minuto${min !== 1 ? "s" : ""}`;
  return `${sec} segundo${sec !== 1 ? "s" : ""}`;
}

export default [
  {
    command: ["rw", "rollwaifu", "roll"],
    category: "gacha",
    description: "Genera un personaje aleatorio para reclamar.",
    async execute({ sock, msg, remoteJid, senderRaw, reply }) {
      cleanLocks();

      if (rollLocks.has(senderRaw)) return;

      const userCooldowns = global._rwCooldowns ?? (global._rwCooldowns = new Map());
      const lastRoll = userCooldowns.get(senderRaw) ?? 0;
      const now = Date.now();

      if (now < lastRoll) {
        return reply(`⏱️ Espera *${formatCooldown(lastRoll - now)}* para volver a usar *.rw*`);
      }

      rollLocks.set(senderRaw, now);

      try {
        const char = await gacha.getRandomCharacter();
        if (!char) {
          return reply("❌ No hay personajes en la base de datos. Usa *.genchar* o *.genrandom* para agregar.");
        }

        const imageUrl = await KonachanScraper.getRandomUrl(char.booru_tag);
        if (!imageUrl) {
          return reply(`❌ No se encontró imagen para *${char.name}*. Intenta de nuevo.`);
        }

        const claimKey = `${remoteJid}__${char.id}`;

        global._pendingClaims ?? (global._pendingClaims = new Map());
        global._pendingClaims.set(claimKey, {
          char,
          expiresAt: now + CLAIM_WINDOW,
        });
        setTimeout(() => global._pendingClaims?.delete(claimKey), CLAIM_WINDOW);

        const caption = [
          `✨ *${char.name}*`,
          `⚥ Género: ${char.gender}`,
          `📖 Serie: ${char.series}`,
          `💴 Valor: ${char.value.toLocaleString()} ¥`,
          ``,
          `Responde con *.claim* para reclamar`,
        ].join("\n");

        const sent = await sock.sendMessage(remoteJid, {
          image: { url: imageUrl },
          caption,
        }, { quoted: msg });

        global._rwPending ?? (global._rwPending = new Map());
        global._rwPending.set(sent.key.id, claimKey);

        userCooldowns.set(senderRaw, now + COOLDOWN);
      } catch (e) {
        console.error("[rw]", e.message);
        await reply(`❌ Error al hacer el roll: ${e.message}`);
      } finally {
        rollLocks.delete(senderRaw);
      }
    },
  },
];
