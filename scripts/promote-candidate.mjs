import fs from "node:fs";
import path from "node:path";
import { validateBank } from "./validate-bank.mjs";
import { loadAndCompileBank, generateBankCode } from "./build-bank.mjs";

const candidateFile = process.argv[2] || (fs.existsSync("generated/latest.txt") ? fs.readFileSync("generated/latest.txt", "utf8").trim() : null);

if (!candidateFile || !fs.existsSync(candidateFile)) {
  console.error("Usage: node scripts/promote-candidate.mjs <generated-file.json>");
  process.exit(1);
}

const reviewFile = candidateFile.replace(/\.json$/, ".review.json");
let reviewDecisions = new Map();
if (fs.existsSync(reviewFile)) {
  try {
    const reviewData = JSON.parse(fs.readFileSync(reviewFile, "utf8"));
    if (Array.isArray(reviewData.reviews)) {
      for (const r of reviewData.reviews) {
        if (r.id && r.decision) reviewDecisions.set(r.id, r.decision);
      }
    }
  } catch (err) {
    console.warn(`Attention: lecture impossible de ${reviewFile}: ${err.message}`);
  }
}

const rawCandidates = JSON.parse(fs.readFileSync(candidateFile, "utf8"));
if (!Array.isArray(rawCandidates)) {
  console.error("Le fichier candidat doit contenir un tableau JSON");
  process.exit(1);
}

let promotedCount = 0;
let skippedCount = 0;

for (const item of rawCandidates) {
  const category = item.category;
  const targetPath = path.join("data/approved", `${category}.json`);

  if (!fs.existsSync(targetPath)) {
    console.warn(`Fichier cible ${targetPath} introuvable, création requise.`);
    continue;
  }

  const existingItems = JSON.parse(fs.readFileSync(targetPath, "utf8"));
  const existingIds = new Set(existingItems.map((x) => x.id));

  if (existingIds.has(item.id)) {
    skippedCount++;
    continue;
  }

  // Si non encore approuvé, promouvoir si revue positive ou passé en paramètre
  const reviewDecision = reviewDecisions.get(item.id);
  if (item.reviewStatus !== "approved" && reviewDecision === "reject") {
    console.log(`- Item ${item.id} rejeté par la revue IA (ignoré)`);
    skippedCount++;
    continue;
  }

  const approvedItem = { ...item, reviewStatus: "approved" };
  existingItems.push(approvedItem);

  const errors = validateBank(existingItems);
  if (errors.length) {
    console.error(`- Item ${item.id} invalide :\n  ${errors.join("\n  ")}`);
    skippedCount++;
    continue;
  }

  fs.writeFileSync(targetPath, JSON.stringify(existingItems, null, 2) + "\n", "utf8");
  promotedCount++;
  console.log(`+ Item ${item.id} (${category}) promu dans ${targetPath}`);
}

if (promotedCount > 0) {
  // Recompiler app.js
  const bank = loadAndCompileBank();
  const targetFile = "app.js";
  const startMarker = "/* QUESTION_BANK_START */";
  const endMarker = "/* QUESTION_BANK_END */";
  const currentSource = fs.readFileSync(targetFile, "utf8");
  const generatedBlock = generateBankCode(bank);
  const regex = new RegExp(`${startMarker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[\\s\\S]*?${endMarker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "m");
  const updatedSource = currentSource.replace(regex, generatedBlock);
  fs.writeFileSync(targetFile, updatedSource, "utf8");
  console.log(`\n🎉 ${promotedCount} items promus et synchronisés dans ${targetFile} !`);
} else {
  console.log(`\nAucun item promu (${skippedCount} ignorés ou déjà existants).`);
}
