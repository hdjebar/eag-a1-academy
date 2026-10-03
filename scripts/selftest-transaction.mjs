import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { withFileRollback, writeFileAtomic } from "./lib/file-transaction.mjs";
import { acquire, release, withLock, LOCK_PATH } from "./lib/lockfile.mjs";

const dir = fs.mkdtempSync(path.join(os.tmpdir(), "eag-transaction-"));
const existing = path.join(dir, "existing.txt");
const created = path.join(dir, "created.txt");
fs.writeFileSync(existing, "before");
let threw = false;
try {
  withFileRollback([existing, created], () => {
    fs.writeFileSync(existing, "after");
    fs.writeFileSync(created, "temporary");
    throw new Error("simulated failure");
  });
} catch { threw = true; }
if (!threw || fs.readFileSync(existing, "utf8") !== "before" || fs.existsSync(created)) {
  console.error("❌ transaction fichiers : retour arrière incomplet");
  process.exit(1);
}

/* Atomic write: content lands, no temp residue, nested dirs created. */
const nested = path.join(dir, "sub", "file.txt");
writeFileAtomic(nested, "atomic");
if (fs.readFileSync(nested, "utf8") !== "atomic") {
  console.error("❌ écriture atomique : contenu incorrect");
  process.exit(1);
}
writeFileAtomic(existing, Buffer.from("atomique"));
if (fs.readFileSync(existing, "utf8") !== "atomique") {
  console.error("❌ écriture atomique : remplacement incorrect");
  process.exit(1);
}
const residue = fs.readdirSync(dir).filter((f) => f.includes(".tmp-"));
if (residue.length) {
  console.error(`❌ écriture atomique : fichiers temporaires résiduels (${residue.join(", ")})`);
  process.exit(1);
}

/* Rollback restore also leaves no temp residue. */
let threw2 = false;
try {
  withFileRollback([nested], () => {
    writeFileAtomic(nested, "corrompu");
    throw new Error("failure during rollback test");
  });
} catch { threw2 = true; }
if (!threw2 || fs.readFileSync(nested, "utf8") !== "atomic" || fs.readdirSync(dir).some((f) => f.includes(".tmp-"))) {
  console.error("❌ transaction fichiers : retour arrière atomique incomplet");
  process.exit(1);
}

/* ---------- Writer lock ---------- */
{
  const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
  const n = await withLock(root, "test", () => 42);
  if (n !== 42) { console.error("❌ verrou : withLock ne renvoie pas le résultat de l'action"); process.exit(1); }
  if (fs.existsSync(LOCK_PATH(root))) { console.error("❌ verrou : fichier de verrou non supprimé après l'action"); process.exit(1); }

  // A fresh foreign lock must block (short retry budget), and report in French.
  fs.closeSync(fs.openSync(LOCK_PATH(root), "wx"));
  let blocked = false;
  try { await withLock(root, "test", () => {}, { attempts: 3, delayMs: 10 }); } catch (e) { blocked = e.message.includes("Un autre processus modifie la banque"); }
  if (!blocked) { console.error("❌ verrou : un verrou frais n'a pas bloqué l'action"); process.exit(1); }

  // A stale lock (> 5 min) must be stolen.
  const old = new Date(Date.now() - 6 * 60 * 1000);
  fs.utimesSync(LOCK_PATH(root), old, old);
  const stolen = await withLock(root, "test", () => "ran");
  if (stolen !== "ran") { console.error("❌ verrou : un verrou périmé n'a pas été repris"); process.exit(1); }

  // acquire/release pair: release only removes our own token.
  const h = await acquire(root, "test2");
  release(h);
  if (fs.existsSync(LOCK_PATH(root))) { console.error("❌ verrou : release ne supprime pas son propre verrou"); process.exit(1); }
  const h2 = await acquire(root, "test2");
  // Fake a foreign token inside the lock file; release must leave it alone.
  const foreign = JSON.parse(fs.readFileSync(LOCK_PATH(root), "utf8"));
  foreign.token = "foreign-token"; fs.writeFileSync(LOCK_PATH(root), JSON.stringify(foreign));
  release(h2);
  if (!fs.existsSync(LOCK_PATH(root))) { console.error("❌ verrou : release a supprimé le verrou d'un autre processus"); process.exit(1); }
  fs.rmSync(LOCK_PATH(root), { force: true });
}

fs.rmSync(dir, { recursive: true, force: true });
console.log("File-transaction self-test passed (rollback après échec, écriture atomique sans résidu, verrou d'écriture)");