// Self-tests for the browser helpers that can run in Node: calculator parser and chart renderer.
import vm from "node:vm";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
for (const f of ["shared/calculator.js", "shared/chart.js"]) vm.runInThisContext(fs.readFileSync(path.join(ROOT, f), "utf8"), { filename: f });
const { EagCalc, EagChart } = globalThis;
const fail = (m) => { console.error(`❌ ${m}`); process.exit(1); };

const ok = [["(1 380 − 1 200) ÷ 1 200 × 100", 15], ["12,5 % × 80", 10], ["-3+4*2", 5], ["2×(3+4)", 14], ["10:4", 2.5], ["0,1+0,2", 0.3]];
for (const [e, v] of ok) if (Math.abs(EagCalc.evaluate(e) - v) > 1e-9) fail(`calculatrice : ${e} ≠ ${v}`);
for (const e of ["1/0", "2+", "(3", "alert(1)", "1..2", "", "2**3"]) {
  let threw = false;
  try { EagCalc.evaluate(e); } catch { threw = true; }
  if (!threw) fail(`calculatrice : « ${e} » aurait dû être refusé`);
}
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const charts = [
  { series: [null] }, { labels: "abc", series: "x" },
  { labels: ["a", "b"], series: [{ name: "x", values: [1e-300, 2e-300] }] },
  { labels: ["a", "b"], series: [{ name: "x", values: [Infinity, "12"] }] },
  { kind: "line", labels: ["<b>", "b"], series: [{ name: "<script>", values: [0, 50] }, { name: "q", values: [20, 40] }] },
];
for (const c of charts) {
  const t = Date.now();
  const h = EagChart.html({ type: "chart", kind: "bar", caption: "<img>", ...c }, esc);
  if (Date.now() - t > 200) fail("graphique : rendu trop lent");
  if (/<script|<img|<b>/.test(h)) fail("graphique : texte non échappé");
}
console.log(`UI self-test passed (calculatrice : ${ok.length} calculs, 7 refus ; graphiques : ${charts.length} cas limites)`);
