// ============================================
// plugins/gacha-deletewaifu.js (ESTILO ASTA-BOT)
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
            text: `ׅㅤ𓏸𓈒ㅤׄ ❗ *ᴜsᴏ* :: ${usedPrefix}delwaifu <ɴᴏᴍʙʀᴇ ᴅᴇʟ ᴘᴇʀsᴏɴᴀᴊᴇ>`,
            contextInfo: rcanal
        }, { quoted: m });
    }

    const userId = m.sender;
    const usersPath = path.join(process.cwd(), 'lib', 'gacha_users.json');
    const dbPath = path.join(process.cwd(), 'lib', 'characters.json');

    let users = {};
    if (fs.existsSync(usersPath)) {
        users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
    }

    if (!users[userId] || !users[userId].harem || users[userId].harem.length === 0) {
        return conn.sendMessage(m.chat, {
            text: `ׅㅤ𓏸𓈒ㅤׄ ❌ *sɪɴ ᴘᴇʀsᴏɴᴀᴊᴇs* :: ɴᴏ ᴛɪᴇɴᴇs ᴘᴇʀsᴏɴᴀᴊᴇs ᴘᴀʀᴀ ᴇʟɪᴍɪɴᴀʀ`,
            contextInfo: rcanal
        }, { quoted: m });
    }

    const charIndex = users[userId].harem.findIndex(c => 
        c.name.toLowerCase().includes(text.toLowerCase())
    );

    if (charIndex === -1) {
        return conn.sendMessage(m.chat, {
            text: `ׅㅤ𓏸𓈒ㅤׄ ❌ *ɴᴏ ᴇɴᴄᴏɴᴛʀᴀᴅᴏ* :: ɴᴏ ᴛɪᴇɴᴇs ᴇsᴇ ᴘᴇʀsᴏɴᴀᴊᴇ ᴇɴ ᴛᴜ ʜᴀʀᴇᴍ`,
            contextInfo: rcanal
        }, { quoted: m });
    }

    const char = users[userId].harem[charIndex];
    const charName = char.name;

    // Actualizar en DB principal
    const characters = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    const dbCharIndex = characters.findIndex(c => c.id === char.id);
    if (dbCharIndex !== -1) {
        characters[dbCharIndex].user = null;
        characters[dbCharIndex].status = 'Libre';
        fs.writeFileSync(dbPath, JSON.stringify(characters, null, 2), 'utf-8');
    }

    // Eliminar personaje
    users[userId].harem.splice(charIndex, 1);

    // Eliminar de favoritos si está
    users[userId].favorites = users[userId].favorites.filter(id => id !== char.id);

    fs.writeFileSync(usersPath, JSON.stringify(users, null, 2), 'utf-8');

    // ========== TEXTO CON ESTILO ASTA-BOT ==========
    const txt = 
        `> . ﹡ ﹟ 🗑️ ׄ ⬭ *ᴘᴇʀsᴏɴᴀᴊᴇ ᴇʟɪᴍɪɴᴀᴅᴏ* @${userId.split('@')[0]}\n\n` +
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🗑️* ㅤ֢ㅤ⸱ㅤᯭִ*\n\n` +
        `> ## \`ᴇʟɪᴍɪɴᴀᴄɪᴏ́ɴ ᴄᴏᴍᴘʟᴇᴛᴀᴅᴀ 🍃\`\n\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ɴᴏᴍʙʀᴇ* :: ${charName}\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *sᴇʀɪᴇ* :: ${char.source}\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴠᴀʟᴏʀ* :: ${char.value}\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ʜᴀʀᴇᴍ* :: ${users[userId].harem.length} ᴘᴇʀsᴏɴᴀᴊᴇs\n\n` +
        `> . ﹡ ﹟ ⚡ ׄ ⬭ *${charName} ʜᴀ sɪᴅᴏ ʟɪʙᴇʀᴀᴅᴏ*`;

    // ========== SISTEMA DE ENVÍO ASTA-BOT ==========
    const isSubBot = conn.user?.jid !== global.conn?.user?.jid;
    const botConfig = conn.subConfig || {};

    let thumbnail = null;
    if (char.img && char.img.length > 0) {
        try {
            const response = await fetch(char.img[0]);
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
                mentionedJid: [userId],
                ...rcanal,
                externalAdReply: {
                    ...rcanal.externalAdReply,
                    title: `🗑️ ${charName} ᴇʟɪᴍɪɴᴀᴅᴏ`,
                    body: `ᴇʟɪᴍɪɴᴀᴅᴏ ᴅᴇ ᴛᴜ ʜᴀʀᴇᴍ • ${users[userId].harem.length} ʀᴇsᴛᴀɴᴛᴇs`,
                    mediaUrl: char.img?.[0] || global.redes,
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

handler.help = ['deletewaifu', 'delwaifu', 'delchar'];
handler.tags = ['gacha'];
handler.command = ['deletewaifu', 'delwaifu', 'delchar'];
handler.group = true;
handler.reg = true;

export default handler;
