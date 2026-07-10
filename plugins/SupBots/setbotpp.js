import { downloadContentFromMessage } from "@fer2809fl/baileys";

export default {
    command: ["setbotpp"],
    description: "Cambia la foto de perfil del bot respondiendo a una imagen.",
    async execute(ctx) {
        const isBotOwner = ctx.isOwner(ctx.senderRaw) || (ctx.jidToNumber(ctx.senderRaw) === ctx.jidToNumber(ctx.sock.user.id));
        if (!isBotOwner) {
            return ctx.reply("⚠️ Solo el dueño de esta sesión de bot puede usar este comando.");
        }

        const quotedMsg = ctx.msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const imageMessage = ctx.msg.message?.imageMessage || quotedMsg?.imageMessage;

        if (!imageMessage) {
            return ctx.reply("⚠️ Por favor responde a una imagen con este comando para cambiar la foto de perfil del bot.");
        }

        try {
            await ctx.reply("⏳ Descargando y actualizando foto de perfil...");
            const stream = await downloadContentFromMessage(imageMessage, "image");
            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }

            const selfJid = ctx.sock.user.id.split(":")[0] + "@s.whatsapp.net";
            await ctx.sock.updateProfilePicture(selfJid, buffer);
            await ctx.reply("✅ Foto de perfil del bot actualizada con éxito.");
        } catch (err) {
            console.error("Error al cambiar foto de perfil:", err);
            await ctx.reply("❌ Ocurrió un error al intentar cambiar la foto de perfil.");
        }
    }
};
