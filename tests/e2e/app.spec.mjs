// End-to-end tests of the learner application (eag-a1-academy.html).
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

/** Fails the test on any page error or console error. */
function watchErrors(page) {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  return errors;
}
/** Replaces the compiled bank with a small fixture bank. */
async function useBank(page, bank) {
  await page.route("**/bank/app-bank.js", (r) => r.fulfill({ contentType: "text/javascript", body: `globalThis.EAG_BANK=${JSON.stringify(bank)};` }));
}
const item = (id, extra) => ({ id, f: "single_best", skill: "pourcentage", difficulty: 1, p: `Question ${id} ?`, s: "Texte du stimulus assez long pour le test.", o: ["Alpha", "Bravo", "Charlie", "Delta"], a: 2, e: "Explication.", x: ["r-Alpha", "r-Bravo", "r-Charlie", "r-Delta"], ...extra });
const emptyBank = { abstract: [], verbal: [], numeric: [], planning: [], situational: [] };
/** Current question as the app sees it (after option shuffling). */
const current = (page) => page.evaluate(() => { const s = state.session; return { ...s.questions[s.index], index: s.index, n: s.questions.length }; });

test("l'application se charge sans erreur et toutes les vues s'ouvrent @mobile", async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto("/eag-a1-academy.html");
  for (const route of ["entrainement", "simulation", "ressources", "methode", "accueil"]) {
    await page.evaluate((r) => route(r), route);
    await expect(page.locator(`#v-${route}`)).toBeVisible();
  }
  expect(errors).toEqual([]);
});

test("ouverture directe du fichier (file://) avec la banque complète", async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto(pathToFileURL(path.join(ROOT, "eag-a1-academy.html")).href);
  const counts = await page.evaluate(() => Object.fromEntries(Object.entries(q).map(([k, v]) => [k, v.length])));
  for (const n of Object.values(counts)) expect(n).toBeGreaterThan(0);
  await page.click('[data-start="diagnostic"]');
  await expect(page.locator("#question .qprompt")).toBeVisible();
  expect(errors).toEqual([]);
});

test("une banque absente affiche une erreur explicite", async ({ page }) => {
  await page.route("**/bank/app-bank.js", (r) => r.fulfill({ contentType: "text/javascript", body: "" }));
  await page.goto("/eag-a1-academy.html");
  await expect(page.getByRole("alert")).toContainText("banque de questions est indisponible");
  await expect(page.locator(".module")).toHaveCount(0);
});

test("des données d'administration présentes mais vides affichent une erreur explicite", async ({ page }) => {
  await page.route("**/bank/admin-bank.js", (r) => r.fulfill({ contentType: "text/javascript", body: "" }));
  await page.goto("/admin.html");
  await expect(page.getByRole("alert")).toContainText("Données d'administration indisponibles");
  await expect(page.getByRole("alert")).toContainText("présent, non vide et à jour");
});

test("shared/ui.js absent : message explicite dans l'application et l'administration", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.route("**/shared/ui.js", (r) => r.fulfill({ contentType: "text/javascript", body: "" }));
  await page.goto("/eag-a1-academy.html");
  await expect(page.getByRole("alert")).toContainText("shared/ui.js");
  await expect(page.locator(".module")).toHaveCount(0);
  await page.goto("/admin.html");
  await expect(page.getByRole("alert")).toContainText("Interface indisponible");
  expect(errors).toEqual([]);
});

test("shared/session.js absent : message explicite dans l'application", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.route("**/shared/session.js", (r) => r.fulfill({ contentType: "text/javascript", body: "" }));
  await page.goto("/eag-a1-academy.html");
  await expect(page.getByRole("alert")).toContainText("shared/session.js");
  await expect(page.locator(".module")).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("des règles de validation absentes affichent une erreur explicite", async ({ page }) => {
  await page.route("**/shared/item-rules.js", (r) => r.fulfill({ contentType: "text/javascript", body: "" }));
  await page.goto("/admin.html");
  await expect(page.getByRole("alert")).toContainText("Règles de validation indisponibles");
  await expect(page.getByRole("alert")).not.toContainText("Données d'administration");
});

test("entraînement : bonne réponse, erreur avec justification, question passée, bilan", async ({ page }) => {
  await useBank(page, { ...emptyBank, numeric: [item("n1"), item("n2"), item("n3")] });
  const errors = watchErrors(page);
  await page.goto("/eag-a1-academy.html#entrainement");
  await page.click('[data-size="all"]');
  await page.click('[data-module="numeric"]');

  let x = await current(page); // 1: right answer (options are shuffled: find the key's position)
  await page.locator(".option").nth(x.a).click();
  await page.click("#validate");
  await expect(page.locator("#feedback")).toContainText("Bonne réponse");
  await expect(page.locator(".option").nth(x.a)).toContainText("Charlie");
  await page.click("#validate");

  x = await current(page); // 2: wrong answer shows the rationale of the chosen option
  const wrong = (x.a + 1) % 4;
  await page.locator(".option").nth(wrong).click();
  await page.click("#validate");
  await expect(page.locator("#feedback")).toContainText("À revoir");
  await expect(page.locator("#feedback .why")).toContainText(`r-${x.o[wrong]}`);
  await page.click("#validate");

  await page.click("#pass"); // 3: skipped
  await expect(page.locator("#v-results")).toBeVisible();
  await expect(page.locator("#score")).toHaveText("33%");
  await expect(page.locator("#review .review-item")).toHaveCount(3);
  expect(errors).toEqual([]);
});

test("jugement situationnel : notation 1 à 4 et concordance", async ({ page }) => {
  await useBank(page, { ...emptyBank, situational: [{ id: "s1", f: "rating", skill: "conseiller", difficulty: 2, p: "Évaluez.", s: "Scénario de test.", o: ["A", "B", "C", "D"], a: 0, r: [4, 1, 2, 3], e: "Explication." }] });
  await page.goto("/eag-a1-academy.html#entrainement");
  await page.click('[data-module="situational"]');
  const x = await current(page);
  for (let i = 0; i < 4; i++) await page.locator(`input[name=r${i}][value="${x.r[i]}"]`).check({ force: true });
  await page.click("#validate");
  await expect(page.locator("#feedback")).toContainText("100 % de concordance");
});

test("examen blanc : le temps d'un test écoulé ouvre le test suivant", async ({ page }) => {
  await page.clock.install();
  await page.goto("/eag-a1-academy.html#simulation");
  await page.click('[data-start="examen"]');
  await expect(page.locator("#question")).toContainText("Test 1 sur 5");
  await page.click("#startsection");
  await expect(page.locator("#question .qprompt")).toBeVisible();
  await page.clock.runFor(24 * 60 * 1000 + 2000);
  await expect(page.locator("#question")).toContainText("Test 2 sur 5");
  const unanswered = await page.evaluate(() => state.session.answers.filter((a) => a && a.choice === null).length);
  expect(unanswered).toBe(10);
});

test("examen blanc : 5 tests de 10 questions, dans l'ordre fixé par l'application", async ({ page }) => {
  await page.goto("/eag-a1-academy.html#simulation");
  await page.click('[data-start="examen"]');
  const sections = await page.evaluate(() => state.session.exam.sections.map((s) => [s.cat, s.to - s.from + 1]));
  expect(sections).toEqual([["abstract", 10], ["verbal", 10], ["numeric", 10], ["planning", 10], ["situational", 10]]);
});

test("calculatrice : présente sur les questions numériques seulement", async ({ page }) => {
  await page.goto("/eag-a1-academy.html#entrainement");
  await page.click('[data-module="numeric"]');
  await page.fill("#calc-input", "(1 380 − 1 200) ÷ 1 200 × 100");
  await page.click('.calc-keys [data-k="="]');
  await expect(page.locator("#calc-out")).toHaveText("= 15");
  page.on("dialog", (d) => d.accept());
  await page.evaluate(() => route("entrainement"));
  await page.click('[data-module="verbal"]');
  await expect(page.locator("#calc-input")).toHaveCount(0);
});

test("stimulus : tableau, graphique et figures", async ({ page }) => {
  await useBank(page, {
    ...emptyBank,
    numeric: [
      item("t1", { s: { type: "table", caption: "Tableau test", headers: ["Service", "2025"], rows: [["A", 1200], ["B", 800]] } }),
      item("c1", { skill: "lecture-graphique", s: { type: "chart", kind: "bar", caption: "Graphique test", labels: ["Janv.", "Févr."], series: [{ name: "Dossiers", values: [120, 150] }] } }),
    ],
    abstract: [item("a1", { skill: "matrice", s: { type: "shapes", text: "●  ■\n■  ?" }, o: ["●", "■", "▲", "○"] })],
  });
  await page.goto("/eag-a1-academy.html#entrainement");
  await page.click('[data-size="all"]');
  await page.click('[data-module="numeric"]');
  for (let i = 0; i < 2; i++) {
    const x = await current(page);
    if (x.id === "t1") await expect(page.locator("table.data caption")).toHaveText("Tableau test");
    else { await expect(page.locator("figure.chart svg")).toBeVisible(); await expect(page.locator("figure.chart table.sr td").first()).toHaveText("120"); }
    await page.click("#pass");
  }
  await page.evaluate(() => route("entrainement"));
  await page.click('[data-module="abstract"]');
  await expect(page.locator(".shapes")).toContainText("■");
});

test("un texte malveillant s'affiche tel quel, sans être exécuté", async ({ page }) => {
  const evil = "<img src=x onerror=\"window.__xss=1\"><script>window.__xss=2</script>";
  await useBank(page, { ...emptyBank, verbal: [item("v1", { skill: "inference", p: evil, s: evil, o: [evil, "B", "C", "D"], e: evil })] });
  await page.goto("/eag-a1-academy.html#entrainement");
  await page.click('[data-module="verbal"]');
  await expect(page.locator("#question .qprompt")).toHaveText(evil);
  await page.locator(".option").first().click();
  await page.click("#validate");
  expect(await page.evaluate(() => window.__xss)).toBeUndefined();
  expect(await page.locator("#question img, #question script").count()).toBe(0);
});

test("mise en page mobile : pas de défilement horizontal @mobile", async ({ page }) => {
  await page.goto("/eag-a1-academy.html");
  for (const step of ["accueil", "entrainement", "ressources", "session"]) {
    if (step === "session") { await page.evaluate(() => route("entrainement")); await page.click('[data-module="numeric"]'); }
    else await page.evaluate((r) => route(r), step);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, `défilement horizontal sur « ${step} »`).toBeLessThanOrEqual(1);
  }
});

for (const scheme of ["light", "dark"]) {
  test.describe(`accessibilité (${scheme})`, () => {
    test(`aucune violation grave ou critique (axe, thème ${scheme})`, async ({ page }) => {
      page.on("dialog", (d) => d.accept());
      // No animation: axe must measure final colours, not a view fading in.
      await page.emulateMedia({ colorScheme: scheme, reducedMotion: "reduce" });
      await page.goto("/eag-a1-academy.html");
      const screens = [["accueil"], ["entrainement"], ["simulation"], ["ressources"], ["methode"], ["session", "numeric"], ["session", "situational"]];
      for (const [name, mod] of screens) {
        if (mod) { await page.evaluate(() => route("entrainement")); await page.click(`[data-module="${mod}"]`); }
        else await page.evaluate((r) => route(r), name);
        const { violations } = await new AxeBuilder({ page }).include("main").analyze();
        const serious = violations.filter((v) => ["serious", "critical"].includes(v.impact)).map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`);
        expect(serious, `écran « ${name}${mod ? ` ${mod}` : ""} »`).toEqual([]);
      }
    });
  });
}
