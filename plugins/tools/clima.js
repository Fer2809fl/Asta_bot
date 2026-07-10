async function fetchClima(ciudad) {
  const geoRes = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(ciudad)}&count=1&language=es`
  );
  const geoData = await geoRes.json();
  const lugar = geoData.results?.[0];
  if (!lugar) throw new Error(`No se encontró la ciudad: ${ciudad}`);

  const { latitude, longitude, name, country } = lugar;
  const wxRes = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
    `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code` +
    `&wind_speed_unit=kmh&timezone=auto`
  );
  const wxData = await wxRes.json();
  const c = wxData.current;

  const codigoClima = (code) => {
    if (code === 0) return "☀️ Despejado";
    if (code <= 3) return "⛅ Parcialmente nublado";
    if (code <= 48) return "🌫️ Niebla";
    if (code <= 67) return "🌧️ Lluvia";
    if (code <= 77) return "❄️ Nieve";
    if (code <= 82) return "🌦️ Chubascos";
    if (code <= 99) return "⛈️ Tormenta";
    return "🌡️ Desconocido";
  };

  return { name, country, ...c, descripcion: codigoClima(c.weather_code) };
}

export default [
  {
    command: ["clima", "weather", "tiempo"],
    description: "Muestra el clima actual de una ciudad. Ej: !clima Monterrey",
    async execute({ reply, args }) {
      if (!args.length)
        return reply("❌ Uso: `!clima <ciudad>`\nEjemplo: `!clima Guadalajara`");

      const ciudad = args.join(" ");
      await reply(`🌍 Buscando clima para *${ciudad}*...`);

      let data;
      try {
        data = await fetchClima(ciudad);
      } catch (e) {
        return reply(`❌ ${e.message}`);
      }

      const text = `
🌤️ *ASTA — Clima*
*📍 Ubicación*
› Ciudad: *${data.name}, ${data.country}*
*🌡️ Condiciones actuales*
› Estado: *${data.descripcion}*
› Temperatura: *${data.temperature_2m} °C*
› Humedad: *${data.relative_humidity_2m}%*
› Viento: *${data.wind_speed_10m} km/h*
`.trim();
      await reply(text);
    },
  },
];
