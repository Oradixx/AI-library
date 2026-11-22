# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
- **Primary: people curious about AI tools**, French speakers who arrive from a shared link (`outil/<slug>/` preview on X, Slack…) or from the home page. They want to browse a theme, find a tool for a need, or check whether something has a free or student offer. When needs conflict, this visitor's browsing and discovery come first.
- **Secondary: the owner**, who curates the library and uses it to find again a tool saved months ago (search, price filters, direct links).
- Used on phone (often from a link opened in an X or Slack app) and on desktop.

## Product Purpose
A public French library of about 760 AI-related tools: agents, models, APIs and offers, hosting, build tools, design, skills, and reading material. It turns scattered bookmarks and notes into a catalog that can be browsed by theme, searched, and filtered by price. Success: a visitor opens a shelf, understands at a glance what is there, and leaves with a tool worth trying and the right link to it.

## Positioning
A hand-picked, organized catalog in French, not an exhaustive directory. Its tone is neutral: it presents tools and their offers factually. The owner's personal verdicts (`statut`: Noté, À tester, À lire, Écarté) are working metadata that stays in the background; rejected tools are hidden by default. What it offers that a neighboring directory lacks: sorting by real access cost (free, open source, student, credits, trial…) and French write-ups with concrete use cases.

## Operating Context
- Collection: X bookmarks (newest first), articles they cite, and notes. Each import adds a batch of entries to `data/outils.json`.
- Proposals from visitors go through a GitHub issue template (`.github/ISSUE_TEMPLATE/outil.yml`, "Proposer un outil").
- A monthly GitHub Action (`verifier.yml`) checks links, fetches images and logos (`scripts/enrich.py`) and regenerates share pages (`scripts/pages.py`).
- Hosted on GitHub Pages: https://oradixx.github.io/AI-library/

## Capabilities and Constraints
- **Library model (keep):** 8 *rayons* (Agents, Modèles, API et offres, Héberger, Construire, Design, Skills, Lire et apprendre) defined in `data/rayons.json`, each a book standing on a shelf, each grouping sub-themes. Every tool has its own page in `outil/<slug>/` and a direct link `#outil=<slug>`.
- **Filters:** search; price chips (Gratuit, Étudiant, Open source, Crédits offerts = Crédits + Essai, Freemium, Payant); with several prices selected, one section per price, rarest first; more filters (provenance, sort, show rejected). The personal `statut` is no longer a visible filter. Filter state lives in the URL hash.
- **Home:** 3 *coups de cœur* per rayon (`"coeur": true`).
- **Shortcuts:** « Coups de cœur », « Nouveautés », « Proposer un outil ». « Nouveautés » shows the highest `lot` (import batch number) in `data/outils.json`: lot 1 = initial catalog, lot 2 = the bookmarks of commit `8a30266`. Each new import must use the next lot number.
- **Technical:** static site, no build step, no framework: `index.html`, `style.css`, `app.js`, JSON data, Python standard-library scripts. Must stay fast and readable on phone and desktop.
- **Language:** all visible text in French.

## Brand Commitments
- Name: « AI library », with no subtitle under the title.
- The library metaphor (shelf, books standing for themes) is binding. The visual world (« Reliure toilée ») is recorded in `DESIGN.md`.
- `docs/IDEES-DESIGN.md` records wanted directions and rejected attempts with reasons; read it before visual work.

## Evidence on Hand
- `data/outils.json`: 763 entries with description, accroche, usage, offre, licence, tags, tarif; 24 coups de cœur.
- `data/medias.json`: link status, share images and logos.
- Use cases and accroches were drafted with AI from notes and are flagged on the site as to be checked. There are no testimonials, audience numbers or partnerships; do not invent any.

## Product Principles
1. The visitor browsing comes first: a shelf must read at a glance, then lead to a tool and its link in few steps.
2. Factual and neutral: describe the tool and its real cost; keep personal verdicts in the background.
3. Access cost is first-class information, never buried.
4. Static and fast: anything that needs a build step or framework is out.
5. The library metaphor carries structure (rayons, books, fiches), not decoration for its own sake.

## Accessibility & Inclusion
No formal standard; careful good practice (readable contrast, keyboard use, labelled controls, respect for reduced motion).
