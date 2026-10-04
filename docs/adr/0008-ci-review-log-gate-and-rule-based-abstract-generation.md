# ADR-0008 : Traçabilité obligatoire en CI (check-review-log) et génération déterministe de figures abstraites

## Statut
Accepté

## Date
2026-10-02

## Contexte
1. **Audit de la banque (2 octobre 2026)** : Un audit approfondi de la banque de 500 questions a mis en évidence des non-conformités : 66 questions de raisonnement abstrait contenaient des lettres, des chiffres ou des mots au lieu de figures géométriques pures, et 24 questions des autres catégories présentaient des ambiguïtés de clé, des options redondantes ou des dépendances à des connaissances extérieures. 90 questions ont ainsi été retirées, abaissant temporairement la banque à 410 items.
2. **Traçabilité de la relecture humaine** : Bien que l'ADR-0003 impose une approbation humaine, un script ou une modification manuelle directe dans `data/approved/` pouvait théoriquement être commitée sans passer par le processus de relecture tracé.
3. **Limites des LLM sur la géométrie pure** : La génération par modèle de langage de matrices 3×3 et de séries de formes pures (rotations, décalages, symétries) produit un taux élevé de distracteurs invalides ou d'hallucinations de texte.

## Décision

1. **Porte de relecture en CI (`scripts/check-review-log.mjs`)** :
   - Intégration systématique dans `npm test` et la CI GitHub Actions d'un contrôle strict de traçabilité.
   - Toute question présente dans `data/approved/` doit correspondre exactement à une décision humaine dans `data/review-log/` (identifiant, numéro de version, nom du relecteur et empreinte de contenu `EagRules.contentHash`). L'empreinte est un FNV-1a 64 bits, identique dans le navigateur et dans Node : elle détecte une modification accidentelle ou non tracée, pas une falsification délibérée (ce n'est pas un hachage cryptographique).
   - Toute modification manuelle ou ajout direct sans décision tracée change l'empreinte et fait échouer la CI.
   - Les questions préexistantes à l'audit sont inventoriées dans `data/review-log/2026-10-02-legacy-baseline.json` (décision `legacy`) : cet inventaire reprend le relecteur inscrit dans chaque question et ne constitue pas une nouvelle approbation.
   - Les décisions sont ordonnées par leur instant réel, même lorsque les fichiers de journal ont été enregistrés dans un autre ordre ou utilisent des fuseaux différents.
   - Une décision `undone` annule uniquement la décision chronologiquement précédente du même identifiant. Annuler un rejet ne retire donc pas l'approbation déjà présente dans la banque ; annuler une réintégration restaure le retrait précédent.
   - Deux décisions d'approbation strictement identiques sont refusées. En mode hors ligne, chaque export ne contient que les décisions prises depuis l'export précédent.

2. **Générateur déterministe de figures abstraites par règles (`scripts/generate-abstract-figures.mjs`)** :
   - Production d'items candidats pour le test géométrique via un moteur algorithmique déterministe sans LLM pour la logique visuelle.
   - Couverture équilibrée des 4 compétences officielles GovJobs A1 : `suite-logique`, `rotation`, `matrice`, `transformation`.
   - Calcul mathématique de la bonne réponse, génération de distracteurs plausibles mais distincts, et vérification d'unicité et de non-ambiguïté (formes géométriques pures uniquement, aucun caractère alphanumérique).
   - Les items générés entrent dans `generated/` avec le statut `candidate` et restent soumis à la revue IA aveugle (`review:bank`) puis à la promotion humaine (`promote:candidate`).

## Conséquences

### Positives
- **Traçabilité de la banque** : une question ne peut pas entrer ou changer dans `data/approved/` sans qu'une décision nominative correspondante figure dans `data/review-log/`, faute de quoi la CI échoue.
- **Figures pures** : le validateur rejette tout item abstrait contenant des lettres, chiffres, mots ou idéogrammes.
- **Rétablissement du palier de 500 questions** : 112 questions corrigées et de remplacement ont été résolues à l'aveugle par des relecteurs IA indépendants (toutes les clés confirmées), puis approuvées par hdjebar en ligne de commande, portant chaque catégorie à 100 questions.

### Négatives / Compromis
- `data/review-log/` conserve chaque décision au fil de l'eau, augmentant le volume de fichiers de log dans le dépôt.
- Le contrôle ne vaut que si la CI est obligatoire : sans protection de la branche `main` (vérification `validate` requise), un push direct contourne la porte. Le journal est un fichier du dépôt : il atteste qu'une décision a été enregistrée, pas l'identité de la personne qui l'a écrite.
- Une approbation en lot (`--approve all`) reste possible : la relecture item par item relève de la discipline du relecteur, l'outil ne peut pas la vérifier.
