import { adminManager } from "./adminManager.js";
import { printMessage } from "./print.js";
import { jidToNumber, normalizeJid, addAllForms } from "./jid.js";
import { warns, getTarget } from "./group.js";
import { groupConfig } from "./groupConfig.js";
import { isSessionEnabled } from "../plugins/supbot/botsession.js";
import { existsSync, readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { checkAfkMentions } from "./afk-detector.js";
import { muteManager } from "./muteManager.js";
import { antilinkManager } from "./antilinkManager.js";
import { handleGroupEvents } from "./groupEvents.js";
let _globalRestrictedCache = null;
let _globalRestrictedTs = 0;
function getGlobalRestricted() {
  const now = Date.now();
  if (_globalRestrictedCache && now - _globalRestrictedTs < 5000) return _globalRestrictedCache;
  const file = join(dirname(fileURLToPath(import.meta.url)), "../database/globalRestricted.json");
  try {
    _globalRestrictedCache = JSON.parse(readFileSync(file, "utf-8")).restrictedCmds || [];
  } catch {
    _globalRestrictedCache = [];
  }
  _globalRestrictedTs = now;
  return _globalRestrictedCache;
}
const ALWAYS_RUN = new Set([
  "bot", "boton",
  "setprimary", "primaryoff", "primary",
  "botoff", "boton",
  "botsesion", "botsession",
]);
function isPrimaryBot(sock, groupJid) {
  const primary = groupConfig.getPrimary(groupJid);
  if (!primary) return true;
  const selfForms = new Set();
  addAllForms(selfForms, sock.user?.id);
  addAllForms(selfForms, sock.user?.lid);
  const primaryForms = new Set();
  addAllForms(primaryForms, primary);
  for (const f of selfForms) {
    if (primaryForms.has(f)) return true;
  }
  return false;
}
function wantsMediaFromChat(text) {
  if (!text) return false;
  const t = text.toLowerCase().trim();
  const triggers = [
    'imagen', 'imajen', 'imagenes', 'img', 'image', 'images',
    'foto', 'fotos', 'photo', 'photos', 'picture', 'pics', 'pic',
    'video', 'videos', 'vid', 'vids', 'gif', 'gifs', 'mp4',
    'sticker', 'stikers', 'stiker', 'stickers', 'stk', 'stc',
    'multimedia', 'media', 'archivo', 'archivos', 'file',
    'animado', 'animada', 'animated', 'animacion', 'animación'
  ];
  return triggers.some(word => t.includes(word));
}
function extraerIdBoton(msg) {
  const m = msg.message;
  if (!m) return null;
  const btnResp = m.buttonsResponseMessage;
  if (btnResp?.selectedButtonId) return String(btnResp.selectedButtonId).trim();
  const listResp = m.listResponseMessage;
  if (listResp?.singleSelectReply?.selectedRowId) {
    return String(listResp.singleSelectReply.selectedRowId).trim();
  }
  const interResp = m.interactiveResponseMessage;
  if (interResp) {
    const nativeRaw = interResp.nativeFlowResponseMessage?.paramsJson;
    if (nativeRaw) {
      try {
        const parsed = JSON.parse(nativeRaw);
        if (parsed?.id) return String(parsed.id).trim();
      } catch { }
    }
    if (interResp.selectedButtonId) return String(interResp.selectedButtonId).trim();
  }
  const tplResp = m.templateButtonReplyMessage;
  if (tplResp?.selectedId) return String(tplResp.selectedId).trim();
  return null;
}
function esRespuestaBoton(msg) {
  const m = msg.message;
  if (!m) return false;
  return !!(
    m.buttonsResponseMessage ||
    m.listResponseMessage ||
    m.interactiveResponseMessage ||
    m.templateButtonReplyMessage
  );
}
function parsearBoton(rawId, prefix) {
  let sinPrefijo = rawId;
  const prefixList = Array.isArray(prefix) ? prefix : [prefix];
  const matched = prefixList.find((p) => p && sinPrefijo.startsWith(p));
  if (matched) {
    sinPrefijo = sinPrefijo.slice(matched.length);
  } else {
    sinPrefijo = sinPrefijo.replace(/^[.#/!]/, "");
  }
  sinPrefijo = sinPrefijo.trim();
  const parts = sinPrefijo.split(/\s+/);
  const command = parts.shift()?.toLowerCase() || "";
  const args = parts;
  const text = args.join(" ");
  return { command, args, text };
}
async function findLastMediaInChat(sock, remoteJid, limit = 50) {
  try {
    const messages = await sock.loadMessages(remoteJid, limit);
    if (!messages || messages.length === 0) return null;
    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i];
      if (!msg.message) continue;
      if (msg.message.imageMessage) {
        return {
          media: msg.message.imageMessage,
          mime: msg.message.imageMessage.mimetype || 'image/jpeg',
          type: 'imagen'
        };
      }
      if (msg.message.videoMessage && !msg.message.videoMessage.gifPlayback) {
        return {
          media: msg.message.videoMessage,
          mime: msg.message.videoMessage.mimetype || 'video/mp4',
          type: 'video'
        };
      }
      if (msg.message.stickerMessage) {
        return {
          media: msg.message.stickerMessage,
          mime: msg.message.stickerMessage.mimetype || 'image/webp',
          type: 'sticker'
        };
      }
      if (msg.message.videoMessage?.gifPlayback) {
        return {
          media: msg.message.videoMessage,
          mime: msg.message.videoMessage.mimetype || 'video/mp4',
          type: 'gif'
        };
      }
    }
    return null;
  } catch (error) {
    console.error('[findLastMediaInChat] Error:', error.message);
    return null;
  }
}
function senderNumberOf(jid) {
  return jid?.split("@")[0]?.split(":")[0];
}
function isGlobalOwner(sock, msg, senderRaw) {
  const senderNum = senderNumberOf(senderRaw);
  return !!(
    (msg.key.fromMe && !sock.isSubBot) ||
    global.owners?.some(([num]) => num === senderNum)
  );
}
function isOwnerSender(sock, msg, senderRaw) {
  const senderNum = senderNumberOf(senderRaw);
  const selfNum = senderNumberOf(sock.user?.id);
  return !!(
    msg.key.fromMe ||
    global.owners?.some(([num]) => num === senderNum) ||
    sock.subconfig?.owners?.includes(senderNum) ||
    selfNum === senderNum
  );
}
export function createHandler(sock, plugins) {
  const commandMap = new Map();
  for (const plugin of plugins) {
    const commands = Array.isArray(plugin.command) ? plugin.command : [plugin.command];
    for (const cmd of commands) {
      commandMap.set(cmd.toLowerCase(), plugin);
    }
  }
  if (!sock._groupEventsAttached) {
    handleGroupEvents(sock);
    sock._groupEventsAttached = true;
  }
  const processedIds = new Map();
  const DEDUPE_TTL = 60_000;
  function alreadyProcessed(id) {
    if (!id) return false;
    const now = Date.now();
    if (processedIds.size > 500) {
      for (const [k, ts] of processedIds) {
        if (now - ts > DEDUPE_TTL) processedIds.delete(k);
      }
    }
    if (processedIds.has(id)) return true;
    processedIds.set(id, now);
    return false;
  }
  return async function handler({ messages, type }) {
    if (type !== "notify") return;
    for (const msg of messages) {
      if (!msg.message) continue;
      if (alreadyProcessed(msg.key.id)) continue;
      const remoteJid = msg.key.remoteJid;
      if (!remoteJid) continue;
      const isGroup = remoteJid.endsWith("@g.us");
      const isPrivate = !isGroup && (
        remoteJid.endsWith("@s.whatsapp.net") || remoteJid.endsWith("@lid")
      );
      if (msg.key.fromMe && isGroup) continue;
      if (isGroup) {
        const moderationSender = normalizeJid(msg.key.participant || remoteJid)
          || (msg.key.participant || remoteJid);
        if (muteManager.isMuted(remoteJid, moderationSender)) {
          try {
            await sock.sendMessage(remoteJid, { delete: msg.key });
          } catch (e) {
            console.error('[Mute] No se pudo eliminar el mensaje:', e.message);
          }
          continue;
        }
        if (antilinkManager.isEnabled(remoteJid)) {
          const textoMsg = (
            msg.message?.conversation ||
            msg.message?.extendedTextMessage?.text ||
            msg.message?.imageMessage?.caption ||
            msg.message?.videoMessage?.caption ||
            ""
          );
          const linkDetectado = antilinkManager.matchLink(remoteJid, textoMsg);
          if (linkDetectado) {
            let senderIsExempt = false;
            try {
              senderIsExempt = await adminManager.isAdmin(sock, remoteJid, moderationSender);
            } catch {
              senderIsExempt = false;
            }
            const senderNum = moderationSender?.split("@")[0]?.split(":")[0];
            const isOwnerSender = global.owners?.some(([num]) => num === senderNum);
            if (!senderIsExempt && !isOwnerSender) {
              try {
                await sock.sendMessage(remoteJid, { delete: msg.key });
              } catch (e) {
                console.error('[Antilink] No se pudo eliminar el mensaje:', e.message);
              }
              const max = global.maxWarns ?? 3;
              const total = warns.add(remoteJid, moderationSender);
              if (total >= max) {
                warns.reset(remoteJid, moderationSender);
                await sock.sendMessage(remoteJid, {
                  text: `🚫 +${senderNum} envió un link prohibido (*${linkDetectado}*) y alcanzó ${max} avisos: fue expulsado.`,
                  mentions: [moderationSender],
                });
                await sock.groupParticipantsUpdate(remoteJid, [moderationSender], "remove").catch(() => { });
              } else {
                await sock.sendMessage(remoteJid, {
                  text: `🔗🚫 +${senderNum} envió un link no permitido (*${linkDetectado}*). Aviso ${total}/${max}.`,
                  mentions: [moderationSender],
                });
              }
              continue;
            }
          }
        }
      }
      const botonId = extraerIdBoton(msg);
      const isBotonClick = !!botonId;
      const body = (
        botonId ||
        msg.message?.conversation ||
        msg.message?.extendedTextMessage?.text ||
        msg.message?.imageMessage?.caption ||
        msg.message?.videoMessage?.caption ||
        msg.message?.documentMessage?.caption ||
        ""
      ).trim();
      const senderRaw = msg.key.fromMe
        ? sock.user?.id
        : (msg.key.participant || msg.key.remoteJid);
      const mentions = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      if (mentions.length > 0 && isGroup) {
        await checkAfkMentions({
          sock,
          msg,
          remoteJid,
          mentions,
          reply: async (text, opts = {}) => {
            try {
              await sock.sendMessage(remoteJid, { text, ...opts }, { quoted: msg });
            } catch (e) {
              console.error('[AFK Detector] Error:', e.message);
            }
          }
        });
      }
      const prefix = sock.prefix || (global.prefix ?? "!");
      let matchedPrefix;
      let command;
      let args;
      let text;
      if (isBotonClick) {
        if (!body) continue;
        const parsedBoton = parsearBoton(body, prefix);
        command = parsedBoton.command;
        args = parsedBoton.args;
        text = parsedBoton.text;
        matchedPrefix = Array.isArray(prefix) ? (prefix[0] ?? "!") : (prefix ?? "!");
        if (!command) continue;
      } else {
        matchedPrefix = Array.isArray(prefix)
          ? prefix.find((p) => body.startsWith(p))
          : body.startsWith(prefix) ? prefix : undefined;
      }
      printMessage({
        remoteJid,
        senderRaw,
        body,
        isCommand: isBotonClick || !!matchedPrefix,
        botname: sock.botname || global.botname,
      });
      if (!isBotonClick) {
        if (!matchedPrefix) continue;
        const parts = body.slice(matchedPrefix.length).trim().split(/\s+/);
        const rawCmd = parts[0];
        if (!rawCmd) continue;
        command = rawCmd.toLowerCase();
        args = parts.slice(1);
        text = args.join(" ");
      }
      if (isGroup && !ALWAYS_RUN.has(command)) {
        if (!isSessionEnabled() || !groupConfig.isBotEnabled(remoteJid)) continue;
        if (!isPrimaryBot(sock, remoteJid)) continue;
        if (adminManager.isAdminModeEnabled(remoteJid)) {
          let senderIsAdmin = false;
          try {
            senderIsAdmin = msg.key.fromMe || await adminManager.isAdmin(sock, remoteJid, senderRaw);
          } catch {
            senderIsAdmin = false;
          }
          if (!senderIsAdmin) continue;
        }
      }
      const plugin = commandMap.get(command);
      if (!plugin) {
        const fallbackPrefix = Array.isArray(prefix) ? prefix[0] : (prefix ?? "!");
        try {
          const sendOpts = isPrivate ? {} : { quoted: msg };
          await sock.sendMessage(
            remoteJid,
            {
              text: `❌ El comando *${matchedPrefix}${command}* no existe.\n\n💡 Usa *${fallbackPrefix}menu* para ver los comandos disponibles.`,
            },
            sendOpts
          );
        } catch { }
        continue;
      }
      const reply = async (responseText) => {
        try {
          const sendOpts = isPrivate ? {} : { quoted: msg };
          const result = await sock.sendMessage(
            remoteJid,
            { text: responseText },
            sendOpts
          );
          return result;
        } catch (e) {
          console.error(`[Reply Error]`, e.message);
          try {
            return await sock.sendMessage(remoteJid, { text: responseText });
          } catch (e2) {
            console.error(`[Reply Fallback Error]`, e2.message);
          }
        }
      };
      sock.reply = async (jid, text, quotedMsg) => {
        try {
          const opts = quotedMsg ? { quoted: quotedMsg } : {};
          return await sock.sendMessage(jid, { text }, opts);
        } catch (e) {
          console.error(`[sock.reply Error]`, e.message);
        }
      };
      const globalRestricted = getGlobalRestricted();
      if (globalRestricted.includes(command)) {
        const isGlobalOwnerSender = isGlobalOwner(sock, msg, senderRaw);
        if (!isGlobalOwnerSender) {
          await reply(
            `🌐🔧 *${matchedPrefix}${command}* está en *mantenimiento global*.\n\n` +
            `> _Este comando no está disponible en ningún grupo por el momento._`
          );
          continue;
        }
      }
      if (isGroup && groupConfig.isRestricted(remoteJid, command)) {
        if (!isOwnerSender(sock, msg, senderRaw)) {
          await reply(
            `🔧 *${matchedPrefix}${command}* está temporalmente en *mantenimiento*.\n\n> _Este comando no está disponible por el momento._`
          );
          continue;
        }
      }
      if (plugin.groupOnly && !isGroup) {
        await reply("⚠️ Este comando solo se puede usar en *grupos*.");
        continue;
      }
      if (plugin.privateOnly && !isPrivate) {
        await reply("⚠️ Este comando solo se puede usar en *chat privado* conmigo.");
        continue;
      }
      let isSenderAdmin = false;
      let isBotAdmin = false;
      if (plugin.adminOnly || plugin.botAdmin) {
        if (isGroup) {
          try {
            [isSenderAdmin, isBotAdmin] = await Promise.all([
              plugin.adminOnly
                ? adminManager.isAdmin(sock, remoteJid, senderRaw)
                : Promise.resolve(false),
              plugin.botAdmin
                ? adminManager.isBotAdmin(sock, remoteJid)
                : Promise.resolve(false),
            ]);
          } catch (err) {
            console.error(`[Admin Check Error]`, err.message);
            await reply("❌ Error al verificar permisos de administrador.");
            continue;
          }
          if (plugin.adminOnly && !isSenderAdmin) {
            await reply("⚠️ Solo *administradores* pueden usar este comando.");
            continue;
          }
          if (plugin.botAdmin && !isBotAdmin) {
            await reply("⚠️ El bot necesita ser *administrador* para ejecutar esto.");
            continue;
          }
        } else {
          if (plugin.adminOnly) {
            if (!isOwnerSender(sock, msg, senderRaw)) {
              await reply("⚠️ Este comando requiere permisos de *owner*.");
              continue;
            }
            isSenderAdmin = true;
          }
          isBotAdmin = true;
        }
      }
      if (plugin.ownerOnly) {
        if (!isOwnerSender(sock, msg, senderRaw)) {
          await reply("⚠️ Solo mi *owner* puede usar este comando.");
          continue;
        }
      }
      if (plugin.modsOnly) {
        const senderNum = senderNumberOf(senderRaw);
        const isMod =
          msg.key.fromMe ||
          global.mods?.includes(senderNum) ||
          sock.subconfig?.mods?.includes(senderNum);
        if (!isMod) {
          await reply("⚠️ Solo *moderadores* pueden usar este comando.");
          continue;
        }
      }
      if (plugin.premiumOnly) {
        const senderNum = senderNumberOf(senderRaw);
        const isPremium =
          msg.key.fromMe ||
          global.premiumUsers?.includes(senderNum) ||
          sock.subconfig?.premium?.includes(senderNum) ||
          (global.db?.get && (await global.db.get(`premium_${senderNum}`)));
        if (!isPremium) {
          await reply("⭐ Este comando es solo para usuarios *premium*.");
          continue;
        }
      }
      let quotedMediaFromChat = null;
      if (['sticker', 's', 'stiker'].includes(command)) {
        const hasDirectMedia = msg.message?.imageMessage ||
          msg.message?.videoMessage ||
          msg.message?.stickerMessage;
        const quotedMsg = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const hasQuotedMedia = quotedMsg?.imageMessage ||
          quotedMsg?.videoMessage ||
          quotedMsg?.stickerMessage;
        if (!hasDirectMedia && !hasQuotedMedia && wantsMediaFromChat(text)) {
          console.log('🔍 Buscando media en el chat porque el usuario mencionó:', text);
          const foundMedia = await findLastMediaInChat(sock, remoteJid);
          if (foundMedia) {
            quotedMediaFromChat = foundMedia;
            console.log(`✅ Media encontrada: ${foundMedia.type}`);
          } else {
            console.log('❌ No se encontró media en el chat');
          }
        }
      }
      const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage || null;
      const ctx = {
        sock,
        m: msg,
        msg,
        remoteJid,
        isGroup,
        isPrivate,
        senderRaw,
        sender: senderRaw,
        command,
        usedPrefix: matchedPrefix,
        args,
        text,
        isSenderAdmin,
        isBotAdmin,
        reply,
        quoted,
        quotedMediaFromChat,
        jidToNumber,
        normalizeJid,
        warns,
        getTarget,
        adminManager,
        groupConfig,
        botname: sock.botname || global.botname,
        icono: sock.icono || global.icono,
        logo: sock.logo || global.logo,
        wm: sock.wm || global.wm,
        dev: sock.dev || global.dev,
        isOwner: (jid) => {
          const senderNum = senderNumberOf(jid);
          if (global.owners?.some(([num]) => num === senderNum)) return true;
          if (sock.subconfig?.owners?.includes(senderNum)) return true;
          const selfNum = senderNumberOf(sock.user?.id);
          if (selfNum === senderNum) return true;
          return false;
        },
      };
      try {
        await plugin.execute(ctx);
      } catch (err) {
        console.error(`[Handler] Error en "${command}":`, err.message);
        await reply("❌ Error al ejecutar el comando.");
      }
    }
  };
}