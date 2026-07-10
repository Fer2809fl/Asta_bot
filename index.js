import "./config.js";
import {
  makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  UNAUTHORIZED_CODES,
  Browsers,
} from "@fer2809fl/baileys";
import pino from "pino";
import qrcode from "qrcode-terminal";
import readline from "readline";
import { loadPlugins } from "./src/loader.js";
import { createHandler } from "./src/handler.js";
import { registerWelcome } from "./src/welcome.js";
import { adminManager } from "./src/adminManager.js";
import { gacha } from "./src/gacha.js";
import { initSubbots } from "./src/subbotManager.js";

const logger = pino({ level: "silent" });
let plugins = [];
let logoPrinted = false;

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const question = (text) => new Promise((resolve) => rl.question(text, resolve));

const BLOCKED_KEYWORDS = [
  'Failed to decrypt',
  'Bad MAC',
  'Closing open session',
  'Closing session:',
  'SessionEntry',
  'libsignal',
  'crypto.js',
  'session_cipher.js',
  'queue_job.js',
  'prekey bundle',
  'verifyMAC',
  'doDecryptWhisperMessage',
  'decryptWithSessions',
  '_asyncQueueExecutor',
  'Decrypted message with closed session',
  '_chains',
  'registrationId',
  'currentRatchet',
  'indexInfo',
  'ephemeralKeyPair',
  'lastRemoteEphemeralKey',
  'previousCounter',
  'rootKey',
  'baseKey',
  'baseKeyType',
  'remoteIdentityKey',
  'chainKey',
  'chainType',
  'messageKeys',
  'privKey',
  'pubKey',
  'pendingPreKey',
  'signedKeyId',
  'preKeyId',
  'used:',
  'created:',
  'closed:',
  '<Buffer',
  'Error: spawn ffmpeg ENOENT',
  'Assertion failed:',
  'src\\win\\async.c',
  'UV_HANDLE_CLOSING'
];

const shouldBlock = (msg) => {
  if (typeof msg !== 'string') return false;
  return BLOCKED_KEYWORDS.some(kw => msg.includes(kw));
};

const safeStringify = (a) => {
  if (typeof a !== 'object' || a === null) return String(a);
  try {
    return JSON.stringify(a);
  } catch {
    return '[unserializable object]';
  }
};

const setupFilters = () => {
  const methods = ['log', 'error', 'warn', 'info', 'debug', 'dir', 'trace'];
  const originals = {};

  methods.forEach((method) => {
    originals[method] = console[method];
    console[method] = (...args) => {
      const msg = args.map(safeStringify).join(' ');
      if (!shouldBlock(msg)) originals[method].apply(console, args);
    };
  });
};

setupFilters();

process.on("unhandledRejection", (reason) => {
  console.error(`[${global.botname || "Asta"}] ⚠️ Promesa rechazada sin manejar:`, reason?.message || reason);
});

process.on("uncaughtException", (err) => {
  console.error(`[${global.botname || "Asta"}] ⚠️ Excepción no capturada:`, err?.message || err);
});

let subbotsInitialized = false;

async function printLogo() {
  if (logoPrinted) return;
  logoPrinted = true;
  try {
    const { default: cfonts } = await import("cfonts");
    const { default: chalk } = await import("chalk");
    console.log(chalk.magentaBright('\n▶ Iniciando Asta Bot...'));
    cfonts.say('Asta Bot', {
      font: 'block',
      align: 'center',
      gradient: ['red', 'magenta']
    });
    cfonts.say('By Fernando', {
      font: 'tiny',
      align: 'center',
      colors: ['yellow', 'green']
    });
  } catch { }
}

async function startBot() {
  await printLogo();

  const { state, saveCreds } = await useMultiFileAuthState("./auth");
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    logger,
    browser: Browsers.macOS("Chrome"),
    printQRInTerminal: false,
  });

  let usePairingCode = false;

  if (!sock.authState.creds.registered) {
    let choice = await question(
      `\n¿Cómo quieres vincular ${global.botname}?\n1. Código QR\n2. Código de vinculación (número)\nElige una opción (1/2): `
    );
    choice = choice.trim();

    if (choice === "2") {
      usePairingCode = true;
      const phoneNumber = (
        await question("📱 Ingresa tu número con código de país (sin +, sin espacios, ej. 521234567890): ")
      ).trim();

      setTimeout(async () => {
        try {
          const code = await sock.requestPairingCode(phoneNumber);
          console.log(`\n🔗 Tu código de vinculación es: ${code}\n`);
        } catch (err) {
          console.error(`[${global.botname}] ❌ Error al solicitar el código de vinculación:`, err);
        }
      }, 3000);
    }
  }

  await gacha.init();

  if (plugins.length === 0) {
    plugins = await loadPlugins();
  }

  const handler = createHandler(sock, plugins);

  registerWelcome(sock);

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async ({ connection, lastDisconnect, qr }) => {
    if (qr && !usePairingCode) {
      console.clear();
      console.log(`${global.icono} Escanea el código QR para ${global.botname}:\n`);
      qrcode.generate(qr, { small: true });
    }

    if (connection === "close") {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      const shouldReconnect = !UNAUTHORIZED_CODES.includes(statusCode);
      console.log(`[${global.botname}] Conexión cerrada (${statusCode}). Reconectar: ${shouldReconnect}`);
      adminManager.invalidateAll();
      if (shouldReconnect) startBot();
    }

    if (connection === "open") {
      console.log(`[${global.botname}] ${global.icono} Conectado como`, sock.user?.id);
      if (!subbotsInitialized) {
        subbotsInitialized = true;
        initSubbots(sock, plugins);
      }

      if (global.canal?.id) {
        try {
          await sock.followNewsletter(global.canal.id);
          console.log(`[${global.botname}] ✅ Canal oficial seguido: ${global.canal.nombre || global.canal.id}`);
        } catch (err) {
          console.log(`[${global.botname}] ℹ️ Canal ya seguido o sin permiso: ${err?.message || err}`);
        }
      }
    }
  });

  sock.ev.on("messages.upsert", handler);
}

startBot();