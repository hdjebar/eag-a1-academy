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
- [Pipeline de Questions Assisté par IA (Zero-Trust)](#pipeline-de-questions-assisté-par-ia-zero-trust)
- [Commandes Utiles](#commandes-utiles)
- [Références Officielles & Recherche Psychométrique](#références-officielles--recherche-psychométrique)
- [Confidentialité](#confidentialité)
- [Licence](#licence)

---

## Fonctionnalités

- **5 familles de tests A1** : Raisonnement abstrait, verbal, numérique, planification et jugement situationnel.
- **Formats officiels 2026** :
  - Matrices et suites géométriques pures pour l'abstrait.
  - Formats tabulaires structurés et assertions Vrai / Faux / Indéterminé (`tfcs`).
  - Évaluation de pertinence sur échelle 1 à 4 pour chaque réaction du jugement situationnel (`rating`).
- **Retour pédagogique à 100 %** : chaque option (bonne réponse ou distracteur) intègre une justification unitaire (`optionRationales`) expliquant l'erreur cognitive ou la règle appliquée.
- **Deux modes d'entraînement** :
  - *Entraînement guidé* : correction immédiate après chaque validation avec explication pas à pas.
  - *Simulation chronométrée* : 15 questions en 25 minutes avec correction différée et calcul de concordance.
- **Neutralisation des biais** : brassage aléatoire des options à chaque affichage (algorithme de Fisher-Yates).
- **Zéro dépendance d'exécution** : 100 % hors-ligne, aucune police externe, modes clair et sombre natifs.

---

## Familles d'Épreuves & Formats 2026

Conformément aux directives officielles GovJobs pour le **Groupe de traitement A1** :

| Code | Famille de test | Compétences couvertes | Format d'item | Questions validées |
| :---: | :--- | :--- | :---: | :---: |
| **RA** | **Raisonnement abstrait** | Suite logique, matrice, rotation, transformation | `single_best` (formes pures) | 10 |
| **RV** | **Raisonnement verbal** | Compréhension, inférence, application de consigne, vrai/faux/indéterminé, synthèse | `single_best`, `tfcs` | 10 |
| **RN** | **Raisonnement numérique** | Pourcentage, variation, ratio & proportion, moyenne, lecture de tableau, opérations simples | `single_best` (calculatrice de base) | 10 |
| **PL** | **Planification** | Agenda & contraintes, priorisation, dépendances, disponibilités, conflits | `single_best` (gestion d'agenda) | 10 |
| **JS** | **Jugement situationnel** | Servir le client-usager, Conseiller | `rating` (notes 1 à 4) | 10 |

> **Note importante** : Le test de contrôle/précision ne concerne pas le groupe A1 et n'est donc pas inclus dans cette application.

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

Pour contribuer au code ou valider la banque de questions, Node.js 22+ est requis :

```bash
# Installation des outils de validation (Ajv 2020-12)
npm ci

# Exécution de la suite de tests complète (syntaxe, self-tests, validation des 50 questions, synchronisation)
npm test
```

---

## Architecture & Principes de Conception

Le projet repose sur une séparation physique stricte entre l'application cliente et le pipeline d'ingestion de données :

1. **Client statique (`app.js`, `eag-a1-academy.html`)** :
   - Rendu sécurisé : tout texte d'item est formellement échappé via `esc()` pour neutraliser les injections XSS.
   - Les questions validées de `data/approved/` sont compilées et embarquées dans `app.js` lors du build (`npm run build:bank`), permettant un fonctionnement immédiat même via le protocole `file://`.
2. **Architecture décisionnelle documentée** :
   - [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) : description détaillée des modules, de l'état en mémoire et du cycle de vie.
   - [docs/adr/](docs/adr/README.md) : historique des décisions d'architecture (ADR-0001 à ADR-0005).

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
| `npm test` | Exécute la vérification syntaxique, les 13 cas de self-tests Ajv, la validation des 50 items et le contrôle de synchronisation. |
| `npm run build:bank` | Compile et synchronise `data/approved/*.json` dans `app.js`. |
| `npm run validate:bank` | Valide un ou plusieurs fichiers de questions candidats contre le schéma. |
| `npm run generate:bank` | Génère un lot de questions candidates via API (OpenAI/Ollama). |
| `npm run review:bank` | Lance la revue IA à l'aveugle sur un lot candidat. |
| `npm run promote:candidate -- <fichier> --reviewer "…" --approve …` | Approuve et promeut des questions candidates vers `data/approved/`. |

---

## Références Officielles & Recherche Psychométrique

- **GovJobs Luxembourg** :
  - [Description officielle des tests EAG](https://govjobs.public.lu/fr/nous-rejoindre/epreuve-aptitude-generale/tests-eag.html)
  - [Modalités de passage et déroulement](https://govjobs.public.lu/fr/nous-rejoindre/epreuve-aptitude-generale/modalites-eag.html)
  - [Foire aux questions (FAQ EAG)](https://govjobs.public.lu/fr/faq/faq-eag.html)
- **Étude comparative & Benchmark 2026** :
  - [docs/research/eag-2026-benchmark.md](docs/research/eag-2026-benchmark.md) : dossier d'analyse comparative approfondie des formats psychotechniques internationaux (EPSO, SHL Direct, psychotechnique.lu, Travaillerpour.be, Commission de la fonction publique du Canada).

---

## Confidentialité

L'application ne collecte, ne transmet et ne stocke **aucune donnée personnelle**. Aucune requête réseau n'est émise au cours de l'entraînement. L'état d'avancement de la session réside exclusivement dans la mémoire vive de l'onglet actif et est réinitialisé dès la fermeture ou le rechargement de la page.

---

## Licence

- Code source sous licence [MIT](LICENSE).
- Contenu pédagogique original des questions sous licence [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/).
