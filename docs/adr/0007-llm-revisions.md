# ADR-0007 : Régénération par LLM sous forme de révisions relues

## Statut
Accepté

## Date
2026-10-01

## Contexte
Les relecteurs veulent améliorer des questions existantes avec un LLM (une question, une sélection, une catégorie entière), et pas seulement en générer de nouvelles. Laisser le modèle réécrire directement `data/approved/` contournerait la relecture humaine (ADR-0003).

## Décision
1. Une question régénérée est un **candidat de révision** : même identifiant, champ `revisionOf`, statut `candidate`. Le schéma interdit `revisionOf` sur une question approuvée.
2. L'approbation (interface ou `promote-candidate.mjs`) **remplace** la question d'origine et incrémente sa version ; le rejet laisse la banque intacte. L'interface affiche un comparatif avant/après.
3. Le prompt de révision (`prompts/revise-bank.md`) transmet chaque question avec ses problèmes détectés et la consigne du relecteur ; le modèle doit garder l'identifiant et la catégorie.
4. La normalisation de la réponse du modèle (`prepareCandidates`, `extractJson` dans `shared/item-rules.js`) est commune au navigateur et aux scripts : champs contrôlés par le pipeline imposés, identifiants inconnus refusés.
5. Deux voies d'appel : l'API configurée dans `.env` via le serveur local (la clé ne quitte jamais l'ordinateur ; revue aveugle enchaînée automatiquement), ou le copier-coller avec n'importe quel chat IA, hors ligne.
6. « Reconstruire une catégorie » produit de nouveaux candidats ; le retrait des anciennes questions reste une action humaine explicite (sélection puis « Retirer »).

## Conséquences

### Positives
- Amélioration rapide de la banque sans perdre le contrôle humain ni la traçabilité (`data/review-log/`).
- Fonctionne sans clé d'API grâce au copier-coller.

### Négatives / Compromis
- Une révision approuvée efface la version précédente du fichier ; l'historique est conservé par Git et par le journal de relecture.
- Les prompts sont intégrés à `admin.js` pour le mode hors ligne (resynchronisés par `npm run build:bank`).
