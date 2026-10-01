# ADR-0005 : Items en texte brut, rendu échappé et formats alignés sur les descriptions GovJobs

## Statut
Accepté

## Date
2026-10-01

## Contexte
Une revue du dépôt a relevé quatre problèmes :
- Les champs des items (énoncé, stimulus, options, explication) étaient insérés tels quels comme HTML, et le guide demandait aux LLM des « tableaux HTML ». Un contenu généré par IA pouvait donc exécuter du code dans l'application si la relecture le laissait passer.
- La bonne réponse était en première position dans 25 items sur 50 et, en jugement situationnel, systématiquement la plus longue ; l'application ne mélangeait pas les options.
- Le jugement situationnel utilisait un format « une seule bonne réponse », alors que GovJobs indique que le candidat doit « évaluer [la] pertinence » de chaque réponse proposée.
- Plusieurs items de raisonnement abstrait utilisaient des chiffres, des lettres ou des mots, alors que GovJobs décrit des « séries de formes ou de matrices géométriques » à compléter.

## Décision
1. **Texte brut** : aucun HTML ni entité dans les items (vérifié par le validateur). Les tableaux et les figures sont des objets `stimulus` structurés (`table`, `shapes`) ; `app.js` construit le rendu et échappe tout le texte.
2. **Options mélangées à l'affichage** pour chaque question (sauf le format Vrai / Faux / On ne peut pas savoir, dont l'ordre est fixe).
3. **Format `rating` pour le jugement situationnel** : chaque réaction est notée de 1 à 4 ; une seule note 4, sur la réaction de référence ; score = concordance avec les notes de référence. Compétences limitées à `servir-client-usager` et `conseiller`.
4. **Raisonnement abstrait** : uniquement des tâches de complétion avec symboles géométriques.
5. **Polices système** à la place d'une police externe, pour que l'application reste réellement hors ligne.

## Conséquences

### Positives
- Un item malveillant ou mal formé ne peut plus injecter de balisage.
- Répondre au hasard ou toujours la même position ne donne plus qu'un score de hasard.
- Les formats d'entraînement correspondent mieux aux descriptions publiques des tests A1.

### Négatives / Compromis
- Les items existants ont été migrés (`version: 2` pour ceux qui ont été réécrits) ; leur relecture humaine reste nécessaire.
- L'échelle 1–4 et le score de concordance sont une convention du projet : le barème réel n'est pas publié.
- Le validateur dépend désormais d'Ajv (outillage de développement uniquement, pas de l'application).
