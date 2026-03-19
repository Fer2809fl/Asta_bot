// ============================================
// plugins/gacha-giveallharem.js (ESTILO ASTA-BOT - MÍNIMO)
// ============================================
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

const handler = async (m, { conn, text, usedPrefix }) => {
    if (!m.mentionedJid || m.mentionedJid.length === 0) {
        return conn.sendMessage(m.chat, {
            text: `ׅㅤ𓏸𓈒ㅤׄ ❗ *ᴜsᴏ* :: ${usedPrefix}giveallharem @usuario`,
            contextInfo: global.rcanal
        }, { quoted: m });
    }

    const giverId = m.sender;
    const receiverId = m.mentionedJid[0];

    if (giverId === receiverId) {
        return conn.sendMessage(m.chat, {
            text: `ׅㅤ𓏸𓈒ㅤׄ ❌ *ᴇʀʀᴏʀ* :: ɴᴏ ᴘᴜᴇᴅᴇs ʀᴇɢᴀʟᴀʀᴛᴇ ᴘᴇʀsᴏɴᴀᴊᴇs ᴀ ᴛɪ ᴍɪsᴍᴏ`,
            contextInfo: global.rcanal
        }, { quoted: m });
    }

    const usersPath = path.join(process.cwd(), 'lib', 'gacha_users.json');
    const dbPath = path.join(process.cwd(), 'lib', 'characters.json');

    let users = {};
    if (fs.existsSync(usersPath)) {
        users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
    }

    if (!users[giverId] || !users[giverId].harem || users[giverId].harem.length === 0) {
        return conn.sendMessage(m.chat, {
            text: `ׅㅤ𓏸𓈒ㅤׄ ❌ *sɪɴ ᴘᴇʀsᴏɴᴀᴊᴇs* :: ɴᴏ ᴛɪᴇɴᴇs ᴘᴇʀsᴏɴᴀᴊᴇs ᴘᴀʀᴀ ʀᴇɢᴀʟᴀʀ`,
            contextInfo: global.rcanal
        }, { quoted: m });
    }

    const totalChars = users[giverId].harem.length;
    const giverName = await conn.getName(giverId);
    const receiverName = await conn.getName(receiverId);

    // ========== CONFIRMACIÓN ==========
    const confirmTxt = `
> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴄᴏɴғɪʀᴍᴀᴄɪᴏ́ɴ ʀᴇǫᴜᴇʀɪᴅᴀ* @${giverId.split('@')[0]}

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜⚠️* ㅤ֢ㅤ⸱ㅤᯭִ*

¿ᴇsᴛᴀ́s sᴇɢᴜʀᴏ ᴅᴇ ʀᴇɢᴀʟᴀʀ ᴛᴏᴅᴏ ᴛᴜ ʜᴀʀᴇᴍ ᴀ @${receiverId.split('@')[0]}?

ׅㅤ𓏸𓈒ㅤׄ *ᴛᴏᴛᴀʟ* :: ${totalChars} ᴘᴇʀsᴏɴᴀᴊᴇs
ׅㅤ𓏸𓈒ㅤׄ *ᴅᴏɴᴀᴅᴏʀ* :: ${giverName}
ׅㅤ𓏸𓈒ㅤׄ *ʀᴇᴄᴇᴘᴛᴏʀ* :: ${receiverName}

✅ *SI* - ᴄᴏɴғɪʀᴍᴀʀ
❌ *NO* - ᴄᴀɴᴄᴇʟᴀʀ

⏰ *ᴛɪᴇɴᴇs 30 sᴇɢᴜɴᴅᴏs*`.trim();

    try {
        await conn.sendMessage(m.chat, { 
            text: confirmTxt,
            contextInfo: {
                mentionedJid: [giverId, receiverId],
                ...global.rcanal
            }
        }, { quoted: m });
    } catch (e) {
        await conn.reply(m.chat, confirmTxt, m);
    }

    // Esperar respuesta
    const collector = conn.awaitMessages(m.chat, x => x.sender === m.sender, {
        max: 1,
        time: 30000
    });

    collector.then(async collected => {
        const response = collected[0];
        if (!response || response.text.toLowerCase() !== 'si') {
            const cancelTxt = `
> . ﹡ ﹟ ❌ ׄ ⬭ *ᴏᴘᴇʀᴀᴄɪᴏ́ɴ ᴄᴀɴᴄᴇʟᴀᴅᴀ*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❌* ㅤ֢ㅤ⸱ㅤᯭִ*

*ᴛᴜ ʜᴀʀᴇᴍ sɪɢᴜᴇ ɪɴᴛᴀᴄᴛᴏ.*`.trim();

            return conn.sendMessage(m.chat, { 
                text: cancelTxt,
                contextInfo: global.rcanal
            }, { quoted: m });
        }

        // Inicializar receptor si no existe
        if (!users[receiverId]) {
            users[receiverId] = {
                harem: [],
                favorites: [],
                claimMessage: '✧ {user} ha reclamado a {character}!',
                lastRoll: 0,
                votes: {},
                gachaCoins: 1000
            };
        }

        const characters = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
        let transferredCount = 0;

        // Transferir todos los personajes
        users[giverId].harem.forEach(char => {
            const alreadyHas = users[receiverId].harem.find(c => c.id === char.id);
            if (!alreadyHas) {
                users[receiverId].harem.push({ ...char, claimedAt: Date.now(), forSale: false, salePrice: 0 });

                const dbCharIndex = characters.findIndex(c => c.id === char.id);
                if (dbCharIndex !== -1) {
                    characters[dbCharIndex].user = receiverId;
                }
                transferredCount++;
            }
        });

        // Vaciar harem del donador
        users[giverId].harem = [];
        users[giverId].favorites = [];

        fs.writeFileSync(dbPath, JSON.stringify(characters, null, 2), 'utf-8');
        fs.writeFileSync(usersPath, JSON.stringify(users, null, 2), 'utf-8');

        // ========== ÉXITO ==========
        const successTxt = `
> . ﹡ ﹟ 🎁 ׄ ⬭ *¡ʜᴀʀᴇᴍ ᴛʀᴀɴsғᴇʀɪᴅᴏ!* @${giverId.split('@')[0]}

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜👑* ㅤ֢ㅤ⸱ㅤᯭִ*

> ## \`ᴛʀᴀɴsғᴇʀᴇɴᴄɪᴀ ᴄᴏᴍᴘʟᴇᴛᴀᴅᴀ 🎁\`

ׅㅤ𓏸𓈒ㅤׄ *ᴘᴇʀsᴏɴᴀᴊᴇs* :: ${transferredCount}
ׅㅤ𓏸𓈒ㅤׄ *ᴅᴏɴᴀᴅᴏʀ* :: ${giverName}
ׅㅤ𓏸𓈒ㅤׄ *ɴᴜᴇᴠᴏ ᴅᴜᴇñᴏ* :: ${receiverName}

> . ﹡ ﹟ ⚡ ׄ ⬭ *¡ᴀᴄᴛᴏ sᴜᴘʀᴇᴍᴏ ᴅᴇ ɢᴇɴᴇʀᴏsɪᴅᴀᴅ!*`.trim();

        try {
            await conn.sendMessage(m.chat, { 
                text: successTxt,
                contextInfo: {
                    mentionedJid: [giverId, receiverId],
                    ...global.rcanal
                }
            }, { quoted: m });

            // Notificar al receptor
            const receiverTxt = `
> . ﹡ ﹟ 🎁 ׄ ⬭ *¡ʀᴇɢᴀʟᴏ ᴇɴᴏʀᴍᴇ ʀᴇᴄɪʙɪᴅᴏ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🎁* ㅤ֢ㅤ⸱ㅤᯭִ*

*${giverName}* ᴛᴇ ʜᴀ ʀᴇɢᴀʟᴀᴅᴏ sᴜ ʜᴀʀᴇᴍ ᴄᴏᴍᴘʟᴇᴛᴏ ᴅᴇ *${transferredCount}* ᴘᴇʀsᴏɴᴀᴊᴇs!

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴅɪsғʀᴜᴛᴀ ᴛᴜ ɴᴜᴇᴠᴀ ᴄᴏʟᴇᴄᴄɪᴏ́ɴ*`.trim();

            conn.sendMessage(receiverId, { 
                text: receiverTxt,
                contextInfo: global.rcanal
            });
            
        } catch (e) {
            await conn.reply(m.chat, successTxt, m);
        }
        
    }).catch(async () => {
        const timeoutTxt = `
> . ﹡ ﹟ ⏰ ׄ ⬭ *ᴛɪᴇᴍᴘᴏ ᴀɢᴏᴛᴀᴅᴏ*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜⏰* ㅤ֢ㅤ⸱ㅤᯭִ*

*ɴᴏ ʜᴜʙᴏ ʀᴇsᴘᴜᴇsᴛᴀ ᴇɴ 30 sᴇɢᴜɴᴅᴏs.*`.trim();

        conn.sendMessage(m.chat, { 
            text: timeoutTxt,
            contextInfo: global.rcanal
        }, { quoted: m });
    });
};

handler.help = ['giveallharem'];
handler.tags = ['gacha'];
handler.command = ['giveallharem'];
handler.group = true;
handler.reg = true;

export default handler;
