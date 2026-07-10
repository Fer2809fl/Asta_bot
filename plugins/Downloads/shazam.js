import axios from "axios";
import yts from "yt-search";
import fs from "fs";
import path from "path";
import { tmpdir } from "os";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import { downloadMediaMessage } from "@fer2809fl/baileys";
import { react } from "../../src/downloader.js";

ffmpeg.setFfmpegPath(ffmpegPath);

const token = process.env.AUDD_API_TOKEN || global.apiShazam?.apikey || "257b4fe430651b5c9fbaa9d5203531f8";

function unwrapMessage(msg) {
  if (!msg) return null;
  if (msg.audioMessage || msg.videoMessage || msg.documentMessage) return msg;
  if (msg.viewOnceMessageV2?.message) return unwrapMessage(msg.viewOnceMessageV2.message);
  if (msg.viewOnceMessage?.message) return unwrapMessage(msg.viewOnceMessage.message);
  return null;
}

export default [
  {
    command: ["shazam", "whatsong", "audd", "find"],
    description: "Identifica una canción a partir de un audio o video citado.",
    async execute({ sock, msg, remoteJid, usedPrefix, command }) {
      const contextInfo = msg.message?.extendedTextMessage?.contextInfo;
      const quotedMsg = contextInfo?.quotedMessage;

      if (!quotedMsg) {
        return sock.sendMessage(remoteJid, {
          text: `❗ Responde a un mensaje de voz/video con ${usedPrefix}${command} para identificar la canción.`
        }, { quoted: msg });
      }

      const target = unwrapMessage(quotedMsg);
      if (!target) {
        return sock.sendMessage(remoteJid, {
          text: "❗ El mensaje citado no contiene audio o video válido."
        }, { quoted: msg });
      }

      await react(sock, remoteJid, msg, "⏳");

      let tempIn = null;
      let tempOut = null;

      try {
        const quotedKey = {
          ...msg.key,
          id: contextInfo?.stanzaId || msg.key.id,
          participant: contextInfo?.participant || msg.key.participant,
        };
        const downloadMsg = { key: quotedKey, message: target };
        const buffer = await downloadMediaMessage(downloadMsg, "buffer", {}, { logger: console });
        if (!buffer || buffer.length === 0) throw new Error("No se pudo descargar el media.");

        const MAX_BYTES = 6 * 1024 * 1024;
        const MAX_SECONDS = 30;
        const isVideo = Boolean(target.videoMessage);
        const ext = isVideo ? "mp4" : "mp3";

        tempIn = path.join(tmpdir(), `asta-shazam-in-${Date.now()}.${ext}`);
        tempOut = path.join(tmpdir(), `asta-shazam-out-${Date.now()}.${ext}`);

        await fs.promises.writeFile(tempIn, buffer);

        const trimTo = (inPath, outPath, seconds) =>
          new Promise((resolve, reject) => {
            ffmpeg(inPath)
              .outputOptions(["-t " + seconds])
              .on("error", reject)
              .on("end", resolve)
              .save(outPath);
          });

        try {
          await trimTo(tempIn, tempOut, MAX_SECONDS);
        } catch {
          await fs.promises.copyFile(tempIn, tempOut);
        }

        let outBuffer = await fs.promises.readFile(tempOut);

        if (outBuffer.length > MAX_BYTES) {
          await react(sock, remoteJid, msg, "❌");
          return sock.sendMessage(remoteJid, {
            text: `❌ El archivo es demasiado grande (${Math.round(outBuffer.length / 1024 / 1024)} MB). Máx ${Math.round(MAX_BYTES / 1024 / 1024)} MB.`
          }, { quoted: msg });
        }

        const base64 = outBuffer.toString("base64");
        const params = new URLSearchParams();
        params.append("api_token", token);
        params.append("audio", base64);
        params.append("return", "spotify,apple_music");

        const res = await axios.post("https://api.audd.io/", params.toString(), {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          timeout: 30000,
        });

        const data = res.data;
        if (!data?.result) {
          await react(sock, remoteJid, msg, "❌");
          return sock.sendMessage(remoteJid, { text: "❌ No se pudo identificar la canción." }, { quoted: msg });
        }

        const r = data.result;
        const title = r.title || "Desconocido";
        const artist = r.artist || "Desconocido";
        const album = r.album || "Desconocido";
        const release = r.release_date || "";
        const genres = (r.apple_music?.genreNames || []).join(", ") || "Desconocido";
        const spotifyUrl = r.spotify?.external_urls?.spotify || null;
        const appleUrl = r.apple_music?.url || null;
        const otherLinks = r.song_link || null;

        let youtubeUrl = r.youtube?.url || (r.youtube?.videoId ? `https://youtu.be/${r.youtube.videoId}` : null);
        if (!youtubeUrl) {
          try {
            const youtubeQuery = [title, artist].filter((v) => v && v !== "Desconocido").join(" ");
            if (youtubeQuery) {
              const searchResults = await yts(youtubeQuery);
              if (searchResults?.videos?.length) youtubeUrl = searchResults.videos[0].url;
            }
          } catch {}
        }

        let image = null;
        if (r.spotify?.album?.images?.length) image = r.spotify.album.images[0].url;
        if (!image && r.apple_music?.artwork?.url) image = r.apple_music.artwork.url.replace("{w}x{h}", "800x800");

        let text = `🔍 *SHAZAM RESULT*\n\n`;
        text += `🎵 *${title}*\n\n`;
        text += `👤 *Artista:* ${artist}\n`;
        text += `💿 *Álbum:* ${album}${release ? ` - ${release}` : ""}\n`;
        text += `🎼 *Género:* ${genres}\n\n`;
        text += `▶️ *Spotify:* ${spotifyUrl || "No disponible"}\n`;
        text += `🍎 *Apple Music:* ${appleUrl || "No disponible"}\n`;
        text += `▶️ *YouTube:* ${youtubeUrl || "No disponible"}\n`;
        text += `🔗 *Más apps:* ${otherLinks || "No disponible"}`;

        if (image) {
          await sock.sendMessage(remoteJid, { image: { url: image }, caption: text }, { quoted: msg });
        } else {
          await sock.sendMessage(remoteJid, { text }, { quoted: msg });
        }

        await react(sock, remoteJid, msg, "✅");
      } catch (err) {
        console.error("[shazam] Error:", err.message);
        await react(sock, remoteJid, msg, "❌");
        await sock.sendMessage(remoteJid, {
          text: `❌ Error al identificar: ${err.message || err}`
        }, { quoted: msg });
      } finally {
        for (const f of [tempIn, tempOut]) {
          if (f && fs.existsSync(f)) {
            try { fs.unlinkSync(f); } catch {}
          }
        }
      }
    },
  },
];
