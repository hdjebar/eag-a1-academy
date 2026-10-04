import { assessBlindReviews, candidateReviewHash, versionBumpErrors } from "./lib/review-rules.mjs";

const fail = (m) => { console.error(`❌ revue IA : ${m}`); process.exit(1); };
const single = { id: "numeric-demo-001", itemFormat: "single_best", options: ["1", "2", "3", "4"], correctIndex: 1 };
const rating = { id: "situational-demo-001", itemFormat: "rating", options: ["a", "b", "c", "d"], correctIndex: 0, ratings: [4, 1, 2, 3] };
const pass = assessBlindReviews([single, rating], [
  { id: single.id, chosenIndex: 1, ratings: null, confidence: "high", flags: [] },
  { id: rating.id, chosenIndex: 0, ratings: [4, 1, 2, 3], confidence: "high", flags: [] },
]);
if (pass.some((r) => r.decision !== "pass" || r.candidateHash !== candidateReviewHash(r.id === single.id ? single : rating))) fail("une revue valide a été refusée");

const malformed = [
  { id: rating.id, chosenIndex: 0, ratings: [4], confidence: "high", flags: [] },
  { id: single.id, chosenIndex: 1, ratings: null, flags: [] },
];
if (assessBlindReviews([rating], [malformed[0]])[0].decision === "pass") fail("des notes incomplètes ont été acceptées");
if (assessBlindReviews([single], [malformed[1]])[0].decision === "pass") fail("une confiance absente a été acceptée");
const hash = candidateReviewHash(single);
if (hash === candidateReviewHash({ ...single, options: ["x", "2", "3", "4"] })) fail("l'empreinte ne détecte pas une modification");
if (hash === candidateReviewHash({ ...single, revisionOf: single.id })) fail("l'empreinte ignore revisionOf");

/* versionBumpErrors: accumulated edits may skip versions, but never reuse one. */
const old = { ...single, version: 3 };
if (versionBumpErrors(old, { ...single, version: 4 }).length) fail("un incrément de 1 a été refusé");
const same = versionBumpErrors(old, { ...single, version: 3 });
if (!same.length || !same[0].includes("supérieure à 3")) fail("une modification sans changement de version a été acceptée");
if (versionBumpErrors(old, { ...single, version: 5 }).length) fail("deux modifications accumulées avant sauvegarde ont été refusées");
if (!versionBumpErrors(old, { ...single, version: 2 }).length) fail("un retour de version en arrière a été accepté");
if (versionBumpErrors(null, { ...single, version: 9 }).length) fail("un ajout sans ancienne version a été refusé");

console.log("Blind-review self-test passed (structure stricte, empreinte candidat, version croissante)");
