---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: ["app.js","style.css"]
---

# Accueil (index.html)

Scope: home page of AI library, including rayon view, search results, Nouveautés view and the fiche dialog it opens. Mode: Operate (browse, search, filter, open a fiche). Build path: code-led.

Audience and job: French speakers curious about AI tools, often on phone from a shared link; they browse a rayon, search, filter by access cost, open a fiche and follow the tool link.

Constraints: static, no build, `app.js` filter behaviour kept (hash state, combined price filters = one section per price, rarest first), `outil/<slug>/` URLs unchanged, all text French, no subtitle under the title.

## Direction contract

THESIS: The home is a real bookcase in a binder's room: the 8 rayons are buckram volumes on a walnut shelf, closed on the right by a stack of lying shortcut books against a true upright. It refuses the directory pattern (centered search hero over a grid of category cards).

OWN-WORLD: Dark walnut room (wall #2b1d16, carcass #5a3a24, shelf lip #7a5233), saturated buckram spines (vermilion, ultramarine, bottle green, slate blue, olive, wine, navy, tobacco) with woven texture, hot-foil gold (#d8a63c) small-caps titles and double filets on spines only, pale linen text (#efe7da). Alegreya Sans SC stamps titles, Alegreya Sans reads. Lists are shelf-lists: rows hanging off one rail, counts as tabular figures.

STORY: The visitor sees the whole collection at a glance, sizes included (spine thickness = tool count), pulls a volume to open its rayon, or a lying book for Coups de cœur, Nouveautés or Proposer un outil, narrows with search and price chips, opens a fiche, leaves with the right link.

FIRST VIEWPORT: Desktop 1440: header row (gold small-caps "AI library" left, update date and "Code source" right); bookcase ~440px tall across the full content width: 8 spines left to right, the lying stack flush right against the upright, which caps the shelf; toolbar (search, Gratuit, Étudiant, Open source, Crédits offerts, Plus de filtres) under the case; first rayon heading visible. Phone 390: same order, spines thinner, the lying stack on a second, lower shelf of the same case. Primary action: pulling a spine.

FORM: Reliure toilée, my grounded list position 1 (taken as IMPECCABLE'S PICK over the rolled Signalétique de médiathèque). seed:165ceee29d173779. Signature interaction: a spine slides up out of the row on hover/focus and stays pulled while its rayon is open, the others step back; 180ms exponential ease-out, none under reduced motion.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved
- `lot` field derived from git history (lot 1 = initial 728 entries, lot 2 = the 35 of commit 8a30266); future imports must increment it.
