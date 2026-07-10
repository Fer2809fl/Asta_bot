export default [
    {
        command: ["setdesc", "descripciongrupo"],
        description: "Cambia la descripción del grupo.",
        adminOnly: true,
        botAdmin: true,
        async execute({ sock, remoteJid, args, reply }) {
            const nueva = args.join(" ");
            if (!nueva) return reply("⚠️ Escribe la nueva descripción del grupo.");

            await sock
                .groupUpdateDescription(remoteJid, nueva)
                .then(() => reply("✅ Descripción del grupo actualizada."))
                .catch(() => reply("❌ No se pudo cambiar la descripción del grupo."));
        },
    },
];