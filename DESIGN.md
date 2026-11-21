---
name: AI library
description: A binder's bookcase of AI tools, buckram volumes on a walnut shelf, titles stamped in hot-foil gold under a brass relief nameplate.
colors:
  foil-gold: "#d8a63c"
  foil-gold-light: "#e9c46a"
  foil-gold-spine: "#f0d283"
  brass: "#dcaa46"
  brass-light: "#e8bb58"
  gold-outline: "rgba(233, 196, 106, 0.5)"
  gold-wash: "rgba(233, 196, 106, 0.12)"
  gold-rule: "rgba(233, 196, 106, 0.22)"
  walnut-wall: "#2b1d16"
  walnut-recess: "#1d130d"
  walnut-carcass: "#5a3a24"
  walnut-lip: "#7a5233"
  walnut-light: "#8a5e3a"
  field-border: "#6e4f36"
  leather: "#1a120d"
  linen: "#efe7da"
  linen-muted: "#cbbba5"
  linen-faint: "#a8937a"
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
    fontFamily: "Alfa Slab One, serif"
    fontSize: "clamp(3rem, 7vw, 6rem)"
    fontWeight: 400
    lineHeight: 0.8
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
  title-small:
    fontFamily: "Alegreya Sans SC, Alegreya Sans, sans-serif"
    fontSize: "1.1rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.05em"
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
  title-label: "2px"
  field: "4px"
  mark: "6px"
  tab: "7px 7px 0 0"
  pill: "999px"
spacing:
  gutter: "44px"
  gutter-tablet: "28px"
  gutter-phone: "16px"
  shelf: "22px"
  shelf-phone: "16px"
  content: "1120px"
  case-height: "23.75rem"
  case-height-tablet: "20rem"
  case-height-phone: "12.25rem"
components:
  brass-title:
    textColor: "{colors.brass}"
    typography: "{typography.display}"
  spine:
    backgroundColor: "{colors.walnut-carcass}"
    textColor: "{colors.foil-gold-spine}"
    typography: "{typography.spine}"
    rounded: "{rounded.spine}"
    padding: "36px 0 34px"
    height: "calc(var(--h) * 23.75rem)"
  spine-title-label:
    backgroundColor: "{colors.leather}"
    textColor: "{colors.foil-gold-spine}"
    rounded: "{rounded.title-label}"
    padding: "16px 7px"
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
  chip-empty:
    textColor: "{colors.linen-muted}"
    rounded: "{rounded.pill}"
    padding: "0 17px"
    height: "44px"
  tab:
    textColor: "{colors.linen}"
    rounded: "{rounded.tab}"
    padding: "0 14px"
    height: "40px"
  tab-selected:
    backgroundColor: "{colors.walnut-wall}"
    textColor: "{colors.foil-gold-light}"
    rounded: "{rounded.tab}"
    padding: "0 14px"
    height: "40px"
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
  shortcut-key:
    textColor: "{colors.linen-faint}"
    rounded: "{rounded.field}"
    padding: "1px 7px"
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
  fiche-icon-button:
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    width: "44px"
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

The site is a binder's room at night: a dark walnut wall, one real bookcase, and on its shelf eight buckram volumes, one per rayon. Their titles are stamped in hot-foil gold small caps between double filets, the way a bindery finishes a spine; the three largest volumes carry a dark leather title label. On the top of the case, seen slightly from above, rests the brass name in two welded pieces: « AI » standing flat on its feet, « library » leaning on the foot of its l and the loop of its y. Everything below the case (search, price chips, shelf-lists of tools) reads as linen text on the same walnut wall, hanging off thin gold rules. A tool's fiche is a sheet of linen paper slid out from the right, headed by a band of its rayon's cloth.

The bookcase is a functional object, not a picture. Spine thickness encodes the number of tools in each rayon; pulling a spine opens it; the lying books against the right-hand upright are the three shortcuts (Coups de cœur, Nouveautés, Proposer un outil). Density is moderate: one large object at the top, then calm lists.

The world explicitly rejects the directory pattern (a centered search hero over a grid of category cards).

**Key Characteristics:**
- One continuous walnut bookcase: a visible top surface carrying the brass title, a back panel of dark walnut planks, a shelf plank, and a true upright on the right that caps the shelf.
- Buckram spines in saturated cloth colours, woven texture, a leather head cap, gold small-caps titles and double filets; leather title labels on the three largest volumes.
- Spine width proportional to tool count through one global coefficient; spine height varies slightly per volume.
- Linen text on walnut for reading; linen paper with dark ink for the fiche.
- Pill-shaped controls outlined in faint gold, gold fill for the selected state; sub-themes are index dividers, not pills.

## Colors

A dark, warm wood palette lit by two metals (hot-foil gold on the books and controls, cast brass for the nameplate), with saturated cloth colours that belong to the books alone.

### Primary
- **Hot-Foil Gold** (foil-gold): the search focus border and the coup-de-cœur pill. The base gold of the room.
- **Pale Foil** (foil-gold-light): rayon headings, selected chips (as fill, with ink text), the selected tab's text and top line, link buttons, the focus ring, text selection, the back-to-top button.
- **Spine Foil** (foil-gold-spine): titles and double filets stamped on cloth and leather (spines, title labels, lying books, the fiche band, monogram marks). Brighter so it holds contrast on every cloth.
- **Brass / Light Brass** (brass, brass-light): the relief title letters only, at rest and on hover. Their thickness is a ramp of darker brass steps drawn in the letters' extrusion.
- **Gold Outline** (gold-outline): the 1px outline of every wall control (chips, link buttons, the tab rail) and the soft search focus outline.
- **Gold Wash** (gold-wash): the hover fill of chips and link buttons.

### Secondary: the cloths
- **Rayon cloths** (cloth-green, cloth-ultramarine, cloth-vermilion, cloth-slate, cloth-olive, cloth-wine, cloth-navy, cloth-tobacco): one per rayon, stored as data (`couleur` in `data/rayons.json`), not in the stylesheet. The same value colours the spine, the ribbon bookmark beside the rayon heading, the monogram, and the fiche band and primary button for tools of that rayon.
- **Shortcut cloths** (shortcut-garnet, shortcut-green, shortcut-blue): the three lying shortcut books, distinct from every rayon cloth so a shortcut never reads as a rayon.

### Neutral
- **Walnut Wall** (walnut-wall): page background, the selected tab's fill (it merges with the wall below the rail); also the ink colour on paper.
- **Walnut Recess** (walnut-recess): the background of fields and of the scrollbar track.
- **Walnut Carcass / Lip / Light** (walnut-carcass, walnut-lip, walnut-light): the default wood of an uncoloured book, the face of the shelf plank and case top, the scrollbar thumb.
- **Leather** (leather): the dark title label on the three largest spines.
- **Field Border** (field-border): the 1px stroke of the search field, selects and the « / » key hint.
- **Linen / Muted / Faint** (linen, linen-muted, linen-faint): body text, secondary text (accroches, rayon descriptions, empty chips), metadata, counts and placeholders.
- **Gold Rule** (gold-rule): the hairline under rayon headings and above the footer.
- **Paper / Ink / Ink Muted** (paper, ink, ink-muted): the fiche surface and its text.

Price pills carry their own soft hues on walnut (Gratuit green, Étudiant blue, Crédits/Essai apricot, Freemium lilac, Payant coral, Open source pale foil) and darker counterparts on paper inside the fiche; they are outline-only, coloured text and border, never fills.

### Named Rules
**The Cloth Belongs To The Book Rule.** Saturated cloth colour appears only on things that are books or come from a book: spines, lying books, the ribbon bookmark, monograms, the fiche band and the fiche's primary button. UI chrome on the wall stays walnut, linen and gold.

**The Stamped Gold Rule.** Gold is metal, never a background panel. It appears as text, filets, hairlines, outlines, the fill of a selected control and a faint hover wash on a control; never as a large tinted surface.

**The One Brass Nameplate Rule.** Brass is the cast metal of the title letters and nothing else. Every other gold on the page is foil.

## Typography

**Display Font:** Alfa Slab One (with serif), for the site title only
**Stamp Font:** Alegreya Sans SC (with Alegreya Sans, sans-serif)
**Body Font:** Alegreya Sans (with sans-serif)

**Character:** A heavy slab serif is the cast brass of the nameplate; its slabs let the letters touch without their stems fusing. Below it, two cuts of one family: the small-caps cut is the binder's stamp, used for anything titled; the regular cut is the reading face.

### Hierarchy
- **Display** (Alfa Slab One 400, clamp(3rem, 7vw, 6rem)): the site title only, drawn as SVG by `logo.js`. Letters of each word are moved together until they touch; each word rests on the convex edge under its centre of gravity, so « library » tilts onto its l and y. The brass thickness is the face scaled toward the vanishing point of the case top (its edges inset 1.4 % over 20px), and a contact shadow darkens where the brass is close to the wood. The plain text « AI library » shows until the drawing is ready.
- **Headline** (700, 2rem, 1.1): rayon headings in Pale Foil; the fiche title (2rem, 0.02em) in Spine Foil on the band. 1.7rem on phone.
- **Title** (700, 1.3rem, 1.2): sub-theme headings within a rayon, in linen.
- **Title Small** (700, 1.1rem, 1.2, 0.05em): section headings inside the fiche (« À quoi ça sert », « Cas d'usage »), in the rayon cloth on paper.
- **Spine** (700, 1.2rem, 1, 0.06em): spine titles, set vertically and read bottom to top; lying-book titles at 1.05rem, 0.05em. 0.86rem on phone.
- **Body** (400, 1.0625rem, 1.5): all reading text; 1rem on phone; descriptions held to about 60ch, fiche paragraphs to 65ch at 1.55. Paragraphs and list items use `text-wrap: pretty`, headings `balance`.
- **Label** (500, 0.8rem): price and status pills. Counts everywhere (spine counts, chip counts, tab counts, result count) use tabular figures.

### Named Rules
**The Stamp Rule.** Small caps mean "this is a title stamped on a book, a shelf heading, or the nameplate". Never set running text, buttons or metadata in the small-caps cut. The one small inline exception in the build is the « Coup de cœur » mark after a tool name.

**The Tabular Count Rule.** Every number that counts tools is set in tabular figures so counts align on spines, chips and tabs.

## Layout

A single centred column (content width min(1120px, 100% minus two gutters); gutters 44px desktop, 28px tablet, 16px phone). Order is fixed on every width: the header (brass title standing on the case top, update date and source link on the right), the bookcase, the toolbar (search plus price chips plus « Plus de filtres »), the result count, then the lists. On phone the meta line moves above the title so the letters still touch the case.

The bookcase spans the full content width, and the header is its top: a 20px strip of lit walnut in slight perspective (narrower at the back) on which the letters stand. Desktop: one shelf, eight spines from the left, the lying stack flush right against the upright; case height 23.75rem (20rem tablet). Phone (720px and below): the spines fill a first shelf (12.25rem tall) and the lying stack sits on a second, lower shelf of the same case; the two background "fond de pile" volumes are hidden; price chips and sub-theme tabs each become one horizontally scrolling row with a fade at the edge.

**The Global Coefficient Rule.** Spine width is base + k × tools with a single k for all spines (`sizeSpines` in app.js; base 30px, 20px when the shelf is under 480px wide), so the order of thicknesses always follows the order of counts. k is capped so that no spine is wider than its own height divided by 2.4. It reruns on resize. Spine heights come from a fixed set of ratios (0.8 to 0.98 of case height) so the row reads as real books.

Lists are shelf-lists: rows of a small mark (42px logo or monogram, 96px thumbnail for reading material), name plus accroche, and right-aligned pills, separated by faint linen hairlines. Rayon sections open with 64px of space, a ribbon bookmark, the gold small-caps heading and a gold hairline, then the sub-theme dividers. The home's coups de cœur use the same list at a larger size.

The fiche is a right-hand drawer, min(580px, 100%) wide, full height. On phone, once the visitor scrolls past the access buttons, a sticky thumb bar appears at the bottom with previous, the main link, next and close.

## Elevation & Depth

Depth is physical and only where a physical object would cast it. The bookcase is the one lifted object: a long soft drop shadow under the case, a back panel of dark walnut planks with top and side vignettes, a shelf plank with a lit top edge and dark underside, and an upright with a lit inner chamfer casting onto the books. Books cast contact shadows on their neighbours and a longer shadow onto the back panel. The brass letters stand on the case top and cast a short shadow back onto it. Everything on the wall below the case is flat; the fiche and the back-to-top pill are the only floating surfaces.

### Shadow Vocabulary
- **Case drop** (`0 40px 70px -40px rgba(0,0,0,0.9)`): under the bookcase only.
- **Upright cast** (`-8px 0 14px -6px rgba(0,0,0,0.6)`): from the upright onto the end of the shelf.
- **Plank cast** (`0 -6px 10px -4px rgba(0,0,0,0.55)`): the shelf plank onto the feet of the books.
- **Spine at rest** (`2px 0 3px rgba(0,0,0,0.5), 9px -5px 14px -3px rgba(0,0,0,0.6)`): the joint with the neighbour, then the cast onto the back panel.
- **Spine pulled** (`2px 6px 10px rgba(0,0,0,0.55), 12px -2px 16px -3px rgba(0,0,0,0.55)` on hover/focus; `3px 12px 14px rgba(0,0,0,0.65), 14px 0 18px -3px rgba(0,0,0,0.55)` when open): grows with the pull.
- **Lying contact** (`0 2px 3px rgba(0,0,0,0.45)`): each lying book.
- **Brass letter** (`drop-shadow(3px -2px 2px rgba(0,0,0,0.5))` plus a radial contact shadow along the base): the title letters on the case top.
- **Fiche drawer** (`-24px 0 60px rgba(0,0,0,0.55)`): the paper drawer, over a 66% walnut veil.
- **Back to top** (`0 8px 20px -6px rgba(0,0,0,0.6)`): the fixed pill.

### Named Rules
**The Only The Case Is Lifted Rule.** Shadows belong to the bookcase (its top, books, plank and upright, and the brass letters standing on it), the fiche drawer and the back-to-top pill. Lists, toolbars, tabs and headings stay flat on the wall.

**The Deliberate Texture Rule.** The woven cloth (`--trame`: two crossed 1px repeating linear gradients at 3px pitch), the wood grain of the case (`--noyer`), the plank seams of the back panel, the grain of the upright and the stepped extrusion of the brass letters are repeating-gradient and layered-shadow textures on purpose. They are the material of this world, rendered in CSS with no image files, and they are not noise to clean up. Every cloth and leather surface (spines, title labels, lying books, the fiche band, monograms) carries the weave.

## Shapes

Books are nearly square-cornered: spines 4px at the head and 1px at the foot (they stand on the shelf), lying books 4px on the spine edge and 2px on the fore-edge, leather title labels 2px. Fields, the key hint and thumbnails are 4px and 3px. Logos and monograms 6px. Sub-theme tabs are index dividers with 7px top corners and a square foot that sits on a gold rail. Every other interactive control on the wall (chips, link buttons, fiche buttons, back-to-top) is a full pill (999px), outlined in 1px Gold Outline or ink; icon buttons in the fiche thumb bar are 44px circles. The rayon ribbon bookmark is a 14 by 30px strip with a V-notched tail. Double filets are pairs of 2px gold rules 7px apart (horizontal at head and tail of spines and under the fiche band, vertical at both ends of lying books); leather labels are framed by a double inset gold rule. The case top is a trapezoid, slightly narrower at the back.

## Components

### Brass title (signature)
The site title as cast brass letters standing on the case top. Each letter has its own small tilt (between -2deg and 3deg) set inline, a stepped extrusion of darker brass up and to the right (seven 1px steps, five on phone) and a short drop shadow onto the wood. **Hover:** the letters straighten to 0deg over 250ms on the exponential ease-out and brighten to Light Brass. The visible letters are `aria-hidden`; the link carries the accessible name.

### Spine (signature)
Tactile and pullable. A `button` per rayon in its cloth colour, woven texture plus a cylindrical side-lighting gradient, a 5px leather head cap (lit edge then dark fold), vertical gold small-caps title, count in linen at the foot, double filets at head and tail. The three largest rayons set their title on a leather label with weave and a double gold frame. **Hover/focus:** slides up 7px. **Open (aria-pressed):** stays pulled 12px; the other spines step back to 58% of their cloth mixed with black while their gold keeps full contrast, and recover their colour when hovered. Motion: 180ms on the exponential ease-out `cubic-bezier(0.16, 1, 0.3, 1)`; none under reduced motion. On phone only the open state moves (8px).

### Lying book (signature)
The three shortcuts, stacked against the upright and pulled leftward like a book drawn from a pile: 8px on hover/focus, 12px with a brighter foil when active. Titles in spine foil with vertical double filets at both ends. Below them two blind-stamped background volumes (no gold, dark filets, `aria-hidden`) complete the pile so the shortcuts do not read as buttons floating in space.

### Price chips
Pill, 44px tall, transparent with a Gold Outline, linen text, followed by a small tabular count in Faint Linen of how many tools that chip would give in the current view. Hover: Gold Wash. Selected: Pale Foil fill with ink text (the count turns Muted Ink). A chip that would give no result keeps its label readable in Muted Linen and switches to a dashed, fainter gold border.

### Sub-theme tabs
Index dividers on a 1px Gold Outline rail, distinct from the price pills: 40px tall, 7px top corners, a faint linen tint (4%, 9% on hover), 0.95rem medium text with a small tabular count. Selected: the tab takes the wall colour, opens into the rail below it, turns its text Pale Foil and gains a 2px Pale Foil line along its top edge.

### Link button
Pill, 40px, Gold Outline, Pale Foil text, Gold Wash on hover; used for « Revenir à la sélection », « Voir les N outils » and « Retirer les filtres » (the action of the empty state, which states in a sentence what is filtering).

### Search field
52px, Walnut Recess background, 1px Field Border, 4px corners, a 20px stroked magnifier inset left. On the right a « / » key hint (0.85rem, Faint Linen, Field Border box) recalls the keyboard shortcut; it disappears on focus, once text is typed, and on phone. Focus: Hot-Foil Gold border plus a 2px Gold Outline ring.

### Shelf-list row
Grid row with mark, name (700) plus accroche (Muted Linen), and right-aligned outline pills; hover is a 5% linen wash. Monograms are woven-cloth squares in the rayon cloth with a gold small-caps initial; logos sit on a paper tile.

### Fiche
A linen paper drawer from the right (280ms slide of 40px on the same ease-out). Header band in the tool's rayon cloth with weave: previous/next/close as 36px linen-outlined text pills, the title stamped in Spine Foil, the path rayon › sub-theme in linen, and a gold double filet. Body in ink on paper with Title Small section headings in the cloth. Access buttons are ink-outlined pills; the first link is the primary, filled with the rayon cloth in white; text selection and the focus ring inside the fiche use the cloth. **Phone thumb bar:** a sticky paper bar with a hairline top, holding 44px circular icon buttons (previous, next, close) drawn as 20px stroked SVG chevrons and a cross, around the primary link which takes the remaining width.

### Back to top
Fixed bottom-right pill in Pale Foil with ink text and its soft drop shadow.

## Do's and Don'ts

### Do:
- **Do** let spine width carry the tool count through the single global coefficient in `sizeSpines`; never size one spine by hand.
- **Do** take rayon colours from `data/rayons.json` and reuse that one value for spine, bookmark, monogram and fiche band.
- **Do** stamp titles on cloth or leather in Spine Foil small caps with double filets, and keep the woven texture on every cloth and leather surface.
- **Do** keep price and action controls on the wall as Gold Outline pills, with Pale Foil fill only for the selected state; keep sub-themes as index dividers on a rail.
- **Do** use tabular figures for every count.
- **Do** keep the 180ms exponential ease-out for book movement and drop all motion under `prefers-reduced-motion`.
- **Do** draw icons as inline stroked SVG (2px stroke, round caps), never as text glyphs.

### Don't:
- **Don't** turn the home into a centred search hero over a grid of category cards.
- **Don't** put cloth colours on wall chrome (toolbar, lists, headings, tabs); they belong to books.
- **Don't** set body text, buttons or metadata in the small-caps cut.
- **Don't** add shadows to flat wall elements; only the case and what stands on it, the fiche and the back-to-top pill are lifted.
- **Don't** use brass anywhere but the title letters.
- **Don't** replace the repeating-gradient cloth, wood and plank textures or the brass extrusion with flat fills or raster images.
