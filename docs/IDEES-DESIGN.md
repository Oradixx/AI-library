# Idées de design à reprendre

Pistes testées puis retirées : l'idée plaît, mais le rendu n'était pas encore au niveau. À retravailler avant de les remettre.

## Remplir l'espace vide à droite de l'étagère (PC)

Constat : sur grand écran, les 8 livres s'arrêtent vers le milieu de la planche et la droite de la page paraît vide.

Tentatives :
1. **Tomes par sous-thème** (commit `abf2068`, annulé) : un tome fin par sous-thème à côté de chaque grand livre, largeurs fluides pour remplir toute la planche. Rejeté : trop chargé, l'étagère n'avait pas besoin d'être remplie à tout prix.
2. **Pile de livres couchés + montant d'étagère** (commit `de2b6d2`, annulé) : après les livres debout, trois livres couchés servant de raccourcis (« Coups de cœur », « Nouveautés », « Proposer un outil »), puis un montant vertical qui termine la planche. Idée retenue, rendu jugé peu esthétique.

À retravailler pour la piste 2 :
- proportions de la pile (livres couchés trop longs et trop épais par rapport aux livres debout, pile trop basse) ;
- montant d'étagère plus crédible (épaisseur, bois, raccord avec la planche) ;
- couleurs des livres couchés plus proches des rayons, moins « bouton » ;
- « Nouveautés » demande un champ `lot` (numéro d'import) dans `data/outils.json` : le plus grand lot = derniers ajouts.

## Titre stylisé

Le sous-texte sous « AI library » est à retirer.

Testé (commit `de2b6d2`, annulé) : enseigne bleu nuit, lettres dorées et double filet comme les dos de livres. Jugé peu esthétique en l'état.

Autres pistes non testées :
- lettres en relief posées debout sur l'étagère, comme des lettres décoratives à côté des livres ;
- tampon de bibliothèque à l'encre bleue, légèrement incliné, façon fiche de prêt.
