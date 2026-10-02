/*
 * Shared item rules for EAG A1 Académie.
 * Classic script (no modules) so it works from file:// in the browser (admin.html)
 * and in Node via vm.runInThisContext (scripts/validate-bank.mjs).
 * Exposes globalThis.EagRules.
 */
(function (g) {
  "use strict";

  /* ---------- Minimal JSON Schema validator (subset used by schema/question.schema.json) ---------- */
  function typeOf(v) {
    if (v === null) return "null";
    if (Array.isArray(v)) return "array";
    if (typeof v === "number") return Number.isInteger(v) ? "integer" : "number";
    return typeof v;
  }
  function matchesType(v, t) {
    const actual = typeOf(v);
    return actual === t || (t === "number" && actual === "integer");
  }
  function deepEqual(a, b) {
    if (a === b) return true;
    if (typeof a !== typeof b || a === null || b === null || typeof a !== "object") return false;
    if (Array.isArray(a) !== Array.isArray(b)) return false;
    const ka = Object.keys(a), kb = Object.keys(b);
    return ka.length === kb.length && ka.every((k) => deepEqual(a[k], b[k]));
  }
  const DATE_TIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/i;

  function validate(schema, v, path, errors) {
    if (schema === true || schema == null) return;
    if (schema.type !== undefined) {
      const types = Array.isArray(schema.type) ? schema.type : [schema.type];
      if (!types.some((t) => matchesType(v, t))) {
        errors.push({ path, message: `type attendu : ${types.join(" ou ")}` });
        return;
      }
    }
    if (schema.const !== undefined && !deepEqual(v, schema.const)) errors.push({ path, message: `valeur attendue : ${JSON.stringify(schema.const)}` });
    if (schema.enum && !schema.enum.some((e) => deepEqual(e, v))) errors.push({ path, message: `valeur autorisée : ${schema.enum.map((e) => JSON.stringify(e)).join(", ")}` });

    if (typeof v === "string") {
      if (schema.minLength !== undefined && [...v].length < schema.minLength) errors.push({ path, message: `au moins ${schema.minLength} caractères` });
      if (schema.pattern && !new RegExp(schema.pattern, "u").test(v)) errors.push({ path, message: `format attendu : ${schema.pattern}` });
      if (schema.format === "date-time" && !(DATE_TIME.test(v) && !Number.isNaN(Date.parse(v)))) errors.push({ path, message: "date-heure ISO 8601 attendue" });
    }
    if (typeof v === "number") {
      if (schema.minimum !== undefined && v < schema.minimum) errors.push({ path, message: `minimum ${schema.minimum}` });
      if (schema.maximum !== undefined && v > schema.maximum) errors.push({ path, message: `maximum ${schema.maximum}` });
    }
    if (Array.isArray(v)) {
      if (schema.minItems !== undefined && v.length < schema.minItems) errors.push({ path, message: `au moins ${schema.minItems} éléments` });
      if (schema.maxItems !== undefined && v.length > schema.maxItems) errors.push({ path, message: `au plus ${schema.maxItems} éléments` });
      if (schema.uniqueItems && v.some((x, i) => v.findIndex((y) => deepEqual(x, y)) !== i)) errors.push({ path, message: "éléments en double" });
      if (schema.items) v.forEach((x, i) => validate(schema.items, x, `${path}/${i}`, errors));
    }
    if (v && typeof v === "object" && !Array.isArray(v)) {
      for (const key of schema.required || []) if (!(key in v)) errors.push({ path, message: `champ requis manquant : ${key}` });
      const props = schema.properties || {};
      for (const [key, val] of Object.entries(v)) {
        if (props[key]) validate(props[key], val, `${path}/${key}`, errors);
        else if (schema.additionalProperties === false) errors.push({ path, message: `champ non autorisé : ${key}` });
      }
    }
    for (const sub of schema.allOf || []) validate(sub, v, path, errors);
    if (schema.oneOf) {
      const passing = schema.oneOf.filter((sub) => { const e = []; validate(sub, v, path, e); return !e.length; }).length;
      if (passing !== 1) errors.push({ path, message: passing ? "correspond à plusieurs formats autorisés" : "ne correspond à aucun format autorisé" });
    }
    if (schema.not) {
      const e = [];
      validate(schema.not, v, path, e);
      if (!e.length) errors.push({ path, message: "forme interdite dans ce contexte" });
    }
    if (schema.if) {
      const e = [];
      validate(schema.if, v, path, e);
      if (!e.length) { if (schema.then) validate(schema.then, v, path, errors); }
      else if (schema.else) validate(schema.else, v, path, errors);
    }
  }

  function validateSchema(schema, value) {
    const errors = [];
    validate(schema, value, "", errors);
    const seen = new Set();
    return errors.filter((e) => { const k = e.path + e.message; if (seen.has(k)) return false; seen.add(k); return true; });
  }

  /* ---------- Rules a schema cannot express ---------- */
  const FORBIDDEN_WORDING = [/question officielle/i, /item officiel/i, /bar[eè]me officiel/i, /confidentiel/i];
  // Options that refer to the answer set itself. Ordinary sentences such as
  // « Aucun des agents n'est concerné » remain allowed.
  const CATCH_ALL_OPTIONS = [
    /\baucun(?:e)?\s+(?:de\s+ces|des)\s+(?:r[ée]ponses|options|propositions|affirmations|solutions|choix|cr[ée]neaux|[ée]l[ée]ments)\b/i,
    /\btoutes?\s+les\s+(?:r[ée]ponses|options|propositions|affirmations)\b/i,
    /\bkeine\s+der\s+(?:antworten|optionen|aussagen|m[öo]glichkeiten)\b/i,
    /\balle\s+(?:antworten|optionen|aussagen)\b/i,
  ];
  const LENGTHS = { verbal: [40, 200], situational: [30, 120] };
  const HTML_LIKE = /<[a-z!/?]|&[a-z]+;|&#\d+;|javascript:/i;
  /** Characters allowed in abstract figures: whitespace, « ? », arrows, geometric shapes and related symbol blocks. */
  function isFigureChar(c) {
    const cp = c.codePointAt(0);
    return /\s/.test(c) || c === "?" || c === "·"
      || (cp >= 0x2190 && cp <= 0x21ff)  // arrows
      || (cp >= 0x2500 && cp <= 0x25ff)  // box drawing, block elements, geometric shapes
      || (cp >= 0x2605 && cp <= 0x2606)  // ★ ☆
      || (cp >= 0x27f0 && cp <= 0x27ff)  // supplemental arrows
      || (cp >= 0x2b00 && cp <= 0x2bff); // misc. symbols and arrows (⬟ ⬢ …)
  }

  function strings(value, where, out) {
    if (typeof value === "string") out.push([where, value]);
    else if (Array.isArray(value)) value.forEach((x, i) => strings(x, `${where}[${i}]`, out));
    else if (value && typeof value === "object") for (const k of Object.keys(value)) strings(value[k], `${where}.${k}`, out);
    return out;
  }

  function semanticChecks(item) {
    const errors = [], warnings = [];
    if (!item || typeof item !== "object") return { errors, warnings };
    for (const [where, text] of strings(item, "item", [])) {
      if (HTML_LIKE.test(text)) errors.push(`${where} contient du HTML ou une entité (texte brut uniquement)`);
    }
    const learnerText = strings([item.prompt, item.stimulus, item.options, item.explanation, item.optionRationales], "x", []).map((s) => s[1]).join(" ");
    for (const p of FORBIDDEN_WORDING) if (p.test(learnerText)) errors.push(`formulation interdite (${p})`);

    const options = Array.isArray(item.options) ? item.options : [];
    const ci = item.correctIndex;
    if (Number.isInteger(ci) && (ci < 0 || ci >= options.length)) errors.push("correctIndex hors des options");
    if (new Set(options.map((o) => String(o).trim().toLowerCase())).size !== options.length) errors.push("options dupliquées (casse ignorée)");
    for (const o of options) if (CATCH_ALL_OPTIONS.some((p) => p.test(o))) errors.push(`option fourre-tout interdite (« ${o} »)`);
    if (Array.isArray(item.optionRationales) && item.optionRationales.length !== options.length) errors.push("optionRationales doit avoir une entrée par option");

    if (item.itemFormat === "rating" && Array.isArray(item.ratings) && item.ratings.length === options.length) {
      if (Math.max(...item.ratings) !== 4 || item.ratings.filter((r) => r === 4).length !== 1 || item.ratings[ci] !== 4) errors.push("ratings doit contenir un seul 4, placé à correctIndex");
      if (new Set(item.ratings).size < 3) warnings.push("ratings utilise moins de 3 valeurs distinctes");
    }
    if (item.itemFormat !== "tfcs" && options.length >= 3 && Number.isInteger(ci) && options[ci]) {
      const lengths = options.map((o) => o.length);
      const others = lengths.filter((_, i) => i !== ci);
      if (lengths[ci] > 1.4 * Math.max(...others) && lengths[ci] > 25) warnings.push("la bonne réponse est nettement la plus longue (indice involontaire)");
    }
    if (item.category === "abstract" && item.stimulus && typeof item.stimulus.text === "string") {
      // Official description: « séries de formes ou de matrices géométriques ». Figures only:
      // no letters, digits, words, ideograms or punctuation that carries meaning.
      const bad = [...new Set([...item.stimulus.text, ...options.join("")].filter((c) => !isFigureChar(c)))];
      if (bad.length) errors.push(`figure abstraite : symboles géométriques uniquement (caractères interdits : ${bad.join(" ")})`);
      const marks = (item.stimulus.text.match(/\?/g) || []).length;
      if (marks !== 1) errors.push(`figure abstraite : exactement un « ? » attendu dans le stimulus (trouvé : ${marks})`);
      if (options.some((o) => o.includes("?"))) errors.push("figure abstraite : une option ne peut pas contenir « ? »");
    }
    const st = item.stimulus;
    if (st && st.type === "chart" && Array.isArray(st.labels) && Array.isArray(st.series)) {
      for (const ser of st.series) if (Array.isArray(ser.values) && ser.values.length !== st.labels.length) errors.push(`graphique : la série « ${ser.name} » a ${ser.values.length} valeurs pour ${st.labels.length} étiquettes`);
    }
    // Text lengths set by the generation prompt (realistic reading load).
    const words = (t) => String(t || "").trim().split(/\s+/).filter(Boolean).length;
    if (item.category === "verbal" && typeof st === "string") {
      const n = words(st);
      if (n < LENGTHS.verbal[0]) warnings.push(`texte court (${n} mots ; ${LENGTHS.verbal[0]} à ${LENGTHS.verbal[1]} attendus)`);
      if (n > LENGTHS.verbal[1]) warnings.push(`texte long (${n} mots ; ${LENGTHS.verbal[0]} à ${LENGTHS.verbal[1]} attendus)`);
    }
    if (item.category === "situational" && typeof st === "string") {
      const n = words(st);
      if (n < LENGTHS.situational[0]) warnings.push(`scénario court (${n} mots ; ${LENGTHS.situational[0]} à ${LENGTHS.situational[1]} attendus)`);
      if (n > LENGTHS.situational[1]) warnings.push(`scénario long (${n} mots ; ${LENGTHS.situational[0]} à ${LENGTHS.situational[1]} attendus)`);
    }
    if (item.language === "fr" && item.category === "numeric") {
      const text = strings([item.prompt, item.stimulus, item.options], "x", []).map((s) => s[1]).join(" ");
      if (/\d\.\d/.test(text)) warnings.push("point décimal détecté ; en français, utilisez la virgule (12,5)");
      if (/\d%/.test(text)) warnings.push("écrivez « 12 % » avec une espace");
    }
    if (typeof item.explanation === "string" && options[ci] && item.explanation.trim().toLowerCase() === options[ci].trim().toLowerCase()) errors.push("l'explication se contente de répéter la réponse");
    if (!item.optionRationales && item.reviewStatus !== "approved") warnings.push("optionRationales absent (recommandé)");
    if (item.revisionOf && item.revisionOf !== item.id) errors.push("revisionOf doit être égal à l'identifiant de la question révisée");
    return { errors, warnings };
  }

  /** Full check: schema (mini validator) + semantic rules. */
  function checkItem(schema, item) {
    const schemaErrors = validateSchema(schema, item).map((e) => `${e.path || "(racine)"} ${e.message}`);
    const sem = semanticChecks(item);
    return { errors: schemaErrors.concat(sem.errors), warnings: sem.warnings };
  }

  /* ---------- Similarity (near-duplicate detection) ---------- */
  function normalize(t) {
    return String(t || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9●○■□▲△▼▽◀◁▶▷◆◇]+/g, " ").trim();
  }
  function trigrams(t) {
    const s = ` ${normalize(t)} `, set = new Set();
    for (let i = 0; i < s.length - 2; i++) set.add(s.slice(i, i + 3));
    return set;
  }
  function similarity(a, b) {
    return jaccard(trigrams(a), trigrams(b));
  }
  function jaccard(A, B) {
    if (!A.size || !B.size) return 0;
    let inter = 0;
    for (const x of A) if (B.has(x)) inter++;
    return inter / (A.size + B.size - inter);
  }
  function itemText(item) {
    const s = item.stimulus;
    // Abstract prompts are generic ("Quel élément complète la série ?"): compare the figures instead.
    if (item.category === "abstract" && s && s.text) return `${s.text} ${(item.options || []).join(" ")}`;
    const stim = s == null ? "" : typeof s === "string" ? s : s.text || (s.type === "chart" ? `${s.caption} ${JSON.stringify(s.series)}` : `${s.caption || ""} ${JSON.stringify(s.rows || "")}`);
    return `${item.prompt || ""} ${stim}`;
  }


  /* ---------- Content fingerprint (review log) ---------- */
  const REVIEW_FIELDS = ["reviewer", "reviewedAt", "reviewNotes", "reviewStatus", "rejectionReason", "revisionOf"];
  function canonical(v) {
    if (Array.isArray(v)) return `[${v.map(canonical).join(",")}]`;
    if (v && typeof v === "object") return `{${Object.keys(v).sort().map((k) => `${JSON.stringify(k)}:${canonical(v[k])}`).join(",")}}`;
    return JSON.stringify(v);
  }
  /**
   * Fingerprint of what a reviewer approved: every field except the review metadata.
   * FNV-1a 64-bit (synchronous, identical in the browser and in Node). Not a security hash:
   * it detects edits made to an approved item without a new review-log entry.
   * @param {object} item
   * @returns {string} 16 hex characters.
   */
  function contentHash(item) {
    const clean = {};
    for (const k of Object.keys(item || {})) if (!REVIEW_FIELDS.includes(k)) clean[k] = item[k];
    const s = canonical(clean);
    let h = 0xcbf29ce484222325n;
    const prime = 0x100000001b3n, mask = 0xffffffffffffffffn;
    for (const byte of new TextEncoder().encode(s)) h = ((h ^ BigInt(byte)) * prime) & mask;
    return h.toString(16).padStart(16, "0");
  }

  /* ---------- Bank-level rules (a whole file or category) ---------- */
  const figureKey = (item) => String(item.stimulus && item.stimulus.text || "").replace(/\s+/g, " ").trim();
  const DUP_ERROR = 0.9, DUP_WARN = 0.75;
  const BALANCE_MIN_ITEMS = 20, MAX_POSITION_SHARE = 0.4, MAX_LONGEST_SHARE = 0.4;

  /**
   * Checks that only make sense across items: near-duplicates, the spread of the correct
   * answer's position, and how often the correct answer is the longest option.
   * Position and length checks apply to non-tfcs items once a set has at least 20 of them.
   * @param {object[]} items - Items of one file or one category.
   * @returns {{ errors: string[], warnings: string[] }}
   */
  function bankChecks(items) {
    const errors = [], warnings = [];
    const list = (Array.isArray(items) ? items : []).filter((x) => x && typeof x === "object");
    const grams = list.map((x) => trigrams(`${itemText(x)} ${(x.options || []).join(" ")}`));
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const a = list[i], b = list[j];
        if (a.category !== b.category) continue;
        if (a.category === "abstract" && figureKey(a) && figureKey(a) === figureKey(b)) {
          errors.push(`${a.id} et ${b.id} : même figure (doublon)`);
          continue;
        }
        if (a.category === "abstract") continue; // trigram similarity is meaningless on short symbol strings
        const s = jaccard(grams[i], grams[j]);
        if (s >= DUP_ERROR) errors.push(`${a.id} et ${b.id} : quasi-doublon (similarité ${s.toFixed(2)})`);
        else if (s >= DUP_WARN) warnings.push(`${a.id} et ${b.id} : très proches (similarité ${s.toFixed(2)})`);
      }
    }
    const byCat = {};
    for (const x of list) if (x.itemFormat !== "tfcs" && Array.isArray(x.options) && Number.isInteger(x.correctIndex)) (byCat[x.category] = byCat[x.category] || []).push(x);
    for (const [cat, xs] of Object.entries(byCat)) {
      if (xs.length < BALANCE_MIN_ITEMS) continue;
      const counts = [0, 0, 0, 0, 0];
      let longest = 0;
      for (const x of xs) {
        counts[x.correctIndex]++;
        const len = x.options.map((o) => String(o).length);
        if (len.every((l, k) => k === x.correctIndex || l < len[x.correctIndex])) longest++;
      }
      const top = Math.max(...counts);
      if (top / xs.length > MAX_POSITION_SHARE) errors.push(`${cat} : la bonne réponse est en position ${counts.indexOf(top) + 1} dans ${top}/${xs.length} items (max ${MAX_POSITION_SHARE * 100} %) ; mélangez l'ordre des options`);
      if (longest / xs.length > MAX_LONGEST_SHARE) warnings.push(`${cat} : la bonne réponse est l'option la plus longue dans ${longest}/${xs.length} items (indice exploitable)`);
    }
    // Official descriptions: numerical tests use « tableaux, graphiques », planning means « gérer un agenda ».
    const share = (cat, pred) => { const xs = list.filter((x) => x.category === cat); return xs.length >= BALANCE_MIN_ITEMS ? [xs.filter(pred).length, xs.length] : null; };
    const isType = (...t) => (x) => x.stimulus && t.includes(x.stimulus.type);
    let r = share("numeric", isType("table", "chart"));
    if (r && r[0] / r[1] < 0.4) warnings.push(`numeric : ${r[0]}/${r[1]} items s'appuient sur un tableau ou un graphique (40 % au moins recommandés)`);
    r = share("numeric", isType("chart"));
    if (r && r[0] / r[1] < 0.15) warnings.push(`numeric : ${r[0]}/${r[1]} items s'appuient sur un graphique (15 % au moins recommandés)`);
    r = share("planning", isType("table"));
    if (r && r[0] / r[1] < 0.2) warnings.push(`planning : ${r[0]}/${r[1]} agendas présentés en tableau (20 % au moins recommandés)`);
    return { errors, warnings };
  }

  /* ---------- LLM helpers shared by admin.html and the Node scripts ---------- */
  function fillTemplate(tpl, params) {
    return String(tpl).replace(/\{\{(\w+)\}\}/g, (m, k) => (params[k] !== undefined ? String(params[k]) : m));
  }
  /** Tolerant JSON extraction from an LLM answer (code fences, text around the array). */
  function extractJson(text) {
    let t = String(text || "").trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
    try { return JSON.parse(t); } catch (e) {
      const a = t.indexOf("["), b = t.lastIndexOf("]");
      if (a !== -1 && b > a) return JSON.parse(t.slice(a, b + 1));
      throw e;
    }
  }
  const CONTROLLED = ["reviewer", "reviewedAt", "reviewNotes", "rejectionReason", "revisionOf"];
  /**
   * Normalises LLM output into candidate items.
   * mode "new": fresh items. mode "revise": each item must reuse the id of an original
   * (originals: array of approved items); category, id and creation date are kept,
   * revisionOf is set so that approval replaces the original.
   */
  function prepareCandidates(items, opts) {
    const o = opts || {};
    const problems = [];
    if (!Array.isArray(items)) return { items: [], problems: ["La réponse doit être un tableau JSON"] };
    const originals = new Map((o.originals || []).map((x) => [x.id, x]));
    const out = [];
    items.forEach((raw, i) => {
      if (!raw || typeof raw !== "object" || Array.isArray(raw)) { problems.push(`Élément ${i + 1} ignoré : objet attendu`); return; }
      const item = JSON.parse(JSON.stringify(raw));
      for (const k of CONTROLLED) delete item[k];
      if (o.mode === "revise") {
        const orig = originals.get(item.id);
        if (!orig) { problems.push(`Élément ${i + 1} ignoré : identifiant « ${item.id} » absent des questions à réviser`); return; }
        if (out.some((x) => x.id === item.id)) { problems.push(`Doublon ignoré : ${item.id}`); return; }
        Object.assign(item, { id: orig.id, category: orig.category, version: orig.version || 1, createdAt: orig.createdAt, revisionOf: orig.id });
        if (!item.language) item.language = orig.language;
      } else {
        Object.assign(item, { version: 1, createdAt: o.now || new Date().toISOString() });
        if (o.language) item.language = o.language;
      }
      Object.assign(item, { sourceType: "original_ai_assisted", reviewStatus: "candidate" });
      out.push(item);
    });
    if (o.mode === "revise") for (const id of originals.keys()) if (!out.some((x) => x.id === id)) problems.push(`Aucune révision reçue pour ${id}`);
    return { items: out, problems };
  }
  /** Issues to send with an item being revised: validator findings and editor notes. */
  function revisionContext(schema, item, extraIssues) {
    const r = checkItem(schema, item);
    const issues = [...r.errors, ...r.warnings, ...(extraIssues || [])];
    if (item.reviewNotes) issues.push(`Note du relecteur : ${item.reviewNotes}`);
    const { reviewer, reviewedAt, reviewStatus, ...clean } = item;
    return { item: clean, issues };
  }

  g.EagRules = { validateSchema, semanticChecks, checkItem, bankChecks, isFigureChar, contentHash, similarity, itemText, fillTemplate, extractJson, prepareCandidates, revisionContext };
})(typeof globalThis !== "undefined" ? globalThis : this);
