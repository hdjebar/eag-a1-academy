/**
 * Batch 3: Abstract Reasoning items 066 to 100 (35 items)
 * Skills: suite-logique, matrice, rotation, transformation
 */

const NOW = new Date().toISOString();
const REVIEWER = "hdjebar";

export const abstractBatch3 = [
  {
    id: "abstract-symb-066",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "suite-logique",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 60,
    prompt: "Quel symbole complète logiquement cette suite croissante de disques ?",
    stimulus: {
      type: "shapes",
      text: "○  ●  ○○  ●●  ○○○  ●●●  ????"
    },
    options: ["○○○○", "●●●●", "○○○", "●●●"],
    correctIndex: 0,
    optionRationales: [
      "Correct : alternance de blancs et noirs avec incrément d'un élément à chaque cycle (1, 2, 3 puis 4 cercles blancs).",
      "Quatre disques noirs suivront le groupe de 4 cercles blancs.",
      "Trois cercles blancs répètent le cycle précédent.",
      "Trois disques noirs viennent de s'achever."
    ],
    explanation: "La séquence alterne cercles blancs et disques noirs en augmentant leur quantité de 1 à chaque passage : 1 blanc, 1 noir, 2 blancs, 2 noirs, 3 blancs, 3 noirs, donc 4 blancs (○○○○).",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-mat-067",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "matrice",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 70,
    prompt: "Quelle figure complète la case manquante de la matrice 3×3 ?",
    stimulus: {
      type: "shapes",
      text: "△   ▲   ◬\n□   ■   回\n○   ●   ?"
    },
    options: ["◎", "○", "●", "◈"],
    correctIndex: 0,
    optionRationales: [
      "Correct : chaque ligne associe une forme vide, une forme pleine et une forme concentrique.",
      "Le cercle simple vide est déjà présent en première colonne.",
      "Le disque plein est déjà présent en deuxième colonne.",
      "Le losange n'appartient pas à la famille des cercles de cette troisième ligne."
    ],
    explanation: "Chaque ligne suit la même transformation : figure vide (colonne 1), figure pleine (colonne 2), figure concentrique (colonne 3). En ligne 3, le cercle concentrique est ◎.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-rot-068",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "rotation",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 60,
    prompt: "Quelle orientation prend la flèche après une rotation de 135° dans le sens horaire depuis le Nord ?",
    stimulus: {
      type: "shapes",
      text: "Position initiale : Nord (↑)."
    },
    options: ["Sud-Est (↘)", "Est (→)", "Sud (↓)", "Nord-Est (↗)"],
    correctIndex: 0,
    optionRationales: [
      "Correct : Nord (0°) + 135° horaires = Sud-Est (135°).",
      "Est correspond à une rotation de 90°.",
      "Sud correspond à une rotation de 180°.",
      "Nord-Est correspond à une rotation de 45°."
    ],
    explanation: "Une rotation de 135° horaires déplace la flèche de 90° (vers l'Est) puis de 45° supplémentaires, atteignant le Sud-Est (↘).",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-trf-069",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "transformation",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 65,
    prompt: "Quelle figure résulte de la combinaison logique des deux motifs ?",
    stimulus: {
      type: "shapes",
      text: "Motif 1 : Carré extérieur\nMotif 2 : Croix inscrite (+)\nRésultat combiné : ?"
    },
    options: ["⊞", "⊡", "⊠", "⊟"],
    correctIndex: 0,
    optionRationales: [
      "Correct : un carré contenant une croix droite régulière (+).",
      "Le symbole ⊡ contient un point central et non une croix.",
      "Le symbole ⊠ contient une croix de saint André diagonale (X).",
      "Le symbole ⊟ ne contient qu'une seule barre horizontale."
    ],
    explanation: "La combinaison superpose le contour carré et la croix droite inscrite, formant le glyphe ⊞.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-seq-070",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "suite-logique",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 75,
    prompt: "Quel nombre de sommets correspond à la figure complétant la suite ?",
    stimulus: {
      type: "shapes",
      text: "Triangle (3)  →  Carré (4)  →  Hexagone (6)  →  Ennéagone (9)  →  ?"
    },
    options: ["13 sommets", "12 sommets", "11 sommets", "10 sommets"],
    correctIndex: 0,
    optionRationales: [
      "Correct : progression des écarts (+1, +2, +3, +4). 9 + 4 = 13 sommets.",
      "12 sommets correspondrait à une progression arithmétique de pas +3.",
      "11 sommets correspondrait à une suite impaire.",
      "10 sommets n'ajoute que 1 sommet au lieu de 4."
    ],
    explanation: "Les différences successives entre les nombres de sommets augmentent de 1 à chaque pas : 4 - 3 = 1 ; 6 - 4 = 2 ; 9 - 6 = 3 ; la suite exige donc 9 + 4 = 13 sommets.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-mat-071",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "matrice",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 75,
    prompt: "Quelle figure complète la 3e colonne selon la règle de soustraction géométrique ?",
    stimulus: {
      type: "shapes",
      text: "Case 1 : Carré avec disque inscrit (回)\nCase 2 : Disque seul (●)\nCase 3 (Case 1 privée de Case 2) : ?"
    },
    options: ["□ (Carré évidé)", "● (Disque plein)", "■ (Carré plein)", "○ (Cercle évidé)"],
    correctIndex: 0,
    optionRationales: [
      "Correct : en retirant le disque central de la figure composite, il ne reste que le carré extérieur.",
      "Le disque correspond à l'élément soustrait.",
      "Le carré plein n'est pas le contour original.",
      "Le cercle évidé n'est pas le contour extérieur de la case 1."
    ],
    explanation: "La règle horizontale est la soustraction géométrique : Motif composite - Motif central = Motif extérieur résiduel (carré évidé □).",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-rot-072",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "rotation",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 65,
    prompt: "Quelle figure correspond à une rotation de 90° dans le sens anti-horaire du symbole 'T' ?",
    stimulus: {
      type: "shapes",
      text: "Symbole de départ : T (barre horizontale en haut, barre verticale vers le bas)."
    },
    options: ["⊣ (barre à droite)", "⊢ (barre à gauche)", "⊥ (barre en bas)", "T (barre en haut)"],
    correctIndex: 0,
    optionRationales: [
      "Correct : en tournant de 90° vers la gauche (anti-horaire), la barre supérieure devient verticale à droite et la jambe pointe vers la gauche.",
      "Le symbole ⊢ correspond à une rotation horaire de 90°.",
      "Le symbole ⊥ correspond à une rotation de 180°.",
      "Le symbole T correspond à une rotation de 360° (invariable)."
    ],
    explanation: "Une rotation de 90° dans le sens anti-horaire bascule le chapeau du 'T' de l'horizontale haute à la verticale droite (glyphe ⊣).",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-trf-073",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "transformation",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 60,
    prompt: "Quelle figure conserve son invariance par réflexion selon un axe horizontal central ?",
    stimulus: {
      type: "shapes",
      text: "Lettres majuscules candidates : B, C, H, K."
    },
    options: ["H", "A", "M", "V"],
    correctIndex: 0,
    optionRationales: [
      "Correct : la lettre H possède un axe de symétrie horizontal parfait passant par sa barre centrale.",
      "La lettre A possède un axe vertical, mais pas d'axe horizontal.",
      "La lettre M possède un axe de symétrie vertical.",
      "La lettre V possède un axe de symétrie vertical."
    ],
    explanation: "La réflexion selon un axe horizontal échange le haut et le bas. Seule la lettre H est strictement identique à son reflet horizontal.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-seq-074",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "suite-logique",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 70,
    prompt: "Quel symbole continue la série d'angles d'ouverture croissants ?",
    stimulus: {
      type: "shapes",
      text: "Tiret horizontal (-)  →  Angle aigu (<)  →  Angle droit (∟)  →  Angle obtus  →  ?"
    },
    options: ["Angle plat (180°)", "Angle nul (0°)", "Angle droit (90°)", "Angle aigu (<90°)"],
    correctIndex: 0,
    optionRationales: [
      "Correct : progression de 0° à 180° (aigu, droit 90°, obtus >90°, plat 180°).",
      "L'angle nul correspondrait à un retour au point de départ.",
      "L'angle droit inversé répète l'étape de 90°.",
      "L'angle aigu fermé correspond à une régression."
    ],
    explanation: "La série décrit l'ouverture géométrique d'un angle : 0° (segment confondu), aigu (<90°), droit (90°), obtus (entre 90° et 180°), puis angle plat (180° formant une ligne droite).",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-mat-075",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "matrice",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 75,
    prompt: "Quelle case complète la dernière colonne de la matrice ?",
    stimulus: {
      type: "shapes",
      text: "●○○   ○●○   ○○●\n■□□   □■□   □□■\n▲△△   △▲△   ?"
    },
    options: ["△△▲", "▲▲△", "△▲△", "▲△△"],
    correctIndex: 0,
    optionRationales: [
      "Correct : l'élément plein se déplace de la position 1 à 2 puis à 3 sur chaque ligne.",
      "Deux triangles pleins brisent la règle du symbole plein unique.",
      "Répète la position centrale déjà vue en deuxième colonne.",
      "Répète la première position de la première colonne."
    ],
    explanation: "Sur chaque ligne, le motif plein glisse d'une case vers la droite : position 1 (gauche), position 2 (centre), position 3 (droite). En bas à droite, le triangle plein est en 3e position (△△▲).",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-rot-076",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "rotation",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 60,
    prompt: "Après avoir tourné de 270° dans le sens anti-horaire, quelle position prend un curseur parti du Nord ?",
    stimulus: {
      type: "shapes",
      text: "Position initiale : Nord (12h00). Rotation : 270° anti-horaire."
    },
    options: ["Est (03h00)", "Ouest (09h00)", "Sud (06h00)", "Nord (12h00)"],
    correctIndex: 0,
    optionRationales: [
      "Correct : tourner de 270° dans le sens anti-horaire équivaut exactement à tourner de 90° dans le sens horaire (Est / 03h00).",
      "Ouest correspond à 90° anti-horaire.",
      "Sud correspond à 180°.",
      "Nord marquerait un tour complet de 360°."
    ],
    explanation: "Une rotation anti-horaire de 270° est équivalente à 360° - 270° = 90° dans le sens horaire. Depuis le Nord, l'aiguille pointe vers l'Est (3h00).",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-trf-077",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "transformation",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 80,
    prompt: "Sur une grille 3×3, un point noir situé au coin supérieur gauche (1, 1) avance de 2 cases en diagonale vers le Sud-Est. Où arrive-t-il ?",
    stimulus: {
      type: "shapes",
      text: "Grille 3×3 : Lignes 1 à 3 (haut vers bas), Colonnes 1 à 3 (gauche vers droite). Départ : (1, 1)."
    },
    options: ["Ligne 3, Colonne 3", "Ligne 2, Colonne 2", "Ligne 3, Colonne 1", "Ligne 1, Colonne 3"],
    correctIndex: 0,
    optionRationales: [
      "Correct : départ (1, 1) + 2 lignes vers le bas = 3, + 2 colonnes vers la droite = 3.",
      "La position (2, 2) correspond à un saut d'une seule case.",
      "La position (3, 1) correspond à un déplacement vertical pur vers le Sud.",
      "La position (1, 3) correspond à un déplacement horizontal pur vers l'Est."
    ],
    explanation: "La diagonale Sud-Est incrémente simultanément la ligne et la colonne : (1 + 2, 1 + 2) = (3, 3), soit le coin inférieur droit.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-seq-078",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "suite-logique",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 65,
    prompt: "Quel symbole vient clore la séquence d'inversion périodique ?",
    stimulus: {
      type: "shapes",
      text: "▲  ▼  ▲  ▼  ▲  ▼  ?"
    },
    options: ["▲", "▼", "◀", "▶"],
    correctIndex: 0,
    optionRationales: [
      "Correct : alternance stricte pointe haute / pointe basse ; le cycle repart sur pointe haute (▲).",
      "La pointe basse vient d'être achevée.",
      "La pointe gauche brise l'axe vertical de la série.",
      "La pointe droite brise l'axe vertical de la série."
    ],
    explanation: "Il s'agit d'une alternance binaire stricte entre triangle vers le haut et triangle vers le bas. Après le 6e terme (▼), le 7e terme est un triangle vers le haut (▲).",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-mat-079",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "matrice",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 75,
    prompt: "Quelle figure complète la 3e colonne de la matrice ?",
    stimulus: {
      type: "shapes",
      text: "1 trait vertical (|)    2 traits verticaux (||)    3 traits verticaux (|||)\n1 trait horizontal (-)  2 traits horizontaux (--)  3 traits horizontaux (---)\n1 croix (+)             2 croix (++)               ?"
    },
    options: ["3 croix (+++)", "4 croix (++++)", "2 croix (++)", "1 croix (+)"],
    correctIndex: 0,
    optionRationales: [
      "Correct : chaque ligne maintient son motif de base et compte 1, 2 puis 3 éléments par colonne.",
      "Quatre croix dépasserait la dimension de la matrice 3×3.",
      "Deux croix figure déjà en deuxième colonne.",
      "Une croix figure en première colonne."
    ],
    explanation: "La matrice suit une règle de multiplication de quantité par colonne : colonne 1 = 1 motif, colonne 2 = 2 motifs, colonne 3 = 3 motifs. En ligne 3, il faut donc 3 croix (+++).",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-rot-080",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "rotation",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 65,
    prompt: "Quelle position prend l'aiguille après 6 rotations consécutives de 90° dans le sens horaire depuis Midi ?",
    stimulus: {
      type: "shapes",
      text: "Départ à 12h00. 6 rotations de 90° horaires consécutives."
    },
    options: ["6h00 (Sud / Bas)", "12h00 (Nord / Haut)", "3h00 (Est / Droite)", "9h00 (Ouest / Gauche)"],
    correctIndex: 0,
    optionRationales: [
      "Correct : 6 × 90° = 540° = 360° (1 tour complet) + 180°, soit la position opposée à midi (6h00).",
      "Midi correspondrait à 4 ou 8 rotations (multiple de 360°).",
      "Trois heures correspondrait à 1 ou 5 rotations.",
      "Neuf heures correspondrait à 3 ou 7 rotations."
    ],
    explanation: "Six rotations de 90° totalisent 540°. En retirant un tour complet (360°), il reste 180°, ce qui place l'aiguille à l'opposé de sa position initiale, soit en bas à 6h00.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-trf-081",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "transformation",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 75,
    prompt: "Combien d'arêtes possède un tétraèdre régulier (pyramide à base triangulaire) ?",
    stimulus: {
      type: "shapes",
      text: "Solide platonicien régulier : tétraèdre (4 faces triangulaires, 4 sommets)."
    },
    options: ["6 arêtes", "4 arêtes", "8 arêtes", "12 arêtes"],
    correctIndex: 0,
    optionRationales: [
      "Correct : formule d'Euler Sommets (4) - Arêtes (A) + Faces (4) = 2 => A = 6 arêtes (3 à la base, 3 rejoignant le sommet).",
      "Quatre correspond au nombre de faces ou de sommets.",
      "Huit correspond au nombre d'arêtes d'une pyramide à base carrée.",
      "Douze correspond aux arêtes d'un cube ou d'un octaèdre."
    ],
    explanation: "Un tétraèdre régulier compte 3 arêtes formant le triangle de base et 3 arêtes reliant chaque sommet de base à l'apex supérieur, soit 6 arêtes au total.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-seq-082",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "suite-logique",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 60,
    prompt: "Quel symbole complète la suite de barres inclinées alternées ?",
    stimulus: {
      type: "shapes",
      text: "/  \\  //  \\\\  ///  \\\\\\  ????"
    },
    options: ["////", "\\\\\\\\", "///", "\\\\\\"],
    correctIndex: 0,
    optionRationales: [
      "Correct : alternance de barres montantes (/) et descendantes (\\) avec incrément unitaire (1, 2, 3 puis 4 montantes).",
      "Quatre barres descendantes suivront le groupe de 4 barres montantes.",
      "Trois barres montantes répètent le cycle précédent.",
      "Trois barres descendantes viennent de se terminer."
    ],
    explanation: "La série alterne barres diagonales de droite à gauche et de gauche à droite en augmentant leur nombre à chaque alternance : 1, 2, 3, donc 4 barres montantes (////).",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-mat-083",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "matrice",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 75,
    prompt: "Quelle figure complète la 3e colonne selon la règle d'intersection géométrique ?",
    stimulus: {
      type: "shapes",
      text: "Ligne 1 : Cercle et Carré -> superposition\nLigne 2 : Triangle et Cercle -> superposition\nLigne 3 : Deux disques identiques superposés exactement -> ?"
    },
    options: ["Un disque unique confondu", "Deux disques séparés", "Un cercle vide", "Un carré"],
    correctIndex: 0,
    optionRationales: [
      "Correct : l'intersection ou superposition exacte de deux figures identiques produit la figure elle-même.",
      "Deux disques séparés briserait la règle de superposition.",
      "Un cercle vide modifierait le remplissage plein.",
      "Le carré modifierait la géométrie circulaire."
    ],
    explanation: "La superposition exacte de deux figures identiques dans le même repère est idempotente : elle donne la figure unique d'origine.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-rot-084",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "rotation",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 65,
    prompt: "Quelle figure correspond à la lettre 'C' après une rotation de 180° ?",
    stimulus: {
      type: "shapes",
      text: "Lettre de départ : C (ouverture orientée vers la droite)."
    },
    options: ["Ↄ (ouverture vers la gauche)", "C (invariable)", "U (ouverture vers le haut)", "∩ (ouverture vers le bas)"],
    correctIndex: 0,
    optionRationales: [
      "Correct : un demi-tour (180°) inverse la direction de l'ouverture, qui passe de droite à gauche.",
      "La lettre C non modifiée correspond à une rotation de 0° ou 360°.",
      "Le symbole U correspond à une rotation de 90° anti-horaire.",
      "Le symbole ∩ correspond à une rotation de 90° horaire."
    ],
    explanation: "Une rotation de 180° effectue une symétrie centrale : l'ouverture du 'C' située à droite pivote pour se retrouver à gauche (forme Ↄ).",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-trf-085",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "transformation",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 60,
    prompt: "Quelle figure plane régulière possède exactement 8 axes de symétrie ?",
    stimulus: {
      type: "shapes",
      text: "Polygones réguliers convexes usuels."
    },
    options: ["Octogone régulier", "Hexagone régulier", "Décagone régulier", "Carré"],
    correctIndex: 0,
    optionRationales: [
      "Correct : tout polygone régulier à n côtés possède exactement n axes de symétrie (n = 8 pour l'octogone).",
      "L'hexagone régulier possède 6 axes de symétrie.",
      "Le décagone régulier possède 10 axes de symétrie.",
      "Le carré possède 4 axes de symétrie."
    ],
    explanation: "Par propriété géométrique fondamentale, un polygone régulier à n côtés admet exactement n axes de symétrie axiale. Pour n = 8 (octogone), il en admet 8.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-seq-086",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "suite-logique",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 70,
    prompt: "Quel symbole succède logiquement dans la séquence de points cardinaux ?",
    stimulus: {
      type: "shapes",
      text: "N  →  E  →  S  →  O  →  ?"
    },
    options: ["N", "E", "S", "O"],
    correctIndex: 0,
    optionRationales: [
      "Correct : parcours régulier des quatre points cardinaux dans le sens des aiguilles d'une montre (Nord, Est, Sud, Ouest, puis retour au Nord).",
      "Est correspondrait à un saut direct sans repasser par le Nord.",
      "Sud correspondrait à une inversion de 180°.",
      "Ouest répète le point précédent."
    ],
    explanation: "La série égrène les 4 points cardinaux dans le sens horaire : Nord, Est, Sud, Ouest, et boucle naturellement sur le Nord (N).",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-mat-087",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "matrice",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 75,
    prompt: "Quelle case complète la dernière ligne de la matrice 3×3 ?",
    stimulus: {
      type: "shapes",
      text: "●▲■   ■●▲   ▲■●\n▲■●   ●▲■   ■●▲\n■●▲   ▲■●   ?"
    },
    options: ["●▲■", "▲■●", "■●▲", "●●●"],
    correctIndex: 0,
    optionRationales: [
      "Correct : permutation circulaire garantissant que chaque ligne et colonne présente les trois arrangements distincts (carré latin).",
      "Répète le deuxième arrangement de la troisième ligne.",
      "Répète le premier arrangement de la troisième ligne.",
      "Trois disques brise la règle des trois formes distinctes."
    ],
    explanation: "La matrice forme un carré latin où les 3 permutations des 3 symboles (●▲■, ■●▲, ▲■●) apparaissent exactement une fois par ligne et par colonne. La case manquante est ●▲■.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-rot-088",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "rotation",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 60,
    prompt: "Quelle figure résulte d'une rotation de 90° dans le sens horaire de la lettre majuscule 'V' ?",
    stimulus: {
      type: "shapes",
      text: "Figure de départ : V (pointe orientée vers le bas)."
    },
    options: ["< (pointe vers la gauche)", "> (pointe vers la droite)", "^ (pointe vers le haut)", "V (pointe vers le bas)"],
    correctIndex: 0,
    optionRationales: [
      "Correct : en tournant de 90° dans le sens horaire, la pointe basse tourne vers la gauche (forme <).",
      "La pointe vers la droite (>) résulterait d'une rotation anti-horaire de 90°.",
      "La pointe vers le haut (^) résulte d'une rotation de 180°.",
      "La figure non modifiée correspond à une rotation de 360°."
    ],
    explanation: "Le bas du 'V' pivote d'un quart de tour vers la droite (sens horaire), orientant la pointe du sommet vers la gauche (<).",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-trf-089",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "transformation",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 80,
    prompt: "Combien de faces triangulaires possède un octaèdre régulier ?",
    stimulus: {
      type: "shapes",
      text: "Polyèdre régulier convexe composé de deux pyramides à base carrée accolées par leur base."
    },
    options: ["8 faces", "6 faces", "12 faces", "4 faces"],
    correctIndex: 0,
    optionRationales: [
      "Correct : un octaèdre régulier est composé de 8 faces triangulaires équilatérales (4 en haut, 4 en bas).",
      "Six correspond au nombre de sommets d'un octaèdre ou aux faces d'un cube.",
      "Douze correspond au nombre d'arêtes de l'octaèdre.",
      "Quatre faces correspond au tétraèdre régulier."
    ],
    explanation: "Par définition étymologique et géométrique, l'octaèdre (du grec octa = huit) régulier compte 8 faces qui sont des triangles équilatéraux.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-seq-090",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "suite-logique",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 65,
    prompt: "Quel symbole poursuit la séquence selon la règle des puissances de 2 ?",
    stimulus: {
      type: "shapes",
      text: "● (1)  →  ●● (2)  →  ●●●● (4)  →  ●●●●●●●● (8)  →  ?"
    },
    options: ["16 disques", "12 disques", "10 disques", "14 disques"],
    correctIndex: 0,
    optionRationales: [
      "Correct : doublement à chaque étape (1, 2, 4, 8, puis 16 disques).",
      "12 disques correspondrait à une progression arithmétique de pas +4.",
      "10 disques correspondrait à un incrément arithmétique de pas +2.",
      "14 disques résulte d'une erreur de calcul multiplicatif."
    ],
    explanation: "Chaque terme double le nombre de disques du terme précédent : 1 × 2 = 2 ; 2 × 2 = 4 ; 4 × 2 = 8 ; 8 × 2 = 16 disques.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-mat-091",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "matrice",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 75,
    prompt: "Quelle figure complète la 3e colonne de la matrice binaire ?",
    stimulus: {
      type: "shapes",
      text: "Ligne 1 : ○ et ○ donnent ○\nLigne 2 : ○ et ● donnent ●\nLigne 3 : ● et ● donnent ?"
    },
    options: ["○ (Blanc)", "● (Noir)", "◎ (Concentrique)", "▲ (Triangle)"],
    correctIndex: 0,
    optionRationales: [
      "Correct : opération d'addition modulo 2 (XOR) : deux éléments identiques s'annulent et donnent blanc (○).",
      "Noir résulterait d'une opération OU logique (OR) et non XOR.",
      "Concentrique n'appartient pas à l'alphabet binaire noir/blanc.",
      "Triangle n'appartient pas à l'ensemble des formes de la matrice."
    ],
    explanation: "La matrice applique l'opération XOR (ou exclusif binaire) où ○ = 0 et ● = 1 : 0+0=0 (○), 0+1=1 (●), 1+1=0 (○). Deux noirs donnent donc un blanc.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-rot-092",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "rotation",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 65,
    prompt: "Quelle position prend une flèche partie de l'Est (→) après une rotation de 180° ?",
    stimulus: {
      type: "shapes",
      text: "Position initiale : Est (→)."
    },
    options: ["Ouest (←)", "Est (→)", "Nord (↑)", "Sud (↓)"],
    correctIndex: 0,
    optionRationales: [
      "Correct : une rotation de 180° inverse diamétralement la direction, passant de l'Est à l'Ouest.",
      "Est correspondrait à une absence de rotation ou un tour complet de 360°.",
      "Nord correspondrait à une rotation anti-horaire de 90°.",
      "Sud correspondrait à une rotation horaire de 90°."
    ],
    explanation: "Un demi-tour (180°) inverse la direction horizontale : l'Est (droite) devient l'Ouest (gauche ←).",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-trf-093",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "transformation",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 60,
    prompt: "Combien d'axes de symétrie axiale possède un triangle équilatéral ?",
    stimulus: {
      type: "shapes",
      text: "Triangle à 3 côtés égaux et 3 angles de 60°."
    },
    options: ["3 axes de symétrie", "1 axe de symétrie", "6 axes de symétrie", "0 axe de symétrie"],
    correctIndex: 0,
    optionRationales: [
      "Correct : chaque médiatrice issue d'un sommet vers le milieu du côté opposé forme un axe de symétrie (3 axes).",
      "Un seul axe caractérise le triangle isocèle non équilatéral.",
      "Six axes confond le nombre d'angles ou de demi-plans.",
      "Zéro axe caractérise le triangle scalène quelconque."
    ],
    explanation: "Un triangle équilatéral possède 3 axes de symétrie, qui coïncident avec ses 3 hauteurs, médianes, médiatrices et bissectrices.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-seq-094",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "suite-logique",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 70,
    prompt: "Quel symbole continue la série d'encadrements imbriqués ?",
    stimulus: {
      type: "shapes",
      text: "·  →  [·]  →  [[·]]  →  [[[·]]]  →  ?"
    },
    options: ["[[[[·]]]] (4 crochets)", "[[[·]]] (3 crochets)", "[[···]] (2 crochets)", "[·] (1 seul crochet)"],
    correctIndex: 0,
    optionRationales: [
      "Correct : chaque étape ajoute une paire de crochets concentriques encadrant le point central.",
      "Trois paires de crochets répète le terme précédent.",
      "Trois points brise la règle du point unique.",
      "Une paire correspond au début de la série."
    ],
    explanation: "La série ajoute exactement une couche d'encadrement (paire de crochets) à chaque étape : 0, 1, 2, 3, donc 4 paires de crochets entourant le point central.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-mat-095",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "matrice",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 65,
    prompt: "Quelle figure complète la matrice 2×2 ?",
    stimulus: {
      type: "shapes",
      text: "▲   △\n▼   ?"
    },
    options: ["▽ (Triangle blanc vers le bas)", "▲ (Triangle noir haut)", "△ (Triangle blanc haut)", "▼ (Triangle noir bas)"],
    correctIndex: 0,
    optionRationales: [
      "Correct : colonne 1 = formes noires pleines, colonne 2 = formes blanches évidées. Ligne 2 = pointes vers le bas.",
      "Triangle noir haut appartient à la ligne 1 colonne 1.",
      "Triangle blanc haut appartient à la ligne 1 colonne 2.",
      "Triangle noir bas appartient à la ligne 2 colonne 1."
    ],
    explanation: "La colonne 2 inverse le remplissage de la colonne 1 (noir devient blanc) tout en conservant l'orientation : le triangle noir vers le bas (▼) devient un triangle blanc vers le bas (▽).",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-rot-096",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "rotation",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 70,
    prompt: "Quelle position prend l'aiguille après une rotation de 450° dans le sens anti-horaire depuis Midi ?",
    stimulus: {
      type: "shapes",
      text: "Départ : 12h00. Rotation : 450° anti-horaire."
    },
    options: ["9h00 (Ouest / Gauche)", "3h00 (Est / Droite)", "6h00 (Sud / Bas)", "12h00 (Nord / Haut)"],
    correctIndex: 0,
    optionRationales: [
      "Correct : 450° = 360° + 90°. Un tour complet plus 90° anti-horaire amène l'aiguille de 12h00 à 9h00.",
      "Trois heures correspondrait à une rotation horaire de 90°.",
      "Six heures correspondrait à une rotation de 180°.",
      "Midi correspondrait à un multiple de 360° sans reliquat."
    ],
    explanation: "450° équivaut à un tour complet (360°) plus 90°. Dans le sens anti-horaire, 90° depuis midi déplace l'aiguille vers l'Ouest (9h00).",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-trf-097",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "transformation",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 60,
    prompt: "Combien de sommets possède un parallélépipède rectangle (pavé droit) ?",
    stimulus: {
      type: "shapes",
      text: "Solide géométrique régulier usuel à 6 faces rectangulaires."
    },
    options: ["8 sommets", "6 sommets", "12 sommets", "10 sommets"],
    correctIndex: 0,
    optionRationales: [
      "Correct : 4 sommets sur la face inférieure et 4 sommets sur la face supérieure (total = 8 sommets).",
      "Six correspond au nombre de faces rectangulaires.",
      "Douze correspond au nombre d'arêtes.",
      "Dix sommets ne correspond pas à un parallélépipède régulier."
    ],
    explanation: "Un pavé droit ou parallélépipède compte 8 sommets, 12 arêtes et 6 faces.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-seq-098",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "suite-logique",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 75,
    prompt: "Quel symbole continue la suite logique de cercles partagés ?",
    stimulus: {
      type: "shapes",
      text: "○ (0 trait)  →  ⦶ (1 trait diamétral)  →  ⊕ (2 traits en croix)  →  ?"
    },
    options: ["3 diamètres (6 secteurs)", "1 diamètre (2 secteurs)", "0 diamètre (cercle nu)", "2 diamètres (4 secteurs)"],
    correctIndex: 0,
    optionRationales: [
      "Correct : progression du nombre de segments intérieurs de division : 0, 1, 2 puis 3 traits.",
      "Un trait correspond au deuxième terme de la série.",
      "Zéro trait correspond au terme initial.",
      "Quatre cercles modifie la structure unique du glyphe."
    ],
    explanation: "La série incrémente de 1 le nombre de diamètres de découpe intérieure du cercle : 0 trait (cercle simple), 1 trait (cercle barré), 2 traits (croix inscrite), donc 3 traits (cercle divisé en 6 secteurs).",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-mat-099",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "matrice",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 75,
    prompt: "Quelle figure complète la 3e colonne de la matrice géométrique ?",
    stimulus: {
      type: "shapes",
      text: "Ligne 1 : Grand carré    Moyen carré    Petit carré\nLigne 2 : Grand cercle   Moyen cercle   Petit cercle\nLigne 3 : Grand triangle Moyen triangle ?"
    },
    options: ["Petit triangle", "Grand triangle", "Moyen triangle", "Petit carré"],
    correctIndex: 0,
    optionRationales: [
      "Correct : colonne 3 conserve la taille 'Petit' et la ligne 3 conserve la forme 'Triangle'.",
      "Grand triangle figure déjà en première colonne.",
      "Moyen triangle figure déjà en deuxième colonne.",
      "Petit carré modifierait la forme triangulaire de la ligne."
    ],
    explanation: "Chaque ligne conserve une forme géométrique (carrés, cercles, triangles) et chaque colonne applique une échelle de taille (grand, moyen, petit). En bas à droite, il faut donc un petit triangle.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-rot-100",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "rotation",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 65,
    prompt: "Quelle position prend l'aiguille après 8 rotations successives de 45° dans le sens horaire depuis Midi ?",
    stimulus: {
      type: "shapes",
      text: "Départ à 12h00. 8 rotations successives de 45° dans le sens horaire."
    },
    options: ["12h00 (Nord / Retour initial)", "6h00 (Sud / Bas)", "3h00 (Est / Droite)", "9h00 (Ouest / Gauche)"],
    correctIndex: 0,
    optionRationales: [
      "Correct : 8 × 45° = 360°, soit exactement un tour complet revenant à la position de départ (12h00).",
      "Six heures correspondrait à 4 rotations de 45° (180°).",
      "Trois heures correspondrait à 2 rotations de 45° (90°).",
      "Neuf heures correspondrait à 6 rotations de 45° (270°)."
    ],
    explanation: "Huit rotations de 45° donnent un angle total de 8 × 45° = 360°, soit un tour complet ramenant l'aiguille à sa position exacte d'origine à 12h00.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  }
];
