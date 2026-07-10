import { readdirSync, statSync } from "fs";
import { resolve, dirname, join, extname, basename } from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function getFiles(dir) {
  const files = [];
  for (const item of readdirSync(dir)) {
    if (item.startsWith(".")) continue; // ← IGNORAR ARCHIVOS OCULTOS
    const path = join(dir, item);
    if (statSync(path).isDirectory()) {
      files.push(...getFiles(path));
    } else if (extname(path) === ".js") {
      files.push(path);
    }
  }
  return files;
}

export async function loadPlugins() {
  const plugins = [];
  const dir = resolve(__dirname, "../plugins");
  const aliasOwners = new Map(); // alias -> archivo que lo registró primero

  const allFiles = getFiles(dir);
  console.log(`[Loader] ${allFiles.length} archivos .js encontrados`);

  for (const file of allFiles) {
    try {
      const mod = await import(pathToFileURL(file).href);
      
      if (!mod.default) {
        console.warn(`[Loader] ⚠️ ${basename(file)}: Sin export default`);
        continue;
      }
      
      const items = Array.isArray(mod.default) ? mod.default : [mod.default];
      
      for (const item of items) {
        if (!item.command) {
          console.warn(`[Loader] ⚠️ ${basename(file)}: Sin propiedad 'command'`);
          continue;
        }

        const aliases = Array.isArray(item.command) ? item.command : [item.command];
        for (const alias of aliases) {
          const key = alias.toLowerCase();
          const owner = aliasOwners.get(key);
          if (owner && owner !== basename(file)) {
            console.warn(
              `[Loader] ⚠️ COLISIÓN: el comando "${key}" está registrado en "${owner}" y también en "${basename(file)}". Gana el último cargado.`
            );
          }
          aliasOwners.set(key, basename(file));
        }

        plugins.push(item);
      }
      
    } catch (err) {
      console.error(`[Loader] ❌ ${basename(file)}: ${err.message}`);
    }
  }
  
  console.log(`[Loader] ✅ ${plugins.length} comando(s) cargado(s)`);
  return plugins;
}
