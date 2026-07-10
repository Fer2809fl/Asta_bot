import { groupConfig } from "../../src/groupConfig.js";

// Variables disponibles:
// {usuario} / {user} / {nombre}  → número del miembro
// {grupo}   / {group}            → nombre del grupo
// {descripcion} / {desc}         → descripción del grupo
// {fecha}                        → fecha actual
// {hora}                         → hora actual
// {miembros}                     → número total de participantes
// {bot}                          → nombre del bot

const VARS_HELP =
  `📌 *Variables disponibles:*\n` +
  `• *{usuario}* — Número/mención del miembro\n` +
  `• *{grupo}* — Nombre del grupo\n` +
  `• *{descripcion}* — Descripción del grupo\n` +
  `• *{fecha}* — Fecha de hoy\n` +
  `• *{hora}* — Hora actual\n` +
  `• *{miembros}* — Total de participantes\n` +
  `• *{bot}* — Nombre del bot\n\n` +
  `📝 *Ejemplo:*\n` +
  `\`\`\`Bienvenido {usuario} al grupo {grupo}!\n\nDescripción:\n{descripcion}\n\nHoy es {fecha} — {miembros} miembros.\`\`\``;

export default [
  {
    command: ["welcome", "bienvenida"],
    description: "Configura el sistema de bienvenida y despedida del grupo.",
    adminOnly: true,
    async execute({ sock, msg, remoteJid, isGroup, args, text, reply, senderRaw }) {
      if (!isGroup) return reply("⚠️ Este comando solo funciona en *grupos*.");

      const action = args[0]?.toLowerCase();

      // ── welcome on ──────────────────────────────────────────────────────────
      if (action === "on") {
        groupConfig.setWelcome(remoteJid, true);
        return reply("✅ *Bienvenida activada* en este grupo.");
      }

      // ── welcome off ─────────────────────────────────────────────────────────
      if (action === "off") {
        groupConfig.setWelcome(remoteJid, false);
        return reply("❌ *Bienvenida desactivada* en este grupo.");
      }

      // ── welcome bye on/off ───────────────────────────────────────────────────
      if (action === "bye") {
        const sub = args[1]?.toLowerCase();
        if (sub === "on") {
          groupConfig.setBye(remoteJid, true);
          return reply("✅ *Despedida activada* en este grupo.");
        }
        if (sub === "off") {
          groupConfig.setBye(remoteJid, false);
          return reply("❌ *Despedida desactivada* en este grupo.");
        }
        return reply(
          "⚠️ Usa *!welcome bye on* o *!welcome bye off* para configurar las despedidas."
        );
      }

      // ── welcome msg <texto> ─────────────────────────────────────────────────
      // Establece el mensaje personalizado de bienvenida
      if (action === "msg" || action === "texto" || action === "mensaje") {
        const newMsg = args.slice(1).join(" ").trim();
        if (!newMsg) {
          const current = groupConfig.getWelcomeMsg(remoteJid);
          return reply(
            `📋 *Mensaje de bienvenida actual:*\n\n` +
            (current ? `\`\`\`${current}\`\`\`` : "_Usando el mensaje predeterminado._") +
            `\n\n${VARS_HELP}\n\n` +
            `💡 Para cambiarlo: *!welcome msg <tu mensaje con variables>*\n` +
            `💡 Para resetear: *!welcome msg reset*`
          );
        }
        if (newMsg === "reset" || newMsg === "default") {
          groupConfig.setWelcomeMsg(remoteJid, null);
          return reply("🔄 Mensaje de bienvenida *reseteado* al predeterminado.");
        }
        groupConfig.setWelcomeMsg(remoteJid, newMsg);
        return reply(
          `✅ *Mensaje de bienvenida guardado:*\n\n\`\`\`${newMsg}\`\`\`\n\n` +
          `Cuando alguien entre, las variables se reemplazarán automáticamente.`
        );
      }

      // ── welcome byemsg <texto> ──────────────────────────────────────────────
      // Establece el mensaje personalizado de despedida
      if (action === "byemsg" || action === "byetexto" || action === "msbye") {
        const newMsg = args.slice(1).join(" ").trim();
        if (!newMsg) {
          const current = groupConfig.getByeMsg(remoteJid);
          return reply(
            `📋 *Mensaje de despedida actual:*\n\n` +
            (current ? `\`\`\`${current}\`\`\`` : "_Usando el mensaje predeterminado._") +
            `\n\n${VARS_HELP}\n\n` +
            `💡 Para cambiarlo: *!welcome byemsg <tu mensaje con variables>*\n` +
            `💡 Para resetear: *!welcome byemsg reset*`
          );
        }
        if (newMsg === "reset" || newMsg === "default") {
          groupConfig.setByeMsg(remoteJid, null);
          return reply("🔄 Mensaje de despedida *reseteado* al predeterminado.");
        }
        groupConfig.setByeMsg(remoteJid, newMsg);
        return reply(
          `✅ *Mensaje de despedida guardado:*\n\n\`\`\`${newMsg}\`\`\`\n\n` +
          `Cuando alguien salga, las variables se reemplazarán automáticamente.`
        );
      }

      // ── welcome vars ────────────────────────────────────────────────────────
      if (action === "vars" || action === "variables" || action === "ayuda") {
        return reply(VARS_HELP);
      }

      // ── welcome test ────────────────────────────────────────────────────────
      if (action === "test") {
        let groupMeta;
        try {
          groupMeta = await sock.groupMetadata(remoteJid);
        } catch {
          return reply("❌ No se pudo obtener la información del grupo.");
        }

        const jid = senderRaw;
        const numero = jid.split("@")[0];
        const botName = sock.botname || global.botname || "Asta bot";
        const customTemplate = groupConfig.getWelcomeMsg(remoteJid);

        let ppUrl;
        try {
          ppUrl = await sock.profilePictureUrl(jid, "image");
        } catch {
          ppUrl = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
        }

        const vars = {
          usuario: numero, user: numero, nombre: numero,
          grupo: groupMeta.subject, group: groupMeta.subject,
          descripcion: groupMeta.desc || "(sin descripción)", desc: groupMeta.desc || "(sin descripción)",
          fecha: new Date().toLocaleDateString(),
          hora: new Date().toLocaleTimeString(),
          miembros: groupMeta.participants?.length || 0,
          bot: botName,
        };

        let testText;
        if (customTemplate) {
          // Reemplazar variables
          testText = customTemplate;
          for (const [key, value] of Object.entries(vars)) {
            const regex = new RegExp(`\\{${key}\\}`, "gi");
            testText = testText.replace(regex, value);
          }
        } else {
          // Mensaje predeterminado de prueba
          testText = `╭〔 🧪 WELCOME TEST 〕⬣\n`;
          testText += `┃ ✨ PROBANDO EL SISTEMA\n`;
          testText += `╰━━━━━━━━━━━━⬣\n\n`;
          testText += `┃ 👋 Hola @${numero}\n`;
          testText += `┃ ✨ Bienvenido/a a:\n`;
          testText += `┃ 🏰 *${groupMeta.subject}*\n`;
          if (groupMeta.desc) testText += `┃ 📜 ${groupMeta.desc}\n`;
          testText += `\n╰━━〔 ⚡ ${botName.toUpperCase()} 〕━━⬣`;
        }

        const label = customTemplate ? "📝 _Usando mensaje personalizado_" : "📌 _Usando mensaje predeterminado_";

        await sock.sendMessage(
          remoteJid,
          { image: { url: ppUrl }, caption: `${testText}\n\n${label}`, mentions: [jid] }
        );
        return;
      }

      // ── welcome status (sin argumento) ──────────────────────────────────────
      const { welcome, bye } = groupConfig.getWelcome(remoteJid);
      const currentWelcomeMsg = groupConfig.getWelcomeMsg(remoteJid);
      const currentByeMsg = groupConfig.getByeMsg(remoteJid);

      return reply(
        `🔧 *Configuración de Bienvenidas:*\n\n` +
        `• Bienvenida: ${welcome ? "🟢 *Activa*" : "🔴 *Inactiva*"}\n` +
        `• Despedida:  ${bye ? "🟢 *Activa*" : "🔴 *Inactiva*"}\n` +
        `• Msg bienvenida: ${currentWelcomeMsg ? "✏️ *Personalizado*" : "📌 *Predeterminado*"}\n` +
        `• Msg despedida:  ${currentByeMsg ? "✏️ *Personalizado*" : "📌 *Predeterminado*"}\n\n` +
        `*Comandos:*\n` +
        `• *!welcome on/off* — Activar/desactivar bienvenida\n` +
        `• *!welcome bye on/off* — Activar/desactivar despedida\n` +
        `• *!welcome msg <texto>* — Personalizar mensaje de bienvenida\n` +
        `• *!welcome byemsg <texto>* — Personalizar mensaje de despedida\n` +
        `• *!welcome vars* — Ver variables disponibles\n` +
        `• *!welcome test* — Probar cómo luce la bienvenida`
      );
    },
  },
];