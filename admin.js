"use strict";
/* Admin UI for EAG A1 Académie.
 * Works in two modes:
 *  - offline: admin.html opened from disk; data embedded below; results downloaded as a ZIP;
 *  - server: started with `npm run admin`; reads/writes the repository through a local API.
 * All item text is escaped before display: candidate files are untrusted data. */
/* ADMIN_DATA_START */
const SCHEMA = {"$schema":"https://json-schema.org/draft/2020-12/schema","$id":"question.schema.json","title":"EAG A1 practice item","description":"Original practice item for EAG A1 familiarisation. Never an official EAG question. Text fields are plain text: HTML is forbidden (enforced by scripts/validate-bank.mjs).","type":"object","required":["id","version","category","itemFormat","skill","difficulty","language","estimatedSeconds","prompt","stimulus","options","correctIndex","explanation","sourceType","reviewStatus","createdAt"],"properties":{"id":{"type":"string","pattern":"^(abstract|verbal|numeric|planning|situational)-[a-z0-9-]+-[0-9]{3,}$"},"version":{"type":"integer","minimum":1},"category":{"enum":["abstract","verbal","numeric","planning","situational"]},"itemFormat":{"description":"single_best: one correct option (abstract, verbal, numeric, planning). tfcs: Vrai / Faux / On ne peut pas savoir (verbal only; practice format, not described officially). rating: each response rated 1-4 for appropriateness (situational only, matching the official 'évaluer leur pertinence').","enum":["single_best","tfcs","rating"]},"skill":{"type":"string"},"difficulty":{"description":"1 = one reasoning step; 2 = two steps or one plausible trap; 3 = three or more steps or interacting constraints.","type":"integer","minimum":1,"maximum":3},"language":{"enum":["fr","de"]},"estimatedSeconds":{"type":"integer","minimum":20,"maximum":300},"prompt":{"type":"string","minLength":12},"stimulus":{"oneOf":[{"type":"null"},{"type":"string","minLength":10,"description":"Plain text; line breaks are preserved."},{"type":"object","description":"Figural series or matrix written with symbols. Use \\n between matrix rows.","required":["type","text"],"properties":{"type":{"const":"shapes"},"text":{"type":"string","minLength":3}},"additionalProperties":false},{"type":"object","description":"Data table. The app renders it; never write HTML.","required":["type","headers","rows"],"properties":{"type":{"const":"table"},"caption":{"type":"string"},"headers":{"type":"array","minItems":2,"items":{"type":"string"}},"rows":{"type":"array","minItems":1,"items":{"type":"array","minItems":2,"items":{"type":["string","number"]}}},"note":{"type":"string"}},"additionalProperties":false}]},"options":{"type":"array","minItems":3,"maxItems":4,"uniqueItems":true,"items":{"type":"string","minLength":1}},"correctIndex":{"type":"integer","minimum":0,"maximum":3},"ratings":{"description":"rating format only: appropriateness of each option, 1 = très inapproprié ... 4 = très approprié. Same order as options; exactly one 4, at correctIndex (checked by validate-bank.mjs).","type":"array","minItems":4,"maxItems":4,"items":{"type":"integer","minimum":1,"maximum":4}},"optionRationales":{"description":"Recommended (required by the generation prompt): one entry per option, same order, saying why it is right or which error makes it wrong.","type":"array","minItems":3,"maxItems":4,"items":{"type":"string","minLength":8}},"explanation":{"type":"string","minLength":12},"sourceType":{"enum":["original_ai_assisted","original_human"]},"reviewStatus":{"enum":["candidate","pending_human","approved","rejected"]},"createdAt":{"type":"string","format":"date-time"},"reviewer":{"type":"string","minLength":2},"reviewedAt":{"type":"string","format":"date-time"},"reviewNotes":{"type":"string"},"rejectionReason":{"type":"string","minLength":3},"revisionOf":{"type":"string","pattern":"^(abstract|verbal|numeric|planning|situational)-[a-z0-9-]+-[0-9]{3,}$","description":"Candidate only: id of the approved item this revision would replace (same id). Removed on approval."}},"additionalProperties":false,"allOf":[{"if":{"properties":{"category":{"const":"abstract"}},"required":["category"]},"then":{"properties":{"id":{"pattern":"^abstract-"},"skill":{"enum":["suite-logique","matrice","rotation","transformation"]},"itemFormat":{"const":"single_best"},"stimulus":{"type":"object","properties":{"type":{"const":"shapes"}}}}}},{"if":{"properties":{"category":{"const":"verbal"}},"required":["category"]},"then":{"properties":{"id":{"pattern":"^verbal-"},"skill":{"enum":["comprehension","inference","application-consigne","vrai-faux-indetermine","synthese"]},"itemFormat":{"enum":["single_best","tfcs"]},"stimulus":{"type":"string"}}}},{"if":{"properties":{"category":{"const":"numeric"}},"required":["category"]},"then":{"properties":{"id":{"pattern":"^numeric-"},"skill":{"enum":["pourcentage","variation","ratio-proportion","moyenne","lecture-tableau","lecture-graphique","operations-simples"]},"itemFormat":{"const":"single_best"},"stimulus":{"type":["string","object"]}}}},{"if":{"properties":{"category":{"const":"planning"}},"required":["category"]},"then":{"properties":{"id":{"pattern":"^planning-"},"skill":{"enum":["agenda-contraintes","priorisation","dependances","disponibilites","conflits"]},"itemFormat":{"const":"single_best"},"stimulus":{"type":["string","object"]}}}},{"if":{"properties":{"category":{"const":"situational"}},"required":["category"]},"then":{"properties":{"id":{"pattern":"^situational-"},"skill":{"enum":["servir-client-usager","conseiller"]},"itemFormat":{"const":"rating"},"stimulus":{"type":"string"}}}},{"if":{"properties":{"itemFormat":{"const":"tfcs"}},"required":["itemFormat"]},"then":{"properties":{"options":{"enum":[["Vrai","Faux","On ne peut pas savoir"],["Richtig","Falsch","Nicht zu entscheiden"]]},"correctIndex":{"maximum":2},"optionRationales":{"minItems":3,"maxItems":3}},"not":{"required":["ratings"]}}},{"if":{"properties":{"itemFormat":{"const":"single_best"}},"required":["itemFormat"]},"then":{"properties":{"options":{"minItems":4},"optionRationales":{"minItems":4}},"not":{"required":["ratings"]}}},{"if":{"properties":{"itemFormat":{"const":"rating"}},"required":["itemFormat"]},"then":{"required":["ratings"],"properties":{"options":{"minItems":4},"optionRationales":{"minItems":4}}}},{"if":{"properties":{"reviewStatus":{"const":"approved"}},"required":["reviewStatus"]},"then":{"required":["reviewer","reviewedAt"]}},{"if":{"properties":{"reviewStatus":{"const":"rejected"}},"required":["reviewStatus"]},"then":{"required":["reviewer","rejectionReason"]}},{"if":{"properties":{"reviewStatus":{"const":"approved"}},"required":["reviewStatus"]},"then":{"not":{"required":["revisionOf"]}}}]};
const APPROVED_EMBEDDED = {"abstract":[{"id":"abstract-symb-001","version":2,"category":"abstract","itemFormat":"single_best","skill":"suite-logique","difficulty":1,"language":"fr","estimatedSeconds":45,"prompt":"Quel élément complète logiquement cette série ?","stimulus":{"type":"shapes","text":"○  ●  □  ■  △  ?"},"options":["▲","●","◆","△"],"correctIndex":0,"optionRationales":["Correct : le triangle vide est suivi du triangle plein.","Le cercle a déjà été traité au début de la série.","Le losange n'appartient pas à la séquence cercle, carré, triangle.","Répète la figure vide au lieu de passer à sa version pleine."],"explanation":"Chaque forme apparaît deux fois de suite, d'abord vide puis pleine : cercle, carré, puis triangle. Après △ vient donc ▲.","sourceType":"original_ai_assisted","reviewStatus":"approved","createdAt":"2026-09-30T12:00:00+02:00","reviewer":"hdjebar","reviewedAt":"2026-10-01T21:00:00+02:00"},{"id":"abstract-arrow-002","version":2,"category":"abstract","itemFormat":"single_best","skill":"rotation","difficulty":1,"language":"fr","estimatedSeconds":45,"prompt":"Quelle paire de flèches complète la suite ?","stimulus":{"type":"shapes","text":"↑ →     ↓ ←     ↑ →     ?"},"options":["↓ ←","→ ↓","← ↑","↑ →"],"correctIndex":0,"optionRationales":["Correct : rotation de 180° de la paire ↑ →.","Rotation de 90° seulement.","Rotation de 270° (ou 90° anti-horaire).","Répète la paire sans rotation."],"explanation":"Chaque paire est la précédente tournée de 180° : ↑ → devient ↓ ←, puis de nouveau ↑ →. La quatrième paire est donc ↓ ←.","sourceType":"original_ai_assisted","reviewStatus":"approved","createdAt":"2026-09-30T12:00:00+02:00","reviewer":"hdjebar","reviewedAt":"2026-10-01T21:00:00+02:00"},{"id":"abstract-latin-003","version":2,"category":"abstract","itemFormat":"single_best","skill":"matrice","difficulty":1,"language":"fr","estimatedSeconds":45,"prompt":"Quelle figure remplace le point d'interrogation dans la matrice ?","stimulus":{"type":"shapes","text":"●  ■  ▲\n■  ▲  ●\n▲  ●  ?"},"options":["■","●","▲","□"],"correctIndex":0,"optionRationales":["Correct : seul figure absente de la ligne et de la colonne.","Le disque figure déjà dans la dernière ligne.","Le triangle figure déjà dans la dernière ligne.","Bonne forme, mais toutes les figures de la matrice sont pleines."],"explanation":"Chaque ligne et chaque colonne contient une seule fois le disque, le carré et le triangle, tous pleins. La dernière ligne et la dernière colonne manquent toutes deux du carré plein ■.","sourceType":"original_ai_assisted","reviewStatus":"approved","createdAt":"2026-10-01T21:00:00+02:00","reviewer":"hdjebar","reviewedAt":"2026-10-01T21:00:00+02:00"},{"id":"abstract-grid-004","version":2,"category":"abstract","itemFormat":"single_best","skill":"matrice","difficulty":2,"language":"fr","estimatedSeconds":75,"prompt":"Quelle case complète la matrice ?","stimulus":{"type":"shapes","text":"●      ○○      ●●●\n■      □□      ■■■\n▲      △△      ?"},"options":["▲▲▲","△△△","▲▲","■■■"],"correctIndex":0,"optionRationales":["Correct : forme, nombre et remplissage respectés.","Le remplissage vide ne vaut que pour la colonne du milieu.","Le nombre doit être 3 dans la dernière colonne.","La forme doit rester le triangle sur la troisième ligne."],"explanation":"Trois règles : la forme est fixe sur chaque ligne ; le nombre de figures vaut 1, 2 puis 3 selon la colonne ; la colonne du milieu est vide, les autres pleines. Ligne 3, colonne 3 : trois triangles pleins.","sourceType":"original_ai_assisted","reviewStatus":"approved","createdAt":"2026-10-01T21:00:00+02:00","reviewer":"hdjebar","reviewedAt":"2026-10-01T21:00:00+02:00"},{"id":"abstract-dots-005","version":2,"category":"abstract","itemFormat":"single_best","skill":"suite-logique","difficulty":1,"language":"fr","estimatedSeconds":45,"prompt":"Quel groupe de points complète la progression ?","stimulus":{"type":"shapes","text":"●     ●●     ●●●     ?"},"options":["●●","●●●●","○○○○","●●●●●"],"correctIndex":1,"optionRationales":["Revient en arrière au lieu de progresser.","Correct : quatre disques pleins.","Bon nombre, mais le remplissage change sans raison.","Augmente de deux unités au lieu d'une."],"explanation":"Le nombre de disques pleins augmente d'une unité à chaque étape : 1, 2, 3, puis 4.","sourceType":"original_ai_assisted","reviewStatus":"approved","createdAt":"2026-09-30T12:00:00+02:00","reviewer":"hdjebar","reviewedAt":"2026-10-01T21:00:00+02:00"},{"id":"abstract-rot-006","version":2,"category":"abstract","itemFormat":"single_best","skill":"rotation","difficulty":2,"language":"fr","estimatedSeconds":75,"prompt":"Quelle figure vient ensuite dans la série ?","stimulus":{"type":"shapes","text":"◰  →  ◳  →  ◲  →  ?"},"options":["◱","◰","◳","◲"],"correctIndex":0,"optionRationales":["Correct : quadrant bas-gauche après bas-droite.","Revient au point de départ, une étape trop tôt.","Rotation dans le sens inverse.","Répète la dernière figure."],"explanation":"Le quadrant marqué tourne d'un quart de tour dans le sens horaire : haut-gauche, haut-droite, bas-droite, puis bas-gauche (◱).","sourceType":"original_ai_assisted","reviewStatus":"approved","createdAt":"2026-09-30T12:00:00+02:00","reviewer":"hdjebar","reviewedAt":"2026-10-01T21:00:00+02:00"},{"id":"abstract-interleave-007","version":2,"category":"abstract","itemFormat":"single_best","skill":"suite-logique","difficulty":2,"language":"fr","estimatedSeconds":75,"prompt":"Quel élément complète la série ?","stimulus":{"type":"shapes","text":"●    ▲    ●●    ▲▲    ●●●    ?"},"options":["▲▲▲","●●●●","▲▲","▲▲▲▲"],"correctIndex":0,"optionRationales":["Correct : troisième terme de la suite des triangles.","Prolonge la suite des disques au mauvais rang.","Répète le terme précédent de la suite des triangles.","Saute une étape de la progression."],"explanation":"Deux suites alternent : les disques (1, 2, 3) et les triangles (1, 2, …). Le sixième terme appartient à la suite des triangles, qui passe à 3.","sourceType":"original_ai_assisted","reviewStatus":"approved","createdAt":"2026-10-01T21:00:00+02:00","reviewer":"hdjebar","reviewedAt":"2026-10-01T21:00:00+02:00"},{"id":"abstract-flip-008","version":2,"category":"abstract","itemFormat":"single_best","skill":"transformation","difficulty":2,"language":"fr","estimatedSeconds":75,"prompt":"La même transformation s'applique à chaque paire. Quelle figure remplace le point d'interrogation ?","stimulus":{"type":"shapes","text":"▲  →  ▽\n◀  →  ▷\n▼  →  ?"},"options":["△","▽","▲","◁"],"correctIndex":0,"optionRationales":["Correct : demi-tour puis remplissage inversé.","Remplissage inversé, mais sans demi-tour.","Demi-tour, mais remplissage conservé.","Mauvaise orientation : la figure ne pointe ni vers le haut ni vers le bas."],"explanation":"Les deux exemples montrent la même transformation : un demi-tour (180°) et l'inversion du remplissage. Seul le demi-tour explique à la fois ▲ → ▽ et ◀ → ▷ (une symétrie selon un seul axe ne marche que pour l'un des deux). ▼ tourné de 180° donne ▲, puis vide : △.","sourceType":"original_ai_assisted","reviewStatus":"approved","createdAt":"2026-10-01T21:00:00+02:00","reviewer":"hdjebar","reviewedAt":"2026-10-01T21:00:00+02:00"},{"id":"abstract-mirror-009","version":2,"category":"abstract","itemFormat":"single_best","skill":"transformation","difficulty":3,"language":"fr","estimatedSeconds":120,"prompt":"Appliquez la même règle à la seconde ligne. Quel résultat obtient-on ?","stimulus":{"type":"shapes","text":"●  ■  ▲   →   △  □  ○\n◆  ○  ■   →   ?"},"options":["□  ●  ◇","■  ○  ◆","◇  ●  □","□  ○  ◇"],"correctIndex":0,"optionRationales":["Correct : ordre inversé et remplissage inversé.","Ordre inversé, mais remplissage conservé.","Remplissage inversé, mais ordre conservé.","Le disque n'a pas été inversé."],"explanation":"Deux règles combinées : l'ordre des figures est inversé, et chaque remplissage est inversé. ◆ ○ ■ inversé donne ■ ○ ◆, puis le remplissage inversé donne □ ● ◇.","sourceType":"original_ai_assisted","reviewStatus":"approved","createdAt":"2026-10-01T21:00:00+02:00","reviewer":"hdjebar","reviewedAt":"2026-10-01T21:00:00+02:00"},{"id":"abstract-gap-010","version":2,"category":"abstract","itemFormat":"single_best","skill":"suite-logique","difficulty":2,"language":"fr","estimatedSeconds":75,"prompt":"Quel élément complète la série ?","stimulus":{"type":"shapes","text":"●  ■  ●  ■  ■  ●  ■  ■  ■  ?"},"options":["●","■","▲","○"],"correctIndex":0,"optionRationales":["Correct : le groupe de trois carrés est complet.","Un quatrième carré dépasserait le groupe de trois.","Le triangle n'apparaît pas dans la série.","Le disque est plein dans toute la série."],"explanation":"Entre deux disques, le nombre de carrés augmente : 1, 2, puis 3. Après le troisième carré du groupe de trois vient donc un disque.","sourceType":"original_ai_assisted","reviewStatus":"approved","createdAt":"2026-10-01T21:00:00+02:00","reviewer":"hdjebar","reviewedAt":"2026-10-01T21:00:00+02:00"}],"verbal":[{"id":"verbal-deduct-001","version":2,"category":"verbal","itemFormat":"single_best","skill":"inference","difficulty":1,"language":"fr","estimatedSeconds":45,"prompt":"Quelle conclusion est absolument certaine à partir des seuls éléments fournis ?","stimulus":"Tous les dossiers urgents sont examinés le jour même. Le dossier L est urgent.","options":["Le dossier L est accepté.","Le dossier L est examiné le jour même.","Le dossier L est le premier examiné.","Tous les dossiers de la journée sont urgents."],"correctIndex":1,"optionRationales":["L'examen ne préjuge en rien de la décision finale (acceptation ou rejet).","Correct : tout dossier urgent étant examiné le jour même, le dossier L l'est obligatoirement.","L'énoncé ne précise aucun ordre de passage parmi les dossiers examinés.","Généralise abusivement la propriété d'un sous-ensemble à l'ensemble des dossiers."],"explanation":"L'énoncé affirme expressément que tout dossier urgent fait l'objet d'un examen le jour même ; aucune conclusion sur la décision finale ou l'ordre exact n'est permise.","sourceType":"original_ai_assisted","reviewStatus":"approved","createdAt":"2026-09-30T12:00:00+02:00","reviewer":"hdjebar","reviewedAt":"2026-10-02T09:15:00+02:00"},{"id":"verbal-cond-002","version":3,"category":"verbal","itemFormat":"single_best","skill":"inference","difficulty":2,"language":"fr","estimatedSeconds":75,"prompt":"Quelle affirmation découle rigoureusement des conditions indiquées ?","stimulus":"Le guichet ouvre à 8 h 30. Les rendez-vous avant 10 h sont réservés aux demandes déjà complètes. Nora a obtenu un rendez-vous à 9 h 15.","options":["La demande de Nora est déjà complète.","Nora sera reçue avant l'ouverture générale du guichet.","Nora sera reçue dès l'ouverture du guichet.","La demande de Nora sera automatiquement acceptée."],"correctIndex":0,"optionRationales":["Correct : les créneaux avant 10 h étant réservés aux dossiers complets, un créneau à 9 h 15 implique un dossier complet.","Le guichet ouvrant à 8 h 30, un rendez-vous à 9 h 15 a lieu après l'ouverture.","L'ouverture a lieu à 8 h 30, tandis que le rendez-vous de Nora est calé à 9 h 15.","L'obtention d'un rendez-vous ne préjuge aucunement de l'acceptation de la demande."],"explanation":"Les créneaux avant 10 h sont réservés aux demandes déjà complètes ; un rendez-vous à 9 h 15 implique donc une demande complète. Le texte ne dit rien de l'heure exacte de passage, ni de la décision.","sourceType":"original_ai_assisted","reviewStatus":"approved","createdAt":"2026-09-30T12:00:00+02:00","reviewer":"hdjebar","reviewedAt":"2026-10-02T09:15:00+02:00"},{"id":"verbal-quant-003","version":2,"category":"verbal","itemFormat":"tfcs","skill":"vrai-faux-indetermine","difficulty":2,"language":"fr","estimatedSeconds":75,"prompt":"Affirmation : Malik travaille à distance.","stimulus":"Certains analystes travaillent à distance. Malik est analyste.","options":["Vrai","Faux","On ne peut pas savoir"],"correctIndex":2,"optionRationales":["Généralise « certains » à tous les analystes.","Le texte n'exclut pas non plus que Malik travaille à distance.","Correct : « certains » ne permet pas de savoir si Malik en fait partie."],"explanation":"L'expression « certains » indique l'existence d'au moins un analyste à distance, sans préciser si Malik en fait partie.","sourceType":"original_ai_assisted","reviewStatus":"approved","createdAt":"2026-09-30T12:00:00+02:00","reviewer":"hdjebar","reviewedAt":"2026-10-01T21:00:00+02:00"},{"id":"verbal-order-004","version":2,"category":"verbal","itemFormat":"single_best","skill":"application-consigne","difficulty":1,"language":"fr","estimatedSeconds":45,"prompt":"Quelle séquence respecte scrupuleusement la règle de classement ?","stimulus":"Classer les dossiers par date croissante. À date identique, placer en premier le numéro le plus petit.","options":["12/04 n° 18, puis 11/04 n° 22","11/04 n° 22, puis 11/04 n° 19","11/04 n° 19, puis 11/04 n° 22","12/04 n° 12, puis 11/04 n° 10"],"correctIndex":2,"optionRationales":["Viole la préséance de date croissante (le 12/04 est placé avant le 11/04).","À date identique (11/04), le numéro le plus faible (19) doit impérativement précéder le 22.","Correct : date identique (11/04) et ordre croissant strict des numéros (19 avant 22).","Viole l'ordre chronologique croissant des dates."],"explanation":"À date identique (11/04), le numéro le plus faible (19) doit impérativement précéder le numéro plus élevé (22).","sourceType":"original_ai_assisted","reviewStatus":"approved","createdAt":"2026-09-30T12:00:00+02:00","reviewer":"hdjebar","reviewedAt":"2026-10-02T09:15:00+02:00"},{"id":"verbal-neg-005","version":2,"category":"verbal","itemFormat":"single_best","skill":"inference","difficulty":2,"language":"fr","estimatedSeconds":75,"prompt":"Quelle conclusion n'est PAS justifiée par le passage ?","stimulus":"Aucun rapport incomplet n'est transmis. Certains rapports du service B sont transmis.","options":["Certains rapports du service B sont complets.","Aucun rapport transmis n'est incomplet.","Tous les rapports du service B sont transmis.","Au moins un rapport du service B est transmis."],"correctIndex":2,"optionRationales":["Justifié : les rapports transmis étant nécessairement complets, ceux de B qui sont transmis sont complets.","Justifié : découle directement de la prémisse interdisant la transmission de rapports incomplets.","Correct : le fait que certains rapports soient transmis n'autorise pas à affirmer que tous le sont.","Justifié : l'emploi de « certains » implique l'existence d'au moins un élément."],"explanation":"Le passage mentionne que certains rapports sont transmis, ce qui interdit d'affirmer que tous les rapports du service le sont.","sourceType":"original_ai_assisted","reviewStatus":"approved","createdAt":"2026-09-30T12:00:00+02:00","reviewer":"hdjebar","reviewedAt":"2026-10-02T09:15:00+02:00"},{"id":"verbal-syll-006","version":2,"category":"verbal","itemFormat":"single_best","skill":"inference","difficulty":2,"language":"fr","estimatedSeconds":75,"prompt":"Quelle déduction s'impose logiquement à partir des deux prémisses ?","stimulus":"Tout arrêté ministériel fait l'objet d'une publication. Le document G ne fait l'objet d'aucune publication.","options":["Le document G n'est pas un arrêté ministériel.","Le document G est un projet de loi en cours.","Le document G sera publié ultérieurement.","Certains arrêtés ministériels ne sont pas publiés."],"correctIndex":0,"optionRationales":["Correct : par contraposition (si arrêté alors publié ; non publié donc pas un arrêté).","Spéculation sans fondement dans les prémisses fournies.","Supposition temporelle non étayée par le texte.","Contredit formellement la règle selon laquelle tout arrêté est publié."],"explanation":"Par contraposition logique : si tout arrêté est publié, un document non publié ne peut en aucun cas constituer un arrêté ministériel.","sourceType":"original_ai_assisted","reviewStatus":"approved","createdAt":"2026-09-30T12:00:00+02:00","reviewer":"hdjebar","reviewedAt":"2026-10-02T09:15:00+02:00"},{"id":"verbal-rule-007","version":2,"category":"verbal","itemFormat":"single_best","skill":"application-consigne","difficulty":2,"language":"fr","estimatedSeconds":75,"prompt":"Quelle décision est conforme à la directive énoncée ?","stimulus":"Toute demande de subvention supérieure à 50 000 euros requiert un avis préalable de la commission financière. Le projet Alpha sollicite 45 000 euros.","options":["Le projet Alpha ne requiert pas obligatoirement l'avis préalable de la commission financière au titre de cette règle.","Le projet Alpha doit impérativement obtenir l'accord unanime de la commission financière.","Le projet Alpha sera automatiquement rejeté pour insuffisance de montant.","Le projet Alpha est dispensé de tout contrôle administratif."],"correctIndex":0,"optionRationales":["Correct : le seuil d'exigence étant strictement supérieur à 50 000 euros, 45 000 euros n'activent pas cette obligation.","La règle n'évoque aucun accord unanime requis.","Confusion : la directive n'impose aucun seuil minimal pour solliciter une subvention.","Généralisation abusive : le projet n'est exempté que de cette formalité spécifique."],"explanation":"Le seuil obligatoire est fixé strictement aux montants supérieurs à 50 000 euros ; 45 000 euros ne déclenchent pas cette obligation spécifique.","sourceType":"original_ai_assisted","reviewStatus":"approved","createdAt":"2026-09-30T12:00:00+02:00","reviewer":"hdjebar","reviewedAt":"2026-10-02T09:15:00+02:00"},{"id":"verbal-extrap-008","version":2,"category":"verbal","itemFormat":"single_best","skill":"inference","difficulty":3,"language":"fr","estimatedSeconds":120,"prompt":"Laquelle des propositions constitue une extrapolation non démontrée par le texte ?","stimulus":"La dématérialisation des formulaires a réduit le délai moyen de traitement de 14 jours à 6 jours au premier semestre.","options":["Les usagers sont globalement plus satisfaits de la qualité de service.","Le délai moyen de traitement constaté s'est contracté de 8 jours.","Le délai moyen est passé sous la barre des dix jours au premier semestre.","Le traitement moyen était plus long avant le premier semestre concerné."],"correctIndex":0,"optionRationales":["Correct : le texte n'apporte aucune donnée sur la satisfaction des usagers, seulement un indicateur de délai.","Parfaitement démontré par la différence arithmétique (14 - 6 = 8 jours).","Démontré par l'observation directe du chiffre de 6 jours.","Démontré par la comparaison avec la durée préalable de 14 jours."],"explanation":"Le texte renseigne un indicateur temporel précis (délai en jours), mais ne fournit aucune donnée sur le niveau de satisfaction des usagers.","sourceType":"original_ai_assisted","reviewStatus":"approved","createdAt":"2026-09-30T12:00:00+02:00","reviewer":"hdjebar","reviewedAt":"2026-10-02T09:15:00+02:00"},{"id":"verbal-equiv-009","version":2,"category":"verbal","itemFormat":"single_best","skill":"comprehension","difficulty":2,"language":"fr","estimatedSeconds":75,"prompt":"Quelle formulation exprime exactement le même sens logique ?","stimulus":"Il est impossible d'accéder à la zone sécurisée sans badge d'identification actif.","options":["Avoir un badge actif est une condition indispensable pour accéder à la zone sécurisée.","Toute personne munie d'un badge actif a le droit d'entrer dans la zone sécurisée.","Les personnes sans badge peuvent être admises avec un accompagnateur.","Le badge actif garantit un accès permanent et sans restriction."],"correctIndex":0,"optionRationales":["Correct : l'impossibilité d'accéder sans badge fait de sa détention une condition nécessaire (indispensable).","Confond condition nécessaire et condition suffisante (le badge est requis, mais d'autres conditions peuvent s'appliquer).","Extrapole une exception d'accompagnement non stipulée dans la règle.","Le badge est requis, mais il ne confère aucun accès permanent ou sans restriction."],"explanation":"L'absence de badge empêchant l'accès, la détention d'un badge actif constitue bien une condition nécessaire (indispensable) d'accès.","sourceType":"original_ai_assisted","reviewStatus":"approved","createdAt":"2026-09-30T12:00:00+02:00","reviewer":"hdjebar","reviewedAt":"2026-10-02T09:15:00+02:00"},{"id":"verbal-fact-010","version":2,"category":"verbal","itemFormat":"single_best","skill":"comprehension","difficulty":2,"language":"fr","estimatedSeconds":75,"prompt":"Quelle proposition relève d'un fait constatable et non d'une appréciation subjective ?","stimulus":"Le nouveau logiciel de gestion des congés est remarquable, il enregistre 1 200 connexions quotidiennes et simplifie grandement la vie du personnel.","options":["Le logiciel enregistre 1 200 connexions quotidiennes.","Le nouveau logiciel est particulièrement remarquable.","La vie du personnel est grandement simplifiée.","Ce système est la meilleure solution disponible."],"correctIndex":0,"optionRationales":["Correct : le comptage de 1 200 connexions est une donnée objective et quantifiable.","Appréciation qualitative subjective.","Jugement de valeur subjectif quant au bien-être du personnel.","Jugement subjectif sans fondement factuel quantifié."],"explanation":"Le comptage de 1 200 connexions est une mesure quantitative objectivement vérifiable, à la différence des appréciations qualitatives.","sourceType":"original_ai_assisted","reviewStatus":"approved","createdAt":"2026-09-30T12:00:00+02:00","reviewer":"hdjebar","reviewedAt":"2026-10-02T09:15:00+02:00"}],"numeric":[{"id":"numeric-ratio-001","version":3,"category":"numeric","itemFormat":"single_best","skill":"variation","difficulty":2,"language":"fr","estimatedSeconds":75,"prompt":"Quel service administratif enregistre la plus forte progression relative entre janvier et février ?","stimulus":{"type":"table","caption":"Demandes traitées par service","headers":["Service","Janvier","Février"],"rows":[["A",120,138],["B",80,96],["C",150,165]]},"options":["Service A","Service B","Service C","Service A et Service B à égalité"],"correctIndex":1,"optionRationales":["Le service A progresse de (138 - 120) / 120 = +15 %.","Correct : le service B progresse de (96 - 80) / 80 = +20 %, soit la hausse relative la plus forte.","Le service C progresse de (165 - 150) / 150 = +10 %.","Les progressions relatives sont différentes : 15 % pour A et 20 % pour B."],"explanation":"Calcul des taux : Service A = (138-120)/120 = +15 % ; Service B = (96-80)/80 = +20 % ; Service C = (165-150)/150 = +10 %. Le service B a la plus forte hausse.","sourceType":"original_ai_assisted","reviewStatus":"approved","createdAt":"2026-09-30T12:00:00+02:00","reviewer":"hdjebar","reviewedAt":"2026-10-02T09:15:00+02:00"},{"id":"numeric-mean-002","version":2,"category":"numeric","itemFormat":"single_best","skill":"moyenne","difficulty":1,"language":"fr","estimatedSeconds":45,"prompt":"Combien de dossiers sont instruits en moyenne chaque jour ouvré ?","stimulus":"Une équipe instruit 420 dossiers en 7 jours ouvrés à rythme régulier et constant.","options":["50 dossiers","55 dossiers","60 dossiers","65 dossiers"],"correctIndex":2,"optionRationales":["Sous-estime la cadence quotidienne (50 × 7 = 350 dossiers au lieu de 420).","Erreur de division arithmétique (55 × 7 = 385 dossiers).","Correct : 420 dossiers divisés par 7 jours ouvrés donnent 60 dossiers par jour.","Surestime la cadence quotidienne (65 × 7 = 455 dossiers)."],"explanation":"Le calcul direct de la moyenne quotidienne donne 420 divisé par 7, soit exactement 60 dossiers par jour ouvré.","sourceType":"original_ai_assisted","reviewStatus":"approved","createdAt":"2026-09-30T12:00:00+02:00","reviewer":"hdjebar","reviewedAt":"2026-10-02T09:15:00+02:00"},{"id":"numeric-perc-003","version":2,"category":"numeric","itemFormat":"single_best","skill":"pourcentage","difficulty":1,"language":"fr","estimatedSeconds":45,"prompt":"Quel est le nouveau temps moyen de réponse après optimisation ?","stimulus":"Un temps moyen de réponse de 40 minutes est réduit de 15 % grâce à une procédure simplifiée.","options":["34 minutes","35 minutes","36 minutes","38 minutes"],"correctIndex":0,"optionRationales":["Correct : réduction de 15 % de 40 min = 6 min ; 40 - 6 = 34 minutes.","Soustraction erronée de 5 minutes au lieu de 6 minutes.","Correspondrait à une réduction de 10 % seulement (4 minutes retranchées).","Correspondrait à une réduction de 5 % seulement (2 minutes retranchées)."],"explanation":"La réduction s'élève à 15 % de 40 = 6 minutes. Le nouveau délai est donc de 40 - 6 = 34 minutes.","sourceType":"original_ai_assisted","reviewStatus":"approved","createdAt":"2026-09-30T12:00:00+02:00","reviewer":"hdjebar","reviewedAt":"2026-10-02T09:15:00+02:00"},{"id":"numeric-rate-004","version":2,"category":"numeric","itemFormat":"single_best","skill":"pourcentage","difficulty":1,"language":"fr","estimatedSeconds":45,"prompt":"Combien de demandes reçoivent une décision favorable ?","stimulus":"Sur un total de 250 demandes d'agrément examinées, 72 % sont approuvées.","options":["170 demandes","175 demandes","180 demandes","185 demandes"],"correctIndex":2,"optionRationales":["Correspondrait à 68 % de 250 demandes.","Correspondrait à 70 % de 250 demandes.","Correct : 250 × 0,72 = 180 demandes approuvées.","Correspondrait à 74 % de 250 demandes."],"explanation":"Le calcul direct donne 250 × 0,72 = 180 demandes approuvées.","sourceType":"original_ai_assisted","reviewStatus":"approved","createdAt":"2026-09-30T12:00:00+02:00","reviewer":"hdjebar","reviewedAt":"2026-10-02T09:15:00+02:00"},{"id":"numeric-table-005","version":3,"category":"numeric","itemFormat":"single_best","skill":"lecture-tableau","difficulty":2,"language":"fr","estimatedSeconds":75,"prompt":"Quel trimestre présente le taux de résolution le plus performant ?","stimulus":{"type":"table","caption":"Demandes par trimestre","headers":["Trimestre","Reçues","Résolues"],"rows":[["T1",200,160],["T2",240,204],["T3",180,144]]},"options":["Trimestre 1","Trimestre 2","Trimestre 3","Trimestre 1 et Trimestre 3 à égalité"],"correctIndex":1,"optionRationales":["T1 affiche un taux de 160 / 200 = 80 %.","Correct : T2 affiche un taux de 204 / 240 = 85 %, le plus performant.","T3 affiche un taux de 144 / 180 = 80 %.","T1 et T3 atteignent tous deux 80 %, mais restent inférieurs aux 85 % de T2."],"explanation":"Taux de résolution : T1 = 160/200 = 80 % ; T2 = 204/240 = 85 % ; T3 = 144/180 = 80 %. Le trimestre 2 est le plus performant.","sourceType":"original_ai_assisted","reviewStatus":"approved","createdAt":"2026-09-30T12:00:00+02:00","reviewer":"hdjebar","reviewedAt":"2026-10-02T09:15:00+02:00"},{"id":"numeric-budget-006","version":2,"category":"numeric","itemFormat":"single_best","skill":"pourcentage","difficulty":2,"language":"fr","estimatedSeconds":75,"prompt":"Quel montant résiduel reste-t-il disponible sur l'enveloppe allouée ?","stimulus":"Une enveloppe budgétaire de 80 000 euros est consommée à hauteur de 45 % au premier trimestre, puis 25 % du budget initial au second trimestre.","options":["24 000 euros","20 000 euros","28 000 euros","16 000 euros"],"correctIndex":0,"optionRationales":["Correct : consommation cumulée de 70 % ; reste 30 % de 80 000 € = 24 000 euros.","Correspondrait à 25 % de reliquat (75 % de consommation supposée).","Sous-estimerait la consommation globale à 65 % au lieu de 70 %.","Calculerait seulement 20 % de budget résiduel."],"explanation":"La consommation totale représente 45 % + 25 % = 70 % du montant initial. La part restante est de 30 % de 80 000 euros, soit 24 000 euros.","sourceType":"original_ai_assisted","reviewStatus":"approved","createdAt":"2026-09-30T12:00:00+02:00","reviewer":"hdjebar","reviewedAt":"2026-10-02T09:15:00+02:00"},{"id":"numeric-weight-007","version":3,"category":"numeric","itemFormat":"single_best","skill":"moyenne","difficulty":2,"language":"fr","estimatedSeconds":75,"prompt":"Quelle est la moyenne pondérée des trois évaluations ?","stimulus":"Évaluation A (coefficient 3) : 14/20. Évaluation B (coefficient 2) : 16/20. Évaluation C (coefficient 5) : 11/20.","options":["12,9 / 20","13,2 / 20","13,7 / 20","12,5 / 20"],"correctIndex":0,"optionRationales":["Correct : [(14×3) + (16×2) + (11×5)] / 10 = (42 + 32 + 55) / 10 = 129 / 10 = 12,9.","Erreur d'application sur la pondération du coefficient 5.","Correspondrait à la moyenne simple non pondérée : (14 + 16 + 11) / 3 = 13,67.","Sous-évaluation globale résultant d'une erreur de sommation des coefficients."],"explanation":"Calcul de la moyenne pondérée : [(14×3) + (16×2) + (11×5)] / (3+2+5) = (42 + 32 + 55) / 10 = 129 / 10 = 12,9 / 20.","sourceType":"original_ai_assisted","reviewStatus":"approved","createdAt":"2026-09-30T12:00:00+02:00","reviewer":"hdjebar","reviewedAt":"2026-10-02T09:15:00+02:00"},{"id":"numeric-scale-008","version":2,"category":"numeric","itemFormat":"single_best","skill":"ratio-proportion","difficulty":2,"language":"fr","estimatedSeconds":75,"prompt":"Quelle est la distance réelle sur le terrain correspondant à cette mesure ?","stimulus":"Sur un plan d'urbanisme à l'échelle 1:2 500, un tracé de raccordement mesure 8 centimètres.","options":["200 mètres","20 mètres","2 000 mètres","160 mètres"],"correctIndex":0,"optionRationales":["Correct : 8 cm × 2 500 = 20 000 cm = 200 mètres.","Erreur d'un facteur 10 dans la conversion des centimètres en mètres.","Erreur d'un facteur 10 par excès dans la conversion d'unités.","Confusion dans le calcul (8 × 2 000 au lieu de 8 × 2 500)."],"explanation":"La distance réelle équivaut à 8 cm × 2 500 = 20 000 cm = 200 mètres.","sourceType":"original_ai_assisted","reviewStatus":"approved","createdAt":"2026-09-30T12:00:00+02:00","reviewer":"hdjebar","reviewedAt":"2026-10-02T09:15:00+02:00"},{"id":"numeric-speed-009","version":2,"category":"numeric","itemFormat":"single_best","skill":"operations-simples","difficulty":3,"language":"fr","estimatedSeconds":120,"prompt":"Combien de temps faut-il pour traiter les 60 dossiers restants en travaillant conjointement ?","stimulus":"L'agent X traite 6 dossiers par heure. L'agent Y traite 4 dossiers par heure.","options":["6 heures","5 heures","7 heures","8 heures"],"correctIndex":0,"optionRationales":["Correct : cadence cumulée de 6 + 4 = 10 dossiers/h ; 60 / 10 = 6 heures.","Sous-estime le temps nécessaire (à 10 dossiers/h, 5 h ne produiraient que 50 dossiers).","Surestimerait la durée nécessaire en minorant le débit conjoint.","Correspondrait au travail d'un seul agent sans mise en commun des cadences."],"explanation":"Leur cadence combinée est de 6 + 4 = 10 dossiers par heure. Pour 60 dossiers, il faut 60 / 10 = 6 heures.","sourceType":"original_ai_assisted","reviewStatus":"approved","createdAt":"2026-09-30T12:00:00+02:00","reviewer":"hdjebar","reviewedAt":"2026-10-02T09:15:00+02:00"},{"id":"numeric-delta-010","version":2,"category":"numeric","itemFormat":"single_best","skill":"variation","difficulty":2,"language":"fr","estimatedSeconds":75,"prompt":"De combien de points de pourcentage le taux de présence a-t-il augmenté ?","stimulus":"Le taux de participation des agents aux formations passe de 60 % à 75 % d'une année sur l'autre.","options":["15 points","25 points","15 %","20 points"],"correctIndex":0,"optionRationales":["Correct : l'écart arithmétique absolu entre 75 % et 60 % est de 15 points de pourcentage.","Confond la progression relative (+25 %) avec l'écart absolu en points.","Emploie le symbole % réservé aux variations relatives, et non aux points d'écart.","Erreur arithmétique dans la soustraction 75 - 60."],"explanation":"La différence entre deux pourcentages s'exprime en points de pourcentage : 75 - 60 = 15 points (alors que la hausse relative est de 25 %).","sourceType":"original_ai_assisted","reviewStatus":"approved","createdAt":"2026-09-30T12:00:00+02:00","reviewer":"hdjebar","reviewedAt":"2026-10-02T09:15:00+02:00"}],"planning":[{"id":"planning-slot-001","version":4,"category":"planning","itemFormat":"single_best","skill":"disponibilites","difficulty":2,"language":"fr","estimatedSeconds":75,"prompt":"Quel créneau permet d'organiser une réunion de 45 minutes commune aux deux participants ?","stimulus":"Léa est disponible de 9 h 00 à 10 h 30 et de 14 h 00 à 15 h 00. Sam est disponible de 9 h 30 à 11 h 00 et de 14 h 30 à 16 h 00.","options":["9 h 00 à 9 h 45","9 h 30 à 10 h 15","14 h 00 à 14 h 45","14 h 30 à 15 h 15"],"correctIndex":1,"optionRationales":["Sam n'est pas disponible avant 9 h 30.","Correct : les deux participants sont disponibles simultanément de 9 h 30 à 10 h 30.","Sam n'est pas disponible avant 14 h 30.","Léa n'est plus disponible après 15 h 00 (la réunion se terminerait à 15 h 15)."],"explanation":"Le créneau commun le matin s'étend de 9 h 30 à 10 h 30 (durée 60 min). La réunion de 45 minutes peut donc se tenir de 9 h 30 à 10 h 15. Les autres créneaux empiètent sur l'indisponibilité de l'un des participants (Sam avant 9 h 30 le matin ou avant 14 h 30 l'après-midi ; Léa après 15 h 00).","sourceType":"original_ai_assisted","reviewStatus":"approved","createdAt":"2026-09-30T12:00:00+02:00","reviewer":"hdjebar","reviewedAt":"2026-10-02T10:40:00+02:00"},{"id":"planning-prio-002","version":3,"category":"planning","itemFormat":"single_best","skill":"priorisation","difficulty":2,"language":"fr","estimatedSeconds":75,"prompt":"Quelle tâche devez-vous impérativement démarrer en premier ?","stimulus":"Il est 9 h 00. Tâche A : échéance 10 h 00, durée 20 min. Tâche B : échéance demain, durée 15 min. Tâche C : échéance aujourd'hui 16 h 00, durée 60 min. Tâche D : échéance 11 h 30, durée 90 min.","options":["Tâche A","Tâche B","Tâche C","Tâche D"],"correctIndex":0,"optionRationales":["Correct : son échéance (10 h 00) est la plus imminente et impose un démarrage sans attendre.","Échéance fixée au lendemain, donc bien moins urgente que la tâche A.","Échéance fixée à 16 h 00, laissant une marge temporelle suffisante après réalisation de A.","Commencer par D (90 min) mènerait à 10 h 30 : A finirait à 10 h 50, après son échéance de 10 h 00."],"explanation":"Commencer par A (9 h 00 – 9 h 20) respecte son échéance de 10 h 00 et laisse D se terminer à 10 h 50, avant 11 h 30. Commencer par D ferait manquer l'échéance de A. B et C ont des échéances plus lointaines.","sourceType":"original_ai_assisted","reviewStatus":"approved","createdAt":"2026-09-30T12:00:00+02:00","reviewer":"hdjebar","reviewedAt":"2026-10-02T10:40:00+02:00"},{"id":"planning-order-003","version":2,"category":"planning","itemFormat":"single_best","skill":"dependances","difficulty":1,"language":"fr","estimatedSeconds":45,"prompt":"Quel ordonnancement respecte l'intégralité des contraintes de préséance imposées ?","stimulus":"L'étape X doit impérativement précéder l'étape Y. L'étape Z doit être réalisée après l'étape Y.","options":["Z, puis X, puis Y","X, puis Z, puis Y","Y, puis X, puis Z","X, puis Y, puis Z"],"correctIndex":3,"optionRationales":["Viole les deux contraintes : Z est placé avant Y, et Y est placé après Z.","Viole la contrainte imposant que Z soit réalisé après Y.","Viole la préséance stricte de X sur Y.","Correct : respecte successivement X avant Y, puis Y avant Z."],"explanation":"Les contraintes X < Y et Y < Z imposent strictement l'enchaînement direct X, puis Y, puis Z.","sourceType":"original_ai_assisted","reviewStatus":"approved","createdAt":"2026-09-30T12:00:00+02:00","reviewer":"hdjebar","reviewedAt":"2026-10-02T09:15:00+02:00"},{"id":"planning-room-004","version":2,"category":"planning","itemFormat":"single_best","skill":"conflits","difficulty":2,"language":"fr","estimatedSeconds":75,"prompt":"Quel créneau faut-il réserver pour satisfaire l'ensemble des contraintes ?","stimulus":"Entretien de 30 minutes avant midi. Salle libre de 10:00 à 10:30 et de 11:00 à 12:00. Candidate indisponible de 10:15 à 11:15.","options":["10:00 à 10:30","10:15 à 10:45","11:00 à 11:30","11:15 à 11:45"],"correctIndex":3,"optionRationales":["Conflit avec la candidate dès 10:15, ne laissant que 15 minutes utiles.","La candidate est en indisponibilité sur l'ensemble de cette plage horaire.","La candidate n'est pas encore disponible entre 11:00 et 11:15.","Correct : la salle est libre jusqu'à midi et la candidate est disponible dès 11:15 pour 30 minutes."],"explanation":"La candidate se libère à 11:15 et la salle est libre jusqu'à 12:00 ; le créneau 11:15-11:45 offre 30 minutes effectives sans conflit.","sourceType":"original_ai_assisted","reviewStatus":"approved","createdAt":"2026-09-30T12:00:00+02:00","reviewer":"hdjebar","reviewedAt":"2026-10-02T09:15:00+02:00"},{"id":"planning-delay-005","version":2,"category":"planning","itemFormat":"single_best","skill":"priorisation","difficulty":2,"language":"fr","estimatedSeconds":75,"prompt":"Quel ordre de traitement minimise le risque de dépassement de délai ?","stimulus":"À 13 h 00 : dossier urgent (durée 45 min, échéance 14 h 00), appel de cadrage (durée 15 min, avant 15 h 00), note de synthèse (durée 90 min, pour le lendemain).","options":["Note de synthèse, appel, dossier urgent","Dossier urgent, appel, note de synthèse","Appel, note de synthèse, dossier urgent","Note de synthèse, dossier urgent, appel"],"correctIndex":1,"optionRationales":["La note de 90 min repousse l'urgence à 14:30, provoquant un dépassement de délai.","Correct : dossier urgent terminé à 13:45 (avant 14:00), appel à 14:00, puis note de synthèse.","Placer la note à 13:15 repousse le dossier urgent à 14:45, après son échéance.","Prioriser la note de 90 min fait manquer l'échéance de 14:00 du dossier urgent."],"explanation":"Le dossier urgent doit se terminer à 13:45 pour respecter l'échéance de 14:00, suivi de l'appel (13:45-14:00), laissant le temps pour la note.","sourceType":"original_ai_assisted","reviewStatus":"approved","createdAt":"2026-09-30T12:00:00+02:00","reviewer":"hdjebar","reviewedAt":"2026-10-02T09:15:00+02:00"},{"id":"planning-crit-006","version":2,"category":"planning","itemFormat":"single_best","skill":"dependances","difficulty":3,"language":"fr","estimatedSeconds":120,"prompt":"Quelle est la durée minimale incompressible pour finaliser ce projet ?","stimulus":"Phase 1 (durée 3 jours). Puis en parallèle : Phase 2A (durée 4 jours) et Phase 2B (durée 6 jours). Enfin Phase 3 (durée 2 jours), démarrant dès que 2A et 2B sont terminées.","options":["11 jours","9 jours","15 jours","13 jours"],"correctIndex":0,"optionRationales":["Correct : chemin critique déterminé par 3 + max(4, 6) + 2 = 3 + 6 + 2 = 11 jours.","Calcule à tort sur la branche parallèle la plus rapide 2A (3 + 4 + 2 = 9).","Additionne toutes les phases en série sans exploiter la parallélisation (3 + 4 + 6 + 2 = 15).","Surévaluation arbitraire de deux jours par rapport au chemin critique réel."],"explanation":"Entre 2A et 2B menées en parallèle, le chemin le plus long impose 6 jours. La durée totale incompressible est donc 3 + max(4, 6) + 2 = 3 + 6 + 2 = 11 jours.","sourceType":"original_ai_assisted","reviewStatus":"approved","createdAt":"2026-09-30T12:00:00+02:00","reviewer":"hdjebar","reviewedAt":"2026-10-02T09:15:00+02:00"},{"id":"planning-capa-007","version":2,"category":"planning","itemFormat":"single_best","skill":"agenda-contraintes","difficulty":2,"language":"fr","estimatedSeconds":75,"prompt":"Combien d'agents supplémentaires faut-il mobiliser pour respecter l'échéance ?","stimulus":"Un chantier d'archivage requiert 120 heures-agent à livrer en 5 jours de 8 heures de travail. L'équipe actuelle compte 2 agents.","options":["1 agent supplémentaire","2 agents supplémentaires","3 agents supplémentaires","4 agents supplémentaires"],"correctIndex":0,"optionRationales":["Correct : besoin total de 3 agents (120 h / 40 h), 2 étant déjà affectés, 1 agent suffit en renfort.","Confond le nombre d'agents déjà en poste avec le besoin de renfort additionnel.","Indique l'effectif global nécessaire sans soustraire les 2 agents déjà en place.","Surdimensionne l'équipe à 6 agents au total, soit le double de la charge requise."],"explanation":"En 5 jours, 1 agent produit 5 × 8 = 40 heures. Pour réaliser 120 heures, il faut 120 / 40 = 3 agents au total. Deux étant déjà présents, il faut 1 agent de plus.","sourceType":"original_ai_assisted","reviewStatus":"approved","createdAt":"2026-09-30T12:00:00+02:00","reviewer":"hdjebar","reviewedAt":"2026-10-02T09:15:00+02:00"},{"id":"planning-overlap-008","version":3,"category":"planning","itemFormat":"single_best","skill":"disponibilites","difficulty":2,"language":"fr","estimatedSeconds":75,"prompt":"Quelle est l'heure d'arrivée la plus tardive possible pour l'agent C, qui reste ensuite jusqu'à 18 h ?","stimulus":"La permanence au guichet doit être assurée sans interruption de 8 h à 18 h. Agent A : 8 h à 12 h. Agent B : 11 h 30 à 15 h 30. L'agent C assure la fin de journée.","options":["15 h 30","16 h 00","12 h 00","17 h 00"],"correctIndex":0,"optionRationales":["Correct : l'agent B quittant son poste à 15 h 30, c'est l'heure limite exacte pour éviter une rupture de permanence.","Une arrivée à 16 h 00 entraînerait 30 minutes de fermeture non autorisée du guichet.","Une arrivée à 12 h 00 assure la continuité mais ne constitue pas l'horaire le plus tardif possible.","Une arrivée à 17 h 00 créerait une interruption de service prolongée de 1 h 30."],"explanation":"Le guichet est couvert par A puis B jusqu'à 15 h 30. L'agent C doit être présent au plus tard à ce moment ; 12 h fonctionne aussi, mais ce n'est pas l'heure la plus tardive possible.","sourceType":"original_ai_assisted","reviewStatus":"approved","createdAt":"2026-09-30T12:00:00+02:00","reviewer":"hdjebar","reviewedAt":"2026-10-02T09:15:00+02:00"},{"id":"planning-buffer-009","version":3,"category":"planning","itemFormat":"single_best","skill":"agenda-contraintes","difficulty":2,"language":"fr","estimatedSeconds":75,"prompt":"De combien de jours ouvrés le projet peut-il au plus être retardé sans dépasser l'échéance ?","stimulus":"L'échéance de livraison tombe dans 20 jours ouvrés. Les tâches restantes du chemin critique totalisent 16 jours ouvrés.","options":["4 jours ouvrés","2 jours ouvrés","6 jours ouvrés","8 jours ouvrés"],"correctIndex":0,"optionRationales":["Correct : la marge de battement s'élève exactement à 20 - 16 = 4 jours ouvrés.","Sous-estime de 2 jours la marge réelle disponible.","Surestime la marge de 2 jours, ce qui risquerait d'entraîner un retard effectif.","Surestimation excessive qui provoquerait un dépassement d'échéance certain de 4 jours."],"explanation":"Les deux durées sont exprimées dans la même unité (jours ouvrés). La marge totale vaut 20 − 16 = 4 jours ouvrés.","sourceType":"original_ai_assisted","reviewStatus":"approved","createdAt":"2026-09-30T12:00:00+02:00","reviewer":"hdjebar","reviewedAt":"2026-10-02T09:15:00+02:00"},{"id":"planning-dep-010","version":3,"category":"planning","itemFormat":"single_best","skill":"dependances","difficulty":2,"language":"fr","estimatedSeconds":75,"prompt":"Sur quelle action pouvez-vous avancer dès ce matin ?","stimulus":"Validation hiérarchique : en attente du rapport financier. Rapport financier : en cours de relecture finale. Envoi des convocations : après la validation. Diffusion du compte rendu : après l'envoi des convocations.","options":["Terminer la relecture du rapport","Obtenir la validation hiérarchique","Envoyer les convocations","Diffuser le compte rendu"],"correctIndex":0,"optionRationales":["Correct : c'est la seule tâche immédiatement actionnable dont toutes les dépendances sont levées.","Bloquée tant que le rapport financier n'a pas été finalisé.","Bloquée par la dépendance envers la validation hiérarchique.","Bloquée par les étapes préalables de convocation et de déroulement de la réunion."],"explanation":"Chaque étape dépend de la précédente : validation, puis convocations, puis compte rendu, et tout attend le rapport financier. Seule sa relecture finale peut avancer dès ce matin.","sourceType":"original_ai_assisted","reviewStatus":"approved","createdAt":"2026-09-30T12:00:00+02:00","reviewer":"hdjebar","reviewedAt":"2026-10-02T09:15:00+02:00"}],"situational":[{"id":"situational-serve-001","version":2,"category":"situational","itemFormat":"rating","skill":"servir-client-usager","difficulty":1,"language":"fr","estimatedSeconds":45,"prompt":"Évaluez la pertinence de chaque réaction dans ce contexte.","stimulus":"Un usager conteste vivement une décision de refus d'allocation, prise conformément au règlement. Vous pouvez en expliquer les motifs, mais vous n'avez pas le pouvoir de la modifier.","options":["Écouter la personne, expliquer les motifs et indiquer les voies de recours et leurs délais.","Expliquer brièvement que la décision est conforme et clore l'échange pour ne pas retarder la file.","Proposer de transmettre le dossier pour réexamen, en laissant entendre qu'une révision reste possible.","Remettre la notice écrite sur les recours et inviter la personne à la lire tranquillement chez elle."],"correctIndex":0,"ratings":[4,2,1,3],"optionRationales":["Écoute, explique et informe sur les recours : service complet sans fausse promesse.","Exact sur le fond, mais l'usager repart sans comprendre ni connaître ses droits.","Crée une fausse attente : vous n'avez pas le pouvoir de réviser la décision.","Informe correctement, mais sans explication ni écoute."],"explanation":"La meilleure réaction combine écoute, explication des motifs et information complète sur les recours, sans promesse. La notice seule informe, mais sans accompagnement ; clore l'échange ou suggérer un réexamen fictif dégrade le service.","sourceType":"original_ai_assisted","reviewStatus":"approved","createdAt":"2026-09-30T12:00:00+02:00","reviewer":"hdjebar","reviewedAt":"2026-10-01T21:00:00+02:00"},{"id":"situational-advise-002","version":2,"category":"situational","itemFormat":"rating","skill":"conseiller","difficulty":1,"language":"fr","estimatedSeconds":45,"prompt":"Évaluez la pertinence de chaque réaction dans ce contexte.","stimulus":"Un collègue doit répondre aujourd'hui à un usager sur le traitement fiscal d'une subvention et vous demande conseil. Ce sujet ne relève pas de votre expertise. La référente fiscale du service est joignable dans l'heure.","options":["Donner votre meilleure estimation, en précisant qu'elle reste à confirmer par la référente.","Lui dire que ce n'est pas votre domaine et le laisser trouver lui-même le bon interlocuteur.","Reconnaître vos limites et organiser avec lui un échange rapide avec la référente.","Lui transmettre le nom et les coordonnées de la référente fiscale du service."],"correctIndex":2,"ratings":[2,1,4,3],"optionRationales":["Une estimation hors de votre domaine risque d'être relayée comme une réponse fiable.","Respecte vos limites, mais n'aide pas votre collègue à tenir le délai.","Reconnaît vos limites et assure une réponse fiable dans le délai.","Oriente correctement, mais sans préparer l'échange ni vérifier le délai."],"explanation":"Conseiller, c'est aussi reconnaître ses limites et orienter efficacement : préparer les faits et organiser le contact avec la référente garantit une réponse fiable dans le délai. Transmettre ses coordonnées aide, mais moins ; une estimation hors expertise risque de circuler comme une réponse.","sourceType":"original_ai_assisted","reviewStatus":"approved","createdAt":"2026-09-30T12:00:00+02:00","reviewer":"hdjebar","reviewedAt":"2026-10-01T21:00:00+02:00"},{"id":"situational-serve-003","version":2,"category":"situational","itemFormat":"rating","skill":"servir-client-usager","difficulty":2,"language":"fr","estimatedSeconds":75,"prompt":"Évaluez la pertinence de chaque réaction dans ce contexte.","stimulus":"Un usager demande que son dossier soit traité en priorité, en invoquant une connaissance personnelle au sein de votre direction. Le règlement du service ne prévoit aucun traitement prioritaire dans son cas.","options":["Prendre ses coordonnées et lui promettre de l'appeler dès que son dossier aura été traité.","Accepter d'examiner son dossier en premier, puisque cela ne prendra que quelques minutes.","Lui suggérer de contacter directement la personne qu'il cite pour obtenir une dérogation.","Rappeler poliment que les dossiers sont traités dans l'ordre et indiquer le délai prévu."],"correctIndex":3,"ratings":[3,1,2,4],"optionRationales":["Service courtois, mais la demande de priorité n'est pas traitée clairement.","Passe-droit contraire à l'égalité de traitement.","Encourage une démarche de faveur hors procédure.","Maintient l'égalité de traitement et informe sur le délai."],"explanation":"L'égalité de traitement des usagers interdit tout passe-droit. La réponse la plus pertinente maintient l'ordre de traitement tout en donnant une information utile (le délai). Le rappel promis est acceptable mais n'aborde pas la demande.","sourceType":"original_ai_assisted","reviewStatus":"approved","createdAt":"2026-09-30T12:00:00+02:00","reviewer":"hdjebar","reviewedAt":"2026-10-01T21:00:00+02:00"},{"id":"situational-serve-004","version":2,"category":"situational","itemFormat":"rating","skill":"servir-client-usager","difficulty":2,"language":"fr","estimatedSeconds":75,"prompt":"Évaluez la pertinence de chaque réaction dans ce contexte.","stimulus":"Une personne appelle pour connaître l'état du dossier de son père, actuellement hospitalisé. Elle n'a pas de procuration. Les informations d'un dossier ne peuvent être communiquées qu'à son titulaire ou à une personne mandatée.","options":["Lui donner l'état du dossier, puisque le lien familial paraît évident et la situation urgente.","Refuser de communiquer toute information et mettre poliment fin à l'appel.","Expliquer que vous ne pouvez rien communiquer sans procuration et indiquer comment en obtenir une.","Proposer d'appeler son père à l'hôpital pour faire le point directement avec lui."],"correctIndex":2,"ratings":[1,2,4,3],"optionRationales":["Viole la confidentialité du dossier.","Respecte la règle, mais laisse la personne sans solution.","Respecte la règle et donne une solution concrète.","Respecte la confidentialité, mais l'appel à l'hôpital peut être intrusif."],"explanation":"La confidentialité s'impose, mais servir l'usager suppose d'expliquer la règle et d'indiquer une solution (la procuration). Contacter le titulaire est possible mais plus lourd ; refuser sans solution respecte la règle sans aider.","sourceType":"original_ai_assisted","reviewStatus":"approved","createdAt":"2026-10-01T21:00:00+02:00","reviewer":"hdjebar","reviewedAt":"2026-10-01T21:00:00+02:00"},{"id":"situational-serve-005","version":2,"category":"situational","itemFormat":"rating","skill":"servir-client-usager","difficulty":2,"language":"fr","estimatedSeconds":75,"prompt":"Évaluez la pertinence de chaque réaction dans ce contexte.","stimulus":"Un usager demande une dispense de pièce justificative pour un dossier urgent. Vous n'êtes pas habilité à accorder cette dispense ; votre responsable l'est.","options":["L'inviter à adresser lui-même un courrier à votre responsable, en lui donnant l'adresse.","Préciser que vous n'êtes pas habilité, puis transmettre sa demande écrite au responsable.","Accorder la dispense oralement, la situation vous paraissant de bonne foi.","Lui répondre que la règle ne prévoit aucune exception et clore la demande."],"correctIndex":1,"ratings":[3,4,1,2],"optionRationales":["Oriente vers la bonne personne, mais laisse l'usager faire seul la démarche.","Respecte votre champ de compétence et fait avancer la demande.","Décision prise sans habilitation.","Affirme une règle que vous ne pouvez pas trancher, sans transmettre."],"explanation":"Le respect de la légalité n'empêche pas d'accompagner l'usager : transmettre une demande documentée à l'autorité compétente est la meilleure réponse. Orienter vers un courrier est utile mais plus lent ; décider sans habilitation est exclu.","sourceType":"original_ai_assisted","reviewStatus":"approved","createdAt":"2026-09-30T12:00:00+02:00","reviewer":"hdjebar","reviewedAt":"2026-10-01T21:00:00+02:00"},{"id":"situational-advise-006","version":2,"category":"situational","itemFormat":"rating","skill":"conseiller","difficulty":2,"language":"fr","estimatedSeconds":75,"prompt":"Évaluez la pertinence de chaque réaction dans ce contexte.","stimulus":"En réunion de projet, deux directions partenaires défendent deux solutions techniques différentes. Votre responsable vous demande une note pour éclairer sa décision.","options":["Recommander la solution de la direction la plus influente, pour faciliter son adoption.","Comparer les options sur des critères objectifs et formuler une recommandation motivée.","Présenter les deux solutions telles que chaque direction les décrit, sans analyse propre.","Proposer d'abord un atelier commun aux deux directions, puis rédiger l'analyse comparative."],"correctIndex":1,"ratings":[1,4,2,3],"optionRationales":["Critère d'influence et non de fond : conseil partial.","Analyse objective et recommandation utile au décideur.","Neutre, mais sans valeur ajoutée pour la décision.","Démarche constructive, mais qui retarde la note demandée."],"explanation":"Le rôle de conseil consiste à fournir une analyse neutre, documentée et conclusive. L'atelier peut enrichir l'analyse mais retarde la note ; reprendre les positions sans analyse n'éclaire pas la décision.","sourceType":"original_ai_assisted","reviewStatus":"approved","createdAt":"2026-09-30T12:00:00+02:00","reviewer":"hdjebar","reviewedAt":"2026-10-01T21:00:00+02:00"},{"id":"situational-advise-007","version":2,"category":"situational","itemFormat":"rating","skill":"conseiller","difficulty":3,"language":"fr","estimatedSeconds":120,"prompt":"Évaluez la pertinence de chaque réaction dans ce contexte.","stimulus":"Votre responsable vous demande de publier dès demain un cahier des charges. Vous y repérez une clause ambiguë qui pourrait provoquer un contentieux lors de l'attribution du marché.","options":["Publier comme demandé et signaler l'ambiguïté une fois la publication effectuée.","Demander l'avis du service juridique avant toute action, quitte à décaler la publication de plusieurs semaines.","Corriger vous-même la clause et publier sans attendre de validation.","Signaler le risque par écrit à votre responsable et proposer une formulation corrigée prête à valider."],"correctIndex":3,"ratings":[2,3,1,4],"optionRationales":["Le risque est signalé trop tard pour être évité.","Prudent, mais le retard est disproportionné sans en parler au responsable.","Modification sans validation de la personne qui décide.","Alerte à temps et solution prête : le responsable peut décider vite."],"explanation":"Conseiller, c'est alerter sur le risque et proposer une solution qui permet de tenir le délai. Saisir le juridique est prudent mais disproportionné ici ; publier en l'état ou corriger seul contourne la décision du responsable.","sourceType":"original_ai_assisted","reviewStatus":"approved","createdAt":"2026-09-30T12:00:00+02:00","reviewer":"hdjebar","reviewedAt":"2026-10-01T21:00:00+02:00"},{"id":"situational-serve-008","version":2,"category":"situational","itemFormat":"rating","skill":"servir-client-usager","difficulty":1,"language":"fr","estimatedSeconds":45,"prompt":"Évaluez la pertinence de chaque réaction dans ce contexte.","stimulus":"Un usager peu à l'aise avec l'informatique n'arrive pas à faire sa démarche en ligne. Un espace d'aide numérique, avec un agent disponible, se trouve dans le bâtiment.","options":["L'accompagner vers l'espace d'aide numérique pour réaliser la démarche avec lui, étape par étape.","Faire la démarche à sa place en utilisant ses identifiants personnels, pour gagner du temps.","Lui remettre le guide pas à pas et l'inviter à revenir si un problème persiste.","Lui proposer un rendez-vous avec un conseiller numérique dans le courant de la semaine."],"correctIndex":0,"ratings":[4,1,2,3],"optionRationales":["Aide immédiate et adaptée, qui renforce l'autonomie.","Utiliser les identifiants d'autrui pose un problème de sécurité.","Aide minimale pour une personne déjà en difficulté.","Solution valable, mais elle retarde la démarche."],"explanation":"L'accompagnement immédiat sur place permet d'aboutir tout en rendant l'usager plus autonome. Un rendez-vous est utile mais diffère la démarche ; utiliser ses identifiants pose un problème de sécurité.","sourceType":"original_ai_assisted","reviewStatus":"approved","createdAt":"2026-09-30T12:00:00+02:00","reviewer":"hdjebar","reviewedAt":"2026-10-01T21:00:00+02:00"},{"id":"situational-advise-009","version":2,"category":"situational","itemFormat":"rating","skill":"conseiller","difficulty":3,"language":"fr","estimatedSeconds":120,"prompt":"Évaluez la pertinence de chaque réaction dans ce contexte.","stimulus":"Votre directrice vous demande quel indicateur retenir dans le rapport annuel pour illustrer la baisse des délais. L'indicateur A, plus favorable, exclut les dossiers incomplets. L'indicateur B couvre tous les dossiers mais montre une baisse plus modeste.","options":["Recommander l'indicateur A, plus favorable, sans détailler son périmètre exact.","Recommander l'indicateur B, sans mentionner l'existence de l'indicateur A.","Présenter les deux indicateurs et leurs limites, puis recommander B en justifiant ce choix.","Recommander l'indicateur A, en précisant son périmètre dans une note de bas de page."],"correctIndex":2,"ratings":[1,2,4,3],"optionRationales":["Le périmètre caché peut induire les lecteurs en erreur.","Choix défendable, mais la directrice n'a pas toutes les options.","Transparence complète et recommandation motivée.","Transparent, mais l'information essentielle reste peu visible."],"explanation":"Un bon conseil éclaire complètement la décision : il présente les options, leurs limites et une recommandation motivée. Mentionner le périmètre en note rend A acceptable ; masquer une option ou un périmètre prive la directrice d'informations utiles.","sourceType":"original_ai_assisted","reviewStatus":"approved","createdAt":"2026-10-01T21:00:00+02:00","reviewer":"hdjebar","reviewedAt":"2026-10-01T21:00:00+02:00"},{"id":"situational-serve-010","version":2,"category":"situational","itemFormat":"rating","skill":"servir-client-usager","difficulty":2,"language":"fr","estimatedSeconds":75,"prompt":"Évaluez la pertinence de chaque réaction dans ce contexte.","stimulus":"Un usager s'énerve car son dossier ne peut pas être enregistré : le système informatique est en panne depuis une heure, pour une durée inconnue.","options":["Lui demander de revenir plus tard, le système étant indisponible pour une durée inconnue.","Lui expliquer que la panne relève du service informatique et que vous n'y pouvez rien.","Lui proposer de faire la démarche en ligne depuis chez lui, une fois le système rétabli.","Reconnaître la gêne, expliquer la panne et proposer de le rappeler dès le rétablissement."],"correctIndex":3,"ratings":[2,1,3,4],"optionRationales":["Exact, mais l'usager repart sans solution ni suivi.","Se désolidarise de l'administration et laisse l'usager sans solution.","Solution praticable, mais sans suivi personnalisé ni prise en compte de son énervement.","Reconnaît la gêne, informe et garantit un suivi."],"explanation":"Reconnaître la gêne et garantir un suivi personnalisé apaise la situation et sécurise la démarche. Proposer la démarche en ligne est praticable mais laisse l'usager seul ; renvoyer la responsabilité au service informatique aggrave la tension.","sourceType":"original_ai_assisted","reviewStatus":"approved","createdAt":"2026-09-30T12:00:00+02:00","reviewer":"hdjebar","reviewedAt":"2026-10-01T21:00:00+02:00"}]};
const PROMPTS = {"generate":"# System instruction\n\nYou are a senior assessment-item writer and psychometrician creating ORIGINAL practice material for candidates preparing the Luxembourg State Épreuve d'Aptitude Générale (EAG - Groupe de traitement A1), reformed on 15 September 2026.\n\nYou reproduce only the publicly described test categories and skills. Never claim access to, reproduce, reconstruct, or paraphrase real or confidential EAG questions, and never claim to represent an official scoring key or exam authority.\n\n# Parameters\n\n- Category: `{{CATEGORY}}` (abstract | verbal | numeric | planning | situational)\n- Number of items: `{{COUNT}}`\n- Skills to cover (only from this list): `{{SKILLS}}`\n- Difficulty mix: `{{DIFFICULTY_MIX}}` (if empty, spread 1/2/3 as evenly as possible)\n- Language: `{{LANGUAGE}}` (fr or de)\n- IDs: `{{ID_PREFIX}}-001`, `{{ID_PREFIX}}-002`, … (the id must match `^(abstract|verbal|numeric|planning|situational)-[a-z0-9-]+-[0-9]{3,}$`)\n- Timestamp for createdAt: `{{NOW_ISO}}`\n- Additional instructions from the editor (follow them unless they conflict with the rules below): {{EXTRA_INSTRUCTIONS}}\n- Prompts already in the bank (do not write duplicates or near-duplicates):\n{{EXISTING_TOPICS}}\n\n# Output contract\n\n- **Format:** Return ONLY a valid JSON array containing the item objects. No Markdown fences, no commentary, no prelude.\n- **Strict Plain Text:** All strings must be pure plain text. Never include HTML tags (`<p>`, `<b>`, `<br>`), script injections, or HTML entities (`&nbsp;`, `&euro;`, `&#...;`). Renderings are handled client-side.\n- **Fixed System Metadata:**\n  - `version`: `1`\n  - `sourceType`: `\"original_ai_assisted\"`\n  - `reviewStatus`: `\"candidate\"`\n  - `createdAt`: `\"{{NOW_ISO}}\"`\n  - Do NOT include `reviewer`, `reviewedAt`, `reviewNotes`, or `rejectionReason`.\n- **Mandatory Rationales (`optionRationales`):**\n  - Must be provided for **every single item without exception**.\n  - Must be an array of strings having the **exact same length as `options`** (3 for `tfcs`, 4 for `single_best` and `rating`).\n  - Minimum length: 8 characters per entry.\n  - Pedagogical content: For the correct option, explain precisely why it is optimal; for distractors, state the specific misconception, calculation error, or constraint violation.\n- **Language & Locale:** Write every learner-facing field in the requested language (`fr` or `de`).\n\nSchema reference:\n```\n{{SCHEMA_JSON}}\n```\n\n# Stimulus Formats\n\nThe `stimulus` field must follow one of these structural formats:\n1. **Plain text:** String with standard line breaks (`\\n`). Used for verbal texts, scheduling contexts, and situational scenarios.\n2. **Figural matrix / shapes:** Object `{\"type\": \"shapes\", \"text\": \"▲  ■  ●\\n■  ●  ▲\\n●  ▲  ?\"}`. Used exclusively for `abstract` reasoning. Use standard unicode geometric symbols with rows separated by `\\n`.\n3. **Structured table:** Object `{\"type\": \"table\", \"caption\": \"...\", \"headers\": [\"...\", \"...\"], \"rows\": [[\"...\", 120]], \"note\": \"...\"}`. Used for `numeric` and structured `planning` items. Never embed tables as markdown or HTML.\n\n# Difficulty & Timing\n\n- **Level 1 (Difficulty 1):** Single reasoning step; all required data directly visible in the prompt/stimulus. `estimatedSeconds`: 30–60.\n- **Level 2 (Difficulty 2):** Two distinct reasoning steps, or one step requiring discrimination against a tempting distractor (reversed ratio, trap constraint, implicit premise). `estimatedSeconds`: 60–120.\n- **Level 3 (Difficulty 3):** Three or more sequential calculation steps, complex logical deductions, or multiple interacting constraints. `estimatedSeconds`: 90–180.\n\n# Global Psychometric Quality Rules\n\n1. **Self-Contained Validity:** The item must be 100% solvable from the provided `prompt` and `stimulus` alone. Outside specialized knowledge, domain jargon, or external real-world knowledge must not be required.\n2. **Unambiguous Correct Answer:** There must be exactly one objectively defensible answer. If reasonable arguments can be made for more than one option, the item must be redesigned.\n3. **No Catch-All or Lazy Distractors:**\n   - STRICTLY FORBIDDEN options: *« Aucune de ces réponses »*, *« Toutes les réponses »*, *« Aucun de ces choix »*, *« Aucune des options »*, *« None of the above »*, *« All of the above »*.\n   - Specifically for `planning`: NEVER use *« Aucun de ces créneaux »*, *« Aucun créneau possible »*, or *« Aucune de ces dates »*. Every option must be a concrete, realistic schedule slot or sequence.\n4. **Homogeneity and Length Balance:**\n   - All options must be grammatically parallel (e.g., all starting with an infinitive verb, or all full sentences).\n   - The correct answer must NOT be noticeably longer or more detailed than distractors (maximum length ratio $\\le 1.4\\times$ the distractors).\n5. **Plausible Diagnostic Distractors:**\n   - Every wrong answer must correspond to a common cognitive slip: misread quantifier, calculation error, reversed direction, wrong time base, or breach of deontological neutrality.\n6. **Detailed Explanation:**\n   - `explanation` must provide the complete deductive proof (arithmetic breakdown, cited sentence from stimulus, or sequential constraint elimination). It must never simply restate the correct option.\n7. **Randomized Key Balance:** Vary `correctIndex` evenly across generated items (do not cluster answers on index 0 or 2).\n8. **Neutral Public Administration Setting:**\n   - Fictional public bodies, ministries, services, and citizens only. No real politicians, real people, political debates, or cultural stereotypes.\n9. **Typography & Formatting Rules:**\n   - **French (`fr`):**\n     - Decimals with comma: `1 234,50` (not `1234.50`).\n     - Percentage with space: `12,5 %` (not `12.5%`).\n     - Currency: `150,00 €`.\n     - Hours: `14 h 30` or `9 h 00`.\n     - Tone: Formal administrative *vouvoiement*.\n   - **German (`de`):**\n     - Numbers: `1.234,50 €`, `12,5 %`.\n     - Hours: `14:30 Uhr`.\n     - Tone: Formal *Sie-Form*.\n\n# Category Specifications (Groupe A1)\n\n*(Quoted descriptions derive from the official GovJobs Luxembourg regulations of 15 September 2026. Note: Control and precision is excluded for Group A1).*\n\n---\n\n### 1. `abstract` — Format: `single_best`, Stimulus: `shapes`\n*Official: « séries de formes ou de matrices géométriques... repérer la logique qui l'unifie et sélectionner l'élément qui la complète ».*\n- **Task:** Geometric matrix completion (2×2 or 3×3) or figural sequence ending in `?`.\n- **Allowed symbols:** Geometric unicode symbols only: `▲ △ ▼ ▽ ◀ ◁ ▶ ▷ ● ○ ■ □ ◆ ◇ ◰ ◱ ◲ ◳ ⬡ ⬢ ⬟ ⬠` and directional arrows (`→ ← ↑ ↓ ↗ ↘ ↙ ↖`).\n- **Forbidden:** No letters, no digits, no words, no odd-one-out items.\n- **Allowed Transformation Rules:**\n  - Spatial rotation (90°, 45° clockwise/counter-clockwise).\n  - Shape shading/fill alternation (empty, filled, patterned).\n  - Progressive count change (addition/subtraction of elements).\n  - Positional shift across rows/columns.\n  - Logical XOR/superposition across matrix rows.\n- **Skills:** `suite-logique` | `matrice` | `rotation` | `transformation`\n- **Rationales:** Detail the specific rule broken by each distractor (e.g., incorrect rotation, wrong number of items, incorrect shading).\n\n---\n\n### 2. `verbal` — Format: `single_best` or `tfcs`, Stimulus: `string` (40–200 words)\n*Official: « textes, d'informations ou de consignes écrites... répondre à des questions ou appliquer les consignes fournies en se basant uniquement sur les éléments présentés ».*\n- **Contexts:** Fictional administrative circulars, municipal directives, public service procedures, or internal memos.\n- **Formats:**\n  - `single_best`: 4 distinct comprehension or deductive options.\n  - `tfcs`: Options MUST be exactly `[\"Vrai\", \"Faux\", \"On ne peut pas savoir\"]` (fr) or `[\"Richtig\", \"Falsch\", \"Nicht zu entscheiden\"]` (de).\n    - *Vrai:* Deductively guaranteed by the text.\n    - *Faux:* Directly contradicted by the text.\n    - *On ne peut pas savoir:* The text does not provide sufficient information to confirm or deny the statement.\n- **Diagnostic Pitfalls:** Confusion between possibility (*« peut »*) and obligation (*« doit »*), universal vs partial quantifiers (*« tous »* vs *« certains »*), inverted conditional statements.\n- **Skills:** `comprehension` | `inference` | `application-consigne` | `vrai-faux-indetermine` | `synthese`\n\n---\n\n### 3. `numeric` — Format: `single_best`, Stimulus: `table` (preferred) or `string`\n*Official: « tableaux, graphiques, données chiffrées ou opérations simples... Vous pouvez utiliser la calculatrice de l'ordinateur ».*\n- **Contexts:** Public expenditure budgets, municipal demographic data, civil service human resources, subsidy calculations, infrastructure costs.\n- **Core Operations:** Simple and compound percentages, percentage point differences, ratios, weighted averages, indexations.\n- **Mathematical Accuracy:** Double-check all figures. State explicit rounding rules in the prompt whenever an answer is rounded (e.g., *« Arrondir au dixième le plus proche »*).\n- **Options:** Exactly 4 plausible numerical values.\n- **Diagnostic Distractors:** Wrong denominator/base, mixing percentage points with relative change, unweighted mean, calculation order error.\n- **Skills:** `pourcentage` | `variation` | `ratio-proportion` | `moyenne` | `lecture-tableau` | `lecture-graphique` | `operations-simples`\n\n---\n\n### 4. `planning` — Format: `single_best`, Stimulus: `string` or `table`\n*Official: « planifier et organiser son travail de manière logique... gérer un agenda, en tenant compte des délais, des disponibilités et des priorités ».*\n- **Contexts:** Half-day, single-day, or weekly calendar planning for an administrative unit or project team.\n- **Constraints to Combine:** Fixed immutable appointments, availability windows, minimum task durations, sequential dependencies (*« la tâche B doit débuter immédiatement après la tâche A »*), buffer times, strict deadlines (*« avant 12 h 00 »*).\n- **Options:** Exactly 4 concrete, valid time windows or slot assignments.\n- **Hard Rule:** Never use *« Aucun créneau »*. A valid, unique scheduling solution must exist among the options.\n- **Skills:** `agenda-contraintes` | `priorisation` | `dependances` | `disponibilites` | `conflits`\n\n---\n\n### 5. `situational` — Format: `rating`, Stimulus: `string` (40–120 words)\n*Official: « évaluer leur pertinence au regard du contexte présenté... compétences \"servir le client-usager\" et \"conseiller\" ».*\n- **Candidate Persona:** State civil servant, category A1 (e.g., chargé d'études, conseiller, chef de projet).\n- **Competencies:**\n  - `servir-client-usager`: Reception of citizens, handling dissatisfied or vulnerable users, managing administrative appeals, balancing empathy with legal compliance.\n  - `conseiller`: Providing legal and procedural counsel to departmental directors, colleagues, or inter-ministerial committees; formulating neutral recommendations.\n  - *(Note: `coopérer` belongs to groups B1/C1 and must NOT be used for A1).*\n- **Format Requirements:**\n  - `options`: Exactly 4 realistic, professionally plausible behavioral actions.\n  - `ratings`: Array of 4 integers representing the appropriateness rating of each option:\n    - `1`: **Très inapproprié** (violates ethics/regulations, escalates conflict, promises illegal outcomes).\n    - `2`: **Inapproprié** (passive, unhelpful, unnecessary delay, redirects without checking).\n    - `3`: **Approprié** (constructive and compliant, but incomplete or sub-optimal compared to 4).\n    - `4`: **Très approprié** (optimal active listening, de-escalation, adherence to legal framework, actionable solution).\n  - **Invariants:**\n    - Exactly ONE `4` in the `ratings` array.\n    - `correctIndex` must point to the index containing the `4` (`ratings[correctIndex] === 4`).\n    - The `ratings` array must contain at least 3 distinct values (e.g., `[4, 2, 1, 3]` or `[3, 1, 4, 2]`).\n- **Explanation:** Provide the deontological and psychometric rationale explaining why the optimal option respects civil service values (neutrality, legality, user service).\n\n---\n\n# Canonical JSON Item Examples\n\n### Example 1: `abstract`\n```json\n{\n  \"id\": \"abstract-matrice-001\",\n  \"version\": 1,\n  \"category\": \"abstract\",\n  \"itemFormat\": \"single_best\",\n  \"skill\": \"matrice\",\n  \"difficulty\": 2,\n  \"language\": \"fr\",\n  \"estimatedSeconds\": 90,\n  \"prompt\": \"Identifiez la figure qui complète logiquement la matrice 3×3 ci-dessous.\",\n  \"stimulus\": {\n    \"type\": \"shapes\",\n    \"text\": \"●  ▲  ■\\n▲  ■  ●\\n■  ●  ?\"\n  },\n  \"options\": [\n    \"▲\",\n    \"■\",\n    \"●\",\n    \"◆\"\n  ],\n  \"correctIndex\": 0,\n  \"optionRationales\": [\n    \"Correct : chaque ligne et colonne contient exactement un rond, un triangle et un carré. La troisième ligne nécessite un triangle.\",\n    \"Incorrect : le carré est déjà présent en première position de la troisième ligne.\",\n    \"Incorrect : le cercle est déjà présent en deuxième position de la troisième ligne.\",\n    \"Incorrect : le losange est une forme extérieure au groupe de symboles de la matrice.\"\n  ],\n  \"explanation\": \"Chaque ligne et chaque colonne constitue une permutation des trois formes de base (cercle, triangle, carré). La troisième ligne contenant déjà un carré et un cercle, l'élément manquant pour compléter la matrice est le triangle (▲).\",\n  \"sourceType\": \"original_ai_assisted\",\n  \"reviewStatus\": \"candidate\",\n  \"createdAt\": \"2026-10-02T12:00:00.000Z\"\n}\n```\n\n### Example 2: `numeric`\n```json\n{\n  \"id\": \"numeric-budget-001\",\n  \"version\": 1,\n  \"category\": \"numeric\",\n  \"itemFormat\": \"single_best\",\n  \"skill\": \"pourcentage\",\n  \"difficulty\": 2,\n  \"language\": \"fr\",\n  \"estimatedSeconds\": 90,\n  \"prompt\": \"Quel est le pourcentage d'augmentation du budget alloué à la Transition numérique entre 2024 et 2025 ?\",\n  \"stimulus\": {\n    \"type\": \"table\",\n    \"caption\": \"Crédits alloués par programme ministériel (en millions d'euros)\",\n    \"headers\": [\"Programme\", \"Budget 2024\", \"Budget 2025\"],\n    \"rows\": [\n      [\"Formation continue\", 12,0, 13,2],\n      [\"Transition numérique\", 25,0, 30,0],\n      [\"Infrastructures durables\", 40,0, 42,0]\n    ],\n    \"note\": \"Crédits de paiement votés.\"\n  },\n  \"options\": [\n    \"15,0 %\",\n    \"20,0 %\",\n    \"25,0 %\",\n    \"5,0 %\"\n  ],\n  \"correctIndex\": 1,\n  \"optionRationales\": [\n    \"Incorrect : calcul erroné résultant d'une mauvaise base de comparaison.\",\n    \"Correct : la hausse est de (30,0 - 25,0) / 25,0 = 5,0 / 25,0 = 0,20, soit exactement 20,0 %.\",\n    \"Incorrect : division de l'augmentation par la valeur finale de 2025 au lieu de 2024.\",\n    \"Incorrect : correspond à la différence brute en millions d'euros (5,0 M€) et non au taux d'évolution relatif.\"\n  ],\n  \"explanation\": \"Pour obtenir le taux d'évolution relatif, on calcule la variation absolue divisée par la valeur de référence : (30,0 - 25,0) / 25,0 = 5,0 / 25,0 = 0,20, soit une hausse de 20,0 %.\",\n  \"sourceType\": \"original_ai_assisted\",\n  \"reviewStatus\": \"candidate\",\n  \"createdAt\": \"2026-10-02T12:00:00.000Z\"\n}\n```\n\n### Example 3: `situational`\n```json\n{\n  \"id\": \"situational-service-001\",\n  \"version\": 1,\n  \"category\": \"situational\",\n  \"itemFormat\": \"rating\",\n  \"skill\": \"servir-client-usager\",\n  \"difficulty\": 2,\n  \"language\": \"fr\",\n  \"estimatedSeconds\": 100,\n  \"prompt\": \"Évaluez la pertinence de chacune des réactions suivantes face à cette situation.\",\n  \"stimulus\": \"Un usager se présente au guichet très agacé car sa demande d'autorisation est en attente depuis plusieurs semaines. Il affirme qu'un de vos collègues lui avait promis un traitement en 48 heures et exige une validation immédiate sous peine de déposer une plainte.\",\n  \"options\": [\n    \"Lui expliquer calmement les étapes légales d'instruction, vérifier l'état exact du dossier dans le système et lui fixer une échéance réaliste de finalisation.\",\n    \"Lui accorder immédiatement l'autorisation demandée afin de désamorcer la tension et d'éviter un litige administratif formel.\",\n    \"Lui rétorquer fermement que votre collègue n'a jamais pu faire une telle promesse et l'inviter à patienter jusqu'à la notification par courrier.\",\n    \"Lui suggérer de déposer sa plainte auprès de la direction sans consulter son dossier, le guichet n'étant pas compétent pour les réclamations.\"\n  ],\n  \"correctIndex\": 0,\n  \"ratings\": [4, 1, 2, 1],\n  \"optionRationales\": [\n    \"Très approprié (4) : concilie écoute active, vérification factuelle de la situation et respect strict des procédures légales sans surenchère émotionnelle.\",\n    \"Très inapproprié (1) : validation illégale d'un dossier sans instruction préalable sous la contrainte, enfreignant gravement la déontologie.\",\n    \"Inapproprié (2) : attitude défensive et disqualification d'un collègue qui risque d'envenimer le mécontentement de l'usager.\",\n    \"Très inapproprié (1) : refus d'assistance et rupture du devoir d'information de l'usager face à un dossier en cours.\"\n  ],\n  \"explanation\": \"L'action la plus appropriée (note 4) consiste à garder une posture professionnelle et bienveillante, à vérifier concrètement l'avancement du dossier sans porter de jugement sur les propos tenus, et à expliciter de manière transparente le calendrier légal d'instruction.\",\n  \"sourceType\": \"original_ai_assisted\",\n  \"reviewStatus\": \"candidate\",\n  \"createdAt\": \"2026-10-02T12:00:00.000Z\"\n}\n```\n","revise":"# System instruction\n\nYou are an assessment-item editor improving ORIGINAL practice items for candidates preparing the Luxembourg State EAG (groupe A1). You never reproduce, reconstruct or paraphrase real or confidential EAG questions, and never claim to know official scoring.\n\n# Task\n\nRevise each item below. For every item you receive its current JSON and the issues found (validator findings, reviewer notes, blind AI review). Return one revised item per input item.\n\nInstruction from the editor (applies to every item; follow it unless it conflicts with the rules): {{INSTRUCTION}}\n\n# Output contract\n\n- Return ONLY a JSON array with exactly one object per input item, in the same order. No Markdown fences, no commentary.\n- **Keep `id` and `category` unchanged.** Keep `itemFormat` unless the instruction asks otherwise and the category allows it.\n- Fix every listed issue. Keep what already works; do not rewrite for the sake of it.\n- The revised item must still have exactly one defensible answer, options of similar length, an explanation that proves the answer, and one `optionRationales` entry per option.\n- Plain text only: no HTML, tags, entities or Markdown. Tables and figures use the structured `stimulus` objects (`{\"type\":\"table\",…}`, `{\"type\":\"shapes\",…}`).\n- Do not include `reviewer`, `reviewedAt`, `reviewNotes`, `rejectionReason` or `revisionOf`; the pipeline sets them.\n- Language of each item: keep its `language`.\n\nCategory rules are the same as for generation:\n- abstract: completion of a figure series or matrix with geometric symbols only (no letters, digits or words); `single_best`.\n- verbal: answer from the text only; `single_best` or `tfcs` (`[\"Vrai\",\"Faux\",\"On ne peut pas savoir\"]`).\n- numeric: tables or figures and simple operations; one unit system; verified arithmetic.\n- planning: every constraint stated, one time unit per item.\n- situational: `rating` format, each response rated 1–4, exactly one 4 at `correctIndex`, at least three distinct values; competencies « servir-client-usager » or « conseiller » only; realistic responses of similar length.\n\nSchema:\n```\n{{SCHEMA_JSON}}\n```\n\n# Items to revise\n\n{{ITEMS_JSON}}\n","review":"You are an independent reviewer of original practice items for the Luxembourg State EAG (groupe A1). You did not write them. Each item gives `id`, `category`, `itemFormat`, `language`, `prompt`, `stimulus` and `options` only. You do NOT see the intended answer.\n\nFor each item:\n\n1. Solve it yourself using only `prompt` and `stimulus`.\n   - `single_best` and `tfcs`: give `chosenIndex` (0-based) and `ratings: null`.\n   - `rating`: rate each option for appropriateness (1 = très inapproprié … 4 = très approprié) in `ratings`, and set `chosenIndex` to the best one.\n2. Give your `confidence`: `high`, `medium` or `low`.\n3. Add any applicable flags:\n   - `NO_CORRECT_OPTION` — your answer is not among the options\n   - `MULTIPLE_DEFENSIBLE` — two or more options can be justified\n   - `NEEDS_OUTSIDE_KNOWLEDGE` — the answer depends on facts not in the item\n   - `MISSING_CONSTRAINT` — data needed to decide is absent or only implied\n   - `AMBIGUOUS_WORDING` — the question can reasonably be read two ways\n   - `ANSWER_GIVEN_AWAY` — the correct option stands out by length, wording or grammar\n   - `ARITHMETIC_OR_UNIT` — inconsistent data, totals, units or rounding\n   - `LANGUAGE_ERROR` — spelling, grammar or number-format errors\n   - `SENSITIVE_CONTENT` — real persons, personal data, stereotypes, political content\n   - `CLAIMS_OFFICIAL` — the item claims to be, or to be scored like, a real EAG question\n   - `WRONG_FORMAT` — does not fit its category (e.g. an abstract item using words or digits, a situational item outside « servir le client-usager » / « conseiller »)\n\nReturn ONLY a JSON array, one object per item, no commentary:\n\n[{\"id\": \"…\", \"chosenIndex\": 0, \"ratings\": null, \"confidence\": \"high\", \"flags\": [], \"note\": \"one short sentence, only when flags is not empty\"}]\n\nYour answers are compared with the author's key by a script. Passing this review never counts as human approval.\n"};
/* ADMIN_DATA_END */

const R = globalThis.EagRules;
const CATS = ["abstract", "verbal", "numeric", "planning", "situational"];
const CAT_LABEL = { abstract: "Raisonnement abstrait", verbal: "Raisonnement verbal", numeric: "Raisonnement numérique", planning: "Planification", situational: "Jugement situationnel" };
const SKILL_LABEL = { "suite-logique": "suite logique", matrice: "matrice", rotation: "rotation", transformation: "transformation", comprehension: "compréhension", inference: "inférence", "application-consigne": "application de consigne", "vrai-faux-indetermine": "vrai / faux / indéterminé", synthese: "synthèse", pourcentage: "pourcentage", variation: "variation", "ratio-proportion": "ratio et proportion", moyenne: "moyenne", "lecture-tableau": "lecture de tableau", "lecture-graphique": "lecture de graphique", "operations-simples": "opérations simples", "agenda-contraintes": "agenda et contraintes", priorisation: "priorisation", dependances: "dépendances", disponibilites: "disponibilités", conflits: "conflits d'agenda", "servir-client-usager": "servir le client-usager", conseiller: "conseiller" };
const RATING_LABEL = ["Très inapproprié", "Plutôt inapproprié", "Plutôt approprié", "Très approprié"];
const TFCS = { fr: ["Vrai", "Faux", "On ne peut pas savoir"], de: ["Richtig", "Falsch", "Nicht zu entscheiden"] };
const STORE_KEY = "eag-admin-session-v1";

const S = {
  mode: "offline", token: null, aiConfigured: false,
  approved: {}, approvedOrig: {}, removed: new Set(),
  cands: [], files: {}, log: [],
  sel: { queue: null, bank: null }, bankDraft: null, bankSel: new Set(), tab: "queue", busy: false,
};

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const clone = (x) => JSON.parse(JSON.stringify(x));
const nowIso = () => new Date().toISOString();
const reviewer = () => $("#reviewer").value.trim();
function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("show"), 2600); }
function store(key, val) { try { if (val === undefined) localStorage.removeItem(key); else localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* storage unavailable */ } }
function load(key) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch (e) { return null; } }

/* ---------- Schema-derived rules per category ---------- */
function catRules(cat) {
  const branch = (SCHEMA.allOf || []).find((b) => b.if?.properties?.category?.const === cat);
  const p = branch?.then?.properties || {};
  const fmt = p.itemFormat?.const ? [p.itemFormat.const] : p.itemFormat?.enum || ["single_best"];
  return { skills: p.skill?.enum || [], formats: fmt };
}
function checks(item) { return R.checkItem(SCHEMA, item); }
function allApproved() { return CATS.flatMap((c) => S.approved[c] || []); }

/* ---------- Rendering helpers ---------- */
function stimulusHtml(s) {
  if (s == null) return "";
  if (typeof s === "string") return `<div class="stimulus text">${esc(s)}</div>`;
  if (s.type === "shapes") return `<div class="stimulus"><div class="shapes">${esc(s.text)}</div></div>`;
  if (s.type === "table") {
    const head = `<tr>${(s.headers || []).map((h) => `<th scope="col">${esc(h)}</th>`).join("")}</tr>`;
    const body = (s.rows || []).map((r) => `<tr>${(r || []).map((c, i) => (i === 0 ? `<th scope="row">${esc(c)}</th>` : `<td>${esc(typeof c === "number" ? c.toLocaleString("fr-FR") : c)}</td>`)).join("")}</tr>`).join("");
    return `<div class="stimulus"><table class="data">${s.caption ? `<caption>${esc(s.caption)}</caption>` : ""}<thead>${head}</thead><tbody>${body}</tbody></table>${s.note ? `<p><small>${esc(s.note)}</small></p>` : ""}</div>`;
  }
  return `<div class="msg error">Stimulus de type inconnu</div>`;
}
function aiChip(c) {
  if (!c.ai) return `<span class="chip">IA : absente</span>`;
  if (c.aiStale) return `<span class="chip warn">IA : obsolète</span>`;
  const cls = c.ai.decision === "pass" ? "ok" : c.ai.decision === "reject" ? "ko" : "warn";
  return `<span class="chip ${cls}">IA : ${esc(c.ai.decision)}</span>`;
}
function decisionChip(c) {
  if (c.decision === "approved") return `<span class="chip ok">Approuvé</span>`;
  if (c.decision === "rejected") return `<span class="chip ko">Rejeté</span>`;
  return `<span class="chip info">À traiter</span>`;
}
function checkChip(item) {
  const r = checks(item);
  if (r.errors.length) return `<span class="chip ko">${r.errors.length} erreur(s)</span>`;
  if (r.warnings.length) return `<span class="chip warn">${r.warnings.length} alerte(s)</span>`;
  return `<span class="chip ok">Valide</span>`;
}
function msgList(r, extra = []) {
  const rows = [...r.errors.map((m) => `<div class="msg error">${esc(m)}</div>`), ...r.warnings.map((m) => `<div class="msg warning">${esc(m)}</div>`), ...extra];
  return rows.length ? rows.join("") : `<div class="msg good">Aucune erreur : conforme au schéma et aux règles du projet.</div>`;
}
function duplicates(item, exceptId) {
  const text = R.itemText(item);
  const pool = [...allApproved().map((x) => ["banque", x]), ...S.cands.filter((c) => c.decision !== "approved").map((c) => ["candidat", c.item])];
  return pool.filter(([, x]) => x.id !== exceptId && x !== item).map(([where, x]) => ({ where, id: x.id, sim: R.similarity(text, R.itemText(x)) })).filter((d) => d.sim >= 0.55).sort((a, b) => b.sim - a.sim).slice(0, 5);
}
function dupMsgs(item, exceptId) {
  return duplicates(item, exceptId).map((d) => `<div class="msg warning">Proche de ${esc(d.id)} (${d.where}, similarité ${Math.round(d.sim * 100)} %)</div>`);
}

/* ---------- Loading ---------- */
function setApproved(bank) {
  S.approved = {}; S.approvedOrig = {}; S.removed = new Set();
  for (const c of CATS) { S.approved[c] = clone(bank[c] || []); S.approvedOrig[c] = JSON.stringify(bank[c] || []); }
}
function addCandidates(fileName, items, review, isNew = false) {
  if (!Array.isArray(items)) throw new Error("tableau JSON attendu");
  const reviews = new Map((review?.reviews || []).map((r) => [r.id, r]));
  S.files[fileName] = S.files[fileName] || { ids: [], hasReview: false, isNew };
  if (review) S.files[fileName].hasReview = true;
  let added = 0;
  for (const raw of items) {
    if (!raw || typeof raw !== "object") continue;
    const key = `${fileName}::${raw.id}`;
    if (S.cands.some((c) => c.key === key)) continue;
    S.cands.push({ key, file: fileName, item: raw, orig: JSON.stringify(raw), ai: reviews.get(raw.id) || null, aiStale: false, decision: null, reason: "", blind: null });
    S.files[fileName].ids.push(raw.id);
    added++;
  }
  return added;
}
function attachReview(review) {
  let n = 0;
  for (const r of review.reviews || []) {
    for (const c of S.cands.filter((c) => c.item.id === r.id)) { c.ai = r; c.aiStale = false; S.files[c.file].hasReview = true; n++; }
  }
  return n;
}
async function readFiles(fileList) {
  const msgs = [];
  const parsed = [];
  for (const f of fileList) {
    try { parsed.push({ name: f.name, data: JSON.parse(await f.text()) }); }
    catch (e) { msgs.push(`<div class="msg error">${esc(f.name)} : JSON illisible (${esc(e.message)})</div>`); }
  }
  // Candidate arrays first, then reviews so they can attach to items.
  for (const p of parsed.filter((p) => Array.isArray(p.data))) {
    const clash = p.data.filter((x) => allApproved().some((a) => a.id === x?.id)).map((x) => x.id);
    try {
      const n = addCandidates(p.name, p.data, null);
      msgs.push(`<div class="msg good">${esc(p.name)} : ${n} item(s) chargé(s)</div>`);
      if (clash.length) msgs.push(`<div class="msg warning">${esc(p.name)} : identifiant(s) déjà dans la banque : ${esc(clash.join(", "))}</div>`);
    } catch (e) { msgs.push(`<div class="msg error">${esc(p.name)} : ${esc(e.message)}</div>`); }
  }
  for (const p of parsed.filter((p) => !Array.isArray(p.data))) {
    if (Array.isArray(p.data?.reviews)) msgs.push(`<div class="msg good">${esc(p.name)} : revue IA rattachée à ${attachReview(p.data)} item(s)</div>`);
    else msgs.push(`<div class="msg error">${esc(p.name)} : ni tableau de candidats, ni fichier de revue</div>`);
  }
  $("#loadmsgs").innerHTML = msgs.join("");
  if (!S.sel.queue && S.cands.length) S.sel.queue = S.cands[0].key;
  persist(); renderAll();
}

/* ---------- Server mode ---------- */
async function api(path, body) {
  const res = await fetch(path, { method: body ? "POST" : "GET", headers: { "x-admin-token": S.token, ...(body ? { "content-type": "application/json" } : {}) }, body: body ? JSON.stringify(body) : undefined });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}
async function detectServer() {
  if (!location.protocol.startsWith("http")) return false;
  const m = location.hash.match(/token=([\w-]+)/);
  let token = m ? m[1] : null;
  try { if (token) sessionStorage.setItem("eag-admin-token", token); else token = sessionStorage.getItem("eag-admin-token"); } catch (e) { /* ignore */ }
  if (m) history.replaceState(null, "", location.pathname);
  if (!token) return false;
  S.token = token;
  try { await reloadFromServer(); return true; } catch (e) { $("#loadmsgs").innerHTML = `<div class="msg error">Serveur d'administration injoignable : ${esc(e.message)}</div>`; return false; }
}
async function reloadFromServer() {
  const st = await api("/api/state");
  S.mode = "server"; S.aiConfigured = st.aiConfigured;
  setApproved(st.approved);
  S.cands = []; S.files = {};
  for (const f of st.candidates) addCandidates(f.file, f.items, f.review);
  if (S.sel.queue && !S.cands.some((c) => c.key === S.sel.queue)) S.sel.queue = null;
  if (!S.sel.queue && S.cands.length) S.sel.queue = S.cands[0].key;
}

/** After a task: add new candidate files and fresh reviews without touching unsaved work. */
async function mergeFromServer() {
  const st = await api("/api/state");
  S.aiConfigured = st.aiConfigured;
  const added = [];
  for (const f of st.candidates) {
    if (!S.files[f.file]) { addCandidates(f.file, f.items, f.review); added.push(f.file); }
    else if (f.review) attachReview(f.review);
  }
  return added;
}

/* ---------- Offline session persistence ---------- */
function persist() {
  if (S.mode !== "offline") return;
  store(STORE_KEY, { savedAt: nowIso(), cands: S.cands, files: S.files, approved: S.approved, removed: [...S.removed], log: S.log });
}
function restore(saved) {
  S.cands = saved.cands || []; S.files = saved.files || {}; S.log = saved.log || [];
  for (const c of CATS) S.approved[c] = saved.approved?.[c] || S.approved[c];
  S.removed = new Set(saved.removed || []);
  S.sel.queue = S.cands[0]?.key || null;
  renderAll();
}

/* ---------- Queue ---------- */
function filteredCands() {
  const cat = $("#qcat").value, st = $("#qstate").value, ai = $("#qai").value;
  return S.cands.filter((c) => {
    if (cat && c.item.category !== cat) return false;
    if (st === "todo" && c.decision) return false;
    if (st && st !== "todo" && st !== "errors" && c.decision !== st) return false;
    if (st === "errors" && !checks(c.item).errors.length) return false;
    if (ai === "none" && c.ai && !c.aiStale) return false;
    if (ai && ai !== "none" && (!c.ai || c.aiStale || c.ai.decision !== ai)) return false;
    return true;
  });
}
function renderQueue() {
  const list = filteredCands();
  $("#queuecount").textContent = S.cands.filter((c) => !c.decision).length;
  $("#queue").innerHTML = list.length ? list.map((c) => `<button class="row" data-key="${esc(c.key)}" aria-current="${c.key === S.sel.queue}">
    <span class="id">${esc(c.item.id || "(sans id)")}</span><span class="p">${esc(c.item.prompt || "")}</span>
    <span class="chips"><span class="chip">${esc(CAT_LABEL[c.item.category] || c.item.category)}</span>${c.item.revisionOf ? `<span class="chip warn">Révision</span>` : ""}${decisionChip(c)}${aiChip(c)}${checkChip(c.item)}</span></button>`).join("")
    : `<p class="empty">${S.cands.length ? "Aucun item pour ces filtres." : "Aucun candidat chargé."}</p>`;
}
function currentCand() { return S.cands.find((c) => c.key === S.sel.queue) || null; }

function previewHtml(item, { blind, mine, showKey }) {
  const figs = item.category === "abstract" ? " figs" : "";
  const opts = (item.options || []).map((o, i) => {
    const isKey = showKey && i === item.correctIndex;
    let meta = "";
    if (showKey && item.itemFormat === "rating" && item.ratings) meta += `<span class="chip ${item.ratings[i] === 4 ? "ok" : ""}">réf. ${item.ratings[i]}</span>`;
    if (mine != null) {
      if (item.itemFormat === "rating" && Array.isArray(mine)) meta += `<span class="chip info">vous : ${mine[i] ?? "—"}</span>`;
      else if (mine === i) meta += `<span class="chip info">votre choix</span>`;
    }
    if (showKey && isKey) meta += `<span class="chip ok">clé</span>`;
    const why = showKey && item.optionRationales?.[i] ? `<small>${esc(item.optionRationales[i])}</small>` : "";
    let control = "";
    if (blind) {
      control = item.itemFormat === "rating"
        ? `<span class="scale" role="radiogroup" aria-label="Note de l'option ${i + 1}">${[1, 2, 3, 4].map((v) => `<label title="${RATING_LABEL[v - 1]}"><input type="radio" name="b${i}" value="${v}">${v}</label>`).join("")}</span>`
        : `<input type="radio" name="bchoice" value="${i}" aria-label="Option ${i + 1}">`;
    }
    return `<div class="opt${figs}${isKey ? " key" : ""}${mine === i ? " mine" : ""}">${control}<div><span class="t">${esc(o)}</span>${why}</div><span class="meta">${meta}</span></div>`;
  }).join("");
  return `<p class="section-title">${esc(CAT_LABEL[item.category] || "")}${item.skill ? ` · ${esc(SKILL_LABEL[item.skill] || item.skill)}` : ""} · difficulté ${esc(item.difficulty)} · ${esc(item.estimatedSeconds)} s</p>
    <p class="qprompt">${esc(item.prompt)}</p>${stimulusHtml(item.stimulus)}<div class="opts">${opts}</div>
    ${showKey ? `<div class="msg note" style="margin-top:var(--s3)"><strong>Explication :</strong> ${esc(item.explanation)}</div>` : ""}`;
}

function renderDetail() {
  const c = currentCand();
  const box = $("#detail");
  if (!c) { box.innerHTML = `<p class="empty">${S.cands.length ? "Sélectionnez un item." : "Chargez un fichier de candidats ou créez une question, puis sélectionnez un item."}</p>`; return; }
  box.innerHTML = `<div class="detailhead"><div><div class="id mono">${esc(c.item.id)}</div><div class="chips" id="d-chips"></div><small class="mono">${esc(c.file)}</small></div><div id="d-actions" class="actions"></div></div>
    <div class="panel" style="margin-top:var(--s3)"><div class="actions" style="justify-content:space-between"><div class="section-title">Aperçu candidat</div><label class="actions" style="font-size:var(--sm)"><input type="checkbox" id="blindmode" ${c.blind ? "" : "checked"}> Résoudre à l'aveugle</label></div><div id="d-preview" class="preview"></div></div>
    ${c.item.revisionOf ? `<div class="panel"><div class="section-title">Modifications proposées par rapport à la version approuvée</div><div id="d-diff"></div></div>` : ""}
    <div class="panel"><div class="section-title">Revue IA aveugle</div><div id="d-ai" class="msgs"></div></div>
    <div class="panel"><div class="section-title">Contrôles automatiques</div><div id="d-checks" class="msgs"></div></div>
    <div class="panel"><details ${c.decision ? "" : "open"}><summary>Modifier la question</summary><div id="d-editor" style="margin-top:var(--s3)"></div></details></div>`;
  $("#blindmode").onchange = (e) => { if (!e.target.checked && !c.blind) c.blind = { skipped: true }; else if (e.target.checked) c.blind = null; refreshDetail(); };
  renderEditor($("#d-editor"), c.item, () => { if (c.ai) c.aiStale = c.ai && JSON.stringify(stripMeta(c.item)) !== JSON.stringify(stripMeta(JSON.parse(c.orig))); c.blind = c.blind?.skipped ? c.blind : null; refreshDetail(); persist(); renderQueue(); }, { lockId: false });
  refreshDetail();
}
function stripMeta(x) { const { reviewNotes, reviewer, reviewedAt, reviewStatus, rejectionReason, ...rest } = x; return rest; }

function refreshDetail() {
  const c = currentCand(); if (!c) return;
  const item = c.item;
  const r = checks(item);
  $("#d-chips").innerHTML = `${decisionChip(c)}${aiChip(c)}${checkChip(item)}`;

  // Preview (blind first, key revealed after answering)
  const blindActive = !c.blind && !c.decision;
  const mine = c.blind && !c.blind.skipped ? (c.blind.ratings || c.blind.choice) : null;
  $("#d-preview").innerHTML = previewHtml(item, { blind: blindActive, mine, showKey: !blindActive }) + (blindActive ? `<div class="actions" style="margin-top:var(--s3)"><button class="btn secondary" id="blindcheck">Vérifier ma réponse</button><span class="chip">La clé est masquée tant que vous n'avez pas répondu.</span></div>` : blindResult(c));
  const bc = $("#blindcheck");
  if (bc) bc.onclick = () => {
    if (item.itemFormat === "rating") {
      const vals = (item.options || []).map((_, i) => { const x = $(`input[name=b${i}]:checked`); return x ? Number(x.value) : null; });
      if (vals.includes(null)) return toast("Notez chaque réaction.");
      c.blind = { ratings: vals };
    } else {
      const x = $("input[name=bchoice]:checked");
      if (!x) return toast("Choisissez une option.");
      c.blind = { choice: Number(x.value) };
    }
    persist(); refreshDetail();
  };

  // AI review
  const a = c.ai;
  $("#d-ai").innerHTML = !a ? `<div class="msg note">Aucune revue IA pour cet item. Chargez le fichier <code>*.review.json</code>${S.mode === "server" ? " ou lancez la revue dans l'onglet Exporter" : ""}.</div>`
    : `${c.aiStale ? `<div class="msg warning">Item modifié depuis la revue : décision obsolète.</div>` : ""}
       <div class="msg ${a.decision === "pass" ? "good" : a.decision === "reject" ? "error" : "warning"}">Décision : <strong>${esc(a.decision)}</strong>${a.confidence ? ` · confiance ${esc(a.confidence)}` : ""}${a.chosenIndex != null ? ` · réponse trouvée : option ${Number(a.chosenIndex) + 1} (clé : ${item.correctIndex + 1})` : ""}${Array.isArray(a.ratings) ? ` · notes ${esc(a.ratings.join(", "))}` : ""}</div>
       ${(a.issues || []).map((i) => `<div class="msg warning">${esc(i)}</div>`).join("")}`;

  // Checks
  $("#d-checks").innerHTML = msgList(r, dupMsgs(item, item.revisionOf || null));
  if ($("#d-diff")) $("#d-diff").innerHTML = diffHtml(c);

  // Decision actions
  const aiOk = a && a.decision === "pass" && !c.aiStale;
  const act = $("#d-actions");
  if (c.decision) {
    act.innerHTML = `<span class="chip ${c.decision === "approved" ? "ok" : "ko"}">${c.decision === "approved" ? "Approuvé" : `Rejeté : ${esc(c.reason)}`}</span><button class="btn secondary" id="undo">Remettre en attente</button>`;
    $("#undo").onclick = () => undoDecision(c);
  } else {
    act.innerHTML = `${aiOk ? "" : `<label class="actions" style="font-size:var(--xs)"><input type="checkbox" id="override"> J'ai vérifié la réponse moi-même (revue IA non « pass »)</label>`}
      <button class="btn" id="approve" ${r.errors.length ? "disabled title=\"Corrigez les erreurs avant d'approuver\"" : ""}>Approuver</button>
      <input type="text" id="reason" placeholder="Motif du rejet" aria-label="Motif du rejet" style="width:12rem"><button class="btn danger" id="reject">Rejeter</button>`;
    $("#approve").onclick = () => approve(c);
    $("#reject").onclick = () => reject(c, $("#reason").value.trim());
  }
}
function blindResult(c) {
  const item = c.item;
  if (!c.blind || c.blind.skipped || c.decision) return "";
  setTimeout(() => { const b = $("#blindagain"); if (b) b.onclick = () => { c.blind = null; refreshDetail(); }; });
  if (item.itemFormat === "rating") {
    const gap = c.blind.ratings.reduce((s, v, i) => s + Math.abs(v - item.ratings[i]), 0) / c.blind.ratings.length;
    const top = c.blind.ratings.indexOf(Math.max(...c.blind.ratings));
    const ok = top === item.correctIndex && gap <= 1;
    return `<div class="msg ${ok ? "good" : "warning"}" style="margin-top:var(--s3)">${ok ? "Vos notes concordent avec la clé" : "Vos notes divergent de la clé"} (écart moyen ${gap.toFixed(2)}). <button class="btn ghost" id="blindagain">Recommencer</button></div>`;
  }
  const ok = c.blind.choice === item.correctIndex;
  return `<div class="msg ${ok ? "good" : "warning"}" style="margin-top:var(--s3)">${ok ? "Vous avez trouvé la même réponse que la clé." : "Votre réponse diffère de la clé : vérifiez l'item avant d'approuver."} <button class="btn ghost" id="blindagain">Recommencer</button></div>`;
}

/* ---------- Revision diff ---------- */
function showValue(v) {
  if (v == null) return "—";
  if (typeof v === "string") return v;
  if (v.type === "shapes") return v.text;
  if (v.type === "table") return [v.caption, tableToText(v), v.note].filter(Boolean).join("\n");
  return JSON.stringify(v);
}
function diffHtml(c) {
  const after = c.item;
  const before = c.replaced || allApproved().find((x) => x.id === after.revisionOf);
  if (!before) return `<div class="msg warning">Question d'origine introuvable dans la banque.</div>`;
  const rows = [];
  const add = (label, a, b) => { if (JSON.stringify(a) !== JSON.stringify(b)) rows.push(`<tr><th scope="row">${esc(label)}</th><td class="before">${esc(showValue(a))}</td><td class="after">${esc(showValue(b))}</td></tr>`); };
  add("Format", before.itemFormat, after.itemFormat);
  add("Compétence", before.skill, after.skill);
  add("Difficulté", before.difficulty, after.difficulty);
  add("Énoncé", before.prompt, after.prompt);
  add("Stimulus", before.stimulus, after.stimulus);
  const n = Math.max(before.options.length, after.options.length);
  for (let i = 0; i < n; i++) {
    const mark = (it) => (it.options[i] == null ? null : `${it.options[i]}${i === it.correctIndex ? "  ✓" : ""}${it.ratings ? `  [${it.ratings[i]}]` : ""}`);
    add(`Option ${i + 1}`, mark(before), mark(after));
    add(`Justification ${i + 1}`, before.optionRationales?.[i] ?? null, after.optionRationales?.[i] ?? null);
  }
  add("Explication", before.explanation, after.explanation);
  return rows.length ? `<p class="msg note">Version approuvée : v${esc(before.version)}. L'approbation remplace cette version (v${esc((before.version || 1) + 1)}).</p><table class="diff"><thead><tr><th></th><th>Avant</th><th>Après</th></tr></thead><tbody>${rows.join("")}</tbody></table>` : `<div class="msg note">Aucune différence avec la version approuvée.</div>`;
}

/* ---------- Decisions ---------- */
function approve(c) {
  const who = reviewer();
  if (who.length < 2) { $("#reviewer").focus(); return toast("Indiquez votre nom de relecteur."); }
  const r = checks(c.item);
  if (r.errors.length) return toast("Corrigez les erreurs avant d'approuver.");
  const aiOk = c.ai && c.ai.decision === "pass" && !c.aiStale;
  if (!aiOk && !$("#override")?.checked) return toast("Revue IA non « pass » : cochez la confirmation de vérification.");
  const cat = c.item.category;
  const revisionOf = c.item.revisionOf;
  const original = revisionOf ? (S.approved[cat] || []).find((x) => x.id === revisionOf) : null;
  if (revisionOf && !original) return toast("La question d'origine n'est plus dans la banque.");
  if (!revisionOf && allApproved().some((x) => x.id === c.item.id)) return toast("Cet identifiant existe déjà dans la banque : modifiez-le.");
  const item = { ...clone(c.item), reviewStatus: "approved", reviewer: who, reviewedAt: nowIso() };
  delete item.rejectionReason; delete item.revisionOf;
  if (original) item.version = (original.version || 1) + 1;
  const final = checks(item);
  if (final.errors.length) return toast(`Approbation impossible : ${final.errors[0]}`);
  if (original) { const list = S.approved[cat]; list[list.indexOf(original)] = item; c.replaced = original; }
  else S.approved[cat].push(item);
  c.decision = "approved"; c.reason = "";
  S.log.push({ id: item.id, decision: original ? "revised" : "approved", version: item.version, reviewer: who, at: item.reviewedAt, aiDecision: c.ai?.decision || null, aiOverride: !aiOk, blindMatch: blindMatch(c), file: c.file });
  toast(`${item.id} approuvé`); persist(); nextTodo(); renderAll();
}
function blindMatch(c) {
  if (!c.blind || c.blind.skipped) return null;
  if (Array.isArray(c.blind.ratings)) return c.blind.ratings.indexOf(Math.max(...c.blind.ratings)) === c.item.correctIndex;
  return c.blind.choice === c.item.correctIndex;
}
function reject(c, reason) {
  const who = reviewer();
  if (who.length < 2) { $("#reviewer").focus(); return toast("Indiquez votre nom de relecteur."); }
  if (reason.length < 3) { $("#reason").focus(); return toast("Indiquez un motif de rejet."); }
  c.decision = "rejected"; c.reason = reason;
  S.log.push({ id: c.item.id, decision: "rejected", reviewer: who, at: nowIso(), reason, aiDecision: c.ai?.decision || null, file: c.file });
  toast(`${c.item.id} rejeté`); persist(); nextTodo(); renderAll();
}
function undoDecision(c) {
  if (c.decision === "approved") {
    const cat = c.item.category;
    if (c.replaced) { const list = S.approved[cat]; const i = list.findIndex((x) => x.id === c.item.id); if (i !== -1) list[i] = c.replaced; c.replaced = null; }
    else S.approved[cat] = S.approved[cat].filter((x) => x.id !== c.item.id);
  }
  S.log.push({ id: c.item.id, decision: "undone", reviewer: reviewer(), at: nowIso(), file: c.file });
  c.decision = null; c.reason = "";
  persist(); renderAll();
}
function nextTodo() { const n = filteredCands().find((c) => !c.decision) || S.cands.find((c) => !c.decision); if (n) S.sel.queue = n.key; }

/* ---------- Editor (shared by candidates and approved items) ---------- */
function stimulusKind(s) { return s == null ? "none" : typeof s === "string" ? "text" : s.type; }
function tableToText(s) { return [(s.headers || []).join(" | "), ...(s.rows || []).map((r) => r.join(" | "))].join("\n"); }
function textToTable(t, base) {
  const lines = t.split("\n").map((l) => l.trim()).filter(Boolean);
  const cells = (l) => l.split("|").map((x) => x.trim());
  const num = (x) => (/^-?\d+(,\d+)?$/.test(x) ? Number(x.replace(",", ".")) : /^-?\d+\.\d+$/.test(x) ? Number(x) : x);
  const out = { type: "table", headers: lines[0] ? cells(lines[0]) : [], rows: lines.slice(1).map((l) => cells(l).map(num)) };
  if (base?.caption) out.caption = base.caption;
  if (base?.note) out.note = base.note;
  return out;
}
function renderEditor(box, item, onChange, { lockId }) {
  const rules = catRules(item.category);
  const kind = stimulusKind(item.stimulus);
  const isRating = item.itemFormat === "rating", isTfcs = item.itemFormat === "tfcs";
  box.innerHTML = `<div class="grid2">
      <label class="field"><span>Identifiant</span><input type="text" data-f="id" value="${esc(item.id)}" ${lockId ? "readonly" : ""}></label>
      <label class="field"><span>Format</span><select data-f="itemFormat">${rules.formats.map((f) => `<option ${f === item.itemFormat ? "selected" : ""}>${f}</option>`).join("")}</select></label>
      <label class="field"><span>Compétence</span><select data-f="skill">${rules.skills.map((s) => `<option value="${s}" ${s === item.skill ? "selected" : ""}>${esc(SKILL_LABEL[s] || s)}</option>`).join("")}${rules.skills.includes(item.skill) ? "" : `<option selected value="${esc(item.skill)}">${esc(item.skill)} (non autorisée)</option>`}</select></label>
      <label class="field"><span>Difficulté</span><select data-f="difficulty">${[1, 2, 3].map((d) => `<option ${d === item.difficulty ? "selected" : ""}>${d}</option>`).join("")}</select></label>
      <label class="field"><span>Durée estimée (s)</span><input type="number" min="20" max="300" data-f="estimatedSeconds" value="${esc(item.estimatedSeconds)}"></label>
      <label class="field"><span>Langue</span><select data-f="language">${["fr", "de"].map((l) => `<option ${l === item.language ? "selected" : ""}>${l}</option>`).join("")}</select></label>
    </div>
    <label class="field" style="margin-top:var(--s3)"><span>Énoncé</span><textarea data-f="prompt">${esc(item.prompt)}</textarea></label>
    <div class="field" style="margin-top:var(--s3)"><span>Stimulus</span>
      <select data-stim-kind>${[["none", "Aucun"], ["text", "Texte"], ["shapes", "Figures"], ["table", "Tableau"]].map(([v, l]) => `<option value="${v}" ${v === kind ? "selected" : ""}>${l}</option>`).join("")}</select>
      ${kind === "text" ? `<textarea data-stim="text">${esc(item.stimulus)}</textarea>` : ""}
      ${kind === "shapes" ? `<textarea data-stim="shapes" style="font:1.2rem/1.4 var(--sym)">${esc(item.stimulus.text)}</textarea><small>Une ligne par rangée de matrice. Symboles : ● ○ ■ □ ▲ △ ▼ ▽ ◀ ◁ ▶ ▷ ◆ ◇ ◰ ◱ ◲ ◳ ↑ → ↓ ←</small>` : ""}
      ${kind === "table" ? `<input type="text" data-stim="caption" placeholder="Titre du tableau" value="${esc(item.stimulus.caption || "")}"><textarea data-stim="table" class="mono" style="min-height:7rem">${esc(tableToText(item.stimulus))}</textarea><small>Première ligne : en-têtes. Colonnes séparées par « | ». Les nombres sont détectés automatiquement.</small><input type="text" data-stim="note" placeholder="Note sous le tableau (facultatif)" value="${esc(item.stimulus.note || "")}">` : ""}
    </div>
    <div class="field" style="margin-top:var(--s3)"><span>Options ${isRating ? "(note de 1 à 4 ; une seule note 4, sur la réaction de référence)" : "(cochez la bonne réponse)"}</span>
      ${(item.options || []).map((o, i) => `<div class="editopt">
        <input type="radio" name="ed-correct" value="${i}" ${i === item.correctIndex ? "checked" : ""} aria-label="Bonne réponse : option ${i + 1}">
        <div class="stack"><input type="text" data-opt="${i}" value="${esc(o)}" ${isTfcs ? "readonly" : ""} aria-label="Texte de l'option ${i + 1}">
          <input type="text" data-why="${i}" value="${esc(item.optionRationales?.[i] || "")}" placeholder="Justification de l'option" aria-label="Justification de l'option ${i + 1}"></div>
        <div class="stack">${isRating ? `<select data-rate="${i}" aria-label="Note de l'option ${i + 1}">${[1, 2, 3, 4].map((v) => `<option ${item.ratings?.[i] === v ? "selected" : ""}>${v}</option>`).join("")}</select>` : ""}
          ${!isTfcs && item.options.length > 3 && !isRating ? `<button class="btn ghost" data-delopt="${i}" aria-label="Supprimer l'option ${i + 1}">✕</button>` : ""}</div></div>`).join("")}
      ${!isTfcs && item.options.length < 4 ? `<button class="btn secondary" data-addopt>Ajouter une option</button>` : ""}
    </div>
    <label class="field" style="margin-top:var(--s3)"><span>Explication</span><textarea data-f="explanation">${esc(item.explanation)}</textarea></label>
    <label class="field" style="margin-top:var(--s3)"><span>Notes de relecture</span><textarea data-f="reviewNotes" placeholder="Facultatif, conservé dans l'item">${esc(item.reviewNotes || "")}</textarea></label>`;

  const changed = (rerender) => { if (rerender) renderEditor(box, item, onChange, { lockId }); onChange(); };
  box.oninput = (e) => {
    const t = e.target;
    if (t.dataset.f) {
      const f = t.dataset.f;
      if (f === "difficulty" || f === "estimatedSeconds") item[f] = Number(t.value);
      else if (f === "reviewNotes") { if (t.value.trim()) item.reviewNotes = t.value; else delete item.reviewNotes; }
      else item[f] = t.value;
      if (f === "itemFormat") return applyFormat(item, t.value, () => changed(true));
      if (f === "language" && item.itemFormat === "tfcs") { item.options = [...TFCS[item.language]]; return changed(true); }
      return changed(false);
    }
    if (t.dataset.opt !== undefined) { item.options[Number(t.dataset.opt)] = t.value; return changed(false); }
    if (t.dataset.why !== undefined) {
      item.optionRationales = item.optionRationales || item.options.map(() => "");
      item.optionRationales[Number(t.dataset.why)] = t.value;
      if (item.optionRationales.every((x) => !x.trim())) delete item.optionRationales;
      return changed(false);
    }
    if (t.dataset.rate !== undefined) { item.ratings[Number(t.dataset.rate)] = Number(t.value); return changed(false); }
    if (t.name === "ed-correct") { item.correctIndex = Number(t.value); return changed(false); }
    if (t.dataset.stimKind !== undefined) {
      const k = t.value;
      item.stimulus = k === "none" ? null : k === "text" ? (typeof item.stimulus === "string" ? item.stimulus : "") : k === "shapes" ? { type: "shapes", text: item.stimulus?.text || "" } : { type: "table", headers: ["", ""], rows: [["", ""]] };
      return changed(true);
    }
    if (t.dataset.stim === "text") { item.stimulus = t.value; return changed(false); }
    if (t.dataset.stim === "shapes") { item.stimulus = { type: "shapes", text: t.value }; return changed(false); }
    if (t.dataset.stim === "table") { item.stimulus = textToTable(t.value, item.stimulus); return changed(false); }
    if (t.dataset.stim === "caption" || t.dataset.stim === "note") {
      const k = t.dataset.stim; if (t.value.trim()) item.stimulus[k] = t.value; else delete item.stimulus[k];
      return changed(false);
    }
  };
  box.onclick = (e) => {
    const t = e.target;
    if (t.dataset.addopt !== undefined) { item.options.push(""); if (item.optionRationales) item.optionRationales.push(""); changed(true); }
    if (t.dataset.delopt !== undefined) {
      const i = Number(t.dataset.delopt);
      item.options.splice(i, 1); item.optionRationales?.splice(i, 1);
      if (item.correctIndex >= item.options.length || item.correctIndex === i) item.correctIndex = 0;
      else if (item.correctIndex > i) item.correctIndex--;
      changed(true);
    }
  };
}
function applyFormat(item, fmt, done) {
  item.itemFormat = fmt;
  if (fmt === "tfcs") { item.options = [...TFCS[item.language || "fr"]]; if (item.correctIndex > 2) item.correctIndex = 0; if (item.optionRationales) item.optionRationales = item.optionRationales.slice(0, 3); delete item.ratings; }
  else {
    while (item.options.length < 4) item.options.push("");
    if (fmt === "rating") item.ratings = item.options.map((_, i) => (i === item.correctIndex ? 4 : 1));
    else delete item.ratings;
  }
  done();
}

/* ---------- New item ---------- */
function newItem(cat) {
  const rules = catRules(cat);
  const stamp = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  const existing = new Set([...allApproved(), ...S.cands.map((c) => c.item)].map((x) => x.id));
  let n = 1, id;
  do { id = `${cat}-man${stamp}-${String(n++).padStart(3, "0")}`; } while (existing.has(id));
  const fmt = rules.formats[0];
  const item = {
    id, version: 1, category: cat, itemFormat: fmt, skill: rules.skills[0], difficulty: 1, language: "fr", estimatedSeconds: 60,
    prompt: "", stimulus: cat === "abstract" ? { type: "shapes", text: "" } : "", options: fmt === "tfcs" ? [...TFCS.fr] : ["", "", "", ""],
    correctIndex: 0, explanation: "", sourceType: "original_human", reviewStatus: "candidate", createdAt: nowIso(),
  };
  if (fmt === "rating") item.ratings = [4, 1, 2, 3];
  const file = "(nouvelles questions)";
  addCandidates(file, [item], null);
  S.sel.queue = `${file}::${id}`;
  $("#qstate").value = ""; $("#qcat").value = "";
  persist(); renderAll();
}

/* ---------- Bank ---------- */
function renderStats() {
  const all = allApproved();
  const card = (n, l) => `<div class="stat"><strong>${n}</strong><span>${l}</span></div>`;
  let html = card(all.length, "questions approuvées");
  for (const c of CATS) {
    const items = S.approved[c] || [];
    const rules = catRules(c);
    const counts = rules.skills.map((s) => [s, items.filter((x) => x.skill === s).length]);
    const max = Math.max(1, ...counts.map((x) => x[1]));
    const diff = [1, 2, 3].map((d) => items.filter((x) => x.difficulty === d).length).join(" / ");
    const longest = items.filter((x) => x.itemFormat !== "tfcs" && x.options[x.correctIndex]?.length === Math.max(...x.options.map((o) => o.length))).length;
    const warn = items.reduce((n, x) => n + checks(x).warnings.length, 0);
    html += `<div class="stat"><strong>${items.length}</strong><span>${esc(CAT_LABEL[c])} · difficulté 1/2/3 : ${diff}</span>
      <div class="bars" style="margin-top:var(--s2)">${counts.map(([s, n]) => `<div class="bar ${n ? "" : "zero"}"><span>${esc(SKILL_LABEL[s] || s)}</span><i style="width:${(n / max) * 100}%"></i><span>${n}</span></div>`).join("")}</div>
      <span>Bonne réponse la plus longue : ${longest} · alertes : ${warn}</span></div>`;
  }
  const pairs = [];
  for (let i = 0; i < all.length; i++) for (let j = i + 1; j < all.length; j++) {
    const sim = R.similarity(R.itemText(all[i]), R.itemText(all[j]));
    if (sim >= 0.55) pairs.push(`${all[i].id} ≈ ${all[j].id} (${Math.round(sim * 100)} %)`);
  }
  html += `<div class="stat"><strong>${pairs.length}</strong><span>paires de questions très proches</span>${pairs.slice(0, 6).map((p) => `<div class="msg warning" style="margin-top:4px">${esc(p)}</div>`).join("")}</div>`;
  $("#stats").innerHTML = html;
}
function renderBank() {
  const cat = $("#bcat").value, d = $("#bdiff").value, q = $("#bsearch").value.toLowerCase();
  const list = CATS.filter((c) => !cat || c === cat).flatMap((c) => S.approved[c] || []).filter((x) => (!d || String(x.difficulty) === d) && (!q || `${x.id} ${x.prompt} ${R.itemText(x)}`.toLowerCase().includes(q)));
  $("#bankcount").textContent = allApproved().length;
  S.bankVisible = list.map((x) => x.id);
  for (const id of [...S.bankSel]) if (!allApproved().some((x) => x.id === id)) S.bankSel.delete(id);
  $("#bank").innerHTML = list.length ? list.map((x) => `<div class="selrow"><input type="checkbox" data-sel="${esc(x.id)}" ${S.bankSel.has(x.id) ? "checked" : ""} aria-label="Sélectionner ${esc(x.id)}"><button class="row" data-bid="${esc(x.id)}" aria-current="${x.id === S.sel.bank}"><span class="id">${esc(x.id)} · v${esc(x.version)}</span><span class="p">${esc(x.prompt)}</span><span class="chips"><span class="chip">${esc(SKILL_LABEL[x.skill] || x.skill)}</span><span class="chip">diff. ${esc(x.difficulty)}</span>${pendingRevision(x.id) ? `<span class="chip info">révision en attente</span>` : ""}${isModified(x) ? `<span class="chip warn">modifié</span>` : ""}${checkChip(x)}</span></button></div>`).join("") : `<p class="empty">Aucune question pour ces filtres.</p>`;
  renderBulkBar();
  renderStats();
}
function pendingRevision(id) { return S.cands.some((c) => c.item.revisionOf === id && !c.decision); }
function visibleSelection() { return [...S.bankSel].filter((id) => (S.bankVisible || []).includes(id)); }
function renderBulkBar() {
  const n = visibleSelection().length, hidden = S.bankSel.size - n;
  $("#bulkbar").innerHTML = `<span class="chip ${n ? "info" : ""}">${n} sélectionnée(s)${hidden ? ` · ${hidden} masquée(s) par le filtre, non concernée(s)` : ""}</span>
    <button class="btn ghost" data-bulk="visible">Tout (filtre)</button><button class="btn ghost" data-bulk="warn">Avec alertes</button><button class="btn ghost" data-bulk="none" ${n ? "" : "disabled"}>Aucune</button>
    <button class="btn" data-bulk="regen" ${n ? "" : "disabled"}>Régénérer avec l'IA</button><button class="btn danger" data-bulk="remove" ${n ? "" : "disabled"}>Retirer</button>`;
}
function bulkAction(kind) {
  if (kind === "visible") (S.bankVisible || []).forEach((id) => S.bankSel.add(id));
  if (kind === "warn") allApproved().filter((x) => (S.bankVisible || []).includes(x.id) && checks(x).warnings.length).forEach((x) => S.bankSel.add(x.id));
  if (kind === "none") S.bankSel.clear();
  const ids = visibleSelection();
  if (kind === "regen") return openAi({ kind: "revise", ids });
  if (kind === "remove") {
    const who = reviewer();
    if (who.length < 2) { $("#reviewer").focus(); return toast("Indiquez votre nom de relecteur."); }
    if (!confirm(`Retirer ${ids.length} question(s) de la banque approuvée ?\n${ids.join(", ")}`)) return;
    for (const id of ids) {
      const x = allApproved().find((i) => i.id === id);
      if (!x) continue;
      S.approved[x.category] = S.approved[x.category].filter((i) => i.id !== id);
      S.removed.add(id);
      S.log.push({ id, decision: "removed", reviewer: who, at: nowIso() });
    }
    toast(`${ids.length} question(s) retirée(s)`); ids.forEach((id) => S.bankSel.delete(id)); S.sel.bank = null; S.bankDraft = null; persist(); renderAll(); return;
  }
  renderBank();
}
function isModified(x) { const orig = JSON.parse(S.approvedOrig[x.category] || "[]").find((o) => o.id === x.id); return !orig || JSON.stringify(orig) !== JSON.stringify(x); }
function renderBankDetail() {
  const box = $("#bdetail");
  const x = allApproved().find((i) => i.id === S.sel.bank);
  if (!x) { box.innerHTML = `<p class="empty">Sélectionnez une question approuvée pour la consulter ou la modifier.</p>`; S.bankDraft = null; return; }
  if (!S.bankDraft || S.bankDraft.id !== x.id) S.bankDraft = clone(x);
  const draft = S.bankDraft;
  const dirty = JSON.stringify(draft) !== JSON.stringify(x);
  box.innerHTML = `<div class="detailhead"><div><div class="mono">${esc(x.id)} · version ${esc(x.version)}</div><small>Approuvé par ${esc(x.reviewer)} le ${esc((x.reviewedAt || "").slice(0, 10))}</small></div>
      <div class="actions"><button class="btn" id="bsave" ${dirty ? "" : "disabled"}>Enregistrer la modification</button><button class="btn secondary" id="bcancel" ${dirty ? "" : "disabled"}>Annuler</button><button class="btn secondary" id="bregen">Régénérer avec l'IA</button><button class="btn danger" id="bremove">Retirer de la banque</button></div></div>
    <div class="panel" style="margin-top:var(--s3)"><div class="section-title">Aperçu</div><div id="b-preview" class="preview"></div></div>
    <div class="panel"><div class="section-title">Contrôles automatiques</div><div id="b-checks" class="msgs"></div></div>
    <div class="panel"><details><summary>Modifier la question</summary><div id="b-editor" style="margin-top:var(--s3)"></div></details></div>`;
  const refresh = () => {
    $("#b-preview").innerHTML = previewHtml(draft, { blind: false, mine: null, showKey: true });
    $("#b-checks").innerHTML = msgList(checks({ ...draft, reviewStatus: "approved", reviewer: draft.reviewer || "x", reviewedAt: draft.reviewedAt || nowIso() }), dupMsgs(draft, draft.id));
    const d = JSON.stringify(draft) !== JSON.stringify(x);
    $("#bsave").disabled = !d; $("#bcancel").disabled = !d;
  };
  renderEditor($("#b-editor"), draft, refresh, { lockId: true });
  refresh();
  $("#bcancel").onclick = () => { S.bankDraft = null; renderBankDetail(); };
  $("#bregen").onclick = () => openAi({ kind: "revise", ids: [x.id] });
  $("#bsave").onclick = () => {
    const who = reviewer();
    if (who.length < 2) { $("#reviewer").focus(); return toast("Indiquez votre nom de relecteur."); }
    const updated = { ...clone(draft), version: (x.version || 1) + 1, reviewStatus: "approved", reviewer: who, reviewedAt: nowIso() };
    const r = checks(updated);
    if (r.errors.length) return toast(`Enregistrement impossible : ${r.errors[0]}`);
    const list = S.approved[x.category];
    list[list.findIndex((i) => i.id === x.id)] = updated;
    S.log.push({ id: x.id, decision: "modified", reviewer: who, at: updated.reviewedAt, version: updated.version });
    S.bankDraft = null; toast(`${x.id} mis à jour (version ${updated.version})`); persist(); renderAll();
  };
  $("#bremove").onclick = () => {
    if (!confirm(`Retirer ${x.id} de la banque approuvée ?`)) return;
    const who = reviewer();
    if (who.length < 2) { $("#reviewer").focus(); return toast("Indiquez votre nom de relecteur."); }
    S.approved[x.category] = S.approved[x.category].filter((i) => i.id !== x.id);
    S.removed.add(x.id);
    S.log.push({ id: x.id, decision: "removed", reviewer: who, at: nowIso() });
    S.sel.bank = null; S.bankDraft = null; toast(`${x.id} retiré`); persist(); renderAll();
  };
}

/* ---------- Export ---------- */
function changes() {
  const cats = CATS.filter((c) => JSON.stringify(S.approved[c] || []) !== S.approvedOrig[c]);
  const files = Object.entries(S.files).map(([name, f]) => {
    const remaining = S.cands.filter((c) => c.file === name && !c.decision).map((c) => c.item);
    const decided = S.cands.filter((c) => c.file === name && c.decision).length;
    return { name, remaining, decided, hasReview: f.hasReview, isNew: f.isNew };
  }).filter((f) => f.decided || f.isNew || f.name === "(nouvelles questions)" || S.cands.some((c) => c.file === f.name && c.item !== undefined && c.orig !== JSON.stringify(c.item)));
  return { cats, files };
}
function stamp() { return new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19); }
function exportPlan() {
  const { cats, files } = changes();
  const out = [];
  for (const c of cats) out.push({ path: `data/approved/${c}.json`, content: JSON.stringify(S.approved[c], null, 2) + "\n" });
  const deletes = [];
  for (const f of files) {
    if (f.name === "(nouvelles questions)") {
      if (f.remaining.length) out.push({ path: `generated/manual-${stamp()}.json`, content: JSON.stringify(f.remaining, null, 2) + "\n" });
    } else if (f.remaining.length) out.push({ path: `generated/${f.name}`, content: JSON.stringify(f.remaining, null, 2) + "\n" });
    else if (!f.isNew) { deletes.push(`generated/${f.name}`); if (f.hasReview) deletes.push(`generated/${f.name.replace(/\.json$/, ".review.json")}`); }
  }
  if (S.log.length) out.push({ path: `data/review-log/${stamp()}.json`, content: JSON.stringify({ reviewer: reviewer(), exportedAt: nowIso(), mode: S.mode, decisions: S.log }, null, 2) + "\n" });
  return { cats, files, out, deletes };
}
function renderExport() {
  const plan = exportPlan();
  const n = plan.cats.length + plan.deletes.length + plan.files.filter((f) => f.remaining.length).length;
  $("#changecount").textContent = plan.cats.length;
  const approvedN = S.log.filter((l) => l.decision === "approved").length, rejectedN = S.log.filter((l) => l.decision === "rejected").length;
  const server = S.mode === "server";
  $("#exportpanel").innerHTML = `
    <div class="notice">${server ? "Mode local (<code>npm run admin</code>) : les fichiers sont écrits directement dans le dépôt, puis <code>app.js</code> est resynchronisé. Il ne vous reste qu'à committer." : "Mode hors ligne : téléchargez l'archive, décompressez-la à la racine du dépôt (elle remplace les fichiers concernés), supprimez les fichiers candidats traités, puis lancez <code>npm run build:bank &amp;&amp; npm test</code> et committez."}</div>
    <div class="stats">
      <div class="stat"><strong>${approvedN}</strong><span>item(s) approuvé(s)</span></div>
      <div class="stat"><strong>${rejectedN}</strong><span>item(s) rejeté(s)</span></div>
      <div class="stat"><strong>${S.log.filter((l) => l.decision === "modified").length}</strong><span>question(s) modifiée(s)</span></div>
      <div class="stat"><strong>${S.removed.size}</strong><span>question(s) retirée(s)</span></div>
    </div>
    <h2 style="margin:var(--s4) 0 var(--s2)">Fichiers concernés</h2>
    <div class="files">${plan.out.map((f) => `<div class="file"><code>${esc(f.path)}</code><span class="actions"><span class="chip info">${f.path.startsWith("data/approved") ? "remplacé" : "écrit"}</span>${server ? "" : `<button class="btn ghost" data-dl="${esc(f.path)}">Télécharger</button>`}</span></div>`).join("")}
      ${plan.deletes.map((p) => `<div class="file"><code>${esc(p)}</code><span class="chip ko">${server ? "supprimé" : "à supprimer"}</span></div>`).join("")}
      ${n || S.log.length ? "" : `<p class="empty">Aucune modification pour l'instant.</p>`}</div>
    <div class="actions" style="margin-top:var(--s4)">
      ${server ? `<button class="btn" id="save" ${n || S.log.length ? "" : "disabled"}>Enregistrer dans le dépôt</button><button class="btn secondary" id="reloadsrv">Recharger depuis le disque</button>` : `<button class="btn" id="zip" ${plan.out.length ? "" : "disabled"}>Télécharger l'archive (.zip)</button><button class="btn secondary" id="clearsession">Effacer la session locale</button>`}
    </div>
    ${server ? "" : `<pre class="cmd">${esc([...plan.deletes.map((p) => `git rm -q --ignore-unmatch ${p}`), "npm run build:bank && npm test", 'git add data app.js admin.js && git commit -m "feat: review question bank"'].join("\n"))}</pre>`}
    ${server ? tasksHtml() : ""}`;
  $$("[data-dl]").forEach((b) => (b.onclick = () => { const f = plan.out.find((x) => x.path === b.dataset.dl); download(f.path.split("/").pop(), new Blob([f.content], { type: "application/json" })); }));
  if ($("#zip")) $("#zip").onclick = () => { download(`eag-banque-${stamp()}.zip`, zip(plan.out)); toast("Archive téléchargée"); };
  if ($("#clearsession")) $("#clearsession").onclick = () => { if (confirm("Effacer la session locale (candidats chargés et décisions non exportées) ?")) { store(STORE_KEY); location.reload(); } };
  if ($("#save")) $("#save").onclick = () => saveToServer(plan);
  if ($("#reloadsrv")) $("#reloadsrv").onclick = async () => { await reloadFromServer(); S.log = []; renderAll(); toast("Données rechargées"); };
  if (server) bindTasks();
}
function download(name, blob) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = name; document.body.append(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
}

/* Minimal ZIP writer (store, no compression). */
const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
function crc32(b) { let c = 0xffffffff; for (let i = 0; i < b.length; i++) c = CRC[(c ^ b[i]) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; }
function zip(files) {
  const enc = new TextEncoder(), parts = [], central = [];
  let offset = 0;
  const d = new Date(), time = (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1), date = ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate();
  for (const f of files) {
    const name = enc.encode(f.path), data = enc.encode(f.content), crc = crc32(data);
    const h = new DataView(new ArrayBuffer(30));
    h.setUint32(0, 0x04034b50, true); h.setUint16(4, 20, true); h.setUint16(6, 0x0800, true); h.setUint16(8, 0, true);
    h.setUint16(10, time, true); h.setUint16(12, date, true); h.setUint32(14, crc, true); h.setUint32(18, data.length, true); h.setUint32(22, data.length, true);
    h.setUint16(26, name.length, true); h.setUint16(28, 0, true);
    parts.push(h, name, data);
    const c = new DataView(new ArrayBuffer(46));
    c.setUint32(0, 0x02014b50, true); c.setUint16(4, 20, true); c.setUint16(6, 20, true); c.setUint16(8, 0x0800, true); c.setUint16(10, 0, true);
    c.setUint16(12, time, true); c.setUint16(14, date, true); c.setUint32(16, crc, true); c.setUint32(20, data.length, true); c.setUint32(24, data.length, true);
    c.setUint16(28, name.length, true); c.setUint32(42, offset, true);
    central.push(c, name);
    offset += 30 + name.length + data.length;
  }
  const size = central.reduce((n, p) => n + p.byteLength, 0);
  const e = new DataView(new ArrayBuffer(22));
  e.setUint32(0, 0x06054b50, true); e.setUint16(8, files.length, true); e.setUint16(10, files.length, true); e.setUint32(12, size, true); e.setUint32(16, offset, true);
  return new Blob([...parts, ...central, e], { type: "application/zip" });
}

/* ---------- Server-only: save and tasks ---------- */
async function saveToServer(plan) {
  if (reviewer().length < 2) { $("#reviewer").focus(); return toast("Indiquez votre nom de relecteur."); }
  const { files } = changes();
  const candidates = {};
  for (const f of files) {
    if (f.name === "(nouvelles questions)") continue;
    if (f.isNew && !f.remaining.length) continue;
    candidates[f.name] = f.remaining.length ? f.remaining : null;
  }
  const manual = files.find((f) => f.name === "(nouvelles questions)")?.remaining || [];
  const approved = Object.fromEntries(plan.cats.map((c) => [c, S.approved[c]]));
  try {
    $("#save").disabled = true;
    const res = await api("/api/save", { approved, candidates, manual, log: { reviewer: reviewer(), decisions: S.log } });
    toast(`Enregistré : ${res.written.length} fichier(s) écrit(s), ${res.deleted.length} supprimé(s)`);
    S.log = [];
    await reloadFromServer(); renderAll();
    taskOutput(`✅ Enregistré.\nÉcrits : ${res.written.join(", ") || "—"}\nSupprimés : ${res.deleted.join(", ") || "—"}\n${res.build}`);
  } catch (e) { toast("Échec de l'enregistrement"); taskOutput(`❌ ${e.message}`); $("#save").disabled = false; }
}
function tasksHtml() {
  const files = Object.keys(S.files).filter((f) => f !== "(nouvelles questions)");
  return `<h2 style="margin:var(--s4) 0 var(--s2)">Tâches</h2>
    <div class="grid2">
      <div class="panel"><div class="section-title">Générer des candidats</div>
        ${S.aiConfigured ? "" : `<div class="msg warning">AI_API_URL / AI_API_KEY / AI_MODEL absents du fichier <code>.env</code>.</div>`}
        <div class="actions" style="margin-top:var(--s2)"><button class="btn" data-ai="generate">Générer de nouvelles questions…</button><button class="btn secondary" data-ai="rebuild">Reconstruire une catégorie…</button></div></div>
      <div class="panel"><div class="section-title">Revue IA aveugle</div>
        <div class="actions"><select id="rfile">${files.map((f) => `<option>${esc(f)}</option>`).join("") || "<option value=''>Aucun fichier</option>"}</select><button class="btn" data-task="review" ${S.aiConfigured && files.length ? "" : "disabled data-off"}>Lancer la revue</button></div></div>
      <div class="panel"><div class="section-title">Contrôles</div>
        <div class="actions"><button class="btn secondary" data-task="test">npm test</button><button class="btn secondary" data-task="git">État Git</button></div></div>
    </div>
    <pre class="cmd" id="taskout" aria-live="polite">Résultat des tâches…</pre>`;
}
function taskOutput(t) { const o = $("#taskout"); if (o) o.textContent = t; }
function bindTasks() {
  $$("[data-ai]").forEach((b) => (b.onclick = () => openAi({ kind: b.dataset.ai })));
  $$("[data-task]").forEach((b) => (b.onclick = async () => {
    if (S.busy) return toast("Une tâche est déjà en cours.");
    const task = b.dataset.task;
    const body = { task };
    if (task === "review") body.file = $("#rfile").value;
    S.busy = true; $$("[data-task]").forEach((x) => (x.disabled = true));
    taskOutput(`⏳ ${task}…`);
    try {
      const r = await api("/api/run", body);
      taskOutput(`${r.code === 0 ? "✅" : "❌"} ${task} (code ${r.code})\n\n${r.output}`);
      if (task === "review") { await mergeFromServer(); renderAll(); taskOutput(`${r.code === 0 ? "✅" : "❌"} ${task} (code ${r.code})\n\n${r.output}`); }
    } catch (e) { taskOutput(`❌ ${e.message}`); }
    S.busy = false; $$("[data-task]:not([data-off])").forEach((x) => (x.disabled = false));
  }));
}

/* ---------- AI dialog: regenerate one / a selection, generate, rebuild a category ---------- */
const PRESETS = [
  "Corriger les problèmes signalés et lever toute ambiguïté.",
  "Équilibrer la longueur des options pour que la bonne réponse ne se remarque pas.",
  "Rendre la question plus difficile (une étape de raisonnement en plus).",
  "Rendre la question plus accessible, sans la rendre évidente.",
  "Ajouter une justification claire pour chaque option.",
];
const REBUILD_NOTE = "Lot de remplacement complet pour cette catégorie : couvrez toutes les compétences autorisées de manière équilibrée et répartissez les difficultés ; n'imitez pas les questions existantes listées.";
function aiPrompt(o) {
  const instruction = o.instruction || "";
  if (o.kind === "revise") {
    const originals = o.ids.map((id) => allApproved().find((x) => x.id === id)).filter(Boolean);
    return R.fillTemplate(PROMPTS.revise, {
      INSTRUCTION: instruction || "Corriger les problèmes signalés et améliorer la clarté, sans changer ce qui fonctionne.",
      SCHEMA_JSON: JSON.stringify(SCHEMA),
      ITEMS_JSON: JSON.stringify(originals.map((x) => R.revisionContext(SCHEMA, x)), null, 1),
    });
  }
  const now = nowIso();
  return R.fillTemplate(PROMPTS.generate, {
    CATEGORY: o.category, COUNT: String(o.count), SKILLS: catRules(o.category).skills.join(", "), DIFFICULTY_MIX: "", LANGUAGE: "fr",
    ID_PREFIX: `${o.category}-chat${now.slice(2, 10).replace(/-/g, "")}${now.slice(11, 13)}${now.slice(14, 16)}`, NOW_ISO: now,
    EXTRA_INSTRUCTIONS: [o.kind === "rebuild" ? REBUILD_NOTE : "", instruction].filter(Boolean).join(" ") || "(aucune)",
    EXISTING_TOPICS: (S.approved[o.category] || []).map((x) => `- ${x.prompt}`).join("\n") || "(aucun)",
    SCHEMA_JSON: JSON.stringify(SCHEMA),
  });
}
function openAi(o) {
  const dlg = $("#aidlg");
  const kind = o.kind;
  const server = S.mode === "server" && S.aiConfigured;
  const title = kind === "revise" ? `Régénérer ${o.ids.length} question(s) avec l'IA` : kind === "rebuild" ? "Reconstruire une catégorie avec l'IA" : "Générer de nouvelles questions avec l'IA";
  const intro = kind === "revise"
    ? "Chaque question est renvoyée au modèle avec les problèmes détectés et votre consigne. Les versions proposées arrivent dans la file de relecture comme <strong>révisions</strong> : rien ne change dans la banque tant que vous ne les approuvez pas."
    : kind === "rebuild"
      ? "Le modèle produit un nouveau lot complet pour la catégorie. Approuvez les questions que vous gardez dans la file de relecture, puis retirez les anciennes dans la banque (sélection puis « Retirer »)."
      : "Le modèle produit de nouveaux candidats, qui arrivent dans la file de relecture.";
  dlg.innerHTML = `<form method="dialog" class="dlg">
    <div class="detailhead"><h2>${esc(title)}</h2><button class="btn ghost" value="close" aria-label="Fermer">✕</button></div>
    <p class="msg note">${intro}</p>
    ${kind === "revise" ? `<p class="mono" style="margin:var(--s2) 0">${esc(o.ids.join(", "))}</p>` : `<div class="actions" style="margin:var(--s3) 0"><label class="field"><span>Catégorie</span><select id="ai-cat">${CATS.map((c) => `<option value="${c}" ${c === (o.category || $("#bcat").value) ? "selected" : ""}>${esc(CAT_LABEL[c])}</option>`).join("")}</select></label><label class="field"><span>Nombre</span><input type="number" id="ai-count" min="1" max="50" value="${kind === "rebuild" ? 10 : 5}" style="width:6rem"></label></div>`}
    <label class="field"><span>Consigne pour le modèle (facultative)</span><textarea id="ai-instr" placeholder="Ex. : rendre les distracteurs plus plausibles"></textarea></label>
    <div class="chips" style="margin:var(--s2) 0">${PRESETS.map((p, i) => `<button type="button" class="chip info" data-preset="${i}">${esc(p)}</button>`).join("")}</div>
    ${server ? `<div class="actions" style="margin:var(--s3) 0"><button type="button" class="btn" id="ai-run">Lancer avec l'IA</button><span class="chip">Revue IA aveugle lancée automatiquement ensuite</span></div><pre class="cmd" id="ai-out" hidden></pre>`
      : `<div class="msg ${S.mode === "server" ? "warning" : "note"}">${S.mode === "server" ? "Aucune API configurée dans <code>.env</code> : utilisez le copier-coller ci-dessous." : "Mode hors ligne : copiez le prompt dans votre chat IA (ChatGPT, Claude, Gemini, Le Chat…), puis collez sa réponse JSON."}</div>`}
    <details ${server ? "" : "open"} style="margin-top:var(--s3)"><summary>Copier-coller avec un chat IA</summary>
      <div class="actions" style="margin:var(--s2) 0"><button type="button" class="btn secondary" id="ai-copy">Copier le prompt</button><small id="ai-size"></small></div>
      <textarea id="ai-prompt" readonly class="mono" style="min-height:6rem"></textarea>
      <label class="field" style="margin-top:var(--s3)"><span>Réponse JSON du chat</span><textarea id="ai-answer" class="mono" placeholder="[ { ... } ]" style="min-height:6rem"></textarea></label>
      <div class="actions" style="margin-top:var(--s2)"><button type="button" class="btn" id="ai-import">Importer dans la file de relecture</button></div>
      <div id="ai-msgs" class="msgs" style="margin-top:var(--s2)"></div>
    </details>
  </form>`;
  const params = () => ({ ...o, instruction: $("#ai-instr").value.trim(), category: $("#ai-cat")?.value || o.category, count: Math.min(50, Math.max(1, Number($("#ai-count")?.value) || 5)) });
  const refreshPrompt = () => { const t = aiPrompt(params()); $("#ai-prompt").value = t; $("#ai-size").textContent = `${Math.round(t.length / 1000)} k caractères`; };
  dlg.oninput = (e) => { if (["ai-instr", "ai-cat", "ai-count"].includes(e.target.id)) refreshPrompt(); };
  dlg.onchange = dlg.oninput;
  $$("[data-preset]", dlg).forEach((b) => (b.onclick = () => { const t = $("#ai-instr"); t.value = [t.value.trim(), PRESETS[Number(b.dataset.preset)]].filter(Boolean).join(" "); refreshPrompt(); }));
  $("#ai-copy").onclick = async () => {
    const t = $("#ai-prompt");
    try { await navigator.clipboard.writeText(t.value); } catch (e) { t.select(); document.execCommand("copy"); }
    toast("Prompt copié");
  };
  $("#ai-import").onclick = () => importAiAnswer(params());
  if ($("#ai-run")) $("#ai-run").onclick = () => runAi(params());
  refreshPrompt();
  if (!dlg.open) dlg.showModal();
}
function importAiAnswer(o) {
  const msgs = $("#ai-msgs");
  let data;
  try { data = R.extractJson($("#ai-answer").value); } catch (e) { msgs.innerHTML = `<div class="msg error">JSON illisible : ${esc(e.message)}</div>`; return; }
  const originals = o.kind === "revise" ? o.ids.map((id) => allApproved().find((x) => x.id === id)).filter(Boolean) : [];
  const { items, problems } = R.prepareCandidates(data, { mode: o.kind === "revise" ? "revise" : "new", originals, now: nowIso(), language: "fr" });
  if (!items.length) { msgs.innerHTML = problems.map((p) => `<div class="msg error">${esc(p)}</div>`).join("") || `<div class="msg error">Aucun item exploitable.</div>`; return; }
  if (o.kind === "revise") S.bankSel.clear();
  const file = `chat-${o.kind === "revise" ? "revise" : o.category}-${stamp()}.json`;
  addCandidates(file, items, null, true);
  const bad = items.filter((x) => checks(x).errors.length).length;
  S.sel.queue = `${file}::${items[0].id}`;
  persist(); renderAll(); setTab("queue");
  $("#aidlg").close();
  toast(`${items.length} item(s) importé(s)${bad ? `, dont ${bad} avec erreurs à corriger` : ""}${problems.length ? ` · ${problems.length} avertissement(s)` : ""}`);
}
async function runAi(o) {
  if (S.busy) return toast("Une tâche est déjà en cours.");
  const out = $("#ai-out");
  const body = o.kind === "revise" ? { task: "revise", ids: o.ids, instruction: o.instruction } : { task: o.kind, category: o.category, count: o.count, instruction: o.instruction };
  S.busy = true; $("#ai-run").disabled = true; out.hidden = false; out.textContent = "⏳ Appel du modèle puis revue aveugle… (cela peut prendre une minute)";
  try {
    const r = await api("/api/run", body);
    out.textContent = `${r.code === 0 ? "✅" : "❌"} code ${r.code}\n\n${r.output}`;
    if (r.code === 0) {
      const fresh = (await mergeFromServer())[0];
      if (fresh) { const first = S.cands.find((c) => c.file === fresh); if (first) S.sel.queue = first.key; }
      if (o.kind === "revise") S.bankSel.clear();
      renderAll(); setTab("queue"); $("#aidlg").close();
      toast("Nouveaux candidats dans la file de relecture");
    }
  } catch (e) { out.textContent = `❌ ${e.message}`; }
  S.busy = false; if ($("#ai-run")) $("#ai-run").disabled = false;
}

/* ---------- Shell ---------- */
function renderAll() {
  renderQueue(); renderDetail(); renderBank(); renderBankDetail(); renderExport();
  $("#queuecount").textContent = S.cands.filter((c) => !c.decision).length;
}
function setTab(t) {
  S.tab = t;
  $$("[data-tab]").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.tab === t)));
  $$(".view").forEach((v) => v.classList.toggle("active", v.id === `v-${t}`));
}
async function init() {
  if (!R || !SCHEMA.allOf) { document.body.innerHTML = `<p class="empty">Données d'administration absentes : lancez <code>npm run build:bank</code>.</p>`; return; }
  const catOpts = CATS.map((c) => `<option value="${c}">${esc(CAT_LABEL[c])}</option>`).join("");
  $("#qcat").insertAdjacentHTML("beforeend", catOpts); $("#bcat").insertAdjacentHTML("beforeend", catOpts); $("#newcat").innerHTML = catOpts;
  $("#reviewer").value = load("eag-admin-reviewer") || "";
  $("#reviewer").oninput = (e) => store("eag-admin-reviewer", e.target.value.trim());
  const dark = load("eag-admin-dark") ?? matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  $("#theme").onclick = () => { const d = document.documentElement.dataset.theme !== "dark"; document.documentElement.dataset.theme = d ? "dark" : "light"; store("eag-admin-dark", d); };
  $$("[data-tab]").forEach((b) => (b.onclick = () => setTab(b.dataset.tab)));
  $("#queue").onclick = (e) => { const b = e.target.closest("[data-key]"); if (b) { S.sel.queue = b.dataset.key; renderQueue(); renderDetail(); } };
  $("#bank").onclick = (e) => {
    const sel = e.target.closest("[data-sel]");
    if (sel) { if (sel.checked) S.bankSel.add(sel.dataset.sel); else S.bankSel.delete(sel.dataset.sel); renderBulkBar(); return; }
    const b = e.target.closest("[data-bid]"); if (b) { S.sel.bank = b.dataset.bid; S.bankDraft = null; renderBank(); renderBankDetail(); }
  };
  $("#bulkbar").onclick = (e) => { const b = e.target.closest("[data-bulk]"); if (b) bulkAction(b.dataset.bulk); };
  $("#aigen").onclick = () => openAi({ kind: "generate" });
  $("#airebuild").onclick = () => openAi({ kind: "rebuild" });
  ["#qcat", "#qstate", "#qai"].forEach((s) => ($(s).onchange = renderQueue));
  ["#bcat", "#bdiff"].forEach((s) => ($(s).onchange = renderBank));
  $("#bsearch").oninput = renderBank;
  $("#newitem").onclick = () => newItem($("#newcat").value);
  $("#files").onchange = (e) => { readFiles([...e.target.files]); e.target.value = ""; };
  const drop = $("#drop");
  drop.ondragover = (e) => { e.preventDefault(); drop.classList.add("over"); };
  drop.ondragleave = () => drop.classList.remove("over");
  drop.ondrop = (e) => { e.preventDefault(); drop.classList.remove("over"); readFiles([...e.dataTransfer.files]); };

  setApproved(APPROVED_EMBEDDED);
  if (await detectServer()) {
    $(".brand small").textContent = "Mode local (npm run admin) · lecture et écriture dans le dépôt";
    $("#drop").innerHTML = `<strong>Candidats chargés depuis <code>generated/</code></strong><span>Utilisez l'onglet Exporter pour générer ou relire de nouveaux lots.</span>`;
  } else {
    const saved = load(STORE_KEY);
    if (saved && (saved.cands?.length || saved.log?.length)) {
      const b = $("#restore");
      b.hidden = false; b.textContent = `Reprendre la session du ${new Date(saved.savedAt).toLocaleString("fr-FR")}`;
      b.onclick = () => { restore(saved); b.hidden = true; toast("Session restaurée"); };
    }
  }
  renderAll();
}
init();
