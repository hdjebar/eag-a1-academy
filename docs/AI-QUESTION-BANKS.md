# Pipeline de génération et d'enrichissement de la banque de questions

Ce projet traite toute sortie générée par IA comme du matériel candidat **non fiable par défaut**. Tout item doit subir une validation déterministe et une revue humaine obligatoire avant intégration.

---

## Principes éthiques et déontologiques

1. **Aucune contrefaçon** : Ne jamais chercher à reproduire, mémoriser ou reconstituer des questions de l'épreuve officielle du CGPO/GovJobs. Les items doivent être 100 % originaux.
2. **Formulations interdites** : Les termes tels que `question officielle`, `item officiel`, `barème officiel` ou `confidentiel` sont rejetés par le validateur.
3. **Pédagogie et rigueur** :
   - Énoncé explicite et autosuffisant.
   - Exactement 4 options distinctes et une unique réponse défendable.
   - Explication détaillée prouvant mathématiquement ou logiquement la réponse.
   - Respect strict des principes du service public luxembourgeois pour le jugement situationnel (légalité, neutralité, orientation usager, devoir d'alerte, déontologie).

---

## Méthode 1 : Génération via une interface de Chat LLM (Sans clé d'API)

Cette méthode ne requiert aucune configuration technique ni clé d'API. Elle fonctionne sur **ChatGPT, Claude, Google Gemini, Le Chat Mistral**, etc.

### 1. Copier le prompt de consigne

Copiez le bloc ci-dessous dans votre interface de chat en adaptant si besoin la catégorie (`abstract`, `verbal`, `numeric`, `planning`, `situational`) et le nombre souhaité :

```text
Tu es un concepteur d'exercices d'entraînement pour l'Épreuve d'Aptitude Générale (EAG A1) du Luxembourg.
Règles strictes :
1. Crée uniquement du contenu pédagogique original. Ne reproduis ni n'imite aucun item réel.
2. Pas de termes comme "officiel", "barème officiel", "confidentiel".
3. Rédige en français irréprochable.
4. Exactement 4 options uniques par question et une seule bonne réponse indiscutable.
5. `correctIndex` est l'indice numérique (0, 1, 2 ou 3) de la bonne réponse.
6. `difficulty` vaut 1, 2 ou 3.
7. `sourceType` doit valoir strictement "original_ai_assisted".
8. `reviewStatus` doit valoir strictement "candidate".
9. `id` doit respecter le format regex : ^[a-z]+-[a-z0-9-]+-[0-9]{3,}$ (ex. numeric-taux-001).
10. Renvoie UNIQUEMENT un tableau JSON valide brut (sans backticks markdown, sans texte avant ou après).

Génère 5 items pour la catégorie : numeric.

Schéma JSON attendu pour chaque objet :
{
  "id": "numeric-taux-011",
  "category": "numeric",
  "skill": "calcul de pourcentage",
  "difficulty": 2,
  "language": "fr",
  "prompt": "Énoncé complet de la question (au moins 12 caractères)",
  "stimulus": "Tableau HTML ou données contextuelles (ou null)",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctIndex": 0,
  "explanation": "Explication détaillée démontrant la solution pas à pas.",
  "sourceType": "original_ai_assisted",
  "reviewStatus": "candidate"
}
```

### 2. Enregistrer la réponse JSON

Créez un fichier dans le dossier `generated/` (ex. `generated/candidats-numeric.json`) et collez-y le tableau JSON renvoyé par le chat.

### 3. Valider, promouvoir et synchroniser

Exécutez dans votre terminal à la racine du projet :

```bash
# 1. Validation déterministe (schéma JSON, format d'ID, 4 options uniques, termes interdits)
node scripts/validate-bank.mjs generated/candidats-numeric.json

# 2. Promotion automatique dans data/approved/ et synchronisation dans app.js
node scripts/promote-candidate.mjs generated/candidats-numeric.json

# 3. Validation globale de la suite de tests
npm test
```

Vos nouvelles questions sont immédiatement intégrées dans [`app.js`](file:///Users/hdjebar/eag/eag-a1-academy/app.js) et visibles en rafraîchissant `eag-a1-academy.html`.

---

## Méthode 2 : Génération locale automatisée (CLI / API ou Ollama)

Si vous disposez d'un accès API (OpenAI, Mistral, OpenRouter, Groq) ou d'un LLM local (**Ollama**) :

### 1. Configuration `.env`

Créez un fichier `.env` à la racine (déjà ignoré par Git) :

```bash
# Exemple avec une API distante :
AI_API_URL="https://api.openai.com/v1/chat/completions"
AI_API_KEY="votre-cle-api"
AI_MODEL="gpt-4o-mini"

# OU exemple avec Ollama local (100 % hors-ligne et gratuit) :
# AI_API_URL="http://localhost:11434/v1/chat/completions"
# AI_API_KEY="ollama"
# AI_MODEL="llama3"
```

### 2. Commandes de génération

```bash
# Générer 10 items pour une catégorie donnée
CATEGORY=planning COUNT=10 npm run generate:bank

# Lancer la revue critique indépendante par IA
npm run review:bank

# Valider la structure
npm run validate:bank

# Promouvoir les items validés vers data/approved/ et recompiler l'application
npm run promote:candidate

# Vérifier la cohérence de l'ensemble
npm test
```

---

## Méthode 3 : Workflow GitHub Actions (CI/CD)

1. Renseignez les secrets de dépôt GitHub : `AI_API_URL` et `AI_API_KEY`, ainsi que la variable de dépôt `AI_MODEL`.
2. Déclenchez l'action : **Actions → Generate candidate test bank → Run workflow**.
3. Le workflow génère le fichier, exécute la revue indépendante par IA, valide la structure, dépose un artefact et ouvre automatiquement une Pull Request.
4. Le relecteur humain contrôle chaque item, promeut les questions retenues via `npm run promote:candidate <fichier>`, puis fusionne la PR.

---

## Commandes de référence

| Commande | Rôle |
| :--- | :--- |
| `npm run build:bank` | Compile les fichiers de `data/approved/` directement dans `app.js`. |
| `npm run build:bank -- --check` | Vérifie que `app.js` est parfaitement synchronisé avec les fichiers approuvés (mode CI). |
| `npm run promote:candidate <fichier.json>` | Promeut les items d'un fichier candidat vers `data/approved/` et met à jour `app.js`. |
| `npm run validate:bank <fichier.json>` | Valide un fichier candidat ou approuvé contre le schéma strict. |
| `npm run generate:bank` | Génère un lot de candidats via l'API IA configurée dans `.env`. |
| `npm run review:bank` | Exécute une revue critique automatique par IA d'un lot de candidats. |
| `npm test` | Exécute la vérification syntaxique, les self-tests, la validation des 5 banques approuvées et le check de synchronisation. |
