# Recherche Psychométrique & Cadre Réglementaire (EAG 2026)

Ce répertoire centralise les études comparatives, les benchmarks de tests psychotechniques internationaux et les analyses réglementaires officielles servant de fondement empirique et méthodologique à la conception d'**EAG A1 Académie**.

---

## Documents de référence

### 📊 [Benchmark Psychométrique & Sources d'entraînement (EAG 2026)](eag-2026-benchmark.md)
*Dernière mise à jour et vérification en direct : Octobre 2026.*

Ce document détaille :
1. **Le cadre réglementaire officiel GovJobs (Réforme du 15 septembre 2026) :**
   - Épreuve informatisée standardisée de **2h00** au CGPO (Tour A, Kirchberg).
   - Inscription individuelle continue tout au long de l'année via MyGuichet.lu.
   - Notation en **échelle Stanine (1 à 9)** avec seuil de réussite fixé à une moyenne $\ge 5,0$.
   - Validité des résultats de **12 mois** pour une seule admission au stage.
   - **Politique de non-diffusion :** GovJobs ne publie plus d'exemples d'entraînement préalables (mesure anti-IA garantissant l'équité des épreuves).
2. **La composition stricte pour le Groupe A1 :**
   - *Raisonnement abstrait (alias « test géométrique ») :* Séries géométriques et complétion de matrices 3×3 (exclusion des lettres/chiffres et du format intrus).
   - *Raisonnement verbal :* Textes d'instructions administratives avec logique Vrai / Faux / Indéterminé.
   - *Raisonnement numérique :* Tableaux de données, graphiques, ratios et calculatrice logicielle intégrée.
   - *Test de planification :* Gestion d'agenda sous contraintes temporelles, d'échéances et de disponibilités.
   - *Test de jugement situationnel (SJT) :* Évaluation de la pertinence des comportements sur les compétences *« servir le client-usager »* et *« conseiller »*.
   - *(Note : Le test de contrôle et précision est réservé aux groupes B1 et C1).*
3. **L'analyse comparative des analogues internationaux :**
   - **EPSO (UE) :** Séries de figures géométriques et raisonnement numérique/verbal.
   - **SHL Direct :** Tests inductifs et compréhension verbale.
   - **Travaillerpour.be (Selor - Belgique) :** Jugement situationnel avec échelle d'évaluation (++ à --).
   - **Commission de la fonction publique du Canada (CFP) :** Échelles d'efficacité comportementale (Tests 318 et 375).
4. **La transposition technique dans EAG A1 Académie :**
   - Architecture arrêtée dans [ADR-0005](../adr/0005-plain-text-items-and-official-formats.md).
   - Banque calibrée de **500 items approuvés** (100 items par catégorie) avec tirage aléatoire sans remise.
   - Validation stricte des questions via JSON Schema ([`schema/question.schema.json`](../../schema/question.schema.json)).
   - Justifications pédagogiques obligatoires à 100% sur l'ensemble des choix (`optionRationales`).
   - Évaluation continue du jugement situationnel par formule de concordance linéaire.

---

## Liens connexes

- [Architecture logicielle et psychométrique du projet](../ARCHITECTURE.md)
- [Guide de contribution et enrichissement de la banque](../CONTRIBUTING.md)
- [Décision d'architecture ADR-0005 (Formats d'items et alignement officiel)](../adr/0005-plain-text-items-and-official-formats.md)
- [Prompt de génération de questions](../../prompts/generate-bank.md)
