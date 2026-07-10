export default {
    command: ["setbotbio"],
    description: "Cambia la biografía/estado del bot.",
    async execute(ctx) {
        const isBotOwner = ctx.isOwner(ctx.senderRaw) || (ctx.jidToNumber(ctx.senderRaw) === ctx.jidToNumber(ctx.sock.user.id));
        if (!isBotOwner) {
            return ctx.reply("⚠️ Solo el dueño de esta sesión de bot puede usar este comando.");
        }

        if (!ctx.text) {
            return ctx.reply("⚠️ Ingresa el nuevo texto para la biografía/estado.");
        }

        try {
            await ctx.sock.updateProfileStatus(ctx.text);
            await ctx.reply(`✅ Biografía/estado del bot cambiado exitosamente a: *${ctx.text}*`);
        } catch (err) {
            console.error("Error al cambiar biografía:", err);
            await ctx.reply("❌ Ocurrió un error al intentar cambiar la biografía.");
        }
    }
};
