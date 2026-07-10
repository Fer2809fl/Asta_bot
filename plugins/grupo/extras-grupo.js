import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const DATA_FILE = join(dirname(fileURLToPath(import.meta.url)), "../../database/reglas-grupos.json");

function loadRules() {
  try {
    return JSON.parse(readFileSync(DATA_FILE, "utf-8"));
  } catch {
    return {};
  }
}

function saveRules(data) {
  const dir = dirname(DATA_FILE);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

async function getGroup(sock, remoteJid) {
  const metadata = await sock.groupMetadata(remoteJid);
  return {
    metadata,
    participants: metadata.participants || [],
  };
}

function participantJid(participant) {
  return participant.jid || participant.id || participant.lid;
}

function memberStats(participants) {
  const admins = participants.filter((p) => p.admin === "admin" || p.admin === "superadmin").length;
  return {
    total: participants.length,
    admins,
    members: Math.max(participants.length - admins, 0),
  };
}

export default [
  {
    command: ["reglas", "rules"],
    description: "Muestra las reglas guardadas del grupo.",
    async execute({ remoteJid, reply }) {
      const rules = loadRules()[remoteJid];
      if (!rules) return reply("📋 Este grupo todavía no tiene reglas guardadas.");

      await reply(`> . ﹡﹟ 📋 ׄ ⬭ *REGLAS DEL GRUPO*\n\n${rules}`);
    },
  },
  {
    command: ["setreglas", "setrules"],
    description: "Guarda o reemplaza las reglas del grupo.",
    adminOnly: true,
    async execute({ remoteJid, args, reply }) {
      const text = args.join(" ").trim();
      if (!text) return reply("⚠️ Escribe las reglas que quieres guardar.");

      const data = loadRules();
      data[remoteJid] = text;
      saveRules(data);
      await reply("✅ Reglas guardadas correctamente.");
    },
  },
  {
    command: ["delreglas", "delrules"],
    description: "Elimina las reglas guardadas del grupo.",
    adminOnly: true,
    async execute({ remoteJid, reply }) {
      const data = loadRules();
      if (!data[remoteJid]) return reply("📋 Este grupo no tiene reglas guardadas.");

      delete data[remoteJid];
      saveRules(data);
      await reply("✅ Reglas eliminadas.");
    },
  },
  {
    command: ["idgrupo", "groupid", "gpid"],
    description: "Muestra el ID interno del grupo.",
    async execute({ remoteJid, reply }) {
      await reply(`> . ﹡﹟ 🆔 ׄ ⬭ *ID DEL GRUPO*\n\n${remoteJid}`);
    },
  },
  {
    command: ["miembros", "membercount", "totalmiembros"],
    description: "Muestra el total de miembros y administradores.",
    async execute({ sock, remoteJid, reply }) {
      let participants;
      try {
        const meta = await sock.groupMetadata(remoteJid);
        participants = meta.participants || [];
      } catch {
        return reply("❌ No se pudo obtener la información del grupo.");
      }
      const stats = memberStats(participants);
      await reply(
        `> . ﹡﹟ 👥 ׄ ⬭ *MIEMBROS*\n\n` +
        `ᅠ𐏸𐨒ᅠׄ *Total* :: ${stats.total}\n` +
        `ᅠ𐏸𐨒ᅠׄ *Admins* :: ${stats.admins}\n` +
        `ᅠ𐏸𐨒ᅠׄ *Miembros* :: ${stats.members}`
      );
    },
  },
  {
    command: ["descgrupo", "verdesc"],
    description: "Muestra la descripción actual del grupo.",
    async execute({ sock, remoteJid, reply }) {
      let metadata;
      try {
        metadata = await sock.groupMetadata(remoteJid);
      } catch {
        return reply("❌ No se pudo obtener la información del grupo.");
      }
      await reply(`> . ﹡﹟ 📝 ׄ ⬭ *DESCRIPCIÓN*\n\n${metadata.desc?.trim() || "Sin descripción"}`);
    },
  },
  {
    command: ["fotogrupo", "gpfoto", "grouppic"],
    description: "Muestra la foto actual del grupo.",
    async execute({ sock, msg, remoteJid, reply }) {
      try {
        const url = await sock.profilePictureUrl(remoteJid, "image");
        await sock.sendMessage(remoteJid, {
          image: { url },
          caption: "> . ﹡﹟ 🖼️ ׄ ⬭ *FOTO DEL GRUPO*",
        }, { quoted: msg });
      } catch {
        await reply("⚠️ No pude obtener la foto del grupo.");
      }
    },
  },
  {
    command: ["resetlink", "revoke", "newlink"],
    description: "Reinicia el enlace de invitación del grupo.",
    adminOnly: true,
    botAdmin: true,
    async execute({ sock, remoteJid, reply }) {
      const code = await sock.groupRevokeInvite(remoteJid);
      await reply(`✅ Link reiniciado.\n\nhttps://chat.whatsapp.com/${code}`);
    },
  },
];
