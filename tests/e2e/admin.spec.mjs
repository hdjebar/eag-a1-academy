// End-to-end test of the local admin (npm run admin): blind-review queue, approve, reject,
// save to the repository, then the CI review gate on the result. Runs on a temporary copy.
import { test, expect } from "@playwright/test";
import { spawn, execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
let dir, server, adminUrl;

const candidate = (n, prompt, stimulus, options, correctIndex) => ({
  id: `numeric-e2e-00${n}`, version: 1, category: "numeric", itemFormat: "single_best", skill: "pourcentage", difficulty: 1, language: "fr",
  estimatedSeconds: 40, prompt, stimulus, options, correctIndex,
  explanation: "Calcul détaillé de la réponse attendue pour ce test de bout en bout.",
  optionRationales: options.map((o, i) => (i === correctIndex ? "Correct : calcul exact." : "Erreur de calcul.")),
  sourceType: "original_ai_assisted", reviewStatus: "candidate", createdAt: "2026-10-03T08:00:00+02:00",
});

test.beforeAll(async () => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), "eag-admin-e2e-"));
  for (const f of ["admin.html", "admin.js", "app.js", "eag-a1-academy.html", "package.json", "bank", "data", "schema", "shared", "scripts", "prompts"]) {
    fs.cpSync(path.join(ROOT, f), path.join(dir, f), { recursive: true });
  }
  fs.symlinkSync(path.join(ROOT, "node_modules"), path.join(dir, "node_modules"));
  fs.mkdirSync(path.join(dir, "generated"));
  const items = [
    candidate(1, "Quel est le montant après une hausse de 15 % d'un loyer de 820 euros ?", "Un loyer mensuel de 820 euros augmente de 15 % au 1er janvier.", ["943 euros", "835 euros", "963 euros", "923 euros"], 0),
    candidate(2, "Combien de jours ouvrés faut-il pour traiter 96 dossiers à 8 dossiers par jour ?", "Une équipe traite chaque jour ouvré 8 dossiers d'aide au logement ; 96 dossiers sont en attente.", ["10 jours", "12 jours", "14 jours", "8 jours"], 1),
  ];
  fs.writeFileSync(path.join(dir, "generated/e2e.json"), JSON.stringify(items, null, 2));
  fs.writeFileSync(path.join(dir, "generated/e2e.review.json"), JSON.stringify({ model: "fixture", reviews: items.map((x) => ({ id: x.id, decision: "pass", issues: [], chosenIndex: x.correctIndex })) }, null, 2));

  server = spawn(process.execPath, ["scripts/admin-server.mjs"], { cwd: dir, env: { ...process.env, ADMIN_PORT: String(4400 + Math.floor(Math.random() * 400)) } });
  adminUrl = await new Promise((resolve, reject) => {
    let out = "";
    const timer = setTimeout(() => reject(new Error(`serveur d'administration muet : ${out}`)), 15000);
    server.stdout.on("data", (d) => { out += d; const m = /http:\/\/127\.0\.0\.1:\d+\/admin\.html#token=\S+/.exec(out); if (m) { clearTimeout(timer); resolve(m[0]); } });
    server.stderr.on("data", (d) => { out += d; });
  });
});

test.afterAll(() => { server?.kill(); if (dir) fs.rmSync(dir, { recursive: true, force: true }); });

test.setTimeout(90_000);
test("administration : approuver, rejeter, enregistrer, puis contrôle de relecture", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(adminUrl);
  await expect(page.locator("#queuecount")).toHaveText("2", { timeout: 20000 });
  await page.fill("#reviewer", "Relecteur E2E");

  await page.locator('[data-key*="numeric-e2e-001"]').click();
  await page.click("#approve");
  await expect(page.locator('[data-key*="numeric-e2e-001"]')).toContainText("Approuvé"); // the page then moves on to the next item

  await page.locator('[data-key*="numeric-e2e-002"]').click();
  await page.fill("#reason", "Test de rejet");
  await page.click("#reject");
  await expect(page.locator('[data-key*="numeric-e2e-002"]')).toContainText("Rejeté");

  await page.click('[data-tab="export"]');
  await page.click("#save");
  await expect(page.locator("body")).toContainText("recompilés", { timeout: 15000 });

  const numeric = JSON.parse(fs.readFileSync(path.join(dir, "data/approved/numeric.json"), "utf8"));
  const approved = numeric.find((x) => x.id === "numeric-e2e-001");
  expect(approved?.reviewer).toBe("Relecteur E2E");
  expect(numeric.some((x) => x.id === "numeric-e2e-002")).toBe(false);
  expect(fs.readFileSync(path.join(dir, "bank/app-bank.js"), "utf8")).toContain("numeric-e2e-001");
  // The decision written by the admin page satisfies the CI review gate.
  execFileSync(process.execPath, ["scripts/check-review-log.mjs"], { cwd: dir, stdio: "pipe" });
  expect(errors).toEqual([]);
});
