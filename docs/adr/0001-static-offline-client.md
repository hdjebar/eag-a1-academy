# ADR-0001 : Application cliente 100 % statique, sans serveur et respectueuse de la vie privée

## Statut
Accepté

## Date
2026-09-30

## Contexte
L'application s'adresse à des candidats préparant l'Épreuve d'Aptitude Générale (EAG) du groupe de traitement A1 pour la fonction publique luxembourgeoise. Les candidats préparent un concours officiel et requièrent :
- Une discrétion et une confidentialité totales (aucune donnée de progression, temps ou taux d'échec ne doit être transmise ou journalisée sur un serveur tiers).
- Une accessibilité maximale (capacité d'utiliser l'application sur un poste professionnel, une tablette ou une machine personnelle sans installer d'environnement complexe, de dépendances Node.js ni de conteneur Docker).
- Une pérennité technique (l'application doit pouvoir fonctionner des années sans maintenance de serveurs d'arrière-plan).

## Décision
1. Construire l'interface sous forme de page web unique (SPA) reposant exclusivement sur **HTML5 sémantique, Vanilla CSS et JavaScript natif moderne**.
2. N'utiliser aucun framework runtime (ni React, Vue, Next.js ou Tailwind) pour la couche cliente.
3. Ne déployer aucun serveur applicatif backend : tout le cycle de session (chronomètre, tirage aléatoire, calcul de score, débriefing) s'exécute en mémoire vive dans le navigateur de l'utilisateur.
4. N'utiliser aucun cookie, aucun traceur analytics, ni persistance sur `localStorage`/`sessionStorage`.

## Conséquences

### Positives
- **Portabilité absolue** : L'application peut être hébergée sur GitHub Pages, sur un simple serveur statique, ou même ouverte directement depuis le disque dur (`file://`).
- **Garantie de confidentialité** : L'absence physique de serveur et de requêtes sortantes offre une garantie cryptographique et opérationnelle de respect de la vie privée des candidats.
- **Performance instantanée** : Temps de chargement inférieur à 50 ms, absence de surcharge d'hydratation ou de recalcul de Virtual DOM.
- **Maintenance zéro** : Aucun risque de panne d'infrastructure serveur, coût d'exploitation nul.

### Négatives / Compromis
- Les sessions ne sont pas synchronisées entre plusieurs appareils.
- Recharger la page réinitialise la progression de la visite en cours.
- L'enrichissement de contenu doit être préparé en amont via les outils de build du dépôt.
