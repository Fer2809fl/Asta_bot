import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname } from "path";

export function createJsonStore(filePath, { defaultValue = {}, debounceMs = 400, label = "JsonStore" } = {}) {
  let cache = null;
  let dirty = false;
  let saveTimer = null;

  function makeDefault() {
    return typeof defaultValue === "function" ? defaultValue() : structuredClone(defaultValue);
  }

  function ensureDir() {
    const dir = dirname(filePath);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  }

  function load() {
    if (cache) return cache;
    ensureDir();
    try {
      cache = JSON.parse(readFileSync(filePath, "utf-8"));
    } catch {
      cache = makeDefault();
    }
    return cache;
  }

  function writeNow() {
    ensureDir();
    writeFileSync(filePath, JSON.stringify(cache, null, 2), "utf-8");
    dirty = false;
  }

  function scheduleSave() {
    dirty = true;
    if (saveTimer) return;
    saveTimer = setTimeout(() => {
      saveTimer = null;
      if (!dirty) return;
      try {
        writeNow();
      } catch (e) {
        console.error(`[${label}] Error al guardar ${filePath}:`, e.message);
      }
    }, debounceMs);
  }

  return {
    get data() {
      return load();
    },
    markDirty() {
      scheduleSave();
    },
    flush() {
      if (dirty) {
        try {
          writeNow();
        } catch (e) {
          console.error(`[${label}] Error en flush de ${filePath}:`, e.message);
        }
      }
      if (saveTimer) {
        clearTimeout(saveTimer);
        saveTimer = null;
      }
    },
  };
}
