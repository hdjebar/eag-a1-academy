import { approvingDecisionErrors } from "./check-review-log.mjs";

const valid = {
  id: "numeric-demo-001", decision: "approved", version: 1, hash: "0123456789abcdef",
  reviewer: "Test Reviewer", at: "2026-10-03T12:00:00.000Z",
};
if (approvingDecisionErrors(valid).length) throw new Error("Une décision de relecture valide a été refusée");
for (const [name, decision] of [
  ["reviewer", { ...valid, reviewer: "" }],
  ["at", { ...valid, at: "hier" }],
  ["hash", { ...valid, hash: "123" }],
  ["version", { ...valid, version: 0 }],
  ["id", { ...valid, id: "bad" }],
]) {
  if (!approvingDecisionErrors(decision).length) throw new Error(`Décision invalide acceptée (${name})`);
}
console.log("Review-log self-test passed (structure des décisions approuvantes)");
