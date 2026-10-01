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
  const CATCH_ALL_OPTIONS = [/aucune de ces r[ée]ponses/i, /toutes les r[ée]ponses/i, /keine der antworten/i, /alle antworten/i];
  const HTML_LIKE = /<[a-z!/?]|&[a-z]+;|&#\d+;|javascript:/i;

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
    if (item.language === "fr" && item.category === "numeric") {
      const text = strings([item.prompt, item.stimulus, item.options], "x", []).map((s) => s[1]).join(" ");
      if (/\d\.\d/.test(text)) warnings.push("point décimal détecté ; en français, utilisez la virgule (12,5)");
      if (/\d%/.test(text)) warnings.push("écrivez « 12 % » avec une espace");
    }
    if (typeof item.explanation === "string" && options[ci] && item.explanation.trim().toLowerCase() === options[ci].trim().toLowerCase()) errors.push("l'explication se contente de répéter la réponse");
    if (!item.optionRationales && item.reviewStatus !== "approved") warnings.push("optionRationales absent (recommandé)");
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
    const A = trigrams(a), B = trigrams(b);
    if (!A.size || !B.size) return 0;
    let inter = 0;
    for (const x of A) if (B.has(x)) inter++;
    return inter / (A.size + B.size - inter);
  }
  function itemText(item) {
    const s = item.stimulus;
    // Abstract prompts are generic ("Quel élément complète la série ?"): compare the figures instead.
    if (item.category === "abstract" && s && s.text) return `${s.text} ${(item.options || []).join(" ")}`;
    const stim = s == null ? "" : typeof s === "string" ? s : s.text || JSON.stringify(s.rows || "");
    return `${item.prompt || ""} ${stim}`;
  }

  g.EagRules = { validateSchema, semanticChecks, checkItem, similarity, itemText };
})(typeof globalThis !== "undefined" ? globalThis : this);
