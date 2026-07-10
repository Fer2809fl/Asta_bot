import { makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, UNAUTHORIZED_CODES, Browsers, proto, generateWAMessageFromContent, WA_DEFAULT_EPHEMERAL } from "@fer2809fl/baileys";
import pino from "pino";
import fs from "fs";
import path from "path";
import { createHandler } from "./handler.js";
import { registerWelcome } from "./welcome.js";

const logger = pino({ level: "silent" });
const activeSubbots = new Map();
const reconnectAttempts = new Map();
const reconnectTimers = new Map();
const MAX_RECONNECT_ATTEMPTS = 5;
let globalPlugins = [];

export function getActiveSubbots() {
    return activeSubbots;
}

export function loadSubConfig(phoneNumber) {
    const configPath = `./auth/subbots/${phoneNumber}/subconfig.json`;
    const defaultData = {
        botname: "",
        icono: "",
        logo: "",
        wm: "",
        owners: []
    };

    if (fs.existsSync(configPath)) {
        try {
            return JSON.parse(fs.readFileSync(configPath, "utf-8"));
        } catch (err) {
            console.error(`[SubbotManager] Error reading subconfig for ${phoneNumber}:`, err);
        }
    }
    return defaultData;
}

export function saveSubConfig(phoneNumber, data) {
    const dirPath = `./auth/subbots/${phoneNumber}`;
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
    const configPath = `${dirPath}/subconfig.json`;
    try {
        fs.writeFileSync(configPath, JSON.stringify(data, null, 2), "utf-8");
        const subSock = activeSubbots.get(phoneNumber);
        if (subSock) {
            subSock.subconfig = data;
            subSock.botname = data.botname || global.botname;
            subSock.icono = data.icono || global.icono;
            subSock.logo = data.logo || global.logo;
            subSock.wm = data.wm || global.wm;
        }
        return true;
    } catch (err) {
        console.error(`[SubbotManager] Error writing subconfig for ${phoneNumber}:`, err);
        return false;
    }
}

function cleanupSubbot(phoneNumber, { deleteFolder = true } = {}) {
    activeSubbots.delete(phoneNumber);
    reconnectAttempts.delete(phoneNumber);

    const timer = reconnectTimers.get(phoneNumber);
    if (timer) {
        clearTimeout(timer);
        reconnectTimers.delete(phoneNumber);
    }

    if (deleteFolder) {
        const authFolder = `./auth/subbots/${phoneNumber}`;
        try {
            fs.rmSync(authFolder, { recursive: true, force: true });
        } catch { }
    }
}

export async function initSubbots(mainSock, plugins) {
    globalPlugins = plugins;
    const subbotsDir = "./auth/subbots";
    if (!fs.existsSync(subbotsDir)) {
        fs.mkdirSync(subbotsDir, { recursive: true });
        return;
    }

    const folders = fs.readdirSync(subbotsDir).filter(f => {
        return fs.statSync(path.join(subbotsDir, f)).isDirectory();
    });

    console.log(`[SubbotManager] Cargando ${folders.length} sesiones de sub-bots guardadas...`);
    for (const folder of folders) {
        const jid = `${folder}@s.whatsapp.net`;
        try {
            await startSubbot(mainSock, jid, null, null, "code", true);
        } catch (err) {
            console.error(`[SubbotManager] Error al iniciar subbot para ${jid}:`, err);
        }
    }
}

export async function startSubbot(mainSock, jid, remoteJid, reply, method = "code", isAutoStart = false) {
    const phoneNumber = jid.split("@")[0];
    const authFolder = `./auth/subbots/${phoneNumber}`;

    if (activeSubbots.has(phoneNumber)) {
        if (!isAutoStart && reply) {
            await reply("⚠️ Ya tienes una sesión de sub-bot activa.");
        }
        return;
    }

    if (isAutoStart && !fs.existsSync(authFolder)) {
        console.log(`[Subbot - ${phoneNumber}] Carpeta de sesión no existe, se omite el arranque.`);
        cleanupSubbot(phoneNumber, { deleteFolder: false });
        return;
    }

    const activeCount = activeSubbots.size;
    const limit = global.suptotal || 5;
    if (activeCount >= limit) {
        if (!isAutoStart && reply) {
            await reply(`⚠️ Se ha alcanzado el límite máximo de sub-bots permitidos (${limit}).`);
        }
        return;
    }

    if (!isAutoStart && reply) {
        await reply(`⏳ Iniciando la sesión de sub-bot por método *${method.toUpperCase()}*... Espera un momento.`);
    }

    const { state, saveCreds } = await useMultiFileAuthState(authFolder);
    const { version } = await fetchLatestBaileysVersion();

    const subSock = makeWASocket({
        version,
        auth: state,
        logger,
        browser: Browsers.macOS("Chrome"),
        printQRInTerminal: false,
    });

    subSock.isSubBot = true;

    const configData = loadSubConfig(phoneNumber);
    subSock.subconfig = configData;
    subSock.botname = configData.botname || global.botname;
    subSock.icono = configData.icono || global.icono;
    subSock.logo = configData.logo || global.logo;
    subSock.wm = configData.wm || global.wm;

    subSock.ev.on("creds.update", saveCreds);

    let lastQrSentTime = 0;

    subSock.ev.on("connection.update", async ({ connection, lastDisconnect, qr }) => {
        if (qr && method === "qr" && !isAutoStart) {
            const now = Date.now();
            if (now - lastQrSentTime > 20000) {
                lastQrSentTime = now;
                if (mainSock && remoteJid) {
                    try {
                        await mainSock.sendMessage(remoteJid, {
                            image: { url: `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(qr)}` },
                            caption: `🔲 *CÓDIGO QR PARA VINCULACIÓN*\n\nHola @${phoneNumber}, escanea este código QR con tu WhatsApp (Dispositivos vinculados > Vincular un dispositivo) para iniciar tu sub-bot.`,
                            mentions: [jid]
                        });
                    } catch (err) {
                        console.error(`[Subbot - ${phoneNumber}] Error al enviar código QR:`, err);
                    }
                }
            }
        }

        if (connection === "close") {
            const statusCode = lastDisconnect?.error?.output?.statusCode;
            const shouldReconnect = !UNAUTHORIZED_CODES.includes(statusCode);
            console.log(`[Subbot - ${phoneNumber}] Conexión cerrada (${statusCode}). Reconectar: ${shouldReconnect}`);

            if (!shouldReconnect) {
                cleanupSubbot(phoneNumber);
                if (mainSock && remoteJid) {
                    await mainSock.sendMessage(remoteJid, {
                        text: `❌ La sesión del sub-bot para @${phoneNumber} ha expirado o ha sido cerrada por el usuario.`,
                        mentions: [jid]
                    });
                }
                return;
            }

            if (!fs.existsSync(authFolder)) {
                console.log(`[Subbot - ${phoneNumber}] Carpeta de sesión eliminada, se cancela la reconexión.`);
                cleanupSubbot(phoneNumber, { deleteFolder: false });
                return;
            }

            const attempts = (reconnectAttempts.get(phoneNumber) || 0) + 1;
            reconnectAttempts.set(phoneNumber, attempts);

            if (attempts > MAX_RECONNECT_ATTEMPTS) {
                console.log(`[Subbot - ${phoneNumber}] Máximo de reintentos alcanzado (${MAX_RECONNECT_ATTEMPTS}), eliminando sesión.`);
                cleanupSubbot(phoneNumber);
                if (mainSock && remoteJid) {
                    await mainSock.sendMessage(remoteJid, {
                        text: `❌ No se pudo reconectar el sub-bot de @${phoneNumber} después de varios intentos. La sesión fue eliminada.`,
                        mentions: [jid]
                    });
                }
                return;
            }

            const timer = setTimeout(() => {
                reconnectTimers.delete(phoneNumber);
                startSubbot(mainSock, jid, remoteJid, reply, method, true);
            }, 5000);
            reconnectTimers.set(phoneNumber, timer);
        }

        if (connection === "open") {
            activeSubbots.set(phoneNumber, subSock);
            reconnectAttempts.delete(phoneNumber);
            console.log(`[Subbot - ${phoneNumber}] Conectado exitosamente.`);

            if (global.canal?.id) {
                try {
                    await subSock.followNewsletter(global.canal.id);
                    console.log(`[Subbot - ${phoneNumber}] ✅ Canal oficial seguido: ${global.canal.nombre || global.canal.id}`);
                } catch (err) {
                    console.log(`[Subbot - ${phoneNumber}] ℹ️ No se pudo seguir el canal (quizás ya lo sigue): ${err?.message || err}`);
                }
            }

            if (mainSock && remoteJid && !isAutoStart) {
                await mainSock.sendMessage(remoteJid, {
                    text: `🎉 ¡Sub-bot conectado exitosamente para @${phoneNumber}!\n\n📡 Se ha suscrito automáticamente al canal oficial: ${global.canal?.url || ""}`,
                    mentions: [jid]
                });
            }
        }
    });

    if (!subSock.authState.creds.registered && !isAutoStart && method === "code") {
        setTimeout(async () => {
            try {
                const code = await subSock.requestPairingCode(phoneNumber);
                if (mainSock && remoteJid) {
                    const caption = `🔗 *CÓDIGO DE VINCULACIÓN*\n\nHola @${phoneNumber}, aquí tienes tu código de vinculación para iniciar tu sub-bot:\n\n*Pasos para vincular:*\n1. Ve a WhatsApp > Dispositivos vinculados.\n2. Toca en *Vincular un dispositivo*.\n3. Selecciona *Vincular con el número de teléfono*.\n4. Introduce este código.`;

                    const interactiveMessage = {
                        body: { text: caption },
                        footer: { text: global.botname || "Asta Bot" },
                        header: {
                            title: `🧩 CÓDIGO: ${code}`,
                            hasMediaAttachment: false
                        },
                        nativeFlowMessage: {
                            buttons: [{
                                name: "cta_copy",
                                buttonParamsJson: JSON.stringify({
                                    display_text: "📋 Copiar Código",
                                    copy_code: code,
                                    id: `copy_${Date.now()}`
                                })
                            }],
                            messageParamsJson: ""
                        }
                    };

                    const messageContent = proto.Message.fromObject({
                        viewOnceMessage: {
                            message: {
                                messageContextInfo: {
                                    deviceListMetadata: {},
                                    deviceListMetadataVersion: 2
                                },
                                interactiveMessage
                            }
                        }
                    });

                    const builtMsg = await generateWAMessageFromContent(remoteJid, messageContent, {
                        userJid: mainSock.user?.jid,
                        ephemeralExpiration: WA_DEFAULT_EPHEMERAL
                    });

                    await mainSock.relayMessage(remoteJid, builtMsg.message, { messageId: builtMsg.key.id });
                }
            } catch (err) {
                console.error(`[Subbot - ${phoneNumber}] Error al solicitar código:`, err);
                if (mainSock && remoteJid) {
                    await mainSock.sendMessage(remoteJid, {
                        text: `❌ Error al solicitar el código de vinculación. Inténtalo de nuevo más tarde.`
                    });
                }
            }
        }, 3000);
    }

    const subbotHandler = createHandler(subSock, globalPlugins);
    registerWelcome(subSock);
    subSock.ev.on("messages.upsert", subbotHandler);
}

export async function stopSubbot(phoneNumber) {
    if (!activeSubbots.has(phoneNumber)) return false;
    const subSock = activeSubbots.get(phoneNumber);
    try {
        await subSock.logout();
    } catch { }
    cleanupSubbot(phoneNumber);
    return true;
}
