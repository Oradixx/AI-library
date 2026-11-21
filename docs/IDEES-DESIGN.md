# Idées de design

## Réalisé dans la refonte « Reliure toilée » (branche `refonte`)

- **Étagère remplie sur PC** : l'épaisseur de chaque livre suit le nombre d'outils du rayon, et les livres remplissent la planche jusqu'à la pile. Les trois plus gros volumes portent une pièce de titre en cuir.
- **Pile de livres couchés et montant** : « Coups de cœur », « Nouveautés » et « Proposer un outil » sont posés sur deux volumes de fond, contre un vrai montant à droite. La planche est continue. Sur téléphone, la pile passe sur un second étage.
- **Couleurs des livres couchés** : proches des toiles des rayons, sans effet « bouton ». On les tire vers la gauche au survol.
- **Champ `lot`** dans `data/outils.json` : le plus grand lot = « Nouveautés » (lot 2 = signets du commit `8a30266`).
- **Titre** : sous-texte retiré. Le nom est en laiton (Alfa Slab One) posé sur le dessus du meuble, en deux pièces soudées : « AI » à plat, « library » en biais sur le pied du l et la boucle du y. Le relief suit le point de fuite du meuble (`logo.js`). Essais écartés : petites capitales posées une à une, un seul bloc avec trait d'union (le I-l se lisait H) ou traverse au pied (le I se lisait L), polices sans empattements (les fûts se collent).

Le système visuel est décrit dans `DESIGN.md`.

## Historique des pistes

Pistes testées puis retirées avant la refonte, gardées pour mémoire.

### Remplir l'espace vide à droite de l'étagère (PC)

Constat : sur grand écran, les 8 livres s'arrêtaient vers le milieu de la planche et la droite de la page paraissait vide.

Tentatives :
1. **Tomes par sous-thème** (commit `abf2068`, annulé) : un tome fin par sous-thème à côté de chaque grand livre, avec des largeurs fluides pour remplir toute la planche. Rejeté : trop chargé, l'étagère n'avait pas besoin d'être remplie à tout prix.
2. **Pile de livres couchés + montant d'étagère** (commit `3fb2249`, annulé) : idée retenue, mais rendu jugé peu esthétique (pile trop basse, livres couchés trop longs et trop épais, montant peu crédible, couleurs « bouton »). Reprise et réalisée dans la refonte.

### Titre stylisé

Testé (commit `3fb2249`, annulé) : enseigne bleu nuit, lettres dorées et double filet comme les dos de livres. Jugé peu esthétique.

Piste non retenue : un tampon de bibliothèque à l'encre bleue, légèrement incliné. Dans la refonte, une corniche frappée au fer a aussi été essayée, puis écartée au profit des lettres en relief.
