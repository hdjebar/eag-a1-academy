/*
 * EAG A1 Académie — helpers d'interface partagés entre app.js et admin.js.
 * Une seule définition de esc() et des libellés : la dérive entre les deux
 * pages (sémantique de null, libellés manquants) est ainsi impossible.
 * Script classique exposant globalThis.EagUI ; aucun eval, aucune dépendance.
 */
(function (g) {
  "use strict";

  /* Tout texte d'item est échappé : le contenu des questions est une donnée,
   * jamais du markup. null/undefined rendent une chaîne vide, pas "null". */
  function esc(v) {
    return String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  const CAT_LABEL = { abstract: "Raisonnement abstrait", verbal: "Raisonnement verbal", numeric: "Raisonnement numérique", planning: "Planification", situational: "Jugement situationnel" };
  const SKILL_LABEL = { "suite-logique": "suite logique", matrice: "matrice", rotation: "rotation", transformation: "transformation", comprehension: "compréhension", inference: "inférence", "application-consigne": "application de consigne", "vrai-faux-indetermine": "vrai / faux / indéterminé", synthese: "synthèse", pourcentage: "pourcentage", variation: "variation", "ratio-proportion": "ratio et proportion", moyenne: "moyenne", "lecture-tableau": "lecture de tableau", "lecture-graphique": "lecture de graphique", "operations-simples": "opérations simples", "agenda-contraintes": "agenda et contraintes", priorisation: "priorisation", dependances: "dépendances", disponibilites: "disponibilités", conflits: "conflits d'agenda", "servir-client-usager": "servir le client-usager", conseiller: "conseiller" };
  const RATING_LABEL = ["Très inapproprié", "Plutôt inapproprié", "Plutôt approprié", "Très approprié"];

  g.EagUI = { esc, CAT_LABEL, SKILL_LABEL, RATING_LABEL };
})(typeof globalThis !== "undefined" ? globalThis : this);
