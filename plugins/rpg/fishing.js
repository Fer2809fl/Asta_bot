import fetch from 'node-fetch'
import { RESOURCE_SYSTEM, getRandomResource, calculateResourceAmount } from '../../lib/rpg/resource-system.js'
async function getRcanal() {
    try { const thumb = await (await fetch(global.icono)).buffer(); return { isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: global.channelRD?.id || "120363399175402285@newsletter", serverMessageId: '', newsletterName: global.channelRD?.name || "『𝕬𝖘𝖙𝖆-𝕭𝖔𝖙』" }, externalAdReply: { title: global.botname || 'ᴀsᴛᴀ-ʙᴏᴛ', body: global.dev || 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ ғᴇʀɴᴀɴᴅᴏ', mediaType: 1, mediaUrl: global.redes, sourceUrl: global.redes, thumbnail: thumb, showAdAttribution: false, containsAutoReply: true, renderLargerThumbnail: false } } } catch { return {} }
}
const handler = async (m, { conn, usedPrefix }) => {
    const rcanal = await getRcanal(), currency = global.currency || '¥enes'
    if (!global.db.data.chats[m.chat].economy && m.isGroup) return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ 🚫 ׄ ⬭ *ᴇᴄᴏɴᴏᴍɪ́ᴀ ᴅᴇsᴀᴄᴛɪᴠᴀᴅᴀ*\n\nׅㅤ𓏸𓈒ㅤׄ Actívala con *${usedPrefix}economy on*`, contextInfo: rcanal }, { quoted: m })
    const user = global.db.data.users[m.sender]
    if (!user.inventory) user.inventory = { resources: {}, tools: { pickaxe: 'basic', axe: 'basic', fishingRod: 'basic' }, durability: { pickaxe: 100, axe: 100, fishingRod: 100 } }
    const now = Date.now(), cooldown = 4 * 60 * 1000; user.lastFish ??= 0
    if (now - user.lastFish < cooldown) { const r = cooldown - (now - user.lastFish); return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ ⏳ ׄ ⬭ *ᴄᴏᴏʟᴅᴏᴡɴ*\n\nׅㅤ𓏸𓈒ㅤׄ Espera *${Math.floor(r/60000)}:${String(Math.floor((r%60000)/1000)).padStart(2,'0')}* para pescar.`, contextInfo: rcanal }, { quoted: m }) }
    const rodType = user.inventory.tools.fishingRod, rodData = RESOURCE_SYSTEM.TOOLS.FISHING_RODS[rodType]
    if (!rodData) return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ ⚠️ ׄ ⬭ *sɪɴ ᴄᴀɴ̃ᴀ*\n\nׅㅤ𓏸𓈒ㅤׄ Compra una en *${usedPrefix}shop buy caña iron*`, contextInfo: rcanal }, { quoted: m })
    let durability = user.inventory.durability?.fishingRod || 100
    if (durability <= 0) return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ 🛠️ ׄ ⬭ *ᴄᴀɴ̃ᴀ ʀᴏᴛᴀ*\n\nׅㅤ𓏸𓈒ㅤׄ Repárala con *${usedPrefix}shop repair caña*`, contextInfo: rcanal }, { quoted: m })
    user.lastFish = now; durability -= 3 + Math.floor(Math.random() * 6); if (durability < 0) durability = 0
    user.inventory.durability.fishingRod = durability
    const resource = getRandomResource('FISHING', rodData.level)
    let amount = calculateResourceAmount(rodData.level, rodData.efficiency)
    let bonus = 0
    if (global.owner?.includes(m.sender.split('@')[0])) bonus = Math.floor(resource.value * 2)
    if (global.fernando?.includes(m.sender.split('@')[0])) { bonus = Math.floor(resource.value * 3); amount *= 2 }
    user.inventory.resources[resource.id] = (user.inventory.resources[resource.id] || 0) + amount
    const coinReward = Math.floor(resource.value * amount * 0.7) + bonus; user.coin = (user.coin || 0) + coinReward
    await conn.sendMessage(m.chat, {
        text:
            `> . ﹡ ﹟ 🎣 ׄ ⬭ *ᴘᴇsᴄᴀ ᴇxɪᴛᴏsᴀ*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🐟* ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ʜᴇʀʀᴀᴍɪᴇɴᴛᴀ* :: ${rodData.emoji} ${rodData.name}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴅᴜʀᴀʙɪʟɪᴅᴀᴅ* :: ${durability}%\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ʀᴇᴄᴜʀsᴏ* :: ${resource.emoji} ${resource.name} x${amount}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *💰 ɢᴀɴᴀᴅᴏ* :: ¥${coinReward.toLocaleString()} ${currency}` +
            (bonus > 0 ? `\nׅㅤ𓏸𓈒ㅤׄ *✨ ʙᴏɴᴜs* :: +¥${bonus.toLocaleString()}` : ''),
        contextInfo: rcanal
    }, { quoted: m })
    await global.db.write()
}
handler.help = ['fish']; handler.tags = ['rpg']; handler.command = ['fish', 'pescar']
handler.group = true; handler.reg = true
export default handler
