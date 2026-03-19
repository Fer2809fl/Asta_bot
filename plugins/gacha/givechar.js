// ============================================
// plugins/gacha-givechar.js (ESTILO ASTA-BOT - MÍNIMO)
// ============================================
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

const handler = async (m, { conn, text, usedPrefix }) => {
    if (!m.mentionedJid || m.mentionedJid.length === 0 || !text) {
        return conn.sendMessage(m.chat, {
            text: `ׅㅤ𓏸𓈒ㅤׄ ❗ *ᴜsᴏ* :: ${usedPrefix}givechar @usuario <ɴᴏᴍʙʀᴇ ᴅᴇʟ ᴘᴇʀsᴏɴᴀᴊᴇ>\n\n*ᴇᴊᴇᴍᴘʟᴏ* :: ${usedPrefix}givechar @usuario ᴍɪᴋᴜ`,
            contextInfo: global.rcanal
        }, { quoted: m });
    }

    const giverId = m.sender;
    const receiverId = m.mentionedJid[0];

    if (giverId === receiverId) {
        return conn.sendMessage(m.chat, {
            text: `ׅㅤ𓏸𓈒ㅤׄ ❌ *ᴇʀʀᴏʀ* :: ɴᴏ ᴘᴜᴇᴅᴇs ʀᴇɢᴀʟᴀʀᴛᴇ ᴘᴇʀsᴏɴᴀᴊᴇs ᴀ ᴛɪ ᴍɪsᴍᴏ`,
            contextInfo: global.rcanal
        }, { quoted: m });
    }

    // Extraer nombre del personaje
    const charName = text.replace(/@\d+/g, '').trim();

    if (!charName) {
        return conn.sendMessage(m.chat, {
            text: `ׅㅤ𓏸𓈒ㅤׄ ❌ *sɪɴ ɴᴏᴍʙʀᴇ* :: ᴅᴇʙᴇs ᴇsᴘᴇᴄɪғɪᴄᴀʀ ᴇʟ ɴᴏᴍʙʀᴇ ᴅᴇʟ ᴘᴇʀsᴏɴᴀᴊᴇ`,
            contextInfo: global.rcanal
        }, { quoted: m });
    }

    const usersPath = path.join(process.cwd(), 'lib', 'gacha_users.json');
    const dbPath = path.join(process.cwd(), 'lib', 'characters.json');

    let users = {};
    if (fs.existsSync(usersPath)) {
        users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
    }

    if (!users[giverId] || !users[giverId].harem || users[giverId].harem.length === 0) {
        return conn.sendMessage(m.chat, {
            text: `ׅㅤ𓏸𓈒ㅤׄ ❌ *sɪɴ ᴘᴇʀsᴏɴᴀᴊᴇs* :: ɴᴏ ᴛɪᴇɴᴇs ᴘᴇʀsᴏɴᴀᴊᴇs ᴘᴀʀᴀ ʀᴇɢᴀʟᴀʀ`,
            contextInfo: global.rcanal
        }, { quoted: m });
    }

    const charIndex = users[giverId].harem.findIndex(c => 
        c.name.toLowerCase().includes(charName.toLowerCase())
    );

    if (charIndex === -1) {
        return conn.sendMessage(m.chat, {
            text: `ׅㅤ𓏸𓈒ㅤׄ ❌ *ɴᴏ ᴇɴᴄᴏɴᴛʀᴀᴅᴏ* :: ɴᴏ ᴛɪᴇɴᴇs ᴇsᴇ ᴘᴇʀsᴏɴᴀᴊᴇ ᴇɴ ᴛᴜ ʜᴀʀᴇᴍ`,
            contextInfo: global.rcanal
        }, { quoted: m });
    }

    // Inicializar receptor si no existe
    if (!users[receiverId]) {
        users[receiverId] = {
            harem: [],
            favorites: [],
            claimMessage: '✧ {user} ha reclamado a {character}!',
            lastRoll: 0,
            votes: {},
            gachaCoins: 1000
        };
    }

    const char = users[giverId].harem[charIndex];

    // Verificar si el receptor ya tiene el personaje
    const alreadyHas = users[receiverId].harem.find(c => c.id === char.id);
    if (alreadyHas) {
        return conn.sendMessage(m.chat, {
            text: `ׅㅤ𓏸𓈒ㅤׄ ⚠️ *ʏᴀ ᴛɪᴇɴᴇ* :: ᴇsᴇ ᴜsᴜᴀʀɪᴏ ʏᴀ ᴛɪᴇɴᴇ ᴇsᴛᴇ ᴘᴇʀsᴏɴᴀᴊᴇ`,
            contextInfo: global.rcanal
        }, { quoted: m });
    }

    // Transferir personaje
    users[receiverId].harem.push({ ...char, claimedAt: Date.now(), forSale: false, salePrice: 0 });
    users[giverId].harem.splice(charIndex, 1);

    // Actualizar en DB principal
    const characters = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    const dbCharIndex = characters.findIndex(c => c.id === char.id);
    if (dbCharIndex !== -1) {
        characters[dbCharIndex].user = receiverId;
        fs.writeFileSync(dbPath, JSON.stringify(characters, null, 2), 'utf-8');
    }

    // Eliminar de favoritos si está
    users[giverId].favorites = users[giverId].favorites.filter(id => id !== char.id);

    fs.writeFileSync(usersPath, JSON.stringify(users, null, 2), 'utf-8');

    const giverName = await conn.getName(giverId);
    const receiverName = await conn.getName(receiverId);

    // ========== TEXTO CON ESTILO ASTA-BOT ==========
    const txt = `
> . ﹡ ﹟ 🎁 ׄ ⬭ *¡ʀᴇɢᴀʟᴏ ᴇɴᴠɪᴀᴅᴏ!* @${giverId.split('@')[0]}

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🎁* ㅤ֢ㅤ⸱ㅤᯭִ*

> ## \`ᴛʀᴀɴsғᴇʀᴇɴᴄɪᴀ ᴄᴏᴍᴘʟᴇᴛᴀᴅᴀ 🎁\`

ׅㅤ𓏸𓈒ㅤׄ *ᴘᴇʀsᴏɴᴀᴊᴇ* :: ${char.name}
ׅㅤ𓏸𓈒ㅤׄ *sᴇʀɪᴇ* :: ${char.source}
ׅㅤ𓏸𓈒ㅤׄ *ᴠᴀʟᴏʀ* :: ${char.value}
ׅㅤ𓏸𓈒ㅤׄ *ᴅᴏɴᴀᴅᴏʀ* :: ${giverName}
ׅㅤ𓏸𓈒ㅤׄ *ʀᴇᴄᴇᴘᴛᴏʀ* :: ${receiverName}

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀᴄᴛᴏ ᴅᴇ ɢᴇɴᴇʀᴏsɪᴅᴀᴅ*`;

    try {
        await conn.sendMessage(m.chat, { 
            text: txt,
            contextInfo: {
                mentionedJid: [giverId, receiverId],
                ...global.rcanal
            }
        }, { quoted: m });

        // Notificar al receptor
        const receiverTxt = `
> . ﹡ ﹟ 🎁 ׄ ⬭ *¡ʀᴇɢᴀʟᴏ ʀᴇᴄɪʙɪᴅᴏ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🎁* ㅤ֢ㅤ⸱ㅤᯭִ*

*${giverName}* ᴛᴇ ʜᴀ ʀᴇɢᴀʟᴀᴅᴏ ᴀ *${char.name}*!

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴅɪsғʀᴜᴛᴀ ᴛᴜ ɴᴜᴇᴠᴀ ᴡᴀɪғᴜ*`;

        conn.sendMessage(receiverId, { 
            text: receiverTxt,
            contextInfo: global.rcanal
        });
        
    } catch (e) {
        await conn.reply(m.chat, txt, m);
    }
};

handler.help = ['givechar', 'givewaifu', 'regalar'];
handler.tags = ['gacha'];
handler.command = ['givechar', 'givewaifu', 'regalar'];
handler.group = true;
handler.reg = true;

export default handler;
