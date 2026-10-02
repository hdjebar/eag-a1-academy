# ADR-0006 : Interface d'administration à deux modes (hors ligne et serveur local)

## Statut
Accepté

## Date
2026-10-01

## Contexte
La relecture des questions se faisait en ligne de commande (`promote-candidate.mjs`) et en lisant du JSON. C'était lent, peu adapté à la relecture qualitative (aperçu, résolution à l'aveugle, édition) et sans vue d'ensemble de la banque. Le projet doit rester statique, sans serveur en production ni dépendance d'exécution (ADR-0001).

## Décision
1. Une seule page, `admin.html` + `admin.js`, sans dépendance et sans build front.
2. **Mode hors ligne** (ouverture depuis le disque) : banque approuvée et schéma intégrés à `admin.js` par `build-bank.mjs` (vérifié par `npm test`) ; candidats chargés par glisser-déposer ; résultats exportés dans une archive ZIP.
3. **Mode local** (`npm run admin`) : petit serveur Node (`scripts/admin-server.mjs`, sans dépendance) qui sert la page et une API JSON limitée (`state`, `save`, `run`). Il écoute uniquement `127.0.0.1`, exige un jeton aléatoire par session, vérifie hôte et origine, et revalide toute écriture avec Ajv.
4. **Règles partagées** : `shared/item-rules.js` (script classique) fournit un validateur JSON Schema minimal et les contrôles complémentaires, utilisés par le navigateur et par `validate-bank.mjs`. Le self-test vérifie que ce validateur donne le même verdict qu'Ajv sur tous les cas de test et toutes les questions approuvées.
5. Les décisions (approbation, rejet, modification, retrait) sont tracées dans `data/review-log/`.

## Conséquences

### Positives
- Relecture plus rapide et plus fiable : aperçu réel, résolution à l'aveugle, contrôles en direct, détection des doublons.
- Mêmes garde-fous que la ligne de commande : relecteur nommé, zéro erreur, confirmation explicite si la revue IA n'est pas « pass ».
- Aucun service hébergé, aucune donnée envoyée hors de l'ordinateur.

### Négatives / Compromis
- `admin.js` contient une copie de la banque (resynchronisée par `npm run build:bank`).
- Deux validateurs de schéma coexistent (Ajv et le validateur navigateur) ; leur concordance est testée en CI mais un écart reste possible sur des constructions de schéma non utilisées aujourd'hui.
- Le nom du relecteur est déclaratif : l'interface ne vérifie pas l'identité (la PR et Git restent la trace d'autorité).
