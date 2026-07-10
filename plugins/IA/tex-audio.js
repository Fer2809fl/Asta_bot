// src/commands/AI/tts.js

const fetchBuffer = async (url, timeout = 30000) => {
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
        command: ['textoaudio', 'audio', 'voz', 'texto'],
        description: 'Convierte texto a audio',
        category: 'AI',

        async execute({ sock, remoteJid, reply, text }) {
            const prompt = text?.trim();
            if (!prompt) {
                return reply(
                    '⚠️ *Falta texto*\n\n' +
                    '> Escribe qué quieres que diga el audio.\n\n' +
                    '*Ejemplo:* .tts hola mundo'
                );
            }

            if (prompt.length > 500) {
                return reply('⚠️ *Texto muy largo*\n\n> Máximo 500 caracteres.');
            }

            await sock.sendMessage(remoteJid, { react: { text: '🔊', key: { remoteJid } } });

            const encoded = encodeURIComponent(prompt);

            const directAudioUrls = [
                `https://translate.google.com/translate_tts?ie=UTF-8&tl=es&client=tw-ob&q=${encoded}`,
                `https://api.voicerss.org/?key=demo&hl=es-es&src=${encoded}&r=0`,
                `https://texttospeech.responsivevoice.org/v1/text:synthesize?text=${encoded}&lang=es&engine=g1&name=&pitch=0.5&rate=0.5&volume=1&key=6eX9g8K2`
            ];

            const jsonAudioUrls = [
                `https://api.delirius.store/tts?text=${encoded}&lang=es`,
                `https://api.alyacore.xyz/ai/tts?text=${encoded}&lang=es&key=oboe`
            ];

            try {
                await sock.sendMessage(remoteJid, { react: { text: '⏳', key: { remoteJid } } });

                try {
                    const audioBuffer = await firstSuccessfulPromise(
                        directAudioUrls.map(url => fetchBuffer(url, 30000))
                    );

                    await sock.sendMessage(remoteJid, { react: { text: '✅', key: { remoteJid } } });

                    return sock.sendMessage(remoteJid, {
                        audio: audioBuffer,
                        mimetype: 'audio/mp4',
                        ptt: true
                    });

                } catch (directErr) {
                    const res = await firstSuccessfulPromise(
                        jsonAudioUrls.map(url => fetchJson(url, 20000))
                    );

                    const audioUrl =
                        res.result ||
                        res.url ||
                        res.audio ||
                        res.data?.url ||
                        res.data?.audio ||
                        res.data?.result ||
                        res.link;

                    if (!audioUrl) throw new Error('No se obtuvo URL de audio');

                    const audioBuffer = await fetchBuffer(audioUrl, 30000);

                    await sock.sendMessage(remoteJid, { react: { text: '✅', key: { remoteJid } } });

                    return sock.sendMessage(remoteJid, {
                        audio: audioBuffer,
                        mimetype: 'audio/mp4',
                        ptt: true
                    });
                }

            } catch (err) {
                await sock.sendMessage(remoteJid, { react: { text: '❌', key: { remoteJid } } });
                return reply(`❌ *Error:* ${err.message || err}`);
            }
        }
    }
];