// Omniguard landing page. Progressive enhancement only.
// The inline head script un-hides .rv content if this flag never gets set.
window.cmReady = true;

// "Previous lowest price (30 days):" exactly as the theme block ships it,
// from extensions/omniguard-badge/locales/*.json.
const LABELS = [
  ["EN", "Previous lowest price (30 days):"],
  ["DE", "Vorheriger niedrigster Preis (30 Tage):"],
  ["FR", "Prix le plus bas précédent (30 jours) :"],
  ["ES", "Precio más bajo anterior (30 días):"],
  ["IT", "Prezzo più basso precedente (30 giorni):"],
  ["PL", "Poprzednia najniższa cena (30 dni):"],
  ["NL", "Vorige laagste prijs (30 dagen):"],
  ["LT", "Ankstesnė mažiausia kaina (30 d.):"],
  ["PT", "Preço mais baixo anterior (30 dias):"],
  ["SV", "Tidigare lägsta pris (30 dagar):"],
  ["DA", "Tidligere laveste pris (30 dage):"],
  ["NB", "Tidligere laveste pris (30 dager):"],
  ["FI", "Aiempi alin hinta (30 pv):"],
  ["CS", "Předchozí nejnižší cena (30 dní):"],
  ["SK", "Predchádzajúca najnižšia cena (30 dní):"],
  ["HU", "Korábbi legalacsonyabb ár (30 nap):"],
  ["RO", "Cel mai mic preț anterior (30 zile):"],
  ["EL", "Προηγούμενη χαμηλότερη τιμή (30 ημέρες):"],
  ["ET", "Varasem madalaim hind (30 päeva):"],
  ["LV", "Iepriekšējā zemākā cena (30 dienas):"],
];

const eur = new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" });
const el = (tag, attrs = {}, text) => {
  const n = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  if (text != null) n.textContent = text;
  return n;
};

// Reveal on scroll
(() => {
  const els = document.querySelectorAll(".rv");
  if (!("IntersectionObserver" in window)) return els.forEach((e) => e.classList.add("in"));
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    },
    { rootMargin: "0px 0px -8% 0px" },
  );
  els.forEach((e) => io.observe(e));
})();

// Nav switches from transparent-on-green to solid once past the hero top
(() => {
  const nav = document.getElementById("nav");
  const set = () => nav.classList.toggle("stuck", scrollY > 40);
  set();
  addEventListener("scroll", set, { passive: true });
})();

// ── Price lab ────────────────────────────────────────────────────────────
(() => {
  const lab = document.getElementById("lab");
  if (!lab) return;

  // The 30 days before today, oldest first.
  const HISTORY = [
    ...Array(11).fill(1025),
    ...Array(7).fill(949),
    ...Array(5).fill(820),
    ...Array(7).fill(899),
  ];
  const WAS = 1025; // compare-at price on the product
  const LOW = Math.min(...HISTORY);

  const svg = lab.querySelector("svg.plot");
  const range = lab.querySelector("input[type=range]");
  const out = lab.querySelector("output");
  const now = lab.querySelector(".now");
  const was = lab.querySelector(".was");
  const off = lab.querySelector(".off");
  const ref = lab.querySelector(".pdp-ref");
  const refLabel = ref.querySelector("span");
  const refPrice = ref.querySelector("b");
  const vIcon = lab.querySelector(".verdict .ic");
  const vTitle = lab.querySelector(".verdict b");
  const vText = lab.querySelector(".verdict span");
  const lowOut = lab.querySelector("[data-low]");

  const W = 560, X0 = 24, X1 = 508, TOP = 14, BASE = 158, PMIN = 640, PMAX = 1050;
  const x = (i) => X0 + (i * (X1 - X0)) / HISTORY.length;
  const y = (p) => TOP + ((PMAX - p) / (PMAX - PMIN)) * (BASE - TOP);
  const TX = x(HISTORY.length) + 22;

  let d = `M${x(0)} ${y(HISTORY[0])}`;
  HISTORY.forEach((p, i) => {
    d += `H${x(i + 1)}`;
    if (HISTORY[i + 1] != null) d += `V${y(HISTORY[i + 1])}`;
  });

  const defs = el("defs");
  const grad = el("linearGradient", { id: "og-area", x1: 0, y1: 0, x2: 0, y2: 1 });
  grad.append(
    el("stop", { offset: 0, "stop-color": "#0f6e50", "stop-opacity": 0.18 }),
    el("stop", { offset: 1, "stop-color": "#0f6e50", "stop-opacity": 0 }),
  );
  defs.append(grad);

  const todayLine = el("line", { class: "c-today-line", x1: TX, x2: TX, y2: BASE });
  const todayDot = el("circle", { class: "c-today", cx: TX, r: 7 });
  const todayLabel = el("text", { class: "c-todaylabel", x: TX, y: BASE + 18, "text-anchor": "middle" }, "today");

  svg.append(
    defs,
    el("path", { class: "c-area", d: `${d}V${BASE}H${x(0)}Z` }),
    el("line", { class: "c-low", x1: x(0), x2: W - 8, y1: y(LOW), y2: y(LOW) }),
    el("text", { class: "c-lowlabel", x: x(0) + 4, y: y(LOW) + 15 }, "30-day low"),
    el("path", { class: "c-line", d, pathLength: 1 }),
    todayLine,
    todayDot,
    todayLabel,
    el("text", { class: "c-axis", x: x(0), y: BASE + 18 }, "30 days ago"),
  );
  lowOut.textContent = eur.format(LOW);
  refPrice.textContent = eur.format(LOW);
  was.textContent = eur.format(WAS);

  const render = () => {
    const p = Number(range.value);
    const state = p >= WAS ? "none" : p > LOW ? "warn" : "good";
    lab.dataset.state = state;
    range.style.setProperty("--fill", `${((p - range.min) / (range.max - range.min)) * 100}%`);

    out.textContent = eur.format(p);
    now.textContent = eur.format(p);
    todayDot.setAttribute("cy", y(p));
    todayLine.setAttribute("y1", y(p));

    const discounted = p < WAS;
    was.hidden = off.hidden = ref.hidden = !discounted;
    off.textContent = `−${Math.round((1 - p / WAS) * 100)}%`;

    if (state === "good") {
      const pct = Math.round((1 - p / LOW) * 100);
      vIcon.textContent = "✓";
      vTitle.textContent = pct > 0 ? `Genuine discount — ${pct}% under the 30-day low` : "Matches the 30-day low";
      vText.textContent = "Omniguard publishes the reference price to your theme. Nothing for you to do.";
    } else if (state === "warn") {
      vIcon.textContent = "!";
      vTitle.textContent = "Above 30-day low";
      vText.textContent = `Shoppers will see ${eur.format(LOW)} right under your "sale" price. Omniguard flags this product in your admin.`;
    } else {
      vIcon.textContent = "–";
      vTitle.textContent = "No discount announced";
      vText.textContent = "Full price, so there is no reduction to explain. The label stays hidden unless you choose to always show it.";
    }
  };

  range.addEventListener("input", () => {
    lab.classList.add("touched");
    render();
  });
  render();

  // Language chips swap the label wording
  const chips = lab.querySelector(".langs");
  LABELS.slice(0, 6).forEach(([code, text], i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = code;
    b.setAttribute("aria-pressed", String(i === 0));
    b.setAttribute("aria-label", `Show label in ${code}`);
    b.addEventListener("click", () => {
      chips.querySelectorAll("button").forEach((o) => o.setAttribute("aria-pressed", String(o === b)));
      ref.classList.add("swap");
      setTimeout(() => {
        refLabel.textContent = text;
        ref.classList.remove("swap");
      }, 180);
    });
    chips.append(b);
  });
})();

// Rolling list of all 20 translations (duplicated for a seamless loop)
(() => {
  const ul = document.getElementById("roller");
  if (!ul) return;
  const row = ([code, text]) => {
    const li = document.createElement("li");
    const s = document.createElement("span");
    const d = document.createElement("div");
    s.textContent = code;
    d.textContent = `${text} €820.00`;
    li.append(s, d);
    return li;
  };
  ul.append(...LABELS.map(row), ...LABELS.map(row));
})();

// Screenshot gallery arrows
(() => {
  const gal = document.getElementById("gal");
  if (!gal) return;
  const step = (dir) => {
    const fig = gal.querySelector("figure");
    gal.scrollBy({ left: dir * (fig.offsetWidth + 20), behavior: "smooth" });
  };
  document.getElementById("gal-prev").addEventListener("click", () => step(-1));
  document.getElementById("gal-next").addEventListener("click", () => step(1));
})();

// ── Free compliance check ────────────────────────────────────────────────
// Calls the public endpoint in the Omniguard app (app/routes/api.compliance-check.tsx).
(() => {
  const form = document.getElementById("check-form");
  const out = document.getElementById("check-out");
  if (!form || !out) return;
  const input = form.querySelector("input");
  const button = form.querySelector("button");
  const idle = out.innerHTML;

  // In local preview, talk to the app started with `npm run local`.
  const local = ["localhost", "127.0.0.1"].includes(location.hostname);
  const endpoint = local ? "http://localhost:3210/api/compliance-check" : form.dataset.endpoint;

  const h = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };
  const SYMBOL = { pass: "✓", fail: "✕", partial: "!", unknown: "?", skipped: "–" };

  const showLoading = (host) => {
    const box = h("div", "check-load");
    const line = h("div", null, `Opening ${host}…`);
    box.append(h("div", "spin"), line);
    out.replaceChildren(box);
    const steps = ["Reading the product catalogue…", "Opening discounted products…", "Looking through the footer…", "Almost done…"];
    let i = 0;
    return setInterval(() => { if (i < steps.length) line.textContent = steps[i++]; }, 1400);
  };

  const showError = (title, message) => {
    const box = h("div", "res-error");
    const again = h("button", "linkbtn", "Show what we check");
    again.type = "button";
    again.addEventListener("click", () => { out.innerHTML = idle; });
    box.append(h("b", null, title), h("p", null, message), again);
    out.replaceChildren(box);
  };

  const showResult = (r) => {
    const box = h("div", "check-res");
    const bad = r.checks.filter((c) => c.status === "fail" || c.status === "partial").length;
    const unsure = r.checks.filter((c) => c.status === "unknown").length;

    const head = h("div", "res-head");
    head.append(h("span", "mono", r.store), h("span", "mono", r.platform === "shopify" ? `${r.productsOnSale} products on sale` : "catalogue not readable"));
    const title = bad
      ? `${bad} of ${r.checks.length} checks need attention`
      : unsure ? "Nothing missing that we could see" : "Looks good from here";
    box.append(head, h("div", "res-title", title));

    const list = h("div", "res-list");
    for (const c of r.checks) {
      const item = h("div", "res-item");
      const body = h("div");
      body.append(h("b", null, c.title), h("p", null, c.detail));
      const pages = (c.pages || []).filter((p) => p.url);
      if (pages.length) {
        const ul = h("ul", "res-pages");
        for (const p of pages) {
          const li = h("li");
          const a = h("a", null, p.title || p.url.replace(/^https:\/\//, ""));
          a.href = p.url;
          a.target = "_blank";
          a.rel = "noopener nofollow";
          li.append(h("span", p.found ? "y" : "n", p.found ? "✓" : "✕"), a);
          if (p.evidence) li.append(h("q", null, p.evidence));
          ul.append(li);
        }
        body.append(ul);
      }
      const dot = h("span", `dot ${c.status}`, SYMBOL[c.status] || "?");
      dot.setAttribute("aria-label", c.status);
      item.append(dot, body);
      list.append(item);
    }
    box.append(list);

    const foot = h("div", "res-foot");
    if (r.usesOmniguard) {
      foot.append(h("span", null, "Omniguard is already installed on this store."));
    } else {
      const cta = h("a", "btn btn-green", bad ? "Fix this with Omniguard" : "Keep it that way with Omniguard");
      cta.href = "https://apps.shopify.com/omniguard";
      cta.rel = "noopener";
      foot.append(cta);
    }
    const again = h("button", "linkbtn", "Check another store");
    again.type = "button";
    again.addEventListener("click", () => { out.innerHTML = idle; input.value = ""; input.focus(); });
    foot.append(again);
    box.append(foot, h("p", "res-note", "These rules apply when you sell to shoppers in the EU. The check reads a sample of pages and can miss content added by scripts, so treat it as a first look rather than a verdict."));
    out.replaceChildren(box);
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const value = input.value.trim();
    form.classList.toggle("bad", !value);
    if (!value) return input.focus();

    button.disabled = true;
    const host = value.replace(/^https?:\/\//i, "").split("/")[0];
    const timer = showLoading(host);
    try {
      const res = await fetch(`${endpoint}?url=${encodeURIComponent(value)}`, { headers: { accept: "application/json" } });
      const data = await res.json();
      if (!res.ok) {
        form.classList.toggle("bad", data.error === "invalid_url" || data.error === "blocked_host");
        showError(res.status === 429 ? "Slow down a little" : "We couldn't check that shop", data.message || "Please try again.");
      } else {
        showResult(data);
      }
    } catch {
      showError("The checker isn't reachable right now", "Please try again in a moment.");
    } finally {
      clearInterval(timer);
      button.disabled = false;
    }
  });
  input.addEventListener("input", () => form.classList.remove("bad"));
})();

document.querySelectorAll("[data-year]").forEach((n) => {
  n.textContent = String(new Date().getFullYear());
});
