// src/feedbackDB.js
// Almacenamiento (JSON) para la lista única de Sugerencias (ideas) y Reportes (bugs).
// Colócalo en la carpeta "src/", junto a handler.js, jid.js, groupConfig.js, etc.

import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const DB_DIR = join(dirname(fileURLToPath(import.meta.url)), "../database");
const DB_FILE = join(DB_DIR, "feedback.json");

function ensureDB() {
  if (!existsSync(DB_DIR)) mkdirSync(DB_DIR, { recursive: true });
  if (!existsSync(DB_FILE)) {
    writeFileSync(DB_FILE, JSON.stringify({ items: [] }, null, 2));
  }
}

function readDB() {
  ensureDB();
  try {
    const raw = JSON.parse(readFileSync(DB_FILE, "utf-8"));
    if (!Array.isArray(raw.items)) raw.items = [];
    return raw;
  } catch {
    return { items: [] };
  }
}

function writeDB(data) {
  ensureDB();
  writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

function genId(tipo) {
  const prefix = tipo === "bug" ? "BUG" : "SUG";
  const rand = Math.floor(100 + Math.random() * 900);
  return `${prefix}-${Date.now()}-${rand}`;
}

export const feedbackDB = {
  /**
   * Agrega un nuevo registro a la lista.
   * tipo: "idea" | "bug"
   */
  crear({ tipo, texto, autor, autorNumero, grupoOrigen }) {
    const db = readDB();
    const item = {
      id: genId(tipo),
      tipo,
      texto,
      autor, // jid completo del autor (para poder avisarle cuando se resuelva)
      autorNumero,
      grupoOrigen: grupoOrigen || null,
      fecha: Date.now(),
    };
    db.items.push(item);
    writeDB(db);
    return item;
  },

  obtener(id) {
    const db = readDB();
    return db.items.find((i) => i.id === id) || null;
  },

  listarTodos() {
    const db = readDB();
    return db.items;
  },

  /**
   * Quita un registro de la lista (usado cuando ya fue resuelto/implementado).
   */
  eliminar(id) {
    const db = readDB();
    const idx = db.items.findIndex((i) => i.id === id);
    if (idx === -1) return null;
    const [removido] = db.items.splice(idx, 1);
    writeDB(db);
    return removido;
  },
};
