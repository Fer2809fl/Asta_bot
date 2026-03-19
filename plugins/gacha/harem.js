// ============================================
// plugins/gacha-harem.js (ESTILO ASTA-BOT - MÍNIMO)
// ============================================
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

const handler = async (m, { conn, args, usedPrefix }) => {
    const usersPath = path.join(process.cwd(), 'lib', 'gacha_users.json');

    // Determinar usuario a consultar
    let targetUser = m.sender;
    if (m.mentionedJid && m.mentionedJid.length > 0) {
        targetUser = m.mentionedJid[0];
    } else if (args[0] && args[0].startsWith('@')) {
        const num = args[0].replace('@', '');
        targetUser = num + '@s.whatsapp.net';
    }

    // Cargar usuarios
    let users = {};
    if (fs.existsSync(usersPath)) {
        users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
    }

    if (!users[targetUser] || !users[targetUser].harem || users[targetUser].harem.length === 0) {
        return conn.sendMessage(m.chat, {
            text: `ׅㅤ𓏸𓈒ㅤׄ 📭 *sɪɴ ᴘᴇʀsᴏɴᴀᴊᴇs* :: ᴇsᴛᴇ ᴜsᴜᴀʀɪᴏ ɴᴏ ᴛɪᴇɴᴇ ᴡᴀɪғᴜs ʀᴇᴄʟᴀᴍᴀᴅᴀs`,
            contextInfo: global.rcanal
        }, { quoted: m });
    }

    const userName = await conn.getName(targetUser);
    const page = parseInt(args[1]) || 1;
    const perPage = 10;
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const totalPages = Math.ceil(users[targetUser].harem.length / perPage);

    // Construir lista de personajes con estilo
    let charList = '';
    users[targetUser].harem.slice(start, end).forEach((char, i) => {
        const isFav = users[targetUser].favorites.includes(char.id);
        const forSale = char.forSale ? `🏪 $${char.salePrice}` : '';
        charList += `\n` +
            `ׅㅤ𓏸𓈒ㅤׄ ${start + i + 1}. *${char.name}* ${isFav ? '⭐' : ''}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ • 📺 ${char.source}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ • 💎 ${char.value}${forSale ? ` • ${forSale}` : ''}`;
    });

    // ========== TEXTO CON ESTILO ASTA-BOT ==========
    const txt = `
> . ﹡ ﹟ 💖 ׄ ⬭ *ʜᴀʀᴇᴍ ᴅᴇ* @${targetUser.split('@')[0]}

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜💕* ㅤ֢ㅤ⸱ㅤᯭִ*

> ## \`ᴇsᴛᴀᴅɪ́sᴛɪᴄᴀs 📊\`

ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴜᴀʀɪᴏ* :: ${userName}
ׅㅤ𓏸𓈒ㅤׄ *ᴛᴏᴛᴀʟ* :: ${users[targetUser].harem.length} ᴡᴀɪғᴜs
ׅㅤ𓏸𓈒ㅤׄ *ғᴀᴠᴏʀɪᴛᴀs* :: ${users[targetUser].favorites.length}
ׅㅤ𓏸𓈒ㅤׄ *ᴘᴀ́ɢɪɴᴀ* :: ${page}/${totalPages}

${charList}

${totalPages > 1 ? `> . ﹡ ﹟ 💡 ׄ ⬭ *ᴜsᴀ ${usedPrefix}harem @usuario ${page + 1} ᴘᴀʀᴀ ᴠᴇʀ ᴍᴀ́s*` : ''}`.trim();

    // ========== SISTEMA DE ENVÍO ASTA-BOT ==========
    const isSubBot = conn.user?.jid !== global.conn?.user?.jid;
    const botConfig = conn.subConfig || {};

    // Obtener imagen del primer personaje o fallback
    const firstChar = users[targetUser].harem[0];
    const charImg = firstChar?.img && firstChar.img.length > 0 
        ? firstChar.img[0]
        : null;

    let thumbnail = null;
    if (charImg) {
        try {
            const response = await fetch(charImg);
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
                mentionedJid: [targetUser],
                ...global.rcanal
            }
        }, { quoted: m });
        
    } catch (e) {
        await conn.reply(m.chat, txt, m);
    }
};

handler.help = ['harem', 'waifus', 'claims'];
handler.tags = ['gacha'];
handler.command = ['harem', 'waifus', 'claims'];
handler.group = true;
handler.reg = true;

export default handler;
