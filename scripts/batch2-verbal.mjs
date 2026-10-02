/**
 * Batch 2: Verbal Reasoning items 036 to 065 (30 items)
 * Skills: deduction, inference, analyse-critique, synthese, coherence-textuelle
 * Strict length balancing: max option length <= 1.4 * min option length
 * Zero forbidden words, strictly factual from text.
 */

const NOW = new Date().toISOString();
const REVIEWER = "hdjebar";

export const verbalBatch2 = [
  {
    id: "verbal-text-036",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "comprehension",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 75,
    prompt: "Selon l'extrait de cette circulaire, quelle condition ouvre droit à l'indemnité forfaitaire de déplacement ?",
    stimulus: "Circulaire relative aux frais professionnels : Les agents se déplaçant pour les besoins du service hors de leur résidence administrative sur une distance supérieure à vingt kilomètres bénéficient d'une indemnité forfaitaire de repas, à la condition expresse que la mission englobe l'intégralité du créneau compris entre midi et quatorze heures.",
    options: [
      "Parcourir plus de vingt kilomètres et couvrir le créneau méridien.",
      "Effectuer un trajet supérieur à dix kilomètres hors du bureau usuel.",
      "Justifier d'une absence professionnelle supérieure à quatre heures.",
      "Présenter les factures réelles acquittées auprès des restaurants."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : le texte exige cumulativement plus de 20 km et la couverture de 12h00 à 14h00.",
      "Le seuil de dix kilomètres est inférieur aux vingt kilomètres prescrits.",
      "La durée brute de quatre heures n'est pas mentionnée dans la circulaire.",
      "L'indemnité est forfaitaire et ne requiert pas de factures réelles de repas."
    ],
    explanation: "Le texte pose deux conditions cumulatives expresses : une distance supérieure à 20 km hors de la résidence administrative et une mission couvrant la totalité du créneau de 12h00 à 14h00.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-text-037",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "inference",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 80,
    prompt: "Que peut-on déduire avec certitude au sujet des demandes de subvention déposées après le 31 octobre ?",
    stimulus: "Règlement des aides aux communes : Tout dossier de subvention d'infrastructure doit être réceptionné avant le 31 octobre de l'année civile en cours. Les dossiers parvenus postérieurement sont automatiquement reportés à l'exercice budgétaire suivant, sans qu'un nouvel enregistrement ne soit exigé des autorités communales requérantes.",
    options: [
      "Elles sont examinées au titre du budget de l'exercice ultérieur.",
      "Elles sont définitivement rejetées pour forclusion administrative.",
      "Elles nécessitent le dépôt d'un formulaire modificatif complet.",
      "Elles bénéficient d'un traitement dérogatoire prioritaire immédiat."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : le texte stipule le report automatique à l'exercice budgétaire suivant sans réenregistrement.",
      "Le texte écarte le rejet définitif en prévoyant un report automatique.",
      "Aucun nouvel enregistrement ni formulaire n'est exigé.",
      "Le texte ne prévoit aucun traitement prioritaire dérogatoire."
    ],
    explanation: "Le règlement indique clairement que les dossiers reçus après le 31 octobre sont automatiquement reportés à l'exercice suivant sans formalité supplémentaire.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-text-038",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "inference",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 85,
    prompt: "Sur quel argument repose la recommandation du comité d'audit dans ce rapport ?",
    stimulus: "Rapport d'évaluation de la politique numérique : Bien que l'adoption des outils collaboratifs ait progressé de 40 % chez les cadres, le taux d'incident lié au partage inapproprié de données a doublé. Dès lors, le comité recommande d'instaurer des contrôles d'accès stricts avant toute nouvelle extension des licences logicielles.",
    options: [
      "L'augmentation des incidents de partage commande des verrous préalables.",
      "Le coût financier des licences logicielles est jugé excessif par l'audit.",
      "Le déploiement des outils collaboratifs a échoué auprès de l'encadrement.",
      "Les agents refusent d'utiliser les nouvelles applications informatiques."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : le comité justifie la limitation par le doublement des incidents de partage.",
      "Le texte ne mentionne aucun argument relatif au coût financier des licences.",
      "L'adoption a au contraire progressé de 40 %, ce n'est donc pas un échec d'adhésion.",
      "Le rapport atteste d'une progression d'usage et non d'un refus des agents."
    ],
    explanation: "Le comité motive sa recommandation par le fait que les incidents de sécurité ont doublé parallèlement à l'usage, nécessitant un encadrement préalable.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-text-039",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "synthese",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 75,
    prompt: "Quel énoncé résume fidèlement le principe général exprimé dans cette note d'orientation ?",
    stimulus: "Note ministérielle sur l'accueil des usagers : La modernisation des services publics repose sur une double exigence d'accessibilité numérique et de maintien d'un guichet physique de proximité. L'objectif est d'éviter l'exclusion des populations non connectées tout en fluidifiant les démarches courantes pour la majorité des citoyens.",
    options: [
      "Conjuguer le numérique et le guichet physique pour prévenir la fracture.",
      "Supprimer progressivement tous les accueils physiques au profit du web.",
      "Réserver les guichets physiques aux seules personnes âgées de la cité.",
      "Accroître les démarches numériques sans considération des populations."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : le texte insiste sur la complémentarité numérique/physique pour éviter l'exclusion.",
      "Le texte prône le maintien du guichet physique, non sa suppression progressive.",
      "Le texte ne limite pas l'accès aux seules personnes âgées mais à tout public non connecté.",
      "L'orientation vise explicitement à éviter l'exclusion des usagers."
    ],
    explanation: "L'extrait synthétise l'équilibre entre transition numérique et préservation de l'accueil physique afin d'assurer l'universalité d'accès aux services.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-text-040",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "comprehension",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 80,
    prompt: "Quelle proposition complète logiquement le paragraphe tout en respectant l'argumentation ?",
    stimulus: "Guide de passation des marchés publics : La définition préalable des besoins par le pouvoir adjudicateur constitue la clé de voûte de toute consultation réussie. Une description imprécise des prestations induit des offres disparates et difficilement comparables. Par conséquent, [...]",
    options: [
      "un cahier des charges rigoureux limite les risques de litiges ultérieurs.",
      "le choix du prix le plus bas dispense de formaliser les attentes de fond.",
      "la phase d'analyse des offres peut corriger tout défaut de cadrage amont.",
      "les soumissionnaires doivent définir eux-mêmes les attendus du marché."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : conclut logiquement sur la nécessité d'un cahier des charges précis.",
      "Le prix bas ne compense pas l'absence de définition claire des prestations.",
      "Le texte indique que l'imprécision initiale rend la comparaison très difficile.",
      "Il appartient au pouvoir adjudicateur et non aux candidats de définir le besoin."
    ],
    explanation: "La logique du paragraphe montre que le manque de précision nuit à la passation ; la conclusion naturelle est qu'une rédaction rigoureuse du cahier des charges prévient ces écueils.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-text-041",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "comprehension",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 70,
    prompt: "D'après les dispositions du texte, que se passe-t-il si un fonctionnaire stagiaire ne valide pas son examen de fin de stage ?",
    stimulus: "Statut des fonctionnaires : Le fonctionnaire stagiaire ayant accompli une année de service accompli subit un examen pratique d'aptitude. En cas d'échec constaté par le jury, le stage peut être exceptionnellement prorogé pour une période maximale de six mois. Si l'insuffisance persiste au terme de cette prorogation, le licenciement est prononcé de plein droit.",
    options: [
      "Le stage peut faire l'objet d'une prorogation maximale de six mois.",
      "La titularisation immédiate est accordée avec retenue indiciaire.",
      "Le licenciement intervient sans aucune possibilité de seconde chance.",
      "L'agent est reclassé d'office dans un corps d'emploi subalterne."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : le statut prévoit une prorogation exceptionnelle pouvant atteindre six mois.",
      "L'échec exclut formellement la titularisation immédiate.",
      "Le licenciement n'intervient qu'au terme de la période de prorogation si l'échec persiste.",
      "Le texte ne prévoit pas de reclassement d'office en cas de premier échec."
    ],
    explanation: "Le texte précise qu'en cas d'échec initial, une prorogation maximale de six mois peut être accordée avant tout licenciement pour insuffisance.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-text-042",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "inference",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 75,
    prompt: "Quelle déduction relative à la conservation des archives découle directement de ce protocole ?",
    stimulus: "Protocole d'archivage administratif : Les dossiers de recours contentieux sont conservés au greffe durant dix ans à compter de la décision définitive. À l'issue de cette période d'utilité administrative, seuls les dossiers présentant un intérêt jurisprudentiel remarquable sont versés aux archives nationales, les autres faisant l'objet d'une élimination réglementée.",
    options: [
      "Les dossiers ordinaires sont détruits au terme du délai de dix ans.",
      "L'ensemble des dossiers contentieux est préservé aux archives nationales.",
      "Les pièces de procédure sont éliminées dès le prononcé du jugement.",
      "Aucun recours contentieux ne peut être éliminé avant un demi-siècle."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : seuls les dossiers remarquables sont versés aux archives, les autres étant éliminés.",
      "Le versement aux archives nationales est restreint aux dossiers présentant un intérêt remarquable.",
      "Les dossiers sont conservés 10 ans au greffe avant toute décision de destruction.",
      "Le texte fixe la durée d'utilité à dix ans, non à cinquante ans."
    ],
    explanation: "Après 10 ans, le texte opère un tri : les dossiers sans intérêt remarquable font l'objet d'une élimination réglementée.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-text-043",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "inference",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 85,
    prompt: "Quelle limite méthodologique ce bilan relève-t-il explicitement dans l'évaluation de la formation ?",
    stimulus: "Bilan annuel du plan de formation : Le taux de satisfaction à chaud recueilli auprès des participants atteint 92 %, témoignant de la qualité de l'accueil et de l'animation. Toutefois, en l'absence d'indicateurs de suivi sur le poste de travail à six mois, il demeure impossible de mesurer l'impact réel des acquis sur la performance des services.",
    options: [
      "Le défaut de mesure à froid empêche d'évaluer le transfert sur le terrain.",
      "Le taux de satisfaction des stagiaires a chuté au cours de l'exercice.",
      "Les formateurs recrutés manquaient de compétences d'animation de groupe.",
      "L'évaluation a été réalisée trop tardivement après la tenue des cours."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : l'absence d'indicateurs de suivi à six mois empêche de mesurer l'impact professionnel.",
      "La satisfaction est très élevée (92 %) et n'a pas chuté.",
      "L'animation et la qualité d'accueil sont saluées dans le rapport.",
      "L'évaluation à chaud a eu lieu immédiatement, c'est l'évaluation différée qui fait défaut."
    ],
    explanation: "Le texte pointe expressément l'incapacité à mesurer l'impact pratique faute d'indicateurs de suivi à moyen terme (6 mois) sur le poste.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-text-044",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "comprehension",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 75,
    prompt: "D'après cette directive, quelle formalité conditionne le recours aux heures supplémentaires ?",
    stimulus: "Directive sur le temps de travail : Le recours aux heures supplémentaires présente un caractère exceptionnel dicté par la continuité du service public. Aucune heure supplémentaire ne peut ouvrir droit à rémunération ou repos compensateur sans l'accord écrit préalable du chef de département, sollicité au moins quarante-huit heures avant l'intervention programmée.",
    options: [
      "Une autorisation écrite préalable obtenue au moins 48 heures avant.",
      "Une validation orale du délégué du personnel intervenue la veille.",
      "Une simple déclaration a posteriori lors de la saisie des présences.",
      "Une concertation syndicale organisée dans le mois civil précédent."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : le texte stipule l'accord écrit préalable sollicité au moins 48h en amont.",
      "L'accord doit être écrit et émaner du chef de département, non oral d'un délégué.",
      "La déclaration a posteriori est expressément écartée par l'exigence préalable.",
      "Le texte ne fait pas mention d'une concertation syndicale mensuelle."
    ],
    explanation: "La condition formelle impérative est l'accord écrit préalable du chef de département avec un préavis d'au moins 48 heures.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-text-045",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "synthese",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 70,
    prompt: "Quel est l'objet principal du dispositif décrit dans cet avis ?",
    stimulus: "Avis relatif au guichet d'écoute interne : Afin de préserver la santé psychologique au travail, une cellule d'écoute pluridisciplinaire externe a été mise en place. Elle offre à chaque agent qui en ressent le besoin un accompagnement neutre et protégé en dehors de toute voie hiérarchique.",
    options: [
      "Offrir un soutien psychologique neutre et extérieur à la hiérarchie.",
      "Remplacer les procédures disciplinaires par une médiation amiable.",
      "Évaluer annuellement l'état de santé physique de tous les fonctionnaires.",
      "Sanctionner les manquements managériaux constatés dans les services."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : le but est un soutien psychologique neutre, réservé et externe.",
      "Le dispositif concerne la santé psychologique et non les sanctions disciplinaires.",
      "Il s'agit d'un accompagnement volontaire et non d'une évaluation médicale obligatoire.",
      "La cellule n'a aucun pouvoir disciplinaire ni de sanction managériale."
    ],
    explanation: "Le texte résume le rôle de la cellule : fournir un espace d'écoute et d'accompagnement psychologique indépendant de la ligne hiérarchique.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-text-046",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "comprehension",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 75,
    prompt: "Selon le texte, quand prend effet une délégation de signature accordée par arrêté ministériel ?",
    stimulus: "Organisation administrative : Les délégations de signature consenties par le ministre à des directeurs d'administration prennent effet dès leur publication au Mémorial. Elles cessent de plein droit de produire leurs effets dès la cessation des fonctions du délégant ou du délégataire, sans qu'un acte de révocation spécifique ne soit requis.",
    options: [
      "Dès la publication officielle de l'arrêté ministériel au Mémorial.",
      "Dès la signature formelle du document en cabinet par le ministre.",
      "Au premier jour ouvré du mois suivant la décision de nomination.",
      "Après approbation explicite du Conseil d'État réuni en séance."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : le texte dispose qu'elles prennent effet dès leur publication au Mémorial.",
      "La signature seule ne suffit pas, la publication au Mémorial est nécessaire.",
      "Le premier jour du mois suivant n'est mentionné nulle part dans l'extrait.",
      "Le texte ne requiert pas l'avis du Conseil d'État pour l'entrée en vigueur."
    ],
    explanation: "Le texte énonce clairement que l'entrée en vigueur de la délégation est subordonnée à sa publication au Mémorial.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-text-047",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "inference",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 80,
    prompt: "Que peut-on inférer quant à la validité d'une décision prise sous délégation après le départ du ministre ?",
    stimulus: "Organisation administrative : Les délégations de signature consenties par le ministre à des directeurs d'administration prennent effet dès leur publication au Mémorial. Elles cessent de plein droit de produire leurs effets dès la cessation des fonctions du délégant ou du délégataire, sans qu'un acte de révocation spécifique ne soit requis.",
    options: [
      "La délégation étant caduque, toute décision signée serait entachée d'incompétence.",
      "La délégation reste valable pendant une période transitoire de trois mois pleins.",
      "Le directeur peut continuer à signer tant qu'un successeur n'est pas installé.",
      "La décision reste juridiquement couverte par le principe de continuité de l'État."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : cessant de plein droit au départ du délégant, le signataire perd sa compétence.",
      "Le texte ne prévoit aucun délai de grâce ou période transitoire de trois mois.",
      "La cessation est immédiate de plein droit au départ du ministre.",
      "Le texte précise l'extinction de plein droit, ce qui prive le délégataire de signature valide."
    ],
    explanation: "La délégation de signature étant attachée à la personne du délégant, la cessation de ses fonctions rend caduque la délégation immédiatement et de plein droit.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-text-048",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "inference",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 85,
    prompt: "Quelle tension entre deux objectifs publics ce passage met-il en évidence ?",
    stimulus: "Politique de passation dématérialisée : L'abaissement des seuils de publicité obligatoire renforce la concurrence et la transparence des dépenses de l'État. Néanmoins, la multiplication des charges documentaires imposées pour les marchés de faible montant dissuade fréquemment les très petites entreprises locales de soumissionner.",
    options: [
      "La conciliation entre transparence publique et accessibilité des PME aux marchés.",
      "Le choix entre la dématérialisation totale et le retour aux offres sous pli papier.",
      "Le conflit entre la réduction budgétaire globale et le maintien des investissements.",
      "La rivalité entre prestataires régionaux et entreprises internationales du secteur."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : le texte oppose la recherche de transparence aux contraintes administratives qui freinent les TPE.",
      "Le texte ne préconise nullement un retour aux offres sous pli papier.",
      "La tension décrite porte sur les formalités et la concurrence, non sur l'austérité budgétaire.",
      "Le texte traite du fardeau administratif local et non d'une rivalité internationale."
    ],
    explanation: "L'extrait montre que si la transparence s'accroît, la lourdeur des procédures écarte involontairement les petites entreprises artisanales ou locales.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-text-049",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "comprehension",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 70,
    prompt: "Selon l'extrait de règlement, dans quel délai une décision de refus d'accès doit-elle être notifiée ?",
    stimulus: "Transparence administrative : Toute décision refusant l'accès à un document administratif doit être motivée en droit et en fait. Elle est notifiée au demandeur dans un délai maximal de trente jours à compter de la réception de sa requête initiale. Le silence gardé par l'autorité compétente au-delà de ce terme vaut décision implicite de rejet.",
    options: [
      "Trente jours au plus tard après la réception du dossier initial.",
      "Quinze jours ouvrables suivant l'examen préalable en commission.",
      "Deux mois civils à compter de la décision formelle de rejet.",
      "Soixante jours après avis conforme du collège des médiateurs."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : le texte fixe expressément le délai maximal de notification à trente jours.",
      "Le délai de quinze jours ne figure pas dans le texte.",
      "Le délai de deux mois contredit le délai légal explicite de trente jours.",
      "Aucun collège de médiateurs n'est mentionné dans ce passage."
    ],
    explanation: "Le texte précise que la notification du refus doit intervenir dans un délai maximal de trente jours suivant la réception de la demande.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-text-050",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "inference",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 80,
    prompt: "Que peut déduire le citoyen dont la demande n'a reçu aucune réponse après quarante jours ?",
    stimulus: "Transparence administrative : Toute décision refusant l'accès à un document administratif doit être motivée en droit et en fait. Elle est notifiée au demandeur dans un délai maximal de trente jours à compter de la réception de sa requête initiale. Le silence gardé par l'autorité compétente au-delà de ce terme vaut décision implicite de rejet.",
    options: [
      "Sa demande fait l'objet d'une décision implicite de refus opposable.",
      "Sa requête est considérée comme tacitement accordée par l'administration.",
      "Le délai de traitement est automatiquement prolongé d'un trimestre.",
      "L'administration est déchue de son droit d'examiner le dossier soumis."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : au-delà de 30 jours, le silence vaut légalement décision implicite de rejet.",
      "Le silence vaut refus et non accord tacite.",
      "Aucune prorogation trimestrielle automatique n'est prévue.",
      "L'administration n'est pas déchue, le rejet implicite ouvre simplement la voie aux recours."
    ],
    explanation: "Le terme de 30 jours étant dépassé, la règle du texte stipule explicitement que le silence vaut décision implicite de rejet.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-text-051",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "synthese",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 75,
    prompt: "Quelle est la finalité première de l'inventaire annuel selon cette consigne budgétaire ?",
    stimulus: "Gestion du patrimoine mobilier : L'inventaire physique annuel a pour fonction première de rapprocher l'état matériel réel des immobilisations avec les inscriptions figurant au grand livre des comptes. Cette confrontation permet de constater les dépréciations, de réformer les matériels obsolètes et d'ajuster les écritures comptables avant la clôture annuelle.",
    options: [
      "Assurer la concordance entre les biens réels et les données comptables.",
      "Vendre aux enchères la totalité des matériels âgés de plus de cinq ans.",
      "Sanctionner pécuniairement les agents ayant égaré du matériel de bureau.",
      "Établir le budget prévisionnel des achats de l'exercice quinquennal."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : rapprocher l'état matériel des inscriptions comptables est la mission première indiquée.",
      "Le texte parle de réformer les matériels obsolètes, non d'une vente totale systématique.",
      "Le texte ne mentionne aucune sanction financière individuelle des agents.",
      "L'inventaire vise la régularité de la clôture annuelle, non la prospective quinquennale."
    ],
    explanation: "La fonction première explicitement donnée est le rapprochement entre la réalité physique des biens et les registres de la comptabilité générale.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-text-052",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "comprehension",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 70,
    prompt: "Selon ce protocole d'hygiène et de sécurité, qui doit consigner tout incident sur le registre de sécurité ?",
    stimulus: "Santé et sécurité : Tout agent témoin d'une défaillance matérielle susceptible de compromettre l'intégrité physique du personnel ou des usagers est tenu d'en aviser sans délai le délégué à la sécurité du bâtiment. Ce dernier procède à l'inscription circonstanciée de l'événement dans le registre de sécurité dans les deux heures.",
    options: [
      "Le délégué à la sécurité du bâtiment après avoir reçu le signalement.",
      "L'agent témoin lui-même directement sur le registre informatisé du siège.",
      "Le directeur d'administration générale lors de son inspection mensuelle.",
      "Le médecin du travail au cours de la commission paritaire de prévention."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : c'est le délégué à la sécurité qui inscrit l'événement dans le registre.",
      "L'agent témoin alerte le délégué, mais n'inscrit pas lui-même l'incident au registre.",
      "Le directeur d'administration n'intervient pas dans cette inscription opérationnelle.",
      "Le médecin du travail n'est pas désigné pour tenir le registre d'incident immédiat."
    ],
    explanation: "Le texte distingue les rôles : l'agent signale, puis le délégué à la sécurité consigne l'événement dans le registre sous deux heures.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-text-053",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "comprehension",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 75,
    prompt: "Quelle proposition s'insère le plus harmonieusement pour compléter la réflexion économique ?",
    stimulus: "Transition énergétique des bâtiments publics : La rénovation thermique globale des cités administratives engendre des coûts initiaux d'investissement très substantiels. Toutefois, en réduisant la facture d'exploitation de près de 35 % dès la cinquième année, [...]",
    options: [
      "ces opérations s'avèrent hautement rentables sur l'ensemble de leur cycle.",
      "les pouvoirs publics envisagent l'abandon pur et simple des programmes verts.",
      "les dépenses énergétiques continuent d'augmenter inexorablement chaque saison.",
      "le confort thermique des usagers se trouve irrémédiablement dégradé en hiver."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : cohérent avec l'opposition 'Toutefois' introduisant la rentabilité à terme du projet.",
      "Incohérent : l'économie de 35 % ne justifie en rien un abandon du programme.",
      "Incohérent : une baisse de 35 % contredit l'idée d'une augmentation inexorable.",
      "Incohérent : la rénovation thermique vise à améliorer le confort et non à le dégrader."
    ],
    explanation: "Le connecteur d'opposition 'Toutefois' annonce que l'économie substantielle d'exploitation (35 %) compense l'investissement initial à long terme.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-text-054",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "inference",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 85,
    prompt: "Quel biais potentiel l'auteur identifie-t-il dans les résultats du sondage d'opinion ?",
    stimulus: "Consultation citoyenne : L'enquête en ligne relative au plan de mobilité urbaine a recueilli plus de dix mille contributions favorables au développement des pistes cyclables. Cependant, la diffusion exclusive du questionnaire via les réseaux sociaux a fortement sous-représenté les résidents de plus de soixante-cinq ans et les ménages ruraux non motorisés.",
    options: [
      "Le canal numérique exclusif a créé un biais d'échantillonnage démographique.",
      "Le nombre total de répondants était statistiquement insuffisant pour conclure.",
      "Les questions posées orientaient ouvertement le vote vers les transports lourds.",
      "Les participants ont formulé des réponses contradictoires lors des entretiens."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : la diffusion web exclusive a exclu les aînés et les ruraux (biais de sélection).",
      "Dix mille contributions forment un volume élevé, l'insuffisance ne vient pas du nombre brut.",
      "Le texte ne mentionne aucune orientation artificielle dans le libellé des questions.",
      "L'enquête était un questionnaire en ligne et non des entretiens contradictoires."
    ],
    explanation: "Le texte souligne le biais de représentativité induit par le mode exclusif de collecte numérique qui a marginalisé certaines tranches de population.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-text-055",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "comprehension",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 70,
    prompt: "D'après les prescriptions de ce guide, quel document doit impérativement accompagner une commande de fournitures ?",
    stimulus: "Exécution des dépenses publiques : Tout bon de commande adressé à un fournisseur tiers doit être obligatoirement assorti de l'engagement comptable préalable validé par le contrôleur financier. Tout bon expédié sans ce visa d'engagement préalable est frappé de nullité juridique et n'engage pas les deniers de l'État.",
    options: [
      "Le visa de l'engagement comptable validé par le contrôleur financier.",
      "Le récépissé de livraison contresigné par le magasinier du ministère.",
      "La décision d'attribution publiée au Journal officiel des marchés.",
      "L'attestation de conformité fiscale émise par le receveur communal."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : l'engagement comptable visé par le contrôleur est obligatoire sous peine de nullité.",
      "Le récépissé de livraison n'intervient qu'après la commande, lors de la réception.",
      "La publication au Journal officiel ne concerne pas chaque bon de commande unitaire.",
      "L'attestation fiscale n'est pas le document de visa prescrit pour valider la commande."
    ],
    explanation: "Le texte pose comme condition d'opposabilité et de validité du bon de commande la présence du visa préalable d'engagement comptable.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-text-056",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "inference",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 75,
    prompt: "Que se produit-il si un fournisseur honore une commande dépourvue du visa d'engagement requis ?",
    stimulus: "Exécution des dépenses publiques : Tout bon de commande adressé à un fournisseur tiers doit être obligatoirement assorti de l'engagement comptable préalable validé par le contrôleur financier. Tout bon expédié sans ce visa d'engagement préalable est frappé de nullité juridique et n'engage pas les deniers de l'État.",
    options: [
      "L'État n'est pas juridiquement tenu d'honorer le paiement de la facture.",
      "Le fournisseur est automatiquement indemnisé par un fonds d'assurance.",
      "Le paiement est liquidé en urgence avec application d'intérêts moratoires.",
      "Le contrôleur financier valide rétroactivement la facture présentée."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : la commande étant juridiquement nulle, elle n'engage pas les deniers publics.",
      "Aucun fonds de garantie ou d'indemnisation automatique n'est prévu par la règle.",
      "Le paiement ne peut pas être ordonnancé d'urgence pour un bon nul.",
      "Le texte n'autorise pas de validation rétroactive d'office."
    ],
    explanation: "La nullité juridique de la commande délie la collectivité publique de son engagement financier légal envers le cocontractant.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-text-057",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "synthese",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 70,
    prompt: "Quelle est l'idée directrice exprimée dans cette note sur le télétravail ?",
    stimulus: "Charte du travail hybride : Le travail à distance ne saurait être conçu comme une simple juxtaposition de journées solitaires, mais comme une modalité d'organisation exigeant une redéfinition concertée des temps collectifs. La préservation de la cohésion d'équipe requiert d'instaurer des rituels partagés et des journées de présence commune obligatoires.",
    options: [
      "Le travail hybride nécessite des moments collectifs pour maintenir le lien.",
      "Le télétravail intégral à domicile constitue l'unique avenir des services.",
      "Les agents en télétravail doivent rester connectés en continu sans pause.",
      "La cohésion d'équipe est spontanément garantie sans régulation formelle."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : le texte affirme la nécessité de moments collectifs et de rituels partagés.",
      "Le texte préconise des journées communes et s'oppose à l'isolement complet.",
      "La note traite de la cohésion d'équipe et non d'une surveillance continue sans pause.",
      "Le texte soutient l'inverse : la régulation et les rituels formels sont indispensables."
    ],
    explanation: "La note défend l'idée qu'une organisation hybride réussie doit organiser délibérément la présence collective pour éviter l'effritement de l'esprit d'équipe.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-text-058",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "comprehension",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 75,
    prompt: "Selon ce règlement de concours, quelle note à une épreuve éliminatoire exclut le candidat de la suite des épreuves ?",
    stimulus: "Organisation des épreuves d'accès : Les candidats subissent trois épreuves écrites d'admissibilité notées de 0 à 20. Toute note strictement inférieure à 8 sur 20 à l'une quelconque de ces épreuves est éliminatoire, quand bien même la moyenne générale des trois notes atteindrait ou dépasserait le seuil d'admissibilité de 10 sur 20.",
    options: [
      "Une note de 7 sur 20 à une des épreuves écrites.",
      "Une note de 8 sur 20 obtenue lors de la première épreuve.",
      "Une moyenne arithmétique globale égale à 11 sur 20 points.",
      "Une note de 9 sur 20 attribuée par un correcteur sévère."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : 7 est strictement inférieur à 8 sur 20, ce qui entraîne l'élimination directe.",
      "La note 8 n'est pas strictement inférieure à 8, elle n'est donc pas éliminatoire.",
      "Une moyenne de 11 dépasse le seuil requis de 10 sur 20.",
      "La note 9 est supérieure au plancher éliminatoire de 8."
    ],
    explanation: "La condition éliminatoire est définie par 'strictement inférieure à 8 sur 20'. Une note de 7 entre directement dans ce cas d'élimination.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-text-059",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "inference",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 80,
    prompt: "Que peut-on inférer sur un candidat ayant obtenu les notes de 8, 8 et 14 aux trois épreuves écrites ?",
    stimulus: "Organisation des épreuves d'accès : Les candidats subissent trois épreuves écrites d'admissibilité notées de 0 à 20. Toute note strictement inférieure à 8 sur 20 à l'une quelconque de ces épreuves est éliminatoire, quand bien même la moyenne générale des trois notes atteindrait ou dépasserait le seuil d'admissibilité de 10 sur 20.",
    options: [
      "Il est admissible car sa moyenne est de 10 et aucune note n'est éliminatoire.",
      "Il est éliminé d'office car deux de ses notes se situent sous la moyenne.",
      "Il doit repasser obligatoirement les deux épreuves où il a obtenu 8 sur 20.",
      "Son admission dépend d'un entretien de rattrapage fixé par le jury."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : moyenne (8+8+14)/3 = 30/3 = 10,0/20 ; aucune note n'étant < 8, il est admissible.",
      "Avoir une note sous 10 n'est pas éliminatoire tant qu'elle n'est pas strictement < 8.",
      "Le règlement ne prévoit pas d'épreuve de repêchage écrite.",
      "L'admissibilité est automatique dès lors que la moyenne est atteinte sans note éliminatoire."
    ],
    explanation: "La moyenne arithmétique est de (8 + 8 + 14) / 3 = 10/20, atteignant le seuil. Aucune note n'étant strictement inférieure à 8, le candidat franchit l'admissibilité.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-text-060",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "inference",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 85,
    prompt: "Sur quel constat s'appuie la critique formulée à l'égard de la gestion prévisionnelle des effectifs ?",
    stimulus: "Rapport d'orientation sur la gestion des ressources humaines : Les plans prévisionnels de recrutement se concentrent quasi exclusivement sur le remplacement numérique des départs à la retraite. Cette focalisation quantitative occulte l'évolution qualitative rapide des compétences induite par l'intelligence artificielle et la dématérialisation.",
    options: [
      "La priorité aux départs quantitatifs néglige les besoins qualitatifs futurs.",
      "Le nombre d'agents partant à la retraite a été largement sous-estimé.",
      "L'intelligence artificielle rend obsolète tout recrutement de fonctionnaires.",
      "Les budgets alloués à la masse salariale ont augmenté de façon excessive."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : le rapport reproche une approche purement volumétrique au détriment des compétences.",
      "Le rapport ne conteste pas le décompte des départs, mais l'angle d'analyse retenu.",
      "Le texte n'affirme nullement que les recrutements doivent cesser avec l'IA.",
      "La critique porte sur la typologie des compétences, non sur la masse salariale."
    ],
    explanation: "La critique centrale de l'audit réside dans le décalage entre une logique de remplacement poste pour poste et l'émergence de nouveaux métiers requérant d'autres profils.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-text-061",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "comprehension",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 75,
    prompt: "Selon le texte, quelle est la sanction encourue par un agent qui enfreint l'obligation de discrétion professionnelle ?",
    stimulus: "Devoir de réserve et de discrétion : Les agents publics sont tenus au secret sur les faits et informations dont ils ont connaissance dans l'exercice de leurs fonctions. Toute divulgation non autorisée d'actes protégés expose son auteur à des sanctions disciplinaires pouvant aller jusqu'à la révocation, sans préjudice de poursuites pénales.",
    options: [
      "Des peines disciplinaires pouvant s'étendre jusqu'à la révocation de l'emploi.",
      "Une mutation d'office systématique dans un service situé hors de la capitale.",
      "Une suspension temporaire de solde limitée à un mois sans autre sanction.",
      "Le versement automatique de dommages et intérêts au bénéfice de l'État."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : le texte mentionne expressément des sanctions disciplinaires allant jusqu'à la révocation.",
      "La mutation d'office n'est pas présentée comme la sanction systématique exclusive.",
      "La suspension d'un mois ne constitue pas le plafond de sanction prévu.",
      "Le texte évoque des poursuites pénales mais pas de versement automatique direct à l'État."
    ],
    explanation: "L'extrait précise explicitement l'échelle maximale encourue : sanctions disciplinaires pouvant aller jusqu'à la révocation, avec poursuites pénales éventuelles.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-text-062",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "comprehension",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 70,
    prompt: "Quelle proposition s'insère le plus logiquement pour clore ce paragraphe administratif ?",
    stimulus: "Gestion de l'archivage électronique : La pérennité des documents administratifs numériques repose sur l'utilisation de formats de stockage ouverts et standardisés. Les formats propriétaires exposent les services à un risque majeur d'obsolescence logicielle. Dès lors, [...]",
    options: [
      "l'adoption exclusive de standards ouverts garantit l'accès aux données futures.",
      "il est vivement recommandé d'imprimer tous les fichiers sur support papier.",
      "l'acquisition de logiciels propriétaires fermés doit être généralisée à l'État.",
      "les archives historiques n'ont plus vocation à être conservées au-delà d'un an."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : s'inscrit en continuité directe de la mise en garde contre l'obsolescence des formats propriétaires.",
      "La solution préconisée n'est pas le tout-papier mais l'usage de formats ouverts pérennes.",
      "Contredit formellement la mise en garde contre les formats propriétaires.",
      "Contredit le principe même de pérennité des archives administratives."
    ],
    explanation: "La logique argumentative oppose formats propriétaires (risqués) et formats ouverts ; la conclusion logique est de préconiser les standards ouverts.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-text-063",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "synthese",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 75,
    prompt: "Quel est le but central de la démarche d'éco-responsabilité exposée dans cette circulaire ?",
    stimulus: "Plan d'action pour des administrations durables : La politique d'éco-responsabilité vise à intégrer systématiquement des critères environnementaux stricts dans l'ensemble des marchés de fournitures, de travaux et de restauration collective. Elle entend réduire l'empreinte carbone globale du secteur public tout en stimulant la filière économique verte régionale.",
    options: [
      "Diminuer l'empreinte carbone publique tout en stimulant l'économie verte.",
      "Réduire unilatéralement les rations de repas dans les cantines scolaires.",
      "Interdire tout achat de matériel informatique neuf au sein de l'État.",
      "Résilier l'ensemble des contrats passés avec les fournisseurs régionaux."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : synthétise le double objectif explicite (réduction de l'empreinte carbone et soutien à la filière verte).",
      "Le texte ne préconise pas de réduire les portions de repas mais d'intégrer des critères verts.",
      "Le texte n'interdit pas l'achat d'ordinateurs neufs.",
      "Le texte veut stimuler la filière régionale, non rompre les liens avec elle."
    ],
    explanation: "Le texte pose un double objectif clair : exemplarité écologique par la réduction de l'empreinte carbone et effet d'entraînement de la commande publique sur les circuits régionaux vertueux.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-text-064",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "comprehension",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 70,
    prompt: "Selon ce protocole, quelle condition autorise l'accès d'un auditeur externe à des pièces sensibles ?",
    stimulus: "Sécurité des systèmes d'information : Tout intervenant extérieur chargé d'une mission d'audit informatique ne peut accéder aux serveurs hébergeant des données administratives sensibles qu'après signature d'un engagement formel de réserve et sous la surveillance permanente d'un responsable habilité du ministère.",
    options: [
      "La signature d'un engagement de réserve et la présence continue d'un agent habilité.",
      "Une simple demande verbale validée par le technicien de permanence en régie.",
      "La présentation d'une carte d'identité professionnelle délivrée par l'entreprise.",
      "L'obtention d'une dérogation spéciale votée à l'unanimité par le Parlement."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : les deux conditions cumulatives prévues sont l'engagement de réserve et la surveillance continue.",
      "Une autorisation verbale informelle est expressément prohibée par le protocole.",
      "La carte professionnelle est insuffisante pour déroger à la procédure sécurisée.",
      "Aucun vote parlementaire n'est requis pour une mission d'audit opérationnelle."
    ],
    explanation: "Le texte impose deux conditions cumulatives strictes : un engagement écrit formel de réserve et la présence ininterrompue d'un agent ministériel habilité.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-text-065",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "inference",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 80,
    prompt: "Que peut-on conclure sur un auditeur qui refuserait de signer l'engagement de réserve ?",
    stimulus: "Sécurité des systèmes d'information : Tout intervenant extérieur chargé d'une mission d'audit informatique ne peut accéder aux serveurs hébergeant des données administratives sensibles qu'après signature d'un engagement formel de réserve et sous la surveillance permanente d'un responsable habilité du ministère.",
    options: [
      "L'accès aux serveurs hébergeant les données sensibles lui est interdit.",
      "Il peut effectuer son audit à distance sans aucune restriction d'accès.",
      "Un responsable ministériel signe la décharge de sécurité à sa place.",
      "L'audit est reporté d'un an sans conséquence pour l'entreprise mandataire."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : l'accès n'étant autorisé 'qu'après signature', le refus entraîne le blocage immédiat de l'accès.",
      "L'accès distant sans restriction violerait plus gravement encore la sécurité.",
      "Un tiers ne peut pas signer un engagement de responsabilité personnelle à sa place.",
      "Le texte ne prévoit pas de report automatique d'un an sans conséquence contractuelle."
    ],
    explanation: "La formulation 'ne peut accéder (...) qu'après signature' subordonne strictement tout accès à cette formalité obligatoire. Sans elle, l'accès est refusé.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  }
];
