import fs from "node:fs";
import crypto from "node:crypto";
import { checkBank } from "./validate-bank.mjs";
import { chat, requireAiEnv } from "./lib/ai.mjs";
import { EagRules, CATEGORIES } from "./lib/rules.mjs";

const SKILLS = {
  abstract: ["suite-logique", "matrice", "rotation", "transformation"],
  verbal: ["comprehension", "inference", "application-consigne", "vrai-faux-indetermine", "synthese"],
  numeric: ["pourcentage", "variation", "ratio-proportion", "moyenne", "lecture-tableau", "lecture-graphique", "operations-simples"],
  planning: ["agenda-contraintes", "priorisation", "dependances", "disponibilites", "conflits"],
  situational: ["servir-client-usager", "conseiller"],
};

const category = process.env.CATEGORY || "numeric";
if (!CATEGORIES.includes(category)) throw new Error(`CATEGORY invalide : ${category} (attendu : ${CATEGORIES.join(", ")})`);
const rawCount = process.env.COUNT ?? "20";
if (!/^\d+$/.test(rawCount) || Number(rawCount) < 1 || Number(rawCount) > 50) throw new Error(`COUNT invalide : « ${rawCount} » (entier de 1 à 50)`);
const count = Number(rawCount);
const language = process.env.LANGUAGE || "fr";
if (!["fr", "de"].includes(language)) throw new Error(`LANGUAGE invalide : ${language}`);
const instruction = (process.env.INSTRUCTION || "").slice(0, 2000).trim();
const prefix = /^[a-z0-9]+$/.test(process.env.ID_TAG || "") ? process.env.ID_TAG : "gen";
requireAiEnv();

const existing = fs.existsSync(`data/approved/${category}.json`) ? JSON.parse(fs.readFileSync(`data/approved/${category}.json`, "utf8")) : [];
const now = new Date().toISOString();
const idPrefix = `${category}-${prefix}${now.slice(2, 10).replace(/-/g, "")}${now.slice(11, 13)}${now.slice(14, 16)}`;
const prompt = EagRules.fillTemplate(fs.readFileSync("prompts/generate-bank.md", "utf8"), {
  CATEGORY: category,
  COUNT: String(count),
  SKILLS: process.env.SKILLS || SKILLS[category].join(", "),
  DIFFICULTY_MIX: process.env.DIFFICULTY_MIX || "",
  LANGUAGE: language,
  ID_PREFIX: idPrefix,
  NOW_ISO: now,
  EXTRA_INSTRUCTIONS: instruction || "(aucune)",
  EXISTING_TOPICS: existing.map((x) => `- ${x.prompt}`).join("\n") || "(aucun)",
  SCHEMA_JSON: fs.readFileSync("schema/question.schema.json", "utf8"),
});

const answer = EagRules.extractJson(await chat([{ role: "user", content: prompt }], { temperature: 0.4 }));
const { items: bank, problems } = EagRules.prepareCandidates(answer, { mode: "new", now, language });
for (const p of problems) console.warn(`⚠ ${p}`);
if (!bank.length) throw new Error("Aucun item exploitable dans la réponse du modèle");

const { errors, warnings } = checkBank(bank);
for (const w of warnings) console.warn(`⚠ ${w}`);
fs.mkdirSync("generated", { recursive: true });
const file = `generated/${category}-${now.replace(/[:.]/g, "-")}-${crypto.randomBytes(3).toString("hex")}.json`;
fs.writeFileSync(file, JSON.stringify(bank, null, 2) + "\n");
fs.writeFileSync("generated/latest.txt", file + "\n");
if (errors.length) console.warn(`⚠ ${errors.length} erreur(s) de validation à corriger avant approbation :\n- ${errors.join("\n- ")}`);
console.log(file);
