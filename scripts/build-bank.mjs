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

export function verifyDocCounters(bank, { readmeContent = null, readmePath = path.join(ROOT, "README.md") } = {}) {
  const errors = [];
  const total = Object.values(bank).reduce((n, items) => n + (Array.isArray(items) ? items.length : 0), 0);
  const readme = readmeContent !== null
    ? readmeContent
    : (fs.existsSync(readmePath) ? fs.readFileSync(readmePath, "utf8") : null);

  if (readme === null) {
    errors.push("README.md introuvable pour vérifier les compteurs documentaires");
    return errors;
  }

  const catMap = [["abstract", "RA"], ["verbal", "RV"], ["numeric", "RN"], ["planning", "PL"], ["situational", "JS"]];
  for (const [cat, code] of catMap) {
    const reg = new RegExp(`\\|\\s*\\*\\*${code}\\*\\*\\s*\\|[^|]*\\|[^|]*\\|[^|]*\\|\\s*(\\d+)\\s*\\|`);
    const m = readme.match(reg);
    const expected = (bank[cat] && Array.isArray(bank[cat])) ? bank[cat].length : 0;
    if (!m) {
      errors.push(`README.md ne contient pas le compteur attendu pour la catégorie ${code}`);
    } else if (Number(m[1]) !== expected) {
      errors.push(`README.md compte ${code} (${m[1]}) ne correspond pas à la banque (${expected})`);
    }
  }

  const totalMatch = readme.match(/\|\s*\*\*Total\*\*\s*\|[^|]*\|[^|]*\|[^|]*\|\s*\*\*(\d+)\*\*\s*\|/);
  if (!totalMatch) {
    errors.push("README.md ne contient pas le compteur total attendu");
  } else if (Number(totalMatch[1]) !== total) {
    errors.push(`README.md total (${totalMatch[1]}) ne correspond pas à la banque (${total})`);
  }

  return errors;
}

export function selfTestDocCounters() {
  const sampleBank = {
    abstract: new Array(110),
    verbal: new Array(110),
    numeric: new Array(146),
    planning: new Array(126),
    situational: new Array(100),
  };

  const validMarkdown = `
| Code | Famille de test | Compétences couvertes | Format d'item | Questions validées |
| :---: | :--- | :--- | :--- | :--- :|
| **RA** | Abstrait | Formes | single_best | 110 |
| **RV** | Verbal | Textes | single_best | 110 |
| **RN** | Numérique | Chiffres | single_best | 146 |
| **PL** | Planification | Agenda | single_best | 126 |
| **JS** | Situationnel | Usager | rating | 100 |
| **Total** | Total | 5 épreuves | — | **592** |
`;

  // 1. Cas nominal : aucune erreur
  const nominal = verifyDocCounters(sampleBank, { readmeContent: validMarkdown });
  if (nominal.length !== 0) {
    throw new Error(`Self-test verifyDocCounters (nominal) a échoué :\n- ${nominal.join("\n- ")}`);
  }

  // 2. Compteur incorrect : catégorie ou total
  const incorrect = validMarkdown.replace("146", "145").replace("**592**", "**591**");
  const incErrors = verifyDocCounters(sampleBank, { readmeContent: incorrect });
  if (!incErrors.some((e) => e.includes("compte RN (145) ne correspond pas")) ||
      !incErrors.some((e) => e.includes("total (591) ne correspond pas"))) {
    throw new Error(`Self-test verifyDocCounters (compteur incorrect) a échoué :\n- ${incErrors.join("\n- ")}`);
  }

  // 3. Compteur absent : ligne catégorie supprimée ou ligne total supprimée
  const missingCat = validMarkdown.replace(/\| \*\*JS\*\* [^\n]*\n/, "");
  const missingCatErrors = verifyDocCounters(sampleBank, { readmeContent: missingCat });
  if (!missingCatErrors.some((e) => e.includes("compteur attendu pour la catégorie JS"))) {
    throw new Error(`Self-test verifyDocCounters (catégorie absente) a échoué :\n- ${missingCatErrors.join("\n- ")}`);
  }

  const missingTotal = validMarkdown.replace(/\| \*\*Total\*\* [^\n]*\n/, "");
  const missingTotalErrors = verifyDocCounters(sampleBank, { readmeContent: missingTotal });
  if (!missingTotalErrors.some((e) => e.includes("compteur total attendu"))) {
    throw new Error(`Self-test verifyDocCounters (total absent) a échoué :\n- ${missingTotalErrors.join("\n- ")}`);
  }

  // 4. Table reformattée ou absente
  const reformatted = "# README\n\nPas de tableau ici, juste du texte libre.\n";
  const refErrors = verifyDocCounters(sampleBank, { readmeContent: reformatted });
  if (refErrors.length < 6) {
    throw new Error(`Self-test verifyDocCounters (table reformattée) a échoué : 6 erreurs attendues, obtenu ${refErrors.length}`);
  }

  // 5. Fichier introuvable
  const missingFileErrors = verifyDocCounters(sampleBank, { readmeContent: null, readmePath: path.join(ROOT, "introuvable.md") });
  if (!missingFileErrors.some((e) => e.includes("introuvable"))) {
    throw new Error(`Self-test verifyDocCounters (fichier introuvable) a échoué :\n- ${missingFileErrors.join("\n- ")}`);
  }

  return true;
}

const isDirectRun = Boolean(process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]));
if (isDirectRun) {
  const check = process.argv.includes("--check");
  const selfTest = process.argv.includes("--self-test");
  if (selfTest) {
    selfTestDocCounters();
    console.log("Doc-counters self-test passed (compteur incorrect, compteur absent, table reformattée)");
  } else {
    selfTestDocCounters();
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
}
