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

const FORBIDDEN_WORDING = [/question officielle/i, /item officiel/i, /bar[eè]me officiel/i, /confidentiel/i];
const CATCH_ALL_OPTIONS = [/aucun(?:e)?\s+(?:de\s+ces|des)/i, /toutes?\s+les\s+(?:r[ée]ponses|options)/i, /keine\s+der/i, /alle\s+antworten/i];
// Anything that looks like markup or an entity. Item text is rendered as text, never as HTML.
const HTML_LIKE = /<[a-z!/?]|&[a-z]+;|&#\d+;|javascript:/i;

function* strings(value, where) {
  if (typeof value === "string") yield [where, value];
  else if (Array.isArray(value)) for (let i = 0; i < value.length; i++) yield* strings(value[i], `${where}[${i}]`);
  else if (value && typeof value === "object") for (const [k, v] of Object.entries(value)) yield* strings(v, `${where}.${k}`);
}

/** Returns { errors, warnings } for one item. */
export function checkItem(item, index = 0) {
  const ref = item && typeof item === "object" && item.id ? item.id : `item ${index + 1}`;
  const errors = [];
  const warnings = [];

  if (!validateSchema(item)) {
    for (const e of validateSchema.errors) {
      if (e.keyword === "if") continue; // the failing branch is reported separately
      errors.push(`${ref}: ${e.instancePath || "(racine)"} ${e.message}${e.params?.allowedValues ? ` (${e.params.allowedValues.join(", ")})` : ""}`);
    }
  }
  if (!item || typeof item !== "object") return { errors, warnings };

  for (const [where, text] of strings(item, "item")) {
    if (HTML_LIKE.test(text)) errors.push(`${ref}: ${where} contient du HTML ou une entité (texte brut uniquement)`);
  }

  const learnerText = [...strings([item.prompt, item.stimulus, item.options, item.explanation, item.optionRationales], "x")].map(([, t]) => t).join(" ");
  for (const pattern of FORBIDDEN_WORDING) if (pattern.test(learnerText)) errors.push(`${ref}: formulation interdite (${pattern})`);

  const options = Array.isArray(item.options) ? item.options : [];
  const ci = item.correctIndex;
  if (Number.isInteger(ci) && (ci < 0 || ci >= options.length)) errors.push(`${ref}: correctIndex hors des options`);
  if (new Set(options.map((o) => String(o).trim().toLowerCase())).size !== options.length) errors.push(`${ref}: options dupliquées (casse ignorée)`);
  for (const o of options) if (CATCH_ALL_OPTIONS.some((p) => p.test(o))) errors.push(`${ref}: option fourre-tout interdite (« ${o} »)`);
  if (Array.isArray(item.optionRationales) && item.optionRationales.length !== options.length) {
    errors.push(`${ref}: optionRationales doit avoir une entrée par option`);
  }

  if (item.itemFormat === "rating" && Array.isArray(item.ratings) && item.ratings.length === options.length) {
    const max = Math.max(...item.ratings);
    if (max !== 4 || item.ratings.filter((r) => r === 4).length !== 1 || item.ratings[ci] !== 4) {
      errors.push(`${ref}: ratings doit contenir un seul 4, placé à correctIndex`);
    }
    if (new Set(item.ratings).size < 3) warnings.push(`${ref}: ratings utilise moins de 3 valeurs distinctes`);
  }

  if (item.itemFormat !== "tfcs" && options.length >= 3 && Number.isInteger(ci) && options[ci]) {
    const lengths = options.map((o) => o.length);
    const others = lengths.filter((_, i) => i !== ci);
    if (lengths[ci] > 1.4 * Math.max(...others) && lengths[ci] > 25) {
      warnings.push(`${ref}: la bonne réponse est nettement la plus longue (indice involontaire)`);
    }
  }

  if (item.language === "fr" && item.category === "numeric") {
    const text = [...strings([item.prompt, item.stimulus, item.options], "x")].map(([, t]) => t).join(" ");
    if (/\d\.\d/.test(text)) warnings.push(`${ref}: point décimal détecté ; en français, utilisez la virgule (12,5)`);
    if (/\d%/.test(text)) warnings.push(`${ref}: écrivez « 12 % » avec une espace`);
  }

  if (typeof item.explanation === "string" && options[ci] && item.explanation.trim().toLowerCase() === options[ci].trim().toLowerCase()) {
    errors.push(`${ref}: l'explication se contente de répéter la réponse`);
  }
  return { errors, warnings };
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
    "option fourre-tout variante (aucun de ces créneaux)": { ...base, options: ["5", "10", "15", "Aucun de ces créneaux"] },
    "option fourre-tout allemand (keine der)": { ...base, options: ["5", "10", "15", "Keine der Optionen"] },
    "options dupliquées": { ...base, options: ["5", "10", "15", "5"] },
    "optionRationales nombre d'entrées inattendu": { ...base, optionRationales: ["Juste", "Faux"] },
    "formulation interdite (question officielle)": { ...base, prompt: "Voici une question officielle de l'épreuve." },
  };
  const ok = [base, rating].map((x) => JSON.parse(JSON.stringify(x)));
  const r = checkBank(ok);
  if (r.errors.length) throw new Error(`Self-test : items valides rejetés\n${r.errors.join("\n")}`);
  for (const [name, item] of Object.entries(mustFail)) {
    const clean = JSON.parse(JSON.stringify(item));
    if (!checkBank([clean]).errors.length) throw new Error(`Self-test : « ${name} » aurait dû être rejeté`);
  }
  console.log(`Self-test passed (${Object.keys(mustFail).length} cas invalides détectés)`);
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
