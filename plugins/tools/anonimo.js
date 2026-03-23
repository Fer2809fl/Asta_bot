import fetch from 'node-fetch'

// Función para generar token aleatorio (3 letras + 2 números)
function generarToken() {
    const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numeros = '0123456789';
    let token = '';
    for (let i = 0; i < 3; i++) {
        token += letras.charAt(Math.floor(Math.random() * letras.length));
    }
    for (let i = 0; i < 2; i++) {
        token += numeros.charAt(Math.floor(Math.random() * numeros.length));
    }
    return token;
}

// Estado global para mensajes anónimos activos
if (!global.anonymousMessages) global.anonymousMessages = new Map();

// Función para obtener la imagen y el contexto
async function getAnonymousReply() {
    try {
        const thumb = await (await fetch('https://files.catbox.moe/4ojiq3.jpg')).buffer();
        return {
            externalAdReply: {
                title: global.botname || 'ᴀsᴛᴀ-ʙᴏᴛ',
                body: 'ᴍᴇɴꜱᴀᴊᴇ ᴀɴóɴɪᴍᴏ',
                mediaType: 1,
                thumbnail: thumb,
                showAdAttribution: false,
                containsAutoReply: true,
                renderLargerThumbnail: true
            }
        }
    } catch { return {} }
}

// Función para validar número de WhatsApp
function isValidWhatsAppNumber(number) {
    // Eliminar cualquier caracter no numérico
    const cleanNumber = number.replace(/\D/g, '');
    // Validar que tenga al menos 10 dígitos y no más de 15
    return cleanNumber.length >= 10 && cleanNumber.length <= 15;
}

const handler = async (m, { conn, command, text, usedPrefix }) => {
    // Solo se permite usar en privado para enviar/responder
    if (m.isGroup) {
        return conn.sendMessage(m.chat, {
            text: `> . ﹡ ﹟ 🕊️ ׄ ⬭ *¡ᴄᴏᴍᴀɴᴅᴏ ᴘʀɪᴠᴀᴅᴏ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🔒* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴇꜱᴛᴇ ᴄᴏᴍᴀɴᴅᴏ ꜱᴏʟᴏ ꜱᴇ ᴘᴜᴇᴅᴇ ᴜꜱᴀʀ ᴇɴ ᴍᴇɴꜱᴀᴊᴇ ᴘʀɪᴠᴀᴅᴏ.*
ׅㅤ𓏸𓈒ㅤׄ *ᴜꜱᴏ* :: ᴇɴᴠɪᴀ ᴍᴇɴꜱᴀᴊᴇ ᴅɪʀᴇᴄᴛᴀᴍᴇɴᴛᴇ ᴀʟ ʙᴏᴛ.

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
        }, { quoted: m });
        return;
    }

    // Obtener el contexto con la imagen
    const rcanal = await getAnonymousReply();

    switch (command) {
        // ===== ENVIAR MENSAJE ANÓNIMO =====
        case 'anonimo': {
            // Formato: anonimo <numero> <mensaje>
            const args = text.trim().split(/\s+/);
            if (args.length < 2) {
                return conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ 🕊️ ׄ ⬭ *¡ᴜꜱᴏ ɪɴᴄᴏʀʀᴇᴄᴛᴏ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❓* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴄᴏᴍᴏ ᴜꜱᴀʀ* :: \`${usedPrefix}anonimo 521234567890 Hola, esto es un mensaje secreto\`
ׅㅤ𓏸𓈒ㅤׄ *ᴇᴊᴇᴍᴘʟᴏ* :: \`${usedPrefix}anonimo 521234567890 Te saludo desde el anonimato\`

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                    contextInfo: { ...rcanal }
                }, { quoted: m });
            }

            let numero = args[0];
            // Limpiar el número: eliminar caracteres no numéricos
            numero = numero.replace(/[^0-9]/g, '');
            
            // Validar número
            if (!isValidWhatsAppNumber(numero)) {
                return conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ 🕊️ ׄ ⬭ *¡ɴúᴍᴇʀᴏ ɪɴᴠáʟɪᴅᴏ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜📞* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴇʟ ɴúᴍᴇʀᴏ ᴅᴇʙᴇ ᴛᴇɴᴇʀ ᴇɴᴛʀᴇ 10 ʏ 15 díɢɪᴛᴏꜱ.*
ׅㅤ𓏸𓈒ㅤׄ *ᴇᴊᴇᴍᴘʟᴏ* :: \`521234567890\`

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                    contextInfo: { ...rcanal }
                }, { quoted: m });
            }
            
            // Formatear número para WhatsApp
            if (!numero.startsWith('521') && !numero.startsWith('52')) {
                numero = '52' + numero;
            }
            
            const destinatarioJid = `${numero}@s.whatsapp.net`;

            const mensaje = args.slice(1).join(' ');
            if (!mensaje) {
                return conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ 🕊️ ׄ ⬭ *¡ᴍᴇɴꜱᴀᴊᴇ ᴠᴀᴄíᴏ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜📝* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ɴᴏ ᴘᴜᴇᴅᴇꜱ ᴇɴᴠɪᴀʀ ᴜɴ ᴍᴇɴꜱᴀᴊᴇ ꜱɪɴ ᴄᴏɴᴛᴇɴɪᴅᴏ.*

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                    contextInfo: { ...rcanal }
                }, { quoted: m });
            }

            // Generar token único para este mensaje
            let token = generarToken();
            // Asegurar que el token no esté repetido
            while (global.anonymousMessages.has(token)) {
                token = generarToken();
            }

            // Guardar el mensaje anónimo con metadata (totalmente anónimo)
            global.anonymousMessages.set(token, {
                remitenteOriginal: m.sender,  // Solo para responder, nunca se revela
                destinatario: destinatarioJid,
                mensaje: mensaje,
                fecha: Date.now(),
                respondido: false
            });

            // Enviar el mensaje anónimo al destinatario (SIN información del remitente)
            try {
                await conn.sendMessage(destinatarioJid, {
                    text: `> . ﹡ ﹟ 🕊️ ׄ ⬭ *¡ᴛɪᴇɴᴇꜱ ᴜɴ ᴍᴇɴꜱᴀᴊᴇ ᴀɴóɴɪᴍᴏ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜✉️* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴀʟɢᴜɪᴇɴ ᴛᴇ ʜᴀ ᴇɴᴠɪᴀᴅᴏ ᴇꜱᴛᴏ:*

> ## \`📩 ${mensaje}\`

ׅㅤ𓏸𓈒ㅤׄ *ᴛᴏᴋᴇɴ ᴘᴀʀᴀ ʀᴇꜱᴘᴏɴᴅᴇʀ* :: \`${token}\`
ׅㅤ𓏸𓈒ㅤׄ *ʀᴇꜱᴘᴏɴᴅᴇʀ* :: \`${usedPrefix}responder ${token} Tu respuesta aquí\`
ׅㅤ𓏸𓈒ㅤׄ *ɪᴍᴘᴏʀᴛᴀɴᴛᴇ* :: ᴇꜱᴛᴇ ᴛᴏᴋᴇɴ ᴇꜱ úɴɪᴄᴏ ʏ ᴠᴀʟɪᴅᴏ ꜱᴏʟᴏ ʜᴀꜱᴛᴀ ǫᴜᴇ ʀᴇꜱᴘᴏɴᴅᴀꜱ

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                    contextInfo: { ...rcanal }
                });

                // Confirmar al remitente que se envió (SIN revelar si el destinatario recibió o no)
                await conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ 🕊️ ׄ ⬭ *¡ᴍᴇɴꜱᴀᴊᴇ ᴇɴᴠɪᴀᴅᴏ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜✅* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴛᴜ ᴍᴇɴꜱᴀᴊᴇ ʜᴀ ꜱɪᴅᴏ ᴇɴᴠɪᴀᴅᴏ ᴀɴóɴɪᴍᴀᴍᴇɴᴛᴇ.*
ׅㅤ𓏸𓈒ㅤׄ *ᴛᴏᴋᴇɴ* :: \`${token}\`
ׅㅤ𓏸𓈒ㅤׄ *ꜱɪ ʀᴇꜱᴘᴏɴᴅᴇɴ, ᴛᴇ ʟʟᴇɢᴀʀá ᴀǫᴜí.*

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                    contextInfo: { ...rcanal }
                });
            } catch (error) {
                console.error(error);
                await conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ 🕊️ ׄ ⬭ *¡ᴇʀʀᴏʀ ᴀʟ ᴇɴᴠɪᴀʀ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❌* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ɴᴏ ꜱᴇ ᴘᴜᴅᴏ ᴇɴᴠɪᴀʀ ᴇʟ ᴍᴇɴꜱᴀᴊᴇ. ᴠᴇʀɪꜰɪᴄᴀ ǫᴜᴇ ᴇʟ ɴúᴍᴇʀᴏ ꜱᴇᴀ ᴄᴏʀʀᴇᴄᴛᴏ ʏ ᴛᴇɴɢᴀ ᴡʜᴀᴛꜱᴀᴘᴘ.*
ׅㅤ𓏸𓈒ㅤׄ *ᴇʀʀᴏʀ* :: ${error.message || 'Desconocido'}

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                    contextInfo: { ...rcanal }
                });
                // Eliminar el mensaje guardado si falla el envío
                global.anonymousMessages.delete(token);
            }
            break;
        }

        // ===== RESPONDER A MENSAJE ANÓNIMO =====
        case 'responder': {
            const args = text.trim().split(/\s+/);
            if (args.length < 2) {
                return conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ 🕊️ ׄ ⬭ *¡ᴜꜱᴏ ɪɴᴄᴏʀʀᴇᴄᴛᴏ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❓* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴄᴏᴍᴏ ᴜꜱᴀʀ* :: \`${usedPrefix}responder TOKEN123 Tu respuesta\`
ׅㅤ𓏸𓈒ㅤׄ *ᴇᴊᴇᴍᴘʟᴏ* :: \`${usedPrefix}responder ABC12 Hola, gracias por el mensaje\`

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                    contextInfo: { ...rcanal }
                }, { quoted: m });
            }

            const token = args[0].toUpperCase();
            const respuesta = args.slice(1).join(' ');
            if (!respuesta) {
                return conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ 🕊️ ׄ ⬭ *¡ʀᴇꜱᴘᴜᴇꜱᴛᴀ ᴠᴀᴄíᴀ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜📝* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴅᴇʙᴇꜱ ᴇꜱᴄʀɪʙɪʀ ᴀʟɢᴏ ᴘᴀʀᴀ ʀᴇꜱᴘᴏɴᴅᴇʀ.*

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                    contextInfo: { ...rcanal }
                }, { quoted: m });
            }

            if (!global.anonymousMessages.has(token)) {
                return conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ 🕊️ ׄ ⬭ *¡ᴛᴏᴋᴇɴ ɪɴᴠáʟɪᴅᴏ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🔑* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴇʟ ᴛᴏᴋᴇɴ \`${token}\` ɴᴏ ᴇxɪꜱᴛᴇ ᴏ ʏᴀ ꜰᴜᴇ ᴜᴛɪʟɪᴢᴀᴅᴏ.*

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                    contextInfo: { ...rcanal }
                }, { quoted: m });
            }

            const mensajeData = global.anonymousMessages.get(token);
            if (mensajeData.respondido) {
                return conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ 🕊️ ׄ ⬭ *¡ᴛᴏᴋᴇɴ ʏᴀ ᴜᴛɪʟɪᴢᴀᴅᴏ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜⚠️* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ʏᴀ ꜱᴇ ʀᴇꜱᴘᴏɴᴅɪó ᴀ ᴇꜱᴛᴇ ᴍᴇɴꜱᴀᴊᴇ ᴀɴᴛᴇʀɪᴏʀᴍᴇɴᴛᴇ.*

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                    contextInfo: { ...rcanal }
                }, { quoted: m });
            }

            // Verificar que quien responde es el destinatario original
            if (mensajeData.destinatario !== m.sender) {
                return conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ 🕊️ ׄ ⬭ *¡ᴛᴏᴋᴇɴ ɴᴏ ᴠáʟɪᴅᴏ ᴘᴀʀᴀ ᴛɪ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🚫* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴇꜱᴛᴇ ᴛᴏᴋᴇɴ ᴄᴏʀʀᴇꜱᴘᴏɴᴅᴇ ᴀ ᴏᴛʀᴀ ᴘᴇʀꜱᴏɴᴀ.*

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                    contextInfo: { ...rcanal }
                }, { quoted: m });
            }

            // Marcar como respondido
            mensajeData.respondido = true;
            global.anonymousMessages.set(token, mensajeData);

            // Enviar la respuesta al remitente original (totalmente anónima)
            try {
                await conn.sendMessage(mensajeData.remitenteOriginal, {
                    text: `> . ﹡ ﹟ 🕊️ ׄ ⬭ *¡ʀᴇꜱᴘᴜᴇꜱᴛᴀ ᴀɴóɴɪᴍᴀ ʀᴇᴄɪʙɪᴅᴀ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜💬* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴛᴜ ᴍᴇɴꜱᴀᴊᴇ ᴏʀɪɢɪɴᴀʟ:*
> ## \`📩 ${mensajeData.mensaje}\`

ׅㅤ𓏸𓈒ㅤׄ *ʀᴇꜱᴘᴜᴇꜱᴛᴀ:*
> ## \`✉️ ${respuesta}\`

ׅㅤ𓏸𓈒ㅤׄ *ᴇʟ ᴅᴇꜱᴛɪɴᴀᴛᴀʀɪᴏ ᴛᴇ ʀᴇꜱᴘᴏɴᴅɪó ᴀɴóɴɪᴍᴀᴍᴇɴᴛᴇ.*

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                    contextInfo: { ...rcanal }
                });

                // Confirmar al que respondió que se envió
                await conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ 🕊️ ׄ ⬭ *¡ʀᴇꜱᴘᴜᴇꜱᴛᴀ ᴇɴᴠɪᴀᴅᴀ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜✅* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴛᴜ ʀᴇꜱᴘᴜᴇꜱᴛᴀ ʜᴀ ꜱɪᴅᴏ ᴇɴᴠɪᴀᴅᴀ ᴀɴóɴɪᴍᴀᴍᴇɴᴛᴇ.*

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                    contextInfo: { ...rcanal }
                });
            } catch (error) {
                console.error(error);
                await conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ 🕊️ ׄ ⬭ *¡ᴇʀʀᴏʀ ᴀʟ ᴇɴᴠɪᴀʀ ʀᴇꜱᴘᴜᴇꜱᴛᴀ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❌* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ɴᴏ ꜱᴇ ᴘᴜᴅᴏ ᴇɴᴠɪᴀʀ ʟᴀ ʀᴇꜱᴘᴜᴇꜱᴛᴀ. ᴇʟ ᴜꜱᴜᴀʀɪᴏ ᴏʀɪɢɪɴᴀʟ ᴘᴜᴇᴅᴇ ǫᴜᴇ ʏᴀ ɴᴏ ᴇꜱᴛᴇ ᴅɪꜱᴘᴏɴɪʙʟᴇ.*

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                    contextInfo: { ...rcanal }
                });
            }
            break;
        }
    }
}

handler.help = ['anonimo <número> <mensaje>', 'responder <token> <respuesta>']
handler.tags = ['fun', 'anonymous']
handler.command = ['anonimo', 'responder']
handler.private = true

export default handler