import { groupConfig } from "../../src/groupConfig.js";

export default [
    {
        command: ["bot", "boton"],
        description: "Activa o desactiva el bot en el grupo.",
        adminOnly: true,
        async execute({ sock, msg, remoteJid, isGroup, args, reply, senderRaw, isOwner }) {
            if (!isGroup) return reply("⚠️ Este comando solo funciona en *grupos*.");

            const action = args[0]?.toLowerCase();

            // Si no hay argumento: mostrar estado actual
            if (!action) {
                const enabled = groupConfig.isBotEnabled(remoteJid);
                return reply(
                    `🤖 *Estado del bot en este grupo:*\n\n` +
                    `${enabled ? "🟢 *ACTIVO*" : "🔴 *INACTIVO*"}\n\n` +
                    `Usa *bot on* para activar o *bot off* para desactivar.`
                );
            }

            if (action === "on") {
                groupConfig.setBotEnabled(remoteJid, true);
                return sock.sendMessage(
                    remoteJid,
                    {
                        text:
                            `🟢 *Bot activado*\n\n` +
                            `El bot está ahora *activo* en este grupo y responderá a todos los comandos.`,
                    },
                    { quoted: msg }
                );
            }

            if (action === "off") {
                await sock.sendMessage(
                    remoteJid,
                    {
                        text:
                            `🔴 *Bot desactivado*\n\n` +
                            `El bot está ahora *inactivo* en este grupo.\n` +
                            `No responderá a ningún comando hasta que uses *bot on*.`,
                    },
                    { quoted: msg }
                );
                groupConfig.setBotEnabled(remoteJid, false);
                return;
            }

            return reply(
                `⚠️ Opción no válida.\n\nUsa:\n• *bot on* — Activar\n• *bot off* — Desactivar\n• *bot* — Ver estado`
            );
        },
    },
];