import { assessBlindReviews, candidateReviewHash } from "./lib/review-rules.mjs";

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
console.log("Blind-review self-test passed (structure stricte et empreinte candidat)");
