import { db } from "../../src/database.js";
import { gacha } from "../../src/gacha.js";
import { participantForms, addAllForms, normalizeJid, jidToNumber } from "../../src/jid.js";

function findParticipant(participants, targetJid) {
  const targetForms = new Set();
  addAllForms(targetForms, targetJid);
  for (const p of participants) {
    const pForms = participantForms(p);
    for (const form of targetForms) {
      if (pForms.has(form)) return p;
    }
  }
  return null;
}

function getTarget(msg, args) {
  const ctx = msg.message?.extendedTextMessage?.contextInfo;
  const mention = ctx?.mentionedJid?.[0];
  const quoted = ctx?.participant;

  let jid = null;
  if (mention) jid = normalizeJid(mention);
  else if (quoted) jid = normalizeJid(quoted);
  else if (/^\d/.test(args[0] || "")) jid = `${args[0].replace(/\D/g, "")}@s.whatsapp.net`;

  return { jid };
}

export default [
  {
    command: ["inv", "inventario"],
    description: "🎒 Muestra tus minerales, peces y personajes de gacha.",
    async execute({ sock, msg, remoteJid, senderRaw, args, reply }) {
      let targetJid = senderRaw;
      let isSelf = true;

      const { jid: rawJid } = getTarget(msg, args);
      if (rawJid) {
        try {
          const meta = await sock.groupMetadata(remoteJid);
          const participant = findParticipant(meta.participants, rawJid);
          targetJid = participant ? participant.id : rawJid;
        } catch {
          targetJid = rawJid;
        }
        isSelf = false;
      }

      const user = db.getUser(targetJid);
      const num = jidToNumber(targetJid) || targetJid.split("@")[0].split(":")[0];
      const min = user.minerals ?? { carbon: 0, hierro: 0, cobre: 0, oro: 0, diamante: 0 };
      const fish = user.fish ?? { comun: 0, raro: 0, epico: 0, legendario: 0 };
      const madera = user.madera ?? { pino: 0, roble: 0, caoba: 0, ebano: 0 };

      let chars = [], valorTotal = 0, series = 0;
      try {
        chars = await gacha.getUserCharacters(targetJid);
        valorTotal = chars.reduce((acc, c) => acc + c.value, 0);
        series = new Set(chars.map((c) => c.series)).size;
      } catch {}

      const texto = `\`🎒 ${isSelf ? "TU INVENTARIO" : `INVENTARIO DE +${num}`}\`

\`⛏️ MINERALES ›\`
\`  🪨 Carbón ›\` *${min.carbon ?? 0}*
\`  🔌 Cobre ›\` *${min.cobre ?? 0}*
\`  🔩 Hierro ›\` *${min.hierro ?? 0}*
\`  🪙 Oro ›\` *${min.oro ?? 0}*
\`  💎 Diamante ›\` *${min.diamante ?? 0}*

\`🎣 PECES ›\`
\`  🐟 Común ›\` *${fish.comun ?? 0}*
\`  🐠 Raro ›\` *${fish.raro ?? 0}*
\`  🦑 Épico ›\` *${fish.epico ?? 0}*
\`  🧜‍♂️ Legendario ›\` *${fish.legendario ?? 0}*

\`🪓 MADERA ›\`
\`  🌲 Pino ›\` *${madera.pino ?? 0}*
\`  🪵 Roble ›\` *${madera.roble ?? 0}*
\`  🟤 Caoba ›\` *${madera.caoba ?? 0}*
\`  ⬛ Ébano ›\` *${madera.ebano ?? 0}*

\`🎴 GACHA ›\`
\`  💞 Personajes ›\` *${chars.length}*
\`  📚 Series ›\` *${series}*
\`  💴 Valor ›\` *${valorTotal.toLocaleString()}* ¥

> _Usa *!perfil* para ver tu nivel, bio y foto._`;

      await reply(texto);
    },
  },
];
