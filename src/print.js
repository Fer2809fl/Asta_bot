const c = {
    reset: "\x1b[0m",
    cyan: "\x1b[36m",
    magenta: "\x1b[35m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    gray: "\x1b[90m",
    bold: "\x1b[1m",
    blue: "\x1b[34m",
};

export function printMessage({ remoteJid, senderRaw, body, isCommand, botname }) {
    if (!body) return;

    const time = new Date().toLocaleTimeString("es-MX", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });

    const sender = senderRaw?.split("@")[0] || "desconocido";
    const isGroup = remoteJid?.endsWith("@g.us");
    const chatName = remoteJid?.split("@")[0] || remoteJid;

    const chatIcon = isGroup ? "👥" : "💬";
    const destination = isGroup
        ? `${c.blue}${chatName}${c.reset}`
        : `${c.magenta}[Privado]${c.reset}`;

    const tag = isCommand
        ? `${c.green}${c.bold}CMD${c.reset}`
        : `${c.gray}MSG${c.reset}`;

    console.log(
        `${c.gray}┌─[${c.cyan}${c.bold}${botname || "Asta"}${c.reset}${c.gray}]─[${time}]${c.reset}\n` +
        `${c.gray}│${c.reset} ${tag} ${c.yellow}${chatIcon} +${sender}${c.reset} ${c.gray}→${c.reset} ${destination}\n` +
        `${c.gray}│${c.reset} ${body}\n` +
        `${c.gray}└────────────────────────────${c.reset}`
    );
}