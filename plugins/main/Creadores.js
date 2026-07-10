function buildVCard(name, number) {
    const cleanNumber = String(number).replace(/[^\d]/g, '')
    return [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `FN:${name}`,
        `ORG:${global.botname || 'Asta Bot'};`,
        `TEL;type=CELL;type=VOICE;waid=${cleanNumber}:+${cleanNumber}`,
        'END:VCARD'
    ].join('\n')
}

export default [
    {
        command: ["creadores"],
        category: "info",
        description: "Comparte a los creadores del bot como tarjetas de contacto.",
        async execute({ sock, msg, remoteJid, reply }) {
            const owners = global.owners || []

            if (!owners.length) {
                return reply('No hay creadores configurados.')
            }

            const contacts = owners.map(([number, name]) => ({
                vcard: buildVCard(name, number)
            }))

            try {
                await sock.sendMessage(
                    remoteJid,
                    {
                        contacts: {
                            displayName: owners.length > 1
                                ? `${owners.length} Creadores`
                                : owners[0][1],
                            contacts
                        }
                    },
                    { quoted: msg }
                )
            } catch (err) {
                console.error('[Creadores] Error:', err.message)
                const fallback = owners
                    .map(([number, name]) => `👑 *${name}* — wa.me/${String(number).replace(/[^\d]/g, '')}`)
                    .join('\n')
                await reply(`*CREADORES DEL BOT*\n\n${fallback}`)
            }
        },
    },
]
