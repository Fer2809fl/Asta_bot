import { loadSubConfig, saveSubConfig } from "../../src/subbotManager.js";

export default {
    command: ["setbotname", "botnombre", "nombre"],
    description: "Cambia el nombre del bot en WhatsApp y en la sesión.",
    async execute(ctx) {
        const isBotOwner = ctx.isOwner(ctx.senderRaw) ||
            (ctx.jidToNumber(ctx.senderRaw) === ctx.jidToNumber(ctx.sock.user.id));
        if (!isBotOwner) {
            return ctx.reply("⚠️ Solo el dueño de esta sesión de bot puede usar este comando.");
        }

        if (!ctx.text) {
            const current = ctx.sock.botname || global.botname || "(sin nombre)";
            return ctx.reply(
                `📛 *Nombre actual del bot:* ${current}\n\n` +
                `💡 Uso: *!setbotname <nuevo nombre>*\n` +
                `_Esto cambiará el nombre en WhatsApp y en la sesión del bot._`
            );
        }

        const newName = ctx.text.trim();

        try {
            // Cambiar el nombre en WhatsApp (perfil real)
            await ctx.sock.updateProfileName(newName);

            // Guardar en la configuración de la sesión del bot
            const selfNum = ctx.sock.user.id.split(":")[0].split("@")[0];
            const config = loadSubConfig(selfNum);
            config.botname = newName;
            saveSubConfig(selfNum, config);

            // Actualizar el nombre globalmente si es el bot principal
            if (!selfNum || selfNum === global.mainNumber) {
                global.botname = newName;
            }

            await ctx.reply(
                `✅ *Nombre del bot cambiado exitosamente.*\n\n` +
                `📛 Nuevo nombre: *${newName}*\n` +
                `_El nombre se ha actualizado en WhatsApp y en la sesión._`
            );
        } catch (err) {
            console.error("Error al cambiar nombre:", err);
            await ctx.reply("❌ Ocurrió un error al intentar cambiar el nombre.\n_Verifica que el bot tenga conexión activa._");
        }
    }
};
