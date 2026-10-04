// Self-tests for the browser helpers that can run in Node: calculator parser and chart renderer.
import vm from "node:vm";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
for (const f of ["shared/ui.js", "shared/calculator.js", "shared/chart.js", "shared/timer.js"]) vm.runInThisContext(fs.readFileSync(path.join(ROOT, f), "utf8"), { filename: f });
const { EagCalc, EagChart, EagTimer, EagUI } = globalThis;
const fail = (m) => { console.error(`❌ ${m}`); process.exit(1); };

const ok = [["(1 380 − 1 200) ÷ 1 200 × 100", 15], ["12,5 % × 80", 10], ["-3+4*2", 5], ["2×(3+4)", 14], ["10:4", 2.5], ["0,1+0,2", 0.3]];
for (const [e, v] of ok) if (Math.abs(EagCalc.evaluate(e) - v) > 1e-9) fail(`calculatrice : ${e} ≠ ${v}`);
for (const e of ["1/0", "2+", "(3", "alert(1)", "1..2", "", "2**3", "2x3", "1".repeat(101)]) {
  let threw = false;
  try { EagCalc.evaluate(e); } catch { threw = true; }
  if (!threw) fail(`calculatrice : « ${e.slice(0, 12)}… » aurait dû être refusé`);
}
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const charts = [
  { series: [null] }, { labels: "abc", series: "x" },
  { labels: ["a", "b"], series: [{ name: "x", values: [1e-300, 2e-300] }] },
  { labels: ["a", "b"], series: [{ name: "x", values: [Infinity, "12"] }] },
  { kind: "line", labels: ["<b>", "b"], series: [{ name: "<script>", values: [0, 50] }, { name: "q", values: [20, 40] }] },
];
// Préchauffe le JIT pour éviter les faux positifs de latence au démarrage à froid sur les runners partagés
EagChart.html({ type: "chart", kind: "bar", caption: "warmup", labels: ["a"], series: [{ name: "s", values: [1] }] }, esc);
for (const c of charts) {
  const t = Date.now();
  const h = EagChart.html({ type: "chart", kind: "bar", caption: "<img>", ...c }, esc);
  if (Date.now() - t > 1000) fail("graphique : rendu trop lent (boucle infinie ou régression majeure)");
  if (/<script|<img|<b>/.test(h)) fail("graphique : texte non échappé");
}
const end = EagTimer.deadline(25, 1000);
if (end !== 26000 || EagTimer.secondsLeft(end, 1001) !== 25 || EagTimer.secondsLeft(end, 25501) !== 1 || EagTimer.secondsLeft(end, 27000) !== 0) fail("chronomètre : calcul du temps mural incorrect");

/* EagUI: shared esc + label maps, single-sourced for app.js and admin.js. */
if (!EagUI) fail("shared/ui.js : EagUI absent");
if (EagUI.esc(null) !== "" || EagUI.esc(undefined) !== "") fail("esc : null/undefined doit rendre une chaîne vide");
if (EagUI.esc(0) !== "0" || EagUI.esc(12.5) !== "12.5") fail("esc : les nombres doivent rester lisibles");
if (EagUI.esc("<b>&\"'") !== "&lt;b&gt;&amp;&quot;&#39;") fail("esc : entités incorrectes");
if (EagUI.esc("déjà") !== "déjà") fail("esc : le texte sûr doit rester intact");
if (Object.keys(EagUI.CAT_LABEL).length !== 5) fail("CAT_LABEL : 5 catégories attendues");
if (EagUI.RATING_LABEL.length !== 4) fail("RATING_LABEL : 4 niveaux attendus");
vm.runInThisContext(fs.readFileSync(path.join(ROOT, "bank/app-bank.js"), "utf8"), { filename: "bank/app-bank.js" });
const bank = globalThis.EAG_BANK || {};
const items = Object.values(bank).flat();
if (!items.length) fail("banque compilée : aucun item chargé pour la couverture des libellés");
const skillless = [...new Set(items.filter((x) => x.skill == null).map((x) => x.id))];
if (skillless.length) fail(`banque compilée : items sans compétence — ${skillless.join(", ")}`);
const missing = [...new Set(items.filter((x) => x.skill != null && !EagUI.SKILL_LABEL[x.skill]).map((x) => x.skill))];
if (missing.length) fail(`SKILL_LABEL : compétences sans libellé — ${missing.join(", ")}`);
const unknownCat = Object.keys(bank).filter((c) => !EagUI.CAT_LABEL[c]);
if (unknownCat.length) fail(`CAT_LABEL : catégories sans libellé — ${unknownCat.join(", ")}`);

/* EagUI.zip : écriture ZIP (stockage) au format attendu par les utilitaires unzip. */
{
  const enc = new TextEncoder();
  const files = [{ path: "a/b.json", content: '{"x":1}' }, { path: "c.txt", content: "hello" }];
  const z = EagUI.zip(files);
  if (!(z instanceof Uint8Array) || z.length < 100) fail("zip : sortie trop courte ou de mauvais type");
  const sig = String.fromCharCode(...z.slice(0, 4));
  if (sig !== "PK\x03\x04") fail("zip : signature de fichier local absente");
  const sigPos = z.length - 22; // EOCD : 22 octets, commentaire vide
  const tail = String.fromCharCode(...z.slice(sigPos, sigPos + 4));
  if (tail !== "PK\x05\x06") fail("zip : signature de fin de répertoire central absente");
  const text = String.fromCharCode(...z);
  for (const f of files) if (!text.includes(f.path)) fail(`zip : entrée ${f.path} absente du répertoire central`);
  if (!text.includes("PK\x01\x02")) fail("zip : en-têtes centraux absents");
  const crcHello = EagUI.crc32(enc.encode("hello"));
  const crcBytes = String.fromCharCode(...[0, 1, 2, 3].map((i) => (crcHello >>> (8 * i)) & 0xff));
  if (!text.includes(crcBytes)) fail("zip : crc32 du contenu introuvable dans l'archive");
  const count = z[sigPos + 8] | (z[sigPos + 9] << 8);
  if (count !== 2) fail("zip : nombre d'entrées incorrect dans l'EOCD");
}

console.log(`UI self-test passed (calculatrice : ${ok.length} calculs, 7 refus ; graphiques : ${charts.length} cas limites ; chronomètre mural ; EagUI : ${items.length} items couverts)`);
