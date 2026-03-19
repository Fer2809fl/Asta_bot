// ============================================
// plugins/gacha-favoritetop.js (ESTILO ASTA-BOT)
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
    const usersPath = path.join(process.cwd(), 'lib', 'gacha_users.json');
    const dbPath = path.join(process.cwd(), 'lib', 'characters.json');

    if (!fs.existsSync(usersPath) || !fs.existsSync(dbPath)) {
        return conn.sendMessage(m.chat, {
            text: `ׅㅤ𓏸𓈒ㅤׄ ❌ *sɪɴ ᴅᴀᴛᴏs* :: ɴᴏ ʜᴀʏ ɪɴғᴏʀᴍᴀᴄɪᴏ́ɴ ᴅɪsᴘᴏɴɪʙʟᴇ`,
            contextInfo: rcanal
        }, { quoted: m });
    }

    const users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
    const characters = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

    // Contar favoritos por personaje
    const favCounts = {};

    for (const [userId, userData] of Object.entries(users)) {
        if (userData.favorites && userData.favorites.length > 0) {
            userData.favorites.forEach(charId => {
                favCounts[charId] = (favCounts[charId] || 0) + 1;
            });
        }
    }

    // Obtener información de personajes favoritos
    const favChars = [];
    for (const [charId, count] of Object.entries(favCounts)) {
        const char = characters.find(c => c.id === charId);
        if (char) {
            favChars.push({
                ...char,
                favCount: count
            });
        }
    }

    // Ordenar por cantidad de favoritos
    favChars.sort((a, b) => b.favCount - a.favCount);

    const topFavs = favChars.slice(0, 20);

    if (topFavs.length === 0) {
        return conn.sendMessage(m.chat, {
            text: `ׅㅤ𓏸𓈒ㅤׄ 📭 *sɪɴ ғᴀᴠᴏʀɪᴛᴏs* :: ᴀᴜ́ɴ ɴᴏ ʜᴀʏ ᴡᴀɪғᴜs ғᴀᴠᴏʀɪᴛᴀs. ᴜsᴀ *${usedPrefix}fav* ᴘᴀʀᴀ ᴀɴ̃ᴀᴅɪʀ`,
            contextInfo: rcanal
        }, { quoted: m });
    }

    // Construir lista con estilo Asta-Bot
    let favList = '';
    topFavs.forEach((char, i) => {
        const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '•';
        favList += `\n` +
            `ׅㅤ𓏸𓈒ㅤׄ ${medal} *${i + 1}.* *${char.name}*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ • 📺 ${char.source}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ • ⭐ ${char.favCount} ғᴀᴠᴏʀɪᴛᴏs\n` +
            `ׅㅤ𓏸𓈒ㅤׄ • 💎 ${char.value}`;
    });

    // ========== TEXTO CON ESTILO ASTA-BOT ==========
    const txt = 
        `> . ﹡ ﹟ ⭐ ׄ ⬭ *ᴛᴏᴘ ғᴀᴠᴏʀɪᴛᴏs*\n\n` +
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❤️* ㅤ֢ㅤ⸱ㅤᯭִ*\n\n` +
        `> ## \`ᴡᴀɪғᴜs ᴍᴀ́s ǫᴜᴇʀɪᴅᴀs 🥇\`\n\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴛᴏᴛᴀʟ* :: ${topFavs.length} ᴘᴇʀsᴏɴᴀᴊᴇs\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ʀᴀɴɢᴏ* :: ᴛᴏᴘ 20\n\n` +
        `${favList}\n\n` +
        `> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`;

    // ========== SISTEMA DE ENVÍO ASTA-BOT ==========
    const isSubBot = conn.user?.jid !== global.conn?.user?.jid;
    const botConfig = conn.subConfig || {};

    // Imagen del #1 favorito
    const top1 = topFavs[0];
    let thumbnail = null;
    if (top1?.img?.length > 0) {
        try {
            const response = await fetch(top1.img[0]);
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
                ...rcanal,
                externalAdReply: {
                    ...rcanal.externalAdReply,
                    title: `⭐ ᴛᴏᴘ ғᴀᴠᴏʀɪᴛᴏs`,
                    body: `🥇 ${top1?.name || 'N/A'} • ⭐ ${top1?.favCount || 0} ғᴀᴠᴏʀɪᴛᴏs`,
                    mediaUrl: top1?.img?.[0] || global.redes,
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

handler.help = ['favoritetop', 'favtop'];
handler.tags = ['gacha'];
handler.command = ['favoritetop', 'favtop'];
handler.group = true;
handler.reg = true;

export default handler;
