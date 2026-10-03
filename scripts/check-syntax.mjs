import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const files = [path.join(ROOT, "app.js"), path.join(ROOT, "admin.js")];
function collect(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) collect(file);
    else if (/\.(?:m?js)$/.test(entry.name)) files.push(file);
  }
}
collect(path.join(ROOT, "shared"));
collect(path.join(ROOT, "scripts"));

for (const file of [...new Set(files)].sort()) {
  const result = spawnSync(process.execPath, ["--check", file], { encoding: "utf8" });
  if (result.status !== 0) {
    process.stderr.write(result.stderr || result.stdout || `Syntaxe invalide : ${file}\n`);
    process.exit(result.status || 1);
  }
}
console.log(`Syntax check passed (${files.length} fichiers JavaScript)`);
