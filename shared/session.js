/*
 * EAG A1 Académie — session logic without DOM: drawing questions, option order, scoring,
 * exam sections. Classic script exposing globalThis.EagSession (browser and Node).
 * Every function that draws at random takes an `rng` (default Math.random), so tests can
 * use a seeded generator and get reproducible sessions.
 */
(function (g) {
  "use strict";

  /** Small seeded generator (mulberry32) for tests and reproducible draws. */
  function seeded(seed) {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /** Fisher–Yates shuffle (returns a new array). */
  function shuffle(a, rng = Math.random) {
    const r = [...a];
    for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; }
    return r;
  }

  /**
   * Draws n items covering the skills as evenly as possible (round-robin over skills, in random
   * order) and, within a skill, alternating difficulty levels. Order of the result is shuffled.
   * @param {object[]} items - compact items ({ skill, difficulty, … })
   * @param {number} n
   * @param {() => number} [rng]
   */
  function drawBalanced(items, n, rng = Math.random) {
    if (n >= items.length) return shuffle(items, rng);
    const bySkill = new Map();
    for (const x of shuffle(items, rng)) {
      const k = x.skill || "";
      if (!bySkill.has(k)) bySkill.set(k, []);
      bySkill.get(k).push(x);
    }
    // within a skill: interleave difficulty levels (1, 2, 3, 1, 2, 3 …) starting at a random level
    const queues = [...bySkill.values()].map((xs) => {
      const levels = new Map();
      for (const x of xs) { const d = x.difficulty || 0; if (!levels.has(d)) levels.set(d, []); levels.get(d).push(x); }
      const lv = shuffle([...levels.keys()], rng), out = [];
      while (out.length < xs.length) for (const d of lv) { const q = levels.get(d); if (q.length) out.push(q.shift()); }
      return out;
    });
    const order = shuffle(queues.map((_, i) => i), rng), picked = [];
    while (picked.length < n) for (const i of order) { if (picked.length < n && queues[i].length) picked.push(queues[i].shift()); }
    return shuffle(picked, rng);
  }

  /**
   * Shuffles the options of an item (true/false/cannot-say keeps its fixed order) and remaps the
   * key, the ratings and the rationales. `m` is the category.
   */
  function prepare(x, m, rng = Math.random) {
    const idx = x.o.map((_, i) => i);
    const order = x.f === "tfcs" ? idx : shuffle(idx, rng);
    return { ...x, m, o: order.map((i) => x.o[i]), r: x.r ? order.map((i) => x.r[i]) : null, x: x.x ? order.map((i) => x.x[i]) : null, a: order.indexOf(x.a) };
  }

  /** Situational rating: 1 − mean absolute gap / 3 (1 = same ratings as the key). */
  function scoreRating(user, key) {
    const gap = key.reduce((s, k, i) => s + Math.abs(k - user[i]), 0) / key.length;
    return Math.max(0, 1 - gap / 3);
  }

  /** Points (0..1) and success flag for one answer; `choice` null = skipped. */
  function scoreAnswer(x, choice) {
    if (choice === null || choice === undefined) return { choice: null, points: 0, good: false };
    const points = x.f === "rating" ? scoreRating(choice, x.r) : choice === x.a ? 1 : 0;
    return { choice, points, good: x.f === "rating" ? points >= 0.75 : points === 1 };
  }

  /**
   * Builds a practice session. cfg: { modules: {cat: {minutes}}, type, count }.
   * Types: "diagnostic" (2 per category), "simulation" (3 per category), or a category name.
   */
  function buildSession(bank, cfg, rng = Math.random) {
    const cats = Object.keys(cfg.modules);
    const pick = (k, n) => drawBalanced(bank[k] || [], n, rng).map((x) => prepare(x, k, rng));
    if (cfg.type === "diagnostic") return { questions: shuffle(cats.flatMap((k) => pick(k, 2)), rng), seconds: 900, guided: true };
    if (cfg.type === "simulation") return { questions: shuffle(cats.flatMap((k) => pick(k, 3)), rng), seconds: 1500, guided: false };
    const total = (bank[cfg.type] || []).length;
    const n = cfg.count === "all" || Number(cfg.count) >= total ? total : Number(cfg.count) || 5;
    const questions = pick(cfg.type, n);
    const minutes = (cfg.modules[cfg.type] && cfg.modules[cfg.type].minutes) || 10;
    return { questions, seconds: Math.max(180, Math.round(questions.length * ((minutes * 60) / (total || 10)))), guided: true };
  }

  /** Builds the mock exam: per section, `questionsPerSection` balanced questions (all if null). */
  function buildExam(bank, exam, rng = Math.random) {
    const sections = [], questions = [];
    for (const k of exam.sections) {
      const items = bank[k] || [];
      const qs = drawBalanced(items, exam.questionsPerSection || items.length, rng).map((x) => prepare(x, k, rng));
      if (!qs.length) continue;
      sections.push({ cat: k, from: questions.length, to: questions.length + qs.length - 1 });
      questions.push(...qs);
    }
    return { questions, sections };
  }

  /** Session result: overall percentage and, for an exam, per-section percentages and their mean. */
  function summarize(questions, answers, sections) {
    const pts = (i) => (answers[i] ? answers[i].points : 0);
    const total = questions.length;
    const points = questions.reduce((n, _, i) => n + pts(i), 0);
    const good = answers.filter((a) => a && a.good).length;
    const out = { total, good, pct: total ? Math.round((points / total) * 100) : 0 };
    if (sections) {
      out.sections = sections.map((sec) => {
        const idx = []; for (let i = sec.from; i <= sec.to; i++) idx.push(i);
        return { cat: sec.cat, n: idx.length, done: idx.filter((i) => answers[i] && answers[i].choice !== null).length, pct: Math.round((idx.reduce((n, i) => n + pts(i), 0) / idx.length) * 100) };
      });
      out.avg = out.sections.length ? Math.round(out.sections.reduce((n, r) => n + r.pct, 0) / out.sections.length) : 0;
    }
    return out;
  }

  g.EagSession = { seeded, shuffle, drawBalanced, prepare, scoreRating, scoreAnswer, buildSession, buildExam, summarize };
})(typeof globalThis !== "undefined" ? globalThis : this);
