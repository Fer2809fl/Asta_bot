export default [
    {
        command: ["setname", "nombregrupo"],
        description: "Cambia el nombre del grupo.",
        adminOnly: true,
        botAdmin: true,
        async execute({ sock, remoteJid, args, reply }) {
            const nuevo = args.join(" ");
            if (!nuevo) return reply("⚠️ Escribe el nuevo nombre del grupo.");

            await sock
                .groupUpdateSubject(remoteJid, nuevo)
                .then(() => reply(`✅ Nombre actualizado a:\n*${nuevo}*`))
                .catch(() => reply("❌ No se pudo cambiar el nombre del grupo."));
        },
    },
];