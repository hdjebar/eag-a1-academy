// Rule-based generator for numeric (tables and charts) and planning (agenda tables) candidates.
// Every key is computed from the generated data, and each template checks that exactly one
// option is correct. Output goes to generated/ as candidates: blind review and human
// promotion still apply.
//
// Usage: node scripts/generate-data-items.mjs [output.json] [--numeric 32] [--planning 26] [--seed text]
// The default seed is today's date; pass --seed to reproduce a batch. Ids continue after the
// highest id already present in data/approved/ and generated/.
import fs from "node:fs";
import crypto from "node:crypto";
import { parseArgs } from "node:util";
import { EagRules } from "./lib/rules.mjs";
import { knownItems, lastNumber } from "./lib/ids.mjs";

const { values: args, positionals } = parseArgs({
  allowPositionals: true,
  options: { numeric: { type: "string", default: "32" }, planning: { type: "string", default: "26" }, seed: { type: "string", default: `data-items-${new Date().toISOString().slice(0, 10)}` } },
});
const NOW = new Date().toISOString();
let seed = crypto.createHash("sha256").update(args.seed).digest();
let si = 0;
function rnd() { if (si >= 28) { seed = crypto.createHash("sha256").update(seed).digest(); si = 0; } const v = seed.readUInt32BE(si); si += 4; return v / 2 ** 32; }
const ri = (a, b) => a + Math.floor(rnd() * (b - a + 1));
const pick = (a) => a[Math.floor(rnd() * a.length)];
const shuffle = (a) => { const r = [...a]; for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; };
const sample = (a, n) => shuffle(a).slice(0, n);

/* ---------- French number formatting ---------- */
const nf = (v, d = 0) => {
  const s = Math.abs(v).toFixed(d).split(".");
  const int = s[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return (v < 0 ? "−" : "") + int + (d ? "," + s[1] : "");
};
const pct = (v, d = 1) => `${nf(v, d)} %`;
const signedPct = (v, d = 1) => `${v > 0 ? "+" : v < 0 ? "−" : ""}${nf(Math.abs(v), d)} %`;
const listFr = (a) => (a.length < 2 ? a.join("") : `${a.slice(0, -1).join(", ")} et ${a[a.length - 1]}`);
const round = (v, d = 1) => Math.round(v * 10 ** d) / 10 ** d;

const items = [];
const used = new Set();
const KNOWN = knownItems();
const dataKey = (st) => (st.type === "table" ? `t:${JSON.stringify(st.headers || [])}${JSON.stringify(st.rows || [])}` : `c:${JSON.stringify(st.labels || [])}${JSON.stringify(st.series || [])}`);
const KNOWN_DATA = new Set(KNOWN.filter((x) => x.stimulus && (x.stimulus.type === "table" || x.stimulus.type === "chart")).map((x) => dataKey(x.stimulus)));
const counters = {};
function add(category, fam, skill, difficulty, prompt, stimulus, correct, distractors, explanation, rationales) {
  const opts = [correct, ...distractors];
  if (new Set(opts).size !== 4) return false;
  const key = JSON.stringify(stimulus) + prompt;
  if (used.has(key)) return false;
  used.add(key);
  // Keep templated items clearly distinct (the validator rejects similarity >= 0.9).
  const text = `${EagRules.itemText({ category, prompt, stimulus })} ${opts.join(" ")}`;
  if (items.some((x) => x.category === category && EagRules.similarity(text, `${EagRules.itemText(x)} ${x.options.join(" ")}`) >= 0.8)) return false;
  if ((stimulus.type === "table" || stimulus.type === "chart") && KNOWN_DATA.has(dataKey(stimulus))) return false; // same data as an existing item
  const order = shuffle([0, 1, 2, 3]);
  const k = `${category}-${fam}`;
  counters[k] = (counters[k] ?? lastNumber(k, 200, KNOWN)) + 1; // continue after existing ids
  items.push({
    id: `${category}-${fam}-${counters[k]}`, version: 1, category, itemFormat: "single_best", skill, difficulty, language: "fr",
    estimatedSeconds: [0, 50, 90, 130][difficulty], prompt, stimulus,
    options: order.map((i) => opts[i]), correctIndex: order.indexOf(0), explanation,
    optionRationales: order.map((i) => (i === 0 ? `Correct : ${rationales[0]}` : rationales[i])),
    sourceType: "original_ai_assisted", reviewStatus: "candidate", createdAt: NOW,
  });
  return true;
}

/* ================= NUMERIC ================= */
const SERVICES = ["Accueil", "Aides sociales", "Urbanisme", "État civil", "Archives", "Finances", "Ressources humaines", "Informatique", "Voirie", "Environnement", "Culture", "Sports"];
const MONTHS = ["Janv.", "Févr.", "Mars", "Avr.", "Mai", "Juin", "Juil.", "Août", "Sept.", "Oct.", "Nov.", "Déc."];
const QUARTERS = ["T1", "T2", "T3", "T4"];
const OBJECTS = [
  ["Dossiers traités", "dossiers"], ["Demandes reçues", "demandes"], ["Appels au service d'information", "appels"],
  ["Certificats délivrés", "certificats"], ["Courriers enregistrés", "courriers"], ["Visites au guichet", "visites"],
];
const BUDGETS = [["Dépenses de fonctionnement", "milliers d'euros"], ["Crédits engagés", "milliers d'euros"], ["Subventions versées", "milliers d'euros"]];

// T1 — table: total of a row (d1)
function tTotal() {
  const svc = sample(SERVICES, 4), [obj, unit] = pick(OBJECTS), cols = sample([["T1", "T2", "T3"], ["Janv.", "Févr.", "Mars"], ["2024", "2025", "2026"]], 1)[0];
  const rows = svc.map((s) => [s, ...cols.map(() => ri(12, 95) * 10)]);
  const r = pick(rows), total = r.slice(1).reduce((a, b) => a + b, 0);
  const wrongRow = rows.find((x) => x !== r), colTotal = rows.reduce((a, x) => a + x[1], 0);
  return add("numeric", "tab", "lecture-tableau", 1, `Combien de ${unit} le service ${r[0]} totalise-t-il sur les trois périodes ?`,
    { type: "table", caption: `${obj} par service`, headers: ["Service", ...cols], rows },
    `${nf(total)} ${unit}`, [`${nf(total - r[3])} ${unit}`, `${nf(wrongRow.slice(1).reduce((a, b) => a + b, 0))} ${unit}`, `${nf(colTotal)} ${unit}`],
    `Ligne « ${r[0]} » : ${r.slice(1).map((v) => nf(v)).join(" + ")} = ${nf(total)} ${unit}.`,
    ["somme des trois valeurs de la bonne ligne.", "Oublie la troisième période.", `Somme de la ligne « ${wrongRow[0]} ».`, "Somme d'une colonne (tous services) au lieu d'une ligne."]);
}
// T2 — table: percentage change of a row between two columns (d2)
function tChange() {
  const svc = sample(SERVICES, 4), [obj, unit] = pick(BUDGETS.concat(OBJECTS));
  const rows = svc.map((s) => { const a = ri(20, 90) * 20; const b = a + ri(-6, 12) * 20; return [s, a, b === a ? a + 40 : b]; });
  const r = pick(rows), [a, b] = [r[1], r[2]];
  const v = round(((b - a) / a) * 100), inv = round(((b - a) / b) * 100), ratio = round((b / a) * 100);
  if (Math.abs(v - inv) < 0.2) return false;
  const pts = round(((b - a) / ((a + b) / 2)) * 100);
  if (pts === v || pts === inv) return false;
  return add("numeric", "tab", "lecture-tableau", 2, `Quelle est la variation, entre 2025 et 2026, pour le service ${r[0]} ? (arrondie à 0,1 %)`,
    { type: "table", caption: `${obj} par service${unit.includes("euros") ? ` (en ${unit})` : ""}`, headers: ["Service", "2025", "2026"], rows },
    signedPct(v), [signedPct(inv), pct(ratio), signedPct(pts)],
    `Variation = (${nf(b)} − ${nf(a)}) / ${nf(a)} × 100 = ${signedPct(v)} (la base est l'année de départ, 2025).`,
    ["base de départ (2025) correctement utilisée.", "Divise par la valeur d'arrivée (2026) au lieu de la valeur de départ.", "Donne le rapport 2026 / 2025, pas la variation.", "Divise par la moyenne des deux années au lieu de la valeur de départ."]);
}
// T3 — table: share of one row in the column total (d2)
function tShare() {
  const svc = sample(SERVICES, 5), [obj, unit] = pick(OBJECTS);
  const rows = svc.map((s) => [s, ri(8, 60) * 10]);
  const r = pick(rows), total = rows.reduce((a, x) => a + x[1], 0);
  const other = rows.find((x) => x[1] > r[1]);
  if (!other) return false;
  const v = round((r[1] / total) * 100);
  const vsOther = round((r[1] / other[1]) * 100), withoutSelf = round((r[1] / (total - r[1])) * 100);
  return add("numeric", "tab", "lecture-tableau", 2, `Quelle part du total des ${unit} revient au service ${r[0]} ? (arrondie à 0,1 %)`,
    { type: "table", caption: `${obj} en 2026`, headers: ["Service", obj], rows },
    pct(v), [pct(withoutSelf), pct(vsOther), pct(round(100 / rows.length))].filter((x) => x !== pct(v)).slice(0, 3),
    `Total = ${rows.map((x) => nf(x[1])).join(" + ")} = ${nf(total)}. Part = ${nf(r[1])} / ${nf(total)} × 100 = ${pct(v)}.`,
    ["rapport entre la valeur du service et le total de la colonne.", "Divise par le total des autres services seulement.", `Rapporte la valeur à celle du service ${other[0]}.`, "Part égale supposée entre services, sans calcul."]);
}
// T4 — table: highest growth RATE vs highest absolute increase (d3)
function tGrowth() {
  for (let g = 0; g < 50; g++) {
    const svc = sample(SERVICES, 4), [obj] = pick(OBJECTS);
    const rows = svc.map((s) => { const a = ri(10, 80) * 10; return [s, a, a + ri(1, 20) * 10]; });
    const rate = rows.map((x) => (x[2] - x[1]) / x[1]), abs = rows.map((x) => x[2] - x[1]);
    const iR = rate.indexOf(Math.max(...rate)), iA = abs.indexOf(Math.max(...abs));
    const sorted = [...rate].sort((a, b) => b - a);
    if (iR === iA || sorted[0] - sorted[1] < 0.03 || abs.filter((x) => x === abs[iA]).length > 1) continue;
    const highest2026 = rows.reduce((m, x, i) => (x[2] > rows[m][2] ? i : m), 0);
    const others = rows.map((x, i) => i).filter((i) => i !== iR && i !== iA);
    const third = others.includes(highest2026) ? highest2026 : others[0];
    const fourth = others.find((i) => i !== third);
    return add("numeric", "tab", "lecture-tableau", 3, "Quel service connaît la plus forte hausse en pourcentage entre 2025 et 2026 ?",
      { type: "table", caption: `${obj} par service`, headers: ["Service", "2025", "2026"], rows },
      rows[iR][0], [rows[iA][0], rows[third][0], rows[fourth][0]],
      `Taux de hausse : ${rows.map((x, i) => `${x[0]} ${pct(round(rate[i] * 100))}`).join(" ; ")}. Le plus élevé est celui du service ${rows[iR][0]}, même si la plus forte hausse en valeur absolue est celle du service ${rows[iA][0]}.`,
      ["taux de hausse le plus élevé.", "Plus forte hausse en valeur absolue, pas en pourcentage.", "Taux de hausse inférieur à celui du bon service.", "Taux de hausse inférieur à celui du bon service."]);
  }
  return false;
}
// C1 — bar chart: difference between two months (d1)
function cDiff() {
  const [obj, unit] = pick(OBJECTS), months = sample([0, 1, 2, 3, 4, 5, 6, 7, 8], 1)[0];
  const labels = MONTHS.slice(months, months + 5), values = labels.map(() => ri(15, 90) * 10);
  const [i, j] = sample([0, 1, 2, 3, 4], 2).sort((a, b) => a - b);
  if (values[i] === values[j]) return false;
  const d = Math.abs(values[j] - values[i]);
  const k = [0, 1, 2, 3, 4].find((x) => x !== i && x !== j && values[x] !== values[i]);
  if (k === undefined) return false;
  return add("numeric", "chart", "lecture-graphique", 1, `Quel est l'écart entre ${labels[i]} et ${labels[j]} ?`,
    { type: "chart", kind: "bar", caption: `${obj} par mois`, unit, labels, series: [{ name: obj, values }] },
    `${nf(d)} ${unit}`, [`${nf(values[i] + values[j])} ${unit}`, `${nf(Math.abs(values[k] - values[i]))} ${unit}`, `${nf(d + 10)} ${unit}`].filter((x) => x !== `${nf(d)} ${unit}`),
    `${labels[j]} : ${nf(values[j])} ; ${labels[i]} : ${nf(values[i])}. Écart = ${nf(d)} ${unit}.`,
    ["différence entre les deux barres demandées.", "Additionne les deux valeurs au lieu de les soustraire.", `Utilise la barre de ${labels[k]} au lieu de ${labels[j]}.`, "Erreur de lecture d'une des deux barres."]);
}
// C2 — bar chart: average (d2)
function cMean() {
  const [obj, unit] = pick(OBJECTS), q = pick([4, 5, 6]);
  const labels = q === 4 ? QUARTERS : MONTHS.slice(0, q);
  let values = labels.map(() => ri(20, 80) * 10);
  const sum = values.reduce((a, b) => a + b, 0);
  const m = round(sum / q, 1);
  const sorted = [...values].sort((a, b) => a - b);
  const med = q % 2 ? sorted[(q - 1) / 2] : (sorted[q / 2 - 1] + sorted[q / 2]) / 2;
  const fmt = (v) => `${nf(v, 1)} ${unit}`; // same format for every option (no decimal cue)
  if (round(med, 1) === m) return false;
  return add("numeric", "chart", "lecture-graphique", 2, `Quelle est la moyenne ${q === 4 ? "trimestrielle" : "mensuelle"} sur la période représentée ? (arrondie à 0,1)`,
    { type: "chart", kind: "bar", caption: `${obj}${q === 4 ? " par trimestre" : " par mois"}`, unit, labels, series: [{ name: obj, values }] },
    fmt(m), [fmt(round(med, 1)), fmt(round(sum / (q - 1), 1)), fmt(round((sorted[0] + sorted[q - 1]) / 2, 1))].filter((x) => x !== fmt(m)),
    `Somme = ${values.map((v) => nf(v)).join(" + ")} = ${nf(sum)} ; moyenne = ${nf(sum)} / ${q} = ${fmt(m)}.`,
    ["somme divisée par le nombre de périodes.", "Valeur médiane, pas la moyenne.", `Divise par ${q - 1} au lieu de ${q}.`, "Moyenne du minimum et du maximum seulement."]);
}
// C3 — line chart, two series: period with the largest gap (d2)
function cGap() {
  const names = sample(["Service A", "Service B", "Antenne Nord", "Antenne Sud", "Site central"], 2);
  const [obj, unit] = pick(OBJECTS);
  const labels = MONTHS.slice(0, 6);
  for (let g = 0; g < 50; g++) {
    const s1 = labels.map(() => ri(20, 90) * 5), s2 = labels.map(() => ri(20, 90) * 5);
    const gaps = labels.map((_, i) => Math.abs(s1[i] - s2[i]));
    const best = gaps.indexOf(Math.max(...gaps));
    if (gaps.filter((x) => x === gaps[best]).length > 1 || [...gaps].sort((a, b) => b - a)[1] === gaps[best]) continue;
    const hi1 = s1.indexOf(Math.max(...s1)), hi2 = s2.indexOf(Math.max(...s2));
    const pool = [hi1, hi2, ...labels.map((_, i) => i)].filter((i, k, a) => i !== best && a.indexOf(i) === k).slice(0, 3);
    return add("numeric", "chart", "lecture-graphique", 2, `En quel mois l'écart entre ${names[0]} et ${names[1]} est-il le plus grand ?`,
      { type: "chart", kind: "line", caption: `${obj} par mois`, unit, labels, series: [{ name: names[0], values: s1 }, { name: names[1], values: s2 }] },
      labels[best], pool.map((i) => labels[i]),
      `Écarts mensuels : ${labels.map((l, i) => `${l} ${nf(gaps[i])}`).join(" ; ")}. Le plus grand est en ${labels[best].replace(/\.$/, "")}.`,
      ["écart maximal entre les deux courbes.", ...pool.map((i) => (i === hi1 ? `Mois où ${names[0]} atteint son maximum, pas l'écart maximal.` : i === hi2 ? `Mois où ${names[1]} atteint son maximum, pas l'écart maximal.` : `L'écart y est de ${nf(gaps[i])}, inférieur au maximum.`))]);
  }
  return false;
}
// C4 — bar chart: percentage change first → last period (d2/d3)
function cTrend() {
  const [obj, unit] = pick(BUDGETS.concat(OBJECTS));
  const labels = ["2022", "2023", "2024", "2025", "2026"];
  const values = labels.map(() => ri(30, 90) * 10);
  const a = values[0], b = values[4];
  if (a === b) return false;
  const v = round(((b - a) / a) * 100), inv = round(((b - a) / b) * 100), last = round(((b - values[3]) / values[3]) * 100);
  const avg = round(v / 4);
  return add("numeric", "chart", "lecture-graphique", 3, "Quelle est la variation entre 2022 et 2026 ? (arrondie à 0,1 %)",
    { type: "chart", kind: "bar", caption: `${obj} par année`, unit, labels, series: [{ name: obj, values }] },
    signedPct(v), [signedPct(inv), signedPct(last), signedPct(avg)].filter((x, i, arr) => x !== signedPct(v) && arr.indexOf(x) === i),
    `(${nf(b)} − ${nf(a)}) / ${nf(a)} × 100 = ${signedPct(v)}.`,
    ["base de départ 2022 correctement utilisée.", "Divise par la valeur de 2026 au lieu de celle de 2022.", "Variation de la dernière année seulement (2025 → 2026).", "Divise la variation totale par 4, ce qui n'est pas demandé."]);
}
// C5 — two-series bar chart: ratio between series for one period (d2)
function cRatio() {
  const [obj, unit] = pick(OBJECTS);
  const names = ["En ligne", "Au guichet"];
  const labels = QUARTERS;
  const s1 = labels.map(() => ri(10, 60) * 10), s2 = labels.map(() => ri(10, 60) * 10);
  const i = ri(0, 3);
  const total = s1[i] + s2[i];
  const v = round((s1[i] / total) * 100), vs = round((s1[i] / s2[i]) * 100);
  const yearShare = round((s1.reduce((a, b) => a + b, 0) / (s1.reduce((a, b) => a + b, 0) + s2.reduce((a, b) => a + b, 0))) * 100);
  return add("numeric", "chart", "lecture-graphique", 2, `Au ${labels[i]}, quelle part des ${unit} a été traitée en ligne ? (arrondie à 0,1 %)`,
    { type: "chart", kind: "bar", caption: `${obj} selon le canal`, unit, labels, series: [{ name: names[0], values: s1 }, { name: names[1], values: s2 }] },
    pct(v), [pct(vs), pct(yearShare), pct(round(100 - v))].filter((x, k, arr) => x !== pct(v) && arr.indexOf(x) === k),
    `${labels[i]} : ${nf(s1[i])} en ligne et ${nf(s2[i])} au guichet, soit ${nf(total)}. Part en ligne = ${nf(s1[i])} / ${nf(total)} × 100 = ${pct(v)}.`,
    ["part du canal en ligne dans le total du trimestre.", "Rapporte le canal en ligne au guichet au lieu du total.", "Part en ligne sur toute l'année, pas sur le trimestre demandé.", "Part du guichet, pas du canal en ligne."]);
}

/* ================= PLANNING ================= */
const PEOPLE = ["Mme Arendt", "M. Becker", "Mme Costa", "M. Dupont", "Mme Engel", "M. Fischer", "Mme Gomes", "M. Hoffmann", "Mme Ianni", "M. Jacoby"];
const SLOTS = ["8 h 30 – 10 h", "10 h – 11 h 30", "13 h 30 – 15 h", "15 h – 16 h 30"];
const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
const BUSY = ["Réunion", "Guichet", "Formation", "Rendez-vous", "Audience"];

// P1 — common free slot (d1 with 3 people, d2 with 4)
function pSlot(d) {
  for (let g = 0; g < 200; g++) {
    const n = d === 1 ? 3 : 4, ppl = sample(PEOPLE, n);
    const grid = ppl.map(() => SLOTS.map(() => (rnd() < 0.5 ? "Libre" : pick(BUSY))));
    const free = SLOTS.map((_, j) => grid.every((r) => r[j] === "Libre"));
    if (free.filter(Boolean).length !== 1) continue;
    const j = free.indexOf(true);
    const blockers = SLOTS.map((_, k) => ppl.filter((_, i) => grid[i][k] !== "Libre"));
    if (blockers.some((b, k) => k !== j && b.length === 0)) continue;
    return add("planning", "agenda", "disponibilites", d, `Quel créneau permet de réunir ${listFr(ppl)} pendant 1 h 30 ?`,
      { type: "table", caption: "Agenda du mardi", headers: ["Agent", ...SLOTS], rows: ppl.map((p, i) => [p, ...grid[i]]) },
      SLOTS[j], SLOTS.filter((_, k) => k !== j),
      `Seul le créneau ${SLOTS[j]} est libre pour toutes les personnes. ${SLOTS.map((s, k) => (k === j ? null : `${s} : ${blockers[k].join(", ")} indisponible(s)`)).filter(Boolean).join(" ; ")}.`,
      ["toutes les personnes sont libres.", ...SLOTS.filter((_, k) => k !== j).map((s) => { const b = blockers[SLOTS.indexOf(s)]; return `${listFr(b)} ${b.length > 1 ? "ne sont pas libres" : "n'est pas libre"}.`; })]);
  }
  return false;
}
// P2 — room and slot for a meeting of N people (d2)
function pRoom() {
  for (let g = 0; g < 300; g++) {
    const rooms = sample([["Salle Moselle", 8], ["Salle Sûre", 12], ["Salle Alzette", 20], ["Salle Our", 6], ["Salle Wiltz", 30], ["Salle Clerve", 10], ["Salle Attert", 16], ["Salle Eisch", 24]], pick([3, 4]));
    const day = pick(["lundi", "mardi", "mercredi", "jeudi", "vendredi"]);
    const need = ri(7, 22);
    const grid = rooms.map(() => SLOTS.map(() => (rnd() < 0.45 ? "Libre" : "Réservée")));
    const valid = [];
    rooms.forEach((r, i) => SLOTS.forEach((s, j) => { if (grid[i][j] === "Libre" && r[1] >= need) valid.push([i, j]); }));
    if (valid.length !== 1) continue;
    const [vi, vj] = valid[0];
    const tooSmall = []; const booked = [];
    rooms.forEach((r, i) => SLOTS.forEach((s, j) => { if (grid[i][j] === "Libre" && r[1] < need) tooSmall.push([i, j]); else if (grid[i][j] !== "Libre" && r[1] >= need) booked.push([i, j]); }));
    if (tooSmall.length < 1 || booked.length < 1) continue;
    const ds = [...sample(tooSmall, Math.min(2, tooSmall.length)), ...sample(booked, 2)].slice(0, 3);
    if (ds.length < 3) continue;
    const lab = ([i, j]) => `${rooms[i][0]}, ${SLOTS[j]}`;
    return add("planning", "salle", "conflits", 2, `Le ${day}, vous devez organiser une réunion de ${need} participants d'une durée d'1 h 30. Quelle salle et quel créneau conviennent ?`,
      { type: "table", caption: `Réservations des salles, ${day}`, headers: ["Salle (places)", ...SLOTS], rows: rooms.map((r, i) => [`${r[0]} (${r[1]})`, ...grid[i]]) },
      lab(valid[0]), ds.map(lab),
      `Il faut au moins ${need} places et un créneau libre. Seule la ${rooms[vi][0]} (${rooms[vi][1]} places) est libre à ${SLOTS[vj]} parmi les salles assez grandes.`,
      ["salle assez grande et libre sur ce créneau.", ...ds.map(([i, j]) => (grid[i][j] !== "Libre" ? `${rooms[i][0]} est réservée sur ce créneau.` : `${rooms[i][0]} n'a que ${rooms[i][1]} places.`))]);
  }
  return false;
}
// P3 — two consecutive days when two people are both present (d2/d3)
function pDays(d) {
  for (let g = 0; g < 300; g++) {
    const ppl = sample(PEOPLE, d === 3 ? 3 : 2);
    const grid = ppl.map(() => DAYS.map(() => (rnd() < 0.7 ? "Présent" : pick(["Congé", "Télétravail", "Mission"]))));
    const ok = DAYS.slice(0, 4).map((_, i) => grid.every((r) => r[i] === "Présent" && r[i + 1] === "Présent"));
    if (ok.filter(Boolean).length !== 1) continue;
    const i = ok.indexOf(true);
    const pairs = DAYS.slice(0, 4).map((x, k) => `${x} et ${DAYS[k + 1]}`);
    const cause = (k) => { const out = []; ppl.forEach((p, a) => [k, k + 1].forEach((dd) => { if (grid[a][dd] !== "Présent") out.push(`${p} (${grid[a][dd].toLowerCase()} le ${DAYS[dd].toLowerCase()})`); })); return out.join(", "); };
    const ev = pick(["Un atelier", "Une formation", "Un audit des comptes", "Une session de recrutement", "Un séminaire de service", "Un inventaire des archives"]);
    return add("planning", "semaine", "agenda-contraintes", d, `${ev} se déroule sur deux jours consécutifs, sur place, avec ${listFr(ppl)}. Quels jours conviennent ?`,
      { type: "table", caption: pick(["Présence prévue la semaine prochaine", "Planning de présence de l'équipe", "Calendrier de la semaine 42", "Présences et absences prévues"]), headers: ["Agent", ...DAYS], rows: ppl.map((p, a) => [p, ...grid[a]]) },
      pairs[i], pairs.filter((_, k) => k !== i),
      `Il faut deux jours consécutifs où chacun est « Présent ». Seuls ${pairs[i].toLowerCase()} remplissent la condition.`,
      ["tous les participants sont présents les deux jours.", ...pairs.map((_, k) => k).filter((k) => k !== i).map((k) => `Absence : ${cause(k)}.`)]);
  }
  return false;
}
// P4 — one agent, tasks with prerequisites: earliest end of a task (d3)
function pDeps() {
  for (let g = 0; g < 200; g++) {
    const names = sample(["collecte des pièces", "vérification des montants", "rédaction de la note", "relecture juridique", "mise en signature", "envoi aux usagers", "mise à jour du registre", "préparation du tableau", "contrôle qualité", "archivage"], 5);
    const dur = names.map(() => pick([30, 45, 60, 90]));
    // prerequisites: random DAG respecting alphabetical order
    const pre = names.map((_, i) => (i === 0 ? [] : sample(names.slice(0, i).map((_, k) => k), ri(0, Math.min(2, i)))));
    const target = ri(3, 4);
    // tasks needed for target (transitive closure)
    const need = new Set(); const visit = (i) => { if (need.has(i)) return; need.add(i); pre[i].forEach(visit); }; visit(target);
    if (need.size < 3) continue;
    const start = pick([8 * 60, 8 * 60 + 30, 9 * 60, 13 * 60 + 30]);
    const total = [...need].reduce((a, i) => a + dur[i], 0);
    const end = start + total;
    const allTotal = start + dur.reduce((a, b) => a + b, 0);
    const onlyTarget = start + dur[target];
    const directOnly = start + dur[target] + pre[target].reduce((a, i) => a + dur[i], 0);
    const hm = (m) => `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, "0")}`;
    const opts = [hm(end), hm(allTotal), hm(directOnly), hm(onlyTarget)];
    if (new Set(opts).size !== 4) continue;
    const cap = (t) => t[0].toUpperCase() + t.slice(1);
    const rows = names.map((n, i) => [cap(n), `${dur[i]} min`, pre[i].length ? pre[i].map((k) => cap(names[k])).join(", ") : "—"]);
    return add("planning", "taches", "dependances", 3, `Vous commencez à ${hm(start)} et traitez les tâches l'une après l'autre, sans pause. Une tâche ne peut commencer qu'une fois ses prérequis terminés. À quelle heure, au plus tôt, la tâche « ${names[target]} » peut-elle être terminée ?`,
      { type: "table", caption: "Liste des tâches", headers: ["Tâche", "Durée", "Prérequis"], rows },
      opts[0], opts.slice(1),
      `La tâche « ${names[target]} » exige, directement ou indirectement : ${[...need].filter((i) => i !== target).sort().map((i) => names[i]).join(", ")}. Durée cumulée : ${[...need].sort().map((i) => `${dur[i]}`).join(" + ")} = ${total} min, soit une fin à ${hm(end)}. Les autres tâches peuvent attendre.`,
      ["seules les tâches nécessaires sont faites avant.", "Fait toutes les tâches avant, y compris celles qui ne sont pas nécessaires.", "Oublie les prérequis indirects (prérequis des prérequis).", "Ignore tous les prérequis."]);
  }
  return false;
}

/* ---------- Assemble ---------- */
function fill(n, makers) {
  let made = 0, attempt = 0;
  while (made < n && attempt < n * 50) if (makers[attempt++ % makers.length]()) made++;
}
const numericN = Number(args.numeric), planningN = Number(args.planning);
// numeric: about 60 % charts, 40 % tables, with level-1 items
fill(Math.round(numericN * 0.4), [tTotal, tChange, tShare, tGrowth, tTotal]);
fill(numericN - Math.round(numericN * 0.4), [cDiff, cMean, cGap, cTrend, cRatio, cDiff]);
fill(planningN, [() => pSlot(1), pRoom, () => pDays(2), pDeps, () => pSlot(2), () => pDays(3)]);

// Labels such as « Oct. » must not produce « Oct.. » at the end of a sentence.
const tidy = (v) => (typeof v === "string" ? v.replace(/\.\.(?=\s|$)/g, ".") : Array.isArray(v) ? v.map(tidy) : v && typeof v === "object" ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, tidy(x)])) : v);
items.forEach((x, i) => { items[i] = tidy(x); });
const file = positionals[0] || `generated/data-items-${NOW.slice(0, 10)}.json`;
fs.writeFileSync(file, JSON.stringify(items, null, 2) + "\n");
const by = (k) => items.reduce((m, x) => ((m[`${x.category}:${x[k]}`] = (m[`${x.category}:${x[k]}`] || 0) + 1), m), {});
console.log(`${file} : ${items.length} items`, by("skill"), by("difficulty"));
