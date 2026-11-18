"""Génère une petite page de partage par outil : outil/<slug>/index.html.

Chaque page porte un titre, une description et une image de partage (aperçu sur X, Slack, etc.),
puis redirige vers la fiche dans la bibliothèque (#outil=<slug>). Usage : python3 scripts/pages.py
"""
import html
import json
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BASE = "https://oradixx.github.io/AI-library/"
DATA = json.loads((ROOT / "data/outils.json").read_text())
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
<meta http-equiv="refresh" content="0; url={fiche}">
</head><body><p><a href="{fiche}">Ouvrir la fiche {titre}</a></p></body></html>
"""


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


if __name__ == "__main__":
    main()
