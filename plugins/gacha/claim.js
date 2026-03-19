// ============================================
// plugins/gacha-claim.js (ESTILO ASTA-BOT)
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
    const usersPath = path.join(process.cwd(), 'lib', 'gacha_users.json');
    const dbPath = path.join(process.cwd(), 'lib', 'characters.json');

    if (!m.quoted) {
        return conn.sendMessage(m.chat, {
            text: `ׅㅤ𓏸𓈒ㅤׄ ❗ *ᴜsᴏ* :: ᴅᴇʙᴇs ᴄɪᴛᴀʀ ᴇʟ ᴍᴇɴsᴀᴊᴇ ᴅᴇʟ ᴘᴇʀsᴏɴᴀᴊᴇ ǫᴜᴇ ǫᴜɪᴇʀᴇs ʀᴇᴄʟᴀᴍᴀʀ`,
            contextInfo: rcanal
        }, { quoted: m });
    }

    const quotedId = m.quoted.id;

    if (!global.tempCharacters || !global.tempCharacters[quotedId]) {
        return conn.sendMessage(m.chat, {
            text: `ׅㅤ𓏸𓈒ㅤׄ ❌ *ɴᴏ ᴅɪsᴘᴏɴɪʙʟᴇ* :: ᴇsᴛᴇ ᴘᴇʀsᴏɴᴀᴊᴇ ʏᴀ ɴᴏ ᴇsᴛᴀ́ ᴅɪsᴘᴏɴɪʙʟᴇ ᴏ ʜᴀ ᴇxᴘɪʀᴀᴅᴏ`,
            contextInfo: rcanal
        }, { quoted: m });
    }

    const tempData = global.tempCharacters[quotedId];

    // Verificar si expiró
    if (Date.now() > tempData.expires) {
        delete global.tempCharacters[quotedId];
        return conn.sendMessage(m.chat, {
            text: `ׅㅤ𓏸𓈒ㅤׄ ⏰ *ᴇxᴘɪʀᴀᴅᴏ* :: ᴇsᴛᴇ ᴘᴇʀsᴏɴᴀᴊᴇ ʏᴀ ᴇxᴘɪʀᴏ́. ᴜsᴀ *${usedPrefix}roll* ᴘᴀʀᴀ ᴏʙᴛᴇɴᴇʀ ᴏᴛʀᴏ`,
            contextInfo: rcanal
        }, { quoted: m });
    }

    // Cargar usuarios
    let users = {};
    if (fs.existsSync(usersPath)) {
        users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
    }

    if (!users[userId]) {
        users[userId] = {
            harem: [],
            favorites: [],
            claimMessage: '✧ {user} ha reclamado a {character}!',
            lastRoll: 0,
            votes: {},
            gachaCoins: 1000
        };
    }

    // Verificar si ya tiene el personaje
    const alreadyHas = users[userId].harem.find(c => c.id === tempData.character.id);
    if (alreadyHas) {
        return conn.sendMessage(m.chat, {
            text: `ׅㅤ𓏸𓈒ㅤׄ ⚠️ *ʏᴀ ᴛɪᴇɴᴇs* :: ᴇsᴛᴇ ᴘᴇʀsᴏɴᴀᴊᴇ ʏᴀ ᴇsᴛᴀ́ ᴇɴ ᴛᴜ ʜᴀʀᴇᴍ`,
            contextInfo: rcanal
        }, { quoted: m });
    }

    // Cargar y actualizar personaje en DB
    const characters = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    const charIndex = characters.findIndex(c => c.id === tempData.character.id);

    if (charIndex !== -1) {
        characters[charIndex].user = userId;
        characters[charIndex].status = 'Reclamado';
        fs.writeFileSync(dbPath, JSON.stringify(characters, null, 2), 'utf-8');
    }

    // Agregar personaje al harem
    users[userId].harem.push({
        ...tempData.character,
        claimedAt: Date.now(),
        forSale: false,
        salePrice: 0
    });

    fs.writeFileSync(usersPath, JSON.stringify(users, null, 2), 'utf-8');

    // Eliminar personaje temporal
    delete global.tempCharacters[quotedId];

    // Mensaje personalizado con estilo Asta-Bot
    const userName = await conn.getName(userId);
    let claimMsg = users[userId].claimMessage
        .replace('{user}', userName)
        .replace('{character}', tempData.character.name);

    // ========== TEXTO CON ESTILO ASTA-BOT ==========
    const txt = 
        `> . ﹡ ﹟ ✨ ׄ ⬭ *¡ᴡᴀɪғᴜ ʀᴇᴄʟᴀᴍᴀᴅᴀ!* @${userId.split('@')[0]}\n\n` +
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜💕* ㅤ֢ㅤ⸱ㅤᯭִ*\n\n` +
        `> ## \`ғᴇʟɪᴄɪᴅᴀᴅᴇs 🎉\`\n\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ɴᴏᴍʙʀᴇ* :: ${tempData.character.name}\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *sᴇʀɪᴇ* :: ${tempData.character.source}\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴠᴀʟᴏʀ* :: ${tempData.character.value}\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ɪᴅ* :: ${tempData.character.id}\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ʜᴀʀᴇᴍ* :: ${users[userId].harem.length} ᴡᴀɪғᴜs\n\n` +
        `> . ﹡ ﹟ ⚡ ׄ ⬭ *${claimMsg}*`;

    // ========== SISTEMA DE ENVÍO ASTA-BOT ==========
    const isSubBot = conn.user?.jid !== global.conn?.user?.jid;
    const botConfig = conn.subConfig || {};

    // Obtener imagen del personaje
    const charImg = tempData.character.img && tempData.character.img.length > 0 
        ? tempData.character.img[Math.floor(Math.random() * tempData.character.img.length)]
        : 'https://i.ibb.co/0Q3J9XZ/file.jpg';

    let thumbnail = null;
    try {
        const response = await fetch(charImg);
        if (response.ok) thumbnail = await response.buffer();
    } catch (e) {}

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
                mentionedJid: [userId],
                ...rcanal,
                externalAdReply: {
                    ...rcanal.externalAdReply,
                    title: `✨ ${tempData.character.name} ʀᴇᴄʟᴀᴍᴀᴅᴀ`,
                    body: `ᴘᴏʀ ${userName} • ${tempData.character.source}`,
                    mediaUrl: charImg,
                    sourceUrl: charImg,
                    thumbnail: thumbnail || rcanal.externalAdReply?.thumbnail
                }
            }
        }, { quoted: m });
        
    } catch (e) {
        await conn.sendMessage(m.chat, {
            text: txt,
            contextInfo: rcanal
        }, { quoted: m });
    }
};

handler.help = ['claim', 'c', 'reclamar'];
handler.tags = ['gacha'];
handler.command = ['claim', 'c', 'reclamar'];
handler.group = true;
handler.reg = true;

export default handler;
