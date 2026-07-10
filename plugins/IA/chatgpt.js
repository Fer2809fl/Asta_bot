// src/commands/AI/chatgpt.js

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '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';
const OPENROUTER_MODEL = 'openai/gpt-oss-20b:free';
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

const askOpenRouter = async (prompt, timeout = 25000) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(OPENROUTER_URL, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        // Opcionales pero recomendados por OpenRouter:
        'HTTP-Referer': 'https://github.com/Fer2809fl',
        'X-Title': 'Asta Bot'
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          { role: 'user', content: prompt }
        ]
      })
    });

    clearTimeout(timer);

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      throw new Error(`HTTP ${res.status} ${errText}`);
    }

    const data = await res.json();
    return data;
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
};

export default [
  {
    command: ['chatgpt', 'ia', 'gpt'],
    description: 'Habla con ChatGPT',
    category: 'AI',
    async execute({ sock, remoteJid, reply, text }) {
      const prompt = text?.trim();

      if (!prompt) {
        return reply('⚠️ Falta mensaje\n\n> Escribe algo para que ChatGPT pueda responderte.');
      }

      await sock.sendMessage(remoteJid, { react: { text: '🤖', key: { remoteJid } } });

      try {
        await sock.sendPresenceUpdate('composing', remoteJid);

        const data = await askOpenRouter(prompt, 25000);

        const resp = data?.choices?.[0]?.message?.content?.trim();

        if (!resp) throw new Error('La respuesta no contiene texto válido.');

        await sock.sendPresenceUpdate('paused', remoteJid);
        return reply(`🤖 *ChatGPT*\n\n${resp}`);
      } catch (error) {
        console.error('Error ChatGPT:', error);
        await sock.sendPresenceUpdate('paused', remoteJid);
        return reply(`❌ *Error:* ${error.message || error}`);
      }
    }
  }
];