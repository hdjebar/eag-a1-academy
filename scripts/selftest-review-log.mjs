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
{
  // Rejecting a revision and then undoing that rejection must not erase the
  // already-approved bank item with the same id.
  const item = mkItem();
  const rejected = { id: item.id, decision: "rejected", reviewer: item.reviewer, at: "2026-10-03T10:00:00Z", reason: "révision à corriger" };
  const undone = { id: item.id, decision: "undone", reviewer: item.reviewer, at: "2026-10-03T11:00:00Z" };
  const r = checkReviewLogData([item], [{ file: "a.json", log: { decisions: [mkDec(item), rejected, undone] } }]);
  if (r.errors.length) throw new Error(`rejeter puis annuler ne doit pas effacer l'approbation existante — ${r.errors.join(" ; ")}`);
}
{
  // Two independent revise/undo cycles must both restore v1.
  const v1 = mkItem();
  const v2a = mkItem({ version: 2, reviewedAt: "2026-10-03T09:00:00Z", prompt: "Première révision suffisamment longue pour le test." });
  const v2b = mkItem({ version: 2, reviewedAt: "2026-10-03T12:00:00Z", prompt: "Deuxième révision suffisamment longue pour le test." });
  const decisions = [mkDec(v1), mkDec(v2a), { id: v1.id, decision: "undone", reviewer: v1.reviewer, at: "2026-10-03T10:00:00Z" }, mkDec(v2b), { id: v1.id, decision: "undone", reviewer: v1.reviewer, at: "2026-10-03T13:00:00Z" }];
  const r = checkReviewLogData([v1], [{ file: "a.json", log: { decisions } }]);
  if (r.errors.length) throw new Error(`réviser puis annuler deux fois doit rétablir v1 — ${r.errors.join(" ; ")}`);
}
{
  // Remove, re-add the same id, then undo the re-add: removal remains effective.
  const v1 = mkItem();
  const v2 = mkItem({ version: 2, reviewedAt: "2026-10-03T10:00:00Z" });
  const decisions = [mkDec(v1), { id: v1.id, decision: "removed", reviewer: v1.reviewer, at: "2026-10-03T09:00:00Z" }, mkDec(v2), { id: v1.id, decision: "undone", reviewer: v1.reviewer, at: "2026-10-03T11:00:00Z" }];
  const r = checkReviewLogData([], [{ file: "a.json", log: { decisions } }]);
  if (r.errors.length) throw new Error(`annuler une réintégration doit conserver le retrait précédent — ${r.errors.join(" ; ")}`);
}
{
  // Serialization order is irrelevant: timestamps define reject -> undo.
  const item = mkItem();
  const rejected = { id: item.id, decision: "rejected", reviewer: item.reviewer, at: "2026-10-03T10:00:00Z", reason: "révision à corriger" };
  const undone = { id: item.id, decision: "undone", reviewer: item.reviewer, at: "2026-10-03T11:00:00Z" };
  const r = checkReviewLogData([item], [{ file: "late.json", log: { decisions: [undone] } }, { file: "early.json", log: { decisions: [rejected, mkDec(item)] } }]);
  if (r.errors.length) throw new Error(`les journaux hors ordre doivent suivre leurs horodatages — ${r.errors.join(" ; ")}`);
}

/* The item's reviewedAt must match the decision's timestamp. */
{
  const item = mkItem({ reviewedAt: "2026-10-05T09:00:00Z" });
  const r = checkReviewLogData([item], [{ file: "a.json", log: { decisions: [mkDec({ ...item, reviewedAt: "2026-10-02T19:00:00Z" })] } }]);
  if (!r.errors.some((e) => e.includes("date de relecture incohérente"))) {
    throw new Error(`reviewedAt doit être recoupé avec le journal — ${r.errors.join(" ; ")}`);
  }
}

/* Small cross-machine clock skew is tolerated; materially future timestamps are refused. */
{
  const near = mkDec(mkItem(), { at: new Date(Date.now() + 4 * 60_000).toISOString() });
  if (approvingDecisionErrors(near).length) throw new Error("Une faible avance de l'horloge développeur a été refusée");
  const d = mkDec(mkItem(), { at: new Date(Date.now() + 10 * 60_000).toISOString() });
  if (!approvingDecisionErrors(d).length) throw new Error("Un horodatage dans le futur a été accepté");
  if (!removalDecisionErrors({ ...removal, at: d.at }).length) throw new Error("Un retrait daté du futur a été accepté");
}

/* The legacy backfill is accepted only in its one named baseline file. */
{
  const item = mkItem();
  const legacy = mkDec(item, { decision: "legacy" });
  const ok = checkReviewLogData([item], [{ file: "2026-10-02-legacy-baseline.json", log: { decisions: [legacy] } }]);
  if (ok.errors.length) throw new Error(`Le baseline legacy officiel a été refusé — ${ok.errors.join(" ; ")}`);
  const bad = checkReviewLogData([item], [{ file: "forged.json", log: { decisions: [legacy] } }]);
  if (!bad.errors.some((e) => e.includes("legacy autorisée uniquement"))) throw new Error("Une décision legacy hors baseline a été acceptée");
}

/* Exact-duplicate approving decisions are flagged; distinct versions are not. */
{
  const item = mkItem();
  const r = checkReviewLogData([item], [{ file: "a.json", log: { decisions: [mkDec(item), mkDec(item)] } }]);
  if (!r.errors.some((e) => e.includes("décision dupliquée"))) throw new Error("Une décision d'approbation dupliquée est passée inaperçue");
}
{
  const item = mkItem();
  const sameInstant = mkDec(item, { at: "2026-10-02T21:00:00+02:00" });
  const r = checkReviewLogData([item], [{ file: "a.json", log: { decisions: [mkDec(item), sameInstant] } }]);
  if (!r.errors.some((e) => e.includes("décision dupliquée"))) throw new Error("La même décision avec un autre fuseau a échappé au diagnostic de doublon");
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
  const undoneFuture = { id: valid.id, decision: "undone", reviewer: valid.reviewer, at: new Date(Date.now() + 48 * 3_600_000).toISOString() };
  if (!minorDecisionErrors(undoneFuture).length) throw new Error("undone daté du futur accepté");
}

console.log("Review-log self-test passed (structure des décisions et cœur du contrôle)");
