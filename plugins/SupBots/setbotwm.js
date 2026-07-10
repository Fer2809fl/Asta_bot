import { loadSubConfig, saveSubConfig } from "../../src/subbotManager.js";

export default {
    command: ["setbotwm"],
    description: "Cambia la marca de agua (watermark) del bot.",
    async execute(ctx) {
        const isBotOwner = ctx.isOwner(ctx.senderRaw) || (ctx.jidToNumber(ctx.senderRaw) === ctx.jidToNumber(ctx.sock.user.id));
        if (!isBotOwner) {
            return ctx.reply("⚠️ Solo el dueño de esta sesión de bot puede usar este comando.");
        }

        if (!ctx.text) {
            return ctx.reply("⚠️ Ingresa el texto de la nueva marca de agua.");
        }

        try {
            const selfNum = ctx.sock.user.id.split(":")[0].split("@")[0];
            const config = loadSubConfig(selfNum);
            config.wm = ctx.text;
            saveSubConfig(selfNum, config);

            await ctx.reply(`✅ Marca de agua cambiada exitosamente a: *${ctx.text}*`);
        } catch (err) {
            console.error("Error al cambiar marca de agua:", err);
            await ctx.reply("❌ Ocurrió un error al intentar cambiar la marca de agua.");
        }
    }
};
