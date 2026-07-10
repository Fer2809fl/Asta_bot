import { loadSubConfig, saveSubConfig } from "../../src/subbotManager.js";

export default {
    command: ["delowner", "eliminarowner"],
    description: "Elimina un dueño secundario de la sesión del sub-bot.",
    async execute(ctx) {
        const isBotOwner = ctx.isOwner(ctx.senderRaw) ||
            (ctx.jidToNumber(ctx.senderRaw) === ctx.jidToNumber(ctx.sock.user.id));
        if (!isBotOwner) {
            return ctx.reply("⚠️ Solo el dueño de esta sesión de bot puede usar este comando.");
        }

        // Fix: getTarget espera args (array), no text (string)
        const { jid: targetJid } = ctx.getTarget(ctx.msg, ctx.args);
        if (!targetJid) {
            return ctx.reply("⚠️ Menciona (@usuario) o responde al mensaje del usuario a eliminar.");
        }

        const targetNum = targetJid.split("@")[0];
        const selfNum = ctx.sock.user.id.split(":")[0].split("@")[0];

        try {
            const config = loadSubConfig(selfNum);
            if (!config.owners || !config.owners.includes(targetNum)) {
                return ctx.reply(`⚠️ @${targetNum} no es dueño de este sub-bot.`);
            }

            config.owners = config.owners.filter(num => num !== targetNum);
            saveSubConfig(selfNum, config);

            await ctx.sock.sendMessage(ctx.remoteJid, {
                text: `✅ Se ha eliminado a @${targetNum} como dueño de este sub-bot.`,
                mentions: [targetJid]
            }, { quoted: ctx.msg });
        } catch (err) {
            console.error("Error al eliminar owner:", err);
            await ctx.reply("❌ Ocurrió un error al intentar eliminar al dueño.");
        }
    }
};
