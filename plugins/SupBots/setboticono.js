import { loadSubConfig, saveSubConfig } from "../../src/subbotManager.js";

export default {
    command: ["setboticono", "setboticon"],
    description: "Cambia el icono (emoji) del bot.",
    async execute(ctx) {
        const isBotOwner = ctx.isOwner(ctx.senderRaw) || (ctx.jidToNumber(ctx.senderRaw) === ctx.jidToNumber(ctx.sock.user.id));
        if (!isBotOwner) {
            return ctx.reply("⚠️ Solo el dueño de esta sesión de bot puede usar este comando.");
        }

        if (!ctx.text) {
            return ctx.reply("⚠️ Ingresa el nuevo emoji del icono.");
        }

        try {
            const selfNum = ctx.sock.user.id.split(":")[0].split("@")[0];
            const config = loadSubConfig(selfNum);
            config.icono = ctx.text.trim();
            saveSubConfig(selfNum, config);

            await ctx.reply(`✅ Icono del bot cambiado exitosamente a: *${ctx.text.trim()}*`);
        } catch (err) {
            console.error("Error al cambiar icono:", err);
            await ctx.reply("❌ Ocurrió un error al intentar cambiar el icono.");
        }
    }
};
