# ADR-0003 : Modèle Zero-Trust et garde-fous pour la production de questions assistée par IA

## Statut
Accepté (révisé le 2026-10-01 : revue aveugle, promotion explicite, blocage CI)

## Date
2026-09-30

## Contexte
La création manuelle de questions d'aptitude de niveau A1 (raisonnement verbal, planification complexe, analyse de graphiques, déontologie administrative) est chronophage. Les modèles de langage (LLM) permettent d'accélérer la production d'idées et de distracteurs.
Cependant, l'utilisation de modèles génératifs présente des risques majeurs :
- Hallucinations de données factuelles ou de calculs arithmétiques.
- Biais cognitifs ou sociologiques.
- Risque d'infraction légale ou de contrefaçon si le modèle reproduit des formulations d'examens confidentiels ou officiels.
- Allégations trompeuses sur la prédictibilité des résultats ou le barème Stanine.

## Décision
Instaurer une politique stricte de **Zero-Trust** pour toute production d'items assistée par IA :
1. **Interdiction légale stricte** : Rejet automatique de toute question contenant les termes `question officielle`, `item officiel`, `barème officiel`, `confidentiel` ou assimilés via regex déterministe.
2. **Schéma JSON strict et contraignant** (`schema/question.schema.json`, appliqué par Ajv) :
   - Format d'item par catégorie (`single_best`, `tfcs`, `rating`) et compétences limitées aux descriptions GovJobs A1.
   - Texte brut uniquement (aucun HTML) ; tableaux et figures en objets structurés.
   - Longueurs minimales, index de correction cohérent, identifiant préfixé par la catégorie.
3. **Double passage IA indépendant** :
   - Étape 1 : génération à température modérée (0.4) avec consignes déontologiques strictes (`prompts/generate-bank.md`).
   - Étape 2 : revue **aveugle** à température nulle (`prompts/review-bank.md`) : le relecteur ne voit pas la clé ; le script compare sa réponse à celle de l'auteur.
4. **Approbation humaine obligatoire** :
   - Le statut initial est impérativement `candidate`.
   - Seul un humain peut promouvoir un item au statut `approved` dans `data/approved/` : `promote-candidate.mjs` exige `--reviewer` et la liste `--approve` des identifiants, et bloque tout item dont la revue aveugle n'est pas `pass` (sauf `--ignore-ai-review`).
   - La CI échoue tant qu'une PR contient des fichiers dans `generated/`.
   - Le passage des tests automatiques en CI n'autorise en aucun cas le merge direct d'une banque non auditée par un relecteur humain.

## Conséquences

### Positives
- **Garantie éthique et légale** : Protection contre toute atteinte aux droits d'auteur ou aux dispositions du CGPO/GovJobs.
- **Rigueur pédagogique** : Élimination précoce des distracteurs ambigus ou des calculs faux.
- **Transparence** : Traçabilité claire des sources (`sourceType: "original_ai_assisted"`).

### Négatives / Compromis
- Le flux de travail nécessite une implication humaine pour chaque question ajoutée.
- La génération par IA n'est pas un processus presse-bouton autonome non supervisé.
