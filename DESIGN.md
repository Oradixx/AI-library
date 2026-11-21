---
name: AI library
description: A binder's bookcase of AI tools, buckram volumes on a walnut shelf, titles stamped in hot-foil gold.
colors:
  foil-gold: "#d8a63c"
  foil-gold-light: "#e9c46a"
  foil-gold-spine: "#f0d283"
  walnut-wall: "#2b1d16"
  walnut-recess: "#1d130d"
  walnut-carcass: "#5a3a24"
  walnut-lip: "#7a5233"
  walnut-light: "#8a5e3a"
  field-border: "#6e4f36"
  linen: "#efe7da"
  linen-muted: "#cbbba5"
  linen-faint: "#a8937a"
  gold-rule: "rgba(233, 196, 106, 0.22)"
  paper: "#f1ebe0"
  ink: "#2b1d16"
  ink-muted: "#5e4c3c"
  cloth-green: "#2a6034"
  cloth-ultramarine: "#22408f"
  cloth-vermilion: "#9a3019"
  cloth-slate: "#2d5d7b"
  cloth-olive: "#5e5b1f"
  cloth-wine: "#7c2348"
  cloth-navy: "#1f2f4d"
  cloth-tobacco: "#6e3c1c"
  shortcut-garnet: "#8a2b3c"
  shortcut-green: "#2a5444"
  shortcut-blue: "#34417a"
typography:
  display:
    fontFamily: "Alegreya Sans SC, Alegreya Sans, sans-serif"
    fontSize: "clamp(2.5rem, 5.2vw, 4.25rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.03em"
  headline:
    fontFamily: "Alegreya Sans SC, Alegreya Sans, sans-serif"
    fontSize: "2rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "0.03em"
  title:
    fontFamily: "Alegreya Sans SC, Alegreya Sans, sans-serif"
    fontSize: "1.3rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.03em"
  spine:
    fontFamily: "Alegreya Sans SC, Alegreya Sans, sans-serif"
    fontSize: "1.2rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.06em"
  body:
    fontFamily: "Alegreya Sans, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Alegreya Sans, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 500
    lineHeight: 1.3
    fontFeature: "\"tnum\" 1"
rounded:
  spine: "4px 4px 1px 1px"
  lying: "4px 2px 2px 4px"
  field: "4px"
  mark: "6px"
  pill: "999px"
spacing:
  gutter: "44px"
  gutter-tablet: "28px"
  gutter-phone: "16px"
  shelf: "22px"
  shelf-phone: "16px"
  content: "1120px"
  case-height: "380px"
  case-height-tablet: "320px"
  case-height-phone: "196px"
components:
  spine:
    backgroundColor: "{colors.walnut-carcass}"
    textColor: "{colors.foil-gold-spine}"
    typography: "{typography.spine}"
    rounded: "{rounded.spine}"
    padding: "36px 0 34px"
    height: "calc(var(--h) * 380px)"
  lying-book:
    backgroundColor: "{colors.shortcut-garnet}"
    textColor: "{colors.foil-gold-spine}"
    rounded: "{rounded.lying}"
    padding: "0 30px"
    height: "40px"
  chip:
    textColor: "{colors.linen}"
    rounded: "{rounded.pill}"
    padding: "0 17px"
    height: "44px"
  chip-selected:
    backgroundColor: "{colors.foil-gold-light}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 17px"
    height: "44px"
  link-button:
    textColor: "{colors.foil-gold-light}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "40px"
  search-field:
    backgroundColor: "{colors.walnut-recess}"
    textColor: "{colors.linen}"
    rounded: "{rounded.field}"
    padding: "0 16px 0 46px"
    height: "52px"
  fiche:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    width: "580px"
  fiche-button:
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 18px"
    height: "44px"
  fiche-button-primary:
    backgroundColor: "{colors.cloth-ultramarine}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "0 18px"
    height: "44px"
  back-to-top:
    backgroundColor: "{colors.foil-gold-light}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 18px"
    height: "44px"
---

# Design System: AI library

## Overview

**Creative North Star: "Reliure toilée"**

The site is a binder's room at night: a dark walnut wall, one real bookcase, and on its shelf eight buckram volumes, one per rayon. Their titles are stamped in hot-foil gold small caps between double filets, the way a bindery finishes a spine. Everything below the case (search, price chips, shelf-lists of tools) reads as linen text on the same walnut wall, hanging off thin gold rules. A tool's fiche is a sheet of linen paper slid out from the right, headed by a band of its rayon's cloth.

The bookcase is a functional object, not a picture. Spine thickness encodes the number of tools in each rayon; pulling a spine opens it; the lying books against the right-hand upright are the three shortcuts (Coups de cœur, Nouveautés, Proposer un outil). Density is moderate: one large object at the top, then calm lists.

The world explicitly rejects the directory pattern (a centered search hero over a grid of category cards).

**Key Characteristics:**
- One continuous walnut bookcase with a true upright on the right that caps the shelf.
- Buckram spines in saturated cloth colours, woven texture, gold small-caps titles and double filets.
- Spine width proportional to tool count; spine height varies slightly per volume.
- Linen text on walnut for reading; linen paper with dark ink for the fiche.
- Pill-shaped controls outlined in faint gold; gold fill marks the selected state.

## Colors

A dark, warm wood palette lit by one metal (hot-foil gold), with saturated cloth colours that belong to the books alone.

### Primary
- **Hot-Foil Gold** (foil-gold): the site title « AI library », the coup-de-cœur pill, the search focus border. The gold of the room.
- **Pale Foil** (foil-gold-light): rayon headings, selected chips and tabs (as fill, with ink text), link buttons, the focus ring, text selection, the back-to-top button.
- **Spine Foil** (foil-gold-spine): titles and double filets stamped on cloth (spines, lying books, the fiche band, monogram marks). Brighter so it holds contrast on every cloth.

### Secondary: the cloths
- **Rayon cloths** (cloth-green, cloth-ultramarine, cloth-vermilion, cloth-slate, cloth-olive, cloth-wine, cloth-navy, cloth-tobacco): one per rayon, stored as data (`couleur` in `data/rayons.json`), not in the stylesheet. The same value colours the spine, the ribbon bookmark beside the rayon heading, and the fiche band and primary button for tools of that rayon.
- **Shortcut cloths** (shortcut-garnet, shortcut-green, shortcut-blue): the three lying shortcut books, distinct from every rayon cloth so a shortcut never reads as a rayon.

### Neutral
- **Walnut Wall** (walnut-wall): page background; also the ink colour on paper.
- **Walnut Recess** (walnut-recess): the dark inside of the case behind the books, and the background of fields.
- **Walnut Carcass / Lip / Light** (walnut-carcass, walnut-lip, walnut-light): the wood of the case, the front of the shelf plank, the scrollbar thumb.
- **Field Border** (field-border): the 1px stroke of the search field and selects.
- **Linen / Muted / Faint** (linen, linen-muted, linen-faint): body text, secondary text (accroches, rayon descriptions), metadata and placeholders.
- **Gold Rule** (gold-rule): the hairline under rayon headings and above the footer.
- **Paper / Ink / Ink Muted** (paper, ink, ink-muted): the fiche surface and its text.

Price pills carry their own soft hues on walnut (Gratuit green, Étudiant blue, Crédits/Essai apricot, Freemium lilac, Payant coral, Open source pale foil); they are outline-only, coloured text and border, never fills.

### Named Rules
**The Cloth Belongs To The Book Rule.** Saturated cloth colour appears only on things that are books or come from a book: spines, lying books, the ribbon bookmark, the fiche band and the fiche's primary button. UI chrome on the wall stays walnut, linen and gold.

**The Stamped Gold Rule.** Gold is metal, never a background wash. It appears as text, filets, hairlines, outlines and the fill of a selected control; never as a large tinted panel.

## Typography

**Display Font:** Alegreya Sans SC (with Alegreya Sans, sans-serif)
**Body Font:** Alegreya Sans (with sans-serif)

**Character:** Two cuts of one family. The small-caps cut is the binder's stamp, used for anything titled; the regular cut is the reading face. The pairing stays humanist and warm without any serif display face.

### Hierarchy
- **Display** (700, clamp(2.5rem, 5.2vw, 4.25rem), 1): the site title only, in Hot-Foil Gold.
- **Headline** (700, 2rem, 1.1): rayon headings in Pale Foil; the fiche title (2rem, 0.02em) in Spine Foil on the band. 1.7rem on phone.
- **Title** (700, 1.3rem, 1.2): sub-theme headings within a rayon, in linen.
- **Spine** (700, 1.2rem, 1, 0.06em): spine titles, set vertically and read bottom to top; lying-book titles at 1.05rem, 0.05em. 0.86rem on phone.
- **Body** (400, 1.0625rem, 1.5): all reading text; 1rem on phone; descriptions held to about 60ch.
- **Label** (500, 0.8rem): price and status pills. Counts everywhere (spine counts, tab counts, result count) use tabular figures.

### Named Rules
**The Stamp Rule.** Small caps mean "this is a title stamped on a book or a shelf heading". Never set running text, buttons or metadata in the small-caps cut. The one small inline exception in the build is the « Coup de cœur » mark after a tool name.

**The Tabular Count Rule.** Every number that counts tools is set in tabular figures so counts align on spines and in tabs.

## Layout

A single centred column (content width min(1120px, 100% minus two gutters); gutters 44px desktop, 28px tablet, 16px phone). Order is fixed on every width: header row (title left, update date and source link right), the bookcase, the toolbar (search plus price chips plus « Plus de filtres »), the result count, then the lists.

The bookcase spans the full content width. Desktop: one shelf, eight spines from the left, the lying stack flush right against the upright; case height 380px (320px tablet). Phone (720px and below): the spines fill a first shelf (196px tall) and the lying stack sits on a second, lower shelf of the same case; the two background "fond de pile" volumes are hidden; price chips become one horizontally scrolling row with a fade at the edge.

**Spine width encodes tool count.** `sizeSpines` in app.js computes width = base + k × tools with a single global coefficient k for all spines (base 30px, 20px when the shelf is under 480px wide), so the order of thicknesses always follows the order of counts. k is capped so that no spine is wider than its own height divided by 2.4. It reruns on resize. Spine heights come from a fixed set of ratios (0.8 to 0.98 of case height) so the row reads as real books.

Lists are shelf-lists: rows of a small mark (42px logo or monogram, 96px thumbnail for reading material), name plus accroche, and right-aligned pills, separated by faint linen hairlines. Rayon sections open with 64px of space, a ribbon bookmark, the gold small-caps heading and a gold hairline. The home's coups de cœur use the same list at a larger size.

The fiche is a right-hand drawer, min(580px, 100%) wide, full height. On phone a sticky thumb bar keeps the main link and « Fermer » in reach.

## Elevation & Depth

Depth is physical and only where a physical object would cast it. The bookcase is the one lifted object: a long soft drop shadow under the case, an inset dark recess behind the books (top and side vignettes), a shelf plank with a lit top edge and dark underside, and an upright with a lit inner chamfer. Books cast small contact shadows on their neighbours. Everything on the wall below the case is flat; the fiche is the only floating surface.

### Shadow Vocabulary
- **Case drop** (`0 40px 70px -40px rgba(0,0,0,0.9)`): under the bookcase only.
- **Spine contact** (`2px 0 3px rgba(0,0,0,0.5)`): each standing book at rest.
- **Spine pulled** (`2px 6px 10px rgba(0,0,0,0.55)` on hover/focus, `3px 12px 14px rgba(0,0,0,0.65)` when open): grows with the pull.
- **Lying contact** (`0 2px 3px rgba(0,0,0,0.45)`): each lying book.
- **Fiche drawer** (`-24px 0 60px rgba(0,0,0,0.55)`): the paper drawer, over a 66% walnut veil.

### Named Rules
**The Only The Case Is Lifted Rule.** Shadows belong to the bookcase, its books and the fiche drawer. Lists, toolbars and headings stay flat on the wall.

**The Deliberate Texture Rule.** The woven cloth (`--trame`: two crossed 1px repeating linear gradients at 3px pitch) and the wood grain of the case and upright are repeating-gradient textures on purpose. They are the material of this world, rendered in CSS with no image files, and they are not noise to clean up. Every cloth surface (spines, lying books, the fiche band, monograms) carries the weave.

## Shapes

Books are nearly square-cornered: spines 4px at the head and 1px at the foot (they stand on the shelf), lying books 4px on the spine edge and 2px on the fore-edge. Fields and thumbnails are 4px and 3px. Logos and monograms 6px. Every interactive control on the wall (chips, tabs, link buttons, fiche buttons, back-to-top) is a full pill (999px), outlined in 1px half-strength gold or ink. The rayon ribbon bookmark is a 14 by 30px strip with a V-notched tail. Double filets are pairs of 2px gold rules 7px apart (horizontal at head and tail of spines and under the fiche band, vertical at both ends of lying books).

## Components

### Spine (signature)
Tactile and pullable. A `button` per rayon in its cloth colour, woven texture plus a cylindrical side-lighting gradient, vertical gold small-caps title, count in linen at the foot, double filets at head and tail. **Hover/focus:** slides up 7px. **Open (aria-pressed):** stays pulled 12px; the other spines step back to 58% of their cloth mixed with black while their gold keeps full contrast, and recover their colour when hovered. Motion: 180ms on the exponential ease-out `cubic-bezier(0.16, 1, 0.3, 1)`; none under reduced motion.

### Lying book (signature)
The three shortcuts, stacked against the upright and pulled leftward like a book drawn from a pile: 8px on hover/focus, 12px with a brighter foil when active. Titles in spine foil with vertical double filets at both ends. Below them two blind-stamped background volumes (no gold, dark filets, `aria-hidden`) complete the pile so the shortcuts do not read as buttons floating in space.

### Chips and tabs
Pill, 44px tall (tabs 38px), transparent with a half-strength gold outline, linen text. Hover: a 12% gold wash. Selected: Pale Foil fill with ink text. Tab counts are small tabular figures.

### Link button
Pill, 40px, half-gold outline, Pale Foil text; used for « Voir les N outils » and « Retirer les filtres ».

### Search field
52px, Walnut Recess background, 1px Field Border, 4px corners, a 20px stroked magnifier inset left. Focus: Hot-Foil Gold border plus a 2px soft gold outline.

### Shelf-list row
Grid row with mark, name (700) plus accroche (linen-muted), and right-aligned outline pills; hover is a 5% linen wash. Monograms are woven-cloth squares with a gold small-caps initial; logos sit on a paper tile.

### Fiche
A linen paper drawer from the right (280ms slide of 40px on the same ease-out). Header band in the tool's rayon cloth with weave, previous/next/close as linen-outlined pills, the title stamped in Spine Foil, and a gold double filet. Body in ink on paper. Buttons are ink-outlined pills; the primary link is filled with the rayon cloth in white; text selection inside the fiche uses the cloth.

### Back to top
Fixed bottom-right pill in Pale Foil with ink text and a soft drop shadow.

## Do's and Don'ts

### Do:
- **Do** let spine width carry the tool count through the single global coefficient in `sizeSpines`; never size one spine by hand.
- **Do** take rayon colours from `data/rayons.json` and reuse that one value for spine, bookmark and fiche band.
- **Do** stamp titles on cloth in Spine Foil small caps with double filets, and keep the woven texture on every cloth surface.
- **Do** keep controls on the wall as gold-outlined pills, with Pale Foil fill only for the selected state.
- **Do** use tabular figures for every count.
- **Do** keep the 180ms exponential ease-out for book movement and drop all motion under `prefers-reduced-motion`.

### Don't:
- **Don't** turn the home into a centred search hero over a grid of category cards.
- **Don't** put cloth colours on wall chrome (toolbar, lists, headings); they belong to books.
- **Don't** set body text, buttons or metadata in the small-caps cut.
- **Don't** add shadows to flat wall elements; only the case, its books and the fiche are lifted.
- **Don't** replace the repeating-gradient cloth and wood textures with flat fills or raster images.
