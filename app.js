// AI library : 8 rayons, sélection de coups de cœur, recherche et fiche outil.
// Données : data/outils.json, data/rayons.json, data/medias.json (images, logos, état des liens).
const $ = (id) => document.getElementById(id);
const REPO = "https://github.com/Oradixx/AI-library";
const CHIPS = [
  { id: "Gratuit", label: "Gratuit", match: ["Gratuit"] },
  { id: "Étudiant", label: "Étudiant", match: ["Étudiant"] },
  { id: "Open source", label: "Open source", match: ["Open source"] },
  { id: "Crédits", label: "Crédits offerts", match: ["Crédits", "Essai"] },
  { id: "Freemium", label: "Freemium", match: ["Freemium"] },
  { id: "Payant", label: "Payant", match: ["Payant"] },
];
const RANK = { "À tester": 0, "À lire": 1, "": 2, "Noté": 2, "Écarté": 9 };

let items = [], rayons = [], medias = {}, bySlug = {}, rayonOf = {}, maxLot = 1;
const state = { rayon: "", theme: "", q: "", tarifs: new Set(), outil: "", vue: "" };
let lastList = [];
let lastFocus = null;
let pouce = null;
let fichePoussee = false;

const norm = (s) => (s || "").toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const esc = (s) => (s || "").toString().replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const safeUrl = (u) => (/^https?:\/\//.test(u || "") ? u : "");
const colorOf = (it) => (rayonOf[it.theme] || {}).couleur || "#44506a";
const rayonName = (it) => (rayonOf[it.theme] || {}).nom;
const isSkill = (it) => rayonName(it) === "Skills" && !it.article && !it.nom.startsWith("Article");

// ---------- État dans l'URL ----------
function readHash() {
  const p = new URLSearchParams(location.hash.slice(1));
  state.rayon = p.get("rayon") || "";
  state.theme = p.get("theme") || "";
  state.q = p.get("q") || "";
  state.tarifs = new Set((p.get("tarif") || "").split(",").filter(Boolean));
  state.outil = p.get("outil") || "";
  state.vue = p.get("vue") || "";
  $("q").value = state.q;
}
function hashFor(over = {}) {
  const s = { ...state, ...over };
  const p = new URLSearchParams();
  if (s.rayon) p.set("rayon", s.rayon);
  if (s.theme) p.set("theme", s.theme);
  if (s.q) p.set("q", s.q);
  if (s.tarifs.size) p.set("tarif", [...s.tarifs].join(","));
  if (s.vue) p.set("vue", s.vue);
  if (s.outil) p.set("outil", s.outil);
  const h = p.toString();
  return h ? "#" + h : location.pathname + location.search;
}
const replaceHash = () => history.replaceState(null, "", hashFor());
// Changer de rayon ou de vue crée une entrée : le bouton Retour revient à la vue précédente.
const pushHash = () => history.pushState(null, "", hashFor());

// ---------- Filtres ----------
function filtered(ignoreRayon = false, ignoreTarifs = false) {
  const words = norm(state.q).split(/\s+/).filter(Boolean);
  const source = $("source").value, showOut = $("ecartes").checked;
  const wanted = CHIPS.filter((c) => state.tarifs.has(c.id)).flatMap((c) => c.match);
  return items.filter((it) => {
    if (!ignoreRayon && state.rayon && (rayonOf[it.theme] || {}).nom !== state.rayon) return false;
    if (!ignoreRayon && state.theme && it.theme !== state.theme) return false;
    if (!showOut && it.statut === "Écarté") return false;
    if (source && !(it.source || "").includes(source)) return false;
    if (!ignoreTarifs && wanted.length && !(it.tarif || []).some((t) => wanted.includes(t))) return false;
    return words.every((w) => it._hay.includes(w));
  });
}
function sorted(list) {
  const byName = (a, b) => a.nom.localeCompare(b.nom, "fr");
  if ($("tri").value === "nom") return list.sort(byName);
  return list.sort((a, b) => (b.coeur - a.coeur) || ((RANK[a.statut] ?? 2) - (RANK[b.statut] ?? 2)) || byName(a, b));
}
const plural = (n, one, many) => `${n} ${n > 1 ? many : one}`;
const filtersActive = () => state.q || state.tarifs.size || $("source").value;

// ---------- Rendu des petits éléments ----------
function logo(it, size = "") {
  const m = medias[it.slug] || {};
  const letter = esc((it.nom.match(/[A-Za-z0-9À-ÿ]/) || ["?"])[0].toUpperCase());
  const mono = `<span class="mono" style="background:${colorOf(it)}" aria-hidden="true">${letter}</span>`;
  if (!m.logo || isSkill(it)) return mono;
  return `<img class="logo" src="${esc(m.logo)}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.outerHTML=this.dataset.f" data-f='${mono.replace(/'/g, "&#39;")}'>`;
}
// Le statut personnel reste en coulisse : seul « Écarté » se montre, quand on affiche les écartés.
function pills(it, max = 3, skip = []) {
  const tarifs = (rayonName(it) === "Lire et apprendre" ? (it.tarif || []).filter((t) => t !== "Gratuit") : it.tarif || []).filter((t) => !skip.includes(t));
  const out = tarifs.slice(0, max).map((t) => `<span class="pill t-${esc(t.replace(/\s/g, "-"))}">${esc(t)}</span>`);
  if (it.statut === "Écarté") out.push(`<span class="pill s-Écarté">Écarté</span>`);
  return out.join("");
}
// Images : jamais pour les skills (sauf coups de cœur) ; bannière d'abord pour les articles et lectures.
function coverUrl(it) {
  if (isSkill(it) && !it.coeur) return "";
  const site = (medias[it.slug] || {}).image || "";
  return it.article || rayonName(it) === "Lire et apprendre" ? it.image_post || site : site || it.image_post || "";
}
const accroche = (it) => it.accroche || it.description || "";
// Date d'un article ou d'une lecture publiés sur X : l'identifiant du post (Snowflake) contient l'instant de publication.
function xDate(it) {
  if (!it.article && rayonName(it) !== "Lire et apprendre") return null;
  const m = [it.post, it.url].map((u) => /\/\/(?:www\.)?(?:x|twitter)\.com\/[^/]+\/status\/(\d{15,})/.exec(u || "")).find(Boolean);
  return m ? new Date(Number((BigInt(m[1]) >> 22n) + 1288834974657n)) : null;
}
const fmtDate = (d, mois = "long") => d.toLocaleDateString("fr-FR", { day: "numeric", month: mois, year: "numeric" });

// Sur les rangées, « Gratuit » reste implicite (plus de 80 % du catalogue) : seuls les vrais coûts et offres sont marqués.
function row(it, skip, plain = false) {
  const reading = rayonName(it) === "Lire et apprendre" && !plain;
  const thumb = reading && coverUrl(it);
  const mono = logo({ ...it, slug: "" });
  const visual = thumb ? `<img class="thumb" src="${esc(thumb)}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.outerHTML=this.dataset.f" data-f='${mono.replace(/'/g, "&#39;")}'>` : logo(it);
  return `<li class="entry${reading ? " reading" : ""}"><a href="${hashFor({ outil: it.slug })}" data-outil="${esc(it.slug)}">
    ${visual}
    <span><span class="nom">${esc(it.nom)}</span>${it.coeur ? ' <span class="coeur-mark">Coup de cœur</span>' : ""}<span class="acc">${esc(accroche(it))}</span>${reading && xDate(it) ? `<span class="date">${esc(fmtDate(xDate(it), "short"))}</span>` : ""}</span>
    <span class="tags">${pills(it, 3, [...(Array.isArray(skip) ? skip : []), "Gratuit"])}</span>
  </a></li>`;
}
// ---------- Vues ----------
// L'étagère : un livre par rayon, son épaisseur suit le nombre d'outils ; à droite, la pile de raccourcis couchés.
function renderShelf() {
  if ($("shelf").querySelector(".rang")) return updateShelf();
  const counts = {};
  for (const it of items) if (it.statut !== "Écarté") counts[rayonOf[it.theme].nom] = (counts[rayonOf[it.theme].nom] || 0) + 1;
  const tall = [0.93, 0.85, 0.98, 0.8, 0.9, 0.96, 0.87, 0.94];
  // Les trois plus gros volumes portent une pièce de titre en cuir.
  const gros = rayons.map((r) => counts[r.nom] || 0).sort((a, b) => b - a)[2];
  const spines = rayons.map((r, i) => {
    const n = counts[r.nom] || 0;
    return `<button class="dos${n >= gros ? " piece" : ""}" type="button" data-rayon="${esc(r.nom)}" data-n="${n}" aria-pressed="${state.rayon === r.nom}"
      style="--c:${r.couleur};--h:${tall[i % tall.length]}" aria-label="${esc(r.nom)}, ${n} outils"><span class="titre">${esc(r.nom)}</span><span class="n">${n}</span></button>`;
  }).join("");
  const nouv = items.filter((it) => it.lot === maxLot && it.statut !== "Écarté").length;
  const home = !state.rayon && !state.vue && !filtersActive();
  $("shelf").innerHTML = `<div class="etage"><div class="rang">${spines}</div>
    <div class="pile" role="group" aria-label="Raccourcis">
      <button class="couche c1" type="button" data-home aria-pressed="${home}">Coups de cœur<span class="signet" aria-hidden="true"></span></button>
      <button class="couche c2" type="button" data-vue="nouveautes" aria-pressed="${state.vue === "nouveautes"}">Nouveautés <span class="n">${nouv}</span><span class="signet" aria-hidden="true"></span></button>
      <a class="couche c3" href="${REPO}/issues/new?template=outil.yml" target="_blank" rel="noopener" aria-label="Proposer un outil (ouvre GitHub dans un nouvel onglet)">Proposer un outil</a>
      <span class="couche c4" aria-hidden="true"></span><span class="couche c5" aria-hidden="true"></span>
    </div></div>`;
  $("rail").innerHTML = `<div class="rail-rang"><button class="rail-dos rail-accueil" type="button" data-home>Sélection</button>${rayons.map((r) =>
    `<button class="rail-dos" type="button" data-rayon="${esc(r.nom)}" style="--c:${r.couleur}">${esc(r.nom)}</button>`).join("")}</div>`;
  updateShelf();
  sizeSpines();
}
// Les nombres ne changent pas après le chargement : on ne met à jour que les états pressés.
function updateShelf() {
  const sh = $("shelf");
  document.querySelectorAll(".dos, .rail-dos[data-rayon]").forEach((d) => d.setAttribute("aria-pressed", state.rayon === d.dataset.rayon));
  $("rail").querySelector("[data-home]")?.setAttribute("aria-pressed", !state.rayon && !state.vue && !filtersActive());
  sh.querySelector("[data-home]").setAttribute("aria-pressed", !state.rayon && !state.vue && !filtersActive());
  sh.querySelector("[data-vue]").setAttribute("aria-pressed", state.vue === "nouveautes");
  sh.classList.toggle("ouvert", !!state.rayon);
}
// Remplit la planche : épaisseur = base + k × outils, un seul k pour tous, réduit si un livre dépasse
// 1/2,4 de sa hauteur. L'ordre des épaisseurs suit donc toujours l'ordre des nombres d'outils.
function sizeSpines() {
  const rang = $("shelf").querySelector(".rang");
  if (!rang) return;
  const spines = [...rang.children];
  const ns = spines.map((s) => Number(s.dataset.n) || 1);
  const avail = rang.clientWidth - (parseFloat(getComputedStyle(rang).columnGap) || 0) * (spines.length - 1);
  const base = avail < 480 ? 20 : 30;
  const fill = (avail - 14 - base * spines.length) / ns.reduce((a, b) => a + b, 0);
  const k = Math.max(0, Math.min(fill, ...spines.map((s, i) => (s.offsetHeight / 2.4 - base) / ns[i])));
  spines.forEach((s, i) => { s.style.width = Math.round(base + k * ns[i]) + "px"; });
}

// Chaque pastille dit combien d'outils elle donnerait dans la vue en cours (rayon, recherche, autres filtres).
function renderChips() {
  const scope = filtered(true, true).filter((it) => (!state.rayon || rayonName(it) === state.rayon) && (!state.theme || it.theme === state.theme) && (state.vue !== "nouveautes" || it.lot === maxLot));
  $("chips").innerHTML = CHIPS.map((c) => {
    const n = scope.filter((it) => (it.tarif || []).some((t) => c.match.includes(t))).length;
    return `<button class="chip${n ? "" : " vide"}" type="button" data-chip="${esc(c.id)}" aria-pressed="${state.tarifs.has(c.id)}" aria-label="${esc(c.label)}, ${plural(n, "outil", "outils")}">${esc(c.label)} <span class="n" aria-hidden="true">${n}</span></button>`;
  }).join("");
}

function viewSelection() {
  const blocks = rayons.map((r) => {
    const all = items.filter((it) => rayonOf[it.theme].nom === r.nom && it.statut !== "Écarté");
    const top = sorted(all.filter((it) => it.coeur)).slice(0, 3);
    const fill = sorted(all.filter((it) => !it.coeur && it.statut === "À tester")).slice(0, 3 - top.length);
    return `<section>
      <div class="rayon-head"><span class="swatch" style="background:${r.couleur}"></span><h2>${esc(r.nom)}</h2>
        <p>${esc(r.themes.filter((t) => t !== "Écartés").join(", "))}</p>
        <button class="link-btn" type="button" data-rayon="${esc(r.nom)}">Voir les ${all.length} outils</button></div>
      <ul class="entries vedettes">${[...top, ...fill].map((it) => row(it, [], true)).join("")}</ul>
    </section>`;
  }).join("");
  $("list").innerHTML = `<div class="intro"><h2>La sélection</h2><p>Trois coups de cœur par rayon. Ouvrez un livre de l'étagère pour parcourir tout le rayon.</p></div>` + blocks;
  $("count").textContent = `${plural(items.filter((it) => it.statut !== "Écarté").length, "outil", "outils")} dans la bibliothèque.`;
  lastList = rayons.flatMap((r) => sorted(items.filter((it) => rayonOf[it.theme].nom === r.nom && it.coeur)));
}

function groupBlock(title, list, skip = []) {
  return `<h3 class="sub">${esc(title)} <small>${list.length}</small></h3><ul class="entries">${list.map((it) => row(it, skip)).join("")}</ul>`;
}

// État vide : dire ce qui filtre et offrir de tout retirer.
const joinFr = (l) => (l.length > 1 ? `${l.slice(0, -1).join(", ")} et ${l.at(-1)}` : l[0] || "");
function emptyState(where) {
  const filters = [...CHIPS.filter((c) => state.tarifs.has(c.id)).map((c) => c.label), $("source").value && $("source").selectedOptions[0].text].filter(Boolean);
  const what = (state.q ? ` à la recherche « ${state.q} »` : "") + (filters.length ? ` avec ${filters.length > 1 ? "les filtres" : "le filtre"} ${joinFr(filters)}` : "");
  const ailleurs = where && state.q ? filtered(true).length : 0;
  return `<div class="empty"><p>Aucun outil ne correspond${where}${esc(what)}.</p>
    ${ailleurs ? `<button class="link-btn" type="button" data-partout>Chercher « ${esc(state.q)} » dans toute la bibliothèque (${ailleurs})</button> ` : ""}<button class="link-btn" type="button" data-clear>Retirer les filtres</button></div>`;
}

function viewRayon() {
  const r = rayons.find((x) => x.nom === state.rayon);
  const base = filtered(true).filter((it) => rayonOf[it.theme].nom === r.nom);
  const list = sorted(state.theme ? base.filter((it) => it.theme === state.theme) : base);
  const tcount = (t) => base.filter((it) => it.theme === t).length;
  const multi = r.themes.filter(tcount).length > 1;
  const tabs = !multi ? "" : [`<button class="tab" type="button" data-theme="" aria-pressed="${!state.theme}">Tout <small>${base.length}</small></button>`,
    ...r.themes.filter(tcount).map((t) => `<button class="tab" type="button" data-theme="${esc(t)}" aria-pressed="${state.theme === t}">${esc(t)} <small>${tcount(t)}</small></button>`)].join("");
  let body;
  if (!list.length) body = emptyState(" dans ce rayon");
  else if (state.tarifs.size > 1) body = chipGroups(list).map(([label, g, skip]) => groupBlock(label, g, skip)).join("");
  else if (state.theme || !multi || $("tri").value === "nom") body = `<ul class="entries">${list.map((it) => row(it)).join("")}</ul>`;
  else body = r.themes.map((t) => list.filter((it) => it.theme === t)).filter((g) => g.length).map((g) => groupBlock(g[0].theme, g)).join("");
  $("list").innerHTML = `<div class="rayon-head"><span class="swatch" style="background:${r.couleur}"></span><h2>${esc(r.nom)}</h2>
    <button class="link-btn" type="button" data-home>Revenir à la sélection</button></div>
    <div class="tabs" role="group" aria-label="Sous-thèmes">${tabs}</div>${body}`;
  $("count").textContent = `${plural(list.length, "outil", "outils")} dans ${r.nom}`;
  lastList = state.theme || $("tri").value === "nom" ? list : r.themes.flatMap((t) => list.filter((it) => it.theme === t));
}

// Plusieurs tarifs choisis : une section par tarif (le plus rare d'abord), pour que chacun reste visible.
function chipGroups(list) {
  const chips = CHIPS.filter((c) => state.tarifs.has(c.id));
  const match = (it, c) => (it.tarif || []).some((t) => c.match.includes(t));
  chips.sort((a, b) => list.filter((it) => match(it, a)).length - list.filter((it) => match(it, b)).length);
  const seen = new Set();
  return chips.map((c) => {
    const g = list.filter((it) => !seen.has(it.slug) && match(it, c));
    g.forEach((it) => seen.add(it.slug));
    return [c.label, g, c.match];
  }).filter(([, g]) => g.length);
}

function viewResults() {
  const list = sorted(filtered(true));
  if (!list.length) {
    $("list").innerHTML = emptyState("");
    $("count").textContent = "0 résultat";
    lastList = [];
    return;
  }
  if (state.tarifs.size > 1) {
    const groups = chipGroups(list);
    const parRayon = (g) => rayons.map((r) => g.filter((it) => rayonName(it) === r.nom)).filter((x) => x.length);
    $("list").innerHTML = groups.map(([label, g, skip]) => `<div class="rayon-head"><h2>${esc(label)}</h2><p>${plural(g.length, "outil", "outils")}</p></div>` +
      parRayon(g).map((x) => groupBlock(rayonName(x[0]), x, skip)).join("")).join("");
    $("count").textContent = `${plural(list.length, "résultat", "résultats")} : ` + groups.map(([label, g]) => `${g.length} ${label.toLowerCase()}`).join(", ");
    lastList = groups.flatMap(([, g]) => parRayon(g).flat());
    return;
  }
  $("list").innerHTML = rayons.map((r) => {
    const g = list.filter((it) => rayonOf[it.theme].nom === r.nom);
    return g.length ? `<div class="rayon-head"><span class="swatch" style="background:${r.couleur}"></span><h2>${esc(r.nom)}</h2></div><ul class="entries">${g.map((it) => row(it)).join("")}</ul>` : "";
  }).join("");
  $("count").textContent = plural(list.length, "résultat", "résultats");
  lastList = rayons.flatMap((r) => list.filter((it) => rayonOf[it.theme].nom === r.nom));
}

function viewNouveautes() {
  const list = sorted(filtered(true).filter((it) => it.lot === maxLot));
  $("list").innerHTML = !list.length ? `<div class="rayon-head"><h2>Nouveautés</h2></div>${emptyState(" parmi les nouveautés")}` : `<div class="rayon-head"><h2>Nouveautés</h2><p>Les derniers outils et lectures ajoutés au catalogue.</p>
    <button class="link-btn" type="button" data-home>Revenir à la sélection</button></div>` +
    rayons.map((r) => {
      const g = list.filter((it) => rayonOf[it.theme].nom === r.nom);
      return g.length ? groupBlock(r.nom, g) : "";
    }).join("");
  $("count").textContent = plural(list.length, "nouveauté", "nouveautés");
  lastList = rayons.flatMap((r) => list.filter((it) => rayonOf[it.theme].nom === r.nom));
}

function render() {
  renderShelf();
  renderChips();
  if (state.rayon) viewRayon();
  else if (state.vue === "nouveautes") viewNouveautes();
  else if (filtersActive()) viewResults();
  else viewSelection();
}

// ---------- Fiche ----------
function accessList(it) {
  const url = safeUrl(it.url);
  const out = [];
  if (url) {
    const host = new URL(url).hostname.replace(/^www\./, "");
    const label = host === "github.com" ? "Ouvrir le dépôt GitHub" : host === "huggingface.co" ? "Ouvrir sur Hugging Face" : host === "x.com" ? (it.article ? "Lire l'article" : "Voir le post X") : `Ouvrir ${host}`;
    out.push({ href: url, label });
  }
  if (safeUrl(it.post) && it.post !== it.url) out.push({ href: it.post, label: it.article ? "Lire l'article" : "Voir le post X" });
  for (const l of it.liens || []) if (safeUrl(l.url)) out.push({ href: l.url, label: l.label });
  out.push({ href: `https://duckduckgo.com/?q=${encodeURIComponent(it.nom)}`, label: "Chercher sur le web" });
  return out;
}
const svg = (d) => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"/></svg>`;
const ICO = { prec: svg("m15 5-7 7 7 7"), suiv: svg("m9 5 7 7-7 7"), fermer: svg("M6 6l12 12M18 6 6 18") };
const linkBtn = (l, primary) => `<a class="btn${primary ? " primary" : ""}" href="${esc(l.href)}" target="_blank" rel="noopener">${esc(l.label)}<span class="sr"> (nouvel onglet)</span></a>`;
function accessLinks(it, links) {
  const m = medias[it.slug] || {};
  const broken = safeUrl(it.url) && (m.status === 404 || m.status === 410);
  return links.map((l, i) => linkBtn(l, i === 0)).join("") + (broken ? `<p class="warn">Ce lien répondait ${m.status} lors de la dernière vérification : l'outil a peut-être changé d'adresse.</p>` : "");
}

function openFiche(slug, push = true) {
  const it = bySlug[slug];
  if (!it) return closeFiche(false);
  const m = medias[it.slug] || {};
  const img = coverUrl(it);
  const idx = lastList.findIndex((x) => x.slug === slug);
  const alts = sorted(items.filter((x) => x.theme === it.theme && x.slug !== it.slug && x.statut !== "Écarté")).slice(0, 5);
  const f = $("fiche");
  f.style.setProperty("--bind", colorOf(it));
  const links = accessList(it);
  f.innerHTML = `
    <header class="bande">
      <div class="bar"><span class="nav">${idx > 0 ? '<button type="button" data-step="-1" aria-label="Outil précédent">Précédent</button>' : ""}${idx >= 0 && idx < lastList.length - 1 ? '<button type="button" data-step="1" aria-label="Outil suivant">Suivant</button>' : ""}<button type="button" data-close>Fermer</button></span></div>
      <h2 id="fiche-titre" tabindex="-1">${logo(it)}${esc(it.nom)}</h2>
      <p class="ou">${esc(rayonOf[it.theme].nom)} › ${esc(it.theme)}${xDate(it) ? ` · publié sur X le ${esc(fmtDate(xDate(it)))}` : ""}</p>
    </header>
    <div class="body">
      ${it.accroche ? `<p class="acc">${esc(it.accroche)}</p>` : ""}
      <div class="tags">${pills(it, 4)}${it.licence ? `<span class="pill">${esc(it.licence)}</span>` : ""}${it.coeur ? '<span class="pill s-coeur">Coup de cœur</span>' : ""}</div>
      <div class="acces">${accessLinks(it, links)}<button class="btn" type="button" data-copy="${esc(location.origin + location.pathname.replace(/index\.html$/, "") + "outil/" + it.slug + "/")}">Copier le lien de la fiche</button></div>
      ${it.description ? `<h3>À quoi ça sert</h3><p>${esc(it.description)}</p>` : ""}
      ${(it.usage || []).length ? `<h3>Cas d'usage</h3><ul>${it.usage.map((u) => `<li>${esc(u)}</li>`).join("")}</ul>` : ""}
      ${it.offre ? `<h3>Offre et points d'attention</h3><p class="offre">${esc(it.offre)}</p>` : ""}
      ${img ? `<img class="apercu" src="${esc(img)}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove()">` : ""}
      ${alts.length ? `<h3>Dans le même rayon</h3><div class="alts">${alts.map((a) => `<a href="${hashFor({ outil: a.slug })}" data-outil="${esc(a.slug)}">${esc(a.nom)}</a>`).join("")}</div>` : ""}
      <p class="foot">${m.verifie ? `Lien vérifié le ${esc(fmtDate(new Date(m.verifie)))}. ` : ""}Cas d'usage rédigés avec une IA, à vérifier.</p>
    </div>
    <div class="pouce">${idx > 0 ? `<button class="btn ico" type="button" data-step="-1" aria-label="Outil précédent">${ICO.prec}</button>` : ""}${linkBtn(links[0], true)}${idx >= 0 && idx < lastList.length - 1 ? `<button class="btn ico" type="button" data-step="1" aria-label="Outil suivant">${ICO.suiv}</button>` : ""}<button class="btn ico" type="button" data-close aria-label="Fermer la fiche">${ICO.fermer}</button></div>`;
  f.hidden = false;
  $("veil").hidden = false;
  setInert(true);
  document.body.style.overflow = "hidden";
  state.outil = slug;
  if (push) history.pushState(null, "", hashFor());
  fichePoussee = push || fichePoussee;
  f.scrollTop = 0;
  f.classList.remove("defile");
  pouce?.disconnect();
  pouce = new IntersectionObserver(([e]) => f.classList.toggle("defile", !e.isIntersecting && e.boundingClientRect.top < 0), { root: f });
  pouce.observe(f.querySelector(".acces"));
  $("fiche-titre").focus({ preventScroll: true });
}

// Pendant la fiche, le reste de la page sort du parcours clavier et des lecteurs d'écran.
const setInert = (on) => document.querySelectorAll(".salle, .outils, main, footer, #haut, #rail").forEach((el) => { el.inert = on; });

function closeFiche(push = true) {
  // Fiche ouverte depuis la page : on revient en arrière plutôt que d'empiler une entrée de plus.
  if (push && fichePoussee) { fichePoussee = false; return history.back(); }
  const was = state.outil;
  $("fiche").hidden = true;
  $("veil").hidden = true;
  setInert(false);
  document.body.style.overflow = "";
  state.outil = "";
  if (push) replaceHash();
  if (!was) return;
  const back = lastFocus && document.contains(lastFocus) ? lastFocus : $("list").querySelector(`[data-outil="${CSS.escape(was)}"]`);
  if (back) back.focus();
  else { $("list").tabIndex = -1; $("list").focus({ preventScroll: true }); }
}

function step(d) {
  const i = lastList.findIndex((x) => x.slug === state.outil);
  const next = lastList[i + d];
  if (next) openFiche(next.slug, false), replaceHash();
}

// Après un changement de vue, le focus clavier suit le contenu affiché au lieu de retomber sur la page.
function focusList() {
  const h = $("list").querySelector("h2");
  if (h) { h.tabIndex = -1; h.focus({ preventScroll: true }); }
}

// ---------- Événements ----------
document.addEventListener("click", (e) => {
  if (e.target.closest("[data-evite]")) { e.preventDefault(); return $("q").focus(); }
  const o = e.target.closest("[data-outil]");
  if (o && !e.metaKey && !e.ctrlKey) {
    e.preventDefault();
    // Depuis la fiche (« Dans le même rayon »), on remplace la fiche au lieu d'empiler l'historique.
    if ($("fiche").contains(o)) { openFiche(o.dataset.outil, false); return replaceHash(); }
    lastFocus = o;
    return openFiche(o.dataset.outil);
  }
  const nv = e.target.closest("[data-vue]");
  if (nv) {
    state.vue = nv.dataset.vue; state.rayon = ""; state.theme = "";
    pushHash(); render();
    $("list").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    return focusList();
  }
  const r = e.target.closest("[data-rayon]");
  if (r) {
    state.rayon = state.rayon === r.dataset.rayon && r.classList.contains("dos") ? "" : r.dataset.rayon;
    state.theme = ""; state.vue = "";
    pushHash(); render();
    $("list").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    return focusList();
  }
  const t = e.target.closest("[data-theme]");
  if (t) {
    state.theme = t.dataset.theme; replaceHash(); render();
    return $("list").querySelector(`[data-theme="${CSS.escape(state.theme)}"]`)?.focus();
  }
  const c = e.target.closest("[data-chip]");
  if (c) {
    const id = c.dataset.chip;
    state.tarifs.has(id) ? state.tarifs.delete(id) : state.tarifs.add(id);
    replaceHash(); render();
    return $("chips").querySelector(`[data-chip="${CSS.escape(id)}"]`).focus();
  }
  if (e.target.closest("[data-home]") || e.target.closest("#home")) {
    e.preventDefault(); state.rayon = ""; state.theme = ""; state.vue = ""; state.q = ""; state.tarifs.clear();
    $("q").value = ""; $("source").value = "";
    pushHash(); render();
    return focusList();
  }
  if (e.target.closest("[data-partout]")) {
    state.rayon = ""; state.theme = ""; state.vue = "";
    pushHash(); render();
    return focusList();
  }
  if (e.target.closest("[data-clear]")) {
    state.q = ""; state.tarifs.clear(); $("q").value = ""; $("source").value = "";
    replaceHash(); render();
    return $("q").focus();
  }
  if (e.target.closest("[data-close]") || e.target.id === "veil") return closeFiche();
  const s = e.target.closest("[data-step]");
  if (s) return step(Number(s.dataset.step));
  const cp = e.target.closest("[data-copy]");
  if (cp) navigator.clipboard?.writeText(cp.dataset.copy).then(() => { cp.textContent = "Lien copié"; });
  if (e.target.id === "haut") window.scrollTo({ top: 0 });
});
document.addEventListener("keydown", (e) => {
  if (e.key === "/" && $("fiche").hidden && !e.target.closest("input, select, textarea")) { e.preventDefault(); return $("q").focus(); }
  if ($("fiche").hidden) return;
  if (e.key === "Escape") closeFiche();
  if (e.key === "ArrowRight") step(1);
  if (e.key === "ArrowLeft") step(-1);
});
window.addEventListener("popstate", () => {
  const was = state.outil;
  readHash(); render();
  if (state.outil) return openFiche(state.outil, false);
  fichePoussee = false;
  if (was && !$("fiche").hidden) { state.outil = was; closeFiche(false); }
});
$("q").addEventListener("input", () => { state.q = $("q").value.trim(); replaceHash(); render(); });
for (const id of ["source", "tri", "ecartes"]) $(id).addEventListener("input", render);
window.addEventListener("scroll", () => { $("haut").hidden = window.scrollY < 1200; }, { passive: true });
new ResizeObserver(sizeSpines).observe($("shelf"));
// Le rail apparaît quand l'étagère sort de l'écran, pour changer de rayon sans remonter.
new IntersectionObserver(([e]) => { $("rail").hidden = e.isIntersecting || !$("rail").childElementCount; }).observe($("shelf"));

// ---------- Chargement ----------
const getJSON = (u, then) => fetch(u, { cache: "no-cache" }).then((r) => (r.ok ? (then?.(r), r.json()) : Promise.reject(new Error(u))));
// Date de mise à jour : celle du dernier déploiement, donnée par l'en-tête Last-Modified du catalogue.
const majDe = (r) => {
  const d = new Date(r.headers.get("Last-Modified") || "");
  if (!isNaN(d)) $("maj").textContent = `Mis à jour le ${d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}`;
};
Promise.all([getJSON("data/outils.json", majDe), getJSON("data/rayons.json"), getJSON("data/medias.json").catch(() => ({}))])
  .then(([data, rs, md]) => {
    rayons = rs; medias = md;
    for (const r of rayons) for (const t of r.themes) rayonOf[t] = r;
    items = data.map((it) => ({ ...it, coeur: !!it.coeur, _hay: norm([it.nom, it.accroche, it.description, it.offre, it.theme, it.licence, ...(it.usage || []), ...(it.tags || [])].join(" ")) }));
    for (const it of items) bySlug[it.slug] = it;
    maxLot = Math.max(1, ...items.map((it) => it.lot || 1));
    readHash();
    render();
    if (state.outil) openFiche(state.outil, false);
    else if (state.rayon || state.vue || filtersActive()) $("list").scrollIntoView();
  })
  .catch(() => {
    $("list").innerHTML = `<div class="empty"><p>Le catalogue n'a pas pu se charger. Vérifiez votre connexion, puis rechargez la page.</p>
      <button class="link-btn" type="button" onclick="location.reload()">Recharger</button></div>`;
  });
