/**
 * Convierte Markdown básico a formato nativo de WhatsApp
 */
function markdownToWhatsApp(text) {
  if (!text) return "";

  return (
    text
      .replace(/```(\w+)?\n([\s\S]*?)```/g, "```\n$2```")
      .replace(/`([^`]+)`/g, "```$1```")
      .replace(/\*\*(.*?)\*\*/g, "*$1*")
      .replace(/(?<!\*)\*(?!\*)(.*?)\*(?!\*)/g, "_$1_")
      .replace(/~~(.*?)~~/g, "~$1~")
      .replace(/^#{1,6}\s+(.*)$/gm, "*$1*")
      .replace(/^[-*]\s+(.*)$/gm, "• $1")
      .replace(/^\d+\.\s+(.*)$/gm, "$1")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1: $2")
      .replace(/^---+$/gm, "──────────")
      .trim()
  );
}

// URL de la API desde variables de entorno (con fallback)
const DEEPSEEK_API_URL = process.env.DEEPSEEK_API_URL || "";
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || "sk-dummy";

export default [
  {
    command: ["ds", "ia", "deepseek", "ask"],
    description: "Consulta a DeepSeek con búsqueda web activada.",
    async execute({ sock, reply, args, message }) {
      const prompt = args?.join(" ") || message?.message?.conversation || "";

      if (!prompt.trim()) {
        return await reply(
          "🤖 *DeepSeek Chat*\n\n" +
          "Escribe tu pregunta después del comando.\n\n" +
          "*Ejemplos:*\n" +
          "• `!ds Explica la relatividad`\n" +
          "• `!ds ¿Quién es el presidente actual de Argentina?`"
        );
      }

      await reply("🔍 *DeepSeek* está buscando...");

      try {
        const response = await fetch(`${DEEPSEEK_API_URL}/v1/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
          },
          body: JSON.stringify({
            model: "deepseek-chat",
            messages: [{ role: "user", content: prompt }],
            search_enabled: true,
            temperature: 0.7,
          }),
        });

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error(err.error?.message || `Error HTTP ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;

        if (!content) {
          return await reply("⚠️ No obtuve respuesta de la IA.");
        }

        const formatted = markdownToWhatsApp(content);
        await reply(`🤖 *DeepSeek:*\n\n${formatted}`);

      } catch (error) {
        console.error("[DeepSeek Error]", error);
        await reply(`❌ *Error:* ${error.message}`);
      }
    },
  },
];
