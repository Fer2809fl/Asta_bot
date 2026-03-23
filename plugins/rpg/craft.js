import fetch from 'node-fetch'
import { RESOURCE_SYSTEM } from '../../lib/rpg/resource-system.js'
async function getRcanal() {
    try { const thumb = await (await fetch(global.icono)).buffer(); return { isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: global.channelRD?.id || "120363399175402285@newsletter", serverMessageId: '', newsletterName: global.channelRD?.name || "『𝕬𝖘𝖙𝖆-𝕭𝖔𝖙』" }, externalAdReply: { title: global.botname || 'ᴀsᴛᴀ-ʙᴏᴛ', body: global.dev || 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ ғᴇʀɴᴀɴᴅᴏ', mediaType: 1, mediaUrl: global.redes, sourceUrl: global.redes, thumbnail: thumb, showAdAttribution: false, containsAutoReply: true, renderLargerThumbnail: false } } } catch { return {} }
}
const handler = async (m, { conn, usedPrefix, args }) => {
    const rcanal = await getRcanal(), currency = global.currency || '¥enes'
    if (!global.db.data.chats[m.chat].economy && m.isGroup) return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ 🚫 ׄ ⬭ *ᴇᴄᴏɴᴏᴍɪ́ᴀ ᴅᴇsᴀᴄᴛɪᴠᴀᴅᴀ*\n\nׅㅤ𓏸𓈒ㅤׄ Actívala con *${usedPrefix}economy on*`, contextInfo: rcanal }, { quoted: m })
    const user = global.db.data.users[m.sender]
    if (!user.inventory) user.inventory = { resources: {}, tools: { pickaxe: 'basic', axe: 'basic', fishingRod: 'basic' }, durability: { pickaxe: 100, axe: 100, fishingRod: 100 }, crafted: {}, consumables: {} }
    const itemName = args[0]?.toLowerCase(), amount = parseInt(args[1]) || 1
    const send = (text) => conn.sendMessage(m.chat, { text, contextInfo: rcanal }, { quoted: m })

    if (!itemName || itemName === 'recursos' || itemName === 'resources') {
        if (itemName === 'recursos' || itemName === 'resources') {
            let text = `> . ﹡ ﹟ 📦 ׄ ⬭ *ʀᴇᴄᴜʀsᴏs*\n\n`
            for (const [cat, items] of Object.entries(RESOURCE_SYSTEM.RESOURCES)) {
                text += `*${cat}*\n`
                Object.entries(items).forEach(([id, r]) => { const owned = user.inventory.resources?.[id] || 0; text += `ׅㅤ𓏸𓈒ㅤׄ ${r.emoji} *${r.name}* :: ${owned} (¥${r.value} c/u)\n` })
                text += '\n'
            }
            return send(text)
        }
        let text = `> . ﹡ ﹟ ⚒️ ׄ ⬭ *ᴄʀᴀғᴛᴇᴏ*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜📌* ㅤ֢ㅤ⸱ㅤᯭִ* — *ᴄᴏᴍᴀɴᴅᴏs*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *${usedPrefix}craft* :: Ver crafteable\nׅㅤ𓏸𓈒ㅤׄ *${usedPrefix}craft [item] [cantidad]* :: Craftear\nׅㅤ𓏸𓈒ㅤׄ *${usedPrefix}craft recursos* :: Ver recursos\n\n`
        for (const [cat, items] of Object.entries(RESOURCE_SYSTEM.CRAFT_ITEMS)) {
            text += `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🔧* ㅤ֢ㅤ⸱ㅤᯭִ* — *${cat.toUpperCase()}*\n`
            Object.entries(items).forEach(([id, item]) => {
                const owned = (item.category === 'consumable' ? user.inventory.consumables?.[id] : user.inventory.crafted?.[id]) || 0
                text += `ׅㅤ𓏸𓈒ㅤׄ ${item.emoji} *${item.name}* ${owned > 0 ? `(${owned})` : ''}\n`
                Object.entries(item.materials).forEach(([mat, req]) => { const has = user.inventory.resources?.[mat] || 0; text += `   ${mat}: ${has}/${req} ${has >= req ? '✅' : '❌'}\n` })
            })
            text += '\n'
        }
        return send(text)
    }

    // Craftear item específico
    let itemData = null, category = ''
    for (const [cat, items] of Object.entries(RESOURCE_SYSTEM.CRAFT_ITEMS)) { if (items[itemName]) { itemData = items[itemName]; category = cat; break } }
    if (!itemData) return send(`> . ﹡ ﹟ ❌ ׄ ⬭ *ɴᴏ ᴇɴᴄᴏɴᴛʀᴀᴅᴏ*\n\nׅㅤ𓏸𓈒ㅤׄ Item no encontrado. Usa *${usedPrefix}craft* para ver la lista.`)
    for (const [mat, req] of Object.entries(itemData.materials)) {
        const has = user.inventory?.resources?.[mat] || 0
        if (has < req * amount) return send(`> . ﹡ ﹟ ❌ ׄ ⬭ *ᴍᴀᴛᴇʀɪᴀʟᴇs*\n\nׅㅤ𓏸𓈒ㅤׄ Necesitas ${req * amount}x *${mat}*\nׅㅤ𓏸𓈒ㅤׄ Tienes ${has}`)
    }
    for (const [mat, req] of Object.entries(itemData.materials)) { user.inventory.resources[mat] -= req * amount; if (user.inventory.resources[mat] <= 0) delete user.inventory.resources[mat] }
    if (itemData.category === 'consumable') { if (!user.inventory.consumables) user.inventory.consumables = {}; user.inventory.consumables[itemName] = (user.inventory.consumables[itemName] || 0) + amount }
    else { if (!user.inventory.crafted) user.inventory.crafted = {}; user.inventory.crafted[itemName] = (user.inventory.crafted[itemName] || 0) + amount }
    await global.db.write()
    await send(`> . ﹡ ﹟ ⚒️ ׄ ⬭ *ᴄʀᴀғᴛ ᴇxɪᴛᴏsᴏ*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🎉* ㅤ֢ㅤ⸱ㅤᯭִ*\nׅㅤ𓏸𓈒ㅤׄ *ᴄʀᴀғᴛᴇᴀᴅᴏ* :: ${itemData.emoji} ${itemData.name} x${amount}\n${itemData.effect ? `ׅㅤ𓏸𓈒ㅤׄ *ᴇғᴇᴄᴛᴏ* :: ${itemData.effect}\n` : ''}ׅㅤ𓏸𓈒ㅤׄ Ver objetos con *${usedPrefix}inventory*`)
}
handler.help = ['craft']; handler.tags = ['rpg']; handler.command = ['craft', 'craftear']
handler.group = true; handler.reg = true
export default handler
