// ============================================
// plugins/gacha-buycharacter.js (ESTILO ASTA-BOT)
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

const handler = async (m, { conn, text, usedPrefix }) => {
    const rcanal = await getRcanal()
    
    if (!text) {
        return conn.sendMessage(m.chat, {
            text: `ׅㅤ𓏸𓈒ㅤׄ ❗ *ᴜsᴏ* :: ${usedPrefix}buychar <ɴᴏᴍʙʀᴇ ᴅᴇʟ ᴘᴇʀsᴏɴᴀᴊᴇ>`,
            contextInfo: rcanal
        }, { quoted: m });
    }

    const buyerId = m.sender;
    const usersPath = path.join(process.cwd(), 'lib', 'gacha_users.json');
    const dbPath = path.join(process.cwd(), 'lib', 'characters.json');

    let users = {};
    if (fs.existsSync(usersPath)) {
        users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
    }

    if (!users[buyerId]) {
        users[buyerId] = {
            harem: [],
            favorites: [],
            claimMessage: '✧ {user} ha reclamado a {character}!',
            lastRoll: 0,
            votes: {}
        };
    }

    // Buscar personaje en venta
    let found = null;
    let sellerId = null;
    let sellerIndex = -1;

    for (const [userId, userData] of Object.entries(users)) {
        if (userData.harem) {
            const index = userData.harem.findIndex(c => 
                c.forSale && c.name.toLowerCase().includes(text.toLowerCase())
            );
            if (index !== -1) {
                found = userData.harem[index];
                sellerId = userId;
                sellerIndex = index;
                break;
            }
        }
    }

    if (!found) {
        return conn.sendMessage(m.chat, {
            text: `ׅㅤ𓏸𓈒ㅤׄ ❌ *ɴᴏ ᴇɴᴄᴏɴᴛʀᴀᴅᴏ* :: ᴇsᴇ ᴘᴇʀsᴏɴᴀᴊᴇ ɴᴏ ᴇsᴛᴀ́ ᴇɴ ᴠᴇɴᴛᴀ`,
            contextInfo: rcanal
        }, { quoted: m });
    }

    if (sellerId === buyerId) {
        return conn.sendMessage(m.chat, {
            text: `ׅㅤ𓏸𓈒ㅤׄ ❌ *ᴇʀʀᴏʀ* :: ɴᴏ ᴘᴜᴇᴅᴇs ᴄᴏᴍᴘʀᴀʀ ᴛᴜ ᴘʀᴏᴘɪᴏ ᴘᴇʀsᴏɴᴀᴊᴇ`,
            contextInfo: rcanal
        }, { quoted: m });
    }

    // Verificar si ya tiene el personaje
    const alreadyHas = users[buyerId].harem.find(c => c.id === found.id);
    if (alreadyHas) {
        return conn.sendMessage(m.chat, {
            text: `ׅㅤ𓏸𓈒ㅤׄ ⚠️ *ʏᴀ ᴛɪᴇɴᴇs* :: ᴇsᴛᴇ ᴘᴇʀsᴏɴᴀᴊᴇ ᴇɴ ᴛᴜ ʜᴀʀᴇᴍ`,
            contextInfo: rcanal
        }, { quoted: m });
    }

    // Verificar fondos
    if (!global.db.data.users[buyerId]) {
        global.db.data.users[buyerId] = { coin: 0, bank: 0 };
    }
    if (!global.db.data.users[sellerId]) {
        global.db.data.users[sellerId] = { coin: 0, bank: 0 };
    }

    const buyerCoins = global.db.data.users[buyerId].coin || 0;

    if (buyerCoins < found.salePrice) {
        return conn.sendMessage(m.chat, {
            text: `ׅㅤ𓏸𓈒ㅤׄ ❌ *sɪɴ ғᴏɴᴅᴏs* :: ɴᴇᴄᴇsɪᴛᴀs *¥${found.salePrice}* ʏ sᴏʟᴏ ᴛɪᴇɴᴇs *¥${buyerCoins}*`,
            contextInfo: rcanal
        }, { quoted: m });
    }

    // Realizar transacción
    global.db.data.users[buyerId].coin -= found.salePrice;
    global.db.data.users[sellerId].coin += found.salePrice;

    // Transferir personaje
    const charToTransfer = { ...found, forSale: false, salePrice: 0, claimedAt: Date.now() };
    users[buyerId].harem.push(charToTransfer);
    users[sellerId].harem.splice(sellerIndex, 1);

    // Actualizar en DB principal
    const characters = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    const charIndex = characters.findIndex(c => c.id === found.id);
    if (charIndex !== -1) {
        characters[charIndex].user = buyerId;
        fs.writeFileSync(dbPath, JSON.stringify(characters, null, 2), 'utf-8');
    }

    fs.writeFileSync(usersPath, JSON.stringify(users, null, 2), 'utf-8');

    const buyerName = await conn.getName(buyerId);
    const sellerName = await conn.getName(sellerId);

    // ========== TEXTO CON ESTILO ASTA-BOT ==========
    const txt = 
        `> . ﹡ ﹟ 💰 ׄ ⬭ *¡ᴄᴏᴍᴘʀᴀ ᴇxɪᴛᴏsᴀ!* @${buyerId.split('@')[0]}\n\n` +
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜💎* ㅤ֢ㅤ⸱ㅤᯭִ*\n\n` +
        `> ## \`ᴛʀᴀɴsᴀᴄᴄɪᴏ́ɴ ᴄᴏᴍᴘʟᴇᴛᴀᴅᴀ 💰\`\n\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴘᴇʀsᴏɴᴀᴊᴇ* :: ${found.name}\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *sᴇʀɪᴇ* :: ${found.source}\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴠᴀʟᴏʀ* :: ${found.value}\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴘʀᴇᴄɪᴏ* :: ¥${found.salePrice}\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴄᴏᴍᴘʀᴀᴅᴏʀ* :: ${buyerName}\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴠᴇɴᴅᴇᴅᴏʀ* :: ${sellerName}\n\n` +
        `> . ﹡ ﹟ ⚡ ׄ ⬭ *¡${found.name} ᴀʜᴏʀᴀ ᴇs ᴛᴜʏᴀ!*`;

    // ========== SISTEMA DE ENVÍO ASTA-BOT ==========
    const isSubBot = conn.user?.jid !== global.conn?.user?.jid;
    const botConfig = conn.subConfig || {};

    let thumbnail = null;
    if (found.img && found.img.length > 0) {
        try {
            const response = await fetch(found.img[0]);
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
                mentionedJid: [buyerId, sellerId],
                ...rcanal,
                externalAdReply: {
                    ...rcanal.externalAdReply,
                    title: `💰 ${found.name} ᴀᴅǫᴜɪʀɪᴅᴀ`,
                    body: `ᴄᴏᴍᴘʀᴀᴅᴀ ᴘᴏʀ ${buyerName} • ¥${found.salePrice}`,
                    mediaUrl: found.img?.[0] || global.redes,
                    thumbnail: thumbnail || rcanal.externalAdReply?.thumbnail
                }
            }
        }, { quoted: m });

        // Notificar al vendedor
        const notifyTxt = 
            `> . ﹡ ﹟ 💰 ׄ ⬭ *¡ᴠᴇɴᴛᴀ ʀᴇᴀʟɪᴢᴀᴅᴀ!*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜💎* ㅤ֢ㅤ⸱ㅤᯭִ*\n\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴄᴏᴍᴘʀᴀᴅᴏʀ* :: ${buyerName}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴘᴇʀsᴏɴᴀᴊᴇ* :: ${found.name}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴘʀᴇᴄɪᴏ* :: ¥${found.salePrice}\n\n` +
            `> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴛᴜs ᴍᴏɴᴇᴅᴀs ʜᴀɴ sɪᴅᴏ ᴀᴄʀᴇᴅɪᴛᴀᴅᴀs*`;

        conn.sendMessage(sellerId, { 
            text: notifyTxt,
            contextInfo: {
                ...rcanal,
                externalAdReply: {
                    ...rcanal.externalAdReply,
                    title: `💰 ᴠᴇɴᴛᴀ ʀᴇᴀʟɪᴢᴀᴅᴀ`,
                    body: `${found.name} • ¥${found.salePrice}`,
                    thumbnail: thumbnail
                }
            }
        });
        
    } catch (e) {
        await conn.sendMessage(m.chat, {
            text: `ׅㅤ𓏸𓈒ㅤׄ ⚠️ *ᴇʀʀᴏʀ* :: ${e.message}\n\nׅㅤ𓏸𓈒ㅤׄ *ɪɴғᴏʀᴍᴀʀ* :: ᴜsᴀ *${usedPrefix}report* ᴘᴀʀᴀ ɪɴғᴏʀᴍᴀʀ ᴇʟ ᴘʀᴏʙʟᴇᴍᴀ`,
            contextInfo: rcanal
        }, { quoted: m });
    }
};

handler.help = ['buycharacter', 'buychar', 'buyc'];
handler.tags = ['gacha'];
handler.command = ['buycharacter', 'buychar', 'buyc'];
handler.group = true;
handler.reg = true;

export default handler;
