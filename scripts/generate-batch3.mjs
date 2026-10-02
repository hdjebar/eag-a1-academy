/**
 * Runner for Batch 3: adds 35 validated questions per category (175 total items)
 * Takes each category from 65 to 100 items (total bank: 500 items).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { checkBank } from "./validate-bank.mjs";

import { abstractBatch3 } from "./batch3-abstract.mjs";
import { verbalBatch3 } from "./batch3-verbal.mjs";
import { numericBatch3 } from "./batch3-numeric.mjs";
import { planningBatch3 } from "./batch3-planning.mjs";
import { situationalBatch3 } from "./batch3-situational.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const APPROVED_DIR = path.join(ROOT, "data/approved");

export function run() {
  console.log("Starting Batch 3 generation (175 new items : 35 per category)...");

  const batches = {
    abstract: abstractBatch3,
    verbal: verbalBatch3,
    numeric: numericBatch3,
    planning: planningBatch3,
    situational: situationalBatch3
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
