// ============================================
// plugins/gacha-charinfo.js (ESTILO ASTA-BOT)
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
    
    if (!text) return conn.sendMessage(m.chat, {
        text: `ׅㅤ𓏸𓈒ㅤׄ ❗ *ᴜsᴏ* :: ${usedPrefix}charinfo <ɴᴏᴍʙʀᴇ ᴅᴇʟ ᴘᴇʀsᴏɴᴀᴊᴇ>`,
        contextInfo: rcanal
    }, { quoted: m });

    const dbPath = path.join(process.cwd(), 'lib', 'characters.json');
    const usersPath = path.join(process.cwd(), 'lib', 'gacha_users.json');

    if (!fs.existsSync(dbPath)) {
        return conn.sendMessage(m.chat, {
            text: `ׅㅤ𓏸𓈒ㅤׄ ❌ *sɪɴ ᴅᴀᴛᴏs* :: ɴᴏ ʜᴀʏ ᴘᴇʀsᴏɴᴀᴊᴇs ᴅɪsᴘᴏɴɪʙʟᴇs`,
            contextInfo: rcanal
        }, { quoted: m });
    }

    const characters = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

    // Buscar personaje
    const found = characters.find(c => 
        c.name.toLowerCase().includes(text.toLowerCase())
    );

    if (!found) {
        return conn.sendMessage(m.chat, {
            text: `ׅㅤ𓏸𓈒ㅤׄ ❌ *ɴᴏ ᴇɴᴄᴏɴᴛʀᴀᴅᴏ* :: ᴇsᴇ ᴘᴇʀsᴏɴᴀᴊᴇ ɴᴏ ᴇxɪsᴛᴇ`,
            contextInfo: rcanal
        }, { quoted: m });
    }

    // Contar propietarios
    let users = {};
    if (fs.existsSync(usersPath)) {
        users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
    }

    const owners = Object.entries(users).filter(([id, data]) => 
        data.harem && data.harem.some(c => c.id === found.id)
    );

    const totalVotes = found.votes || 0;

    // Obtener imagen aleatoria
    const randomImg = found.img && found.img.length > 0 
        ? found.img[Math.floor(Math.random() * found.img.length)]
        : 'https://i.ibb.co/0Q3J9XZ/file.jpg';

    // ========== TEXTO CON ESTILO ASTA-BOT ==========
    const txt = 
        `> . ﹡ ﹟ ℹ️ ׄ ⬭ *ɪɴғᴏ ᴅᴇʟ ᴘᴇʀsᴏɴᴀᴊᴇ*\n\n` +
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜📊* ㅤ֢ㅤ⸱ㅤᯭִ*\n\n` +
        `> ## \`ᴅᴀᴛᴏs ʙᴀ́sɪᴄᴏs 📛\`\n\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ɴᴏᴍʙʀᴇ* :: ${found.name}\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ɢᴇ́ɴᴇʀᴏ* :: ${found.gender}\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *sᴇʀɪᴇ* :: ${found.source}\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴠᴀʟᴏʀ* :: ${found.value}\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ɪᴅ* :: ${found.id}\n\n` +
        `> ## \`ᴇsᴛᴀᴅɪ́sᴛɪᴄᴀs 📈\`\n\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴘʀᴏᴘɪᴇᴛᴀʀɪᴏs* :: ${owners.length}\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴠᴏᴛᴏs* :: ${totalVotes}\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴇsᴛᴀᴅᴏ* :: ${found.status || 'Desconocido'}\n\n` +
        `> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`;

    // ========== SISTEMA DE ENVÍO ASTA-BOT ==========
    const isSubBot = conn.user?.jid !== global.conn?.user?.jid;
    const botConfig = conn.subConfig || {};

    let thumbnail = null;
    try {
        const response = await fetch(randomImg);
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
                ...rcanal,
                externalAdReply: {
                    ...rcanal.externalAdReply,
                    title: `ℹ️ ${found.name}`,
                    body: `${found.source} • 💎 ${found.value} • 👥 ${owners.length} ᴅᴜᴇñᴏs`,
                    mediaUrl: randomImg,
                    sourceUrl: randomImg,
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

handler.help = ['charinfo', 'winfo', 'waifuinfo'];
handler.tags = ['gacha'];
handler.command = ['charinfo', 'winfo', 'waifuinfo'];
handler.group = true;
handler.reg = true;

export default handler;
