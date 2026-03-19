// ============================================
// plugins/gacha-rejecttrade.js (ESTILO ASTA-BOT - MÍNIMO)
// ============================================
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

const handler = async (m, { conn, usedPrefix }) => {
    const userId = m.sender;

    if (!global.tradeRequests) {
        return conn.sendMessage(m.chat, {
            text: `ׅㅤ𓏸𓈒ㅤׄ ❌ *sɪɴ sᴏʟɪᴄɪᴛᴜᴅᴇs* :: ɴᴏ ʜᴀʏ sᴏʟɪᴄɪᴛᴜᴅᴇs ᴅᴇ ɪɴᴛᴇʀᴄᴀᴍʙɪᴏ ᴘᴇɴᴅɪᴇɴᴛᴇs`,
            contextInfo: global.rcanal
        }, { quoted: m });
    }

    // Buscar solicitud pendiente para este usuario
    let tradeId = null;
    let trade = null;

    for (const [id, data] of Object.entries(global.tradeRequests)) {
        if (data.user2 === userId && Date.now() < data.expires) {
            tradeId = id;
            trade = data;
            break;
        }
    }

    if (!trade) {
        return conn.sendMessage(m.chat, {
            text: `ׅㅤ𓏸𓈒ㅤׄ ❌ *sɪɴ ᴛʀᴀᴅᴇs* :: ɴᴏ ᴛɪᴇɴᴇs sᴏʟɪᴄɪᴛᴜᴅᴇs ᴘᴇɴᴅɪᴇɴᴛᴇs ᴏ ʜᴀɴ ᴇxᴘɪʀᴀᴅᴏ`,
            contextInfo: global.rcanal
        }, { quoted: m });
    }

    const user1Name = await conn.getName(trade.user1);
    const user2Name = await conn.getName(trade.user2);

    // ========== TEXTO CON ESTILO ASTA-BOT ==========
    const txt = `
> . ﹡ ﹟ ❌ ׄ ⬭ *ɪɴᴛᴇʀᴄᴀᴍʙɪᴏ ʀᴇᴄʜᴀᴢᴀᴅᴏ* @${userId.split('@')[0]}

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❌* ㅤ֢ㅤ⸱ㅤᯭִ*

> ## \`ᴛʀᴀᴅᴇ ᴄᴀɴᴄᴇʟᴀᴅᴏ 🚫\`

ׅㅤ𓏸𓈒ㅤׄ *ʀᴇᴄʜᴀᴢᴀᴅᴏ ᴘᴏʀ* :: ${user2Name}
ׅㅤ𓏸𓈒ㅤׄ *sᴏʟɪᴄɪᴛᴀɴᴛᴇ* :: ${user1Name}

> . ﹡ ﹟ ⚡ ׄ ⬭ *ʟᴀ sᴏʟɪᴄɪᴛᴜᴅ ʜᴀ sɪᴅᴏ ʀᴇᴄʜᴀᴢᴀᴅᴀ*`;

    try {
        await conn.sendMessage(m.chat, { 
            text: txt,
            contextInfo: {
                mentionedJid: [trade.user1, trade.user2],
                ...global.rcanal
            }
        }, { quoted: m });

        // Notificar al otro usuario
        const notifyTxt = `
> . ﹡ ﹟ ❌ ׄ ⬭ *ᴛʀᴀᴅᴇ ʀᴇᴄʜᴀᴢᴀᴅᴏ*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❌* ㅤ֢ㅤ⸱ㅤᯭִ*

*${user2Name}* ʀᴇᴄʜᴀᴢᴏ́ ᴛᴜ sᴏʟɪᴄɪᴛᴜᴅ ᴅᴇ ɪɴᴛᴇʀᴄᴀᴍʙɪᴏ.

> . ﹡ ﹟ ⚡ ׄ ⬭ *ɪɴᴛᴇɴᴛᴀ ᴄᴏɴ ᴏᴛʀᴏ ᴜsᴜᴀʀɪᴏ*`;

        conn.sendMessage(trade.user1, { 
            text: notifyTxt,
            contextInfo: global.rcanal
        });

        // Eliminar solicitud
        delete global.tradeRequests[tradeId];
        
    } catch (e) {
        await conn.sendMessage(m.chat, {
            text: txt,
            contextInfo: global.rcanal
        }, { quoted: m });
    }
};

handler.help = ['rejecttrade'];
handler.tags = ['gacha'];
handler.command = ['rejecttrade', 'rechazarintercambio'];
handler.group = true;
handler.reg = true;

export default handler;
