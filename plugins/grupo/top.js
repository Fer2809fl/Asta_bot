import { normalizeJid, jidToNumber, lidToJid } from "../../src/jid.js";

const TITULOS_DEFAULT = [
  "PENDEJOS",
  "MÁS PENDEJOS DEL GRUPO",
  "TÓXICOS",
  "CHISMOSOS",
  "GALANES FALLIDOS",
  "SIMPS",
  "AMARGADOS",
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default [
  {
    command: ["top10", "toppendejos", "top10pendejos"],
    description: "😈 Menciona a 10 personas random del grupo con un título random (o el que tú pongas).",
    async execute({ sock, msg, remoteJid, args, reply }) {
      if (!remoteJid?.endsWith("@g.us")) {
        return reply("⚠️ Este comando solo funciona en grupos.");
      }

      const senderJid = normalizeJid(msg.key.participant || msg.key.remoteJid);
      if (!senderJid) return reply("❌ No se pudo identificar tu usuario.");

      let meta;
      try {
        meta = await sock.groupMetadata(remoteJid);
      } catch {
        return reply("❌ No se pudo obtener la información del grupo.");
      }

      // Igual que en rob.js: prioriza participant.jid, si no hay lo saca
      // del lid, y siempre normaliza al final.
      const jids = meta.participants
        .map((p) => {
          let targetJid = p.jid;
          if (!targetJid) targetJid = lidToJid(p.id);
          return normalizeJid(targetJid);
        })
        .filter((jid) => jid && jid !== senderJid); // excluye a quien manda el comando; quita este filtro si quieres que también pueda salir

      if (jids.length === 0) {
        return reply("⚠️ No hay suficientes miembros para armar el top.");
      }

      const elegidos = shuffle(jids).slice(0, Math.min(10, jids.length));

      const titulo = args?.length
        ? args.join(" ").toUpperCase()
        : TITULOS_DEFAULT[Math.floor(Math.random() * TITULOS_DEFAULT.length)];

      const lineas = elegidos
        .map((jid, i) => `*${i + 1}.* @${jidToNumber(jid) || jid.split("@")[0]}`)
        .join("\n");

      const texto = `\`😈 TOP 10 ${titulo}\`

${lineas}`;

      await sock.sendMessage(remoteJid, { text: texto, mentions: elegidos });
    },
  },
];
