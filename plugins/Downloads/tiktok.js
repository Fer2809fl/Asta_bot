import axios from "axios";
import { generateWAMessageFromContent, generateWAMessage, jidNormalizedUser } from "@fer2809fl/baileys";
import crypto from "crypto";
import { downloadToTmp, cleanTmp, react, firstSuccessful, UA_HEADER } from "../../src/downloader.js";

const FAA_URL = "https://api-faa.my.id/";
const DELIRIUS_URL = "https://api.delirius.store/";

const TIKTOK_REGEX = /^(https?:\/\/)?(www\.|vm\.|vt\.)?tiktok\.com\/.*$/i;

const getFirstValue = (...values) => values.find(v => v !== undefined && v !== null);
const getFirstNonEmpty = (...values) => values.find(v => v !== undefined && v !== null && v !== "");
const getFirstUrl = (value) => {
    if (!value) return null;
    if (typeof value === "string") return value;
    if (Array.isArray(value)) return value[0];
    if (value.url_list && Array.isArray(value.url_list)) return value.url_list[0];
    return null;
};

const normalizeDuration = (value) => {
    if (value === undefined || value === null) return 0;
    const raw = String(value).trim();
    const match = raw.match(/(\d+(?:\.\d+)?)/);
    if (!match) return 0;
    const numero = Number(match[0]);
    if (!Number.isFinite(numero) || numero <= 0) return 0;
    return numero > 1000 ? Math.round(numero / 1000) : Math.round(numero);
};

const parseDelimitedNumber = (value) => {
    if (value === undefined || value === null) return 0;
    const raw = String(value).trim();
    if (!raw) return 0;
    if (/^\d{1,3}(?:\.\d{3})+$/.test(raw)) {
        return Number(raw.replace(/\./g, ""));
    }
    const normalized = raw.replace(/,/g, "");
    const numero = Number(normalized);
    return Number.isFinite(numero) ? numero : 0;
};

const formatNumbers = (num) => {
    if (num === undefined || num === null || num === "") return "0";
    const n = Number(num);
    if (!Number.isFinite(n)) return "0";
    if (n >= 1e9) return (n / 1e9).toFixed(1).replace(/\.0$/, "") + "B";
    if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
    if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
    return String(n);
};

async function sendAlbumMessage(sock, jid, array, quoted) {
  const userJid = jidNormalizedUser(sock.user?.id || sock.authState?.creds?.me?.id || "");
  const album = await generateWAMessageFromContent(jid, {
    messageContextInfo: { messageSecret: crypto.randomBytes(32) },
    albumMessage: {
      expectedImageCount: array.filter((a) => "image" in a).length,
      expectedVideoCount: array.filter((a) => "video" in a).length,
    },
  }, { quoted, userJid });

  await sock.relayMessage(jid, album.message, { messageId: album.key.id });

  for (const item of array) {
    const img = await generateWAMessage(jid, item, { upload: sock.waUploadToServer, userJid });
    img.message.messageContextInfo = {
      messageSecret: crypto.randomBytes(32),
      messageAssociation: { associationType: 1, parentMessageKey: album.key },
    };
    await sock.relayMessage(jid, img.message, { messageId: img.key.id });
  }
  return album;
}

async function searchDelirius(query) {
    const res = await axios.get(`${DELIRIUS_URL}search/tiktoksearch?query=${encodeURIComponent(query)}`, {
        timeout: 20000,
        headers: { "User-Agent": UA_HEADER }
    });
    const videos = res.data?.meta;
    if (!videos || videos.length === 0) throw new Error("No se encontraron videos");
    return videos.slice(0, 5).map(video => ({
        url: video.url,
        title: video.title || "",
        author: video.author?.nickname || video.author?.username || "TikTok User",
        views: formatNumbers(parseDelimitedNumber(video.play || 0)),
        likes: formatNumbers(parseDelimitedNumber(video.like || 0)),
        duration: normalizeDuration(video.duration || video.videoDuration || video.dur || 0),
        cover: video.hd || video.cover || video.author?.avatar || ""
    }));
}

async function searchFaa(query) {
    const res = await axios.get(`${FAA_URL}faa/tiktok-search?q=${encodeURIComponent(query)}`, {
        timeout: 20000,
        headers: { "User-Agent": UA_HEADER }
    });
    const videos = res.data?.result;
    if (!videos || videos.length === 0) throw new Error("No se encontraron videos");
    return videos.slice(0, 5).map(first => {
        const username = first.author?.username || "";
        const id = first.id || "";
        return {
            url: username && id ? `https://www.tiktok.com/@${username}/video/${id}` : "",
            title: first.title || "",
            author: first.author?.nickname || username || "TikTok User",
            views: formatNumbers(first.stats?.views || 0),
            likes: formatNumbers(first.stats?.likes || 0),
            duration: normalizeDuration(first.duration || first.dur || first.stats?.duration || 0),
            cover: first.cover || ""
        };
    }).filter(v => v.url);
}

async function searchTikTok(query) {
    return firstSuccessful([
        searchDelirius(query),
        searchFaa(query)
    ]);
}

async function downloadDelirius(url) {
    const res = await axios.get(`${DELIRIUS_URL}download/tiktok?url=${encodeURIComponent(url)}`, {
        timeout: 30000,
        headers: { "User-Agent": UA_HEADER }
    });
    const data = res.data?.data;
    if (!data) throw new Error("Sin datos");

    let videoUrl = null;
    if (data.meta?.media && Array.isArray(data.meta.media)) {
        const videoMedia = data.meta.media.find(m => m.type === "video");
        videoUrl = videoMedia?.org || videoMedia?.hd || videoMedia?.wm;
    }
    videoUrl = videoUrl || data.url;

    if (!videoUrl) throw new Error("No se encontro URL de video");

    return {
        id: data.id || `tiktok_${Date.now()}`,
        title: data.title || "",
        author: data.author?.nickname || data.author?.username || "TikTok User",
        cover: data.cover || "",
        views: formatNumbers(parseDelimitedNumber(data.repro || 0)),
        likes: formatNumbers(parseDelimitedNumber(data.like || 0)),
        videoUrl,
        audioUrl: data.music?.playUrl?.[0] || data.music?.url,
        duration: normalizeDuration(data.duration || 0)
    };
}

async function downloadFaa(url) {
    const res = await axios.get(`${FAA_URL}faa/tiktok?url=${encodeURIComponent(url)}`, {
        timeout: 30000,
        headers: { "User-Agent": UA_HEADER }
    });
    const result = res.data?.result;
    if (!result) throw new Error("Sin resultado");

    const videoUrl = result.alternatives?.selected || result.data || result.url;
    if (!videoUrl) throw new Error("No se encontro URL de video");

    return {
        id: result.id || `tiktok_${Date.now()}`,
        title: result.title || "",
        author: result.author?.nickname || result.author?.username || "TikTok User",
        cover: result.cover || "",
        views: formatNumbers(result.stats?.views || 0),
        likes: formatNumbers(result.stats?.likes || 0),
        videoUrl,
        audioUrl: result.music_info?.url,
        duration: result.duration ? normalizeDuration(parseInt(String(result.duration).match(/\d+/)?.[0] || 0)) : 0
    };
}

async function getDownloadInfo(url) {
    return firstSuccessful([
        downloadDelirius(url),
        downloadFaa(url)
    ]);
}

export default [
    {
        command: ["tt", "tiktok", "ttdl", "tiktokdl"],
        description: "Descarga un video de TikTok (URL) o busca videos por nombre.",
        async execute({ sock, msg, remoteJid, text, usedPrefix, command }) {
            const tmpFiles = [];
            try {
                if (!text) {
                    return sock.sendMessage(remoteJid, {
                        text: `Por favor ingresa una URL de TikTok o termino de busqueda.

Uso: ${usedPrefix}${command} <url o nombre>`
                    }, { quoted: msg });
                }

                await react(sock, remoteJid, msg, "⏳");

                const inputStr = text.trim();

                if (TIKTOK_REGEX.test(inputStr)) {
                    // It's a single direct video URL
                    const info = await getDownloadInfo(inputStr);
                    const tmpFile = await downloadToTmp(info.videoUrl, "mp4", "asta-tt");
                    tmpFiles.push(tmpFile);

                    const durationStr = info.duration ? `${info.duration}s` : "N/A";
                    const caption = `🎬 *TikTok*

📌 *Título:* ${info.title || "Video de TikTok"}
👤 *Autor:* ${info.author || "TikTok User"}
⏱️ *Duración:* ${durationStr}
👁️ *Vistas:* ${info.views || "0"}
❤️ *Likes:* ${info.likes || "0"}
🔗 *Enlace:* ${inputStr}`;

                    await sock.sendMessage(remoteJid, {
                        video: { url: tmpFile },
                        mimetype: "video/mp4",
                        fileName: `${(info.title || "video").replace(/[<>:"/\\|?*]/g, "").slice(0, 50)}.mp4`,
                        caption: caption
                    }, { quoted: msg });

                    await react(sock, remoteJid, msg, "✅");
                } else {
                    // It's a search query
                    await react(sock, remoteJid, msg, "🔍");
                    const searchResults = await searchTikTok(inputStr);

                    const albumMedia = [];
                    for (const item of searchResults) {
                        try {
                            const info = await getDownloadInfo(item.url);
                            const tmpFile = await downloadToTmp(info.videoUrl, "mp4", "asta-tt");
                            tmpFiles.push(tmpFile);

                            const durationStr = info.duration ? `${info.duration}s` : (item.duration ? `${item.duration}s` : "N/A");
                            const caption = `🎬 *TikTok*

📌 *Título:* ${info.title || item.title || "Video de TikTok"}
👤 *Autor:* ${info.author || item.author || "TikTok User"}
⏱️ *Duración:* ${durationStr}
👁️ *Vistas:* ${info.views || item.views || "0"}
❤️ *Likes:* ${info.likes || item.likes || "0"}
🔗 *Enlace:* ${item.url}`;

                            albumMedia.push({
                                video: { url: tmpFile },
                                mimetype: "video/mp4",
                                fileName: `${(info.title || item.title || "video").replace(/[<>:"/\\|?*]/g, "").slice(0, 50)}.mp4`,
                                caption: caption
                            });
                        } catch (e) {
                            console.error(`Error downloading video from search result ${item.url}:`, e);
                        }
                    }

                    if (albumMedia.length === 0) {
                        throw new Error("No se encontraron videos descargables para la búsqueda.");
                    }

                    if (albumMedia.length === 1) {
                        await sock.sendMessage(remoteJid, albumMedia[0], { quoted: msg });
                    } else {
                        await sendAlbumMessage(sock, remoteJid, albumMedia, msg);
                    }

                    await react(sock, remoteJid, msg, "✅");
                }

            } catch (e) {
                await react(sock, remoteJid, msg, "❌");
                await sock.sendMessage(remoteJid, {
                    text: `Error: ${e.message || "Ocurrio un error inesperado."}`
                }, { quoted: msg });
            } finally {
                cleanTmp(...tmpFiles);
            }
        },
    },
];
