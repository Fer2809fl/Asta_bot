// ============================================
// plugins/gacha-charimage.js (ESTILO ASTA-BOT)
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
        text: `ׅㅤ𓏸𓈒ㅤׄ ❗ *ᴜsᴏ* :: ${usedPrefix}charimage <ɴᴏᴍʙʀᴇ ᴅᴇʟ ᴘᴇʀsᴏɴᴀᴊᴇ>`,
        contextInfo: rcanal
    }, { quoted: m });

    const dbPath = path.join(process.cwd(), 'lib', 'characters.json');

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

    if (!found.img || found.img.length === 0) {
        return conn.sendMessage(m.chat, {
            text: `ׅㅤ𓏸𓈒ㅤׄ ❌ *sɪɴ ɪᴍᴀ́ɢᴇɴᴇs* :: ᴇsᴛᴇ ᴘᴇʀsᴏɴᴀᴊᴇ ɴᴏ ᴛɪᴇɴᴇ ɪᴍᴀ́ɢᴇɴᴇs`,
            contextInfo: rcanal
        }, { quoted: m });
    }

    const randomImg = found.img[Math.floor(Math.random() * found.img.length)];

    // ========== TEXTO CON ESTILO ASTA-BOT ==========
    const txt = 
        `> . ﹡ ﹟ 🖼️ ׄ ⬭ *ɪᴍᴀɢᴇɴ ᴅᴇʟ ᴘᴇʀsᴏɴᴀᴊᴇ*\n\n` +
        `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🎴* ㅤ֢ㅤ⸱ㅤᯭִ*\n\n` +
        `> ## \`ᴠɪsᴜᴀʟɪᴢᴀᴄɪᴏ́ɴ 🎨\`\n\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ɴᴏᴍʙʀᴇ* :: ${found.name}\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *sᴇʀɪᴇ* :: ${found.source}\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ᴠᴀʟᴏʀ* :: ${found.value}\n` +
        `ׅㅤ𓏸𓈒ㅤׄ *ɪᴍᴀ́ɢᴇɴ* :: ${Math.floor(Math.random() * found.img.length) + 1}/${found.img.length}\n\n` +
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
        // Enviar imagen con caption estilizado
        await conn.sendMessage(m.chat, { 
            image: { url: randomImg },
            caption: txt,
            contextInfo: {
                ...rcanal,
                externalAdReply: {
                    ...rcanal.externalAdReply,
                    title: `🖼️ ${found.name}`,
                    body: `${found.source} • ɪᴍᴀɢᴇɴ ${Math.floor(Math.random() * found.img.length) + 1}/${found.img.length}`,
                    mediaUrl: randomImg,
                    sourceUrl: randomImg,
                    thumbnail: thumbnail || rcanal.externalAdReply?.thumbnail
                }
            }
        }, { quoted: m });
        
    } catch (e) {
        // Fallback: enviar como archivo con contextInfo
        await conn.sendMessage(m.chat, {
            image: { url: randomImg },
            caption: txt,
            contextInfo: rcanal
        }, { quoted: m });
    }
};

handler.help = ['charimage', 'waifuimage', 'cimage', 'wimage'];
handler.tags = ['gacha'];
handler.command = ['charimage', 'waifuimage', 'cimage', 'wimage'];
handler.group = true;
handler.reg = true;

export default handler;
