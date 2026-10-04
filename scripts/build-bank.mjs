import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { checkBank } from "./validate-bank.mjs";
import { writeFileAtomic } from "./lib/file-transaction.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const APPROVED_DIR = path.join(ROOT, "data/approved");
const TARGET_FILE = path.join(ROOT, "bank/app-bank.js");
const ADMIN_FILE = path.join(ROOT, "bank/admin-bank.js");
const SCHEMA_FILE = path.join(ROOT, "schema/question.schema.json");
const HEADER = "/* Fichier généré par npm run build:bank depuis data/approved/, schema/ et prompts/ : ne pas modifier à la main. */\n";
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
  const full = Object.fromEntries(CATEGORIES.map((c) => [c, []]));
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
      full[item.category].push(item);
    }
  }
  Object.defineProperty(categorized, "full", { value: full, enumerable: false });
  return categorized;
}

/**
 * Reads the prompt templates embedded in admin.js for the offline copy/paste mode.
 * @returns {{ generate: string, revise: string, review: string }} Prompt templates.
 */
function readPrompts() {
  const read = (f) => fs.readFileSync(path.join(ROOT, "prompts", f), "utf8");
  return { generate: read("generate-bank.md"), revise: read("revise-bank.md"), review: read("review-bank.md") };
}

/**
 * Compact bank loaded by eag-a1-academy.html before app.js (classic script, works from file://).
 * @param {Record<string, object[]>} categorized - Compact bank object.
 * @returns {string} JavaScript source.
 */
export function generateBankCode(categorized) {
  return `${HEADER}globalThis.EAG_BANK = Object.freeze(${JSON.stringify(categorized)});\n`;
}

/**
 * Admin data loaded by admin.html before admin.js: JSON Schema, full approved items, prompt templates.
 * @param {Record<string, object[]>} full - Full approved items by category.
 * @returns {string} JavaScript source.
 */
export function generateAdminCode(full) {
  const data = { schema: JSON.parse(fs.readFileSync(SCHEMA_FILE, "utf8")), approved: full, prompts: readPrompts() };
  return `${HEADER}globalThis.EAG_ADMIN_DATA = ${JSON.stringify(data)};\n`;
}

/**
 * Writes bank/app-bank.js and bank/admin-bank.js from data/approved/, the schema and the prompts.
 * In check mode (--check, used in CI) it only verifies that both files are up to date.
 *
 * @param {object} [options]
 * @param {boolean} [options.check=false] - If true, only checks synchronization without writing.
 * @returns {{ total: number, inSync: boolean, bank: Record<string, object[]> }}
 */
export function syncAppJs({ check = false } = {}) {
  const bank = loadAndCompileBank();
  const total = Object.values(bank).reduce((n, items) => n + items.length, 0);
  let inSync = true;
  for (const [file, code] of [[TARGET_FILE, generateBankCode(bank)], [ADMIN_FILE, generateAdminCode(bank.full)]]) {
    const current = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : null;
    if (current !== code) {
      inSync = false;
      if (!check) writeFileAtomic(file, code);
    }
  }
  return { total, inSync, bank };
}

export function verifyDocCounters(bank) {
  const errors = [];
  const total = Object.values(bank).reduce((n, items) => n + items.length, 0);
  const readmePath = path.join(ROOT, "README.md");
  if (fs.existsSync(readmePath)) {
    const readme = fs.readFileSync(readmePath, "utf8");
    const totalMatch = readme.match(/\|\s*\*\*Total\*\*\s*\|[^|]*\|[^|]*\|[^|]*\|\s*\*\*(\d+)\*\*\s*\|/);
    if (totalMatch && Number(totalMatch[1]) !== total) {
      errors.push(`README.md total (${totalMatch[1]}) ne correspond pas à la banque (${total})`);
    }
    const catMap = [["abstract", "RA"], ["verbal", "RV"], ["numeric", "RN"], ["planning", "PL"], ["situational", "JS"]];
    for (const [cat, code] of catMap) {
      const reg = new RegExp(`\\|\\s*\\*\\*${code}\\*\\*\\s*\\|[^|]*\\|[^|]*\\|[^|]*\\|\\s*(\\d+)\\s*\\|`);
      const m = readme.match(reg);
      if (m && Number(m[1]) !== bank[cat].length) {
        errors.push(`README.md compte ${code} (${m[1]}) ne correspond pas à la banque (${bank[cat].length})`);
      }
    }
  }
  return errors;
}

const isDirectRun = Boolean(process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]));
if (isDirectRun) {
  const check = process.argv.includes("--check");
  const { total, inSync, bank } = syncAppJs({ check });
  if (check) {
    if (!inSync) {
      console.error("❌ bank/app-bank.js ou bank/admin-bank.js n'est pas à jour (lancez npm run build:bank)");
      process.exit(1);
    }
    const docErrors = verifyDocCounters(bank);
    if (docErrors.length) {
      console.error("❌ Compteurs documentaires obsolètes dans README.md :\n- " + docErrors.join("\n- "));
      process.exit(1);
    }
    console.log(`✅ Banque vérifiée : ${total} questions synchronisées (documentation à jour).`);
  } else {
    console.log(`✅ Banque compilée dans bank/app-bank.js et bank/admin-bank.js (${total} questions) :`);
    for (const [cat, items] of Object.entries(bank)) console.log(`   - ${cat} : ${items.length}`);
  }
}
