/**
 * Local admin server: `npm run admin`.
 * Serves admin.html and a small JSON API that reads and writes the repository.
 * Security: listens on 127.0.0.1 only; every API call needs the per-run token
 * (sent as a header, so other websites cannot forge requests); Host and Origin are
 * checked (DNS rebinding); every write is re-validated with the authoritative
 * validator before anything touches the disk.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { checkBank } from "./validate-bank.mjs";
import { syncAppJs } from "./build-bank.mjs";
import { withFileRollback, writeFileAtomic } from "./lib/file-transaction.mjs";
import { withLock } from "./lib/lockfile.mjs";
import { EagRules } from "./lib/rules.mjs";
import { approvingDecisionErrors, removalDecisionErrors, minorDecisionErrors } from "./check-review-log.mjs";
import { versionBumpErrors } from "./lib/review-rules.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CATEGORIES = ["abstract", "verbal", "numeric", "planning", "situational"];
const GENERATED = path.join(ROOT, "generated");
const APPROVED = path.join(ROOT, "data/approved");
const LOG_DIR = path.join(ROOT, "data/review-log");
const STATIC = { "/admin.html": "text/html; charset=utf-8", "/admin.js": "text/javascript; charset=utf-8", "/shared/item-rules.js": "text/javascript; charset=utf-8", "/shared/chart.js": "text/javascript; charset=utf-8" };
const CANDIDATE_NAME = /^[A-Za-z0-9._-]+\.json$/;
const MAX_BODY = 5 * 1024 * 1024;
const TOKEN = crypto.randomBytes(18).toString("base64url");

try { process.loadEnvFile(path.join(ROOT, ".env")); } catch { /* no .env */ }
const aiConfigured = () => ["AI_API_URL", "AI_API_KEY", "AI_MODEL"].every((k) => process.env[k]);

let port = Number(process.env.ADMIN_PORT || 4174);
let running = null; // current task

/* ---------- helpers ---------- */
const readJson = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const writeJson = (file, data) => { writeFileAtomic(file, JSON.stringify(data, null, 2) + "\n"); };
const rel = (file) => path.relative(ROOT, file).split(path.sep).join("/");
const stamp = () => `${new Date().toISOString().replace(/[:.]/g, "-")}-${crypto.randomBytes(3).toString("hex")}`;

function send(res, status, body, type = "application/json; charset=utf-8") {
  res.writeHead(status, {
    "content-type": type,
    "cache-control": "no-store",
    "x-content-type-options": "nosniff",
    "referrer-policy": "no-referrer",
    "content-security-policy": "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'",
  });
  res.end(typeof body === "string" || Buffer.isBuffer(body) ? body : JSON.stringify(body));
}
function hostAllowed(req) {
  return [`127.0.0.1:${port}`, `localhost:${port}`].includes(req.headers.host || "");
}
function tokenValid(req) {
  const given = Buffer.from(String(req.headers["x-admin-token"] || ""));
  const expected = Buffer.from(TOKEN);
  return given.length === expected.length && crypto.timingSafeEqual(given, expected);
}
function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (c) => { size += c.length; if (size > MAX_BODY) { reject(new Error("Requête trop volumineuse")); req.destroy(); } else chunks.push(c); });
    req.on("end", () => { try { resolve(JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}")); } catch { reject(new Error("JSON invalide")); } });
    req.on("error", reject);
  });
}
function candidateFiles() {
  if (!fs.existsSync(GENERATED)) return [];
  return fs.readdirSync(GENERATED).filter((f) => CANDIDATE_NAME.test(f) && !f.endsWith(".review.json")).sort();
}
function approvedState() {
  return Object.fromEntries(CATEGORIES.map((c) => {
    const file = path.join(APPROVED, `${c}.json`);
    return [c, fs.existsSync(file) ? readJson(file) : []];
  }));
}
function candidateState() {
  const candidates = [];
  for (const file of candidateFiles()) {
    let items;
    try { items = readJson(path.join(GENERATED, file)); } catch { continue; }
    if (!Array.isArray(items)) continue;
    const reviewPath = path.join(GENERATED, file.replace(/\.json$/, ".review.json"));
    let review = null;
    try { if (fs.existsSync(reviewPath)) review = readJson(reviewPath); } catch { /* ignore broken review */ }
    candidates.push({ file, items, review });
  }
  return candidates;
}
const workspaceRevision = (approved, candidates) => EagRules.contentHash({ approved, candidates });

/* ---------- API ---------- */
function state() {
  const approved = approvedState();
  const candidates = candidateState();
  return { approved, workspaceRevision: workspaceRevision(approved, candidates), candidates, aiConfigured: aiConfigured() };
}

function save(body) {
  const approved = body.approved && typeof body.approved === "object" ? body.approved : {};
  const candidates = body.candidates && typeof body.candidates === "object" ? body.candidates : {};
  const manual = Array.isArray(body.manual) ? body.manual : [];
  const decisions = Array.isArray(body.log?.decisions) ? body.log.decisions : [];
  const reviewer = String(body.log?.reviewer || "").trim();
  const currentBank = approvedState();
  const currentCandidates = candidateState();
  if (body.workspaceRevision !== workspaceRevision(currentBank, currentCandidates)) {
    const e = new Error("Les données ont changé depuis leur chargement. Rechargez-les avant d'enregistrer."); e.status = 409; throw e;
  }

  // 1. Validate everything before writing anything.
  const errors = [];
  const finalBank = {};
  for (const c of CATEGORIES) {
    const f = path.join(APPROVED, `${c}.json`);
    finalBank[c] = c in approved ? approved[c] : currentBank[c];
  }
  for (const c of Object.keys(approved)) if (!CATEGORIES.includes(c)) errors.push(`Catégorie inconnue : ${c}`);
  for (const c of CATEGORIES) {
    const items = finalBank[c];
    if (!Array.isArray(items)) { errors.push(`${c} : tableau attendu`); continue; }
    const r = checkBank(items);
    errors.push(...r.errors.map((e) => `${c}.json : ${e}`));
    for (const it of items) {
      if (it?.category !== c) errors.push(`${c}.json : ${it?.id} n'appartient pas à cette catégorie`);
      if (it?.reviewStatus !== "approved") errors.push(`${c}.json : ${it?.id} n'est pas au statut approved`);
    }
  }
  const ids = CATEGORIES.flatMap((c) => (Array.isArray(finalBank[c]) ? finalBank[c] : []).map((x) => x?.id));
  const dup = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dup.length) errors.push(`Identifiants dupliqués entre catégories : ${[...new Set(dup)].join(", ")}`);
  for (const [name, items] of Object.entries(candidates)) {
    const isNewChatFile = name.startsWith("chat-") && Array.isArray(items);
    if (!CANDIDATE_NAME.test(name) || name.endsWith(".review.json") || (!fs.existsSync(path.join(GENERATED, name)) && !isNewChatFile)) errors.push(`Fichier candidat refusé : ${name}`);
    if (items !== null && !Array.isArray(items)) errors.push(`${name} : tableau ou null attendu`);
  }
  if (manual.length > 500 || manual.some((x) => !x || typeof x !== "object" || Array.isArray(x))) errors.push("Nouvelles questions : format invalide");
  if (decisions.length && reviewer.length < 2) errors.push("Nom du relecteur manquant pour le journal des décisions");
  const approving = new Set(["approved", "revised", "modified", "legacy"]);
  for (const c of CATEGORIES) {
    const before = new Map(currentBank[c].map((x) => [x.id, x]));
    const after = new Map((Array.isArray(finalBank[c]) ? finalBank[c] : []).map((x) => [x.id, x]));
    for (const [id, item] of before) {
      if (after.has(id)) continue;
      const d = decisions.find((x) => x?.id === id && (x.decision === "removed" || x.decision === "undone"));
      if (!d) errors.push(`${id} : retrait sans décision « removed »`);
      else {
        // « undone » annule l'approbation précédente : un retrait fait immédiatement
        // suite à une annulation n'a pas besoin d'une décision « removed ».
        const invalid = d.decision === "undone" ? minorDecisionErrors(d) : removalDecisionErrors(d);
        if (invalid.length) errors.push(`${id} : décision de retrait invalide (${invalid.join(" ; ")})`);
      }
    }
    for (const [id, item] of after) {
      const old = before.get(id);
      if (old && EagRules.contentHash(old) === EagRules.contentHash(item)) continue;
      const d = decisions.find((x) => x?.id === id && approving.has(x.decision) && x.version === item.version && x.hash === EagRules.contentHash(item));
      if (!d) errors.push(`${id} : ajout ou modification sans décision d'approbation correspondante`);
      else {
        const invalid = approvingDecisionErrors(d);
        if (invalid.length || d.reviewer !== item.reviewer) errors.push(`${id} : décision d'approbation invalide (${[...invalid, ...(d.reviewer !== item.reviewer ? ["relecteur incohérent"] : [])].join(" ; ")})`);
      }
      errors.push(...versionBumpErrors(old, item).map((e) => `${id} : ${e}`));
    }
  }
  if (errors.length) { const e = new Error(errors.slice(0, 20).join("\n")); e.status = 400; throw e; }

  // 2. Write as one recoverable transaction. Candidate deletion happens only inside
  // the same rollback boundary as bank compilation.
  const written = [];
  const deleted = [];
  const manualFile = manual.length ? path.join(GENERATED, `manual-${stamp()}.json`) : null;
  const logFile = decisions.length ? path.join(LOG_DIR, `${stamp()}.json`) : null;
  const touched = [path.join(ROOT, "app.js"), path.join(ROOT, "admin.js"), ...Object.keys(approved).map((c) => path.join(APPROVED, `${c}.json`))];
  for (const name of Object.keys(candidates)) {
    const f = path.join(GENERATED, name);
    touched.push(f, f.replace(/\.json$/, ".review.json"));
  }
  if (manualFile) touched.push(manualFile);
  if (logFile) touched.push(logFile);

  const { total } = withFileRollback(touched, () => {
    for (const c of Object.keys(approved)) { const f = path.join(APPROVED, `${c}.json`); writeJson(f, finalBank[c]); written.push(rel(f)); }
    for (const [name, items] of Object.entries(candidates)) {
      const f = path.join(GENERATED, name);
      if (items === null) {
        fs.rmSync(f, { force: true }); deleted.push(rel(f));
        const r = f.replace(/\.json$/, ".review.json");
        if (fs.existsSync(r)) { fs.rmSync(r); deleted.push(rel(r)); }
      } else { writeJson(f, items); written.push(rel(f)); }
    }
    if (manualFile) { writeJson(manualFile, manual); written.push(rel(manualFile)); }
    if (logFile) { writeJson(logFile, { reviewer, savedAt: new Date().toISOString(), mode: "server", decisions }); written.push(rel(logFile)); }
    return syncAppJs();
  });
  return { written, deleted, build: `app.js et admin.js resynchronisés (${total} questions).` };
}

function run(cmd, args, env = {}) {
  // `shell: true` on Windows is safe only because every interpolated value here is an
  // env var or a validated literal. NEVER append raw user input to `args`: on Windows
  // it would become shell-injectable.
  return new Promise((resolve) => {
    const child = spawn(cmd, args, { cwd: ROOT, env: { ...process.env, ...env }, shell: process.platform === "win32" });
    let output = "";
    const add = (d) => { output += d; if (output.length > 200_000) output = output.slice(-200_000); };
    child.stdout.on("data", add); child.stderr.on("data", add);
    const timer = setTimeout(() => { child.kill(); add("\n⏱ Délai dépassé (10 min), tâche interrompue."); }, 10 * 60 * 1000);
    child.on("close", (code) => { clearTimeout(timer); resolve({ code: code ?? 1, output }); });
    child.on("error", (e) => { clearTimeout(timer); resolve({ code: 1, output: String(e) }); });
  });
}
const REBUILD_INSTRUCTION = "Lot de remplacement complet pour cette catégorie : couvrez toutes les compétences autorisées de manière équilibrée et répartissez les difficultés ; n'imitez pas les questions existantes listées.";
function instructionOf(body) {
  return String(body.instruction || "").replace(/[\u0000-\u001f]+/g, " ").trim().slice(0, 2000);
}
/** After a generation, run the blind AI review on the file it produced. */
async function withReview(result) {
  if (result.code !== 0) return result;
  let file = "";
  try { file = fs.readFileSync(path.join(GENERATED, "latest.txt"), "utf8").trim(); } catch { return result; }
  if (!/^generated\/[A-Za-z0-9._-]+\.json$/.test(file)) return result;
  const review = await run(process.execPath, ["scripts/review-bank.mjs", file]);
  return { code: review.code, output: `${result.output}\n— Revue IA aveugle —\n${review.output}` };
}

async function task(body) {
  const node = process.execPath;
  switch (body.task) {
    case "test": return run(process.platform === "win32" ? "npm.cmd" : "npm", ["test"]);
    case "git": {
      const a = await run("git", ["status", "--short"]);
      const b = await run("git", ["diff", "--stat"]);
      return { code: a.code || b.code, output: `$ git status --short\n${a.output || "(propre)"}\n$ git diff --stat\n${b.output || "(aucune différence)"}` };
    }
    case "generate":
    case "rebuild": {
      if (!CATEGORIES.includes(body.category)) throw Object.assign(new Error("Catégorie invalide"), { status: 400 });
      const count = Number(body.count);
      if (!Number.isInteger(count) || count < 1 || count > 50) throw Object.assign(new Error("Nombre d'items invalide (1 à 50)"), { status: 400 });
      const rebuild = body.task === "rebuild";
      const instruction = [rebuild ? REBUILD_INSTRUCTION : "", instructionOf(body)].filter(Boolean).join(" ");
      return withReview(await run(node, ["scripts/generate-bank.mjs"], { CATEGORY: body.category, COUNT: String(count), INSTRUCTION: instruction, ID_TAG: rebuild ? "rb" : "gen" }));
    }
    case "revise": {
      const approvedIds = new Set(CATEGORIES.flatMap((c) => { const f = path.join(APPROVED, `${c}.json`); return fs.existsSync(f) ? readJson(f).map((x) => x.id) : []; }));
      const ids = Array.isArray(body.ids) ? body.ids.map(String) : [];
      if (!ids.length || ids.length > 50 || ids.some((id) => !approvedIds.has(id))) throw Object.assign(new Error("Liste de questions à réviser invalide (1 à 50 identifiants approuvés)"), { status: 400 });
      return withReview(await run(node, ["scripts/regenerate-bank.mjs"], { IDS: ids.join(","), INSTRUCTION: instructionOf(body) }));
    }
    case "review": {
      const name = String(body.file || "");
      if (!candidateFiles().includes(name)) throw Object.assign(new Error("Fichier candidat introuvable"), { status: 400 });
      return run(node, ["scripts/review-bank.mjs", `generated/${name}`]);
    }
    default: throw Object.assign(new Error("Tâche inconnue"), { status: 400 });
  }
}

/* ---------- Server ---------- */
const server = http.createServer(async (req, res) => {
  try {
    if (!hostAllowed(req)) return send(res, 403, { error: "Hôte non autorisé" });
    const url = new URL(req.url, `http://127.0.0.1:${port}`);
    if (req.method === "GET" && url.pathname === "/") { res.writeHead(302, { location: "/admin.html" }); return res.end(); }
    if (req.method === "GET" && STATIC[url.pathname]) return send(res, 200, fs.readFileSync(path.join(ROOT, url.pathname)), STATIC[url.pathname]);
    if (!url.pathname.startsWith("/api/")) return send(res, 404, { error: "Introuvable" });

    if (!tokenValid(req)) return send(res, 401, { error: "Jeton manquant ou invalide : rouvrez l'adresse affichée par npm run admin" });
    const origin = req.headers.origin;
    if (origin && ![`http://127.0.0.1:${port}`, `http://localhost:${port}`].includes(origin)) return send(res, 403, { error: "Origine non autorisée" });

    if (req.method === "GET" && url.pathname === "/api/state") return send(res, 200, state());
    if (req.method === "POST" && url.pathname === "/api/save") {
      // Read the body first so a /api/run arriving mid-read wins the race
      // (the running check must reflect the state at save time, not at receive time).
      const body = await readBody(req);
      if (running) return send(res, 409, { error: "Une tâche est en cours" });
      return send(res, 200, await withLock(ROOT, "save", () => save(body)));
    }
    if (req.method === "POST" && url.pathname === "/api/run") {
      if (running) return send(res, 409, { error: "Une tâche est déjà en cours" });
      const body = await readBody(req);
      running = body.task;
      try { return send(res, 200, await task(body)); } finally { running = null; }
    }
    return send(res, 404, { error: "Introuvable" });
  } catch (e) {
    return send(res, e.status || 500, { error: e.message });
  }
});

function listen(attempt = 0) {
  server.once("error", (e) => {
    if (e.code === "EADDRINUSE" && attempt < 10) { port++; listen(attempt + 1); }
    else { console.error(e.message); process.exit(1); }
  });
  server.listen(port, "127.0.0.1", () => {
    const url = `http://127.0.0.1:${port}/admin.html#token=${TOKEN}`;
    console.log(`\nAdministration EAG A1 Académie\n  ${url}\n\nAccessible uniquement depuis cet ordinateur. Ctrl+C pour arrêter.\n`);
    if (process.argv.includes("--open")) {
      const opener = process.platform === "darwin" ? ["open", [url]] : process.platform === "win32" ? ["cmd", ["/c", "start", "", url]] : ["xdg-open", [url]];
      try { spawn(opener[0], opener[1], { stdio: "ignore", detached: true }).on("error", () => {}).unref(); } catch { /* print only */ }
    }
  });
}
listen();
