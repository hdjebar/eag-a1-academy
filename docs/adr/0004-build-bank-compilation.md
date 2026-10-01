# ADR-0004 : Compilation statique de la banque de données dans `app.js`

## Statut
Accepté

## Date
2026-09-30

## Contexte
Pour respecter l'ADR-0001 (application 100 % hors-ligne, exécutable par simple ouverture du fichier `eag-a1-academy.html`), l'application doit pouvoir être lancée via le protocole `file://` sans nécessiter de serveur local (`http-server`, `live-server` ou `vite`).

Or, la plupart des navigateurs modernes (Chrome, Safari, Edge) appliquent des règles de sécurité CORS restrictives qui bloquent les appels `fetch()` locaux vers des fichiers JSON relatifs (`fetch('data/approved/numeric.json')`) lorsqu'ils sont exécutés depuis une URL `file:///...`.

Deux approches étaient envisageables :
1. **Approche dynamique (Fetch au runtime)** : Imposer aux utilisateurs de lancer un serveur web local (ex. `npx serve .`).
2. **Approche par compilation statique (Build step)** : Compiler les fichiers JSON de `data/approved/` et les injecter directement dans le code source de l'application cliente [`app.js`](../../app.js) avant déploiement.

## Décision
Retenir l'**Approche par compilation statique** :
- Les données sources restent stockées de façon propre, lisible et versionnée sous forme de fichiers JSON indépendants dans `data/approved/*.json`.
- Un script de compilation Node.js ([`scripts/build-bank.mjs`](../../scripts/build-bank.mjs)), accessible via `npm run build:bank`, lit ces fichiers, valide leur conformité et injecte le dictionnaire de questions compilé directement dans [`app.js`](../../app.js) entre deux balises stables :
  ```javascript
  /* QUESTION_BANK_START */
  const q = { ... };
  /* QUESTION_BANK_END */
  ```
- Une option `--check` est intégrée à la suite de tests (`npm test` et CI GitHub Actions) pour interdire tout commit ou PR où `app.js` ne refléterait pas fidèlement l'état de `data/approved/`.

## Conséquences

### Positives
- **Expérience utilisateur optimale** : Double-cliquer sur `eag-a1-academy.html` fonctionne immédiatement sans aucun outil ni message d'erreur CORS.
- **Séparation des préoccupations** : Les contributeurs manipulent des fichiers JSON propres et atomiques dans `data/approved/`, sans avoir à éditer manuellement le code de `app.js`.
- **Intégrité garantie par la CI** : Impossible d'avoir une désynchronisation silencieuse entre les fichiers de données et le bundle exécutable grâce au contrôle `build-bank.mjs --check`.

### Négatives / Compromis
- Nécessite d'exécuter `npm run build:bank` après toute modification manuelle d'un fichier JSON dans `data/approved/`.
- Le fichier `app.js` contient à la fois la logique applicative et les données inlinées.
