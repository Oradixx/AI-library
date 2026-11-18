"""Enrichit data/outils.json : statut des liens, image de partage et logo.

Écrit data/medias.json : {slug: {"status": code HTTP ou 0, "image": url, "logo": url, "verifie": "AAAA-MM-JJ"}}.
Pas d'image pour les skills, sauf les coups de cœur. Les lectures gardent l'image de leur page.
Bibliothèque standard uniquement. Usage : python3 scripts/enrich.py
"""
import concurrent.futures as cf
import datetime as dt
import html
import json
import re
import urllib.parse as up
import urllib.request as ur
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = json.loads((ROOT / "data/outils.json").read_text())
RAYONS = json.loads((ROOT / "data/rayons.json").read_text())
SANS_IMAGE = {t for r in RAYONS if r["nom"] == "Skills" for t in r["themes"]}
UA = {"User-Agent": "Mozilla/5.0 (AI-library link checker; +https://github.com/Oradixx/AI-library)"}
TODAY = dt.date.today().isoformat()


def meta(page, base):
    """Cherche og:image / twitter:image et l'icône dans le HTML."""
    def absu(u):
        return up.urljoin(base, html.unescape(u.strip())) if u else ""
    img = ""
    for prop in ("og:image", "twitter:image", "og:image:url"):
        m = re.search(r'<meta[^>]+(?:property|name)=["\']%s["\'][^>]*content=["\']([^"\']+)' % re.escape(prop), page, re.I) or \
            re.search(r'<meta[^>]+content=["\']([^"\']+)["\'][^>]*(?:property|name)=["\']%s["\']' % re.escape(prop), page, re.I)
        if m:
            img = absu(m.group(1))
            break
    icon = ""
    for m in re.finditer(r'<link[^>]+>', page, re.I):
        tag = m.group(0)
        if re.search(r'rel=["\'][^"\']*(apple-touch-icon|icon)[^"\']*["\']', tag, re.I):
            h = re.search(r'href=["\']([^"\']+)', tag, re.I)
            if h:
                icon = absu(h.group(1))
                if "apple-touch-icon" in tag.lower():
                    break
    return img, icon or up.urljoin(base, "/favicon.ico")


def one(e):
    url, out = e.get("url", ""), {"verifie": TODAY}
    if not url.startswith("http"):
        return e["slug"], None
    want_image = e.get("coeur") or e["theme"] not in SANS_IMAGE
    gh = re.match(r"https://github\.com/([^/#?]+)(?:/([^/#?]+))?", url)
    for _ in range(2):  # un second essai pour les délais dépassés
        try:
            req = ur.Request(url, headers=UA)
            with ur.urlopen(req, timeout=15) as r:
                out["status"] = r.status
                final = r.geturl()
                page = r.read(400_000).decode("utf-8", "ignore") if "html" in r.headers.get("Content-Type", "") else ""
            break
        except ur.HTTPError as err:
            out["status"], final, page = err.code, url, ""
            break
        except Exception:
            out["status"], final, page = 0, url, ""
    if gh:
        owner, repo = gh.group(1), gh.group(2)
        out["logo"] = f"https://github.com/{owner}.png?size=64"
        if want_image and repo:
            out["image"] = f"https://opengraph.githubassets.com/1/{owner}/{repo}"
    elif page:
        img, icon = meta(page, final)
        out["logo"] = icon
        if want_image and img:
            out["image"] = img
    if e["theme"] in SANS_IMAGE and not e.get("coeur"):
        out.pop("logo", None)
    return e["slug"], out


def main():
    res = {}
    with cf.ThreadPoolExecutor(24) as pool:
        for slug, out in pool.map(one, DATA):
            if out:
                res[slug] = out
    (ROOT / "data/medias.json").write_text(json.dumps(res, ensure_ascii=False, indent=1))
    morts = [s for s, o in res.items() if o.get("status", 0) >= 400 or o.get("status") == 0]
    print(f"{len(res)} liens vérifiés, {sum('image' in o for o in res.values())} images, {len(morts)} liens en échec")
    (ROOT / "data/liens-en-echec.txt").write_text("\n".join(sorted(morts)) + "\n")


if __name__ == "__main__":
    main()
