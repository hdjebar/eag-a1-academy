# ADR-0010 : Banque dans `bank/*.js`, logique de session pure et tests de bout en bout

## Statut
Accepté (modifie l'ADR-0004)

## Date
2026-10-03

## Contexte
Une revue externe du dépôt (3 octobre 2026) relevait que `app.js` (688 Ko) et `admin.js` (945 Ko) étaient presque entièrement constitués de la banque compilée, que les comportements d'interface (chronomètres, enchaînement des tests, revue, parcours d'administration, mise en page mobile, accessibilité) n'étaient couverts par aucun test automatisé, que le tirage dépendait de `Math.random` sans possibilité de le reproduire, et que les actions GitHub n'étaient pas épinglées.

## Décision
1. **Banque hors du code** : `npm run build:bank` écrit `bank/app-bank.js` (`globalThis.EAG_BANK`, figé) et `bank/admin-bank.js` (`globalThis.EAG_ADMIN_DATA` : schéma, banque complète, consignes). Les pages les chargent par une balise `<script>` classique avant leur code : l'ouverture directe du fichier (`file://`) continue de fonctionner. `app.js` passe à environ 20 Ko et `admin.js` à 70 Ko.
2. **Logique de session pure** (`shared/session.js`, `EagSession`) : tirage, ordre des options, notation, construction de l'examen blanc et bilan, sans DOM, avec un générateur aléatoire injectable (`seeded(graine)` pour les tests). Le tirage est **équilibré** : réparti sur toutes les compétences de la catégorie, puis sur les niveaux de difficulté. Tests unitaires : `scripts/test-session.mjs` (dans `npm test`).
3. **Tests de bout en bout** (`tests/e2e/`, Playwright, `npm run test:e2e`, tâche CI dédiée) : chargement sans erreur (HTTP et `file://`), entraînement (bonne réponse, erreur et justification, question passée, bilan), jugement situationnel, examen blanc et expiration du chronomètre, calculatrice, rendu des tableaux, graphiques et figures, texte malveillant affiché littéralement, absence de défilement horizontal à 375 px, accessibilité axe sans violation grave ou critique (thèmes clair et sombre), parcours d'administration complet (approuver, rejeter, enregistrer, contrôle du journal de relecture) sur une copie temporaire du dépôt.
4. **Gouvernance du dépôt** : actions GitHub épinglées par SHA de commit (version en commentaire), mises à jour par Dependabot ; `CODEOWNERS` sur les questions approuvées, le journal de relecture, le schéma et l'outillage de revue. Leur effet dépend des réglages de protection de `main` (vérifications et revue de propriétaire requises), à activer par le propriétaire du dépôt.

## Conséquences
### Positives
- Les modifications de code se relisent sans le bruit de la banque ; les conflits de fusion sur la banque se limitent aux fichiers générés.
- Les régressions d'interface et d'accessibilité sont détectées en CI. Les premiers tests ont révélé et fait corriger deux défauts : un contraste insuffisant (compteurs des modules) et une règle « mouvement réduit » qui figeait les couleurs du thème sombre.

### Négatives / Compromis
- La CI installe Chromium (environ une minute de plus) ; les tests locaux demandent `npx playwright install chromium` une fois.
- Le tirage ne mémorise pas les questions déjà vues d'une visite à l'autre : l'ADR-0001 exclut tout stockage local.
