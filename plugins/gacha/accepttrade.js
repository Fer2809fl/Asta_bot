// ============================================
// plugins/gacha-accepttrade.js (ESTILO ASTA-BOT)
// ============================================
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

async function getRcanal() {
    try {
        const thumb = await (await fetch(global.icono)).buffer()
        return {
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: global.channelRD?.id || "120363399175402285@newsletter",
                serverMessageId: '',
                newsletterName: global.channelRD?.name || "『𝕬𝖘𝖙𝖆-𝕭𝖔𝖙』"
            },
            externalAdReply: {
                title: global.botname || 'ᴀsᴛᴀ-ʙᴏᴛ',
                body: global.dev || 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ ғᴇʀɴᴀɴᴅᴏ',
                mediaType: 1,
                mediaUrl: global.redes,
                sourceUrl: global.redes,
                thumbnail: thumb,
                showAdAttribution: false,
                containsAutoReply: true,
                renderLargerThumbnail: true
            }
        }
    } catch { return {} }
}

const handler = async (m, { conn, usedPrefix }) => {
    const rcanal = await getRcanal()
    const userId = m.sender;

    if (!global.tradeRequests) {
        return conn.sendMessage(m.chat, {
            text: `ׅㅤ𓏸𓈒ㅤׄ ❌ *sɪɴ sᴏʟɪᴄɪᴛᴜᴅᴇs* :: ɴᴏ ʜᴀʏ sᴏʟɪᴄɪᴛᴜᴅᴇs ᴅᴇ ɪɴᴛᴇʀᴄᴀᴍʙɪᴏ ᴘᴇɴᴅɪᴇɴᴛᴇs`,
            contextInfo: rcanal
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
            contextInfo: rcanal
        }, { quoted: m });
    }

    const usersPath = path.join(process.cwd(), 'lib', 'gacha_users.json');
    const dbPath = path.join(process.cwd(), 'lib', 'characters.json');
    let users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));

    // Realizar intercambio
    const char1 = users[trade.user1].harem[trade.char1Index];
    const char2 = users[trade.user2].harem[trade.char2Index];

    // Intercambiar personajes
    users[trade.user1].harem[trade.char1Index] = { ...char2, claimedAt: Date.now() };
    users[trade.user2].harem[trade.char2Index] = { ...char1, claimedAt: Date.now() };

    // Actualizar en DB principal
    const characters = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    const char1Idx = characters.findIndex(c => c.id === char1.id);
    const char2Idx = characters.findIndex(c => c.id === char2.id);

    if (char1Idx !== -1) characters[char1Idx].user = trade.user2;
    if (char2Idx !== -1) characters[char2Idx].user = trade.user1;

    fs.writeFileSync(dbPath, JSON.stringify(characters, null, 2), 'utf-8');
    fs.writeFileSync(usersPath, JSON.stringify(users, null, 2), 'utf-8');

    const user1Name = await conn.getName(trade.user1);
    const user2Name = await conn.getName(trade.user2);

    // ========== TEXTO CON ESTILO ASTA-BOT ==========
    const txt = 
        `> . ﹡ ﹟ ✅ ׄ ⬭ *¡ɪɴᴛᴇʀᴄᴀᴍʙɪᴏ ᴇxɪᴛᴏsᴏ!* @${userId.split('@')[0]}\n\n` +
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🔄* ㅤ֢ㅤ⸱ㅤᯭִ*\n\n` +
        `> ## \`ᴛʀᴀᴅᴇ ᴄᴏᴍᴘʟᴇᴛᴀᴅᴏ 🤝\`\n\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴘᴀʀᴛɪᴄɪᴘᴀɴᴛᴇ* :: ${user1Name} ↔️ ${user2Name}\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴘᴇʀsᴏɴᴀᴊᴇs* ::\n` +
        `ׅㅤ𓏸𓈒ㅤׄ • ${user1Name} ʀᴇᴄɪʙɪᴏ́: *${char2.name}*\n` +
        `ׅㅤ𓏸𓈒ㅤׄ • ${user2Name} ʀᴇᴄɪʙɪᴏ́: *${char1.name}*\n\n` +
        `> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴛʀᴀɴsᴀᴄᴄɪᴏ́ɴ ғɪɴᴀʟɪᴢᴀᴅᴀ*`;

    // ========== SISTEMA DE ENVÍO ASTA-BOT ==========
    const isSubBot = conn.user?.jid !== global.conn?.user?.jid;
    const botConfig = conn.subConfig || {};

    // Intentar obtener imagen de uno de los personajes intercambiados
    const tradeImg = char1.img && char1.img.length > 0 
        ? char1.img[0] 
        : char2.img && char2.img.length > 0 
        ? char2.img[0] 
        : null;

    let thumbnail = null;
    if (tradeImg) {
        try {
            const response = await fetch(tradeImg);
            if (response.ok) thumbnail = await response.buffer();
        } catch (e) {}
    }

    if (!thumbnail) {
        let imageUrl = isSubBot && botConfig.logoUrl ? botConfig.logoUrl 
            : global.icono || 'https://i.ibb.co/0Q3J9XZ/file.jpg';
        try {
            const response = await fetch(imageUrl);
            if (response.ok) thumbnail = await response.buffer();
        } catch (e) {}
    }

    try {
        await conn.sendMessage(m.chat, { 
            text: txt,
            contextInfo: {
                mentionedJid: [trade.user1, trade.user2],
                ...rcanal,
                externalAdReply: {
                    ...rcanal.externalAdReply,
                    title: `✅ ᴛʀᴀᴅᴇ ᴄᴏᴍᴘʟᴇᴛᴀᴅᴏ`,
                    body: `${char1.name} ↔️ ${char2.name}`,
                    mediaUrl: tradeImg || global.redes,
                    thumbnail: thumbnail || rcanal.externalAdReply?.thumbnail
                }
            }
        }, { quoted: m });

        // Notificar al otro usuario
        const notifyTxt = 
            `> . ﹡ ﹟ ✅ ׄ ⬭ *¡ᴛʀᴀᴅᴇ ᴀᴄᴇᴘᴛᴀᴅᴏ!*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🔄* ㅤ֢ㅤ⸱ㅤᯭִ*\n\n` +
            `> ## \`ɪɴᴛᴇʀᴄᴀᴍʙɪᴏ ᴄᴏɴғɪʀᴍᴀᴅᴏ 💕\`\n\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *sᴏʟɪᴄɪᴛᴀɴᴛᴇ* :: ${user2Name}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴇsᴛᴀᴅᴏ* :: ᴀᴄᴇᴘᴛᴀᴅᴏ ✅\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴡᴀɪғᴜ ʀᴇᴄɪʙɪᴅᴀ* :: *${char2.name}*\n\n` +
            `> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴅɪsғʀᴜᴛᴀ ᴛᴜ ɴᴜᴇᴠᴀ ᴡᴀɪғᴜ*`;

        conn.sendMessage(trade.user1, { 
            text: notifyTxt,
            contextInfo: {
                ...rcanal,
                externalAdReply: {
                    ...rcanal.externalAdReply,
                    title: `✅ ᴛʀᴀᴅᴇ ᴀᴄᴇᴘᴛᴀᴅᴏ`,
                    body: `ʀᴇᴄɪʙɪsᴛᴇ ᴀ ${char2.name}`,
                    thumbnail: thumbnail
                }
            }
        });

        // Eliminar solicitud
        delete global.tradeRequests[tradeId];
        
    } catch (e) {
        await conn.sendMessage(m.chat, {
            text: `ׅㅤ𓏸𓈒ㅤׄ ⚠️ *ᴇʀʀᴏʀ* :: ${e.message}\n\nׅㅤ𓏸𓈒ㅤׄ *ɪɴғᴏʀᴍᴀʀ* :: ᴜsᴀ *${usedPrefix}report* ᴘᴀʀᴀ ɪɴғᴏʀᴍᴀʀ ᴇʟ ᴘʀᴏʙʟᴇᴍᴀ`,
            contextInfo: rcanal
        }, { quoted: m });
    }
};

handler.help = ['accepttrade'];
handler.tags = ['gacha'];
handler.command = ['accepttrade', 'aceptarintercambio'];
handler.group = true;
handler.reg = true;

export { handler as default };
