import fetch from 'node-fetch'
import { RESOURCE_SYSTEM } from '../../lib/rpg/resource-system.js'
async function getRcanal() {
    try { const thumb = await (await fetch(global.icono)).buffer(); return { isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: global.channelRD?.id || "120363399175402285@newsletter", serverMessageId: '', newsletterName: global.channelRD?.name || "『𝕬𝖘𝖙𝖆-𝕭𝖔𝖙』" }, externalAdReply: { title: global.botname || 'ᴀsᴛᴀ-ʙᴏᴛ', body: global.dev || 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ ғᴇʀɴᴀɴᴅᴏ', mediaType: 1, mediaUrl: global.redes, sourceUrl: global.redes, thumbnail: thumb, showAdAttribution: false, containsAutoReply: true, renderLargerThumbnail: false } } } catch { return {} }
}
const handler = async (m, { conn, usedPrefix, args }) => {
    const rcanal = await getRcanal()
    if (!global.db.data.chats[m.chat].economy && m.isGroup) return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ 🚫 ׄ ⬭ *ᴇᴄᴏɴᴏᴍɪ́ᴀ ᴅᴇsᴀᴄᴛɪᴠᴀᴅᴀ*\n\nׅㅤ𓏸𓈒ㅤׄ Actívala con *${usedPrefix}economy on*`, contextInfo: rcanal }, { quoted: m })
    const user = global.db.data.users[m.sender]
    if (!user.inventory) user.inventory = { resources: {}, tools: { pickaxe: 'basic', axe: 'basic', fishingRod: 'basic' }, durability: { pickaxe: 100, axe: 100, fishingRod: 100 }, crafted: {}, missions: { daily: { streak: 0, lastCompleted: 0, completed: [] }, weekly: { streak: 0, lastCompleted: 0 }, monthly: { streak: 0, lastCompleted: 0 } } }
    const view = args[0]?.toLowerCase() || 'all', page = parseInt(args[1]) || 1, itemsPerPage = 10
    const name = await conn.getName(m.sender).catch(() => m.sender.split('@')[0])
    let text = `> . ﹡ ﹟ 🎒 ׄ ⬭ *ɪɴᴠᴇɴᴛᴀʀɪᴏ*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜👤* ㅤ֢ㅤ⸱ㅤᯭִ* — *${name}*\n`
    if (view === 'tools' || view === 'all') {
        text += `\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🛠️* ㅤ֢ㅤ⸱ㅤᯭִ* — *ʜᴇʀʀᴀᴍɪᴇɴᴛᴀs*\n`
        const tools = user.inventory.tools, dur = user.inventory.durability || {}
        for (const [tool, type] of Object.entries(tools)) {
            const toolData = RESOURCE_SYSTEM.TOOLS[tool === 'pickaxe' ? 'PICKAXES' : tool === 'axe' ? 'AXES' : 'FISHING_RODS'][type]
            const d = dur[tool] || 100
            text += `ׅㅤ𓏸𓈒ㅤׄ ${toolData?.emoji || '🔧'} *${toolData?.name || type}* :: ${d}%\n`
        }
    }
    if (view === 'resources' || view === 'all') {
        const resources = user.inventory.resources || {}, entries = Object.entries(resources)
        if (entries.length > 0) {
            text += `\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜📦* ㅤ֢ㅤ⸱ㅤᯭִ* — *ʀᴇᴄᴜʀsᴏs*\n`
            const paginated = entries.slice((page-1)*itemsPerPage, page*itemsPerPage)
            for (const [id, amount] of paginated) {
                for (const category of Object.values(RESOURCE_SYSTEM.RESOURCES)) {
                    if (category[id]) { text += `ׅㅤ𓏸𓈒ㅤׄ ${category[id].emoji} *${category[id].name}* :: ${amount}\n`; break }
                }
            }
            const tp = Math.ceil(entries.length/itemsPerPage)
            if (tp > 1) text += `\n> Página ${page}/${tp} — *${usedPrefix}inventory resources ${page+1}*`
        }
    }
    if (view === 'crafted' || view === 'all') {
        const crafted = user.inventory.crafted || {}, cEntries = Object.entries(crafted)
        if (cEntries.length > 0) {
            text += `\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🔧* ㅤ֢ㅤ⸱ㅤᯭִ* — *ᴏʙᴊᴇᴛᴏs*\n`
            for (const [id, amount] of cEntries) {
                for (const category of Object.values(RESOURCE_SYSTEM.CRAFT_ITEMS)) {
                    if (category[id]) { text += `ׅㅤ𓏸𓈒ㅤׄ ${category[id].emoji} *${category[id].name}* :: ${amount}\n`; break }
                }
            }
        }
    }
    text += `\n> ✧ *${usedPrefix}inventory [tools/resources/crafted]*`
    await conn.sendMessage(m.chat, { text, contextInfo: rcanal }, { quoted: m })
}
handler.help = ['inventory']; handler.tags = ['rpg']; handler.command = ['inventory', 'inv', 'inventario']
handler.group = true; handler.reg = true
export default handler
