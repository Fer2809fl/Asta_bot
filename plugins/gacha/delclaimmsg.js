// ============================================
// plugins/gacha-delclaimmsg.js (ESTILO ASTA-BOT)
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

    let users = {};
    if (fs.existsSync(usersPath)) {
        users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
    }

    if (!users[userId]) {
        return conn.sendMessage(m.chat, {
            text: `ׅㅤ𓏸𓈒ㅤׄ ❌ *sɪɴ ᴘᴇʀғɪʟ* :: ɴᴏ ᴛɪᴇɴᴇs ᴜɴ ᴘᴇʀғɪʟ ᴄʀᴇᴀᴅᴏ. ᴜsᴀ *${usedPrefix}roll* ᴘᴀʀᴀ ᴇᴍᴘᴇᴢᴀʀ`,
            contextInfo: rcanal
        }, { quoted: m });
    }

    users[userId].claimMessage = '✧ {user} ha reclamado a {character}!';
    fs.writeFileSync(usersPath, JSON.stringify(users, null, 2), 'utf-8');

    // ========== TEXTO CON ESTILO ASTA-BOT ==========
    const txt = 
        `> . ﹡ ﹟ 🔄 ׄ ⬭ *ᴍᴇɴsᴀᴊᴇ ʀᴇsᴛᴀʙʟᴇᴄɪᴅᴏ* @${userId.split('@')[0]}\n\n` +
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🔄* ㅤ֢ㅤ⸱ㅤᯭִ*\n\n` +
        `> ## \`ᴄᴏɴғɪɢᴜʀᴀᴄɪᴏ́ɴ ᴘᴏʀ ᴅᴇғᴇᴄᴛᴏ ✅\`\n\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴍᴇɴsᴀᴊᴇ* :: ✧ {user} ha reclamado a {character}!\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴇsᴛᴀᴅᴏ* :: ʀᴇsᴛᴀʙʟᴇᴄɪᴅᴏ ᴘᴏʀ ᴅᴇғᴇᴄᴛᴏ\n\n` +
        `> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴛᴜ ᴍᴇɴsᴀᴊᴇ ᴅᴇ ᴄʟᴀɪᴍ ʜᴀ sɪᴅᴏ ʀᴇsᴛᴀʙʟᴇᴄɪᴅᴏ*`;

    // ========== SISTEMA DE ENVÍO ASTA-BOT ==========
    const isSubBot = conn.user?.jid !== global.conn?.user?.jid;
    const botConfig = conn.subConfig || {};

    let thumbnail = null;
    let imageUrl = isSubBot && botConfig.logoUrl ? botConfig.logoUrl 
        : global.icono || 'https://i.ibb.co/0Q3J9XZ/file.jpg';
    try {
        const response = await fetch(imageUrl);
        if (response.ok) thumbnail = await response.buffer();
    } catch (e) {}

    try {
        await conn.sendMessage(m.chat, { 
            text: txt,
            contextInfo: {
                mentionedJid: [userId],
                ...rcanal,
                externalAdReply: {
                    ...rcanal.externalAdReply,
                    title: `🔄 ᴍᴇɴsᴀᴊᴇ ʀᴇsᴛᴀʙʟᴇᴄɪᴅᴏ`,
                    body: `ᴄᴏɴғɪɢᴜʀᴀᴄɪᴏ́ɴ ᴘᴏʀ ᴅᴇғᴇᴄᴛᴏ ᴀᴘʟɪᴄᴀᴅᴀ`,
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

handler.help = ['delclaimmsg'];
handler.tags = ['gacha'];
handler.command = ['delclaimmsg'];
handler.group = true;
handler.reg = true;

export default handler;
