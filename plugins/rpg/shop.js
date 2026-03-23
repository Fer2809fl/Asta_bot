import fetch from 'node-fetch'
import { RESOURCE_SYSTEM } from '../../lib/rpg/resource-system.js'
async function getRcanal() {
    try { const thumb = await (await fetch(global.icono)).buffer(); return { isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: global.channelRD?.id || "120363399175402285@newsletter", serverMessageId: '', newsletterName: global.channelRD?.name || "『𝕬𝖘𝖙𝖆-𝕭𝖔𝖙』" }, externalAdReply: { title: global.botname || 'ᴀsᴛᴀ-ʙᴏᴛ', body: global.dev || 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ ғᴇʀɴᴀɴᴅᴏ', mediaType: 1, mediaUrl: global.redes, sourceUrl: global.redes, thumbnail: thumb, showAdAttribution: false, containsAutoReply: true, renderLargerThumbnail: false } } } catch { return {} }
}
const handler = async (m, { conn, usedPrefix, args }) => {
    const rcanal = await getRcanal(), currency = global.currency || '¥enes'
    if (!global.db.data.chats[m.chat].economy && m.isGroup) return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ 🚫 ׄ ⬭ *ᴇᴄᴏɴᴏᴍɪ́ᴀ ᴅᴇsᴀᴄᴛɪᴠᴀᴅᴀ*\n\nׅㅤ𓏸𓈒ㅤׄ Actívala con *${usedPrefix}economy on*`, contextInfo: rcanal }, { quoted: m })
    const user = global.db.data.users[m.sender]
    if (!user) { global.db.data.users[m.sender] = { coin: 1000, bank: 0, health: 100, inventory: { resources: {}, tools: { pickaxe: 'basic', axe: 'basic', fishingRod: 'basic' }, durability: { pickaxe: 100, axe: 100, fishingRod: 100 } } }; return }
    if (!user.inventory) user.inventory = { resources: {}, tools: { pickaxe: 'basic', axe: 'basic', fishingRod: 'basic' }, durability: { pickaxe: 100, axe: 100, fishingRod: 100 } }
    user.coin ??= 0; user.bank ??= 0
    const action = args[0]?.toLowerCase() || 'help', param1 = args[1]?.toLowerCase(), param2 = args[2]

    const send = (text) => conn.sendMessage(m.chat, { text, contextInfo: rcanal }, { quoted: m })

    if (!action || action === 'help' || action === 'menu') {
        return send(
            `> . ﹡ ﹟ 🛒 ׄ ⬭ *ᴛɪᴇɴᴅᴀ ʀᴘɢ*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜💰* ㅤ֢ㅤ⸱ㅤᯭִ* — *sᴀʟᴅᴏ :: ¥${user.coin.toLocaleString()}*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🛠️* ㅤ֢ㅤ⸱ㅤᯭִ* — *ᴄᴏᴍᴘʀᴀʀ*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *${usedPrefix}shop buy pico iron*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *${usedPrefix}shop buy hacha gold*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *${usedPrefix}shop buy caña diamond*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜💰* ㅤ֢ㅤ⸱ㅤᯭִ* — *ᴠᴇɴᴅᴇʀ*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *${usedPrefix}shop sell stone 10*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *${usedPrefix}shop sell all*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🔧* ㅤ֢ㅤ⸱ㅤᯭִ* — *ʀᴇᴘᴀʀᴀʀ*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *${usedPrefix}shop repair pico*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *${usedPrefix}shop repair hacha*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *${usedPrefix}shop repair caña*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜📊* ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *${usedPrefix}shop tools* :: Ver tus herramientas\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *${usedPrefix}shop resources* :: Ver recursos disponibles`
        )
    }

    if (action === 'buy' && param1) {
        const toolMap = { 'pico': { data: RESOURCE_SYSTEM.TOOLS.PICKAXES, field: 'pickaxe' }, 'pick': { data: RESOURCE_SYSTEM.TOOLS.PICKAXES, field: 'pickaxe' }, 'hacha': { data: RESOURCE_SYSTEM.TOOLS.AXES, field: 'axe' }, 'axe': { data: RESOURCE_SYSTEM.TOOLS.AXES, field: 'axe' }, 'caña': { data: RESOURCE_SYSTEM.TOOLS.FISHING_RODS, field: 'fishingRod' }, 'rod': { data: RESOURCE_SYSTEM.TOOLS.FISHING_RODS, field: 'fishingRod' } }
        const toolInfo = toolMap[param1]
        if (!toolInfo) return send(`> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴇʀʀᴏʀ*\n\nׅㅤ𓏸𓈒ㅤׄ Herramienta inválida. Opciones: *pico, hacha, caña*`)
        const toolId = param2 || 'iron', toolData = toolInfo.data[toolId]
        if (!toolData) return send(`> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴇʀʀᴏʀ*\n\nׅㅤ𓏸𓈒ㅤׄ Nivel inválido. Opciones: ${Object.keys(toolInfo.data).join(', ')}`)
        if (user.coin < toolData.price) return send(`> . ﹡ ﹟ 💸 ׄ ⬭ *sɪɴ ғᴏɴᴅᴏs*\n\nׅㅤ𓏸𓈒ㅤׄ Necesitas ¥${toolData.price.toLocaleString()}\nׅㅤ𓏸𓈒ㅤׄ Tienes ¥${user.coin.toLocaleString()}`)
        user.coin -= toolData.price; user.inventory.tools[toolInfo.field] = toolId; user.inventory.durability[toolInfo.field] = toolData.durability
        await global.db.write()
        return send(`> . ﹡ ﹟ ✅ ׄ ⬭ *ᴄᴏᴍᴘʀᴀ ᴇxɪᴛᴏsᴀ*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🛠️* ㅤ֢ㅤ⸱ㅤᯭִ*\nׅㅤ𓏸𓈒ㅤׄ *ᴄᴏᴍᴘʀᴀᴅᴏ* :: ${toolData.emoji} ${toolData.name}\nׅㅤ𓏸𓈒ㅤׄ *ᴄᴏsᴛᴏ* :: -¥${toolData.price.toLocaleString()}\nׅㅤ𓏸𓈒ㅤׄ *sᴀʟᴅᴏ* :: ¥${user.coin.toLocaleString()}`)
    }

    if (action === 'sell' && param1) {
        if (param1 === 'all') {
            const resources = user.inventory?.resources || {}
            if (!Object.keys(resources).length) return send(`> . ﹡ ﹟ ⚠️ ׄ ⬭ *sɪɴ ʀᴇᴄᴜʀsᴏs*\n\nׅㅤ𓏸𓈒ㅤׄ No tienes recursos para vender.`)
            let total = 0, lines = []
            for (const [id, qty] of Object.entries(resources)) {
                for (const cat of Object.values(RESOURCE_SYSTEM.RESOURCES)) {
                    if (cat[id]) { const v = cat[id].value * qty; total += v; lines.push(`ׅㅤ𓏸𓈒ㅤׄ ${cat[id].emoji} ${cat[id].name}: ${qty} → ¥${v.toLocaleString()}`); break }
                }
            }
            user.coin += total; user.inventory.resources = {}; await global.db.write()
            return send(`> . ﹡ ﹟ 💰 ׄ ⬭ *ᴛᴏᴅᴏ ᴠᴇɴᴅɪᴅᴏ*\n\n${lines.join('\n')}\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜✅* ㅤ֢ㅤ⸱ㅤᯭִ*\nׅㅤ𓏸𓈒ㅤׄ *ᴛᴏᴛᴀʟ* :: +¥${total.toLocaleString()} ${currency}`)
        }
        const current = user.inventory.resources?.[param1] || 0
        if (!current) return send(`> . ﹡ ﹟ ⚠️ ׄ ⬭ *sɪɴ ʀᴇᴄᴜʀsᴏ*\n\nׅㅤ𓏸𓈒ㅤׄ No tienes *${param1}*.`)
        const sellAmt = param2 === 'all' ? current : Math.min(parseInt(param2) || 1, current)
        let value = 0, rData = null
        for (const cat of Object.values(RESOURCE_SYSTEM.RESOURCES)) { if (cat[param1]) { rData = cat[param1]; value = rData.value; break } }
        if (!value) return send(`> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴇʀʀᴏʀ*\n\nׅㅤ𓏸𓈒ㅤׄ No se puede vender *${param1}*.`)
        const totalValue = value * sellAmt
        user.coin += totalValue; user.inventory.resources[param1] -= sellAmt
        if (user.inventory.resources[param1] <= 0) delete user.inventory.resources[param1]
        await global.db.write()
        return send(`> . ﹡ ﹟ 💰 ׄ ⬭ *ᴠᴇɴᴛᴀ ᴇxɪᴛᴏsᴀ*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜✅* ㅤ֢ㅤ⸱ㅤᯭִ*\nׅㅤ𓏸𓈒ㅤׄ *ᴠᴇɴᴅɪᴅᴏ* :: ${rData?.emoji || ''} ${sellAmt}x ${param1}\nׅㅤ𓏸𓈒ㅤׄ *ɢᴀɴᴀᴅᴏ* :: +¥${totalValue.toLocaleString()} ${currency}\nׅㅤ𓏸𓈒ㅤׄ *sᴀʟᴅᴏ* :: ¥${user.coin.toLocaleString()}`)
    }

    if (action === 'repair' && param1) {
        const toolMap = { 'pico': { field: 'pickaxe', name: '⛏️ Pico' }, 'pick': { field: 'pickaxe', name: '⛏️ Pico' }, 'hacha': { field: 'axe', name: '🪓 Hacha' }, 'axe': { field: 'axe', name: '🪓 Hacha' }, 'caña': { field: 'fishingRod', name: '🎣 Caña' }, 'rod': { field: 'fishingRod', name: '🎣 Caña' } }
        const toolInfo = toolMap[param1]
        if (!toolInfo) return send(`> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴇʀʀᴏʀ*\n\nׅㅤ𓏸𓈒ㅤׄ Opciones: *pico, hacha, caña*`)
        const dur = user.inventory.durability[toolInfo.field] || 100
        if (dur >= 100) return send(`> . ﹡ ﹟ ✅ ׄ ⬭ *ʏᴀ ᴇsᴛᴀ́ ʙɪᴇɴ*\n\nׅㅤ𓏸𓈒ㅤׄ ${toolInfo.name} ya está al 100%.`)
        const cost = Math.floor((100 - dur) * 10)
        if (user.coin < cost) return send(`> . ﹡ ﹟ 💸 ׄ ⬭ *sɪɴ ғᴏɴᴅᴏs*\n\nׅㅤ𓏸𓈒ㅤׄ Necesitas ¥${cost.toLocaleString()}\nׅㅤ𓏸𓈒ㅤׄ Tienes ¥${user.coin.toLocaleString()}`)
        user.coin -= cost; user.inventory.durability[toolInfo.field] = 100; await global.db.write()
        return send(`> . ﹡ ﹟ 🔧 ׄ ⬭ *ʀᴇᴘᴀʀᴀᴅᴏ*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜✅* ㅤ֢ㅤ⸱ㅤᯭִ*\nׅㅤ𓏸𓈒ㅤׄ *ʜᴇʀʀᴀᴍɪᴇɴᴛᴀ* :: ${toolInfo.name}\nׅㅤ𓏸𓈒ㅤׄ *ᴄᴏsᴛᴏ* :: -¥${cost.toLocaleString()}\nׅㅤ𓏸𓈒ㅤׄ *sᴀʟᴅᴏ* :: ¥${user.coin.toLocaleString()}`)
    }

    if (action === 'tools') {
        let text = `> . ﹡ ﹟ 🛠️ ׄ ⬭ *ᴛᴜs ʜᴇʀʀᴀᴍɪᴇɴᴛᴀs*\n\n`
        const tools = [{ type: 'pickaxe', data: RESOURCE_SYSTEM.TOOLS.PICKAXES }, { type: 'axe', data: RESOURCE_SYSTEM.TOOLS.AXES }, { type: 'fishingRod', data: RESOURCE_SYSTEM.TOOLS.FISHING_RODS }]
        tools.forEach(t => {
            const id = user.inventory.tools[t.type], td = t.data[id], dur = user.inventory.durability[t.type] || 100
            if (td) { text += `ׅㅤ𓏸𓈒ㅤׄ ${td.emoji} *${td.name}*\nׅㅤ𓏸𓈒ㅤׄ Nivel ${td.level} | Eficiencia ${td.efficiency}x | ${dur}%\n\n` }
        })
        return send(text)
    }

    if (action === 'resources') {
        let text = `> . ﹡ ﹟ 📦 ׄ ⬭ *ʀᴇᴄᴜʀsᴏs ᴅɪsᴘᴏɴɪʙʟᴇs*\n\n`
        for (const [cat, items] of Object.entries(RESOURCE_SYSTEM.RESOURCES)) {
            text += `*${cat}*\n`
            Object.entries(items).forEach(([id, r]) => { const owned = user.inventory.resources?.[id] || 0; text += `ׅㅤ𓏸𓈒ㅤׄ ${r.emoji} *${r.name}* :: ¥${r.value} c/u (Tienes: ${owned})\n` })
            text += '\n'
        }
        return send(text)
    }

    return handler(m, { conn, usedPrefix, args: ['help'] })
}
handler.help = ['shop']; handler.tags = ['rpg']; handler.command = ['shop', 'tienda']
handler.group = true; handler.reg = true
export default handler
