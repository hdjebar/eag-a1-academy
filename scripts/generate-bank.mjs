import fs from "node:fs";
import crypto from "node:crypto";
import { validateBank } from "./validate-bank.mjs";

const category = process.env.CATEGORY || "numeric";
const count = Math.min(50, Math.max(1, Number(process.env.COUNT || 20)));
const allowed = new Set(["abstract", "verbal", "numeric", "planning", "situational"]);
if (!allowed.has(category)) throw new Error("CATEGORY invalide");
for (const key of ["AI_API_URL", "AI_API_KEY", "AI_MODEL"]) if (!process.env[key]) throw new Error(`${key} manquant`);

const rules = fs.readFileSync("prompts/generate-bank.md", "utf8");
const schema = fs.readFileSync("schema/question.schema.json", "utf8");
const prompt = `${rules}\n\nGenerate ${count} items for category: ${category}.\nJSON Schema:\n${schema}`;
const response = await fetch(process.env.AI_API_URL, {method:"POST",headers:{"content-type":"application/json","authorization":`Bearer ${process.env.AI_API_KEY}`},body:JSON.stringify({model:process.env.AI_MODEL,temperature:0.4,messages:[{role:"system",content:"Return valid JSON only."},{role:"user",content:prompt}]})});
if (!response.ok) throw new Error(`AI API ${response.status}: ${await response.text()}`);
const payload = await response.json();
let content = payload.choices?.[0]?.message?.content ?? payload.output_text;
if (!content) throw new Error("Réponse IA vide ou format de fournisseur incompatible");
content = content.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
const bank = JSON.parse(content);
const errors = validateBank(bank);
if (errors.length) throw new Error(errors.join("\n"));
fs.mkdirSync("generated", {recursive:true});
const stamp = new Date().toISOString().replace(/[:.]/g,"-");
const file = `generated/${category}-${stamp}-${crypto.randomBytes(3).toString("hex")}.json`;
fs.writeFileSync(file, JSON.stringify(bank, null, 2) + "\n");
fs.writeFileSync("generated/latest.txt", file + "\n");
console.log(file);
