import fs from "node:fs";
import path from "node:path";

const categories = new Set(["abstract", "verbal", "numeric", "planning", "situational"]);
const statuses = new Set(["candidate", "pending_human", "approved", "rejected"]);
const forbidden = [/question officielle/i, /item officiel/i, /bar[eè]me officiel/i, /confidentiel/i];

export function validateItem(item, index = 0) {
  const errors = [];
  const prefix = `item ${index + 1}`;
  const required = ["id", "category", "skill", "difficulty", "language", "prompt", "stimulus", "options", "correctIndex", "explanation", "sourceType", "reviewStatus"];
  for (const key of required) if (!(key in item)) errors.push(`${prefix}: champ manquant ${key}`);
  if (!/^[a-z]+-[a-z0-9-]+-[0-9]{3,}$/.test(item.id || "")) errors.push(`${prefix}: id invalide`);
  if (!categories.has(item.category)) errors.push(`${prefix}: catégorie invalide`);
  if (!Number.isInteger(item.difficulty) || item.difficulty < 1 || item.difficulty > 3) errors.push(`${prefix}: difficulté invalide`);
  if (item.language !== "fr") errors.push(`${prefix}: langue attendue fr`);
  if (typeof item.prompt !== "string" || item.prompt.trim().length < 12) errors.push(`${prefix}: énoncé trop court`);
  if (!(item.stimulus === null || typeof item.stimulus === "string")) errors.push(`${prefix}: stimulus invalide`);
  if (!Array.isArray(item.options) || item.options.length !== 4) errors.push(`${prefix}: exactement 4 options requises`);
  else if (new Set(item.options.map(x => String(x).trim().toLowerCase())).size !== 4) errors.push(`${prefix}: options dupliquées`);
  if (!Number.isInteger(item.correctIndex) || item.correctIndex < 0 || item.correctIndex > 3) errors.push(`${prefix}: correctIndex invalide`);
  if (typeof item.explanation !== "string" || item.explanation.trim().length < 12) errors.push(`${prefix}: explication trop courte`);
  if (item.sourceType !== "original_ai_assisted") errors.push(`${prefix}: sourceType invalide`);
  if (!statuses.has(item.reviewStatus)) errors.push(`${prefix}: reviewStatus invalide`);
  const text = `${item.prompt || ""} ${item.stimulus || ""} ${item.explanation || ""}`;
  for (const pattern of forbidden) if (pattern.test(text)) errors.push(`${prefix}: formulation interdite (${pattern})`);
  return errors;
}

export function validateBank(bank) {
  if (!Array.isArray(bank)) return ["La banque doit être un tableau JSON"];
  const errors = bank.flatMap((item, index) => validateItem(item, index));
  const ids = bank.map(x => x.id).filter(Boolean);
  if (new Set(ids).size !== ids.length) errors.push("Identifiants dupliqués");
  return errors;
}

function readJson(file) { return JSON.parse(fs.readFileSync(file, "utf8")); }
function candidateFiles() {
  const dir = "generated";
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(x => x.endsWith(".json") && !x.endsWith(".review.json")).map(x => path.join(dir, x));
}

import { fileURLToPath } from "node:url";

const isDirectRun = Boolean(process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]));
if (isDirectRun) {
  const args = process.argv.slice(2);
  if (args.includes("--self-test")) {
    const sample = [{id:"numeric-demo-001",category:"numeric",skill:"pourcentage",difficulty:1,language:"fr",prompt:"Quel est le résultat du calcul proposé ?",stimulus:"10 % de 50",options:["5","10","15","20"],correctIndex:0,explanation:"Dix pour cent de cinquante valent cinq.",sourceType:"original_ai_assisted",reviewStatus:"candidate"}];
    const errors = validateBank(sample);
    if (errors.length) throw new Error(errors.join("\n"));
    console.log("Self-test passed");
  } else {
    const files = args.length ? args : candidateFiles();
    if (!files.length) {
      console.log("Aucun fichier candidat à valider");
    } else {
      let failed = false;
      for (const file of files) {
        const errors = validateBank(readJson(file));
        if (errors.length) { failed = true; console.error(`\n${file}\n- ${errors.join("\n- ")}`); }
        else console.log(`${file}: valide`);
      }
      if (failed) process.exit(1);
    }
  }
}
