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
    const now = Date.now(), cooldown = 3 * 60 * 1000; user.lastMine ??= 0
    if (now - user.lastMine < cooldown) { const r = cooldown - (now - user.lastMine); return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ ⏳ ׄ ⬭ *ᴄᴏᴏʟᴅᴏᴡɴ*\n\nׅㅤ𓏸𓈒ㅤׄ Espera *${Math.floor(r/60000)}:${String(Math.floor((r%60000)/1000)).padStart(2,'0')}* para minar.`, contextInfo: rcanal }, { quoted: m }) }
    const pickaxeType = user.inventory.tools.pickaxe, pickaxeData = RESOURCE_SYSTEM.TOOLS.PICKAXES[pickaxeType]
    if (!pickaxeData) return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ ⚠️ ׄ ⬭ *sɪɴ ᴘɪᴄᴏ*\n\nׅㅤ𓏸𓈒ㅤׄ Compra uno en *${usedPrefix}shop buy pico iron*`, contextInfo: rcanal }, { quoted: m })
    let durability = user.inventory.durability?.pickaxe || 100
    if (durability <= 0) return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ 🛠️ ׄ ⬭ *ᴘɪᴄᴏ ʀᴏᴛᴏ*\n\nׅㅤ𓏸𓈒ㅤׄ Repáralo con *${usedPrefix}shop repair pico*`, contextInfo: rcanal }, { quoted: m })
    user.lastMine = now; durability -= 5 + Math.floor(Math.random() * 10); if (durability < 0) durability = 0
    user.inventory.durability.pickaxe = durability
    const resource = getRandomResource('MINING', pickaxeData.level), amount = calculateResourceAmount(pickaxeData.level, pickaxeData.efficiency)
    user.inventory.resources[resource.id] = (user.inventory.resources[resource.id] || 0) + amount
    const coinReward = Math.floor(resource.value * amount * 0.5); user.coin = (user.coin || 0) + coinReward
    await conn.sendMessage(m.chat, {
        text:
            `> . ﹡ ﹟ ⛏️ ׄ ⬭ *ᴍɪɴᴇʀɪ́ᴀ ᴇxɪᴛᴏsᴀ*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🪨* ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ʜᴇʀʀᴀᴍɪᴇɴᴛᴀ* :: ${pickaxeData.emoji} ${pickaxeData.name}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ᴅᴜʀᴀʙɪʟɪᴅᴀᴅ* :: ${durability}%${durability <= 20 ? ' ⚠️' : ''}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *ʀᴇᴄᴜʀsᴏ* :: ${resource.emoji} ${resource.name} x${amount}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *💰 ɢᴀɴᴀᴅᴏ* :: ¥${coinReward.toLocaleString()} ${currency}`,
        contextInfo: rcanal
    }, { quoted: m })
    await global.db.write()
}
handler.help = ['mine']; handler.tags = ['rpg']; handler.command = ['mine', 'minar']
handler.group = true; handler.reg = true
export default handler
