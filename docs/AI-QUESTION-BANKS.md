# Pipeline de génération et d'enrichissement de la banque de questions

Ce projet traite toute sortie générée par IA comme du matériel candidat **non fiable par défaut**. Un item n'entre dans `data/approved/` que si : il passe la validation déterministe, une revue IA **aveugle** retrouve la même réponse que l'auteur, et une personne nommée l'approuve explicitement, identifiant par identifiant.

---

## Principes

1. **Aucune contrefaçon & vocabulaire réservé** : ne jamais reproduire, mémoriser ou reconstituer des questions de l'épreuve réelle. Les items sont 100 % originaux. Formulations formellement interdites par le validateur : `question officielle`, `item officiel`, `barème officiel`, `confidentiel` (ainsi que toute variante de cette racine lexicale).
2. **Texte brut uniquement** : aucun HTML, aucune balise, aucune entité (`&nbsp;`) dans les items. Tout texte est échappé par le moteur de rendu.
3. **Conformité aux descriptions officielles A1** (page GovJobs « Les tests de l'EAG ») :
   - **abstrait (*Test géométrique*)** : compléter une série ou une matrice 3×3 de **figures géométriques pures** (symboles géométriques uniquement, ni lettres, ni chiffres, ni mots) via un stimulus `{ "type": "shapes", "text": "..." }` ;
   - **verbal** : répondre ou appliquer une consigne à partir du seul texte (formats `single_best` ou `tfcs` Vrai / Faux / Indéterminé) ;
   - **numérique** : tableaux, graphiques, données chiffrées, opérations simples (calculatrice de base autorisée) ;
   - **planification** : gérer un agenda sous contraintes (délais, disponibilités, priorités, dépendances) ;
   - **jugement situationnel** : **noter chaque réaction** de 1 à 4 (format `rating`), compétences « servir le client-usager » et « conseiller » uniquement.
4. **Exigences psychométriques du validateur** :
   - **Longueur des options** : avertissement si la bonne réponse dépasse 1,4 fois la plus longue des autres options ; avertissement de banque si elle est l'option la plus longue dans plus de 40 % des items d'une catégorie ;
   - **Position de la bonne réponse** (règle de banque, erreur) : dès 20 items hors `tfcs`, aucune position ne doit porter plus de 40 % des bonnes réponses. L'application mélange aussi les options à l'affichage ;
   - **Règles du format `rating`** : exactement une note 4, placée à `correctIndex` (position libre), et au moins 3 notes distinctes parmi 1 à 4 (avertissement sinon) ;
   - **Raisonnement abstrait** : figures uniquement (flèches, formes géométriques ; ni lettres, ni chiffres, ni mots, ni idéogrammes) et exactement un « ? » dans le stimulus ;
   - **Doublons** (règle de banque) : même figure abstraite, ou similarité textuelle ≥ 0,9 dans une catégorie = erreur ; ≥ 0,75 = avertissement ;
   - **Rationales obligatoires à 100 %** : une explication générale et une justification détaillée par option (`optionRationales`) expliquant l'erreur cognitive ou la règle appliquée.

Le contrat complet est dans [`schema/question.schema.json`](../schema/question.schema.json) ; les consignes de rédaction sont dans [`prompts/generate-bank.md`](../prompts/generate-bank.md).

### Formats de `stimulus`

```json
"stimulus": "Texte simple. Les retours à la ligne sont conservés."
"stimulus": { "type": "shapes", "text": "●  ■  ▲\n■  ▲  ●\n▲  ●  ?" }
"stimulus": { "type": "table", "caption": "Demandes par service", "headers": ["Service", "Janv.", "Févr."], "rows": [["A", 120, 138], ["B", 80, 96]] }
"stimulus": { "type": "chart", "kind": "bar", "caption": "Dossiers traités par mois", "unit": "dossiers", "labels": ["Janv.", "Févr.", "Mars"], "series": [{ "name": "Service A", "values": [120, 138, 150] }] }
```

Les graphiques (`kind` : `bar` ou `line`, 1 à 3 séries) sont dessinés en SVG par `shared/chart.js`, valeurs affichées, avec un tableau équivalent pour les lecteurs d'écran.

**Réalisme (avertissements du validateur)** : textes verbaux de 40 à 200 mots, scénarios situationnels de 30 à 120 mots ; au moins 40 % des items numériques sur tableau ou graphique (dont 15 % de graphiques) ; au moins 20 % des agendas de planification en tableau.

---

## Méthode 1 : interface de chat LLM (sans clé d'API)

1. Copiez le contenu de [`prompts/generate-bank.md`](../prompts/generate-bank.md) dans votre chat (ChatGPT, Claude, Gemini, Le Chat…).
2. Remplacez les paramètres entre `{{ }}` : catégorie, nombre d'items, compétences, langue, préfixe d'identifiant (par ex. `numeric-chat2610`), date ISO, et collez le schéma à la place de `{{SCHEMA_JSON}}`.
3. Enregistrez le tableau JSON renvoyé dans `generated/`, par ex. `generated/candidats-numeric.json`.
4. Validez :

```bash
npm ci
node scripts/validate-bank.mjs generated/candidats-numeric.json
```

5. Faites relire les items à l'aveugle (Méthode 2, `npm run review:bank -- <fichier>`) ou, sans API, vérifiez vous-même chaque réponse **sans regarder la clé**, puis promouvez en assumant ce choix :

```bash
node scripts/promote-candidate.mjs generated/candidats-numeric.json \
  --reviewer "Prénom Nom" --approve numeric-chat2610-001,numeric-chat2610-003 --ignore-ai-review
```

---

## Méthode 2 : génération locale (API compatible OpenAI ou Ollama)

### Configuration `.env` (ignoré par Git)

```bash
AI_API_URL="https://api.openai.com/v1/chat/completions"
AI_API_KEY="votre-cle-api"
AI_MODEL="gpt-4o-mini"

# Ou Ollama local :
# AI_API_URL="http://localhost:11434/v1/chat/completions"
# AI_API_KEY="ollama"
# AI_MODEL="llama3"
```

### Commandes

```bash
npm ci
CATEGORY=planning COUNT=10 npm run generate:bank   # COUNT : entier de 1 à 50 ; LANGUAGE=fr|de optionnel
npm run review:bank                                # revue aveugle → fichier .review.json
npm run validate:bank                              # validation de tous les candidats
node scripts/promote-candidate.mjs generated/<fichier>.json --reviewer "Prénom Nom" --approve <id1,id2>
npm test
```

**Revue aveugle** : `review-bank.mjs` n'envoie au modèle relecteur ni la clé, ni les notes, ni les explications. Le script compare ensuite sa réponse à la clé : décision `pass` seulement si les deux concordent (et, pour le jugement situationnel, si les notes sont proches), sans signalement ni confiance faible.

**Promotion** : `promote-candidate.mjs` exige un relecteur nommé (`--reviewer`) et la liste des identifiants retenus (`--approve`, ou `--approve all` comme choix explicite). Un item dont la revue n'est pas `pass` reste bloqué, sauf `--ignore-ai-review`. Les items promus reçoivent `reviewStatus: "approved"`, `reviewer` et `reviewedAt`, sont retirés du fichier candidat, et `bank/app-bank.js` ainsi que `bank/admin-bank.js` sont resynchronisés. `--dry-run` montre l'effet sans rien écrire.

**Contrôle de relecture (CI)** : `npm test` lance `scripts/check-review-log.mjs`. Chaque question de `data/approved/` doit correspondre à une décision humaine de `data/review-log/` (identifiant, version, relecteur et empreinte du contenu approuvé, `EagRules.contentHash`). `promote-candidate.mjs` et la page d'administration écrivent ces décisions. Une question ajoutée par un script ou modifiée à la main fait échouer la CI tant qu'elle n'a pas été relue et approuvée par l'une de ces deux voies. Les questions présentes lors de la mise en place du contrôle sont inventoriées dans `data/review-log/2026-10-02-legacy-baseline.json` (décision `legacy`, sans nouvelle approbation).

---

## Méthode 3 : GitHub Actions

1. Secrets du dépôt : `AI_API_URL`, `AI_API_KEY` ; variable : `AI_MODEL`. Recommandé : un secret `BOT_TOKEN` (jeton à grain fin, droits *contents* et *pull requests* en écriture). Sans lui, la PR est ouverte avec `GITHUB_TOKEN`, et GitHub ne déclenche alors pas le workflow de validation sur cette PR (relancez-le à la main via *Run workflow*).
2. **Actions → Generate candidate test bank → Run workflow**.
3. Le workflow génère, fait la revue aveugle, valide, dépose un artefact et ouvre une PR.
4. **La PR ne peut pas être fusionnée telle quelle** : la CI échoue tant que des fichiers restent dans `generated/`. Le relecteur extrait la branche, lance `promote-candidate.mjs` avec ses choix, supprime les fichiers candidats, pousse, puis fusionne.

---

## Méthode 4 : Génération déterministe par règles (abstrait, numérique, planification)

Pour le **Raisonnement abstrait** (Test géométrique), les figures ne doivent comporter aucun chiffre, lettre ou mot. Un générateur par règles déterministes est disponible pour produire des matrices 3×3, des rotations, des transformations et des suites logiques sans risque d'hallucination de contenu textuel :

```bash
# Génère les candidats nécessaires pour atteindre la cible par compétence (ici 100 items au total)
npm run generate:abstract generated/candidats-abstrait.json -- --target 100

# Valide et lance la revue aveugle
npm run validate:bank generated/candidats-abstrait.json
npm run review:bank generated/candidats-abstrait.json

# Promotion humaine explicite après relecture
node scripts/promote-candidate.mjs generated/candidats-abstrait.json --reviewer "Prénom Nom" --approve all
```

Le script calcule la solution mathématiquement, vérifie l'unicité des formes (en tenant compte des rotations et symétries) et produit des distracteurs distincts et plausibles.

Le même principe vaut pour les questions numériques sur tableaux et graphiques et pour les agendas de planification en tableau :

```bash
npm run generate:data generated/candidats-donnees.json -- --numeric 20 --planning 10
```

Les deux générateurs utilisent par défaut la date du jour comme graine (`--seed` pour reproduire un lot) et numérotent les identifiants à la suite de ceux déjà présents dans `data/approved/` et `generated/` ; des données identiques à un item existant ne sont pas régénérées.

---

## Interface d'administration

La même page, `admin.html`, fonctionne en deux modes.

| | Hors ligne (`admin.html` ouvert depuis le disque) | Local (`npm run admin`) |
| :--- | :--- | :--- |
| Banque approuvée | intégrée à `admin.js` par `npm run build:bank` | lue sur le disque |
| Candidats | glisser-déposer des fichiers `generated/*.json` et `*.review.json` | chargés automatiquement depuis `generated/` |
| Enregistrement | archive `.zip` à décompresser à la racine du dépôt | écrit dans le dépôt, puis `bank/*.js` recompilés |
| Tâches | — | génération, revue aveugle, `npm test`, état Git |
| Session | sauvegardée dans le navigateur, reprise possible | l'état fait foi sur le disque |

**File de relecture** : pour chaque candidat, aperçu tel que le voit l'apprenant, **résolution à l'aveugle** (la clé reste masquée jusqu'à votre réponse), résultat de la revue IA, contrôles automatiques (mêmes règles que `validate-bank.mjs`), questions proches déjà présentes, et éditeur complet (énoncé, tableau ou figures, options, notes, justifications).

**Décisions** : *Approuver* exige un nom de relecteur et zéro erreur ; si la revue IA n'est pas `pass` (absente, `revise`, `reject` ou obsolète après modification), vous devez cocher « J'ai vérifié la réponse moi-même ». *Rejeter* exige un motif. Chaque décision est consignée dans `data/review-log/<date>.json`.

**Banque approuvée** : couverture par catégorie, compétence et difficulté (les compétences absentes sont signalées), alertes, questions très proches ; modification d'une question (version incrémentée, relecteur et date mis à jour) ou retrait.

**Sécurité du mode local** : le serveur n'écoute que `127.0.0.1` ; chaque appel exige le jeton affiché au démarrage ; l'hôte et l'origine sont vérifiés ; tout enregistrement est revalidé avec le validateur de référence (Ajv) avant écriture ; seuls les fichiers de `data/approved/`, `data/review-log/` et `generated/` peuvent être écrits.

Après un enregistrement : relisez `git diff`, puis committez. La CI refuse toujours les PR qui laissent des fichiers dans `generated/`.

---

## Importer des fichiers de questions

Tout fichier JSON de questions candidates (sorties de `generate:bank` ou `regenerate:bank`, fichiers exportés par l'interface, réponses d'un chat IA enregistrées) peut être importé dans la file de relecture.

| Méthode | Comment | Remarques |
| :--- | :--- | :--- |
| **Glisser-déposer** (hors ligne) | Ouvrez `admin.html`, puis glissez les fichiers sur « Charger des candidats » ou cliquez sur « choisissez des fichiers ». | Plusieurs fichiers à la fois. Les fichiers `*.review.json` se rattachent à leurs questions par identifiant : chargez-les en même temps que les questions ou après. |
| **Dossier `generated/`** (local) | Copiez les fichiers dans `generated/`, puis rechargez la page de `npm run admin` (ou « Recharger depuis le disque » dans l'onglet Exporter). | Tous les fichiers `generated/*.json` sont chargés automatiquement avec leur revue. |
| **Coller du JSON** (les deux modes) | « Générer avec l'IA… » → « Copier-coller avec un chat IA » → collez le JSON dans « Réponse JSON du chat » → « Importer ». | Le texte autour du JSON et les blocs de code sont ignorés. Les champs gérés par le pipeline sont complétés automatiquement. |

Format attendu : un **tableau JSON** de questions conformes à [`schema/question.schema.json`](../schema/question.schema.json). Un fichier de revue est un objet `{"reviews": [...]}` produit par `review:bank`.

Après l'import, chaque question passe par le même circuit : aperçu, résolution à l'aveugle, contrôles, édition, puis approbation ou rejet. Une question dont l'identifiant existe déjà dans la banque est signalée au chargement (hors ligne) et bloquée à l'approbation (dans les deux modes), sauf s'il s'agit d'une révision (`revisionOf`) : changez alors son identifiant dans l'éditeur. Le collage via « Générer avec l'IA… » importe toujours des questions nouvelles ; pour importer des révisions, utilisez le collage depuis « Régénérer avec l'IA » sur les questions concernées.

### Limites actuelles

- **Glisser-déposer et dossier `generated/`** : les fichiers sont importés tels quels. Si des questions n'ont pas les champs normalement ajoutés par le pipeline (`version`, `createdAt`, `sourceType`, `reviewStatus`), elles apparaissent avec des erreurs à corriger dans l'éditeur. Pour un import automatique de ces champs, utilisez plutôt **Coller du JSON**.
- **Ancien format** (antérieur à la version 1.3.0 : tableaux HTML, compétences en texte libre, sans `itemFormat`, jugement situationnel à réponse unique) : les questions sont importées mais ne passent pas la validation ; chaque question doit être corrigée dans l'éditeur.
- **Une seule question** : le fichier doit contenir un tableau, même pour une question (`[ { … } ]`).
- **Mode local** : pas de bouton d'envoi de fichier ; copiez les fichiers dans `generated/`.

Les fichiers chargés hors ligne restent dans la session du navigateur (« Reprendre la session précédente ») jusqu'à l'export ou à « Effacer la session locale ».

---

## Régénérer des questions avec un LLM

Quatre usages, depuis l'interface d'administration (ou la ligne de commande) :

| Usage | Où | Résultat |
| :--- | :--- | :--- |
| **Réviser une question** | Banque approuvée → question → « Régénérer avec l'IA » | une révision dans la file de relecture |
| **Réviser une sélection** | Banque approuvée → cases à cocher (« Tout (filtre) », « Avec alertes ») → « Régénérer avec l'IA » | une révision par question |
| **Générer de nouvelles questions** | File de relecture → « Générer avec l'IA… » | nouveaux candidats |
| **Reconstruire une catégorie** | File de relecture → « Reconstruire une catégorie… » | un lot complet de remplacement ; approuvez ce que vous gardez, puis retirez les anciennes questions (sélection → « Retirer ») |

Chaque question à réviser est envoyée avec les problèmes détectés (erreurs, alertes, notes de relecture) et votre consigne (texte libre ou consignes prêtes à l'emploi : lever l'ambiguïté, équilibrer la longueur des options, rendre plus difficile…). Le modèle suit [`prompts/revise-bank.md`](../prompts/revise-bank.md).

**Une révision ne modifie jamais la banque directement.** Elle garde l'identifiant de la question et porte `revisionOf`. Dans la file de relecture, elle est marquée « Révision », avec un tableau **Avant / Après** des champs modifiés. L'approuver remplace la question d'origine et incrémente sa version ; la rejeter laisse la banque intacte.

**Mode local** (`npm run admin` avec `AI_API_URL`, `AI_API_KEY`, `AI_MODEL` dans `.env`) : bouton « Lancer avec l'IA » ; la revue IA aveugle est lancée automatiquement sur le résultat. La clé d'API reste sur votre ordinateur et n'est jamais envoyée au navigateur. Vos décisions non enregistrées sont conservées pendant les tâches.

**Copier-coller** (hors ligne, ou sans API) : « Copier le prompt », collez-le dans votre chat IA (ChatGPT, Claude, Gemini, Le Chat…), puis collez sa réponse dans « Réponse JSON du chat » et importez. Le texte autour du JSON et les blocs de code sont tolérés ; les identifiants inconnus sont refusés.

**Ligne de commande** :

```bash
IDS=numeric-mean-002,planning-slot-001 INSTRUCTION="Lever toute ambiguïté." npm run regenerate:bank
npm run review:bank
node scripts/promote-candidate.mjs generated/revise-<…>.json --reviewer "Prénom Nom" --approve all
# Nouvelles questions avec consigne :
CATEGORY=situational COUNT=10 INSTRUCTION="Couvrir surtout « conseiller »." npm run generate:bank
```

`promote-candidate.mjs` traite les révisions comme dans l'interface : remplacement de la question d'origine et version incrémentée.

---

## Commandes de référence

| Commande | Rôle |
| :--- | :--- |
| `npm ci` | Installe les outils de validation (Ajv). L'application elle-même n'a aucune dépendance. |
| `npm run build:bank` | Compile `data/approved/` dans `bank/app-bank.js` et `bank/admin-bank.js`. |
| `npm run build:bank -- --check` | Vérifie que `app.js` est synchronisé (CI). |
| `npm run validate:bank [fichiers]` | Valide contre le schéma et les règles complémentaires (sans argument : tous les candidats). |
| `npm run generate:bank` | Génère un lot de candidats via l'API configurée. |
| `npm run regenerate:bank` | Révise des questions approuvées (`IDS`, `INSTRUCTION`) ; résultat dans `generated/revise-*.json`. |
| `npm run review:bank [fichier]` | Revue IA aveugle d'un lot de candidats. |
| `npm run promote:candidate -- <fichier> --reviewer "…" --approve …` | Promotion humaine explicite vers `data/approved/`. |
| Importer des fichiers | Glisser-déposer dans `admin.html`, copie dans `generated/` (mode local) ou collage du JSON : voir [Importer des fichiers de questions](#importer-des-fichiers-de-questions). |
| `npm run admin` | Lance l'interface d'administration locale (port 4174 par défaut, `ADMIN_PORT` pour changer). |
| `npm run generate:abstract [fichier] [-- --target 100]` | Génère des candidats de raisonnement abstrait par règles (clés calculées, unicité vérifiée contre rotations, symétries et remplissage) dans `generated/`, pour compléter chaque compétence jusqu'à la cible. Revue aveugle et promotion humaine restent nécessaires. |
| `npm run generate:data [fichier] [-- --numeric 35 --planning 26]` | Génère par règles des candidats numériques sur tableaux et graphiques (`lecture-tableau`, `lecture-graphique`) et des agendas de planification en tableau (disponibilités, salles, présences, tâches et prérequis). Clés calculées, une seule option valide par construction, sortie dans `generated/`. |
| `npm run check:review-log` | Vérifie que chaque question approuvée est tracée dans `data/review-log/`. |
| `npm test` | Syntaxe, self-tests du validateur, validation des banques approuvées, synchronisation, contrôle de relecture. |
