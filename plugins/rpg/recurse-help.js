import fetch from 'node-fetch'
async function getRcanal() {
    try { const thumb = await (await fetch(global.icono)).buffer(); return { isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: global.channelRD?.id || "120363399175402285@newsletter", serverMessageId: '', newsletterName: global.channelRD?.name || "『𝕬𝖘𝖙𝖆-𝕭𝖔𝖙』" }, externalAdReply: { title: global.botname || 'ᴀsᴛᴀ-ʙᴏᴛ', body: global.dev || 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ ғᴇʀɴᴀɴᴅᴏ', mediaType: 1, mediaUrl: global.redes, sourceUrl: global.redes, thumbnail: thumb, showAdAttribution: false, containsAutoReply: true, renderLargerThumbnail: false } } } catch { return {} }
}
const handler = async (m, { conn, usedPrefix }) => {
    const rcanal = await getRcanal()
    await conn.sendMessage(m.chat, {
        text:
            `> . ﹡ ﹟ 🎮 ׄ ⬭ *sɪsᴛᴇᴍᴀ ᴅᴇ ʀᴇᴄᴜʀsᴏs*\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🛠️* ㅤ֢ㅤ⸱ㅤᯭִ* — *ʜᴇʀʀᴀᴍɪᴇɴᴛᴀs*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *${usedPrefix}mine* :: Minar recursos\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *${usedPrefix}chop* :: Talar madera\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *${usedPrefix}fish* :: Pescar\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *${usedPrefix}inventory* :: Ver inventario\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🛒* ㅤ֢ㅤ⸱ㅤᯭִ* — *ᴛɪᴇɴᴅᴀ*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *${usedPrefix}shop* :: Comprar/vender herramientas\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *${usedPrefix}shop repair* :: Reparar herramientas\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *${usedPrefix}shop sell* :: Vender recursos\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *${usedPrefix}craft* :: Craftear items\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🎯* ㅤ֢ㅤ⸱ㅤᯭִ* — *ᴍɪsɪᴏɴᴇs*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *${usedPrefix}mission* :: Ver misiones\n` +
            `ׅㅤ𓏸𓈒ㅤׄ *${usedPrefix}mission claim* :: Reclamar recompensas\n` +
            `ׅㅤ𓏸𓈒ㅤׄ Diarias, semanales y mensuales\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜⚡* ㅤ֢ㅤ⸱ㅤᯭִ* — *ʙᴏɴᴜs*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ Owners globales → bono x2\n` +
            `ׅㅤ𓏸𓈒ㅤׄ Usuarios Fernando → bono x3\n\n` +
            `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🔧* ㅤ֢ㅤ⸱ㅤᯭִ* — *ɴɪᴠᴇʟᴇs ᴅᴇ ʜᴇʀʀᴀᴍɪᴇɴᴛᴀs*\n` +
            `ׅㅤ𓏸𓈒ㅤׄ 1️⃣ Básico → 2️⃣ Hierro → 3️⃣ Oro → 4️⃣ Diamante → 5️⃣ Mitril`,
        contextInfo: rcanal
    }, { quoted: m })
}
handler.help = ['resourcehelp']; handler.tags = ['main', 'rpg']; handler.command = ['resourcehelp', 'rh', 'recursoshelp']
handler.group = true; handler.reg = true
export default handler
