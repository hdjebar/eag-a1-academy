// Rule-based generator for abstract-reasoning candidates (figures only).
// Every key is computed, and the answer of each transformation item is checked to be the same
// under every rule consistent with the examples (rotations, mirrors including diagonals, fill).
// Output goes to generated/ as candidates: blind review and human promotion still apply.
//
// Usage: node scripts/generate-abstract-figures.mjs [output.json] [--target 100] [--seed text]
import fs from "node:fs";
import crypto from "node:crypto";
import { parseArgs } from "node:util";

const { values: args, positionals } = parseArgs({ allowPositionals: true, options: { target: { type: "string", default: "100" }, seed: { type: "string", default: "abstract-audit-2026-10-02" } } });
const NOW = new Date().toISOString();
let seed = crypto.createHash("sha256").update(args.seed).digest();
let si = 0;
function rnd() { if (si >= 28) { seed = crypto.createHash("sha256").update(seed).digest(); si = 0; } const v = seed.readUInt32BE(si); si += 4; return v / 2 ** 32; }
const ri = (n) => Math.floor(rnd() * n);
const pick = (a) => a[ri(a.length)];
const shuffle = (a) => { const r = [...a]; for (let i = r.length - 1; i > 0; i--) { const j = ri(i + 1); [r[i], r[j]] = [r[j], r[i]]; } return r; };
const mod = (a, n) => ((a % n) + n) % n;

const ARROWS = ["↑", "↗", "→", "↘", "↓", "↙", "←", "↖"]; // clockwise, 45° steps
const ARROW_NAME = ["vers le haut", "en haut à droite", "vers la droite", "en bas à droite", "vers le bas", "en bas à gauche", "vers la gauche", "en haut à gauche"];
const TRI = { f: ["▲", "▶", "▼", "◀"], e: ["△", "▷", "▽", "◁"] }; // up, right, down, left (clockwise)
const QUAD = ["◰", "◳", "◲", "◱"]; // filled quarter: top-left, top-right, bottom-right, bottom-left (clockwise)
const QUAD_NAME = ["en haut à gauche", "en haut à droite", "en bas à droite", "en bas à gauche"];
const PLAIN = { circle: ["●", "○"], square: ["■", "□"], diamond: ["◆", "◇"] };
const PLAIN_NAME = { circle: "disque", square: "carré", diamond: "losange" };

const items = [];
const seen = new Set();
const counters = {};
function add(fam, skill, difficulty, prompt, text, correct, distractors, explanation, rationales) {
  const key = text.replace(/\s+/g, " ").trim();
  if (seen.has(key)) return false;
  const opts = [correct, ...distractors];
  if (new Set(opts).size !== 4 || opts.some((o) => !o || o.includes("?"))) return false;
  seen.add(key);
  const order = shuffle([0, 1, 2, 3]);
  counters[fam] = (counters[fam] || 100) + 1;
  items.push({
    id: `abstract-${fam}-${counters[fam]}`, version: 1, category: "abstract", itemFormat: "single_best", skill, difficulty, language: "fr",
    estimatedSeconds: [0, 45, 75, 110][difficulty], prompt, stimulus: { type: "shapes", text },
    options: order.map((i) => opts[i]), correctIndex: order.indexOf(0), explanation,
    optionRationales: order.map((i) => (i === 0 ? `Correct : ${rationales[0]}` : rationales[i])),
    sourceType: "original_ai_assisted", reviewStatus: "candidate", createdAt: NOW,
  });
  return true;
}
const SEP = "     ";

/* ---------- A. Arrow rotation series (rotation) ---------- */
function arrowSeries(target) {
  let made = 0, guard = 0;
  while (made < target && guard++ < 500) {
    const step = pick([1, 2, 3, -1, -2, -3]);
    const start = ri(8), n = pick([4, 5]);
    const seq = Array.from({ length: n }, (_, i) => ARROWS[mod(start + i * step, 8)]);
    const ans = mod(start + n * step, 8);
    const deg = Math.abs(step) * 45, sens = step > 0 ? "horaire" : "anti-horaire";
    const d = [mod(ans - Math.sign(step), 8), mod(ans + Math.sign(step), 8), mod(ans + 4, 8), mod(start + (n - 1) * step, 8)]
      .filter((x, i, a) => x !== ans && a.indexOf(x) === i).slice(0, 3);
    if (d.length < 3) continue;
    const why = (x) => (x === mod(start + (n - 1) * step, 8) ? "reprend la dernière flèche sans appliquer la rotation." : x === mod(ans + 4, 8) ? "pointe dans la direction opposée à la bonne orientation." : `correspond à une rotation de ${deg - 45 === 0 ? 0 : x === mod(ans - Math.sign(step), 8) ? deg - 45 : deg + 45}° au dernier pas au lieu de ${deg}°.`);
    if (add("rot", "rotation", Math.abs(step) === 1 ? 1 : 2, "Quelle flèche complète la série ?", `${seq.join(SEP)}${SEP}?`, ARROWS[ans], d.map((x) => ARROWS[x]),
      `La flèche tourne de ${deg}° dans le sens ${sens} à chaque étape. Après ${seq[n - 1]}, elle pointe ${ARROW_NAME[ans]} : ${ARROWS[ans]}.`,
      [`rotation de ${deg}° ${sens} appliquée une fois de plus.`, ...d.map((x) => `Incorrect : ${why(x)}`)])) made++;
  }
}

/* ---------- B. Alternating step rotation (rotation, difficulty 3) ---------- */
function arrowAlternating(target) {
  let made = 0, guard = 0;
  while (made < target && guard++ < 500) {
    const [a, b] = pick([[1, 2], [2, 1], [1, 3], [3, 1], [-1, -2], [-2, -1], [2, -1], [3, -1]]);
    const start = ri(8);
    const seq = [start];
    for (let i = 0; i < 5; i++) seq.push(mod(seq[i] + (i % 2 ? b : a), 8));
    const ans = mod(seq[5] + (5 % 2 ? b : a), 8);
    const wrongA = mod(seq[5] + a, 8), wrongB = mod(seq[5] + (a + b), 8), opp = mod(ans + 4, 8);
    const d = [wrongA, wrongB, opp, mod(ans + 1, 8), mod(ans - 1, 8)].filter((x, i, arr) => x !== ans && arr.indexOf(x) === i).slice(0, 3);
    if (d.length < 3) continue;
    const t = (s) => `${Math.abs(s) * 45}° ${s > 0 ? "horaire" : "anti-horaire"}`;
    const why = (x) => (x === wrongA ? `répète le pas de ${t(a)} au lieu d'alterner.` : x === wrongB ? "applique les deux pas d'un coup." : x === opp ? "pointe dans la direction opposée." : "ne correspond à aucun des deux pas de la règle.");
    if (add("rot", "rotation", 3, "Les pas de rotation alternent. Quelle flèche complète la série ?", `${seq.map((x) => ARROWS[x]).join(SEP)}${SEP}?`, ARROWS[ans], d.map((x) => ARROWS[x]),
      `Les rotations alternent : ${t(a)}, puis ${t(b)}, et ainsi de suite. Le dernier pas appliqué était ${t(a)} ; le suivant est donc ${t(b)}, ce qui donne ${ARROWS[ans]}.`,
      [`le pas suivant est ${t(b)}.`, ...d.map((x) => `Incorrect : ${why(x)}`)])) made++;
  }
}

/* ---------- C. Quarter-square rotation (rotation) ---------- */
function quadSeries(target) {
  let made = 0, guard = 0;
  while (made < target && guard++ < 500) {
    const step = pick([1, -1, 2]);
    const start = ri(4), n = pick([4, 5]);
    // with step 2 the series alternates between two figures: add a second rule (count) to keep it non-trivial
    if (step === 2) {
      const seq = Array.from({ length: n }, (_, i) => QUAD[mod(start + 2 * i, 4)].repeat(1 + (i % 3)));
      const ansGlyph = QUAD[mod(start + 2 * n, 4)], ansCount = 1 + (n % 3);
      const correct = ansGlyph.repeat(ansCount);
      const d = [QUAD[mod(start + 2 * n + 1, 4)].repeat(ansCount), ansGlyph.repeat(ansCount === 3 ? 1 : ansCount + 1), QUAD[mod(start + 2 * n + 2, 4)].repeat(ansCount)];
      if (add("quad", "suite-logique", 3, "Deux règles agissent en même temps. Quel groupe complète la série ?", `${seq.join(SEP)}${SEP}?`, correct, d,
        `Deux règles : le quart noir saute d'un demi-tour à chaque étape (il alterne entre deux coins opposés), et le nombre de figures suit le cycle 1, 2, 3. L'étape suivante compte ${ansCount} figure(s) ${ansGlyph}.`,
        ["les deux règles sont respectées.", "Incorrect : le quart noir est dans le mauvais coin (rotation d'un quart de tour au lieu d'un demi-tour).", "Incorrect : le nombre de figures ne suit pas le cycle 1, 2, 3.", "Incorrect : le quart noir n'a pas changé de coin."])) made++;
      continue;
    }
    const seq = Array.from({ length: n }, (_, i) => QUAD[mod(start + i * step, 4)]);
    const ans = mod(start + n * step, 4);
    const sens = step > 0 ? "horaire" : "anti-horaire";
    const d = [mod(ans - step, 4), mod(ans + step, 4), mod(ans + 2, 4)].filter((x, i, a) => x !== ans && a.indexOf(x) === i);
    if (d.length < 3) continue;
    if (add("quad", "rotation", 1, "Quelle figure complète la série ?", `${seq.join(SEP)}${SEP}?`, QUAD[ans], d.map((x) => QUAD[x]),
      `Le quart noir tourne d'un coin dans le sens ${sens} à chaque étape. Après ${seq[n - 1]}, il se place ${QUAD_NAME[ans]} : ${QUAD[ans]}.`,
      ["le quart noir avance d'un coin de plus.", ...d.map((x) => `Incorrect : le quart noir est placé ${QUAD_NAME[x]}${x === mod(ans - step, 4) ? " (figure précédente répétée)" : x === mod(ans + 2, 4) ? " (coin opposé)" : " (un pas de trop)"}.`)])) made++;
  }
}

/* ---------- D. Triangle rotation + fill alternation (rotation, difficulty 2) ---------- */
function triSeries(target) {
  let made = 0, guard = 0;
  while (made < target && guard++ < 500) {
    const step = pick([1, -1]);
    const start = ri(4), n = pick([4, 5]), fill0 = ri(2);
    const fillAt = (i) => ((i + fill0) % 2 ? "e" : "f");
    const seq = Array.from({ length: n }, (_, i) => TRI[fillAt(i)][mod(start + i * step, 4)]);
    const o = mod(start + n * step, 4), f = fillAt(n), nf = f === "f" ? "e" : "f";
    const correct = TRI[f][o];
    const d = [TRI[nf][o], TRI[f][mod(o + 2, 4)], TRI[nf][mod(o - step, 4)]];
    const sens = step > 0 ? "horaire" : "anti-horaire";
    if (add("tri", "rotation", 2, "Quelle figure complète la série ?", `${seq.join(SEP)}${SEP}?`, correct, d,
      `Deux règles : le triangle tourne d'un quart de tour dans le sens ${sens}, et il est alternativement plein et vide. La figure suivante est ${f === "f" ? "pleine" : "vide"} et orientée comme ${correct}.`,
      ["orientation et remplissage corrects.", "Incorrect : bonne orientation, mais le remplissage n'alterne pas.", "Incorrect : bon remplissage, mais orientation opposée.", "Incorrect : ni l'orientation ni le remplissage ne suivent la règle."])) made++;
  }
}

/* ---------- E. Count + fill series (suite-logique) ---------- */
function countSeries(target) {
  let made = 0, guard = 0;
  const kinds = Object.keys(PLAIN);
  while (made < target && guard++ < 500) {
    const kind = pick(kinds), [F, E] = PLAIN[kind];
    const mode = pick(["inc", "dec", "inc2"]);
    const n = 4;
    const counts = mode === "inc" ? [1, 2, 3, 4, 5] : mode === "dec" ? [6, 5, 4, 3, 2] : [1, 3, 5, 7, 9];
    const alt = rnd() < 0.6;
    const g = (i) => (alt && i % 2 ? E : F).repeat(counts[i]);
    const seq = Array.from({ length: n }, (_, i) => g(i));
    const correct = g(n);
    const cf = alt && n % 2 ? E : F, other = cf === F ? E : F;
    const d = [other.repeat(counts[n]), cf.repeat(counts[n] + (mode === "dec" ? -1 : 1)), cf.repeat(counts[n - 1])].filter((x) => x && x !== correct);
    if (d.length < 3) continue;
    const rule = mode === "inc" ? "augmente d'une unité" : mode === "dec" ? "diminue d'une unité" : "augmente de deux unités";
    if (add("cnt", "suite-logique", alt ? 2 : 1, "Quel groupe complète la série ?", `${seq.join(SEP)}${SEP}?`, correct, d,
      `Le nombre de ${PLAIN_NAME[kind]}s ${rule} à chaque étape (${counts.slice(0, n + 1).join(", ")})${alt ? ", et les groupes sont alternativement pleins et vides" : ""}. Le groupe suivant compte ${counts[n]} ${PLAIN_NAME[kind]}s ${cf === F ? "pleins" : "vides"}.`,
      ["nombre et remplissage corrects.", alt ? "Incorrect : bon nombre, mais le remplissage n'alterne pas." : "Incorrect : bon nombre, mais le remplissage change sans raison.", "Incorrect : la progression du nombre est mal appliquée.", "Incorrect : reprend le nombre de l'étape précédente."])) made++;
  }
}

/* ---------- F. Moving marker in a row of cells (suite-logique) ---------- */
function markerSeries(target) {
  let made = 0, guard = 0;
  while (made < target && guard++ < 500) {
    const width = pick([4, 5]), step = pick([1, 2, -1]), [F, E] = PLAIN[pick(Object.keys(PLAIN))];
    const two = false; // a second marker made the rule ambiguous (indistinguishable marks)
    const p0 = ri(width), q0 = ri(width);
    const cell = (i) => { const a = mod(p0 + i * step, width), b = mod(q0 - i, width); return Array.from({ length: width }, (_, k) => (k === a || (two && k === b) ? F : E)).join(""); };
    const seq = Array.from({ length: 4 }, (_, i) => cell(i));
    if (new Set(seq).size < 3) continue;
    if (two && [0, 1, 2, 3, 4, 5].some((i) => mod(p0 + i * step, width) === mod(q0 - i, width))) continue; // markers must never overlap
    const correct = cell(4);
    const alt = (fn) => { const s = [...correct]; fn(s); return s.join(""); };
    const d = [cell(3), cell(5), alt((s) => s.reverse())].filter((x) => x !== correct);
    const uniq = [...new Set(d)];
    if (uniq.length < 3) {
      const extra = Array.from({ length: width }, (_, k) => (k === mod(p0 + 4 * step + 1, width) ? F : E)).join("");
      if (!uniq.includes(extra) && extra !== correct) uniq.push(extra);
    }
    if (uniq.length < 3) continue;
    const pas = Math.abs(step) === 1 ? "d'une case" : "de deux cases";
    const sens = step > 0 ? "vers la droite" : "vers la gauche";
    if (add("pos", "suite-logique", two ? 3 : Math.abs(step) === 2 ? 2 : 1, "Quelle rangée complète la série ?", `${seq.join(SEP)}${SEP}?`, correct, uniq.slice(0, 3),
      `La case pleine se déplace ${pas} ${sens} à chaque étape ; arrivée au bout de la rangée, elle repart de l'autre extrémité. L'étape suivante est ${correct}.`,
      ["position(s) correcte(s) à l'étape suivante.", "Incorrect : répète la dernière rangée sans déplacement.", "Incorrect : correspond à deux étapes plus loin.", "Incorrect : position(s) incompatible(s) avec la règle de déplacement."].slice(0, 1 + uniq.slice(0, 3).length))) made++;
  }
}

/* ---------- G. Latin-square matrix with a fill rule (matrice) ---------- */
function latin(target) {
  let made = 0, guard = 0;
  const kinds = Object.keys(PLAIN);
  while (made < target && guard++ < 500) {
    const ks = shuffle([...kinds, "tri"]).slice(0, 3);
    const glyph = (k, f) => (k === "tri" ? TRI[f ? "f" : "e"][0] : PLAIN[k][f ? 0 : 1]);
    const shift = pick([1, 2]);
    const fillRule = pick(["none", "row", "col"]);
    const fillOf = (r, c) => (fillRule === "none" ? true : fillRule === "row" ? r !== 1 : c !== 1);
    const grid = Array.from({ length: 3 }, (_, r) => Array.from({ length: 3 }, (_, c) => ({ k: ks[mod(c + r * shift, 3)], f: fillOf(r, c) })));
    const mr = 2, mc = ri(3);
    const ans = grid[mr][mc];
    const text = grid.map((row, r) => row.map((cell, c) => (r === mr && c === mc ? "?" : glyph(cell.k, cell.f))).join("     ")).join("\n");
    const correct = glyph(ans.k, ans.f);
    const others = ks.filter((k) => k !== ans.k);
    const d = [glyph(ans.k, !ans.f), glyph(others[0], ans.f), glyph(others[1], ans.f)];
    const ruleTxt = fillRule === "none" ? "" : fillRule === "row" ? " ; la deuxième ligne est vide, les autres sont pleines" : " ; la deuxième colonne est vide, les autres sont pleines";
    if (add("mat", "matrice", fillRule === "none" ? 1 : 2, "Quelle figure remplace le point d'interrogation dans la matrice ?", text, correct, d,
      `Chaque ligne et chaque colonne contiennent une seule fois chacune des trois formes${ruleTxt}. La case manquante doit donc contenir ${correct}.`,
      ["forme et remplissage respectent les deux règles.", "Incorrect : bonne forme, mais mauvais remplissage.", "Incorrect : cette forme figure déjà dans la ligne ou la colonne.", "Incorrect : cette forme figure déjà dans la ligne ou la colonne."])) made++;
  }
}

/* ---------- H. Count × shape matrix (matrice) ---------- */
function countMatrix(target) {
  let made = 0, guard = 0;
  const kinds = Object.keys(PLAIN);
  while (made < target && guard++ < 500) {
    const ks = shuffle(kinds);
    const dir = pick(["inc", "dec"]);
    const cnt = (c) => (dir === "inc" ? c + 1 : 3 - c);
    const fillByCol = rnd() < 0.5;
    const glyph = (r, c) => PLAIN[ks[r]][fillByCol && c === 1 ? 1 : 0].repeat(cnt(c));
    const mr = ri(3), mc = ri(3);
    if (mr === 0 && mc === 0) continue;
    const text = [0, 1, 2].map((r) => [0, 1, 2].map((c) => (r === mr && c === mc ? "?" : glyph(r, c))).join("     ")).join("\n");
    const correct = glyph(mr, mc);
    const [F, E] = PLAIN[ks[mr]];
    const curFill = fillByCol && mc === 1 ? E : F, othFill = curFill === F ? E : F;
    const d = [othFill.repeat(cnt(mc)), curFill.repeat(cnt(mc) === 3 ? 2 : cnt(mc) + 1), PLAIN[ks[(mr + 1) % 3]][fillByCol && mc === 1 ? 1 : 0].repeat(cnt(mc))];
    if (add("mat", "matrice", fillByCol ? 2 : 1, "Quelle case complète la matrice ?", text, correct, d,
      `Chaque ligne utilise une seule forme ; le nombre de figures ${dir === "inc" ? "augmente de 1 à 3" : "diminue de 3 à 1"} de gauche à droite${fillByCol ? ", et la colonne du milieu est vide" : ""}. La case manquante contient ${cnt(mc)} ${PLAIN_NAME[ks[mr]]}(s) ${curFill === F ? "plein(s)" : "vide(s)"}.`,
      ["forme, nombre et remplissage corrects.", "Incorrect : mauvais remplissage.", "Incorrect : mauvais nombre de figures pour cette colonne.", "Incorrect : forme d'une autre ligne."])) made++;
  }
}

/* ---------- I. Row-shift matrix (matrice, difficulty 3) ---------- */
function shiftMatrix(target) {
  let made = 0, guard = 0;
  while (made < target && guard++ < 500) {
    const base = shuffle(["●", "■", "▲", "◆", "○", "□", "△", "◇"]).slice(0, 3);
    const s = pick([1, 2]);
    const row = (r) => [0, 1, 2].map((c) => base[mod(c - r * s, 3)]);
    // each cell is a pair: shape + its fill-inverse partner? keep it to triples per cell for difficulty
    const cell = (r, c) => row(mod(r + c, 3)).join("");
    const mr = 2, mc = ri(3);
    const text = [0, 1, 2].map((r) => [0, 1, 2].map((c) => (r === mr && c === mc ? "?" : cell(r, c))).join("     ")).join("\n");
    const correct = cell(mr, mc);
    const all = [...new Set([0, 1, 2].map((k) => row(k).join("")))];
    const rev = [...correct].reverse().join("");
    const d = [...all.filter((x) => x !== correct), rev, base.join("")].filter((x, i, a) => x !== correct && a.indexOf(x) === i).slice(0, 3);
    if (d.length < 3) continue;
    if (add("shift", "matrice", 3, "Quelle case complète la matrice ?", text, correct, d,
      `Chaque case est une rangée de trois formes. D'une case à l'autre (vers la droite ou vers le bas), la rangée est décalée selon la même règle, de sorte que chaque arrangement apparaît une fois par ligne et par colonne. La case manquante est ${correct}.`,
      ["c'est le seul arrangement absent de la ligne et de la colonne.", "Incorrect : cet arrangement figure déjà dans la ligne ou la colonne.", "Incorrect : cet arrangement figure déjà dans la ligne ou la colonne, ou inverse l'ordre des formes.", "Incorrect : cet arrangement ne respecte pas le décalage."])) made++;
  }
}

/* ---------- J. Analogies with an explicit, disambiguated transformation (transformation) ---------- */
// Shapes: {k: tri|quad|circle|square|diamond, o: 0-3, f: true(filled)/false}
const glyphOf = (s) => (s.k === "tri" ? TRI[s.f ? "f" : "e"][s.o] : s.k === "quad" ? QUAD[s.o] : PLAIN[s.k][s.f ? 0 : 1]);
const T = {
  "inversion du remplissage": (s) => (s.k === "quad" ? null : { ...s, f: !s.f }),
  "rotation d'un quart de tour dans le sens horaire": (s) => ({ ...s, o: (s.o + 1) % 4 }),
  "rotation d'un quart de tour dans le sens anti-horaire": (s) => ({ ...s, o: (s.o + 3) % 4 }),
  "demi-tour": (s) => ({ ...s, o: (s.o + 2) % 4 }),
  "symétrie gauche-droite": (s) => ({ ...s, o: s.k === "tri" ? [0, 3, 2, 1][s.o] : s.k === "quad" ? [1, 0, 3, 2][s.o] : s.o }),
  "symétrie haut-bas": (s) => ({ ...s, o: s.k === "tri" ? [2, 1, 0, 3][s.o] : s.k === "quad" ? [3, 2, 1, 0][s.o] : s.o }),
};
const TN = Object.keys(T);
for (const a of TN.slice(1)) T[`${a} et inversion du remplissage`] = (s) => { const x = T[a](s); return x && T["inversion du remplissage"](x); };
const ALL_T = Object.keys(T);
// Extra rules used only to test uniqueness (a solver may legitimately think of them).
const DIAG = {
  "symétrie diagonale \\": (s) => ({ ...s, o: s.k === "tri" ? [3, 2, 1, 0][s.o] : s.k === "quad" ? [0, 3, 2, 1][s.o] : s.o }),
  "symétrie diagonale /": (s) => ({ ...s, o: s.k === "tri" ? [1, 0, 3, 2][s.o] : s.k === "quad" ? [2, 1, 0, 3][s.o] : s.o }),
};
const CHECK_T = { ...T, ...DIAG };
for (const [n, f] of Object.entries(DIAG)) CHECK_T[`${n} et inversion du remplissage`] = (s) => { const x = f(s); return x && T["inversion du remplissage"](x); };
function randShape(kinds) { const k = pick(kinds); return { k, o: k === "tri" || k === "quad" ? ri(4) : 0, f: k === "quad" ? true : rnd() < 0.5 }; }
function analogies(target) {
  let made = 0, guard = 0;
  while (made < target && guard++ < 3000) {
    const rule = pick(ALL_T.filter((x) => x !== "inversion du remplissage" || rnd() < 0.3));
    const kinds = rule.includes("remplissage") ? ["tri", "circle", "square", "diamond"] : ["tri", "quad"];
    const ex = [randShape(kinds), randShape(kinds)];
    const q = randShape(rule.includes("remplissage") ? ["tri"] : ["tri", "quad"]);
    const outs = [...ex, q].map((s) => T[rule](s));
    if (outs.some((x) => !x)) continue;
    if (ex.some((s, i) => glyphOf(s) === glyphOf(outs[i]))) continue; // each example must show a visible change
    if (new Set([...ex, q].map(glyphOf)).size < 3) continue;
    // Uniqueness: every rule consistent with the examples must give the same answer on the query.
    const consistent = Object.keys(CHECK_T).filter((r) => ex.every((s, i) => { const y = CHECK_T[r](s); return y && glyphOf(y) === glyphOf(outs[i]); }));
    const answers = new Set(consistent.map((r) => { const y = CHECK_T[r](q); return y ? glyphOf(y) : null; }));
    if (answers.size !== 1) continue;
    const correct = glyphOf(outs[2]);
    if (correct === glyphOf(q)) continue;
    const dPool = [];
    for (const r of ALL_T) { const y = T[r](q); if (y && glyphOf(y) !== correct && !dPool.some((p) => p.g === glyphOf(y))) dPool.push({ g: glyphOf(y), r }); }
    if (!dPool.some((p) => p.g === glyphOf(q))) dPool.unshift({ g: glyphOf(q), r: "aucune" });
    const chosen = shuffle(dPool).slice(0, 3);
    if (chosen.length < 3) continue;
    const text = [...ex.map((s, i) => `${glyphOf(s)}     ${glyphOf(outs[i])}`), `${glyphOf(q)}     ?`].join("\n");
    const composite = rule.includes(" et ");
    if (add("trf", "transformation", composite ? 3 : 2, "Dans chaque ligne, la figure de droite est obtenue à partir de celle de gauche par la même transformation. Quelle figure remplace le point d'interrogation ?", text, correct, chosen.map((c) => c.g),
      `La transformation est : ${rule}. Les deux premières lignes l'illustrent sans ambiguïté. Appliquée à ${glyphOf(q)}, elle donne ${correct}.`,
      [`${rule} appliquée à ${glyphOf(q)}.`, ...chosen.map((c) => (c.r === "aucune" ? "Incorrect : la figure n'a pas été transformée." : `Incorrect : résulte d'une autre transformation (${c.r}), contredite par les exemples.`))])) made++;
  }
}

/* ---------- K. Interleaved series (suite-logique, difficulty 3) ---------- */
function interleaved(target) {
  let made = 0, guard = 0;
  while (made < target && guard++ < 500) {
    const aStart = ri(8), aStep = pick([1, 2, -1, -2]);
    const kind = pick(Object.keys(PLAIN)), F = PLAIN[kind][0];
    const terms = [];
    for (let i = 0; i < 6; i++) terms.push(i % 2 === 0 ? ARROWS[mod(aStart + (i / 2) * aStep, 8)] : F.repeat((i + 1) / 2));
    // term 7 (index 6) is an arrow
    const ans = ARROWS[mod(aStart + 3 * aStep, 8)];
    const d = [F.repeat(4), ARROWS[mod(aStart + 2 * aStep, 8)], ARROWS[mod(aStart + 3 * aStep + 4, 8)]];
    const deg = Math.abs(aStep) * 45, sens = aStep > 0 ? "horaire" : "anti-horaire";
    if (add("mix", "suite-logique", 3, "Deux séries sont entrelacées. Quel élément complète la série ?", `${terms.join(SEP)}${SEP}?`, ans, d,
      `Les positions impaires portent une flèche qui tourne de ${deg}° dans le sens ${sens} ; les positions paires portent un groupe de ${PLAIN_NAME[kind]}s qui grandit d'une unité. Le septième élément est une flèche : ${ans}.`,
      ["prochaine flèche de la série des positions impaires.", "Incorrect : le septième élément appartient à la série des flèches, pas à celle des groupes.", "Incorrect : reprend la flèche précédente sans rotation.", "Incorrect : orientation opposée à la bonne."])) made++;
  }
}

arrowSeries(8); arrowAlternating(5); quadSeries(7); triSeries(6); countSeries(8); markerSeries(7);
latin(8); countMatrix(6); shiftMatrix(4); analogies(22); interleaved(4);

// Exclude figures already in the approved bank.
const bank = JSON.parse(fs.readFileSync("data/approved/abstract.json", "utf8"));
const existing = new Set(bank.map((x) => x.stimulus.text.replace(/\s+/g, " ").trim()));
const SKILLS = ["suite-logique", "rotation", "matrice", "transformation"];
const perSkill = Math.ceil(Number(args.target) / SKILLS.length);
const pool = items.filter((x) => !existing.has(x.stimulus.text.replace(/\s+/g, " ").trim()));
// Keep the mix that brings each skill to target/4 in the final bank.
const QUOTA = Object.fromEntries(SKILLS.map((k) => [k, Math.max(0, perSkill - bank.filter((x) => x.skill === k).length)]));
const out = [];
for (const [skill, n] of Object.entries(QUOTA)) {
  const xs = pool.filter((x) => x.skill === skill);
  // round-robin over families so each rule type stays represented
  const fams = [...new Set(xs.map((x) => x.id.split("-")[1]))];
  const queues = fams.map((f) => xs.filter((x) => x.id.split("-")[1] === f));
  while (out.filter((x) => x.skill === skill).length < n && queues.some((q) => q.length)) for (const q of queues) if (q.length && out.filter((x) => x.skill === skill).length < n) out.push(q.shift());
}
const file = positionals[0] || `generated/abstract-figures-${NOW.slice(0, 10)}.json`;
fs.writeFileSync(file, JSON.stringify(out, null, 2) + "\n");
console.log(`${file} :`);
const by = (k) => out.reduce((m, x) => ((m[x[k]] = (m[x[k]] || 0) + 1), m), {});
console.log(out.length, by("skill"), by("difficulty"), [0, 1, 2, 3].map((i) => out.filter((x) => x.correctIndex === i).length));
