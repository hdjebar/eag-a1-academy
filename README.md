# EAG A1 Académie

Application web statique, académique et **non officielle** pour s'entraîner aux épreuves d'aptitude générale (**EAG – Groupe A1**) de l'État luxembourgeois (GovJobs / CGPO), alignée sur les modalités issues de la **réforme du 15 septembre 2026**.

[![Node.js CI](https://github.com/hdjebar/eag-a1-academy/actions/workflows/validate.yml/badge.svg)](https://github.com/hdjebar/eag-a1-academy/actions/workflows/validate.yml)
[![Zero-Trust AI Pipeline](https://img.shields.io/badge/AI%20Pipeline-Zero--Trust-success)](docs/AI-QUESTION-BANKS.md)
[![100% Offline](https://img.shields.io/badge/Runtime-100%25%20Offline-blue)](docs/ARCHITECTURE.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## Sommaire

- [Fonctionnalités](#fonctionnalités)
- [Familles d'Épreuves & Formats 2026](#familles-dépreuves--formats-2026)
- [Démarrage Rapide](#démarrage-rapide)
- [Architecture & Principes de Conception](#architecture--principes-de-conception)
- [Administration des Questions](#administration-des-questions)
- [Pipeline de Questions Assisté par IA (Zero-Trust)](#pipeline-de-questions-assisté-par-ia-zero-trust)
- [Commandes Utiles](#commandes-utiles)
- [Références Officielles & Recherche Psychométrique](#références-officielles--recherche-psychométrique)
- [Confidentialité](#confidentialité)
- [Licence](#licence)

---

## Fonctionnalités

- **Banque de questions originales relues** : 591 questions approuvées, chacune vérifiée par une résolution à l'aveugle et tracée dans `data/review-log/` ; tirage aléatoire sans remise. Le décompte par catégorie est affiché par `npm run build:bank`.
- **Calculatrice à l'écran** pendant les questions numériques, comme la calculatrice de l'ordinateur autorisée le jour de l'épreuve (appareils personnels interdits).
- **« Le jour de l'épreuve »** (page Ressources) : inscription, durée, langues, calculatrice, notation, résultats, validité, tentatives, aménagements et contact, chaque point relié à sa source officielle (vérifié le 3 octobre 2026).
- **5 familles de tests A1** : Raisonnement abstrait (*Test géométrique* : matrices 3×3 et séries de figures), verbal, numérique, planification et jugement situationnel.
- **Formats officiels 2026** :
  - Matrices et suites géométriques pures pour l'abstrait.
  - Formats tabulaires structurés et assertions Vrai / Faux / Indéterminé (`tfcs`).
  - Évaluation de pertinence sur échelle 1 à 4 pour chaque réaction du jugement situationnel (`rating`).
- **Retour pédagogique à 100 %** : chaque option (bonne réponse ou distracteur) intègre une justification unitaire (`optionRationales`) expliquant l'erreur cognitive ou la règle appliquée.
- **Trois modes d'entraînement** :
  - *Entraînement guidé* : correction immédiate après chaque validation avec explication pas à pas. La durée suit le rythme configuré pour 10 questions (minimum 3 minutes) ; choisir « Toutes les questions » conserve ce rythme et augmente donc la durée avec la taille de la banque.
  - *Simulation chronométrée* : 15 questions en 25 minutes avec correction différée et calcul de concordance.
  - *Examen blanc de 2 h* : les cinq tests A1 l'un après l'autre, écran de consignes et chronomètre par test, bilan par test et moyenne (hypothèse de 24 minutes par test, réglable dans la constante `EXAM` de `app.js` ; GovJobs ne publie ni l'ordre ni le temps par test).
- **Neutralisation des biais** : brassage aléatoire des options à chaque affichage (algorithme de Fisher-Yates).
- **Zéro dépendance d'exécution** : 100 % hors-ligne, aucune police externe, modes clair et sombre natifs.
- **Interface d'administration** (`admin.html`, hors ligne ou via `npm run admin`) : relecture à l'aveugle, édition, approbation nominative, couverture de la banque, import de fichiers de questions.
- **Régénération par LLM** : une question, une sélection ou une catégorie entière, via votre API ou par copier-coller avec un chat IA ; chaque version proposée est relue avant de remplacer l'originale.

---

## Familles d'Épreuves & Formats 2026

Conformément aux directives officielles GovJobs pour le **Groupe de traitement A1** :

| Code | Famille de test | Compétences couvertes | Format d'item | Questions validées |
| :---: | :--- | :--- | :--- | :---: |
| **RA** | **Raisonnement abstrait** *(Test géométrique)* | Suite logique, matrice 3×3, rotation, transformation géométrique | `single_best` (formes pures) | 110 |
| **RV** | **Raisonnement verbal** | Compréhension, inférence, application de consigne, vrai/faux/indéterminé, synthèse | `single_best`, `tfcs` | 110 |
| **RN** | **Raisonnement numérique** | Pourcentage, variation, ratio & proportion, moyenne, lecture de tableau et de graphique, opérations simples | `single_best` (tableaux, graphiques ; calculatrice de base) | 145 |
| **PL** | **Planification** | Agenda & contraintes, priorisation, dépendances, disponibilités, conflits | `single_best` (gestion d'agenda, agendas en tableau) | 126 |
| **JS** | **Jugement situationnel** | Servir le client-usager, Conseiller | `rating` (notes 1 à 4) | 100 |
| **Total** | *Banque étalonnée complète* | *5 épreuves A1 conformes à la réforme GovJobs 2026* | — | **591** |

> **Notes importantes** :
> - **Audit du 2 octobre 2026** : 90 questions retirées (items abstraits contenant des lettres ou chiffres, clé erronée, ambiguïtés, doublons). 112 questions de remplacement et de correction ont été résolues à l'aveugle par des relecteurs IA indépendants, puis approuvées par hdjebar via `npm run promote:candidate` (500 questions).
> - **Passe de réalisme (2–3 octobre 2026)** : questions numériques sur tableaux et graphiques, agendas de planification en tableau, textes verbaux et scénarios situationnels allongés, compétences situationnelles rééquilibrées, et 30 questions originales de style EPSO. Même processus : résolution à l'aveugle, puis approbation par hdjebar (591 questions).
> - **Test géométrique** : L'épreuve communément désignée comme « test géométrique » par les candidats correspond officiellement au **Raisonnement abstrait** (matrices géométriques et séries de figures). Les items sont composés uniquement de formes et de flèches (règle vérifiée par le validateur).
> - **Tirage aléatoire équilibré** : à chaque lancement, les questions sont tirées sans remise dans chaque catégorie, réparties sur toutes les compétences et sur les niveaux de difficulté ; l'ordre des options est mélangé (sauf Vrai / Faux / On ne peut pas savoir). L'application ne garde aucune trace entre deux visites (ADR-0001) : une question vue lors d'une visite précédente peut revenir.
> - **Test de contrôle/précision** : Ce test ne concerne pas le groupe A1 (réservé aux groupes B1 et C1) et n'est donc pas inclus dans cette application.

---

## Démarrage Rapide

### 1. Utilisation de l'application cliente

Aucune installation ni serveur n'est nécessaire pour s'entraîner :

```bash
# Option A : Ouverture directe dans votre navigateur par défaut
open eag-a1-academy.html

# Option B : Via un serveur HTTP local (optionnel)
python3 -m http.server 8080
# Puis ouvrez http://localhost:8080/eag-a1-academy.html dans votre navigateur
```

### 2. Outils de développement et tests

Pour contribuer au code ou valider la banque de questions, Node.js 22.9+ est requis :

```bash
# Installation des outils de validation (Ajv 2020-12)
npm ci

# Exécution de la suite de tests complète (syntaxe, self-tests, validation de la banque, synchronisation)
npm test
```

---

## Architecture & Principes de Conception

Le projet repose sur une séparation physique stricte entre l'application cliente et le pipeline d'ingestion de données :

1. **Client statique (`app.js`, `eag-a1-academy.html`)** :
   - Rendu sécurisé : tout texte d'item est formellement échappé via `esc()` pour neutraliser les injections XSS.
   - Les questions validées de `data/approved/` sont compilées par `npm run build:bank` dans `bank/app-bank.js` (application) et `bank/admin-bank.js` (administration), chargés par des balises `<script>` classiques : l'application fonctionne toujours en ouvrant le fichier HTML directement (`file://`), et le code applicatif (`app.js`, `admin.js`) reste lisible et séparé des données.
2. **Architecture décisionnelle documentée** :
   - [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) : description détaillée des modules, de l'état en mémoire et du cycle de vie.
   - [docs/adr/](docs/adr/README.md) : historique des décisions d'architecture (ADR-0001 à ADR-0010).

---

## Administration des Questions

Une interface d'administration permet de relire, résoudre à l'aveugle, modifier, approuver ou rejeter les questions, et de suivre la couverture de la banque.

* **Hors ligne** : ouvrez `admin.html`, chargez les fichiers `generated/*.json` (et leurs `*.review.json`), puis téléchargez l'archive produite et décompressez-la à la racine du dépôt.
* **En local** : `npm ci && npm run admin`. Un serveur limité à votre ordinateur lit et écrit directement dans le dépôt, et permet de lancer génération, revue aveugle, `npm test` et l'état Git.

Les fichiers de questions JSON s'importent par glisser-déposer (hors ligne), en les copiant dans `generated/` (mode local) ou en collant leur contenu : voir [Importer des fichiers de questions](docs/AI-QUESTION-BANKS.md#importer-des-fichiers-de-questions).

Elle permet aussi de **régénérer des questions avec un LLM** : une question, une sélection ou une catégorie entière, via votre API (mode local) ou par copier-coller avec n'importe quel chat IA. Les versions proposées passent toujours par la file de relecture, avec un comparatif avant/après.

Détails : [docs/AI-QUESTION-BANKS.md](docs/AI-QUESTION-BANKS.md#interface-dadministration).

---

## Pipeline de Questions Assisté par IA (Zero-Trust)

Toute question générée par IA est considérée comme **non fiable par défaut** et doit franchir trois barrières étanches avant intégration :

1. **Revue IA à l'aveugle** : [`scripts/review-bank.mjs`](scripts/review-bank.mjs) soumet l'item sans clé de réponse, sans notes et sans explication. Si le modèle relecteur ne retrouve pas la solution avec une confiance élevée, l'item est bloqué.
2. **Validation déterministe** : [`scripts/validate-bank.mjs`](scripts/validate-bank.mjs) applique le schéma JSON Schema Draft 2020-12 via Ajv et vérifie l'absence de HTML, l'unicité des options, l'absence de distracteurs fourre-tout et la validité des rationales.
3. **Promotion humaine nominative obligatoire** : [`scripts/promote-candidate.mjs`](scripts/promote-candidate.mjs) exige `--reviewer "Prénom Nom"` et la liste explicite des identifiants approuvés (`--approve id1,id2`).

Consultez le guide détaillé : **[docs/AI-QUESTION-BANKS.md](docs/AI-QUESTION-BANKS.md)**.

---

## Commandes Utiles

| Commande | Rôle |
| :--- | :--- |
| `npm test` | Exécute la vérification syntaxique, les self-tests du validateur (cas invalides, formulations légitimes, concordance navigateur / Ajv), la validation de la banque, le contrôle de synchronisation de `bank/*.js`, et le contrôle de relecture (`check:review-log`). |
| `npm run admin` | Lance l'interface d'administration locale (127.0.0.1, jeton par session). |
| `npm run build:bank` | Compile `data/approved/*.json` dans `bank/app-bank.js` et `bank/admin-bank.js`. |
| `npm run validate:bank` | Valide un ou plusieurs fichiers de questions candidats contre le schéma. |
| `npm run generate:bank` | Génère un lot de questions candidates via API (OpenAI/Ollama). |
| `npm run generate:abstract` | Génère des candidats de raisonnement abstrait déterministes par règles géométriques (matrices et suites). |
| `npm run generate:data` | Génère par règles des candidats numériques (tableaux, graphiques) et des agendas de planification en tableau, clés calculées. |
| `npm run regenerate:bank` | Révise des questions approuvées avec un LLM (`IDS`, `INSTRUCTION`) ; résultat à relire dans `generated/`. |
| `npm run review:bank` | Lance la revue IA à l'aveugle sur un lot candidat. |
| `npm run promote:candidate -- <fichier> --reviewer "…" --approve …` | Approuve et promeut des questions candidates vers `data/approved/`. |
| `npm run test:e2e` | Tests de bout en bout Playwright : modes d'entraînement, examen blanc et chronomètre, calculatrice, stimulus, texte malveillant, mobile 375 px, accessibilité (axe, thèmes clair et sombre), parcours d'administration. Premier lancement : `npx playwright install chromium`. |
| `npm run check:review-log` | Vérifie que chaque question approuvée correspond à une décision tracée dans `data/review-log/`. |

---

## Références Officielles & Recherche Psychométrique

- **GovJobs Luxembourg** :
  - [Description officielle des tests EAG](https://govjobs.public.lu/fr/nous-rejoindre/epreuve-aptitude-generale/tests-eag.html)
  - [Modalités de passage et déroulement](https://govjobs.public.lu/fr/nous-rejoindre/epreuve-aptitude-generale/modalites-eag.html)
  - [Foire aux questions (FAQ EAG)](https://govjobs.public.lu/fr/faq/faq-eag.html)
- **Étude comparative & Benchmark 2026** :
  - [docs/research/eag-2026-benchmark.md](docs/research/eag-2026-benchmark.md) : dossier d'analyse comparative approfondie des formats psychotechniques internationaux (EPSO, SHL Direct, psychotechnique.lu, Travaillerpour.be, Commission de la fonction publique du Canada).

---

GovJobs publie la durée totale (2 h), la liste des tests A1 et la notation (Stanine, moyenne d'au moins 5), mais ni l'ordre des tests, ni le temps par test, ni le nombre de questions. L'examen blanc utilise une hypothèse de travail (24 minutes par test) réglable dans la constante `EXAM` en tête de `app.js`.

## Confidentialité

L'application ne collecte, ne transmet et ne stocke **aucune donnée personnelle**. Aucune requête réseau n'est émise au cours de l'entraînement. L'état d'avancement de la session réside exclusivement dans la mémoire vive de l'onglet actif et est réinitialisé dès la fermeture ou le rechargement de la page.

---

## Licence

- Code source sous licence [MIT](LICENSE).
- Contenu pédagogique original des questions sous licence [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/).
