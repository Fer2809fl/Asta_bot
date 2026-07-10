export default [
    {
        command: ["hidetag", "notify", "tag"],
        description: "Envía un mensaje mencionando a todos sin mostrar la lista.",
        adminOnly: true,
        async execute({ sock, msg, remoteJid, args, reply }) {
            let meta;
            try {
                meta = await sock.groupMetadata(remoteJid);
            } catch {
                return reply("❌ No se pudo obtener la información del grupo.");
            }

            await sock.sendMessage(
                remoteJid,
                { text: args.join(" ") || "📢", mentions: meta.participants.map((p) => p.id) },
                { quoted: msg }
            );
        },
    },
];