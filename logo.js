// Titre : deux pièces de laiton, « AI » posé à plat et « library » posé en biais sur le pied du l et la boucle du y.
// Les lettres de chaque pièce se touchent ; le relief suit le point de fuite du dessus du meuble.
(() => {
  const FONTE = "'Alfa Slab One'", POIDS = 400, NOM = "AI library";
  const TEINTES = ["#5c4216", "#6f511c", "#826022", "#966f28", "#aa7e2f", "#bf8f37", "#f4d27e"];
  const logo = document.getElementById("logo"), h1 = logo.closest("h1"), tete = h1.closest(".tete");
  const cv = document.createElement("canvas"), cx = cv.getContext("2d", { willReadFrequently: true });

  function dessiner() {
    const base = parseFloat(getComputedStyle(h1).fontSize);
    // Hauteur de capitale fixée à 0,68 de la taille du titre.
    cx.font = `${POIDS} 100px ${FONTE}`;
    const fs = base * 0.68 * 100 / cx.measureText("A").actualBoundingBoxAscent;
    const font = `${POIDS} ${fs}px ${FONTE}`, pad = Math.ceil(fs * 0.5);
    const H = Math.ceil(fs * 2), B = Math.ceil(fs * 1.4);
    const lire = (draw, width) => {
      cv.width = Math.ceil(width); cv.height = H; cx.font = font; draw();
      return cx.getImageData(0, 0, cv.width, H).data;
    };
    // Encre d'un glyphe : bords gauche et droit, ligne par ligne.
    const encre = (c) => {
      cx.font = font;
      const adv = cx.measureText(c).width, d = lire(() => cx.fillText(c, pad, B), adv + 2 * pad), L = [], R = [];
      for (let y = 0; y < H; y++) for (let x = 0; x < cv.width; x++) if (d[(y * cv.width + x) * 4 + 3] > 90) { L[y] ??= x - pad; R[y] = x - pad; }
      return { L, R, adv };
    };
    // Une pièce : lettres rapprochées jusqu'à se toucher, posée sur l'arête d'appui qui passe sous son centre de gravité.
    const piece = (mot) => {
      const chars = [...mot], g = chars.map(encre), xs = [0], o = fs * 0.008;
      for (let i = 1; i < chars.length; i++) {
        let m = -Infinity;
        for (let y = 0; y < H; y++) if (g[i - 1].R[y] != null && g[i].L[y] != null) m = Math.max(m, g[i - 1].R[y] - g[i].L[y]);
        xs[i] = xs[i - 1] + (m === -Infinity ? g[i - 1].adv : m - o);
      }
      const d = lire(() => chars.forEach((c, i) => cx.fillText(c, xs[i] + pad, B)), xs.at(-1) + g.at(-1).adv + 2 * pad), wd = cv.width;
      const bas = [], haut = [], cols = [];
      let sx = 0, n = 0;
      for (let x = 0; x < wd; x++) for (let y = 0; y < H; y++) if (d[(y * wd + x) * 4 + 3] > 90) { if (haut[x] == null) { haut[x] = y; cols.push(x); } bas[x] = y; sx += x; n++; }
      const hull = [];
      for (const x of cols) {
        const p = [x, bas[x]];
        while (hull.length > 1) { const [a, b] = hull.slice(-2); if ((b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]) >= 0) hull.pop(); else break; }
        hull.push(p);
      }
      const gx = sx / n;
      let P = hull[0], Q = hull.at(-1);
      for (let i = 0; i < hull.length - 1; i++) if (hull[i][0] <= gx && hull[i + 1][0] >= gx) { P = hull[i]; Q = hull[i + 1]; }
      return { chars, xs, bas, haut, cols, P, th: Math.atan2(Q[1] - P[1], Q[0] - P[0]) };
    };
    const pieces = NOM.split(" ").map(piece);
    const C = Math.max(...pieces.map((p) => p.P[1]));
    // Chaque pièce à droite de la précédente, son appui gauche ramené sur la ligne du bois.
    let curseur = 0;
    pieces.forEach((p, k) => {
      p.dx = k ? curseur - p.cols[0] + fs * 0.26 : -p.cols[0];
      p.dy = C - p.P[1];
      const c = Math.cos(p.th), s = Math.sin(p.th);
      p.rot = (x, y) => [p.P[0] + (x - p.P[0]) * c + (y - p.P[1]) * s + p.dx, p.P[1] - (x - p.P[0]) * s + (y - p.P[1]) * c + p.dy];
      curseur = Math.max(...p.cols.map((x) => p.rot(x, p.bas[x])[0]));
    });
    const prof = Math.max(4, Math.min(7, Math.round(fs * 0.07)));
    let X0 = Infinity, X1 = -Infinity, Y0 = Infinity;
    const ombre = [];
    for (const p of pieces) for (const x of p.cols) {
      const [ax, ay] = p.rot(x, p.haut[x]), [bx, by] = p.rot(x, p.bas[x]);
      X0 = Math.min(X0, ax, bx); X1 = Math.max(X1, ax, bx); Y0 = Math.min(Y0, ay);
      if (x % 2 === 0) ombre.push([bx, C - by]);
    }
    const vx = X0 - 4, vy = Y0 - prof - 6, vw = X1 + prof + 8 - vx, vh = C - vy;
    const texte = (p, cls) => `<text class="${cls}" x="${p.xs.map((v) => (v + pad).toFixed(1)).join(" ")}" y="${B}">${p.chars.join("")}</text>`;
    const pose = (p, cls) => `<g transform="translate(${p.dx.toFixed(1)} ${p.dy.toFixed(1)}) rotate(${(-p.th * 180 / Math.PI).toFixed(3)} ${p.P[0]} ${p.P[1]})">${texte(p, cls)}</g>`;
    // Ombre de contact : d'autant plus sombre que le laiton est près du bois.
    const contact = ombre.map(([x, gap]) => {
      const a = Math.max(0, 0.7 - gap * 0.12);
      return a ? `<rect x="${(x - 1).toFixed(1)}" y="${C - 1.5}" width="3" height="${(2.5 + gap * 0.25).toFixed(1)}" opacity="${a.toFixed(2)}"/>` : "";
    }).join("");
    logo.innerHTML = `<svg width="${Math.round(vw)}" height="${Math.round(vh)}" viewBox="${vx.toFixed(1)} ${vy.toFixed(1)} ${vw.toFixed(1)} ${vh.toFixed(1)}" style="font:${font}" aria-hidden="true">
      <defs><filter id="logo-flou" x="-10%" y="-300%" width="120%" height="700%"><feGaussianBlur stdDeviation="1.3"/></filter>
      <filter id="logo-porte" x="-5%" y="-20%" width="115%" height="140%"><feDropShadow dx="3" dy="-2" stdDeviation="2" flood-opacity="0.4"/></filter></defs>
      <g filter="url(#logo-flou)">${contact}</g><g filter="url(#logo-porte)"></g></svg>`;
    // Point de fuite du dessus du meuble : ses bords rentrent de 1,4 % de la largeur sur 20 px de haut.
    const svg = logo.firstElementChild, r = svg.getBoundingClientRect(), t = tete.getBoundingClientRect();
    const fx = vx + t.left + t.width / 2 - r.left, fy = vy + t.bottom - 20 / 0.028 - r.top;
    const e = prof * 1.15 / Math.hypot(fx - pieces[0].P[0], fy - C);
    // Épaisseur : chaque couche est la face réduite vers le point de fuite, du fond vers l'avant.
    const couches = TEINTES.slice(-prof).map((teinte, i) => {
      const k = 1 - (prof - i) / prof * e;
      return `<g fill="${teinte}" transform="translate(${fx.toFixed(1)} ${fy.toFixed(1)}) scale(${k.toFixed(5)}) translate(${(-fx).toFixed(1)} ${(-fy).toFixed(1)})">${pieces.map((p) => pose(p, "")).join("")}</g>`;
    }).join("");
    svg.lastElementChild.innerHTML = couches + pieces.map((p) => pose(p, "face")).join("");
  }

  let attente = 0, largeur = 0;
  const redessiner = () => { cancelAnimationFrame(attente); attente = requestAnimationFrame(dessiner); };
  document.fonts.load(`${POIDS} 96px ${FONTE}`).then(() => {
    dessiner();
    // La taille du titre et la position du point de fuite changent avec la largeur.
    new ResizeObserver(([en]) => { if (en.contentRect.width !== largeur) { largeur = en.contentRect.width; redessiner(); } }).observe(tete);
  });
})();
