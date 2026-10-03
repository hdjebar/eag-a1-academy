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
const { semanticChecks, bankChecks, validateSchema: miniValidate } = EagRules;

/**
 * Validates a single test item: JSON Schema 2020-12 via Ajv (authoritative), then the shared
 * semantic rules of shared/item-rules.js (also used by admin.html).
 *
 * Rules enforced:
 * - Structural schema conformity via Ajv 2020 (types, required fields, enums, per-category formats).
 * - Complete absence of HTML tags, scripts, and entities (plain text only).
 * - Absence of forbidden wording ("question officielle", "confidentiel", etc.).
 * - Correct index bounds and uniqueness of options.
 * - Prohibition of catch-all options ("aucune de ces réponses", "aucun de ces créneaux", "toutes les options").
 * - Parity of optionRationales with options count.
 * - Situational rating rules (exact single 4 placed at correctIndex, 1-4 scale).
 * - Length disproportion heuristic (alerts if target is >1.4x longer than all distractors).
 * - Typographic conventions for French numbers (comma decimal, spaced percentage).
 *
 * @param {object} item - Question item object to validate.
 * @param {number} [index=0] - Item index in batch (used if item.id is missing).
 * @returns {{ errors: string[], warnings: string[] }} Validation diagnostics.
 */
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

/**
 * Validates a collection of question items and checks for dataset-level invariants (such as ID uniqueness).
 * @param {object[]} bank - Array of item objects.
 * @returns {{ errors: string[], warnings: string[] }} Aggregated validation errors and warnings.
 */
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
  const b = bankChecks(bank);
  return { errors: errors.concat(b.errors), warnings: warnings.concat(b.warnings) };
}

/**
 * Backwards-compatible helper returning only the list of validation errors.
 * @param {object[]} bank - Array of item objects.
 * @returns {string[]} List of fatal validation error messages.
 */
export function validateBank(bank) {
  return checkBank(bank).errors;
}

/**
 * Discovers candidate question files in the generated/ directory, excluding reviews.
 * @returns {string[]} Array of absolute file paths to candidate JSON files.
 */
function candidateFiles() {
  const dir = path.join(ROOT, "generated");
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((x) => x.endsWith(".json") && !x.endsWith(".review.json")).map((x) => path.join(dir, x));
}

/**
 * Runs internal self-tests: valid baselines (including legitimate "aucun des…" wording) must pass,
 * every intentional mutation case must be rejected, and the browser validator used by admin.html
 * must give the same verdict as Ajv on all fixtures and approved items.
 * @throws {Error} If a valid item fails, an invalid case is accepted, or the two validators disagree.
 */
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
    "champ inconnu": { ...base, extra: 1 },
    "date invalide": { ...base, createdAt: "hier" },
    "stimulus abstrait en texte": { ...base, id: "abstract-demo-001", category: "abstract", skill: "matrice", stimulus: "Série de formes à compléter" },
    "figure abstraite avec des lettres": { ...base, id: "abstract-demo-002", category: "abstract", skill: "suite-logique", stimulus: { type: "shapes", text: "A  B  C  ?" }, options: ["D", "E", "F", "G"] },
    "figure abstraite avec deux « ? »": { ...base, id: "abstract-demo-003", category: "abstract", skill: "suite-logique", stimulus: { type: "shapes", text: "●  ■  ?  ?" }, options: ["●", "■", "▲", "○"] },
    "figure abstraite avec un idéogramme": { ...base, id: "abstract-demo-004", category: "abstract", skill: "suite-logique", stimulus: { type: "shapes", text: "回  ■  □  ?" }, options: ["●", "■", "▲", "○"] },
    "graphique : séries et étiquettes de longueurs différentes": { ...base, id: "numeric-demo-004", skill: "lecture-graphique", stimulus: { type: "chart", kind: "bar", caption: "Demandes par mois", labels: ["Janv.", "Févr.", "Mars"], series: [{ name: "Demandes", values: [10, 20] }] } },
    "graphique : série nulle (signalée, sans plantage)": { ...base, id: "numeric-demo-006", skill: "lecture-graphique", stimulus: { type: "chart", kind: "bar", caption: "Demandes", labels: ["A", "B"], series: [null] } },
    "graphique : valeur hors bornes": { ...base, id: "numeric-demo-007", skill: "lecture-graphique", stimulus: { type: "chart", kind: "bar", caption: "Demandes", labels: ["A", "B"], series: [{ name: "x", values: [1, 1e12] }] } },
    "graphique : type inconnu": { ...base, id: "numeric-demo-005", skill: "lecture-graphique", stimulus: { type: "chart", kind: "pie", caption: "Répartition", labels: ["A", "B"], series: [{ name: "Part", values: [1, 2] }] } },
    "tfcs mal formé": { ...base, id: "verbal-demo-002", category: "verbal", skill: "inference", itemFormat: "tfcs", options: ["Oui", "Non", "Peut-être"] },
  };
  const clone = (x) => JSON.parse(JSON.stringify(x));
  // Legitimate options that mention "aucun" / "toutes" must stay allowed.
  const mustPass = {
    "conclusion « aucun des agents »": { ...base, id: "verbal-demo-003", category: "verbal", skill: "inference", stimulus: "Aucun agent du service B ne travaille le samedi.", options: ["Aucun des agents du service B ne travaille le samedi.", "Tous les agents travaillent le samedi.", "Certains agents du service B travaillent le samedi.", "Le service B ferme le vendredi."] },
    "graphique en barres": { ...base, id: "numeric-demo-003", skill: "lecture-graphique", stimulus: { type: "chart", kind: "bar", caption: "Demandes traitées par mois", unit: "dossiers", labels: ["Janv.", "Févr.", "Mars"], series: [{ name: "Demandes", values: [120, 135, 150] }] } },
    "contrainte « aucune des deux réunions »": { ...base, id: "planning-demo-001", category: "planning", skill: "conflits", stimulus: "Deux réunions fixes occupent la matinée de 9 h à 12 h.", options: ["Aucune des deux réunions ne peut être déplacée.", "La première réunion peut être avancée.", "La seconde réunion peut être reportée.", "Les deux réunions peuvent être fusionnées."] },
  };
  const ok = [base, rating, ...Object.values(mustPass)].map(clone);
  const r = checkBank(ok);
  if (r.errors.length) throw new Error(`Self-test : items valides rejetés (${Object.keys(mustPass).join(", ")} compris)\n${r.errors.join("\n")}`);
  for (const [name, item] of Object.entries(mustFail)) {
    if (!checkBank([clone(item)]).errors.length) throw new Error(`Self-test : « ${name} » aurait dû être rejeté`);
  }
  // Bank-level rules.
  const fig = { ...base, id: "abstract-demo-010", category: "abstract", skill: "suite-logique", stimulus: { type: "shapes", text: "●  ■  ●  ?" }, options: ["■", "●", "▲", "○"] };
  const bankFail = {
    "même figure abstraite": [fig, { ...fig, id: "abstract-demo-011", prompt: "Autre consigne pour la même figure ?" }],
    "quasi-doublon textuel": [base, { ...base, id: "numeric-demo-002" }],
    "mêmes données de tableau": [
      { ...base, id: "numeric-demo-020", skill: "lecture-tableau", stimulus: { type: "table", headers: ["Service", "2025"], rows: [["A", 10], ["B", 20]] } },
      { ...base, id: "numeric-demo-021", skill: "lecture-tableau", prompt: "Autre question sur le même tableau ?", stimulus: { type: "table", headers: ["Service", "2025"], rows: [["A", 10], ["B", 20]] } },
    ],
    "bonne réponse toujours en position 1": Array.from({ length: 20 }, (_, i) => ({ ...base, id: `numeric-demo-${String(i + 10).padStart(3, "0")}`, stimulus: `Calculez ${i + 10} % de ${i * 37 + 50} unités pour le service ${i}.` })),
  };
  for (const [name, items] of Object.entries(bankFail)) {
    if (!checkBank(items.map(clone)).errors.length) throw new Error(`Self-test : « ${name} » aurait dû être rejeté`);
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
  console.log(`Self-test passed (${Object.keys(mustFail).length + Object.keys(bankFail).length} cas invalides détectés, ${corpus.length} items : validateur navigateur = Ajv)`);
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
