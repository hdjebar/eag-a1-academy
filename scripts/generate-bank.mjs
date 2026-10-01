import fs from "node:fs";
import crypto from "node:crypto";
import { checkBank } from "./validate-bank.mjs";
import { chat, parseJson, requireAiEnv } from "./lib/ai.mjs";

const SKILLS = {
  abstract: ["suite-logique", "matrice", "rotation", "transformation"],
  verbal: ["comprehension", "inference", "application-consigne", "vrai-faux-indetermine", "synthese"],
  numeric: ["pourcentage", "variation", "ratio-proportion", "moyenne", "lecture-tableau", "lecture-graphique", "operations-simples"],
  planning: ["agenda-contraintes", "priorisation", "dependances", "disponibilites", "conflits"],
  situational: ["servir-client-usager", "conseiller"],
};

const category = process.env.CATEGORY || "numeric";
if (!SKILLS[category]) throw new Error(`CATEGORY invalide : ${category} (attendu : ${Object.keys(SKILLS).join(", ")})`);
const rawCount = process.env.COUNT ?? "20";
if (!/^\d+$/.test(rawCount) || Number(rawCount) < 1 || Number(rawCount) > 50) throw new Error(`COUNT invalide : « ${rawCount} » (entier de 1 à 50)`);
const count = Number(rawCount);
const language = process.env.LANGUAGE || "fr";
if (!["fr", "de"].includes(language)) throw new Error(`LANGUAGE invalide : ${language}`);
requireAiEnv();

const existing = fs.existsSync(`data/approved/${category}.json`) ? JSON.parse(fs.readFileSync(`data/approved/${category}.json`, "utf8")) : [];
const now = new Date().toISOString();
const idPrefix = `${category}-gen${now.slice(2, 10).replace(/-/g, "")}`;
const fill = {
  CATEGORY: category,
  COUNT: String(count),
  SKILLS: (process.env.SKILLS || SKILLS[category].join(", ")),
  DIFFICULTY_MIX: process.env.DIFFICULTY_MIX || "",
  LANGUAGE: language,
  ID_PREFIX: idPrefix,
  NOW_ISO: now,
  EXISTING_TOPICS: existing.map((x) => `- ${x.prompt}`).join("\n") || "(aucun)",
  SCHEMA_JSON: fs.readFileSync("schema/question.schema.json", "utf8"),
};
const prompt = fs.readFileSync("prompts/generate-bank.md", "utf8").replace(/\{\{(\w+)\}\}/g, (m, key) => fill[key] ?? m);

const bank = parseJson(await chat([{ role: "user", content: prompt }], { temperature: 0.4 }));
if (!Array.isArray(bank)) throw new Error("La réponse doit être un tableau JSON");

// Fields the pipeline controls, whatever the model wrote.
for (const item of bank) {
  Object.assign(item, { version: 1, language, sourceType: "original_ai_assisted", reviewStatus: "candidate", createdAt: now });
  for (const key of ["reviewer", "reviewedAt", "reviewNotes", "rejectionReason"]) delete item[key];
}

const { errors, warnings } = checkBank(bank);
for (const w of warnings) console.warn(`⚠ ${w}`);
fs.mkdirSync("generated", { recursive: true });
const stamp = now.replace(/[:.]/g, "-");
const file = `generated/${category}-${stamp}-${crypto.randomBytes(3).toString("hex")}.json`;
fs.writeFileSync(file, JSON.stringify(bank, null, 2) + "\n");
if (errors.length) {
  console.error(`❌ ${errors.length} erreur(s) de validation — fichier conservé pour diagnostic : ${file}\n- ${errors.join("\n- ")}`);
  process.exit(1);
}
fs.writeFileSync("generated/latest.txt", file + "\n");
console.log(file);
