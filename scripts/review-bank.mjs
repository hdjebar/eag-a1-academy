import fs from "node:fs";
import { chat, parseJson, requireAiEnv } from "./lib/ai.mjs";

requireAiEnv();
const file = process.argv[2] || fs.readFileSync("generated/latest.txt", "utf8").trim();
const items = JSON.parse(fs.readFileSync(file, "utf8"));
if (!Array.isArray(items)) throw new Error("Le fichier candidat doit contenir un tableau JSON");

// Blind review: the reviewer model never sees the key, the ratings or the explanations.
const blind = items.map(({ id, category, itemFormat, language, prompt, stimulus, options }) => ({ id, category, itemFormat, language, prompt, stimulus, options }));
const rules = fs.readFileSync("prompts/review-bank.md", "utf8");
const answers = parseJson(await chat([{ role: "system", content: rules }, { role: "user", content: JSON.stringify(blind) }], { temperature: 0 }));
if (!Array.isArray(answers)) throw new Error("Format de revue invalide : tableau attendu");

const REJECT_FLAGS = new Set(["CLAIMS_OFFICIAL", "SENSITIVE_CONTENT"]);
const reviews = items.map((item) => {
  const a = answers.find((x) => x.id === item.id);
  if (!a) return { id: item.id, decision: "revise", issues: ["Absent de la réponse du relecteur IA"] };
  const issues = [];
  const flags = Array.isArray(a.flags) ? a.flags : [];
  if (item.itemFormat === "rating") {
    const r = Array.isArray(a.ratings) ? a.ratings : [];
    const top = r.length ? r.indexOf(Math.max(...r)) : -1;
    if (top !== item.correctIndex) issues.push(`Meilleure réponse selon le relecteur : option ${top + 1}, clé : option ${item.correctIndex + 1}`);
    if (r.length === item.ratings.length) {
      const gap = r.reduce((s, v, i) => s + Math.abs(v - item.ratings[i]), 0) / r.length;
      if (gap > 1) issues.push(`Écart moyen de notation ${gap.toFixed(2)} (> 1)`);
    }
  } else if (a.chosenIndex !== item.correctIndex) {
    issues.push(`Réponse trouvée à l'aveugle : option ${Number(a.chosenIndex) + 1}, clé : option ${item.correctIndex + 1}`);
  }
  if (a.confidence === "low") issues.push("Confiance faible du relecteur");
  issues.push(...flags.map((f) => `Signalement ${f}${a.note ? ` : ${a.note}` : ""}`));
  const decision = flags.some((f) => REJECT_FLAGS.has(f)) ? "reject" : issues.length ? "revise" : "pass";
  return { id: item.id, decision, issues, chosenIndex: a.chosenIndex ?? null, ratings: a.ratings ?? null, confidence: a.confidence ?? null };
});

const output = file.replace(/\.json$/, ".review.json");
fs.writeFileSync(output, JSON.stringify({ model: process.env.AI_MODEL, reviewedAt: new Date().toISOString(), reviews }, null, 2) + "\n");
const tally = reviews.reduce((t, r) => ({ ...t, [r.decision]: (t[r.decision] || 0) + 1 }), {});
console.log(`${output} — ${JSON.stringify(tally)}`);
