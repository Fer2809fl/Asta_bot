// ============================================
// plugins/gacha-haremshop.js (ESTILO ASTA-BOT - MÍNIMO)
// ============================================
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

const handler = async (m, { conn, args, usedPrefix }) => {
    const usersPath = path.join(process.cwd(), 'lib', 'gacha_users.json');

    let users = {};
    if (fs.existsSync(usersPath)) {
        users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
    }

    // Obtener todos los personajes en venta
    let forSale = [];
    for (const [userId, userData] of Object.entries(users)) {
        if (userData.harem) {
            userData.harem.forEach(char => {
                if (char.forSale) {
                    forSale.push({
                        ...char,
                        ownerId: userId
                    });
                }
            });
        }
    }

    if (forSale.length === 0) {
        return conn.sendMessage(m.chat, {
            text: `ׅㅤ𓏸𓈒ㅤׄ 🏪 *ᴛɪᴇɴᴅᴀ ᴠᴀᴄɪ́ᴀ* :: ɴᴏ ʜᴀʏ ᴡᴀɪғᴜs ᴇɴ ᴠᴇɴᴛᴀ ᴀᴄᴛᴜᴀʟᴍᴇɴᴛᴇ`,
            contextInfo: global.rcanal
        }, { quoted: m });
    }

    const page = parseInt(args[0]) || 1;
    const perPage = 10;
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const totalPages = Math.ceil(forSale.length / perPage);

    // Construir lista
    let shopList = '';
    for (let i = start; i < end && i < forSale.length; i++) {
        const char = forSale[i];
        const ownerName = await conn.getName(char.ownerId);
        shopList += `\n` +
            `ׅㅤ𓏸𓈒ㅤׄ ${i + 1}. *${char.name}*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ • 📺 ${char.source}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ • 💎 ᴠᴀʟᴏʀ: ${char.value}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ • 💰 ᴘʀᴇᴄɪᴏ: ¥${char.salePrice}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ • 👤 ᴠᴇɴᴅᴇᴅᴏʀ: ${ownerName}`;
    }

    // ========== TEXTO CON ESTILO ASTA-BOT ==========
    const txt = `
> . ﹡ ﹟ 🏪 ׄ ⬭ *ᴛɪᴇɴᴅᴀ ᴅᴇ ᴡᴀɪғᴜs*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🛒* ㅤ֢ㅤ⸱ㅤᯭִ*

> ## \`ᴍᴇʀᴄᴀᴅᴏ ᴅᴇ ᴘᴇʀsᴏɴᴀᴊᴇs 🏪\`

ׅㅤ𓏸𓈒ㅤׄ *ᴅɪsᴘᴏɴɪʙʟᴇs* :: ${forSale.length}
ׅㅤ𓏸𓈒ㅤׄ *ᴘᴀ́ɢɪɴᴀ* :: ${page}/${totalPages}

${shopList}

> . ﹡ ﹟ 💡 ׄ ⬭ *ᴜsᴀ ${usedPrefix}buychar <ɴᴏᴍʙʀᴇ> ᴘᴀʀᴀ ᴄᴏᴍᴘʀᴀʀ*`.trim();

    // ========== SISTEMA DE ENVÍO ASTA-BOT ==========
    const isSubBot = conn.user?.jid !== global.conn?.user?.jid;
    const botConfig = conn.subConfig || {};

    // Imagen del primer personaje en venta
    const firstItem = forSale[0];
    let thumbnail = null;
    if (firstItem?.img?.length > 0) {
        try {
            const response = await fetch(firstItem.img[0]);
            if (response.ok) thumbnail = await response.buffer();
        } catch (e) {}
    }

    if (!thumbnail) {
        let imageUrl = isSubBot && botConfig.logoUrl ? botConfig.logoUrl 
            : global.icono || global.banner 
            || 'https://i.ibb.co/0Q3J9XZ/file.jpg';
        try {
            const response = await fetch(imageUrl);
            if (response.ok) thumbnail = await response.buffer();
        } catch (e) {}
    }

    try {
        await conn.sendMessage(m.chat, { 
            text: txt,
            contextInfo: {
                ...global.rcanal
            }
        }, { quoted: m });
        
    } catch (e) {
        await conn.reply(m.chat, txt, m);
    }
};

handler.help = ['haremshop', 'tiendawaifus', 'wshop'];
handler.tags = ['gacha'];
handler.command = ['haremshop', 'tiendawaifus', 'wshop'];
handler.group = true;
handler.reg = true;

export default handler;
