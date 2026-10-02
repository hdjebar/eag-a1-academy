# Architecture du projet EAG A1 Académie

Ce document décrit l'architecture globale, les principes de conception technique, les flux de données et l'organisation du dépôt **EAG A1 Académie**.

---

## 1. Vue d'ensemble du système

Le projet est conçu selon deux sous-systèmes distincts et complémentaires :

1. **L'application d'entraînement côté client** : Une application web monopage (SPA) 100 % statique, exécutable sans serveur, respectueuse de la vie privée et sans dépendance d'exécution.
2. **Le pipeline de production & validation de données** : Un outillage en Node.js gérant l'ingestion, la validation déterministe, la revue critique par IA et la compilation des banques de questions.

```mermaid
flowchart TB
    subgraph Pipeline ["Pipeline de Données (Node.js & GitHub Actions)"]
        direction TB
        Gen[Génération : Chat LLM / API / Ollama] --> Temp["generated/*.json (Temporaire, non suivi)"]
        Temp --> Rev["Revue IA aveugle (scripts/review-bank.mjs)"]
        Rev --> Val["Validation déterministe (scripts/validate-bank.mjs)"]
        Val --> Prom["Promotion humaine explicite : --reviewer + --approve (scripts/promote-candidate.mjs)"]
        Prom --> Appr["data/approved/*.json (Source pérenne versionnée)"]
        Appr --> Build["scripts/build-bank.mjs"]
    end

    subgraph Runtime ["Application Client (Navigateur Web)"]
        direction TB
        Build -->|"Compilation / Injection"| AppJS["app.js (Code & Banque intégrée)"]
        HTML["eag-a1-academy.html"] --> AppJS
        AppJS --> UI["Interface Utilisateur (Vue d'ensemble, Entraînement, Simulation, Revue)"]
    end
```

---

## 2. Organisation du dépôt

```text
eag-a1-academy/
├── eag-a1-academy.html       # Point d'entrée de l'application (HTML5 sémantique + styles CSS)
├── app.js                    # Moteur de session, rendu réactif et banque de données compilée
├── index.html                # Redirection d'appoint vers eag-a1-academy.html
├── admin.html / admin.js     # Interface d'administration (hors ligne ou via npm run admin)
├── shared/item-rules.js      # Règles communes navigateur + Node (schéma, contrôles, similarité)
├── shared/chart.js           # Rendu SVG des graphiques (barres, courbes) pour l'application et l'admin
│
├── data/
│   ├── review-log/           # Journal des décisions de relecture (qui, quoi, quand, empreinte) ; contrôlé en CI
│   └── approved/             # Source de vérité pérenne : fichiers JSON validés par catégorie
│       ├── abstract.json
│       ├── numeric.json
│       ├── planning.json
│       ├── situational.json
│       └── verbal.json
│
├── generated/                # Zone de travail temporaire (scratchpad) ignorée par Git
│   └── .gitkeep
│
├── schema/
│   └── question.schema.json  # Schéma JSON Schema 2020-12, appliqué par Ajv dans validate-bank.mjs
│
├── scripts/
│   ├── admin-server.mjs      # Serveur local de l'interface d'administration (127.0.0.1, jeton)
│   ├── build-bank.mjs        # Compilation de data/approved/ vers app.js et admin.js
│   ├── generate-bank.mjs     # Génération via API compatible OpenAI (consigne facultative)
│   ├── regenerate-bank.mjs   # Révision de questions approuvées par LLM (sortie : révisions à relire)
│   ├── promote-candidate.mjs # Promotion humaine explicite (relecteur nommé, identifiants listés)
│   ├── review-bank.mjs       # Revue aveugle par LLM, comparée à la clé par le script
│   ├── validate-bank.mjs     # Schéma (Ajv) + règles complémentaires (HTML interdit, notes, longueurs…)
│   └── lib/ai.mjs            # Client HTTP commun compatible OpenAI
│
├── prompts/
│   ├── generate-bank.md      # Consignes système et contraintes de génération
│   ├── revise-bank.md        # Consignes de révision de questions existantes
│   └── review-bank.md        # Consignes de résolution à l'aveugle
│
├── docs/
│   ├── ARCHITECTURE.md       # Présent document
│   ├── AI-QUESTION-BANKS.md  # Guide pratique de génération et enrichissement
│   └── adr/                  # Architecture Decision Records (ADRs)
│
└── .github/workflows/
    ├── generate-test-bank.yml# Workflow de génération à la demande
    └── validate.yml          # Intégration continue (CI) et tests automatiques
```

---

## 3. Principes architecturaux clés

### 3.1. Exécution hors-ligne et compatibilité `file://`
* **Zéro serveur d'application** : L'utilisateur peut double-cliquer sur `eag-a1-academy.html` depuis son explorateur de fichiers.
* **Résolution du blocage CORS** : Les navigateurs bloquent souvent les requêtes `fetch()` vers des fichiers locaux sur le protocole `file://`. Pour contourner cette limite sans imposer de serveur web local (`localhost`), les questions validées sont compilées directement dans [`app.js`](../app.js) entre deux balises balisées :
  ```javascript
  /* QUESTION_BANK_START */
  const q = { ... };
  /* QUESTION_BANK_END */
  ```

### 3.2. Confidentialité absolue (*Privacy by Design*)
* **Aucune télémétrie ni traceur** : Zéro cookie, aucun analytics tiers, aucun appel réseau vers des API externes au runtime.
* **État volatil en mémoire vive** : Les réponses, temps de passage et résultats ne sont stockés que dans l'objet JavaScript `state` en mémoire vive. Rien n'est écrit dans `localStorage` ni `sessionStorage` ; recharger la page réinitialise complètement la session.

### 3.3. Pipeline de données *Zero-Trust*
Tout contenu généré par un LLM est traité comme suspect jusqu'à preuve du contraire :
1. **Validation déterministe** : [`scripts/validate-bank.mjs`](../scripts/validate-bank.mjs) applique le [schéma](../schema/question.schema.json) avec Ajv, puis des règles complémentaires : aucun HTML ni entité, une seule note maximale placée sur la clé (jugement situationnel), options fourre-tout interdites, bonne réponse nettement plus longue signalée, unicité des identifiants, vocabulaire interdit.
2. **Revue IA aveugle** : le modèle relecteur résout chaque item sans voir la clé ; le script compare et ne conclut `pass` qu'en cas de concordance.
3. **Approbation humaine obligatoire** : `promote-candidate.mjs` exige un relecteur nommé et la liste explicite des identifiants approuvés ; la CI refuse toute PR qui laisse des fichiers dans `generated/`.

### 3.4. Rendu sûr et neutre
* **Tirage aléatoire dynamique par catégorie** : pour assurer une rejouabilité maximale sans redondance, chaque session (entraînement guidé de 10 questions, simulation de 15 questions, ou examen blanc de 5 épreuves) procède à un tirage aléatoire sans remise (Fisher-Yates) parmi les questions approuvées de la catégorie (100 par catégorie au 2 octobre 2026).
* **Raisonnement abstrait (Test géométrique)** : le stimulus de type `{ type: "shapes", text: "..." }` permet la représentation structurée et accessible de matrices 3×3 et de suites de figures (rotations, symétries, grilles d'éléments géométriques purs), sans dépendance d'image externe ni risque d'injection.
* **Ordre des options aléatoire** : les options sont mélangées à chaque affichage via l'algorithme de Fisher-Yates (sauf pour le format `tfcs` Vrai / Faux / On ne peut pas savoir qui conserve son ordre logique immuable).
* **Jugement situationnel noté (échelle 1 à 4)** : chaque réaction est notée individuellement. Le score unitaire d'un item situationnel est calculé par la concordance moyenne absolue avec les notes de référence :
  $$\text{score} = \max\left(0, 1 - \frac{\sum_{i=1}^n |k_i - u_i|}{3 \cdot n}\right)$$
  où $u_i$ est la note attribuée par le candidat, $k_i$ la note de référence et $n=4$ le nombre d'options. L'item est considéré comme réussi si $\text{score} \ge 0{,}75$.
* **Explications et justifications unitaires (`optionRationales`)** : 100 % des questions validées fournissent un distracteur argumenté pour chaque option expliquant précisément le piège évité ou la règle cognitive appliquée.
* **Aucune ressource externe** : polices système exclusivement (`system-ui`), aucun appel réseau à l'exécution.

---

## 4. Flux de données et cycles de vie

### Cycle de vie d'une question

```mermaid
stateDiagram-v2
    [*] --> Candidate: Génération (Chat LLM / API)
    Candidate --> ValidatedCandidate: Validation syntaxique (schema/question.schema.json)
    ValidatedCandidate --> ReviewAI: Résolution à l'aveugle (scripts/review-bank.mjs)
    ReviewAI --> Approved: Approbation humaine explicite (scripts/promote-candidate.mjs)
    ReviewAI --> Rejected: Rejet (faute, incohérence, ambiguïté)
    Approved --> Compiled: Compilation statique (scripts/build-bank.mjs)
    Compiled --> LiveRuntime: Disponible hors-ligne dans eag-a1-academy.html
    Rejected --> [*]
    LiveRuntime --> [*]
```

---

## 5. Décisions d'architecture (ADR) et Recherche Psychométrique

Les décisions structurantes du projet sont consignées sous forme d'**Architecture Decision Records** dans le dossier [`docs/adr/`](adr) :

* [ADR-0001 : Application cliente 100% statique et hors-ligne](adr/0001-static-offline-client.md)
* [ADR-0002 : Séparation physique entre `data/approved/` et le scratchpad `generated/`](adr/0002-generated-scratchpad-separation.md)
* [ADR-0003 : Pipeline Zero-Trust pour les banques de questions assistées par IA](adr/0003-ai-zero-trust-pipeline.md)
* [ADR-0004 : Synchronisation des questions par compilation dans app.js](adr/0004-build-bank-compilation.md)
* [ADR-0005 : Items en texte brut, rendu échappé et formats alignés sur GovJobs](adr/0005-plain-text-items-and-official-formats.md)
* [ADR-0006 : Interface d'administration à deux modes (hors ligne et serveur local)](adr/0006-admin-ui.md)
* [ADR-0007 : Régénération par LLM sous forme de révisions relues](adr/0007-llm-revisions.md)

L'étude comparative et le cadre de référence psychométrique sont documentés dans :
* [docs/research/eag-2026-benchmark.md](research/eag-2026-benchmark.md) : Benchmark approfondi des épreuves psychotechniques internationales (EPSO, SHL Direct, GovJobs, psychotechnique.lu, Travaillerpour.be).

