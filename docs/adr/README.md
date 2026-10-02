# Architecture Decision Records (ADR)

Ce répertoire consigne l'historique des décisions d'architecture structurantes prises pour le projet **EAG A1 Académie**, conformément au format standardisé Michael Nygard.

## Registre des décisions

| Numéro | Titre | Date | Statut |
| :--- | :--- | :--- | :--- |
| [ADR-0001](0001-static-offline-client.md) | Application cliente 100 % statique, sans serveur et respectueuse de la vie privée | 2026-09-30 | Accepté |
| [ADR-0002](0002-generated-scratchpad-separation.md) | Séparation physique entre `data/approved/` et le scratchpad `generated/` | 2026-09-30 | Accepté |
| [ADR-0003](0003-ai-zero-trust-pipeline.md) | Modèle Zero-Trust et garde-fous pour la production de questions assistée par IA | 2026-09-30 | Accepté |
| [ADR-0004](0004-build-bank-compilation.md) | Compilation statique de la banque de données dans `app.js` | 2026-09-30 | Accepté |
| [ADR-0005](0005-plain-text-items-and-official-formats.md) | Items en texte brut, rendu échappé et formats alignés sur les descriptions GovJobs | 2026-10-01 | Accepté |

---

## Documents de référence associés

- **[Étude comparative et Benchmark psychométrique EAG 2026](../research/eag-2026-benchmark.md)** : Rapport exhaustif comparant les formats EPSO, SHL Direct, psychotechnique.lu et les descriptions GovJobs ayant motivé l'ADR-0005.

