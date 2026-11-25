"""Génère une petite page de partage par outil : outil/<slug>/index.html.

Chaque page porte un titre, une description et une image de partage (aperçu sur X, Slack, etc.),
puis redirige vers la fiche dans la bibliothèque (#outil=<slug>). Usage : python3 scripts/pages.py

Génère aussi la version pour les agents : llms.txt, llms-full.txt (une ligne par outil)
et skills/chercher-library.zip (la skill à télécharger depuis agents.html).
"""
import html
import json
import shutil
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BASE = "https://oradixx.github.io/AI-library/"
DATA = json.loads((ROOT / "data/outils.json").read_text())
RAYONS = json.loads((ROOT / "data/rayons.json").read_text())
MEDIAS = json.loads((ROOT / "data/medias.json").read_text()) if (ROOT / "data/medias.json").exists() else {}

PAGE = """<!doctype html>
<html lang="fr"><head><meta charset="utf-8">
<title>{titre} — AI library</title>
<meta name="description" content="{desc}">
<meta property="og:title" content="{titre}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{url}">
{image}<meta name="twitter:card" content="{card}">
<link rel="canonical" href="{fiche}">
<meta name="theme-color" content="#2b1d16">
<style>html{{background:#2b1d16;color:#efe7da;font-family:sans-serif}}a{{color:#e9c46a}}</style>
<meta http-equiv="refresh" content="0; url={fiche}">
</head><body><p><a href="{fiche}">Ouvrir la fiche {titre}</a></p></body></html>
"""


LLMS = """# AI library

> Bibliothèque française d'environ {n} outils IA : agents, modèles, API et offres gratuites ou étudiantes, hébergement,
> outils pour construire, design, skills et lectures. Chaque outil a une fiche : description, cas d'usage, offre réelle
> (quotas, conditions), licence et tarifs (Gratuit, Open source, Étudiant, Crédits, Essai, Freemium, Payant).

Les cas d'usage ont été rédigés avec une IA et les offres gratuites changent souvent : vérifier sur le site officiel.
Fiche d'un outil pour un humain : {base}#outil=<slug>.

## Données

- [Index compact]({base}llms-full.txt) : une ligne par outil, rangé par rayon et par thème (environ 40 000 tokens).
- [Fiches complètes]({base}data/outils.json) : JSON, un objet par outil (slug, nom, theme, url, liens, tarif, description,
  accroche, usage, offre, licence, tags). Gros fichier : le filtrer plutôt que le lire en entier.
- [Rayons et thèmes]({base}data/rayons.json)

## Rayons

{rayons}

## Pour les agents

- Skill chercher-library : méthode de recherche dans la bibliothèque. Installation :
  `npx skills add Oradixx/AI-library --skill chercher-library -g`, ou [le zip]({base}skills/chercher-library.zip)
  pour claude.ai. Mode d'emploi : {base}agents.html
"""


def llms():
    actifs = [e for e in DATA if e.get("statut") != "Écarté"]
    rayons = "\n".join(f"- {r['nom']} : {', '.join(r['themes'])}" for r in RAYONS)
    (ROOT / "llms.txt").write_text(LLMS.format(n=len(actifs), base=BASE, rayons=rayons))
    lignes = [f"# AI library : index complet ({len(actifs)} outils)", "",
              "Format : Nom — accroche. Tarifs. Lien officiel. (slug, fiche complète dans data/outils.json)", ""]
    for r in RAYONS:
        lignes.append(f"## {r['nom']}")
        for t in r["themes"]:
            outils = sorted((e for e in actifs if e["theme"] == t), key=lambda e: e["nom"].lower())
            if not outils:
                continue
            lignes += ["", f"### {t}", ""]
            for e in outils:
                accroche = (e.get("accroche") or e.get("description") or "").rstrip(".")
                tarif = ", ".join(e.get("tarif") or []) or "tarif non précisé"
                lien = f" {e['url']}" if e.get("url") else ""
                lignes.append(f"- {e['nom']} — {accroche}. {tarif}.{lien} ({e['slug']})")
        lignes.append("")
    (ROOT / "llms-full.txt").write_text("\n".join(lignes))


def skill_zip():
    # Date fixe : le zip ne change que si la skill change, sans commit inutile de l'Action.
    src = ROOT / "skills/chercher-library"
    with zipfile.ZipFile(ROOT / "skills/chercher-library.zip", "w", zipfile.ZIP_DEFLATED) as z:
        for f in sorted(src.rglob("*")):
            if f.is_file():
                info = zipfile.ZipInfo(f"chercher-library/{f.relative_to(src)}", (2026, 1, 1, 0, 0, 0))
                info.compress_type = zipfile.ZIP_DEFLATED
                z.writestr(info, f.read_bytes())


def main():
    out = ROOT / "outil"
    if out.exists():
        shutil.rmtree(out)
    for e in DATA:
        img = (MEDIAS.get(e["slug"]) or {}).get("image") or e.get("image_post") or ""
        page = PAGE.format(
            titre=html.escape(e["nom"]),
            desc=html.escape(e.get("accroche") or e.get("description") or "Fiche de la bibliothèque AI library"),
            url=f"{BASE}outil/{e['slug']}/",
            fiche=f"{BASE}#outil={e['slug']}",
            image=f'<meta property="og:image" content="{html.escape(img)}">\n' if img else "",
            card="summary_large_image" if img else "summary",
        )
        d = out / e["slug"]
        d.mkdir(parents=True)
        (d / "index.html").write_text(page)
    print(f"{len(DATA)} pages de partage générées dans outil/")
    llms()
    skill_zip()
    print("llms.txt, llms-full.txt et skills/chercher-library.zip générés")


if __name__ == "__main__":
    main()
