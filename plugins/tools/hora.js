export default [
  {
    command: ["hora", "time", "fecha", "date"],
    description: "Muestra la hora actual de una ciudad. Ej: !hora Monterrey",
    async execute({ reply, args }) {
      const ciudad = args.join(" ") || "Ciudad de Mexico";

      await reply(`🌍 Buscando hora para *${ciudad}*...`);

      let zona, nombreLugar, pais;
      try {
        const geoRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(ciudad)}&count=1&language=es`
        );
        const geoData = await geoRes.json();
        const lugar = geoData.results?.[0];
        if (!lugar) return reply(`❌ No se encontró la ciudad: *${ciudad}*`);

        nombreLugar = lugar.name;
        pais = lugar.country;
        const { latitude, longitude } = lugar;

        // Obtener zona horaria via timeapi.io (gratis, sin key)
        const tzRes = await fetch(
          `https://timeapi.io/api/timezone/coordinate?latitude=${latitude}&longitude=${longitude}`
        );
        const tzData = await tzRes.json();
        zona = tzData.timeZone;
        if (!zona) throw new Error("No se pudo obtener la zona horaria");
      } catch (e) {
        return reply(`❌ ${e.message}`);
      }

      const fecha = new Date().toLocaleString("es-MX", {
        timeZone: zona,
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      const text = `
🕐 *ASTA — Hora y Fecha*
*📍 Ubicación*
› Ciudad: *${nombreLugar}, ${pais}*
› Zona: *${zona}*
*🕰️ Ahora*
› *${fecha}*
`.trim();
      await reply(text);
    },
  },
];
