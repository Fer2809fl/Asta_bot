import { stopSubbot } from "../../src/subbotManager.js";

export default {
    command: ["stopbot", "stopjadibot"],
    description: "Detiene tu sesión activa de sub-bot.",
    async execute(ctx) {
        const senderJid = ctx.senderRaw;
        const phoneNumber = senderJid.split("@")[0];
        
        const stopped = await stopSubbot(phoneNumber);
        if (stopped) {
            await ctx.reply("✅ Tu sesión de sub-bot ha sido detenida y eliminada.");
        } else {
            await ctx.reply("⚠️ No tienes ninguna sesión de sub-bot activa.");
        }
    }
};
