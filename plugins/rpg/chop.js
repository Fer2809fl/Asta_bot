import fetch from 'node-fetch'
import { RESOURCE_SYSTEM, getRandomResource, calculateResourceAmount } from '../../lib/rpg/resource-system.js'
async function getRcanal() {
    try { const thumb = await (await fetch(global.icono)).buffer(); return { isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: global.channelRD?.id || "120363399175402285@newsletter", serverMessageId: '', newsletterName: global.channelRD?.name || "『𝕬𝖘𝖙𝖆-𝕭𝖔𝖙』" }, externalAdReply: { title: global.botname || 'ᴀsᴛᴀ-ʙᴏᴛ', body: global.dev || 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ ғᴇʀɴᴀɴᴅᴏ', mediaType: 1, mediaUrl: global.redes, sourceUrl: global.redes, thumbnail: thumb, showAdAttribution: false, containsAutoReply: true, renderLargerThumbnail: false } } } catch { return {} }
}
const handler = async (m, { conn, usedPrefix, command }) => {
    const rcanal = await getRcanal(), currency = global.currency || '¥enes'
    if (!global.db.data.chats[m.chat].economy && m.isGroup) return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ 🚫 ׄ ⬭ *ᴇᴄᴏɴᴏᴍɪ́ᴀ ᴅᴇsᴀᴄᴛɪᴠᴀᴅᴀ*\n\nׅㅤ𓏸𓈒ㅤׄ Actívala con *${usedPrefix}economy on*`, contextInfo: rcanal }, { quoted: m })
    const user = global.db.data.users[m.sender]
    if (!user.inventory) user.inventory = { resources: {}, tools: { pickaxe: 'basic', axe: 'basic', fishingRod: 'basic' }, durability: { pickaxe: 100, axe: 100, fishingRod: 100 } }
    const now = Date.now(), cooldown = 2 * 60 * 1000; user.lastChop ??= 0
    if (now - user.lastChop < cooldown) { const r = cooldown - (now - user.lastChop); return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ ⏳ ׄ ⬭ *ᴄᴏᴏʟᴅᴏᴡɴ*\n\nׅㅤ𓏸𓈒ㅤׄ Espera *${Math.floor(r/60000)}:${String(Math.floor((r%60000)/1000)).padStart(2,'0')}* para talar.`, contextInfo: rcanal }, { quoted: m }) }
    const axeType = user.inventory.tools.axe, axeData = RESOURCE_SYSTEM.TOOLS.AXES[axeType]
    if (!axeData) return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ ⚠️ ׄ ⬭ *sɪɴ ʜᴀᴄʜᴀ*\n\nׅㅤ𓏸𓈒ㅤׄ Compra una en *${usedPrefix}shop buy hacha iron*`, contextInfo: rcanal }, { quoted: m })
    let durability = user.inventory.durability?.axe || 100
    if (durability <= 0) return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ 🛠️ ׄ ⬭ *ʜᴀᴄʜᴀ ʀᴏᴛᴀ*\n\nׅㅤ𓏸𓈒ㅤׄ Repárala con *${usedPrefix}shop repair hacha*`, contextInfo: rcanal }, { quoted: m })
    user.lastChop = now; durability -= 4 + Math.floor(Math.random() * 8); if (durability < 0) durability = 0
    user.inventory.durability.axe = durability
    const resource = getRandomResource('WOODCUTTING', axeData.level), amount = calculateResourceAmount(axeData.level, axeData.efficiency)
    user.inventory.resources[resource.id] = (user.inventory.resources[resource.id] || 0) + amount
    const coinReward = Math.floor(resource.value * amount * 0.6); user.coin = (user.coin || 0) + coinReward
    await conn.sendMessage(m.chat, {
        text:
            `> . ﹡ ﹟ 🪓 ׄ ⬭ *ᴛᴀʟᴀ ᴇxɪᴛᴏsᴀ*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🌲* ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ʜᴇʀʀᴀᴍɪᴇɴᴛᴀ* :: ${axeData.emoji} ${axeData.name}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴅᴜʀᴀʙɪʟɪᴅᴀᴅ* :: ${durability}%\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ʀᴇᴄᴜʀsᴏ* :: ${resource.emoji} ${resource.name} x${amount}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *💰 ɢᴀɴᴀᴅᴏ* :: ¥${coinReward.toLocaleString()} ${currency}`,
        contextInfo: rcanal
    }, { quoted: m })
    await global.db.write()
}
handler.help = ['chop']; handler.tags = ['rpg']; handler.command = ['chop', 'talar']
handler.group = true; handler.reg = true
export default handler
