/**
 * Batch 3: Verbal Reasoning items 066 to 100 (35 items)
 * Skills: comprehension, inference, application-consigne, vrai-faux-indetermine, synthese
 * Strict length balancing: max option length <= 1.35 * min option length
 * Zero forbidden words, strictly factual from text.
 */

const NOW = new Date().toISOString();
const REVIEWER = "hdjebar";

export const verbalBatch3 = [
  {
    id: "verbal-text-066",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "comprehension",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 75,
    prompt: "Selon le texte, quelle obligation s'impose à l'administration en cas de demande incomplète ?",
    stimulus: "Procédure d'instruction des demandes : Lorsque le dossier déposé par un usager ne comporte pas l'ensemble des pièces exigées, le service instructeur lui adresse un avis de pièces manquantes dans un délai de quinze jours. Ce courrier fixe un terme de trente jours pour régulariser l'envoi, faute de quoi la demande est réputée caduque.",
    options: [
      "Notifier un avis de pièces manquantes sous quinze jours en accordant un mois pour régulariser.",
      "Rejeter immédiatement la demande sans offrir la moindre possibilité de régularisation future.",
      "Transmettre d'office le dossier au tribunal administratif pour arbitrage contentieux rapide.",
      "Accorder tacitement l'autorisation sollicitée dès lors qu'une pièce principale est fournie."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : le texte prévoit l'envoi d'un avis sous 15 jours avec un délai de 30 jours pour compléter.",
      "Le rejet n'intervient qu'en cas de non-régularisation au terme des 30 jours.",
      "Aucune saisine du tribunal n'est prévue pour une simple demande incomplète.",
      "Le texte ne prévoit aucune autorisation tacite en cas d'incomplétude du dossier."
    ],
    explanation: "Le texte dispose expressément que l'autorité doit inviter l'usager sous 15 jours à compléter son dossier dans un délai imparti de 30 jours.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-text-067",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "inference",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 80,
    prompt: "Que peut-on inférer sur un dossier resté incomplet quarante jours après réception de l'avis ?",
    stimulus: "Procédure d'instruction des demandes : Lorsque le dossier déposé par un usager ne comporte pas l'ensemble des pièces exigées, le service instructeur lui adresse un avis de pièces manquantes dans un délai de quinze jours. Ce courrier fixe un terme de trente jours pour régulariser l'envoi, faute de quoi la demande est réputée caduque.",
    options: [
      "Le dossier est juridiquement réputé caduc en raison du dépassement du délai imparti.",
      "Le délai de régularisation est automatiquement reconduit pour une durée équivalente.",
      "L'administration est obligée de relancer l'usager par courrier recommandé avec accusé.",
      "La demande est transférée d'office à une commission arbitrale pour réexamen complet."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : le délai de 30 jours étant dépassé, la sanction prévue est la caducité de plein droit.",
      "Aucune prorogation automatique n'est stipulée dans le texte.",
      "Le texte ne prévoit pas de seconde relance recommandée obligatoire.",
      "Aucun transfert vers une commission arbitrale n'est prévu par la procédure."
    ],
    explanation: "Le délai légal de régularisation étant fixé à 30 jours, un silence de 40 jours entraîne la caducité juridique de la demande.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-text-068",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "synthese",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 75,
    prompt: "Quel énoncé résume le principe d'action exposé dans cette note de cadrage ?",
    stimulus: "Simplification des formalités publiques : L'allègement des démarches repose sur le principe 'Dites-le nous une fois'. Dès lors qu'une administration détient déjà une donnée certifiée relative à un usager, aucune autre entité publique ne peut exiger la réémission de cette même pièce, sous réserve du consentement exprès de l'intéressé.",
    options: [
      "Interdire la redemande de justificatifs déjà détenus par une collectivité publique.",
      "Supprimer l'obligation de consentement préalable de l'usager pour tout échange.",
      "Obliger chaque citoyen à déposer annuellement l'intégralité de ses pièces d'identité.",
      "Interdire formellement tout partage de bases de données entre ministères de l'État."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : synthétise le principe 'Dites-le nous une fois' évitant la redondance des justificatifs.",
      "Le texte subordonne expressément l'échange au consentement de l'usager.",
      "Le texte vise précisément l'inverse : éviter le dépôt récurrent de pièces déjà connues.",
      "Le dispositif repose au contraire sur l'échange fluide de données publiques certifiées."
    ],
    explanation: "Le principe 'Dites-le nous une fois' vise à décharger l'usager en faisant communiquer les administrations entre elles pour les données certifiées déjà existantes.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-text-069",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "comprehension",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 70,
    prompt: "Selon ce protocole, quelle condition autorise l'accès d'un visiteur extérieur aux locaux sécurisés ?",
    stimulus: "Sûreté des bâtiments publics : Toute personne extérieure au service doit être munie d'un badge temporaire délivré à l'accueil sur présentation d'une pièce d'identité officielle. Elle est obligatoirement accompagnée par un agent habilité durant l'ensemble de ses déplacements au sein des zones techniques protégées.",
    options: [
      "Présenter une pièce d'identité, porter un badge et être accompagnée en permanence.",
      "Disposer d'une autorisation verbale préalable du responsable de la communication.",
      "Fournir une attestation d'assurance professionnelle lors du contrôle de sécurité.",
      "Effectuer une déclaration sur l'honneur signée au moins trois jours à l'avance."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : les conditions cumulatives du texte sont la pièce d'identité, le badge et l'accompagnement continu.",
      "Une autorisation verbale ne dispense pas des formalités physiques de sécurité.",
      "L'attestation d'assurance n'est pas requise pour l'accès physique au bâtiment.",
      "Le texte ne mentionne aucun délai de préavis de trois jours pour une visite."
    ],
    explanation: "Le texte pose trois obligations expresses cumulatives : pièce d'identité à l'accueil, port du badge temporaire et accompagnement continu par un agent habilité.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-text-070",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "inference",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 85,
    prompt: "Que peut-on déduire sur un visiteur circulant seul dans les zones protégées ?",
    stimulus: "Sûreté des bâtiments publics : Toute personne extérieure au service doit être munie d'un badge temporaire délivré à l'accueil sur présentation d'une pièce d'identité officielle. Elle est obligatoirement accompagnée par un agent habilité durant l'ensemble de ses déplacements au sein des zones techniques protégées.",
    options: [
      "Sa présence est non conforme aux exigences réglementaires de sécurité du site.",
      "Il dispose automatiquement d'une habilitation de sécurité de niveau supérieur.",
      "Il peut poursuivre sa visite librement dès lors qu'il porte son badge au cou.",
      "La direction générale lui a accordé une dispense tacite d'accompagnateur."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : l'accompagnement étant obligatoire pour tout visiteur extérieur, circuler seul constitue une infraction au protocole.",
      "Le texte n'établit aucune présomption d'habilitation supérieure pour les personnes seules.",
      "Le port du badge ne dispense en aucun cas de l'accompagnement continu obligatoire.",
      "Le texte n'envisage aucune dispense tacite d'accompagnement."
    ],
    explanation: "L'obligation d'accompagnement étant générale et continue dans les zones techniques protégées, une circulation isolée viole directement la consigne.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-text-071",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "application-consigne",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 75,
    prompt: "Quelle mesure immédiate un responsable doit-il appliquer en cas de perte de badge d'accès ?",
    stimulus: "Gestion des accès électroniques : En cas de perte ou de vol d'un badge nominatif, son titulaire doit le signaler sans délai au bureau de sûreté. Ce dernier procède à la désactivation informatique immédiate du support et délivre un badge de substitution valable pour une durée maximale de sept jours ouvrés.",
    options: [
      "Désactiver immédiatement le support dans le système et délivrer un badge temporaire.",
      "Facturer d'office une pénalité financière forfaitaire sur le traitement indiciaire.",
      "Attendre quarante-huit heures ouvrées avant d'engager toute action informatique.",
      "Exiger un dépôt de plainte formel auprès du commissariat avant toute désactivation."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : le protocole impose la désactivation informatique immédiate et la remise d'un badge temporaire de 7 jours.",
      "Aucune sanction financière automatique n'est stipulée dans le protocole.",
      "L'attente de 48 heures contredit formellement la consigne de désactivation immédiate.",
      "Le dépôt de plainte n'est pas posé comme condition préalable à la neutralisation technique."
    ],
    explanation: "La réaction prescrite combine la neutralisation informatique immédiate des droits pour protéger les locaux et la fourniture d'un accès provisoire.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-text-072",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "comprehension",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 70,
    prompt: "Selon cet extrait, quelle dérogation permet de recruter un agent sous contrat à durée déterminée ?",
    stimulus: "Règles d'emploi dans le secteur public : Le recrutement de contractuels à durée déterminée est réservé aux nécessités de remplacement temporaire de fonctionnaires indisponibles ou pour faire face à un accroissement temporaire d'activité ne pouvant excéder douze mois consécutifs sur une période de deux ans.",
    options: [
      "Remplacer temporairement un agent absent ou faire face à un surcroît d'activité.",
      "Pourvoir définitivement un emploi permanent vacant au sein de l'organigramme.",
      "Remplacer les postes d'encadrement supérieur lors des départs en retraite.",
      "Permettre l'apprentissage linguistique des candidats non ressortissants de l'Union."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : le texte cite expressément le remplacement temporaire et l'accroissement temporaire d'activité.",
      "Le texte réserve les postes permanents au statut et exclut le CDD pour vacance pérenne.",
      "Le départ en retraite crée une vacance définitive et non temporaire.",
      "L'apprentissage linguistique n'est pas une condition de recours légal au CDD."
    ],
    explanation: "Le texte énumère deux motifs légaux limitatifs : le remplacement temporaire d'un agent ou la hausse conjoncturelle d'activité plafonnée à 12 mois.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-text-073",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "inference",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 85,
    prompt: "Quelle conséquence entraîne un accroissement d'activité d'une durée ininterrompue de dix-huit mois ?",
    stimulus: "Règles d'emploi dans le secteur public : Le recrutement de contractuels à durée déterminée est réservé aux nécessités de remplacement temporaire de fonctionnaires indisponibles ou pour faire face à un accroissement temporaire d'activité ne pouvant excéder douze mois consécutifs sur une période de deux ans.",
    options: [
      "Il excède le plafond légal et ne peut être couvert par un contrat temporaire.",
      "Il autorise de plein droit la titularisation immédiate de l'agent recruté.",
      "Il ouvre droit au versement d'une prime exceptionnelle de fin de contrat.",
      "Il permet la conclusion d'un contrat à durée indéterminée par tacite reconduction."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : le texte plafonne l'accroissement temporaire à douze mois consécutifs ; dix-huit mois dépassent ce cadre légal.",
      "Le dépassement n'entraîne pas de titularisation automatique dans la fonction publique.",
      "Le texte ne prévoit pas de prime de fin de contrat pour cause de prolongation.",
      "Aucune reconduction tacite en CDI n'est mentionnée dans ces dispositions."
    ],
    explanation: "Le plafond strict de 12 mois consécutifs interdit de recourir au CDD pour un besoin temporaire s'étalant sur 18 mois continus.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-text-074",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "synthese",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 75,
    prompt: "Quelle orientation fondamentale ce rapport assigne-t-il à la politique de gestion des âges ?",
    stimulus: "Gestion prévisionnelle des compétences : L'allongement de la vie professionnelle impose de repenser l'ergonomie des postes de travail et de diversifier les parcours de reconversion interne. L'enjeu est de maintenir l'employabilité et la motivation des seniors tout en assurant un transfert structuré des savoir-faire critiques vers les nouveaux entrants.",
    options: [
      "Adapter le travail et les compétences pour valoriser les seniors et transmettre le savoir.",
      "Anticiper systématiquement les départs anticipés pour libérer des postes budgétaires.",
      "Réserver les actions de formation continue aux seuls agents âgés de moins de quarante ans.",
      "Interdire le tutorat formel entre générations pour préserver l'autonomie des nouvelles recrues."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : synthétise l'adaptation ergonomique, le maintien de l'employabilité et la transmission intergénérationnelle.",
      "Le texte ne préconise pas des départs anticipés mais le maintien en activité dans de bonnes conditions.",
      "Le texte insiste au contraire sur l'employabilité des seniors par la diversification des parcours.",
      "Le texte encourage expressément le transfert structuré des savoirs vers les arrivants."
    ],
    explanation: "La note pose les deux piliers d'une gestion des âges réussie : la soutenabilité des conditions de travail pour les seniors et la transmission des savoirs clés aux jeunes collègues.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-text-075",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "comprehension",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 70,
    prompt: "D'après les consignes, quand un fonctionnaire doit-il transmettre son certificat d'arrêt de travail ?",
    stimulus: "Régime des congés de maladie : Tout agent dans l'impossibilité d'exercer ses fonctions pour raison médicale doit en avertir sa hiérarchie le premier jour ouvrable de son absence. Le certificat médical justificatif délivré par le médecin traitant doit parvenir au bureau du personnel dans un délai impératif de quarante-huit heures.",
    options: [
      "Au plus tard dans les quarante-huit heures suivant le début de l'arrêt médical.",
      "Dans un délai d'une semaine ouvrée à compter de la visite chez le médecin traitant.",
      "Au premier jour ouvré du mois suivant lors de la transmission des états de présence.",
      "Uniquement si l'interruption de service dépasse une durée de sept jours consécutifs."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : le certificat médical doit impérativement parvenir sous quarante-huit heures.",
      "Le délai d'une semaine est supérieur au terme impératif de 48 heures.",
      "Attendre le premier jour du mois suivant mettrait l'agent en situation d'absence injustifiée.",
      "Le certificat est requis dès le début de l'arrêt, quelle qu'en soit la durée."
    ],
    explanation: "Le texte fixe deux règles temporelles strictes : avertissement le 1er jour et acheminement du certificat médical justificatif sous 48 heures au plus tard.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-text-076",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "inference",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 80,
    prompt: "Que risque un fonctionnaire qui n'envoie son certificat médical qu'au cinquième jour d'absence ?",
    stimulus: "Régime des congés de maladie : Tout agent dans l'impossibilité d'exercer ses fonctions pour raison médicale doit en avertir sa hiérarchie le premier jour ouvrable de son absence. Le certificat médical justificatif délivré par le médecin traitant doit parvenir au bureau du personnel dans un délai impératif de quarante-huit heures.",
    options: [
      "Une mise en demeure ou retenue sur traitement pour absence non justifiée à temps.",
      "La résiliation automatique et irrévocable de son contrat de fonctionnaire d'État.",
      "Le remboursement intégral des frais de santé engagés auprès de la caisse maladie.",
      "L'obligation de reprendre ses fonctions le jour même sans examen médical complémentaire."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : le non-respect du délai impératif place l'agent en situation d'absence irrégulière pouvant justifier une retenue.",
      "La rupture automatique du statut n'intervient pas pour un simple retard de transmission initial.",
      "L'administration employeur ne gère pas le remboursement des soins de santé de la caisse.",
      "L'état de santé prévaut, la reprise forcée sans avis médical est exclue."
    ],
    explanation: "La transmission tardive au-delà du délai impératif de 48 heures expose l'agent à une qualification d'absence injustifiée pour la période non couverte à temps.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-text-077",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "comprehension",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 75,
    prompt: "Selon cette note, quelle condition régit la communication de documents administratifs préparatoires ?",
    stimulus: "Accès aux documents publics : Le droit d'accès aux documents administratifs s'applique aux actes achevés. Les documents préparatoires à une décision en cours d'élaboration ne sont communicables qu'après que la décision finale a été formellement adoptée et signée par l'autorité compétente.",
    options: [
      "Ils deviennent communicables seulement après l'adoption formelle de la décision finale.",
      "Ils sont librement accessibles à tout citoyen dès leur première version de travail.",
      "Ils ne peuvent jamais être communiqués au public, même après adoption finale.",
      "Leur communication exige impérativement une autorisation du médiateur de l'État."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : le texte subordonne la communicabilité des documents préparatoires à l'adoption formelle de la décision.",
      "Les documents de travail préparatoires ne sont pas communicables pendant la phase d'élaboration.",
      "Ils deviennent communicables une fois la décision prise, ils ne sont donc pas exclus à jamais.",
      "L'autorisation du médiateur n'est pas posée comme condition dans le texte."
    ],
    explanation: "Le texte pose une règle claire de protection de la délibération publique : un document préparatoire ne devient communicable qu'une fois l'acte définitif officiellement adopté.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-text-078",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "inference",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 85,
    prompt: "Que peut répondre l'administration à un usager sollicitant un rapport préparatoire avant que le ministre n'ait tranché ?",
    stimulus: "Accès aux documents publics : Le droit d'accès aux documents administratifs s'applique aux actes achevés. Les documents préparatoires à une décision en cours d'élaboration ne sont communicables qu'après que la décision finale a été formellement adoptée et signée par l'autorité compétente.",
    options: [
      "Opposer un refus légal motivé par le caractère inachevé et préparatoire du document.",
      "Transmettre immédiatement le projet en caviardant le nom des fonctionnaires rédacteurs.",
      "Exiger le versement d'une redevance financière avant de communiquer la pièce provisoire.",
      "Détruire le document préparatoire pour éteindre définitivement la demande de l'usager."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : la décision n'étant pas adoptée, le caractère préparatoire fonde légalement le refus de communication.",
      "Le texte refuse la communicabilité globale du document préparatoire, même caviardé.",
      "La redevance ne permet pas de déroger à l'incommunicabilité des actes inachevés.",
      "La destruction d'une pièce administrative constituerait une faute professionnelle grave."
    ],
    explanation: "Tant que la décision n'a pas été arrêtée, l'administration est juridiquement fondée à refuser la communication au motif de son statut d'acte préparatoire inachevé.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-text-079",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "synthese",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 70,
    prompt: "Quelle est l'idée directrice exprimée dans cette recommandation sur la gestion documentaire ?",
    stimulus: "Conservation des pièces comptables : L'archivage électronique des pièces justificatives de dépenses publiques doit garantir leur authenticité, leur intégrité et leur lisibilité pendant une durée minimale de dix ans. Le recours à une signature électronique qualifiée et à un horodatage certifié constitue la garantie probatoire exigée par la Cour des comptes.",
    options: [
      "Garantir l'authenticité et la pérennité des archives comptables numériques sur dix ans.",
      "Obliger l'impression et la reliure papier annuelle de l'ensemble des mandats de paiement.",
      "Réduire la durée de conservation des dépenses à un an pour libérer de l'espace serveur.",
      "Supprimer l'horodatage électronique des factures pour accélérer le traitement comptable."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : synthétise les exigences de fiabilité probatoire (intégrité, signature, horodatage) sur dix ans.",
      "Le texte traite de l'archivage électronique pérenne et non du retour au support papier.",
      "Le délai de dix ans est impératif pour la Cour des comptes, non réductible à un an.",
      "L'horodatage certifié est expressément exigé comme garantie de valeur probante."
    ],
    explanation: "L'extrait synthétise les conditions de validité probatoire de l'archivage numérique des dépenses de l'État : intégrité technique et conservation sur 10 ans.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-text-080",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "comprehension",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 75,
    prompt: "Selon ce protocole, quelle condition permet d'engager une procédure de passation de gré à gré sans publicité ?",
    stimulus: "Règlement grand-ducal sur les marchés publics : La passation de marchés négociés sans publicité préalable demeure strictement exceptionnelle. Elle n'est admise qu'en cas d'urgence impérieuse résultant d'événements imprévisibles pour le pouvoir adjudicateur, ou lorsque des raisons techniques imposent de confier l'exécution à un opérateur unique.",
    options: [
      "Une urgence impérieuse imprévisible ou l'existence d'un opérateur technique exclusif.",
      "La volonté du pouvoir adjudicateur de privilégier une entreprise locale reconnue.",
      "Le dépassement des délais habituels de consultation dû à un retard des services internes.",
      "Une offre financière attractive formulée spontanément par un fournisseur extérieur."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : le texte pose les deux seuls cas admis : urgence impérieuse imprévisible ou monopole technique.",
      "La préférence locale est formellement proscrite par le droit de la commande publique.",
      "Le retard interne de l'administration ne constitue pas un événement imprévisible ouvrant droit à l'urgence.",
      "Une offre spontanée avantageuse ne dispense pas des obligations légales de publicité."
    ],
    explanation: "Le texte réserve strictement le gré à gré à deux hypothèses : événement imprévisible créant une urgence absolue ou exclusivité technique avérée.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-text-081",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "inference",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 85,
    prompt: "Que peut-on conclure sur une administration qui utilise le gré à gré pour pallier une mauvaise planification de ses achats ?",
    stimulus: "Règlement grand-ducal sur les marchés publics : La passation de marchés négociés sans publicité préalable demeure strictement exceptionnelle. Elle n'est admise qu'en cas d'urgence impérieuse résultant d'événements imprévisibles pour le pouvoir adjudicateur, ou lorsque des raisons techniques imposent de confier l'exécution à un opérateur unique.",
    options: [
      "Le marché est juridiquement irrégulier car le retard interne n'est pas un motif imprévisible.",
      "Le marché est pleinement valide dès lors que la commande porte sur des fournitures urgentes.",
      "L'administration bénéficie d'une régularisation rétroactive automatique en fin d'exercice.",
      "Le contrôleur financier peut dispenser l'acheteur de toute motivation écrite au dossier."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : l'urgence créée par la carence de l'acheteur n'est pas imprévisible et vicie la passation.",
      "L'urgence ne doit pas résulter du fait de l'acheteur, la simple urgence temporelle ne suffit pas.",
      "Aucune régularisation d'office n'est admise pour une entorse aux règles fondamentales de mise en concurrence.",
      "La motivation écrite est une formalité de fond impérative pour tout marché sans publicité."
    ],
    explanation: "Selon la jurisprudence constante des marchés publics, l'imprévisibilité doit être extérieure à l'administration ; une négligence de calendrier ne permet pas d'échapper à la concurrence.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-text-082",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "synthese",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 70,
    prompt: "Quel est le but central de la démarche d'accessibilité numérique décrite dans cette directive ?",
    stimulus: "Accessibilité des portails publics : Les sites internet de l'État et des communes doivent se conformer aux standards internationaux WCAG. L'objectif est de garantir que chaque citoyen, quelle que soit sa situation de handicap visuel, auditif ou moteur, puisse accéder en toute autonomie aux démarches et informations en ligne.",
    options: [
      "Permettre aux usagers en situation de handicap d'utiliser les services web en autonomie.",
      "Remplacer l'ensemble des sites publics par des applications mobiles payantes dédiées.",
      "Interdire tout élément visuel complexe ou interactif sur les portails administratifs.",
      "Réserver les démarches en ligne aux seuls internautes disposant d'un matériel adapté."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : synthétise l'objectif d'accessibilité universelle et d'autonomie pour tout type de handicap.",
      "Le texte préconise des normes sur les sites existants, non le passage au tout-mobile payant.",
      "L'accessibilité vise à rendre compatibles les éléments riches, non à interdire l'interactivité.",
      "L'objectif est précisément d'élargir l'accès et d'éviter toute exclusion technologique."
    ],
    explanation: "La directive vise l'inclusion numérique en adaptant la conception des portails pour garantir l'autonomie d'usage aux personnes en situation de handicap.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-text-083",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "comprehension",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 75,
    prompt: "Selon ce texte, quelle formalité conditionne le versement de l'allocation pour mission exceptionnelle ?",
    stimulus: "Indemnités de mission à l'étranger : Le versement des indemnités forfaitaires journalières pour mission officielle hors des frontières est subordonné au dépôt d'un rapport de fin de mission visé par le chef de délégation, accompagné des titres originaux de transport, dans les quinze jours suivant le retour.",
    options: [
      "Déposer un rapport de mission visé et les titres de transport sous quinze jours.",
      "Obtenir une décharge écrite contresignée par l'ambassadeur du pays visité lors du séjour.",
      "Effectuer une déclaration orale auprès du contrôleur financier dès le lendemain du voyage.",
      "Fournir les reçus de tous les repas pris au restaurant durant le séjour officiel."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : les conditions énoncées sont le rapport visé, les titres de transport et le respect du délai de 15 jours.",
      "Aucune décharge d'ambassadeur n'est mentionnée dans le texte.",
      "La déclaration orale est exclue par l'exigence d'un rapport écrit visé.",
      "L'indemnité étant forfaitaire, le texte n'exige pas les reçus réels de chaque repas."
    ],
    explanation: "Le texte subordonne expressément la liquidation de l'indemnité au respect des formalités documentaires (rapport visé et billets) dans le délai de 15 jours.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-text-084",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "inference",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 80,
    prompt: "Que se produit-il si un agent ne transmet son rapport de mission qu'au bout d'un mois sans motif légitime ?",
    stimulus: "Indemnités de mission à l'étranger : Le versement des indemnités forfaitaires journalières pour mission officielle hors des frontières est subordonné au dépôt d'un rapport de fin de mission visé par le chef de délégation, accompagné des titres originaux de transport, dans les quinze jours suivant le retour.",
    options: [
      "Le paiement de l'indemnité peut être légalement suspendu ou différé par le gestionnaire.",
      "L'agent est automatiquement traduit devant la commission de discipline ministérielle.",
      "L'indemnité est versée d'office avec une retenue financière forfaitaire de 50 %.",
      "Le chef de délégation est personnellement tenu de rembourser les frais engagés."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : le versement étant expressément subordonné au dépôt dans les 15 jours, l'omission bloque la mise en paiement.",
      "Le retard dans la remise d'un rapport de frais ne relève pas de prime abord du conseil de discipline.",
      "Aucune minoration de 50 % n'est prévue par la réglementation.",
      "La responsabilité financière personnelle du chef de délégation n'est pas engagée pour le retard d'un pair."
    ],
    explanation: "La règle posant une condition suspensive au versement ('subordonné au dépôt (...) dans les quinze jours'), le non-respect du délai fait obstacle au paiement.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-text-085",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "synthese",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 70,
    prompt: "Quelle est l'orientation principale exprimée dans cette note sur la formation continue des agents publics ?",
    stimulus: "Développement des compétences professionnelles : La formation continue ne doit pas se limiter à une mise à niveau réglementaire ponctuelle, mais s'inscrire dans une démarche proactive d'adaptation aux transitions écologique et numérique. Elle constitue un investissement stratégique garantissant la qualité pérenne du service public rendu aux citoyens.",
    options: [
      "Concevoir la formation comme un investissement stratégique continu pour l'avenir du service.",
      "Réduire les heures de formation pour maximiser la présence des agents à leur poste de travail.",
      "Limiter les sessions d'apprentissage aux seuls rappels juridiques obligatoires annuels.",
      "Externaliser l'intégralité des modules de formation auprès d'organismes privés internationaux."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : synthétise la vision de la formation comme levier stratégique continu face aux transitions écologique et numérique.",
      "Le texte prône l'investissement dans les compétences et non la réduction des formations.",
      "Le texte affirme explicitement que la formation ne doit pas se limiter au cadre réglementaire.",
      "Le texte ne préconise pas l'externalisation exclusive des sessions de formation."
    ],
    explanation: "L'extrait valorise la formation continue comme un investissement d'avenir indispensable pour adapter les services publics aux mutations numériques et écologiques.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-text-086",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "comprehension",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 75,
    prompt: "Selon ce texte, quelle règle s'applique aux cumuls d'activités pour les fonctionnaires à temps plein ?",
    stimulus: "Statut général des fonctionnaires de l'État : L'exercice d'une activité lucrative accessoire par un agent à temps plein est soumis à l'autorisation préalable écrite du ministre de tutelle. Cette activité ne doit porter aucune atteinte à l'indépendance, à l'impartialité ou à la neutralité du service public, ni concurrencer les missions de son administration.",
    options: [
      "Une autorisation écrite préalable du ministre vérifiant la neutralité et l'indépendance.",
      "Une simple déclaration informelle formulée oralement auprès du collègue de bureau.",
      "La cessation définitive et immédiate de toute activité culturelle, bénévole ou associative.",
      "Une autorisation tacite accordée automatiquement en l'absence de réponse sous huitaine."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : le statut exige cumulativement l'accord écrit préalable du ministre et le respect de la neutralité.",
      "Une déclaration orale informelle est totalement dépourvue de valeur statutaire.",
      "Le texte traite des activités lucratives et n'interdit pas le bénévolat associatif.",
      "Le texte exige une autorisation écrite expresse, excluant l'accord tacite sans décision."
    ],
    explanation: "Le texte pose expressément l'exigence d'un accord écrit préalable de l'autorité ministérielle pour toute activité accessoire rémunérée.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-text-087",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "inference",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 85,
    prompt: "Que risque un fonctionnaire exerçant une activité rémunérée sans autorisation ministérielle ?",
    stimulus: "Statut général des fonctionnaires de l'État : L'exercice d'une activité lucrative accessoire par un agent à temps plein est soumis à l'autorisation préalable écrite du ministre de tutelle. Cette activité ne doit porter aucune atteinte à l'indépendance, à l'impartialité ou à la neutralité du service public, ni concurrencer les missions de son administration.",
    options: [
      "Des poursuites disciplinaires pouvant donner lieu au reversement des sommes indûment perçues.",
      "L'obligation de transformer immédiatement son emploi public en contrat privé commercial.",
      "Une exonération fiscale accordée au titre de la double compétence technique démontrée.",
      "La prise en charge automatique de ses cotisations par son administration de rattachement."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : le non-respect du régime statutaire des cumuls constitue une faute disciplinaire majeure.",
      "L'administration ne transforme pas un statut public en contrat commercial privé.",
      "Aucune exonération fiscale n'est accordée pour une activité illégale.",
      "L'administration ne prend pas en charge les charges d'une activité non autorisée."
    ],
    explanation: "L'exercice clandestin d'une activité lucrative en infraction avec le statut de la fonction publique expose l'agent à des sanctions disciplinaires et au reversement des gains.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-text-088",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "synthese",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 70,
    prompt: "Quel principe gouverne l'évaluation environnementale des plans d'aménagement selon cet extrait ?",
    stimulus: "Protection de la biodiversité : Tout plan directeur d'urbanisme susceptible d'affecter notablement un site Natura 2000 doit faire l'objet d'une évaluation environnementale préalable approfondie. Si les conclusions font apparaître un risque de dégradation irréversible de l'habitat naturel protégé, le projet ne peut être autorisé qu'en l'absence de toute solution alternative.",
    options: [
      "Subordonner l'autorisation d'urbanisme à l'absence de risque écologique ou d'alternative viable.",
      "Autoriser systématiquement les travaux de construction dès lors qu'ils créent des emplois locaux.",
      "Supprimer les zones protégées Natura 2000 qui ralentissent le développement économique urbain.",
      "Dispenser d'évaluation écologique les projets d'aménagement validés par un vote communal."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : synthétise l'obligation d'évaluation et l'interdiction d'atteinte écologique sans alternative.",
      "L'argument de l'emploi local ne dispense pas des exigences de préservation des sites protégés.",
      "Le texte vise à préserver les habitats protégés et non à déclasser les zones Natura 2000.",
      "Un vote communal ne peut déroger aux exigences légales de protection de l'environnement."
    ],
    explanation: "Le texte pose le principe de précaution environnementale : examen d'impact obligatoire et refus des projets dégradant les habitats naturels en présence de solutions alternatives.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-text-089",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "comprehension",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 75,
    prompt: "Selon ce règlement, quelle est la sanction prévue en cas de fraude constatée à un examen de promotion ?",
    stimulus: "Organisation des carrières et promotions : Toute tentative de fraude avérée lors d'une épreuve écrite de promotion interne entraîne l'exclusion immédiate du candidat de la session en cours. Cette décision est assortie d'une interdiction de se présenter à tout examen professionnel d'avancement pour une durée de trois années consécutives.",
    options: [
      "L'exclusion immédiate de la session et trois ans d'interdiction de concourir.",
      "Une simple mention d'avertissement inscrite sur la copie sans autre sanction.",
      "La rétrogradation indiciaire d'office dans le corps hiérarchique inférieur.",
      "L'obligation de repasser uniquement l'épreuve litigieuse lors de la session suivante."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : les deux sanctions cumulatives sont l'exclusion directe et l'interdiction de 3 ans.",
      "Le texte prévoit une exclusion ferme et non un simple avertissement formel.",
      "La rétrogradation de corps n'est pas la mesure prévue pour la fraude à un examen de promotion.",
      "Le texte interdit de concourir pendant trois ans et exclut tout repêchage immédiat."
    ],
    explanation: "Le texte fixe avec précision la sanction disciplinaire applicable : exclusion de la session actuelle et interdiction de participer aux examens durant 3 ans.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-text-090",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "inference",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 85,
    prompt: "Que peut-on inférer quant aux perspectives de promotion d'un candidat sanctionné pour fraude l'année passée ?",
    stimulus: "Organisation des carrières et promotions : Toute tentative de fraude avérée lors d'une épreuve écrite de promotion interne entraîne l'exclusion immédiate du candidat de la session en cours. Cette décision est assortie d'une interdiction de se présenter à tout examen professionnel d'avancement pour une durée de trois années consécutives.",
    options: [
      "Il ne peut pas s'inscrire à l'examen de cette année en raison de la période d'interdiction en cours.",
      "Il peut concourir normalement dès lors qu'il change de spécialité administrative ou de ministère.",
      "Sa candidature est examinée par dérogation spéciale accordée par le président du jury d'examen.",
      "Il est autorisé à concourir sous réserve de subir une surveillance renforcée en salle d'épreuve."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : la sanction portant sur trois années consécutives, l'interdiction demeure active l'année suivante.",
      "L'interdiction vise tout examen professionnel d'avancement sans distinction de spécialité.",
      "Le texte n'octroie aucun pouvoir de dérogation discrétionnaire au président du jury.",
      "Le texte proscrit l'inscription elle-même et ne propose pas de surveillance d'appoint."
    ],
    explanation: "La durée de l'interdiction étant fixée à trois années entières, un agent exclu l'année précédente est frappé d'inéligibilité légale pour la session suivante.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-text-091",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "synthese",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 70,
    prompt: "Quel objectif principal poursuit la politique d'ouverture des données publiques (Open Data) ?",
    stimulus: "Circulaire sur les données ouvertes : La mise à disposition des jeux de données publiques sur la plateforme nationale répond à un impératif de transparence démocratique et de stimulation de l'écosystème d'innovation. Les administrations doivent publier leurs bases brutes sous licence libre, à l'exception des données protégées par la vie privée ou la sécurité de l'État.",
    options: [
      "Favoriser la transparence et l'innovation en ouvrant les données non protégées.",
      "Commercialiser les fichiers administratifs pour financer les services de l'État.",
      "Diffuser l'intégralité des données individuelles nominatives des administrés en ligne.",
      "Restreindre l'accès aux données publiques aux seuls instituts de recherche universitaires."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : synthétise le double objectif (transparence et innovation) sous réserve de protection de la vie privée.",
      "Le texte impose une diffusion sous licence libre, non une commercialisation payante.",
      "Le texte exclut formellement les données relevant de la vie privée et de la sécurité.",
      "L'Open Data est ouvert à l'ensemble des citoyens et de la société civile, sans restriction d'usage."
    ],
    explanation: "La démarche Open Data vise la diffusion large et gratuite des données publiques non sensibles afin de renforcer la transparence et encourager les initiatives citoyennes et économiques.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-text-092",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "comprehension",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 75,
    prompt: "D'après cet extrait, quelle condition autorise l'utilisation exceptionnelle d'un véhicule de service pour un trajet privé ?",
    stimulus: "Règles d'utilisation du parc automobile : Les véhicules de service sont strictement affectés aux déplacements nécessités par les missions professionnelles. Aucun usage privé n'est toléré, sauf autorisation expresse délivrée par le secrétaire général pour des nécessités exceptionnelles de continuité ou d'astreinte opérationnelle d'urgence.",
    options: [
      "Une autorisation formelle expresse délivrée par le secrétaire général pour astreinte.",
      "Un accord verbal informel conclu entre l'agent conducteur et son chef de division directe.",
      "Le paiement préalable des frais d'essence par l'agent auprès de la régie ministérielle.",
      "Une utilisation limitée exclusivement au créneau méridien de pause déjeuner entre collègues."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : seule l'autorisation expresse du secrétaire général pour motif d'astreinte ou d'urgence est admise.",
      "Un accord verbal est insuffisant face à la rigueur de la réglementation.",
      "Payer le carburant ne confère aucun droit d'usage privé sur les biens de l'État.",
      "La pause méridienne relève de la vie privée et ne constitue pas une astreinte opérationnelle."
    ],
    explanation: "Le texte pose l'interdiction de principe absolue de tout usage privé, tempérée par une seule exception : l'autorisation écrite formelle du secrétaire général pour continuité de service.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-text-093",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "inference",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 80,
    prompt: "Que risque un fonctionnaire utilisant un véhicule public pour ses courses de week-end sans autorisation écrite ?",
    stimulus: "Règles d'utilisation du parc automobile : Les véhicules de service sont strictement affectés aux déplacements nécessités par les missions professionnelles. Aucun usage privé n'est toléré, sauf autorisation expresse délivrée par le secrétaire général pour des nécessités exceptionnelles de continuité ou d'astreinte opérationnelle d'urgence.",
    options: [
      "Une sanction disciplinaire pour détournement de biens publics et défaut de couverture d'assurance.",
      "Une simple remarque amicale sans conséquence sur son dossier administratif individuel.",
      "Le remboursement de l'équivalent d'un ticket de transport en commun auprès de la régie centrale.",
      "La cession automatique du véhicule de service à titre privé contre une retenue salariale."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : l'utilisation non autorisée constitue un détournement de moyen public et un risque assurantiel majeur.",
      "Le manquement aux règles de gestion du parc engage formellement la responsabilité disciplinaire.",
      "La sanction ne se réduit pas à une compensation tarifaire de transport en commun.",
      "L'administration ne cède pas ses biens publics aux fonctionnaires ayant enfreint le règlement."
    ],
    explanation: "L'usage indu d'un véhicule de l'État à des fins personnelles caractérise un manquement statutaire grave et expose le conducteur à une absence d'assurance en cas de sinistre.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-text-094",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "synthese",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 70,
    prompt: "Quelle idée maîtresse se dégage de cette directive sur les marchés d'alimentation collective ?",
    stimulus: "Restauration collective publique : Les cahiers des charges des cantines administratives et scolaires doivent intégrer au moins 50 % de produits issus de l'agriculture biologique ou de filières sous signes officiels de qualité, dont au moins 20 % en circuits courts régionaux. Cette obligation conjugue santé publique et soutien durable à l'agriculture locale.",
    options: [
      "Favoriser l'alimentation biologique et locale dans les cantines publiques pour la santé et le terroir.",
      "Interdire totalement l'approvisionnement en viandes au profit d'un régime strictement végétal.",
      "Augmenter de 50 % le tarif des repas facturés aux familles d'usagers dès le prochain trimestre.",
      "Privilégier exclusivement les fournisseurs industriels internationaux à bas coût de revient."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : résume les deux axes (qualité bio et circuits courts) au service de la santé et des filières locales.",
      "Le texte ne pose aucune interdiction sur les viandes mais encadre les modes de production.",
      "Le texte traite de la composition des achats, non d'une hausse tarifaire imposée aux familles.",
      "L'orientation privilégie précisément les circuits courts et la qualité, à l'opposé du bas coût industriel."
    ],
    explanation: "La mesure vise une restauration publique exemplaire combinant des exigences diététiques et environnementales (bio) avec le développement des circuits courts agricoles.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-text-095",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "comprehension",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 75,
    prompt: "Selon le texte, dans quel délai une administration doit-elle accuser réception d'une requête transmise par voie postale ?",
    stimulus: "Relations avec les usagers : Dès réception d'une demande écrite adressée par un citoyen, l'administration est tenue de lui expédier un accusé de réception dans un délai maximal de huit jours ouvrables. Ce récépissé mentionne obligatoirement le nom et les coordonnées du service instructeur ainsi que les voies et délais de recours.",
    options: [
      "Huit jours ouvrables au plus tard à compter de la réception de la demande écrite.",
      "Quinze jours calendaires suivant le traitement effectif du dossier par l'instructeur.",
      "Trente jours ouvrés après inscription de la lettre au registre central du courrier.",
      "Quarante-huit heures après validation formelle de la requête par le directeur de division."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : le texte fixe expressément le terme maximal à huit jours ouvrables dès réception.",
      "Le délai de quinze jours n'est pas celui prescrit pour l'accusé de réception initial.",
      "Le délai de trente jours concerne fréquemment la décision de fond, non le récépissé.",
      "Le texte n'exige pas de visa préalable du directeur pour envoyer l'accusé de réception."
    ],
    explanation: "L'obligation légale de délivrance de l'accusé de réception est assortie d'un délai strict de huit jours ouvrables à compter de l'arrivée du courrier.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-text-096",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "inference",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 85,
    prompt: "Que permet à l'usager la mention du service instructeur et des délais sur l'accusé de réception ?",
    stimulus: "Relations avec les usagers : Dès réception d'une demande écrite adressée par un citoyen, l'administration est tenue de lui expédier un accusé de réception dans un délai maximal de huit jours ouvrables. Ce récépissé mentionne obligatoirement le nom et les coordonnées du service instructeur ainsi que les voies et délais de recours.",
    options: [
      "Identifier son interlocuteur direct et faire valoir ses droits de recours en temps utile.",
      "Considérer que sa requête administrative est d'ores et déjà définitivement acceptée par l'État.",
      "Engager immédiatement une action indemnitaire devant les tribunaux pour lenteur des services.",
      "Exiger un entretien téléphonique quotidien avec le chef du département ministériel concerné."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : ces mentions obligatoires assurent la traçabilité de l'instruction et sécurisent l'exercice des droits de recours.",
      "L'accusé de réception atteste de l'arrivée du pli, non de l'acceptation sur le fond.",
      "Un recours contentieux immédiat serait irrecevable en l'absence de décision née.",
      "L'usager ne dispose pas d'un droit à des entretiens téléphoniques quotidiens."
    ],
    explanation: "Les mentions obligatoires sur le récépissé garantissent la sécurité juridique de l'administré en lui indiquant à qui s'adresser et comment contester une éventuelle décision future.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-text-097",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "synthese",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 70,
    prompt: "Quel est l'objectif premier du contrôle interne de gestion décrit dans ce document ?",
    stimulus: "Maîtrise des risques organisationnels : Le contrôle interne a pour finalité d'assurer la conformité des opérations administratives aux lois et règlements, la fiabilité des états financiers et la protection du patrimoine public. Il ne constitue pas un mécanisme d'inspection punitive mais un outil préventif de sécurisation des processus opérationnels.",
    options: [
      "Sécuriser préventivement les processus publics pour garantir la régularité et la probité.",
      "Sanctionner systématiquement les erreurs de saisie commises par les agents opérationnels.",
      "Supprimer les procédures d'audit pour alléger la charge de travail des directeurs de pôle.",
      "Externaliser le contrôle de légalité auprès de cabinets d'audit privés étrangers."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : synthétise la vocation préventive de conformité, de fiabilité financière et de sécurité des opérations.",
      "Le texte précise explicitement qu'il ne s'agit pas d'un outil d'inspection punitive.",
      "Le texte prône la consolidation du contrôle interne, non sa suppression.",
      "Le contrôle interne relève de la responsabilité propre des administrations de l'État."
    ],
    explanation: "Le document définit le contrôle interne comme un levier préventif et d'assurance qualité visant à fiabiliser les processus et prévenir les dérives de gestion.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-text-098",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "comprehension",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 75,
    prompt: "D'après cette note, quelle condition régit la publication d'un rectificatif à un avis de marché public ?",
    stimulus: "Passation des marchés : Toute modification substantielle apportée aux documents de consultation en cours de procédure impose la publication d'un avis rectificatif dans les mêmes formes que l'avis initial. Ce rectificatif doit prolonger le délai de réception des offres d'une durée proportionnée permettant aux candidats d'adapter leur proposition.",
    options: [
      "Publier un avis identique et prolonger le délai de remise pour adapter les offres.",
      "Modifier discrètement le cahier des charges sans en aviser les entreprises candidates.",
      "Annuler d'office la totalité de la consultation et recommencer la procédure à zéro.",
      "Exiger des soumissionnaires qu'ils déposent leur offre sans tenir compte des changements."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : publication selon les mêmes formes et report proportionné du délai de dépôt des offres.",
      "Toute modification occulte violerait le principe fondamental de transparence et d'égalité.",
      "L'annulation n'est pas requise si l'avis rectificatif et le report de délai suffisent à rétablir l'égalité.",
      "Les soumissionnaires doivent impérativement pouvoir intégrer les nouvelles prescriptions."
    ],
    explanation: "La modification des pièces en cours de consultation impose une publicité rectificative identique et une prolongation équitable du calendrier de réponse.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-text-099",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "inference",
    difficulty: 3,
    language: "fr",
    estimatedSeconds: 85,
    prompt: "Que risquerait l'acheteur public s'il modifiait substantiellement son besoin sans reporter la date limite de remise ?",
    stimulus: "Passation des marchés : Toute modification substantielle apportée aux documents de consultation en cours de procédure impose la publication d'un avis rectificatif dans les mêmes formes que l'avis initial. Ce rectificatif doit prolonger le délai de réception des offres d'une durée proportionnée permettant aux candidats d'adapter leur proposition.",
    options: [
      "Un recours en annulation pour rupture de l'égalité de traitement et entrave à la concurrence.",
      "L'obligation de verser une indemnité forfaitaire immédiate à tous les soumissionnaires.",
      "Une homologation tacite du contrat par la commission de surveillance des marchés publics.",
      "La transformation automatique du marché de travaux en simple accord-cadre de fournitures."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : ne pas reporter le délai empêche les candidats de concourir à armes égales, viciant la procédure.",
      "Une indemnité n'est pas versée automatiquement sans action en responsabilité formelle.",
      "Une irrégularité grave ne fait l'objet d'aucune homologation tacite par les autorités.",
      "La nature du contrat ne change pas automatiquement pour un vice de procédure."
    ],
    explanation: "Le défaut de prolongation du délai lors d'une modification majeure lèse les soumissionnaires et expose l'acheteur à l'annulation du marché devant le juge administratif.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  },
  {
    id: "verbal-text-100",
    version: 1,
    category: "verbal",
    itemFormat: "single_best",
    skill: "synthese",
    difficulty: 2,
    language: "fr",
    estimatedSeconds: 70,
    prompt: "Quelle conclusion générale résume l'esprit de ce code de conduite administrative ?",
    stimulus: "Éthique et déontologie du fonctionnaire : Le service de l'intérêt général constitue le fondement et la noblesse de la fonction publique. Chaque agent incarne la continuité, l'équité et la probité de l'État dans ses relations avec les usagers, ses collègues et les institutions démocratiques. L'exemplarité personnelle assure la confiance citoyenne dans les services publics.",
    options: [
      "L'exemplarité, l'équité et le service de l'intérêt général fondent la confiance publique.",
      "L'action de l'agent public vise en priorité l'optimisation des rentrées financières fiscales.",
      "Le fonctionnaire doit faire prévaloir ses convictions personnelles sur les textes légaux votés.",
      "La neutralité de l'administration est secondaire face aux impératifs d'efficacité économique."
    ],
    correctIndex: 0,
    optionRationales: [
      "Correct : résume les principes directeurs d'intégrité, d'équité et d'exemplarité au bénéfice de la confiance démocratique.",
      "L'intérêt général dépasse la simple préoccupation de perception fiscale.",
      "Le texte pose la primauté absolue de l'équité et de la probité de l'État sur les opinions privées.",
      "La neutralité et la continuité sont des fondements réaffirmés de la fonction publique."
    ],
    explanation: "Le code réaffirme les valeurs cardinales de la fonction publique : dévouement à l'intérêt général, impartialité, droiture et garantie de la confiance démocratique.",
    sourceType: "original_ai_assisted",
    reviewStatus: "approved",
    createdAt: NOW,
    reviewer: REVIEWER,
    reviewedAt: NOW
  }
];
