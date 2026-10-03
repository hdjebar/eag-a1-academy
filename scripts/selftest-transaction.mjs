import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { withFileRollback, writeFileAtomic } from "./lib/file-transaction.mjs";

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

fs.rmSync(dir, { recursive: true, force: true });
console.log("File-transaction self-test passed (rollback après échec, écriture atomique sans résidu)");