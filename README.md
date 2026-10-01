# EAG A1 Académie

Application web statique, académique et **non officielle** pour se familiariser avec les familles de tests décrites par GovJobs pour l'EAG du groupe A1 au Luxembourg.

## Fonctionnalités

- Raisonnement abstrait, verbal et numérique
- Planification
- Jugement situationnel : « servir le client-usager » et « conseiller », chaque réaction étant notée de 1 à 4
- Diagnostic transversal et simulation chronométrée
- Explications pédagogiques, bilan et modes clair/sombre

Tous les exercices sont originaux. Ils ne reproduisent aucun item officiel et ne prétendent pas prédire la difficulté, le contenu exact ou le score Stanine de l'épreuve.

## Utilisation

Ouvrez `eag-a1-academy.html` dans un navigateur moderne. Aucun serveur, compte, paquet, police externe ni stockage local n'est requis. Les options de réponse sont mélangées à chaque affichage.

Les scripts de la banque de questions (validation, génération, promotion) nécessitent Node.js 22 et `npm ci`.

## Banque de questions et contribution

L'application contient 50 questions originales réparties sur les 5 compétences A1 dans `data/approved/`.

Pour ajouter ou enrichir des questions (via l'interface d'un **Chat LLM**, en **local avec Node.js** ou via **GitHub Actions**) :
* Consultez le guide complet : [docs/AI-QUESTION-BANKS.md](docs/AI-QUESTION-BANKS.md)
* Toute question approuvée passe par une validation déterministe, une revue IA aveugle et une promotion humaine explicite (`--reviewer`, `--approve`)
* Compilez et synchronisez la banque avec `npm run build:bank`
* Vérifiez l'intégrité avec `npm test`

## Administration des questions

Une interface d'administration permet de relire, résoudre à l'aveugle, modifier, approuver ou rejeter les questions, et de suivre la couverture de la banque.

* **Hors ligne** : ouvrez `admin.html`, chargez les fichiers `generated/*.json` (et leurs `*.review.json`), puis téléchargez l'archive produite et décompressez-la à la racine du dépôt.
* **En local** : `npm ci && npm run admin`. Un serveur limité à votre ordinateur lit et écrit directement dans le dépôt, et permet de lancer génération, revue aveugle, `npm test` et l'état Git.

Elle permet aussi de **régénérer des questions avec un LLM** : une question, une sélection ou une catégorie entière, via votre API (mode local) ou par copier-coller avec n'importe quel chat IA. Les versions proposées passent toujours par la file de relecture, avec un comparatif avant/après.

Détails : [docs/AI-QUESTION-BANKS.md](docs/AI-QUESTION-BANKS.md#interface-dadministration).

## Architecture et décisions de conception

Le projet est conçu pour une exécution 100 % hors-ligne, sans serveur ni dépendance runtime, avec un pipeline d'ingestion Zero-Trust pour les contributions assistées par IA.
* Documentation d'architecture complète : [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
* Registre des décisions d'architecture : [docs/adr/](docs/adr/README.md)

## Références officielles

- [Description des tests EAG](https://govjobs.public.lu/fr/nous-rejoindre/epreuve-aptitude-generale/tests-eag.html)
- [Modalités EAG](https://govjobs.public.lu/fr/nous-rejoindre/epreuve-aptitude-generale/modalites-eag.html)
- [FAQ EAG](https://govjobs.public.lu/fr/faq/faq-eag.html)

Les modalités ont évolué le 15 septembre 2026. Vérifiez toujours les pages officielles avant l'épreuve.

## Confidentialité

Aucune donnée n'est envoyée à un serveur. La progression existe uniquement en mémoire et disparaît au rechargement.

## Licence

Code sous licence MIT. Contenu pédagogique original sous CC BY 4.0.
