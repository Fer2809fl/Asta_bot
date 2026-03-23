import fetch from 'node-fetch'
import { missionSystem } from '../../lib/rpg/mission-system.js'
async function getRcanal() {
    try { const thumb = await (await fetch(global.icono)).buffer(); return { isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: global.channelRD?.id || "120363399175402285@newsletter", serverMessageId: '', newsletterName: global.channelRD?.name || "『𝕬𝖘𝖙𝖆-𝕭𝖔𝖙』" }, externalAdReply: { title: global.botname || 'ᴀsᴛᴀ-ʙᴏᴛ', body: global.dev || 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ ғᴇʀɴᴀɴᴅᴏ', mediaType: 1, mediaUrl: global.redes, sourceUrl: global.redes, thumbnail: thumb, showAdAttribution: false, containsAutoReply: true, renderLargerThumbnail: false } } } catch { return {} }
}
const handler = async (m, { conn, usedPrefix, command, text }) => {
    const rcanal = await getRcanal(), currency = global.currency || '¥enes'
    if (m.isGroup && (!global.db.data.chats[m.chat] || !global.db.data.chats[m.chat].economy)) return conn.sendMessage(m.chat, { text: `> . ﹡ ﹟ 🚫 ׄ ⬭ *ᴇᴄᴏɴᴏᴍɪ́ᴀ ᴅᴇsᴀᴄᴛɪᴠᴀᴅᴀ*\n\nׅㅤ𓏸𓈒ㅤׄ Actívala con *${usedPrefix}economy on*`, contextInfo: rcanal }, { quoted: m })
    const send = (t) => conn.sendMessage(m.chat, { text: t, contextInfo: rcanal }, { quoted: m })
    let user = global.db.data.users[m.sender]
    if (!user) { global.db.data.users[m.sender] = { coin: 1000, bank: 0, health: 100, level: 1, xp: 0, inventory: { resources: {}, missions: { daily: { completed: [] }, weekly: { completed: [] }, monthly: { completed: [] } } } }; user = global.db.data.users[m.sender] }
    user.coin ??= 1000; user.bank ??= 0; user.health ??= 100; user.level ??= 1; user.xp ??= 0
    user.minedToday ??= 0; user.choppedToday ??= 0; user.fishedToday ??= 0
    if (!user.inventory) user.inventory = {}
    if (!user.inventory.resources) user.inventory.resources = {}
    if (!user.inventory.missions) user.inventory.missions = { daily: { completed: [] }, weekly: { completed: [] }, monthly: { completed: [] } }
    const args = text ? text.trim().split(/ +/) : []
    const action = args[0]?.toLowerCase() || 'view'

    if (action === 'view' || action === 'ver') {
        const dailyMissions = missionSystem.getMissions('daily')
        const now = Date.now()
        const fmt = (ts) => { const d = ts - now; if (d <= 0) return '¡Ahora!'; const h = Math.floor(d/3600000), mi = Math.floor((d%3600000)/60000); return `${h}h ${mi}m` }
        const dailyReset = missionSystem.lastReset.daily + (24*60*60*1000)
        const weeklyReset = missionSystem.lastReset.weekly + (7*24*60*60*1000)
        let txt = `> . ﹡ ﹟ 🎯 ׄ ⬭ *ᴍɪsɪᴏɴᴇs ʀᴘɢ*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜👤* ㅤ֢ㅤ⸱ㅤᯭִ* — *${await conn.getName(m.sender).catch(() => m.sender.split('@')[0])}*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *💰 Coins* :: ¥${user.coin.toLocaleString()} | *🎚️ Nivel* :: ${user.level}\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜⏰* ㅤ֢ㅤ⸱ㅤᯭִ* — *ʀᴇɪɴɪᴄɪᴏs*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ Diarias: ${fmt(dailyReset)} | Semanales: ${fmt(weeklyReset)}\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜📅* ㅤ֢ㅤ⸱ㅤᯭִ* — *ᴍɪsɪᴏɴᴇs ᴅɪᴀʀɪᴀs*\n`
        dailyMissions.forEach((mission, i) => {
            const done = user.inventory.missions.daily.completed.includes(mission.id)
            const completed = missionSystem.isMissionCompleted(user, mission)
            const progress = missionSystem.getUserProgress(user, mission)
            const pct = Math.min(Math.floor((progress/mission.requirement.amount)*100), 100)
            const bar = '█'.repeat(Math.floor(pct/10)) + '░'.repeat(10-Math.floor(pct/10))
            txt += `\nׅㅤ𓏸𓈒ㅤׄ ${done ? '✅' : completed ? '🎯' : '📌'} *${i+1}. ${mission.name}*\n`
            txt += `   ${mission.description}\n`
            txt += `   [${bar}] ${progress}/${mission.requirement.amount} (${pct}%)\n`
            txt += `   🎁 ¥${mission.reward.coin.toLocaleString()}${mission.reward.resource ? ` + ${mission.reward.amount}x ${mission.reward.resource}` : ''}\n`
            if (completed && !done) txt += `   💡 *${usedPrefix}mission claim daily ${i+1}*\n`
        })
        txt += `\n> ✧ *${usedPrefix}mission claim daily [n]* para reclamar`
        return send(txt)
    }

    if (action === 'claim' || action === 'reclamar') {
        const type = args[1]?.toLowerCase() || 'daily', number = parseInt(args[2])
        if (isNaN(number) || number < 1) return send(`> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴇʀʀᴏʀ*\n\nׅㅤ𓏸𓈒ㅤׄ Uso: *${usedPrefix}mission claim daily 1*`)
        const missions = missionSystem.getMissions(type)
        if (!missions?.length || number > missions.length) return send(`> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴇʀʀᴏʀ*\n\nׅㅤ𓏸𓈒ㅤׄ Misión inválida.`)
        const mission = missions[number - 1]
        const completedList = user.inventory.missions[type]?.completed || []
        if (completedList.includes(mission.id)) return send(`> . ﹡ ﹟ ⚠️ ׄ ⬭ *ʏᴀ ʀᴇᴄʟᴀᴍᴀᴅᴏ*\n\nׅㅤ𓏸𓈒ㅤׄ Ya reclamaste esta misión.`)
        if (!missionSystem.isMissionCompleted(user, mission)) {
            const progress = missionSystem.getUserProgress(user, mission)
            return send(`> . ﹡ ﹟ ❌ ׄ ⬭ *ɪɴᴄᴏᴍᴘʟᴇᴛᴀ*\n\nׅㅤ𓏸𓈒ㅤׄ *${mission.name}*\nׅㅤ𓏸𓈒ㅤׄ Progreso: ${progress}/${mission.requirement.amount}`)
        }
        completedList.push(mission.id)
        user.coin += mission.reward.coin; user.xp += mission.reward.exp || 0
        user.health = Math.min(100, user.health + (mission.reward.health || 0))
        if (mission.reward.resource) user.inventory.resources[mission.reward.resource] = (user.inventory.resources[mission.reward.resource] || 0) + (mission.reward.amount || 1)
        await global.db.write()
        return send(
            `> . ﹡ ﹟ 🎉 ׄ ⬭ *ᴍɪsɪᴏ́ɴ ᴄᴏᴍᴘʟᴇᴛᴀᴅᴀ*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜✅* ㅤ֢ㅤ⸱ㅤᯭִ* — *${mission.name}*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *💰 Coins* :: +¥${mission.reward.coin.toLocaleString()}\n` +
            (mission.reward.exp ? `ׅㅤ𓏸𓈒ㅤׄ *⭐ XP* :: +${mission.reward.exp}\n` : '') +
            (mission.reward.health ? `ׅㅤ𓏸𓈒ㅤׄ *❤️ Salud* :: +${mission.reward.health}\n` : '') +
            (mission.reward.resource ? `ׅㅤ𓏸𓈒ㅤׄ *📦 Recurso* :: +${mission.reward.amount}x ${mission.reward.resource}\n` : '')
        )
    }

    if (action === 'progress' || action === 'progreso') {
        return send(
            `> . ﹡ ﹟ 📊 ׄ ⬭ *ᴘʀᴏɢʀᴇsᴏ*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜📈* ㅤ֢ㅤ⸱ㅤᯭִ* — *ᴅɪᴀʀɪᴏ*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ ⛏️ Minado: ${user.minedToday || 0}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ 🪓 Talado: ${user.choppedToday || 0}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ 🎣 Pesca: ${user.fishedToday || 0}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ 💼 Trabajo: ${user.workedToday || 0}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ ⚔️ Aventuras: ${user.adventuresToday || 0}\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🏆* ㅤ֢ㅤ⸱ㅤᯭִ*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ ✅ Misiones diarias: ${user.inventory.missions.daily.completed.length}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ 💰 Coins: ¥${user.coin.toLocaleString()}\n` +
            `ׅㅤ𓏸𓈒ㅤׄ ❤️ Salud: ${user.health}/100\n` +
            `ׅㅤ𓏸𓈒ㅤׄ 🎚️ Nivel: ${user.level}`
        )
    }

    return handler(m, { conn, usedPrefix, command, text: 'view' })
}
handler.help = ['mission']; handler.tags = ['rpg']; handler.command = ['mission', 'missions', 'misiones', 'quest', 'quests']
handler.group = true; handler.reg = true
export default handler
