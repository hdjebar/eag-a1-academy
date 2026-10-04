import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = fs.readFileSync(path.join(ROOT, "admin.js"), "utf8");
const extract = (name) => {
  const match = source.match(new RegExp(`(?:async )?function ${name}\\([^)]*\\) \\{[\\s\\S]*?\\n\\}`, "m"));
  if (!match) throw new Error(`${name} introuvable dans admin.js`);
  return match[0];
};
const mergeSrc = extract("mergeFromServer");
const attachSrc = extract("attachReview");
const reviewCurrentSrc = extract("reviewCurrent");
const pendingLogSrc = extract("pendingLog");

// The server must run the complete staged review gate before opening its write
// transaction. This guards against accepting a log that CI rejects afterwards.
{
  const serverSource = fs.readFileSync(path.join(ROOT, "scripts/admin-server.mjs"), "utf8");
  const gateAt = serverSource.indexOf("checkReviewLogData(stagedItems, logs)");
  const writeAt = serverSource.indexOf("withFileRollback(touched");
  if (gateAt < 0 || writeAt < 0 || gateAt > writeAt) throw new Error("Le serveur n'exécute pas le contrôle CI complet avant d'écrire");
}

const CATS = ["abstract", "verbal", "numeric", "planning", "situational"];
const serverState = {
  aiConfigured: true,
  workspaceRevision: "new",
  approved: { abstract: [], verbal: [], numeric: [], planning: [], situational: [] },
  candidates: [
    { file: "fresh.json", items: [{ id: "numeric-test-001" }], review: null },
    { file: "existing.json", items: [], review: { reviews: [] } },
  ],
};
const mkContext = (state) => ({
  S: state,
  CATS,
  toast: (m) => { state.toasts = state.toasts || []; state.toasts.push(m); },
  api: async (route) => {
    if (route !== "/api/state") throw new Error(`Route inattendue : ${route}`);
    return serverState;
  },
  addCandidates: (file) => { state.files[file] = { ids: [], hasReview: false }; state.added.push(file); },
  attachReview: (review) => state.reviews.push(review),
  setApproved: (bank) => {
    state.approved = JSON.parse(JSON.stringify(bank));
    state.approvedOrig = Object.fromEntries(CATS.map((c) => [c, JSON.stringify(bank[c] || [])]));
    state.bankRefreshed = true;
  },
});

/* 1. Merge after a task refreshes revision + aiConfigured and adds new candidates. */
{
  const state = { aiConfigured: false, workspaceRevision: "old", files: {}, added: [], reviews: [], approvedOrig: { abstract: "[]", verbal: "[]", numeric: "[]", planning: "[]", situational: "[]" }, approved: { abstract: [], verbal: [], numeric: [], planning: [], situational: [] } };
  state.files["existing.json"] = { ids: [], hasReview: false };
  const result = await vm.runInNewContext(`${mergeSrc}\nmergeFromServer();`, mkContext(state));
  if (state.workspaceRevision !== "new") throw new Error("La fusion serveur ne rafraîchit pas la révision de travail");
  if (!state.aiConfigured) throw new Error("La fusion serveur ne rafraîchit pas la configuration IA");
  if (result.length !== 1 || result[0] !== "fresh.json" || state.added[0] !== "fresh.json") throw new Error("La fusion serveur n'ajoute pas correctement les nouveaux candidats");
  if (state.reviews.length !== 1) throw new Error("La fusion serveur ne rattache pas les nouvelles revues");
}

/* 2. Merge guard: unsaved local edits + bank changed on disk -> refuse, keep stale revision. */
{
  const state = {
    aiConfigured: false, workspaceRevision: "old", files: {}, added: [], reviews: [],
    approvedOrig: { abstract: "[]", verbal: "[]", numeric: "[]", planning: "[]", situational: "[]" },
    approved: { abstract: [], verbal: [], numeric: [{ id: "numeric-edit-001" }], planning: [], situational: [] },
  };
  serverState.approved = { abstract: [], verbal: [], numeric: [{ id: "numeric-server-001" }], planning: [], situational: [] };
  const result = await vm.runInNewContext(`${mergeSrc}\nmergeFromServer();`, mkContext(state));
  if (result.length !== 0 || state.added.length !== 0) throw new Error("La fusion a ignoré la modification simultanée de la banque");
  if (state.workspaceRevision !== "old") throw new Error("La fusion a rafraîchi la révision malgré un conflit de banque");
  if (!state.toasts?.some((t) => t.includes("a changé sur le disque"))) throw new Error("La fusion n'a pas averti d'un changement concurrent de la banque");
  serverState.approved = { abstract: [], verbal: [], numeric: [], planning: [], situational: [] };
}

/* 3. Clean local state adopts a bank that changed on disk. */
{
  const state = {
    aiConfigured: false, workspaceRevision: "old", files: {}, added: [], reviews: [],
    approvedOrig: { abstract: "[]", verbal: "[]", numeric: "[]", planning: "[]", situational: "[]" },
    approved: { abstract: [], verbal: [], numeric: [], planning: [], situational: [] },
  };
  serverState.approved = { abstract: [], verbal: [], numeric: [{ id: "numeric-server-001" }], planning: [], situational: [] };
  await vm.runInNewContext(`${mergeSrc}\nmergeFromServer();`, mkContext(state));
  if (!state.bankRefreshed || state.approved.numeric[0]?.id !== "numeric-server-001") throw new Error("La vue admin n'actualise pas une banque modifiée sur le disque");
  if (state.workspaceRevision !== "new") throw new Error("La révision de travail n'est pas actualisée avec la banque disque");
  serverState.approved = { abstract: [], verbal: [], numeric: [], planning: [], situational: [] };
}

/* 4. attachReview attaches only reviews whose candidateHash matches the current item. */
{
  const state = {
    cands: [
      { file: "c.json", item: { id: "numeric-c-001", prompt: "x" }, ai: null, aiStale: true },
      { file: "c.json", item: { id: "numeric-c-002", prompt: "y" }, ai: null, aiStale: true },
    ],
    files: { "c.json": { ids: [], hasReview: false } },
  };
  const ctx = { ...mkContext(state), R: { contentHash: (o) => "h" + JSON.stringify(o.candidate) } };
  const review = {
    reviews: [
      { id: "numeric-c-001", decision: "pass", candidateHash: "h" + JSON.stringify({ id: "numeric-c-001", prompt: "x" }) },
      { id: "numeric-c-002", decision: "pass", candidateHash: "stale-hash" },
    ],
  };
  const n = vm.runInNewContext(`${attachSrc}\n${reviewCurrentSrc}\nattachReview(${JSON.stringify(review)});`, ctx);
  if (n !== 1) throw new Error("attachReview a rattaché une revue obsolète ou n'a pas rattaché la revue courante");
  const [c1, c2] = state.cands;
  if (c1.ai?.decision !== "pass" || c1.aiStale !== false) throw new Error("attachReview n'a pas mis à jour l'item courant");
  if (c2.ai !== null || c2.aiStale !== true) throw new Error("attachReview a accepté une revue obsolète");
}

/* 5. A second offline export contains only decisions made since the first one. */
{
  const state = { log: [{ id: "a" }, { id: "b" }], exportedLogCount: 2 };
  const none = vm.runInNewContext(`${pendingLogSrc}\npendingLog();`, { S: state });
  if (none.length) throw new Error("Le second export hors ligne répète des décisions déjà exportées");
  state.log.push({ id: "c" });
  const next = vm.runInNewContext(`${pendingLogSrc}\npendingLog();`, { S: state });
  if (next.length !== 1 || next[0].id !== "c") throw new Error("L'export hors ligne n'isole pas les nouvelles décisions");
}

/* 6. Offline instructions stage the generated bank files, not the old bundles. */
{
  if (!source.includes('git add data bank/app-bank.js bank/admin-bank.js')) {
    throw new Error("La commande de commit hors ligne oublie les banques générées");
  }
  if (source.includes('git add data app.js admin.js')) {
    throw new Error("La commande de commit hors ligne référence encore les anciens bundles");
  }
}

console.log("Admin self-test passed (fusion serveur, actualisation disque, garde de conflit, revues, export incrémental, commande de commit)");
