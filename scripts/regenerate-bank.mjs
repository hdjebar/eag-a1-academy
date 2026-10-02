/**
 * Asks the LLM to revise approved questions. Output: generated/revise-*.json, where each item
 * keeps its id and carries revisionOf; approving it (admin or promote-candidate) replaces the
 * original and bumps its version. Nothing in data/approved is modified here.
 *
 *   IDS=numeric-mean-002,planning-slot-001 INSTRUCTION="…" node scripts/regenerate-bank.mjs
 */
import fs from "node:fs";
import crypto from "node:crypto";
import { checkBank } from "./validate-bank.mjs";
import { chat, requireAiEnv } from "./lib/ai.mjs";
import { EagRules, SCHEMA, loadApproved } from "./lib/rules.mjs";

const ids = (process.env.IDS || process.argv[2] || "").split(",").map((s) => s.trim()).filter(Boolean);
if (!ids.length) throw new Error("IDS manquant : liste d'identifiants séparés par des virgules");
if (ids.length > 50) throw new Error("50 questions au plus par révision");
const instruction = (process.env.INSTRUCTION || "").slice(0, 2000).trim() || "Corriger les problèmes signalés et améliorer la clarté, sans changer ce qui fonctionne.";
requireAiEnv();

const approved = loadApproved();
const originals = ids.map((id) => {
  const item = approved.find((x) => x.id === id);
  if (!item) throw new Error(`Question approuvée introuvable : ${id}`);
  return item;
});

const template = fs.readFileSync("prompts/revise-bank.md", "utf8");
const CHUNK = 8;
const revised = [];
const problems = [];
for (let i = 0; i < originals.length; i += CHUNK) {
  const chunk = originals.slice(i, i + CHUNK);
  const prompt = EagRules.fillTemplate(template, {
    INSTRUCTION: instruction,
    SCHEMA_JSON: JSON.stringify(SCHEMA),
    ITEMS_JSON: JSON.stringify(chunk.map((x) => EagRules.revisionContext(SCHEMA, x)), null, 1),
  });
  console.log(`Révision ${i + 1}–${i + chunk.length} sur ${originals.length}…`);
  const answer = EagRules.extractJson(await chat([{ role: "user", content: prompt }], { temperature: 0.3 }));
  const r = EagRules.prepareCandidates(answer, { mode: "revise", originals: chunk });
  revised.push(...r.items);
  problems.push(...r.problems);
}
for (const p of problems) console.warn(`⚠ ${p}`);
if (!revised.length) throw new Error("Aucune révision exploitable dans la réponse du modèle");

const { errors, warnings } = checkBank(revised);
for (const w of warnings) console.warn(`⚠ ${w}`);
fs.mkdirSync("generated", { recursive: true });
const file = `generated/revise-${new Date().toISOString().replace(/[:.]/g, "-")}-${crypto.randomBytes(3).toString("hex")}.json`;
fs.writeFileSync(file, JSON.stringify(revised, null, 2) + "\n");
fs.writeFileSync("generated/latest.txt", file + "\n");
if (errors.length) console.warn(`⚠ ${errors.length} erreur(s) de validation à corriger avant approbation :\n- ${errors.join("\n- ")}`);
console.log(file);
