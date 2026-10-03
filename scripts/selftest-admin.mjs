import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = fs.readFileSync(path.join(ROOT, "admin.js"), "utf8");
const match = source.match(/async function mergeFromServer\(\) \{[\s\S]*?^\}/m);
if (!match) throw new Error("mergeFromServer introuvable dans admin.js");

const state = { aiConfigured: false, workspaceRevision: "old", files: {} };
const added = [];
const reviews = [];
const serverState = {
  aiConfigured: true,
  workspaceRevision: "new",
  candidates: [
    { file: "fresh.json", items: [{ id: "numeric-test-001" }], review: null },
    { file: "existing.json", items: [], review: { reviews: [] } },
  ],
};
state.files["existing.json"] = { ids: [], hasReview: false };
const context = {
  S: state,
  api: async (route) => {
    if (route !== "/api/state") throw new Error(`Route inattendue : ${route}`);
    return serverState;
  },
  addCandidates: (file) => { state.files[file] = { ids: [], hasReview: false }; added.push(file); },
  attachReview: (review) => reviews.push(review),
};

const result = await vm.runInNewContext(`${match[0]}\nmergeFromServer();`, context);
if (state.workspaceRevision !== "new") throw new Error("La fusion serveur ne rafraîchit pas la révision de travail");
if (!state.aiConfigured) throw new Error("La fusion serveur ne rafraîchit pas la configuration IA");
if (result.length !== 1 || result[0] !== "fresh.json" || added[0] !== "fresh.json") throw new Error("La fusion serveur n'ajoute pas correctement les nouveaux candidats");
if (reviews.length !== 1) throw new Error("La fusion serveur ne rattache pas les nouvelles revues");

console.log("Admin self-test passed (fusion serveur et révision de travail)");
