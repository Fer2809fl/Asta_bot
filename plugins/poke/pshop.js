let handler = async (m, { conn, usedPrefix, text, args, command }) => {
  if (global.db.data.chats[m.chat].adminonly || !global.db.data.chats[m.chat].pokes)
    return m.reply(`ㅤ𓏸𓈒ㅤׄ Estos comandos estan desactivados en este grupo.`)

  try {
    if (!global.db.data.pokemonShop[m.chat] || global.db.data.pokemonShop[m.chat].length === 0) {
      return m.reply(`ㅤ𓏸𓈒ㅤׄ No hay Pokémon en venta en este grupo.`)
    }

    // CORRECCIÓN: Obtener moneda de forma segura
    let money = 'pokemonedas'
    try {
      const botId = conn?.user?.id?.split(':')?.[0] + '@s.whatsapp.net'
      if (botId && global.db.data.settings) {
        const botSettings = global.db.data.settings[botId]
        if (botSettings?.currency) {
          money = botSettings.currency
        }
      }
    } catch (e) {
      console.log('Error al obtener configuración del bot:', e)
    }

    const shop = global.db.data.pokemonShop[m.chat]
    let message = `*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜* ㅤ֢ㅤ⸱ㅤᯭִ* — *ᴛɪᴇɴᴅᴀ ᴅᴇ ᴘᴏᴋéᴍᴏɴ*\n\n`

    for (let i = 0; i < shop.length; i++) {
      const item = shop[i]
      const sellerData = global.db.data.users[item.vendedor]
      const sellerName = global.db.data.users[item.vendedor].name || 'Desconocido'

      message += `${i + 1}. *${item.nombre}*\n`
      message += `ㅤ𓏸𓈒ㅤׄ Tipo: ${item.tipo}\n`
      message += `ㅤ𓏸𓈒ㅤׄ Poder: ${Number(item.poder).toLocaleString()}\n`
      message += `ㅤ𓏸𓈒ㅤׄ Precio: ${Number(item.precio).toLocaleString()} ${money}\n`
      message += `ㅤ𓏸𓈒ㅤׄ Vendedor: ${sellerName}\n\n`
    }

    message += `─────────────────\n`
    message += `ㅤ𓏸𓈒ㅤׄ Usa *${usedPrefix}buypoke <nombre>* para comprar.`

    await m.reply(message)
  } catch (e) {
    console.error('Error en pshop.js:', e)
    m.reply('Ocurrió un error al mostrar la tienda.')
  }
}

handler.help = ['pokeshop', 'tiendapokemon', 'pshop', 'shopoke']
handler.tags = ['pokes']
handler.command = ['pokeshop', 'tiendapokemon', 'pshop', 'shopoke']

export default handler