import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

/**
 * All items already known to the repository: approved bank and candidate files.
 * Used by the generators to continue numbering and to avoid re-creating existing content.
 * @returns {object[]}
 */
export function knownItems() {
  const out = [];
  for (const dir of ["data/approved", "generated"]) {
    const abs = path.join(ROOT, dir);
    if (!fs.existsSync(abs)) continue;
    for (const f of fs.readdirSync(abs).filter((x) => x.endsWith(".json") && !x.endsWith(".review.json"))) {
      try { const a = JSON.parse(fs.readFileSync(path.join(abs, f), "utf8")); if (Array.isArray(a)) out.push(...a); } catch { /* unreadable candidate files are reported by validate-bank */ }
    }
  }
  return out;
}

/**
 * Highest numeric suffix already used for an id prefix (e.g. "numeric-chart" → 221), or `floor`.
 * @param {string} prefix
 * @param {number} floor
 * @param {object[]} [items]
 */
export function lastNumber(prefix, floor, items = knownItems()) {
  const re = new RegExp(`^${prefix.replace(/[-]/g, "\\-")}-(\\d+)$`);
  return items.reduce((m, x) => { const r = re.exec(String(x?.id || "")); return r ? Math.max(m, Number(r[1])) : m; }, floor);
}
