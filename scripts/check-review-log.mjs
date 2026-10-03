import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { EagRules } from "./lib/rules.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const APPROVED_DIR = path.join(ROOT, "data/approved");
const LOG_DIR = path.join(ROOT, "data/review-log");
const APPROVING = new Set(["approved", "revised", "modified", "legacy"]);
const ITEM_ID = /^(abstract|verbal|numeric|planning|situational)-[a-z0-9-]+-[0-9]{3,}$/;
const HASH = /^[0-9a-f]{16}$/;

export function approvingDecisionErrors(d) {
  const errors = [];
  if (!d || typeof d !== "object" || Array.isArray(d)) return ["décision invalide : objet attendu"];
  if (typeof d.id !== "string" || !ITEM_ID.test(d.id)) errors.push("identifiant absent ou invalide");
  if (!Number.isInteger(d.version) || d.version < 1) errors.push("version absente ou invalide");
  if (typeof d.hash !== "string" || !HASH.test(d.hash)) errors.push("empreinte absente ou invalide");
  if (typeof d.reviewer !== "string" || d.reviewer.trim().length < 2) errors.push("relecteur absent ou invalide");
  if (typeof d.at !== "string" || Number.isNaN(Date.parse(d.at))) errors.push("horodatage absent ou invalide");
  return errors;
}

/**
 * Review gate: every item in data/approved/ must match a human decision in data/review-log/.
 *
 * The matching entry is the latest approving decision for the item's id. It must carry the
 * item's version, its reviewer, and the content fingerprint (EagRules.contentHash) of exactly
 * what was approved. Editing an approved item by hand, or writing items straight into
 * data/approved/ from a script, therefore fails CI until a reviewer approves the new content
 * through promote-candidate or the admin page, which both write the log entry.
 *
 * @returns {{ errors: string[], checked: number, entries: number }}
 */
export function checkReviewLog() {
  const latest = new Map();
  let entries = 0;
  const files = fs.existsSync(LOG_DIR) ? fs.readdirSync(LOG_DIR).filter((f) => f.endsWith(".json")).sort() : [];
  const errors = [];
  for (const f of files) {
    let log;
    try { log = JSON.parse(fs.readFileSync(path.join(LOG_DIR, f), "utf8")); } catch (e) { errors.push(`${f} : JSON illisible (${e.message})`); continue; }
    const decisions = Array.isArray(log.decisions) ? log.decisions : [];
    for (let i = 0; i < decisions.length; i++) {
      const d = decisions[i];
      entries++;
      if (d && APPROVING.has(d.decision)) {
        const invalid = approvingDecisionErrors(d);
        if (invalid.length) { errors.push(`${f} décision ${i + 1} (${d.id || "sans id"}) : ${invalid.join(" ; ")}`); continue; }
        const prev = latest.get(d.id);
        if (!prev || String(d.at || "") >= String(prev.at || "")) latest.set(d.id, { ...d, file: f });
      }
    }
  }
  let checked = 0;
  for (const f of fs.readdirSync(APPROVED_DIR).filter((x) => x.endsWith(".json")).sort()) {
    for (const item of JSON.parse(fs.readFileSync(path.join(APPROVED_DIR, f), "utf8"))) {
      checked++;
      const d = latest.get(item.id);
      if (!d) { errors.push(`${item.id} : aucune décision de relecture dans data/review-log/`); continue; }
      if (d.version !== item.version) errors.push(`${item.id} : version ${item.version} approuvée sans décision (journal : version ${d.version}, ${d.file})`);
      else if (d.hash !== EagRules.contentHash(item)) errors.push(`${item.id} : contenu modifié depuis la décision de ${d.reviewer} (${d.file}) ; faites-le relire et approuver à nouveau`);
      if (d.reviewer !== item.reviewer) errors.push(`${item.id} : relecteur « ${item.reviewer} » différent de celui du journal (« ${d.reviewer} »)`);
    }
  }
  return { errors, checked, entries };
}

const isDirectRun = Boolean(process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]));
if (isDirectRun) {
  const { errors, checked, entries } = checkReviewLog();
  if (errors.length) {
    console.error(`❌ Contrôle de relecture : ${errors.length} problème(s)\n- ${errors.slice(0, 50).join("\n- ")}${errors.length > 50 ? `\n… et ${errors.length - 50} autre(s)` : ""}`);
    console.error("\nToute question approuvée doit passer par npm run promote:candidate ou la page d'administration.");
    process.exit(1);
  }
  console.log(`✅ Contrôle de relecture : ${checked} questions approuvées, toutes tracées dans data/review-log/ (${entries} décisions).`);
}
