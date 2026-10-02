import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { checkBank } from "./validate-bank.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const APPROVED_DIR = path.join(ROOT, "data/approved");
const TARGET_FILE = path.join(ROOT, "app.js");
const ADMIN_FILE = path.join(ROOT, "admin.js");
const SCHEMA_FILE = path.join(ROOT, "schema/question.schema.json");
const ADMIN_START = "/* ADMIN_DATA_START */";
const ADMIN_END = "/* ADMIN_DATA_END */";
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
 * Replaces the text between two markers (markers included) in a source file.
 * @param {string} source - File content.
 * @param {string} start - Start marker.
 * @param {string} end - End marker.
 * @param {string} block - Replacement block, markers included.
 * @param {string} file - File name, for error messages.
 * @returns {string} Updated content.
 */
function replaceBlock(source, start, end, block, file) {
  const a = source.indexOf(start);
  const b = source.indexOf(end);
  if (a === -1 || b === -1 || b < a) throw new Error(`Marqueurs ${start} introuvables dans ${file}`);
  return source.slice(0, a) + block + source.slice(b + end.length);
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
 * Synchronizes the generated blocks of app.js (compact question bank) and admin.js
 * (JSON Schema, full approved bank and prompt templates for the offline admin page).
 *
 * In check mode (--check), it only verifies that both files are identical to what
 * data/approved/, the schema and the prompts would produce, without writing (used in CI).
 *
 * @param {object} [options]
 * @param {boolean} [options.check=false] - If true, only checks synchronization without modifying files.
 * @returns {{ total: number, inSync: boolean, bank: Record<string, object[]> }} Synchronization diagnostics and compiled bank.
 */
export function syncAppJs({ check = false } = {}) {
  const bank = loadAndCompileBank();
  const total = Object.values(bank).reduce((n, items) => n + items.length, 0);
  const targets = [
    [TARGET_FILE, START_MARKER, END_MARKER, generateBankCode(bank)],
    [ADMIN_FILE, ADMIN_START, ADMIN_END, `${ADMIN_START}\nconst SCHEMA = ${JSON.stringify(JSON.parse(fs.readFileSync(SCHEMA_FILE, "utf8")))};\nconst APPROVED_EMBEDDED = ${JSON.stringify(bank.full)};\nconst PROMPTS = ${JSON.stringify(readPrompts())};\n${ADMIN_END}`],
  ];
  let inSync = true;
  for (const [file, start, end, block] of targets) {
    if (!fs.existsSync(file)) continue;
    const source = fs.readFileSync(file, "utf8");
    const updated = replaceBlock(source, start, end, block, path.basename(file));
    if (updated !== source) {
      inSync = false;
      if (!check) fs.writeFileSync(file, updated, "utf8");
    }
  }
  return { total, inSync, bank };
}

const isDirectRun = Boolean(process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]));
if (isDirectRun) {
  const check = process.argv.includes("--check");
  const { total, inSync, bank } = syncAppJs({ check });
  if (check) {
    if (!inSync) {
      console.error("❌ app.js ou admin.js n'est pas synchronisé avec data/approved/ et le schéma (lancez npm run build:bank)");
      process.exit(1);
    }
    console.log(`✅ Banque vérifiée : ${total} questions synchronisées.`);
  } else {
    console.log(`✅ Banque compilée dans app.js et admin.js (${total} questions) :`);
    for (const [cat, items] of Object.entries(bank)) console.log(`   - ${cat} : ${items.length}`);
  }
}
