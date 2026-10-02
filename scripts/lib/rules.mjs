/** Loads shared/item-rules.js (a classic browser script) into Node and re-exports EagRules. */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
if (!globalThis.EagRules) {
  vm.runInThisContext(fs.readFileSync(path.join(ROOT, "shared/item-rules.js"), "utf8"), { filename: "shared/item-rules.js" });
}
export const EagRules = globalThis.EagRules;
export const SCHEMA = JSON.parse(fs.readFileSync(path.join(ROOT, "schema/question.schema.json"), "utf8"));
export const CATEGORIES = ["abstract", "verbal", "numeric", "planning", "situational"];
export function loadApproved() {
  return CATEGORIES.flatMap((c) => {
    const f = path.join(ROOT, "data/approved", `${c}.json`);
    return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, "utf8")) : [];
  });
}
