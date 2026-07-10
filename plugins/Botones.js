import pkg from '@fer2809fl/baileys'

const { proto, generateWAMessageFromContent, WA_DEFAULT_EPHEMERAL } = pkg

async function sendInteractive(sock, msg, remoteJid, interactiveMessage) {
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
    })

    const built = await generateWAMessageFromContent(remoteJid, messageContent, {
        userJid: sock.user?.jid,
        quoted: msg,
        ephemeralExpiration: WA_DEFAULT_EPHEMERAL
    })

    await sock.relayMessage(remoteJid, built.message, { messageId: built.key.id })
}

export default [
    {
        command: ["boton1"],
        category: "test",
        description: "Botón que copia texto al portapapeles.",
        async execute({ sock, msg, remoteJid }) {
            await sendInteractive(sock, msg, remoteJid, {
                body: { text: '📋 *CÓDIGO DE INSTALACIÓN*\n\nEjecuta este comando en tu terminal:' },
                footer: { text: 'Asta Bot' },
                header: {
                    title: 'npm install asta-bot',
                    hasMediaAttachment: false
                },
                nativeFlowMessage: {
                    buttons: [{
                        name: 'cta_copy',
                        buttonParamsJson: JSON.stringify({
                            display_text: '📋 Copiar Comando',
                            copy_code: 'npm install asta-bot',
                            id: `copy_${Date.now()}`
                        })
                    }],
                    messageParamsJson: ''
                }
            })
        },
    },

    {
        command: ["boton2"],
        category: "test",
        description: "Botón que abre un enlace.",
        async execute({ sock, msg, remoteJid }) {
            await sendInteractive(sock, msg, remoteJid, {
                body: { text: '🔗 *ENLACES IMPORTANTES*\n\nVisita nuestro repositorio oficial:' },
                footer: { text: 'Asta Bot' },
                header: {
                    title: 'GitHub - Asta Bot',
                    hasMediaAttachment: false
                },
                nativeFlowMessage: {
                    buttons: [{
                        name: 'cta_url',
                        buttonParamsJson: JSON.stringify({
                            display_text: '🌐 Ver GitHub',
                            url: 'https://github.com/Fer2809fl/Asta_bot',
                            merchant_url: 'https://github.com/Fer2809fl/Asta_bot'
                        })
                    }],
                    messageParamsJson: ''
                }
            })
        },
    },

    {
        command: ["boton3"],
        category: "test",
        description: "Botones de respuesta rápida.",
        async execute({ sock, msg, remoteJid }) {
            await sendInteractive(sock, msg, remoteJid, {
                body: { text: '🎮 *MENÚ DE OPCIONES*\n\n¿Qué deseas hacer?' },
                footer: { text: 'Asta Bot' },
                header: {
                    title: 'Selecciona una opción',
                    hasMediaAttachment: false
                },
                nativeFlowMessage: {
                    buttons: [
                        {
                            name: 'quick_reply',
                            buttonParamsJson: JSON.stringify({
                                display_text: '📋 Ver Menú',
                                id: 'menu'
                            })
                        },
                        {
                            name: 'quick_reply',
                            buttonParamsJson: JSON.stringify({
                                display_text: 'ℹ️ Información',
                                id: 'info'
                            })
                        },
                        {
                            name: 'quick_reply',
                            buttonParamsJson: JSON.stringify({
                                display_text: '👑 Owner',
                                id: 'owner'
                            })
                        }
                    ],
                    messageParamsJson: ''
                }
            })
        },
    },

    {
        command: ["boton4"],
        category: "test",
        description: "Botón de llamada telefónica.",
        async execute({ sock, msg, remoteJid }) {
            await sendInteractive(sock, msg, remoteJid, {
                body: { text: '📞 *SOPORTE TÉCNICO*\n\n¿Necesitas ayuda? Llámanos:' },
                footer: { text: 'Asta Bot' },
                header: {
                    title: '+52 1 418 335 7841',
                    hasMediaAttachment: false
                },
                nativeFlowMessage: {
                    buttons: [{
                        name: 'cta_call',
                        buttonParamsJson: JSON.stringify({
                            display_text: '📞 Llamar Ahora',
                            phone_number: '+5214183357841'
                        })
                    }],
                    messageParamsJson: ''
                }
            })
        },
    },

    {
        command: ["boton5"],
        category: "test",
        description: "Lista desplegable con secciones.",
        async execute({ sock, msg, remoteJid }) {
            await sendInteractive(sock, msg, remoteJid, {
                body: { text: '📋 *SELECCIONA UNA OPCIÓN*' },
                footer: { text: 'Menú Principal' },
                header: {
                    title: 'Asta Bot',
                    hasMediaAttachment: false
                },
                nativeFlowMessage: {
                    buttons: [{
                        name: 'single_select',
                        buttonParamsJson: JSON.stringify({
                            title: 'Abrir Menú',
                            sections: [
                                {
                                    title: '📱 COMANDOS BÁSICOS',
                                    rows: [
                                        { id: '#menu', title: '📋 Menú', description: 'Ver todos los comandos' },
                                        { id: '#ping', title: '🏓 Ping', description: 'Ver latencia del bot' },
                                        { id: '#owner', title: '👑 Owner', description: 'Información del creador' }
                                    ]
                                },
                                {
                                    title: '🎮 COMANDOS DE GRUPO',
                                    rows: [
                                        { id: '#add', title: '➕ Agregar', description: 'Agregar usuario al grupo' },
                                        { id: '#kick', title: '👢 Expulsar', description: 'Expulsar usuario del grupo' },
                                        { id: '#promote', title: '⭐ Promover', description: 'Dar admin a un usuario' }
                                    ]
                                },
                                {
                                    title: '🔧 COMANDOS DE CONFIGURACIÓN',
                                    rows: [
                                        { id: '#sinprefix', title: '⚙️ Sin Prefijo', description: 'Activar/desactivar prefijo' },
                                        { id: '#antilink', title: '🔗 Anti Link', description: 'Bloquear enlaces' }
                                    ]
                                }
                            ]
                        })
                    }],
                    messageParamsJson: ''
                }
            })
        },
    },

    {
        command: ["boton6"],
        category: "test",
        description: "Combinación de múltiples tipos de botones.",
        async execute({ sock, msg, remoteJid }) {
            await sendInteractive(sock, msg, remoteJid, {
                body: { text: '🎯 *PANEL DE CONTROL*\n\nSelecciona una acción rápida:' },
                footer: { text: 'Asta Bot' },
                header: {
                    title: 'Panel Principal',
                    hasMediaAttachment: false
                },
                nativeFlowMessage: {
                    buttons: [
                        {
                            name: 'cta_url',
                            buttonParamsJson: JSON.stringify({
                                display_text: '🌐 GitHub',
                                url: 'https://github.com/Fer2809fl/Asta_bot',
                                merchant_url: 'https://github.com/Fer2809fl/Asta_bot'
                            })
                        },
                        {
                            name: 'cta_copy',
                            buttonParamsJson: JSON.stringify({
                                display_text: '📋 Comando Inicio',
                                copy_code: 'npm start'
                            })
                        },
                        {
                            name: 'quick_reply',
                            buttonParamsJson: JSON.stringify({
                                display_text: '📋 Ver Menú',
                                id: 'menu'
                            })
                        }
                    ],
                    messageParamsJson: ''
                }
            })
        },
    },

    {
        command: ["botones"],
        category: "test",
        description: "Muestra la ayuda de los comandos de prueba de botones.",
        async execute({ usedPrefix, reply }) {
            const p = usedPrefix ?? ".";
            await reply(
                `🧪 *COMANDOS DE PRUEBA - BOTONES INTERACTIVOS*\n\n` +
                `┌✦ *BOTÓN COPIAR*\n` +
                `│ ${p}boton1 - Botón que copia texto\n` +
                `│\n` +
                `├✦ *BOTÓN URL*\n` +
                `│ ${p}boton2 - Botón que abre enlace\n` +
                `│\n` +
                `├✦ *BOTONES RÁPIDOS*\n` +
                `│ ${p}boton3 - Botones de respuesta\n` +
                `│\n` +
                `├✦ *BOTÓN LLAMADA*\n` +
                `│ ${p}boton4 - Botón para llamar\n` +
                `│\n` +
                `├✦ *LISTA DESPLEGABLE*\n` +
                `│ ${p}boton5 - Menú con opciones\n` +
                `│\n` +
                `└✦ *MÚLTIPLES BOTONES*\n` +
                `  ${p}boton6 - Combinación de botones\n\n` +
                `✨ *Prueba cada uno y mira cómo funcionan!*`
            )
        },
    },
]
