import { groupConfig } from "../../src/groupConfig.js";
import { participantForms, addAllForms } from "../../src/jid.js";

function findParticipant(participants, targetJid) {
    const targetForms = new Set();
    addAllForms(targetForms, targetJid);
    for (const p of participants) {
        const pForms = participantForms(p);
        for (const form of targetForms) {
            if (pForms.has(form)) return p;
        }
    }
    return null;
}

export default [
    // ── setprimary / primary ───────────────────────────────────────────────────
    {
        command: ["setprimary", "primary"],
        description: "Establece el bot primario del grupo, o muestra el estado actual.",
        adminOnly: true,
        async execute({ sock, msg, remoteJid, isGroup, args, reply, getTarget, jidToNumber }) {
            if (!isGroup) return reply("⚠️ Este comando solo funciona en *grupos*.");

            const { jid: rawJid } = getTarget(msg, args);

            // Sin mención → mostrar estado actual
            if (!rawJid) {
                const current = groupConfig.getPrimary(remoteJid);
                if (!current) {
                    return reply(
                        `🤖 *Bot Primario*\n\n` +
                        `🔴 No hay ningún bot primario configurado en este grupo.\n` +
                        `Todos los bots responden normalmente.\n\n` +
                        `> Usa *!setprimary @bot* para establecer uno.`
                    );
                }
                return reply(
                    `🤖 *Bot Primario*\n\n` +
                    `🟢 Bot primario actual: *+${jidToNumber(current)}*\n\n` +
                    `> Usa *!primaryoff* para quitarlo.`
                );
            }

            // Con mención → buscar participante igual que promote
            let meta;
            try { meta = await sock.groupMetadata(remoteJid); } catch { return reply("❌ No se pudo obtener la información del grupo."); }

            const participant = findParticipant(meta.participants, rawJid);
            if (!participant) return reply("⚠️ Ese usuario/bot no está en el grupo.");

            groupConfig.setPrimary(remoteJid, participant.id);

            await sock.sendMessage(
                remoteJid,
                {
                    text:
                        `✅ *Bot primario establecido*\n\n` +
                        `🤖 @${jidToNumber(participant.id)} ahora es el bot principal de este grupo.\n` +
                        `Los demás bots ignorarán los comandos aquí.\n\n` +
                        `> Usa *!primaryoff* para quitarlo.`,
                    mentions: [participant.id],
                },
                { quoted: msg }
            );
        },
    },

    // ── primaryoff ─────────────────────────────────────────────────────────────
    {
        command: ["primaryoff"],
        description: "Elimina el bot primario del grupo. Todos los bots responderán.",
        adminOnly: true,
        async execute({ sock, msg, remoteJid, isGroup, reply, jidToNumber }) {
            if (!isGroup) return reply("⚠️ Este comando solo funciona en *grupos*.");

            const current = groupConfig.getPrimary(remoteJid);
            if (!current) {
                return reply(
                    `ℹ️ No hay ningún bot primario configurado en este grupo.\n` +
                    `Todos los bots ya responden normalmente.`
                );
            }

            groupConfig.clearPrimary(remoteJid);

            await sock.sendMessage(
                remoteJid,
                {
                    text:
                        `✅ *Bot primario eliminado*\n\n` +
                        `*+${jidToNumber(current)}* ya no es el bot principal.\n` +
                        `Todos los bots en el grupo pueden responder comandos nuevamente.`,
                },
                { quoted: msg }
            );
        },
    },
];