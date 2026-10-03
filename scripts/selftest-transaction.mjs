import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { withFileRollback } from "./lib/file-transaction.mjs";

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
fs.rmSync(dir, { recursive: true, force: true });
console.log("File-transaction self-test passed (rollback après échec)");
