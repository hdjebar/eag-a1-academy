import fs from "node:fs";
import path from "node:path";
import { validateBank } from "./validate-bank.mjs";

const APPROVED_DIR = "data/approved";
const TARGET_FILE = "app.js";
const START_MARKER = "/* QUESTION_BANK_START */";
const END_MARKER = "/* QUESTION_BANK_END */";

export function loadAndCompileBank() {
  if (!fs.existsSync(APPROVED_DIR)) {
    throw new Error(`Le dossier ${APPROVED_DIR} est introuvable`);
  }

  const files = fs
    .readdirSync(APPROVED_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => path.join(APPROVED_DIR, f));

  if (!files.length) {
    throw new Error(`Aucun fichier JSON trouvé dans ${APPROVED_DIR}`);
  }

  const allItems = [];
  const categorized = {
    abstract: [],
    verbal: [],
    numeric: [],
    planning: [],
    situational: [],
  };

  for (const file of files) {
    const content = JSON.parse(fs.readFileSync(file, "utf8"));
    const errors = validateBank(content);
    if (errors.length) {
      throw new Error(`Erreurs de validation dans ${file} :\n- ${errors.join("\n- ")}`);
    }

    for (const item of content) {
      if (item.reviewStatus !== "approved") {
        throw new Error(`L'item ${item.id} dans ${file} n'est pas au statut "approved"`);
      }
      if (!categorized[item.category]) {
        throw new Error(`Catégorie inconnue ${item.category} pour l'item ${item.id}`);
      }

      allItems.push(item);
      categorized[item.category].push({
        id: item.id,
        p: item.prompt,
        s: item.stimulus,
        o: item.options,
        a: item.correctIndex,
        e: item.explanation,
        skill: item.skill,
        difficulty: item.difficulty,
      });
    }
  }

  const ids = allItems.map((x) => x.id);
  if (new Set(ids).size !== ids.length) {
    throw new Error("Des identifiants de questions dupliqués ont été détectés");
  }

  return categorized;
}

export function generateBankCode(categorized) {
  return `${START_MARKER}\nconst q = ${JSON.stringify(categorized)};\n${END_MARKER}`;
}

const isCheck = process.argv.includes("--check");
const bank = loadAndCompileBank();
const total = Object.values(bank).reduce((acc, cur) => acc + cur.length, 0);

if (!fs.existsSync(TARGET_FILE)) {
  throw new Error(`Fichier cible ${TARGET_FILE} introuvable`);
}

const currentSource = fs.readFileSync(TARGET_FILE, "utf8");
const generatedBlock = generateBankCode(bank);

let updatedSource;
if (currentSource.includes(START_MARKER) && currentSource.includes(END_MARKER)) {
  const regex = new RegExp(`${escapeRegex(START_MARKER)}[\\s\\S]*?${escapeRegex(END_MARKER)}`, "m");
  updatedSource = currentSource.replace(regex, generatedBlock);
} else if (/const q\s*=\s*\{[\s\S]*?\};/.test(currentSource)) {
  updatedSource = currentSource.replace(/const q\s*=\s*\{[\s\S]*?\};/, generatedBlock);
} else {
  throw new Error("Impossible de localiser la banque de questions dans " + TARGET_FILE);
}

function escapeRegex(string) {
  return string.replace(/[/\-\\^$*+?.()|[\]{}]/g, "\\$&");
}

if (isCheck) {
  if (currentSource !== updatedSource) {
    console.error("❌ app.js n'est pas synchronisé avec data/approved/");
    process.exit(1);
  }
  console.log(`✅ Banque vérifiée : ${total} questions synchronisées.`);
} else {
  fs.writeFileSync(TARGET_FILE, updatedSource, "utf8");
  console.log(`✅ Banque compilée avec succès dans ${TARGET_FILE} (${total} questions) :`);
  for (const [cat, items] of Object.entries(bank)) {
    console.log(`   - ${cat} : ${items.length} questions`);
  }
}
