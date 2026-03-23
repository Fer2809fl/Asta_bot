import moment from 'moment-timezone'
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

const handler = async (m, { conn, command, usedPrefix, text }) => {
    const rcanal = await getRcanal()
    try {
        const user = global.db.data.users[m.sender]

        if (command === 'setprofile') {
            return conn.sendMessage(m.chat, {
                text:
                    `> . ﹡ ﹟ 👤 ׄ ⬭ *sᴇᴛᴘʀᴏғɪʟᴇ*\n\n` +
                    `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜⚙️* ㅤ֢ㅤ⸱ㅤᯭִ* — *ᴄᴀᴛᴇɢᴏʀɪ́ᴀs*\n` +
                    `ׅㅤ𓏸𓈒ㅤׄ *${usedPrefix}setbirth* 01/01/2000\n` +
                    `ׅㅤ𓏸𓈒ㅤׄ *${usedPrefix}delbirth*\n` +
                    `ׅㅤ𓏸𓈒ㅤׄ *${usedPrefix}setgenre* hombre/mujer\n` +
                    `ׅㅤ𓏸𓈒ㅤׄ *${usedPrefix}delgenre*\n` +
                    `ׅㅤ𓏸𓈒ㅤׄ *${usedPrefix}setdesc* texto\n` +
                    `ׅㅤ𓏸𓈒ㅤׄ *${usedPrefix}deldesc*`,
                contextInfo: rcanal
            }, { quoted: m })
        }

        switch (command) {
            case 'setbirth': {
                if (!text) return conn.sendMessage(m.chat, {
                    text:
                        `> . ﹡ ﹟ 🎂 ׄ ⬭ *sᴇᴛʙɪʀᴛʜ*\n\n` +
                        `ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴏ* :: ${usedPrefix + command} 01/01/2000\n` +
                        `ׅㅤ𓏸𓈒ㅤׄ *ғᴏʀᴍᴀᴛᴏ* :: día/mes/año`,
                    contextInfo: rcanal
                }, { quoted: m })

                const regex = /^\d{1,2}\/\d{1,2}\/\d{4}$/
                if (!regex.test(text)) return conn.sendMessage(m.chat, {
                    text:
                        `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴇʀʀᴏʀ*\n\n` +
                        `ׅㅤ𓏸𓈒ㅤׄ Formato inválido.\n` +
                        `ׅㅤ𓏸𓈒ㅤׄ *Ejemplo* :: ${usedPrefix + command} 01/12/2000`,
                    contextInfo: rcanal
                }, { quoted: m })

                const [dia, mes, año] = text.split('/').map(n => parseInt(n))
                const fecha = moment.tz({ day: dia, month: mes - 1, year: año }, 'America/Caracas')
                if (!fecha.isValid()) return conn.sendMessage(m.chat, {
                    text:
                        `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴇʀʀᴏʀ*\n\nׅㅤ𓏸𓈒ㅤׄ La fecha no es válida.`,
                    contextInfo: rcanal
                }, { quoted: m })

                const edad = moment.tz('America/Caracas').diff(fecha, 'years')
                if (edad < 5 || edad > 120) return conn.sendMessage(m.chat, {
                    text:
                        `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴇʀʀᴏʀ*\n\nׅㅤ𓏸𓈒ㅤׄ La fecha no tiene lógica (edad: ${edad}).`,
                    contextInfo: rcanal
                }, { quoted: m })

                const meses = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"]
                user.birth = `${dia} de ${meses[mes - 1]} de ${año}`
                return conn.sendMessage(m.chat, {
                    text:
                        `> . ﹡ ﹟ 🎂 ׄ ⬭ *ᴄᴜᴍᴘʟᴇᴀɴ̃ᴏs ᴀᴄᴛᴜᴀʟɪᴢᴀᴅᴏ*\n\n` +
                        `ׅㅤ𓏸𓈒ㅤׄ *ғᴇᴄʜᴀ* :: ${user.birth}`,
                    contextInfo: rcanal
                }, { quoted: m })
            }

            case 'delbirth': {
                if (!user.birth) return conn.sendMessage(m.chat, {
                    text:
                        `> . ﹡ ﹟ ⚠️ ׄ ⬭ *sɪɴ ᴅᴀᴛᴏ*\n\nׅㅤ𓏸𓈒ㅤׄ No tienes fecha de nacimiento establecida.`,
                    contextInfo: rcanal
                }, { quoted: m })
                user.birth = ''
                return conn.sendMessage(m.chat, {
                    text:
                        `> . ﹡ ﹟ 🗑️ ׄ ⬭ *ᴇʟɪᴍɪɴᴀᴅᴏ*\n\nׅㅤ𓏸𓈒ㅤׄ Tu fecha de nacimiento fue eliminada.`,
                    contextInfo: rcanal
                }, { quoted: m })
            }

            case 'setgenre': case 'setgenero': {
                if (!text) return conn.sendMessage(m.chat, {
                    text:
                        `> . ﹡ ﹟ ⚥ ׄ ⬭ *sᴇᴛɢᴇɴʀᴇ*\n\n` +
                        `ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴏ* :: ${usedPrefix + command} hombre/mujer`,
                    contextInfo: rcanal
                }, { quoted: m })

                const genreMap = { hombre: 'Hombre', mujer: 'Mujer' }
                const genre = genreMap[text.toLowerCase()]
                if (!genre) return conn.sendMessage(m.chat, {
                    text:
                        `> . ﹡ ﹟ ⚠️ ׄ ⬭ *ᴇʀʀᴏʀ*\n\nׅㅤ𓏸𓈒ㅤׄ Opciones válidas: *hombre* o *mujer*`,
                    contextInfo: rcanal
                }, { quoted: m })

                if (user.genre === genre) return conn.sendMessage(m.chat, {
                    text:
                        `> . ﹡ ﹟ ⚠️ ׄ ⬭ *sɪɴ ᴄᴀᴍʙɪᴏs*\n\nׅㅤ𓏸𓈒ㅤׄ Ya tienes el género *${user.genre}* establecido.`,
                    contextInfo: rcanal
                }, { quoted: m })

                user.genre = genre
                return conn.sendMessage(m.chat, {
                    text:
                        `> . ﹡ ﹟ ✅ ׄ ⬭ *ɢᴇ́ɴᴇʀᴏ ᴀᴄᴛᴜᴀʟɪᴢᴀᴅᴏ*\n\nׅㅤ𓏸𓈒ㅤׄ *ɢᴇ́ɴᴇʀᴏ* :: ${user.genre}`,
                    contextInfo: rcanal
                }, { quoted: m })
            }

            case 'delgenre': {
                if (!user.genre) return conn.sendMessage(m.chat, {
                    text:
                        `> . ﹡ ﹟ ⚠️ ׄ ⬭ *sɪɴ ᴅᴀᴛᴏ*\n\nׅㅤ𓏸𓈒ㅤׄ No tienes género asignado.`,
                    contextInfo: rcanal
                }, { quoted: m })
                user.genre = ''
                return conn.sendMessage(m.chat, {
                    text:
                        `> . ﹡ ﹟ 🗑️ ׄ ⬭ *ᴇʟɪᴍɪɴᴀᴅᴏ*\n\nׅㅤ𓏸𓈒ㅤׄ Tu género fue eliminado.`,
                    contextInfo: rcanal
                }, { quoted: m })
            }

            case 'setdescription': case 'setdesc': {
                if (!text) return conn.sendMessage(m.chat, {
                    text:
                        `> . ﹡ ﹟ 📝 ׄ ⬭ *sᴇᴛᴅᴇsᴄ*\n\n` +
                        `ׅㅤ𓏸𓈒ㅤׄ *ᴜsᴏ* :: ${usedPrefix + command} Tu descripción aquí`,
                    contextInfo: rcanal
                }, { quoted: m })
                user.description = text
                return conn.sendMessage(m.chat, {
                    text:
                        `> . ﹡ ﹟ ✅ ׄ ⬭ *ᴅᴇsᴄʀɪᴘᴄɪᴏ́ɴ ᴀᴄᴛᴜᴀʟɪᴢᴀᴅᴀ*\n\n` +
                        `ׅㅤ𓏸𓈒ㅤׄ *ᴅᴇsᴄ* :: ${user.description}\n\n` +
                        `> ✧ Revísala con *#profile*`,
                    contextInfo: rcanal
                }, { quoted: m })
            }

            case 'deldescription': case 'deldesc': {
                if (!user.description) return conn.sendMessage(m.chat, {
                    text:
                        `> . ﹡ ﹟ ⚠️ ׄ ⬭ *sɪɴ ᴅᴀᴛᴏ*\n\nׅㅤ𓏸𓈒ㅤׄ No tienes descripción establecida.`,
                    contextInfo: rcanal
                }, { quoted: m })
                user.description = ''
                return conn.sendMessage(m.chat, {
                    text:
                        `> . ﹡ ﹟ 🗑️ ׄ ⬭ *ᴇʟɪᴍɪɴᴀᴅᴏ*\n\nׅㅤ𓏸𓈒ㅤׄ Tu descripción fue eliminada.`,
                    contextInfo: rcanal
                }, { quoted: m })
            }
        }

    } catch (error) {
        console.error(error)
        conn.sendMessage(m.chat, {
            text:
                `> . ﹡ ﹟ ❌ ׄ ⬭ *ᴇʀʀᴏʀ*\n\n` +
                `ׅㅤ𓏸𓈒ㅤׄ ${error.message}\n` +
                `ׅㅤ𓏸𓈒ㅤׄ Usa *${usedPrefix}report* para reportarlo.`,
            contextInfo: rcanal
        }, { quoted: m })
    }
}

handler.help = ['setprofile', 'setbirth', 'delbirth', 'setgenre', 'delgenre', 'setdescription', 'setdesc', 'deldescription', 'deldesc']
handler.tags = ['rg']
handler.command = ['setprofile', 'setbirth', 'delbirth', 'setgenre', 'setgenero', 'delgenre', 'setdescription', 'setdesc', 'deldescription', 'deldesc']
handler.group = true
handler.reg = true

export default handler
