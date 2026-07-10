// src/commands/AI/copilot.js

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

const extractText = (data) => {
    if (!data) return null;
    if (typeof data === 'string') return data;
    const fields = ['result', 'text', 'response', 'message', 'reply', 'answer', 'data'];
    for (const field of fields) {
        if (typeof data[field] === 'string' && data[field].trim()) return data[field].trim();
    }
    if (typeof data.data === 'object' && data.data !== null) {
        for (const field of fields) {
            if (typeof data.data[field] === 'string' && data.data[field].trim()) return data.data[field].trim();
        }
    }
    return JSON.stringify(data, null, 2);
};

export default [
    {
        command: ['copilot', 'copi', 'cpt'],
        description: 'Habla con Copilot',
        category: 'AI',

        async execute({ sock, remoteJid, reply, text }) {
            const prompt = text?.trim();
            if (!prompt) return reply('⚠️ *Falta mensaje*\n\n> Escribe algo para que Copilot pueda responderte.');

            await sock.sendMessage(remoteJid, { react: { text: '🤖', key: { remoteJid } } });

            const urls = [
                `https://api.alyacore.xyz/ai/copilot?text=${encodeURIComponent(prompt)}&key=oboe`,
                `https://api.stellarwa.xyz/ai/copilot?text=${encodeURIComponent(prompt)}&key=api-7C3jf`
            ];

            try {
                await sock.sendPresenceUpdate('composing', remoteJid);
                const res = await firstSuccessfulPromise(urls.map(url => fetchJson(url, 20000)));
                const resp = extractText(res);
                if (!resp) throw new Error('La respuesta no contiene texto válido.');

                await sock.sendPresenceUpdate('paused', remoteJid);
                return reply(`🤖 *Copilot*\n\n${resp}`);
            } catch (err) {
                await sock.sendPresenceUpdate('paused', remoteJid);
                return reply(`❌ *Error:* ${err.message || err}`);
            }
        }
    }
];