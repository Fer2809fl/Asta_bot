import { getUrlFromDirectPath } from "@whiskeysockets/baileys"
import _ from "lodash"
import axios from 'axios'
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

let handler = async (m, { conn, command, usedPrefix, args, text, isOwner, isROwner }) => {
    const rcanal = await getRcanal()

    global.fkontak = {
        key: { participants: "0@s.whatsapp.net", remoteJid: "status@broadcast", fromMe: false, id: "Halo" },
        message: { contactMessage: { vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` } },
        participant: "0@s.whatsapp.net"
    }

    const sendErr = async (msg) => conn.sendMessage(m.chat, {
        text: `> . ﹡ ﹟ 🔎 ׄ ⬭ *¡ᴇʀʀᴏʀ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜❌* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴇʀʀᴏʀ* :: ${msg}\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
        contextInfo: { ...rcanal }
    }, { quoted: m })

    const channelUrl = text?.match(/(?:https:\/\/)?(?:www\.)?(?:chat\.|wa\.)?whatsapp\.com\/(?:channel\/|joinchat\/)?([0-9A-Za-z]{22,24})/i)?.[1]
    let thumb = global.icono
    let pp, ch

    const isCommand1  = /^(inspect|inspeccionar)\b$/i.test(command)
    const isCommand2  = /^(seguircanal)\b$/i.test(command)
    const isCommand3  = /^(noseguircanal)\b$/i.test(command)
    const isCommand4  = /^(silenciarcanal)\b$/i.test(command)
    const isCommand5  = /^(nosilenciarcanal)\b$/i.test(command)
    const isCommand6  = /^(nuevafotochannel)\b$/i.test(command)
    const isCommand7  = /^(eliminarfotochannel)\b$/i.test(command)
    const isCommand8  = /^(avisoschannel|resiviravisos)\b$/i.test(command)
    const isCommand9  = /^(reactioneschannel|reaccioneschannel)\b$/i.test(command)
    const isCommand10 = /^(nuevonombrecanal)\b$/i.test(command)
    const isCommand11 = /^(nuevadescchannel)\b$/i.test(command)

    switch (true) {

        // ===== INSPECT =====
        case isCommand1: {
            if (!text) return sendErr('ɪɴɢʀᴇꜱᴀ ᴜɴ ᴇɴʟᴀᴄᴇ ᴅᴇ ɢʀᴜᴘᴏ ᴏ ᴄᴀɴᴀʟ')
            let info, inviteCode
            try {
                let res = await conn.groupMetadata(m.chat)
                pp = await conn.profilePictureUrl(res.id, 'image').catch(() => null)
                inviteCode = await conn.groupInviteCode(m.chat).catch(() => null)
                info = `> . ﹡ ﹟ 🔎 ׄ ⬭ *¡ɪɴꜰᴏ ɢʀᴜᴘᴏ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🔎* ㅤ֢ㅤ⸱ㅤᯭִ*
ׅㅤ𓏸𓈒ㅤׄ *ɪᴅ* :: \`${res.id}\`
ׅㅤ𓏸𓈒ㅤׄ *ɴᴏᴍʙʀᴇ* :: ${res.subject || 'N/A'}
ׅㅤ𓏸𓈒ㅤׄ *ᴄʀᴇᴀᴅᴏ ᴘᴏʀ* :: @${res.owner?.split('@')[0] || 'N/A'}
ׅㅤ𓏸𓈒ㅤׄ *ᴅᴇꜱᴄ* :: ${res.desc || 'Sin descripción'}
ׅㅤ𓏸𓈒ㅤׄ *ɪᴍᴀɢᴇɴ* :: ${pp || 'Sin imagen'}
ׅㅤ𓏸𓈒ㅤׄ *ᴄóᴅɪɢᴏ* :: ${inviteCode || 'N/A'}
ׅㅤ𓏸𓈒ㅤׄ *ᴍɪᴇᴍʙʀᴏꜱ* :: ${res.size || 'N/A'}
ׅㅤ𓏸𓈒ㅤׄ *ᴀɴᴜɴᴄɪᴏꜱ* :: ${res.announce ? '✅' : '❌'}
ׅㅤ𓏸𓈒ㅤׄ *ʀᴇꜱᴛʀɪᴄᴄɪᴏɴᴇꜱ* :: ${res.restrict ? '✅' : '❌'}
ׅㅤ𓏸𓈒ㅤׄ *ᴄᴏᴍᴜɴɪᴅᴀᴅ* :: ${res.isCommunity ? '✅' : '❌'}

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`
            } catch {
                const inviteUrl = text?.match(/(?:https:\/\/)?(?:www\.)?chat\.whatsapp\.com\/(?:invite\/)?([0-9A-Za-z]{22,24})/i)?.[1]
                if (inviteUrl) {
                    try {
                        let inviteInfo = await conn.groupGetInviteInfo(inviteUrl)
                        pp = await conn.profilePictureUrl(inviteInfo.id, 'image').catch(() => null)
                        info = `> . ﹡ ﹟ 🔎 ׄ ⬭ *¡ɪɴꜰᴏ ɢʀᴜᴘᴏ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🔎* ㅤ֢ㅤ⸱ㅤᯭִ*
ׅㅤ𓏸𓈒ㅤׄ *ɪᴅ* :: \`${inviteInfo.id}\`
ׅㅤ𓏸𓈒ㅤׄ *ɴᴏᴍʙʀᴇ* :: ${inviteInfo.subject || 'N/A'}
ׅㅤ𓏸𓈒ㅤׄ *ᴅᴇꜱᴄ* :: ${inviteInfo.desc || 'Sin descripción'}
ׅㅤ𓏸𓈒ㅤׄ *ᴍɪᴇᴍʙʀᴏꜱ* :: ${inviteInfo.size || 'N/A'}
ׅㅤ𓏸𓈒ㅤׄ *ɪᴍᴀɢᴇɴ* :: ${pp || 'Sin imagen'}
ׅㅤ𓏸𓈒ㅤׄ *ᴀɴᴜɴᴄɪᴏꜱ* :: ${inviteInfo.announce ? '✅' : '❌'}

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`
                    } catch { return sendErr('ɢʀᴜᴘᴏ ɴᴏ ᴇɴᴄᴏɴᴛʀᴀᴅᴏ') }
                } else if (channelUrl) {
                    try {
                        let newsletterInfo = await conn.newsletterMetadata("invite", channelUrl).catch(() => null)
                        if (!newsletterInfo) return sendErr('ᴄᴀɴᴀʟ ɴᴏ ᴇɴᴄᴏɴᴛʀᴀᴅᴏ')
                        pp = newsletterInfo?.preview ? getUrlFromDirectPath(newsletterInfo.preview) : thumb
                        info = `> . ﹡ ﹟ 🔎 ׄ ⬭ *¡ɪɴꜰᴏ ᴄᴀɴᴀʟ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🔎* ㅤ֢ㅤ⸱ㅤᯭִ*
ׅㅤ𓏸𓈒ㅤׄ *ɪᴅ* :: \`${newsletterInfo.id || 'N/A'}\`
ׅㅤ𓏸𓈒ㅤׄ *ɴᴏᴍʙʀᴇ* :: ${newsletterInfo.name || 'N/A'}
ׅㅤ𓏸𓈒ㅤׄ *ᴅᴇꜱᴄ* :: ${newsletterInfo.description || 'Sin descripción'}
ׅㅤ𓏸𓈒ㅤׄ *ꜱᴜꜱᴄʀɪᴛᴏʀᴇꜱ* :: ${newsletterInfo.subscribers || 'N/A'}
ׅㅤ𓏸𓈒ㅤׄ *ᴠᴇʀɪꜰɪᴄᴀᴅᴏ* :: ${newsletterInfo.verification === 'VERIFIED' ? '✅' : '❌'}
ׅㅤ𓏸𓈒ㅤׄ *ᴇꜱᴛᴀᴅᴏ* :: ${newsletterInfo.state || 'N/A'}
ׅㅤ𓏸𓈒ㅤׄ *ɪᴍᴀɢᴇɴ* :: ${pp || 'Sin imagen'}

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`
                    } catch (e) { return sendErr(e.message) }
                }
            }
            if (info) {
                await conn.sendMessage(m.chat, {
                    text: info.trim(),
                    contextInfo: {
                        mentionedJid: conn.parseMention(info),
                        externalAdReply: {
                            title: '❀ ɪɴꜱᴘᴇᴄᴛᴏʀ',
                            body: '✧ ꜱᴜᴘᴇʀ ɪɴꜱᴘᴇᴄᴛᴀᴅᴏʀ',
                            thumbnailUrl: pp || thumb,
                            sourceUrl: args[0] || global.redes,
                            mediaType: 1,
                            showAdAttribution: false,
                            renderLargerThumbnail: false
                        },
                        ...rcanal
                    }
                }, { quoted: fkontak })
            }
            break
        }

        // ===== SEGUIR CANAL =====
        case isCommand2: {
            if (!isOwner && !isROwner) return sendErr('ꜱɪɴ ᴘᴇʀᴍɪꜱᴏ')
            if (!text) return sendErr('ɪɴɢʀᴇꜱᴀ ᴇʟ ɪᴅ ᴏ ᴇɴʟᴀᴄᴇ ᴅᴇʟ ᴄᴀɴᴀʟ')
            ch = text.includes("@newsletter") ? text : await conn.newsletterMetadata("invite", channelUrl).then(d => d.id).catch(() => null)
            try {
                const chtitle = await conn.newsletterMetadata(text.includes("@newsletter") ? "jid" : "invite", ch).then(d => d.name).catch(() => 'N/A')
                await conn.newsletterFollow(ch)
                conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ 🔔 ׄ ⬭ *¡ꜱɪɢᴜɪᴇɴᴅᴏ ᴄᴀɴᴀʟ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🔔* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴄᴀɴᴀʟ* :: ${chtitle}\nׅㅤ𓏸𓈒ㅤׄ *ᴇꜱᴛᴀᴅᴏ* :: ꜱɪɢᴜɪᴇɴᴅᴏ ✅\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                    contextInfo: { ...rcanal }
                }, { quoted: m })
            } catch (e) { sendErr(e.message) }
            break
        }

        // ===== NO SEGUIR CANAL =====
        case isCommand3: {
            if (!isOwner && !isROwner) return sendErr('ꜱɪɴ ᴘᴇʀᴍɪꜱᴏ')
            if (!text) return sendErr('ɪɴɢʀᴇꜱᴀ ᴇʟ ɪᴅ ᴏ ᴇɴʟᴀᴄᴇ ᴅᴇʟ ᴄᴀɴᴀʟ')
            ch = text.includes("@newsletter") ? text : await conn.newsletterMetadata("invite", channelUrl).then(d => d.id).catch(() => null)
            try {
                const chtitle = await conn.newsletterMetadata(text.includes("@newsletter") ? "jid" : "invite", ch).then(d => d.name).catch(() => 'N/A')
                await conn.newsletterUnfollow(ch)
                conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ 🔕 ׄ ⬭ *¡ᴅᴇᴊᴀɴᴅᴏ ᴅᴇ ꜱᴇɢᴜɪʀ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🔕* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴄᴀɴᴀʟ* :: ${chtitle}\nׅㅤ𓏸𓈒ㅤׄ *ᴇꜱᴛᴀᴅᴏ* :: ᴅᴇᴊᴀᴅᴏ ᴅᴇ ꜱᴇɢᴜɪʀ ✅\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                    contextInfo: { ...rcanal }
                }, { quoted: m })
            } catch (e) { sendErr(e.message) }
            break
        }

        // ===== SILENCIAR CANAL =====
        case isCommand4: {
            if (!isOwner && !isROwner) return sendErr('ꜱɪɴ ᴘᴇʀᴍɪꜱᴏ')
            if (!text) return sendErr('ɪɴɢʀᴇꜱᴀ ᴇʟ ɪᴅ ᴏ ᴇɴʟᴀᴄᴇ ᴅᴇʟ ᴄᴀɴᴀʟ')
            ch = text.includes("@newsletter") ? text : await conn.newsletterMetadata("invite", channelUrl).then(d => d.id).catch(() => null)
            try {
                const chtitle = await conn.newsletterMetadata(text.includes("@newsletter") ? "jid" : "invite", ch).then(d => d.name).catch(() => 'N/A')
                await conn.newsletterMute(ch)
                conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ 🔇 ׄ ⬭ *¡ᴄᴀɴᴀʟ ꜱɪʟᴇɴᴄɪᴀᴅᴏ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🔇* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴄᴀɴᴀʟ* :: ${chtitle}\nׅㅤ𓏸𓈒ㅤׄ *ᴇꜱᴛᴀᴅᴏ* :: ꜱɪʟᴇɴᴄɪᴀᴅᴏ ✅\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                    contextInfo: { ...rcanal }
                }, { quoted: m })
            } catch (e) { sendErr(e.message) }
            break
        }

        // ===== NO SILENCIAR CANAL =====
        case isCommand5: {
            if (!isOwner && !isROwner) return sendErr('ꜱɪɴ ᴘᴇʀᴍɪꜱᴏ')
            if (!text) return sendErr('ɪɴɢʀᴇꜱᴀ ᴇʟ ɪᴅ ᴏ ᴇɴʟᴀᴄᴇ ᴅᴇʟ ᴄᴀɴᴀʟ')
            ch = text.includes("@newsletter") ? text : await conn.newsletterMetadata("invite", channelUrl).then(d => d.id).catch(() => null)
            try {
                const chtitle = await conn.newsletterMetadata(text.includes("@newsletter") ? "jid" : "invite", ch).then(d => d.name).catch(() => 'N/A')
                await conn.newsletterUnmute(ch)
                conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ 🔔 ׄ ⬭ *¡ᴄᴀɴᴀʟ ᴀᴄᴛɪᴠᴀᴅᴏ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🔔* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴄᴀɴᴀʟ* :: ${chtitle}\nׅㅤ𓏸𓈒ㅤׄ *ᴇꜱᴛᴀᴅᴏ* :: ɴᴏᴛɪꜰɪᴄᴀᴄɪᴏɴᴇꜱ ᴀᴄᴛɪᴠᴀᴅᴀꜱ ✅\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                    contextInfo: { ...rcanal }
                }, { quoted: m })
            } catch (e) { sendErr(e.message) }
            break
        }

        // ===== NUEVA FOTO CHANNEL =====
        case isCommand6: {
            if (!isOwner && !isROwner) return sendErr('ꜱɪɴ ᴘᴇʀᴍɪꜱᴏ')
            if (!text) return sendErr('ɪɴɢʀᴇꜱᴀ ᴇʟ ɪᴅ ᴅᴇʟ ᴄᴀɴᴀʟ ʏ ʀᴇꜱᴘᴏɴᴅᴇ ᴀ ᴜɴᴀ ɪᴍᴀɢᴇɴ')
            const regex6 = /(\b\w+@newsletter\b)(?:.*?(https?:\/\/[^\s]+?\.(?:jpe?g|png)))?/i
            const match6 = text.match(regex6)
            let media6
            if (m.quoted) {
                const q6 = m.quoted
                const mime6 = (q6.msg || q6).mimetype || ''
                if (/image/g.test(mime6) && !/webp/g.test(mime6)) {
                    media6 = await q6.download()
                } else return sendErr('ʀᴇꜱᴘᴏɴᴅᴇ ᴀ ᴜɴᴀ ɪᴍᴀɢᴇɴ jpg/png')
            } else if (match6?.[2]) {
                try {
                    const imgRes = await axios.get(match6[2], { responseType: 'arraybuffer' })
                    media6 = Buffer.from(imgRes.data, 'binary')
                } catch { return sendErr('ᴇʀʀᴏʀ ᴀʟ ᴅᴇꜱᴄᴀʀɢᴀʀ ʟᴀ ɪᴍᴀɢᴇɴ') }
            } else return sendErr('ᴀɢʀᴇɢᴀ ᴜʀʟ jpg/png ᴅᴇꜱᴘᴜéꜱ ᴅᴇʟ ɪᴅ')
            ch = match6?.[1] || (await conn.newsletterMetadata("invite", channelUrl).then(d => d.id).catch(() => null))
            try {
                const chtitle = await conn.newsletterMetadata("jid", ch).then(d => d.name).catch(() => 'N/A')
                await conn.newsletterUpdatePicture(ch, media6)
                conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ 🖼️ ׄ ⬭ *¡ɪᴍᴀɢᴇɴ ᴀᴄᴛᴜᴀʟɪᴢᴀᴅᴀ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🖼️* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴄᴀɴᴀʟ* :: ${chtitle}\nׅㅤ𓏸𓈒ㅤׄ *ᴇꜱᴛᴀᴅᴏ* :: ɪᴍᴀɢᴇɴ ᴀᴄᴛᴜᴀʟɪᴢᴀᴅᴀ ✅\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                    contextInfo: { ...rcanal }
                }, { quoted: m })
            } catch (e) { sendErr(e.message) }
            break
        }

        // ===== ELIMINAR FOTO CHANNEL =====
        case isCommand7: {
            if (!isOwner && !isROwner) return sendErr('ꜱɪɴ ᴘᴇʀᴍɪꜱᴏ')
            if (!text) return sendErr('ɪɴɢʀᴇꜱᴀ ᴇʟ ɪᴅ ᴏ ᴇɴʟᴀᴄᴇ ᴅᴇʟ ᴄᴀɴᴀʟ')
            ch = text.includes("@newsletter") ? text : await conn.newsletterMetadata("invite", channelUrl).then(d => d.id).catch(() => null)
            try {
                const chtitle = await conn.newsletterMetadata("jid", ch).then(d => d.name).catch(() => 'N/A')
                await conn.newsletterRemovePicture(ch)
                conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ 🗑️ ׄ ⬭ *¡ɪᴍᴀɢᴇɴ ᴇʟɪᴍɪɴᴀᴅᴀ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🗑️* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴄᴀɴᴀʟ* :: ${chtitle}\nׅㅤ𓏸𓈒ㅤׄ *ᴇꜱᴛᴀᴅᴏ* :: ɪᴍᴀɢᴇɴ ᴇʟɪᴍɪɴᴀᴅᴀ ✅\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                    contextInfo: { ...rcanal }
                }, { quoted: m })
            } catch (e) { sendErr(e.message) }
            break
        }

        // ===== AVISOS CHANNEL =====
        case isCommand8: {
            if (!isOwner && !isROwner) return sendErr('ꜱɪɴ ᴘᴇʀᴍɪꜱᴏ')
            if (!text) return sendErr('ɪɴɢʀᴇꜱᴀ ᴇʟ ɪᴅ ᴏ ᴇɴʟᴀᴄᴇ ᴅᴇʟ ᴄᴀɴᴀʟ')
            ch = text.includes("@newsletter") ? text : await conn.newsletterMetadata("invite", channelUrl).then(d => d.id).catch(() => null)
            try {
                const chtitle = await conn.newsletterMetadata("jid", ch).then(d => d.name).catch(() => 'N/A')
                await conn.subscribeNewsletterUpdates(ch)
                conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ 📢 ׄ ⬭ *¡ᴀᴠɪꜱᴏꜱ ᴀᴄᴛɪᴠᴀᴅᴏꜱ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜📢* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴄᴀɴᴀʟ* :: ${chtitle}\nׅㅤ𓏸𓈒ㅤׄ *ᴇꜱᴛᴀᴅᴏ* :: ʀᴇᴄɪʙɪᴇɴᴅᴏ ᴀᴠɪꜱᴏꜱ ✅\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                    contextInfo: { ...rcanal }
                }, { quoted: m })
            } catch (e) { sendErr(e.message) }
            break
        }

        // ===== REACCIONES CHANNEL =====
        case isCommand9: {
            if (!isOwner && !isROwner) return sendErr('ꜱɪɴ ᴘᴇʀᴍɪꜱᴏ')
            if (!text) return conn.sendMessage(m.chat, {
                text: `> . ﹡ ﹟ 😃 ׄ ⬭ *¡ʀᴇᴀᴄᴄɪᴏɴᴇꜱ ᴄʜᴀɴɴᴇʟ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜😃* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴜsᴏ* :: \`#reaccioneschannel id modo\`\nׅㅤ𓏸𓈒ㅤׄ *1* :: ᴛᴏᴅᴏꜱ ʟᴏꜱ ᴇᴍᴏᴊɪꜱ\nׅㅤ𓏸𓈒ㅤׄ *2* :: ᴇᴍᴏᴊɪꜱ ʙáꜱɪᴄᴏꜱ\nׅㅤ𓏸𓈒ㅤׄ *3* :: ꜱɪɴ ʀᴇᴀᴄᴄɪᴏɴᴇꜱ\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                contextInfo: { ...rcanal }
            }, { quoted: m })
            const parts9 = text.split(' ')
            const modeNum = parseInt(parts9.pop())
            ch = parts9.join(' ').trim()
            let mode9
            if (modeNum === 1) mode9 = 'ALL'
            else if (modeNum === 2) mode9 = 'BASIC'
            else if (modeNum === 3) mode9 = 'NONE'
            else return sendErr('ᴍᴏᴅᴏ ɪɴᴠáʟɪᴅᴏ (1, 2 ᴏ 3)')
            if (!ch.includes("@newsletter")) ch = await conn.newsletterMetadata("invite", ch).then(d => d.id).catch(() => null)
            try {
                const chtitle = await conn.newsletterMetadata("jid", ch).then(d => d.name).catch(() => 'N/A')
                await conn.newsletterReactionMode(ch, mode9)
                conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ 😃 ׄ ⬭ *¡ʀᴇᴀᴄᴄɪᴏɴᴇꜱ ᴀᴄᴛᴜᴀʟɪᴢᴀᴅᴀꜱ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜😃* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴄᴀɴᴀʟ* :: ${chtitle}\nׅㅤ𓏸𓈒ㅤׄ *ᴍᴏᴅᴏ* :: ${mode9} ✅\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                    contextInfo: { ...rcanal }
                }, { quoted: m })
            } catch (e) { sendErr(e.message) }
            break
        }

        // ===== NUEVO NOMBRE CANAL =====
        case isCommand10: {
            if (!isOwner && !isROwner) return sendErr('ꜱɪɴ ᴘᴇʀᴍɪꜱᴏ')
            if (!text) return sendErr('ᴜsᴏ: #nuevonombrecanal id NuevoNombre')
            const [id10, ...nameParts10] = text.split(' ')
            const name10 = nameParts10.join(' ').trim()
            if (!name10) return sendErr('ɪɴɢʀᴇꜱᴀ ᴇʟ ɴᴜᴇᴠᴏ ɴᴏᴍʙʀᴇ')
            if (name10.length > 99) return sendErr('ᴍáx. 99 ᴄᴀʀᴀᴄᴛᴇʀᴇꜱ')
            ch = id10.trim().includes("@newsletter") ? id10.trim() : await conn.newsletterMetadata("invite", channelUrl).then(d => d.id).catch(() => null)
            try {
                const oldName = await conn.newsletterMetadata("jid", ch).then(d => d.name).catch(() => 'N/A')
                await conn.newsletterUpdateName(ch, name10)
                conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ ✏️ ׄ ⬭ *¡ɴᴏᴍʙʀᴇ ᴄᴀᴍʙɪᴀᴅᴏ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜✏️* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴀɴᴛᴇʀɪᴏʀ* :: ${oldName}\nׅㅤ𓏸𓈒ㅤׄ *ɴᴜᴇᴠᴏ* :: ${name10}\nׅㅤ𓏸𓈒ㅤׄ *ᴇꜱᴛᴀᴅᴏ* :: ᴀᴄᴛᴜᴀʟɪᴢᴀᴅᴏ ✅\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                    contextInfo: { ...rcanal }
                }, { quoted: m })
            } catch (e) { sendErr(e.message) }
            break
        }

        // ===== NUEVA DESC CHANNEL =====
        case isCommand11: {
            if (!isOwner && !isROwner) return sendErr('ꜱɪɴ ᴘᴇʀᴍɪꜱᴏ')
            if (!text) return sendErr('ᴜsᴏ: #nuevadescchannel id descripción')
            const [id11, ...descParts11] = text.split(' ')
            const desc11 = descParts11.join(' ').trim()
            if (!desc11) return sendErr('ɪɴɢʀᴇꜱᴀ ʟᴀ ɴᴜᴇᴠᴀ ᴅᴇꜱᴄʀɪᴘᴄɪᴏ́ɴ')
            ch = id11.trim().includes("@newsletter") ? id11.trim() : await conn.newsletterMetadata("invite", channelUrl).then(d => d.id).catch(() => null)
            try {
                const chtitle11 = await conn.newsletterMetadata("jid", ch).then(d => d.name).catch(() => 'N/A')
                await conn.newsletterUpdateDescription(ch, desc11)
                conn.sendMessage(m.chat, {
                    text: `> . ﹡ ﹟ 📝 ׄ ⬭ *¡ᴅᴇꜱᴄ ᴀᴄᴛᴜᴀʟɪᴢᴀᴅᴀ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜📝* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴄᴀɴᴀʟ* :: ${chtitle11}\nׅㅤ𓏸𓈒ㅤׄ *ᴅᴇꜱᴄ* :: ${desc11}\nׅㅤ𓏸𓈒ㅤׄ *ᴇꜱᴛᴀᴅᴏ* :: ᴀᴄᴛᴜᴀʟɪᴢᴀᴅᴀ ✅\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                    contextInfo: { ...rcanal }
                }, { quoted: m })
            } catch (e) { sendErr(e.message) }
            break
        }
    }
}

handler.tags = ['tools']
handler.help = ['nuevafotochannel','nosilenciarcanal','silenciarcanal','noseguircanal','seguircanal','avisoschannel','resiviravisos','inspect','inspeccionar','eliminarfotochannel','reactioneschannel','reaccioneschannel','nuevonombrecanal','nuevadescchannel']
handler.command = handler.help
handler.reg = true

export default handler
