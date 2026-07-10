import { loadSubConfig, saveSubConfig } from "../../src/subbotManager.js";

export default {
    command: ["addowner", "agregarowner"],
    description: "Agrega un dueño secundario a la sesión del sub-bot.",
    async execute(ctx) {
        const isBotOwner = ctx.isOwner(ctx.senderRaw) ||
            (ctx.jidToNumber(ctx.senderRaw) === ctx.jidToNumber(ctx.sock.user.id));
        if (!isBotOwner) {
            return ctx.reply("⚠️ Solo el dueño de esta sesión de bot puede usar este comando.");
        }

        // getTarget espera (msg, args) donde args es array — Fix: era ctx.text (string) antes
        const { jid: targetJid } = ctx.getTarget(ctx.msg, ctx.args);
        if (!targetJid) {
            return ctx.reply("⚠️ Menciona (@usuario) o responde al mensaje del usuario a agregar como dueño.");
        }

        const targetNum = targetJid.split("@")[0];
        const selfNum = ctx.sock.user.id.split(":")[0].split("@")[0];

        try {
            const config = loadSubConfig(selfNum);
            if (!config.owners) config.owners = [];

            if (config.owners.includes(targetNum)) {
                return ctx.reply(`⚠️ @${targetNum} ya es dueño de este sub-bot.`);
            }

            config.owners.push(targetNum);
            saveSubConfig(selfNum, config);

            await ctx.sock.sendMessage(ctx.remoteJid, {
                text: `✅ Se ha agregado a @${targetNum} como dueño de este sub-bot.`,
                mentions: [targetJid]
            }, { quoted: ctx.msg });
        } catch (err) {
            console.error("Error al agregar owner:", err);
            await ctx.reply("❌ Ocurrió un error al intentar agregar al dueño.");
        }
    }
};
