// AI library : 8 rayons, sélection de coups de cœur, recherche et fiche outil.
// Données : data/outils.json, data/rayons.json, data/medias.json (images, logos, état des liens).
const $ = (id) => document.getElementById(id);
const MAJ = "18 nov. 2026";
const REPO = "https://github.com/Oradixx/AI-library";
const CHIPS = [
  { id: "Gratuit", label: "Gratuit", match: ["Gratuit"] },
  { id: "Étudiant", label: "Étudiant", match: ["Étudiant"] },
  { id: "Open source", label: "Open source", match: ["Open source"] },
  { id: "Crédits", label: "Crédits offerts", match: ["Crédits", "Essai"] },
];
const RANK = { "À tester": 0, "À lire": 1, "": 2, "Noté": 2, "Écarté": 9 };

let items = [], rayons = [], medias = {}, bySlug = {}, rayonOf = {};
const state = { rayon: "", theme: "", q: "", tarifs: new Set(), outil: "" };
let lastList = [];
let lastFocus = null;

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
  $("q").value = state.q;
}
function hashFor(over = {}) {
  const s = { ...state, ...over };
  const p = new URLSearchParams();
  if (s.rayon) p.set("rayon", s.rayon);
  if (s.theme) p.set("theme", s.theme);
  if (s.q) p.set("q", s.q);
  if (s.tarifs.size) p.set("tarif", [...s.tarifs].join(","));
  if (s.outil) p.set("outil", s.outil);
  const h = p.toString();
  return h ? "#" + h : location.pathname + location.search;
}
const replaceHash = () => history.replaceState(null, "", hashFor());

// ---------- Filtres ----------
function filtered(ignoreRayon = false) {
  const words = norm(state.q).split(/\s+/).filter(Boolean);
  const statut = $("statut").value, source = $("source").value, showOut = $("ecartes").checked || statut === "Écarté";
  const wanted = CHIPS.filter((c) => state.tarifs.has(c.id)).flatMap((c) => c.match);
  return items.filter((it) => {
    if (!ignoreRayon && state.rayon && (rayonOf[it.theme] || {}).nom !== state.rayon) return false;
    if (!ignoreRayon && state.theme && it.theme !== state.theme) return false;
    if (!showOut && it.statut === "Écarté") return false;
    if (statut && it.statut !== statut) return false;
    if (source && !(it.source || "").includes(source)) return false;
    if (wanted.length && !(it.tarif || []).some((t) => wanted.includes(t))) return false;
    return words.every((w) => it._hay.includes(w));
  });
}
function sorted(list) {
  const byName = (a, b) => a.nom.localeCompare(b.nom, "fr");
  if ($("tri").value === "nom") return list.sort(byName);
  return list.sort((a, b) => (b.coeur - a.coeur) || ((RANK[a.statut] ?? 2) - (RANK[b.statut] ?? 2)) || byName(a, b));
}
const filtersActive = () => state.q || state.tarifs.size || $("statut").value || $("source").value;

// ---------- Rendu des petits éléments ----------
function logo(it, size = "") {
  const m = medias[it.slug] || {};
  const letter = esc((it.nom.match(/[A-Za-z0-9À-ÿ]/) || ["?"])[0].toUpperCase());
  const mono = `<span class="mono" style="background:${colorOf(it)}" aria-hidden="true">${letter}</span>`;
  if (!m.logo || isSkill(it)) return mono;
  return `<img class="logo" src="${esc(m.logo)}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.outerHTML=this.dataset.f" data-f='${mono.replace(/'/g, "&#39;")}'>`;
}
function pills(it, max = 3) {
  const tarifs = rayonName(it) === "Lire et apprendre" ? (it.tarif || []).filter((t) => t !== "Gratuit") : it.tarif || [];
  const out = tarifs.slice(0, max).map((t) => `<span class="pill t-${esc(t.replace(/\s/g, "-"))}">${esc(t)}</span>`);
  if (it.statut === "À tester" || it.statut === "Écarté") out.push(`<span class="pill s-${esc(it.statut)}">${esc(it.statut)}</span>`);
  return out.join("");
}
// Images : jamais pour les skills (sauf coups de cœur) ; bannière d'abord pour les articles et lectures.
function coverUrl(it) {
  if (isSkill(it) && !it.coeur) return "";
  const site = (medias[it.slug] || {}).image || "";
  return it.article || rayonName(it) === "Lire et apprendre" ? it.image_post || site : site || it.image_post || "";
}
const accroche = (it) => it.accroche || it.description || "";

function row(it) {
  const reading = rayonName(it) === "Lire et apprendre";
  const thumb = reading && coverUrl(it);
  const visual = thumb ? `<img class="thumb" src="${esc(thumb)}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.style.visibility='hidden'">` : logo(it);
  return `<li class="entry${reading ? " reading" : ""}"><a href="${hashFor({ outil: it.slug })}" data-outil="${esc(it.slug)}">
    ${visual}
    <span><span class="nom">${esc(it.nom)}</span>${it.coeur ? ' <span class="coeur-mark">Coup de cœur</span>' : ""}<span class="acc">${esc(accroche(it))}</span></span>
    <span class="tags">${pills(it)}</span>
  </a></li>`;
}
function pick(it) {
  const img = coverUrl(it);
  const letter = esc(it.nom.replace(/[^A-Za-z0-9]/g, "").slice(0, 2) || "AI");
  const cover = img
    ? `<img src="${esc(img)}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.outerHTML='<div class=&quot;cover-mono&quot;>${letter}</div>'">`
    : `<div class="cover-mono">${letter}</div>`;
  return `<a class="pick" href="${hashFor({ outil: it.slug })}" data-outil="${esc(it.slug)}" style="--bind:${colorOf(it)}">
    ${cover}<span class="txt"><span class="nom">${esc(it.nom)}</span><span class="acc">${esc(accroche(it))}</span><span class="tags">${pills(it, 2)}</span></span></a>`;
}

// ---------- Vues ----------
function renderShelf() {
  const counts = {}, tcounts = {};
  for (const it of items) if (it.statut !== "Écarté") {
    const rn = rayonOf[it.theme].nom;
    counts[rn] = (counts[rn] || 0) + 1;
    tcounts[it.theme] = (tcounts[it.theme] || 0) + 1;
  }
  const mobile = matchMedia("(max-width: 760px)").matches;
  const shelf = $("shelf");
  // Chaque rayon = un grand livre titré, suivi de ses tomes (un par sous-thème, visibles sur grand écran).
  // Les largeurs se répartissent pour remplir toute l'étagère ; les hauteurs grandissent un peu sur les très grands écrans.
  const k = mobile ? 1 : Math.min(1.22, Math.max(1, (shelf.clientWidth || 1184) / 1400));
  const heights = (mobile ? [238, 216, 250, 208, 232, 246, 220, 240] : [372, 336, 388, 318, 358, 382, 342, 366]).map((h) => Math.round(h * k));
  const roots = rayons.map((r) => Math.sqrt(counts[r.nom] || 1));
  const lo = Math.min(...roots), hi = Math.max(...roots);
  const SHADES = ["#000 16%", "#fff 9%", "#000 7%", "#fff 15%", "#000 22%", "#fff 4%"];
  shelf.innerHTML = rayons.map((r, i) => {
    const n = counts[r.nom] || 0;
    const h = heights[i % heights.length];
    const grow = (50 + ((roots[i] - lo) / (hi - lo || 1)) * 34).toFixed(1);
    const main = `<button class="spine" type="button" data-rayon="${esc(r.nom)}" aria-pressed="${state.rayon === r.nom}"
      style="--c:${r.couleur};--g:${grow};height:${h}px" title="${esc(r.nom)} : ${n} outils">${esc(r.nom)} <small>${n}</small></button>`;
    const subs = r.themes.filter((t) => t !== "Écartés" && tcounts[t]);
    const vols = subs.length < 2 ? "" : subs.map((t, j) => {
      const on = state.rayon === r.nom && state.theme === t ? " on" : "";
      return `<button class="spine vol${on}" type="button" tabindex="-1" data-vol="${esc(t)}" data-rayon-of="${esc(r.nom)}"
        aria-label="${esc(r.nom)}, ${esc(t)} : ${tcounts[t]} outils" title="${esc(t)} : ${tcounts[t]} outils"
        style="--c:color-mix(in srgb, ${r.couleur}, ${SHADES[j % SHADES.length]});--g:${(10 + Math.sqrt(tcounts[t]) * 2.2).toFixed(1)};height:${h}px"></button>`;
    }).join("");
    return main + vols;
  }).join("") + '<span class="bookend" aria-hidden="true"></span>';
}

function renderChips() {
  $("chips").innerHTML = CHIPS.map((c) => `<button class="chip" type="button" data-chip="${esc(c.id)}" aria-pressed="${state.tarifs.has(c.id)}">${esc(c.label)}</button>`).join("");
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
      <div class="picks">${[...top, ...fill].map(pick).join("")}</div>
    </section>`;
  }).join("");
  $("list").innerHTML = blocks;
  $("count").textContent = `Sélection de coups de cœur. ${items.length} outils au total.`;
  lastList = rayons.flatMap((r) => sorted(items.filter((it) => rayonOf[it.theme].nom === r.nom && it.coeur)));
}

function groupBlock(title, list, level = "h3") {
  return `<${level} class="sub">${esc(title)} <small>${list.length}</small></${level}><ul class="entries">${list.map(row).join("")}</ul>`;
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
  if (!list.length) body = `<p class="empty">Aucun outil ne correspond dans ce rayon. Retirez un filtre ou cherchez un autre mot.</p>`;
  else if (state.theme || !multi || $("tri").value === "nom") body = `<ul class="entries">${list.map(row).join("")}</ul>`;
  else body = r.themes.map((t) => list.filter((it) => it.theme === t)).filter((g) => g.length).map((g) => groupBlock(g[0].theme, g)).join("");
  $("list").innerHTML = `<div class="rayon-head"><span class="swatch" style="background:${r.couleur}"></span><h2>${esc(r.nom)}</h2>
    <button class="link-btn" type="button" data-home>Revenir à la sélection</button></div>
    <div class="tabs" role="group" aria-label="Sous-thèmes">${tabs}</div>${body}`;
  $("count").textContent = `${list.length} outil(s) dans ${r.nom}`;
  lastList = state.theme || $("tri").value === "nom" ? list : r.themes.flatMap((t) => list.filter((it) => it.theme === t));
}

function viewResults() {
  const list = sorted(filtered(true));
  if (!list.length) {
    $("list").innerHTML = `<p class="empty">Aucun outil ne correspond. Retirez un filtre ou essayez un autre mot.</p>`;
    $("count").textContent = "0 résultat";
    lastList = [];
    return;
  }
  $("list").innerHTML = rayons.map((r) => {
    const g = list.filter((it) => rayonOf[it.theme].nom === r.nom);
    return g.length ? `<div class="rayon-head"><span class="swatch" style="background:${r.couleur}"></span><h2>${esc(r.nom)}</h2></div><ul class="entries">${g.map(row).join("")}</ul>` : "";
  }).join("");
  $("count").textContent = `${list.length} résultat(s)`;
  lastList = rayons.flatMap((r) => list.filter((it) => rayonOf[it.theme].nom === r.nom));
}

function render() {
  renderShelf();
  renderChips();
  if (state.rayon) viewRayon();
  else if (filtersActive()) viewResults();
  else viewSelection();
}

// ---------- Fiche ----------
function accessLinks(it) {
  const m = medias[it.slug] || {};
  const url = safeUrl(it.url);
  const out = [];
  if (url) {
    const host = new URL(url).hostname.replace(/^www\./, "");
    const label = host === "github.com" ? "Ouvrir le dépôt GitHub" : host === "huggingface.co" ? "Ouvrir sur Hugging Face" : host === "x.com" ? (it.article ? "Lire l'article" : "Voir le post X") : `Ouvrir ${host}`;
    out.push(`<a class="btn primary" href="${esc(url)}" target="_blank" rel="noopener">${esc(label)}</a>`);
  }
  if (safeUrl(it.post) && it.post !== it.url) out.push(`<a class="btn${url ? "" : " primary"}" href="${esc(it.post)}" target="_blank" rel="noopener">${it.article ? "Lire l'article" : "Voir le post X"}</a>`);
  const search = `https://duckduckgo.com/?q=${encodeURIComponent(it.nom)}`;
  out.push(`<a class="btn${url || it.post ? "" : " primary"}" href="${search}" target="_blank" rel="noopener">Chercher sur le web</a>`);
  const broken = url && (m.status === 404 || m.status === 410);
  return out.join("") + (broken ? `<p class="warn">Ce lien répondait ${m.status} lors de la dernière vérification : l'outil a peut-être changé d'adresse.</p>` : "");
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
  f.innerHTML = `
    ${img ? `<img class="cover" src="${esc(img)}" alt="" referrerpolicy="no-referrer" onerror="this.remove()">` : ""}
    <div class="body">
      <div class="bar"><span>${esc(rayonOf[it.theme].nom)} › ${esc(it.theme)}</span>
        <span class="nav">${idx > 0 ? '<button type="button" data-step="-1" aria-label="Outil précédent">Précédent</button>' : ""}${idx >= 0 && idx < lastList.length - 1 ? '<button type="button" data-step="1" aria-label="Outil suivant">Suivant</button>' : ""}<button type="button" data-close>Fermer</button></span></div>
      <h2 id="fiche-titre" tabindex="-1">${logo(it)}${esc(it.nom)}</h2>
      ${it.accroche ? `<p class="acc">${esc(it.accroche)}</p>` : ""}
      <div class="tags">${pills(it, 4)}${it.licence ? `<span class="pill">${esc(it.licence)}</span>` : ""}${it.coeur ? '<span class="pill s-coeur">Coup de cœur</span>' : ""}</div>
      ${it.description ? `<h3>À quoi ça sert</h3><p>${esc(it.description)}</p>` : ""}
      ${(it.usage || []).length ? `<h3>Cas d'usage</h3><ul>${it.usage.map((u) => `<li>${esc(u)}</li>`).join("")}</ul>` : ""}
      ${it.offre ? `<h3>Offre et points d'attention</h3><p class="offre">${esc(it.offre)}</p>` : ""}
      <div class="acces">${accessLinks(it)}</div>
      ${alts.length ? `<h3>Dans le même rayon</h3><div class="alts">${alts.map((a) => `<a href="${hashFor({ outil: a.slug })}" data-outil="${esc(a.slug)}">${esc(a.nom)}</a>`).join("")}</div>` : ""}
      <p class="foot">${m.verifie ? `Lien vérifié le ${esc(new Date(m.verifie).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }))}. ` : ""}Cas d'usage rédigés avec une IA, à vérifier.<br>
        <button class="btn" type="button" data-copy="${esc(location.origin + location.pathname.replace(/index\.html$/, "") + "outil/" + it.slug + "/")}">Copier le lien de la fiche</button></p>
    </div>`;
  f.hidden = false;
  $("veil").hidden = false;
  document.body.style.overflow = "hidden";
  state.outil = slug;
  if (push) history.pushState(null, "", hashFor());
  f.scrollTop = 0;
  $("fiche-titre").focus({ preventScroll: true });
}

function closeFiche(push = true) {
  $("fiche").hidden = true;
  $("veil").hidden = true;
  document.body.style.overflow = "";
  state.outil = "";
  if (push) history.pushState(null, "", hashFor());
  if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
}

function step(d) {
  const i = lastList.findIndex((x) => x.slug === state.outil);
  const next = lastList[i + d];
  if (next) openFiche(next.slug, false), replaceHash();
}

// ---------- Événements ----------
document.addEventListener("click", (e) => {
  const o = e.target.closest("[data-outil]");
  if (o && !e.metaKey && !e.ctrlKey) {
    e.preventDefault();
    if (!$("fiche").contains(o)) lastFocus = o;
    return openFiche(o.dataset.outil);
  }
  const v = e.target.closest("[data-vol]");
  if (v) {
    state.rayon = v.dataset.rayonOf;
    state.theme = v.dataset.vol;
    replaceHash(); render();
    $("list").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    return;
  }
  const r = e.target.closest("[data-rayon]");
  if (r) {
    state.rayon = state.rayon === r.dataset.rayon && r.classList.contains("spine") ? "" : r.dataset.rayon;
    state.theme = "";
    replaceHash(); render();
    $("list").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    return;
  }
  const t = e.target.closest("[data-theme]");
  if (t) { state.theme = t.dataset.theme; replaceHash(); return render(); }
  const c = e.target.closest("[data-chip]");
  if (c) { const id = c.dataset.chip; state.tarifs.has(id) ? state.tarifs.delete(id) : state.tarifs.add(id); replaceHash(); return render(); }
  if (e.target.closest("[data-home]") || e.target.id === "home") {
    e.preventDefault(); state.rayon = ""; state.theme = ""; replaceHash(); return render();
  }
  if (e.target.closest("[data-close]") || e.target.id === "veil") return closeFiche();
  const s = e.target.closest("[data-step]");
  if (s) return step(Number(s.dataset.step));
  const cp = e.target.closest("[data-copy]");
  if (cp) navigator.clipboard?.writeText(cp.dataset.copy).then(() => { cp.textContent = "Lien copié"; });
  if (e.target.id === "haut") window.scrollTo({ top: 0 });
});
document.addEventListener("keydown", (e) => {
  if ($("fiche").hidden) return;
  if (e.key === "Escape") closeFiche();
  if (e.key === "ArrowRight") step(1);
  if (e.key === "ArrowLeft") step(-1);
});
window.addEventListener("popstate", () => {
  readHash(); render();
  state.outil ? openFiche(state.outil, false) : closeFiche(false);
});
$("q").addEventListener("input", () => { state.q = $("q").value.trim(); replaceHash(); render(); });
for (const id of ["statut", "source", "tri", "ecartes"]) $(id).addEventListener("input", render);
window.addEventListener("scroll", () => { $("haut").hidden = window.scrollY < 1200; }, { passive: true });
let shelfFrame = 0;
window.addEventListener("resize", () => { cancelAnimationFrame(shelfFrame); shelfFrame = requestAnimationFrame(renderShelf); });

// ---------- Chargement ----------
const getJSON = (u) => fetch(u).then((r) => (r.ok ? r.json() : Promise.reject(new Error(u))));
Promise.all([getJSON("data/outils.json"), getJSON("data/rayons.json"), getJSON("data/medias.json").catch(() => ({}))])
  .then(([data, rs, md]) => {
    rayons = rs; medias = md;
    for (const r of rayons) for (const t of r.themes) rayonOf[t] = r;
    items = data.map((it) => ({ ...it, coeur: !!it.coeur, _hay: norm([it.nom, it.accroche, it.description, it.offre, it.theme, it.licence, ...(it.usage || []), ...(it.tags || [])].join(" ")) }));
    for (const it of items) bySlug[it.slug] = it;
    const statuts = [...new Set(items.map((i) => i.statut).filter(Boolean))].sort((a, b) => a.localeCompare(b, "fr"));
    for (const s of statuts) $("statut").insertAdjacentHTML("beforeend", `<option>${esc(s)}</option>`);
    $("maj").textContent = `Mis à jour le ${MAJ}`;
    readHash();
    render();
    if (state.outil) openFiche(state.outil, false);
  })
  .catch(() => {
    $("list").innerHTML = `<p class="empty">Impossible de charger les données. Ouvrez la page via un serveur (GitHub Pages ou python3 -m http.server).</p>`;
  });
