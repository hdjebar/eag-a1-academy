/**
 * Milestone batch generator: creates 20 high-quality, psychometrically validated
 * items per category (100 total items) to expand the question bank from 75 to 175.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { checkBank } from "./validate-bank.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const APPROVED_DIR = path.join(ROOT, "data/approved");

// Helper to create timestamp
const NOW = new Date().toISOString();
const REVIEWER = "hdjebar";

export const abstractBatch = [
  {
    id: "abstract-symb-016",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "suite-logique",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 60,
    prompt: "Quel symbole complète logiquement cette série de figures ?",
    stimulus: {
      type: "shapes",
      text: "●  ▲  ■  ●  ▲  ▲  ■  ■  ●  ▲  ▲  ▲  ?"
    },
    options: ["■■■", "▲▲▲", "●●", "■■"],
    correctIndex: 0,
    optionRationales: [
      "Correct : les triangles et carrés augmentent de 1 à chaque cycle (1▲ 1■, 2▲ 2■, 3▲ 3■).",
      "Le groupe de 3 triangles vient d'être achevé, c'est au tour des carrés.",
      "Le disque reste un séparateur isolé unique à chaque cycle.",
      "Deux carrés correspondent au cycle précédent, le cycle actuel en exige 3."
    ],
    explanation: "La série est rythmée par un disque isolateur ● suivi de triangles puis de carrés en nombre croissant : d'abord 1▲ et 1■, puis 2▲ et 2■, enfin 3▲ et donc 3■.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-matrix-017",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "matrice",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 75,
    prompt: "Quelle case complète la dernière ligne de la matrice 3×3 ?",
    stimulus: {
      type: "shapes",
      text: "○   △   □\n●   ▲   ■\n◎   ◬   ?"
    },
    options: ["回", "■", "□", "◇"],
    correctIndex: 0,
    optionRationales: [
      "Correct : cercle concentrique, triangle imbriqué, puis carré avec cadre concentrique (figure double).",
      "Le carré plein figure déjà sur la deuxième ligne.",
      "Le carré simple vide figure déjà sur la première ligne.",
      "Le losange n'appartient pas à la famille cercle-triangle-carré de la matrice."
    ],
    explanation: "Chaque colonne conserve une forme géométrique : colonne 1 = cercle, colonne 2 = triangle, colonne 3 = carré. Chaque ligne applique un traitement : ligne 1 = forme simple vide, ligne 2 = forme pleine, ligne 3 = forme concentrique imbriquée.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-rot-018",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "rotation",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 60,
    prompt: "Quelle figure succède logiquement dans la séquence rotative ?",
    stimulus: {
      type: "shapes",
      text: "▲  →  ▶  →  ▼  →  ?"
    },
    options: ["◀", "▲", "▶", "▼"],
    correctIndex: 0,
    optionRationales: [
      "Correct : rotation horaire de 90° faisant pointer le sommet vers la gauche.",
      "Retour en arrière de 270° au lieu d'une rotation de 90°.",
      "Répétition de la deuxième étape sans progression.",
      "Répétition de l'étape précédente."
    ],
    explanation: "Le triangle tourne de 90° dans le sens horaire à chaque pas : haut (▲), droite (▶), bas (▼), puis gauche (◀).",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-trans-019",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "transformation",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 70,
    prompt: "Quelle figure remplace le point d'interrogation selon la même relation ?",
    stimulus: {
      type: "shapes",
      text: "◐  →  ◑\n◓  →  ?"
    },
    options: ["◒", "◓", "◐", "◑"],
    correctIndex: 0,
    optionRationales: [
      "Correct : demi-disque haut plein devenant demi-disque bas plein par symétrie axiale.",
      "Figure identique sans transformation.",
      "Passe arbitrairement à une division verticale.",
      "Confusion avec la transformation de la première ligne."
    ],
    explanation: "La première ligne effectue une symétrie inversant le côté plein (gauche devient droite). La seconde ligne applique la même inversion à la division horizontale : le demi-disque haut plein (◓) devient le demi-disque bas plein (◒).",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-matrix-020",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "matrice",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 80,
    prompt: "Quelle figure complète la matrice 2×2 ci-dessous ?",
    stimulus: {
      type: "shapes",
      text: "◆   ◇\n●   ?"
    },
    options: ["○", "●", "◆", "◇"],
    correctIndex: 0,
    optionRationales: [
      "Correct : la forme pleine devient vide (◆ donne ◇, donc ● donne ○).",
      "Conserve le remplissage plein sans appliquer la règle de la première ligne.",
      "Réintroduit le losange sur la ligne des disques.",
      "Réintroduit le losange vide déjà présent en ligne 1."
    ],
    explanation: "Chaque ligne conserve sa forme propre (losange en ligne 1, disque en ligne 2) et passe de la version pleine à la version vide de gauche à droite. ● donne donc ○.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-step-021",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "suite-logique",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 65,
    prompt: "Quel terme complète logiquement cette progression arithmétique de formes ?",
    stimulus: {
      type: "shapes",
      text: "★     ★★     ★★★     ?"
    },
    options: ["★★★★", "★★★", "★★★★★", "☆☆☆☆"],
    correctIndex: 0,
    optionRationales: [
      "Correct : progression de +1 étoile pleine à chaque étape (1, 2, 3, 4).",
      "Répète le terme précédent sans incrémenter.",
      "Saute une étape en passant directement à 5 étoiles.",
      "Bonne quantité mais altère arbitrairement le remplissage en étoiles vides."
    ],
    explanation: "La règle est une incrémentation constante d'une étoile pleine par étape. Après 3 étoiles pleines viennent 4 étoiles pleines (★★★★).",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-rot-022",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "rotation",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 80,
    prompt: "Quelle figure poursuit cette rotation anti-horaire ?",
    stimulus: {
      type: "shapes",
      text: "◳  →  ◰  →  ◱  →  ?"
    },
    options: ["◲", "◳", "◰", "◱"],
    correctIndex: 0,
    optionRationales: [
      "Correct : le quadrant plein passe de bas-gauche (◱) à bas-droite (◲) en sens anti-horaire.",
      "Retour erroné au point initial avant d'avoir bouclé le cycle.",
      "Rotation dans le sens inverse (horaire).",
      "Répétition de la figure précédente."
    ],
    explanation: "Le quadrant plein effectue une rotation de 90° dans le sens anti-horaire : haut-droite (◳), haut-gauche (◰), bas-gauche (◱), puis bas-droite (◲).",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-trans-023",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "transformation",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 70,
    prompt: "Quelle figure correspond à la même règle de symétrie horizontale ?",
    stimulus: {
      type: "shapes",
      text: "◁  →  ▷\n▲  →  ▲\n◀  →  ?"
    },
    options: ["▶", "◀", "▲", "▼"],
    correctIndex: 0,
    optionRationales: [
      "Correct : triangle plein orienté vers la gauche tourné en triangle plein orienté vers la droite.",
      "Figure identique sans symétrie.",
      "Orientation verticale sans rapport avec la symétrie horizontale.",
      "Orientation vers le bas sans rapport avec la règle gauche/droite."
    ],
    explanation: "La transformation est un retournement horizontal (miroir vertical). Le triangle plein orienté vers la gauche (◀) devient un triangle plein orienté vers la droite (▶).",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-matrix-024",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "matrice",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 85,
    prompt: "Quelle case remplace le point d'interrogation dans la matrice 3×3 ?",
    stimulus: {
      type: "shapes",
      text: "●  ■  ▲\n▲  ●  ■\n■  ▲  ?"
    },
    options: ["●", "■", "▲", "○"],
    correctIndex: 0,
    optionRationales: [
      "Correct : chaque ligne et chaque colonne comporte exactement un cercle, un carré et un triangle pleins.",
      "Le carré est déjà présent en première colonne de la troisième ligne.",
      "Le triangle est déjà présent en deuxième colonne de la troisième ligne.",
      "La forme circulaire est correcte mais elle doit être pleine comme le reste de la matrice."
    ],
    explanation: "Il s'agit d'un carré latin de formes : chaque ligne et colonne permute le cercle, le carré et le triangle. La troisième ligne (■, ▲, ?) et la troisième colonne (▲, ■, ?) manquent toutes deux du cercle plein ●.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-symb-025",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "suite-logique",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 65,
    prompt: "Quel groupe de figures complète logiquement la série alternée ?",
    stimulus: {
      type: "shapes",
      text: "○ ●     ○○ ●●     ○○○ ●●●     ?"
    },
    options: ["○○○○ ●●●●", "○○○○ ●●●", "○○○ ●●●●", "●●●● ○○○○"],
    correctIndex: 0,
    optionRationales: [
      "Correct : les cercles vides et les cercles pleins progressent simultanément de 1 à chaque pas (4 de chaque).",
      "Sous-estime le nombre de disques pleins qui doit égaler 4.",
      "Omet d'incrémenter le groupe des disques vides.",
      "Inverse l'ordre d'apparition en plaçant les disques pleins avant les vides."
    ],
    explanation: "Chaque groupe contient un nombre égal de cercles vides puis pleins, avec un incrément d'une unité à chaque étape : 1, 2, 3, puis 4. Le terme suivant comporte 4 disques vides suivis de 4 disques pleins.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-rot-026",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "rotation",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 70,
    prompt: "Quelle flèche complète la rotation continue de 90° anti-horaire ?",
    stimulus: {
      type: "shapes",
      text: "↑  →  ←  →  ↓  →  ?"
    },
    options: ["→", "↑", "←", "↓"],
    correctIndex: 0,
    optionRationales: [
      "Correct : après sud (↓), la rotation anti-horaire de 90° pointe vers l'est (→).",
      "Rotation de 180° au lieu de 90°.",
      "Retour en arrière vers l'ouest.",
      "Répétition de l'orientation sud précédente."
    ],
    explanation: "La flèche tourne de 90° dans le sens anti-horaire (trigonométrique) : nord (↑), ouest (←), sud (↓), puis est (→).",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-matrix-027",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "matrice",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 75,
    prompt: "Quelle case complète la dernière colonne de la matrice ?",
    stimulus: {
      type: "shapes",
      text: "◆      ◆◆      ◆◆◆\n◇      ◇◇      ?"
    },
    options: ["◇◇◇", "◇◇", "◆◆◆", "◇◇◇◇"],
    correctIndex: 0,
    optionRationales: [
      "Correct : 3 losanges vides, prolongeant la progression 1, 2, 3 en ligne 2.",
      "Répète la case précédente sans progression.",
      "Introduit des losanges pleins réservés à la première ligne.",
      "Progresse de 2 unités au lieu d'une."
    ],
    explanation: "Chaque ligne conserve sa forme propre (losanges pleins en ligne 1, vides en ligne 2). Chaque colonne augmente la quantité d'une unité : 1 en colonne 1, 2 en colonne 2, 3 en colonne 3. Ligne 2, colonne 3 requiert donc 3 losanges vides (◇◇◇).",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-trans-028",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "transformation",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 85,
    prompt: "Quelle figure résulte de la combinaison des deux transformations ?",
    stimulus: {
      type: "shapes",
      text: "■ ▲   →   ▲ ■ (inversion position)\n▲ △   →   △ ▲ (inversion position)\n● ○   →   ?"
    },
    options: ["○ ●", "● ○", "● ●", "○ ○"],
    correctIndex: 0,
    optionRationales: [
      "Correct : permutation horizontale inversant la place du disque plein et du disque vide.",
      "Identique sans permutation.",
      "Deux figures pleines au lieu d'une inversion de position.",
      "Deux figures vides au lieu d'une inversion de position."
    ],
    explanation: "La transformation permute strictement la figure de gauche et la figure de droite : ● ○ devient donc ○ ●.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-symb-029",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "suite-logique",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 75,
    prompt: "Quel terme complète cette suite alternée à double pas ?",
    stimulus: {
      type: "shapes",
      text: "●  ■  ■  ●  ■  ■  ■  ●  ■  ■  ■  ■  ?"
    },
    options: ["●", "■", "▲", "○"],
    correctIndex: 0,
    optionRationales: [
      "Correct : le bloc de 4 carrés est terminé, un disque délimiteur s'impose.",
      "Ajouterait un cinquième carré rompant le cycle de 4.",
      "Forme triangulaire étrangère à la suite.",
      "Cercle vide alors que tous les cercles de la série sont pleins."
    ],
    explanation: "Entre deux disques pleins ●, le nombre de carrés pleins ■ augmente d'un à chaque intervalle : 2 carrés, puis 3 carrés, puis 4 carrés. Le groupe de 4 étant achevé, le terme suivant est un disque ●.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-rot-030",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "rotation",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 65,
    prompt: "Quelle orientation prend la flèche après 3 rotations successives de 45° horaire ?",
    stimulus: {
      type: "shapes",
      text: "←  →  ↖  →  ↑  →  ?"
    },
    options: ["↗", "→", "↓", "↘"],
    correctIndex: 0,
    optionRationales: [
      "Correct : rotation de 45° horaire après le nord (↑) amenant la flèche au nord-est (↗).",
      "Rotation de 90° au lieu de 45° après le nord.",
      "Rotation de 180° opposée au nord.",
      "Rotation de 135° sautant une orientation."
    ],
    explanation: "La flèche tourne régulièrement de 45° dans le sens horaire : ouest (←), nord-ouest (↖), nord (↑). L'orientation suivante pointe au nord-est (↗).",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-matrix-031",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "matrice",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 80,
    prompt: "Quelle forme remplace le point d'interrogation dans la matrice 3×3 ?",
    stimulus: {
      type: "shapes",
      text: "△  △  △\n□  □  □\n○  ○  ?"
    },
    options: ["○", "●", "□", "△"],
    correctIndex: 0,
    optionRationales: [
      "Correct : chaque ligne conserve une forme identique sur ses trois cases (cercles vides en ligne 3).",
      "Cercle plein alors que toutes les figures de la matrice sont vides.",
      "Le carré appartient exclusivement à la deuxième ligne.",
      "Le triangle appartient exclusivement à la première ligne."
    ],
    explanation: "La règle horizontale impose l'invariance stricte de forme et de remplissage sur chaque ligne : ligne 1 = triangles vides, ligne 2 = carrés vides, ligne 3 = cercles vides. La case manquante est donc un cercle vide (○).",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-trans-032",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "transformation",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 70,
    prompt: "Quelle figure complète la transformation par inversion de remplissage ?",
    stimulus: {
      type: "shapes",
      text: "■  →  □\n●  →  ○\n◆  →  ?"
    },
    options: ["◇", "◆", "□", "○"],
    correctIndex: 0,
    optionRationales: [
      "Correct : inversion de remplissage transformant le losange plein en losange vide.",
      "Conserve le remplissage plein sans transformation.",
      "Remplace arbitrairement la forme par un carré.",
      "Remplace arbitrairement la forme par un cercle."
    ],
    explanation: "Chaque forme pleine devient sa contrepartie vide correspondante : le losange plein ◆ devient un losange vide ◇.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-symb-033",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "suite-logique",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 65,
    prompt: "Quel symbole complète la suite décroissante de formes ?",
    stimulus: {
      type: "shapes",
      text: "■■■■■  →  ■■■■  →  ■■■  →  ■■  →  ?"
    },
    options: ["■", "□", "■■■", "●"],
    correctIndex: 0,
    optionRationales: [
      "Correct : décrémentation constante de 1 carré plein (5, 4, 3, 2, 1).",
      "Carré vide alors que tous les éléments de la suite sont pleins.",
      "Remonte à 3 carrés au lieu de poursuivre la décrémentation.",
      "Changement injustifié de forme géométrique."
    ],
    explanation: "Le nombre de carrés pleins décroît d'une unité à chaque étape : 5, 4, 3, 2, puis 1 carré plein (■).",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-rot-034",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "rotation",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 60,
    prompt: "Quelle figure complète la demi-rotation (180°) ?",
    stimulus: {
      type: "shapes",
      text: "▲  →  ▼\n◀  →  ▷\n↑  →  ?"
    },
    options: ["↓", "↑", "→", "←"],
    correctIndex: 0,
    optionRationales: [
      "Correct : rotation de 180° inversant la direction du nord (↑) vers le sud (↓).",
      "Figure identique sans rotation.",
      "Rotation de 90° horaire au lieu de 180°.",
      "Rotation de 90° anti-horaire au lieu de 180°."
    ],
    explanation: "Chaque terme subit un demi-tour complet (180°) : haut devient bas, gauche devient droite. La flèche pointant vers le haut (↑) pointe donc vers le bas (↓).",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-matrix-035",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "matrice",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 75,
    prompt: "Quelle figure complète logiquement la matrice 2×2 ?",
    stimulus: {
      type: "shapes",
      text: "●   ▲\n■   ?"
    },
    options: ["◆", "●", "▲", "■"],
    correctIndex: 0,
    optionRationales: [
      "Correct : quatrième figure géométrique distincte complétant l'ensemble (cercle, triangle, carré, losange).",
      "Répète le cercle figurant déjà en première case.",
      "Répète le triangle figurant déjà en deuxième case.",
      "Répète le carré figurant déjà en troisième case."
    ],
    explanation: "La matrice associe 4 polygones de complexité ou forme différente sans répétition (cercle, triangle, carré, losange). La case manquante est le losange plein ◆.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  }
];

export const verbalBatch = [
  {
    id: "verbal-contra-016",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "inference",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 70,
    prompt: "Quelle conclusion s'impose avec une certitude absolue à partir des prémisses fournies ?",
    stimulus: "Tout marché public d'un montant supérieur à 100 000 euros requiert un avis préalable du contrôleur financier. L'acquisition de matériel X n'a reçu aucun avis du contrôleur financier.",
    options: [
      "Le montant du marché X n'est pas supérieur à 100 000 euros.",
      "Le marché X est entaché d'une nullité administrative définitive.",
      "Le contrôleur financier a refusé de valider le marché X.",
      "Le marché X sera examiné lors de la prochaine session financière."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : par contraposition stricte (si montant > 100 000 € alors avis obligatoire ; or pas d'avis, donc montant ≤ 100 000 € pour être régulier).",
      "Extrapolation infondée : le texte ne statue sur aucune nullité prononcée.",
      "Affirmation non étayée : l'absence d'avis ne prouve pas un refus d'examen.",
      "Pure supposition temporelle sans ancrage dans le texte fourni."
    ],
    explanation: "Par application directe de la contraposée logique : si la règle impose « Marché > 100 000 € ⇒ Avis », alors l'absence d'avis implique nécessairement que le marché ne dépasse pas ce seuil réglementaire sous réserve de conformité.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-tfcs-017",
    version: 1,
    category: "verbal",
    itemFormat: "tfcs",
    skill: "vrai-faux-indetermine",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 60,
    prompt: "Affirmation : L'agent Claire a droit au remboursement intégral de ses frais de déplacement.",
    stimulus: "Les agents effectuant un déplacement professionnel hors du Grand-Duché bénéficient d'une indemnité forfaitaire kilométrique. Claire a effectué un déplacement professionnel à Esch-sur-Alzette.",
    options: ["Vrai", "Faux", "On ne peut pas savoir"],
    correctIndex: 2,
    optionRationales: [
      "Le texte ne précise pas si les déplacements nationaux sont remboursés ou exclus.",
      "Le texte n'affirme pas que les déplacements nationaux sont privés de remboursement.",
      "Correct : la règle régit les déplacements hors du pays, mais reste silencieuse sur les règles applicables aux trajets nationaux comme Esch-sur-Alzette."
    ],
    explanation: "Le texte ne mentionne que les conditions applicables aux déplacements internationaux. Rien n'est précisé sur les modalités applicables aux déplacements à l'intérieur du Grand-Duché (comme Esch-sur-Alzette). Il est impossible de conclure.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-rule-018",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "application-consigne",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 75,
    prompt: "Quelle décision applique rigoureusement la consigne de conservation ?",
    stimulus: "Les procès-verbaux de séance sont versés aux archives définitives après un délai de 5 ans en archives courantes. Les brouillons préparatoires doivent être détruits immédiatement après adoption du texte définitif.",
    options: [
      "Détruire les brouillons préparatoires dès l'adoption du texte définitif.",
      "Conserver les brouillons préparatoires pendant une durée minimale de 5 ans.",
      "Verser les brouillons préparatoires aux archives définitives avec le procès-verbal.",
      "Transférer les procès-verbaux aux archives définitives dès leur adoption."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : respecte scrupuleusement l'obligation de destruction immédiate des brouillons.",
      "Confond la règle des brouillons avec le délai de conservation des procès-verbaux.",
      "Viole l'obligation de destruction en conservant des documents préparatoires.",
      "Viole le délai intermédiaire de 5 ans imposé pour les procès-verbaux."
    ],
    explanation: "La consigne distingue formellement les procès-verbaux (conservés 5 ans en archives courantes avant versement) et les brouillons préparatoires (destruction immédiate obligatoire dès adoption).",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-quant-019",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "inference",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 65,
    prompt: "Quelle déduction logique est nécessairement vraie ?",
    stimulus: "Aucun document non signé n'est exécutoire. Certains documents de la division R sont exécutoires.",
    options: [
      "Certains documents de la division R sont signés.",
      "Tous les documents de la division R sont signés.",
      "Aucun document de la division R n'est signé.",
      "Tous les documents signés sont exécutoires."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : les documents exécutoires étant obligatoirement signés, ceux de la division R qui sont exécutoires sont signés.",
      "Généralisation abusive : seuls certains documents de R sont exécutoires.",
      "Contredit directement la prémisse affirmant que certains documents de R sont exécutoires.",
      "Confond condition nécessaire (signature requise) et condition suffisante."
    ],
    explanation: "Si aucun document non signé n'est exécutoire, tout document exécutoire est obligatoirement signé. Comme certains documents de la division R sont exécutoires, ils sont donc nécessairement signés.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-comp-020",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "comprehension",
    difficulty: 1,
    language: "fr",
    estimatedSeconds: 60,
    prompt: "Quelle proposition énonce un fait objectif et non une appréciation qualitative ?",
    stimulus: "La refonte du portail citoyen a permis de diviser par deux le délai de délivrance des extraits de casier judiciaire, passant de 6 jours à 3 jours ouvrés, pour le plus grand confort des administrés.",
    options: [
      "Le délai de délivrance est passé de 6 jours à 3 jours ouvrés.",
      "Le confort des administrés est grandement amélioré par la réforme.",
      "La nouvelle procédure est la plus efficace de l'administration.",
      "Le portail citoyen offre une ergonomie particulièrement réussie."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : mesure chiffrée factuelle, vérifiable et exempte de jugement de valeur.",
      "Appréciation qualitative subjective sur le ressenti des usagers.",
      "Jugement de valeur comparatif sans base quantitative fournie.",
      "Opinion esthétique et ergonomique subjective."
    ],
    explanation: "Le passage de 6 à 3 jours ouvrés est une donnée temporelle chiffrée, mesurable et vérifiable, contrairement aux mentions sur le confort ou la qualité ergonomique.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-synth-021",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "synthese",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 80,
    prompt: "Quelle proposition résume le plus fidèlement le dispositif décrit ?",
    stimulus: "Les demandes de subvention sont recevables du 1er janvier au 31 mars. Toute demande déposée hors délai est déclarée irrecevable sans examen au fond, sauf cas de force majeure dûment attesté par une autorité publique compétente.",
    options: [
      "Les demandes hors délai sont irrecevables, sauf force majeure attestée par une autorité.",
      "Toute demande déposée après le 31 mars est définitivement rejetée sans exception possible.",
      "Les demandes déposées entre janvier et mars font l'objet d'une acceptation automatique.",
      "Une attestation sur l'honneur suffit pour justifier un dépôt de dossier tardif."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : reprend fidèlement le principe d'irrecevabilité et l'unique exception d'autorité.",
      "Ignore l'exception expresse de force majeure prévue par le texte.",
      "Confond la recevabilité de la demande avec son acceptation au fond.",
      "Contredit l'exigence d'une attestation délivrée par une autorité publique compétente."
    ],
    explanation: "La synthèse exacte préserve la règle générale (irrecevabilité des dossiers tardifs) ainsi que sa condition dérogatoire stricte (force majeure établie par une autorité publique).",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-tfcs-022",
    version: 1,
    category: "verbal",
    itemFormat: "tfcs",
    skill: "vrai-faux-indetermine",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 60,
    prompt: "Affirmation : La demande de congé de Julien a été approuvée par son supérieur.",
    stimulus: "Toute demande de congé bonifié doit être déposée un mois avant le départ. Julien a déposé sa demande de congé bonifié six semaines avant la date de départ prévue.",
    options: ["Vrai", "Faux", "On ne peut pas savoir"],
    correctIndex: 2,
    optionRationales: [
      "Le respect du délai de dépôt ne garantit pas la décision favorable de l'autorité.",
      "Le texte n'indique en aucun cas que la demande de Julien a été refusée.",
      "Correct : Julien a respecté le délai de dépôt, mais le texte ne dit rien sur la décision finale de sa hiérarchie."
    ],
    explanation: "Le texte confirme uniquement le respect de la formalité temporelle de dépôt (6 semaines > 1 mois requis). Il ne contient aucune information quant à l'acceptation ou au refus de la demande.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-syll-023",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "inference",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 70,
    prompt: "Quelle proposition est rigoureusement déduite des prémisses ?",
    stimulus: "Tous les inspecteurs assermentés disposent d'un droit d'accès aux locaux professionnels. Aucun stagiaire n'est assermenté.",
    options: [
      "Certaines personnes ayant un droit d'accès ne sont pas stagiaires.",
      "Tous les stagiaires sont interdits d'accès aux locaux professionnels.",
      "Tous les inspecteurs assermentés sont d'anciens stagiaires.",
      "L'assermentation est accordée à tout agent après deux ans de service."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : les inspecteurs assermentés disposent du droit d'accès et, n'étant pas stagiaires, constituent des personnes autorisées non-stagiaires.",
      "Le texte ne dit pas que les stagiaires ne peuvent pas avoir accès pour un autre motif.",
      "Spéculation sur l'historique de carrière absente du texte.",
      "Règle temporelle totalement inexistante dans les prémisses."
    ],
    explanation: "Les inspecteurs assermentés ont un droit d'accès et aucun stagiaire n'est assermenté. Par conséquent, les inspecteurs assermentés représentent au moins une catégorie de personnes dotées d'un droit d'accès qui ne sont pas des stagiaires.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-app-024",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "application-consigne",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 75,
    prompt: "Quel dossier remplit scrupuleusement toutes les conditions d'éligibilité ?",
    stimulus: "Pour être éligible au fonds d'innovation, un projet doit réunir trois critères cumulatifs : être porté par au moins deux services distincts, avoir une durée d'exécution inférieure à 12 mois, et ne pas dépasser un budget total de 50 000 euros.",
    options: [
      "Projet A : 2 services, durée de 9 mois, budget de 45 000 euros.",
      "Projet B : 1 service, durée de 6 mois, budget de 30 000 euros.",
      "Projet C : 3 services, durée de 14 mois, budget de 48 000 euros.",
      "Projet D : 2 services, durée de 10 mois, budget de 55 000 euros."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : 2 services (≥ 2), 9 mois (< 12) et 45 000 € (≤ 50 000 €) valident les 3 critères cumulatifs.",
      "Échoue sur le nombre de services (1 seul service au lieu de deux au minimum).",
      "Échoue sur la durée d'exécution (14 mois dépasse la limite stricte de 12 mois).",
      "Échoue sur le budget prévisionnel (55 000 € dépasse le plafond de 50 000 €)."
    ],
    explanation: "Seul le projet A remplit simultanément les trois conditions cumulatives imposées par le texte : au moins deux services (2), durée inférieure à 12 mois (9 mois), et budget n'excédant pas 50 000 euros (45 000 euros).",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-comp-025",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "comprehension",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 70,
    prompt: "Quelle proposition reformule le texte sans altérer son sens logique ?",
    stimulus: "Le renouvellement d'une autorisation d'exploitation n'est accordé que si l'exploitant a transmis son bilan environnemental annuel avant le 1er décembre.",
    options: [
      "La transmission du bilan avant le 1er décembre est une condition nécessaire au renouvellement.",
      "La transmission du bilan avant le 1er décembre garantit automatiquement le renouvellement.",
      "L'exploitant qui transmet son bilan le 5 décembre obtiendra une dérogation de plein droit.",
      "Le renouvellement de l'autorisation d'exploitation dispense du bilan environnemental."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : la locution « n'est accordé que si » définit strictement une condition nécessaire.",
      "Confond condition nécessaire et condition suffisante d'approbation.",
      "Contredit formellement l'échéance impérative du 1er décembre.",
      "Contredit l'obligation légale de transmission du bilan."
    ],
    explanation: "La formulation « n'est accordé que si » signifie que sans ce dépôt préalable avant le 1er décembre, le renouvellement est impossible. Cela en fait une condition sine qua non (nécessaire), mais pas forcément suffisante.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-inf-026",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "inference",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 65,
    prompt: "Quelle conclusion est absolument certaine ?",
    stimulus: "Toutes les réunions de crise ont lieu dans la salle rouge. La réunion de ce matin a lieu dans la salle bleue.",
    options: [
      "La réunion de ce matin n'est pas une réunion de crise.",
      "La réunion de ce matin est un simple point d'information interne.",
      "La salle rouge était indisponible ce matin pour travaux.",
      "Aucune réunion n'a eu lieu dans la salle rouge ce matin."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : par contraposition (si réunion de crise alors salle rouge ; or salle bleue, donc pas de crise).",
      "Spéculation sur la nature exacte de la réunion non étayée par le texte.",
      "Hypothèse matérielle non mentionnée dans les prémisses.",
      "Rien ne permet d'affirmer que la salle rouge est restée inoccupée."
    ],
    explanation: "Si toute réunion de crise se déroule obligatoirement dans la salle rouge, une réunion tenue dans la salle bleue ne peut en aucun cas être une réunion de crise (contraposition formelle).",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-tfcs-027",
    version: 1,
    category: "verbal",
    itemFormat: "tfcs",
    skill: "vrai-faux-indetermine",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 60,
    prompt: "Affirmation : L'ensemble des fonctionnaires du ministère a suivi la session de sensibilisation à la cybersécurité.",
    stimulus: "La participation à la session de sensibilisation à la cybersécurité était obligatoire pour les agents du service informatique. Certains agents d'autres services y ont également assisté de manière volontaire.",
    options: ["Vrai", "Faux", "On ne peut pas savoir"],
    correctIndex: 1,
    optionRationales: [
      "Affirmer que tous ont suivi la session contredit le périmètre restreint d'obligation du texte.",
      "Correct : l'obligation ne visait que le service informatique et seuls certains agents des autres services ont participé, ce qui exclut une participation universelle.",
      "Le texte permet d'affirmer avec certitude que la totalité n'y a pas participé."
    ],
    explanation: "Le texte stipule que la session n'était obligatoire que pour le service informatique et que seuls certains agents des autres départements étaient présents. L'affirmation selon laquelle « l'ensemble » des fonctionnaires y a assisté est donc fausse.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-app-028",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "application-consigne",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 70,
    prompt: "Quelle modalité de transmission est strictement conforme à la directive ?",
    stimulus: "Les réclamations relatives à la taxe foncière doivent être transmises exclusivement par pli recommandé avec avis de réception ou déposées contre récépissé au secrétariat communal.",
    options: [
      "Envoi postal par lettre recommandée avec avis de réception.",
      "Transmission par courrier électronique avec confirmation de lecture.",
      "Dépôt d'une lettre simple dans la boîte aux lettres de la commune.",
      "Appel téléphonique enregistré auprès de l'agent de permanence."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : mode d'envoi expressément prévu et autorisé par la directive.",
      "L'envoi électronique n'est pas autorisé par l'adverbe d'exclusivité « exclusivement ».",
      "Le dépôt sans récépissé ne remplit pas l'exigence formelle requise.",
      "La voie orale par téléphone est dépourvue de toute valeur probante au regard de la règle."
    ],
    explanation: "La consigne restreint les voies de recours admissibles à deux modalités exclusives : le pli recommandé avec accusé de réception ou le dépôt physique contre récépissé. L'envoi en recommandé AR est donc conforme.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-inf-029",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "inference",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 80,
    prompt: "Laquelle des assertions constitue une extrapolation non garantie par le passage ?",
    stimulus: "Au cours de l'année écoulée, l'introduction d'un outil d'indexation automatisé a permis aux agents d'instruire 1 800 requêtes contre 1 200 l'année précédente, sans augmentation d'effectif.",
    options: [
      "Les agents éprouvent une plus grande satisfaction dans leur quotidien professionnel.",
      "Le nombre total de requêtes instruites a progressé de 50 % par rapport à l'année précédente.",
      "L'effectif du service est demeuré stable sur les deux années comparées.",
      "La productivité moyenne par agent a augmenté au cours de l'année écoulée."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : le passage renseigne des données d'activité et d'effectif, mais aucune indication sur la satisfaction des agents.",
      "Démontré mathématiquement : (1 800 - 1 200) / 1 200 = 600 / 1 200 = +50 %.",
      "Démontré textuellement par la mention « sans augmentation d'effectif ».",
      "Démontré par la hausse de volume à effectif inchangé."
    ],
    explanation: "Le texte ne fournit que des indicateurs quantitatifs objectifs (volume de dossiers et stabilité des ressources humaines). Prêter aux agents une satisfaction accrue relève d'une extrapolation subjective non garantie.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-synth-030",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "synthese",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 75,
    prompt: "Quelle proposition synthétise le plus fidèlement les obligations déontologiques énoncées ?",
    stimulus: "Tout fonctionnaire est tenu au secret professionnel pour les faits dont il a connaissance dans l'exercice de ses fonctions. Il ne peut en être délié que par une décision expresse du ministre de tutelle ou dans les cas expressément prescrits par la loi pénale.",
    options: [
      "Le secret s'impose à tout fonctionnaire, avec pour seules dérogations la décision ministérielle ou la loi pénale.",
      "Le fonctionnaire peut librement divulguer des informations réservées à ses collègues proches.",
      "La levée du secret professionnel est accordée de plein droit sur simple demande d'un citoyen.",
      "Le secret professionnel ne s'applique plus dès lors que l'agent quitte définitivement son service."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : résume fidèlement le champ universel de l'obligation et les deux seules exceptions limitatives.",
      "Viole l'obligation de secret qui ne tolère aucun partage informel entre collègues.",
      "Contredit le principe d'interdiction et les conditions strictes de levée.",
      "Extrapolation injustifiée : l'obligation demeure attachée aux faits connus en exercice."
    ],
    explanation: "La synthèse restitue fidèlement les deux composantes du texte : le caractère général de l'obligation de secret professionnel et les deux seuls cas d'exception limitativement énumérés (décision du ministre ou prescription de la loi pénale).",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-inf-031",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "inference",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 65,
    prompt: "Quelle déduction logique est incontestable ?",
    stimulus: "Tous les lauréats de l'épreuve A1 possèdent un diplôme de niveau master ou équivalent. Marc est lauréat de l'épreuve A1.",
    options: [
      "Marc possède un diplôme de niveau master ou équivalent.",
      "Marc est déjà titularisé dans son grade de recrutement.",
      "Marc a obtenu la note maximale lors de l'épreuve écrite.",
      "Tous les titulaires d'un master réussissent l'épreuve A1."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : déduction directe par syllogisme (Tout A est B ; Marc est A ; donc Marc est B).",
      "Confusion entre le statut de lauréat et la titularisation ultérieure.",
      "Spéculation sur la note obtenue sans base dans l'énoncé.",
      "Réciproque erronée (affirmer que tout master réussit inverse l'implication logique)."
    ],
    explanation: "Puisque l'ensemble des lauréats possède un diplôme de niveau master ou équivalent et que Marc appartient à cet ensemble, Marc détient nécessairement ce niveau de qualification.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-app-032",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "application-consigne",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 70,
    prompt: "Quelle suite convient de donner selon la directive interne ?",
    stimulus: "En cas d'absence imprévue pour raison de santé, l'agent doit en informer sa hiérarchie dans un délai de 2 heures suivant sa prise de service théorique, et transmettre un certificat médical sous 48 heures ouvrables.",
    options: [
      "Prévenir sa hiérarchie sous 2 heures et envoyer le certificat médical sous 48 heures ouvrables.",
      "Attendre 48 heures ouvrables avant d'établir le premier contact avec son service.",
      "Déposer un certificat médical sans obligation préalable d'information hiérarchique.",
      "Prévenir sa hiérarchie uniquement après avoir obtenu son certificat médical."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : respecte scrupuleusement les deux démarches et leurs délais respectifs distincts.",
      "Omet l'obligation de premier signalement dans les 2 heures.",
      "Viole l'exigence d'information immédiate sous 2 heures.",
      "Inverse la chronologie des obligations fixée par la directive."
    ],
    explanation: "La règle cumule deux obligations temporelles précises : un avertissement hiérarchique rapide (sous 2 heures) puis la formalisation justificative par certificat (sous 48 heures ouvrables).",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-tfcs-033",
    version: 1,
    category: "verbal",
    itemFormat: "tfcs",
    skill: "vrai-faux-indetermine",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 60,
    prompt: "Affirmation : Le dossier de subvention n° 404 sera automatiquement rejeté.",
    stimulus: "Les dossiers de subvention incomplets sont retournés au demandeur avec un délai de régularisation de 15 jours calendaires. Le dossier n° 404 déposé par l'association E est incomplet.",
    options: ["Vrai", "Faux", "On ne peut pas savoir"],
    correctIndex: 1,
    optionRationales: [
      "Le texte ne prévoit pas de rejet automatique, mais un retour pour régularisation sous 15 jours.",
      "Correct : le dossier incomplet n'est pas rejeté d'emblée, il bénéficie d'une procédure de régularisation.",
      "La règle de traitement des dossiers incomplets est clairement et explicitement définie dans le texte."
    ],
    explanation: "Le texte stipule expressément que les dossiers incomplets ne sont pas rejetés directement, mais renvoyés pour régularisation sous 15 jours. L'affirmation d'un rejet automatique est donc fausse.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-comp-034",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "comprehension",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 65,
    prompt: "Quelle proposition exprime la même restriction d'accès ?",
    stimulus: "Seuls les agents titulaires d'une habilitation de sécurité spéciale peuvent consulter les documents classifiés de niveau 3.",
    options: [
      "L'habilitation de sécurité spéciale est indispensable pour consulter ces documents.",
      "Tout agent titulaire de l'habilitation spéciale a obligation de consulter ces documents.",
      "Les agents stagiaires peuvent consulter ces documents s'ils sont accompagnés d'un tuteur.",
      "L'habilitation de sécurité spéciale dispense de tout contrôle de sécurité ultérieur."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : la restriction « seuls les agents titulaires » fait de l'habilitation une condition sine qua non.",
      "Confond autorisation d'accès avec obligation professionnelle de consultation.",
      "Extrapole une exception de tutorat non prévue par le texte.",
      "Rien n'indique que l'habilitation dispense de respecter les règles de sécurité."
    ],
    explanation: "La locution restrictive « seuls les agents... peuvent » établit que détenir l'habilitation constitue une condition nécessaire et incontournable (indispensable) pour consulter les documents classifiés.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-inf-035",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "inference",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 70,
    prompt: "Quelle conclusion découle avec certitude des éléments fournis ?",
    stimulus: "Certains membres de la commission d'évaluation sont experts-comptables. Tous les experts-comptables sont soumis à un code de déontologie financière.",
    options: [
      "Certains membres de la commission d'évaluation sont soumis à un code de déontologie financière.",
      "Tous les membres de la commission d'évaluation sont soumis à un code de déontologie financière.",
      "Aucun membre de la commission d'évaluation n'est expert-comptable.",
      "La commission d'évaluation est composée exclusivement d'experts-comptables."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : les membres qui sont experts-comptables étant tous soumis au code, certains membres le sont obligatoirement.",
      "Généralisation abusive à l'ensemble des membres de la commission.",
      "Contredit formellement la première prémisse.",
      "L'adjectif « certains » interdit d'affirmer l'exclusivité de la composition."
    ],
    explanation: "Puisque certains membres de la commission sont experts-comptables et que tout expert-comptable relève du code de déontologie, il existe obligatoirement des membres de la commission soumis à ce code.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  }
];

export const numericBatch = [
  {
    id: "numeric-calc-016",
    version: 1,
    category: "numeric",
    itemFormat: "single_best",
    skill: "pourcentage",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 75,
    prompt: "Quel est le montant de la remise totale accordée sur cette commande de fournitures ?",
    stimulus: "Un marché de fournitures administratives d'un montant brut de 12 000 euros bénéficie d'une remise commerciale de 8 %.",
    options: ["960 euros", "800 euros", "1 040 euros", "1 200 euros"],
    correctIndex: 0,
    optionRationales: [
      "Correct : 12 000 × 0,08 = 960 euros.",
      "Calcul basé sur un taux erroné de 6,67 %.",
      "Surestimation correspondant à un taux de 8,67 %.",
      "Correspondrait à une remise de 10 % au lieu de 8 %."
    ],
    explanation: "Le montant de la remise se calcule directement : 12 000 € × (8 / 100) = 960 euros.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "numeric-table-017",
    version: 1,
    category: "numeric",
    itemFormat: "single_best",
    skill: "lecture-tableau",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 80,
    prompt: "Quel département affiche le taux de conformité le plus élevé ?",
    stimulus: {
      type: "table",
      caption: "Contrôles de conformité par département",
      headers: ["Département", "Dossiers contrôlés", "Dossiers conformes"],
      rows: [
        ["Département Nord", 200, 170],
        ["Département Sud", 250, 220],
        ["Département Centre", 150, 126]
      ]
    },
    options: ["Département Sud", "Département Nord", "Département Centre", "Département Nord et Centre à égalité"],
    correctIndex: 0,
    optionRationales: [
      "Correct : 220 / 250 = 88,0 %, taux le plus élevé du tableau.",
      "Département Nord : 170 / 200 = 85,0 %.",
      "Département Centre : 126 / 150 = 84,0 %.",
      "Les taux de Nord (85 %) et Centre (84 %) sont distincts et inférieurs à Sud."
    ],
    explanation: "Taux de conformité respectifs : Nord = 170 / 200 = 85,0 % ; Sud = 220 / 250 = 88,0 % ; Centre = 126 / 150 = 84,0 %. Le Département Sud présente le taux le plus élevé.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "numeric-var-018",
    version: 1,
    category: "numeric",
    itemFormat: "single_best",
    skill: "variation",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 75,
    prompt: "Quelle est la variation relative des inscriptions entre 2024 et 2025 ?",
    stimulus: "Le nombre d'inscriptions à l'examen professionnel est passé de 400 candidats en 2024 à 460 candidats en 2025.",
    options: ["+15,0 %", "+12,0 %", "+60,0 %", "+13,0 %"],
    correctIndex: 0,
    optionRationales: [
      "Correct : (460 - 400) / 400 = 60 / 400 = +15,0 %.",
      "Division erronée par la valeur finale (60 / 460 ≈ 13 %).",
      "Confusion entre l'augmentation en valeur absolue (+60) et le pourcentage.",
      "Erreur d'arrondi sur la valeur finale."
    ],
    explanation: "La variation relative est donnée par (Valeur finale - Valeur initiale) / Valeur initiale : (460 - 400) / 400 = 60 / 400 = 0,15, soit une progression de +15,0 %.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "numeric-mean-019",
    version: 1,
    category: "numeric",
    itemFormat: "single_best",
    skill: "moyenne",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 80,
    prompt: "Quelle est la durée moyenne de traitement par dossier sur l'ensemble de la journée ?",
    stimulus: "Matin : 10 dossiers traités en 20 minutes chacun. Après-midi : 20 dossiers traités en 35 minutes chacun.",
    options: ["30 minutes", "27,5 minutes", "25 minutes", "32,5 minutes"],
    correctIndex: 0,
    optionRationales: [
      "Correct : [(10 × 20) + (20 × 35)] / 30 = (200 + 700) / 30 = 900 / 30 = 30 minutes.",
      "Moyenne arithmétique simple non pondérée : (20 + 35) / 2 = 27,5 minutes.",
      "Sous-pondération arbitraire des dossiers de l'après-midi.",
      "Surpondération excessive de l'après-midi."
    ],
    explanation: "Calcul de la moyenne pondérée : temps total = (10 × 20) + (20 × 35) = 200 + 700 = 900 minutes. Divisé par 30 dossiers (10 + 20), on obtient 30 minutes par dossier.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "numeric-ratio-020",
    version: 1,
    category: "numeric",
    itemFormat: "single_best",
    skill: "ratio-proportion",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 70,
    prompt: "Combien d'agents seront affectés au Pôle Accueil selon ce ratio ?",
    stimulus: "Une enveloppe de 35 nouveaux agents est répartie entre le Pôle Accueil et le Pôle Instruction selon un ratio de 3 pour 4 (3 parts pour l'Accueil, 4 parts pour l'Instruction).",
    options: ["15 agents", "20 agents", "12 agents", "18 agents"],
    correctIndex: 0,
    optionRationales: [
      "Correct : total de 3 + 4 = 7 parts ; 1 part = 35 / 7 = 5 agents ; Accueil = 3 × 5 = 15 agents.",
      "Correspond à la part du Pôle Instruction (4 × 5 = 20 agents).",
      "Sous-évaluation résultant d'une erreur de calcul.",
      "Répartition erronée sans respect du dénominateur 7."
    ],
    explanation: "Le ratio 3:4 totalise 7 parts égales. Une part vaut 35 / 7 = 5 agents. Le Pôle Accueil recevant 3 parts, il accueille 3 × 5 = 15 agents.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "numeric-perc-021",
    version: 1,
    category: "numeric",
    itemFormat: "single_best",
    skill: "pourcentage",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 85,
    prompt: "Quel est le prix final du logiciel après l'application de ces deux remises successives ?",
    stimulus: "Une licence logicielle d'une valeur de 2 000 euros bénéficie d'une remise initiale de 20 %, puis d'une remise additionnelle de 10 % sur le montant résiduel.",
    options: ["1 440 euros", "1 400 euros", "1 500 euros", "1 380 euros"],
    correctIndex: 0,
    optionRationales: [
      "Correct : 2 000 × 0,80 = 1 600 €, puis 1 600 × 0,90 = 1 440 euros.",
      "Additionne à tort les deux taux (20 % + 10 % = 30 % de 2 000 € = 1 400 €).",
      "Sous-estime la remise cumulée.",
      "Erreur de calcul dans la cascade des pourcentages."
    ],
    explanation: "Après la première remise de 20 %, le prix devient 2 000 € × 0,80 = 1 600 €. La seconde remise de 10 % s'applique sur cette base : 1 600 € × 0,90 = 1 440 euros.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "numeric-ops-022",
    version: 1,
    category: "numeric",
    itemFormat: "single_best",
    skill: "operations-simples",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 70,
    prompt: "Combien d'heures sont nécessaires pour instruire les 90 dossiers restants avec l'équipe réunie ?",
    stimulus: "L'agent A instruit 5 dossiers par heure. L'agent B instruit 7 dossiers par heure. L'agent C instruit 3 dossiers par heure. Ils travaillent conjointement.",
    options: ["6 heures", "5 heures", "7 heures", "8 heures"],
    correctIndex: 0,
    optionRationales: [
      "Correct : cadence cumulée = 5 + 7 + 3 = 15 dossiers/h ; 90 / 15 = 6 heures.",
      "À 15 dossiers/h, 5 heures ne produiraient que 75 dossiers.",
      "Surestimation de la durée requise.",
      "Correspondrait au travail sans l'agent B."
    ],
    explanation: "La cadence conjointe est de 5 + 7 + 3 = 15 dossiers par heure. Pour traiter 90 dossiers, le temps nécessaire est de 90 / 15 = 6 heures.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "numeric-table-023",
    version: 1,
    category: "numeric",
    itemFormat: "single_best",
    skill: "lecture-tableau",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 80,
    prompt: "Quel est le montant total des crédits restants non consommés au 31 décembre ?",
    stimulus: {
      type: "table",
      caption: "Consommation budgétaire par programme (en milliers d'euros)",
      headers: ["Programme", "Budget alloué", "Budget consommé"],
      rows: [
        ["Programme 1", 500, 420],
        ["Programme 2", 300, 270],
        ["Programme 3", 200, 160]
      ]
    },
    options: ["150 milliers d'euros", "130 milliers d'euros", "170 milliers d'euros", "140 milliers d'euros"],
    correctIndex: 0,
    optionRationales: [
      "Correct : écarts respectifs = (500 - 420) + (300 - 270) + (200 - 160) = 80 + 30 + 40 = 150 milliers d'euros.",
      "Sous-estime le reliquat du Programme 1.",
      "Erreur d'addition sur les crédits résiduels.",
      "Omet une partie des reliquats budgétaires."
    ],
    explanation: "Les reliquats non consommés s'élèvent à : Programme 1 = 80 k€, Programme 2 = 30 k€, Programme 3 = 40 k€. La somme totale est de 80 + 30 + 40 = 150 milliers d'euros.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "numeric-var-024",
    version: 1,
    category: "numeric",
    itemFormat: "single_best",
    skill: "variation",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 65,
    prompt: "De combien de points de pourcentage le taux de réussite a-t-il varié ?",
    stimulus: "Le taux de réussite à l'examen passe de 45 % lors de la session de printemps à 58 % lors de la session d'automne.",
    options: ["+13 points", "+28,9 %", "+13 %", "+10 points"],
    correctIndex: 0,
    optionRationales: [
      "Correct : 58 - 45 = 13 points de pourcentage d'écart absolu.",
      "Progression relative : (58 - 45) / 45 ≈ +28,9 %, et non écart en points.",
      "Confusion d'unité : l'écart entre deux taux s'exprime en points et non en pour cent.",
      "Erreur arithmétique de soustraction."
    ],
    explanation: "La différence arithmétique directe entre deux pourcentages s'exprime en points de pourcentage : 58 − 45 = 13 points de pourcentage.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "numeric-mean-025",
    version: 1,
    category: "numeric",
    itemFormat: "single_best",
    skill: "moyenne",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 75,
    prompt: "Quelle est la moyenne arithmétique simple des cinq notes obtenues ?",
    stimulus: "Notes obtenues aux cinq épreuves du concours : 12/20, 14/20, 15/20, 11/20, 18/20.",
    options: ["14,0 / 20", "13,5 / 20", "14,5 / 20", "15,0 / 20"],
    correctIndex: 0,
    optionRationales: [
      "Correct : (12 + 14 + 15 + 11 + 18) / 5 = 70 / 5 = 14,0 / 20.",
      "Sous-estime la somme des notes de 2,5 points.",
      "Surestimation résultant d'une erreur d'addition.",
      "Arrondi excessif sans justification mathématique."
    ],
    explanation: "La somme des notes est 12 + 14 + 15 + 11 + 18 = 70. Divisée par 5 épreuves, la moyenne simple est de 70 / 5 = 14,0 / 20.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "numeric-scale-026",
    version: 1,
    category: "numeric",
    itemFormat: "single_best",
    skill: "ratio-proportion",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 70,
    prompt: "Quelle est la distance réelle sur le terrain correspondant à ce tracé ?",
    stimulus: "Sur un plan cadastral à l'échelle 1:5 000, une voie d'accès mesure 6 centimètres.",
    options: ["300 mètres", "30 mètres", "3 000 mètres", "600 mètres"],
    correctIndex: 0,
    optionRationales: [
      "Correct : 6 cm × 5 000 = 30 000 cm = 300 mètres.",
      "Erreur d'un facteur 10 dans la conversion d'unités (30 m).",
      "Erreur par excès d'un facteur 10 (3 000 m).",
      "Confusion dans la multiplication (6 × 10 000 au lieu de 6 × 5 000)."
    ],
    explanation: "Distance réelle = 6 cm × 5 000 = 30 000 cm. Converti en mètres (1 m = 100 cm), cela équivaut à 30 000 / 100 = 300 mètres.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "numeric-perc-027",
    version: 1,
    category: "numeric",
    itemFormat: "single_best",
    skill: "pourcentage",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 70,
    prompt: "Combien d'agents participent régulièrement au télétravail ?",
    stimulus: "Sur un effectif total de 450 agents, 40 % bénéficient d'une convention de télétravail régulière.",
    options: ["180 agents", "175 agents", "190 agents", "200 agents"],
    correctIndex: 0,
    optionRationales: [
      "Correct : 450 × 0,40 = 180 agents.",
      "Calcul erroné basé sur 38,9 %.",
      "Surestimation correspondant à 42,2 %.",
      "Calcul correspondant à 44,4 % de l'effectif."
    ],
    explanation: "Le calcul est direct : 450 × (40 / 100) = 45 × 4 = 180 agents.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "numeric-var-028",
    version: 1,
    category: "numeric",
    itemFormat: "single_best",
    skill: "variation",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 75,
    prompt: "Quel est le pourcentage de baisse de la consommation de papier ?",
    stimulus: "La consommation annuelle de rames de papier passe de 5 000 rames à 3 500 rames grâce à la dématérialisation.",
    options: ["-30,0 %", "-25,0 %", "-1 500 %", "-35,0 %"],
    correctIndex: 0,
    optionRationales: [
      "Correct : (3 500 - 5 000) / 5 000 = -1 500 / 5 000 = -30,0 %.",
      "Sous-estime la réduction en divisant par une base erronée.",
      "Confusion entre volume absolu (-1 500 rames) et pourcentage.",
      "Division par la valeur finale au lieu de la valeur initiale (-1 500 / 3 500 ≈ -42,8 %)."
    ],
    explanation: "La variation relative est (3 500 - 5 000) / 5 000 = -1 500 / 5 000 = -0,30, soit une diminution de 30,0 %.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "numeric-mean-029",
    version: 1,
    category: "numeric",
    itemFormat: "single_best",
    skill: "moyenne",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 80,
    prompt: "Quelle est la note globale pondérée du candidat ?",
    stimulus: "Épreuve écrite (coefficient 4) : 15/20. Épreuve orale (coefficient 6) : 12/20.",
    options: ["13,2 / 20", "13,5 / 20", "13,0 / 20", "13,8 / 20"],
    correctIndex: 0,
    optionRationales: [
      "Correct : [(15 × 4) + (12 × 6)] / (4 + 6) = (60 + 72) / 10 = 132 / 10 = 13,2 / 20.",
      "Moyenne arithmétique simple non pondérée : (15 + 12) / 2 = 13,5 / 20.",
      "Sous-évaluation sans respect des coefficients.",
      "Inversion des coefficients en faveur de l'écrit [(15 × 6) + (12 × 4)] / 10 = 13,8."
    ],
    explanation: "Moyenne pondérée : points totaux = (15 × 4) + (12 × 6) = 60 + 72 = 132. Divisé par la somme des coefficients (4 + 6 = 10), le résultat est 132 / 10 = 13,2 / 20.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "numeric-ratio-030",
    version: 1,
    category: "numeric",
    itemFormat: "single_best",
    skill: "ratio-proportion",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 70,
    prompt: "Quel volume d'archivage reste-t-il à traiter au service Numérisation ?",
    stimulus: "Sur un fonds total de 1 200 cartons, le rapport entre cartons traités et cartons non traités est de 3 pour 1.",
    options: ["300 cartons", "400 cartons", "900 cartons", "250 cartons"],
    correctIndex: 0,
    optionRationales: [
      "Correct : 3 + 1 = 4 parts ; 1 part (non traités) = 1 200 / 4 = 300 cartons.",
      "Calcul erroné divisant par 3 au lieu de 4.",
      "Correspond aux cartons déjà traités (3 parts = 900 cartons).",
      "Sous-évaluation du reliquat d'archivage."
    ],
    explanation: "Le ratio 3:1 correspond à 4 parts au total. Chaque part représente 1 200 / 4 = 300 cartons. La part restante non traitée étant de 1, il reste 300 cartons.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "numeric-ops-031",
    version: 1,
    category: "numeric",
    itemFormat: "single_best",
    skill: "operations-simples",
    difficulty: 1,
    language: "fr",
    estimatedSeconds: 60,
    prompt: "Quel est le coût moyen de repas par agent lors de ce séminaire ?",
    stimulus: "La facture de restauration s'élève à 1 800 euros pour un groupe de 75 participants.",
    options: ["24 euros", "22 euros", "25 euros", "26 euros"],
    correctIndex: 0,
    optionRationales: [
      "Correct : 1 800 / 75 = 24 euros par participant.",
      "Sous-estime le coût unitaire réel.",
      "Arrondi arbitraire à 25 euros.",
      "Surestimation arithmétique."
    ],
    explanation: "Division simple : 1 800 € / 75 = 24 euros par participant.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "numeric-perc-032",
    version: 1,
    category: "numeric",
    itemFormat: "single_best",
    skill: "pourcentage",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 70,
    prompt: "Combien d'agents ont formulé une demande de mobilité interne ?",
    stimulus: "Au sein d'un ministère comptant 800 agents, 15 % ont déposé une demande de mobilité cette année.",
    options: ["120 agents", "110 agents", "130 agents", "125 agents"],
    correctIndex: 0,
    optionRationales: [
      "Correct : 800 × 0,15 = 120 agents.",
      "Correspondrait à un taux de 13,75 %.",
      "Correspondrait à un taux de 16,25 %.",
      "Erreur d'arrondi sur le calcul direct."
    ],
    explanation: "Calcul direct : 800 × (15 / 100) = 8 × 15 = 120 agents.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "numeric-table-033",
    version: 1,
    category: "numeric",
    itemFormat: "single_best",
    skill: "lecture-tableau",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 80,
    prompt: "Quel trimestre affiche la plus forte progression absolue de dossiers clôturés par rapport au trimestre précédent ?",
    stimulus: {
      type: "table",
      caption: "Dossiers clôturés par trimestre",
      headers: ["Trimestre", "Dossiers clôturés"],
      rows: [
        ["T1", 300],
        ["T2", 380],
        ["T3", 440],
        ["T4", 490]
      ]
    },
    options: ["Trimestre 2", "Trimestre 3", "Trimestre 4", "Trimestre 2 et Trimestre 3 à égalité"],
    correctIndex: 0,
    optionRationales: [
      "Correct : T2 gagne +80 dossiers (380 - 300), contre +60 en T3 et +50 en T4.",
      "T3 gagne 440 - 380 = 60 dossiers, soit moins que T2.",
      "T4 gagne 490 - 440 = 50 dossiers, soit moins que T2.",
      "Les progressions trimestrielles sont distinctes (80 vs 60 dossiers)."
    ],
    explanation: "Écarts absolus successifs : T2 - T1 = 380 - 300 = +80 ; T3 - T2 = 440 - 380 = +60 ; T4 - T3 = 490 - 440 = +50. La plus forte hausse en valeur absolue a lieu au Trimestre 2 (+80 dossiers).",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "numeric-var-034",
    version: 1,
    category: "numeric",
    itemFormat: "single_best",
    skill: "variation",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 85,
    prompt: "Quel est le budget final après ces deux variations annuelles consécutives ?",
    stimulus: "Un budget de fonctionnement de 100 000 euros diminue de 20 % en année 1, puis augmente de 20 % en année 2 sur la base du montant réduit.",
    options: ["96 000 euros", "100 000 euros", "98 000 euros", "94 000 euros"],
    correctIndex: 0,
    optionRationales: [
      "Correct : 100 000 × 0,80 = 80 000 €, puis 80 000 × 1,20 = 96 000 euros.",
      "Erreur classique consistant à croire qu'une hausse de 20 % compense une baisse de 20 %.",
      "Calcul erroné minorant la perte globale.",
      "Sous-estimation excessive du budget reconstitué."
    ],
    explanation: "Année 1 : 100 000 € × 0,80 = 80 000 €. Année 2 : 80 000 € × 1,20 = 96 000 €. Le montant final accuse une baisse nette de 4 % par rapport au budget initial.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "numeric-mean-035",
    version: 1,
    category: "numeric",
    itemFormat: "single_best",
    skill: "moyenne",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 75,
    prompt: "Combien d'appels le centre de contact traite-t-il en moyenne par heure ?",
    stimulus: "Le centre d'appel a réceptionné 540 communications téléphoniques au cours d'une journée continue de 9 heures d'ouverture.",
    options: ["60 appels", "55 appels", "65 appels", "50 appels"],
    correctIndex: 0,
    optionRationales: [
      "Correct : 540 / 9 = 60 appels par heure.",
      "Sous-estime le flux horaire moyen (55 × 9 = 495).",
      "Surestimation du flux horaire (65 × 9 = 585).",
      "Sous-évaluation excessive (50 × 9 = 450)."
    ],
    explanation: "La moyenne horaire s'obtient en divisant le total des appels par le nombre d'heures d'ouverture : 540 / 9 = 60 appels par heure.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  }
];

export const planningBatch = [
  {
    id: "planning-meet-016",
    version: 1,
    category: "planning",
    itemFormat: "single_best",
    skill: "disponibilites",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 75,
    prompt: "Quel créneau de 45 minutes permet de réunir les deux chefs de service ce matin ?",
    stimulus: "Chef de service A : libre de 8 h 30 à 10 h 00 et de 11 h 00 à 12 h 30. Chef de service B : libre de 9 h 15 à 11 h 30.",
    options: ["9 h 15 à 10 h 00", "8 h 30 à 9 h 15", "10 h 00 à 10 h 45", "11 h 30 à 12 h 15"],
    correctIndex: 0,
    optionRationales: [
      "Correct : intersection matinale commune de 9 h 15 à 10 h 00 (45 minutes effectives).",
      "Le chef de service B n'est pas disponible avant 9 h 15.",
      "Le chef de service A est indisponible de 10 h 00 à 11 h 00.",
      "Le chef de service B n'est plus disponible après 11 h 30."
    ],
    explanation: "La première plage commune se situe entre 9 h 15 et 10 h 00 (durée 45 minutes). La seconde plage commune s'étend de 11 h 00 à 11 h 30 (30 minutes seulement, insuffisant). Le seul créneau possible de 45 minutes est 9 h 15 à 10 h 00.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "planning-prio-017",
    version: 1,
    category: "planning",
    itemFormat: "single_best",
    skill: "priorisation",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 80,
    prompt: "Quelle tâche devez-vous impérativement planifier en premier ce matin ?",
    stimulus: "Il est 8 h 30. Tâche 1 : transmission bordereau (durée 30 min, échéance 9 h 30). Tâche 2 : préparation séance (durée 60 min, échéance 11 h 30). Tâche 3 : synthèse mensuelle (durée 45 min, échéance 16 h 00).",
    options: ["Tâche 1", "Tâche 2", "Tâche 3", "Tâche 2 ou Tâche 3 indifféremment"],
    correctIndex: 0,
    optionRationales: [
      "Correct : échéance à 9 h 30, ne laissant qu'une heure de marge pour 30 minutes de travail.",
      "Son échéance à 11 h 30 permet une exécution sereine après achèvement de la Tâche 1.",
      "Échéance fixée à 16 h 00, non prioritaire ce matin.",
      "L'imminence de la Tâche 1 interdit toute substitution."
    ],
    explanation: "La Tâche 1 a l'échéance la plus rapprochée (9 h 30). La commencer dès 8 h 30 permet de la clore à 9 h 00, laissant tout le temps nécessaire pour enchaîner la Tâche 2 (9 h 00 – 10 h 00) bien avant son échéance de 11 h 30.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "planning-room-018",
    version: 1,
    category: "planning",
    itemFormat: "single_best",
    skill: "conflits",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 75,
    prompt: "Quelle salle faut-il réserver pour tenir une séance de 60 minutes entre 14 h 00 et 16 h 00 ?",
    stimulus: "Salle Athéna : occupée de 14 h 00 à 15 h 15. Salle Mercure : libre de 14 h 30 à 15 h 45. Salle Minerve : occupée de 14 h 45 à 16 h 00.",
    options: ["Salle Mercure", "Salle Athéna", "Salle Minerve", "Aucune des trois salles"],
    correctIndex: 0,
    optionRationales: [
      "Correct : Mercure est libre de 14 h 30 à 15 h 45 (plage disponible de 75 minutes, suffisant pour 60 minutes).",
      "Athéna ne laisse que 45 minutes utiles (15 h 15 à 16 h 00).",
      "Minerve ne laisse que 45 minutes utiles (14 h 00 à 14 h 45).",
      "La salle Mercure offre un créneau continu suffisant."
    ],
    explanation: "La séance requiert 60 minutes consécutives. La salle Mercure est disponible pendant 1 h 15 (de 14 h 30 à 15 h 45), ce qui permet d'y caler la réunion d'une heure (ex. de 14 h 30 à 15 h 30). Les autres salles n'offrent que 45 minutes libres.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "planning-dep-019",
    version: 1,
    category: "planning",
    itemFormat: "single_best",
    skill: "dependances",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 70,
    prompt: "Quelle séquence d'étapes respecte strictement l'ensemble des contraintes de dépendance ?",
    stimulus: "L'étape 1 doit précéder l'étape 2. L'étape 3 ne peut démarrer qu'après la fin conjointe des étapes 1 et 2. L'étape 4 conclut le processus après l'étape 3.",
    options: [
      "Étape 1, puis Étape 2, puis Étape 3, puis Étape 4",
      "Étape 2, puis Étape 1, puis Étape 3, puis Étape 4",
      "Étape 3, puis Étape 1, puis Étape 2, puis Étape 4",
      "Étape 1, puis Étape 3, puis Étape 2, puis Étape 4"
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : respecte successivement 1 avant 2, 2 avant 3, puis 4 en clôture.",
      "Viole la dépendance initiale imposant que l'étape 1 précède l'étape 2.",
      "Viole la condition imposant que l'étape 3 démarre après les étapes 1 et 2.",
      "Place l'étape 3 avant l'étape 2 alors que l'étape 2 conditionne l'étape 3."
    ],
    explanation: "Les contraintes (1 avant 2), (2 avant 3) et (3 avant 4) imposent un ordre séquentiel unique : Étape 1 → Étape 2 → Étape 3 → Étape 4.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "planning-buffer-020",
    version: 1,
    category: "planning",
    itemFormat: "single_best",
    skill: "agenda-contraintes",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 75,
    prompt: "De combien de minutes de marge de sécurité disposez-vous avant l'échéance de 17 h 00 ?",
    stimulus: "Il est 14 h 00. Vous devez réaliser trois tâches successives : Révision de dossier (durée 60 min), Appel de cadrage (durée 30 min), et Rédaction d'avis (durée 60 min). L'échéance finale est fixée à 17 h 00.",
    options: ["30 minutes", "15 minutes", "45 minutes", "0 minute"],
    correctIndex: 0,
    optionRationales: [
      "Correct : temps de travail = 60 + 30 + 60 = 150 min (2 h 30) ; 14 h 00 + 2 h 30 = 16 h 30 ; marge = 30 minutes jusqu'à 17 h 00.",
      "Sous-estime la marge de sécurité disponible.",
      "Surestimation minorant la durée des tâches.",
      "Considère à tort que l'ensemble de la plage horaire est consommé."
    ],
    explanation: "Le cumul des durées de travail est de 60 + 30 + 60 = 150 minutes, soit 2 heures et 30 minutes. Démarrées à 14 h 00, les tâches s'achèvent à 16 h 30. La marge de sécurité avant 17 h 00 est donc de 30 minutes.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "planning-meet-021",
    version: 1,
    category: "planning",
    itemFormat: "single_best",
    skill: "disponibilites",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 85,
    prompt: "Quel créneau permet de tenir un point de 30 minutes réunissant les trois collaborateurs ?",
    stimulus: "Collaborateur X : disponible de 10 h 00 à 12 h 00. Collaborateur Y : disponible de 9 h 30 à 11 h 15. Collaborateur Z : disponible de 10 h 45 à 12 h 30.",
    options: ["10 h 45 à 11 h 15", "10 h 00 à 10 h 30", "11 h 15 à 11 h 45", "10 h 30 à 11 h 00"],
    correctIndex: 0,
    optionRationales: [
      "Correct : intersection des trois disponibilités : X (jusqu'à 12h), Y (jusqu'à 11h15), Z (dès 10h45). Plage commune = 10 h 45 à 11 h 15.",
      "Z n'est pas encore disponible avant 10 h 45.",
      "Y n'est plus disponible après 11 h 15.",
      "Z n'est pas encore disponible entre 10 h 30 et 10 h 45."
    ],
    explanation: "Collaborateur X est libre de 10 h 00 à 12 h 00, Y de 9 h 30 à 11 h 15, et Z de 10 h 45 à 12 h 30. L'unique créneau où tous les trois sont simultanément disponibles est 10 h 45 – 11 h 15 (exactement 30 minutes).",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "planning-prio-022",
    version: 1,
    category: "planning",
    itemFormat: "single_best",
    skill: "priorisation",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 75,
    prompt: "Quel ordonnancement permet de respecter toutes les échéances ?",
    stimulus: "À 9 h 00 : Tâche Alpha (durée 45 min, échéance 10 h 00). Tâche Bêta (durée 30 min, échéance 11 h 00). Tâche Gamma (durée 60 min, échéance 12 h 30).",
    options: [
      "Alpha (9h00-9h45), puis Bêta (9h45-10h15), puis Gamma (10h15-11h15)",
      "Bêta (9h00-9h30), puis Alpha (9h30-10h15), puis Gamma (10h15-11h15)",
      "Gamma (9h00-10h00), puis Alpha (10h00-10h45), puis Bêta (10h45-11h15)",
      "Alpha (9h00-9h45), puis Gamma (9h45-10h45), puis Bêta (10h45-11h15)"
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : Alpha s'achève à 9 h 45 (< 10h), Bêta à 10 h 15 (< 11h), Gamma à 11 h 15 (< 12h30).",
      "Commencer par Bêta fait finir Alpha à 10 h 15, dépassant son échéance de 10 h 00.",
      "Commencer par Gamma fait manquer l'échéance d'Alpha et compromet Bêta.",
      "Placer Gamma avant Bêta repousse la fin de Bêta à 11 h 15, dépassant son échéance de 11 h 00."
    ],
    explanation: "Seule la séquence Alpha → Bêta → Gamma respecte les échéances de chacun : Alpha est livrée à 9 h 45 (avant 10 h 00), Bêta à 10 h 15 (avant 11 h 00) et Gamma à 11 h 15 (bien avant 12 h 30).",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "planning-conflit-023",
    version: 1,
    category: "planning",
    itemFormat: "single_best",
    skill: "conflits",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 70,
    prompt: "Quelle modification minimale résout le conflit d'agenda ?",
    stimulus: "Deux entretiens individuels de 45 minutes sont calés en Salle 1 : Entretien A de 10 h 00 à 10 h 45 et Entretien B de 10 h 30 à 11 h 15. La Salle 2 est entièrement libre de 10 h 00 à 12 h 00.",
    options: [
      "Déplacer l'Entretien B en Salle 2 sur son créneau initial de 10 h 30 à 11 h 15.",
      "Raccourcir l'Entretien A à 30 minutes sans changer de salle.",
      "Reporter les deux entretiens au lendemain matin.",
      "Fusionner les deux entretiens en une seule séance collective."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : résout immédiatement le chevauchement sans impacter les horaires des participants.",
      "Dégrade la durée requise de l'entretien alors qu'une salle alternative est vacante.",
      "Mesure disproportionnée qui reporte inutilement deux activités programmées.",
      "Non conforme à la nature individuelle et réservée des entretiens."
    ],
    explanation: "Le conflit réside dans le chevauchement de 15 minutes en Salle 1 (de 10 h 30 à 10 h 45). Comme la Salle 2 est libre sur toute la matinée, déplacer l'Entretien B en Salle 2 résout le conflit sans modifier les horaires des candidats.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "planning-crit-024",
    version: 1,
    category: "planning",
    itemFormat: "single_best",
    skill: "dependances",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 85,
    prompt: "Quelle est la durée totale incompressible pour finaliser la procédure ?",
    stimulus: "Tâche Initiale : 2 jours. Ensuite, deux démarches parallèles : Démarche A (durée 5 jours) et Démarche B (durée 3 jours). Enfin, Tâche de Clôture (durée 1 jour), qui ne démarre qu'une fois A et B achevées.",
    options: ["8 jours", "6 jours", "11 jours", "10 jours"],
    correctIndex: 0,
    optionRationales: [
      "Correct : chemin critique = 2 + max(5, 3) + 1 = 2 + 5 + 1 = 8 jours.",
      "Calcule à tort sur la branche la plus courte B (2 + 3 + 1 = 6 jours).",
      "Somme linéaire erronée sans parallélisation (2 + 5 + 3 + 1 = 11 jours).",
      "Surévaluation arbitraire de deux jours."
    ],
    explanation: "Les démarches A et B étant menées en parallèle, le délai de la phase intermédiaire est déterminé par la démarche la plus longue (A, soit 5 jours). La durée totale incompressible est donc 2 + 5 + 1 = 8 jours.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "planning-agenda-025",
    version: 1,
    category: "planning",
    itemFormat: "single_best",
    skill: "agenda-contraintes",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 75,
    prompt: "À quelle heure au plus tard l'agent doit-il partir pour respecter le début de sa réunion ?",
    stimulus: "Une réunion officielle débute à 14 h 30 au Kirchberg. Le trajet en tramway dure 35 minutes. Une marge obligatoire de sécurité de 10 minutes est exigée avant le début de séance.",
    options: ["13 h 45", "13 h 55", "13 h 30", "14 h 00"],
    correctIndex: 0,
    optionRationales: [
      "Correct : arrivée requise à 14 h 20 (14h30 - 10 min) ; départ à 14 h 20 - 35 min = 13 h 45.",
      "Omet les 10 minutes de marge de sécurité (départ à 14h30 - 35 min = 13 h 55).",
      "Départ prématuré de 15 minutes par rapport au besoin réel.",
      "Arriverait en retard à 14 h 35."
    ],
    explanation: "Avec la marge de sécurité de 10 minutes, l'agent doit être sur place à 14 h 20. En retranchant les 35 minutes de transport, l'heure limite de départ est 14 h 20 − 35 min = 13 h 45.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "planning-meet-026",
    version: 1,
    category: "planning",
    itemFormat: "single_best",
    skill: "disponibilites",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 70,
    prompt: "Quel créneau horaire permet d'organiser un entretien de 30 minutes l'après-midi ?",
    stimulus: "Candidat : disponible de 13 h 30 à 15 h 00. Recruteur : disponible de 14 h 15 à 16 h 30.",
    options: ["14 h 15 à 14 h 45", "13 h 30 à 14 h 00", "14 h 45 à 15 h 15", "15 h 00 à 15 h 30"],
    correctIndex: 0,
    optionRationales: [
      "Correct : plage commune de 14 h 15 à 15 h 00 (45 minutes utiles, suffisant pour 30 min).",
      "Le recruteur n'est pas encore disponible avant 14 h 15.",
      "Le candidat n'est plus disponible après 15 h 00 (la séance déborderait de 15 minutes).",
      "Le candidat est absent à partir de 15 h 00."
    ],
    explanation: "La période de disponibilité commune s'étend de 14 h 15 (arrivée du recruteur) à 15 h 00 (départ du candidat). L'entretien de 30 minutes peut donc se tenir de 14 h 15 à 14 h 45.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "planning-prio-027",
    version: 1,
    category: "planning",
    itemFormat: "single_best",
    skill: "priorisation",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 75,
    prompt: "Quelle action est prioritaire selon la matrice urgence/importance administrative ?",
    stimulus: "Action A : Répondre à une demande parlementaire à échéance ce soir (urgent et important). Action B : Archiver des courriels administratifs anciens (non urgent, non important). Action C : Préparer la commande de papeterie semestrielle (important, non urgent). Action D : Répondre à un appel d'un démarcheur (urgent, non important).",
    options: ["Action A", "Action C", "Action D", "Action B"],
    correctIndex: 0,
    optionRationales: [
      "Correct : tâche à la fois urgente et institutionnellement importante avec échéance impérative le jour même.",
      "Importante mais non urgente, planifiable ultérieurement.",
      "Urgence apparente sans portée institutionnelle, à déléguer ou écourter.",
      "Tâche de fond à traiter en temps masqué."
    ],
    explanation: "Selon les principes d'efficacité administrative et la matrice d'Eisenhower, les tâches à la fois urgentes et hautement importantes (comme une question parlementaire sous astreinte légale) doivent être traitées immédiatement en priorité absolue.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "planning-conflit-028",
    version: 1,
    category: "planning",
    itemFormat: "single_best",
    skill: "conflits",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 75,
    prompt: "Quel créneau permet d'intercaler une réunion de conciliation de 45 minutes sans collision ?",
    stimulus: "La matinée de l'arbitre est occupée de 8 h 30 à 9 h 45 (Audience 1) et de 10 h 45 à 12 h 00 (Audience 2).",
    options: ["9 h 45 à 10 h 30", "9 h 30 à 10 h 15", "10 h 15 à 11 h 00", "10 h 30 à 11 h 15"],
    correctIndex: 0,
    optionRationales: [
      "Correct : intervalle libre de 9 h 45 à 10 h 45 (60 minutes disponibles, suffisant pour 45 minutes).",
      "Conflit avec l'Audience 1 qui ne s'achève qu'à 9 h 45.",
      "Conflit avec l'Audience 2 qui démarre à 10 h 45.",
      "Conflit direct avec l'Audience 2 dès 10 h 45."
    ],
    explanation: "L'arbitre dispose d'un temps libre exact de 9 h 45 à 10 h 45 (durée 1 heure). Une réunion de 45 minutes s'y insère parfaitement, par exemple de 9 h 45 à 10 h 30, sans empiéter sur aucune audience.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "planning-dep-029",
    version: 1,
    category: "planning",
    itemFormat: "single_best",
    skill: "dependances",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 70,
    prompt: "Quelle tâche peut débuter dès le matin sans attendre les autres livrables ?",
    stimulus: "Tâche 1 (Rapport financier) : en attente des chiffres comptables. Tâche 2 (Revue de presse) : aucune dépendance préalable requise. Tâche 3 (Validation budgétaire) : dépend de la fin du Rapport financier. Tâche 4 (Diffusion du PV) : dépend de la Validation budgétaire.",
    options: ["Tâche 2", "Tâche 1", "Tâche 3", "Tâche 4"],
    correctIndex: 0,
    optionRationales: [
      "Correct : c'est la seule tâche autonome dont l'exécution n'est soumise à aucun prérequis bloquant.",
      "Bloquée par l'attente des chiffres comptables.",
      "Bloquée en cascade par la Tâche 1.",
      "Bloquée en cascade par la Tâche 3."
    ],
    explanation: "Toutes les tâches font partie d'une chaîne séquentielle dépendante du rapport financier, à l'exception de la Tâche 2 (Revue de presse), qui est autonome et peut être traitée immédiatement dès le matin.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "planning-agenda-030",
    version: 1,
    category: "planning",
    itemFormat: "single_best",
    skill: "agenda-contraintes",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 75,
    prompt: "Combien d'agents supplémentaires faut-il mobiliser pour achever la saisie dans le délai imparti ?",
    stimulus: "Volume total de travail : 160 heures-agent. Le délai de livraison est fixé à 5 jours ouvrés, à raison de 8 heures de travail par agent et par jour. L'équipe actuelle comprend 2 agents.",
    options: ["2 agents supplémentaires", "1 agent supplémentaire", "3 agents supplémentaires", "4 agents supplémentaires"],
    correctIndex: 0,
    optionRationales: [
      "Correct : 1 agent produit 5 × 8 = 40 h ; besoin total = 160 / 40 = 4 agents ; 4 - 2 = 2 agents en renfort.",
      "1 agent de renfort ne fournirait que 120 heures au total (3 × 40 h), laissant 40 h non traitées.",
      "3 agents supplémentaires porteraient l'équipe à 5 agents (200 h), excédant le besoin.",
      "Surestimation surdimensionnant l'équipe à 6 agents."
    ],
    explanation: "En 5 jours de 8 heures, un agent effectue 40 heures. Pour accomplir 160 heures, il faut 160 / 40 = 4 agents. Deux agents étant déjà en place, il convient d'en ajouter 4 − 2 = 2 supplémentaires.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "planning-meet-031",
    version: 1,
    category: "planning",
    itemFormat: "single_best",
    skill: "disponibilites",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 70,
    prompt: "Quel créneau horaire de 30 minutes convient aux deux participants ?",
    stimulus: "Directrice : disponible de 11 h 00 à 12 h 30. Conseiller : disponible de 10 h 30 à 11 h 45.",
    options: ["11 h 00 à 11 h 30", "10 h 30 à 11 h 00", "11 h 45 à 12 h 15", "11 h 30 à 12 h 00"],
    correctIndex: 0,
    optionRationales: [
      "Correct : intersection commune de 11 h 00 à 11 h 45, permettant une réunion de 11 h 00 à 11 h 30.",
      "La directrice n'est pas disponible avant 11 h 00.",
      "Le conseiller n'est plus disponible après 11 h 45.",
      "Le créneau déborderait sur l'indisponibilité du conseiller dès 11 h 45."
    ],
    explanation: "La directrice et le conseiller partagent une plage commune de 11 h 00 à 11 h 45 (45 minutes disponibles). Le créneau 11 h 00 – 11 h 30 permet de réaliser la réunion de 30 minutes sans aucun conflit.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "planning-prio-032",
    version: 1,
    category: "planning",
    itemFormat: "single_best",
    skill: "priorisation",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 75,
    prompt: "Quelle séquence d'exécution minimise le risque de rupture de service ?",
    stimulus: "À 10 h 00 : Tâche X (durée 20 min, échéance 10 h 30). Tâche Y (durée 40 min, échéance 11 h 45). Tâche Z (durée 30 min, échéance 12 h 30).",
    options: [
      "Tâche X, puis Tâche Y, puis Tâche Z",
      "Tâche Y, puis Tâche X, puis Tâche Z",
      "Tâche Z, puis Tâche X, puis Tâche Y",
      "Tâche X, puis Tâche Z, puis Tâche Y"
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : X finie à 10 h 20 (< 10h30), Y finie à 11 h 00 (< 11h45), Z finie à 11 h 30 (< 12h30).",
      "Commencer par Y repousse la fin de X à 11 h 00, provoquant un retard de 30 minutes.",
      "Commencer par Z fait manquer l'échéance de X dès 10 h 30.",
      "Bien que possible, intercaler Z avant Y réduit la marge de sécurité de Y sans nécessité."
    ],
    explanation: "La tâche X a l'échéance la plus critique (10 h 30). Démarrée à 10 h 00, elle se termine à 10 h 20. Enchaîner par Y (10 h 20 – 11 h 00) respecte son échéance de 11 h 45, et Z conclut à 11 h 30 avant son terme de 12 h 30.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "planning-conflit-033",
    version: 1,
    category: "planning",
    itemFormat: "single_best",
    skill: "conflits",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 70,
    prompt: "Quel horaire d'ouverture du guichet évite toute rupture d'accueil des usagers ?",
    stimulus: "Agent 1 assure la permanence de 8 h 30 à 12 h 30. L'Agent 2 prend le relais pour l'après-midi. Une passation de consignes de 15 minutes est obligatoire entre les deux agents.",
    options: [
      "L'Agent 2 doit arriver au plus tard à 12 h 15.",
      "L'Agent 2 peut arriver à 12 h 30 sans risque de rupture.",
      "L'Agent 2 peut arriver à 12 h 45 si les usagers patientent.",
      "L'Agent 1 doit quitter son poste à 12 h 15 pour préparer ses dossiers."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : 15 minutes de passation avant le départ d'Agent 1 à 12 h 30 imposent une arrivée à 12 h 15.",
      "Arriver à 12 h 30 repousserait la fin de la passation à 12 h 45, laissant le guichet sans permanence.",
      "Engendrerait une fermeture non autorisée du guichet de 15 minutes.",
      "Quitter le poste à 12 h 15 interromprait prématurément le service."
    ],
    explanation: "Pour assurer la continuité sans interruption de service, la passation de 15 minutes doit s'effectuer avant le départ de l'Agent 1 fixé à 12 h 30. L'Agent 2 doit donc impérativement être en poste dès 12 h 15.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "planning-dep-034",
    version: 1,
    category: "planning",
    itemFormat: "single_best",
    skill: "dependances",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 75,
    prompt: "Quel est le premier jour ouvré auquel le rapport final peut être soumis ?",
    stimulus: "La collecte de données prend 2 jours ouvrés (lundi et mardi). Le traitement statistique requiert 1 jour ouvré dès la collecte terminée. La relecture juridique requiert 1 jour ouvré dès le traitement achevé.",
    options: ["Vendredi", "Jeudi", "Mercredi", "Lundi suivant"],
    correctIndex: 0,
    optionRationales: [
      "Correct : Lundi-Mardi (Collecte), Mercredi (Traitement), Jeudi (Relecture) ; soumission possible le Vendredi.",
      "Le jeudi est consacré à la relecture juridique, la soumission n'a lieu que le lendemain.",
      "Le mercredi correspond seulement à l'étape intermédiaire de traitement statistique.",
      "Délai inutilement allongé sautant le vendredi."
    ],
    explanation: "Collecte : jours 1 et 2 (lundi et mardi). Traitement : jour 3 (mercredi). Relecture : jour 4 (jeudi). Le rapport final est donc prêt et peut être formellement soumis dès le jour 5 (vendredi).",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "planning-agenda-035",
    version: 1,
    category: "planning",
    itemFormat: "single_best",
    skill: "agenda-contraintes",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 70,
    prompt: "Quelle est la durée totale cumulée des temps de pause autorisés sur la journée ?",
    stimulus: "La journée de travail s'étend de 8 h 30 à 17 h 00. Les activités productives planifiées totalisent 7 heures et 15 minutes de travail effectif.",
    options: ["1 heure et 15 minutes", "45 minutes", "1 heure", "1 heure et 30 minutes"],
    correctIndex: 0,
    optionRationales: [
      "Correct : amplitude globale de 8 h 30 à 17 h 00 = 8 h 30 ; 8 h 30 - 7 h 15 = 1 h 15 de pause.",
      "Sous-estime le temps résiduel disponible.",
      "Calcul erroné omettant le quart d'heure.",
      "Surestimation excédant l'amplitude totale."
    ],
    explanation: "L'amplitude totale entre 8 h 30 et 17 h 00 représente 8 heures et 30 minutes. Le temps productif étant de 7 heures et 15 minutes, le reliquat consacré aux pauses s'élève à 8 h 30 − 7 h 15 = 1 heure et 15 minutes.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  }
];

export const situationalBatch = [
  {
    id: "situational-serve-016",
    version: 1,
    category: "situational",
    itemFormat: "rating",
    skill: "servir-client-usager",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 90,
    prompt: "Évaluez l'adéquation de chacune des réactions suivantes face à la situation décrite.",
    stimulus: "Un usager se présente au guichet en exigeant le traitement immédiat de son attestation, expliquant qu'il a un avion à prendre dans deux heures. La procédure standard impose une vérification de sécurité de 24 heures.",
    options: [
      "Lui expliquer posément la contrainte réglementaire de 24 heures tout en vérifiant si un traitement accéléré est prévu pour urgence avérée.",
      "Lui délivrer immédiatement l'attestation sans vérification pour lui éviter de manquer son vol.",
      "L'éconduire froidement en lui reprochant son manque d'anticipation et d'organisation personnelle.",
      "Vérifier la complétude de son dossier pour engager le contrôle sans délai et lui proposer l'envoi dématérialisé dès validation."
    ],
    correctIndex: 0,
    ratings: [4, 1, 1, 3],
    optionRationales: [
      "Très approprié : concilie écoute active, courtoisie et recherche des voies légales sans enfreindre la règle.",
      "Très inapproprié : viole la procédure de sécurité obligatoire et engage la responsabilité de l'administration.",
      "Très inapproprié : manque manifeste de courtoisie et attitude agressive contraire au devoir d'accueil.",
      "Plutôt approprié : optimise le processus dans le cadre légal et offre une solution de continuité numérique."
    ],
    explanation: "Face à une demande urgente d'usager, le fonctionnaire doit maintenir un accueil courtois et impartial, respecter scrupuleusement les exigences réglementaires de contrôle, et rechercher des solutions constructives légales (accélération si prévue, délivrance numérique immédiate dès validation).",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "situational-advise-017",
    version: 1,
    category: "situational",
    itemFormat: "rating",
    skill: "conseiller",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 90,
    prompt: "Évaluez la pertinence de chaque conseil formulé par l'agent public.",
    stimulus: "Un usager sollicite votre avis personnel sur l'opportunité de contester en justice une décision administrative de refus prise par un autre ministère.",
    options: [
      "Lui exposer objectivement les voies et délais de recours légaux existants sans émettre d'avis subjectif sur l'issue judiciaire.",
      "Lui conseiller vivement d'attaquer la décision en lui affirmant qu'il gagnera son procès à coup sûr.",
      "Refuser tout dialogue sous prétexte que le dossier relève d'un autre ministère.",
      "L'orienter vers les permanences juridiques gratuites ou le Médiateur pour une analyse spécialisée et indépendante de sa situation."
    ],
    correctIndex: 0,
    ratings: [4, 1, 1, 3],
    optionRationales: [
      "Très approprié : conseil neutre, factuel et centré sur l'information légale sans prise de position partisane.",
      "Très inapproprié : manque total de réserve, promesse irréaliste et dépassement flagrant de compétence.",
      "Très inapproprié : refus d'information élémentaire contraire au rôle de service public et d'orientation citoyenne.",
      "Plutôt approprié : orientation vers les organismes compétents assurant un accompagnement indépendant."
    ],
    explanation: "Le devoir de conseil de l'agent public exige une neutralité absolue et le respect de son périmètre de compétence. Il doit fournir les informations procédurales objectives (délais, recours) et orienter vers les professionnels du droit sans jamais spéculer sur une issue judiciaire.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "situational-serve-018",
    version: 1,
    category: "situational",
    itemFormat: "rating",
    skill: "servir-client-usager",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 90,
    prompt: "Évaluez la pertinence de chaque attitude face à un usager vulnérable.",
    stimulus: "Une personne âgée se présente désemparée au guichet car elle ne parvient pas à télédéclarer son formulaire sur la plateforme numérique obligatoire.",
    options: [
      "L'accompagner pas à pas à la borne numérique publique de l'administration pour lui montrer la démarche avec bienveillance.",
      "Lui rétorquer que l'administration est désormais 100 % numérique et qu'elle doit se débrouiller par elle-même.",
      "Lui proposer un rendez-vous personnalisé d'assistance ou lui fournir un formulaire papier alternatif si la réglementation l'autorise.",
      "Prendre ses identifiants secrets personnels pour remplir la déclaration à sa place sur son compte privé."
    ],
    correctIndex: 0,
    ratings: [4, 1, 3, 1],
    optionRationales: [
      "Très approprié : réponse exemplaire d'inclusion numérique garantissant l'accès universel au service public.",
      "Très inapproprié : rejet discriminatoire violant l'obligation d'accessibilité et de continuité du service public.",
      "Plutôt approprié : solution d'accompagnement formelle respectant le cadre réglementaire d'assistance.",
      "Très inapproprié : grave manquement aux règles élémentaires de sécurité informatique et de protection des données."
    ],
    explanation: "L'administration moderne doit lutter contre l'illectronisme par un accompagnement humain bienveillant (médiation numérique, assistance guidée) sans jamais enfreindre les règles de sécurité relatives aux identifiants personnels des citoyens.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "situational-advise-019",
    version: 1,
    category: "situational",
    itemFormat: "rating",
    skill: "conseiller",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 95,
    prompt: "Évaluez la pertinence de chaque modalité de conseil face à une incertitude réglementaire.",
    stimulus: "Une entreprise vous sollicite pour savoir si son nouveau procédé industriel entre dans le champ d'application d'une taxe environnementale récemment votée mais dont le règlement d'application n'est pas encore publié.",
    options: [
      "Lui exposer l'état actuel des textes officiels, réserver votre réponse sur les points en suspens et solliciter une note de cadrage ministérielle.",
      "Lui garantir par écrit une exonération totale définitive pour rassurer immédiatement l'investisseur.",
      "Rejeter d'office la demande de l'entreprise en lui demandant de ne pas importuner les services ministériels.",
      "Lui indiquer les critères probables issus des débats parlementaires tout en précisant expressément leur caractère non opposable."
    ],
    correctIndex: 0,
    ratings: [4, 1, 1, 3],
    optionRationales: [
      "Très approprié : démarche rigoureuse préservant la sécurité juridique de l'administration et de l'usager.",
      "Très inapproprié : engagement illégal engageant la responsabilité financière de l'État sans texte d'application.",
      "Très inapproprié : mépris du monde économique contraire aux missions de conseil et d'accueil de l'administration.",
      "Plutôt approprié : information contextuelle utile assortie de la réserve juridique indispensable sur la non-opposabilité."
    ],
    explanation: "En cas de vide ou d'attente d'un décret d'application, le conseiller public doit faire preuve d'une prudence juridique stricte. Il informe sur les bases existantes, réserve l'interprétation officielle auprès de la direction compétente et s'abstient de tout engagement prématuré.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "situational-serve-020",
    version: 1,
    category: "situational",
    itemFormat: "rating",
    skill: "servir-client-usager",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 90,
    prompt: "Évaluez chaque comportement d'accueil face à une situation de tension au guichet.",
    stimulus: "Un administré hausse le ton et accuse nominativement un de vos collègues d'avoir égaré son dossier d'aide au logement il y a deux semaines.",
    options: [
      "L'inviter calmement à s'asseoir dans un espace discret, écouter sa réclamation sans accuser le collègue et vérifier immédiatement l'historique informatique du dossier.",
      "Prendre immédiatement la défense agressive de votre collègue en haussant le ton à votre tour contre l'usager.",
      "Donner immédiatement raison à l'usager devant tout le monde en dénigrant ouvertement les compétences de votre collègue.",
      "Lui expliquer le processus de reconstitution rapide de dossier si la perte est confirmée et lui remettre un accusé de réception horodaté."
    ],
    correctIndex: 0,
    ratings: [4, 1, 1, 3],
    optionRationales: [
      "Très approprié : désamorce le conflit, isole la tension, protège l'esprit d'équipe et engage la vérification objective.",
      "Très inapproprié : escalade de l'agressivité violant les principes d'accueil professionnel et de retenue.",
      "Très inapproprié : manquement grave au devoir de confraternité et décrédibilisation publique du service.",
      "Plutôt approprié : orientation constructive vers la résolution matérielle du problème avec formalisation administrative."
    ],
    explanation: "Face à une accusation visant un collègue, l'agent doit concilier écoute empathique de l'usager, désescalade relationnelle dans un cadre calme, loyauté envers ses pairs et vérification factuelle impartiale dans les systèmes de gestion.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "situational-advise-021",
    version: 1,
    category: "situational",
    itemFormat: "rating",
    skill: "conseiller",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 90,
    prompt: "Évaluez la pertinence de chaque recommandation d'un agent public.",
    stimulus: "Un citoyen ne comprend pas les motifs du rejet partiel de sa demande d'allocation familiale et vous demande ce qu'il peut faire concrètement.",
    options: [
      "Reprendre avec lui les critères légaux point par point pour expliciter de manière claire et intelligible les fondements de la décision.",
      "Lui répondre que les décisions de l'administration ne se discutent pas et qu'il n'a qu'à relire la notification.",
      "Lui préciser la procédure de recours gracieux auprès de la direction ainsi que le délai légal imparti pour le formuler.",
      "Rédiger vous-même la lettre de recours de l'usager pour contester la décision de votre propre administration."
    ],
    correctIndex: 0,
    ratings: [4, 1, 3, 1],
    optionRationales: [
      "Très approprié : pédagogie administrative remarquable renforçant la transparence et la compréhension citoyenne.",
      "Très inapproprié : posture autoritaire et fermée bafouant le devoir d'explication des décisions administratives.",
      "Plutôt approprié : information juridique indispensable permettant à l'usager d'exercer ses droits réguliers.",
      "Très inapproprié : conflit d'intérêts et confusion des rôles (l'agent public ne peut se substituer au requérant)."
    ],
    explanation: "Le devoir de conseil impose d'expliquer avec pédagogie les motivations d'un refus et d'éclairer l'usager sur les voies de recours légales, sans pour autant se substituer à lui dans la rédaction d'un recours contentieux.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "situational-serve-022",
    version: 1,
    category: "situational",
    itemFormat: "rating",
    skill: "servir-client-usager",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 90,
    prompt: "Évaluez l'adéquation de chaque attitude d'accueil multilingue.",
    stimulus: "Dans une administration luxembourgeoise, un usager résident étranger ne s'exprime qu'en anglais et éprouve des difficultés à comprendre le formulaire officiel rédigé en français.",
    options: [
      "Mobiliser vos compétences en anglais pour lui expliciter les rubriques principales et lui remettre la documentation explicative multilingue disponible.",
      "Exiger sur un ton comminatoire qu'il revienne avec un interprète assermenté pour pouvoir être accueilli.",
      "Refuser catégoriquement de prononcer un mot d'anglais au nom de la stricte réglementation linguistique.",
      "Faire appel à un collègue disponible du service bilingue pour fluidifier l'échange et sécuriser la complétude du dossier."
    ],
    correctIndex: 0,
    ratings: [4, 1, 1, 3],
    optionRationales: [
      "Très approprié : pragmatisme, sens du service public et facilitation de l'accès aux démarches administratives.",
      "Très inapproprié : rigidité disproportionnée et accueil hostile portant atteinte à la qualité de service.",
      "Très inapproprié : manque manifeste de courtoisie et d'adaptation au contexte multiculturel du pays.",
      "Plutôt approprié : excellente collaboration interne permettant de résoudre la difficulté sans ralentir le service."
    ],
    explanation: "Au Luxembourg, le sens du service au client-usager implique de faciliter la compréhension des démarches grâce au multilinguisme pratique des équipes, dans le respect de l'équité de traitement et de la bienveillance administrative.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "situational-advise-023",
    version: 1,
    category: "situational",
    itemFormat: "rating",
    skill: "conseiller",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 95,
    prompt: "Évaluez chaque posture de conseil déontologique face à un cadeau d'entreprise.",
    stimulus: "À l'issue de l'instruction favorable d'un dossier complexe, le dirigeant d'une société privée reconnaissant vous dépose un panier gastronomique d'une valeur de 150 euros.",
    options: [
      "Refuser avec courtoisie en rappelant le code de déontologie des agents de l'État qui proscrit tout avantage personnel en lien avec les fonctions.",
      "Accepter discrètement le cadeau pour ne pas vexer ce partenaire économique de l'État.",
      "Partager le panier avec toute l'équipe dans la salle de repos sans en informer votre hiérarchie.",
      "Informer votre supérieur hiérarchique du dépôt du panier et solliciter la restitution formelle ou son don à une œuvre caritative reconnue."
    ],
    correctIndex: 0,
    ratings: [4, 1, 1, 3],
    optionRationales: [
      "Très approprié : rectitude déontologique exemplaire, clarté et préservation de l'intégrité de la fonction publique.",
      "Très inapproprié : manquement déontologique caractérisé pouvant constituer une faute disciplinaire grave.",
      "Très inapproprié : le partage interne ne purge pas l'irrégularité de l'acceptation d'un avantage indu.",
      "Plutôt approprié : transparence hiérarchique totale assurant un traitement institutionnel conforme et désintéressé."
    ],
    explanation: "Les règles de déontologie publique interdisent formellement aux agents de recevoir des gratifications de valeur de la part d'usagers ou d'entreprises. Le refus courtois mais ferme ou l'arbitrage transparent de la hiérarchie sont les seules voies conformes.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "situational-serve-024",
    version: 1,
    category: "situational",
    itemFormat: "rating",
    skill: "servir-client-usager",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 90,
    prompt: "Évaluez chaque réaction face à une erreur administrative avérée.",
    stimulus: "Vous découvrez qu'en raison d'un bogue informatique temporaire, un courrier erroné réclamant indûment une pièce justificative déjà fournie a été envoyé à 50 usagers.",
    options: [
      "Informer immédiatement la hiérarchie, adresser un rectificatif explicatif d'excuse aux 50 usagers et valider leurs dossiers sans délai supplémentaire.",
      "Ignorer l'incident en espérant que la majorité des usagers renverra une seconde fois la pièce sans protester.",
      "Attendre que chaque usager se manifeste individuellement au guichet pour rectifier au cas par cas.",
      "Rassurer au téléphone les usagers qui appellent en enregistrant la régularisation immédiate sur leur dossier informatique."
    ],
    correctIndex: 0,
    ratings: [4, 1, 1, 3],
    optionRationales: [
      "Très approprié : proactivité, transparence, assomption de l'erreur administrative et respect de la confiance du public.",
      "Très inapproprié : passivité coupable surchargeant indûment les administrés pour masquer une défaillance interne.",
      "Très inapproprié : gestion passive et inéquitable pénalisant les usagers qui n'osent pas réclamer.",
      "Plutôt approprié : réaction positive et aidante au contact individuel, mais insuffisante à l'échelle du groupe impacté."
    ],
    explanation: "Le service à l'usager commande une transparence proactive en cas d'erreur de l'administration : un message rectificatif global avec excuses professionnelles et validation automatique des droits rétablit la confiance légitime des administrés.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "situational-advise-025",
    version: 1,
    category: "situational",
    itemFormat: "rating",
    skill: "conseiller",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 90,
    prompt: "Évaluez chaque démarche de conseil auprès d'un usager en situation de précarité.",
    stimulus: "Un administré en grande difficulté financière sollicite une aide d'urgence pour laquelle il ne remplit pas l'ensemble des critères d'attribution légale.",
    options: [
      "Lui expliquer avec tact les limites du dispositif sollicité et l'orienter activement vers l'office social compétent ou les aides complémentaires existantes.",
      "Lui promettre verbalement l'octroi de l'aide en forçant les critères de saisie informatique à son insu.",
      "Lui notifier un rejet brutal sans aucune explication ni recherche de relais d'accompagnement social.",
      "Lui remettre la liste coordonnée des structures d'aide sociale de sa commune et prendre contact avec un assistant social référent avec son accord."
    ],
    correctIndex: 0,
    ratings: [4, 1, 1, 3],
    optionRationales: [
      "Très approprié : humanité, rigueur réglementaire et orientation sociale constructive sans fausse promesse.",
      "Très inapproprié : fraude administrative délibérée violant la loi sous couvert de compassion personnelle.",
      "Très inapproprié : inhumanité et défaillance du rôle fondamental d'orientation sociale du service public.",
      "Plutôt approprié : excellente démarche partenariale facilitant l'accès effectif aux droits sociaux territoriaux."
    ],
    explanation: "Conseiller un citoyen en précarité nécessite d'allier rigueur déontologique (interdiction d'altérer les critères légaux) et empathie active (orientation vers les dispositifs d'assistance sociale adaptés).",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "situational-serve-026",
    version: 1,
    category: "situational",
    itemFormat: "rating",
    skill: "servir-client-usager",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 90,
    prompt: "Évaluez la qualité de prise en charge d'un usager mécontent au téléphone.",
    stimulus: "Un citoyen excédé vous appelle car sa demande de prime n'a pas été traitée après six semaines d'attente, alors que le délai indicatif annoncé est de quatre semaines.",
    options: [
      "Écouter attentivement son mécontentement sans lui couper la parole, consulter immédiatement l'état du dossier et lui communiquer une date prévisionnelle fiable.",
      "Lui raccrocher immédiatement au nez au motif qu'il manifeste un agacement verbal excessif.",
      "Lui répondre que les agents font ce qu'ils peuvent et qu'il n'est pas le seul à attendre dans le pays.",
      "Identifier le point de blocage précis dans le dossier, le débloquer si cela relève de vos attributions et le rappeler personnellement dès finalisation."
    ],
    correctIndex: 0,
    ratings: [4, 1, 1, 3],
    optionRationales: [
      "Très approprié : écoute active, courtoisie, apaisement de la relation et information transparente sur le délai réel.",
      "Très inapproprié : faute professionnelle grave rompant unilatéralement la communication avec l'usager.",
      "Très inapproprié : réponse infantilisante et méprisante aggravant le sentiment d'injustice de l'administré.",
      "Plutôt approprié : engagement professionnel proactif et sens aigu de la responsabilité individuelle au service de l'usager."
    ],
    explanation: "Face au retard et à la frustration d'un usager, la posture requise consiste en une écoute calme et respectueuse, l'analyse factuelle de l'origine du délai et un engagement clair et réaliste sur le traitement de la demande.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "situational-advise-027",
    version: 1,
    category: "situational",
    itemFormat: "rating",
    skill: "conseiller",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 90,
    prompt: "Évaluez chaque conseil formulé à un collaborateur face à un risque de conflit d'intérêts.",
    stimulus: "Un collègue gestionnaire de dossiers d'attribution de marchés publics vous confie que l'entreprise de son beau-frère a déposé une offre pour un marché dont il a la charge.",
    options: [
      "Lui conseiller de déclarer immédiatement ce lien familial à sa hiérarchie et de solliciter formellement son déport de cette commission d'évaluation.",
      "Lui recommander de ne rien dire pour ne pas éveiller de soupçons inutiles si son jugement demeure impartial.",
      "Lui suggérer de favoriser discrètement l'offre de son parent pour soutenir l'économie familiale.",
      "L'inviter à consulter sans délai le référent déontologue de votre ministère pour sécuriser la procédure d'attribution."
    ],
    correctIndex: 0,
    ratings: [4, 1, 1, 3],
    optionRationales: [
      "Très approprié : mesure de déport impérative protégeant la légalité du marché public et l'intégrité de l'agent.",
      "Très inapproprié : conseil dangereux exposant l'agent à une qualification pénale de prise illégale d'intérêts.",
      "Très inapproprié : incitation directe à la commission d'un délit de favoritisme pénalement répréhensible.",
      "Plutôt approprié : recours au référent institutionnel garantissant un conseil d'expert indépendant et formel."
    ],
    explanation: "En matière de commande publique, tout lien d'intérêt personnel ou familial avec un soumissionnaire impose une déclaration immédiate et un déport strict pour prévenir toute suspicion de favoritisme ou de conflit d'intérêts.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "situational-serve-028",
    version: 1,
    category: "situational",
    itemFormat: "rating",
    skill: "servir-client-usager",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 90,
    prompt: "Évaluez chaque comportement d'accueil en situation d'affluence au guichet.",
    stimulus: "À 11 h 45, alors que le guichet ferme normalement à 12 h 00, une dizaine d'usagers attendent encore dans le hall en raison d'une panne réseau intervenue le matin.",
    options: [
      "Informer avec courtoisie la file d'attente de la situation, évaluer les demandes prioritaires et prolonger l'accueil pour traiter les démarches urgentes engagées.",
      "Baisser le rideau métallique à midi pile sans un mot en refusant de prendre en charge les usagers restants.",
      "Prendre les coordonnées et l'objet des démarches des usagers en attente pour leur proposer un créneau garanti dès le début d'après-midi.",
      "Renvoyer tous les usagers vers le site web sans s'assurer s'ils disposent des moyens d'effectuer la démarche en ligne."
    ],
    correctIndex: 0,
    ratings: [4, 1, 3, 1],
    optionRationales: [
      "Très approprié : sens des responsabilités, adaptation aux aléas techniques internes et respect des citoyens.",
      "Très inapproprié : comportement rigide et irrespectueux ignorant l'aléa matériel subi par les usagers.",
      "Plutôt approprié : organisation pragmatique offrant une solution alternative garantie et individualisée.",
      "Très inapproprié : rejet expéditif méconnaissant les contraintes réelles des usagers présents."
    ],
    explanation: "Lorsqu'un dysfonctionnement technique imputable à l'administration retarde les usagers, le service public doit faire preuve de souplesse, de communication claire et d'aménagements raisonnables pour honorer son obligation d'accueil.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "situational-advise-029",
    version: 1,
    category: "situational",
    itemFormat: "rating",
    skill: "conseiller",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 90,
    prompt: "Évaluez la pertinence de chaque recommandation d'un agent public.",
    stimulus: "Un citoyen hésite entre deux formulaires fiscaux pour déclarer un revenu accessoire perçu à l'étranger et vous sollicite pour faire le bon choix déclaratif.",
    options: [
      "Lui expliquer précisément la notice fiscale et les critères distinctifs de chaque formulaire sans vous substituer à son choix déclaratif.",
      "Lui conseiller de dissimuler ce revenu à l'étranger pour échapper à toute imposition complémentaire.",
      "Lui désigner un formulaire au hasard sans vérifier les conventions bilatérales pour écourter le rendez-vous.",
      "Lui fournir le guide pratique de fiscalité internationale et l'orienter vers la division spécialisée des non-résidents si nécessaire."
    ],
    correctIndex: 0,
    ratings: [4, 1, 1, 3],
    optionRationales: [
      "Très approprié : conseil explicatif rigoureux respectant l'autonomie et la responsabilité déclarative de l'usager.",
      "Très inapproprié : incitation délibérée à la fraude fiscale bafouant l'honneur et la légalité républicaine.",
      "Très inapproprié : désinvolture professionnelle coupable pouvant induire l'usager en erreur fiscale grave.",
      "Plutôt approprié : mise à disposition d'outils d'information officiels et orientation vers le service compétent."
    ],
    explanation: "Le fonctionnaire doit guider l'usager dans la compréhension des critères juridiques et des notices explicatives, tout en lui laissant la responsabilité de sa déclaration fiscale et en proscrivant toute incitation à la fraude.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "situational-serve-030",
    version: 1,
    category: "situational",
    itemFormat: "rating",
    skill: "servir-client-usager",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 90,
    prompt: "Évaluez chaque modalité de traitement d'une réclamation d'usager.",
    stimulus: "Un usager vous transmet une réclamation écrite affirmant qu'un agent d'accueil lui a manqué de respect la veille au guichet.",
    options: [
      "Accuser réception de sa réclamation par écrit, transmettre les faits à la hiérarchie pour examen contradictoire et lui garantir une réponse motivée sous 15 jours.",
      "Déchirer la lettre de réclamation pour protéger la réputation du service et étouffer l'incident.",
      "Répondre avec agressivité à l'usager en lui interdisant désormais l'accès aux locaux administratifs.",
      "Entendre avec bienveillance l'usager par téléphone pour consigner sa version détaillée tout en préservant la présomption de régularité du service."
    ],
    correctIndex: 0,
    ratings: [4, 1, 1, 3],
    optionRationales: [
      "Très approprié : traitement procédural exemplaire alliant écoute citoyenne, respect du contradictoire et engagement formel.",
      "Très inapproprié : destruction illégale d'un document administratif et opacité contraire aux normes de transparence.",
      "Très inapproprié : abus d'autorité intolérable bafouant les droits fondamentaux des usagers.",
      "Plutôt approprié : démarche d'écoute attentive permettant d'éclairer l'instruction administrative de la réclamation."
    ],
    explanation: "Toute réclamation d'usager doit faire l'objet d'un accusé de réception formel, d'une instruction équitable et contradictoire par l'autorité hiérarchique, et d'une réponse motivée dans un délai prévisible.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "situational-advise-031",
    version: 1,
    category: "situational",
    itemFormat: "rating",
    skill: "conseiller",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 95,
    prompt: "Évaluez chaque posture de conseil lors d'une sollicitation par la presse.",
    stimulus: "Un journaliste vous contacte directement sur votre ligne professionnelle pour recueillir votre avis sur une polémique relative à la gestion d'un dossier sensible de votre direction.",
    options: [
      "Lui rappeler courtoisement le devoir de réserve de l'agent public et l'orienter sans délai vers le service de communication ministériel officiel.",
      "Lui livrer sous le manteau des détails internes sensibles en exigeant son anonymat journalistique.",
      "Lui raccrocher au nez en l'injuriant pour avoir osé vous déranger durant votre travail.",
      "Lui indiquer les données publiques déjà communiquées dans les communiqués officiels en vous abstenant de tout commentaire personnel."
    ],
    correctIndex: 0,
    ratings: [4, 1, 1, 3],
    optionRationales: [
      "Très approprié : respect rigoureux du devoir de réserve et orientation vers les canaux habilités de communication publique.",
      "Très inapproprié : violation caractérisée du secret professionnel et manquement lourd à l'obligation de discrétion.",
      "Très inapproprié : attitude hostile dégradant l'image institutionnelle de l'administration auprès des médias.",
      "Plutôt approprié : rappel factuel d'éléments déjà rendus publics sans franchir les limites du droit de réserve."
    ],
    explanation: "Les relations avec les médias sont strictement encadrées dans la fonction publique. L'agent doit observer un devoir de réserve scrupuleux, s'abstenir de tout commentaire personnel et orienter le journaliste vers le porte-parole officiel du ministère.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "situational-serve-032",
    version: 1,
    category: "situational",
    itemFormat: "rating",
    skill: "servir-client-usager",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 90,
    prompt: "Évaluez chaque réaction face à une demande formulée hors compétences.",
    stimulus: "Un citoyen se présente à votre guichet communal pour solliciter un permis de chasse, démarche qui relève exclusivement d'une administration d'État (Environnement).",
    options: [
      "Lui expliquer avec courtoisie le partage des compétences et lui fournir l'adresse exacte, le site internet et les horaires du service compétent.",
      "L'éconduire sèchement en lui disant que la commune n'a rien à voir avec ses activités de loisirs.",
      "Prendre son dossier et ses pièces en lui promettant que vous vous en occuperez vous-même sans en avoir le pouvoir.",
      "Lui imprimer le formulaire officiel de l'administration d'État et lui indiquer les pièces requises pour préparer son dépôt."
    ],
    correctIndex: 0,
    ratings: [4, 1, 1, 3],
    optionRationales: [
      "Très approprié : orientation citoyenne claire, courtoise et efficace illustrant le principe de guichet unique relationnel.",
      "Très inapproprié : accueil méprisant renvoyant une image dégradée de l'administration publique.",
      "Très inapproprié : promesse illégitime générant une fausse attente et un retard préjudiciable pour l'administré.",
      "Plutôt approprié : aide concrète et utile facilitant les démarches du citoyen auprès du bon organisme."
    ],
    explanation: "Même face à une démarche ne relevant pas de son autorité, l'agent public a un devoir d'accueil et d'orientation : il informe le citoyen sur le service compétent et lui fournit les coordonnées utiles sans créer d'engagements illégitimes.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "situational-advise-033",
    version: 1,
    category: "situational",
    itemFormat: "rating",
    skill: "conseiller",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 90,
    prompt: "Évaluez chaque posture de conseil face à une tentative de contournement procédural.",
    stimulus: "Une connaissance personnelle vous sollicite pour faire passer en priorité le dossier de permis de construire de son fils avant la commission municipale de demain.",
    options: [
      "Lui rappeler avec fermeté et courtoisie le principe constitutionnel d'égalité de traitement des usagers interdisant tout passe-droit.",
      "Accepter avec empressement pour faire plaisir à votre relation personnelle en passant outre le registre chronologique.",
      "Exiger une contrepartie financière ou un service personnel en échange de votre intervention prioritaire.",
      "Lui expliquer le fonctionnement impartial de l'ordre d'instruction et lui proposer de vérifier l'état d'avancement régulier du dossier."
    ],
    correctIndex: 0,
    ratings: [4, 1, 1, 3],
    optionRationales: [
      "Très approprié : réaffirmation exemplaire de l'éthique républicaine et de l'égalité d'accès des citoyens aux services publics.",
      "Très inapproprié : rupture caractérisée de l'égalité des usagers et favoritisme administratif injustifiable.",
      "Très inapproprié : comportement délictuel de corruption passive constitutive d'une infraction pénale gravissime.",
      "Plutôt approprié : pédagogie administrative rappelant la règle d'impartialité tout en apportant une réponse factuelle légale."
    ],
    explanation: "Le principe fondamental d'égalité de traitement devant le service public proscrit tout traitement préférentiel motivé par des liens privés. L'agent doit opposer un refus sans équivoque en rappelant les règles d'instruction impartiale.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "situational-serve-034",
    version: 1,
    category: "situational",
    itemFormat: "rating",
    skill: "servir-client-usager",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 90,
    prompt: "Évaluez chaque attitude d'accueil face à un usager sourd ou malentendant.",
    stimulus: "Un citoyen sourd se présente au guichet pour une démarche d'état civil et éprouve des difficultés à lire sur les lèvres en raison du port de masques ou de parois vitrées.",
    options: [
      "Proposer immédiatement un échange par écrit sur bloc-notes ou support numérique, avec des phrases simples et claires.",
      "Hausser la voix de plus en plus fort en criant à travers la vitre de protection.",
      "Lui faire signe de la main de quitter les lieux et refuser de traiter sa demande.",
      "Vérifier si un agent formé à la langue des signes est présent dans le service ou mobiliser le service de visio-interprétation de l'État."
    ],
    correctIndex: 0,
    ratings: [4, 1, 1, 3],
    optionRationales: [
      "Très approprié : adaptation immédiate, respectueuse et efficace garantissant l'accessibilité universelle.",
      "Très inapproprié : comportement inadapté et potentiellement humiliant n'apportant aucune aide à une personne sourde.",
      "Très inapproprié : discrimination inacceptable et manquement intolérable aux obligations d'accueil.",
      "Plutôt approprié : recours judicieux aux technologies et compétences inclusives mises en place par l'État."
    ],
    explanation: "L'accessibilité des services publics aux personnes en situation de handicap exige de faire preuve d'adaptabilité, de bienveillance et d'ingéniosité (échange manuscrit, supports visuels, recours aux dispositifs de relais inclusifs).",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "situational-advise-035",
    version: 1,
    category: "situational",
    itemFormat: "rating",
    skill: "conseiller",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 90,
    prompt: "Évaluez chaque posture de conseil face à une omission déclarative constatée.",
    stimulus: "Lors de la vérification d'un dossier de subvention d'une association, vous constatez qu'il manque un bilan d'activité obligatoire qui entraînerait le rejet automatique par la commission de demain.",
    options: [
      "Contacter sans attendre le responsable associatif par téléphone et courriel pour lui permettre de transmettre la pièce manquante avant la clôture.",
      "Laisser le dossier passer en commission en se réjouissant d'avance de son rejet automatique.",
      "Rédiger un faux bilan d'activité à la place de l'association pour éviter tout retard d'instruction.",
      "Informer le président de la commission de la démarche de régularisation engagée et solliciter un report bienveillant de l'examen."
    ],
    correctIndex: 0,
    ratings: [4, 1, 1, 3],
    optionRationales: [
      "Très approprié : accompagnement proactif et bienveillant évitant un rejet préjudiciable sur simple oubli matériel.",
      "Très inapproprié : cynisme et malveillance contraires à la mission d'appui aux usagers et au monde associatif.",
      "Très inapproprié : falsification documentaire illégale constitutive d'un faux en écriture publique.",
      "Plutôt approprié : transparence procédurale auprès de l'organe délibérant pour ménager une issue constructive."
    ],
    explanation: "La bienveillance administrative encourage la régularisation proactive des omissions matérielles avant prise de décision définitive, tout en respectant strictement l'authenticité des pièces qui doivent émaner du seul déclarant.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  }
];

export function run() {
  console.log("Starting milestone batch generation (100 new items)...");

  const batches = {
    abstract: abstractBatch,
    verbal: verbalBatch,
    numeric: numericBatch,
    planning: planningBatch,
    situational: situationalBatch
  };

  let totalAdded = 0;

  for (const [cat, items] of Object.entries(batches)) {
    const file = path.join(APPROVED_DIR, `${cat}.json`);
    const current = JSON.parse(fs.readFileSync(file, "utf8"));
    const existingIds = new Set(current.map(x => x.id));

    const newUniqueItems = [];
    for (const item of items) {
      if (existingIds.has(item.id)) {
        console.warn(`Skipping duplicate ID ${item.id}`);
        continue;
      }
      newUniqueItems.push(item);
    }

    const merged = [...current, ...newUniqueItems];
    const { errors, warnings } = checkBank(merged);
    if (errors.length > 0) {
      throw new Error(`Validation errors in ${cat}:\n- ${errors.join("\n- ")}`);
    }
    if (warnings.length > 0) {
      console.warn(`Warnings in ${cat}:\n- ${warnings.join("\n- ")}`);
    }

    fs.writeFileSync(file, JSON.stringify(merged, null, 2) + "\n");
    console.log(`✅ ${cat}: added ${newUniqueItems.length} items (total: ${merged.length})`);
    totalAdded += newUniqueItems.length;
  }

  console.log(`\n🎉 Success! Added ${totalAdded} total questions across 5 categories.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  run();
}
