import { approvingDecisionErrors, removalDecisionErrors, reviewLogErrors } from "./check-review-log.mjs";

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
const removal = { id: valid.id, decision: "removed", reviewer: valid.reviewer, at: valid.at };
if (removalDecisionErrors(removal).length || !removalDecisionErrors({ ...removal, reviewer: "" }).length) throw new Error("Validation des décisions de retrait incorrecte");
if (reviewLogErrors({ decisions: [] }).length) throw new Error("Journal de relecture valide refusé");
for (const log of [null, [], {}, { decisions: {} }, { decisions: "invalid" }]) {
  if (!reviewLogErrors(log).length) throw new Error("Journal de relecture mal formé accepté");
}
console.log("Review-log self-test passed (structure des approbations et retraits)");
