import { EagRules } from "./rules.mjs";

const ALLOWED_FLAGS = new Set([
  "NO_CORRECT_OPTION", "MULTIPLE_DEFENSIBLE", "NEEDS_OUTSIDE_KNOWLEDGE", "MISSING_CONSTRAINT",
  "AMBIGUOUS_WORDING", "ANSWER_GIVEN_AWAY", "ARITHMETIC_OR_UNIT", "LANGUAGE_ERROR",
  "SENSITIVE_CONTENT", "CLAIMS_OFFICIAL", "WRONG_FORMAT",
]);
const REJECT_FLAGS = new Set(["CLAIMS_OFFICIAL", "SENSITIVE_CONTENT"]);

export function candidateReviewHash(item) {
  // Nest the candidate so contentHash's approved-item metadata exclusions do not
  // hide candidate-only fields such as revisionOf or reviewStatus.
  return EagRules.contentHash({ candidate: item });
}

/**
 * A content change must increment the version by exactly one: the review log ties
 * each decision to a version, so an in-place rewrite at the same version would
 * keep the trail ambiguous.
 * @param {{ version?: number }|null} old previous version of the item (null for additions)
 * @param {{ version?: number }} item proposed version of the item
 * @returns {string[]} empty when the transition is valid
 */
export function versionBumpErrors(old, item) {
  if (!old) return [];
  const from = old.version || 1;
  const to = item?.version;
  if (to !== from + 1) return [`la version doit passer de ${from} à ${to} (incrément de 1 attendu)`];
  return [];
}

export function assessBlindReviews(items, answers) {
  const answerList = Array.isArray(answers) ? answers : [];
  const counts = new Map();
  for (const a of answerList) if (a && typeof a === "object" && typeof a.id === "string") counts.set(a.id, (counts.get(a.id) || 0) + 1);

  return items.map((item) => {
    const a = answerList.find((x) => x && typeof x === "object" && x.id === item.id);
    const issues = [];
    if (!a) return { id: item.id, decision: "revise", issues: ["Absent de la réponse du relecteur IA"], candidateHash: candidateReviewHash(item) };
    if (counts.get(item.id) !== 1) issues.push("Réponse du relecteur dupliquée pour cet identifiant");

    const flags = Array.isArray(a.flags) ? a.flags : [];
    if (!Array.isArray(a.flags)) issues.push("Liste de signalements invalide ou absente");
    for (const flag of flags) if (!ALLOWED_FLAGS.has(flag)) issues.push(`Signalement inconnu : ${String(flag)}`);

    const optionCount = Array.isArray(item.options) ? item.options.length : 0;
    if (!Number.isInteger(a.chosenIndex) || a.chosenIndex < 0 || a.chosenIndex >= optionCount) {
      issues.push("Réponse choisie absente ou hors limites");
    }
    if (a.confidence !== "high") issues.push(a.confidence === "medium" || a.confidence === "low" ? `Confiance ${a.confidence} du relecteur` : "Niveau de confiance invalide ou absent");

    if (item.itemFormat === "rating") {
      const r = a.ratings;
      const validRatings = Array.isArray(r) && r.length === optionCount && r.every((v) => Number.isInteger(v) && v >= 1 && v <= 4);
      if (!validRatings) {
        issues.push(`Notes invalides : ${optionCount} entiers de 1 à 4 attendus`);
      } else {
        const max = Math.max(...r);
        const tops = r.map((v, i) => v === max ? i : -1).filter((i) => i >= 0);
        if (tops.length !== 1) issues.push("Le relecteur n'a pas désigné une meilleure réponse unique");
        const top = tops.length === 1 ? tops[0] : -1;
        if (a.chosenIndex !== top) issues.push("chosenIndex ne correspond pas à la meilleure note du relecteur");
        if (top !== item.correctIndex) issues.push(`Meilleure réponse selon le relecteur : option ${top + 1}, clé : option ${item.correctIndex + 1}`);
        if (Array.isArray(item.ratings) && item.ratings.length === r.length) {
          const gap = r.reduce((s, v, i) => s + Math.abs(v - item.ratings[i]), 0) / r.length;
          if (gap > 1) issues.push(`Écart moyen de notation ${gap.toFixed(2)} (> 1)`);
        }
      }
    } else {
      if (a.ratings !== null) issues.push("ratings doit être null pour ce format");
      if (Number.isInteger(a.chosenIndex) && a.chosenIndex !== item.correctIndex) issues.push(`Réponse trouvée à l'aveugle : option ${a.chosenIndex + 1}, clé : option ${item.correctIndex + 1}`);
    }

    issues.push(...flags.filter((f) => ALLOWED_FLAGS.has(f)).map((f) => `Signalement ${f}${a.note ? ` : ${a.note}` : ""}`));
    const decision = flags.some((f) => REJECT_FLAGS.has(f)) ? "reject" : issues.length ? "revise" : "pass";
    return { id: item.id, decision, issues, chosenIndex: a.chosenIndex ?? null, ratings: a.ratings ?? null, confidence: a.confidence ?? null, candidateHash: candidateReviewHash(item) };
  });
}
