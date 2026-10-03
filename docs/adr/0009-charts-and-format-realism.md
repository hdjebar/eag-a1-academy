# ADR-0009 : Graphiques (stimulus `chart`) et contrôles de réalisme des formats

## Statut
Accepté

## Date
2026-10-03

## Contexte
La page GovJobs décrit le raisonnement numérique à partir de « tableaux, graphiques, données chiffrées » et la planification comme la gestion d'un agenda. Au 2 octobre 2026, la banque ne comptait que 6 questions numériques sur tableau, aucune sur graphique, aucun agenda en tableau ; 29 textes verbaux faisaient moins de 40 mots et 79 scénarios situationnels moins de 30 mots, en deçà des règles du prompt de génération.

## Décision
1. **Nouveau type de stimulus `chart`** (`kind` : `bar` ou `line`, 1 à 3 séries, 2 à 12 étiquettes, valeurs de 0 à 10⁹) dans le schéma. `shared/chart.js` le dessine en SVG dans l'application et l'administration, affiche chaque valeur (la réponse se calcule à partir de ce qui est montré) et ajoute un tableau équivalent masqué pour les lecteurs d'écran. Le rendu normalise les données reçues : un graphique mal formé s'affiche vide au lieu de bloquer la page.
2. **Avertissements de réalisme** dans `shared/item-rules.js` : textes verbaux de 40 à 200 mots, scénarios situationnels de 30 à 120 mots ; au moins 40 % des items numériques sur tableau ou graphique, dont 15 % de graphiques ; au moins 20 % des agendas de planification en tableau.
3. **Doublons des items structurés** : pour un tableau ou un graphique, seules des données identiques constituent un doublon (erreur). La similarité textuelle n'a pas de sens sur des gabarits partageant la même formulation et un petit vocabulaire de cellules.
4. **Générateur par règles `scripts/generate-data-items.mjs`** (`npm run generate:data`) : tableaux et graphiques numériques, agendas en tableau (créneaux communs, salles et capacités, présences, tâches et prérequis). Les clés sont calculées et chaque gabarit vérifie qu'une seule option est correcte. Les identifiants continuent après les identifiants existants ; des données déjà présentes ne sont pas régénérées.
5. **Promotion** : `promote-candidate` vérifie chaque item, puis chaque banque finale une fois ; un item mis en cause par une règle de banque est écarté (une révision revient à la version approuvée) sans bloquer le reste du lot.

## Conséquences
### Positives
- Les formats d'items se rapprochent de la description officielle (tableaux, graphiques, agendas).
- Les gabarits par règles produisent des clés vérifiables par calcul.

### Négatives / Compromis
- Les catégories n'ont plus toutes la même taille ; les sessions tirent un nombre fixe de questions par catégorie, ce qui n'introduit pas de biais.
- Les seuils de réalisme sont des conventions de cette banque, pas des données officielles ; ils produisent des avertissements, pas des erreurs.
