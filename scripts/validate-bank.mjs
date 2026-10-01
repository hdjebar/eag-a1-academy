import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const schema = JSON.parse(fs.readFileSync(path.join(ROOT, "schema/question.schema.json"), "utf8"));
const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);
const validateSchema = ajv.compile(schema);

// Same rules file as admin.html (classic script exposing globalThis.EagRules).
import { EagRules } from "./lib/rules.mjs";
const { semanticChecks, validateSchema: miniValidate } = EagRules;

/** Returns { errors, warnings } for one item: JSON Schema (Ajv, authoritative) + shared semantic rules. */
export function checkItem(item, index = 0) {
  const ref = item && typeof item === "object" && item.id ? item.id : `item ${index + 1}`;
  const errors = [];
  if (!validateSchema(item)) {
    for (const e of validateSchema.errors) {
      if (e.keyword === "if") continue; // the failing branch is reported separately
      errors.push(`${ref}: ${e.instancePath || "(racine)"} ${e.message}${e.params?.allowedValues ? ` (${e.params.allowedValues.join(", ")})` : ""}`);
    }
  }
  const sem = semanticChecks(item);
  return { errors: errors.concat(sem.errors.map((m) => `${ref}: ${m}`)), warnings: sem.warnings.map((m) => `${ref}: ${m}`) };
}

/** Returns { errors, warnings } for an array of items. */
export function checkBank(bank) {
  if (!Array.isArray(bank)) return { errors: ["La banque doit être un tableau JSON"], warnings: [] };
  const errors = [];
  const warnings = [];
  bank.forEach((item, i) => {
    const r = checkItem(item, i);
    errors.push(...r.errors);
    warnings.push(...r.warnings);
  });
  const ids = bank.map((x) => x?.id).filter(Boolean);
  const dup = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dup.length) errors.push(`Identifiants dupliqués : ${[...new Set(dup)].join(", ")}`);
  return { errors, warnings };
}

/** Backwards-compatible helper: errors only. */
export function validateBank(bank) {
  return checkBank(bank).errors;
}

function candidateFiles() {
  const dir = path.join(ROOT, "generated");
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((x) => x.endsWith(".json") && !x.endsWith(".review.json")).map((x) => path.join(dir, x));
}

function selfTest() {
  const base = {
    id: "numeric-demo-001", version: 1, category: "numeric", itemFormat: "single_best", skill: "pourcentage",
    difficulty: 1, language: "fr", estimatedSeconds: 40, prompt: "Quel est le résultat du calcul proposé ?",
    stimulus: "Calculez 10 % de 50.", options: ["5", "10", "15", "20"], correctIndex: 0,
    explanation: "Dix pour cent de cinquante valent cinq.", sourceType: "original_ai_assisted",
    reviewStatus: "candidate", createdAt: "2026-10-01T12:00:00+02:00",
  };
  const rating = {
    ...base, id: "situational-demo-001", category: "situational", itemFormat: "rating", skill: "servir-client-usager",
    stimulus: "Un usager se présente avec un dossier incomplet la veille de la date limite.",
    options: ["Vérifier puis indiquer la pièce manquante", "Refuser le dossier sans vérifier", "Promettre une validation", "Renvoyer à la semaine suivante"],
    ratings: [4, 2, 1, 1], correctIndex: 0,
  };
  const mustFail = {
    "HTML dans le stimulus": { ...base, stimulus: "<img src=x onerror=alert(1)>" },
    "entité HTML": { ...base, prompt: "Quel est&nbsp;le résultat du calcul ?" },
    "deux notes maximales": { ...rating, ratings: [4, 4, 1, 1] },
    "situationnel en single_best": { ...rating, itemFormat: "single_best", ratings: undefined },
    "compétence hors liste": { ...base, skill: "calcul-mental" },
    "approuvé sans relecteur": { ...base, reviewStatus: "approved" },
    "préfixe d'id incohérent": { ...base, id: "verbal-demo-001" },
    "option fourre-tout": { ...base, options: ["5", "10", "15", "Aucune de ces réponses"] },
    "champ inconnu": { ...base, extra: 1 },
    "date invalide": { ...base, createdAt: "hier" },
    "stimulus abstrait en texte": { ...base, id: "abstract-demo-001", category: "abstract", skill: "matrice", stimulus: "Série de formes à compléter" },
    "tfcs mal formé": { ...base, id: "verbal-demo-002", category: "verbal", skill: "inference", itemFormat: "tfcs", options: ["Oui", "Non", "Peut-être"] },
  };
  const clone = (x) => JSON.parse(JSON.stringify(x));
  const ok = [base, rating].map(clone);
  const r = checkBank(ok);
  if (r.errors.length) throw new Error(`Self-test : items valides rejetés\n${r.errors.join("\n")}`);
  for (const [name, item] of Object.entries(mustFail)) {
    if (!checkBank([clone(item)]).errors.length) throw new Error(`Self-test : « ${name} » aurait dû être rejeté`);
  }

  // The browser validator (admin.html) must agree with Ajv on every fixture and every approved item.
  const approvedDir = path.join(ROOT, "data/approved");
  const approved = fs.readdirSync(approvedDir).filter((f) => f.endsWith(".json")).flatMap((f) => JSON.parse(fs.readFileSync(path.join(approvedDir, f), "utf8")));
  const corpus = [...ok, ...Object.values(mustFail).map(clone), ...approved];
  for (const item of corpus) {
    const ajvValid = validateSchema(item);
    const miniValid = miniValidate(schema, item).length === 0;
    if (ajvValid !== miniValid) throw new Error(`Self-test : le validateur navigateur et Ajv divergent sur ${item.id} (Ajv ${ajvValid}, navigateur ${miniValid})`);
  }
  console.log(`Self-test passed (${Object.keys(mustFail).length} cas invalides détectés, ${corpus.length} items : validateur navigateur = Ajv)`);
}

const isDirectRun = Boolean(process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]));
if (isDirectRun) {
  const args = process.argv.slice(2);
  if (args.includes("--self-test")) {
    selfTest();
  } else {
    const files = args.length ? args : candidateFiles();
    if (!files.length) console.log("Aucun fichier candidat à valider");
    let failed = false;
    for (const file of files) {
      let bank;
      try {
        bank = JSON.parse(fs.readFileSync(file, "utf8"));
      } catch (e) {
        failed = true;
        console.error(`\n${file}\n- JSON illisible : ${e.message}`);
        continue;
      }
      const { errors, warnings } = checkBank(bank);
      for (const w of warnings) console.warn(`  ⚠ ${file}: ${w}`);
      if (errors.length) {
        failed = true;
        console.error(`\n${file}\n- ${errors.join("\n- ")}`);
      } else console.log(`${file}: valide (${bank.length} items)`);
    }
    if (failed) process.exit(1);
  }
}
