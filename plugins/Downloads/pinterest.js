import { generateWAMessageFromContent, generateWAMessage, jidNormalizedUser } from "@fer2809fl/baileys";
import crypto from "crypto";
import { fetchJson, react, firstSuccessful } from "../../src/downloader.js";

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

export default [
  {
    command: ["pin", "pinterest"],
    description: "Busca imágenes en Pinterest por palabra clave.",
    async execute({ sock, msg, remoteJid, args }) {
      const query = args.join(" ").trim();

      if (!query) {
        return sock.sendMessage(remoteJid, {
          text: "❌ Falta la búsqueda\nProporciona una consulta para buscar en Pinterest."
        }, { quoted: msg });
      }

      await react(sock, remoteJid, msg, "🔍");

      const apiCalls = [
        fetchJson(`https://api.stellarwa.xyz/search/pinterest?query=${encodeURIComponent(query)}&key=api-7dSKm`).then((r) => ({ source: "StellarWA", data: r.data || r.data?.data })),
        fetchJson(`https://rest.apicausas.xyz/api/v1/buscadores/pinterest?apikey=oboe&q=${encodeURIComponent(query)}`).then((r) => ({ source: "Api Causas", data: r.data })),
        fetchJson(`https://api.delirius.store/search/pinterestv2?text=${encodeURIComponent(query)}`).then((r) => ({ source: "Delirius", data: r.data })),
      ];

      let result;
      try {
        result = await firstSuccessful(apiCalls);
      } catch {
        await react(sock, remoteJid, msg, "❌");
        return sock.sendMessage(remoteJid, {
          text: "❌ Error de búsqueda\nNo se pudieron obtener resultados de ninguna API."
        }, { quoted: msg });
      }

      const items = (result.data || []).slice(0, 10);
      if (!items.length) {
        await react(sock, remoteJid, msg, "❌");
        return sock.sendMessage(remoteJid, {
          text: `❌ Sin resultados\nNo se encontraron imágenes para "${query}" en Pinterest.`
        }, { quoted: msg });
      }

      let captionText = `📌 *PINTEREST SEARCH*\n\n`;
      captionText += `🔍 *Pin:* ${query}\n`;
      captionText += `⚙️ *Motor:* ${result.source || "Desconocido"}`;

      const mediaArray = items
        .map((item) => ({ url: item.hd || item.image || item.image_small || "" }))
        .filter((m) => m.url);

      const album = mediaArray.map((m, i) => ({ image: { url: m.url }, caption: i === 0 ? captionText : "" }));

      await sendAlbumMessage(sock, remoteJid, album, msg);
      await react(sock, remoteJid, msg, "✅");
    },
  },
];
