import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { checkBank } from "./validate-bank.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const APPROVED_DIR = path.join(ROOT, "data/approved");
const TARGET_FILE = path.join(ROOT, "app.js");
const START_MARKER = "/* QUESTION_BANK_START */";
const END_MARKER = "/* QUESTION_BANK_END */";
const CATEGORIES = ["abstract", "verbal", "numeric", "planning", "situational"];

/**
 * Reads all category files in data/approved/, executes deterministic validation via checkBank,
 * verifies that all items are in approved status and extracts the minified question representation
 * used for zero-latency in-memory runtime execution by app.js.
 *
 * @returns {Record<string, object[]>} Object mapping each category key to its array of compact question objects.
 * @throws {Error} If any validation error, duplicate ID, or unapproved item is detected.
 */
export function loadAndCompileBank() {
  if (!fs.existsSync(APPROVED_DIR)) throw new Error(`Le dossier ${APPROVED_DIR} est introuvable`);
  const files = fs.readdirSync(APPROVED_DIR).filter((f) => f.endsWith(".json")).sort();
  if (!files.length) throw new Error(`Aucun fichier JSON trouvé dans ${APPROVED_DIR}`);

  const categorized = Object.fromEntries(CATEGORIES.map((c) => [c, []]));
  const ids = new Set();
  for (const f of files) {
    const file = path.join(APPROVED_DIR, f);
    const content = JSON.parse(fs.readFileSync(file, "utf8"));
    const { errors } = checkBank(content);
    if (errors.length) throw new Error(`Erreurs de validation dans ${f} :\n- ${errors.join("\n- ")}`);
    for (const item of content) {
      if (item.reviewStatus !== "approved") throw new Error(`L'item ${item.id} dans ${f} n'est pas au statut "approved"`);
      if (ids.has(item.id)) throw new Error(`Identifiant dupliqué : ${item.id}`);
      ids.add(item.id);
      const compact = {
        id: item.id, f: item.itemFormat, skill: item.skill, difficulty: item.difficulty,
        p: item.prompt, s: item.stimulus, o: item.options, a: item.correctIndex, e: item.explanation,
      };
      if (item.ratings) compact.r = item.ratings;
      if (item.optionRationales) compact.x = item.optionRationales;
      categorized[item.category].push(compact);
    }
  }
  return categorized;
}

/**
 * Wraps the categorized question data in delimiting markers for static embedding.
 * @param {Record<string, object[]>} categorized - Compact bank object.
 * @returns {string} JavaScript code snippet with delimiters.
 */
export function generateBankCode(categorized) {
  return `${START_MARKER}\nconst q = ${JSON.stringify(categorized)};\n${END_MARKER}`;
}

/**
 * Synchronizes the question bank block inside app.js.
 *
 * In check mode (--check), it validates that app.js is strictly identical to data/approved/
 * without writing to disk (used during CI validation).
 *
 * @param {object} [options]
 * @param {boolean} [options.check=false] - If true, only checks synchronization without modifying app.js.
 * @returns {{ total: number, inSync: boolean, bank: Record<string, object[]> }} Synchronization diagnostics and compiled bank.
 */
export function syncAppJs({ check = false } = {}) {
  const bank = loadAndCompileBank();
  const total = Object.values(bank).reduce((n, items) => n + items.length, 0);
  const source = fs.readFileSync(TARGET_FILE, "utf8");
  const start = source.indexOf(START_MARKER);
  const end = source.indexOf(END_MARKER);
  if (start === -1 || end === -1 || end < start) throw new Error(`Marqueurs de banque introuvables dans ${TARGET_FILE}`);
  const updated = source.slice(0, start) + generateBankCode(bank) + source.slice(end + END_MARKER.length);
  const inSync = updated === source;
  if (!check && !inSync) fs.writeFileSync(TARGET_FILE, updated, "utf8");
  return { total, inSync, bank };
}

const isDirectRun = Boolean(process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]));
if (isDirectRun) {
  const check = process.argv.includes("--check");
  const { total, inSync, bank } = syncAppJs({ check });
  if (check) {
    if (!inSync) {
      console.error("❌ app.js n'est pas synchronisé avec data/approved/ (lancez npm run build:bank)");
      process.exit(1);
    }
    console.log(`✅ Banque vérifiée : ${total} questions synchronisées.`);
  } else {
    console.log(`✅ Banque compilée dans app.js (${total} questions) :`);
    for (const [cat, items] of Object.entries(bank)) console.log(`   - ${cat} : ${items.length}`);
  }
}
