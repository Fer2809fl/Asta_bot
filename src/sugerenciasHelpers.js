// src/sugerenciasHelpers.js
// Colócalo en src/, junto a feedbackDB.js

export function numberToJid(numero) {
  return `${numero}@s.whatsapp.net`;
}

export function nombreTipo(tipo) {
  return tipo === "bug" ? "🐛 Reporte" : "💡 Sugerencia";
}

export function candidatosNumero(msg, senderRaw, jidToNumber) {
  const candidatos = new Set();
  const intentar = (jid) => {
    if (!jid) return;
    try {
      const num = jidToNumber(jid);
      if (num) candidatos.add(String(num));
    } catch {}
  };
  intentar(senderRaw);
  intentar(msg?.key?.participant);
  intentar(msg?.key?.participantAlt);
  intentar(msg?.key?.participantPn);
  intentar(msg?.key?.remoteJid);
  intentar(msg?.key?.remoteJidAlt);
  return candidatos;
}

export function esAyudante(candidatos) {
  const ayudantes = new Set(global.ayudantes || []);
  for (const c of candidatos) if (ayudantes.has(c)) return true;
  return false;
}

export function esOwnerGlobal(candidatos) {
  const ownerNums = new Set((global.owners || []).map(([num]) => num));
  for (const c of candidatos) if (ownerNums.has(c)) return true;
  return false;
}

export function tieneAcceso(candidatos, senderRaw, isOwner) {
  return esAyudante(candidatos) || isOwner(senderRaw) || esOwnerGlobal(candidatos);
}

export async function notificarAyudantes(sock, item) {
  const cabecera = item.tipo === "bug" ? "🐛 NUEVO REPORTE" : "💡 NUEVA SUGERENCIA";
  for (const numero of global.ayudantes || []) {
    try {
      await sock.sendMessage(numberToJid(numero), {
        text:
          `${cabecera}\n🆔 ${item.id}\n👤 +${item.autorNumero}\n📝 ${item.texto}\n\n` +
          `Usa *quitar ${item.id}* cuando ya esté resuelto, o *lista* para ver todo.`,
      });
    } catch (e) {
      console.error("[Sugerencias] No se pudo notificar a", numero, e.message);
    }
  }
}
