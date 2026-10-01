# Pipeline de génération et d'enrichissement de la banque de questions

Ce projet traite toute sortie générée par IA comme du matériel candidat **non fiable par défaut**. Un item n'entre dans `data/approved/` que si : il passe la validation déterministe, une revue IA **aveugle** retrouve la même réponse que l'auteur, et une personne nommée l'approuve explicitement, identifiant par identifiant.

---

## Principes

1. **Aucune contrefaçon** : ne jamais reproduire, mémoriser ou reconstituer des questions de l'épreuve réelle. Les items sont 100 % originaux.
2. **Formulations interdites** : `question officielle`, `item officiel`, `barème officiel`, `confidentiel` sont rejetés par le validateur.
3. **Texte brut uniquement** : aucun HTML, aucune balise, aucune entité (`&nbsp;`) dans les items. Les tableaux et les figures utilisent les objets `stimulus` structurés (voir ci-dessous) ; l'application les affiche en échappant tout le texte.
4. **Conformité aux descriptions officielles A1** (page GovJobs « Les tests de l'EAG ») :
   - **abstrait** : compléter une série ou une matrice de **figures** (symboles géométriques uniquement, ni lettres, ni chiffres, ni mots) ;
   - **verbal** : répondre ou appliquer une consigne à partir du seul texte ;
   - **numérique** : tableaux, graphiques, données chiffrées, opérations simples (calculatrice autorisée) ;
   - **planification** : gérer un agenda (délais, disponibilités, priorités, dépendances) ;
   - **jugement situationnel** : **noter chaque réaction** de 1 à 4 (format `rating`), compétences « servir le client-usager » et « conseiller » uniquement.
5. **Une seule réponse défendable**, des options de longueur comparable, une explication qui démontre la réponse et une justification par option (`optionRationales`).

Le contrat complet est dans [`schema/question.schema.json`](../schema/question.schema.json) ; les consignes de rédaction sont dans [`prompts/generate-bank.md`](../prompts/generate-bank.md).

### Formats de `stimulus`

```json
"stimulus": "Texte simple. Les retours à la ligne sont conservés."
"stimulus": { "type": "shapes", "text": "●  ■  ▲\n■  ▲  ●\n▲  ●  ?" }
"stimulus": { "type": "table", "caption": "Demandes par service", "headers": ["Service", "Janv.", "Févr."], "rows": [["A", 120, 138], ["B", 80, 96]] }
```

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

**Promotion** : `promote-candidate.mjs` exige un relecteur nommé (`--reviewer`) et la liste des identifiants retenus (`--approve`, ou `--approve all` comme choix explicite). Un item dont la revue n'est pas `pass` reste bloqué, sauf `--ignore-ai-review`. Les items promus reçoivent `reviewStatus: "approved"`, `reviewer` et `reviewedAt`, sont retirés du fichier candidat, et `app.js` est resynchronisé. `--dry-run` montre l'effet sans rien écrire.

---

## Méthode 3 : GitHub Actions

1. Secrets du dépôt : `AI_API_URL`, `AI_API_KEY` ; variable : `AI_MODEL`. Recommandé : un secret `BOT_TOKEN` (jeton à grain fin, droits *contents* et *pull requests* en écriture). Sans lui, la PR est ouverte avec `GITHUB_TOKEN`, et GitHub ne déclenche alors pas le workflow de validation sur cette PR (relancez-le à la main via *Run workflow*).
2. **Actions → Generate candidate test bank → Run workflow**.
3. Le workflow génère, fait la revue aveugle, valide, dépose un artefact et ouvre une PR.
4. **La PR ne peut pas être fusionnée telle quelle** : la CI échoue tant que des fichiers restent dans `generated/`. Le relecteur extrait la branche, lance `promote-candidate.mjs` avec ses choix, supprime les fichiers candidats, pousse, puis fusionne.

---

## Interface d'administration

La même page, `admin.html`, fonctionne en deux modes.

| | Hors ligne (`admin.html` ouvert depuis le disque) | Local (`npm run admin`) |
| :--- | :--- | :--- |
| Banque approuvée | intégrée à `admin.js` par `npm run build:bank` | lue sur le disque |
| Candidats | glisser-déposer des fichiers `generated/*.json` et `*.review.json` | chargés automatiquement depuis `generated/` |
| Enregistrement | archive `.zip` à décompresser à la racine du dépôt | écrit dans le dépôt, puis `app.js` et `admin.js` resynchronisés |
| Tâches | — | génération, revue aveugle, `npm test`, état Git |
| Session | sauvegardée dans le navigateur, reprise possible | l'état fait foi sur le disque |

**File de relecture** : pour chaque candidat, aperçu tel que le voit l'apprenant, **résolution à l'aveugle** (la clé reste masquée jusqu'à votre réponse), résultat de la revue IA, contrôles automatiques (mêmes règles que `validate-bank.mjs`), questions proches déjà présentes, et éditeur complet (énoncé, tableau ou figures, options, notes, justifications).

**Décisions** : *Approuver* exige un nom de relecteur et zéro erreur ; si la revue IA n'est pas `pass` (absente, `revise`, `reject` ou obsolète après modification), vous devez cocher « J'ai vérifié la réponse moi-même ». *Rejeter* exige un motif. Chaque décision est consignée dans `data/review-log/<date>.json`.

**Banque approuvée** : couverture par catégorie, compétence et difficulté (les compétences absentes sont signalées), alertes, questions très proches ; modification d'une question (version incrémentée, relecteur et date mis à jour) ou retrait.

**Sécurité du mode local** : le serveur n'écoute que `127.0.0.1` ; chaque appel exige le jeton affiché au démarrage ; l'hôte et l'origine sont vérifiés ; tout enregistrement est revalidé avec le validateur de référence (Ajv) avant écriture ; seuls les fichiers de `data/approved/`, `data/review-log/` et `generated/` peuvent être écrits.

Après un enregistrement : relisez `git diff`, puis committez. La CI refuse toujours les PR qui laissent des fichiers dans `generated/`.

---

## Commandes de référence

| Commande | Rôle |
| :--- | :--- |
| `npm ci` | Installe les outils de validation (Ajv). L'application elle-même n'a aucune dépendance. |
| `npm run build:bank` | Compile `data/approved/` dans `app.js`. |
| `npm run build:bank -- --check` | Vérifie que `app.js` est synchronisé (CI). |
| `npm run validate:bank [fichiers]` | Valide contre le schéma et les règles complémentaires (sans argument : tous les candidats). |
| `npm run generate:bank` | Génère un lot de candidats via l'API configurée. |
| `npm run review:bank [fichier]` | Revue IA aveugle d'un lot de candidats. |
| `npm run promote:candidate -- <fichier> --reviewer "…" --approve …` | Promotion humaine explicite vers `data/approved/`. |
| `npm run admin` | Lance l'interface d'administration locale (port 4174 par défaut, `ADMIN_PORT` pour changer). |
| `npm test` | Syntaxe, self-tests du validateur, validation des banques approuvées, synchronisation. |
