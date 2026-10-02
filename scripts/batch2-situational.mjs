/**
 * Batch 2: Situational Judgment items 036 to 065 (30 items)
 * Skills: conseiller, servir-client-usager
 * Item format: rating (1-4 scale, correctIndex: 0, exactly one 4 at index 0, >= 3 distinct ratings)
 * Zero forbidden words (no 'confidentiel*', no 'barème officiel').
 * Strict length balancing: max option length <= 1.35 * min option length.
 */

const NOW = new Date().toISOString();
const REVIEWER = "hdjebar";

export const situationalBatch2 = [
  {
    id: "situational-scen-036",
    version: 1,
    category: "situational",
    itemFormat: "rating",
    skill: "conseiller",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 85,
    prompt: "Évaluez la pertinence de chaque réaction dans ce contexte.",
    stimulus: "Vous êtes membre de la commission d'évaluation d'un marché public de conseil de 400 000 euros. Le directeur d'un cabinet candidat vous invite personnellement à déjeuner.",
    options: [
      "Décliner poliment l'invitation en rappelant l'obligation de stricte neutralité de la commission.",
      "Accepter ce déjeuner afin d'obtenir des éclaircissements utiles sur l'offre technique déposée.",
      "Transmettre l'invitation à un autre collègue du pôle sans justifier le motif de ce transfert.",
      "Ignorer totalement l'invitation sans y répondre ni informer votre supérieur hiérarchique direct."
    ],
    correctIndex: 0,
    ratings: [4, 1, 2, 3],
    optionRationales: [
      "Efficacité 4/4 : rappel professionnel des règles déontologiques et préservation de l'égalité de traitement.",
      "Efficacité 1/4 : faute déontologique grave rompant l'égalité des candidats et créant un conflit d'intérêts.",
      "Efficacité 2/4 : défausse le problème sur un tiers sans régler le manquement déontologique.",
      "Efficacité 3/4 : refuse l'invitation de fait mais manque de pédagogie institutionnelle et de transparence."
    ],
    explanation: "Pendant une procédure de marché public, l'impartialité absolue interdit tout contact informel ou avantage en nature d'un candidat. Il convient de décliner par écrit en rappelant le cadre réglementaire.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "situational-scen-037",
    version: 1,
    category: "situational",
    itemFormat: "rating",
    skill: "servir-client-usager",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 80,
    prompt: "Évaluez la pertinence de chaque réaction dans ce contexte.",
    stimulus: "La tension monte entre deux agents expérimentés. Chacun soutient avoir déjà assuré les permanences l'an dernier et refuse catégoriquement celle du réveillon.",
    options: [
      "Réunir les deux agents pour examiner l'historique et bâtir ensemble un compromis équitable.",
      "Prendre parti pour le plus ancien en considérant ses nombreuses années de service accomplies.",
      "Imposer sans discussion un tirage au sort immédiat en refusant d'écouter leurs arguments.",
      "Laisser la situation s'envenimer en considérant que le désaccord s'éteindra de lui-même."
    ],
    correctIndex: 0,
    ratings: [4, 1, 3, 2],
    optionRationales: [
      "Efficacité 4/4 : posture médiatrice constructive fondée sur des faits objectifs et le dialogue.",
      "Efficacité 1/4 : partialité injustifiée créant un sentiment d'injustice chez l'autre collaborateur.",
      "Efficacité 3/4 : règle le problème rapidement mais frustre les agents en ignorant les efforts passés.",
      "Efficacité 2/4 : passivité managériale risquant de bloquer le fonctionnement du service pendant les fêtes."
    ],
    explanation: "La gestion d'un conflit opérationnel sur les astreintes nécessite une base factuelle vérifiable (tableau des gardes passées) et une démarche de concertation équitable.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "situational-scen-038",
    version: 1,
    category: "situational",
    itemFormat: "rating",
    skill: "conseiller",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 90,
    prompt: "Évaluez la pertinence de chaque réaction dans ce contexte.",
    stimulus: "L'usager refuse de fournir un justificatif de domicile obligatoire, affirmant qu'il réside dans la commune depuis trente ans. Il s'énerve devant les autres administrés.",
    options: [
      "Garder son calme, rappeler la règle commune et proposer une transmission différée du papier.",
      "Céder à sa demande immédiate pour éviter tout incident ou scandale dans la salle d'attente.",
      "Rétorquer sur le même ton agressif et menacer d'appeler immédiatement les forces de police.",
      "Refuser net de continuer l'échange et fermer immédiatement le rideau du guichet au public."
    ],
    correctIndex: 0,
    ratings: [4, 1, 1, 2],
    optionRationales: [
      "Efficacité 4/4 : maîtrise de soi, pédagogie sur la règle républicaine et orientation constructive.",
      "Efficacité 1/4 : illégalité administrative rompant l'égalité des usagers devant les exigences légales.",
      "Efficacité 1/4 : attitude non professionnelle aggravant l'esclandre au lieu de le désamorcer.",
      "Efficacité 2/4 : interrompt brutalement le service public et pénalise les autres usagers en attente."
    ],
    explanation: "Face à un usager mécontent, l'agent public doit garder son sang-froid, faire preuve de fermeté bienveillante sur la règle légale, et offrir une alternative pratique pour compléter le dossier.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "situational-scen-039",
    version: 1,
    category: "situational",
    itemFormat: "rating",
    skill: "conseiller",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 80,
    prompt: "Évaluez la pertinence de chaque réaction dans ce contexte.",
    stimulus: "Vous remarquez qu'un agent récemment recruté passe de longues minutes bloqué sur des saisies courantes et n'ose pas solliciter de l'aide auprès du responsable.",
    options: [
      "Lui proposer un temps d'entraide pour lui transmettre les raccourcis et méthodes du logiciel.",
      "Signaler immédiatement son incompétence apparente au chef de service pour qu'il soit recadré.",
      "Effectuer l'intégralité de ses saisies à sa place sans lui expliquer la logique du système.",
      "Ignorer ses difficultés car chacun est responsable exclusif de la charge qui lui est confiée."
    ],
    correctIndex: 0,
    ratings: [4, 1, 2, 2],
    optionRationales: [
      "Efficacité 4/4 : solidarité professionnelle favorisant la montée en compétence pérenne de l'équipe.",
      "Efficacité 1/4 : attitude déloyale qui détruit la confiance d'un nouvel arrivant sans l'avoir soutenu.",
      "Efficacité 2/4 : soulage ponctuellement mais n'autonomise pas le collègue et alourdit votre charge.",
      "Efficacité 2/4 : individualisme nuisible à la cohésion et à la performance globale du service."
    ],
    explanation: "L'accompagnement par les pairs lors de la prise de poste est un pilier de la culture de service public. Proposer un temps d'entraide permet d'autonomiser le collègue rapidement.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "situational-scen-040",
    version: 1,
    category: "situational",
    itemFormat: "rating",
    skill: "conseiller",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 85,
    prompt: "Évaluez la pertinence de chaque réaction dans ce contexte.",
    stimulus: "Un journaliste vous appelle sur votre ligne directe pour savoir 'ce que pensent réellement les agents sur le terrain' des réformes administratives annoncées.",
    options: [
      "L'orienter avec courtoisie vers le service de presse, seul habilité à communiquer officiellement.",
      "Lui livrer sans filtre vos opinions personnelles en lui demandant de ne pas citer votre identité.",
      "Prendre note de ses questions pour les transmettre au chef de service avant toute réponse écrite.",
      "Lui raccrocher au nez sans un mot pour marquer votre désaccord face à sa démarche directe."
    ],
    correctIndex: 0,
    ratings: [4, 1, 3, 2],
    optionRationales: [
      "Efficacité 4/4 : respect rigoureux du devoir de réserve et orientation vers le canal de communication officiel.",
      "Efficacité 1/4 : violation grave du devoir de réserve et risque élevé de manipulation médiatique.",
      "Efficacité 3/4 : attitude prudente mais le canal approprié demeure le service de presse institutionnel.",
      "Efficacité 2/4 : manque de courtoisie administrative dégradant l'image des services publics."
    ],
    explanation: "Les relations avec la presse sont strictement régies par des procédures centralisées. Un agent public n'est pas habilité à s'exprimer dans les médias sans mandat de sa hiérarchie.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "situational-scen-041",
    version: 1,
    category: "situational",
    itemFormat: "rating",
    skill: "conseiller",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 80,
    prompt: "Évaluez la pertinence de chaque réaction dans ce contexte.",
    stimulus: "Un ami vous demande de consulter le registre informatique pour lui fournir l'adresse d'un voisin avec lequel il est en litige, affirmant que c'est une simple formalité.",
    options: [
      "Refuser fermement en rappelant que l'accès aux registres est réservé aux missions de service.",
      "Consulter la fiche discrètement sans l'imprimer pour satisfaire sa demande sans laisser d'écrit.",
      "L'orienter vers les voies judiciaires régulières et le bureau d'aide juridique compétent.",
      "Lui prêter vos identifiants informatiques pour qu'il effectue lui-même la recherche demandée."
    ],
    correctIndex: 0,
    ratings: [4, 1, 3, 1],
    optionRationales: [
      "Efficacité 4/4 : respect absolu de la protection des données personnelles et de la probité de la fonction.",
      "Efficacité 1/4 : détournement illégal de fichier public tracé dans les journaux d'audit informatique.",
      "Efficacité 3/4 : conseil d'orientation utile rappelant le cadre légal sans enfreindre la déontologie.",
      "Efficacité 1/4 : faute professionnelle majeure de partage d'identifiants sécurisés."
    ],
    explanation: "Les agents publics ne peuvent utiliser les fichiers de l'État qu'à des fins strictement professionnelles et légitimes. Tout usage privé constitue une faute lourde passible de poursuites pénales.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "situational-scen-042",
    version: 1,
    category: "situational",
    itemFormat: "rating",
    skill: "conseiller",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 85,
    prompt: "Évaluez la pertinence de chaque réaction dans ce contexte.",
    stimulus: "Le bordereau de mandatement doit partir avant midi sous peine de pénalités de retard. Vous découvrez une erreur de calcul de 5 000 euros sur un état visé par votre chef.",
    options: [
      "Alerter immédiatement le supérieur avec l'état rectifié prêt à être validé en toute urgence.",
      "Corriger discrètement le montant au correcteur blanc sans solliciter de nouveau visa formel.",
      "Faire signer l'état rectifié par un collègue présent pour respecter le délai de transmission.",
      "Laisser partir le document erroné pour éviter de contrarier votre supérieur hiérarchique."
    ],
    correctIndex: 0,
    ratings: [4, 1, 2, 1],
    optionRationales: [
      "Efficacité 4/4 : loyauté, rigueur comptable et réactivité en apportant la solution clé en main.",
      "Efficacité 1/4 : falsification matérielle d'un document administratif officiel déjà visé.",
      "Efficacité 2/4 : démarche irrégulière car le collègue n'a pas délégation pour viser cette dépense.",
      "Efficacité 1/4 : complicité d'erreur financière et manquement au devoir de conseil et de contrôle."
    ],
    explanation: "La détection d'une anomalie financière impose d'informer immédiatement l'autorité signataire tout en proposant l'acte corrigé afin de concilier régularité comptable et respect des délais.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "situational-scen-043",
    version: 1,
    category: "situational",
    itemFormat: "rating",
    skill: "conseiller",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 75,
    prompt: "Évaluez la pertinence de chaque réaction dans ce contexte.",
    stimulus: "À chaque point d'étape, un collègue présente des excuses mais son livrable reste inachevé, obligeant les autres membres de l'équipe à compenser en urgence.",
    options: [
      "Avoir un entretien bilatéral pour identifier ses blocages et fixer une échéance impérative.",
      "L'exclure unilatéralement du projet sans l'en informer ni consulter le chef de service.",
      "Consigner les retards dans le relevé de projet pour transparence lors du prochain comité.",
      "Rédiger systématiquement ses parties à sa place sans jamais lui adresser de remarque."
    ],
    correctIndex: 0,
    ratings: [4, 1, 3, 2],
    optionRationales: [
      "Efficacité 4/4 : démarche constructive d'explicitation des causes combinée à une responsabilisation ferme.",
      "Efficacité 1/4 : mesure punitive unilatérale excédant vos compétences et détruisant l'esprit d'équipe.",
      "Efficacité 3/4 : assure la traçabilité factuelle sans agressivité, mais nécessite un dialogue préalable.",
      "Efficacité 2/4 : encourage l'irresponsabilité et épuise inutilement les autres collègues du projet."
    ],
    explanation: "Le traitement d'un désengagement nécessite d'abord un échange direct et bienveillant pour identifier d'éventuelles surcharges ou difficultés techniques, avant toute escalade hiérarchique.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "situational-scen-044",
    version: 1,
    category: "situational",
    itemFormat: "rating",
    skill: "conseiller",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 85,
    prompt: "Évaluez la pertinence de chaque réaction dans ce contexte.",
    stimulus: "Une entreprise titulaire d'un marché d'entretien fait livrer un coffret de grands vins à votre nom au bureau, avec un mot de remerciement pour votre collaboration.",
    options: [
      "Refuser le colis conformément aux directives de probité et d'intégrité de l'administration.",
      "Accepter le cadeau discrètement en le rapportant chez vous le soir même sans en parler.",
      "Faire enregistrer le colis au secrétariat général pour qu'il soit retourné au fournisseur.",
      "Partager les bouteilles avec vos collègues de bureau lors de la pause déjeuner du vendredi."
    ],
    correctIndex: 0,
    ratings: [4, 1, 3, 2],
    optionRationales: [
      "Efficacité 4/4 : respect rigoureux des règles déontologiques interdisant l'acceptation d'avantages de fournisseurs.",
      "Efficacité 1/4 : manquement déontologique direct créant une apparence d'influence ou de complaisance.",
      "Efficacité 3/4 : bonne démarche institutionnelle garantissant la traçabilité du refus officiel.",
      "Efficacité 2/4 : dilue la responsabilité mais reste contraire à la règle d'intégrité de la commande publique."
    ],
    explanation: "Les règles de déontologie publique proscrivent la réception de cadeaux de la part de partenaires économiques afin de préserver l'indépendance et l'impartialité de la décision publique.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "situational-scen-045",
    version: 1,
    category: "situational",
    itemFormat: "rating",
    skill: "conseiller",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 90,
    prompt: "Évaluez la pertinence de chaque réaction dans ce contexte.",
    stimulus: "Les agents de votre service expriment de la fatigue face à une surcharge imprévue et craignent de ne pas tenir les objectifs annuels fixés par la direction.",
    options: [
      "Hiérarchiser en équipe les priorités, différer l'accessoire et demander un renfort d'appui.",
      "Exiger que chacun double sa cadence de traitement sans modifier les priorités usuelles.",
      "Organiser un point hebdomadaire court pour redistribuer la charge selon les urgences du jour.",
      "Ignorer les doléances en affirmant que le dévouement au service exige le sacrifice personnel."
    ],
    correctIndex: 0,
    ratings: [4, 1, 3, 1],
    optionRationales: [
      "Efficacité 4/4 : régulation managériale équilibrée conjuguant écoute, repriorisation et alerte hiérarchique.",
      "Efficacité 1/4 : management autoritaire risquant de provoquer des arrêts maladie et des démissions.",
      "Efficacité 3/4 : action pragmatique utile qui soulage la pression sans toutefois solliciter de renfort.",
      "Efficacité 1/4 : déni de la réalité du travail et mépris de la santé des agents au travail."
    ],
    explanation: "Face à une surcharge conjoncturelle, le responsable doit agir comme régulateur : classer les priorités, éliminer les gaspillages de temps et faire remonter le besoin de ressources à sa hiérarchie.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "situational-scen-046",
    version: 1,
    category: "situational",
    itemFormat: "rating",
    skill: "conseiller",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 75,
    prompt: "Évaluez la pertinence de chaque réaction dans ce contexte.",
    stimulus: "Une rumeur infondée sur une baisse d'effectifs circule sur l'intranet. L'inquiétude monte parmi les agents et perturbe le bon déroulement du service.",
    options: [
      "Informer la direction générale pour qu'un communiqué officiel rétablisse la vérité des faits.",
      "Alimenter la rumeur en partageant vos propres spéculations alarmistes lors de la pause café.",
      "Rassurer individuellement vos collègues proches en attendant une communication hiérarchique.",
      "Publier sur un forum public un message anonyme dénonçant cette restructuration présumée."
    ],
    correctIndex: 0,
    ratings: [4, 1, 3, 1],
    optionRationales: [
      "Efficacité 4/4 : transmission responsable du signal pour permettre une communication officielle apaisante.",
      "Efficacité 1/4 : comportement toxique amplifiant le stress et la désorganisation du service.",
      "Efficacité 3/4 : attitude bienveillante de proximité mais insuffisante pour éteindre la rumeur globale.",
      "Efficacité 1/4 : initiative non maîtrisée violant la réserve et propageant de fausses informations."
    ],
    explanation: "Les rumeurs internes doivent être traitées avec promptitude par des canaux officiels et transparents de la direction pour rassurer les équipes et couper court aux fausses informations.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "situational-scen-047",
    version: 1,
    category: "situational",
    itemFormat: "rating",
    skill: "conseiller",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 75,
    prompt: "Évaluez la pertinence de chaque réaction dans ce contexte.",
    stimulus: "Le demandeur insiste pour que vous imitiez la signature du directeur absent, afin de ne pas perdre le bénéfice d'une subvention européenne majeure arrivant à échéance.",
    options: [
      "Refuser fermement et joindre sans délai le cabinet ministériel pour activer l'intérim légal.",
      "Imiter la signature du directeur pour rendre service et débloquer les crédits européens.",
      "Contacter le gestionnaire des subventions pour solliciter un report d'échéance de 24 heures.",
      "Signer de votre propre nom sans disposer de la moindre délégation de signature publiée."
    ],
    correctIndex: 0,
    ratings: [4, 1, 3, 2],
    optionRationales: [
      "Efficacité 4/4 : fermeté légale contre le faux en écriture publique tout en recherchant la solution officielle.",
      "Efficacité 1/4 : délit pénal gravissime de faux en écriture publique commis par un agent public.",
      "Efficacité 3/4 : démarche constructive de négociation temporelle en attendant la signature régulière.",
      "Efficacité 2/4 : acte juridiquement nul pour incompétence du signataire exposant l'acte à annulation."
    ],
    explanation: "La signature est un acte juridique strict qui ne peut être délégué que par arrêté formel publié. L'imitation de signature est un crime ou délit pénal. Il faut mobiliser les suppléants légaux.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "situational-scen-048",
    version: 1,
    category: "situational",
    itemFormat: "rating",
    skill: "servir-client-usager",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 85,
    prompt: "Évaluez la pertinence de chaque réaction dans ce contexte.",
    stimulus: "En réunion publique, un représentant d'association vous accuse d'avoir favorisé un promoteur immobilier et prend la salle à témoin pour exiger votre démission.",
    options: [
      "Garder son calme, rappeler les critères techniques légaux et proposer un échange après séance.",
      "Quitter la tribune avec fracas en insultant vertement l'intervenant devant toute l'assemblée.",
      "Inviter l'intervenant à consulter le dossier public d'urbanisme en mairie dès le lendemain matin.",
      "Accuser en retour le représentant de diffamation scandaleuse pour tenter de reprendre la main."
    ],
    correctIndex: 0,
    ratings: [4, 1, 3, 1],
    optionRationales: [
      "Efficacité 4/4 : posture républicaine exemplaire, maîtrise émotionnelle et recentrage sur la légalité objective.",
      "Efficacité 1/4 : perte totale de sang-froid décrédibilisant la parole publique et le service de l'État.",
      "Efficacité 3/4 : réponse factuelle orientant vers la transparence des pièces administratives communicables.",
      "Efficacité 1/4 : surenchère agressive aggravant le conflit au lieu de restaurer le débat républicain."
    ],
    explanation: "L'agent public représentant l'État en réunion publique doit faire preuve d'une exemplarité sans faille, désamorcer l'agressivité par le calme et rappeler les faits juridiques et techniques objectifs.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "situational-scen-049",
    version: 1,
    category: "situational",
    itemFormat: "rating",
    skill: "conseiller",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 80,
    prompt: "Évaluez la pertinence de chaque réaction dans ce contexte.",
    stimulus: "La mise en place du guichet unique est bloquée car le service instructeur et le service informatique s'opposent sur la responsabilité du contrôle des pièces.",
    options: [
      "Organiser un atelier pour cartographier le flux et valider une matrice de responsabilités partagée.",
      "Décider d'office que les informaticiens contrôleront seuls la conformité juridique des pièces.",
      "Proposer une phase pilote de deux mois avec un binôme mixte instructeur et informaticien.",
      "Abandonner définitivement le projet de guichet unique pour préserver la paix sociale interne."
    ],
    correctIndex: 0,
    ratings: [4, 1, 3, 1],
    optionRationales: [
      "Efficacité 4/4 : démarche méthodologique claire fondant la coopération sur des processus partagés et validés.",
      "Efficacité 1/4 : décision autoritaire affectant des tâches de fond juridique à des techniciens système.",
      "Efficacité 3/4 : expérimentation pragmatique utile permettant de tester les rôles sur un échantillon réel.",
      "Efficacité 1/4 : capitulation prématurée sacrifiant un progrès majeur pour les usagers du service public."
    ],
    explanation: "Les conflits interservices proviennent fréquemment d'un flou de délimitation des rôles. La définition formelle d'une matrice RACI permet de clarifier les responsabilités de chacun de manière concertée.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "situational-scen-050",
    version: 1,
    category: "situational",
    itemFormat: "rating",
    skill: "conseiller",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 85,
    prompt: "Évaluez la pertinence de chaque réaction dans ce contexte.",
    stimulus: "Un élu communal vous appelle et insinue que votre avancement de carrière pourrait être compromis si vous ne traitez pas favorablement la demande d'un proche.",
    options: [
      "Rédiger un rapport écrit circonstancié pour votre hiérarchie consignant les propos précis tenus.",
      "Céder à la demande de l'élu pour sécuriser votre promotion indiciaire lors de la commission.",
      "Rappeler calmement à l'élu les conditions d'éligibilité réglementaires applicables au dossier.",
      "Rejeter le dossier avec animosité sans même prendre le temps d'en vérifier la conformité."
    ],
    correctIndex: 0,
    ratings: [4, 1, 3, 1],
    optionRationales: [
      "Efficacité 4/4 : protection statutaire, respect de la voie hiérarchique et traçabilité écrite d'une ingérence.",
      "Efficacité 1/4 : soumission coupable à une tentative de trafic d'influence violant la neutralité.",
      "Efficacité 3/4 : posture professionnelle affirmant la règle de droit, devant être complétée par un signalement.",
      "Efficacité 1/4 : comportement vindicatif partial traitant inéquitablement une demande d'usager."
    ],
    explanation: "Face à une tentative d'ingérence ou de pression illicite, l'agent public doit formaliser un rapport circonstancié à sa hiérarchie afin de se placer sous la protection statutaire et garantir la neutralité de l'instruction.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "situational-scen-051",
    version: 1,
    category: "situational",
    itemFormat: "rating",
    skill: "conseiller",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 80,
    prompt: "Évaluez la pertinence de chaque réaction dans ce contexte.",
    stimulus: "Un usager a déposé par mégarde un acte de naissance original unique dans l'urne de collecte, alors qu'une simple copie certifiée était requise pour son dossier.",
    options: [
      "Enregistrer l'original sous pli sécurisé, en faire une copie pour le dossier et le restituer.",
      "Conserver définitivement le document original dans les archives courantes du ministère.",
      "Contacter l'usager par téléphone pour qu'il vienne récupérer son document contre récépissé.",
      "Jeter l'original au motif que l'usager aurait dû produire une photocopie ordinaire conforme."
    ],
    correctIndex: 0,
    ratings: [4, 1, 3, 1],
    optionRationales: [
      "Efficacité 4/4 : rigueur administrative protégeant l'usager d'une perte irréversible tout en complétant le dossier.",
      "Efficacité 1/4 : rétention injustifiée d'un document d'état civil original appartenant au citoyen.",
      "Efficacité 3/4 : démarche proactive assurant la remise directe mais nécessitant une conservation sécurisée préalable.",
      "Efficacité 1/4 : destruction matérielle fautive de pièce d'identité officielle engageant la responsabilité de l'État."
    ],
    explanation: "L'administration ne doit pas conserver indûment des titres originaux uniques. Il convient d'en extraire la copie probatoire utile pour l'instruction et de restituer l'original sous décharge.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "situational-scen-052",
    version: 1,
    category: "situational",
    itemFormat: "rating",
    skill: "conseiller",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 85,
    prompt: "Évaluez la pertinence de chaque réaction dans ce contexte.",
    stimulus: "Lors du bilan semestriel, votre équipe constate qu'un projet pilote n'a pas atteint ses cibles d'usage. Les agents ont tendance à se rejeter mutuellement la responsabilité.",
    options: [
      "Animer un retour d'expérience constructif pour analyser les causes et bâtir des ajustements.",
      "Désigner le chef de projet comme unique responsable de cet échec pour clore le débat.",
      "Recueillir les avis de chacun par écrit avant de synthétiser les axes d'amélioration possibles.",
      "Faire semblant que tout s'est déroulé selon les prévisions dans le rapport officiel final."
    ],
    correctIndex: 0,
    ratings: [4, 1, 3, 1],
    optionRationales: [
      "Efficacité 4/4 : culture positive de l'apprentissage par l'erreur, fédérant l'équipe sur les solutions d'avenir.",
      "Efficacité 1/4 : recherche stérile d'un bouc émissaire détruisant la cohésion et la prise d'initiative.",
      "Efficacité 3/4 : approche structurée permettant l'expression sereine avant la séance de travail commune.",
      "Efficacité 1/4 : falsification de l'évaluation publique empêchant tout redressement stratégique."
    ],
    explanation: "L'innovation publique exige le droit à l'erreur et une culture du retour d'expérience bienveillant mais lucide afin d'ajuster les dispositifs sans culpabilisation individuelle.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "situational-scen-053",
    version: 1,
    category: "situational",
    itemFormat: "rating",
    skill: "conseiller",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 80,
    prompt: "Évaluez la pertinence de chaque réaction dans ce contexte.",
    stimulus: "Un citoyen adresse une réclamation virulente contestant les délais d'instruction et formulant des critiques blessantes envers les compétences des fonctionnaires du pôle.",
    options: [
      "Répondre avec courtoisie et rigueur en exposant factuellement les étapes légales du dossier.",
      "Rédiger une réponse agressive rappelant que l'usager doit respecter les agents de l'État.",
      "Faire relire le projet de courrier par votre supérieur pour valider la neutralité du propos.",
      "Refuser net de répondre tant que l'usager n'aura pas formulé d'excuses écrites préalables."
    ],
    correctIndex: 0,
    ratings: [4, 1, 3, 1],
    optionRationales: [
      "Efficacité 4/4 : neutralité institutionnelle, respect de l'usager et clarté des explications juridico-administratives.",
      "Efficacité 1/4 : posture vindicative indigne du service public aggravant inutilement le contentieux.",
      "Efficacité 3/4 : réflexe prudent assurant la validation hiérarchique, bien que la réponse doive rester fluide.",
      "Efficacité 1/4 : rupture du principe républicain de continuité et d'obligation de réponse aux citoyens."
    ],
    explanation: "La correspondance administrative impose une parfaite neutralité de style, même en réponse à des attaques verbales. La réponse doit rester sobre, polie et rigoureusement fondée en droit.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "situational-scen-054",
    version: 1,
    category: "situational",
    itemFormat: "rating",
    skill: "conseiller",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 85,
    prompt: "Évaluez la pertinence de chaque réaction dans ce contexte.",
    stimulus: "En consultant des archives, vous découvrez qu'un double paiement non recouvré a été versé à un prestataire il y a deux ans. Votre responsable actuel n'était pas en fonction à l'époque.",
    options: [
      "Rédiger une note circonstanciée avec pièces justificatives pour votre chef de service actuel.",
      "Détruire discrètement les pièces comptables pour ne pas rouvrir un dossier ancien et classé.",
      "Vérifier auprès de la comptabilité si une procédure de recouvrement n'a pas déjà été engagée.",
      "Contacter le prestataire par téléphone pour lui demander de reverser la somme directement."
    ],
    correctIndex: 0,
    ratings: [4, 1, 3, 1],
    optionRationales: [
      "Efficacité 4/4 : loyauté envers l'institution et protection des deniers publics par un signalement tracé et objectif.",
      "Efficacité 1/4 : destruction de preuves comptables publiques constitutive d'une infraction pénale.",
      "Efficacité 3/4 : démarche préalable utile permettant de consolider les données financières avant le signalement.",
      "Efficacité 1/4 : initiative désordonnée risquant d'entraver les recours légaux de l'administration."
    ],
    explanation: "La découverte fortuite d'une anomalie financière préjudiciable aux deniers publics fait obligation à l'agent d'en informer sa hiérarchie pour permettre le recouvrement des indus.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "situational-scen-055",
    version: 1,
    category: "situational",
    itemFormat: "rating",
    skill: "conseiller",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 75,
    prompt: "Évaluez la pertinence de chaque réaction dans ce contexte.",
    stimulus: "Un projet transversal de simplification bloque car les représentants de chaque direction défendent strictement leur propre prérogative sans vouloir faire de concessions.",
    options: [
      "Recentrer le débat sur les besoins de l'usager pour aligner les différentes compétences.",
      "Laisser les directions s'affronter jusqu'à ce que la plus influente s'impose d'autorité.",
      "Proposer de traiter d'abord les points d'accord technique avant d'aborder les arbitrages.",
      "Quitter la séance en déclarant publiquement que la coopération est impossible dans ce cadre."
    ],
    correctIndex: 0,
    ratings: [4, 1, 3, 1],
    optionRationales: [
      "Efficacité 4/4 : recentrage sur l'usager permettant de dépasser les corporatismes internes.",
      "Efficacité 1/4 : favorise la loi du plus fort au détriment de la cohérence du service rendu.",
      "Efficacité 3/4 : méthode des petits pas pragmatique permettant d'enclencher une spirale d'accord positif.",
      "Efficacité 1/4 : démission personnelle et refus de participer à l'effort de modernisation publique."
    ],
    explanation: "Dans les projets transversaux de l'administration, recentrer les échanges sur les besoins concrets de l'usager et la finalité de service public permet de dépasser les querelles de frontières administratives.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "situational-scen-056",
    version: 1,
    category: "situational",
    itemFormat: "rating",
    skill: "conseiller",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 85,
    prompt: "Évaluez la pertinence de chaque réaction dans ce contexte.",
    stimulus: "La date limite de transmission approche et deux communes manquent à l'appel. Un agent propose d'arrondir arbitrairement les chiffres manquants pour gagner du temps.",
    options: [
      "Refuser toute donnée fictive, signaler la carence et relancer d'urgence les communes en retard.",
      "Accepter la suggestion car des estimations approximatives ne portent de préjudice à personne.",
      "Renseigner les données de l'an passé en mentionnant explicitement cette reconduction provisoire.",
      "Inventer des chiffres médians plausibles pour que le tableau paraisse complet aux décideurs."
    ],
    correctIndex: 0,
    ratings: [4, 1, 3, 1],
    optionRationales: [
      "Efficacité 4/4 : intégrité scientifique, rigueur statistique publique et transparence méthodologique totale.",
      "Efficacité 1/4 : compromission de la crédibilité de la statistique publique luxembourgeoise et européenne.",
      "Efficacité 3/4 : solution transitoire acceptable sous réserve d'un avertissement méthodologique très explicite.",
      "Efficacité 1/4 : faute professionnelle grave de fabrication délibérée de fausses données publiques."
    ],
    explanation: "La statistique publique repose sur l'exactitude et la traçabilité des données. En cas de données manquantes, la règle impose de documenter la non-réponse et de poursuivre les démarches de relance.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "situational-scen-057",
    version: 1,
    category: "situational",
    itemFormat: "rating",
    skill: "servir-client-usager",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 80,
    prompt: "Évaluez la pertinence de chaque réaction dans ce contexte.",
    stimulus: "Un collègue vous confie se sentir isolé et démotivé depuis le passage à deux jours de travail à domicile hebdomadaires, perdant le fil des dossiers collectifs.",
    options: [
      "Convenir d'un point régulier de synchronisation et prévoir un binôme pour sécuriser ses dossiers.",
      "Lui conseiller de chercher une mutation s'il ne parvient pas à s'adapter aux modes actuels.",
      "Lui proposer de revenir temporairement travailler sur site lors des journées d'équipe clés.",
      "Lui dire que tout le monde vit la même situation et qu'il convient de s'y habituer sans mot dire."
    ],
    correctIndex: 0,
    ratings: [4, 1, 3, 1],
    optionRationales: [
      "Efficacité 4/4 : écoute active, accompagnement personnalisé et remédiation organisationnelle concrète.",
      "Efficacité 1/4 : rejet brutal d'un collaborateur en détresse sans analyse de la situation managériale.",
      "Efficacité 3/4 : aménagement pratique favorisant la reprise de contact avec le collectif de travail.",
      "Efficacité 1/4 : négation des difficultés individuelles menant droit au désengagement ou à l'épuisement."
    ],
    explanation: "Le management à distance exige d'instaurer des mécanismes d'appui réguliers pour prévenir l'isolement des agents vulnérables ou en difficulté d'organisation.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "situational-scen-058",
    version: 1,
    category: "situational",
    itemFormat: "rating",
    skill: "conseiller",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 85,
    prompt: "Évaluez la pertinence de chaque réaction dans ce contexte.",
    stimulus: "Sur un réseau social, un agent mentionnant son poste ministériel publie une critique acerbe et polémique contre la nouvelle politique portée par son ministre de tutelle.",
    options: [
      "L'alerter en privé sur son devoir de réserve et prévenir la direction pour gérer l'impact public.",
      "Commenter publiquement sous sa publication pour le contredire violemment avec votre compte.",
      "Lui conseiller de supprimer immédiatement son message avant qu'il ne soit repéré par la hiérarchie.",
      "Relayer sa publication sur votre propre réseau pour encourager le débat ouvert dans la fonction publique."
    ],
    correctIndex: 0,
    ratings: [4, 1, 3, 1],
    optionRationales: [
      "Efficacité 4/4 : rappel des obligations statutaires de réserve tout en prévenant les dommages réputationnels pour l'État.",
      "Efficacité 1/4 : polémique publique ouverte amplifiant le spectacle négatif aux yeux des administrés.",
      "Efficacité 3/4 : conseil d'urgence bienvenu pour limiter le préjudice sans exonérer l'agent de ses obligations.",
      "Efficacité 1/4 : complicité de manquement statutaire propageant un préjudice institutionnel délibéré."
    ],
    explanation: "L'obligation de réserve s'impose aux agents publics dans l'espace numérique public. Dès lors que l'appartenance institutionnelle est affichée, la critique virulente de la politique de l'employeur public est fautive.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "situational-scen-059",
    version: 1,
    category: "situational",
    itemFormat: "rating",
    skill: "conseiller",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 75,
    prompt: "Évaluez la pertinence de chaque réaction dans ce contexte.",
    stimulus: "Votre supérieur direct vous ordonne verbalement d'octroyer une dérogation non conforme aux textes, invoquant une situation d'urgence humaine exceptionnelle.",
    options: [
      "Solliciter un ordre écrit préalable pour clarifier le fondement légal et dégager votre responsabilité.",
      "Exécuter l'instruction verbale immédiate pour ne pas heurter la susceptibilité du chef de service.",
      "Proposer de soumettre le cas au bureau juridique afin d'identifier une issue légale conforme.",
      "Refuser bruyamment en accusant votre supérieur d'abus de pouvoir devant les autres collègues."
    ],
    correctIndex: 0,
    ratings: [4, 1, 3, 1],
    optionRationales: [
      "Efficacité 4/4 : application exemplaire du principe d'ordre écrit protégeant la légalité et dégageant la responsabilité.",
      "Efficacité 1/4 : mise en cause directe de votre responsabilité personnelle pour émission d'un acte illégal.",
      "Efficacité 3/4 : démarche constructive recherchant une solution légale sous contrôle de l'expertise juridique.",
      "Efficacité 1/4 : violence verbale inutile rompant la relation de travail au lieu d'utiliser la voie juridique prévue."
    ],
    explanation: "En cas d'ordre paraissant illégal ou manifestement dérogatoire, le statut général permet et prescrit à l'agent de solliciter une confirmation écrite préalable, qui permet de tracer l'origine de l'instruction.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "situational-scen-060",
    version: 1,
    category: "situational",
    itemFormat: "rating",
    skill: "conseiller",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 85,
    prompt: "Évaluez la pertinence de chaque réaction dans ce contexte.",
    stimulus: "Un stagiaire suggère une réorganisation pertinente de l'accueil, mais les agents anciens la rejettent d'un bloc en refusant qu'un débutant leur dicte leurs pratiques.",
    options: [
      "Valoriser l'idée du stagiaire et animer un atelier collaboratif pour tester des améliorations.",
      "Donner immédiatement raison aux agents chevronnés pour préserver la paix sociale interne.",
      "Proposer d'expérimenter la nouvelle méthode sur un guichet test durant une semaine complète.",
      "Interdire au stagiaire de formuler la moindre suggestion jusqu'à la fin de son stage d'études."
    ],
    correctIndex: 0,
    ratings: [4, 1, 3, 1],
    optionRationales: [
      "Efficacité 4/4 : management inclusif associant l'audace des nouvelles recrues et la sagesse des agents expérimentés.",
      "Efficacité 1/4 : conservatisme étouffant les bonnes idées et démotivant les talents émergents de la fonction publique.",
      "Efficacité 3/4 : démarche expérimentale mesurée permettant d'évaluer la pertinence pratique sans brusquer.",
      "Efficacité 1/4 : attitude répressive humiliante pour le stagiaire et contre-productive pour l'innovation publique."
    ],
    explanation: "Le rôle de l'encadrement consiste à créer des ponts entre le regard neuf des nouveaux arrivants et l'expérience du personnel en place, à travers une démarche participative.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "situational-scen-061",
    version: 1,
    category: "situational",
    itemFormat: "rating",
    skill: "conseiller",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 80,
    prompt: "Évaluez la pertinence de chaque réaction dans ce contexte.",
    stimulus: "À 19h00, vous découvrez qu'une armoire contenant des dossiers administratifs sensibles est restée ouverte alors que des prestataires de nettoyage interviennent dans les locaux.",
    options: [
      "Verrouiller l'armoire, placer la clé au coffre sécurisé et laisser une note écrite au titulaire.",
      "Laisser l'armoire ouverte en supposant que le personnel de ménage ne consultera pas les dossiers.",
      "Signaler l'incident au gardien de sécurité pour qu'il porte une attention vigilante aux bureaux.",
      "Emporter l'ensemble des dossiers à votre domicile personnel pour surveiller leur sécurité la nuit."
    ],
    correctIndex: 0,
    ratings: [4, 1, 3, 1],
    optionRationales: [
      "Efficacité 4/4 : sécurisation immédiate des données protégées et traçabilité de l'anomalie sans dramatisation.",
      "Efficacité 1/4 : négligence grave exposant des informations nominatives et statutaires à des regards indiscrets.",
      "Efficacité 3/4 : précaution utile mais qui ne dispense pas de fermer matériellement l'accès physique à l'armoire.",
      "Efficacité 1/4 : violation majeure de la réglementation sur la protection des données en sortant des pièces des locaux."
    ],
    explanation: "La protection des données à caractère personnel impose de verrouiller sans délai tout meuble de stockage de pièces sensibles resté accessible, en informant le détenteur légitime.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "situational-scen-062",
    version: 1,
    category: "situational",
    itemFormat: "rating",
    skill: "conseiller",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 75,
    prompt: "Évaluez la pertinence de chaque réaction dans ce contexte.",
    stimulus: "Un agent compétent récemment affecté maîtrise mal la langue usuelle du service et se replie sur lui-même en réunion, hésitant à prendre la parole devant l'équipe.",
    options: [
      "Lui offrir un appui bienveillant, reformuler les points clés et l'encourager à son propre rythme.",
      "Lui demander de garder le silence pour éviter toute perte de temps lors des réunions de service.",
      "Proposer qu'il rédige ses remarques techniques par écrit afin de participer aux débats sereinement.",
      "L'isoler dans un bureau individuel fermé pour qu'il ne perturbe pas la routine des autres collègues."
    ],
    correctIndex: 0,
    ratings: [4, 1, 3, 1],
    optionRationales: [
      "Efficacité 4/4 : intégration inclusive, respect humain et mise en valeur des compétences au service du collectif.",
      "Efficacité 1/4 : humiliation publique discriminatoire et destructrice de confiance.",
      "Efficacité 3/4 : solution transitoire valorisant son expertise technique tout en facilitant son expression progressive.",
      "Efficacité 1/4 : mise au ban intolérable contraire aux principes d'inclusion de la fonction publique."
    ],
    explanation: "Dans une administration multilingue comme celle du Luxembourg ou des institutions européennes, l'inclusion linguistique bienveillante est une valeur fondamentale pour valoriser toutes les compétences.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "situational-scen-063",
    version: 1,
    category: "situational",
    itemFormat: "rating",
    skill: "conseiller",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 85,
    prompt: "Évaluez la pertinence de chaque réaction dans ce contexte.",
    stimulus: "Vous constatez qu'un collègue utilise l'imprimante centrale après les heures de bureau pour reproduire des centaines de tracts pour la campagne d'un parti politique.",
    options: [
      "Lui rappeler la stricte neutralité publique et alerter la hiérarchie en cas de récidive immédiate.",
      "L'aider à plier les tracts si vous partagez par hasard les mêmes orientations électorales personnelles.",
      "Lui demander d'interrompre l'impression et de rembourser le coût des fournitures utilisées au pôle.",
      "Fermer les yeux car l'utilisation des imprimantes en soirée n'a pas d'impact sur le public de jour."
    ],
    correctIndex: 0,
    ratings: [4, 1, 3, 1],
    optionRationales: [
      "Efficacité 4/4 : défense du principe cardinal de neutralité politique de l'administration et des ressources publiques.",
      "Efficacité 1/4 : complicité de détournement de biens publics et violation caractérisée de la neutralité.",
      "Efficacité 3/4 : stop immédiat de l'irrégularité et réparation financière, nécessitant toutefois un compte-rendu.",
      "Efficacité 1/4 : tolérance fautive envers une atteinte directe à la déontologie administrative républicaine."
    ],
    explanation: "Le matériel de l'État ne peut en aucun cas servir à des activités partisanes ou électorales. Le principe de laïcité et de neutralité du service public s'applique rigoureusement aux moyens techniques.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "situational-scen-064",
    version: 1,
    category: "situational",
    itemFormat: "rating",
    skill: "servir-client-usager",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 80,
    prompt: "Évaluez la pertinence de chaque réaction dans ce contexte.",
    stimulus: "Un administré refuse catégoriquement d'être reçu par un agent en tenant des propos discriminatoires et vindicatifs sur son apparence en pleine salle d'attente.",
    options: [
      "Rappeler la loi contre les discriminations, soutenir l'agent et refuser tout changement d'interlocuteur.",
      "Céder sur le champ aux exigences de l'administré pour restaurer sans délai le calme dans les locaux.",
      "Faire intervenir le responsable de sécurité pour encadrer l'usager et signifier l'interruption d'accueil.",
      "Renvoyer l'agent chez lui pour la journée afin de ne pas attiser la colère de l'usager mécontent."
    ],
    correctIndex: 0,
    ratings: [4, 1, 3, 1],
    optionRationales: [
      "Efficacité 4/4 : protection statutaire de l'agent, respect des lois contre les discriminations et fermeté.",
      "Efficacité 1/4 : complicité inacceptable avec des exigences racistes ou discriminatoires contraires aux lois.",
      "Efficacité 3/4 : mesure de sécurisation adaptée si l'usager persiste dans son comportement agressif ou délictuel.",
      "Efficacité 1/4 : double victimisation intolérable de l'agent public exerçant régulièrement ses missions de service."
    ],
    explanation: "L'administration doit protection statutaire à ses agents. Aucune concession ne peut être accordée à des exigences fondées sur des critères discriminatoires prohibés par la loi.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "situational-scen-065",
    version: 1,
    category: "situational",
    itemFormat: "rating",
    skill: "conseiller",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 85,
    prompt: "Évaluez la pertinence de chaque réaction dans ce contexte.",
    stimulus: "Lors de la passation d'un marché d'assurance communal, votre responsable vous demande d'écarter un candidat sous prétexte qu'il ne dispose pas de siège local dans le canton.",
    options: [
      "Rappeler que le droit des marchés publics prohibe expressément toute clause de préférence locale.",
      "Éliminer discrètement l'assureur non local lors du tri initial pour complaire au responsable direct.",
      "Faire valider par le service des marchés publics l'analyse de conformité objective de toutes les offres.",
      "Attribuer d'office le marché à l'assureur local même si son offre est 40 % plus onéreuse que les autres."
    ],
    correctIndex: 0,
    ratings: [4, 1, 3, 1],
    optionRationales: [
      "Efficacité 4/4 : respect scrupuleux du droit européen et national des marchés publics interdisant toute préférence locale.",
      "Efficacité 1/4 : entorse grave aux règles de passation exposant la collectivité à des recours et poursuites.",
      "Efficacité 3/4 : sollicite l'autorité experte interne pour sanctuariser la régularité juridique de l'attribution.",
      "Efficacité 1/4 : délit de favoritisme et gaspillage caractérisé des deniers publics communaux."
    ],
    explanation: "Dans le droit des marchés publics (luxembourgeois et européen), la clause de préférence locale est strictement prohibée. Tous les candidats de l'espace européen doivent être traités avec une égale impartialité.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  }
];
