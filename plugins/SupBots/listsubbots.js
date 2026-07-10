import { getActiveSubbots } from "../../src/subbotManager.js";

export default {
    command: ["listsubbots", "subbots", "bots", "botslist", "listbots"],
    description: "Muestra la lista de sub-bots activos.",
    async execute(ctx) {
        const active = getActiveSubbots();
        if (active.size === 0) {
            return ctx.reply(
                `ℹ️ *No hay sub-bots activos* en este momento.\n\n` +
                `💡 Usa *!code* o *!qr* para iniciar un sub-bot.`
            );
        }

        const total = global.suptotal || 5;
        let list = `🤖 *SUB-BOTS ACTIVOS (${active.size}/${total})*\n\n`;
        let index = 1;
        for (const [num, subSock] of active.entries()) {
            const name = subSock?.botname || subSock?.subconfig?.botname || "";
            list += `${index}. @${num}${name ? ` — *${name}*` : ""}\n`;
            index++;
        }

        list += `\n_Slots disponibles: ${total - active.size}_`;

        await ctx.sock.sendMessage(ctx.remoteJid, {
            text: list,
            mentions: Array.from(active.keys()).map(num => `${num}@s.whatsapp.net`)
        }, { quoted: ctx.msg });
    }
};
