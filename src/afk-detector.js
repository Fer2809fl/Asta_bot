import { db } from "./database.js";
import { normalizeJid } from "./jid.js";

export async function checkAfkMentions({ sock, msg, remoteJid, mentions, reply }) {
  if (!mentions || mentions.length === 0) return;
  if (!remoteJid.endsWith("@g.us")) return;

  const afkUsers = [];

  for (const mentionedJid of mentions) {
    const normalizedMention = normalizeJid(mentionedJid);
    if (!normalizedMention) continue;

    const user = db.getUser(normalizedMention);
    if (user?.afkGroups?.[remoteJid]?.active) {
      const afkData = user.afkGroups[remoteJid];
      const elapsed = Date.now() - afkData.start;
      const hours = Math.floor(elapsed / (3600 * 1000));
      const minutes = Math.floor((elapsed % (3600 * 1000)) / (60 * 1000));

      afkUsers.push({
        jid: normalizedMention,
        reason: afkData.reason,
        time: hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`,
      });
    }
  }

  if (afkUsers.length > 0) {
    let text = `╔┅┉✦┉┅✦┉┅✦┉┅✦┉┅┅❥⧽\n`;
    text += `║. .┊⩩﹕*😴 USUARIO(S) EN MODO AFK*\n`;
    text += `╚┅┉✦┉┅✦┉┅✦┉┅✦┉┅┅❥⧽\n\n`;

    for (const u of afkUsers) {
      const num = u.jid.split("@")[0].split(":")[0];
      text += `> ✦ » @${num}\n`;
      text += `> ✦ » 📝 Motivo: *${u.reason}*\n`;
      text += `> ✦ » ⏱️ Ausente: *${u.time}*\n\n`;
    }

    text += `> _Por favor no los menciones, responderán lo más pronto posible._`;

    await reply(text, { mentions: afkUsers.map(u => u.jid) });
  }
}
