/**
 * Batch 2: Abstract Reasoning items 036 to 065 (30 items)
 * Skills: suite-logique, matrice, rotation, analogie-spatiale, comptage-segments, deplacement-grille
 */

const NOW = new Date().toISOString();
const REVIEWER = "hdjebar";

export const abstractBatch2 = [
  {
    id: "abstract-symb-036",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "suite-logique",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 60,
    prompt: "Quel groupe de symboles complète logiquement la séquence alternée ?",
    stimulus: {
      type: "shapes",
      text: "■ ○ ■■ ○○ ■■■ ○○○ ?"
    },
    options: ["■■■■", "○○○○", "■■■", "○○○"],
    correctIndex: 0,
    optionRationales: [
      "Correct : la série alterne carrés et ronds avec incrément unitaire (1, 2, 3 puis 4 carrés).",
      "Les cercles viendront après les 4 carrés.",
      "Trois carrés correspondent au groupe précédent.",
      "Trois cercles viennent de se terminer."
    ],
    explanation: "La série alterne des séquences de carrés noirs et de cercles blancs, dont le nombre croît de un à chaque apparition : 1 carré, 1 cercle, 2 carrés, 2 cercles, 3 carrés, 3 cercles, donc 4 carrés.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-mat-037",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "matrice",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 70,
    prompt: "Quelle figure complète la case manquante de la matrice ?",
    stimulus: {
      type: "shapes",
      text: "▲  ▲▲  ▲▲▲\n●  ●●  ●●●\n■  ■■  ?"
    },
    options: ["■■■", "■■■■", "●●●", "▲▲▲"],
    correctIndex: 0,
    optionRationales: [
      "Correct : chaque ligne conserve la même figure et incrémente le compte de 1 par colonne.",
      "Quatre carrés sauteraient l'étape de 3 carrés.",
      "Le disque appartient à la deuxième ligne.",
      "Le triangle appartient à la première ligne."
    ],
    explanation: "Dans cette matrice, la forme est constante sur chaque ligne (triangles, disques, carrés) et le nombre d'éléments augmente d'une unité à chaque colonne (1, 2, 3). La case manquante comporte donc 3 carrés.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-rot-038",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "rotation",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 65,
    prompt: "Quelle flèche poursuit logiquement la rotation ?",
    stimulus: {
      type: "shapes",
      text: "↖  ↗  ↘  ↙  ?"
    },
    options: ["↖", "↗", "↘", "↓"],
    correctIndex: 0,
    optionRationales: [
      "Correct : rotation horaire de 90° revenant à la position initiale Nord-Ouest.",
      "Une flèche vers le Nord-Est correspondrait à une rotation de 180°.",
      "Une flèche vers le Sud-Est correspondrait à un saut de 270°.",
      "La flèche verticale Sud ne suit pas les diagonales de la série."
    ],
    explanation: "La flèche tourne de 90° dans le sens horaire à chaque étape : Nord-Ouest, Nord-Est, Sud-Est, Sud-Ouest, et revient donc à Nord-Ouest (↖).",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-symb-039",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "transformation",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 60,
    prompt: "Identifiez la figure correspondant au point d'interrogation dans l'analogie.",
    stimulus: {
      type: "shapes",
      text: "○ est à ● ce que △ est à ?"
    },
    options: ["▲", "△", "■", "□"],
    correctIndex: 0,
    optionRationales: [
      "Correct : la forme passe d'évidée à pleine tout en conservant sa géométrie triangulaire.",
      "Le triangle reste vide, ce qui n'applique pas la transformation de remplissage.",
      "Le carré plein modifie la forme au lieu de conserver le triangle.",
      "Le carré vide modifie à la fois la forme et le remplissage."
    ],
    explanation: "La relation transforme une forme blanche (vide) en son équivalent noir (plein). Le triangle blanc devient donc un triangle noir plein (▲).",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-cnt-040",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "transformation",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 75,
    prompt: "Quelle figure suit logiquement la progression du nombre de côtés ?",
    stimulus: {
      type: "shapes",
      text: "Triangle  →  Quadrilatère  →  Pentagone  →  Hexagone  →  ?"
    },
    options: ["Heptagone", "Octogone", "Carré", "Cercle"],
    correctIndex: 0,
    optionRationales: [
      "Correct : polygone à 7 côtés faisant suite au polygone à 6 côtés.",
      "L'octogone compte 8 côtés et saute le polygone à 7 côtés.",
      "Le carré compte 4 côtés et correspond à un retour en arrière.",
      "Le cercle n'a aucun segment rectiligne."
    ],
    explanation: "La progression ajoute exactement un côté à chaque étape : 3 (triangle), 4 (quadrilatère), 5 (pentagone), 6 (hexagone), la figure suivante est un heptagone (7 côtés).",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-grid-041",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "transformation",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 80,
    prompt: "Un point se déplace dans une grille 3×3 de gauche à droite puis revient au début de la ligne suivante. S'il est en case (2, 3), où sera-t-il après 2 déplacements ?",
    stimulus: {
      type: "shapes",
      text: "Position actuelle : Ligne 2, Colonne 3 (fin de ligne)."
    },
    options: ["Ligne 3, Colonne 2", "Ligne 3, Colonne 1", "Ligne 2, Colonne 1", "Ligne 1, Colonne 3"],
    correctIndex: 0,
    optionRationales: [
      "Correct : 1er déplacement vers (3, 1), 2e déplacement vers (3, 2).",
      "La position (3, 1) correspond à 1 seul déplacement.",
      "La position (2, 1) correspondrait à une boucle sur la même ligne.",
      "La position (1, 3) correspondrait à un déplacement inverse."
    ],
    explanation: "Depuis (2, 3), un premier déplacement passe à la case suivante selon l'ordre de lecture, soit (3, 1). Le second déplacement avance d'une case vers la droite, soit (3, 2).",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-seq-042",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "suite-logique",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 60,
    prompt: "Quel symbole vient clore la séquence d'alternance haut/bas ?",
    stimulus: {
      type: "shapes",
      text: "↑  ↓  ↑↑  ↓↓  ↑↑↑  ???"
    },
    options: ["↓↓↓", "↑↑↑", "↓↓↓↓", "↑↑↑↑"],
    correctIndex: 0,
    optionRationales: [
      "Correct : 3 flèches vers le bas pour équilibrer les 3 flèches vers le haut.",
      "Répéter les flèches vers le haut briserait l'alternance haut/bas.",
      "Quatre flèches vers le bas sauteraient l'incrément régulier de 3.",
      "Quatre flèches vers le haut inverseraient la direction et le décompte."
    ],
    explanation: "La série alterne flèches vers le haut et flèches vers le bas en incrémentant leur nombre : 1 haut, 1 bas, 2 haut, 2 bas, 3 haut, donc 3 bas (↓↓↓).",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-mat-043",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "matrice",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 75,
    prompt: "Quelle combinaison de points complète la matrice 3×3 ?",
    stimulus: {
      type: "shapes",
      text: "1 pt    2 pts   3 pts\n2 pts   4 pts   6 pts\n3 pts   6 pts   ?"
    },
    options: ["9 pts", "8 pts", "12 pts", "7 pts"],
    correctIndex: 0,
    optionRationales: [
      "Correct : la ligne 3 correspond à la table de 3 (3 × 1, 3 × 2, 3 × 3 = 9).",
      "Huit points ne respectent pas le pas multiplicatif de 3.",
      "Douze points correspondraient à 3 × 4 au lieu de la 3e colonne.",
      "Sept points ne respectent ni l'addition ni la multiplication matricielle."
    ],
    explanation: "La matrice suit la table de multiplication : cellule(i, j) = i × j. En ligne 3 et colonne 3, la valeur est 3 × 3 = 9 points.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-rot-044",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "rotation",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 60,
    prompt: "Quelle position prend le curseur après une rotation de 45° dans le sens anti-horaire ?",
    stimulus: {
      type: "shapes",
      text: "Position initiale : Nord (12h00)"
    },
    options: ["Nord-Ouest (10h30)", "Nord-Est (01h30)", "Est (03h00)", "Ouest (09h00)"],
    correctIndex: 0,
    optionRationales: [
      "Correct : le sens anti-horaire (trigonométrique) déplace 12h00 vers 10h30 de 45°.",
      "Nord-Est correspond à une rotation horaire de 45°.",
      "Est correspond à une rotation horaire de 90°.",
      "Ouest correspond à une rotation anti-horaire de 90°."
    ],
    explanation: "Une rotation de 45° dans le sens anti-horaire fait tourner l'aiguille de midi vers la gauche, atteignant la direction intermédiaire Nord-Ouest (10h30).",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-symb-045",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "suite-logique",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 65,
    prompt: "Quel élément complète la suite logique de symboles imbriqués ?",
    stimulus: {
      type: "shapes",
      text: "⊞  ⊟  ⊠  ?"
    },
    options: ["⊡", "⊞", "○", "▲"],
    correctIndex: 0,
    optionRationales: [
      "Correct : carré encadrant un point central, complétant la série d'opérateurs géométriques encadrés.",
      "Répétition du premier opérateur sans suite logique.",
      "Cercle simple hors de la famille des carrés encadrés.",
      "Triangle hors du cadre géométrique établi."
    ],
    explanation: "Tous les symboles sont des carrés contenant un motif intérieur distinct (croix, trait horizontal, croix de saint André, point central ⊡).",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-mat-046",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "matrice",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 70,
    prompt: "Quelle figure remplit la dernière case selon la règle de superposition ?",
    stimulus: {
      type: "shapes",
      text: "Ligne 1 : — et | donnent +\nLigne 2 : / et \\ donnent X\nLigne 3 : ○ et + donnent ?"
    },
    options: ["⊕", "⊗", "○", "+"],
    correctIndex: 0,
    optionRationales: [
      "Correct : superposition directe du cercle et de la croix centrale (+).",
      "Le symbole ⊗ superpose une croix diagonale (X) et non une croix droite.",
      "Le cercle seul omet la seconde composante.",
      "La croix seule omet le contour circulaire."
    ],
    explanation: "La règle horizontale est la fusion (superposition) des deux premières figures pour former la troisième : le cercle ○ fusionné avec la croix + produit le cercle barré d'une croix ⊕.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-cnt-047",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "transformation",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 60,
    prompt: "Quelle lettre de l'alphabet latin compte exactement 3 segments de droite ?",
    stimulus: {
      type: "shapes",
      text: "Série de lettres formées de traits droits : L (2 traits), H (3 traits), M (4 traits)."
    },
    options: ["N", "E", "T", "X"],
    correctIndex: 0,
    optionRationales: [
      "Correct : la lettre N est composée de 2 montants verticaux et d'une diagonale (3 segments).",
      "La lettre E compte 4 segments droits (1 vertical et 3 horizontaux).",
      "La lettre T ne compte que 2 segments droits (1 horizontal et 1 vertical).",
      "La lettre X ne compte que 2 segments diagonaux."
    ],
    explanation: "La lettre N se trace au moyen de 3 segments rectilignes distincts (| / |). E en a 4, T et X en ont 2.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-seq-048",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "suite-logique",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 60,
    prompt: "Quel motif complète la série basée sur la taille décroissante ?",
    stimulus: {
      type: "shapes",
      text: "███  ██  █  ?"
    },
    options: ["· (point)", "████", "███", "— (tiret long)"],
    correctIndex: 0,
    optionRationales: [
      "Correct : réduction d'un bloc à chaque étape, aboutissant au point minimal.",
      "Quatre blocs correspondent à une progression croissante inverse.",
      "Trois blocs répètent le début de la séquence.",
      "Le tiret modifie la morphologie du symbole au lieu de sa taille."
    ],
    explanation: "Chaque étape retire exactement un pavé carré de la série : 3, puis 2, puis 1, la suite logique aboutit à la dimension minimale (point unique).",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-grid-049",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "transformation",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 75,
    prompt: "Dans un damier 4×4, une pièce avance de 2 cases vers le Sud puis de 1 case vers l'Est. Si elle part de (1, 1), quelle est sa position finale ?",
    stimulus: {
      type: "shapes",
      text: "Coordonnées de départ : Ligne 1, Colonne 1 (coin supérieur gauche)."
    },
    options: ["Ligne 3, Colonne 2", "Ligne 2, Colonne 3", "Ligne 3, Colonne 1", "Ligne 2, Colonne 2"],
    correctIndex: 0,
    optionRationales: [
      "Correct : départ (1,1) + 2 lignes vers le bas = ligne 3, + 1 colonne vers la droite = colonne 2.",
      "Inversion des axes lignes et colonnes.",
      "Le déplacement vers l'Est (+1 colonne) a été omis.",
      "Une seule case vers le Sud a été comptabilisée au lieu de deux."
    ],
    explanation: "Le déplacement vers le Sud incrémente l'indice de ligne de 2 (1 + 2 = 3). Le déplacement vers l'Est incrémente l'indice de colonne de 1 (1 + 1 = 2). La position résultante est donc Ligne 3, Colonne 2.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-rot-050",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "rotation",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 60,
    prompt: "Quelle lettre majuscule conserve son apparence après une rotation de 180° autour de son centre ?",
    stimulus: {
      type: "shapes",
      text: "Ensemble de lettres candidates : A, H, T, P."
    },
    options: ["H", "A", "T", "P"],
    correctIndex: 0,
    optionRationales: [
      "Correct : la lettre H possède une symétrie centrale d'ordre 2 (invariante à 180°).",
      "La lettre A tournée de 180° a sa pointe orientée vers le bas (∀).",
      "La lettre T tournée de 180° a sa barre horizontale en bas (⊥).",
      "La lettre P tournée de 180° a sa boucle en bas à gauche (d)."
    ],
    explanation: "Une figure invariante par rotation de 180° possède un centre de symétrie. Seule la lettre H reste identique après un demi-tour.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-symb-051",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "suite-logique",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 70,
    prompt: "Quel symbole complète la suite de fractions visuelles ?",
    stimulus: {
      type: "shapes",
      text: "◔ (1/4)  ◑ (2/4)  ◕ (3/4)  ?"
    },
    options: ["● (4/4 plein)", "○ (0/4 vide)", "◐ (autre moitié)", "◔ (quart initial)"],
    correctIndex: 0,
    optionRationales: [
      "Correct : le disque se remplit d'un quart supplémentaire à chaque pas pour devenir entièrement plein.",
      "Le disque vide marquerait une réinitialisation sans achever le cycle.",
      "L'autre moitié inverserait la direction de progression du noircissement.",
      "Le premier quart correspond au début de la série."
    ],
    explanation: "Le disque noirci progresse de 90° (un quart) à chaque étape dans le sens horaire : 1/4 plein, 2/4 plein (moitié), 3/4 plein, et finalement 4/4 plein (disque entièrement noir ●).",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-mat-052",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "matrice",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 65,
    prompt: "Quelle figure complète la diagonale de la matrice 2×2 ?",
    stimulus: {
      type: "shapes",
      text: "■   □\n□   ?"
    },
    options: ["■", "□", "●", "▲"],
    correctIndex: 0,
    optionRationales: [
      "Correct : symétrie diagonale parfaite avec carrés pleins sur la diagonale principale.",
      "Un carré blanc créerait un déséquilibre asymétrique par rapport à la diagonale.",
      "Le rond n'appartient pas à l'alphabet de formes de la matrice.",
      "Le triangle n'est pas utilisé dans cette matrice binaire."
    ],
    explanation: "La matrice suit une logique de symétrie centrale et diagonale : la diagonale principale est composée de carrés noirs (■) et la diagonale secondaire de carrés blancs (□).",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-cnt-053",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "transformation",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 60,
    prompt: "Combien d'angles droits possède un trapèze rectangle ?",
    stimulus: {
      type: "shapes",
      text: "Figure géométrique fermée à 4 côtés dont deux côtés opposés sont parallèles et un côté perpendiculaire aux bases."
    },
    options: ["2 angles droits", "1 angle droit", "3 angles droits", "4 angles droits"],
    correctIndex: 0,
    optionRationales: [
      "Correct : le côté perpendiculaire aux bases forme un angle droit avec chacune d'elles (2 angles droits).",
      "Un seul angle droit rendrait impossible le parallélisme des bases horizontales.",
      "Trois angles droits imposeraient nécessairement que le 4e angle soit également droit (rectangle).",
      "Quatre angles droits caractérisent un rectangle ou un carré, non un trapèze au sens strict."
    ],
    explanation: "Par définition, un trapèze rectangle possède un côté perpendiculaire aux deux bases parallèles, formant ainsi 2 angles droits consécutifs.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-seq-054",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "suite-logique",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 70,
    prompt: "Quel nombre de barres verticales suit logiquement la suite ?",
    stimulus: {
      type: "shapes",
      text: "|   |||   |||||   |||||||   ?"
    },
    options: ["||||||||| (9 barres)", "|||||||| (8 barres)", "|||||||||| (10 barres)", "||||||| (7 barres)"],
    correctIndex: 0,
    optionRationales: [
      "Correct : suite des nombres impairs consécutifs (1, 3, 5, 7, puis 9 barres).",
      "Huit barres correspondrait à un incrément pair au lieu de la suite impaire.",
      "Dix barres saute l'étape de 9 barres.",
      "Sept barres répète l'étape précédente."
    ],
    explanation: "Le nombre de barres verticales forme la suite arithmétique de raison +2 débutant à 1 : 1, 3, 5, 7, donc 9 barres.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-rot-055",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "rotation",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 65,
    prompt: "Quelle position prend l'aiguille après 3 rotations successives de 90° dans le sens horaire depuis Midi ?",
    stimulus: {
      type: "shapes",
      text: "Position initiale : 12h00 (Haut)."
    },
    options: ["9h00 (Gauche)", "3h00 (Droite)", "6h00 (Bas)", "12h00 (Haut)"],
    correctIndex: 0,
    optionRationales: [
      "Correct : 3 × 90° = 270° horaires, soit l'équivalent de 90° anti-horaire (position 9h00).",
      "La position 3h00 correspond à 1 seule rotation de 90°.",
      "La position 6h00 correspond à 2 rotations de 90° (180°).",
      "La position 12h00 correspondrait à un tour complet de 360° (4 rotations)."
    ],
    explanation: "Depuis le haut (12h00) : 1re rotation → 3h00, 2e rotation → 6h00, 3e rotation → 9h00 (Ouest / Gauche).",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-mat-056",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "matrice",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 75,
    prompt: "Quelle case complète la dernière colonne de la matrice 3×3 ?",
    stimulus: {
      type: "shapes",
      text: "1 triangle   1 carré   1 pentagone\n2 triangles  2 carrés  2 pentagones\n3 triangles  3 carrés  ?"
    },
    options: ["3 pentagones", "4 pentagones", "3 hexagones", "2 pentagones"],
    correctIndex: 0,
    optionRationales: [
      "Correct : 3e ligne (compte de 3) et 3e colonne (forme de pentagone).",
      "Quatre pentagones dépasseraient le compte de 3 imposé par la troisième ligne.",
      "L'hexagone modifierait la forme constante de la troisième colonne.",
      "Deux pentagones figurent déjà sur la deuxième ligne."
    ],
    explanation: "Chaque colonne est caractérisée par une forme (colonne 1 = triangles, colonne 2 = carrés, colonne 3 = pentagones) et chaque ligne par une quantité (1, 2, 3). En bas à droite, il faut donc 3 pentagones.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-symb-057",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "suite-logique",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 60,
    prompt: "Quel symbole continue la suite d'alternance binaire inversée ?",
    stimulus: {
      type: "shapes",
      text: "+  -  ++  --  +++  ---  ????"
    },
    options: ["++++", "----", "+++", "---"],
    correctIndex: 0,
    optionRationales: [
      "Correct : après le bloc de 3 signes moins, la série repart sur un bloc de 4 signes plus.",
      "Quatre signes moins feraient abstraction de l'alternance avec le signe plus.",
      "Trois signes plus répètent le groupe déjà achevé.",
      "Trois signes moins viennent d'être terminés."
    ],
    explanation: "La série alterne blocs de '+' et blocs de '-' dont la taille augmente de 1 à chaque alternance : 1+, 1-, 2+, 2-, 3+, 3-, le bloc suivant comporte donc 4+ (++++).",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-grid-058",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "transformation",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 80,
    prompt: "Sur un cercle divisé en 8 secteurs numérotés de 1 à 8 dans le sens horaire, un pion part de 1 et avance de 3 secteurs à chaque pas. Où sera-t-il après 3 sauts ?",
    stimulus: {
      type: "shapes",
      text: "Cercle à 8 positions (1 à 8). Départ à 1. Déplacement de +3 à chaque saut."
    },
    options: ["Secteur 2", "Secteur 1", "Secteur 4", "Secteur 7"],
    correctIndex: 0,
    optionRationales: [
      "Correct : 1 + (3 × 3) = 10 ; modulo 8, 10 équivaut au secteur 2 (10 - 8 = 2).",
      "Le secteur 1 marquerait un retour complet sans déplacement net.",
      "Le secteur 4 correspond à 1 seul saut (1 + 3 = 4).",
      "Le secteur 7 correspond à 2 sauts (1 + 3 + 3 = 7)."
    ],
    explanation: "Départ en 1. Saut 1 : 1 + 3 = 4. Saut 2 : 4 + 3 = 7. Saut 3 : 7 + 3 = 10. Sur un cadran à 8 positions, la position 10 correspond au secteur 2 (10 - 8 = 2).",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-cnt-059",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "transformation",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 65,
    prompt: "Combien de diagonales intérieures possède un pentagone régulier convexe ?",
    stimulus: {
      type: "shapes",
      text: "Polygone régulier convexe à 5 sommets."
    },
    options: ["5 diagonales", "10 diagonales", "4 diagonales", "3 diagonales"],
    correctIndex: 0,
    optionRationales: [
      "Correct : formule n(n-3)/2 pour n=5 donne 5(2)/2 = 5 diagonales formant une étoile.",
      "Dix correspond au nombre total de paires de sommets n(n-1)/2, incluant les 5 côtés extérieurs.",
      "Quatre diagonales omet une liaison diagonale.",
      "Trois diagonales correspond au nombre de triangles de triangulation, non au total des diagonales."
    ],
    explanation: "Le nombre de diagonales d'un polygone convexe à n sommets est donné par n(n-3)/2. Pour n = 5, on obtient 5 × 2 / 2 = 5 diagonales (qui tracent une étoile à 5 branches).",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-rot-060",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "rotation",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 60,
    prompt: "Quelle figure correspond au reflet miroir vertical (inversion gauche/droite) de la lettre 'E' ?",
    stimulus: {
      type: "shapes",
      text: "Lettre majuscule standard : E"
    },
    options: ["ヨ", "E", "Ǝ", "Ш"],
    correctIndex: 0,
    optionRationales: [
      "Correct : la barre verticale passe à droite et les trois barres horizontales pointent vers la gauche.",
      "La lettre E non modifiée ne subit aucun effet miroir.",
      "Le symbole Ǝ inversé correspond souvent à une rotation ou miroir avec empattement différent.",
      "La lettre cyrillique Ш correspond à une rotation de 90° vers le haut."
    ],
    explanation: "Une réflexion miroir selon un axe vertical échange la gauche et la droite : la barre dorsale de 'E' passe de gauche à droite, et les branches pointent vers la gauche (forme ヨ).",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-mat-061",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "matrice",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 75,
    prompt: "Quelle figure complète la 3e colonne selon l'opération logique d'exclusion mutuelle (XOR) ?",
    stimulus: {
      type: "shapes",
      text: "Règle : les éléments communs aux deux premières cases disparaissent, les éléments uniques sont conservés.\nCase 1 : rond et carré\nCase 2 : rond et triangle\nCase 3 : ?"
    },
    options: ["carré et triangle", "rond, carré et triangle", "rond seul", "carré seul"],
    correctIndex: 0,
    optionRationales: [
      "Correct : le rond commun est éliminé (XOR) ; le carré et le triangle uniques sont conservés.",
      "Conserver les trois formes correspondrait à une union logique (OU) et non à une exclusion mutuelle.",
      "Le rond est précisément l'élément partagé qui doit disparaître selon la règle XOR.",
      "Le carré seul omet le triangle qui était également exclusif à la deuxième case."
    ],
    explanation: "L'opération XOR (ou exclusif) élimine tout symbole présent simultanément dans les cases 1 et 2 (ici le rond). Les symboles présents dans une seule case (le carré et le triangle) sont conservés.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-symb-062",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "suite-logique",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 65,
    prompt: "Quel symbole succède logiquement dans la séquence d'imbrication croissante ?",
    stimulus: {
      type: "shapes",
      text: "□  →  回  →  回 dans un grand cadre  →  ?"
    },
    options: ["4 carrés concentriques", "2 carrés séparés", "3 triangles imbriqués", "1 cercle plein"],
    correctIndex: 0,
    optionRationales: [
      "Correct : chaque étape ajoute un carré concentrique englobant supplémentaire (1, 2, 3 puis 4 carrés).",
      "Deux carrés séparés brisent la règle d'emboîtement concentrique.",
      "Les triangles modifient la forme de base de la série.",
      "Le cercle plein rompt la logique géométrique des carrés."
    ],
    explanation: "La série empile des carrés concentriques de taille croissante : 1 carré simple, 2 carrés emboîtés, 3 carrés emboîtés ; l'étape suivante consiste donc en 4 carrés concentriques.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-grid-063",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "transformation",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 80,
    prompt: "Sur une grille 5×5, un point situé au centre (3, 3) se déplace d'une case vers le Nord, puis de deux cases vers l'Ouest. Quelles sont ses nouvelles coordonnées ?",
    stimulus: {
      type: "shapes",
      text: "Grille 5×5 (lignes 1 à 5 de haut en bas, colonnes 1 à 5 de gauche à droite). Départ : (3, 3)."
    },
    options: ["Ligne 2, Colonne 1", "Ligne 4, Colonne 1", "Ligne 2, Colonne 5", "Ligne 1, Colonne 2"],
    correctIndex: 0,
    optionRationales: [
      "Correct : Nord soustrait 1 à la ligne (3 - 1 = 2) ; Ouest soustrait 2 à la colonne (3 - 2 = 1).",
      "Ligne 4 correspondrait à un déplacement vers le Sud au lieu du Nord.",
      "Colonne 5 correspondrait à un déplacement vers l'Est au lieu de l'Ouest.",
      "Ligne 1, Colonne 2 inverse les valeurs de déplacement."
    ],
    explanation: "Vers le Nord : l'indice de ligne diminue de 1 (3 - 1 = 2). Vers l'Ouest : l'indice de colonne diminue de 2 (3 - 2 = 1). Le point arrive en case (2, 1).",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-rot-064",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "rotation",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 65,
    prompt: "Quelle position prend l'aiguille après 5 rotations consécutives de 90° dans le sens horaire depuis Midi ?",
    stimulus: {
      type: "shapes",
      text: "Position de départ : 12h00."
    },
    options: ["3h00 (Droite)", "6h00 (Bas)", "9h00 (Gauche)", "12h00 (Haut)"],
    correctIndex: 0,
    optionRationales: [
      "Correct : 5 × 90° = 450° = 360° + 90°, équivalent à une seule rotation de 90° (position 3h00).",
      "Six heures correspondrait à 6 rotations de 90° (ou 2 modulo 4).",
      "Neuf heures correspondrait à 7 rotations de 90° (ou 3 modulo 4).",
      "Midi correspondrait à 4 ou 8 rotations (multiple complet de 360°)."
    ],
    explanation: "Quatre rotations de 90° constituent un tour complet (360°) et ramènent à la position initiale (12h00). La 5e rotation de 90° amène l'aiguille à 3h00 (Est).",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "abstract-cnt-065",
    version: 1,
    category: "abstract",
    itemFormat: "single_best",
    skill: "transformation",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 75,
    prompt: "Combien d'arêtes possède un prisme droit dont la base est un hexagone ?",
    stimulus: {
      type: "shapes",
      text: "Solide géométrique régulier : prisme droit à base hexagonale (6 côtés par base)."
    },
    options: ["18 arêtes", "12 arêtes", "8 arêtes", "24 arêtes"],
    correctIndex: 0,
    optionRationales: [
      "Correct : 6 arêtes sur la base inférieure, 6 sur la base supérieure, et 6 arêtes latérales verticales (3 × 6 = 18).",
      "Douze correspond au nombre de sommets (2 × 6), non au nombre d'arêtes.",
      "Huit correspond au nombre de faces totales (2 bases + 6 faces latérales).",
      "Vingt-quatre arêtes correspondrait à un solide à base à 8 côtés ou un empilement."
    ],
    explanation: "Un prisme à base à n côtés possède 3n arêtes : n arêtes pour la base inférieure, n arêtes pour la base supérieure et n arêtes reliant les deux bases. Pour n = 6, 3 × 6 = 18 arêtes.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  }
];
