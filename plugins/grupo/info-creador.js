const handler = async (m, { conn, usedPrefix, command }) => {
  try {
    // Obtener la lista de dueños desde settings.js
    const ownersList = global.owner || [];
    
    // Verificar si hay dueños configurados
    if (!ownersList || ownersList.length === 0) {
      return await conn.reply(m.chat, 
        `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴇʀʀᴏʀ*\n\n` +
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 🚫 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴅᴇᴛᴀʟʟᴇ* :: No hay dueños configurados en el bot`, m);
    }

    // Obtener información adicional de los archivos
    const botName = global.botname || 'ᴀsᴛᴀ-ʙᴏᴛ';
    const devName = global.dev || 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ ғᴇʀɴᴀɴᴅᴏ';
    const githubLink = global.github || 'https://github.com/Fer280809/Asta-bot';
    const gmail = global.gmail || 'fer2809fl@gmail.com';

    // Función para normalizar la entrada de dueños
    const normalizeOwner = (ownerEntry, index) => {
      if (Array.isArray(ownerEntry)) {
        const [number, name, role, region, email, note] = ownerEntry;
        return {
          number: number || '',
          name: name || `Colaborador ${index + 1}`,
          role: role || (index === 0 ? 'Creador Principal' : 'Desarrollador'),
          region: region || 'México',
          email: email || gmail,
          note: note || (index === 0 ? 'Desarrollador principal de Asta Bot' : 'Soporte y desarrollo')
        };
      }
      
      return {
        number: ownerEntry,
        name: index === 0 ? (global.etiqueta || 'Fernando') : `Colaborador ${index + 1}`,
        role: index === 0 ? 'Creador Principal' : 'Desarrollador',
        region: 'México',
        email: gmail,
        note: index === 0 ? 'Desarrollador principal de Asta Bot' : 'Soporte y desarrollo'
      };
    };

    // Lista de dueños normalizada
    const owners = ownersList.map((entry, index) => normalizeOwner(entry, index));

    // Si el comando tiene argumento, mostrar un dueño específico
    const text = m.text || '';
    const args = text.split(' ');
    let targetOwner;
    
    if (args.length > 1 && !isNaN(args[1])) {
      const index = parseInt(args[1]) - 1;
      if (index >= 0 && index < owners.length) {
        targetOwner = owners[index];
      }
    }

    // Mostrar dueño específico
    if (targetOwner) {
      const contact = {
        ...targetOwner,
        org: devName,
        website: githubLink
      };

      // Generar vCard
      const generateVCard = ({ number, name, org, email, region, website, note }) => {
        return `
BEGIN:VCARD
VERSION:3.0
FN:${name.replace(/\n/g, '\\n').trim()}
ORG:${org.replace(/\n/g, '\\n').trim()}
TEL;type=CELL;waid=${number}:+${number}
EMAIL:${email.replace(/\n/g, '\\n').trim()}
ADR:;;${region};;;;
URL:${website.replace(/\n/g, '\\n').trim()}
NOTE:${note.replace(/\n/g, '\\n').trim()}
END:VCARD`.trim();
      };

      const vcard = generateVCard(contact);
      
      const mensaje = 
        `> . ﹡ ﹟ 👑 ׄ ⬭ *ᴄᴏɴᴛᴀᴄᴛᴏ ᴅᴇ ᴅᴇsᴀʀʀᴏʟʟᴀᴅᴏʀ*\n\n` +
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 💎 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ɴᴏᴍʙʀᴇ* :: ${contact.name}\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ʀᴏʟ* :: ${contact.role}\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ɴᴜ́ᴍᴇʀᴏ* :: +${contact.number}\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ʀᴇɢɪᴏ́ɴ* :: ${contact.region}\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴇᴍᴀɪʟ* :: ${contact.email}\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ɢɪᴛʜᴜʙ* :: ${contact.website}\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ɴᴏᴛᴀ* :: ${contact.note}\n\n` +
        `> ✦ *ᴛᴀʀᴊᴇᴛᴀ* :: Enviada como contacto digital`;
      
      await conn.reply(m.chat, mensaje, m);
      await conn.sendMessage(m.chat, {
        contacts: {
          displayName: contact.name,
          contacts: [{ 
            vcard, 
            displayName: contact.name 
          }]
        }
      }, { quoted: m });
      
    } else {
      // Mostrar lista de todos los dueños
      let listaOwners = 
        `> . ﹡ ﹟ 👥 ׄ ⬭ *ᴅᴇsᴀʀʀᴏʟʟᴀᴅᴏʀᴇs*\n\n` +
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ 🚀 ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ʙᴏᴛ* :: ${botName}\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴛᴏᴛᴀʟ* :: ${owners.length} desarrolladores\n\n` +
        `> ✦ *ʟɪsᴛᴀ ᴅᴇ ᴅᴇsᴀʀʀᴏʟʟᴀᴅᴏʀᴇs* ::\n\n`;
      
      owners.forEach((owner, index) => {
        listaOwners += 
          `> . ﹡ ﹟ ${index + 1} ׄ ⬭ *${owner.role}*\n` +
          `ׅㅤ𓏸𓈒ㅤׄ *ɴᴏᴍʙʀᴇ* :: ${owner.name}\n` +
          `ׅㅤ𓏸𓈒ㅤׄ *ɴᴜ́ᴍᴇʀᴏ* :: +${owner.number}\n\n`;
      });
      
      listaOwners += 
        `> ✧ *ᴜsᴏ* :: ${usedPrefix}${command} [número]\n` +
        `> ✦ *ᴇᴊᴇᴍᴘʟᴏ* :: ${usedPrefix}${command} 1`;
      
      await conn.reply(m.chat, listaOwners, m);
    }
    
  } catch (e) {
    console.error(e);
    const errorMsg = 
      `> . ﹡ ﹟ ❌ ׄ ⬭ *ᴇʀʀᴏʀ*\n\n` +
      `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ ⚠️ ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
      `ׅㅤ𓏸𓈒ㅤׄ *ᴅᴇᴛᴀʟʟᴇ* :: No se pudo obtener la información\n\n` +
      `> ✦ *sᴏʟᴜᴄɪᴏɴᴇs* ::\n` +
      `ׅㅤ𓏸𓈒ㅤׄ • Verifica tu conexión a internet\n` +
      `ׅㅤ𓏸𓈒ㅤׄ • Intenta nuevamente\n` +
      `ׅㅤ𓏸𓈒ㅤׄ • Contacta con soporte`;
    await conn.reply(m.chat, errorMsg, m);
  }
}

handler.command = ['owner', 'creador', 'dueño', 'desarrollador', 'dev']
handler.category = 'información'
handler.desc = 'Contacto de los desarrolladores del bot'
handler.example = '%prefix%owner'
handler.premium = false
handler.owner = false

export default handler
