import fs from "node:fs";

for (const key of ["AI_API_URL", "AI_API_KEY", "AI_MODEL"]) if (!process.env[key]) throw new Error(`${key} manquant`);
const file = process.argv[2] || fs.readFileSync("generated/latest.txt", "utf8").trim();
const bank = fs.readFileSync(file, "utf8");
const rules = fs.readFileSync("prompts/review-bank.md", "utf8");
const response = await fetch(process.env.AI_API_URL, {method:"POST",headers:{"content-type":"application/json","authorization":`Bearer ${process.env.AI_API_KEY}`},body:JSON.stringify({model:process.env.AI_MODEL,temperature:0,messages:[{role:"system",content:rules},{role:"user",content:bank}]})});
if (!response.ok) throw new Error(`AI API ${response.status}: ${await response.text()}`);
const payload = await response.json();
let content = payload.choices?.[0]?.message?.content ?? payload.output_text;
if (!content) throw new Error("Réponse de revue vide");
content = content.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
const review = JSON.parse(content);
if (!Array.isArray(review.reviews)) throw new Error("Format de revue invalide");
const allowed = new Set(["pass","revise","reject"]);
for (const item of review.reviews) if (!item.id || !allowed.has(item.decision) || !Array.isArray(item.issues)) throw new Error("Entrée de revue invalide");
const output = file.replace(/\.json$/, ".review.json");
fs.writeFileSync(output, JSON.stringify(review, null, 2) + "\n");
console.log(output);
