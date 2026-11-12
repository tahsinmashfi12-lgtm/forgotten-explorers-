/* Forgotten Explorers — WHY MARS? Interactive science page (route #why-mars). All text via FE_T keys (wm-i18n.js). */
(function () {
"use strict";
const N = id => "https://images.nasa.gov/details/" + id;
/* Images: real NASA/ESA photographs, maps and charts; drawings are labelled as illustrations/concepts. */
const IMG = {
  mars_disk:{f:"wm/img/mars_disk.webp", id:"PIA18184", cr:"NASA/The Hubble Heritage Team (STScI/AURA)", t:"Mars at 43 Million Miles From Earth (Hubble, 2001)", y:2001, k:"photo", page:N("PIA18184"), w:450, h:450},
  earth_disk:{f:"wm/img/earth_disk.webp", id:"AS17-148-22727", cr:"NASA", t:"The Blue Marble (Apollo 17, 1972)", y:1972, k:"photo", page:N("as17-148-22727"), w:640, h:640},
  gale_lake:{f:"wm/img/gale_lake.webp", id:"PIA17596", cr:"NASA/JPL-Caltech/MSSS", t:"Possible Extent of Ancient Lake in Gale Crater, Mars", y:2013, k:"ill", page:N("PIA17596")},
  jezero:{f:"wm/img/jezero_1000.webp", id:"PIA24096", cr:"ESA/DLR/FU-Berlin", t:"Jezero crater seen by Mars Express", y:2020, k:"orb", page:N("PIA24096")},
  north_cap:{f:"wm/img/north_cap_hubble.webp", id:"PIA01247", cr:"JPL/NASA/STScI", t:"Seasonal Changes in Mars North Polar Ice Cap", y:1998, k:"photo", page:N("PIA01247"), fit:1},
  ice_crater:{f:"wm/img/ice_crater.webp", id:"PIA17608", cr:"NASA/JPL-Caltech/Univ. of Arizona", t:"Fresh Crater Exposing Buried Ice on Mid-Latitude Mars", y:2013, k:"orb", page:N("PIA17608")},
  swim:{f:"wm/img/swim_ice_map.webp", id:"PIA26046", cr:"NASA/JPL-Caltech/Planetary Science Institute", t:"Distribution of Buried Ice on Mars", y:2023, k:"map", page:N("PIA26046"), fit:1},
  phoenix_ice:{f:"mx/img/phoenix_ice.jpg", id:"PIA10910", cr:"NASA/JPL-Caltech/Univ. of Arizona/Texas A&M", t:"Phoenix: ice exposed in a trench", y:2008, k:"photo", page:N("PIA10910")},
  moxie:{f:"wm/img/moxie.webp", id:"PIA24203", cr:"NASA/JPL-Caltech", t:"MOXIE All Tucked In", y:2021, k:"photo", page:N("PIA24203")},
  veggie:{f:"wm/img/veggie_harvest.webp", id:"iss040e009126", cr:"NASA (JSC)", t:"Veg-01 Plant Harvest on the ISS", y:2014, k:"photo", page:N("iss040e009126")},
  printed:{f:"wm/img/printed_habitat.webp", id:"MSFC-201900576", cr:"NASA/MSFC/Emmett Given", t:"NASA 3D-Printed Habitat Challenge", y:2019, k:"photo", page:N("MSFC-201900576")},
  chapea:{f:"wm/img/chapea_crew.webp", id:"jsc2026e403153", cr:"NASA (JSC)", t:"CHAPEA Mission 2 Crew Poses in Habitat", y:2025, k:"photo", page:N("jsc2026e403153")},
  insight:{f:"img/insight.webp", id:"PIA23203", cr:"NASA/JPL-Caltech", t:"InSight's Dusty Selfie (solar panels)", y:2019, k:"photo", page:N("PIA23203")},
  concept:{f:"mx/img/humans_on_mars_concept.webp", id:"PIA23302", cr:"NASA", t:"Concept art: astronauts on Mars", y:2019, k:"concept", page:N("PIA23302")},
  conj:{f:"wm/img/conjunction.webp", id:"PIA16811", cr:"NASA/JPL-Caltech", t:"Geometry of Mars Solar Conjunction", y:2013, k:"ill", page:N("PIA16811"), fit:1},
  dusty:{f:"wm/img/curiosity_dusty.webp", id:"PIA22486", cr:"NASA/JPL-Caltech/MSSS", t:"Curiosity's Dusty Selfie (2018 dust storm)", y:2018, k:"photo", page:N("PIA22486")},
  radchart:{f:"wm/img/radiation_compare.webp", id:"PIA17601", cr:"NASA/JPL-Caltech/SwRI", t:"Radiation Exposure Comparisons with Mars Trip Calculation", y:2013, k:"chart", page:N("PIA17601"), fit:1}
};
const SRC = [
  ["NASA NSSDC — Mars Fact Sheet", "https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html"],
  ["NASA NSSDC — Earth Fact Sheet", "https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html"],
  ["NASA Science — Mars: Facts", "https://science.nasa.gov/mars/facts/"],
  ["NASA — MOXIE completes its Mars mission (2023)", "https://www.nasa.gov/missions/mars-2020-perseverance/perseverance-rover/nasas-oxygen-generating-experiment-moxie-completes-mars-mission/"],
  ["NASA JPL — MOXIE could help future rockets launch off Mars", "https://www.jpl.nasa.gov/news/moxie-could-help-future-rockets-launch-off-mars/"],
  ["SwRI / ScienceDaily — Curiosity RAD: radiation on the Martian surface (2013)", "https://www.sciencedaily.com/releases/2013/12/131209181133.htm"],
  ["NASA Photojournal PIA17601 — Radiation exposure comparisons", N("PIA17601")],
  ["NASA Photojournal PIA26046 — Distribution of buried ice (SWIM)", N("PIA26046")],
  ["NASA Photojournal PIA17608 — Fresh crater exposing buried ice", N("PIA17608")],
  ["NASA Photojournal PIA17596 — Possible extent of ancient lake in Gale crater", N("PIA17596")],
  ["Scientific American — Perchlorate found by Phoenix (2009)", "https://www.scientificamerican.com/article/perchlorate-life-mars-phoenix/"],
  ["Live Science — Astronauts eat lettuce grown in space (2015)", "https://www.livescience.com/51811-astronauts-eat-space-lettuce.html"],
  ["NASA / phys.org — ISS reaches 98% water recovery (2023)", "https://phys.org/news/2023-06-nasa-recovery-milestone-international-space.html"],
  ["SpacePolicyOnline — CHAPEA crew completes 378-day simulated Mars mission (2024)", "https://spacepolicyonline.com/news/four-analog-astronauts-complete-378-day-practice-mars-mission/"],
  ["NNSS — Kilopower reactor demonstration (KRUSTY, 2018)", "https://nnss.gov/wp-content/uploads/2023/04/NR180011_KilopowerDemonstration.pdf"],
  ["ESA — Time delay between Mars and Earth", "https://www.esa.int/ESA_Multimedia/Images/2020/07/Time_delay_between_Mars_and_Earth"],
  ["NASA Photojournal PIA16811 — Geometry of Mars solar conjunction", N("PIA16811")]
];
const CMP = [
  {k:"diam", e:12742, m:6779}, {k:"grav", e:9.81, m:3.71}, {k:"day", e:24, m:24.66},
  {k:"temp"}, {k:"atm"}, {k:"pres", e:101.3, m:0.6}
];
const XS = [ // water cross-section hotspots: x%, y% over the 1000×420 drawing; tag
  {k:"cap", x:5, y:30, g:"known"}, {k:"scarp", x:23.7, y:30, g:"known"}, {k:"mid", x:33, y:35, g:"known"},
  {k:"lake", x:47, y:30, g:"known"}, {k:"eq", x:58, y:28, g:"known"}, {k:"deep", x:88, y:76, g:"debated"}
];
const GH = [{k:"water", x:17, y:74}, {k:"light", x:50, y:26}, {k:"plant", x:42, y:56}, {k:"temp", x:81.5, y:67}, {k:"nut", x:62, y:80}];
const SYS = [
  {k:"hab", x:27, y:50, img:["printed", "chapea"], g:"test"}, {k:"en", x:66, y:52, img:["insight"], g:"test"},
  {k:"wat", x:88, y:65, img:["phoenix_ice"], g:"test"}, {k:"ls", x:44, y:56, img:["moxie"], g:"test"}, {k:"com", x:7.5, y:33, img:["conj"], g:"known"}
];
const DNG = [{k:"rad", v:"radchart"}, {k:"cold", v:"svg_cold"}, {k:"pres", v:"svg_pres"}, {k:"dust", v:"dusty"}, {k:"grav", v:"svg_grav"}, {k:"iso", v:"chapea"}];
const SC = [{k:"water", s:"wm_sc_water"}, {k:"oxy", s:"wm_sc_oxy"}, {k:"temp", s:"wm_sc_temp"}, {k:"rad", s:"wm_sc_rad"}, {k:"grav", s:"wm_sc_grav"}, {k:"food", s:"wm_sc_food"}, {k:"shel", s:"wm_sc_shel"}, {k:"en", s:"wm_sc_en"}];
const IC = {
  rad:'<circle cx="12" cy="12" r="2"/><path d="M12 4a8 8 0 0 1 7 4l-5 3M5 8a8 8 0 0 1 7-4M5 8l5 3M8.5 19a8 8 0 0 1-4.5-6l6-1M20 13a8 8 0 0 1-4.5 6L13 13"/>',
  cold:'<path d="M12 2v20M4 6l16 12M20 6 4 18M9 3l3 2 3-2M9 21l3-2 3 2"/>',
  pres:'<circle cx="12" cy="13" r="8"/><path d="M12 13l4-4M8 4h8"/>',
  dust:'<path d="M3 8h11a3 3 0 1 0-3-3M3 12h16a3 3 0 1 1-3 3M3 16h8"/>',
  grav:'<circle cx="12" cy="5" r="2"/><path d="M12 8v7M8 22l4-7 4 7M7 11h10"/>',
  iso:'<circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="9" stroke-dasharray="2 3"/>',
  water:'<path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z"/>',
  oxy:'<circle cx="8" cy="12" r="4"/><circle cx="16" cy="12" r="4"/>',
  temp:'<path d="M10 4a2 2 0 0 1 4 0v10a4 4 0 1 1-4 0z"/>',
  food:'<path d="M12 21V9M12 13c-4 0-6-3-6-7 4 0 6 3 6 7zM12 11c3 0 5-2 5-6-3 0-5 2-5 6z"/>',
  shel:'<path d="M3 20h18M5 20v-6a7 7 0 0 1 14 0v6M10 20v-4h4v4"/>',
  en:'<path d="M13 2 5 14h6l-1 8 8-12h-6z"/>',
  hab:'<path d="M3 20h18M5 20v-6a7 7 0 0 1 14 0v6"/>', wat:'<path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z"/>',
  ls:'<path d="M4 12h4l2-5 4 10 2-5h4"/>', com:'<path d="M5 19a10 10 0 0 1 0-14M19 5a10 10 0 0 1 0 14M8.5 15.5a5 5 0 0 1 0-7M15.5 8.5a5 5 0 0 1 0 7"/><circle cx="12" cy="12" r="1.5"/>'
};
const ico = (k, s) => `<svg class="wm-ic" viewBox="0 0 24 24" width="${s || 22}" height="${s || 22}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[k] || ""}</svg>`;

let C = null, host = null, io = null, raf = 0, cleanup = [];
const t = (k, v) => C.t(k, v), e = s => C.esc(s);
const loc = () => C.locale();
const num = (x, d) => { try { return new Intl.NumberFormat(loc(), {maximumFractionDigits:d == null ? 1 : d, minimumFractionDigits:0}).format(x); } catch (er) { return String(x); } };
const yr = y => { try { return new Intl.NumberFormat(loc(), {useGrouping:false}).format(y); } catch (er) { return String(y); } };
const tag = g => `<span class="wm-tag ${g}">${e(t("wm_tag_" + g))}</span>`;
const credit = k => { const m = IMG[k]; return `<a class="wm-cr" href="${m.page}" target="_blank" rel="noopener">${e(m.id)} · ${e(m.cr)}</a>`; };
const kindL = k => t({photo:"wm_label_photo", orb:"wm_label_orb", map:"wm_label_map", chart:"wm_label_chart", ill:"wm_label_ill", concept:"wm_label_concept"}[k]);
const fig = (k, cap, cls) => { const m = IMG[k]; return `<figure class="wm-fig ${cls || ""}${m.fit ? " fit" : ""}"><div class="wm-ph"><img src="${m.f}" alt="${e(m.t)}" loading="lazy" decoding="async"${m.w ? ` width="${m.w}" height="${m.h}"` : ""}><span class="wm-kind ${m.k}">${e(kindL(m.k))}</span></div>${cap ? `<figcaption><span>${e(cap)}</span>${credit(k)}</figcaption>` : `<figcaption>${credit(k)}</figcaption>`}</figure>`; };
const head = (n, k) => `<header class="wm-head"><span class="mono eyebrow">${e(t("wm_s" + n + "_k"))}</span><h2 id="wm-h${n}">${e(t("wm_s" + n + "_t"))}</h2><p class="lede">${e(t("wm_s" + n + "_d"))}</p></header>`;

/* ── 1 · Earth vs Mars ── */
function cmpPanel(k) {
  const c = CMP.find(x => x.k === k);
  let viz = "";
  if (c.e != null) {
    const mx = Math.max(c.e, c.m);
    const row = (w, v, p) => `<div class="wm-bar ${w}"><span class="wm-bl">${e(t("wm_" + (w === "e" ? "earth" : "mars")))}</span><div class="wm-bt"><i style="--w:${Math.max(p, .4).toFixed(2)}%"></i></div><b>${e(v)}</b></div>`;
    viz = row("e", t("wm_v_" + k + "_e"), c.e / mx * 100) + row("m", t("wm_v_" + k + "_m"), c.m / mx * 100) + `<p class="wm-note">${e(t("wm_bar_note"))}</p>`;
  } else if (k === "temp") {
    const lo = -160, hi = 70, P = v => ((v - lo) / (hi - lo) * 100).toFixed(2);
    const row = (w, a, b, avg) => `<div class="wm-trow ${w}"><span class="wm-bl">${e(t(w === "e" ? "wm_earth" : "wm_mars"))}</span><div class="wm-tt"><i class="rg" style="--a:${P(a)}%;--b:${P(b)}%"></i><i class="av" style="--p:${P(avg)}%"><em>${e(num(avg, 0))} °C</em></i></div><b>${e(t("wm_v_temp_" + w))}</b></div>`;
    viz = `<div class="wm-temp">${row("e", -89, 57, 15)}${row("m", -153, 20, -60)}<div class="wm-tax" aria-hidden="true">${[-150, -100, -50, 0, 50].map(v => `<span style="--p:${P(v)}%">${e(num(v, 0))}</span>`).join("")}</div>
     <p class="wm-note"><i class="wm-sw rg"></i>${e(t("wm_range"))} <i class="wm-sw av"></i>${e(t("wm_avg"))} · °C</p></div>`;
  } else {
    const st = (w, parts) => `<div class="wm-bar ${w}"><span class="wm-bl">${e(t(w === "e" ? "wm_earth" : "wm_mars"))}</span><div class="wm-stack">${parts.map(([g, p]) => `<i class="g-${g}" style="--w:${p}%" title="${e(t("wm_g_" + g))} ${e(num(p, 2))}%"></i>`).join("")}</div><b>${e(t("wm_v_atm_" + w))}</b></div>`;
    viz = st("e", [["n2", 78.08], ["o2", 20.95], ["ar", .93], ["other", .04]]) + st("m", [["co2", 95.1], ["n2", 2.59], ["ar", 1.94], ["o2", .16], ["other", .21]]) +
      `<p class="wm-legend">${["co2", "n2", "o2", "ar", "other"].map(g => `<span><i class="g-${g}"></i>${e(t("wm_g_" + g))}</span>`).join("")}</p>`;
  }
  return `<h3>${e(t("wm_c_" + k))}</h3><div class="wm-viz">${viz}</div><div class="wm-mean"><span class="mono">${e(t("wm_mean"))}</span><p>${e(t("wm_m_" + k))}</p></div>`;
}
function s1() {
  return `<section class="wm-sec" id="wm-s1" aria-labelledby="wm-h1"><div class="wrap">${head(1)}
   <div class="wm-scale" aria-label="${e(t("wm_scale_note"))}"><figure><img src="${IMG.earth_disk.f}" alt="${e(t("wm_earth"))}" loading="lazy" width="640" height="640"><figcaption>${e(t("wm_earth"))} · ${e(t("wm_v_diam_e"))}</figcaption></figure>
    <figure class="m"><img src="${IMG.mars_disk.f}" alt="${e(t("wm_mars"))}" loading="lazy" width="450" height="450"><figcaption>${e(t("wm_mars"))} · ${e(t("wm_v_diam_m"))}</figcaption></figure>
    <p class="wm-note">${e(t("wm_scale_note"))} ${credit("earth_disk")} ${credit("mars_disk")}</p></div>
   <div class="wm-cmp"><div class="wm-tabs" role="tablist" aria-label="${e(t("wm_s1_t"))}">${CMP.map((c, i) => `<button role="tab" id="wm-ct-${c.k}" aria-controls="wm-cp" aria-selected="${i ? "false" : "true"}" tabindex="${i ? -1 : 0}" data-cmp="${c.k}">${e(t("wm_c_" + c.k))}</button>`).join("")}</div>
    <div class="wm-cp" id="wm-cp" role="tabpanel" aria-labelledby="wm-ct-diam" aria-live="polite">${cmpPanel("diam")}</div></div>
  </div></section>`;
}

/* ── 2 · Water ── */
function xsSvg() {
  // schematic profile from north pole (left) to south pole (right); not to scale
  const surf = "M0 150 C120 120 250 112 380 116 C470 118 520 112 600 116 C720 120 860 128 1000 150";
  return `<svg class="wm-xs" viewBox="0 0 1000 420" role="img" aria-label="${e(t("wm_x_t"))}">
   <defs><linearGradient id="wmSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b0f0a" stop-opacity="0"/><stop offset="1" stop-color="#C66B42" stop-opacity=".25"/></linearGradient>
    <linearGradient id="wmCrust" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6b3a24"/><stop offset="1" stop-color="#2a150d"/></linearGradient>
    <pattern id="wmIce" width="12" height="12" patternUnits="userSpaceOnUse"><rect width="12" height="12" fill="#6aa6d8" fill-opacity=".28"/><circle cx="3" cy="3" r="1.4" fill="#cfe6fb" fill-opacity=".7"/><circle cx="9" cy="9" r="1" fill="#cfe6fb" fill-opacity=".5"/></pattern></defs>
   <rect x="0" y="40" width="1000" height="110" fill="url(#wmSky)"/>
   <path d="${surf} L1000 420 L0 420Z" fill="url(#wmCrust)"/>
   <path d="M0 150 C120 120 250 112 380 116 L390 150 C300 150 220 162 170 176 C110 192 50 205 0 215Z" fill="url(#wmIce)"/>
   <path d="M1000 150 C860 128 720 120 640 118 L630 150 C700 152 780 160 830 176 C900 196 960 208 1000 215Z" fill="url(#wmIce)"/>
   <path d="M0 150 C30 100 70 92 110 128 C80 140 40 146 0 150Z" fill="#eef4fa"/><path d="M0 150 C30 112 60 106 92 132" fill="none" stroke="#c9d7e6" stroke-width="2"/>
   <path d="M1000 150 C970 104 935 96 895 130 C925 140 960 146 1000 150Z" fill="#eef4fa"/>
   <path d="M228 117 l12 0 l6 22 l-14 0z" fill="#dfeefb" stroke="#9cc4ea"/>
   <path d="M430 117 C440 140 500 140 512 116" fill="#8a4a2c" stroke="#b9775a"/><path d="M440 126 C460 133 490 133 504 125" fill="none" stroke="#d9a35b" stroke-width="1.5" stroke-dasharray="4 3"/>
   <ellipse cx="880" cy="320" rx="70" ry="22" fill="#4f8ccc" fill-opacity=".35" stroke="#8fc0ee" stroke-dasharray="5 5"/>
   <path d="${surf}" fill="none" stroke="#e0a07c" stroke-width="2"/>
   <g fill="#9AA9BA" font-size="14" font-family="var(--f-mono)" text-anchor="middle">
    <text x="30" y="400">${e(t("wm_lat_n", {n:num(90, 0)}))}</text><text x="260" y="400">${e(t("wm_lat_n", {n:num(45, 0)}))}</text><text x="500" y="400">${e(t("wm_eq"))}</text><text x="740" y="400">${e(t("wm_lat_s", {n:num(45, 0)}))}</text><text x="965" y="400">${e(t("wm_lat_s", {n:num(90, 0)}))}</text></g>
   <g fill="#cfe6fb" font-size="13" font-family="var(--f-mono)"><text x="150" y="240" fill="#a8cdf0">${e(t("wm_l_ice"))}</text><text x="470" y="250" fill="#d9b49c">${e(t("wm_l_reg"))}</text><text x="470" y="360" fill="#b98a72">${e(t("wm_l_crust"))}</text></g>
  </svg>`;
}
function xsPanel(k) { const h = XS.find(x => x.k === k); return `<h4>${e(t("wm_x_" + k + "_t"))} ${tag(h.g)}</h4><p>${e(t("wm_x_" + k + "_d"))}</p>`; }
function s2() {
  return `<section class="wm-sec band" id="wm-s2" aria-labelledby="wm-h2"><div class="wrap">${head(2)}
   <div class="wm-era"><div><h3><span class="wm-dot then"></span>${e(t("wm_w_then"))}</h3><div class="wm-figs two">${fig("gale_lake", t("wm_w_gale"))}${fig("jezero", t("wm_w_jez"))}</div></div>
    <div><h3><span class="wm-dot now"></span>${e(t("wm_w_now"))}</h3><div class="wm-figs three">${fig("north_cap", t("wm_w_cap"))}${fig("ice_crater", t("wm_w_ice"))}${fig("swim", t("wm_w_swim"))}</div></div></div>
   <div class="wm-x"><div class="wm-xh"><h3>${e(t("wm_x_t"))}</h3><p>${e(t("wm_x_d"))}</p><span class="wm-kind ill">${e(t("wm_x_lab"))}</span></div>
    <div class="wm-hot" data-hot="xs">${xsSvg()}${XS.map((h, i) => `<button class="wm-pin" style="--x:${h.x}%;--y:${h.y}%" data-xs="${h.k}" aria-label="${e(t("wm_x_" + h.k + "_t"))}" aria-pressed="${i ? "false" : "true"}"><span>${i + 1}</span></button>`).join("")}</div>
    <div class="wm-chips" role="group" aria-label="${e(t("wm_x_t"))}">${XS.map((h, i) => `<button data-xs="${h.k}" aria-pressed="${i ? "false" : "true"}"><span class="n">${i + 1}</span>${e(t("wm_x_" + h.k + "_t"))}</button>`).join("")}</div>
    <div class="wm-detail" id="wm-xd" aria-live="polite">${xsPanel("cap")}</div></div>
   <div class="wm-two"><article class="wm-card"><h3>${e(t("wm_w_why_t"))} ${tag("known")}</h3><p>${e(t("wm_w_why_d"))}</p></article>
    <article class="wm-card"><h3>${e(t("wm_w_use_t"))} ${tag("prop")}</h3><p>${e(t("wm_w_use_d"))}</p>${fig("phoenix_ice", t("wm_w_phx"), "mini")}</article></div>
  </div></section>`;
}

/* ── 3 · Air ── */
function moxieSvg() {
  const anim = !C.reduced;
  const dots = (path, n, cls, dur) => anim ? Array.from({length:n}, (_, i) => `<circle r="5" class="${cls}"><animateMotion dur="${dur}s" begin="${(i * dur / n).toFixed(2)}s" repeatCount="indefinite" path="${path}"/></circle>`).join("") : "";
  const pIn = "M20 150 H200 H330 H470", pO2 = "M630 130 C680 130 690 80 740 80 H860", pCO = "M630 170 C680 170 690 220 740 220 H860";
  return `<svg class="wm-mxd" viewBox="0 0 880 300" role="img" aria-label="${e(t("wm_mx_t"))}">
   <path d="${pIn}" class="pipe"/><path d="${pO2}" class="pipe o"/><path d="${pCO}" class="pipe c"/>
   <g data-st="1"><rect x="70" y="105" width="120" height="90" rx="8"/><path d="M95 120v60M110 120v60M125 120v60M140 120v60M155 120v60M170 120v60" class="mesh"/><text x="130" y="225">1</text></g>
   <g data-st="2"><rect x="230" y="105" width="120" height="90" rx="8"/><path d="M255 150h70M300 130l25 20-25 20" class="mesh"/><text x="290" y="225">2</text></g>
   <g data-st="3"><rect x="470" y="85" width="160" height="130" rx="10" class="hot"/><path d="M490 110h120M490 130h120M490 150h120M490 170h120M490 190h120" class="mesh"/><text x="550" y="245">3</text><text x="550" y="70" class="lab">≈ 800 °C</text></g>
   <g data-st="4"><circle cx="790" cy="80" r="26"/><circle cx="790" cy="220" r="26"/><text x="790" y="275">4</text></g>
   <text x="30" y="135" class="mol">CO₂</text><text x="870" y="70" class="mol o" text-anchor="end">O₂</text><text x="870" y="250" class="mol c" text-anchor="end">CO + CO₂</text>
   ${dots(pIn, 7, "m-co2", 4.2)}${dots(pO2, 4, "m-o2", 2.6)}${dots(pCO, 4, "m-co", 2.6)}
  </svg>`;
}
function presScale() {
  const L = v => ((Math.log10(v) - Math.log10(0.3)) / (Math.log10(200) - Math.log10(0.3)) * 100).toFixed(2);
  const pts = [["earth", 101.3, "wm_p_earth"], ["arm", 6.3, "wm_p_arm"], ["mars", 0.6, "wm_p_mars"]];
  return `<div class="wm-pscale"><div class="wm-ptrack">${pts.map(([c, v, k]) => `<span class="pm ${c}" style="--p:${L(v)}%"><b>${e(num(v, 1))} kPa</b><em>${e(t(k))}</em></span>`).join("")}</div><p class="wm-note">${e(t("wm_log_note"))}</p></div>`;
}
function s3() {
  const comp = [["co2", 95.1], ["n2", 2.59], ["ar", 1.94], ["o2", .16], ["other", .21]];
  return `<section class="wm-sec" id="wm-s3" aria-labelledby="wm-h3"><div class="wrap">${head(3)}
   <div class="wm-two"><article class="wm-card"><h3>${e(t("wm_a_comp"))} ${tag("known")}</h3>
     <div class="wm-comp">${comp.map(([g, p]) => `<div class="wm-crow"><span>${e(t("wm_g_" + g))}</span><div class="wm-bt"><i class="g-${g}" style="--w:${Math.max(p, .6)}%"></i></div><b>${e(num(p, 2))}%</b></div>`).join("")}</div></article>
    <article class="wm-card"><h3>${e(t("wm_a_pres"))} ${tag("known")}</h3>${presScale()}<p>${e(t("wm_a_need"))}</p></article></div>
   <div class="wm-moxie"><div class="wm-mxh"><h3>${e(t("wm_mx_t"))} ${tag("test")}</h3><p>${e(t("wm_mx_d"))}</p></div>
    <div class="wm-mxg">${fig("moxie", t("wm_mx_img"))}
     <div class="wm-mxp"><div class="wm-mxsvg">${moxieSvg()}</div>
      <div class="wm-steps" role="group" aria-label="${e(t("wm_mx_t"))}">${[1, 2, 3, 4].map(i => `<button data-mxs="${i}" aria-pressed="${i === 1 ? "true" : "false"}"><b>${e(t("wm_mx_s" + i + "_t"))}</b></button>`).join("")}</div>
      <p class="wm-detail" id="wm-mxd" aria-live="polite">${e(t("wm_mx_s1_d"))}</p></div></div>
    <ul class="wm-stats">${[1, 2, 3, 4].map(i => `<li>${e(t("wm_mx_f" + i))}</li>`).join("")}</ul>
    <div class="wm-scale-note"><h4>${e(t("wm_mx_scale"))}</h4><div class="wm-cmp2"><div><span>${tag("test")}</span><p>${e(t("wm_mx_demo"))}</p></div><div><span>${tag("prop")}</span><p>${e(t("wm_mx_full"))}</p></div></div><p>${e(t("wm_mx_scale_d"))}</p></div></div>
  </div></section>`;
}

/* ── 4 · Food ── */
function ghSvg() {
  return `<svg class="wm-gh" viewBox="0 0 1000 460" role="img" aria-label="${e(t("wm_gh_t"))}">
   <defs><linearGradient id="wmGl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe6fb" stop-opacity=".16"/><stop offset="1" stop-color="#cfe6fb" stop-opacity=".04"/></linearGradient>
    <radialGradient id="wmLed" cx=".5" cy="0" r=".9"><stop offset="0" stop-color="#d77cff" stop-opacity=".45"/><stop offset="1" stop-color="#d77cff" stop-opacity="0"/></radialGradient></defs>
   <rect x="0" y="390" width="1000" height="70" fill="#5a2f1c"/><path d="M0 392 Q250 380 500 390 T1000 388" stroke="#b9775a" stroke-width="2" fill="none"/>
   <path d="M80 390 V200 A420 170 0 0 1 920 200 V390Z" fill="url(#wmGl)" stroke="#9fc3e3" stroke-width="3"/>
   <path d="M95 390 V205 A405 160 0 0 1 905 205 V390" fill="none" stroke="#9fc3e3" stroke-opacity=".35" stroke-width="1.5"/>
   <g class="led"><rect x="250" y="120" width="500" height="10" rx="5" fill="#e6a3ff"/><path d="M250 130 L200 330 H800 L750 130Z" fill="url(#wmLed)"/></g>
   <g class="trays">${[0, 1].map(r => `<rect x="250" y="${270 + r * 60}" width="500" height="14" rx="3" fill="#3a5068"/>${Array.from({length:10}, (_, i) => `<path d="M${275 + i * 50} ${270 + r * 60} c-10 -22 -2 -34 0 -38 c4 6 12 18 0 38z M${275 + i * 50} ${270 + r * 60} c8 -16 20 -20 24 -20 c-4 10 -12 18 -24 20z" fill="#65B98A"/>`).join("")}`).join("")}</g>
   <g class="water"><rect x="130" y="300" width="80" height="80" rx="6" fill="#2b5a85" stroke="#8fc0ee"/><path d="M140 330h60" stroke="#8fc0ee" stroke-dasharray="4 4"/><path d="M210 320 H250 M210 350 H240 V340 H250" stroke="#8fc0ee" stroke-width="3" fill="none"/></g>
   <g class="nut"><rect x="560" y="352" width="120" height="30" rx="5" fill="#556b2f" stroke="#a5c26a"/><path d="M580 352 V344 M620 352 V344 M660 352 V344" stroke="#a5c26a" stroke-width="3"/></g>
   <g class="heat"><rect x="770" y="250" width="90" height="120" rx="6" fill="#4a2a20" stroke="#D9A35B"/><path d="M785 275 h60 M785 295 h60 M785 315 h60 M785 335 h60" stroke="#D9A35B" stroke-width="3"/></g>
  </svg>`;
}
function s4() {
  return `<section class="wm-sec band" id="wm-s4" aria-labelledby="wm-h4"><div class="wrap">${head(4)}
   <div class="wm-two"><article class="wm-card"><h3>${e(t("wm_f_soil_t"))} ${tag("known")}</h3><ul class="wm-list">${[1, 2, 3, 4].map(i => `<li>${e(t("wm_f_c" + i))}</li>`).join("")}</ul></article>
    ${fig("veggie", t("wm_veg"))}</div>
   <div class="wm-x"><div class="wm-xh"><h3>${e(t("wm_gh_t"))}</h3><p>${e(t("wm_gh_d"))}</p><span class="wm-kind concept">${e(t("wm_gh_lab"))}</span></div>
    <div class="wm-hot gh" data-hot="gh">${ghSvg()}${GH.map((h, i) => `<button class="wm-pin" style="--x:${h.x}%;--y:${h.y}%" data-gh="${h.k}" aria-label="${e(t("wm_gh_" + h.k + "_t"))}" aria-pressed="${i ? "false" : "true"}"><span>${i + 1}</span></button>`).join("")}</div>
    <div class="wm-chips" role="group" aria-label="${e(t("wm_gh_t"))}">${GH.map((h, i) => `<button data-gh="${h.k}" aria-pressed="${i ? "false" : "true"}"><span class="n">${i + 1}</span>${e(t("wm_gh_" + h.k + "_t"))}</button>`).join("")}</div>
    <div class="wm-detail" id="wm-ghd" aria-live="polite"><h4>${e(t("wm_gh_water_t"))}</h4><p>${e(t("wm_gh_water_d"))}</p></div></div>
  </div></section>`;
}

/* ── 5 · Building a home ── */
function baseSvg() {
  return `<svg class="wm-base" viewBox="0 0 1000 420" role="img" aria-label="${e(t("wm_base_lab"))}">
   <defs><linearGradient id="wmBs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b0605"/><stop offset="1" stop-color="#5a2a18"/></linearGradient></defs>
   <rect width="1000" height="260" fill="url(#wmBs)"/><rect y="250" width="1000" height="170" fill="#4a2617"/>
   <path d="M0 252 Q200 238 380 250 T760 246 T1000 252" stroke="#b9775a" stroke-width="2" fill="#5c301c"/>
   <g data-sys="com"><path d="M70 250 V150" stroke="#9AA9BA" stroke-width="4"/><path d="M40 120 A45 45 0 0 0 110 170Z" fill="#cfd8e2"/><path d="M78 140 l40 -40 M90 150 l48 -48" stroke="#9AA9BA" stroke-dasharray="3 6"/></g>
   <g data-sys="hab"><path d="M180 252 A90 70 0 0 1 360 252Z" fill="#7a4a30" stroke="#d9a07c" stroke-width="2"/><path d="M200 252 A70 52 0 0 1 340 252Z" fill="#2c3d50" stroke="#9fc3e3"/><rect x="240" y="225" width="60" height="27" fill="#EAF0F7" fill-opacity=".25"/><path d="M180 252 Q270 210 360 252" fill="none" stroke="#b9775a" stroke-dasharray="6 6"/></g>
   <g data-sys="ls"><rect x="400" y="215" width="90" height="37" rx="5" fill="#2c3d50" stroke="#9fc3e3"/><path d="M360 238 H400" stroke="#9fc3e3" stroke-width="3"/><circle cx="425" cy="233" r="8" fill="#5599D5"/><circle cx="460" cy="233" r="8" fill="#65B98A"/></g>
   <g data-sys="en"><g fill="#1c2c46" stroke="#5599D5">${[0, 1, 2, 3].map(i => `<path d="M${560 + i * 60} 240 l40 -40 l20 0 l-40 40z"/>`).join("")}</g><path d="M560 252 V240 M860 252 V240" stroke="#9AA9BA"/>
    <rect x="770" y="160" width="40" height="70" rx="6" fill="#3a3f46" stroke="#D9A35B"/><path d="M790 230 V252" stroke="#9AA9BA" stroke-width="3"/></g>
   <g data-sys="wat"><path d="M840 252 l20 50 h60 l20 -50" fill="#6aa6d8" fill-opacity=".35" stroke="#8fc0ee"/><rect x="900" y="210" width="50" height="42" rx="4" fill="#2b5a85" stroke="#8fc0ee"/></g>
   <path d="M360 252 Q600 300 900 252" fill="none" stroke="#D9A35B" stroke-opacity=".5" stroke-dasharray="3 5"/>
  </svg>`;
}
function sysPanel(k) {
  const s = SYS.find(x => x.k === k);
  return `<div class="wm-sysg"><div><h3>${ico(k, 26)} ${e(t("wm_h_" + k))}</h3><ul class="wm-list">${[1, 2, 3, 4].map(i => `<li>${e(t("wm_h_" + k + "_" + i))}</li>`).join("")}</ul>
   <div class="wm-real">${tag(s.g)}<p>${e(t("wm_h_" + k + "_r"))}</p></div></div><div class="wm-figs ${s.img.length > 1 ? "two" : ""}">${s.img.map(i => fig(i, "")).join("")}</div></div>`;
}
function s5() {
  return `<section class="wm-sec" id="wm-s5" aria-labelledby="wm-h5"><div class="wrap">${head(5)}
   <div class="wm-x"><div class="wm-xh"><span class="wm-kind concept">${e(t("wm_base_lab"))}</span></div>
    <div class="wm-hot base" data-hot="sys">${baseSvg()}${SYS.map((h, i) => `<button class="wm-pin" style="--x:${h.x}%;--y:${h.y}%" data-sys="${h.k}" aria-label="${e(t("wm_h_" + h.k))}" tabindex="-1" aria-hidden="true"><span>${String.fromCharCode(65 + i)}</span></button>`).join("")}</div></div>
   <div class="wm-tabs h" role="tablist" aria-label="${e(t("wm_s5_t"))}">${SYS.map((s, i) => `<button role="tab" id="wm-st-${s.k}" aria-controls="wm-sp" aria-selected="${i ? "false" : "true"}" tabindex="${i ? -1 : 0}" data-sys="${s.k}"><span class="n">${String.fromCharCode(65 + i)}</span>${e(t("wm_h_" + s.k))}</button>`).join("")}</div>
   <div class="wm-cp" id="wm-sp" role="tabpanel" aria-labelledby="wm-st-hab" aria-live="polite">${sysPanel("hab")}</div>
   <div class="wm-delay"><div><h3>${ico("com")} ${e(t("wm_delay_t"))}</h3><p>${e(t("wm_delay_d"))}</p></div>
    <label class="sr" for="wm-dist">${e(t("wm_delay_dist"))}</label><input type="range" id="wm-dist" min="54.6" max="401.4" step="0.1" value="225">
    <div class="wm-dends mono"><span>${e(t("wm_closest"))} · ${e(t("wm_mkm", {n:num(54.6)}))}</span><span>${e(t("wm_farthest"))} · ${e(t("wm_mkm", {n:num(401.4)}))}</span></div>
    <div class="wm-dout" aria-live="polite"><div><span>${e(t("wm_delay_dist"))}</span><b id="wm-dd"></b></div><div><span>${e(t("wm_delay_one"))}</span><b id="wm-d1"></b></div><div><span>${e(t("wm_delay_round"))}</span><b id="wm-d2"></b></div></div>
    <div class="wm-beam" aria-hidden="true"><span class="pe"></span><i id="wm-beam"></i><span class="pm"></span></div></div>
  </div></section>`;
}

/* ── 6 · Dangers ── */
function dVis(k) {
  const d = DNG.find(x => x.k === k);
  if (IMG[d.v]) return fig(d.v, "");
  if (d.v === "svg_grav") return `<div class="wm-svgv"><svg viewBox="0 0 300 180" role="img" aria-label="${e(t("wm_grav_vis"))}"><rect x="40" y="30" width="70" height="130" fill="#5599D5"/><rect x="190" y="${160 - 130 * .38}" width="70" height="${130 * .38}" fill="#C66B42"/><text x="75" y="22">100 kg</text><text x="225" y="${150 - 130 * .38}">38 kg</text></svg><p>${e(t("wm_grav_vis"))}</p></div>`;
  if (d.v === "svg_cold") return `<div class="wm-svgv"><svg viewBox="0 0 300 180" role="img" aria-label="${e(t("wm_cold_vis"))}"><rect x="140" y="10" width="20" height="140" rx="10" fill="none" stroke="#9AA9BA"/><circle cx="150" cy="160" r="16" fill="#5599D5"/><rect x="145" y="${10 + 140 * 80 / 175}" width="10" height="${150 - 140 * 80 / 175}" rx="5" fill="#5599D5"/>${[[20, "#D9A35B"], [-60, "#C66B42"], [-153, "#5599D5"]].map(([v, c]) => { const y = 10 + 140 * (20 - v) / 175; return `<path d="M160 ${y} H190" stroke="${c}" stroke-width="2"/><text x="196" y="${y + 5}" class="l" fill="${c}">${num(v, 0)} °C</text>`; }).join("")}</svg><p>${e(t("wm_cold_vis"))}</p></div>`;
  return `<div class="wm-svgv">${presScale()}</div>`;
}
function dPanel(k) {
  return `<div class="wm-dg"><div class="wm-dv">${dVis(k)}</div><div class="wm-dt"><h3>${ico(k, 26)} ${e(t("wm_d_" + k))}</h3>
   <div class="wm-db"><span class="mono">${e(t("wm_why"))}</span><p>${e(t("wm_d_" + k + "_w"))}</p></div>
   <div class="wm-db"><span class="mono">${e(t("wm_impact"))}</span><p>${e(t("wm_d_" + k + "_i"))}</p></div>
   <div class="wm-db"><span class="mono">${e(t("wm_solve"))}</span><div class="wm-cmp2"><div>${tag("known")}<p>${e(t("wm_d_" + k + "_k"))}</p></div><div>${tag("prop")}<p>${e(t("wm_d_" + k + "_p"))}</p></div></div></div></div></div>`;
}
function s6() {
  return `<section class="wm-sec band wm-danger" id="wm-s6" aria-labelledby="wm-h6"><div class="wrap">${head(6)}
   <div class="wm-dbtns" role="tablist" aria-label="${e(t("wm_s6_t"))}">${DNG.map((d, i) => `<button role="tab" id="wm-dt-${d.k}" aria-controls="wm-dp" aria-selected="${i ? "false" : "true"}" tabindex="${i ? -1 : 0}" data-dng="${d.k}">${ico(d.k, 28)}<span>${e(t("wm_d_" + d.k))}</span></button>`).join("")}</div>
   <div class="wm-cp" id="wm-dp" role="tabpanel" aria-labelledby="wm-dt-rad" aria-live="polite">${dPanel("rad")}</div>
  </div></section>`;
}

/* ── 7 · Scorecard ── */
const VK = "wm:verdicts";
const getV = () => { try { return JSON.parse(C.store.get(VK) || "{}") || {}; } catch (er) { return {}; } };
const setV = v => { try { C.store.set(VK, JSON.stringify(v)); } catch (er) {} };
function scPanel(k) {
  const s = SC.find(x => x.k === k), v = getV()[k];
  return `<h3>${ico(k, 26)} ${e(t(s.s))}</h3><div class="wm-scg">
   <div><span class="mono ok">${e(t("wm_sc_for"))}</span><p>${e(t(s.s + "_f"))}</p></div><div><span class="mono bad">${e(t("wm_sc_against"))}</span><p>${e(t(s.s + "_a"))}</p></div><div><span class="mono">${e(t("wm_sc_status"))}</span><p>${e(t(s.s + "_s"))}</p></div></div>
   <fieldset class="wm-vote"><legend>${e(t("wm_sc_q", {c:t(s.s)}))}</legend>${["yes", "hard", "unsure"].map(o => `<label class="${v === o ? "on" : ""}"><input type="radio" name="wm-v-${k}" value="${o}" data-vote="${k}" ${v === o ? "checked" : ""}> ${e(t("wm_v_" + o))}</label>`).join("")}</fieldset>`;
}
function scSummary() {
  const v = getV(), c = o => SC.filter(s => v[s.k] === o).length;
  return e(t("wm_sc_sum", {a:num(c("yes"), 0), b:num(c("hard"), 0), c:num(c("unsure"), 0), d:num(SC.length - c("yes") - c("hard") - c("unsure"), 0)}));
}
function scBtn(s, i, sel) { const v = getV()[s.k]; return `<button role="tab" id="wm-sct-${s.k}" aria-controls="wm-scp" aria-selected="${sel ? "true" : "false"}" tabindex="${sel ? 0 : -1}" data-sc="${s.k}">${ico(s.k)}<span>${e(t(s.s))}</span><i class="vd ${v || ""}" title="${v ? e(t("wm_v_" + v)) : ""}"></i></button>`; }
function s7() {
  return `<section class="wm-sec" id="wm-s7" aria-labelledby="wm-h7"><div class="wrap">${head(7)}
   <div class="wm-sc"><div class="wm-scb" role="tablist" aria-label="${e(t("wm_s7_t"))}">${SC.map((s, i) => scBtn(s, i, !i)).join("")}</div>
    <div class="wm-cp" id="wm-scp" role="tabpanel" aria-labelledby="wm-sct-water">${scPanel("water")}</div></div>
   <div class="wm-sum"><p id="wm-sum" aria-live="polite">${scSummary()}</p><button class="btn small" data-vreset>${e(t("wm_sc_reset"))}</button></div>
   <div class="wm-concl"><span class="mono eyebrow">${e(t("wm_s7_k"))}</span><h2>${e(t("wm_concl_t"))}</h2><p class="big">${e(t("wm_concl"))}</p><p>${e(t("wm_concl_note"))}</p></div>
   <div class="wm-more"><h3>${e(t("wm_more"))}</h3><div class="btnrow"><a class="btn primary" href="#mars-doc">${e(t("wm_more_doc"))} ${C.arrow}</a><a class="btn" href="#mars-doc/archive">${e(t("wm_more_ar"))}</a><a class="btn" href="#journey">${e(t("wm_more_jr"))}</a><a class="btn" href="#hardware-mars">${e(t("wm_more_hw"))}</a><a class="btn" href="#mars">${e(t("nav_mars"))}</a></div></div>
  </div></section>
  <section class="wm-sec band wm-src" id="wm-src" aria-labelledby="wm-hs"><div class="wrap"><h2 id="wm-hs">${e(t("wm_src_t"))}</h2><p>${e(t("wm_src_d"))}</p>
   <ol class="wm-srcl">${SRC.map(([n, u]) => `<li><a href="${u}" target="_blank" rel="noopener">${e(n)}</a></li>`).join("")}</ol>
   <h3>${e(t("wm_img_cr"))}</h3><ul class="wm-crl">${Object.keys(IMG).map(k => { const m = IMG[k]; return `<li><span class="wm-kind ${m.k}">${e(kindL(m.k))}</span> <a href="${m.page}" target="_blank" rel="noopener">${e(m.t)}</a> · ${e(m.id)} · ${e(m.cr)} · ${e(yr(m.y))}</li>`; }).join("")}</ul></div></section>`;
}

/* ── hero ── */
function hero() {
  return `<section class="wm-hero" aria-labelledby="wm-title"><canvas class="wm-dust" aria-hidden="true"></canvas>
   <div class="wm-planet" aria-hidden="true"><img src="${IMG.mars_disk.f}" alt="" width="450" height="450" fetchpriority="high"><i class="atm"></i><i class="sh"></i></div>
   <div class="wrap"><span class="mono eyebrow">${e(t("wm_card_k"))}</span><h1 id="wm-title">${e(t("wm_title"))}</h1><p class="wm-sub">${e(t("wm_sub"))}</p><p class="lede">${e(t("wm_intro"))}</p>
    <div class="btnrow"><a class="btn primary wm-go" href="#why-mars" data-wmgo>${e(t("wm_explore"))} ${C.arrow}</a></div>
    <ol class="wm-qs">${[1, 2, 3].map(i => `<li><span class="mono">0${i}</span>${e(t("wm_q" + i))}</li>`).join("")}</ol>
    <div class="wm-leg">${["known", "test", "prop"].map(g => `<span>${tag(g)}<small>${e(t("wm_tag_" + g + "_d"))}</small></span>`).join("")}</div></div>
   ${credit("mars_disk")}</section>`;
}

/* ── behaviour ── */
function select(group, attr, val, panel, html) {
  host.querySelectorAll(`[${attr}]`).forEach(b => {
    const on = b.getAttribute(attr) === val;
    if (b.getAttribute("role") === "tab") { b.setAttribute("aria-selected", on); if (!b.hasAttribute("aria-hidden")) b.tabIndex = on ? 0 : -1; }
    else if (b.tagName === "BUTTON") b.setAttribute("aria-pressed", on);
    else if (b.tagName === "g") b.classList.toggle("on", on);
  });
  const p = host.querySelector(panel); if (!p) return;
  p.innerHTML = html; const tb = host.querySelector(`[role=tab][${attr}="${val}"]`); if (tb && p.getAttribute("role") === "tabpanel") p.setAttribute("aria-labelledby", tb.id);
  p.classList.remove("swap"); void p.offsetWidth; p.classList.add("swap");
}
function delay() {
  const r = host.querySelector("#wm-dist"); if (!r) return;
  const d = +r.value, s = d * 1e6 / 299792.458, m = s / 60;
  host.querySelector("#wm-dd").textContent = t("wm_mkm", {n:num(d, 0)});
  host.querySelector("#wm-d1").textContent = t("wm_min", {n:num(m, 1)});
  host.querySelector("#wm-d2").textContent = t("wm_min", {n:num(m * 2, 1)});
  const pct = (d - 54.6) / (401.4 - 54.6); r.style.setProperty("--p", (pct * 100).toFixed(1) + "%");
  const b = host.querySelector("#wm-beam"); if (b) b.style.setProperty("--d", (1.2 + pct * 4).toFixed(2) + "s");
}
function dust() {
  const cv = host.querySelector(".wm-dust"); if (!cv || C.reduced) return;
  const ctx = cv.getContext("2d"); let W = 0, H = 0, P = [];
  const size = () => { const r = cv.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1); W = r.width; H = r.height; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    P = Array.from({length:Math.round(W * H / 9000)}, () => ({x:Math.random() * W, y:Math.random() * H, r:Math.random() * 1.4 + .3, v:Math.random() * .25 + .05, a:Math.random() * .5 + .15})); };
  size(); let vis = true, last = 0;
  const ro = new ResizeObserver(size); ro.observe(cv);
  const ob = new IntersectionObserver(en => { vis = en[0].isIntersecting; if (vis && !raf) raf = requestAnimationFrame(step); }); ob.observe(cv);
  function step(ts) { raf = 0; if (!vis || !host || !host.isConnected) return; const dt = Math.min(50, ts - (last || ts)); last = ts; ctx.clearRect(0, 0, W, H);
    for (const p of P) { p.x += p.v * dt * .06; p.y += Math.sin((ts / 1800) + p.x / 80) * .05; if (p.x > W + 4) { p.x = -4; p.y = Math.random() * H; }
      ctx.fillStyle = `rgba(232,160,120,${p.a})`; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill(); }
    raf = requestAnimationFrame(step); }
  raf = requestAnimationFrame(step);
  cleanup.push(() => { ro.disconnect(); ob.disconnect(); if (raf) cancelAnimationFrame(raf); raf = 0; });
}
function tabKeys(ev) {
  const tb = ev.target.closest("[role=tab]"); if (!tb) return;
  const list = [...tb.parentElement.querySelectorAll("[role=tab]")]; let i = list.indexOf(tb);
  const rtl = document.documentElement.dir === "rtl";
  const nx = {ArrowRight:rtl ? -1 : 1, ArrowDown:1, ArrowLeft:rtl ? 1 : -1, ArrowUp:-1}[ev.key];
  if (nx) i = (i + nx + list.length) % list.length; else if (ev.key === "Home") i = 0; else if (ev.key === "End") i = list.length - 1; else return;
  ev.preventDefault(); list[i].focus(); list[i].click();
}
function onClick(ev) {
  const b = ev.target.closest("button, [data-wmgo], g[data-sys]"); if (!b || !host.contains(b)) return;
  const d = b.dataset;
  if (d.wmgo != null) { ev.preventDefault(); host.querySelector("#wm-s1 .wm-head").scrollIntoView({behavior:C.reduced ? "auto" : "smooth", block:"start"}); const f = host.querySelector("#wm-ct-diam"); if (f) setTimeout(() => f.focus({preventScroll:true}), C.reduced ? 0 : 700); return; }
  if (d.cmp) return select("cmp", "data-cmp", d.cmp, "#wm-cp", cmpPanel(d.cmp));
  if (d.xs) return select("xs", "data-xs", d.xs, "#wm-xd", xsPanel(d.xs));
  if (d.gh) return select("gh", "data-gh", d.gh, "#wm-ghd", `<h4>${e(t("wm_gh_" + d.gh + "_t"))}</h4><p>${e(t("wm_gh_" + d.gh + "_d"))}</p>`);
  if (d.mxs) { host.querySelectorAll(".wm-mxd g[data-st]").forEach(g => g.classList.toggle("on", g.dataset.st === d.mxs)); return select("mx", "data-mxs", d.mxs, "#wm-mxd", e(t("wm_mx_s" + d.mxs + "_d"))); }
  if (d.sys) { const r = select("sys", "data-sys", d.sys, "#wm-sp", sysPanel(d.sys)); if (b.classList.contains("wm-pin") || b.tagName === "g") host.querySelector("#wm-st-" + d.sys)?.focus({preventScroll:true}); return r; }
  if (d.dng) return select("dng", "data-dng", d.dng, "#wm-dp", dPanel(d.dng));
  if (d.sc) return select("sc", "data-sc", d.sc, "#wm-scp", scPanel(d.sc));
  if (d.vreset != null) { setV({}); const cur = host.querySelector("[data-sc][aria-selected=true]")?.dataset.sc || "water"; refreshSc(cur); }
}
function refreshSc(cur) {
  const wrap = host.querySelector(".wm-scb"); wrap.innerHTML = SC.map((s, i) => scBtn(s, i, s.k === cur)).join("");
  host.querySelector("#wm-scp").innerHTML = scPanel(cur); host.querySelector("#wm-sum").innerHTML = scSummary();
}
function onChange(ev) {
  const r = ev.target; if (r.dataset.vote) { const v = getV(); v[r.dataset.vote] = r.value; setV(v);
    r.closest("fieldset").querySelectorAll("label").forEach(l => l.classList.toggle("on", l.contains(r)));
    const i = host.querySelector(`[data-sc="${r.dataset.vote}"] .vd`); if (i) { i.className = "vd " + r.value; i.title = t("wm_v_" + r.value); }
    host.querySelector("#wm-sum").innerHTML = scSummary(); }
}
function revealSecs() {
  if (C.reduced || !("IntersectionObserver" in window)) { host.querySelectorAll(".wm-sec").forEach(s => s.classList.add("in")); return; }
  io = new IntersectionObserver(en => en.forEach(x => { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } }), {rootMargin:"0px 0px 4% 0px", threshold:0});
  host.querySelectorAll(".wm-sec").forEach(s => io.observe(s));
}

window.FE_WM = {
  render(ctx) { C = ctx; return `<div class="wm" id="wm">${hero()}${s1()}${s2()}${s3()}${s4()}${s5()}${s6()}${s7()}</div>`; },
  bind(root, ctx) {
    this.stop(); C = ctx; host = root.querySelector("#wm") || root;
    host.addEventListener("click", onClick); host.addEventListener("keydown", tabKeys); host.addEventListener("change", onChange);
    const dr = host.querySelector("#wm-dist"); if (dr) dr.addEventListener("input", delay);
    host.querySelectorAll(".wm-base g[data-sys]").forEach(g => { g.style.cursor = "pointer"; });
    host.querySelector('.wm-mxd g[data-st="1"]')?.classList.add("on");
    host.querySelector('.wm-base g[data-sys="hab"]')?.classList.add("on");
    delay(); dust(); revealSecs();
  },
  stop() { cleanup.forEach(f => { try { f(); } catch (er) {} }); cleanup = []; if (io) { io.disconnect(); io = null; } if (raf) cancelAnimationFrame(raf); raf = 0; host = null; },
  credits() { return IMG; }, sources() { return SRC; }
};
})();
