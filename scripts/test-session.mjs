// Unit tests for shared/session.js (pure functions, seeded randomness) on the real compiled bank.
import vm from "node:vm";
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
for (const f of ["bank/app-bank.js", "shared/session.js"]) vm.runInThisContext(fs.readFileSync(path.join(ROOT, f), "utf8"), { filename: f });
const { EagSession: S, EAG_BANK: bank } = globalThis;
const modules = { abstract: { minutes: 8 }, verbal: { minutes: 9 }, numeric: { minutes: 10 }, planning: { minutes: 10 }, situational: { minutes: 12 } };
let n = 0;
const test = (name, fn) => { fn(); n++; };

test("le générateur à graine est reproductible", () => {
  const a = S.seeded(42), b = S.seeded(42);
  for (let i = 0; i < 5; i++) assert.equal(a(), b());
});

test("shuffle conserve les éléments", () => {
  const xs = [...Array(50).keys()];
  assert.deepEqual([...S.shuffle(xs, S.seeded(1))].sort((x, y) => x - y), xs);
});

test("une même graine donne la même session", () => {
  const ids = (seed) => S.buildSession(bank, { modules, type: "numeric", count: 10 }, S.seeded(seed)).questions.map((x) => x.id);
  assert.deepEqual(ids(7), ids(7));
  assert.notDeepEqual(ids(7), ids(8));
});

test("prepare garde la clé, les notes et les justifications alignées sur les options", () => {
  for (const [cat, items] of Object.entries(bank)) {
    for (const x of items) {
      const p = S.prepare(x, cat, S.seeded(x.id.length * 31));
      assert.equal(p.o[p.a], x.o[x.a], `${x.id} : clé déplacée`);
      if (x.r) p.o.forEach((o, i) => assert.equal(p.r[i], x.r[x.o.indexOf(o)], `${x.id} : notes désalignées`));
      if (x.x) p.o.forEach((o, i) => assert.equal(p.x[i], x.x[x.o.indexOf(o)], `${x.id} : justifications désalignées`));
      if (x.f === "tfcs") assert.deepEqual(p.o, x.o, `${x.id} : ordre Vrai/Faux modifié`);
    }
  }
});

test("le tirage équilibré couvre toutes les compétences et les niveaux", () => {
  for (const [cat, items] of Object.entries(bank)) {
    const skills = new Set(items.map((x) => x.skill));
    for (let seed = 1; seed <= 20; seed++) {
      const draw = S.drawBalanced(items, 10, S.seeded(seed));
      assert.equal(draw.length, 10);
      assert.equal(new Set(draw.map((x) => x.id)).size, 10, `${cat} : doublon dans le tirage`);
      if (skills.size <= 10) assert.equal(new Set(draw.map((x) => x.skill)).size, skills.size, `${cat} : compétence absente (graine ${seed})`);
      const levels = new Set(items.map((x) => x.difficulty));
      assert.ok(new Set(draw.map((x) => x.difficulty)).size >= Math.min(2, levels.size), `${cat} : un seul niveau de difficulté`);
    }
  }
});

test("chaque mode tire le bon nombre de questions", () => {
  const rng = S.seeded(3);
  assert.equal(S.buildSession(bank, { modules, type: "diagnostic" }, rng).questions.length, 10);
  assert.equal(S.buildSession(bank, { modules, type: "simulation" }, rng).questions.length, 15);
  assert.equal(S.buildSession(bank, { modules, type: "verbal", count: 5 }, rng).questions.length, 5);
  assert.equal(S.buildSession(bank, { modules, type: "verbal", count: "all" }, rng).questions.length, bank.verbal.length);
  const exam = S.buildExam(bank, { sections: Object.keys(modules), questionsPerSection: 10 }, rng);
  assert.equal(exam.questions.length, 50);
  assert.deepEqual(exam.sections.map((s) => [s.cat, s.to - s.from + 1]), Object.keys(modules).map((c) => [c, 10]));
  exam.sections.forEach((s) => { for (let i = s.from; i <= s.to; i++) assert.equal(exam.questions[i].m, s.cat); });
});

test("la durée des entraînements suit le rythme configuré pour dix questions", () => {
  assert.equal(S.buildSession(bank, { modules, type: "numeric", count: 5 }, S.seeded(1)).seconds, 300);
  assert.equal(S.buildSession(bank, { modules, type: "numeric", count: 10 }, S.seeded(1)).seconds, 600);
  assert.equal(S.buildSession(bank, { modules, type: "numeric", count: "all" }, S.seeded(1)).seconds, bank.numeric.length * 60);
  assert.equal(S.buildSession(bank, { modules, type: "abstract", count: 5 }, S.seeded(1)).seconds, 240);
  assert.equal(S.buildSession(bank, { modules, type: "verbal", count: 1 }, S.seeded(1)).seconds, 180);
});

test("notation : bonne réponse, erreur, question passée, jugement situationnel", () => {
  const x = { f: "single_best", a: 2 };
  assert.deepEqual(S.scoreAnswer(x, 2), { choice: 2, points: 1, good: true });
  assert.deepEqual(S.scoreAnswer(x, 1), { choice: 1, points: 0, good: false });
  assert.deepEqual(S.scoreAnswer(x, null), { choice: null, points: 0, good: false });
  const r = { f: "rating", r: [4, 1, 2, 3] };
  assert.equal(S.scoreAnswer(r, [4, 1, 2, 3]).points, 1);
  assert.equal(S.scoreAnswer(r, [1, 4, 3, 2]).points, 1 - 2 / 3);
  assert.equal(S.scoreAnswer(r, [3, 1, 2, 3]).good, true); // écart moyen 0,25 → 0,92
});

test("bilan : moyenne des tests de même poids", () => {
  const questions = Array(4).fill({}), sections = [{ cat: "a", from: 0, to: 1 }, { cat: "b", from: 2, to: 3 }];
  const answers = [{ choice: 0, points: 1, good: true }, { choice: null, points: 0, good: false }, { choice: 1, points: 1, good: true }, { choice: 1, points: 1, good: true }];
  const s = S.summarize(questions, answers, sections);
  assert.equal(s.pct, 75);
  assert.deepEqual(s.sections.map((x) => [x.pct, x.done]), [[50, 1], [100, 2]]);
  assert.equal(s.avg, 75);
});

console.log(`Session self-test passed (${n} tests, ${Object.values(bank).flat().length} questions vérifiées)`);
