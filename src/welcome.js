import { groupConfig } from "./groupConfig.js";

// ─── Variables disponibles en mensajes personalizados ─────────────────────────
// {usuario}     → número/mención del nuevo miembro
// {grupo}       → nombre del grupo
// {descripcion} → descripción del grupo
// {fecha}       → fecha actual
// {hora}        → hora actual
// {miembros}    → número de participantes del grupo
// {bot}         → nombre del bot

function buildMessage(template, vars) {
  let text = template;
  for (const [key, value] of Object.entries(vars)) {
    // Acepta variantes: {usuario}, {user}, {nombre}, etc. según el mapa
    const regex = new RegExp(`\\{${key}\\}`, "gi");
    text = text.replace(regex, value);
  }
  return text;
}

function defaultWelcomeText(vars) {
  let text = `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🎉* ㅤ֢ㅤ⸱ㅤᯭִ*\n`;
  text += `ㅤ𓏸𓈒ㅤׄ *ᴡᴇʟᴄᴏᴍᴇ* :: *${vars.bot.toUpperCase()}*\n`;
  text += `ׅㅤ𓏸𓈒ㅤׄ *ᴍᴇᴍʙᴇʀ* :: @${vars.usuario}\n`;
  text += `ׅㅤ𓏸𓈒ㅤׄ *ɢʀᴏᴜᴘ* :: ${vars.grupo}\n`;
  text += `ׅㅤ𓏸𓈒ㅤׄ *ᴅᴀᴛᴇ* :: ${vars.fecha}\n`;
  text += `ׅㅤ𓏸𓈒ㅤׄ *ᴛɪᴍᴇ* :: ${vars.hora}\n\n`;
  text += `> ## \`𝖭𝖴𝖤𝖵𝖮 𝖨𝖭𝖳𝖤𝖦𝖱𝖠𝖭𝖳𝖤 🎊\`\n\n`;
  if (vars.descripcion) {
    text += `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜📜* ㅤ֢ㅤ⸱ㅤᯭִ*\n`;
    text += `ׅㅤ𓏸𓈒ㅤׄ *ᴅᴇsᴄ* :: ${vars.descripcion}\n\n`;
  }
  text += `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜⚡* ㅤ֢ㅤ⸱ㅤᯭִ*\n`;
  text += `ㅤ𓏸𓈒ㅤׄ *ʙᴏᴛ* :: *${vars.bot.toUpperCase()}*`;
  return text;
}

function defaultByeText(vars) {
  let text = `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜😔* ㅤ֢ㅤ⸱ㅤᯭִ*\n`;
  text += `ㅤ𓏸𓈒ㅤׄ *ғᴀʀᴇᴡᴇʟʟ* :: *${vars.bot.toUpperCase()}*\n`;
  text += `ׅㅤ𓏸𓈒ㅤׄ *ᴍᴇᴍʙᴇʀ* :: @${vars.usuario}\n`;
  text += `ׅㅤ𓏸𓈒ㅤׄ *ɢʀᴏᴜᴘ* :: ${vars.grupo}\n`;
  text += `ׅㅤ𓏸𓈒ㅤׄ *ᴅᴀᴛᴇ* :: ${vars.fecha}\n`;
  text += `ׅㅤ𓏸𓈒ㅤׄ *ᴛɪᴍᴇ* :: ${vars.hora}\n\n`;
  text += `> ## \`𝖲𝖤 𝖭𝖮𝖲 𝖥𝖴𝖤 𝖴𝖭 𝖦𝖱𝖠𝖭𝖣𝖤 💔\`\n\n`;
  text += `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🕊️* ㅤ֢ㅤ⸱ㅤᯭִ*\n`;
  text += `ㅤ𓏸𓈒ㅤׄ *ᴍᴇssᴀɢᴇ* :: Hasta pronto, nunca te olvidaremos\n`;
  text += `ׅㅤ𓏸𓈒ㅤׄ *ᴡɪsʜ* :: Que te vaya bien en todo\n\n`;
  text += `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜⚡* ㅤ֢ㅤ⸱ㅤᯭִ*\n`;
  text += `ㅤ𓏸𓈒ㅤׄ *ʙᴏᴛ* :: *${vars.bot.toUpperCase()}*`;
  return text;
}

export function registerWelcome(sock) {
  sock.ev.on("group-participants.update", async ({ id: groupJid, participants, action }) => {
    // Leer configuración de este grupo desde la nueva BD unificada
    const { welcome, bye } = groupConfig.getWelcome(groupJid);

    if (action === "add") {
      if (!welcome) return;

      let groupMeta = null;
      try {
        groupMeta = await sock.groupMetadata(groupJid);
      } catch {
        return;
      }

      const customTemplate = groupConfig.getWelcomeMsg(groupJid);

      for (const p of participants) {
        if (!p) continue;
        const jid = typeof p === "string" ? p : (p.id || p.jid);
        if (!jid || typeof jid !== "string") continue;

        const numero = jid.split("@")[0];

        let ppUrl;
        try {
          ppUrl = await sock.profilePictureUrl(jid, "image");
        } catch {
          ppUrl =
            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
        }

        const botName = sock.botname || global.botname || "Asta bot";

        // Variables disponibles para el mensaje personalizado
        const vars = {
          usuario: numero,
          user: numero,
          nombre: numero,
          grupo: groupMeta.subject,
          group: groupMeta.subject,
          descripcion: groupMeta.desc || "",
          desc: groupMeta.desc || "",
          fecha: new Date().toLocaleDateString(),
          hora: new Date().toLocaleTimeString(),
          miembros: groupMeta.participants?.length || 0,
          bot: botName,
        };

        const text = customTemplate
          ? buildMessage(customTemplate, vars)
          : defaultWelcomeText(vars);

        await sock.sendMessage(groupJid, {
          image: { url: ppUrl },
          caption: text,
          mentions: [jid],
        }).catch(() => { });
      }
    } else if (action === "remove") {
      if (!bye) return;

      let groupMeta = null;
      try {
        groupMeta = await sock.groupMetadata(groupJid);
      } catch {
        return;
      }

      const customTemplate = groupConfig.getByeMsg(groupJid);

      for (const p of participants) {
        if (!p) continue;
        const jid = typeof p === "string" ? p : (p.id || p.jid);
        if (!jid || typeof jid !== "string") continue;

        const numero = jid.split("@")[0];

        let ppUrl;
        try {
          ppUrl = await sock.profilePictureUrl(jid, "image");
        } catch {
          ppUrl =
            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
        }

        const botName = sock.botname || global.botname || "Asta bot";

        const vars = {
          usuario: numero,
          user: numero,
          nombre: numero,
          grupo: groupMeta.subject,
          group: groupMeta.subject,
          descripcion: groupMeta.desc || "",
          desc: groupMeta.desc || "",
          fecha: new Date().toLocaleDateString(),
          hora: new Date().toLocaleTimeString(),
          miembros: groupMeta.participants?.length || 0,
          bot: botName,
        };

        const text = customTemplate
          ? buildMessage(customTemplate, vars)
          : defaultByeText(vars);

        await sock.sendMessage(groupJid, {
          image: { url: ppUrl },
          caption: text,
          mentions: [jid],
        }).catch(() => { });
      }
    }
  });
}