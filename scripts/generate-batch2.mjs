/**
 * Runner for Batch 2: adds 30 validated questions per category (150 total items)
 * Takes each category from 35 to 65 items (total bank: 325 items).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { checkBank } from "./validate-bank.mjs";

import { abstractBatch2 } from "./batch2-abstract.mjs";
import { verbalBatch2 } from "./batch2-verbal.mjs";
import { numericBatch2 } from "./batch2-numeric.mjs";
import { planningBatch2 } from "./batch2-planning.mjs";
import { situationalBatch2 } from "./batch2-situational.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const APPROVED_DIR = path.join(ROOT, "data/approved");

export function run() {
  console.log("Starting Batch 2 generation (150 new items : 30 per category)...");

  const batches = {
    abstract: abstractBatch2,
    verbal: verbalBatch2,
    numeric: numericBatch2,
    planning: planningBatch2,
    situational: situationalBatch2
  };

  let totalAdded = 0;

  for (const [cat, items] of Object.entries(batches)) {
    const file = path.join(APPROVED_DIR, `${cat}.json`);
    const current = JSON.parse(fs.readFileSync(file, "utf8"));
    const existingIds = new Set(current.map(x => x.id));

    const newUniqueItems = [];
    for (const item of items) {
      if (existingIds.has(item.id)) {
        console.warn(`Skipping duplicate ID ${item.id}`);
        continue;
      }
      newUniqueItems.push(item);
    }

    const merged = [...current, ...newUniqueItems];
    const { errors, warnings } = checkBank(merged);
    if (errors.length > 0) {
      throw new Error(`Validation errors in ${cat}:\n- ${errors.join("\n- ")}`);
    }
    if (warnings.length > 0) {
      console.warn(`Warnings in ${cat}:\n- ${warnings.join("\n- ")}`);
    }

    fs.writeFileSync(file, JSON.stringify(merged, null, 2) + "\n");
    console.log(`✅ ${cat}: added ${newUniqueItems.length} items (total: ${merged.length})`);
    totalAdded += newUniqueItems.length;
  }

  console.log(`\n🎉 Success! Added ${totalAdded} total questions across 5 categories.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  run();
}
