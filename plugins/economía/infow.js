import { db } from "../../src/database.js";

// Debe reflejar EXACTAMENTE el mismo key de cooldown y duración que usa cada comando.
const ACTIVITIES = [
  { key: "work", label: "💼 TRABAJAR", cooldown: 60 * 60 * 1000 },
  { key: "hunt", label: "🏹 CAZAR", cooldown: 10 * 60 * 1000 },
  { key: "minar", label: "⛏️ MINAR", cooldown: 6 * 60 * 1000 },
  { key: "pescar", label: "🎣 PESCAR", cooldown: 6 * 60 * 1000 },
  { key: "dig", label: "⛏️ EXCAVAR", cooldown: 8 * 60 * 1000 },
  { key: "talar", label: "🪓 TALAR", cooldown: 25 * 60 * 1000 },
  { key: "explorar", label: "🧭 EXPLORAR", cooldown: 35 * 60 * 1000 },
  { key: "beg", label: "🙏 MENDIGAR", cooldown: 2 * 60 * 1000 },
  { key: "crime", label: "🦹 CRIMEN", cooldown: 30 * 60 * 1000 },
  { key: "daily", label: "🎁 DIARIO", cooldown: 24 * 60 * 60 * 1000 },
  { key: "allw", label: "💪 ALLW", cooldown: 24 * 60 * 60 * 1000 },
];

function formatRemaining(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

export default [
  {
    command: ["infow", "cooldowns", "tiempos", "reusos"],
    description: "📋 Muestra el tiempo de reutilización de cada actividad.",
    async execute({ senderRaw, reply }) {
      const user = db.getUser(senderRaw);
      const now = Date.now();
      const cooldowns = user.cooldowns ?? {};

      const lineas = ACTIVITIES.map((a) => {
        const last = cooldowns[a.key] ?? 0;
        const elapsed = now - last;
        const disponible = elapsed >= a.cooldown;
        const estado = disponible
          ? "✅ Disponible"
          : `⏱️ *${formatRemaining(a.cooldown - elapsed)}*`;
        return `\`${a.label} ›\` ${estado}`;
      }).join("\n");

      const texto = `\`📋 TIEMPOS DE REUTILIZACIÓN\`

${lineas}

> _Usa cada comando en cuanto marque disponible._`;

      await reply(texto);
    },
  },
];