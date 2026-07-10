// src/commands/AI/imagen.js

const fetchBuffer = async (url, timeout = 45000) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try {
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timer);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return Buffer.from(await res.arrayBuffer());
    } catch (err) {
        clearTimeout(timer);
        throw err;
    }
};

const fetchJson = async (url, timeout = 20000) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try {
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timer);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
    } catch (err) {
        clearTimeout(timer);
        throw err;
    }
};

const firstSuccessfulPromise = (promises) => Promise.any(promises);

export default [
    {
        command: ['imagen', 'img', 'iaimg', 'draw', 'dalle', 'foto'],
        description: 'Genera imágenes con IA',
        category: 'AI',

        async execute({ sock, remoteJid, reply, text }) {
            const prompt = text?.trim();
            if (!prompt) {
                return reply(
                    '⚠️ *Falta descripción*\n\n' +
                    '> Escribe qué imagen quieres que genere.\n\n' +
                    '*Ejemplo:* .imagen un gato astronauta en el espacio'
                );
            }

            await sock.sendMessage(remoteJid, { react: { text: '🎨', key: { remoteJid } } });

            const encoded = encodeURIComponent(prompt);

            const directImageUrls = [
                `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=1024&nologo=true&seed=${Date.now()}`,
                `https://ai-image.vercel.app/api/generate?prompt=${encoded}`,
                `https://api.picsart.io/genai/text2image?prompt=${encoded}&width=1024&height=1024`
            ];

            const jsonImageUrls = [
                `https://api.delirius.store/ai/text2img?prompt=${encoded}`,
                `https://api.alyacore.xyz/ai/text2img?text=${encoded}&key=oboe`
            ];

            try {
                await sock.sendMessage(remoteJid, { react: { text: '⏳', key: { remoteJid } } });

                try {
                    const imageBuffer = await firstSuccessfulPromise(
                        directImageUrls.map(url => fetchBuffer(url, 45000))
                    );

                    await sock.sendMessage(remoteJid, { react: { text: '✅', key: { remoteJid } } });

                    return sock.sendMessage(remoteJid, { image: imageBuffer });

                } catch (directErr) {
                    const res = await firstSuccessfulPromise(
                        jsonImageUrls.map(url => fetchJson(url, 20000))
                    );

                    const imageUrl =
                        res.result ||
                        res.url ||
                        res.image ||
                        res.data?.url ||
                        res.data?.image ||
                        res.data?.result ||
                        res.link;

                    if (!imageUrl) throw new Error('No se obtuvo URL de imagen');

                    const imageBuffer = await fetchBuffer(imageUrl, 30000);

                    await sock.sendMessage(remoteJid, { react: { text: '✅', key: { remoteJid } } });

                    return sock.sendMessage(remoteJid, { image: imageBuffer });
                }

            } catch (err) {
                await sock.sendMessage(remoteJid, { react: { text: '❌', key: { remoteJid } } });
                return reply(
                    `❌ *Error:* No se pudo generar la imagen.\n\n` +
                    `> ${err.message || err}\n\n` +
                    `💡 *Tip:* Intenta con una descripción más simple o en inglés.`
                );
            }
        }
    }
];