import axios from "axios";
import fs from "fs";
import path from "path";
import { tmpdir } from "os";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

/**
 * Descarga una URL como stream a un archivo temporal del sistema.
 */
export async function downloadToTmp(url, ext, prefix = "asta-dl") {
  const tmpPath = path.join(
    tmpdir(),
    `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  );
  const { data: stream } = await axios.get(url, {
    responseType: "stream",
    timeout: 120000,
    headers: { "User-Agent": UA },
    maxRedirects: 5,
  });
  const writer = fs.createWriteStream(tmpPath);
  stream.pipe(writer);
  await new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
    stream.on("error", reject);
  });
  return tmpPath;
}

/**
 * Elimina uno o varios archivos temporales sin lanzar errores.
 */
export function cleanTmp(...paths) {
  for (const p of paths) {
    if (p && fs.existsSync(p)) {
      try {
        fs.unlinkSync(p);
      } catch {}
    }
  }
}

/**
 * Limpia un nombre de archivo de caracteres inválidos.
 */
export function sanitizeFilename(name = "archivo") {
  return String(name).replace(/[\\/:*?"<>|]+/g, "").trim().slice(0, 100) || "archivo";
}

/**
 * Formatea bytes a una unidad legible (KB, MB, GB...).
 */
export function formatBytes(bytes) {
  if (!bytes || bytes <= 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * GET y devuelve el JSON parseado.
 */
export async function fetchJson(url, opts = {}) {
  const { data } = await axios.get(url, {
    timeout: 15000,
    headers: { "User-Agent": UA },
    ...opts,
  });
  return data;
}

/**
 * Envía una reacción de emoji al mensaje original (no lanza errores).
 */
export async function react(sock, remoteJid, msg, emoji) {
  try {
    await sock.sendMessage(remoteJid, { react: { text: emoji, key: msg.key } });
  } catch {}
}

/**
 * Devuelve la primera promesa que se resuelva con un valor "truthy".
 * Si todas fallan, lanza un error combinado.
 */
export async function firstSuccessful(promises) {
  const errors = [];
  return new Promise((resolve, reject) => {
    let completed = 0;
    if (promises.length === 0) return reject(new Error("Sin tareas disponibles"));
    for (const p of promises) {
      Promise.resolve(p)
        .then((res) => {
          if (res) resolve(res);
          else throw new Error("Respuesta vacía");
        })
        .catch((err) => errors.push(err))
        .finally(() => {
          completed++;
          if (completed === promises.length) {
            reject(new Error(errors.map((e) => e.message).join(" | ") || "Todos los servidores fallaron"));
          }
        });
    }
  });
}

export const UA_HEADER = UA;
