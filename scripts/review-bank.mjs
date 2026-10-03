import fs from "node:fs";
import { chat, parseJson, requireAiEnv } from "./lib/ai.mjs";
import { assessBlindReviews } from "./lib/review-rules.mjs";

requireAiEnv();
const file = process.argv[2] || fs.readFileSync("generated/latest.txt", "utf8").trim();
const items = JSON.parse(fs.readFileSync(file, "utf8"));
if (!Array.isArray(items)) throw new Error("Le fichier candidat doit contenir un tableau JSON");

// Blind review: the reviewer model never sees the key, the ratings or the explanations.
const blind = items.map(({ id, category, itemFormat, language, prompt, stimulus, options }) => ({ id, category, itemFormat, language, prompt, stimulus, options }));
const rules = fs.readFileSync("prompts/review-bank.md", "utf8");
const answers = parseJson(await chat([{ role: "system", content: rules }, { role: "user", content: JSON.stringify(blind) }], { temperature: 0 }));
if (!Array.isArray(answers)) throw new Error("Format de revue invalide : tableau attendu");
const reviews = assessBlindReviews(items, answers);

const output = file.replace(/\.json$/, ".review.json");
fs.writeFileSync(output, JSON.stringify({ model: process.env.AI_MODEL, reviewedAt: new Date().toISOString(), reviews }, null, 2) + "\n");
const tally = reviews.reduce((t, r) => ({ ...t, [r.decision]: (t[r.decision] || 0) + 1 }), {});
console.log(`${output} — ${JSON.stringify(tally)}`);
