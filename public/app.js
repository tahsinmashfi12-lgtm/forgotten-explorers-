(() => {
"use strict";
const M = window.FE_MISSIONS, MEDIA = window.FE_MEDIA, T = window.FE_T, LANGS = window.FE_LANGS;
const byId = Object.fromEntries(M.map(m => [m.id, m]));
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const store = {
  get(k) { try { return localStorage.getItem("fe:" + k); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem("fe:" + k, v); } catch (e) {} }
};
let lang = store.get("lang") || "en";
if (!LANGS.find(l => l.code === lang)) lang = "en";
const LI = () => LANGS.findIndex(l => l.code === lang);
const t = (k, vars) => { const r = T[k]; let s = r ? (r[LI()] || r[0]) : k; if (vars) for (const v in vars) s = s.replace("{" + v + "}", vars[v]); return s; };
/* localised archive content (i18n-content.js); English stays the source and the fallback */
const TC = window.FE_TC || {};
const tc = (g, k, en) => { if (lang === "en") return en; const r = TC[g] && TC[g][k]; return (r && r[LI() - 1]) || en; };
const agencyL = a => tc("agency", a, a), agencies = m => m.agency.map(agencyL).join(", ");
function localizeData() {
  for (const m of M) { if (m._sum == null) m._sum = m.summary; m.summary = tc("sum", m.id, m._sum); }
  for (const i of window.HW_ITEMS || []) { if (i._name == null) i._name = i.name; i.name = tc("hwn", i.id, i._name); }
}
localizeData();
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const locale = () => ({en:"en-GB",bn:"bn-BD",es:"es-ES",fr:"fr-FR",ar:"ar"}[lang]);
function fmtDate(d) {
  if (!d) return t("na");
  const p = String(d).split("-");
  try {
    if (p.length === 3) return new Intl.DateTimeFormat(locale(), {day:"numeric",month:"long",year:"numeric"}).format(new Date(Date.UTC(+p[0], +p[1]-1, +p[2])));
    if (p.length === 2) return new Intl.DateTimeFormat(locale(), {month:"long",year:"numeric"}).format(new Date(Date.UTC(+p[0], +p[1]-1, 1)));
    return new Intl.NumberFormat(locale(), {useGrouping:false}).format(+p[0]);
  } catch (e) { return d; }
}
const year = m => +m.launch.slice(0, 4);
const yearL = y => { try { return new Intl.NumberFormat(locale(), {useGrouping:false}).format(y); } catch (e) { return y; } };
const stLabel = s => t("st_" + s), tyLabel = s => t("ty_" + s), deLabel = s => t("de_" + s);
const pill = s => `<span class="pill ${s}"><i aria-hidden="true"></i>${esc(stLabel(s))}</span>`;
const ICON = {
  orbit:'<svg viewBox="0 0 24 24" aria-hidden="true" fill="none"><circle cx="12" cy="12" r="2.6" fill="#FFC566"/><ellipse cx="12" cy="12" rx="10" ry="4.2" stroke="currentColor" stroke-width="1.1" opacity=".75" transform="rotate(-18 12 12)"/><ellipse cx="12" cy="12" rx="6.4" ry="2.6" stroke="currentColor" stroke-width="1" opacity=".5" transform="rotate(-18 12 12)"/><circle cx="20.6" cy="9.1" r="1.25" fill="#9CCBF4"/><circle cx="7.1" cy="13.9" r=".9" fill="#C66B42"/></svg>',
  search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  menu:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 7h18M3 12h18M3 17h18"/></svg>',
  x:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  sparkle:'<svg viewBox="0 0 24 24" aria-hidden="true"><defs><linearGradient id="nvg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9CCBF4"/><stop offset="1" stop-color="#B49CFF"/></linearGradient></defs><path fill="url(#nvg)" d="M12 1.5c.6 4.9 2.6 8 9 10.5-6.4 2.5-8.4 5.6-9 10.5-.6-4.9-2.6-8-9-10.5 6.4-2.5 8.4-5.6 9-10.5z"/><path fill="#DCD3FF" d="M19.5 1.8c.25 1.6.9 2.4 2.7 3.2-1.8.8-2.45 1.6-2.7 3.2-.25-1.6-.9-2.4-2.7-3.2 1.8-.8 2.45-1.6 2.7-3.2z"/></svg>',
  pin:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.4"/></svg>',
  arrow:'<svg class="arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 12h15m-6-6 6 6-6 6"/></svg>'
};
/* ── media helpers ── */
const isConcept = k => k && MEDIA[k] && /artist|illustration|concept/i.test(MEDIA[k].title);
function credit(k) {
  const m = MEDIA[k]; if (!m) return "";
  const who = ["NASA", m.center && m.center !== "HQ" ? m.center : null].filter(Boolean).join(" / ") + (m.photographer ? " — " + m.photographer : "");
  return who;
}
const THUMB_W = {"a11launch":760,"aldrin":760,"artemis1launch":760,"artemis2pad":760,"bennu":760,"cassini_assembly":760,"cassini_earth":760,"cassini_noodle":760,"curiosity":760,"earthrise":760,"earthset2026":760,"easep":760,"flag":760,"gale":760,"golden_record":760,"hero":760,"hero_lrv":760,"hubble_sts125":760,"hubble_sts31":760,"ingenuity":760,"insight":760,"iss":760,"juno_crescent":760,"jupiter":760,"lunokhod":760,"m3":760,"mariner4":760,"maven":760,"mercury":760,"moonnear":760,"neptune":760,"opportunity":760,"orion_earth_moon":760,"orion_moon":760,"perseverance":760,"pluto":760,"saturn_v":760,"spirit":760,"sputnik":760,"surveyor3":760,"uranus":760,"venus":760,"viking2":760,"voyager_launch":760,"voyager_test":760,"webb_carina":760,"webb_mirror":760};
/* small list icons (timeline rows, search results, credits) come from one sprite sheet: one request instead of dozens of photos */
const ICONS = {cols:10, rows:6, k:["a11launch","aldrin","artemis1launch","artemis2pad","bennu","cassini_assembly","cassini_earth","cassini_noodle","curiosity","earthrise","earthset2026","easep","flag","gale","golden_record","hero","hero_lrv","hubble_sts125","hubble_sts31","ingenuity","insight","iss","juno_crescent","juno_grs","jupiter","lro","luna21","lunokhod","m3","mariner4","maven","mercury","moonnear","mro","neptune","opportunity","orion_earth_moon","orion_moon","paleblue","pathfinder","perseverance","phoenix","pluto","ranger7","saturn_v","sojourner","spirit","sputnik","surveyor3","uranus","venus","viking","viking2","voyager_launch","voyager_test","webb_carina","webb_mirror"]};
function iconTag(k, w, h) {
  const i = ICONS.k.indexOf(k); if (i < 0) return imgTag(k, {thumb:true, alt:""});
  const cw = w, ch = w * 0.75, x = (i % ICONS.cols) * cw, y = Math.floor(i / ICONS.cols) * ch + (ch - h) / 2;
  return `<span class="ph ico" aria-hidden="true" style="background-image:url(img/icons.webp);background-size:${ICONS.cols * cw}px ${ICONS.rows * ch}px;background-position:-${x}px -${y}px"></span>`;
}
function imgTag(k, {thumb = false, alt = "", cls = "", eager = false} = {}) {
  const m = MEDIA[k];
  if (!m) return "";
  if (LOWDATA && !thumb && THUMB_W[k]) thumb = true;
  const src = (thumb ? "img/t/" : "img/") + k + ".webp";
  /* full-size images also offer the 900-px thumbnail, so phones and small windows download a fraction of the bytes */
  const set = !thumb && THUMB_W[k] ? ` srcset="img/t/${k}.webp ${THUMB_W[k]}w, img/${k}.webp ${m.w}w" sizes="(orientation: portrait) 190vw, 100vw"` : "";
  return `<img src="${src}"${set} alt="${esc(alt || m.title)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" class="${cls}" data-key="${k}" width="${m.w}" height="${m.h}">`;
}
function noImg(name) { return `<div class="noimg"><div><b>${esc(name)}</b>${esc(t("no_image"))}</div></div>`; }
function creditLink(k, label) {
  const m = MEDIA[k]; if (!m) return "";
  return `<a class="credit" href="${esc(m.page)}" target="_blank" rel="noopener">${isConcept(k) ? esc(t("artist_concept")) + " · " : ""}${esc(label || m.title)} · ${esc(credit(k))} · ${esc(m.id)}</a>`;
}
document.addEventListener("error", e => {
  const el = e.target;
  if (el.tagName === "IMG" && !el.dataset.failed) {
    el.dataset.failed = 1;
    const d = document.createElement("div"); d.className = "noimg";
    d.innerHTML = `<div><b>${esc(t("image_failed"))}</b>${esc(MEDIA[el.dataset.key]?.title || "")}</div>`;
    d.style.cssText = "width:100%;height:100%;min-height:80px";
    el.replaceWith(d);
  }
}, true);
/* ── gallery map & videos ── */
const GALLERY = {"apollo-11":["aldrin","flag","easep","a11launch"],"voyager-1":["voyager_launch","voyager_test","golden_record","paleblue"],"voyager-2":["neptune","uranus","voyager_test","golden_record"],
 "cassini-huygens":["cassini_earth","cassini_assembly","cassini_noodle","saturn_v"],"hubble":["hubble_sts125","hubble_sts31"],"jwst":["webb_carina","webb_mirror"],"curiosity":["curiosity","gale"],
 "perseverance":["perseverance","ingenuity"],"ingenuity":["ingenuity","perseverance"],"artemis-1":["orion_earth_moon","orion_moon","artemis1launch"],"artemis-2":["earthset2026","artemis2pad"],
 "apollo-8":["earthrise"],"apollo-17":["hero"],"apollo-12":["surveyor3"],"surveyor-3":["surveyor3"],"viking-1":["viking"],"viking-2":["viking2"],"juno":["juno_crescent","juno_grs","jupiter"],
 "mariner-10":["venus"],"mars-pathfinder":["sojourner","pathfinder"],"lunokhod-1":["lunokhod"],"lunokhod-2":["luna21"],"new-horizons":["pluto"],"saturn-v":["a11launch"],"messenger":["mercury"],
 "osiris-rex":["bennu"],"iss":["iss"],"sputnik-1":["sputnik"],"lro":["lro","moonnear","lunokhod","luna21"],"chandrayaan-1":["m3"],"ranger-7":["ranger7"],"mariner-4":["mariner4"],
 "insight":["insight"],"maven":["maven"],"phoenix":["phoenix"],"mro":["mro"],"spirit":["spirit"],"opportunity":["opportunity"]};
const VIDEOS = {"apollo-11":["apollo"],"saturn-v":["saturnv"],"perseverance":["perseverance"],"artemis-2":["artemis2","eclipse"]};

/* ── layout: nav + footer ── */
const NAV = [["home","nav_home"],["hardware","nav_hardware"],["explore","nav_explore"],["timeline","nav_timeline"],["moon","nav_moon"],["mars","nav_mars"],["why-mars","nav_whymars"],["international","nav_international"],["words","nav_words"],["destinations","nav_destinations"],["museum","nav_museum"],["solar","nav_solar"],["nova","nav_nova"],["about","nav_about"]];
function langSelect(id) {
  return `<label class="sr" for="${id}">${esc(t("language"))}</label><select class="langsel" id="${id}" data-lang>${LANGS.map(l => `<option value="${l.code}" ${l.code === lang ? "selected" : ""} lang="${l.code}">${l.label}</option>`).join("")}</select>`;
}
function renderChrome() {
  const route = curRoute().name;
  const skip = $('a.sr[href="#main"]'); if (skip) skip.textContent = t("skip");
  $("#nav").innerHTML = `<div class="wrap"><a class="brand" href="#home" aria-label="Forgotten Explorers — ${esc(t("nav_home"))}"><b>FORGOTTEN EXPLORERS</b><span>EST. 1957 · ARCHIVE</span></a>
   <ul class="navlinks">${NAV.filter(([h]) => h !== "nova" && h !== "solar" && h !== "destinations" && h !== "hardware" && h !== "words").map(([h, k]) => `<li><a href="#${h}" ${route === h ? 'aria-current="page"' : ""}>${esc(t(k))}</a></li>`).join("")}</ul>
   <div class="navtools"><button class="iconbtn" data-search aria-label="${esc(t("search"))}">${ICON.search}</button><a class="novabtn" href="#nova" data-novabtn aria-label="NOVA AI — ${esc(t("nova_title"))}" ${route === "nova" ? 'aria-current="page"' : ""}>${ICON.sparkle}<b>NOVA</b><b class="ai">AI</b></a>${langSelect("lang-top")}<button class="iconbtn burger" data-drawer aria-label="${esc(t("menu"))}">${ICON.menu}</button></div></div>`;
  $("#footer").innerHTML = `<div class="wrap"><div class="fgrid">
   <div><div class="fb">FORGOTTEN EXPLORERS</div><p style="color:var(--silver);margin-top:10px;max-width:38ch">${esc(t("tagline"))}</p><div style="margin-top:18px">${langSelect("lang-foot")}</div></div>
   <nav aria-label="${esc(t("footer_nav"))}">${NAV.map(([h, k]) => `<a href="#${h}">${esc(t(k))}</a>`).join("")}</nav>
   <div class="flinks"><a href="#about">${esc(t("data_sources"))}</a><a href="#credits">${esc(t("media_credits"))}</a><a href="#about-privacy">${esc(t("privacy"))}</a><button data-replay>${esc(t("intro_replay"))}</button><button data-lowdata aria-pressed="${LOWDATA}">${esc(t(LOWDATA ? "lowdata_on" : "lowdata_off"))}</button></div></div>
   <div class="disc"><p>${esc(t("disclaimer"))}</p><p>${esc(t("built_for"))}<br><span class="mono" style="color:var(--star)">${esc(t("built_by"))}</span></p></div></div>`;
}
document.addEventListener("change", e => {
  if (e.target.matches("[data-lang]")) setLang(e.target.value);
});
function setLang(code) {
  lang = code; store.set("lang", code);
  const L = LANGS.find(l => l.code === code);
  document.documentElement.lang = code; document.documentElement.dir = L.dir;
  localizeData(); closeLayer(); renderChrome(); route(true);
  if ($("#hwl") && window.FE_HW) FE_HW.refresh();
}
/* scroll: one rAF-throttled passive listener; the nav class is only touched when its state changes */
let navSolid = null, navHome = true, scrollTick = 0;
const onScroll = () => {
  if (scrollTick) return;
  scrollTick = requestAnimationFrame(() => { scrollTick = 0; const n = $("#nav"); if (!n) return; const v = window.scrollY > 40 || !navHome; if (v !== navSolid) { navSolid = v; n.classList.toggle("solid", v); } });
};
window.addEventListener("scroll", onScroll, {passive:true});
const REDUCED = window.matchMedia ? matchMedia("(prefers-reduced-motion: reduce)") : {matches:false};
const LOWPOWER = (navigator.connection && navigator.connection.saveData) || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2);
/* Low Data Mode: the visitor's own switch (footer / menu), or the browser's Save-Data hint, or a 2G connection.
   Pictures then come as the small versions, nothing is fetched ahead of scrolling and decorative motion stops. */
const LOWDATA = store.get("lowData") === "1" || (store.get("lowData") !== "0" && !!((navigator.connection && navigator.connection.saveData) || /(^|-)2g$/.test((navigator.connection && navigator.connection.effectiveType) || "")));
if (LOWDATA) document.documentElement.classList.add("lowdata");
const scrollTop = () => { try { window.scrollTo({top:0, left:0, behavior:"instant"}); } catch (e) { const h = document.documentElement, b = h.style.scrollBehavior; h.style.scrollBehavior = "auto"; window.scrollTo(0, 0); h.style.scrollBehavior = b; } };
/* progressive section reveal: each element animates once, staggered within its group */
let revealIO = null, heroIO = null;
/* Scroll reveal is applied to text blocks only. Anything that carries a photograph (cards, plates, galleries, rails,
   timeline rows) is never hidden, so images appear the moment they are decoded instead of waiting for a fade. */
const RV_SEL = [".section .shead", ".section .copy > *", ".fates > div", ".tlstrip > a",
  ".world .copy > *", ".closing blockquote", ".closing .btn", ".hwlink", ".msec", ".mhero .facts", ".tablewrap", ".period", ".pagehead .lede", ".docgrid > .doccopy"].join(",");
function reveal(root) {
  if (revealIO) { revealIO.disconnect(); revealIO = null; }
  if (REDUCED.matches || !("IntersectionObserver" in window)) return;
  const els = $$(RV_SEL, root).filter(el => !el.closest(".hero"));
  if (!els.length) return;
  const vh = window.innerHeight, groups = new Map();
  revealIO = new IntersectionObserver(entries => {
    for (const en of entries) if (en.isIntersecting) { en.target.classList.add("in"); revealIO.unobserve(en.target); }
  }, {rootMargin:"0px 0px 4% 0px", threshold:0});
  for (const el of els) {
    const r = el.getBoundingClientRect();
    if (r.top < vh * 0.94 && r.bottom > 0) continue; /* already on screen: leave it as rendered, no pop-in */
    const g = el.parentElement, n = groups.get(g) || 0; groups.set(g, n + 1);
    el.style.setProperty("--rd", Math.min(n % 4, 3) * 40 + "ms");
    el.classList.add("rv"); if (LOWPOWER) el.classList.add("lite");
    revealIO.observe(el);
  }
}
/* ── image loading ──
   Native lazy-loading starts very late in some browsers (Safari, Firefox) and never starts for images that are
   off to the side of a horizontal rail. One shared IntersectionObserver per scroll root watches every lazy image
   and switches it to eager loading when it comes within ~1.5 screens (more on slow connections), so photos are
   already decoded when they scroll into view. Images that are still downloading when they become visible keep their
   placeholder background and fade in briefly once ready. A MutationObserver picks up images added later
   (tabs, translated panels, the Why Mars page). */
const IMGPRIME = (() => {
  if (!("IntersectionObserver" in window)) return {scan(){}};
  const slow = /(^|-)2g|3g/.test((navigator.connection && navigator.connection.effectiveType) || "");
  const lowMem = !!(navigator.deviceMemory && navigator.deviceMemory <= 2); /* skip pre-decoding on low-memory phones */
  const near = LOWDATA ? 120 : Math.round(Math.max(600, Math.min(1400, window.innerHeight * (slow ? 2.5 : 1.5))));
  const roots = new Map();
  const ready = img => { img.classList.remove("fe-ld"); if (img.dataset.fade) { img.classList.add("fe-in"); delete img.dataset.fade; } };
  const prime = img => {
    if (img.loading === "lazy") img.loading = "eager";
    if (!img.complete) {
      const r = img.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth) { img.classList.add("fe-ld"); img.dataset.fade = 1; }
      img.addEventListener("load", () => { ready(img); if (img.decode && !lowMem) img.decode().catch(() => {}); }, {once:true});
      img.addEventListener("error", () => ready(img), {once:true});
    } else if (img.decode && img.naturalWidth && !lowMem) img.decode().catch(() => {});
  };
  const observerFor = root => {
    if (roots.has(root)) return roots.get(root);
    const io = new IntersectionObserver(entries => { for (const e of entries) if (e.isIntersecting) { io.unobserve(e.target); prime(e.target); } },
      root ? {root, rootMargin:`0px ${near}px`} : {rootMargin:`${near}px 0px`});
    roots.set(root, io); return io;
  };
  /* start look-ahead loading only after the page's own first-screen content has loaded, so it never competes with it */
  let live = document.readyState === "complete";
  const pending = [];
  if (!live) { const go = () => { if (live) return; live = true; pending.splice(0).forEach(([img, root]) => observerFor(root).observe(img)); };
    window.addEventListener("load", go, {once:true}); setTimeout(go, 3000); }
  const scan = node => {
    if (!node || !node.querySelectorAll) return;
    const list = node.matches && node.matches("img[loading=lazy]") ? [node] : node.querySelectorAll("img[loading=lazy]");
    for (const img of list) { if (img.dataset.primed) continue; img.dataset.primed = 1; const root = img.closest(".featured-rail") || null; if (live) observerFor(root).observe(img); else pending.push([img, root]); }
  };
  new MutationObserver(ms => { for (const m of ms) for (const n of m.addedNodes) if (n.nodeType === 1) scan(n); }).observe(document.body, {childList:true, subtree:true});
  return {scan, reset() { for (const io of roots.values()) io.disconnect(); roots.clear(); pending.length = 0; }};
})();
/* pause the hero's slow drift while the hero is off screen */
function watchHero() {
  if (heroIO) { heroIO.disconnect(); heroIO = null; }
  const h = $(".hero"); if (!h || !("IntersectionObserver" in window)) return;
  heroIO = new IntersectionObserver(([en]) => h.classList.toggle("off", !en.isIntersecting)); heroIO.observe(h);
}

/* ── layer: drawer / search / lightbox ── */
function openLayer(html, cls) { const l = $("#layer"); l.innerHTML = `<div class="${cls}" role="dialog" aria-modal="true">${html}</div>`; document.body.style.overflow = "hidden"; }
function closeLayer() { $("#layer").innerHTML = ""; document.body.style.overflow = ""; }
document.addEventListener("keydown", e => { if (e.key === "Escape" && $("#layer").innerHTML) closeLayer(); if ((e.key === "/" || (e.key === "k" && (e.metaKey || e.ctrlKey))) && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) && !$(".museum") && !$(".hwl") && !$(".dc") && !$("#jr")) { e.preventDefault(); openSearch(); } });
document.addEventListener("click", e => {
  const a = e.target.closest("[data-search]"); if (a) { openSearch(); return; }
  if (e.target.closest("[data-drawer]")) {
    openLayer(`<div class="top"><span class="brand"><b>FORGOTTEN EXPLORERS</b></span><button class="iconbtn" data-close aria-label="${esc(t("close"))}">${ICON.x}</button></div><span class="mono dlabel">${esc(t("hw_title"))}</span><a class="dfeat" href="#hardware" data-close data-hwnav>${ICON.pin}<span><b>${esc(t("nav_hardware"))}</b><small>${esc(t("hw_moon_s"))} · ${esc(t("hw_mars_s"))}</small></span></a>
     <nav aria-label="${esc(t("menu"))}">${NAV.filter(([h]) => h !== "hardware").map(([h, k]) => `<a href="#${h}" data-close>${esc(t(k))}</a>`).join("")}</nav><div style="margin-top:24px">${langSelect("lang-drawer")}</div><button class="dlow" data-lowdata aria-pressed="${LOWDATA}">${esc(t(LOWDATA ? "lowdata_on" : "lowdata_off"))}<small>${esc(t("lowdata_d"))}</small></button>`, "drawer");
    $("#layer").insertAdjacentHTML("afterbegin", '<div class="drawerbg" data-close></div>');
    $(".drawer a")?.focus(); return;
  }
  if (e.target.closest("[data-close]")) { closeLayer(); return; }
  if (e.target.closest("[data-replay]")) { playIntro(true); return; }
  if (e.target.closest("[data-lowdata]")) { store.set("lowData", LOWDATA ? "0" : "1"); location.reload(); return; }
  const g = e.target.closest(".gallery img, [data-lightbox]");
  if (g && g.dataset.key) { lightbox(g.dataset.key); return; }
  if (e.target.classList.contains("lightbox")) closeLayer();
});
function lightbox(k) {
  const m = MEDIA[k];
  openLayer(`<button class="iconbtn x" data-close aria-label="${esc(t("close"))}">${ICON.x}</button>${imgTag(k, {eager:true})}<div class="lbcap"><b>${isConcept(k) ? esc(t("artist_concept")) + " · " : ""}${esc(m.title)}</b><br><span class="mono" style="font-size:.66rem;color:var(--silver)">${esc(credit(k))} · ${esc(m.id)} · ${esc(m.date)}</span><br><a href="${esc(m.page)}" target="_blank" rel="noopener" style="color:var(--blue)">${esc(t("source_page"))}</a> · <a href="${esc(m.src)}" target="_blank" rel="noopener" style="color:var(--blue)">${esc(t("open_original"))}</a></div>`, "lightbox");
  $(".lightbox .x").focus();
}
/* search */
function searchMissions(q) {
  const s = q.trim().toLowerCase(); if (!s) return [];
  const terms = s.split(/\s+/);
  return M.map(m => {
    const hay = [m.name, m.id, m.agency.join(" "), agencies(m), m.country, m.dest, deLabel(m.dest), m.type, tyLabel(m.type), m.summary, m._sum].join(" ").toLowerCase();
    let sc = 0; for (const w of terms) { if (m.name.toLowerCase().includes(w)) sc += 5; else if (hay.includes(w)) sc += 1; else return null; }
    return [sc, m];
  }).filter(Boolean).sort((a, b) => b[0] - a[0]).map(x => x[1]);
}
function openSearch() {
  openLayer(`<button class="iconbtn x" data-close aria-label="${esc(t("close"))}">${ICON.x}</button><div class="inner"><label class="sr" for="gsearch">${esc(t("search"))}</label><input id="gsearch" type="search" autocomplete="off" placeholder="${esc(t("search_ph"))}"><ul class="sres" id="sres"></ul></div>`, "searchbox");
  const inp = $("#gsearch"); inp.focus();
  let sTm = 0;
  inp.addEventListener("input", () => { clearTimeout(sTm); sTm = setTimeout(doSearch, 90); });
  const doSearch = () => {
    const r = searchMissions(inp.value).slice(0, 10);
    const dests = window.FE_DESTINATIONS.filter(d => inp.value.trim().length > 1 && deLabel(d.id).toLowerCase().includes(inp.value.trim().toLowerCase()));
    $("#sres").innerHTML = dests.map(d => `<li><a href="#d-${d.id}" data-close>${d.img ? imgTag(d.img, {thumb:true, alt:""}) : '<span class="ph"></span>'}<span><b>${esc(deLabel(d.id))}</b><br><small>${esc(t("nav_destinations"))}</small></span></a></li>`).join("") +
      r.map(m => `<li><a href="#m-${m.id}" data-close>${m.img ? iconTag(m.img, 72, 54) : '<span class="ph"></span>'}<span><b>${esc(m.name)}</b><br><small>${esc(agencies(m))} · ${yearL(year(m))} · ${esc(deLabel(m.dest))}</small></span></a></li>`).join("") ||
      (inp.value.trim() ? `<li style="padding:16px 0;color:var(--silver)">${esc(t("no_results"))}</li>` : "");
  };
}

/* ── components ── */
function card(m, {desc = true} = {}) {
  return `<a class="card" href="#m-${m.id}"><div class="ph">${m.img ? imgTag(m.img, {thumb:true, alt:m.name}) : noImg(m.name)}${pill(m.status)}</div>
   <div class="meta"><span>${esc(m.agency[0])}</span><span>${esc(deLabel(m.dest))}</span><span>${yearL(year(m))}</span></div><h3>${esc(m.name)}</h3>${desc ? `<p>${esc(m.summary)}</p>` : ""}<span class="more">${esc(t("read_story"))} ${ICON.arrow}</span></a>`;
}
const pageHead = (eyebrow, title, intro, k) => `<section class="pagehead">${k ? `<div class="bg">${imgTag(k, {eager:true, alt:""})}</div>${creditLink(k)}` : ""}<div class="wrap"><span class="mono eyebrow">${esc(eyebrow)}</span><h1>${esc(title)}</h1>${intro ? `<p class="lede">${esc(intro)}</p>` : ""}</div></section>`;

/* ── HOME ── */
function home() {
  const featured = ["voyager-1","voyager-2","cassini-huygens","hubble","jwst","mars-pathfinder","curiosity","perseverance","new-horizons","lro","artemis-2","ingenuity"].map(i => byId[i]);
  const tlPick = ["sputnik-1","apollo-11","voyager-1","hubble","mars-pathfinder","cassini-huygens","curiosity","perseverance","jwst","artemis-1"].map(i => byId[i]);
  const still = M.filter(m => m.status === "active" && ["interstellar","pluto","mars","moon","small-bodies"].includes(m.dest)).sort((a, b) => year(a) - year(b)).slice(0, 7);
  const silent = M.filter(m => ["contact-lost","inactive","lost"].includes(m.status)).sort((a, b) => year(a) - year(b)).slice(0, 7);
  const design = M.filter(m => m.status === "completed" && ["saturn","jupiter","mercury","venus","small-bodies","moon"].includes(m.dest)).sort((a, b) => year(b) - year(a)).slice(0, 7);
  const fate = (title, list, st) => `<div><span class="mono" style="color:var(--silver)">${esc(t("n_missions", {n:yearL(list.length)}))}</span><h3>${pill(st)} ${esc(title)}</h3><ul>${list.map(m => `<li><a href="#m-${m.id}">${esc(m.name)}<span>${yearL(year(m))} · ${esc(stLabel(m.status))}</span></a></li>`).join("")}</ul></div>`;
  const moonChips = ["ranger-7","surveyor-3","apollo-8","apollo-11","apollo-15","apollo-17","lro","grail","artemis-1","artemis-2"].map(i => byId[i]);
  const moonIntl = ["luna-2","luna-9","lunokhod-1","chandrayaan-3","slim","change-6"].map(i => byId[i]);
  const marsChips = ["mariner-4","mariner-9","viking-1","mars-pathfinder","spirit","opportunity","phoenix","curiosity","maven","insight","perseverance","ingenuity"].map(i => byId[i]);
  const marsIntl = ["mars-3","mars-express","mangalyaan","hope","tianwen-1"].map(i => byId[i]);
  const progChips = d => `<div class="pchips"><span class="mono">${esc(t("hm_programmes"))}</span>${PROG[d].map(([k]) => `<a href="#${d}/${k}">${esc(k === "next" ? t("pm_next_t") : t("pm_" + k + "_t"))}</a>`).join("")}</div>`;
  const intlLine = l => `<p class="intline"><span>${esc(t("hm_intl_line"))}</span> ${l.map(m => `<a href="#m-${m.id}">${esc(m.name)}</a>`).join(" · ")} · <a href="#international">${esc(t("nav_international"))} →</a></p>`;
  return `
  <section class="hero hero2" aria-labelledby="h-hero">
   <div class="h2art">
    <div class="h2img h2moon"><picture><source type="image/webp" srcset="${LOWDATA ? "img/hero_lrv-960.webp 960w" : "img/hero_lrv-960.webp 960w, img/hero_lrv-1600.webp 1600w, img/hero_lrv-2400.webp 2400w"}" sizes="(max-width:760px) 62vw, 40vw"><img src="img/hero_lrv.webp" alt="${esc(MEDIA.hero_lrv.title)}" width="1600" height="1120" fetchpriority="high" decoding="async" data-key="hero_lrv"></picture></div>
    <div class="h2img h2mars"><img src="${LOWDATA ? "img/t/curiosity.webp" : "img/curiosity.webp"}" srcset="${LOWDATA ? "img/t/curiosity.webp 760w" : "img/t/curiosity.webp 760w, img/curiosity.webp 1920w"}" sizes="(max-width:760px) 62vw, 40vw" alt="${esc(MEDIA.curiosity.title)}" width="1920" height="1169" fetchpriority="high" decoding="async" data-key="curiosity"></div>
   </div>
   <div class="wrap"><span class="mono eyebrow">NASA SPACE APPS CHALLENGE 2026</span>
    <h1 id="h-hero" style="margin-top:18px">${(h => /[.।]$/.test(h) ? esc(h.slice(0, -1)) + '<span class="h2acc">' + esc(h.slice(-1)) + "</span>" : esc(h))(t("hero2_h"))}</h1>
    <p class="tag">${esc(t("hero2_sub"))}</p><p class="lede">${esc(t("hero2_d"))}</p>
    <div class="btnrow"><a class="btn primary" href="#hardware">${esc(t("cta_hw"))} ${ICON.arrow}</a><a class="btn" href="#explore">${esc(t("cta_discover"))} ${ICON.arrow}</a></div>
   </div>
   <div class="h2foot mono"><a href="${MEDIA.hero_lrv.page}" target="_blank" rel="noopener">${esc(t("hero2_moon"))} · Apollo 17 · AS17-147-22526 · NASA/JSC — Harrison H. Schmitt</a><a href="${MEDIA.curiosity.page}" target="_blank" rel="noopener">${esc(t("hero2_mars"))} · Curiosity, Buckskin · PIA19808 · NASA/JPL-Caltech/MSSS</a><span class="h2by">Built by heisenberg.exe</span></div>
  </section>

  ${hwSection()}

  ${docSection()}

  ${nasaSection()}

  <section class="world moon big" id="home-moon"><div class="bg">${imgTag("earthrise", {alt:MEDIA.earthrise.title})}</div>${creditLink("earthrise", "Earthrise · Apollo 8 · AS08-14-2383")}
   <div class="wrap"><div class="copy"><span class="mono eyebrow">05 · ${esc(t("nav_moon"))}</span><h2>${esc(t("h_moonprev"))}</h2><p class="lede" style="color:#D6DEE8">${esc(t("p_moonprev"))}</p>
   ${progChips("moon")}<div class="chips">${moonChips.map(m => `<a class="chip" href="#m-${m.id}">${esc(m.name)}</a>`).join("")}</div>${intlLine(moonIntl)}<div><a class="btn primary" href="#moon">${esc(t("enter_moon"))} ${ICON.arrow}</a></div></div></div></section>

  <section class="world mars big" id="home-mars"><div class="bg">${imgTag("curiosity", {alt:MEDIA.curiosity.title})}</div>${creditLink("curiosity")}
   <div class="wrap"><div class="copy"><span class="mono eyebrow">06 · ${esc(t("nav_mars"))}</span><h2>${esc(t("h_marsprev"))}</h2><p class="lede" style="color:#D6DEE8">${esc(t("p_marsprev"))}</p>
   ${progChips("mars")}<div class="chips">${marsChips.map(m => `<a class="chip" href="#m-${m.id}">${esc(m.name)}</a>`).join("")}</div>${intlLine(marsIntl)}<div><a class="btn primary" href="#mars" style="background:var(--rust);border-color:var(--rust);color:#fff">${esc(t("enter_mars"))} ${ICON.arrow}</a></div></div></div></section>

  <section class="section"><div class="wrap split">
   <div class="copy"><span class="mono eyebrow">07 · 1957–1972</span><h2>${esc(t("h_begin"))}</h2><p>${esc(t("p_begin1"))}</p><p>${esc(t("p_begin2"))}</p>
    <div class="btnrow"><a class="btn" href="#m-apollo-11">Apollo 11 ${ICON.arrow}</a><a class="btn" href="#m-sputnik-1">Sputnik 1 ${ICON.arrow}</a></div></div>
   <div class="duo"><figure class="plate">${imgTag("aldrin", {thumb:true})}<figcaption><span>AS11-40-5903 · 20.07.1969</span><a href="${MEDIA.aldrin.page}" target="_blank" rel="noopener">NASA</a></figcaption></figure>
    <figure class="plate">${imgTag("a11launch", {thumb:true})}<figcaption><span>S69-39961 · 16.07.1969</span><a href="${MEDIA.a11launch.page}" target="_blank" rel="noopener">NASA</a></figcaption></figure></div>
  </div></section>

  <section class="section band" style="padding-block:80px"><div class="wrap"><div class="shead"><div><span class="mono eyebrow">08</span><h2>${esc(t("h_featured"))}</h2></div><a class="btn" href="#explore">${esc(t("cta_explore"))} ${ICON.arrow}</a></div>
   <div class="featured-rail" tabindex="0" aria-label="${esc(t("h_featured"))}">${featured.map(m => card(m)).join("")}</div></div></section>

  <section class="section"><div class="wrap"><div class="shead"><div><span class="mono eyebrow">09 · 1957 → ${yearL(2026)}</span><h2>${esc(t("h_timeline"))}</h2></div><a class="btn" href="#timeline">${esc(t("see_timeline"))} ${ICON.arrow}</a></div>
   <div class="tlstrip">${tlPick.map(m => `<a href="#m-${m.id}"><b>${yearL(year(m))}</b><span>${esc(m.name)}</span></a>`).join("")}</div></div></section>

  ${wmSection()}

  ${intlBand()}

  <section class="section"><div class="wrap"><div class="shead"><div><span class="mono eyebrow">11</span><h2>${esc(t("h_still"))}</h2></div></div>
   <div class="fates">${fate(t("still_travelling"), still, "active")}${fate(t("fell_silent"), silent, "contact-lost")}${fate(t("ended_by_design"), design, "completed")}</div></div></section>

  <section class="section band"><div class="wrap split">
   <div class="copy"><span class="mono eyebrow">12 · ${esc(t("nav_museum"))}</span><h2>${esc(t("h_museum"))}</h2><p>${esc(t("p_museum"))}</p>
    <ul style="list-style:none;padding:0;margin:0;display:grid;grid-template-columns:1fr 1fr;gap:6px 18px" class="mono">${window.FE_MODELS.map(x => `<li style="color:var(--silver)">◦ ${esc(x.name)}</li>`).join("")}</ul>
    <div><a class="btn primary" href="#museum">${esc(t("cta_museum"))} ${ICON.arrow}</a></div></div>
   <figure class="plate">${imgTag("perseverance", {thumb:true})}<figcaption><span>PIA24542 · ${esc(t("mu_model_credit"))}</span><a href="${MEDIA.perseverance.page}" target="_blank" rel="noopener">NASA/JPL-Caltech/MSSS</a></figcaption></figure>
  </div></section>

  <section class="section"><div class="wrap split">
   <div class="copy"><span class="mono eyebrow">13 · NOVA</span><h2>${esc(t("h_nova"))}</h2><p>${esc(t("p_nova"))}</p>
    <div class="suggest">${["nova_q1","nova_q3"].map(q => `<a class="btn" style="justify-content:space-between;text-transform:none;letter-spacing:0;font-family:var(--f-body);font-size:.95rem" href="#nova" data-ask="${esc(t(q))}">${esc(t(q))} ${ICON.arrow}</a>`).join("")}</div>
    <div><a class="btn primary" href="#nova">${esc(t("h_nova"))} ${ICON.arrow}</a></div></div>
   <figure class="plate">${imgTag("paleblue", {thumb:true})}<figcaption><span>PIA00452 · Voyager 1 · 14.02.1990</span><a href="${MEDIA.paleblue.page}" target="_blank" rel="noopener">NASA/JPL</a></figcaption></figure>
  </div></section>

  <section class="closing band"><div class="wrap"><span class="mono eyebrow" style="justify-content:center">14</span><blockquote>“${esc(t("closing"))}”</blockquote><a class="btn primary" href="#explore">${esc(t("cta_explore"))} ${ICON.arrow}</a></div></section>`;
}
function docSection() {
  const D = window.FE_DOCDATA, tot = D ? Math.round(D.total) : 174, mm = Math.floor(tot / 60), ss = tot % 60;
  return `<section class="docsec" aria-labelledby="h-doc"><div class="wrap docgrid">
   <a class="docthumb" href="#documentary" aria-label="${esc(t("doc_play"))}: The Silent Legacy"><img src="img/t/aldrin.webp" srcset="img/t/aldrin.webp ${THUMB_W.aldrin || 900}w, img/aldrin.webp ${MEDIA.aldrin.w}w" sizes="(max-width:900px) 100vw, 50vw" alt="${esc(MEDIA.aldrin.title)}" loading="lazy" decoding="async" width="${MEDIA.aldrin.w}" height="${MEDIA.aldrin.h}">
    <span class="dplay" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="currentColor"/></svg></span><span class="ddur">${mm}:${String(ss).padStart(2, "0")}</span><span class="dsrc">AS11-40-5903 · NASA</span></a>
   <div class="doccopy"><span class="mono eyebrow">${esc(t("doc_label"))}</span><h2 id="h-doc" style="margin-top:16px">THE SILENT LEGACY</h2><p class="dsub">${esc(t("doc_sub"))}</p><p>${esc(t("doc_desc"))}</p>
    <div class="btnrow"><a class="btn primary" href="#documentary"><svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4v16l14-8z" fill="currentColor"/></svg> ${esc(t("doc_play"))}</a></div>
    <p class="verified" style="margin-top:16px">${esc(t("doc_minutes", {m:mm, s:ss}))} · ${esc(t("doc_meta"))}</p></div></div></section>`;
}
function wmSection() {
  return `<section class="wmsec" aria-labelledby="h-wm"><div class="wrap wmgrid">
   <a class="wmplanet" href="#why-mars" tabindex="-1" aria-hidden="true"><img src="wm/img/mars_disk.webp" alt="" loading="lazy" decoding="async" width="450" height="450"><i></i></a>
   <div class="wmcopy"><span class="mono eyebrow">${esc(t("wm_card_k"))}</span><h2 id="h-wm">${esc(t("wm_title"))}</h2><p class="wmsub">${esc(t("wm_sub"))}</p><p>${esc(t("wm_card_d"))}</p>
    <div class="btnrow"><a class="btn primary" href="#why-mars" style="background:var(--rust);border-color:var(--rust);color:#fff">${esc(t("wm_explore"))} ${ICON.arrow}</a></div>
    <small class="mono">PIA18184 · NASA/STScI/AURA</small></div></div></section>`;
}
function hwSection() {
  const H = window.HW_ITEMS || [], n = d => H.filter(i => i.dest === d).length, m = d => H.filter(i => i.dest === d && i.loc).length;
  const card = (d, img, id, page) => `<article class="hwcard ${d}"><div class="ph"><img src="hw/img/t/${img}.jpg" alt="" loading="lazy" decoding="async" width="640" height="${img === "lrv15" ? 640 : 321}"><a class="cred" href="${page}" target="_blank" rel="noopener">${id} · NASA</a></div>
   <div class="tx"><span class="mono" style="color:${d === "mars" ? "var(--rust)" : "#C7D3E0"}">${esc(t("hw_counts", {n:yearL(n(d)), m:yearL(m(d))}))}</span><h3>${esc(t("hw_" + d))}</h3><p>${esc(t("hw_" + d + "_desc"))}</p>
   <div class="ex"><b>${esc(t("hw_examples"))}</b>${esc(t("hw_" + d + "_ex"))}</div><a class="btn ${d === "moon" ? "primary" : ""}" href="#hardware-${d}" ${d === "mars" ? 'style="background:var(--rust);color:#fff"' : ""}>${esc(t("hw_explore_" + d))} ${ICON.arrow}</a></div></article>`;
  return `<section class="section band hwsec hwtop" id="locator" aria-labelledby="h-hw"><div class="wrap"><div class="shead"><div><span class="mono eyebrow">02 · ${esc(t("hw_title"))}</span><h2 id="h-hw" class="hwbig">${esc(t("nav_hardware"))}</h2><p class="lede" style="margin-top:14px;max-width:64ch">${esc(t("hl_d"))}</p></div>
   <a class="btn primary hwcta" href="#hardware">${ICON.pin.replace('aria-hidden="true"', 'aria-hidden="true" width="18" height="18"')} ${esc(t("cta_hw"))} ${ICON.arrow}</a></div>
   <div class="hwcards">${card("moon", "lrv15", "AS15-86-11603", "https://images.nasa.gov/details/as15-86-11603")}${card("mars", "heli_delta", "PIA25080", "https://images.nasa.gov/details/PIA25080")}</div>
   <p class="verified" style="margin-top:16px">${esc(t("hw_accuracy_promise"))}</p></div></section>`;
}
/* ── NASA SPOTLIGHT · programmes · international ── */
const isNasa = m => m.agency.some(a => agencyKey(a) === "NASA");
const agOf = m => isNasa(m) ? "nasa" : "intl";
const ids = a => a.map(i => byId[i]).filter(Boolean);
const STATUS_CHECKED = "2026-11-05";
/* Upcoming / in-flight / cancelled / proposed. Facts and dates from the linked sources; targets can move. */
const NEXT = [
 {k:"roman", n:"Nancy Grace Roman Space Telescope", st:"enroute", launch:"2026-08-30", dest:"earth-orbit", src:"https://science.nasa.gov/mission/roman-space-telescope/roman-launch/"},
 {k:"escapade", n:"ESCAPADE", st:"enroute", launch:"2025-11-13", dest:"mars", src:"https://www.nasa.gov/news-release/nasa-blue-origin-launch-two-spacecraft-to-study-mars-solar-wind/"},
 {k:"clipper", n:"Europa Clipper", id:"europa-clipper", st:"enroute", launch:"2024-10-14", dest:"jupiter", src:"https://science.nasa.gov/mission/europa-clipper/"},
 {k:"artemis3", n:"Artemis III", st:"planned", target:"2027", dest:"moon", src:"https://www.nasa.gov/missions/artemis/nasas-artemis-iii-mission-to-test-future-moon-lander-operations/"},
 {k:"viper", n:"VIPER", st:"planned", target:"2027", dest:"moon", src:"https://www.nasa.gov/news-release/nasa-selects-blue-origin-to-deliver-viper-rover-to-moons-south-pole/"},
 {k:"artemis4", n:"Artemis IV", st:"planned", target:"2028", dest:"moon", src:"https://www.nasa.gov/humans-in-space/artemis/"},
 {k:"dragonfly", n:"Dragonfly", st:"planned", target:"2028", dest:"saturn", src:"https://www.jhuapl.edu/news/news-releases/240417-nasa-confirms-apl-led-dragonfly-mission-to-saturn-moon-titan"},
 {k:"msr", n:"Mars Sample Return", st:"cancelled", dest:"mars", src:"https://www.livescience.com/space/mars/nasas-mars-sample-return-is-dead-leaving-china-to-retrieve-signs-of-life-from-the-red-planet"},
 {k:"humans", nk:"nx_humans_n", st:"proposed", dest:"mars", src:"https://www.nasa.gov/wp-content/uploads/2025/12/2025-architecture-update-for-publication.pdf"}];
const DISC = [["curiosity","dc_curiosity"],["kepler","dc_kepler"],["voyager-1","dc_voyager"],["new-horizons","dc_pluto"],["jwst","dc_jwst"],["hubble","dc_hubble"],["mariner-9","dc_mariner9"],["grail","dc_grail"],["cassini-huygens","dc_cassini"],["lro","dc_lro"]];
const TECH = [["saturn-v","tc_saturnv"],["apollo-15","tc_lrv"],["curiosity","tc_skycrane"],["ingenuity","tc_ingenuity"],["perseverance","tc_moxie"],["jwst","tc_webb"],["voyager-1","tc_rtg"],["ladee","tc_laser"],["hubble","tc_service"]];
const MILESTONES = ["explorer-1","ranger-7","mariner-4","surveyor-1","apollo-8","apollo-11","mariner-9","pioneer-10","skylab","viking-1","voyager-2","voyager-1","hubble","mars-pathfinder","iss","spirit","kepler","curiosity","juno","jwst","artemis-1","perseverance","europa-clipper","artemis-2"];
const NS = {tab:"hist"};
const nsRow = m => `<a href="#m-${m.id}"><time datetime="${m.launch}">${esc(fmtDate(m.launch))}</time>${m.img ? iconTag(m.img, 96, 64) : '<span class="ph"></span>'}<span><b>${esc(m.name)}</b><small>${esc(agencies(m))} · ${esc(deLabel(m.dest))}</small></span>${pill(m.status)}</a>`;
const nextRow = x => { const nm = x.nk ? t(x.nk) : x.n, when = x.launch ? t("ns_launch", {y:fmtDate(x.launch)}) : x.target ? t("ns_target", {y:yearL(+x.target)}) : "";
  return `<li class="nxi"><div class="nxh"><b>${x.id && byId[x.id] ? `<a href="#m-${x.id}">${esc(nm)}</a>` : esc(nm)}</b>${pill(x.st)}</div><p>${esc(t("nx_" + x.k))}</p><small class="mono">${esc(deLabel(x.dest))}${when ? " · " + esc(when) : ""} · <a href="${x.src}" target="_blank" rel="noopener">${esc(t("ns_source"))} ↗</a></small></li>`; };
const factRow = ([id, k]) => { const m = byId[id]; return m ? `<li class="nfi"><a href="#m-${m.id}">${m.img ? iconTag(m.img, 72, 54) : '<span class="ph"></span>'}<span><b>${esc(m.name)}</b><small class="mono">${yearL(year(m))}</small></span></a><p>${esc(t(k))}</p></li>` : ""; };
function nsPanel(tab) {
  const N = M.filter(isNasa), byL = (a, b) => a.launch.localeCompare(b.launch);
  if (tab === "next") return `<p class="nsd">${esc(t("ns_next_d", {date:fmtDate(STATUS_CHECKED)}))}</p><ul class="nxl">${NEXT.map(nextRow).join("")}</ul>`;
  if (tab === "disc" || tab === "tech") return `<p class="nsd">${esc(t("ns_" + tab + "_d"))}</p><ul class="nfl">${(tab === "disc" ? DISC : TECH).map(factRow).join("")}</ul>`;
  const list = tab === "hist" ? ids(MILESTONES).sort(byL) : tab === "human" ? N.filter(m => m.type === "crewed" || m.type === "station").sort(byL)
    : tab === "deep" ? N.filter(m => !["earth-orbit","moon"].includes(m.dest)).sort(byL) : N.filter(m => m.status === "active").sort(byL);
  return `<p class="nsd">${esc(t("ns_" + tab + "_d"))} · ${esc(t("n_missions", {n:yearL(list.length)}))}</p><div class="tl nstl">${list.map(nsRow).join("")}</div>`;
}
function nasaSection() {
  const N = M.filter(isNasa), tabs = ["hist","human","deep","now","next","disc","tech"];
  if (!tabs.includes(NS.tab)) NS.tab = "hist";
  return `<section class="nsec" id="nasa" aria-labelledby="h-nasa"><div class="bg">${imgTag("webb_carina", {alt:""})}</div>${creditLink("webb_carina")}
   <div class="wrap"><div class="nshead"><div class="copy"><span class="mono eyebrow">04 · ${esc(t("ns_k"))}</span><h2 id="h-nasa">${esc(t("ns_title"))}</h2><p class="lede">${esc(t("ns_intro"))}</p></div>
    <div class="coord mono nsstats"><div>${esc(t("ns_stat_missions"))}<b>${yearL(N.length)}</b></div><div>${esc(t("ns_stat_active"))}<b>${yearL(N.filter(m => m.status === "active").length)}</b></div><div>${esc(t("ns_stat_crewed"))}<b>${yearL(6)}</b></div><div>${esc(t("ns_stat_mars"))}<b>${yearL(9)}</b></div></div></div>
    <div class="nstabs" role="tablist" aria-label="${esc(t("ns_k"))}">${tabs.map(k => `<button role="tab" id="nst-${k}" data-nstab="${k}" aria-selected="${NS.tab === k}" aria-controls="nspanel" tabindex="${NS.tab === k ? 0 : -1}">${esc(t("ns_tab_" + k))}</button>`).join("")}</div>
    <div class="nspanel" id="nspanel" role="tabpanel" aria-labelledby="nst-${NS.tab}">${nsPanel(NS.tab)}</div>
       </div></section>`;
}
function bindNasa(root) {
  const bar = root.querySelector(".nstabs"); if (!bar) return;
  const pick = b => { NS.tab = b.dataset.nstab; bar.querySelectorAll("[data-nstab]").forEach(x => { const on = x === b; x.setAttribute("aria-selected", on); x.tabIndex = on ? 0 : -1; });
    const p = root.querySelector("#nspanel"); p.setAttribute("aria-labelledby", b.id); p.innerHTML = nsPanel(NS.tab); };
  bar.addEventListener("click", e => { const b = e.target.closest("[data-nstab]"); if (b) pick(b); });
  bar.addEventListener("keydown", e => { const bs = [...bar.querySelectorAll("[data-nstab]")], i = bs.indexOf(document.activeElement); if (i < 0) return;
    const rtl = document.documentElement.dir === "rtl", d = e.key === "ArrowRight" ? (rtl ? -1 : 1) : e.key === "ArrowLeft" ? (rtl ? 1 : -1) : 0; if (!d) return;
    e.preventDefault(); const b = bs[(i + d + bs.length) % bs.length]; b.focus(); pick(b); });
}

/* Moon & Mars programme timelines */
const PROG = {
 moon:[["luna",["luna-2","luna-3","ranger-7","luna-9"]],["surveyor",["surveyor-1","surveyor-3"]],["apollo",["saturn-v","apollo-8","apollo-9","apollo-10","apollo-11","apollo-12","apollo-13","apollo-14","apollo-15","apollo-16","apollo-17"]],
  ["lunokhod",["lunokhod-1","lunokhod-2"]],["orbiters",["lro","grail","ladee"]],["intlmoon",["chandrayaan-1","change-4","chandrayaan-2","change-5","chandrayaan-3","slim","change-6"]],["artemis",["artemis-1","artemis-2"]],["next",null]],
 mars:[["mariner",["mariner-4","mariner-6-7","mariner-9"]],["viking",["viking-1","viking-2"]],["pathfinder",["mars-pathfinder"]],["morbit",["mars-odyssey","mro","maven"]],["mer",["spirit","opportunity"]],["phoenix",["phoenix"]],
  ["msl",["curiosity"]],["insight",["insight"]],["m2020",["perseverance","ingenuity"]],["intlmars",["mars-3","mars-express","mangalyaan","hope","tianwen-1"]],["next",null]]};
const WAG = {v:"nasa"};
function progSection(dest) {
  const accent = dest === "mars" ? "var(--rust)" : "#C7D3E0";
  const items = PROG[dest].map(([k, list]) => {
    const ms = list ? ids(list).sort((a, b) => a.launch.localeCompare(b.launch)) : null;
    const nx = list ? null : NEXT.filter(x => x.dest === dest);
    const ys = ms ? [...new Set([year(ms[0]), year(ms[ms.length - 1])])].map(yearL).join("–") : nx.filter(x => x.target).map(x => yearL(+x.target)).filter((v, i, a) => a.indexOf(v) === i).join(" · ") || "";
    const title = k === "next" ? t("pm_next_t") : t("pm_" + k + "_t"), desc = k === "next" ? t("pm_next" + dest + "_d") : t("pm_" + k + "_d");
    const n = ms ? ms.length : nx.length;
    return `<details class="pm" id="pm-${k}" data-pm="${k}"><summary><span class="mono pmy">${ys}</span><span class="pmt"><b>${esc(title)}</b><small>${esc(t("n_missions", {n:yearL(n)}))}</small></span><span class="pmc" aria-hidden="true">+</span></summary>
     <div class="pmb"><p>${esc(desc)}</p>${ms ? `<div class="tl" style="--blue:${accent}">${ms.map(m => nsRow(m).replace("<a ", `<a data-ag="${agOf(m)}" `)).join("")}</div>` : `<ul class="nxl" data-agwrap>${nx.map(x => nextRow(x).replace('<li class="nxi"', '<li class="nxi" data-ag="nasa"')).join("")}</ul>`}</div></details>`;
  }).join("");
  return `<section class="section" id="programmes" style="padding-block:24px 64px"><div class="wrap"><div class="shead" style="margin-bottom:24px"><div><span class="mono" style="color:${accent}">${esc(t("pm_k"))}</span><h2>${esc(t("pm_title_" + dest))}</h2><p class="lede" style="max-width:62ch">${esc(t("pm_d"))}</p></div>
   ${agFilter()}</div><div class="pml">${items}</div></div></section>`;
}
const agFilter = () => `<div class="agf" role="group" aria-label="${esc(t("ag_filter"))}"><span class="mono">${esc(t("ag_filter"))}</span>${["nasa","intl","all"].map(v => `<button data-agf="${v}" aria-pressed="${WAG.v === v}">${esc(t("ag_" + v))}</button>`).join("")}</div>`;
function applyAg(root) {
  const v = WAG.v;
  root.querySelectorAll("[data-ag]").forEach(el => { el.hidden = v !== "all" && el.dataset.ag !== v; });
  root.querySelectorAll(".pm").forEach(el => { el.hidden = !el.querySelector("[data-ag]:not([hidden])"); });
  root.querySelectorAll("[data-era]").forEach(el => { el.hidden = !el.querySelector("[data-ag]:not([hidden])"); });
  root.querySelectorAll("[data-agf]").forEach(b => b.setAttribute("aria-pressed", b.dataset.agf === v));
}
function bindWorld(arg) {
  const main = $("#main"); applyAg(main);
  if (arg) { const d = $("#pm-" + arg); if (d) { if (d.hidden) { WAG.v = "all"; applyAg(main); } d.open = true; setTimeout(() => d.scrollIntoView({behavior:REDUCED.matches ? "auto" : "smooth", block:"start"}), 80); } }
}

document.addEventListener("click", e => { const b = e.target.closest("[data-agf]"); if (b) { WAG.v = b.dataset.agf; applyAg($("#main")); } });

/* International space exploration */
const INTL = [["esa", a => a === "ESA"],["isro", a => a === "ISRO"],["cnsa", a => a === "CNSA"],["jaxa", a => a === "JAXA"],["ru", a => a === "Roscosmos" || a === "Soviet space program"],["uae", a => a === "UAE Space Agency"],["csa", a => a === "CSA"],["asi", a => a === "ASI"]];
const intlList = k => { const f = INTL.find(x => x[0] === k)[1]; return M.filter(m => m.agency.some(a => f(agencyKey(a)))).sort((a, b) => a.launch.localeCompare(b.launch)); };
function intlPanel(k) {
  const list = intlList(k);
  return `<div class="intp"><h2>${esc(t("ag_" + k))}</h2><p class="lede">${esc(t("ag_" + k + "_d"))}</p><span class="mono" style="color:var(--silver)">${esc(t("int_count", {n:yearL(list.length)}))}</span></div>
   <div class="grid">${list.map(m => card(m)).join("")}</div>`;
}
function international(arg) {
  const k = INTL.some(x => x[0] === arg) ? arg : "esa";
  return pageHead(t("int_k"), t("int_title"), t("int_intro"), "iss") + `<section class="wrap" style="padding-block:48px 96px">
   <div class="inttabs" role="tablist" aria-label="${esc(t("int_choose"))}">${INTL.map(([a]) => `<button role="tab" id="int-${a}" data-int="${a}" aria-selected="${a === k}" aria-controls="intpanel" tabindex="${a === k ? 0 : -1}"><b>${esc(t("ag_" + a))}</b><small class="mono">${yearL(intlList(a).length)}</small></button>`).join("")}</div>
   <div id="intpanel" role="tabpanel" aria-labelledby="int-${k}">${intlPanel(k)}</div></section>`;
}
function bindInternational() {
  const bar = $(".inttabs"); if (!bar) return;
  const sel = bar.querySelector("[aria-selected=true]"); if (sel && document.documentElement.dir !== "rtl") bar.scrollLeft = Math.max(0, sel.offsetLeft - bar.offsetLeft - 16);
  const pick = b => { const k = b.dataset.int; bar.querySelectorAll("[data-int]").forEach(x => { const on = x === b; x.setAttribute("aria-selected", on); x.tabIndex = on ? 0 : -1; });
    const p = $("#intpanel"); p.setAttribute("aria-labelledby", b.id); p.innerHTML = intlPanel(k); IMGPRIME.reset(); reveal(p);
    try { history.replaceState(null, "", "#international/" + k); } catch (e) {} };
  bar.addEventListener("click", e => { const b = e.target.closest("[data-int]"); if (b) pick(b); });
  bar.addEventListener("keydown", e => { const bs = [...bar.querySelectorAll("[data-int]")], i = bs.indexOf(document.activeElement); if (i < 0) return;
    const rtl = document.documentElement.dir === "rtl", d = e.key === "ArrowRight" ? (rtl ? -1 : 1) : e.key === "ArrowLeft" ? (rtl ? 1 : -1) : 0; if (!d) return;
    e.preventDefault(); const b = bs[(i + d + bs.length) % bs.length]; b.focus(); pick(b); });
}
function intlBand() {
  return `<section class="section intband"><div class="wrap split"><div class="copy"><span class="mono eyebrow">10 · ${esc(t("nav_international"))}</span><h2>${esc(t("int_title"))}</h2><p>${esc(t("int_band_d"))}</p>
   <div class="chips">${INTL.map(([a]) => `<a class="chip" href="#international/${a}">${esc(t("ag_" + a))}</a>`).join("")}</div>
   <div><a class="btn primary" href="#international">${esc(t("int_btn"))} ${ICON.arrow}</a></div></div>
   <figure class="plate">${imgTag("iss", {thumb:true})}<figcaption><span>${esc(MEDIA.iss.title)}</span><a href="${MEDIA.iss.page}" target="_blank" rel="noopener">NASA</a></figcaption></figure></div></section>`;
}
document.addEventListener("click", e => { const a = e.target.closest("[data-ask]"); if (a) pendingAsk = a.dataset.ask; });
let pendingAsk = null;

/* ── EXPLORE ── */
const F = {q:"", agency:"", type:"", status:"", decade:"", dest:"", sort:"new", shown:24};
const agencyKey = a => a.replace(/ \(.*\)/, "").replace(/ \/.*/, "");
function explore() {
  const agencies = [...new Set(M.flatMap(m => m.agency.map(agencyKey)))].sort();
  const types = ["crewed","probe","orbiter","lander","rover","telescope","station","launcher","experimental"];
  const statuses = ["active","completed","retired","inactive","contact-lost","lost","unknown"];
  const decades = [1950,1960,1970,1980,1990,2000,2010,2020];
  const dests = window.FE_DESTINATIONS.map(d => d.id);
  const sel = (id, label, opts, val, fmt) => `<label for="${id}"><span class="mono" style="color:var(--silver)">${esc(label)}</span><select class="field" id="${id}" data-f="${id.slice(2)}"><option value="">${esc(t("f_all"))}</option>${opts.map(o => `<option value="${o}" ${String(val) === String(o) ? "selected" : ""}>${esc(fmt(o))}</option>`).join("")}</select></label>`;
  return pageHead(t("nav_explore"), t("explore_title"), t("explore_intro"), "cassini_noodle") + `
  <section class="wrap" style="padding-block:48px 96px"><div class="explore">
   <aside class="filters" id="filters" aria-label="${esc(t("filters"))}">
    <div style="display:flex;justify-content:space-between;align-items:center"><span class="mono">${esc(t("filters"))}</span><button class="btn small" data-reset>${esc(t("reset"))}</button></div>
    ${sel("f-agency", t("f_agency"), agencies, F.agency, x => x)}${sel("f-type", t("f_type"), types, F.type, tyLabel)}${sel("f-status", t("f_status"), statuses, F.status, stLabel)}
    ${sel("f-decade", t("f_decade"), decades, F.decade, d => yearL(d) + "s")}${sel("f-dest", t("f_dest"), dests, F.dest, deLabel)}
    <button class="btn filtbtn" data-closefilters>${esc(t("close"))}</button>
   </aside>
   <div><div class="toolbar"><div class="qwrap">${ICON.search}<label class="sr" for="f-q">${esc(t("search"))}</label><input class="field" id="f-q" type="search" value="${esc(F.q)}" placeholder="${esc(t("search_ph"))}" autocomplete="off"></div>
     <button class="btn filtbtn" data-openfilters>${esc(t("filters"))}</button>
     <label class="sr" for="f-sort">${esc(t("sort"))}</label><select class="field" id="f-sort" style="width:auto"><option value="new" ${F.sort === "new" ? "selected" : ""}>${esc(t("sort_new"))}</option><option value="old" ${F.sort === "old" ? "selected" : ""}>${esc(t("sort_old"))}</option><option value="az" ${F.sort === "az" ? "selected" : ""}>${esc(t("sort_az"))}</option></select></div>
    <p class="count mono" id="count" aria-live="polite"></p><div class="grid" id="results" style="margin-top:20px"></div>
    <div style="text-align:center;margin-top:40px"><button class="btn" id="more">${esc(t("load_more"))}</button></div></div>
  </div></section>`;
}
function exploreResults() {
  let r = F.q ? searchMissions(F.q) : M.slice();
  r = r.filter(m => (!F.agency || m.agency.some(a => agencyKey(a) === F.agency)) && (!F.type || m.type === F.type) && (!F.status || m.status === F.status) && (!F.decade || Math.floor(year(m) / 10) * 10 === +F.decade) && (!F.dest || m.dest === F.dest));
  if (!F.q || F.sort !== "new") r.sort(F.sort === "az" ? (a, b) => a.name.localeCompare(b.name) : F.sort === "old" ? (a, b) => a.launch.localeCompare(b.launch) : (a, b) => b.launch.localeCompare(a.launch));
  $("#count").textContent = t("n_missions", {n:yearL(r.length)});
  $("#results").innerHTML = r.slice(0, F.shown).map(m => card(m)).join("") || `<p style="color:var(--silver)">${esc(t("no_results"))}</p>`;
  $("#more").hidden = r.length <= F.shown;
}
function bindExplore() {
  exploreResults();
  let qTm = 0; $("#f-q").addEventListener("input", e => { clearTimeout(qTm); qTm = setTimeout(() => { F.q = e.target.value; F.shown = 24; exploreResults(); }, 120); });
  $("#f-sort").addEventListener("change", e => { F.sort = e.target.value; exploreResults(); });
  $$("[data-f]").forEach(s => s.addEventListener("change", e => { F[e.target.dataset.f] = e.target.value; F.shown = 24; exploreResults(); }));
  $("#more").addEventListener("click", () => { F.shown += 24; exploreResults(); });
  $("[data-reset]").addEventListener("click", () => { Object.assign(F, {q:"", agency:"", type:"", status:"", decade:"", dest:"", sort:"new", shown:24}); route(true); });
  $("[data-openfilters]").addEventListener("click", () => $("#filters").classList.add("open"));
  $("[data-closefilters]").addEventListener("click", () => $("#filters").classList.remove("open"));
}

/* ── MISSION ── */
function mission(m, tab) {
  if (!m) return notFound();
  if ((m.dest === "moon" || m.dest === "mars") && window.FE_VEH && window.FE_VEH[m.id]) return vehMission(m, vLocal(m, window.FE_VEH[m.id]), tab);
  const gal = (GALLERY[m.id] || (m.img ? [m.img] : [])).filter(k => MEDIA[k]);
  const vids = (VIDEOS[m.id] || []).map(k => window.FE_VIDEO[k]).filter(Boolean);
  const sp = m.specs || {};
  const val = v => v ? esc(v) : `<span class="na">${esc(t("na"))}</span>`;
  const related = M.filter(x => x.id !== m.id && x.dest === m.dest).sort((a, b) => Math.abs(year(a) - year(m)) - Math.abs(year(b) - year(m))).slice(0, 4);
  const model = window.FE_MODELS.find(x => x.mission === m.id);
  const sec = (id, k, body) => `<section class="msec" id="s-${id}"><h2>${esc(t(k))}</h2>${body}</section>`;
  const list = a => a && a.length ? `<ul>${a.map(x => `<li data-tr>${esc(x)}</li>`).join("")}</ul>` : `<p class="na" style="color:var(--silver)">${esc(t("na"))}</p>`;
  const accent = m.dest === "mars" ? "var(--rust)" : m.dest === "moon" ? "#C7D3E0" : "var(--blue)";
  const tocItems = [["overview","m_overview"],["history","m_history"],["sci","m_sci"],["specs","m_specs"],["timeline","m_timeline"],["disc","m_disc"],["location","m_location"],["gallery","m_gallery"],["refs","m_refs"]];
  return `<article data-mission="${m.id}">
  <section class="mhero"><div class="bg">${m.img ? imgTag(m.img, {eager:true, alt:m.name}) : ""}</div>${m.img ? creditLink(m.img) : ""}
   <div class="wrap"><a href="#explore" class="mono" style="color:var(--silver);text-decoration:none">← ${esc(t("back_archive"))}</a>
    <div style="margin-top:22px;display:flex;gap:10px;flex-wrap:wrap;align-items:center">${pill(m.status)}<span class="mono" style="color:${accent}">${esc(tyLabel(m.type))}</span></div>
    <h1>${esc(m.name)}</h1><p class="lede" data-tr="summary">${esc(m.summary)}</p>
    <dl class="facts mono"><div><dt>${esc(t("agency_l"))}</dt><dd>${esc(agencies(m))}</dd></div><div><dt>${esc(t("country_l"))}</dt><dd>${esc(m.country)}</dd></div><div><dt>${esc(t("launch_l"))}</dt><dd>${esc(fmtDate(m.launch))}</dd></div><div><dt>${esc(t("dest_l"))}</dt><dd><a href="#d-${m.dest}" style="text-decoration:none">${esc(deLabel(m.dest))}</a></dd></div><div><dt>${esc(t("status_l"))}</dt><dd>${esc(stLabel(m.status))}</dd></div></dl>
   </div></section>
  <div class="wrap mbody"><nav class="toc" aria-label="${esc(t("sections"))}">${tocItems.map(([a, k]) => `<a href="#m-${m.id}" data-jump="s-${a}">${esc(t(k))}</a>`).join("")}${model ? `<a href="#museum" data-model="${model.id}" style="color:var(--blue)">${esc(t("in_museum"))}</a>` : ""}</nav>
   <div>
    ${lang !== "en" ? `<div class="notice" id="trbox"><span>${esc(t("rec_english"))}</span><button class="btn small" id="trbtn">${esc(t("translate_rec"))}</button></div>` : ""}
    ${sec("overview", "m_overview", `<p data-tr="summary">${esc(m.summary)}</p>`)}
    ${sec("history", "m_history", `<p data-tr="history">${esc(m.history)}</p>`)}
    ${sec("sci", "m_sci", list(m.objectives) + `<h3 style="margin-top:12px">${esc(t("m_eng"))}</h3><p data-tr="eng">${m.eng ? esc(m.eng) : esc(t("na"))}</p>`)}
    ${sec("specs", "m_specs", `<dl class="specs">${["mass","dimensions","power","comms","launchVehicle","duration","orbit"].map(k => `<div><dt>${esc(t("sp_" + k))}</dt><dd>${val(sp[k])}</dd></div>`).join("")}</dl>`)}
    ${sec("timeline", "m_timeline", `<ul class="mtl">${m.timeline.map(([d, x]) => `<li><time datetime="${d}">${esc(fmtDate(d))}</time><span data-tr>${esc(x)}</span></li>`).join("")}</ul>`)}
    ${sec("disc", "m_disc", list(m.discoveries))}
    ${xSlot(m)}
    ${sec("location", "m_location", `<p data-tr="location">${esc(m.location || t("na"))}</p><h3 style="margin-top:12px">${esc(t("m_ended"))}</h3><p data-tr="ended">${esc(m.ended || (m.status === "active" ? t("m_still_operating") : t("na")))}</p><p class="verified">${esc(t("last_verified"))}: ${esc(fmtDate(window.FE_VERIFIED))}</p>`)}
    ${sec("gallery", "m_gallery", gal.length ? `<div class="gallery">${gal.map(k => `<figure>${imgTag(k, {thumb:true})}<figcaption>${isConcept(k) ? `<b>${esc(t("artist_concept"))}</b> · ` : ""}${esc(MEDIA[k].title)} — ${esc(MEDIA[k].id)}</figcaption></figure>`).join("")}</div>` : `<div style="aspect-ratio:16/6">${noImg(m.name)}</div>`)
      + (vids.length ? `<h3 style="margin-top:18px">${esc(t("m_video"))}</h3><ul class="refs">${vids.map(v => `<li><a href="${esc(v.page)}" target="_blank" rel="noopener">▶ ${esc(v.title)}</a> <span class="verified">${esc(v.id)} · NASA ${esc(v.center)}</span></li>`).join("")}</ul>` : "")}
    ${sec("refs", "m_refs", `<ul class="refs">${m.refs.map(([l, u]) => `<li><a href="${esc(u)}" target="_blank" rel="noopener">${esc(l)} ↗</a></li>`).join("")}</ul>
      <h3 style="margin-top:16px">${esc(t("m_credits"))}</h3><ul class="refs">${gal.map(k => `<li><a href="${esc(MEDIA[k].page)}" target="_blank" rel="noopener">${esc(MEDIA[k].id)}</a> — ${esc(MEDIA[k].title)} · ${esc(credit(k))}</li>`).join("") || `<li style="color:var(--silver)">—</li>`}${model ? `<li><a href="${esc(model.src)}" target="_blank" rel="noopener">${esc(t("mu_model_credit"))} — ${esc(model.name)}</a></li>` : ""}</ul>`)}
    ${related.length ? `<section style="padding-top:48px"><h2 style="font-size:1.5rem;margin-bottom:24px">${esc(t("related"))}</h2><div class="grid">${related.map(x => card(x, {desc:false})).join("")}</div></section>` : ""}
   </div></div></article>`;
}
/* ── VEHICLE ENGINEERING PAGES (Moon & Mars missions; data in veh/*.js keyed by mission id) ── */
const VTABS = ["ov","hw","ins","spec","hist","status","gal","src"];
/* engineering records are written in English; NOVA can translate a vehicle's records on request (cached per language, never presented as verified) */
function vStrings(V) {
  const L = [["ov", V.overview], ["st", V.status && V.status.text]];
  (V.vehicles || []).forEach((x, i) => L.push(["veh." + i, x]));
  V.hw.forEach((h, i) => { for (const f of ["n","f","h","s","sp","fate"]) if (h[f]) L.push(["hw." + i + "." + f, h[f]]); });
  V.ins.forEach((x, i) => { for (const f of ["p","h","m","d","r","st"]) if (x[f] && x[f] !== "—") L.push(["ins." + i + "." + f, x[f]]); });
  V.specs.forEach((r, i) => { if (r[1]) L.push(["sp." + i, r[1]]); });
  if (V.diagram && V.diagram.note) L.push(["dn", V.diagram.note]);
  return L.filter(x => typeof x[1] === "string" && x[1].trim());
}
const vtrKey = m => "trv:" + lang + ":" + m.id;
function vLocal(m, V) {
  if (lang === "en" || !V) return V;
  let o = null; try { o = JSON.parse(store.get(vtrKey(m)) || "null"); } catch (e) {}
  const L = vStrings(V); if (!Array.isArray(o) || o.length !== L.length) return V;
  const W = JSON.parse(JSON.stringify(V));
  L.forEach(([p], k) => { const v = o[k]; if (typeof v !== "string" || !v.trim()) return; const a = p.split(".");
    if (a[0] === "ov") W.overview = v; else if (a[0] === "st") W.status.text = v; else if (a[0] === "veh") W.vehicles[+a[1]] = v;
    else if (a[0] === "hw") { if (a[2] === "n") W.hw[+a[1]].nl = v; else W.hw[+a[1]][a[2]] = v; }
    else if (a[0] === "ins") W.ins[+a[1]][a[2]] = v; else if (a[0] === "sp") W.specs[+a[1]][1] = v; else if (a[0] === "dn") W.diagram.note = v; });
  W._tr = true; return W;
}
async function translateEng(m, sample) {
  const V = window.FE_VEH && window.FE_VEH[m.id]; if (!V || lang === "en") return;
  const L = vStrings(V).map(x => x[1]), Lb = LANGS.find(l => l.code === lang).label, N = 45, chunks = [];
  for (let i = 0; i < L.length; i += N) chunks.push(L.slice(i, i + N));
  const res = await Promise.all(chunks.map(c => sample.json(`Translate each string in this JSON array about the spacecraft "${m.name}" into ${Lb} (${lang}) for a space-science museum website. Keep official mission, spacecraft, instrument and agency names and acronyms exactly as written (for example Apollo 11, Perseverance, Mastcam-Z, SuperCam, PIXL, SHERLOC, MOXIE, ALSEP, Lunar Roving Vehicle). Keep numbers, units and dates unchanged. Use standard scientific terminology. Return only a JSON array of the same length and order.\n\n${JSON.stringify(c)}`, {modelTier:"quick"})));
  res.forEach((r, i) => { if (!Array.isArray(r) || r.length !== chunks[i].length) throw new Error("bad translation length"); });
  store.set(vtrKey(m), JSON.stringify(res.flat()));
}
const VIMG = {alsep12:["hw/img/t/alsep12.jpg","AS12-47-6919","https://images.nasa.gov/details/as12-47-6919"], m20_hw:["hw/img/t/m20_hw.jpg","PIA24333","https://images.nasa.gov/details/PIA24333"], a11_psep:["doc/img/a11_psep.webp","KSC-as11-40-5964","https://images.nasa.gov/details/KSC-as11-40-5964"]};
const MAST_I = /^(Mastcam|ChemCam|Mastcam-Z|SuperCam|Pancam|Mini-TES|IMP|SSI|NaTeCam|MSCam)$/, ARM_I = /^(MAHLI|APXS|PIXL|SHERLOC|MI|MB|RAT|RAC|IDC)/;
const vslug = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
function vimg(k) { if (!k) return null; if (MEDIA[k]) return {src:"img/t/" + k + ".webp", id:MEDIA[k].id, page:MEDIA[k].page, title:MEDIA[k].title}; const v = VIMG[k]; return v ? {src:v[0], id:v[1], page:v[2], title:""} : null; }
function vsrcLinks(keys) { const S = window.FE_VEH_SRC; return [...new Set(keys || [])].map(k => S[k]).filter(Boolean).map(x => `<a href="${esc(x[1])}" target="_blank" rel="noopener">${esc(x[0])} · ${esc(x[2])} ↗</a>`).join(""); }
function vRelated(V, h) {
  if (/mast/i.test(h.n)) return V.ins.filter(i => MAST_I.test(i.a));
  if (/arm|turret|deployment device/i.test(h.n)) return V.ins.filter(i => ARM_I.test(i.a));
  if (/scientific equipment bay/i.test(h.n)) return V.ins.filter(i => /PSEP|LRRR/.test(i.a));
  return [];
}
function vField(k, v) { return v ? `<div><dt>${esc(t(k))}</dt><dd>${esc(v)}</dd></div>` : ""; }
function vHwItem(h, V) {
  const im = vimg(h.img), rel = vRelated(V, h);
  return `<details class="vrow" id="vh-${vslug(h.n)}"><summary><span class="vname">${esc(h.nl || h.n)}</span><span class="vsum">${esc(h.f)}</span></summary><div class="vbody">
   ${im ? `<figure class="vfig"><img src="${im.src}" alt="${esc(h.n)}" loading="lazy" decoding="async"><figcaption><a href="${esc(im.page)}" target="_blank" rel="noopener">${esc(im.id)} · NASA</a></figcaption></figure>` : ""}
   <dl class="vdl">${vField("vf_function", h.f)}${vField("vf_how", h.h)}${vField("vf_sig", h.s)}${h.sp ? `<div><dt>${esc(t("vf_specs"))}</dt><dd class="mono vsp">${esc(h.sp)}</dd></div>` : ""}${vField("vf_fate", h.fate)}
   ${rel.length ? `<div><dt>${esc(t("v_related"))}</dt><dd class="vrel">${rel.map(i => `<button class="chip" data-vins="${vslug(i.n)}">${esc(i.a !== "—" ? i.a : i.n)}</button>`).join("")}</dd></div>` : ""}
   <div><dt>${esc(t("vf_src"))}</dt><dd class="vsrc">${vsrcLinks(h.src)}</dd></div></dl></div></details>`;
}
function vInsItem(i) {
  const im = vimg(i.img);
  return `<details class="vrow" id="vi-${vslug(i.n)}"><summary>${i.a && i.a !== "—" ? `<span class="vabbr mono">${esc(i.a)}</span>` : ""}<span class="vname">${esc(i.n)}</span><span class="vsum">${esc(i.p)}</span></summary><div class="vbody">
   ${im ? `<figure class="vfig"><img src="${im.src}" alt="${esc(i.n)}" loading="lazy" decoding="async"><figcaption><a href="${esc(im.page)}" target="_blank" rel="noopener">${esc(im.id)} · NASA</a></figcaption></figure>` : ""}
   <dl class="vdl">${vField("vf_purpose", i.p)}${vField("vf_how", i.h)}${i.m && i.m !== "—" ? vField("vf_measures", i.m) : ""}${i.d && i.d !== "—" ? vField("vf_data", i.d) : ""}${vField("vf_results", i.r)}
   <div><dt>${esc(t("vf_status"))}</dt><dd><span class="vst">${esc(i.st)}</span></dd></div><div><dt>${esc(t("vf_src"))}</dt><dd class="vsrc">${vsrcLinks(i.src)}</dd></div></dl></div></details>`;
}
function vGroup(list, order, prefix, render) {
  const cats = order.filter(c => list.some(x => x.c === c)).concat([...new Set(list.map(x => x.c))].filter(c => !order.includes(c)));
  return cats.map(c => `<section class="vgrp"><h3 class="mono">${esc(t(prefix + c))}</h3><div class="vlist">${list.filter(x => x.c === c).map(render).join("")}</div></section>`).join("");
}
function vDiagram(m, V) {
  const d = V.diagram; if (!d) return "";
  const spots = d.spots.map((s, n) => { const ing = s[2] === "__ingenuity"; const h = ing ? null : V.hw.find(x => x.n === s[2]);
    return `<button class="vd-spot" style="left:${s[0]}%;top:${s[1]}%" data-spot="${ing ? "__ingenuity" : vslug(h.n)}" aria-label="${esc(ing ? "Ingenuity Mars Helicopter" : (h.nl || h.n))}"><span>${n + 1}</span></button>`; }).join("");
  return `<section class="vdiag" aria-label="${esc(t("v_diagram"))}"><div class="vd-head"><span class="mono">${esc(t("v_level2"))}</span><h3>${esc(t("v_diagram"))}</h3></div>
   <div class="vd-wrap"><figure class="vd-fig" style="aspect-ratio:${d.w}/${d.h}"><img src="${d.img}" alt="${esc(m.name)}" loading="lazy" decoding="async" width="${d.w}" height="${d.h}">${spots}</figure>
   <aside class="vd-panel" id="vd-panel" aria-live="polite"><p class="vd-hint">${esc(t("v_diag_pick"))}</p><ol class="vd-key">${d.spots.map((s, n) => `<li><button data-spot="${s[2] === "__ingenuity" ? "__ingenuity" : vslug(s[2])}"><b>${n + 1}</b> ${esc(s[2] === "__ingenuity" ? "Ingenuity Mars Helicopter" : ((V.hw.find(x => x.n === s[2]) || {}).nl || s[2]))}</button></li>`).filter((x, i, a) => a.findIndex(y => y.replace(/<b>\d+<\/b>/, "") === x.replace(/<b>\d+<\/b>/, "")) === i).join("")}</ol></aside></div>
   <p class="vd-note">${esc(tc("dnote", m.id, d.note))} ${esc(t("v_diag_note"))} <a href="${esc(d.page)}" target="_blank" rel="noopener">${esc(d.id)} · ${esc(d.credit)} ↗</a></p></section>`;
}
function vehMission(m, V, tab) {
  tab = VTABS.includes(tab) ? tab : "ov";
  const gal = (GALLERY[m.id] || (m.img ? [m.img] : [])).filter(k => MEDIA[k]);
  const vids = (VIDEOS[m.id] || []).map(k => window.FE_VIDEO[k]).filter(Boolean);
  const sp = m.specs || {};
  const related = M.filter(x => x.id !== m.id && x.dest === m.dest).sort((a, b) => Math.abs(year(a) - year(m)) - Math.abs(year(b) - year(m))).slice(0, 4);
  const model = window.FE_MODELS.find(x => x.mission === m.id || x.id === V.museum);
  const list = a => a && a.length ? `<ul>${a.map(x => `<li data-tr>${esc(x)}</li>`).join("")}</ul>` : `<p class="na" style="color:var(--silver)">${esc(t("na"))}</p>`;
  const accent = m.dest === "mars" ? "var(--rust)" : "#C7D3E0";
  const nd = `<span class="vnd">${esc(t("v_nd"))}</span>`;
  const specRows = V.specs.slice();
  if (sp.launchVehicle && sp.launchVehicle !== "—" && !specRows.some(r => /launch vehicle/i.test(r[0]))) specRows.push(["Launch vehicle", sp.launchVehicle, "R"]);
  const keyf = specRows.filter(r => r[1]).slice(0, 4);
  const enOnly = lang === "en" ? "" : V._tr ? `<p class="notice" style="margin-bottom:18px"><span>${esc(t("v_tr_done"))}</span></p>` : `<p class="notice vtrbox" style="margin-bottom:18px"><span>${esc(t("v_english"))}</span><button class="btn small" data-vtr>${esc(t("v_tr_eng"))}</button></p>`;
  const hwIds = window.HW_MISSIONS ? new Set(window.HW_MISSIONS.filter(x => x.fe === m.id).map(x => x.id)) : new Set();
  const hwItems = (window.HW_ITEMS || []).filter(i => hwIds.has(i.mission) || i.id === m.id);
  const allSrc = [...new Set([...V.src, ...V.hw.flatMap(h => h.src || []), ...V.ins.flatMap(i => i.src || [])])];
  const panel = (id, body) => `<div class="vpanel" id="vp-${id}" role="tabpanel" aria-labelledby="vt-${id}" ${id === tab ? "" : "hidden"}>${body}</div>`;
  return `<article data-mission="${m.id}" class="vpage">
  <section class="mhero"><div class="bg">${m.img ? imgTag(m.img, {eager:true, alt:m.name}) : ""}</div>${m.img ? creditLink(m.img) : ""}
   <div class="wrap"><a href="#${m.dest}" class="mono" style="color:var(--silver);text-decoration:none">← ${esc(t("nav_" + m.dest))}</a>
    <div style="margin-top:22px;display:flex;gap:10px;flex-wrap:wrap;align-items:center">${pill(m.status)}<span class="mono" style="color:${accent}">${esc(tyLabel(m.type))}</span>${V.level === 2 ? `<span class="mono vlv">${esc(t("v_level2"))}</span>` : ""}</div>
    <h1>${esc(m.name)}</h1><p class="lede" data-tr="summary">${esc(m.summary)}</p>
    <dl class="facts mono"><div><dt>${esc(t("agency_l"))}</dt><dd>${esc(agencies(m))}</dd></div><div><dt>${esc(t("country_l"))}</dt><dd>${esc(m.country)}</dd></div><div><dt>${esc(t("launch_l"))}</dt><dd>${esc(fmtDate(m.launch))}</dd></div><div><dt>${esc(t("dest_l"))}</dt><dd><a href="#d-${m.dest}" style="text-decoration:none">${esc(deLabel(m.dest))}</a></dd></div><div><dt>${esc(t("status_l"))}</dt><dd>${esc(stLabel(m.status))}</dd></div></dl>
   </div></section>
  <div class="vtabs" role="tablist" aria-label="${esc(m.name)}"><div class="wrap">${VTABS.map(k => `<button role="tab" id="vt-${k}" aria-controls="vp-${k}" aria-selected="${k === tab}" tabindex="${k === tab ? 0 : -1}" data-vtab="${k}">${esc(t("vt_" + k))}${k === "hw" ? `<small>${V.hw.length}</small>` : k === "ins" ? `<small>${V.ins.length}</small>` : ""}</button>`).join("")}</div></div>
  <div class="wrap vmain">
   ${lang !== "en" ? `<div class="notice" id="trbox"><span>${esc(t("rec_english"))}</span><button class="btn small" id="trbtn">${esc(t("translate_rec"))}</button></div>` : ""}
   ${panel("ov", `<div class="vov"><div><h2>${esc(t("m_overview"))}</h2><p data-tr="summary">${esc(m.summary)}</p>
      <h3>${esc(t("v_engov"))}</h3><p>${esc(V.overview)}</p>
      <section id="s-sci"><h3>${esc(t("m_sci"))}</h3>${list(m.objectives)}</section>
      <h3>${esc(t("m_eng"))}</h3><p data-tr="eng">${m.eng ? esc(m.eng) : esc(t("na"))}</p></div>
     <aside class="vside"><h3 class="mono">${esc(t("v_vehicles"))}</h3><ul class="vveh">${V.vehicles.map(v => `<li>${esc(v)}</li>`).join("")}</ul>
      <h3 class="mono">${esc(t("v_keyfacts"))}</h3><dl class="vkf">${keyf.map(r => `<div><dt>${esc(tc("spl", r[0], r[0]))}</dt><dd>${esc(r[1])}</dd></div>`).join("")}</dl>
      ${m.id === "opportunity" ? `<p style="margin-top:14px"><a class="btn small primary" href="#journey/opportunity/1">${esc(t("jr_entry_btn"))} ${ICON.arrow}</a></p>` : ""}<div class="vquick"><button class="btn small" data-vgo="hw">${esc(t("vt_hw"))} ${ICON.arrow}</button><button class="btn small" data-vgo="ins">${esc(t("vt_ins"))} ${ICON.arrow}</button></div></aside></div>${xSlot(m)}`)}
   ${panel("hw", `${enOnly}${vDiagram(m, V)}${model ? `<p class="vmus"><a class="btn small" href="#museum" data-model="${model.id}">${esc(t("in_museum"))}: ${esc(model.name)} ${ICON.arrow}</a> <span>${esc(t("hw_museum_note"))}</span></p>` : ""}
      <p class="mono vcount">${esc(t("v_components", {n:V.hw.length}))}</p>${vGroup(V.hw, ["structure","mobility","power","comms","nav","robotic","propulsion","thermal"], "vc_", h => vHwItem(h, V))}`)}
   ${panel("ins", `${enOnly}${V.ins.length ? `<p class="mono vcount">${esc(t("v_instruments", {n:V.ins.length}))}</p>${vGroup(V.ins, ["img","spectro","chem","geo","atmo","env","rad","sample"], "vi_", vInsItem)}` : `<p class="vnd">${esc(t("v_no_ins"))}</p>`}`)}
   ${panel("spec", `<div class="tablewrap"><table class="vspec"><tbody>${specRows.map(r => `<tr><th scope="row">${esc(tc("spl", r[0], r[0]))}</th><td>${r[1] ? esc(r[1]) : nd}</td><td>${r[1] ? `<span class="vtype t${r[2]}">${esc(t("vs_" + r[2]))}</span>` : ""}</td></tr>`).join("")}</tbody></table></div><p class="verified" style="margin-top:12px">${esc(t("v_spec_note"))}</p>`)}
   ${panel("hist", `<section class="msec" style="border:0;padding-top:0"><h2>${esc(t("m_history"))}</h2><p data-tr="history">${esc(m.history)}</p></section>
      <section class="msec" id="s-timeline"><h2>${esc(t("m_timeline"))}</h2><ul class="mtl">${m.timeline.map(([d, x]) => `<li><time datetime="${d}">${esc(fmtDate(d))}</time><span data-tr>${esc(x)}</span></li>`).join("")}</ul></section>
      <section class="msec" id="s-disc"><h2>${esc(t("m_disc"))}</h2>${list(m.discoveries)}</section>`)}
   ${panel("status", `<div class="vstat">${pill(m.status)}<p class="lede" style="margin-top:14px">${esc(V.status.text)}</p></div>
      <section class="msec"><h2>${esc(t("m_location"))}</h2><p data-tr="location">${esc(m.location || t("na"))}</p><h3 style="margin-top:12px">${esc(t("m_ended"))}</h3><p data-tr="ended">${esc(m.ended || (m.status === "active" ? t("m_still_operating") : t("na")))}</p><p class="verified">${esc(t("last_verified"))}: ${esc(fmtDate(window.FE_VERIFIED))}</p></section>
      ${hwItems.length ? `<section class="msec"><h2>${esc(t("v_locator"))}</h2><div class="chips">${hwItems.map(i => `<a class="chip" href="#hw-${i.id}">◎ ${esc(i.name)}</a>`).join("")}</div></section>` : ""}`)}
   ${panel("gal", `${gal.length ? `<div class="gallery">${gal.map(k => `<figure>${imgTag(k, {thumb:true})}<figcaption>${isConcept(k) ? `<b>${esc(t("artist_concept"))}</b> · ` : ""}${esc(MEDIA[k].title)} — ${esc(MEDIA[k].id)}</figcaption></figure>`).join("")}</div>` : `<div style="aspect-ratio:16/6">${noImg(m.name)}</div>`}
      ${vids.length ? `<h3 style="margin-top:18px">${esc(t("m_video"))}</h3><ul class="refs">${vids.map(v => `<li><a href="${esc(v.page)}" target="_blank" rel="noopener">▶ ${esc(v.title)}</a> <span class="verified">${esc(v.id)} · NASA ${esc(v.center)}</span></li>`).join("")}</ul>` : ""}`)}
   ${panel("src", `<h2 style="font-size:1.4rem;margin-bottom:14px">${esc(t("m_refs"))}</h2><ul class="refs">${m.refs.map(([l, u]) => `<li><a href="${esc(u)}" target="_blank" rel="noopener">${esc(l)} ↗</a></li>`).join("")}</ul>
      <h3 style="margin-top:22px">${esc(t("v_record_src"))}</h3><ul class="refs">${allSrc.map(k => window.FE_VEH_SRC[k]).filter(Boolean).map(x => `<li><a href="${esc(x[1])}" target="_blank" rel="noopener">${esc(x[0])} ↗</a> <span class="verified">${esc(x[2])}</span></li>`).join("")}</ul>
      <h3 style="margin-top:22px">${esc(t("m_credits"))}</h3><ul class="refs">${gal.map(k => `<li><a href="${esc(MEDIA[k].page)}" target="_blank" rel="noopener">${esc(MEDIA[k].id)}</a> — ${esc(MEDIA[k].title)} · ${esc(credit(k))}</li>`).join("")}${V.diagram ? `<li><a href="${esc(V.diagram.page)}" target="_blank" rel="noopener">${esc(V.diagram.id)}</a> — ${esc(V.diagram.credit)}</li>` : ""}${model ? `<li><a href="${esc(model.src)}" target="_blank" rel="noopener">${esc(t("mu_model_credit"))} — ${esc(model.name)}</a></li>` : ""}</ul>
      <p class="verified" style="margin-top:16px">${esc(t("last_verified"))}: ${esc(fmtDate(window.FE_VERIFIED))}</p>`)}
   ${related.length ? `<section style="padding-top:56px"><h2 style="font-size:1.5rem;margin-bottom:24px">${esc(t("related"))}</h2><div class="grid">${related.map(x => card(x, {desc:false})).join("")}</div></section>` : ""}
  </div></article>`;
}
function bindVeh(m) {
  const V = vLocal(m, window.FE_VEH && window.FE_VEH[m.id]); if (!V || !$(".vpage")) return;
  $$("[data-vtr]").forEach(b => b.addEventListener("click", async () => {
    $$("[data-vtr]").forEach(x => { x.disabled = true; x.textContent = t("translating"); });
    const sample = await getSample();
    if (!sample) { $$(".vtrbox").forEach(x => x.innerHTML = `<span>${esc(t("nova_offline"))}</span>`); return; }
    try { await translateEng(m, sample); route(true); }
    catch (e) { $$(".vtrbox").forEach(x => x.innerHTML = `<span>${esc(e && e.code === "not_granted" ? t("nova_offline") : t("nova_err"))}</span>`); }
  }));
  const tabs = $$("[data-vtab]");
  const show = (k, focus) => {
    tabs.forEach(b => { const on = b.dataset.vtab === k; b.setAttribute("aria-selected", on); b.tabIndex = on ? 0 : -1; if (on && focus) b.focus(); if (on) b.scrollIntoView({block:"nearest", inline:"nearest"}); });
    $$(".vpanel").forEach(p => { const on = p.id === "vp-" + k; p.hidden = !on; if (on) { p.classList.remove("vin"); void p.offsetWidth; p.classList.add("vin"); } });
    try { history.replaceState(null, "", "#m-" + m.id + (k === "ov" ? "" : "/" + k)); } catch (e) {}
    const bar = $(".vtabs"); if (bar && bar.getBoundingClientRect().top < 0) window.scrollTo({top:window.scrollY + bar.getBoundingClientRect().top - (parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 64) + 1, behavior:"auto"});
  };
  tabs.forEach(b => b.addEventListener("click", () => show(b.dataset.vtab)));
  $(".vtabs").addEventListener("keydown", e => { const i = tabs.findIndex(b => b.getAttribute("aria-selected") === "true"); let n = -1;
    if (e.key === "ArrowRight") n = (i + 1) % tabs.length; else if (e.key === "ArrowLeft") n = (i - 1 + tabs.length) % tabs.length; else if (e.key === "Home") n = 0; else if (e.key === "End") n = tabs.length - 1;
    if (n >= 0) { e.preventDefault(); show(tabs[n].dataset.vtab, true); } });
  $$("[data-vgo]").forEach(b => b.addEventListener("click", () => show(b.dataset.vgo)));
  const openIns = slug => { show("ins"); const d = document.getElementById("vi-" + slug); if (d) { d.open = true; d.classList.remove("rv"); d.scrollIntoView({block:"center", behavior:REDUCED.matches ? "auto" : "smooth"}); } };
  $(".vpage").addEventListener("click", e => { const b = e.target.closest("[data-vins]"); if (b) { e.preventDefault(); openIns(b.dataset.vins); } });
  // interactive diagram
  const panel = $("#vd-panel");
  if (panel) {
    const pick = slug => {
      $$(".vd-spot").forEach(s => s.classList.toggle("on", s.dataset.spot === slug));
      if (slug === "__ingenuity") { panel.innerHTML = `<h4>Ingenuity Mars Helicopter</h4><p>${esc(t("v_ing_note"))}</p><a class="btn small" href="#m-ingenuity">${esc(byId.ingenuity ? byId.ingenuity.name : "Ingenuity")} ${ICON.arrow}</a>`; return; }
      const h = V.hw.find(x => vslug(x.n) === slug); if (!h) return; const rel = vRelated(V, h);
      panel.innerHTML = `<span class="mono vd-cat">${esc(t("vc_" + h.c))}</span><h4>${esc(h.nl || h.n)}</h4><p>${esc(h.f)}</p>${h.h ? `<p><b>${esc(t("vf_how"))}:</b> ${esc(h.h)}</p>` : ""}${h.sp ? `<p class="mono vsp">${esc(h.sp)}</p>` : ""}
        ${rel.length ? `<p><b>${esc(t("v_related"))}:</b></p><div class="vrel">${rel.map(i => `<button class="chip" data-vins="${vslug(i.n)}">${esc(i.a !== "—" ? i.a : i.n)}</button>`).join("")}</div>` : ""}
        <p class="vsrc">${vsrcLinks(h.src)}</p><button class="hw-link-btn" data-vshow="${slug}">${esc(t("v_in_list"))} ↓</button>`;
    };
    $$("[data-spot]").forEach(b => b.addEventListener("click", () => pick(b.dataset.spot)));
    panel.addEventListener("click", e => { const b = e.target.closest("[data-vshow]"); if (!b) return; const d = document.getElementById("vh-" + b.dataset.vshow); if (d) { d.open = true; d.classList.remove("rv"); d.scrollIntoView({block:"center", behavior:REDUCED.matches ? "auto" : "smooth"}); } });
  }
}
function bindMission(m) {
  bindVeh(m);
  fillStories(m);
  $$("[data-jump]").forEach(a => a.addEventListener("click", e => { e.preventDefault(); const el = document.getElementById(a.dataset.jump); if (!el) return; el.classList.remove("rv"); el.classList.add("in"); el.scrollIntoView({behavior:REDUCED.matches ? "auto" : "smooth", block:"start"}); }));
  $$("[data-model]").forEach(a => a.addEventListener("click", () => { museumFocus = a.dataset.model; }));
  const b = $("#trbtn"); if (b) b.addEventListener("click", () => translateRecord(m));
  const cached = store.get("tr:" + lang + ":" + m.id);
  if (cached) { try { applyTranslation(JSON.parse(cached)); } catch (e) {} }
}
/* translation of a mission record through the sample capability */
let samplePromise = null;
/* AI backend: inside claude.ai the artifact runtime provides the "sample" capability; on a normal web host (e.g. Vercel)
   the same interface is provided by the server function /api/claude, which keeps the API key on the server. If neither is
   available, NOVA and the translation buttons fall back to archive mode exactly as before. */
let aiBackend = null;
function serverSample() {
  const post = async body => {
    const r = await fetch("api/claude", {method:"POST", headers:{"content-type":"application/json"}, body:JSON.stringify(body)});
    let j = null; try { j = await r.json(); } catch (e) {}
    if (!r.ok || !j) { const err = new Error((j && j.error) || "AI request failed (" + r.status + ")"); err.code = r.status === 503 ? "not_granted" : "server_error"; throw err; }
    return j;
  };
  const sample = async (messages, opts = {}) => {
    const tools = opts.tools || [], defs = tools.map(x => ({name:x.name, description:x.description, input_schema:x.inputSchema || x.input_schema || {type:"object", properties:{}}}));
    const conv = messages.map(m => ({role:m.role, content:m.content}));
    let text = "";
    for (let step = 0; step < 8; step++) {
      const res = await post({messages:conv, tools:defs, max_tokens:opts.maxTokens || 1200});
      const blocks = res.content || [];
      text = blocks.filter(b => b.type === "text").map(b => b.text).join("");
      if (res.stop_reason !== "tool_use") break;
      conv.push({role:"assistant", content:blocks});
      const results = [];
      for (const b of blocks.filter(x => x.type === "tool_use")) {
        const tool = tools.find(x => x.name === b.name);
        try { const out = tool ? await tool.execute(b.input || {}) : {error:"Unknown tool " + b.name}; results.push({type:"tool_result", tool_use_id:b.id, content:JSON.stringify(out).slice(0, 20000)}); }
        catch (e) { results.push({type:"tool_result", tool_use_id:b.id, content:String(e && e.message || e), is_error:true}); }
      }
      conv.push({role:"user", content:results});
    }
    if (opts.onText) { try { opts.onText({text}); } catch (e) {} }
    return {text};
  };
  sample.json = async (prompt, opts = {}) => {
    const res = await post({messages:[{role:"user", content:prompt + "\n\nReturn only valid JSON, with no commentary and no code fences."}], max_tokens:opts.maxTokens || 4000});
    const raw = (res.content || []).filter(b => b.type === "text").map(b => b.text).join("").trim().replace(/^```(?:json)?\s*|\s*```$/g, "");
    try { return JSON.parse(raw); } catch (e) {}
    const a = raw.search(/[\[{]/), z = Math.max(raw.lastIndexOf("}"), raw.lastIndexOf("]"));
    if (a >= 0 && z > a) return JSON.parse(raw.slice(a, z + 1));
    throw new Error("AI returned invalid JSON");
  };
  return sample;
}
function getSample() {
  if (!samplePromise) samplePromise = (async () => {
    if (window.claude?.use) { const s = await window.claude.use("sample"); aiBackend = s ? "claude" : null; return s; }
    if (location.protocol === "file:") return null;
    const r = await fetch("api/claude", {method:"GET", headers:{accept:"application/json"}});
    const j = r.ok ? await r.json() : null;
    if (!j || !j.enabled) return null;
    aiBackend = "server"; return serverSample();
  })().catch(() => null);
  return samplePromise;
}
const novaOnlineText = () => t(aiBackend === "server" ? "nova_online_web" : "nova_online");
function applyTranslation(o) {
  for (const k of ["summary","history","eng","location","ended"]) if (o[k]) $$(`[data-tr="${k}"]`).forEach(el => el.textContent = o[k]);
  const lists = $$("#s-sci li[data-tr]").concat($$("#s-disc li[data-tr]"), $$("#s-timeline span[data-tr]"));
  const flat = [...(o.objectives || []), ...(o.discoveries || []), ...(o.timeline || [])];
  if (flat.length === lists.length) lists.forEach((el, i) => el.textContent = flat[i]);
  const box = $("#trbox"); if (box) box.innerHTML = `<span>${esc(t("translated_note"))}</span>`;
}
async function translateRecord(m) {
  const b = $("#trbtn"); b.disabled = true; b.textContent = t("translating");
  const sample = await getSample();
  if (!sample) { $("#trbox").innerHTML = `<span>${esc(t("nova_offline"))}</span>`; return; }
  const rec = {summary:m._sum || m.summary, history:m.history, eng:m.eng, location:m.location, ended:m.ended, objectives:m.objectives, discoveries:m.discoveries, timeline:m.timeline.map(x => x[1])};
  const L = LANGS.find(l => l.code === lang).label;
  try {
    const out = await sample.json(`Translate the string values of this JSON object about the space mission "${m.name}" into ${L} (${lang}). Keep spacecraft names, agency names, numbers and units unchanged. Keep the same keys and the same array lengths. Return only the JSON object.\n\n${JSON.stringify(rec)}`, {modelTier:"quick"});
    store.set("tr:" + lang + ":" + m.id, JSON.stringify(out)); applyTranslation(out);
    if (window.FE_VEH && window.FE_VEH[m.id] && !store.get(vtrKey(m))) { try { await translateEng(m, sample); route(true); } catch (e) {} }
  } catch (e) { $("#trbox").innerHTML = `<span>${esc(e && e.code === "not_granted" ? t("nova_offline") : t("nova_err"))}</span>`; }
}

/* ── MOON & MARS ── */
function marsDocEntry() {
  return `<div class="md-entry mx-entry"><div class="md-entry-img"><img src="mx/img/viking_valles_marineris.webp" alt="" loading="lazy" style="object-fit:contain;background:#000"></div>
   <div class="md-entry-c"><span class="mono">${esc(t("mx_entry_k"))}</span><h2><span class="mx-et">${esc(t("mx_title"))}</span><br><small style="font-size:.6em;color:#E0763A">${esc(t("mx_title2"))}</small></h2><p>${esc(t("mx_desc"))}</p>
   <div class="btnrow"><a class="btn primary" href="#mars-doc">${esc(t("mx_btn"))} ${ICON.arrow}</a><a class="btn" href="#mars-doc/archive">${esc(t("mx_archive_btn"))}</a></div>
   <small class="mono">PIA00003 · NASA/JPL-Caltech/USGS</small></div></div>`;
}
function moonDocEntry() {
  const k = (key, en) => (T[key] ? t(key) : en);
  return `<div class="md-entry"><div class="md-entry-img"><img src="img/t/hero_lrv.webp" srcset="img/hero_lrv-960.webp 960w" sizes="(max-width:900px) 100vw, 55vw" alt="" loading="lazy"></div>
   <div class="md-entry-c"><span class="mono">${esc(k("md_kicker", "Interactive documentary · 6 chapters"))}</span><h2>${esc(k("md_title", "THE MOON: HUMANITY'S JOURNEY TO ANOTHER WORLD"))}</h2><p class="md-esub">${esc(k("md_sub", "They Came. They Explored. They Were Left Behind."))}</p><p>${esc(k("md_desc", ""))}</p>
   <div class="btnrow"><a class="btn primary" href="#moon-doc">${esc(k("md_btn", "Watch the documentary"))} ${ICON.arrow}</a><a class="btn" href="#moon-doc/archive">${esc(k("md_archive_btn", "Lunar hardware archive"))}</a></div>
   <small class="mono">AS17-147-22526 · NASA</small></div></div>`;
}
function worldPage(dest) {
  const agc = m => card(m).replace('<a class="card"', `<a class="card" data-ag="${agOf(m)}"`);
  const isMars = dest === "mars";
  const list = M.filter(m => m.dest === dest).sort((a, b) => a.launch.localeCompare(b.launch));
  const accent = isMars ? "var(--rust)" : "#C7D3E0";
  const eras = isMars ? [["1960–1975","Mariner · Mars 3 · Viking",1960,1979],["1996–2008","Pathfinder · Odyssey · Spirit · Opportunity · MRO · Phoenix · Mars Express",1990,2009],["2011–2026","Curiosity · MAVEN · InSight · Perseverance · Ingenuity · Hope · Tianwen-1",2010,2030]]
    : [["1959–1968","Luna · Ranger · Surveyor",1955,1968.5],["1968–1976","Apollo · Lunokhod",1968.6,1980],["2008–2026","LRO · GRAIL · LADEE · Artemis · Chandrayaan · Chang'e · SLIM",2000,2030]];
  const gal = isMars ? ["gale","curiosity","perseverance","opportunity","spirit","viking","viking2","sojourner","insight","mariner4","phoenix","ingenuity"] : ["earthrise","moonnear","aldrin","flag","easep","surveyor3","ranger7","lunokhod","luna21","orion_moon","earthset2026","artemis2pad"];
  const cmp = isMars ? ["viking-1","mars-pathfinder","spirit","opportunity","phoenix","curiosity","insight","perseverance","ingenuity","tianwen-1"].map(i => byId[i]) : null;
  return pageHead(t("nav_" + dest), t(dest + "_title"), t(dest + "_intro"), isMars ? "gale" : "earthrise") + `
  <section class="section" style="padding-top:64px"><div class="wrap">
   <div class="hwlink"><span>${ICON.pin.replace('aria-hidden="true"', 'aria-hidden="true" width="22" height="22" style="vertical-align:-5px;margin-inline-end:8px;color:' + accent + '"')}<b>${esc(t("hw_world_link"))}</b></span><a class="btn" href="#hardware-${dest}">${esc(t("hw_" + dest))} ${ICON.arrow}</a></div>
   ${!isMars ? moonDocEntry() : marsDocEntry()}
   ${isMars ? `<div class="jr-entry"><div class="jr-eimg"><img src="veh/img/opp_self.webp" alt="Opportunity" loading="lazy"></div><div class="jr-ecopy"><span class="mono">${esc(t("jr_entry_k"))}</span><h2>${esc(t("jr_entry_t"))}</h2><p>${esc(t("jr_entry_d"))}</p><a class="btn primary" href="#journey">${esc(t("jr_entry_btn"))} ${ICON.arrow}</a><small class="mono">PIA18079 · NASA/JPL-Caltech/Cornell/ASU</small></div></div>` : ""}
   ${isMars ? `<div class="wm-band"><img src="wm/img/mars_disk.webp" alt="" loading="lazy" width="450" height="450"><div><span class="mono">${esc(t("wm_card_k"))}</span><h2>${esc(t("wm_title"))} <small>${esc(t("wm_sub"))}</small></h2><p>${esc(t("wm_card_d"))}</p></div><a class="btn primary" href="#why-mars">${esc(t("wm_explore"))} ${ICON.arrow}</a></div>` : ""}
   ${eras.map(([span, sub, a, z], i) => { const ms = list.filter(m => { const y = year(m) + (+m.launch.slice(5, 7) || 0) / 13; return y >= a && y < z; }); return `
    <div style="margin-bottom:64px" data-era><div class="shead" style="margin-bottom:24px"><div><span class="mono" style="color:${accent}">${esc(t("era"))} ${i + 1} · ${span}</span><h2 style="font-size:clamp(1.5rem,2.6vw,2.2rem)">${esc(sub)}</h2></div>${i === 0 ? agFilter() : ""}</div>
    <div class="grid">${ms.map(agc).join("")}</div></div>`; }).join("")}
  </div></section>
  ${progSection(dest)}
  <section class="section band"><div class="wrap"><div class="shead"><div><span class="mono" style="color:${accent}">${esc(t("nav_timeline"))}</span><h2>${esc(t("m_timeline"))}</h2></div></div>
   <div class="tl" style="--blue:${accent}">${list.map(m => `<a href="#m-${m.id}" data-ag="${agOf(m)}"><time>${esc(fmtDate(m.launch))}</time>${m.img ? iconTag(m.img, 96, 64) : '<span class="ph"></span>'}<span><b>${esc(m.name)}</b><small>${esc(agencies(m))} · ${esc(tyLabel(m.type))}</small></span>${pill(m.status)}</a>`).join("")}</div></div></section>
  ${cmp ? `<section class="section"><div class="wrap"><div class="shead"><div><span class="mono" style="color:${accent}">${esc(t("compare"))}</span><h2>${esc(t("compare"))}</h2></div></div>
   <div class="tablewrap"><table><thead><tr><th>${esc(t("type_l"))}</th><th>${esc(t("agency_l"))}</th><th>${esc(t("launch_l"))}</th><th>${esc(t("sp_mass"))}</th><th>${esc(t("sp_power"))}</th><th>${esc(t("sp_duration"))}</th><th>${esc(t("status_l"))}</th></tr></thead>
   <tbody>${cmp.map(m => `<tr><td><a href="#m-${m.id}">${esc(m.name)}</a><br><span class="verified">${esc(tyLabel(m.type))}</span></td><td>${esc(agencies(m))}</td><td>${esc(fmtDate(m.launch))}</td><td>${m.specs.mass ? esc(m.specs.mass) : "—"}</td><td>${m.specs.power ? esc(m.specs.power) : "—"}</td><td>${m.specs.duration ? esc(m.specs.duration) : "—"}</td><td>${pill(m.status)}</td></tr>`).join("")}</tbody></table></div>
   <p class="verified" style="margin-top:10px">— ${esc(t("na"))}</p></div></section>` : ""}
  <section class="section ${cmp ? "band" : ""}"><div class="wrap"><div class="shead"><div><span class="mono" style="color:${accent}">${esc(t("m_gallery"))}</span><h2>${esc(t("gallery_surface"))}</h2></div><a class="btn" href="#credits">${esc(t("media_credits"))} ${ICON.arrow}</a></div>
   <div class="gallery">${gal.filter(k => MEDIA[k]).map(k => `<figure>${imgTag(k, {thumb:true})}<figcaption>${esc(MEDIA[k].title)} — ${esc(MEDIA[k].id)}</figcaption></figure>`).join("")}</div></div></section>
  <section class="section"><div class="wrap split"><div class="copy"><span class="mono" style="color:${accent}">${esc(t("future"))}</span><h2>${esc(t("future"))}</h2><p>${esc(t(dest + "_future"))}</p>
   <div class="btnrow">${isMars ? `<a class="btn" href="https://science.nasa.gov/planetary-science/programs/mars-exploration/" target="_blank" rel="noopener">NASA Mars Exploration ↗</a>` : `<a class="btn" href="https://www.nasa.gov/humans-in-space/artemis/" target="_blank" rel="noopener">NASA Artemis ↗</a>`}<a class="btn" href="#d-${dest}">${esc(deLabel(dest))} ${ICON.arrow}</a></div></div>
   <figure class="plate">${imgTag(isMars ? "perseverance" : "artemis2pad", {thumb:true})}<figcaption><span>${esc(MEDIA[isMars ? "perseverance" : "artemis2pad"].title)}</span><a href="${MEDIA[isMars ? "perseverance" : "artemis2pad"].page}" target="_blank" rel="noopener">NASA</a></figcaption></figure></div></section>`;
}

/* ── TIMELINE ── */
const TL = {decade:"", agency:"", dest:""};
function timeline() {
  const agencies = [...new Set(M.flatMap(m => m.agency.map(agencyKey)))].sort();
  return pageHead(t("nav_timeline"), t("tl_title"), t("tl_intro"), "a11launch") + `<section class="wrap" style="padding-block:40px 96px">
   <div class="decades" role="group" aria-label="${esc(t("f_decade"))}"><button data-dec="" aria-pressed="${!TL.decade}">${esc(t("f_all"))}</button>${[1950,1960,1970,1980,1990,2000,2010,2020].map(d => `<button data-dec="${d}" aria-pressed="${String(TL.decade) === String(d)}">${yearL(d)}s</button>`).join("")}</div>
   <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:12px"><label><span class="sr">${esc(t("f_agency"))}</span><select class="field" id="tl-agency" style="width:auto"><option value="">${esc(t("f_agency"))}: ${esc(t("f_all"))}</option>${agencies.map(a => `<option ${TL.agency === a ? "selected" : ""}>${esc(a)}</option>`).join("")}</select></label>
    <label><span class="sr">${esc(t("f_dest"))}</span><select class="field" id="tl-dest" style="width:auto"><option value="">${esc(t("f_dest"))}: ${esc(t("f_all"))}</option>${window.FE_DESTINATIONS.map(d => `<option value="${d.id}" ${TL.dest === d.id ? "selected" : ""}>${esc(deLabel(d.id))}</option>`).join("")}</select></label></div>
   <div class="tl" id="tl"></div></section>`;
}
function drawTimeline() {
  const r = M.filter(m => (!TL.decade || Math.floor(year(m) / 10) * 10 === +TL.decade) && (!TL.agency || m.agency.some(a => agencyKey(a) === TL.agency)) && (!TL.dest || m.dest === TL.dest)).sort((a, b) => a.launch.localeCompare(b.launch));
  let html = "", cur = null;
  for (const m of r) {
    const d = Math.floor(year(m) / 10) * 10;
    if (d !== cur) { cur = d; html += `<div class="period"><span class="mono" style="color:var(--blue)">${yearL(d)}s</span><h3>${esc(t("period_" + d))}</h3></div>`; }
    html += `<a href="#m-${m.id}"><time datetime="${m.launch}">${esc(fmtDate(m.launch))}</time>${m.img ? iconTag(m.img, 96, 64) : '<span class="ph"></span>'}<span><b>${esc(m.name)}</b><small>${esc(agencies(m))} · ${esc(deLabel(m.dest))}</small></span>${pill(m.status)}</a>`;
  }
  $("#tl").innerHTML = html || `<p style="color:var(--silver);padding:20px 0">${esc(t("no_results"))}</p>`;
}
function bindTimeline() {
  drawTimeline();
  $$("[data-dec]").forEach(b => b.addEventListener("click", () => { TL.decade = b.dataset.dec; $$("[data-dec]").forEach(x => x.setAttribute("aria-pressed", x === b)); drawTimeline(); }));
  $("#tl-agency").addEventListener("change", e => { TL.agency = e.target.value; drawTimeline(); });
  $("#tl-dest").addEventListener("change", e => { TL.dest = e.target.value; drawTimeline(); });
}

/* ── DESTINATIONS ── */
const DEST_INFO = {
 "earth-orbit":"Low Earth orbit begins a few hundred kilometres up. It hosts space stations, observatories and the first satellites.",
 moon:"Earth's only natural satellite, about 384,400 km away on average. The only other world humans have visited.",
 mars:"The fourth planet, a cold desert with polar ice caps, the solar system's tallest volcano and evidence of ancient water.",
 venus:"Similar in size to Earth but wrapped in a dense carbon-dioxide atmosphere, with surface temperatures around 465 °C.",
 mercury:"The smallest planet and closest to the Sun. MESSENGER found water ice in its permanently shadowed polar craters.",
 jupiter:"The largest planet, a gas giant whose moons include volcanic Io and ocean-bearing Europa.",
 saturn:"The ringed gas giant. Its moon Enceladus sprays water-ice plumes and Titan has lakes of liquid methane.",
 uranus:"An ice giant tilted on its side. Voyager 2 is the only spacecraft to have visited, in January 1986.",
 neptune:"The outermost planet. Voyager 2 flew past in August 1989 and found geysers on its moon Triton.",
 pluto:"A dwarf planet in the Kuiper Belt. New Horizons revealed nitrogen glaciers and mountains of water ice in 2015.",
 "small-bodies":"Asteroids and comets are leftovers from the solar system's formation. Samples from Ryugu and Bennu are now on Earth.",
 interstellar:"Beyond the heliopause, where the Sun's solar wind gives way to interstellar space. Voyager 1 and 2 are there.",
 sun:"Our star. Parker Solar Probe has flown closer to it than any other spacecraft."};
function destinations() {
  return pageHead(t("nav_destinations"), t("dest_title"), t("dest_intro"), "paleblue") + `<section class="wrap" style="padding-block:48px 96px"><div class="dgrid">${window.FE_DESTINATIONS.map(d => {
    const n = M.filter(m => m.dest === d.id).length;
    return `<a class="dcard" href="#d-${d.id}">${d.img ? imgTag(d.img, {thumb:true, alt:""}) : ""}<div><h3>${esc(deLabel(d.id))}</h3><span>${esc(t("n_missions", {n:yearL(n)}))}</span></div></a>`; }).join("")}</div></section>`;
}
function destination(id) {
  const d = window.FE_DESTINATIONS.find(x => x.id === id); if (!d) return notFound();
  const list = M.filter(m => m.dest === id).sort((a, b) => a.launch.localeCompare(b.launch));
  const imgs = [...new Set(list.flatMap(m => GALLERY[m.id] || (m.img ? [m.img] : [])))].filter(k => MEDIA[k]).slice(0, 8);
  const disc = list.flatMap(m => (m.discoveries || []).map(x => [m, x])).slice(0, 8);
  return pageHead(t("nav_destinations"), deLabel(id), tc("dest", id, DEST_INFO[id]), d.img) + `<section class="wrap" style="padding-block:56px 40px">
    ${id === "moon" || id === "mars" ? `<a class="btn" href="#${id}" style="margin-bottom:32px">${esc(t(id === "moon" ? "enter_moon" : "enter_mars"))} ${ICON.arrow}</a>` : ""}
    <h2 style="font-size:1.6rem;margin-bottom:24px">${esc(t("missions_here"))} · ${yearL(list.length)}</h2><div class="grid">${list.map(m => card(m)).join("")}</div></section>
   ${disc.length ? `<section class="wrap" style="padding-block:40px"><h2 style="font-size:1.6rem;margin-bottom:16px">${esc(t("m_disc"))}</h2><ul class="refs" style="display:flex;flex-direction:column;gap:10px">${disc.map(([m, x]) => `<li>${esc(x)} — <a href="#m-${m.id}">${esc(m.name)}</a></li>`).join("")}</ul></section>` : ""}
   ${imgs.length ? `<section class="wrap" style="padding-block:40px 96px"><h2 style="font-size:1.6rem;margin-bottom:16px">${esc(t("m_gallery"))}</h2><div class="gallery">${imgs.map(k => `<figure>${imgTag(k, {thumb:true})}<figcaption>${esc(MEDIA[k].title)} — ${esc(MEDIA[k].id)}</figcaption></figure>`).join("")}</div></section>` : ""}`;
}

/* ── ABOUT & CREDITS ── */
function about() {
  return pageHead(t("nav_about"), t("about_title"), t("tagline"), "golden_record") + `<section class="wrap" style="padding-block:56px 96px;display:grid;gap:40px;max-width:900px;margin-inline:auto">
   <div class="notice" style="font-size:1rem"><b>${esc(t("disclaimer"))}</b></div>
   <div class="msec" style="border:0;padding:0"><h2>${esc(t("data_sources"))}</h2>
    <p>${esc(t("about_p1", {na:t("na"), date:fmtDate(window.FE_VERIFIED)}))}</p>
    <p>${esc(t("about_p2")).replace("{credits}", `<a href="#credits" style="color:var(--blue)">${esc(t("media_credits"))}</a>`)}</p>
    <p>${esc(t("about_p3")).replace("{link}", `<a href="https://www.nasa.gov/nasa-brand-center/images-and-media/" target="_blank" rel="noopener" style="color:var(--blue)" dir="ltr">nasa.gov/nasa-brand-center/images-and-media</a>`)}</p>
    <p>${esc(t("about_p4")).replace("{files}", `<a href="media/intro.en.vtt" target="_blank" style="color:var(--blue)">WebVTT</a> · <a href="media/intro.en.srt" target="_blank" style="color:var(--blue)">SRT</a> · <a href="media/intro-timing.json" target="_blank" style="color:var(--blue)">${esc(t("about_timings"))}</a>`)}</p></div>
   <div class="msec" style="border:0;padding:0" id="about-privacy"><h2>${esc(t("privacy"))}</h2><p>${esc(t(window.claude?.use ? "privacy_text" : "privacy_text_web"))}</p></div>
   <div class="msec" style="border:0;padding:0"><h2>NASA Space Apps Challenge 2026</h2><p>${esc(t("built_for"))} ${esc(t("built_by"))}.</p></div></section>`;
}
const credit2 = m => ["NASA", m.center && m.center !== "HQ" ? m.center : null].filter(Boolean).join(" / ") + (m.photographer ? " — " + m.photographer : "");
function credits() {
  const vids = Object.values(window.FE_VIDEO);
  return pageHead(t("media_credits"), t("credits_title"), t("credits_intro"), null) + `<section class="wrap" style="padding-block:48px 96px">
   <h2 style="font-size:1.4rem;margin-bottom:20px">${esc(t("m_video"))} · ${esc(t("intro_replay"))}</h2>
   <div class="creditlist" style="margin-bottom:48px">${vids.map(v => `<div class="citem" style="grid-template-columns:1fr"><div><b>${esc(v.title)}</b><span class="mono">${esc(v.id)} · NASA ${esc(v.center)} · ${esc(v.date)}</span><p style="color:var(--silver);margin:4px 0">${esc(v.usedFor)}</p><a href="${esc(v.page)}" target="_blank" rel="noopener">${esc(t("source_page"))}</a><a href="${esc(v.src)}" target="_blank" rel="noopener">${esc(t("open_original"))}</a></div></div>`).join("")}</div>
   <h2 style="font-size:1.4rem;margin-bottom:20px">3D</h2><div class="creditlist" style="margin-bottom:48px">${window.FE_MODELS.map(x => `<div class="citem" style="grid-template-columns:1fr"><div><b>${esc(x.name)}</b><span class="mono">${esc(t("mu_model_credit"))}</span><br><a href="${esc(x.src)}" target="_blank" rel="noopener">${esc(t("source_page"))}</a></div></div>`).join("")}</div>
   <h2 style="font-size:1.4rem;margin-bottom:20px">${esc(t("m_gallery"))} · ${yearL(Object.keys(MEDIA).length)}</h2>
   <div class="creditlist">${Object.entries(MEDIA).map(([k, m]) => `<div class="citem">${iconTag(k, 96, 72)}<div><b>${isConcept(k) ? esc(t("artist_concept")) + " · " : ""}${esc(m.title)}</b><span class="mono">${esc(m.id)} · ${esc(credit(k))} · ${esc(m.date)}</span><br><a href="${esc(m.page)}" target="_blank" rel="noopener">${esc(t("source_page"))}</a><a href="${esc(m.src)}" target="_blank" rel="noopener">${esc(t("open_original"))}</a></div></div>`).join("")}</div>
   ${window.SS_MEDIA ? `<h2 style="font-size:1.4rem;margin:48px 0 20px">${esc(t("nav_solar"))}</h2>
   <div class="creditlist">${Object.entries(window.SS_MEDIA).map(([k, m]) => `<div class="citem" style="grid-template-columns:${m.isMap ? "1fr" : "96px 1fr"}">${m.isMap ? "" : `<img src="${esc(m.path.replace("ss/img/", "ss/img/t/"))}" alt="" loading="lazy">`}<div><b>${m.isMap ? esc(t("cr_map")) + " · " : ""}${esc(m.title)}</b><span class="mono">${esc(m.id)} · ${esc(credit2(m))}${m.date ? " · " + esc(m.date) : ""}</span><br><a href="${esc(m.page)}" target="_blank" rel="noopener">${esc(t("source_page"))}</a><a href="${esc(m.src)}" target="_blank" rel="noopener">${esc(t("open_original"))}</a></div></div>`).join("")}</div>
   <p class="ss-small" style="margin-top:14px;color:var(--silver)">${esc(t("cr_ss_note"))}</p>` : ""}
   ${hwCredits()}
   ${docCredits()}${jrCredits()}${mdCredits()}${mxCredits()}${wmCredits()}
   <p class="verified" style="margin-top:28px">${esc(t("last_verified"))}: ${esc(fmtDate(window.FE_VERIFIED))}</p></section>`;
}
function jrCredits() {
  const J = window.FE_JR; if (!J) return `<div id="jrcred"></div>`;
  const rows = Object.values(J.IMG).map(i => ({id:i.f, who:i.credit, page:i.page, img:"jr/img/t/" + i.f + ".jpg"}));
  return `<div id="jrcred"><h2 style="font-size:1.4rem;margin:48px 0 20px">THE LAST JOURNEY</h2>
   <div class="creditlist">${rows.map(r => `<div class="citem"><img src="${esc(r.img)}" alt="" loading="lazy"><div><b>${esc(r.id)}</b><span class="mono">${esc(r.who)}</span><br><a href="${esc(r.page)}" target="_blank" rel="noopener">${esc(t("source_page"))}</a></div></div>`).join("")}
   <div class="citem" style="grid-template-columns:1fr"><div><b>${esc(J.SRC.model[0])}</b><span class="mono">${esc(J.SRC.model[2])}</span><br><a href="${esc(J.SRC.model[1])}" target="_blank" rel="noopener">${esc(t("source_page"))}</a></div></div></div></div>`;
}
function wmCredits() {
  const W = window.FE_WM; if (!W) return `<div id="wmcred"></div>`;
  return `<div id="wmcred"><h2 style="font-size:1.4rem;margin:48px 0 20px">${esc(t("wm_title"))} — ${esc(t("wm_sub"))}</h2>
   <div class="creditlist">${Object.values(W.credits()).map(a => `<div class="citem" style="grid-template-columns:1fr"><div><b>${esc(a.t)} · ${esc(a.y)}</b><span class="mono">${esc(a.id)} · ${esc(a.cr)}</span><br><a href="${esc(a.page)}" target="_blank" rel="noopener">${esc(t("source_page"))}</a></div></div>`).join("")}</div>
   <p class="verified" style="margin-top:14px"><a href="#why-mars" style="color:var(--blue)">${esc(t("wm_title"))} →</a></p></div>`;
}
function mxCredits() {
  const D = window.FE_MX; if (!D) return `<div id="mxcred"></div>`;
  const seen = new Set(), rows = Object.values(D.A).filter(a => { if (seen.has(a.id)) return false; seen.add(a.id); return true; });
  return `<div id="mxcred"><h2 style="font-size:1.4rem;margin:48px 0 20px">MARS: THE JOURNEY, THE MACHINES &amp; THE LEGACY</h2>
   <div class="creditlist">${rows.map(a => `<div class="citem" style="grid-template-columns:1fr"><div><b>${esc(a.n)} · ${esc(a.y)}</b><span class="mono">${esc(a.id)} · ${esc(a.cr)}</span><br><a href="${esc(a.page)}" target="_blank" rel="noopener">${esc(t("source_page"))}</a></div></div>`).join("")}</div>
   <p class="verified" style="margin-top:14px"><a href="#mars-doc/sources" style="color:var(--blue)">${esc(t("md_open_inv"))} →</a></p></div>`;
}
function mdCredits() {
  const D = window.FE_MD; if (!D) return `<div id="mdcred"></div>`;
  const seen = new Set(), rows = Object.values(D.A).filter(a => { if (seen.has(a.id)) return false; seen.add(a.id); return true; });
  return `<div id="mdcred"><h2 style="font-size:1.4rem;margin:48px 0 20px">${esc(t("md_credits_k"))}</h2>
   <div class="creditlist">${rows.map(a => `<div class="citem" style="grid-template-columns:1fr"><div><b>${esc(a.n)} · ${esc(a.y)}</b><span class="mono">${esc(a.id)} · ${esc(a.cr)}</span><br><a href="${esc(a.page)}" target="_blank" rel="noopener">${esc(t("source_page"))}</a></div></div>`).join("")}</div>
   <p class="verified" style="margin-top:14px"><a href="#moon-doc/sources" style="color:var(--blue)">${esc(t("md_open_inv"))} →</a></p></div>`;
}
function docCredits() {
  const D = window.FE_DOCDATA;
  if (!D) return `<div id="doccred"></div>`;
  const seen = new Set(), rows = Object.values(D.assets).filter(a => { const k = a.id + a.src; if (seen.has(a.id + (a.k === "vid" ? "" : a.src))) return false; seen.add(a.id + (a.k === "vid" ? "" : a.src)); return true; });
  return `<div id="doccred"><h2 style="font-size:1.4rem;margin:48px 0 20px">THE SILENT LEGACY</h2>
   <div class="creditlist">${rows.map(a => `<div class="citem" style="grid-template-columns:1fr"><div><b>${a.k === "vid" ? esc(t("cr_footage")) + " · " : ""}${esc(a.title)}</b><span class="mono">${esc(a.id)} · NASA${a.k === "vid" ? " · " + esc(a.label) : ""}</span><br><a href="${esc(a.page)}" target="_blank" rel="noopener">${esc(t("source_page"))}</a></div></div>`).join("")}</div>
   <p class="verified" style="margin-top:14px">${esc(t("cr_doc_note")).replace("{files}", `<a href="doc/silent-legacy.en.vtt" target="_blank" style="color:var(--blue)">WebVTT</a> · <a href="doc/silent-legacy.en.srt" target="_blank" style="color:var(--blue)">SRT</a>${["bn","es","fr","ar"].map(l => ` · <a href="doc/silent-legacy.${l}.vtt" target="_blank" style="color:var(--blue)" lang="${l}">WebVTT (${LANGS.find(x => x.code === l).label})</a>`).join("")}`)}</p></div>`;
}
function hwCredits() {
  if (!window.HW_IMG) return `<div id="hwcred"></div>`;
  const R = window.HW_REG, layers = [...new Set(Object.values(R).map(r => r.layer))];
  return `<div id="hwcred"><h2 style="font-size:1.4rem;margin:48px 0 20px">${esc(t("nav_hardware"))}</h2>
   <div class="creditlist">${Object.entries(window.HW_IMG).map(([k, m]) => `<div class="citem"><img src="${esc(m.path.replace("hw/img/", "hw/img/t/"))}" alt="" loading="lazy"><div><b>${esc(m.title)}</b><span class="mono">${esc(m.id)} · ${esc(credit2(m))}${m.date ? " · " + esc(m.date) : ""}</span><br><a href="${esc(m.page)}" target="_blank" rel="noopener">${esc(t("source_page"))}</a><a href="${esc(m.src)}" target="_blank" rel="noopener">${esc(t("open_original"))}</a></div></div>`).join("")}
    ${layers.map(l => `<div class="citem" style="grid-template-columns:1fr"><div><b>Map · ${esc(l.split("/").pop())}</b><span class="mono">NASA ${l.startsWith("Moon") ? "Moon" : "Mars"} Trek WMTS · ${Object.values(R).filter(r => r.layer === l).length} ${esc(t("hw_reg_maps").toLowerCase())}</span><br><a href="https://trek.nasa.gov/${l.startsWith("Moon") ? "moon" : "mars"}/" target="_blank" rel="noopener">${esc(t("source_page"))}</a></div></div>`).join("")}
    ${["m20","msl","heli"].map(k => window.HW_ROUTEDATA[k]).map(r => `<div class="citem" style="grid-template-columns:1fr"><div><b>${esc(t("cr_route"))} · ${esc(r.name)}</b><span class="mono">NASA/JPL-Caltech MMGIS · ${esc(window.HW_ROUTEDATA.retrieved)}</span><br><a href="${esc(r.src)}" target="_blank" rel="noopener">${esc(t("source_page"))}</a></div></div>`).join("")}</div>
   <p class="verified" style="margin-top:14px">${esc(t("cr_hw_note"))}</p></div>`;
}
const notFound = () => `<section class="wrap" style="padding-block:calc(var(--nav-h) + 120px) 120px"><h1>404</h1><p class="lede" style="margin:20px 0">${esc(t("not_found"))}</p><a class="btn" href="#home">${esc(t("nav_home"))}</a></section>`;

/* ── NOVA ── */
const novaLog = [];
let novaVoice = store.get("voice") === "1";
function nova() {
  return pageHead("NOVA", t("nova_title"), t("nova_intro"), "webb_carina") + `<section class="wrap nova">
   <div class="chat"><div class="chatlog" id="chatlog" aria-live="polite"></div>
    <form class="chatform" id="chatform"><label class="sr" for="chatq">${esc(t("nova_ph"))}</label><input class="field" id="chatq" autocomplete="off" placeholder="${esc(t("nova_ph"))}"><button class="btn primary" type="submit">${esc(t("nova_send"))}</button></form></div>
   <aside style="display:flex;flex-direction:column;gap:20px"><p class="modeline" id="novamode">${esc(t("nova_offline"))}</p>
    <div class="suggest">${["nova_q1","nova_q2","nova_q3","nova_q4"].map(q => `<button data-q="${esc(t(q))}">${esc(t(q))}</button>`).join("")}</div>
    <label class="toggle"><input type="checkbox" id="voice" ${novaVoice ? "checked" : ""}> ${esc(t("nova_voice"))}</label>
    <button class="btn small" id="novaclear" style="align-self:flex-start">${esc(t("nova_clear"))}</button></aside></section>`;
}
function renderLog() {
  const el = $("#chatlog"); if (!el) return;
  el.innerHTML = novaLog.length ? novaLog.map(x => x.role === "user" ? `<div class="msg user">${esc(x.text)}</div>` :
    `<div class="msg bot"><span class="who">NOVA</span><div class="body">${x.pending ? `<span class="dots" aria-label="${esc(t("nova_thinking"))}"><span></span><span></span><span></span></span> ${esc(t("nova_thinking"))}` : fmtAnswer(x.text)}</div>
     ${x.tags ? `<div class="srcs">${x.tags.map(g => `<span class="tag ${g[0]}">${esc(g[1])}</span>`).join("")}</div>` : ""}
     ${x.sources && x.sources.length ? `<div class="srcs"><span class="mono" style="color:var(--silver);font-size:.62rem;width:100%">${esc(t("nova_sources"))}</span>${x.sources.filter(i => byId[i]).map(i => `<a class="chip" href="#m-${i}">${esc(byId[i].name)}</a>`).join("")}</div>` : ""}
     ${x.hw && x.hw.length ? hwChips(x.hw) : ""}</div>`).join("")
    : `<div class="msg bot"><span class="who">NOVA</span><div class="body">${esc(t("p_nova"))}</div></div>`;
  el.scrollTop = el.scrollHeight;
}
function hwChips(ids) {
  const H = Object.fromEntries((window.HW_ITEMS || []).map(i => [i.id, i])), MM = HWM(), its = ids.map(i => H[i]).filter(Boolean);
  const src = [...new Map(its.flatMap(i => [...(i.src || []), ...((MM[i.mission] || {}).src || [])]).map(k => [k, window.HW_SRC[k]]).filter(x => x[1])).values()].slice(0, 5);
  return `<div class="srcs"><span class="mono" style="color:var(--silver);font-size:.62rem;width:100%">${esc(t("nav_hardware"))}</span>${its.map(i => `<a class="chip" href="#hw-${i.id}">◎ ${esc(i.name)}</a>`).join("")}</div>
   ${src.length ? `<div class="srcs"><span class="mono" style="color:var(--silver);font-size:.62rem;width:100%">${esc(t("hw_sources"))}</span>${src.map(x => `<a class="chip" href="${esc(x.url)}" target="_blank" rel="noopener">${esc(x.title)} ↗</a>`).join("")}</div>` : ""}`;
}
function fmtAnswer(s) {
  return esc(s).replace(/\[general\]([\s\S]*?)\[\/general\]/g, '<span style="border-bottom:1px dashed var(--amber)" title="' + esc(t("general_l")) + '">$1</span>').replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
}
function compactRecord(m) { return {id:m.id, name:m.name, agency:m.agency, country:m.country, type:m.type, destination:m.dest, status:m.status, launch:m.launch, summary:m.summary, history:m.history, objectives:m.objectives, specs:m.specs, timeline:m.timeline, discoveries:m.discoveries, location:m.location, ended:m.ended, references:m.refs}; }
/* hardware records (hw/hw-data.js) for NOVA */
const HWM = () => Object.fromEntries((window.HW_MISSIONS || []).map(m => [m.id, m]));
function searchHardware(q, dest) {
  const H = window.HW_ITEMS || [], MM = HWM(), terms = String(q || "").toLowerCase().replace(/[?.,!؟।]/g, " ").split(/\s+/).filter(w => w.length > 1 && !/^(the|and|what|where|which|is|are|was|did|does|on|of|to|in|a|an|it|still|there|how|left|behind|now|today|hardware|located|location|find)$/.test(w));
  if (!terms.length) return [];
  return H.filter(i => !dest || i.dest === dest).map(i => {
    const m = MM[i.mission] || {}, hay = [i.name, i.id, m.name, m.agency, m.country, i.cat, i.dest, i.what].join(" ").toLowerCase(), nm = (i.name + " " + (m.name || "")).toLowerCase();
    let sc = 0; for (const w of terms) { if (nm.includes(w)) sc += 4; else if (hay.includes(w)) sc += 1; }
    return sc ? [sc, i] : null;
  }).filter(Boolean).sort((a, b) => b[0] - a[0]).map(x => x[1]);
}
function hwRecord(i, full) {
  const m = HWM()[i.mission] || {}, src = [...new Set([...(i.src || []), ...(m.src || [])])].map(k => window.HW_SRC[k]).filter(Boolean);
  const r = {id:i.id, name:i.name, destination:i.dest, category:i.cat, mission:m.name, agency:m.agency, date_on_surface:i.date || null,
    coordinates:i.loc ? {lat:i.loc[0], lon_east:i.loc[1]} : null, coordinates_refer_to:i.locType, location_accuracy:i.acc,
    mission_outcome:i.outcome || m.outcome || "unknown", physical_status:i.phys, operational_status:i.op};
  if (full) Object.assign(r, {what_it_is:i.what, why_sent:i.why || m.objective, what_happened:i.happened, distance:i.dist || null, engineering:i.eng || null, mission_end:m.end || null, significance:m.significance || null,
    sources:src.map(x => ({title:x.title, url:x.url, org:x.org})), last_verified:window.HW_VERIFIED, note:"Values missing from the record are not confirmed. Coordinates are planetocentric latitude and east longitude."});
  return r;
}
const HW_Q = /retroreflector|hardware|left behind|leave behind|where is|where are|coordinates|still there|still on|heat shield|parachute|descent stage|ascent stage|landing site|crash|impact site|lunar module|roving vehicle|\blrv\b|lunokhod|surveyor|beagle|schiaparelli|ingenuity|pragyan|yutu|zhurong|অবস্থান|কোথায়|dónde|où |أين/i;
function offlineHardware(q) {
  const hits = searchHardware(q).slice(0, 3); if (!hits.length) return null;
  const lab = (p, v) => t("hw_" + p + "_" + String(v || "unknown").replace(/-/g, "_"));
  const L = hits.map(i => { const m = HWM()[i.mission] || {};
    return `**${i.name}** (${m.name}, ${m.agency})\n${t("hw_coords")}: ${i.loc ? Math.abs(i.loc[0]) + "° " + (i.loc[0] >= 0 ? "N" : "S") + ", " + Math.abs(i.loc[1]) + "° " + (i.loc[1] >= 0 ? "E" : "W") : t("hw_unmapped")} — ${t("hw_loctype")}: ${lab("lt", i.locType)}; ${t("hw_acc")}: ${lab("a", i.acc)}.\n${t("hw_outcome")}: ${lab("o", i.outcome || m.outcome)} · ${t("hw_phys")}: ${lab("p", i.phys)} · ${t("hw_op")}: ${lab("op", i.op)}.\n${i.happened || ""}`; });
  return {text:t("nova_found") + "\n\n" + L.join("\n\n"), sources:[], hw:hits.map(i => i.id), tags:[["v", t("verified_l")]]};
}
function offlineAnswer(q) {
  if (HW_Q.test(q) && window.HW_ITEMS) { const h = offlineHardware(q); if (h) return h; }
  const s = q.toLowerCase();
  let hits = [];
  if (/interstellar|আন্তঃনাক্ষত্রিক|interestelar|interstellaire|بين النجم/.test(s)) hits = M.filter(m => m.dest === "interstellar");
  const words = s.replace(/[?.,!؟।]/g, " ").split(/\s+/).filter(w => w.length > 2);
  const named = M.filter(m => { const n = m.name.toLowerCase(); const base = n.split(/[ (]/)[0]; return s.includes(m.id.replace(/-/g, " ")) || s.includes(n) || (base.length > 3 && s.includes(base)) || s.includes(m.id); });
  hits = [...new Set([...named, ...hits])];
  if (!hits.length) hits = searchMissions(words.filter(w => !/what|which|when|why|where|did|does|the|and|how|still/.test(w)).join(" ")).slice(0, 3);
  if (!hits.length) { for (const w of words) { const r = searchMissions(w); if (r.length && r.length < 8) { hits = r.slice(0, 3); break; } } }
  hits = hits.slice(0, 4);
  if (!hits.length) return {text:t("nova_none"), sources:[], tags:[]};
  const L = hits.map(m => `**${m.name}** (${agencies(m)}, ${fmtDate(m.launch)}) — ${stLabel(m.status)}.\n${m.summary}${m.status !== "active" && m.ended ? "\n" + t("m_ended") + ": " + m.ended : ""}${m.location ? "\n" + t("m_location") + ": " + m.location : ""}`);
  return {text:t("nova_found") + "\n\n" + L.join("\n\n"), sources:hits.map(m => m.id), tags:[["v", t("verified_l")]]};
}
async function askNova(q) {
  novaLog.push({role:"user", text:q});
  const slot = {role:"bot", pending:true}; novaLog.push(slot); renderLog();
  const sample = await getSample();
  const local = offlineAnswer(q);
  if (!sample) { Object.assign(slot, local, {pending:false}); renderLog(); speak(slot.text); return; }
  const L = {en:"English",bn:"Bengali",es:"Spanish",fr:"French",ar:"Arabic"}[lang] + (lang === "en" ? "" : " (" + LANGS.find(l => l.code === lang).label + ")");
  const history = novaLog.slice(0, -2).slice(-6).map(x => ({role:x.role === "user" ? "user" : "assistant", content:x.text || ""})).filter(x => x.content);
  const prompt = `You are NOVA, the educational space-exploration assistant of "Forgotten Explorers", an independent archive (not affiliated with NASA).
Answer in ${L}, whatever language the question is written in, using standard scientific terminology for that language. Keep official mission, spacecraft, instrument and agency names and acronyms exactly as written in the records (for example Apollo 11, Perseverance, Mastcam-Z, SuperCam, PIXL, SHERLOC, MOXIE, Lunar Roving Vehicle). Be accurate, warm and concise (under 180 words unless a comparison needs a short table in plain text).
Use the tools to look up mission records in the archive before answering. Treat archive records as verified. If you add anything that is not in the records, wrap exactly that text in [general]...[/general]. Never invent dates, specifications or citations; if something is unknown say so.
For questions about machines, instruments, landers, rovers, impact sites or other hardware on the Moon or Mars, use search_hardware and get_hardware. When giving a location, say what the coordinates refer to (the object itself, the landing site, the impact site or an approximate position) and their accuracy. Keep mission outcome, physical status and operational status separate, and say plainly when something is unknown, uncertain or not confirmed. Mention the record's sources by title.
Do not use markdown headings. After the answer, add a final line exactly in the form: SOURCES: id1, id2 (archive mission ids you used, or SOURCES: none). If you used hardware records, add another line: HARDWARE: hwid1, hwid2.
Archive mission ids and names: ${M.map(m => m.id + "=" + m.name).join("; ")}.

Visitor question: ${q}`;
  const tools = [
    {name:"search_archive", description:"Search Forgotten Explorers mission records by keywords (names, agencies, destinations, types). Returns up to 6 short matches.", inputSchema:{type:"object", properties:{query:{type:"string"}}, required:["query"]},
     execute: ({query}) => searchMissions(String(query || "")).slice(0, 6).map(m => ({id:m.id, name:m.name, agency:m.agency, launch:m.launch, destination:m.dest, status:m.status, summary:m.summary}))},
    {name:"get_mission", description:"Get the full archive record for a mission id.", inputSchema:{type:"object", properties:{id:{type:"string"}}, required:["id"]},
     execute: ({id}) => { const m = byId[String(id)]; if (!m) throw new Error("No mission with id " + id); return compactRecord(m); }},
    {name:"list_by_status", description:"List mission ids and names with a given status: active, completed, retired, inactive, contact-lost, lost, unknown.", inputSchema:{type:"object", properties:{status:{type:"string"}}, required:["status"]},
     execute: ({status}) => M.filter(m => m.status === status).map(m => ({id:m.id, name:m.name, destination:m.dest}))},
    {name:"search_hardware", description:"Search the Hardware Locator records of human-made objects on the Moon and Mars (landers, rovers, instruments, retroreflectors, landing systems, impact sites). Optional destination: moon or mars. Returns up to 8 matches with coordinates, what they refer to, accuracy and status.", inputSchema:{type:"object", properties:{query:{type:"string"}, destination:{type:"string", enum:["moon","mars"]}}, required:["query"]},
     execute: ({query, destination}) => searchHardware(query, destination).slice(0, 8).map(i => hwRecord(i, false))},
    {name:"get_hardware", description:"Get the full Hardware Locator record (description, history, engineering, statuses, sources) for a hardware id.", inputSchema:{type:"object", properties:{id:{type:"string"}}, required:["id"]},
     execute: ({id}) => { const i = (window.HW_ITEMS || []).find(x => x.id === String(id)); if (!i) throw new Error("No hardware record with id " + id); return hwRecord(i, true); }}
  ];
  try {
    const res = await sample([...history, {role:"user", content:prompt}], {tools, cache:false, onText: ({text}) => { slot.pending = false; slot.text = text.replace(/\n?(SOURCES|HARDWARE):.*$/s, ""); renderLog(); }});
    const full = res.text || "";
    const m = full.match(/SOURCES:\s*(.*)$/m), hm = full.match(/HARDWARE:\s*(.*)$/m);
    slot.text = full.replace(/\n?(SOURCES|HARDWARE):.*$/s, "").trim();
    slot.hw = hm ? hm[1].split(/[,\s]+/).map(s => s.trim()).filter(s => (window.HW_ITEMS || []).some(i => i.id === s)) : [];
    slot.sources = m ? m[1].split(/[,\s]+/).map(s => s.trim()).filter(s => byId[s]) : [];
    slot.tags = [["v", t("verified_l")]].concat(/\[general\]/.test(slot.text) ? [["g", t("general_l")]] : []);
    slot.pending = false;
    const mode = $("#novamode"); if (mode) mode.textContent = novaOnlineText();
  } catch (e) {
    Object.assign(slot, local, {pending:false}); slot.text = (e && e.code === "not_granted" ? "" : t("nova_err") + "\n\n") + local.text;
  }
  renderLog(); speak(slot.text);
}
function speak(text) {
  if (!novaVoice || !("speechSynthesis" in window)) return;
  try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text.replace(/\[\/?general\]|\*\*/g, "")); u.lang = {en:"en-GB",bn:"bn-BD",es:"es-ES",fr:"fr-FR",ar:"ar-SA"}[lang]; u.rate = 1; speechSynthesis.speak(u); } catch (e) {}
}
function bindNova() {
  renderLog();
  getSample().then(s => { const el = $("#novamode"); if (el && s) el.textContent = novaOnlineText(); });
  $("#chatform").addEventListener("submit", e => { e.preventDefault(); const v = $("#chatq").value.trim(); if (!v) return; $("#chatq").value = ""; askNova(v); });
  $$("[data-q]").forEach(b => b.addEventListener("click", () => askNova(b.dataset.q)));
  $("#voice").addEventListener("change", e => { novaVoice = e.target.checked; store.set("voice", novaVoice ? "1" : "0"); if (!novaVoice) try { speechSynthesis.cancel(); } catch (x) {} });
  $("#novaclear").addEventListener("click", () => { novaLog.length = 0; renderLog(); });
  if (pendingAsk) { const q = pendingAsk; pendingAsk = null; askNova(q); }
}

/* ── MUSEUM (separate experience, loaded on demand) ── */
let museumFocus = null, museumLoading = null, lastNonMuseum = "home";
const SCRIPTS = new Map();
function loadScript(src) {
  if (SCRIPTS.has(src)) return SCRIPTS.get(src);
  const p = new Promise((res, rej) => { const s = document.createElement("script"); s.src = src; s.onload = res; s.onerror = () => { SCRIPTS.delete(src); s.remove(); rej(new Error(src)); }; document.head.appendChild(s); });
  SCRIPTS.set(src, p); return p;
}
async function openMuseum() {
  const host = document.createElement("div"); host.className = "museum"; host.id = "museum";
  host.innerHTML = `<div class="mu-load" id="muload"><div style="text-align:center"><span class="mono">${esc(t("mu_loading"))}</span><div class="bar"><i id="mubar"></i></div></div></div>`;
  document.body.appendChild(host); document.body.style.overflow = "hidden";
  try {
    if (!museumLoading) museumLoading = (async () => {
      if (!window.THREE) await loadScript("lib/three.min.js");
      await Promise.all(["lib/GLTFLoader.js","lib/DRACOLoader.js","lib/RoomEnvironment.js"].map(loadScript));
      await loadScript("museum.js");
    })();
    await museumLoading;
    if (!THREE.GLTFLoader || !THREE.DRACOLoader || !THREE.RoomEnvironment) await Promise.all(["lib/GLTFLoader.js","lib/DRACOLoader.js","lib/RoomEnvironment.js"].map(loadScript));
    window.FE_Museum.start(host, {t, esc, byId, models:window.FE_MODELS, focus:museumFocus, stLabel, deLabel, fmtDate,
      exit: () => { location.hash = lastNonMuseum === "museum" ? "home" : lastNonMuseum; }});
    museumFocus = null;
  } catch (e) {
    host.innerHTML = `<div class="mu-load"><div style="text-align:center;max-width:520px;padding:20px"><p>${esc(t("mu_nogl"))}</p><div class="chips" style="justify-content:center;margin:18px 0">${window.FE_MODELS.map(x => `<a class="chip" href="#m-${x.mission}">${esc(x.name)}</a>`).join("")}</div><a class="btn" href="#home">${esc(t("mu_exit"))}</a></div></div>`;
  }
}
let solarLoading = null;
async function openSolar() {
  if ($("#solar")) return;
  const host = document.createElement("div"); host.className = "solar"; host.id = "solar"; host.setAttribute("role", "application"); host.setAttribute("aria-label", t("nav_solar"));
  host.innerHTML = `<div class="mu-load"><div style="text-align:center"><span class="mono">${esc(t("mu_loading"))}</span></div></div>`;
  document.body.appendChild(host); document.body.style.overflow = "hidden";
  try {
    if (!solarLoading) solarLoading = (async () => {
      if (!window.THREE) await loadScript("lib/three.min.js");
      await Promise.all(["lib/OrbitControls.js","ss/solar-data.js","ss/ephem.js","ss/media2.js"].map(loadScript));
      await loadScript("ss/solar.js");
    })();
    await solarLoading;
    if (!THREE.OrbitControls) await loadScript("lib/OrbitControls.js");
    if (!$("#solar")) return;
    window.FE_Solar.start(host, {t, esc, lang:() => lang, locale, fmtDate, store, getSample,
      reduced:window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches,
      exit:() => { location.hash = lastNonMuseum === "solar" ? "home" : lastNonMuseum; }});
  } catch (e) {
    host.innerHTML = `<div class="mu-load"><div style="text-align:center;max-width:520px;padding:20px"><p>${esc(t("mu_nogl"))}</p><a class="btn" href="#home">${esc(t("mu_exit"))}</a></div></div>`;
  }
}
let docLoading = null, docReturn = "home";
async function openDoc() {
  if ($("#dc")) return;
  docReturn = lastNonMuseum || "home";
  const host = document.createElement("div"); host.className = "dc"; host.id = "dc"; host.setAttribute("role", "dialog"); host.setAttribute("aria-modal", "true"); host.setAttribute("aria-label", "The Silent Legacy — " + t("doc_label"));
  host.innerHTML = `<div class="mu-load"><div style="text-align:center"><span class="mono">${esc(t("mu_loading"))}</span></div></div>`;
  document.body.appendChild(host); document.body.style.overflow = "hidden";
  try {
    if (!docLoading) docLoading = (async () => { if (!window.FE_DOCDATA) await loadScript("doc/doc-data.js"); await loadScript("doc/doc.js"); })();
    await docLoading;
    if (!$("#dc")) return;
    window.FE_DOC.start(host, {t, esc, store, lang:() => lang, reduced:REDUCED.matches, exit:() => { location.hash = docReturn || "home"; }});
  } catch (e) {
    docLoading = null;
    host.innerHTML = `<div class="mu-load"><div style="text-align:center;max-width:520px;padding:20px"><p>${esc(t("doc_audio_err"))}</p><a class="btn" href="#home">${esc(t("mu_exit"))}</a></div></div>`;
  }
}
/* ── THE LAST JOURNEY (Mars section; loaded on demand) ── */
let jrLoading = null;
async function openJourney(arg) {
  if ($("#jr")) { window.FE_JRX && window.FE_JRX.nav(arg); return; }
  const host = document.createElement("div"); host.className = "jr"; host.id = "jr"; host.setAttribute("role", "dialog"); host.setAttribute("aria-modal", "true"); host.setAttribute("aria-label", t("jr_entry_t"));
  host.innerHTML = `<div class="mu-load"><div style="text-align:center"><span class="mono">${esc(t("mu_loading"))}</span></div></div>`;
  document.body.appendChild(host); document.body.style.overflow = "hidden";
  try {
    if (!jrLoading) jrLoading = (async () => { if (!document.querySelector('link[href="jr/jr.css"]')) await new Promise((res, rej) => { const l = document.createElement("link"); l.rel = "stylesheet"; l.href = "jr/jr.css"; l.onload = res; l.onerror = rej; document.head.appendChild(l); }); await loadScript("jr/jr-i18n.js"); await loadScript("jr/jr-data.js"); await loadScript("jr/jr.js"); })();
    await jrLoading;
    if (!$("#jr")) return;
    window.FE_JRX.start(host, {t, esc, store, fmtDate, locale, loadScript, byId, stLabel, langs:LANGS, lang:() => lang, setLang, arg, reduced:REDUCED.matches,
      exit:() => { location.hash = "mars"; }, go:a => { location.hash = "journey/" + a; }});
  } catch (e) {
    jrLoading = null;
    host.innerHTML = `<div class="mu-load"><div style="text-align:center;max-width:520px;padding:20px"><p>${esc(t("nova_err"))}</p><a class="btn" href="#mars">${esc(t("mu_exit"))}</a></div></div>`;
  }
}
/* ── THE MOON documentary (Moon section; loaded on demand) ── */
let mdLoading = null;
async function openMoonDoc(arg) {
  if ($("#md")) { window.FE_MDX && window.FE_MDX.nav(arg); return; }
  const host = document.createElement("div"); host.className = "md"; host.id = "md"; host.setAttribute("role", "dialog"); host.setAttribute("aria-modal", "true"); host.setAttribute("aria-label", t("md_title"));
  host.innerHTML = `<div class="mu-load"><div style="text-align:center"><span class="mono">${esc(t("mu_loading"))}</span></div></div>`;
  document.body.appendChild(host); document.body.style.overflow = "hidden";
  try {
    if (!mdLoading) mdLoading = (async () => {
      if (!document.querySelector('link[href="md/md.css"]')) await new Promise((res, rej) => { const l = document.createElement("link"); l.rel = "stylesheet"; l.href = "md/md.css"; l.onload = res; l.onerror = rej; document.head.appendChild(l); });
      if (!T.md_close) await loadScript("md/md-i18n.js");
      if (!T.hw_c_lander) await loadScript("hw/hw-i18n.js");
      if (!window.HW_ITEMS) await loadScript("hw/hw-data.js");
      if (!window.FE_MD) await loadScript("md/md-data.js");
      await loadScript("md/md-cues.js"); await loadScript("md/md.js");
    })();
    await mdLoading;
    if (!$("#md")) return;
    window.FE_MDX.start(host, {t, esc, tc, T, store, fmtDate, byId, langs:LANGS, lang:() => lang, getSample, arg, reduced:REDUCED.matches,
      exit:() => { location.hash = "moon"; }, go:a => { location.hash = "moon-doc/" + a; }});
  } catch (e) {
    mdLoading = null;
    host.innerHTML = `<div class="mu-load"><div style="text-align:center;max-width:520px;padding:20px"><p>${esc(T.md_err ? t("md_err") : t("nova_err"))}</p><a class="btn" href="#moon">${esc(t("mu_exit"))}</a></div></div>`;
  }
}
/* ── MARS documentary (Mars section; loaded on demand) ── */
let mxLoading = null;
async function openMarsDoc(arg) {
  if ($("#mx")) { window.FE_MXP && window.FE_MXP.nav(arg); return; }
  const host = document.createElement("div"); host.className = "mx"; host.id = "mx"; host.setAttribute("role", "dialog"); host.setAttribute("aria-modal", "true"); host.setAttribute("aria-label", t("mx_title") + " — " + t("mx_title2"));
  host.innerHTML = `<div class="mu-load"><div style="text-align:center"><span class="mono">${esc(t("mu_loading"))}</span></div></div>`;
  document.body.appendChild(host); document.body.style.overflow = "hidden";
  try {
    if (!mxLoading) mxLoading = (async () => {
      if (!document.querySelector('link[href="mx/mx.css"]')) await new Promise((res, rej) => { const l = document.createElement("link"); l.rel = "stylesheet"; l.href = "mx/mx.css"; l.onload = res; l.onerror = rej; document.head.appendChild(l); });
      if (!T.md_close) await loadScript("md/md-i18n.js");
      if (!T.mx_c1) await loadScript("mx/mx-i18n.js");
      if (!window.FE_MX) await loadScript("mx/mx-data.js");
      await loadScript("mx/mx-cues.js"); await loadScript("mx/mx.js");
    })();
    await mxLoading;
    if (!$("#mx")) return;
    window.FE_MXP.start(host, {t, esc, store, byId, langs:LANGS, lang:() => lang, getSample, arg, reduced:REDUCED.matches,
      exit:() => { location.hash = "mars"; }, go:a => { location.hash = "mars-doc" + (a ? "/" + a : ""); }});
  } catch (e) {
    mxLoading = null;
    host.innerHTML = `<div class="mu-load"><div style="text-align:center;max-width:520px;padding:20px"><p>${esc(T.md_err ? t("md_err") : t("nova_err"))}</p><a class="btn" href="#mars">${esc(t("mu_exit"))}</a></div></div>`;
  }
}
/* ── WHY MARS? (interactive science page; loaded on demand) ── */
let wmLoading = null;
async function openWhyMars() {
  const host = $("#wmhost"); if (!host) return;
  try {
    if (!wmLoading) wmLoading = (async () => {
      if (!document.querySelector('link[href="wm/wm.css"]')) await new Promise((res, rej) => { const l = document.createElement("link"); l.rel = "stylesheet"; l.href = "wm/wm.css"; l.onload = res; l.onerror = rej; document.head.appendChild(l); });
      if (!T.wm_s1_t) await loadScript("wm/wm-i18n.js");
      if (!window.FE_WM) await loadScript("wm/wm.js");
    })();
    await wmLoading;
    if (!host.isConnected) return;
    const ctx = {t, esc, store, locale, reduced:REDUCED.matches, arrow:ICON.arrow};
    host.innerHTML = window.FE_WM.render(ctx); window.FE_WM.bind(host, ctx);
    host.removeAttribute("aria-busy");
  } catch (e) {
    wmLoading = null;
    host.innerHTML = `<div class="wrap" style="padding-block:calc(var(--nav-h) + 80px) 80px"><p>${esc(t("nova_err"))}</p><a class="btn" href="#mars">${esc(t("nav_mars"))}</a></div>`;
  }
}
function closeMarsDoc() { const h = $("#mx"); if (h) { window.FE_MXP?.stop?.(); h.remove(); document.body.style.overflow = ""; } }
function closeMoonDoc() { const h = $("#md"); if (h) { window.FE_MDX?.stop?.(); h.remove(); document.body.style.overflow = ""; } }
function closeJourney() { const h = $("#jr"); if (h) { window.FE_JRX?.stop?.(); h.remove(); document.body.style.overflow = ""; } }
function closeDoc() { const h = $("#dc"); if (h) { window.FE_DOC?.stop?.(); h.remove(); document.body.style.overflow = ""; } }
/* ── STORIES: "What did it find?", "The minds behind the mission" (mission pages) and "The words that remain" (#words).
   Content lives in stories.js, loaded only when one of these views opens. ── */
const needStories = () => window.FE_FINDS ? Promise.resolve() : loadScript("stories.js");
const XK = {o:"x_k_o", m:"x_k_m", i:"x_k_i", h:"x_k_h"};
const xImg = (k, alt) => !k ? "" : MEDIA[k] ? imgTag(k, {thumb:true, alt}) : `<img src="${esc(k)}" alt="${esc(alt)}" loading="lazy" decoding="async">`;
const xSrc = (m, label, url) => { const u = url || (m.refs[0] || [])[1], l = label || (m.refs[0] || [])[0] || ""; return u ? `<a class="xsrc" href="${esc(u)}" target="_blank" rel="noopener">${esc(t("x_source"))}: ${esc(l)} ↗</a>` : ""; };
const xEn = () => lang !== "en" ? `<p class="xen">${esc(t("x_english"))}</p>` : "";
const initials = n => n.split(/\s+/).filter(w => /^[A-ZÀ-Ý]/.test(w)).slice(0, 2).map(w => w[0]).join("");
const minEligible = m => ["NASA", "ESA"].includes(agencyKey(m.agency[0]));   /* lead agency from the mission database, not collaborators */
function findsSection(m) {
  const F = window.FE_FINDS && window.FE_FINDS[m.id]; if (!F) return "";
  return `<section class="msec xsec" id="s-find"><h2>${esc(t("x_find_t"))}</h2><p class="xsub">${esc(t("x_find_s"))}</p>${xEn()}
   <div class="xfinds">${F.map(([ti, d, dt, why, k, img, sl, su]) => `<article class="xfind">${img ? `<div class="xph">${xImg(img, ti)}</div>` : ""}
    <div class="xbody"><div class="xmeta"><span class="xk ${k}">${esc(t(XK[k] || "x_k_o"))}</span>${dt ? `<time datetime="${esc(dt)}">${esc(/^\d{4}-\d\d/.test(dt) ? fmtDate(dt) : dt)}</time>` : ""}</div>
    <h3 lang="en" dir="auto">${esc(ti)}</h3><p lang="en" dir="auto">${esc(d)}</p><p class="xwhy"><b>${esc(t("x_why"))}</b> <span lang="en" dir="auto">${esc(why)}</span></p>${xSrc(m, sl, su)}</div></article>`).join("")}</div>
   <p class="verified" style="margin-top:12px">${esc(t("x_find_note"))}</p></section>`;
}
function mindsSection(m) {
  if (!minEligible(m)) return "";
  const P = window.FE_MINDS && window.FE_MINDS[m.id];
  return `<section class="msec xsec" id="s-minds"><h2>${esc(t("x_minds_t"))}</h2><p class="xsub">${esc(t("x_minds_s"))}</p>${P ? xEn() : ""}
   ${P ? `<div class="xminds">${P.map(([n, role, did, why, slug, photo]) => `<article class="xmind">
     <div class="xpor">${photo ? imgTag(photo, {thumb:true, alt:n}) : `<span aria-hidden="true">${esc(initials(n))}</span>`}</div>
     <div lang="en" dir="ltr"><h3>${esc(n)}</h3><p class="xrole">${esc(role)}</p><p>${esc(did)}</p><p class="xwhy">${esc(why)}</p>
     ${slug ? `<a class="xsrc" href="${esc(/^https?:/.test(slug) ? slug : window.FE_WIKI(slug))}" target="_blank" rel="noopener">${esc(t("x_bio"))} ↗</a>` : xSrc(m)}${photo ? `<p class="xcap">${esc(MEDIA[photo].id)} · NASA</p>` : ""}</div></article>`).join("")}</div>
     <p class="verified" style="margin-top:12px">${esc(t("x_minds_note"))}</p>`
    : `<p class="xempty">${esc(t("x_minds_empty"))}</p>`}</section>`;
}
function fillStories(m) {
  const slot = $("#xslot"); if (!slot) return;
  needStories().then(() => { const s = $("#xslot"); if (!s || s.dataset.m !== m.id) return; s.innerHTML = findsSection(m) + mindsSection(m); s.removeAttribute("aria-busy"); IMGPRIME.reset(); reveal(s); })
    .catch(() => { const s = $("#xslot"); if (s) { s.innerHTML = `<p class="xempty">${esc(t("x_failed"))} <button class="btn small" type="button" data-xretry>${esc(t("x_retry"))}</button></p>`; s.querySelector("[data-xretry]").onclick = () => { s.innerHTML = xSkel(); fillStories(m); }; } });
}
const xSkel = () => `<div class="xskel" aria-hidden="true"><i></i><i></i><i></i></div>`;
const xSlot = m => `<div id="xslot" data-m="${m.id}" aria-busy="true">${xSkel()}</div>`;

/* The words that remain */
const WQ = {mission:"", q:"", order:"asc"};
function words() {
  return pageHead(t("words_k"), t("words_title"), t("words_intro"), "earthrise") + `<section class="wrap wsec" style="padding-block:40px 96px">
   <div class="wbar"><label><span class="sr">${esc(t("words_search"))}</span><input class="field" id="w-q" type="search" placeholder="${esc(t("words_search"))}" value="${esc(WQ.q)}"></label>
    <label><span class="sr">${esc(t("words_mission"))}</span><select class="field" id="w-m"><option value="">${esc(t("words_all"))}</option></select></label>
    <button class="btn small" id="w-o" type="button" aria-pressed="${WQ.order === "desc"}">${esc(t(WQ.order === "asc" ? "words_oldest" : "words_newest"))}</button></div>
   <p class="xen" style="margin:0 0 18px">${esc(t("words_note"))}</p>
   <div id="wlist" aria-busy="true">${xSkel()}</div></section>`;
}
function drawWords() {
  const L = $("#wlist"); if (!L || !window.FE_WORDS) return;
  const q = WQ.q.trim().toLowerCase();
  const list = window.FE_WORDS.filter(w => (!WQ.mission || w.mission === WQ.mission) && (!q || [w.q, w.tr, w.who, w.role, w.ctx, (byId[w.mission] || {}).name].join(" ").toLowerCase().includes(q)))
    .sort((a, b) => (WQ.order === "asc" ? 1 : -1) * a.date.localeCompare(b.date));
  L.removeAttribute("aria-busy");
  L.innerHTML = list.length ? list.map(w => { const m = byId[w.mission];
    return `<article class="wcard"><div class="wq"><blockquote dir="ltr"${/[А-я]/.test(w.q) ? ' lang="ru"' : ' lang="en"'}>“${esc(w.q)}”</blockquote>${w.tr ? `<p class="wtr">${esc(t("words_tr"))}: “${esc(w.tr)}”</p>` : ""}</div>
     <div class="wfoot"><div class="wpor">${w.img ? xImg(w.img, w.portrait ? w.who : "") : `<span aria-hidden="true">${esc(initials(w.who))}</span>`}</div>
      <div><b lang="en" dir="auto">${esc(w.who)}</b><span class="xrole" lang="en" dir="auto">${esc(w.role)}</span><span class="wdate mono">${esc(/^\d{4}-\d\d/.test(w.date) ? fmtDate(w.date) : w.date)}${m ? ` · <a href="#m-${m.id}">${esc(m.name)}</a>` : ""}</span>
      <p lang="en" dir="auto">${esc(w.ctx)}</p>${w.img ? `<p class="xcap">${esc(t(w.portrait ? "words_photo_p" : "words_photo_m"))}</p>` : ""}<a class="xsrc" href="${esc(w.src[1])}" target="_blank" rel="noopener">${esc(t("x_source"))}: ${esc(w.src[0])} ↗</a></div></div></article>`; }).join("")
    : `<p class="xempty">${esc(t("no_results"))}</p>`;
  IMGPRIME.reset(); reveal(L);
}
function bindWords() {
  needStories().then(() => {
    const sel = $("#w-m"); if (!sel) return;
    const ids = [...new Set(window.FE_WORDS.map(w => w.mission))].filter(id => byId[id]).sort((a, b) => byId[a].launch.localeCompare(byId[b].launch));
    sel.insertAdjacentHTML("beforeend", ids.map(id => `<option value="${id}" ${WQ.mission === id ? "selected" : ""}>${esc(byId[id].name)}</option>`).join(""));
    sel.addEventListener("change", () => { WQ.mission = sel.value; drawWords(); });
    let tm = 0; $("#w-q").addEventListener("input", e => { clearTimeout(tm); tm = setTimeout(() => { WQ.q = e.target.value; drawWords(); }, 140); });
    $("#w-o").addEventListener("click", e => { WQ.order = WQ.order === "asc" ? "desc" : "asc"; e.currentTarget.setAttribute("aria-pressed", WQ.order === "desc"); e.currentTarget.textContent = t(WQ.order === "asc" ? "words_oldest" : "words_newest"); drawWords(); });
    drawWords();
  }).catch(() => { const L = $("#wlist"); if (L) { L.innerHTML = `<p class="xempty">${esc(t("x_failed"))} <button class="btn small" type="button">${esc(t("x_retry"))}</button></p>`; L.querySelector("button").onclick = () => { L.innerHTML = xSkel(); bindWords(); }; } });
}

/* ── HARDWARE LOCATOR · cinematic intro ──
   Plays once per browser session when a visitor enters the Hardware Locator. The narration (audio/hl_intro.mp3, the supplied
   ElevenLabs recording, untouched) is the master clock: every shot change below is timed to a word in it. The ambience is
   synthesised with Web Audio at low level (no extra files). Enter / Esc / the skip control end it at any moment. */
const HLI = (() => {
  const SRC = "audio/hl_intro.mp3";
  const END = 38.2;                 /* narration ends 35.8 s; the title holds while the last sound resolves */
  /* [start, end, image, focal x%, focal y%, fit, credit] — all NASA photographs; times follow the narration */
  const SHOTS = [
    [0.15, 5.4, "img/hero.webp", 50, 50, "disk", "Apollo 17 · AS17-148-22727 · NASA/JSC", "img/t/hero.webp"],
    [4.8, 6.9, "img/earthrise.webp", 50, 86, "cover", "Earthrise · Apollo 8 · AS08-14-2383 · NASA/JSC", "img/t/earthrise.webp"],
    [6.3, 8.0, "img/hero_lrv-1600.webp", 44, 42, "cover", "Lunar Roving Vehicle · Apollo 17 · AS17-147-22526 · NASA/JSC", "img/hero_lrv-960.webp"],
    [7.3, 9.6, "mx/img/hubble_mars_2001.webp", 50, 50, "disk", "Mars · Hubble Space Telescope · PIA18184 · NASA/STScI"],
    [9.2, 12.5, "mx/img/curiosity_mount_sharp.webp", 44, 46, "cover", "Curiosity on Mount Sharp · PIA22207 · NASA/JPL-Caltech/MSSS"],
    [12.2, 13.2, "jr/img/PIA04421.jpg", 30, 62, "cover", "Mars Exploration Rover and Sojourner · PIA04421 · NASA/JPL"],
    [13.0, 14.0, "doc/img/vl1_footpad.jpg", 14, 58, "cover wide", "Viking Lander 1 footpad · PIA10738 · NASA/JPL"],
    [13.8, 14.8, "img/mro.webp", 50, 42, "cover", "Mars Reconnaissance Orbiter · PIA07212 · NASA/JPL"],
    [14.6, 16.6, "img/easep.webp", 46, 56, "cover", "Apollo 11 science instruments · AS11-40-5948 · NASA/JSC", "img/t/easep.webp"],
    [16.4, 18.3, "mx/img/perseverance_tube_drill.webp", 56, 46, "cover", "Perseverance coring drill · PIA24799 · NASA/JPL-Caltech"],
    [18.1, 20.2, "img/spirit.webp", 50, 56, "cover", "Spirit · PIA05040 · NASA/JPL-Caltech"],
    [20.0, 22.3, "img/perseverance.webp", 72, 46, "cover", "Perseverance and Ingenuity · PIA24542 · NASA/JPL-Caltech/MSSS", "img/t/perseverance.webp"],
    [22.1, 24.2, "veh/img/opp_self.webp", 50, 44, "cover", "Opportunity · self-portrait · NASA/JPL-Caltech/Cornell/ASU"],
    [24.0, 25.9, "img/surveyor3.webp", 50, 50, "cover", "Surveyor 3 · AS12-48-7121 · NASA/JSC", "img/t/surveyor3.webp"],
    [25.7, 28.9, "doc/img/a11_bootprint.webp", 50, 52, "cover", "Apollo 11 bootprint · AS11-40-5880 · NASA/JSC"],
    [28.7, 31.7, "doc/img/lro_a11.jpg", 28, 50, "cover", "Apollo 11 landing site seen by LRO · PIA12909 · NASA/GSFC/Arizona State Univ."]
  ];
  const TITLE = 31.5, T_MAIN = 31.8, T_TAG = 33.0, T_FEAT = 34.4;   /* "Welcome to Hardware Locator…" begins 31.76 s */
  const SCRIPT = "Beyond Earth, humanity has left behind more than footprints. Across the Moon and the red deserts of Mars, extraordinary machines have travelled into the unknown. Rovers, landers, orbiters and scientific instruments, each carrying the ambition of human exploration. Some are still operating. Others rest silently on distant worlds. Their missions deserve to be remembered. Their stories deserve to be discovered. Welcome to Hardware Locator, a feature of Forgotten Explorers.";
  let S = null;
  const seen = () => { try { return sessionStorage.getItem("fe:hliSeen") === "1"; } catch (e) { return false; } };
  const markSeen = () => { try { sessionStorage.setItem("fe:hliSeen", "1"); } catch (e) {} };
  const touch = () => window.matchMedia && matchMedia("(hover: none) and (pointer: coarse)").matches;

  /* ── ambience: quiet Web Audio score under the voice ── */
  function score(ctx) {
    const out = ctx.createGain(); out.gain.value = 0; out.connect(ctx.destination);
    const t0 = ctx.currentTime, at = s => t0 + s;
    out.gain.linearRampToValueAtTime(0.9, at(3));
    const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 520; lp.connect(out);
    const tone = (f, g, a, d, type = "sine", dest = lp) => { const o = ctx.createOscillator(), v = ctx.createGain(); o.type = type; o.frequency.value = f; v.gain.value = 0; o.connect(v); v.connect(dest);
      v.gain.setValueAtTime(0, at(a)); v.gain.linearRampToValueAtTime(g, at(a + Math.min(3, d / 3))); v.gain.setValueAtTime(g, at(a + d - Math.min(3, d / 3))); v.gain.linearRampToValueAtTime(0, at(a + d)); o.start(at(a)); o.stop(at(a + d + 0.1)); };
    /* deep-space drone (A + E) for the whole piece */
    tone(55, 0.05, 0, END); tone(82.4, 0.03, 0.5, END - 0.5);
    /* space air: filtered noise */
    const n = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate), d = n.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const air = ctx.createBufferSource(); air.buffer = n; air.loop = true; const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 340; bp.Q.value = 0.6;
    const ag = ctx.createGain(); ag.gain.value = 0; air.connect(bp); bp.connect(ag); ag.connect(out); ag.gain.linearRampToValueAtTime(0.012, at(4)); ag.gain.setValueAtTime(0.012, at(END - 3)); ag.gain.linearRampToValueAtTime(0, at(END)); air.start(t0); air.stop(at(END + 0.2));
    /* slow harmonic progression: Moon → Mars → engineering → memory → resolve on the title */
    [[5.0, 7.6, [110, 164.8, 261.6]], [12.2, 13.6, [87.3, 130.8, 220]], [25.6, 6.2, [146.8, 220, 349.2]], [31.4, END - 31.4, [110, 164.8, 277.2, 329.6]]]
      .forEach(([a, dur, fs]) => fs.forEach((f, i) => tone(f, 0.018 - i * 0.002, a + i * 0.25, dur, "triangle")));
    /* soft mechanical accents on "rovers, landers, orbiters, instruments" */
    [12.3, 13.05, 13.87, 14.73].forEach(s => { const src = ctx.createBufferSource(); src.buffer = n; const f = ctx.createBiquadFilter(); f.type = "bandpass"; f.Q.value = 4;
      f.frequency.setValueAtTime(700, at(s)); f.frequency.exponentialRampToValueAtTime(1500, at(s + 0.28)); const g = ctx.createGain(); g.gain.setValueAtTime(0, at(s)); g.gain.linearRampToValueAtTime(0.03, at(s + 0.05)); g.gain.exponentialRampToValueAtTime(0.0005, at(s + 0.32));
      src.connect(f); f.connect(g); g.connect(out); src.start(at(s), Math.random()); src.stop(at(s + 0.4)); });
    /* restrained low impact under the title */
    const im = ctx.createOscillator(), ig = ctx.createGain(); im.type = "sine"; im.frequency.setValueAtTime(62, at(T_MAIN)); im.frequency.exponentialRampToValueAtTime(34, at(T_MAIN + 2.4));
    ig.gain.setValueAtTime(0, at(T_MAIN)); ig.gain.linearRampToValueAtTime(0.16, at(T_MAIN + 0.04)); ig.gain.exponentialRampToValueAtTime(0.0008, at(T_MAIN + 3)); im.connect(ig); ig.connect(out); im.start(at(T_MAIN)); im.stop(at(T_MAIN + 3.1));
    out.gain.setValueAtTime(0.9, at(END - 2.6)); out.gain.linearRampToValueAtTime(0, at(END + 0.2));
    return out;
  }

  function play(opts) {
    if (S || seen()) { opts && opts.done && opts.done(); return false; }
    const t = opts.t, reduced = opts.reduced;
    const el = document.createElement("div"); el.className = "hli" + (reduced ? " rm" : ""); el.id = "hli";
    el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true"); el.setAttribute("aria-label", "Hardware Locator — introduction");
    const mob = innerWidth < 760 || LOWDATA;
    el.innerHTML = `<div class="hli-shots">${SHOTS.map(([a, b, src, fx, fy, fit, cr, sm], i) => `<figure class="hli-shot ${fit}" data-i="${i}" style="--fx:${fx}%;--fy:${fy}%;--d:${(b - a + 0.6).toFixed(2)}s"><img alt="" decoding="async" data-src="${mob && sm ? sm : src}"></figure>`).join("")}</div>
      <div class="hli-title" aria-hidden="true"><h2 class="hli-h">HARDWARE LOCATOR</h2><p class="hli-tag">DISCOVER. EXPLORE. REMEMBER.</p><p class="hli-feat">A FEATURE OF FORGOTTEN EXPLORERS</p></div>
      <p class="hli-cr" aria-hidden="true"></p>
      <p class="sr">${SCRIPT}</p>
      <button class="hli-skip" type="button">${touch() ? `<span>${t("hli_tap")}</span>` : `<kbd>[ ENTER ↵ ]</kbd><span>${t("hli_skip")}</span>`}</button>
      <div class="hli-gate" hidden><button type="button" class="hli-go">▶ ${t("hli_start")}</button><small>${t("hli_start_d")}</small></div>`;
    document.body.appendChild(el);
    markSeen();
    const shots = [...el.querySelectorAll(".hli-shot")], imgs = shots.map(s => s.querySelector("img")), cr = el.querySelector(".hli-cr"), title = el.querySelector(".hli-title");
    const audio = new Audio(); audio.preload = "auto"; audio.src = SRC;
    S = {el, audio, raf:0, ctx:null, mix:null, clock0:0, started:false, ending:false, opts, on:-1};
    const load = upto => SHOTS.forEach((s, i) => { if (s[0] <= upto && !imgs[i].src) imgs[i].src = imgs[i].dataset.src; });
    load(6);   /* first shots now; later ones stream in a few seconds ahead of their cue */
    const now = () => S.started && !audio.paused && audio.currentTime > 0 ? audio.currentTime : S.started ? (performance.now() - S.clock0) / 1000 : 0;
    function tick() {
      if (!S) return; const tm = now();
      load(tm + 6);
      shots.forEach((s, i) => s.classList.toggle("on", tm >= SHOTS[i][0] && tm < SHOTS[i][1]));
      let cur = -1; SHOTS.forEach((s, i) => { if (tm >= s[0] + 0.3 && tm < s[1]) cur = i; });
      if (cur !== S.on) { S.on = cur; cr.textContent = cur >= 0 ? SHOTS[cur][6] : ""; cr.classList.toggle("on", cur >= 0); }
      title.classList.toggle("on", tm >= TITLE); title.classList.toggle("m", tm >= T_MAIN); title.classList.toggle("g", tm >= T_TAG); title.classList.toggle("f", tm >= T_FEAT);
      if (tm >= END) { finish(); return; }
      S.raf = requestAnimationFrame(tick);
    }
    function begin() {
      if (!S || S.started) return; S.started = true; el.querySelector(".hli-gate").hidden = true; el.classList.add("run");
      try { const AC = window.AudioContext || window.webkitAudioContext; if (AC) { S.ctx = new AC(); S.ctx.resume && S.ctx.resume(); S.mix = score(S.ctx); } } catch (e) {}
      S.clock0 = performance.now();
      /* if the voice stalls (slow network), keep the pictures on the wall clock instead of freezing */
      S.raf = requestAnimationFrame(tick);
    }
    const p = audio.play();
    if (p && p.then) p.then(begin).catch(() => { if (!S) return; el.querySelector(".hli-gate").hidden = false; el.querySelector(".hli-go").focus(); });
    else begin();
    el.querySelector(".hli-go").addEventListener("click", () => { audio.play().catch(() => {}); begin(); });
    el.querySelector(".hli-skip").addEventListener("click", () => finish(true));
    S.key = e => { if (e.key === "Enter" || e.key === "Escape") { if (e.key === "Enter" && e.target && e.target.classList && e.target.classList.contains("hli-go")) return; e.preventDefault(); e.stopImmediatePropagation(); finish(true); } };
    window.addEventListener("keydown", S.key, true);
    audio.addEventListener("error", () => { if (S && !S.started) begin(); });
    if (!touch()) setTimeout(() => { if (S && S.el.querySelector(".hli-gate").hidden) S.el.querySelector(".hli-skip").focus({preventScroll:true}); }, 60);
    return true;
  }
  function finish(skipped) {
    if (!S || S.ending) return; S.ending = true;
    const {el, audio, ctx, mix, opts} = S;
    cancelAnimationFrame(S.raf); window.removeEventListener("keydown", S.key, true);
    try { audio.pause(); } catch (e) {} audio.removeAttribute("src"); try { audio.load(); } catch (e) {}
    if (ctx) { try { const n = ctx.currentTime; mix.gain.cancelScheduledValues(n); mix.gain.setValueAtTime(mix.gain.value, n); mix.gain.linearRampToValueAtTime(0, n + (skipped ? 0.15 : 0.6)); } catch (e) {} setTimeout(() => { try { ctx.close(); } catch (e) {} }, 900); }
    el.classList.add("out");
    const s = S; S = null;
    setTimeout(() => { el.remove(); }, 700);
    opts && opts.done && opts.done(skipped);
  }
  return {play, stop:() => finish(true), active:() => !!S, seen, time:() => S ? S.audio.currentTime : -1};
})();

window.FE_HLI = HLI;
let hwLoading = null, hwReturn = "home";
async function openHardware(arg) {
  arg = arg || {};
  if ($("#hwl")) { if (window.FE_HW) { if (arg.focus) FE_HW.select(arg.focus); else if (arg.dest) FE_HW.setDest(arg.dest); } return; }
  hwReturn = lastNonMuseum || "home";
  const host = document.createElement("div"); host.className = "hwl"; host.id = "hwl"; host.setAttribute("role", "application"); host.setAttribute("aria-label", t("nav_hardware") + " — " + t("hw_title"));
  host.innerHTML = `<div class="mu-load"><div style="text-align:center"><span class="mono">${esc(t("mu_loading"))}</span></div></div>`;
  document.body.appendChild(host); document.body.style.overflow = "hidden";
  /* first entry this session: cinematic intro on top while the locator loads underneath */
  if (!HLI.seen()) HLI.play({t, reduced:REDUCED.matches});
  try {
    if (!hwLoading) hwLoading = (async () => {
      if (!window.THREE) await loadScript("lib/three.min.js");
      await Promise.all(["lib/OrbitControls.js","hw/hw-geo.js"].concat(window.HW_ITEMS ? [] : ["hw/hw-data.js"]).map(loadScript));
      await loadScript("hw/hw.js");
    })();
    await hwLoading;
    if (!THREE.OrbitControls) await loadScript("lib/OrbitControls.js");
    if (!$("#hwl")) return;
    window.FE_HW.start(host, {t, esc, fmtDate, locale, store, lang:() => lang, getSample, dest:arg.dest, focus:arg.focus,
      reduced:window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches,
      exit:() => { location.hash = hwReturn || "home"; },
      museum:id => { museumFocus = id; lastNonMuseum = (location.hash || "#hardware").slice(1); location.hash = "museum"; },
      ask:q => { pendingAsk = q; location.hash = "nova"; }});
  } catch (e) {
    hwLoading = null;
    host.innerHTML = `<div class="mu-load"><div style="text-align:center;max-width:520px;padding:20px"><p>${esc(t("mu_nogl"))}</p><a class="btn" href="#home">${esc(t("mu_exit"))}</a></div></div>`;
  }
}
function closeHardware() { if (HLI.active()) HLI.stop(); const h = $("#hwl"); if (h) { window.FE_HW?.stop?.(); h.remove(); document.body.style.overflow = ""; } }
function closeSolar() { const h = $("#solar"); if (h) { window.FE_Solar?.stop?.(); h.remove(); document.body.style.overflow = ""; } }
function closeMuseum() { const h = $("#museum"); if (h) { window.FE_Museum?.stop?.(); h.remove(); document.body.style.overflow = ""; } }

/* ── INTRO ── */
let introPlaying = false;
function playIntro(force) {
  if (introPlaying) return; introPlaying = true;
  const I = window.FE_INTRO;
  const capsFor = i => lang === "en" || !window.FE_CAPTIONS[lang] ? null : window.FE_CAPTIONS[lang][i];
  const keyWords = /journey|silent|forgotten|unknown/i;
  const el = document.createElement("div"); el.className = "intro"; el.setAttribute("role", "dialog"); el.setAttribute("aria-label", "Forgotten Explorers intro film");
  el.innerHTML = `<video id="iv" playsinline preload="${LOWDATA ? "none" : "metadata"}" poster="img/t/earthrise.webp"><source src="media/intro.mp4" type="video/mp4"><track kind="captions" src="media/intro.en.vtt" srclang="en" label="English"></video>
   <div class="cap" id="icap" aria-live="off"></div>
   <div class="reveal" id="ireveal"><small>${esc(t("welcome_to"))}</small><h2>FORGOTTEN EXPLORERS</h2><em>${esc(t("legacy_line"))}</em></div>
   <div class="gate" id="igate"><span class="mark">NASA SPACE APPS CHALLENGE 2026 · heisenberg.exe</span><h2>Forgotten Explorers</h2><p>${esc(t("intro_note"))}</p>
    <div class="btnrow" style="justify-content:center"><button class="btn primary" data-i="sound">▶ ${esc(t("intro_begin"))}</button><button class="btn" data-i="muted">${esc(t("intro_muted"))}</button><button class="btn" data-i="skip">${esc(t("intro_skip"))}</button></div>
    ${langSelect("lang-intro")}</div>
   <div class="ictl" id="ictl" hidden><button class="btn small" data-i="snd"></button><button class="btn small" data-i="cc" aria-pressed="true">CC · ${esc(t("captions"))}</button><button class="btn small" data-i="skip">${esc(t("intro_skip"))} ⏭</button></div>
   <div class="iprog" id="iprog"></div><div class="ifade" id="ifade"></div>`;
  document.body.appendChild(el); document.body.style.overflow = "hidden";
  const v = $("#iv", el), cap = $("#icap", el), rev = $("#ireveal", el), prog = $("#iprog", el);
  v.textTracks[0] && (v.textTracks[0].mode = "hidden");
  let cc = true, raf = 0, lastCue = -2, ended = false;
  const sndBtn = $('[data-i="snd"]', el);
  const setSnd = () => sndBtn.textContent = v.muted ? "🔇 " + t("sound_off") : "🔊 " + t("sound_on");
  function tick() {
    const ct = v.currentTime;
    prog.style.width = (ct / I.videoDuration * 100) + "%";
    const idx = I.cues.findIndex(c => ct >= c.start && ct < c.end);
    if (idx !== lastCue) {
      lastCue = idx;
      if (idx < 0) cap.innerHTML = "";
      else {
        const c = I.cues[idx], tr = capsFor(idx);
        cap.innerHTML = tr ? `<span lang="${lang}">${esc(tr)}</span>` : `<span>${c.words.map((w, j) => `<b class="w${keyWords.test(w.w) ? " key" : ""}" data-s="${w.s}" style="font-weight:inherit">${esc(w.w)}</b>`).join(" ")}</span>`;
      }
    }
    if (idx >= 0 && !capsFor(idx)) $$(".w", cap).forEach(w => w.classList.toggle("on", ct >= +w.dataset.s - 0.05));
    cap.classList.toggle("hide", !cc);
    rev.classList.toggle("on", ct >= I.reveal - 0.15);
    if (!ended) raf = requestAnimationFrame(tick);
  }
  function finish() {
    if (ended) return; ended = true; cancelAnimationFrame(raf); store.set("introSeen", "1");
    $("#ifade", el).classList.add("on");
    setTimeout(() => { v.pause(); el.remove(); document.body.style.overflow = ""; introPlaying = false; $("#main").focus({preventScroll:true}); }, 900);
  }
  function start(muted) {
    $("#igate", el).remove(); $("#ictl", el).hidden = false;
    v.muted = muted; setSnd();
    v.play().then(() => { raf = requestAnimationFrame(tick); }).catch(() => { v.muted = true; setSnd(); v.play().then(() => { raf = requestAnimationFrame(tick); }).catch(finish); });
  }
  v.addEventListener("ended", () => setTimeout(finish, 250));
  v.addEventListener("error", finish);
  el.addEventListener("click", e => {
    const b = e.target.closest("[data-i]"); if (!b) return;
    const a = b.dataset.i;
    if (a === "sound") start(false); else if (a === "muted") start(true); else if (a === "skip") { store.set("introSeen", "1"); finish(); }
    else if (a === "snd") { v.muted = !v.muted; setSnd(); } else if (a === "cc") { cc = !cc; b.setAttribute("aria-pressed", cc); }
  });
  el.addEventListener("keydown", e => { if (e.key === "Escape") finish(); });
  $('[data-i="sound"]', el).focus();
}

/* ── ROUTER ── */
function curRoute() {
  const h = (location.hash || "#home").slice(1);
  if (h.startsWith("m-")) { const [id, tab] = h.slice(2).split("/"); return {name:"mission", arg:id, tab}; }
  if (h.startsWith("d-")) return {name:"destination", arg:h.slice(2)};
  if (h === "about-privacy") return {name:"about", arg:"privacy"};
  if (h === "journey" || h.startsWith("journey/")) return {name:"journey", arg:h.slice(8)};
  if (h === "moon-doc" || h.startsWith("moon-doc/")) return {name:"moondoc", arg:h.slice(9)};
  if (h === "mars-doc" || h.startsWith("mars-doc/")) return {name:"marsdoc", arg:h.slice(9)};
  if (h === "nasa") return {name:"home", arg:"nasa"};
  if (h.startsWith("moon/") || h.startsWith("mars/")) return {name:h.slice(0, 4), arg:h.slice(5)};
  if (h === "international" || h.startsWith("international/")) return {name:"international", arg:h.slice(14)};
  if (h.startsWith("hw-")) return {name:"hardware", arg:{focus:h.slice(3)}};
  if (h === "hardware-moon" || h === "hardware-mars") return {name:"hardware", arg:{dest:h.slice(9)}};
  return {name:h || "home"};
}
const TITLES = {home:"Forgotten Explorers"};
function route(keepScroll) {
  const r = curRoute();
  if (r.name !== "solar") closeSolar();
  if (r.name !== "hardware") closeHardware();
  if (r.name !== "journey") closeJourney();
  if (r.name !== "moondoc") closeMoonDoc();
  if (r.name !== "marsdoc") closeMarsDoc();
  if (r.name !== "why-mars" && window.FE_WM) window.FE_WM.stop();
  if (r.name !== "documentary") closeDoc();
  else if ($("#hwl")) { openHardware(r.arg); return; }
  if (r.name !== "museum") { closeMuseum(); }
  if (r.name !== "museum" && r.name !== "solar" && r.name !== "hardware" && r.name !== "documentary" && r.name !== "journey" && r.name !== "moondoc" && r.name !== "marsdoc") { lastNonMuseum = (location.hash || "#home").slice(1); }
  const main = $("#main");
  let html, bind = null;
  switch (r.name) {
    case "home": html = home(); bind = () => { bindNasa(main); if (r.arg === "nasa") setTimeout(() => $("#nasa")?.scrollIntoView({behavior:REDUCED.matches ? "auto" : "smooth", block:"start"}), 60); }; break;
    case "international": html = international(r.arg); bind = bindInternational; break;
    case "explore": html = explore(); bind = bindExplore; break;
    case "mission": { const m = byId[r.arg];
      if (m && (m.dest === "moon" || m.dest === "mars") && !window.FE_VEH) {
        html = `<article data-mission="${m.id}"><section class="mhero"><div class="wrap"><h1>${esc(m.name)}</h1><p class="lede">${esc(m.summary)}</p></div></section><div class="wrap">${xSkel()}</div></article>`;
        bind = () => Promise.all([loadScript("veh/veh-i18n.js"), loadScript("veh/veh-data.js")]).catch(() => { window.FE_VEH = window.FE_VEH || {}; }).then(() => { if (curRoute().name === "mission" && curRoute().arg === m.id) route(true); });
        break; }
      html = mission(m, r.tab); if (m) bind = () => bindMission(m); break; }
    case "moon": case "mars": html = worldPage(r.name); bind = () => bindWorld(r.arg); break;
    case "why-mars": html = `<div id="wmhost" aria-busy="true"><div class="wm-boot"><span class="mono">${esc(t("mu_loading"))}</span></div></div>`; bind = openWhyMars; break;
    case "timeline": html = timeline(); bind = bindTimeline; break;
    case "destinations": html = destinations(); break;
    case "destination": html = destination(r.arg); break;
    case "nova": html = nova(); bind = bindNova; break;
    case "words": html = words(); bind = bindWords; break;
    case "about": html = about(); if (r.arg) bind = () => setTimeout(() => $("#about-privacy")?.scrollIntoView({behavior:REDUCED.matches ? "auto" : "smooth", block:"start"}), 60); break;
    case "credits": if (!window.SS_MEDIA) loadScript("ss/media2.js").then(() => { if (curRoute().name === "credits") route(true); }).catch(() => {}); html = credits(); bind = () => { if (!window.HW_IMG) loadScript("hw/hw-geo.js").then(() => { const el = $("#hwcred"); if (el) el.outerHTML = hwCredits(); }).catch(() => {}); if (!window.FE_DOCDATA) loadScript("doc/doc-data.js").then(() => { const el = $("#doccred"); if (el) el.outerHTML = docCredits(); }).catch(() => {}); if (!window.FE_JR) loadScript("jr/jr-data.js").then(() => { const el = $("#jrcred"); if (el) el.outerHTML = jrCredits(); }).catch(() => {}); if (!window.FE_MD) loadScript("md/md-i18n.js").then(() => loadScript("md/md-data.js")).then(() => { const el = $("#mdcred"); if (el) el.outerHTML = mdCredits(); }).catch(() => {}); if (!window.FE_MX) (T.md_close ? Promise.resolve() : loadScript("md/md-i18n.js")).then(() => loadScript("mx/mx-data.js")).then(() => { const el = $("#mxcred"); if (el) el.outerHTML = mxCredits(); }).catch(() => {}); if (!window.FE_WM) loadScript("wm/wm.js").then(() => { const el = $("#wmcred"); if (el) el.outerHTML = wmCredits(); }).catch(() => {}); }; break;
    case "museum": html = home(); bind = () => openMuseum(); break;
    case "solar": html = home(); bind = () => openSolar(); break;
    case "hardware": html = home(); bind = () => openHardware(r.arg); break;
    case "documentary": html = home(); bind = () => openDoc(); break;
    case "journey": if ($("#jr") && window.FE_JRX) { document.body.style.overflow = "hidden"; window.FE_JRX.nav(r.arg); return; } html = worldPage("mars"); bind = () => openJourney(r.arg); break;
    case "moondoc": if ($("#md") && window.FE_MDX) { document.body.style.overflow = "hidden"; window.FE_MDX.nav(r.arg); return; } html = worldPage("moon"); bind = () => openMoonDoc(r.arg); break;
    case "marsdoc": if ($("#mx") && window.FE_MXP) { document.body.style.overflow = "hidden"; window.FE_MXP.nav(r.arg); return; } html = worldPage("mars"); bind = () => openMarsDoc(r.arg); break;
    default: html = notFound();
  }
  IMGPRIME.reset();
  main.innerHTML = `<div class="page-enter">${html}</div>`;
  $$(".navlinks a, [data-novabtn], [data-ssbtn], [data-hwnbtn]").forEach(a => { if (a.getAttribute("href") === "#" + r.name) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
  const m = r.name === "mission" && byId[r.arg];
  document.title = m ? m.name + " · Forgotten Explorers" : r.name === "home" ? "Forgotten Explorers" : r.name === "why-mars" ? t("nav_whymars") + " · Forgotten Explorers" : t("nav_" + r.name) !== "nav_" + r.name ? t("nav_" + r.name) + " · Forgotten Explorers" : "Forgotten Explorers";
  if (!keepScroll && r.name !== "museum" && r.name !== "hardware" && r.name !== "documentary" && r.name !== "journey" && r.name !== "moondoc" && r.name !== "marsdoc" && r.arg !== "privacy") scrollTop();
  navHome = r.name === "home"; navSolid = null; onScroll();
  document.body.classList.toggle("ov", r.name === "museum" || r.name === "solar" || r.name === "hardware" || r.name === "documentary" || r.name === "journey" || r.name === "moondoc" || r.name === "marsdoc");
  if (bind) bind();
  if (r.name !== "home" && main.querySelector(".nstabs")) bindNasa(main);
  if (r.name !== "moon" && r.name !== "mars" && main.querySelector(".agf")) applyAg(main);
  watchHero();
  if (r.name !== "museum" && r.name !== "solar" && r.name !== "hardware" && r.name !== "documentary") requestAnimationFrame(() => reveal(main));
}
window.addEventListener("hashchange", () => { closeLayer(); route(false); });

/* ── boot ── */
document.documentElement.lang = lang; document.documentElement.dir = LANGS.find(l => l.code === lang).dir;
renderChrome(); route(false);
if (!store.get("introSeen") && curRoute().name === "home" && !location.hash.slice(1).startsWith("m-")) playIntro(false);
})();
