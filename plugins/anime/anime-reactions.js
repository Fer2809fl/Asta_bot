import fetch from 'node-fetch'

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
                renderLargerThumbnail: false
            }
        }
    } catch { return {} }
}

let handler = async (m, { conn, command, usedPrefix }) => {
    const rcanal = await getRcanal()
    let mentionedJid = await m.mentionedJid
    let userId = mentionedJid.length > 0 ? mentionedJid[0] : (m.quoted ? await m.quoted.sender : m.sender)
    
    let from = await (async () => global.db.data.users[m.sender].name || (async () => { 
        try { const n = await conn.getName(m.sender); return typeof n === 'string' && n.trim() ? n : m.sender.split('@')[0] } 
        catch { return m.sender.split('@')[0] } 
    })())()
    
    let who = await (async () => global.db.data.users[userId].name || (async () => { 
        try { const n = await conn.getName(userId); return typeof n === 'string' && n.trim() ? n : userId.split('@')[0] } 
        catch { return userId.split('@')[0] } 
    })())()
    
    let str, query
    
    switch (command) {
        case 'angry': case 'enojado':
            str = from === who 
                ? `> . ﹡ ﹟ 😠 ׄ ⬭ *${from}* ᴇsᴛᴀ́ ᴇɴᴏᴊᴀᴅᴏ/ᴀ!\n\n凸ಠ益ಠ)凸` 
                : `> . ﹡ ﹟ 😠 ׄ ⬭ *${from}* ᴇsᴛᴀ́ ᴇɴᴏᴊᴀᴅᴏ/ᴀ ᴄᴏɴ *${who}*!\n\n凸ಠ益ಠ)凸`
            query = 'anime angry'
            break
        case 'bath': case 'bañarse':
            str = from === who 
                ? `> . ﹡ ﹟ 🛁 ׄ ⬭ *${from}* sᴇ ᴇsᴛᴀ́ ʙᴀñᴀɴᴅᴏ!\n\n٩(ˊᗜˋ )و` 
                : `> . ﹡ ﹟ 🛁 ׄ ⬭ *${from}* ᴇsᴛᴀ́ ʙᴀñᴀɴᴅᴏ ᴀ *${who}*!\n\n٩(ˊᗜˋ )و`
            query = 'anime bath'
            break
        case 'bite': case 'morder':
            str = from === who 
                ? `> . ﹡ ﹟ 🦷 ׄ ⬭ *${from}* sᴇ ᴍᴏʀᴅɪᴏ́ ᴀ sí ᴍɪsᴍᴏ/ᴀ!\n\n≽^•⩊•^≼` 
                : `> . ﹡ ﹟ 🦷 ׄ ⬭ *${from}* ᴍᴏʀᴅɪᴏ́ ᴀ *${who}*!\n\n≽^•⩊•^≼`
            query = 'anime bite'
            break
        case 'bleh': case 'lengua':
            str = from === who 
                ? `> . ﹡ ﹟ 😛 ׄ ⬭ *${from}* sᴀᴄᴀ ʟᴀ ʟᴇɴɢᴜᴀ!\n\n(｡╹ω╹｡)` 
                : `> . ﹡ ﹟ 😛 ׄ ⬭ *${from}* ʟᴇ sᴀᴄᴏ́ ʟᴀ ʟᴇɴɢᴜᴀ ᴀ *${who}*!\n\n(｡╹ω╹｡)`
            query = 'anime bleh'
            break
        case 'blush': case 'sonrojarse':
            str = from === who 
                ? `> . ﹡ ﹟ 😊 ׄ ⬭ *${from}* sᴇ sᴏɴʀᴏᴊᴏ́!\n\n( ˶o˶˶o˶)` 
                : `> . ﹡ ﹟ 😊 ׄ ⬭ *${from}* sᴇ sᴏɴʀᴏᴊᴏ́ ᴘᴏʀ *${who}*!\n\n( ˶o˶˶o˶)`
            query = 'anime blush'
            break
        case 'bored': case 'aburrido':
            str = from === who 
                ? `> . ﹡ ﹟ 😒 ׄ ⬭ *${from}* ᴇsᴛᴀ́ ᴀʙᴜʀʀɪᴅᴏ/ᴀ!\n\n( ¬_¬)` 
                : `> . ﹡ ﹟ 😒 ׄ ⬭ *${from}* ᴇsᴛᴀ́ ᴀʙᴜʀʀɪᴅᴏ/ᴀ ᴅᴇ *${who}*!\n\n( ¬_¬)`
            query = 'anime bored'
            break
        case 'clap': case 'aplaudir':
            str = from === who 
                ? `> . ﹡ ﹟ 👏 ׄ ⬭ *${from}* ᴇsᴛᴀ́ ᴀᴘʟᴀᴜᴅɪᴇɴᴅᴏ!\n\n(୨୧•͈ᴗ•͈)` 
                : `> . ﹡ ﹟ 👏 ׄ ⬭ *${from}* ᴇsᴛᴀ́ ᴀᴘʟᴀᴜᴅɪᴇɴᴅᴏ ᴘᴏʀ *${who}*!\n\n(୨୧•͈ᴗ•͈)`
            query = 'anime clap'
            break
        case 'coffee': case 'cafe': case 'café':
            str = from === who 
                ? `> . ﹡ ﹟ ☕ ׄ ⬭ *${from}* ᴇsᴛᴀ́ ᴛᴏᴍᴀɴᴅᴏ ᴄᴀғᴇ́!\n\n٩(●ᴗ●)۶` 
                : `> . ﹡ ﹟ ☕ ׄ ⬭ *${from}* ᴇsᴛᴀ́ ᴛᴏᴍᴀɴᴅᴏ ᴄᴀғᴇ́ ᴄᴏɴ *${who}*!\n\n٩(●ᴗ●)۶`
            query = 'anime coffee'
            break
        case 'cry': case 'llorar':
            str = from === who 
                ? `> . ﹡ ﹟ 😭 ׄ ⬭ *${from}* ᴇsᴛᴀ́ ʟʟᴏʀᴀɴᴅᴏ!\n\n(╥_╥)` 
                : `> . ﹡ ﹟ 😭 ׄ ⬭ *${from}* ᴇsᴛᴀ́ ʟʟᴏʀᴀɴᴅᴏ ᴘᴏʀ *${who}*!\n\n(╥_╥)`
            query = 'anime cry'
            break
        case 'cuddle': case 'acurrucarse':
            str = from === who 
                ? `> . ﹡ ﹟ 🤗 ׄ ⬭ *${from}* sᴇ ᴀᴄᴜʀʀᴜᴄᴏ́ ᴄᴏɴ sí ᴍɪsᴍᴏ/ᴀ!\n\n꒰ঌ(˶ˆᗜˆ˵)໒꒱` 
                : `> . ﹡ ﹟ 🤗 ׄ ⬭ *${from}* sᴇ ᴀᴄᴜʀʀᴜᴄᴏ́ ᴄᴏɴ *${who}*!\n\n꒰ঌ(˶ˆᗜˆ˵)໒꒱`
            query = 'anime cuddle'
            break
        case 'dance': case 'bailar':
            str = from === who 
                ? `> . ﹡ ﹟ 💃 ׄ ⬭ *${from}* ᴇsᴛᴀ́ ʙᴀɪʟᴀɴᴅᴏ!\n\n(ﾉ^ヮ^)ﾉ*:・ﾟ✧` 
                : `> . ﹡ ﹟ 💃 ׄ ⬭ *${from}* ᴇsᴛᴀ́ ʙᴀɪʟᴀɴᴅᴏ ᴄᴏɴ *${who}*!\n\n(ﾉ^ヮ^)ﾉ*:・ﾟ✧`
            query = 'anime dance'
            break
        case 'drunk': case 'borracho':
            str = from === who 
                ? `> . ﹡ ﹟ 🍺 ׄ ⬭ *${from}* ᴇsᴛᴀ́ ʙᴏʀʀᴀᴄʜᴏ/ᴀ!\n\n(⸝⸝๑﹏๑⸝⸝)` 
                : `> . ﹡ ﹟ 🍺 ׄ ⬭ *${from}* ᴇsᴛᴀ́ ʙᴏʀʀᴀᴄʜᴏ/ᴀ ᴄᴏɴ *${who}*!\n\n(⸝⸝๑﹏๑⸝⸝)`
            query = 'anime drunk'
            break
        case 'eat': case 'comer':
            str = from === who 
                ? `> . ﹡ ﹟ 🍽️ ׄ ⬭ *${from}* ᴇsᴛᴀ́ ᴄᴏᴍɪᴇɴᴅᴏ!\n\n(っ˘ڡ˘ς)` 
                : `> . ﹡ ﹟ 🍽️ ׄ ⬭ *${from}* ᴇsᴛᴀ́ ᴄᴏᴍɪᴇɴᴅᴏ ᴄᴏɴ *${who}*!\n\n(っ˘ڡ˘ς)`
            query = 'anime eat'
            break
        case 'facepalm': case 'palmada':
            str = from === who 
                ? `> . ﹡ ﹟ 🤦 ׄ ⬭ *${from}* sᴇ ᴅᴀ ᴜɴᴀ ᴘᴀʟᴍᴀᴅᴀ ᴇɴ ʟᴀ ᴄᴀʀᴀ!\n\n(ভ_ ভ) ރ` 
                : `> . ﹡ ﹟ 🤦 ׄ ⬭ *${from}* sᴇ ғʀᴜsᴛʀᴀ ʏ sᴇ ᴅᴀ ᴜɴᴀ ᴘᴀʟᴍᴀᴅᴀ ᴘᴏʀ *${who}*!\n\n(ভ_ ভ) ރ`
            query = 'anime facepalm'
            break
        case 'happy': case 'feliz':
            str = from === who 
                ? `> . ﹡ ﹟ 😄 ׄ ⬭ *${from}* ᴇsᴛᴀ́ ғᴇʟɪᴢ!\n\n٩(˶ˆᗜˆ˵)و` 
                : `> . ﹡ ﹟ 😄 ׄ ⬭ *${from}* ᴇsᴛᴀ́ ғᴇʟɪᴢ ᴘᴏʀ *${who}*!\n\n٩(˶ˆᗜˆ˵)و`
            query = 'anime happy'
            break
        case 'hug': case 'abrazar':
            str = from === who 
                ? `> . ﹡ ﹟ 🤗 ׄ ⬭ *${from}* sᴇ ᴀʙʀᴀᴢᴏ́ ᴀ sí ᴍɪsᴍᴏ/ᴀ!\n\n(づ˶•༝•˶)づ♡` 
                : `> . ﹡ ﹟ 🤗 ׄ ⬭ *${from}* ᴀʙʀᴀᴢᴏ́ ᴀ *${who}*!\n\n(づ˶•༝•˶)づ♡`
            query = 'anime hug'
            break
        case 'kill': case 'matar':
            str = from === who 
                ? `> . ﹡ ﹟ 💀 ׄ ⬭ *${from}* sᴇ ᴍᴀᴛᴏ́ ᴀ sí ᴍɪsᴍᴏ/ᴀ!\n\n( ⚆ _ ⚆ )` 
                : `> . ﹡ ﹟ 💀 ׄ ⬭ *${from}* ᴍᴀᴛᴏ́ ᴀ *${who}*!\n\n( ⚆ _ ⚆ )`
            query = 'anime kill'
            break
        case 'kiss': case 'muak':
            str = from === who 
                ? `> . ﹡ ﹟ 💋 ׄ ⬭ *${from}* sᴇ ʙᴇsᴏ́ ᴀ sí ᴍɪsᴍᴏ/ᴀ!\n\n( ˘ ³˘)♥` 
                : `> . ﹡ ﹟ 💋 ׄ ⬭ *${from}* ʙᴇsᴏ́ ᴀ *${who}*!\n\n( ˘ ³˘)♥`
            query = 'anime kiss'
            break
        case 'laugh': case 'reirse':
            str = from === who 
                ? `> . ﹡ ﹟ 😆 ׄ ⬭ *${from}* sᴇ ʀɪ́ᴇ!\n\n(≧▽≦)` 
                : `> . ﹡ ﹟ 😆 ׄ ⬭ *${from}* sᴇ ᴇsᴛᴀ́ ʀɪᴇɴᴅᴏ ᴅᴇ *${who}*!\n\n(≧▽≦)`
            query = 'anime laugh'
            break
        case 'lick': case 'lamer':
            str = from === who 
                ? `> . ﹡ ﹟ 👅 ׄ ⬭ *${from}* sᴇ ʟᴀᴍɪᴏ́ ᴀ sí ᴍɪsᴍᴏ/ᴀ!\n\n（＾ω＾）` 
                : `> . ﹡ ﹟ 👅 ׄ ⬭ *${from}* ʟᴀᴍɪᴏ́ ᴀ *${who}*!\n\n（＾ω＾）`
            query = 'anime lick'
            break
        case 'slap': case 'bofetada':
            str = from === who 
                ? `> . ﹡ ﹟ 👋 ׄ ⬭ *${from}* sᴇ ɢᴏʟᴘᴇᴏ́ ᴀ sí ᴍɪsᴍᴏ/ᴀ!\n\nᕙ(⇀‸↼‵‵)ᕗ` 
                : `> . ﹡ ﹟ 👋 ׄ ⬭ *${from}* ʟᴇ ᴅɪᴏ ᴜɴᴀ ʙᴏғᴇᴛᴀᴅᴀ ᴀ *${who}*!\n\nᕙ(⇀‸↼‵‵)ᕗ`
            query = 'anime slap'
            break
        case 'sleep': case 'dormir':
            str = from === who 
                ? `> . ﹡ ﹟ 😴 ׄ ⬭ *${from}* ᴇsᴛᴀ́ ᴅᴜʀᴍɪᴇɴᴅᴏ ᴘʀᴏғᴜɴᴅᴀᴍᴇɴᴛᴇ!\n\n(∪｡∪)｡｡｡zzz` 
                : `> . ﹡ ﹟ 😴 ׄ ⬭ *${from}* ᴅᴜᴇʀᴍᴇ ᴊᴜɴᴛᴏ ᴀ *${who}*!\n\n(∪｡∪)｡｡｡zzz`
            query = 'anime sleep'
            break
        case 'smoke': case 'fumar':
            str = from === who 
                ? `> . ﹡ ﹟ 🚬 ׄ ⬭ *${from}* ᴇsᴛᴀ́ ғᴜᴍᴀɴᴅᴏ!\n\n(￣ー￣)_旦~` 
                : `> . ﹡ ﹟ 🚬 ׄ ⬭ *${from}* ᴇsᴛᴀ́ ғᴜᴍᴀɴᴅᴏ ᴄᴏɴ *${who}*!\n\n(￣ー￣)_旦~`
            query = 'anime smoke'
            break
        case 'spit': case 'escupir':
            str = from === who 
                ? `> . ﹡ ﹟ 💦 ׄ ⬭ *${from}* sᴇ ᴇsᴄᴜᴘɪᴏ́ ᴀ sí ᴍɪsᴍᴏ/ᴀ!\n\n٩(๑˘^˘๑)۶` 
                : `> . ﹡ ﹟ 💦 ׄ ⬭ *${from}* ᴇsᴄᴜᴘɪᴏ́ ᴀ *${who}*!\n\n٩(๑˘^˘๑)۶`
            query = 'anime spit'
            break
        case 'step': case 'pisar':
            str = from === who 
                ? `> . ﹡ ﹟ 👣 ׄ ⬭ *${from}* sᴇ ᴘɪsᴏ́ ᴀ sí ᴍɪsᴍᴏ/ᴀ!\n\nಥ_ಥ` 
                : `> . ﹡ ﹟ 👣 ׄ ⬭ *${from}* ᴘɪsᴏ́ ᴀ *${who}* sɪɴ ᴘɪᴇᴅᴀᴅ!\n\nಥ_ಥ`
            query = 'anime step'
            break
        case 'think': case 'pensar':
            str = from === who 
                ? `> . ﹡ ﹟ 🤔 ׄ ⬭ *${from}* ᴇsᴛᴀ́ ᴘᴇɴsᴀɴᴅᴏ!\n\n(⸝⸝╸-╺⸝⸝)` 
                : `> . ﹡ ﹟ 🤔 ׄ ⬭ *${from}* ᴇsᴛᴀ́ ᴘᴇɴsᴀɴᴅᴏ ᴇɴ *${who}*!\n\n(⸝⸝╸-╺⸝⸝)`
            query = 'anime think'
            break
        case 'love': case 'enamorado': case 'enamorada':
            str = from === who 
                ? `> . ﹡ ﹟ ❤️ ׄ ⬭ *${from}* ᴇsᴛᴀ́ ᴇɴᴀᴍᴏʀᴀᴅᴏ/ᴀ ᴅᴇ sí ᴍɪsᴍᴏ/ᴀ!\n\n(≧◡≦) ♡` 
                : `> . ﹡ ﹟ ❤️ ׄ ⬭ *${from}* ᴇsᴛᴀ́ ᴇɴᴀᴍᴏʀᴀᴅᴏ/ᴀ ᴅᴇ *${who}*!\n\n(≧◡≦) ♡`
            query = 'anime love'
            break
        case 'pat': case 'palmadita': case 'palmada':
            str = from === who 
                ? `> . ﹡ ﹟ 🖐️ ׄ ⬭ *${from}* sᴇ ᴅᴀ ᴘᴀʟᴍᴀᴅɪᴛᴀs ᴅᴇ ᴀᴜᴛᴏᴀᴘᴏʏᴏ!\n\nଘ(੭ˊᵕˋ)੭` 
                : `> . ﹡ ﹟ 🖐️ ׄ ⬭ *${from}* ᴀᴄᴀʀɪᴄɪᴀ sᴜᴀᴠᴇᴍᴇɴᴛᴇ ᴀ *${who}*!\n\nଘ(੭ˊᵕˋ)੭`
            query = 'anime pat'
            break
        case 'poke': case 'picar':
            str = from === who 
                ? `> . ﹡ ﹟ 👉 ׄ ⬭ *${from}* sᴇ ᴅᴀ ᴜɴ ᴛᴏǫᴜᴇ ᴄᴜʀɪᴏsᴏ!\n\n(,,◕.◕,,)` 
                : `> . ﹡ ﹟ 👉 ׄ ⬭ *${from}* ᴅᴀ ᴜɴ ɢᴏʟᴘᴇᴄɪᴛᴏ ᴀ *${who}*!\n\n(,,◕.◕,,)`
            query = 'anime poke'
            break
        case 'pout': case 'pucheros':
            str = from === who 
                ? `> . ﹡ ﹟ 😗 ׄ ⬭ *${from}* ʜᴀᴄᴇ ᴘᴜᴄʜᴇʀᴏs!\n\n(๑•́ ₃ •̀๑)` 
                : `> . ﹡ ﹟ 😗 ׄ ⬭ *${from}* ᴇsᴛᴀ́ ʜᴀᴄɪᴇɴᴅᴏ ᴘᴜᴄʜᴇʀᴏs ᴘᴏʀ *${who}*!\n\n(๑•́ ₃ •̀๑)`
            query = 'anime pout'
            break
        case 'punch': case 'pegar': case 'golpear':
            str = from === who 
                ? `> . ﹡ ﹟ 👊 ׄ ⬭ *${from}* sᴇ ɢᴏʟᴘᴇᴏ́ ᴀ sí ᴍɪsᴍᴏ/ᴀ!\n\n(ദി˙ᗜ˙)` 
                : `> . ﹡ ﹟ 👊 ׄ ⬭ *${from}* ɢᴏʟᴘᴇᴀ ᴀ *${who}* ᴄᴏɴ ᴛᴏᴅᴀs sᴜs ғᴜᴇʀᴢᴀs!\n\n(ദ്ദി˙ᗜ˙)`
            query = 'anime punch'
            break
        case 'preg': case 'preñar': case 'embarazar':
            str = from === who 
                ? `> . ﹡ ﹟ 🤰 ׄ ⬭ *${from}* sᴇ ᴇᴍʙᴀʀᴀᴢᴏ́ sᴏʟɪᴛᴏ/ᴀ... ᴍɪsᴛᴇʀɪᴏsᴏ!\n\n(¬ω¬)` 
                : `> . ﹡ ﹟ 🤰 ׄ ⬭ *${from}* ʟᴇ ʀᴇɢᴀʟᴏ́ 9 ᴍᴇsᴇs ᴅᴇ ᴇsᴘᴇʀᴀ ᴀ *${who}*!\n\n(¬ω¬)`
            query = 'anime preg'
            break
        case 'run': case 'correr':
            str = from === who 
                ? `> . ﹡ ﹟ 🏃 ׄ ⬭ *${from}* ᴇsᴛᴀ́ ʜᴀᴄɪᴇɴᴅᴏ ᴄᴀʀᴅɪᴏ... ᴏ ᴇsᴏ ᴅɪᴄᴇ!\n\n┗(＾0＾)┓` 
                : `> . ﹡ ﹟ 🏃 ׄ ⬭ *${from}* sᴀʟᴇ ᴅɪsᴘᴀʀᴀᴅᴏ/ᴀ ᴀʟ ᴠᴇʀ ᴀ *${who}* ᴀᴄᴇʀᴄᴀʀsᴇ!\n\n┗(＾0＾)┓`
            query = 'anime run'
            break
        case 'sad': case 'triste':
            str = from === who 
                ? `> . ﹡ ﹟ 😢 ׄ ⬭ *${from}* ᴄᴏɴᴛᴇᴍᴘʟᴀ ʟᴀ ʟʟᴜᴠɪᴀ ᴄᴏɴ ᴇxᴘʀᴇsɪᴏ́ɴ ᴛʀɪsᴛᴇ!\n\n(｡•́︿•̀｡)` 
                : `> . ﹡ ﹟ 😢 ׄ ⬭ *${from}* ᴍɪʀᴀ ᴘᴏʀ ʟᴀ ᴠᴇɴᴛᴀɴᴀ ʏ ᴘɪᴇɴsᴀ ᴇɴ *${who}*!\n\n(｡•́︿•̀｡)`
            query = 'anime sad'
            break
        case 'scared': case 'asustada': case 'asustado':
            str = from === who 
                ? `> . ﹡ ﹟ 😱 ׄ ⬭ *${from}* sᴇ ᴀsᴜsᴛᴀ!\n\n(꒪ཀ꒪)` 
                : `> . ﹡ ﹟ 😱 ׄ ⬭ *${from}* ᴇsᴛᴀ́ ᴀᴛᴇʀʀᴏʀɪᴢᴀᴅᴏ/ᴀ ᴅᴇ *${who}*!\n\n(꒪ཀ꒪)`
            query = 'anime scared'
            break
        case 'seduce': case 'seducir':
            str = from === who 
                ? `> . ﹡ ﹟ 😏 ׄ ⬭ *${from}* sᴜsᴜʀʀᴀ ᴠᴇʀsᴏs ᴅᴇ ᴀᴍᴏʀ ᴀʟ ᴀɪʀᴇ!\n\n( ͡° ͜ʖ ͡°)` 
                : `> . ﹡ ﹟ 😏 ׄ ⬭ *${from}* ʟᴀɴᴢᴀ ᴜɴᴀ ᴍɪʀᴀᴅᴀ ǫᴜᴇ ᴅᴇʀʀɪᴛᴇ ᴀ *${who}*!\n\n( ͡° ͜ʖ ͡°)`
            query = 'anime seduce'
            break
        case 'shy': case 'timido': case 'timida':
            str = from === who 
                ? `> . ﹡ ﹟ 😳 ׄ ⬭ *${from}* ɴᴏ sᴀʙᴇ ᴄᴏ́ᴍᴏ ᴀᴄᴛᴜᴀʀ... sᴇ ᴘᴏɴᴇ ʀᴏᴊᴏ/ᴀ!\n\n(⸝⸝⸝-﹏-⸝⸝⸝)` 
                : `> . ﹡ ﹟ 😳 ׄ ⬭ *${from}* ʙᴀᴊᴀ ʟᴀ ᴍɪʀᴀᴅᴀ ᴛɪ́ᴍɪᴅᴀᴍᴇɴᴛᴇ ғʀᴇɴᴛᴇ ᴀ *${who}*!\n\n(⸝⸝⸝-﹏-⸝⸝⸝)`
            query = 'anime shy'
            break
        case 'walk': case 'caminar':
            str = from === who 
                ? `> . ﹡ ﹟ 🚶 ׄ ⬭ *${from}* ᴘᴀsᴇᴀ!\n\n┌( ಠ‿ಠ)┘` 
                : `> . ﹡ ﹟ 🚶 ׄ ⬭ *${from}* ᴇsᴛᴀ́ ᴄᴀᴍɪɴᴀɴᴅᴏ ᴄᴏɴ *${who}*!\n\n┌( ಠ‿ಠ)┘`
            query = 'anime walk'
            break
        case 'dramatic': case 'drama':
            str = from === who 
                ? `> . ﹡ ﹟ 🎭 ׄ ⬭ *${from}* ᴇsᴛᴀ́ ᴍᴏɴᴛᴀɴᴅᴏ ᴜɴ sʜᴏᴡ ᴅɪɢɴᴏ ᴅᴇ ᴜɴ ᴏsᴄᴀʀ!\n\n(┬┬﹏┬┬)` 
                : `> . ﹡ ﹟ 🎭 ׄ ⬭ *${from}* ᴇsᴛᴀ́ ᴀᴄᴛᴜᴀɴᴅᴏ ᴅʀᴀᴍᴀ́ᴛɪᴄᴀᴍᴇɴᴛᴇ ᴘᴏʀ *${who}*!\n\n(┬┬﹏┬┬)`
            query = 'anime dramatic'
            break
        case 'kisscheek': case 'beso':
            str = from === who 
                ? `> . ﹡ ﹟ 😘 ׄ ⬭ *${from}* sᴇ ʙᴇsᴏ́ ʟᴀ ᴍᴇᴊɪʟʟᴀ ᴄᴏɴ ᴄᴀʀɪɴ̃ᴏ!\n\n(˶ ˘ ³˘)` 
                : `> . ﹡ ﹟ 😘 ׄ ⬭ *${from}* ʙᴇsᴏ́ ʟᴀ ᴍᴇᴊɪʟʟᴀ ᴅᴇ *${who}* ᴄᴏɴ ᴛᴇʀɴᴜʀᴀ!\n\n(˶ ˘ ³˘)`
            query = 'anime kisscheek'
            break
        case 'wink': case 'guiñar':
            str = from === who 
                ? `> . ﹡ ﹟ 😉 ׄ ⬭ *${from}* sᴇ ɢᴜɪñᴏ́ ᴇʟ ᴏᴊᴏ ᴀ sí ᴍɪsᴍᴏ/ᴀ ᴇɴ ᴇʟ ᴇsᴘᴇᴊᴏ!\n\n(⸝⸝> ᴗ•⸝⸝)` 
                : `> . ﹡ ﹟ 😉 ׄ ⬭ *${from}* ʟᴇ ɢᴜɪñᴏ́ ᴇʟ ᴏᴊᴏ ᴀ *${who}*!\n\n(⸝⸝> ᴗ•⸝⸝)`
            query = 'anime wink'
            break
        case 'cringe': case 'avergonzarse':
            str = from === who 
                ? `> . ﹡ ﹟ 😬 ׄ ⬭ *${from}* sɪᴇɴᴛᴇ ᴄʀɪɴɢᴇ!\n\n(ᇂ_ᇂ|||)` 
                : `> . ﹡ ﹟ 😬 ׄ ⬭ *${from}* sɪᴇɴᴛᴇ ᴄʀɪɴɢᴇ ᴘᴏʀ *${who}*!\n\n(ᇂ_ᇂ|||)`
            query = 'anime cringe'
            break
        case 'smug': case 'presumir':
            str = from === who 
                ? `> . ﹡ ﹟ 😎 ׄ ⬭ *${from}* ᴇsᴛᴀ́ ᴘʀᴇsᴜᴍɪᴇɴᴅᴏ ᴍᴜᴄʜᴏ ᴜ́ʟᴛɪᴍᴀᴍᴇɴᴛᴇ!\n\nପ(๑•ᴗ•๑)ଓ` 
                : `> . ﹡ ﹟ 😎 ׄ ⬭ *${from}* ᴇsᴛᴀ́ ᴘʀᴇsᴜᴍɪᴇɴᴅᴏ ᴀ *${who}*!\n\nପ(๑•ᴗ•๑)ଓ`
            query = 'anime smug'
            break
        case 'smile': case 'sonreir':
            str = from === who 
                ? `> . ﹡ ﹟ 😊 ׄ ⬭ *${from}* ᴇsᴛᴀ́ sᴏɴʀɪᴇɴᴅᴏ!\n\n( ˶ˆᗜˆ˵ )` 
                : `> . ﹡ ﹟ 😊 ׄ ⬭ *${from}* ʟᴇ sᴏɴʀɪᴏ́ ᴀ *${who}*!\n\n( ˶ˆᗜˆ˵ )`
            query = 'anime smile'
            break
        case 'highfive': case '5':
            str = from === who 
                ? `> . ﹡ ﹟ 🖐️ ׄ ⬭ *${from}* sᴇ ᴄʜᴏᴄᴏ́ ʟᴏs ᴄɪɴᴄᴏ ғʀᴇɴᴛᴇ ᴀʟ ᴇsᴘᴇᴊᴏ!\n\n(•̀o•́)ง` 
                : `> . ﹡ ﹟ 🖐️ ׄ ⬭ *${from}* ᴄʜᴏᴄᴏ́ ʟᴏs 5 ᴄᴏɴ *${who}*!\n\n(•̀o•́)ง٩(ˊᗜˋ)`
            query = 'anime highfive'
            break
        case 'handhold': case 'mano':
            str = from === who 
                ? `> . ﹡ ﹟ 🤝 ׄ ⬭ *${from}* sᴇ ᴅɪᴏ ʟᴀ ᴍᴀɴᴏ ᴄᴏɴsɪɢᴏ ᴍɪsᴍᴏ/ᴀ!\n\n(∩•̀ω•́)⊃` 
                : `> . ﹡ ﹟ 🤝 ׄ ⬭ *${from}* ʟᴇ ᴀɢᴀʀʀᴏ́ ʟᴀ ᴍᴀɴᴏ ᴀ *${who}*!\n\n(∩•̀ω•́)⊃`
            query = 'anime handhold'
            break
        case 'bullying': case 'bully':
            str = from === who 
                ? `> . ﹡ ﹟ 😤 ׄ ⬭ *${from}* sᴇ ʜᴀᴄᴇ ʙᴜʟʟʏɪɴɢ sᴏʟᴏ... ᴀʟɢᴜɪᴇɴ ᴀʙʀᴀ́ᴄᴇʟᴏ!\n\n༼ ಠДಠ ༽` 
                : `> . ﹡ ﹟ 😤 ׄ ⬭ *${from}* ʟᴇ ᴇsᴛᴀ́ ʜᴀᴄɪᴇɴᴅᴏ ʙᴜʟʟʏɪɴɢ ᴀ *${who}*!\n\n༼ ಠДಠ ༽`
            query = 'anime bullying'
            break
        case 'wave': case 'hola': case 'ola':
            str = from === who 
                ? `> . ﹡ ﹟ 👋 ׄ ⬭ *${from}* sᴇ sᴀʟᴜᴅᴏ́ ᴀ sí ᴍɪsᴍᴏ/ᴀ ᴇɴ ᴇʟ ᴇsᴘᴇᴊᴏ!\n\n(๑˃̵ᴗ˂̵)و` 
                : `> . ﹡ ﹟ 👋 ׄ ⬭ *${from}* ᴇsᴛᴀ́ sᴀʟᴜᴅᴀɴᴅᴏ ᴀ *${who}*!\n\n(๑˃̵ᴗ˂̵)و`
            query = 'anime wave'
            break
    }
    
    if (m.isGroup) {
        try {
            const res = await fetch(`${global.APIs.delirius.url}/search/tenor?q=${query}`)
            const json = await res.json()
            const gifs = json.data
            
            if (!gifs || gifs.length === 0) {
                return conn.sendMessage(m.chat, {
                    text: `ׅㅤ𓏸𓈒ㅤׄ ⚠️ *sɪɴ ʀᴇsᴜʟᴛᴀᴅᴏs* :: ɴᴏ sᴇ ᴇɴᴄᴏɴᴛʀᴀʀᴏɴ ɢɪғs`,
                    contextInfo: rcanal
                }, { quoted: m })
            }
            
            const randomGif = gifs[Math.floor(Math.random() * gifs.length)].mp4
            conn.sendMessage(m.chat, { 
                video: { url: randomGif }, 
                gifPlayback: true, 
                caption: str, 
                mentions: [who],
                contextInfo: rcanal
            }, { quoted: m })
            
        } catch (e) {
            conn.sendMessage(m.chat, {
                text: `ׅㅤ𓏸𓈒ㅤׄ ⚠️ *ᴇʀʀᴏʀ* :: ${e.message}\n\nׅㅤ𓏸𓈒ㅤׄ *ɪɴғᴏʀᴍᴀʀ* :: ᴜsᴀ *${usedPrefix}report* ᴘᴀʀᴀ ɪɴғᴏʀᴍᴀʀ ᴇʟ ᴘʀᴏʙʟᴇᴍᴀ`,
                contextInfo: rcanal
            }, { quoted: m })
        }
    }
}

handler.help = ['angry', 'enojado', 'bath', 'bañarse', 'bite', 'morder', 'bleh', 'lengua', 'blush', 'sonrojarse', 'bored', 'aburrido', 'clap', 'aplaudir', 'coffee', 'cafe', 'café', 'cry', 'llorar', 'cuddle', 'acurrucarse', 'dance', 'bailar', 'drunk', 'borracho', 'eat', 'comer', 'facepalm', 'palmada', 'happy', 'feliz', 'hug', 'abrazar', 'kill', 'matar', 'kiss', 'muak', 'laugh', 'reirse', 'lick', 'lamer', 'slap', 'bofetada', 'sleep', 'dormir', 'smoke', 'fumar', 'spit', 'escupir', 'step', 'pisar', 'think', 'pensar', 'love', 'enamorado', 'enamorada', 'pat', 'palmadita', 'palmada', 'poke', 'picar', 'pout', 'pucheros', 'punch', 'pegar', 'golpear', 'preg', 'preñar', 'embarazar', 'run', 'correr', 'sad', 'triste', 'scared', 'asustada', 'asustado', 'seduce', 'seducir', 'shy', 'timido', 'timida', 'walk', 'caminar', 'dramatic', 'drama', 'kisscheek', 'beso', 'wink', 'guiñar', 'cringe', 'avergonzarse', 'smug', 'presumir', 'smile', 'sonreir', 'clap', 'aplaudir', 'highfive', '5', 'bully', 'bullying', 'mano', 'handhold', 'ola', 'wave', 'hola']
handler.tags = ['anime']
handler.command = ['angry', 'enojado', 'bath', 'bañarse', 'bite', 'morder', 'bleh', 'lengua', 'blush', 'sonrojarse', 'bored', 'aburrido', 'clap', 'aplaudir', 'coffee', 'cafe', 'café', 'cry', 'llorar', 'cuddle', 'acurrucarse', 'dance', 'bailar', 'drunk', 'borracho', 'eat', 'comer', 'facepalm', 'palmada', 'happy', 'feliz', 'hug', 'abrazar', 'kill', 'matar', 'kiss', 'muak', 'laugh', 'reirse', 'lick', 'lamer', 'slap', 'bofetada', 'sleep', 'dormir', 'smoke', 'fumar', 'spit', 'escupir', 'step', 'pisar', 'think', 'pensar', 'love', 'enamorado', 'enamorada', 'pat', 'palmadita', 'palmada', 'poke', 'picar', 'pout', 'pucheros', 'punch', 'pegar', 'golpear', 'preg', 'preñar', 'embarazar', 'run', 'correr', 'sad', 'triste', 'scared', 'asustada', 'asustado', 'seduce', 'seducir', 'shy', 'timido', 'timida', 'walk', 'caminar', 'dramatic', 'drama', 'kisscheek', 'beso', 'wink', 'guiñar', 'cringe', 'avergonzarse', 'smug', 'presumir', 'smile', 'sonreir', 'clap', 'aplaudir', 'highfive', '5', 'bully', 'bullying', 'mano', 'handhold', 'ola', 'wave', 'hola']
handler.group = true
handler.reg = true

export { handler as default }
