---
name: chercher-library
description: Cherche des outils dans AI library (https://oradixx.github.io/AI-library/), une bibliothèque française d'environ 800 outils IA triés par rayon et par coût d'accès (agents, modèles locaux, API et offres gratuites ou étudiantes, hébergement, outils dev, design, skills, lectures). À utiliser quand l'utilisateur demande un outil pour un besoin, une alternative gratuite, une offre étudiante, une skill, un MCP ou une lecture sur l'IA, ou dit « cherche dans la library », « qu'est-ce que j'ai sur… », « trouve-moi un outil pour… ».
---

# Chercher dans AI library

La bibliothèque est publique et statique. Deux fichiers suffisent :

- `https://oradixx.github.io/AI-library/llms-full.txt` : index compact, une ligne par outil, rangé par rayon puis par thème
  (nom, accroche, tarifs, lien, slug). Environ 40 000 tokens.
- `https://oradixx.github.io/AI-library/data/outils.json` : fiches complètes (description, cas d'usage, offre, licence, tags).
  Trop gros pour être lu en entier : on le filtre.

Si le dépôt AI-library est ouvert en local, lis `data/outils.json` directement plutôt que de le télécharger.

## Méthode

1. Reformule le besoin en mots-clés, en français et en anglais (les fiches sont en français, les noms souvent en anglais),
   et repère les contraintes : tarif (Gratuit, Open source, Étudiant, Crédits, Essai, Freemium, Payant), plateforme, rayon.
2. Cherche large dans les fiches complètes, sans tenir compte des accents :

   ```sh
   curl -s https://oradixx.github.io/AI-library/data/outils.json -o /tmp/ai-library.json
   python3 - /tmp/ai-library.json "mot1|mot2" <<'EOF'
   import json, re, sys, unicodedata
   n = lambda s: unicodedata.normalize("NFD", str(s)).encode("ascii", "ignore").decode().lower()
   pat = re.compile(n(sys.argv[2]))
   for o in json.load(open(sys.argv[1])):
       if o.get("statut") == "Écarté":
           continue
       texte = " ".join(str(o.get(k, "")) for k in ("nom", "theme", "description", "accroche", "usage", "offre", "tags"))
       if pat.search(n(texte)):
           print(f'{o["slug"]} | {o["nom"]} | {o["theme"]} | {", ".join(o.get("tarif", []))} | {o.get("accroche", "")}')
   EOF
   ```

   Avec `jq` : `jq -r '.[] | select(.statut != "Écarté") | select((.nom+" "+.description+" "+.accroche) | test("mot1|mot2"; "i")) | "\(.slug) | \(.nom) | \(.tarif|join(", "))"' /tmp/ai-library.json`.
3. Si la recherche par mots ne donne rien de net, lis la section du thème concerné dans `llms-full.txt` : le rangement par
   rayon et par thème fait souvent ressortir ce que les mots-clés ratent.
4. Pour les 3 à 8 meilleurs candidats, lis la fiche complète (`select(.slug == "…")`) : `offre` donne les limites réelles
   (quotas, cartes demandées, conditions), `usage` les cas concrets.

## Réponse

- Une courte liste, la plus pertinente d'abord : nom, une phrase sur pourquoi il répond au besoin, tarif et limite qui compte,
  lien officiel (`url`) et fiche `https://oradixx.github.io/AI-library/#outil=<slug>`.
- Signale ce qui manque si rien ne convient vraiment, plutôt que de forcer un résultat.
- Les cas d'usage et accroches ont été rédigés avec une IA et les offres gratuites changent souvent : conseille de vérifier
  sur le site officiel avant de compter sur un quota.
- Ne présente pas les outils écartés (`"statut": "Écarté"`) sauf si l'utilisateur le demande.
