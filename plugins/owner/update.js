import { execFile } from "child_process";
import { existsSync } from "fs";
import { resolve, dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "../..");

function isOwner(senderRaw) {
  const numero = senderRaw?.split("@")[0];
  return global.owners?.some(([num]) => num === numero);
}

function run(command, args, options = {}) {
  return new Promise((resolvePromise) => {
    execFile(command, args, {
      cwd: ROOT,
      timeout: options.timeout || 120000,
      windowsHide: true,
      maxBuffer: 1024 * 1024 * 5,
    }, (error, stdout = "", stderr = "") => {
      resolvePromise({
        ok: !error,
        code: error?.code || 0,
        stdout: stdout.trim(),
        stderr: stderr.trim(),
        error,
      });
    });
  });
}

function shortOutput(result) {
  const text = [result.stdout, result.stderr].filter(Boolean).join("\n").trim();
  if (!text) return "Sin salida";
  return text.split("\n").slice(-12).join("\n");
}

async function getCurrentRevision() {
  const result = await run("git", ["rev-parse", "HEAD"], { timeout: 30000 });
  return result.ok ? result.stdout.trim() : null;
}

async function hasPackageChanged(before, after) {
  if (!before || !after || before === after) return false;
  const result = await run("git", ["diff", "--name-only", before, after], { timeout: 30000 });
  if (!result.ok) return true;
  return result.stdout.split(/\r?\n/).some((file) => ["package.json", "package-lock.json"].includes(file.trim()));
}

export default [
  {
    command: ["update", "actualizar", "pull"],
    description: "Actualiza el bot desde GitHub, instala dependencias si hacen falta y reinicia. Solo owners.",
    async execute({ senderRaw, reply }) {
      if (!isOwner(senderRaw)) {
        return reply("🚫 Solo los owners pueden usar este comando.");
      }

      if (!existsSync(join(ROOT, ".git"))) {
        return reply(
          "❌ Este bot no tiene carpeta .git.\n\n" +
          "Instálalo con git clone para poder actualizar con !update."
        );
      }

      await reply("⏳ Buscando actualizaciones en GitHub...");

      const before = await getCurrentRevision();
      const fetchResult = await run("git", ["fetch", "--all", "--prune"], { timeout: 120000 });
      if (!fetchResult.ok) {
        return reply(`❌ No pude consultar el repositorio.\n\n${shortOutput(fetchResult)}`);
      }

      const status = await run("git", ["status", "--porcelain"], { timeout: 30000 });
      if (status.stdout.trim()) {
        return reply(
          "⚠️ Hay cambios locales sin guardar.\n\n" +
          "Para evitar perder archivos, no actualicé nada. Guarda tus cambios o súbelos primero."
        );
      }

      const branchResult = await run("git", ["branch", "--show-current"], { timeout: 30000 });
      const branch = branchResult.stdout.trim() || "main";
      const upstream = await run("git", ["rev-parse", "--abbrev-ref", `${branch}@{upstream}`], { timeout: 30000 });
      const pullTarget = upstream.ok && upstream.stdout.trim() ? [] : ["origin", branch];

      const pullResult = await run("git", ["pull", "--ff-only", ...pullTarget], { timeout: 180000 });
      if (!pullResult.ok) {
        return reply(`❌ No pude actualizar con git pull.\n\n${shortOutput(pullResult)}`);
      }

      const after = await getCurrentRevision();
      if (before && after && before === after) {
        return reply("✅ El bot ya estaba actualizado. No había cambios nuevos.");
      }

      let installMsg = "";
      if (await hasPackageChanged(before, after)) {
        await reply("📦 Cambió package.json, instalando dependencias...");
        const installResult = await run("npm", ["install", "--omit=dev"], { timeout: 300000 });
        if (!installResult.ok) {
          return reply(`⚠️ El código se actualizó, pero npm install falló.\n\n${shortOutput(installResult)}`);
        }
        installMsg = "\n📦 Dependencias actualizadas.";
      }

      await reply(
        `✅ Bot actualizado correctamente.${installMsg}\n\n` +
        `Antes: ${before?.slice(0, 7) || "desconocido"}\n` +
        `Ahora: ${after?.slice(0, 7) || "desconocido"}\n\n` +
        "🔄 Reiniciando en 3 segundos..."
      );

      setTimeout(() => process.exit(0), 3000);
    },
  },
];
