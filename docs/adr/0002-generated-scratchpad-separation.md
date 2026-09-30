# ADR-0002 : Séparation physique entre `data/approved/` et le scratchpad `generated/`

## Statut
Accepté

## Date
2026-09-30

## Contexte
Le projet combine du contenu pédagogique certifié avec un pipeline d'expérimentation et de génération de questions candidates assisté par IA.
Il est essentiel de garantir :
1. Qu'aucun contenu brut, hallucinant ou non vérifié ne puisse être intégré par inadvertance dans la branche principale du code source.
2. Que les commandes de versionnement usuelles (`git add data/`, `git commit`) ne commettent jamais d'éléments non certifiés.
3. Que les contributeurs distinguent sans ambiguïté les données de référence et les artefacts temporaires de génération.

Deux approches ont été évaluées pour l'emplacement des fichiers candidats :
- Option A : `data/candidates/` et `data/approved/` regroupés sous `data/`.
- Option B : `generated/` à la racine pour les artefacts éphémères, et `data/approved/` pour la source de vérité versionnée.

## Décision
Adopter et conserver l'**Option B** :
- Le répertoire `data/approved/` est la source de vérité unique et pérenne, suivie et versionnée par Git.
- Le répertoire `generated/` est situé à la racine du dépôt en tant que **zone tampon / scratchpad**, assimilé à un dossier de build (comme `dist/` ou `tmp/`).
- Tous les fichiers `.json` dans `generated/` sont ignorés par Git via `.gitignore` (`generated/*.json`), à l'exception de `.gitkeep`.
- L'injection dans `data/approved/` nécessite une étape explicite de relecture et d'exécution d'un script de promotion (`scripts/promote-candidate.mjs`).

## Conséquences

### Positives
- **Sécurité anti-pollution** : Impossible de commiter accidentellement du matériel généré non relu lors d'un `git add data/`.
- **Clarté du cycle de vie** : `data/` ne contient que des données validées et audités. Les fichiers temporaires ont un cycle de vie éphémère à la racine.
- **Conformité aux conventions courantes** : Similaire aux répertoires de travail de compilation (`dist/`, `build/`, `out/`).

### Négatives / Compromis
- Deux dossiers distincts en apparence pour des fichiers traitant de questions (bien que leur statut et leur cycle de vie soient radicalement opposés).
- Nécessite de documenter explicitement ce choix architectural pour éviter toute confusion des contributeurs.
