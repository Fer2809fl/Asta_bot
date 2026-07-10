import { startSubbot } from "../../src/subbotManager.js";

export default {
    command: ["jadibot", "subbot", "code", "qr"],
    description: "Inicia una sesión de sub-bot (jadibot).",
    async execute(ctx) {
        let method = ctx.command.toLowerCase();
        
        if (method === "jadibot" || method === "subbot") {
            method = ctx.args[0]?.toLowerCase();
            if (method !== "code" && method !== "qr") {
                return ctx.reply(`⚠️ Por favor especifica el método de vinculación:\n\n👉 *${ctx.usedPrefix}code* (Vincular con código de 8 dígitos)\n👉 *${ctx.usedPrefix}qr* (Vincular escaneando código QR)`);
            }
        }

        const senderJid = ctx.senderRaw;
        const remoteJid = ctx.remoteJid;
        await startSubbot(ctx.sock, senderJid, remoteJid, ctx.reply, method);
    }
};
