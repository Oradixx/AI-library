// AI library : charge data/outils.json, filtre et range côté client.
const $ = (id) => document.getElementById(id);
const FREE = new Set(["Gratuit", "Open source", "Étudiant", "Freemium", "Crédits"]);
// Couleurs de reliure, attribuées aux thèmes dans l'ordre alphabétique.
const BINDINGS = ["#3b5a7a", "#6b4a3a", "#2f6a5c", "#7a3b4f", "#5a5a2f", "#4a3f7a", "#80552a", "#2f5a3b", "#5f3b6b", "#3b6b7a", "#7a5f3b", "#44506a"];
let items = [];
let themes = [];
let theme = "";

const norm = (s) => (s || "").toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const esc = (s) => (s || "").toString().replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const safeUrl = (u) => (/^https?:\/\//.test(u || "") ? u : "");
const color = (t) => BINDINGS[themes.indexOf(t) % BINDINGS.length];

function fillSelect(sel, values) {
  for (const v of values) sel.insertAdjacentHTML("beforeend", `<option>${esc(v)}</option>`);
}

function readHash() {
  const p = new URLSearchParams(location.hash.slice(1));
  theme = p.get("theme") || "";
  $("q").value = p.get("q") || "";
}

function writeHash() {
  const p = new URLSearchParams();
  if (theme) p.set("theme", theme);
  if ($("q").value) p.set("q", $("q").value);
  history.replaceState(null, "", p.toString() ? "#" + p : location.pathname);
}

function filtered() {
  const q = norm($("q").value).split(/\s+/).filter(Boolean);
  const tarif = $("tarif").value, statut = $("statut").value, onlyFree = $("gratuit").checked, source = $("source").value;
  return items.filter((it) => {
    if (theme && it.theme !== theme) return false;
    if (source && !(it.source || "").includes(source)) return false;
    if (tarif && !(it.tarif || []).includes(tarif)) return false;
    if (statut && it.statut !== statut) return false;
    if (onlyFree && !(it.tarif || []).some((t) => FREE.has(t))) return false;
    return q.every((w) => it._hay.includes(w));
  });
}

function renderShelf() {
  const counts = {};
  for (const it of items) counts[it.theme] = (counts[it.theme] || 0) + 1;
  const max = Math.max(...Object.values(counts));
  const h = (n) => Math.round(150 + (n / max) * 110);
  $("shelf").innerHTML =
    `<button class="spine all" data-t="" aria-pressed="${!theme}" style="height:260px">Tout <small>${items.length}</small></button>` +
    themes.map((t) => `<button class="spine" data-t="${esc(t)}" aria-pressed="${t === theme}" style="height:${h(counts[t])}px;background:${color(t)}" title="${esc(t)} : ${counts[t]} entrées">${esc(t)} <small>${counts[t]}</small></button>`).join("");
}

function entry(it) {
  const url = safeUrl(it.url);
  const name = url ? `<a href="${esc(url)}" target="_blank" rel="noopener">${esc(it.nom)}</a>` : esc(it.nom);
  const meta = [
    ...(it.tarif || []).map((t) => `<span class="price t-${esc(t.replace(/\s/g, "-"))}">${esc(t)}</span>`),
    it.statut ? `<span class="statut s-${esc(it.statut)}">${esc(it.statut)}</span>` : "",
    it.licence ? `<span>${esc(it.licence)}</span>` : "",
    ...(it.tags || []).map((t) => `<span>#${esc(t)}</span>`),
  ].join("");
  return `<li class="entry">
    <h3>${name}</h3>
    <div class="what">
      ${it.description ? `<p>${esc(it.description)}</p>` : ""}
      ${it.offre ? `<p class="offre">${esc(it.offre)}</p>` : ""}
      ${safeUrl(it.post) ? `<p class="post"><a href="${esc(it.post)}" target="_blank" rel="noopener">Voir le post X</a></p>` : ""}
    </div>
    <div class="meta">${meta}</div>
  </li>`;
}

function block(title, list) {
  const sw = themes.includes(title) ? `<span class="swatch" style="background:${color(title)}"></span>` : "";
  return `<section class="theme-block"><h2>${sw}${esc(title)} <small>${list.length}</small></h2><ul class="entries">${list.map(entry).join("")}</ul></section>`;
}

function render() {
  writeHash();
  renderShelf();
  const list = filtered();
  const key = $("tri").value;
  const val = (it) => (key === "tarif" ? (it.tarif || [""])[0] : it[key] || "");
  list.sort((a, b) => val(a).localeCompare(val(b), "fr") || a.nom.localeCompare(b.nom, "fr"));
  $("count").textContent = `${list.length} sur ${items.length}`;

  if (!list.length) {
    $("list").innerHTML = `<p class="empty">Aucun outil ne correspond. Retirez un filtre ou essayez un autre mot.</p>`;
    return;
  }
  if (key === "nom") {
    $("list").innerHTML = block(theme || "Tous les outils", list);
    return;
  }
  const groups = {};
  const gk = key === "theme" ? (it) => it.theme : (it) => val(it) || "Sans statut";
  for (const it of list) (groups[gk(it)] ||= []).push(it);
  $("list").innerHTML = Object.keys(groups).sort((a, b) => a.localeCompare(b, "fr")).map((g) => block(g, groups[g])).join("");
}

fetch("data/outils.json").then((r) => r.json()).then((data) => {
  items = data.map((it) => ({ ...it, _hay: norm([it.nom, it.description, it.offre, it.theme, it.licence, ...(it.tags || [])].join(" ")) }));
  themes = [...new Set(items.map((i) => i.theme))].sort((a, b) => a.localeCompare(b, "fr"));
  fillSelect($("tarif"), [...new Set(items.flatMap((i) => i.tarif || []))].sort((a, b) => a.localeCompare(b, "fr")));
  fillSelect($("statut"), [...new Set(items.map((i) => i.statut).filter(Boolean))].sort((a, b) => a.localeCompare(b, "fr")));
  readHash();
  render();
}).catch(() => {
  $("list").innerHTML = `<p class="empty">Impossible de charger data/outils.json. Ouvrez la page via un serveur (GitHub Pages ou python3 -m http.server).</p>`;
});

$("shelf").addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  theme = b.dataset.t;
  render();
  $("list").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
});
for (const id of ["q", "tarif", "statut", "source", "tri", "gratuit"]) $(id).addEventListener("input", render);
