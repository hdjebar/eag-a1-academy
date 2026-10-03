# ADR-0008 : Traçabilité obligatoire en CI (check-review-log) et génération déterministe de figures abstraites

## Statut
Accepté

## Date
2026-10-02

## Contexte
1. **Audit de la banque (2 octobre 2026)** : Un audit approfondi de la banque de 500 questions a mis en évidence des non-conformités : 66 questions de raisonnement abstrait contenaient des lettres, des chiffres ou des mots au lieu de figures géométriques pures, et 24 questions des autres catégories présentaient des ambiguïtés de clé, des options redondantes ou des dépendances à des connaissances extérieures. 90 questions ont ainsi été retirées, abaissant temporairement la banque à 410 items.
2. **Garantie de non-contournement de la relecture humaine** : Bien que l'ADR-0003 impose une approbation humaine, un script ou une modification manuelle directe dans `data/approved/` pouvait théoriquement être commitée sans passer par le processus de relecture tracé.
3. **Limites des LLM sur la géométrie pure** : La génération par modèle de langage de matrices 3×3 et de séries de formes pures (rotations, décalages, symétries) produit un taux élevé de distracteurs invalides ou d'hallucinations de texte.

## Décision

1. **Porte de relecture en CI (`scripts/check-review-log.mjs`)** :
   - Intégration systématique dans `npm test` et la CI GitHub Actions d'un contrôle strict de traçabilité.
   - Toute question présente dans `data/approved/` doit correspondre exactement à une décision humaine dans `data/review-log/` (identifiant, numéro de version, nom du relecteur, et empreinte cryptographique `EagRules.contentHash`).
   - Toute modification manuelle ou injection non relue invalide le hash et bloque la CI.
   - Les questions préexistantes à l'audit sont inventoriées avec traçabilité dans une base de référence (`data/review-log/2026-10-02-legacy-baseline.json`).

2. **Générateur déterministe de figures abstraites par règles (`scripts/generate-abstract-figures.mjs`)** :
   - Production d'items candidats pour le test géométrique via un moteur algorithmique déterministe sans LLM pour la logique visuelle.
   - Couverture équilibrée des 4 compétences officielles GovJobs A1 : `suite-logique`, `rotation`, `matrice`, `transformation`.
   - Calcul mathématique de la bonne réponse, génération de distracteurs plausibles mais distincts, et vérification d'unicité et de non-ambiguïté (formes géométriques pures uniquement, aucun caractère alphanumérique).
   - Les items générés entrent dans `generated/` avec le statut `candidate` et restent soumis à la revue IA aveugle (`review:bank`) puis à la promotion humaine (`promote:candidate`).

## Conséquences

### Positives
- **Intégrité absolue de la banque** : Aucune question ne peut entrer ou changer dans `data/approved/` sans approbation humaine nominative et traçable dans Git.
- **Conformité stricte au Test Géométrique A1** : 100 % des items abstraits sont garantis être des figures pures, sans biais linguistique ou numérique.
- **Rétablissement pérenne du palier 500 questions** : 112 questions corrigées et de remplacement ont été générées, revues à l'aveugle et promues avec succès, portant chaque catégorie à exactement 100 questions.

### Négatives / Compromis
- `data/review-log/` conserve chaque décision au fil de l'eau, augmentant le volume de fichiers de log dans le dépôt.
