import { downloadContentFromMessage } from "@fer2809fl/baileys";

export default [
  {
    command: ["read", "reenviar", "ver"],
    description: "📤 Reenvía el multimedia de un mensaje respondido (imagen, video, audio, sticker, documento o GIF).",
    async execute({ sock, msg, remoteJid, reply }) {
      const ctx = msg.message?.extendedTextMessage?.contextInfo;
      const quoted = ctx?.quotedMessage;

      if (!quoted) {
        return reply(
          `\`📤 REENVIAR\`\n\n\`✘ ERROR ›\` Responde a un mensaje con imagen, video, audio, sticker, documento o GIF para reenviarlo.`
        );
      }

      let mediaObj, type, caption = "";

      if (quoted.imageMessage) {
        mediaObj = quoted.imageMessage;
        type = "image";
        caption = mediaObj.caption || "";
      } else if (quoted.videoMessage) {
        mediaObj = quoted.videoMessage;
        type = "video";
        caption = mediaObj.caption || "";
      } else if (quoted.audioMessage) {
        mediaObj = quoted.audioMessage;
        type = "audio";
      } else if (quoted.stickerMessage) {
        mediaObj = quoted.stickerMessage;
        type = "sticker";
      } else if (quoted.documentMessage) {
        mediaObj = quoted.documentMessage;
        type = "document";
        caption = mediaObj.caption || "";
      } else if (quoted.gifMessage) {
        mediaObj = quoted.gifMessage;
        type = "video";
        caption = mediaObj.caption || "";
      } else {
        return reply(
          `\`📤 REENVIAR\`\n\n\`✘ ERROR ›\` El mensaje respondido no contiene multimedia compatible.`
        );
      }

      try {
        await sock.sendMessage(remoteJid, { react: { text: "🕒", key: msg.key } });

        const stream = await downloadContentFromMessage(mediaObj, type);
        const chunks = [];
        for await (const c of stream) chunks.push(c);
        const buf = Buffer.concat(chunks);

        const mime = mediaObj.mimetype || "application/octet-stream";
        const ext = mime.split("/")[1]?.split(";")[0] || "bin";
        const fileName = mediaObj.fileName || `file-${Date.now()}.${ext}`;

        if (type === "image") {
          await sock.sendMessage(remoteJid, { image: buf, caption: caption || undefined }, { quoted: msg });
        } else if (type === "video") {
          const isGif = /gif/.test(mime);
          if (isGif) {
            await sock.sendMessage(
              remoteJid,
              { video: buf, mimetype: "video/mp4", gifPlayback: true, caption: caption || undefined },
              { quoted: msg }
            );
          } else {
            await sock.sendMessage(remoteJid, { video: buf, caption: caption || undefined }, { quoted: msg });
          }
        } else if (type === "audio") {
          const isVoice = mediaObj.ptt || false;
          await sock.sendMessage(remoteJid, { audio: buf, mimetype: "audio/mp4", ptt: isVoice }, { quoted: msg });
        } else if (type === "sticker") {
          await sock.sendMessage(remoteJid, { sticker: buf }, { quoted: msg });
        } else if (type === "document") {
          await sock.sendMessage(
            remoteJid,
            { document: buf, mimetype: mime, fileName, caption: caption || undefined },
            { quoted: msg }
          );
        }

        await sock.sendMessage(remoteJid, { react: { text: "✔️", key: msg.key } });
      } catch (e) {
        console.error("Error en read:", e);
        await sock.sendMessage(remoteJid, { react: { text: "✖️", key: msg.key } });
        await reply(`\`📤 REENVIAR\`\n\n\`✘ ERROR ›\` ${e.message}`);
      }
    },
  },
];