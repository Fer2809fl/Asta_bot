import { downloadMediaMessage } from "@fer2809fl/baileys";

export default [
    {
        command: ["setppgroup", "ppt"],
        description: "Cambia la foto del grupo (responde a una imagen o envíala con el comando).",
        adminOnly: true,
        botAdmin: true,
        async execute({ sock, msg, remoteJid, reply }) {
            const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            const target = msg.message?.imageMessage
                ? msg
                : quoted?.imageMessage
                    ? { key: msg.key, message: quoted }
                    : null;

            if (!target) return reply("⚠️ Envía una imagen o responde a una con este comando.");

            await downloadMediaMessage(target, "buffer", {})
                .then((buffer) => sock.updateProfilePicture(remoteJid, buffer))
                .then(() => reply("✅ Foto del grupo actualizada."))
                .catch(() => reply("❌ No se pudo cambiar la foto del grupo."));
        },
    },
];