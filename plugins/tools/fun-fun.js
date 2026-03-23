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
                renderLargerThumbnail: true
            }
        }
    } catch { return {} }
}

let pickRandom = list => list[Math.floor(Math.random() * list.length)]
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
let toM = a => '@' + a.split('@')[0]

const handler = async (m, { groupMetadata, command, conn, text, usedPrefix, args }) => {
    const rcanal = await getRcanal()

    if (!global.db.data.chats[m.chat].gacha && m.isGroup) return conn.sendMessage(m.chat, {
        text: `> . ﹡ ﹟ 🎮 ׄ ⬭ *¡ᴄᴏᴍᴀɴᴅᴏꜱ ᴅᴇꜱᴀᴄᴛɪᴠᴀᴅᴏꜱ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❌* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴇꜱᴛᴀᴅᴏ* :: ᴄᴏᴍᴀɴᴅᴏꜱ *Gacha* ᴅᴇꜱᴀᴄᴛɪᴠᴀᴅᴏꜱ
ׅㅤ𓏸𓈒ㅤׄ *ᴀᴄᴛɪᴠᴀʀ* :: \`${usedPrefix}gacha on\` (ꜱᴏʟᴏ ᴀᴅᴍɪɴ)

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
        contextInfo: { ...rcanal }
    }, { quoted: m })

    try {
        let ps = groupMetadata.participants.map(v => v.id)

        // ===== TOP =====
        if (command === 'top') {
            let cantidad = 10
            let texto = text
            if (!isNaN(parseInt(args[0]))) {
                cantidad = Math.min(Math.max(parseInt(args[0]), 1), 10)
                texto = args.slice(1).join(' ')
            }
            if (!texto) return conn.sendMessage(m.chat, {
                text: `> . ﹡ ﹟ 🏆 ׄ ⬭ *¡ᴛᴏᴘ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🏆* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴏ* :: \`#top (cantidad) (texto)\`
ׅㅤ𓏸𓈒ㅤׄ *ᴇᴊᴇᴍᴘʟᴏ* :: \`#top 5 los más random\`

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
                contextInfo: { ...rcanal }
            }, { quoted: m })
            if (ps.length < cantidad) return conn.sendMessage(m.chat, {
                text: `> . ﹡ ﹟ 🏆 ׄ ⬭ *¡ᴇʀʀᴏʀ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❌* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴇʀʀᴏʀ* :: ᴍɪᴇᴍʙʀᴏꜱ ɪɴꜱᴜꜰɪᴄɪᴇɴᴛᴇꜱ ᴘᴀʀᴀ ᴜɴ ᴛᴏᴘ ${cantidad}\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                contextInfo: { ...rcanal }
            }, { quoted: m })

            let seleccionados = []
            while (seleccionados.length < cantidad) {
                let c = ps[Math.floor(Math.random() * ps.length)]
                if (!seleccionados.includes(c)) seleccionados.push(c)
            }
            let x = pickRandom(['🤓','😅','😂','😳','😎','🥵','😱','🤑','🙄','💩','🍑','🤨','🥴','🔥','👇🏻','😔','👀','🌚'])
            let top = `> . ﹡ ﹟ 🏆 ׄ ⬭ *¡ᴛᴏᴘ ${cantidad}!*\n\n`
            top += `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜${x}* ㅤ֢ㅤ⸱ㅤᯭִ*\n`
            top += `ׅㅤ𓏸𓈒ㅤׄ *ᴛᴏᴘ ᴛᴇᴍᴀ* :: ${texto}\n\n`
            seleccionados.forEach((u, i) => {
                top += `ׅㅤ𓏸𓈒ㅤׄ *${i + 1}.* ${toM(u)}\n`
            })
            top += `\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`
            return conn.sendMessage(m.chat, {
                text: top.trim(),
                contextInfo: { mentionedJid: seleccionados, ...rcanal }
            }, { quoted: m })
        }

        // ===== SORTEO =====
        if (command === 'sorteo') {
            if (!text) return conn.sendMessage(m.chat, {
                text: `> . ﹡ ﹟ 🎁 ׄ ⬭ *¡ꜱᴏʀᴛᴇᴏ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🎁* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴜsᴏ* :: \`#sorteo (cantidad) (premio)\`\nׅㅤ𓏸𓈒ㅤׄ *ᴇᴊᴇᴍᴘʟᴏ* :: \`#sorteo 3 nitro\`\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                contextInfo: { ...rcanal }
            }, { quoted: m })
            let cantidad = 1
            let premio = text
            if (!isNaN(parseInt(args[0]))) {
                cantidad = Math.min(Math.max(parseInt(args[0]), 1), 10)
                premio = args.slice(1).join(' ')
            }
            if (!premio) return conn.sendMessage(m.chat, { text: `❀ Ingresa el premio del sorteo.`, contextInfo: { ...rcanal } }, { quoted: m })
            if (ps.length < cantidad) return conn.sendMessage(m.chat, { text: `ꕥ No hay suficientes miembros.`, contextInfo: { ...rcanal } }, { quoted: m })

            let seleccionados = []
            while (seleccionados.length < cantidad) {
                let c = ps[Math.floor(Math.random() * ps.length)]
                if (!seleccionados.includes(c)) seleccionados.push(c)
            }
            let msg = `> . ﹡ ﹟ 🎁 ׄ ⬭ *¡ꜰᴇʟɪᴄɪᴅᴀᴅᴇꜱ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🎁* ㅤ֢ㅤ⸱ㅤᯭִ*\n\n`
            if (cantidad === 1) {
                msg += `ׅㅤ𓏸𓈒ㅤׄ *ɢᴀɴᴀᴅᴏʀ* :: ${toM(seleccionados[0])}\n`
            } else {
                seleccionados.forEach((u, i) => msg += `ׅㅤ𓏸𓈒ㅤׄ *${i + 1}.* ${toM(u)}\n`)
            }
            msg += `ׅㅤ𓏸𓈒ㅤׄ *ᴘʀᴇᴍɪᴏ* :: ${premio}\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`
            return conn.sendMessage(m.chat, {
                text: msg.trim(),
                contextInfo: { mentionedJid: seleccionados, ...rcanal }
            }, { quoted: m })
        }

        // ===== SHIP =====
        if (command === 'ship' || command === 'shippear') {
            if (!text) return conn.sendMessage(m.chat, {
                text: `> . ﹡ ﹟ 💘 ׄ ⬭ *¡ꜱʜɪᴘ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜💘* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴜsᴏ* :: \`#ship nombre1 nombre2\`\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                contextInfo: { ...rcanal }
            }, { quoted: m })
            let [text1, ...text2arr] = text.split(' ')
            let text2 = text2arr.join(' ')
            if (!text2) return conn.sendMessage(m.chat, { text: `ꕥ Escribe el nombre de la segunda persona.`, contextInfo: { ...rcanal } }, { quoted: m })
            let pct = Math.floor(Math.random() * 100)
            let emoji = pct > 70 ? '💞' : pct > 40 ? '💕' : '💔'
            return conn.sendMessage(m.chat, {
                text: `> . ﹡ ﹟ 💘 ׄ ⬭ *¡ꜱʜɪᴘ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜💘* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴘᴀʀᴇᴊᴀ* :: *${text1}* ❤️ *${text2}*\nׅㅤ𓏸𓈒ㅤׄ *ᴄᴏᴍᴘᴀᴛɪʙɪʟɪᴅᴀᴅ* :: *${pct}%* ${emoji}\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                contextInfo: { ...rcanal }
            }, { quoted: m })
        }

        // ===== AFK =====
        if (command === 'afk') {
            const userAfk = global.db.data.users[m.sender]
            userAfk.afk = Date.now()
            userAfk.afkReason = text
            return conn.sendMessage(m.chat, {
                text: `> . ﹡ ﹟ 💤 ׄ ⬭ *¡ᴍᴏᴅᴏ ᴀꜰᴋ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜💤* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴜꜱᴜᴀʀɪᴏ* :: ${await conn.getName(m.sender)}\nׅㅤ𓏸𓈒ㅤׄ *ᴇꜱᴛᴀᴅᴏ* :: ᴀᴜꜱᴇɴᴛᴇ 💤\nׅㅤ𓏸𓈒ㅤׄ *ᴍᴏᴛɪᴠᴏ* :: ${text || 'ꜱɪɴ ᴇꜱᴘᴇᴄɪꜰɪᴄᴀʀ'}\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                contextInfo: { ...rcanal }
            }, { quoted: m })
        }

        // ===== PERSONALIDAD =====
        if (command === 'personalidad') {
            let mentionedJid = await m.mentionedJid
            let userId = mentionedJid?.[0] || (m.quoted && await m.quoted.sender) || conn.parseMention(text)?.[0] || text || null
            let nombre = !userId?.includes('@s.whatsapp.net') ? userId : global.db.data.users[userId]?.name || await conn.getName(userId).catch(() => userId.split('@')[0])
            if (!userId) return conn.sendMessage(m.chat, {
                text: `> . ﹡ ﹟ 🧠 ׄ ⬭ *¡ᴘᴇʀꜱᴏɴᴀʟɪᴅᴀᴅ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🧠* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴜsᴏ* :: \`#personalidad @usuario\`\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                contextInfo: { ...rcanal }
            }, { quoted: m })
            let rnd = () => pickRandom(['6%','12%','20%','27%','35%','41%','49%','54%','60%','66%','73%','78%','84%','92%','96%','99%','1%','0%'])
            let userName = userId?.includes('@s.whatsapp.net') ? `*${nombre}*` : `*${userId}*`
            let personalidad = `> . ﹡ ﹟ 🧠 ׄ ⬭ *¡ᴘᴇʀꜱᴏɴᴀʟɪᴅᴀᴅ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🧠* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ɴᴏᴍʙʀᴇ* :: ${userName}\nׅㅤ𓏸𓈒ㅤׄ *ʙᴜᴇɴᴀ ᴍᴏʀᴀʟ* :: ${rnd()}\nׅㅤ𓏸𓈒ㅤׄ *ᴍᴀʟᴀ ᴍᴏʀᴀʟ* :: ${rnd()}\nׅㅤ𓏸𓈒ㅤׄ *ᴛɪᴘᴏ* :: ${pickRandom(['De buen corazón','Arrogante','Tacaño','Generoso','Humilde','Tímido','Cobarde','Entrometido','Pendejo'])}\nׅㅤ𓏸𓈒ㅤׄ *ꜱɪᴇᴍᴘʀᴇ* :: ${pickRandom(['Pesado','De malas','Distraido','Chismoso','Viendo anime','En el celular','Acostado'])}\nׅㅤ𓏸𓈒ㅤׄ *ɪɴᴛᴇʟɪɢᴇɴᴄɪᴀ* :: ${rnd()}\nׅㅤ𓏸𓈒ㅤׄ *ᴄᴏʀᴀᴊᴇ* :: ${rnd()}\nׅㅤ𓏸𓈒ㅤׄ *ꜰᴀᴍᴀ* :: ${rnd()}\nׅㅤ𓏸𓈒ㅤׄ *ɢéɴᴇʀᴏ* :: ${pickRandom(['Hombre','Mujer','Homosexual','Bisexual','Heterosexual','Macho alfa'])}\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`
            return conn.sendMessage(m.chat, {
                text: personalidad,
                contextInfo: { ...rcanal }
            }, { quoted: m })
        }

        // ===== FORMARPAREJA =====
        if (command === 'formarpareja') {
            const frases = ["Esta pareja está destinada a estar junta 💙","Dos pequeños tortolitos enamorados ✨","Su química es de otro planeta 🌌","Amor que nació en los stickers 💬💞","Su conexión es más fuerte que el WiFi 📶💘"]
            let cantidad = Math.min(Math.max(parseInt(args[0]) || 1, 1), 10)
            if (ps.length < cantidad * 2) return conn.sendMessage(m.chat, { text: `ꕥ No hay miembros suficientes.`, contextInfo: { ...rcanal } }, { quoted: m })
            let usados = new Set(), parejas = [], menciones = []
            for (let i = 0; i < cantidad; i++) {
                let a, b
                do a = ps[Math.floor(Math.random() * ps.length)]
                while (usados.has(a))
                usados.add(a)
                do b = ps[Math.floor(Math.random() * ps.length)]
                while (b === a || usados.has(b))
                usados.add(b)
                parejas.push({ a, b })
                menciones.push(a, b)
            }
            let texto = `> . ﹡ ﹟ 💑 ׄ ⬭ *¡ᴘᴀʀᴇᴊᴀꜱ ᴅᴇʟ ɢʀᴜᴘᴏ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜💑* ㅤ֢ㅤ⸱ㅤᯭִ*\n\n`
            parejas.forEach((p, i) => {
                texto += `ׅㅤ𓏸𓈒ㅤׄ *${i + 1}.* ${toM(p.a)} ❤️ ${toM(p.b)}\n_${frases[i % frases.length]}_\n\n`
            })
            texto += `> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`
            return conn.sendMessage(m.chat, {
                text: texto.trim(),
                contextInfo: { mentionedJid: menciones, ...rcanal }
            }, { quoted: m })
        }

        // ===== CALCULADORAS (gay, lesbiana, etc.) =====
        if (['gay','lesbiana','pajero','pajera','puto','puta','manco','manca','rata','prostituto','prostituta'].includes(command)) {
            const mentionedJid = await m.mentionedJid
            const usser = mentionedJid?.[0] || (m.quoted && await m.quoted.sender) || conn.parseMention(text)?.[0] || text || null
            if (!usser) return conn.sendMessage(m.chat, {
                text: `> . ﹡ ﹟ 🧮 ׄ ⬭ *¡ᴄᴀʟᴄᴜʟᴀᴅᴏʀᴀ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🧮* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴜsᴏ* :: \`#${command} @usuario\`\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                contextInfo: { ...rcanal }
            }, { quoted: m })

            const percentages = Math.floor(Math.random() * 500)
            const userId = usser?.includes('@s.whatsapp.net') ? `@${usser.split('@')[0]}` : `*${usser}*`
            const hawemod = ["《 █▒▒▒▒▒▒▒▒▒▒▒》10%","《 ████▒▒▒▒▒▒▒▒》30%","《 ███████▒▒▒▒▒》50%","《 ██████████▒▒》80%","《 ████████████》100%"]

            let { key } = await conn.sendMessage(m.chat, {
                text: `> . ﹡ ﹟ 🧮 ׄ ⬭ *¡ᴄᴀʟᴄᴜʟᴀɴᴅᴏ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🧮* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴘʀᴏᴄᴇꜱᴀɴᴅᴏ* :: ᴘᴏʀ ꜰᴀᴠᴏʀ ᴇꜱᴘᴇʀᴀ...`,
                contextInfo: { ...rcanal }
            }, { quoted: m })

            for (let i = 0; i < hawemod.length; i++) {
                await delay(1000)
                await conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ 🧮 ׄ ⬭ *¡ᴄᴀʟᴄᴜʟᴀɴᴅᴏ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🧮* ㅤ֢ㅤ⸱ㅤᯭִ*\n\n${hawemod[i]}`,
                    edit: key,
                    contextInfo: { ...rcanal }
                })
            }

            let cal = `> . ﹡ ﹟ 🧮 ׄ ⬭ *¡ʀᴇꜱᴜʟᴛᴀᴅᴏ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🧮* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴜꜱᴜᴀʀɪᴏ* :: ${userId}\nׅㅤ𓏸𓈒ㅤׄ *ᴄᴀᴛᴇɢᴏʀíᴀ* :: ${command}\nׅㅤ𓏸𓈒ㅤׄ *ᴘᴏʀᴄᴇɴᴛᴀᴊᴇ* :: *${percentages}%* 📊\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`
            return conn.sendMessage(m.chat, {
                text: cal,
                edit: key,
                contextInfo: { mentionedJid: conn.parseMention(cal), ...rcanal }
            })
        }

        // ===== DOXEAR =====
        if (['doxear','doxxeo','doxeo'].includes(command)) {
            let mentionedJid = await m.mentionedJid
            let userId = mentionedJid?.length ? mentionedJid[0] : m.quoted ? await m.quoted.sender : null
            if (!userId) return conn.sendMessage(m.chat, {
                text: `> . ﹡ ﹟ 💻 ׄ ⬭ *¡ᴅᴏxᴇᴏ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜💻* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴜsᴏ* :: \`#doxear @usuario\`\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                contextInfo: { ...rcanal }
            }, { quoted: m })

            let userName = await conn.getName(userId).catch(() => userId.split('@')[0])
            const steps = ['*10%*','*30%*','*50%*','*80%*','*100%*']
            const { key } = await conn.sendMessage(m.chat, {
                text: `> . ﹡ ﹟ 💻 ׄ ⬭ *¡ɪɴɪᴄɪᴀɴᴅᴏ ᴅᴏxᴇᴏ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜💻* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴇꜱᴛᴀᴅᴏ* :: ᴘʀᴏᴄᴇꜱᴀɴᴅᴏ...`,
                contextInfo: { ...rcanal }
            }, { quoted: m })

            for (let s of steps) {
                await delay(1000)
                await conn.sendMessage(m.chat, { text: s, edit: key })
            }

            let doxeo = `> . ﹡ ﹟ 💻 ׄ ⬭ *¡ᴅᴏxᴇᴏ ᴄᴏᴍᴘʟᴇᴛᴏ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜💻* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ɴᴏᴍʙʀᴇ* :: ${userName}\nׅㅤ𓏸𓈒ㅤׄ *Iᴘ* :: 92.28.211.234\nׅㅤ𓏸𓈒ㅤׄ *Iᴘᴠ6* :: fe80::5dcd::ef69::fb22::d988\nׅㅤ𓏸𓈒ㅤׄ *ᴍᴀᴄ* :: 5A:78:3E:7E:00\nׅㅤ𓏸𓈒ㅤׄ *ɪꜱᴘ* :: Ucom Universal\nׅㅤ𓏸𓈒ㅤׄ *ᴅɴꜱ* :: 8.8.8.8\nׅㅤ𓏸𓈒ㅤׄ *ɢᴀᴛᴇᴡᴀʏ* :: 192.168.0.1\nׅㅤ𓏸𓈒ㅤׄ *ᴡᴀɴ* :: 100.23.10.15\nׅㅤ𓏸𓈒ㅤׄ *ᴄᴏɴɴᴇᴄᴛɪᴏɴ* :: TPLINK COMPANY\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`
            return conn.sendMessage(m.chat, {
                text: doxeo,
                edit: key,
                contextInfo: { mentionedJid: conn.parseMention(doxeo), ...rcanal }
            }, { quoted: m })
        }

    } catch (error) {
        await m.react('✖️')
        conn.sendMessage(m.chat, {
            text: `> . ﹡ ﹟ ❌ ׄ ⬭ *¡ᴇʀʀᴏʀ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❌* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴇʀʀᴏʀ* :: ${error.message}\nׅㅤ𓏸𓈒ㅤׄ *ʀᴇᴘᴏʀᴛ* :: \`${usedPrefix}report\`\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
            contextInfo: { ...rcanal }
        }, { quoted: m })
    }
}

handler.help = ['top','sorteo','ship','shippear','afk','personalidad','formarpareja','gay','lesbiana','pajero','pajera','puto','puta','manco','manca','rata','prostituto','prostituta','doxear','doxeo','doxxeo']
handler.tags = ['fun']
handler.command = handler.help
handler.group = true
handler.reg = true

export default handler
