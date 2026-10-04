import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { EagRules } from "./lib/rules.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const APPROVED_DIR = path.join(ROOT, "data/approved");
const LOG_DIR = path.join(ROOT, "data/review-log");
const APPROVING = new Set(["approved", "revised", "modified", "legacy"]);
const REMOVING = new Set(["removed"]);
const MINOR = new Set(["undone", "rejected"]);
const ITEM_ID = /^(abstract|verbal|numeric|planning|situational)-[a-z0-9-]+-[0-9]{3,}$/;
const HASH = /^[0-9a-f]{16}$/;
const LEGACY_BASELINE = "2026-10-02-legacy-baseline.json";
// Timestamps are written by the very machine that checks them: allow a small clock skew
// between a developer workstation and CI, while still rejecting materially future dates.
const FUTURE_TOLERANCE_MS = 5 * 60 * 1000;

function timestampErrors(d) {
  if (typeof d.at !== "string" || Number.isNaN(Date.parse(d.at))) return ["horodatage absent ou invalide"];
  if (Date.parse(d.at) > Date.now() + FUTURE_TOLERANCE_MS) return ["horodatage dans le futur"];
  return [];
}

export function approvingDecisionErrors(d) {
  const errors = [];
  if (!d || typeof d !== "object" || Array.isArray(d)) return ["décision invalide : objet attendu"];
  if (typeof d.id !== "string" || !ITEM_ID.test(d.id)) errors.push("identifiant absent ou invalide");
  if (!Number.isInteger(d.version) || d.version < 1) errors.push("version absente ou invalide");
  if (typeof d.hash !== "string" || !HASH.test(d.hash)) errors.push("empreinte absente ou invalide");
  if (typeof d.reviewer !== "string" || d.reviewer.trim().length < 2) errors.push("relecteur absent ou invalide");
  errors.push(...timestampErrors(d));
  return errors;
}

export function removalDecisionErrors(d) {
  const errors = [];
  if (!d || typeof d !== "object" || Array.isArray(d)) return ["décision invalide : objet attendu"];
  if (typeof d.id !== "string" || !ITEM_ID.test(d.id)) errors.push("identifiant absent ou invalide");
  if (typeof d.reviewer !== "string" || d.reviewer.trim().length < 2) errors.push("relecteur absent ou invalide");
  errors.push(...timestampErrors(d));
  return errors;
}

/** Structural checks for lifecycle-reset entries (undone) and rejections. */
export function minorDecisionErrors(d) {
  const errors = [];
  if (!d || typeof d !== "object" || Array.isArray(d)) return ["décision invalide : objet attendu"];
  if (typeof d.id !== "string" || !ITEM_ID.test(d.id)) errors.push("identifiant absent ou invalide");
  if (typeof d.reviewer !== "string" || d.reviewer.trim().length < 2) errors.push("relecteur absent ou invalide");
  errors.push(...timestampErrors(d));
  if (d.decision === "rejected" && (typeof d.reason !== "string" || d.reason.trim().length < 3)) errors.push("motif de rejet absent ou trop court");
  return errors;
}

export function reviewLogErrors(log) {
  if (!log || typeof log !== "object" || Array.isArray(log)) return ["journal invalide : objet attendu"];
  if (!Array.isArray(log.decisions)) return ["champ decisions absent ou invalide : tableau attendu"];
  return [];
}

/**
 * Pure core of the review gate, over in-memory data.
 *
 * Every item must match a human decision in the log. The matching entry is the latest
 * approving decision for the item's id, compared by parsed instant (logs mix timezone
 * formats, so string order is not chronological). It must carry the item's version, its
 * reviewer, the item's own reviewedAt, and the content fingerprint (EagRules.contentHash)
 * of exactly what was approved. An « undone » decision cancels only the immediately
 * preceding decision for the same id in chronological order. Cancelling a rejection
 * therefore leaves an older bank approval intact.
 *
 * @param {object[]} approvedItems items currently in data/approved/
 * @param {{ file: string, log: object }[]} logs parsed review-log files, in processing order
 * @returns {{ errors: string[], checked: number, entries: number }}
 */
export function checkReviewLogData(approvedItems, logs) {
  const latest = new Map();
  const lifecycle = new Map();
  const seen = new Map(); // id -> fingerprints already recorded, for exact-duplicate diagnostics
  const timeline = new Map(); // id -> all valid decisions, sorted below by real instant
  let entries = 0;
  let sequence = 0;
  const errors = [];
  for (const { file, log } of logs) {
    const invalidLog = reviewLogErrors(log);
    if (invalidLog.length) { errors.push(`${file} : ${invalidLog.join(" ; ")}`); continue; }
    const decisions = log.decisions;
    for (let i = 0; i < decisions.length; i++) {
      const d = decisions[i];
      entries++;
      const t = d && typeof d.at === "string" ? Date.parse(d.at) : NaN;
      let invalid = [];
      if (d && APPROVING.has(d.decision)) {
        invalid = approvingDecisionErrors(d);
        if (d.decision === "legacy" && path.basename(file) !== LEGACY_BASELINE) invalid.push(`décision legacy autorisée uniquement dans ${LEGACY_BASELINE}`);
        if (invalid.length) { errors.push(`${file} décision ${i + 1} (${d.id || "sans id"}) : ${invalid.join(" ; ")}`); continue; }
        const fingerprint = `${d.version}|${d.hash}|${d.at}|${d.reviewer}`;
        const prior = seen.get(d.id) || [];
        if (prior.includes(fingerprint)) { errors.push(`${file} décision ${i + 1} (${d.id}) : décision dupliquée`); continue; }
        prior.push(fingerprint);
        seen.set(d.id, prior);
      } else if (d && REMOVING.has(d.decision)) {
        invalid = removalDecisionErrors(d);
        if (invalid.length) { errors.push(`${file} décision ${i + 1} (${d.id || "sans id"}) : ${invalid.join(" ; ")}`); continue; }
      } else if (d && MINOR.has(d.decision)) {
        invalid = minorDecisionErrors(d);
        if (invalid.length) { errors.push(`${file} décision ${i + 1} (${d.id || "sans id"}) : ${invalid.join(" ; ")}`); continue; }
      } else {
        errors.push(`${file} décision ${i + 1} (${d?.id || "sans id"}) : type de décision inconnu`);
        continue;
      }
      const list = timeline.get(d.id) || [];
      list.push({ ...d, t, file, sequence: sequence++ });
      timeline.set(d.id, list);
    }
  }

  // Logs are separate files and may be serialized out of order. Resolve each item's
  // history by the parsed instant, using input order only as a deterministic tie-break.
  // An undo cancels the immediately preceding decision for that id—not the latest
  // approval. Thus undoing a rejection is a no-op for the bank, while undoing a
  // re-addition reveals the preceding removal.
  for (const [id, decisions] of timeline) {
    decisions.sort((a, b) => a.t - b.t || a.sequence - b.sequence);
    const cancelled = new Set();
    for (let i = 0; i < decisions.length; i++) {
      if (decisions[i].decision === "undone" && i > 0) cancelled.add(decisions[i - 1].sequence);
    }
    for (const d of decisions) {
      if (d.decision === "undone" || cancelled.has(d.sequence)) continue;
      if (APPROVING.has(d.decision)) {
        latest.set(id, d);
        lifecycle.set(id, d);
      } else if (REMOVING.has(d.decision)) {
        lifecycle.set(id, d);
      }
    }
  }
  let checked = 0;
  const currentIds = new Set();
  for (const item of approvedItems) {
    checked++;
    currentIds.add(item.id);
    const d = latest.get(item.id);
    if (!d) { errors.push(`${item.id} : aucune décision de relecture dans data/review-log/`); continue; }
    if (d.version !== item.version) errors.push(`${item.id} : version ${item.version} approuvée sans décision (journal : version ${d.version}, ${d.file})`);
    else if (d.hash !== EagRules.contentHash(item)) errors.push(`${item.id} : contenu modifié depuis la décision de ${d.reviewer} (${d.file}) ; faites-le relire et approuver à nouveau`);
    if (d.reviewer !== item.reviewer) errors.push(`${item.id} : relecteur « ${item.reviewer} » différent de celui du journal (« ${d.reviewer} »)`);
    if (Date.parse(item.reviewedAt) !== d.t) errors.push(`${item.id} : date de relecture incohérente avec le journal (${d.file})`);
    const last = lifecycle.get(item.id);
    if (last?.decision === "removed") errors.push(`${item.id} : présent dans la banque malgré une décision de retrait plus récente (${last.file})`);
  }
  for (const [id, last] of lifecycle) {
    if (!currentIds.has(id) && last.decision !== "removed") errors.push(`${id} : disparu de la banque sans décision de retrait après son approbation (${last.file})`);
  }
  return { errors, checked, entries };
}

/**
 * Review gate: every item in data/approved/ must match a human decision in data/review-log/.
 *
 * Editing an approved item by hand, or writing items straight into data/approved/ from a
 * script, therefore fails CI until a reviewer approves the new content through
 * promote-candidate or the admin page, which both write the log entry.
 *
 * @returns {{ errors: string[], checked: number, entries: number }}
 */
export function checkReviewLog() {
  const errors = [];
  const logs = [];
  const files = fs.existsSync(LOG_DIR) ? fs.readdirSync(LOG_DIR).filter((f) => f.endsWith(".json")).sort() : [];
  for (const f of files) {
    try { logs.push({ file: f, log: JSON.parse(fs.readFileSync(path.join(LOG_DIR, f), "utf8")) }); } catch (e) { errors.push(`${f} : JSON illisible (${e.message})`); }
  }
  const approvedItems = [];
  for (const f of fs.readdirSync(APPROVED_DIR).filter((x) => x.endsWith(".json")).sort()) {
    for (const item of JSON.parse(fs.readFileSync(path.join(APPROVED_DIR, f), "utf8"))) approvedItems.push(item);
  }
  const core = checkReviewLogData(approvedItems, logs);
  return { errors: [...errors, ...core.errors], checked: core.checked, entries: core.entries };
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
