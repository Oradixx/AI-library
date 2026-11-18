# AI library

Bibliothèque en ligne d'outils tech, design et agents IA, d'API et de routeurs, d'hébergements, d'offres gratuites et étudiantes, de skills et de lectures : https://oradixx.github.io/AI-library/

## Organisation

- 8 rayons (Agents, Modèles, API et offres, Héberger, Construire, Design, Skills, Lire et apprendre), définis dans `data/rayons.json`. Chaque rayon regroupe des sous-thèmes.
- Page d'accueil : 3 coups de cœur par rayon (`"coeur": true` dans les données).
- Fiche par outil : description, cas d'usage, offre, liens d'accès, outils du même sous-thème. Lien direct : `#outil=<slug>`, ou la page de partage `outil/<slug>/` (aperçu avec image sur X, Slack…).
- Les outils écartés sont masqués par défaut (« Plus de filtres »).

## Collecte

- Source principale : les signets X, du plus récent au plus ancien déjà traité.
- Quand un signet cite un article, ou cite un post qui mène à un article, on lit aussi l'article et on en tire les outils et références.
- Images : bannière pour les articles et lectures, image du site ou carte GitHub pour les outils, jamais pour les skills (sauf coups de cœur).
- Aucune information personnelle dans les fiches.

## Données

- `data/outils.json` : un objet par outil (`slug`, `nom`, `theme`, `url`, `tarif`, `statut`, `description`, `accroche`, `usage`, `offre`, `licence`, `tags`, `source`, `post`, `coeur`, `image_post`).
- `data/medias.json` : état des liens, images de partage et logos, produits par `scripts/enrich.py`.
- `data/liens-en-echec.txt` : liens qui ne répondaient pas lors de la dernière vérification.

Les cas d'usage et les accroches ont été rédigés avec une IA à partir des notes : à relire avant de s'y fier.

## Scripts

- `python3 scripts/enrich.py` : vérifie les liens, récupère images et logos (bibliothèque standard Python uniquement).
- `python3 scripts/pages.py` : régénère les pages de partage `outil/<slug>/`.
- La GitHub Action `verifier.yml` lance les deux le 1er de chaque mois et à chaque modification des données.

## Développement local

```sh
python3 -m http.server
# puis http://localhost:8000
```

Pas d'étape de build : `index.html`, `style.css` et `app.js` suffisent.
