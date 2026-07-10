import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const SESSION_FILE = join(
    dirname(fileURLToPath(import.meta.url)),
    "../../database/globalSession.json"
);

function loadSession() {
    try {
        return JSON.parse(readFileSync(SESSION_FILE, "utf-8"));
    } catch {
        return { enabled: true };
    }
}

function saveSession(data) {
    const dir = dirname(SESSION_FILE);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    writeFileSync(SESSION_FILE, JSON.stringify(data, null, 2));
}

export function isSessionEnabled() {
    return loadSession().enabled !== false;
}

export function setSessionEnabled(value) {
    saveSession({ enabled: value });
}

export default [
    {
        command: ["botsesion", "botsession"],
        description: "Apaga o prende el bot en TODOS los grupos a la vez.",
        async execute({ sock, msg, args, remoteJid, reply, senderRaw, isOwner }) {

            const senderNum = senderRaw?.split("@")[0]?.split(":")[0];
            const selfNum = sock.user?.id?.split(":")[0]?.split("@")[0];

            const isSessionOwner =
                msg.key.fromMe ||
                senderNum === selfNum ||
                sock.subconfig?.owners?.includes(senderNum) ||
                global.owners?.some(([num]) => num === senderNum);

            if (!isSessionOwner) {
                return reply("⛔ Solo el *dueño de esta sesión* o el *global owner* pueden usar este comando.");
            }

            const action = args[0]?.toLowerCase();

            if (!action) {
                const enabled = isSessionEnabled();
                return reply(
                    `🌐 *Estado de sesión global del bot:*\n\n` +
                    `${enabled ? "🟢 *ACTIVA* — El bot responde en todos los grupos" : "🔴 *INACTIVA* — El bot está apagado en todos los grupos"}\n\n` +
                    `Usa *botsesion off* para apagar en todos los grupos.\n` +
                    `Usa *botsesion on* para volver a activar en todos los grupos.`
                );
            }

            if (action === "off") {
                setSessionEnabled(false);
                return reply(
                    `🔴 *Sesión global desactivada*\n\n` +
                    `El bot está ahora *apagado en todos los grupos*.\n` +
                    `Nada funcionará (welcome, comandos, etc) hasta que uses *bot on* en el grupo o *botsesion on*.`
                );
            }

            if (action === "on") {
                setSessionEnabled(true);
                return reply(
                    `🟢 *Sesión global activada*\n\n` +
                    `El bot está ahora *activo nuevamente en todos los grupos*.`
                );
            }

            return reply(
                `⚠️ Opción no válida.\n\n• *botsesion off* — Apagar en todos los grupos\n• *botsesion on* — Prender en todos los grupos\n• *botsesion* — Ver estado`
            );
        },
    },
];