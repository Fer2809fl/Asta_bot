// src/commands/AI/gemini.js
import { GoogleGenAI } from '@google/genai';

const AI = new GoogleGenAI({ apiKey: 'AQ.Ab8RN6LDZLJP8TRaoKvaXLRlEnv1iXhZBsovuO-JmGeJnbw4Pw' });

export default [
    {
        command: ['gemini', 'gia', 'gai', 'genai'],
        description: 'Habla con Gemini',
        category: 'AI',

        async execute({ sock, remoteJid, reply, text }) {
            const prompt = text?.trim();
            if (!prompt) return reply('⚠️ *Falta mensaje*\n\n> Escribe algo para que Gemini pueda responderte.');

            await sock.sendMessage(remoteJid, { react: { text: '🤖', key: { remoteJid } } });

            try {
                await sock.sendPresenceUpdate('composing', remoteJid);

                const res = await AI.models.generateContent({
                    model: 'gemini-3.1-flash-lite',
                    contents: prompt,
                });

                const resp = res.text;
                if (!resp) throw new Error('La respuesta no contiene texto válido.');

                await sock.sendPresenceUpdate('paused', remoteJid);
                return reply(`🤖 *Gemini*\n\n${resp}`);
            } catch (err) {
                await sock.sendPresenceUpdate('paused', remoteJid);
                return reply(`❌ *Error:* ${err.message || err}`);
            }
        }
    }
];