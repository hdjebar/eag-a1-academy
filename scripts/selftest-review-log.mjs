import { approvingDecisionErrors, removalDecisionErrors, reviewLogErrors, checkReviewLogData, minorDecisionErrors } from "./check-review-log.mjs";
import { EagRules } from "./lib/rules.mjs";

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

/* ---------- helpers for the gate core ---------- */
const mkItem = (over = {}) => ({
  id: "numeric-demo-001", version: 1, category: "numeric", itemFormat: "single_best",
  skill: "moyenne", difficulty: 1, language: "fr", estimatedSeconds: 45,
  prompt: "Question de test suffisamment longue pour le schéma.",
  stimulus: null, options: ["a", "b", "c", "d"], correctIndex: 0,
  optionRationales: ["r1", "r2", "r3", "r4"], explanation: "Explication du test.",
  sourceType: "original_ai_assisted", reviewStatus: "approved",
  createdAt: "2026-10-01T12:00:00Z", reviewer: "Test Reviewer",
  reviewedAt: "2026-10-02T19:00:00Z", ...over,
});
const mkDec = (item, over = {}) => ({
  id: item.id, decision: "approved", version: item.version,
  hash: EagRules.contentHash(item), reviewer: item.reviewer, at: item.reviewedAt, ...over,
});

/* Mixed timezones must order by real instant, not by string:
   « +02:00 » written after « Z » on the same day sorts higher lexically
   while naming an earlier instant. */
{
  // False failure today: the real latest (v1, 19:00Z) must win over a lexicographically
  // greater but real-earlier (v2, 20:00+02:00 = 18:00Z) decision.
  const item = mkItem(); // version 1, reviewedAt 19:00Z
  const v2 = mkItem({ version: 2, reviewedAt: "2026-10-02T20:00:00+02:00" });
  const logs = [{ file: "a.json", log: { decisions: [mkDec(item), mkDec(v2, { reviewer: "Autre Relecteur" })] } }];
  const r = checkReviewLogData([item], logs);
  if (r.errors.length) throw new Error(`Ordre mixte +02:00/Z : l'instant réel doit gagner — ${r.errors.join(" ; ")}`);
}
{
  // False pass today: a lexicographically greater decision that is real-earlier must NOT
  // satisfy the bank; the real latest (v1) leaves the item v2 unapproved.
  const v2 = mkItem({ version: 2, reviewedAt: "2026-10-02T20:00:00+02:00" });
  const v1 = mkDec({ ...v2, version: 1, reviewedAt: "2026-10-02T19:00:00Z" });
  const logs = [{ file: "a.json", log: { decisions: [mkDec(v2), v1] } }];
  const r = checkReviewLogData([v2], logs);
  if (!r.errors.some((e) => e.includes(v2.id) && e.includes("version 2 approuvée sans décision"))) {
    throw new Error(`Ordre mixte +02:00/Z : une décision antérieure (18:00Z réels) ne doit pas valider la banque — ${r.errors.join(" ; ")}`);
  }
}

/* undone resets the lifecycle: an undone approval is neither approved nor disappeared. */
{
  const item = mkItem();
  const undone = { id: item.id, decision: "undone", reviewer: item.reviewer, at: "2026-10-03T10:00:00Z" };
  const r = checkReviewLogData([], [{ file: "a.json", log: { decisions: [mkDec(item), undone] } }]);
  if (r.errors.length) throw new Error(`undone doit réinitialiser le cycle de vie — ${r.errors.join(" ; ")}`);
}
{
  // approve → undo → re-approve ends fully consistent.
  const v1 = mkItem();
  const v2 = mkItem({ version: 2, reviewedAt: "2026-10-03T12:00:00Z" });
  const logs = [{ file: "a.json", log: { decisions: [mkDec(v1), { id: v1.id, decision: "undone", reviewer: v1.reviewer, at: "2026-10-03T10:00:00Z" }, mkDec(v2)] } }];
  const r = checkReviewLogData([v2], logs);
  if (r.errors.length) throw new Error(`approuver → annuler → réapprouver doit passer — ${r.errors.join(" ; ")}`);
}
{
  // Undoing a REVISION restores the previous approval: the bank keeps v1, whose
  // approving decision must become the reference again (not be erased with the revision's).
  const v1 = mkItem();
  const v2 = mkItem({ version: 2, reviewedAt: "2026-10-03T12:00:00Z" });
  const undone = { id: v1.id, decision: "undone", reviewer: v1.reviewer, at: "2026-10-03T14:00:00Z" };
  const r = checkReviewLogData([v1], [{ file: "a.json", log: { decisions: [mkDec(v1), mkDec(v2), undone] } }]);
  if (r.errors.length) throw new Error(`annuler une révision doit rétablir l'approbation v1 — ${r.errors.join(" ; ")}`);
}

/* The item's reviewedAt must match the decision's timestamp. */
{
  const item = mkItem({ reviewedAt: "2026-10-05T09:00:00Z" });
  const r = checkReviewLogData([item], [{ file: "a.json", log: { decisions: [mkDec({ ...item, reviewedAt: "2026-10-02T19:00:00Z" })] } }]);
  if (!r.errors.some((e) => e.includes("date de relecture incohérente"))) {
    throw new Error(`reviewedAt doit être recoupé avec le journal — ${r.errors.join(" ; ")}`);
  }
}

/* Future timestamps are refused. */
{
  const d = mkDec(mkItem(), { at: new Date(Date.now() + 3_600_000).toISOString() });
  if (!approvingDecisionErrors(d).length) throw new Error("Un horodatage dans le futur a été accepté");
  if (!removalDecisionErrors({ ...removal, at: d.at }).length) throw new Error("Un retrait daté du futur a été accepté");
}

/* Exact-duplicate approving decisions are flagged; distinct versions are not. */
{
  const item = mkItem();
  const r = checkReviewLogData([item], [{ file: "a.json", log: { decisions: [mkDec(item), mkDec(item)] } }]);
  if (!r.errors.some((e) => e.includes("décision dupliquée"))) throw new Error("Une décision d'approbation dupliquée est passée inaperçue");
}
{
  const v1 = mkItem();
  const v2 = mkItem({ version: 2, reviewedAt: "2026-10-03T12:00:00Z" });
  const r = checkReviewLogData([v2], [{ file: "a.json", log: { decisions: [mkDec(v1), mkDec(v2)] } }]);
  if (r.errors.some((e) => e.includes("décision dupliquée"))) throw new Error("Deux décisions d'approbation distinctes (v1 puis v2) ont été signalées comme dupliquées");
}

/* minorDecisionErrors: undone / rejected entries are structurally validated. */
{
  const undone = { id: valid.id, decision: "undone", reviewer: "", at: valid.at };
  if (!minorDecisionErrors(undone).length) throw new Error("undone sans relecteur accepté");
  const rejectedOk = { id: valid.id, decision: "rejected", reviewer: valid.reviewer, at: valid.at, reason: "motif de rejet suffisant" };
  if (minorDecisionErrors(rejectedOk).length) throw new Error("rejet valide refusé");
  const rejectedNoReason = { id: valid.id, decision: "rejected", reviewer: valid.reviewer, at: valid.at };
  if (!minorDecisionErrors(rejectedNoReason).length) throw new Error("rejet sans motif accepté");
  const undoneFuture = { id: valid.id, decision: "undone", reviewer: valid.reviewer, at: new Date(Date.now() + 3_600_000).toISOString() };
  if (!minorDecisionErrors(undoneFuture).length) throw new Error("undone daté du futur accepté");
}

console.log("Review-log self-test passed (structure des décisions et cœur du contrôle)");