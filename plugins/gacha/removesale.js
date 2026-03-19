// ============================================
// plugins/gacha-removesale.js (ESTILO ASTA-BOT - MÍNIMO)
// ============================================
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

const handler = async (m, { conn, text, usedPrefix }) => {
    if (!text) {
        return conn.sendMessage(m.chat, {
            text: `ׅㅤ𓏸𓈒ㅤׄ ❗ *ᴜsᴏ* :: ${usedPrefix}removesale <ɴᴏᴍʙʀᴇ ᴅᴇʟ ᴘᴇʀsᴏɴᴀᴊᴇ>`,
            contextInfo: global.rcanal
        }, { quoted: m });
    }

    const userId = m.sender;
    const usersPath = path.join(process.cwd(), 'lib', 'gacha_users.json');

    let users = {};
    if (fs.existsSync(usersPath)) {
        users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
    }

    if (!users[userId] || !users[userId].harem || users[userId].harem.length === 0) {
        return conn.sendMessage(m.chat, {
            text: `ׅㅤ𓏸𓈒ㅤׄ ❌ *sɪɴ ᴘᴇʀsᴏɴᴀᴊᴇs* :: ɴᴏ ᴛɪᴇɴᴇs ᴡᴀɪғᴜs ᴇɴ ᴠᴇɴᴛᴀ`,
            contextInfo: global.rcanal
        }, { quoted: m });
    }

    const charIndex = users[userId].harem.findIndex(c => 
        c.name.toLowerCase().includes(text.toLowerCase()) && c.forSale
    );

    if (charIndex === -1) {
        return conn.sendMessage(m.chat, {
            text: `ׅㅤ𓏸𓈒ㅤׄ ❌ *ɴᴏ ᴇɴ ᴠᴇɴᴛᴀ* :: ɴᴏ ᴛɪᴇɴᴇs ᴇsᴇ ᴡᴀɪғᴜ ᴇɴ ᴠᴇɴᴛᴀ`,
            contextInfo: global.rcanal
        }, { quoted: m });
    }

    const char = users[userId].harem[charIndex];

    // Quitar de venta
    users[userId].harem[charIndex].forSale = false;
    users[userId].harem[charIndex].salePrice = 0;

    fs.writeFileSync(usersPath, JSON.stringify(users, null, 2), 'utf-8');

    // ========== TEXTO CON ESTILO ASTA-BOT ==========
    const txt = `
> . ﹡ ﹟ 🏪 ׄ ⬭ *ᴘᴇʀsᴏɴᴀᴊᴇ ʀᴇᴛɪʀᴀᴅᴏ* @${userId.split('@')[0]}

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🏪* ㅤ֢ㅤ⸱ㅤᯭִ*

> ## \`ғᴜᴇʀᴀ ᴅᴇ ʟᴀ ᴛɪᴇɴᴅᴀ ✅\`

ׅㅤ𓏸𓈒ㅤׄ *ɴᴏᴍʙʀᴇ* :: ${char.name}
ׅㅤ𓏸𓈒ㅤׄ *sᴇʀɪᴇ* :: ${char.source}
ׅㅤ𓏸𓈒ㅤׄ *ᴠᴀʟᴏʀ* :: ${char.value}

> . ﹡ ﹟ ⚡ ׄ ⬭ *${char.name} ʏᴀ ɴᴏ ᴇsᴛᴀ́ ᴇɴ ᴠᴇɴᴛᴀ*`;

    try {
        await conn.sendMessage(m.chat, { 
            text: txt,
            contextInfo: {
                mentionedJid: [userId],
                ...global.rcanal
            }
        }, { quoted: m });
        
    } catch (e) {
        await conn.sendMessage(m.chat, {
            text: txt,
            contextInfo: global.rcanal
        }, { quoted: m });
    }
};

handler.help = ['removesale', 'removerventa'];
handler.tags = ['gacha'];
handler.command = ['removesale', 'removerventa'];
handler.group = true;
handler.reg = true;

export default handler;
