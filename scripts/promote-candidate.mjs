import fs from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";
import { checkBank } from "./validate-bank.mjs";
import { syncAppJs } from "./build-bank.mjs";
import { EagRules } from "./lib/rules.mjs";
import { candidateReviewHash } from "./lib/review-rules.mjs";
import { withFileRollback, writeFileAtomic } from "./lib/file-transaction.mjs";
import { withLock } from "./lib/lockfile.mjs";

const ROOT = path.resolve(".");

const USAGE = `Usage :
  node scripts/promote-candidate.mjs <generated/fichier.json> --reviewer "Prénom Nom" --approve id1,id2[,...]
Options :
  --approve all          approuve tous les items du fichier (choix humain explicite)
  --ignore-ai-review     promeut même si la revue IA est absente ou n'a pas conclu « pass »
  --dry-run              affiche ce qui serait fait, sans rien écrire

Règles : un relecteur humain nommé est obligatoire ; seuls les identifiants listés sont promus ;
par défaut, un item doit avoir reçu la décision « pass » de la revue IA aveugle.`;

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    reviewer: { type: "string" },
    approve: { type: "string" },
    "ignore-ai-review": { type: "boolean", default: false },
    "dry-run": { type: "boolean", default: false },
    help: { type: "boolean", default: false },
  },
});

function fail(message) {
  console.error(`❌ ${message}\n\n${USAGE}`);
  process.exit(1);
}

if (values.help) {
  console.log(USAGE);
  process.exit(0);
}
const candidateFile = positionals[0];
if (!candidateFile || !fs.existsSync(candidateFile)) fail("Fichier candidat introuvable.");
const reviewer = (values.reviewer || "").trim();
if (reviewer.length < 2) fail("--reviewer est obligatoire : la promotion est une décision humaine.");
if (!values.approve) fail("--approve est obligatoire : listez les identifiants retenus (ou « all »).");

const candidates = JSON.parse(fs.readFileSync(candidateFile, "utf8"));
if (!Array.isArray(candidates)) fail("Le fichier candidat doit contenir un tableau JSON.");

const requested = values.approve === "all" ? candidates.map((c) => c.id) : values.approve.split(",").map((s) => s.trim()).filter(Boolean);
const unknown = requested.filter((id) => !candidates.some((c) => c.id === id));
if (unknown.length) fail(`Identifiants absents du fichier candidat : ${unknown.join(", ")}`);

const reviewFile = candidateFile.replace(/\.json$/, ".review.json");
const decisions = new Map();
if (fs.existsSync(reviewFile)) {
  const review = JSON.parse(fs.readFileSync(reviewFile, "utf8"));
  for (const r of review.reviews || []) decisions.set(r.id, r);
} else if (!values["ignore-ai-review"]) {
  fail(`Revue IA introuvable (${reviewFile}). Lancez npm run review:bank, ou utilisez --ignore-ai-review en connaissance de cause.`);
}

const now = new Date().toISOString();
const byCategory = new Map();
const promoted = [];
let blocked = 0;
const logEntries = [];

for (const id of requested) {
  const item = candidates.find((c) => c.id === id);
  const decision = decisions.get(id);
  const reviewCurrent = decision?.candidateHash === candidateReviewHash(item);
  if (!values["ignore-ai-review"] && (decision?.decision !== "pass" || !reviewCurrent)) {
    console.log(`- ${id} : bloqué (revue IA : ${decision?.decision ?? "absente"}${decision && !reviewCurrent ? " — empreinte absente ou obsolète" : ""}${decision?.issues?.length ? ` — ${decision.issues.join(" ; ")}` : ""})`);
    blocked++;
    continue;
  }
  const approved = { ...item, reviewStatus: "approved", reviewer, reviewedAt: now };
  delete approved.rejectionReason;
  const isRevision = Boolean(item.revisionOf);
  delete approved.revisionOf;

  const target = path.join("data/approved", `${item.category}.json`);
  if (!byCategory.has(target)) byCategory.set(target, fs.existsSync(target) ? JSON.parse(fs.readFileSync(target, "utf8")) : []);
  const bank = byCategory.get(target);
  const existingIndex = bank.findIndex((x) => x.id === id);
  if (isRevision) {
    if (existingIndex === -1) {
      console.log(`- ${id} : révision d'une question absente de ${target} (ignoré)`);
      blocked++;
      continue;
    }
    approved.version = (bank[existingIndex].version || 1) + 1;
  } else if (existingIndex !== -1) {
    console.log(`- ${id} : déjà présent dans ${target} (ignoré)`);
    blocked++;
    continue;
  }
  // Item-level checks here; bank-level checks (duplicates, balance) run once on the final banks below.
  const { errors } = checkBank([approved]);
  if (errors.length) {
    console.log(`- ${id} : invalide\n    ${errors.join("\n    ")}`);
    blocked++;
    continue;
  }
  if (isRevision) bank[existingIndex] = approved;
  else bank.push(approved);
  promoted.push(id);
  logEntries.push({
    id, decision: isRevision ? "revised" : "approved", version: approved.version, hash: EagRules.contentHash(approved),
    reviewer, at: now, aiDecision: decision?.decision ?? null, aiOverride: Boolean(values["ignore-ai-review"] && (decision?.decision !== "pass" || !reviewCurrent)),
    file: path.basename(candidateFile),
  });
  console.log(`${isRevision ? "~" : "+"} ${id} (${item.category}) → ${target}${isRevision ? ` (révision, version ${approved.version})` : ""}`);
}

if (!promoted.length) {
  console.log(`\nAucun item promu (${blocked} bloqué(s)).`);
  process.exit(blocked ? 1 : 0);
}
// Bank-level rules (duplicates, answer-position balance) on each final bank. Items named in an
// error are set aside (a revision falls back to the approved version) and the bank is re-checked;
// the run stops without writing only if an error cannot be traced to a promoted item.
for (const [target, bank] of byCategory) {
  const original = fs.existsSync(target) ? JSON.parse(fs.readFileSync(target, "utf8")) : [];
  for (;;) {
    const { errors } = checkBank(bank);
    if (!errors.length) break;
    const culprits = promoted.filter((id) => bank.some((x) => x.id === id) && errors.some((e) => new RegExp(`(^|[^\\w-])${id}([^\\w-]|$)`).test(e)));
    if (!culprits.length) {
      console.error(`❌ ${target} serait invalide après promotion :\n- ${errors.join("\n- ")}\nRien n'a été écrit.`);
      process.exit(1);
    }
    for (const id of culprits) {
      const i = bank.findIndex((x) => x.id === id);
      const before = original.find((x) => x.id === id);
      if (before) bank[i] = before; else bank.splice(i, 1);
      promoted.splice(promoted.indexOf(id), 1);
      logEntries.splice(logEntries.findIndex((e) => e.id === id), 1);
      blocked++;
      console.log(`- ${id} : écarté (${errors.filter((e) => e.includes(id)).join(" ; ")})`);
    }
  }
}
if (!promoted.length) {
  console.log(`\nAucun item promu (${blocked} bloqué(s)).`);
  process.exit(1);
}
if (values["dry-run"]) {
  console.log(`\n(dry-run) ${promoted.length} item(s) seraient promus. Rien n'a été écrit.`);
  process.exit(0);
}

const logFile = path.join("data/review-log", `${now.replace(/[:.]/g, "-")}-promote.json`);
const remaining = candidates.filter((c) => !promoted.includes(c.id));
const touched = [...byCategory.keys(), logFile, candidateFile, reviewFile, "app.js", "admin.js"];
const { total } = await withLock(ROOT, "promote", () => withFileRollback(touched, () => {
  for (const [target, bank] of byCategory) writeFileAtomic(target, JSON.stringify(bank, null, 2) + "\n");
  writeFileAtomic(logFile, JSON.stringify({ reviewer, savedAt: now, mode: "cli", decisions: logEntries }, null, 2) + "\n");
  if (remaining.length) writeFileAtomic(candidateFile, JSON.stringify(remaining, null, 2) + "\n");
  else {
    fs.rmSync(candidateFile);
    if (fs.existsSync(reviewFile)) fs.rmSync(reviewFile);
  }
  return syncAppJs();
}));
console.log(`Journal de relecture : ${logFile}`);
if (remaining.length) console.log(`\n${remaining.length} item(s) restent dans ${candidateFile}. Supprimez le fichier une fois la relecture terminée.`);
else console.log(`\nTous les items traités : ${candidateFile} supprimé.`);
console.log(`🎉 ${promoted.length} item(s) promu(s) par ${reviewer}. app.js resynchronisé (${total} questions).`);
