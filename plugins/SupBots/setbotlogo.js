import { loadSubConfig, saveSubConfig } from "../../src/subbotManager.js";

export default {
    command: ["setbotlogo"],
    description: "Cambia el logo del bot.",
    async execute(ctx) {
        const isBotOwner = ctx.isOwner(ctx.senderRaw) || (ctx.jidToNumber(ctx.senderRaw) === ctx.jidToNumber(ctx.sock.user.id));
        if (!isBotOwner) {
            return ctx.reply("⚠️ Solo el dueño de esta sesión de bot puede usar este comando.");
        }

        if (!ctx.text) {
            return ctx.reply("⚠️ Ingresa la URL de la nueva imagen de logo.");
        }

        try {
            const selfNum = ctx.sock.user.id.split(":")[0].split("@")[0];
            const config = loadSubConfig(selfNum);
            config.logo = ctx.text.trim();
            saveSubConfig(selfNum, config);

            await ctx.reply("✅ Logo del bot cambiado exitosamente.");
        } catch (err) {
            console.error("Error al cambiar logo:", err);
            await ctx.reply("❌ Ocurrió un error al intentar cambiar el logo.");
        }
    }
};
