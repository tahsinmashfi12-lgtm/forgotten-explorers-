/* THE LAST JOURNEY — An Interactive Story of the Opportunity Rover.
   Loaded on demand from the Mars section (#journey). Text comes from the central dictionary (jr-i18n.js), facts and sources from jr-data.js.
   3D: Three.js r128 (shared site library), NASA/JPL MER model. The terrain is a labelled reconstruction, not a map of the landing site. */
window.FE_JRX = (() => {
"use strict";
let C, t, esc, host, J, alive = false, arg0 = "";
const $ = s => host.querySelector(s), $$ = s => [...host.querySelectorAll(s)];
const st = {rover:null, view:"select", ch:1, sound:false, disc:"d1", hw:null, chal:"ch1"};
const ICON = {
  x:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  map:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14"/></svg>',
  gear:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/></svg>',
  arrow:'<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.7" class="jr-arr"><path d="M4 12h15m-6-6 6 6-6 6"/></svg>',
  back:'<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.7" class="jr-arr"><path d="M20 12H5m6-6-6 6 6 6"/></svg>',
  snd:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/></svg>',
  mute:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="m17 9 5 6M22 9l-5 6"/></svg>'
};
const tt = (k, v) => t(k, v);
const img = (k, full) => { const i = J.IMG[k]; return i ? (full ? "jr/img/" : "jr/img/t/") + i.f + ".jpg" : ""; };
const fig = (k, cap, cls = "") => { const i = J.IMG[k]; if (!i) return "";
  return `<figure class="jr-fig ${cls}"><img src="${img(k, true)}" alt="${esc(cap || i.f)}" loading="lazy" decoding="async"><figcaption>${i.sim ? `<b>${esc(tt("jr_concept"))}</b> · ` : ""}${esc(cap || "")} <a href="${esc(i.page)}" target="_blank" rel="noopener">${esc(i.f)} · ${esc(i.credit)} ↗</a></figcaption></figure>`; };
const srcList = keys => `<ul class="jr-src">${[...new Set(keys)].map(k => J.SRC[k]).filter(Boolean).map(s => `<li><a href="${esc(s[1])}" target="_blank" rel="noopener">${esc(s[0])} ↗</a> <span>${esc(s[2])}</span></li>`).join("")}</ul>`;
const go = a => C.go(a);

/* ── lifecycle ── */
function start(el, ctx) {
  C = ctx; t = ctx.t; esc = ctx.esc; host = el; J = window.FE_JR; alive = true;
  st.sound = false; G.q = qualityDefault();
  host.addEventListener("click", onClick); host.addEventListener("input", onInput); host.addEventListener("change", onInput);
  document.addEventListener("keydown", onKey); document.addEventListener("keyup", onKeyUp);
  document.addEventListener("visibilitychange", onVis);
  nav(ctx.arg || "");
}
function stop() {
  alive = false; dispose3D(true); stopSound(); stopStorm();
  document.removeEventListener("keydown", onKey); document.removeEventListener("keyup", onKeyUp); document.removeEventListener("visibilitychange", onVis);
  if (host) { host.removeEventListener("click", onClick); host.removeEventListener("input", onInput); host.removeEventListener("change", onInput); }
  host = null;
}
/* arg: "" (select) | "opportunity" | "opportunity/1..7" | "opportunity/map" | "opportunity/challenges" */
function nav(arg) {
  if (!alive) return;
  arg0 = arg || ""; const [r, v] = arg0.split("/");
  const rover = J.ROVERS.find(x => x.id === r && x.playable);
  let view = "select", ch = st.ch;
  if (rover) { if (/^[1-7]$/.test(v || "1")) { view = "story"; ch = +(v || 1); } else if (v === "map") view = "map"; else if (v === "challenges") view = "chal"; }
  const keep3D = G.active && view === "story" && ch === st.ch && st.view === "story";
  if (!keep3D) { dispose3D(false); stopStorm(); }
  st.rover = rover ? rover.id : null; st.view = view; st.ch = ch;
  render(keep3D);
}
function render(keep3D) {
  const body = st.view === "select" ? selectView() : st.view === "map" ? mapView() : st.view === "chal" ? chalView() : storyView(st.ch);
  host.innerHTML = `${topBar()}<div class="jr-body" id="jr-body">${body}</div><div class="jr-modal" id="jr-modal" hidden></div>`;
  host.querySelector("#jr-body").scrollTop = 0;
  bindView(keep3D);
}

/* ── top bar ── */
function topBar() {
  const story = st.view !== "select";
  return `<header class="jr-top"><div class="jr-brand"><b>${esc(tt("jr_title"))}</b><span>${esc(story ? "Opportunity · " + tt("jr_theme") : tt("jr_sub"))}</span></div>
   ${story ? `<nav class="jr-steps" aria-label="${esc(tt("jr_chapters"))}">${[1,2,3,4,5,6,7].map(n => `<a href="#journey/opportunity/${n}" class="${st.view === "story" && st.ch === n ? "on" : ""}" ${st.view === "story" && st.ch === n ? 'aria-current="step"' : ""} title="${esc(tt("jr_chapter", {n}) + " — " + tt("jr_c" + n))}"><i>${String(n).padStart(2, "0")}</i><span>${esc(tt("jr_c" + n))}</span></a>`).join("")}
     <a href="#journey/opportunity/map" class="x ${st.view === "map" ? "on" : ""}" title="${esc(tt("jr_map"))}">${ICON.map}<span>${esc(tt("jr_map"))}</span></a><a href="#journey/opportunity/challenges" class="x ${st.view === "chal" ? "on" : ""}" title="${esc(tt("jr_challenges"))}">${ICON.gear}<span>${esc(tt("jr_challenges"))}</span></a></nav>` : ""}
   <div class="jr-tools"><button class="jr-ib" data-a="sound" aria-pressed="${st.sound}" aria-label="${esc(tt(st.sound ? "jr_sound_off" : "jr_sound_on"))}" title="${esc(tt("jr_audio_note"))}">${st.sound ? ICON.snd : ICON.mute}</button>
    <label class="sr" for="jr-lang">${esc(t("language"))}</label><select id="jr-lang" class="jr-sel" data-lang-jr>${C.langs.map(l => `<option value="${l.code}" ${l.code === C.lang() ? "selected" : ""}>${l.label}</option>`).join("")}</select>
    <button class="jr-ib" data-a="exit" aria-label="${esc(tt("jr_exit"))}">${ICON.x}</button></div></header>`;
}

/* ── rover selection ── */
function selectView() {
  const byId = C.byId;
  return `<section class="jr-select"><div class="jr-head"><span class="mono">${esc(tt("jr_title"))} · ${esc(tt("jr_sub"))}</span><h1>${esc(tt("jr_choose"))}</h1><p>${esc(tt("jr_choose_lede"))}</p></div>
   <div class="jr-cards">${J.ROVERS.map(r => { const m = byId[r.mission] || {}; const active = m.status === "active";
     const dates = `${tt("jr_landed", {d:C.fmtDate(r.landed)})} · ${active ? tt("jr_since", {d:C.fmtDate(r.landed).replace(/^.*?(\d{4}|[০-৯]{4}).*$/, "$1")}) : tt("jr_last", {d:C.fmtDate(r.last)})}`;
     return `<article class="jr-card ${r.playable ? "play" : "soon"}"><div class="jr-cimg"><img src="${r.img}" alt="${esc(r.name || m.name || r.id)}" loading="lazy"><a class="jr-credit" href="${esc(r.imgPage)}" target="_blank" rel="noopener">${esc(r.imgId)} · NASA</a>
       <span class="jr-badge ${active ? "on" : "end"}">${esc(tt(active ? "jr_ongoing" : "jr_ended"))}</span></div>
      <div class="jr-cbody"><h2>${esc(r.name || (m.name || r.id).replace(/ \(.*$/, ""))}</h2>
       <dl><div><dt>${esc(tt("jr_location"))}</dt><dd>${esc(tt(r.where))}</dd></div><div><dt>${esc(tt("jr_dates"))}</dt><dd>${esc(dates)}</dd></div><div><dt>${esc(tt("jr_status"))}</dt><dd>${esc(C.stLabel(m.status))}</dd></div></dl>
       <p>${esc(m.summary || "")}</p>
       ${r.playable ? `<a class="btn primary" href="#journey/${r.id}/1">${esc(tt("jr_explore"))} ${ICON.arrow}</a>` : `<p class="jr-soon"><b>${esc(tt("jr_soon"))}</b><span>${esc(tt("jr_soon_note"))}</span></p><a class="btn small" href="#m-${r.mission}">${esc(m.name || r.id)} ${ICON.arrow}</a>`}</div></article>`; }).join("")}</div>
   <p class="jr-foot mono">${esc(tt("jr_theme"))}</p></section>`;
}

/* ── chapters ── */
function chHead(n, extra = "") {
  const hero = {1:"launch", 2:"eagle", 3:"navpan", 4:"homestake", 5:null, 6:"tausim", 7:"tracks"}[n];
  return `<section class="jr-chead ${hero ? "" : "plain"}">${hero ? `<div class="jr-hbg"><img src="${img(hero, true)}" alt="" decoding="async"></div>` : ""}
   <div class="jr-wrap"><span class="mono">${esc(tt("jr_chapter", {n}))}</span><h1>${esc(tt("jr_c" + n))}</h1><p class="jr-lede">${esc(tt("jr_c" + n + "_lede"))}</p>${extra}</div></section>`;
}
function chFoot(n) {
  const c = J.CH[n - 1];
  return `<section class="jr-wrap jr-cfoot"><details class="jr-srcbox"><summary>${esc(tt("jr_sources"))}</summary>${srcList(c.src)}</details>
   <div class="jr-pn">${n > 1 ? `<a class="btn" href="#journey/opportunity/${n - 1}">${ICON.back} ${esc(tt("jr_c" + (n - 1)))}</a>` : `<a class="btn" href="#journey">${ICON.back} ${esc(tt("jr_back_select"))}</a>`}
   ${n < 7 ? `<a class="btn primary" href="#journey/opportunity/${n + 1}">${esc(tt("jr_next"))}: ${esc(tt("jr_c" + (n + 1)))} ${ICON.arrow}</a>` : ""}</div></section>`;
}
const P = (k) => `<p>${esc(tt(k))}</p>`;
const facts = rows => `<dl class="jr-facts">${rows.map(([a, b]) => `<div><dt>${esc(tt(a))}</dt><dd>${esc(tt(b))}</dd></div>`).join("")}</dl>`;
function storyView(n) {
  if (n === 1) return chHead(1) + `<section class="jr-wrap jr-cols"><div class="jr-text">${P("jr_c1_p1")}${P("jr_c1_p2")}${P("jr_c1_p3")}${P("jr_c1_p4")}
     ${facts([["jr_c1_f1","jr_c1_v1"],["jr_c1_f2","jr_c1_v2"],["jr_c1_f3","jr_c1_v3"],["jr_c1_f4","jr_c1_v4"]])}</div>
    <div class="jr-figs">${fig("launch", tt("jr_c1_cap1"), "tall")}${fig("family", tt("jr_c1_cap2"))}</div></section>` + chFoot(1);
  if (n === 2) return chHead(2) + `<section class="jr-wrap jr-cols"><div class="jr-text">${P("jr_c2_p1")}${P("jr_c2_p2")}${P("jr_c2_p3")}${P("jr_c2_p4")}</div>
    <div class="jr-figs">${fig("airbags", tt("jr_c2_cap1"))}${fig("eagle", tt("jr_c2_cap2"))}</div></section>
    <section class="jr-wrap"><div class="jr-edl"><div class="jr-edl-h"><span class="mono">${esc(tt("jr_recon"))}</span></div><div class="jr-edl-svg" id="jr-edl">${edlSvg(0)}</div>
     <ol class="jr-edl-steps">${[1,2,3,4,5].map(i => `<li><button data-edl="${i - 1}" aria-pressed="${i === 1}"><b>${i}</b><span>${esc(tt("jr_c2_step" + i))}</span></button></li>`).join("")}</ol><p class="jr-edl-d" id="jr-edl-d" aria-live="polite">${esc(tt("jr_c2_step1d"))}</p></div></section>` + chFoot(2);
  if (n === 3) return chHead(3) + `<section class="jr-wrap"><div class="notice jr-note"><b>${esc(tt("jr_recon"))}</b> ${esc(tt("jr_c3_note"))} ${esc(tt("jr_sim_note"))}</div>
     <div class="jr-stage" id="jr-stage"><div class="jr-cover" id="jr-cover"><img src="${img("navpan", true)}" alt="${esc(tt("jr_c3_photo_alt"))}"><div><button class="btn primary jr-startbtn" data-a="drive">${esc(tt("jr_c3_start"))} ${ICON.arrow}</button><p class="mono">${esc(tt("jr_c3_model"))}</p></div></div></div>
     <p class="jr-legal mono">${esc(tt("jr_c3_model"))} <a href="${esc(J.SRC.model[1])}" target="_blank" rel="noopener">science.nasa.gov ↗</a> · ${esc(tt("jr_c3_photo_alt"))} <a href="${esc(J.IMG.navpan.page)}" target="_blank" rel="noopener">PIA07463 ↗</a></p></section>` + chFoot(3);
  if (n === 4) return chHead(4) + `<section class="jr-wrap"><h2 class="jr-h2">${esc(tt("jr_c4_pick"))}</h2><div class="jr-disc"><div class="jr-dlist" role="tablist">${J.DISC.map(d => `<button role="tab" data-disc="${d.k}" aria-selected="${st.disc === d.k}">${d.img ? `<img src="${img(d.img)}" alt="" loading="lazy">` : `<span class="jr-noimg">◆</span>`}<span>${esc(tt("jr_" + d.k))}</span></button>`).join("")}</div>
     <div class="jr-dpanel" id="jr-dpanel" role="tabpanel">${discPanel(st.disc)}</div></div></section>` + chFoot(4);
  if (n === 5) return chHead(5) + `<section class="jr-wrap"><div class="jr-hwx"><div class="jr-stage studio" id="jr-stage"><div class="jr-cover" id="jr-cover"><span class="mono">${esc(tt("jr_loading"))}</span></div></div>
     <aside class="jr-hwpanel" id="jr-hwpanel" aria-live="polite"><p class="mono">${esc(tt("jr_c5_pick"))}</p><ol class="jr-hwlist">${J.HW.map((h, i) => `<li><button data-hw="${h.k}"><b>${i + 1}</b> ${esc(tt("jr_" + h.k))}</button></li>`).join("")}</ol></aside></div>
     <p class="jr-legal mono">${esc(tt("jr_c3_model"))} <a href="${esc(J.SRC.model[1])}" target="_blank" rel="noopener">science.nasa.gov ↗</a> · ${esc(tt("jr_recon_note"))}</p>
     <p><a class="btn small" href="#m-opportunity/hw">${esc(t("vt_hw"))} · Opportunity ${ICON.arrow}</a> <a class="btn small" href="#m-opportunity/ins">${esc(t("vt_ins"))} ${ICON.arrow}</a></p></section>` + chFoot(5);
  if (n === 6) return chHead(6) + `<section class="jr-wrap jr-cols"><div class="jr-text">${P("jr_c6_p1")}${P("jr_c6_p2")}${P("jr_c6_p3")}${P("jr_c6_p4")}${P("jr_c6_p5")}
      <ol class="jr-tl">${["storm","last","clear","final","end"].map(k => `<li><time>${esc(tt("jr_t_" + k))}</time><span>${esc(tt("jr_t_" + k + "_d"))}</span></li>`).join("")}</ol></div>
     <div class="jr-figs"><div class="jr-storm"><div class="jr-storm-h"><span class="mono">${esc(tt("jr_recon"))}</span><b>${esc(tt("jr_c6_storm"))}</b></div><canvas id="jr-storm" width="640" height="360" aria-label="${esc(tt("jr_c6_storm"))}" role="img"></canvas>
       <label class="jr-range"><span>${esc(tt("jr_c6_tau"))}: <b id="jr-tauv">0.5</b></span><input type="range" id="jr-tau" min="0.3" max="11" step="0.1" value="0.5"></label>
       <p class="mono jr-sunv">${esc(tt("jr_c6_sun"))}: <b id="jr-sunv">—</b></p><p class="jr-legal">${esc(tt("jr_c6_storm_note"))}</p></div>
      ${fig("storm", tt("jr_c6_cap1"))}${fig("tausim", tt("jr_c6_cap2"))}${fig("lastmsg", tt("jr_c6_cap3"))}${fig("after", tt("jr_c6_cap4"))}</div></section>` + chFoot(6);
  /* 7 */
  return chHead(7) + `<section class="jr-wrap jr-cols"><div class="jr-text">${P("jr_c7_p1")}${P("jr_c7_p2")}${P("jr_c7_p3")}${P("jr_c7_p4")}
     ${facts([["jr_l1","jr_l1v"],["jr_l2","jr_l2v"],["jr_l3","jr_l3v"],["jr_l4","jr_l4v"],["jr_l5","jr_l5v"],["jr_l6","jr_l6v"]])}
     <h3>${esc(tt("jr_left"))}</h3><p class="jr-chips">${J.hwLinks.map(id => `<a class="chip" href="#hw-${id}">◎ ${esc(((window.HW_ITEMS || []).find(i => i.id === id) || {name:id}).name)}</a>`).join("")}</p></div>
    <div class="jr-figs">${fig("tracks", "")}${fig("eagle", tt("jr_c2_cap2"))}</div></section>
   <section class="jr-final" id="jr-final"><p>${esc(tt("jr_final1"))}</p><p>${esc(tt("jr_final2"))}</p><p>${esc(tt("jr_final3"))}</p>
    <div class="jr-pn c"><a class="btn primary" href="#journey">${esc(tt("jr_back_select"))} ${ICON.arrow}</a><a class="btn" href="#journey/opportunity/map">${esc(tt("jr_map"))}</a></div></section>` + chFoot(7);
}
/* chapter 2 schematic (labelled reconstruction) */
function edlSvg(i) {
  const y = [30, 70, 120, 150, 170][i];
  const capsule = i === 0 ? `<path d="M290 ${y - 14} l26 26 h-52z" fill="#C66B42"/><path d="M262 ${y + 14} q28 14 56 0" stroke="#FFC566" stroke-width="3" fill="none" opacity=".8"/>` : "";
  const chute = i === 1 || i === 2 ? `<path d="M262 ${y - 46} q28 -26 56 0" fill="#EAF0F7" opacity=".85"/><path d="M262 ${y - 46} L290 ${y - 4} L318 ${y - 46}" stroke="#9AA9BA" fill="none"/>` : "";
  const lander = i >= 1 && i <= 2 ? `<rect x="281" y="${y - 4}" width="18" height="12" fill="#C66B42"/>` : "";
  const rockets = i === 2 ? `<path d="M284 ${y + 8} l-4 18M296 ${y + 8} l4 18" stroke="#FFC566" stroke-width="3"/>` : "";
  const bags = i === 3 ? `<g fill="#EAF0F7" opacity=".9"><circle cx="280" cy="${y}" r="13"/><circle cx="300" cy="${y}" r="13"/><circle cx="290" cy="${y - 13}" r="13"/></g><path d="M210 186 q20 -30 40 0 q20 -24 40 0" stroke="#9AA9BA" stroke-dasharray="3 4" fill="none"/>` : "";
  const open = i === 4 ? `<path d="M262 182 l14 -10 h28 l14 10z" fill="#9AA9BA"/><rect x="282" y="158" width="18" height="12" fill="#C66B42"/><path d="M300 166 h40" stroke="#C66B42" stroke-width="2" stroke-dasharray="3 3"/>` : "";
  return `<svg viewBox="0 0 580 200" role="img" aria-label="${esc(tt("jr_c2_step" + (i + 1)))}"><defs><linearGradient id="jrsk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a1a14"/><stop offset="1" stop-color="#8a5a3c"/></linearGradient></defs><rect width="580" height="200" fill="url(#jrsk)"/><path d="M0 186 q140 -8 290 0 t290 0 V200 H0z" fill="#3b2a22"/>${capsule}${chute}${lander}${rockets}${bags}${open}<text x="14" y="22" fill="#EAF0F7" font-size="12" font-family="DM Mono,monospace">${i + 1}/5</text></svg>`;
}
function discPanel(k) {
  const d = J.DISC.find(x => x.k === k) || J.DISC[0];
  return `${d.img ? fig(d.img, tt("jr_" + d.k)) : ""}<h3>${esc(tt("jr_" + d.k))}</h3>
   <div class="jr-inv">${[["jr_d_what", "_w"], ["jr_d_how", "_h"], ["jr_d_means", "_m"], ["jr_d_when", "_t"]].map(([lab, suf], i) => `<details ${i < 1 ? "open" : ""}><summary>${esc(tt(lab))}</summary><p>${esc(tt("jr_" + d.k + suf))}</p></details>`).join("")}</div>
   <p class="jr-verified mono">✓ ${esc(tt("jr_verified"))}</p>${srcList(d.src)}`;
}
function hwPanel(k) {
  const h = J.HW.find(x => x.k === k); if (!h) return "";
  const i = J.HW.indexOf(h) + 1;
  return `<button class="jr-link" data-a="hwlist">${ICON.back} ${esc(tt("jr_c5_pick"))}</button><span class="mono jr-hwn">${String(i).padStart(2, "0")}</span><h3>${esc(tt("jr_" + k))}</h3>
   <dl class="jr-hwdl"><div><dt>${esc(tt("jr_h_purpose"))}</dt><dd>${esc(tt("jr_" + k + "_p"))}</dd></div><div><dt>${esc(tt("jr_h_how"))}</dt><dd>${esc(tt("jr_" + k + "_h"))}</dd></div>
   <div><dt>${esc(tt("jr_h_role"))}</dt><dd>${esc(tt("jr_" + k + "_r"))}</dd></div><div><dt>${esc(tt("jr_h_specs"))}</dt><dd class="mono">${esc(tt("jr_" + k + "_s"))}</dd></div></dl>
   <p class="mono jr-hwref">${esc(tt("jr_h_ref"))}</p>${srcList(h.src)}`;
}

/* ── mission map ── */
function mapView() {
  return `<section class="jr-wrap jr-mapv"><div class="jr-head"><span class="mono">Opportunity · ${esc(tt("jr_map"))}</span><h1>${esc(tt("jr_map"))}</h1><p>${esc(tt("jr_map_lede"))}</p></div>
   <div class="jr-map"><figure class="jr-mapfig"><img src="${img("map", true)}" alt="${esc(tt("jr_map_lede"))}" width="1600" height="1208">${J.SITES.map((s, i) => `<button class="jr-pin" style="left:${s.x}%;top:${s.y}%" data-site="${s.k}" aria-label="${esc(tt("jr_" + s.k))}"><span>${i + 1}</span></button>`).join("")}</figure>
    <aside class="jr-mapp" id="jr-mapp" aria-live="polite"><ol class="jr-hwlist">${J.SITES.map((s, i) => `<li><button data-site="${s.k}"><b>${i + 1}</b> ${esc(tt("jr_" + s.k))}</button></li>`).join("")}<li><button data-site="final"><b>◎</b> ${esc(tt("jr_map_final"))}</button></li></ol></aside></div>
   <p class="jr-legal">${esc(tt("jr_map_note"))} <a href="${esc(J.IMG.map.page)}" target="_blank" rel="noopener">PIA19154 ↗</a></p></section>`;
}
function sitePanel(k) {
  if (k === "final") return `<button class="jr-link" data-a="sitelist">${ICON.back} ${esc(tt("jr_map"))}</button><h3>${esc(tt("jr_map_final"))}</h3><p>${esc(tt("jr_map_final_note"))}</p>${fig("finalmap", tt("jr_map_final"))}${srcList(["finalmap", "jpl2019"])}`;
  const s = J.SITES.find(x => x.k === k);
  return `<button class="jr-link" data-a="sitelist">${ICON.back} ${esc(tt("jr_map"))}</button><span class="mono jr-hwn">${String(J.SITES.indexOf(s) + 1).padStart(2, "0")}</span><h3>${esc(tt("jr_" + k))}</h3><p>${esc(tt("jr_" + k + "_d"))}</p>${s.img ? fig(s.img, tt("jr_" + k)) : ""}${srcList(s.src)}`;
}

/* ── engineering challenges (simplified models) ── */
function chalView() {
  return `<section class="jr-wrap"><div class="jr-head"><span class="mono">Opportunity · ${esc(tt("jr_challenges"))}</span><h1>${esc(tt("jr_challenges"))}</h1><p>${esc(tt("jr_ch_lede"))}</p></div>
   <div class="jr-chtabs" role="tablist">${J.CHAL.map(c => `<button role="tab" data-chal="${c.k}" aria-selected="${st.chal === c.k}">${esc(tt("jr_" + c.k))}</button>`).join("")}</div>
   <div class="jr-chal" id="jr-chal">${chalPanel(st.chal)}</div></section>`;
}
function chalPanel(k) {
  const c = J.CHAL.find(x => x.k === k);
  let ui = "";
  if (k === "ch1") ui = `<label class="jr-range"><span>${esc(tt("jr_ch1_dust"))}: <b id="v1a">20%</b></span><input type="range" id="c1a" min="0" max="80" value="20"></label>
     <label class="jr-range"><span>${esc(tt("jr_ch1_tau"))}: <b id="v1b">0.5</b></span><input type="range" id="c1b" min="0.3" max="11" step="0.1" value="0.5"></label><div class="jr-meter"><i id="m1"></i><em style="left:${100 / 900 * 100}%"></em></div>`;
  if (k === "ch2") ui = `<div class="jr-opts">${[1,2,3].map(i => `<button class="btn small" data-opt="${i}">${esc(tt("jr_ch2_a" + i))}</button>`).join("")}</div><canvas id="c2cv" width="560" height="160" aria-hidden="true"></canvas>`;
  if (k === "ch3") ui = `<label class="jr-range"><span>${esc(tt("jr_ch3_dist"))}: <b id="v3a"></b></span><input type="range" id="c3a" min="54.6" max="401.3" step="0.1" value="225"></label>
     <div class="jr-opts" role="radiogroup"><label><input type="radio" name="c3l" value="dte" checked> ${esc(tt("jr_ch3_dte"))}</label><label><input type="radio" name="c3l" value="relay"> ${esc(tt("jr_ch3_relay"))}</label></div>`;
  if (k === "ch4") ui = `<label class="jr-range"><span>${esc(tt("jr_ch4_temp"))}: <b id="v4a"></b></span><input type="range" id="c4a" min="-97" max="0" value="-80"></label>
     <label class="jr-range"><span>${esc(tt("jr_ch4_heat"))}: <b id="v4b"></b></span><input type="range" id="c4b" min="0" max="40" value="10"></label><div class="jr-meter t"><i id="m4"></i></div>`;
  return `<div class="jr-chq"><h2>${esc(tt("jr_" + k))}</h2><p>${esc(tt("jr_" + k + "_q"))}</p><div class="jr-chui"><span class="mono">${esc(tt("jr_ch_try"))}</span>${ui}</div>
   <div class="jr-chres"><span class="mono">${esc(tt("jr_ch_result"))}</span><p id="jr-res" aria-live="polite">—</p></div><p class="jr-legal">${esc(tt("jr_ch_simnote"))}${k === "ch3" ? " " + esc(tt("jr_ch3_calc")) : ""}</p></div>
   <div class="jr-chreal"><span class="mono">${esc(tt("jr_ch_real"))}</span><p>${esc(tt("jr_" + k + "_real"))}</p>${srcList(c.src)}</div>`;
}
const fmtN = (n, d = 0) => { try { return new Intl.NumberFormat(C.locale(), {maximumFractionDigits:d, minimumFractionDigits:d}).format(n); } catch (e) { return n.toFixed(d); } };
function updChal() {
  const res = $("#jr-res"); if (!res) return;
  if (st.chal === "ch1") {
    const dust = +$("#c1a").value / 100, tau = +$("#c1b").value;
    /* simplified: clear-sky output ~850 Wh/sol (PDS, start of mission) × clean fraction × atmospheric factor */
    const e = 850 * (1 - dust) * Math.exp(-0.35 * Math.max(0, tau - 0.3));
    $("#v1a").textContent = fmtN(dust * 100) + "%"; $("#v1b").textContent = fmtN(tau, 1);
    $("#m1").style.width = Math.min(100, e / 900 * 100) + "%"; $("#m1").classList.toggle("low", e < 100);
    res.textContent = tt("jr_ch1_out", {e:fmtN(e)}) + " — " + tt(e < 100 ? "jr_ch1_low" : "jr_ch1_ok");
  } else if (st.chal === "ch3") {
    const d = +$("#c3a").value, relay = (host.querySelector('input[name="c3l"]:checked') || {}).value === "relay";
    const min = d * 1e9 / 299792458 / 60;   /* distance in million km → minutes at the speed of light */
    const rate = relay ? 256000 : 28800, mins = relay ? 8 : 60, mb = rate * mins * 60 / 8 / 1e6;
    $("#v3a").textContent = fmtN(d, 1) + " × 10⁶ km";
    res.textContent = tt("jr_ch3_delay", {m:fmtN(min, 1)}) + " · " + tt("jr_ch3_vol", {t:fmtN(mins), v:fmtN(mb, 1)});
  } else if (st.chal === "ch4") {
    const out = +$("#c4a").value, heat = +$("#c4b").value;
    /* simplified steady state: insulated box between outside and heaters (illustrative coefficients) */
    const tin = out + 35 + heat * 1.6;
    $("#v4a").textContent = fmtN(out) + " °C"; $("#v4b").textContent = fmtN(heat) + " W";
    $("#m4").style.width = Math.max(0, Math.min(100, (tin + 60) / 120 * 100)) + "%"; $("#m4").classList.toggle("low", tin < -40);
    res.textContent = tt("jr_ch4_out", {t:fmtN(tin)}) + " — " + tt(tin < -40 ? "jr_ch4_cold" : "jr_ch4_ok") + " " + tt("jr_ch4_drain", {w:fmtN(heat * 14)});
  }
}
function runCh2(opt) {
  const cv = $("#c2cv"), res = $("#jr-res"); if (!cv) return; const g = cv.getContext("2d"); let f = 0;
  const sink0 = 10, R = {1:{sink:9, move:0}, 2:{sink:-6, move:110}, 3:{sink:0, move:0}}[opt];
  cancelAnimationFrame(st.c2raf);
  const draw = () => { f++; const p = Math.min(1, f / 90);
    g.clearRect(0, 0, 560, 160); g.fillStyle = "#3b2a22"; g.fillRect(0, 120, 560, 40);
    g.fillStyle = "#8a5a3c"; g.beginPath(); g.moveTo(120, 120); g.quadraticCurveTo(230, 70, 340, 120); g.fill();
    const x = 180 + R.move * p, sink = sink0 + R.sink * p;
    g.fillStyle = "#C9D3DE"; g.fillRect(x - 40, 88 + sink, 80, 14); g.fillStyle = "#222"; [-30, 0, 30].forEach(dx => { g.beginPath(); g.arc(x + dx, 104 + sink, 9, 0, 7); g.fill(); });
    if (opt === 1) { g.fillStyle = "rgba(201,160,122,.6)"; for (let i = 0; i < 6; i++) g.fillRect(x - 40 + Math.random() * 80, 100 + sink - Math.random() * 20, 3, 3); }
    if (f < 90) st.c2raf = requestAnimationFrame(draw); };
  if (C.reduced) { f = 89; } draw();
  res.textContent = tt("jr_ch2_r" + opt);
}

/* ── chapter 6 dust storm (reconstruction) ── */
let storm = null;
function startStorm() {
  const cv = $("#jr-storm"); if (!cv) return; const g = cv.getContext("2d"); const W = cv.width, H = cv.height;
  const parts = Array.from({length:C.reduced ? 0 : 260}, () => ({x:Math.random() * W, y:Math.random() * H, v:0.4 + Math.random() * 1.6, s:Math.random() * 2 + 0.5}));
  storm = {raf:0, tau:+($("#jr-tau") || {value:0.5}).value};
  const frame = () => {
    if (!storm) return; const tau = storm.tau, k = Math.exp(-0.32 * (tau - 0.3));
    const sky = g.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, `rgb(${Math.round(60 + 120 * (1 - k))},${Math.round(70 + 60 * (1 - k))},${Math.round(80 + 20 * (1 - k))})`); sky.addColorStop(1, `rgb(${Math.round(150 * (0.35 + 0.65 * k) + 40 * (1 - k))},${Math.round(110 * (0.35 + 0.65 * k))},${Math.round(80 * (0.35 + 0.65 * k))})`);
    g.globalAlpha = 1; g.fillStyle = sky; g.fillRect(0, 0, W, H);
    const sunA = Math.max(0.03, k); g.fillStyle = `rgba(255,244,220,${sunA})`; g.beginPath(); g.arc(W * 0.7, H * 0.3, 10 + 26 * k, 0, 7); g.fill();
    g.fillStyle = `rgba(190,130,90,${0.25 + 0.6 * (1 - k)})`; g.fillRect(0, 0, W, H);
    g.fillStyle = "#2b1d16"; g.beginPath(); g.moveTo(0, H * 0.82); g.quadraticCurveTo(W * 0.4, H * 0.74, W, H * 0.8); g.lineTo(W, H); g.lineTo(0, H); g.fill();
    /* rover silhouette */
    g.fillStyle = "#14100e"; g.fillRect(W * 0.2, H * 0.72, 70, 8); g.fillRect(W * 0.2 + 46, H * 0.6, 3, 30); g.fillRect(W * 0.2 + 40, H * 0.6, 14, 6);
    [6, 34, 62].forEach(dx => { g.beginPath(); g.arc(W * 0.2 + dx, H * 0.8, 6, 0, 7); g.fill(); });
    g.fillStyle = `rgba(220,170,120,${0.15 + 0.5 * (1 - k)})`;
    for (const p of parts) { p.x += p.v * (0.6 + tau / 4); if (p.x > W) { p.x = 0; p.y = Math.random() * H; } g.fillRect(p.x, p.y, p.s * 3, p.s); }
    storm.raf = requestAnimationFrame(frame);
  };
  frame(); updTau();
}
function updTau() { if (!storm) return; const v = +$("#jr-tau").value; storm.tau = v; $("#jr-tauv").textContent = fmtN(v, 1); $("#jr-sunv").textContent = fmtN(100 * Math.exp(-0.32 * (v - 0.3))) + "%"; }
function stopStorm() { if (storm) { cancelAnimationFrame(storm.raf); storm = null; } cancelAnimationFrame(st.c2raf); }

/* ── events ── */
function bindView(keep3D) {
  if (st.view === "story" && st.ch === 6) startStorm();
  if (st.view === "chal") { if (st.chal !== "ch2") updChal(); }
  if (st.view === "story" && st.ch === 5) { if (keep3D && G.canvas) reattach(); else initStudio(); }
  if (st.view === "story" && st.ch === 3 && keep3D && G.canvas) { reattach(); }
  if (st.view === "story" && st.ch === 7 && !C.reduced) { const f = $("#jr-final"); if (f && "IntersectionObserver" in window) { const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { f.classList.add("in"); io.disconnect(); } }, {threshold:0.4}); io.observe(f); } }
  else { const f = $("#jr-final"); if (f) f.classList.add("in"); }
}
function onClick(e) {
  const a = e.target.closest("[data-a],[data-edl],[data-disc],[data-hw],[data-site],[data-chal],[data-opt],[data-joyb]"); if (!a) return;
  if (a.dataset.edl != null) { const i = +a.dataset.edl; $("#jr-edl").innerHTML = edlSvg(i); $("#jr-edl-d").textContent = tt("jr_c2_step" + (i + 1) + "d"); $$("[data-edl]").forEach(b => b.setAttribute("aria-pressed", b === a)); return; }
  if (a.dataset.disc) { st.disc = a.dataset.disc; $("#jr-dpanel").innerHTML = discPanel(st.disc); $$("[data-disc]").forEach(b => b.setAttribute("aria-selected", b === a)); return; }
  if (a.dataset.hw) { pickHw(a.dataset.hw); return; }
  if (a.dataset.site) { $("#jr-mapp").innerHTML = sitePanel(a.dataset.site); $$(".jr-pin").forEach(p => p.classList.toggle("on", p.dataset.site === a.dataset.site)); return; }
  if (a.dataset.chal) { st.chal = a.dataset.chal; $("#jr-chal").innerHTML = chalPanel(st.chal); $$("[data-chal]").forEach(b => b.setAttribute("aria-selected", b === a)); if (st.chal !== "ch2") updChal(); return; }
  if (a.dataset.opt) { runCh2(+a.dataset.opt); return; }
  if (a.dataset.joyb) { joyButton(a.dataset.joyb); return; }
  const act = a.dataset.a;
  if (act === "exit") C.exit();
  else if (act === "sound") { st.sound ? stopSound() : startSound(); a.setAttribute("aria-pressed", st.sound); a.innerHTML = st.sound ? ICON.snd : ICON.mute; a.setAttribute("aria-label", tt(st.sound ? "jr_sound_off" : "jr_sound_on")); }
  else if (act === "drive") initDrive();
  else if (act === "hwlist") { G.sel = null; $("#jr-hwpanel").innerHTML = `<p class="mono">${esc(tt("jr_c5_pick"))}</p><ol class="jr-hwlist">${J.HW.map((h, i) => `<li><button data-hw="${h.k}"><b>${i + 1}</b> ${esc(tt("jr_" + h.k))}</button></li>`).join("")}</ol>`; $$(".jr-hot").forEach(x => x.classList.remove("on")); }
  else if (act === "sitelist") { $("#jr-mapp").innerHTML = `<ol class="jr-hwlist">${J.SITES.map((s, i) => `<li><button data-site="${s.k}"><b>${i + 1}</b> ${esc(tt("jr_" + s.k))}</button></li>`).join("")}<li><button data-site="final"><b>◎</b> ${esc(tt("jr_map_final"))}</button></li></ol>`; $$(".jr-pin").forEach(p => p.classList.remove("on")); }
  else if (act === "cam") cycleCam();
  else if (act === "reset") resetRover();
  else if (act === "pause") setPause(!G.paused);
  else if (act === "resume") setPause(false);
  else if (act === "interact") interact();
  else if (act === "zin") G.dist = Math.max(3, G.dist * 0.8);
  else if (act === "zout") G.dist = Math.min(26, G.dist * 1.25);
  else if (act === "closecard") closeCard();
  else if (act === "next4") go("opportunity/4");
  else if (act === "q") setQuality(a.dataset.q);
}
function onInput(e) {
  const el = e.target;
  if (el.matches("[data-lang-jr]") && e.type === "change") { C.setLang(el.value); return; }
  if (el.id === "jr-tau") updTau();
  else if (/^c[134][ab]$/.test(el.id) || el.name === "c3l") updChal();
  else if (el.id === "jr-qsel" && e.type === "change") setQuality(el.value);
}
function onVis() { if (document.hidden) { if (G.raf) { cancelAnimationFrame(G.raf); G.raf = 0; } } else if (G.active && !G.raf) loop(); }

/* ── ambient sound (synthesised, off by default) ── */
let snd = null;
function startSound() {
  try { const A = new (window.AudioContext || window.webkitAudioContext)(); const len = A.sampleRate * 4, b = A.createBuffer(1, len, A.sampleRate), d = b.getChannelData(0); let last = 0;
    for (let i = 0; i < len; i++) { const w = Math.random() * 2 - 1; last = (last + 0.02 * w) / 1.02; d[i] = last * 3.2; }
    const src = A.createBufferSource(); src.buffer = b; src.loop = true; const lp = A.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 520;
    const gain = A.createGain(); gain.gain.value = 0; const lfo = A.createOscillator(); lfo.frequency.value = 0.07; const lg = A.createGain(); lg.gain.value = 0.05; lfo.connect(lg); lg.connect(gain.gain);
    src.connect(lp); lp.connect(gain); gain.connect(A.destination); src.start(); lfo.start(); gain.gain.setTargetAtTime(0.12, A.currentTime, 1.5);
    snd = {A, gain}; st.sound = true; } catch (e) { st.sound = false; }
}
function stopSound() { if (snd) { try { snd.gain.gain.setTargetAtTime(0, snd.A.currentTime, 0.2); const A = snd.A; setTimeout(() => A.close(), 600); } catch (e) {} snd = null; } st.sound = false; }

/* ═════════════════════════════ 3D ═════════════════════════════ */
const G = {active:false, q:"med", paused:false, keys:{}, joy:{x:0, y:0}, cam:0, yaw:0, pitch:0.32, dist:8, sel:null};
function qualityDefault() {
  const saved = C.store.get("jr_q"); if (saved === "low" || saved === "med" || saved === "high") return saved;
  const mobile = matchMedia("(pointer:coarse)").matches || window.innerWidth < 760;
  return mobile || (navigator.deviceMemory && navigator.deviceMemory <= 4) || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ? "low" : "med";
}
const Q = {low:{pr:1, seg:110, rocks:220, shadow:0, aa:false}, med:{pr:1.5, seg:170, rocks:520, shadow:1024, aa:true}, high:{pr:2, seg:240, rocks:1000, shadow:2048, aa:true}};
function glOK() { try { const c = document.createElement("canvas"); return !!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl"))); } catch (e) { return false; } }
async function libs(orbit) {
  if (!window.THREE) await C.loadScript("lib/three.min.js");
  if (!THREE.GLTFLoader) await C.loadScript("lib/GLTFLoader.js");
  if (!THREE.DRACOLoader) await C.loadScript("lib/DRACOLoader.js");
  if (orbit && !THREE.OrbitControls) await C.loadScript("lib/OrbitControls.js");
}
let modelP = null;
function loadModel() {
  if (!modelP) modelP = new Promise((res, rej) => { const L = new THREE.GLTFLoader(), D = new THREE.DRACOLoader(); D.setDecoderPath("lib/draco/"); D.setDecoderConfig({type:"wasm"}); L.setDRACOLoader(D);
    L.load(J.model, g => { D.dispose(); g.scene.traverse(o => { if (o.isMesh && o.material) { const m = o.material; m.metalness = Math.min(m.metalness ?? 0, 0.25); m.roughness = Math.max(m.roughness ?? 1, 0.55); } }); res(g.scene); }, undefined, e => { modelP = null; rej(e); }); });
  return modelP;
}
function fallback(kind) {
  const cov = $("#jr-cover"); if (!cov) return;
  cov.innerHTML = kind === "drive" ? `<img src="${img("navpan", true)}" alt="${esc(tt("jr_c3_photo_alt"))}"><div class="jr-nogl"><p>${esc(tt("jr_nogl"))}</p><ol>${[1,2,3,4,5].map(i => `<li><b>${esc(tt("jr_o" + i))}</b><br>${esc(tt("jr_i" + i + "_b"))}</li>`).join("")}</ol><a class="btn primary" href="#journey/opportunity/4">${esc(tt("jr_next"))} ${ICON.arrow}</a></div>`
    : `<img src="veh/img/opp_self.webp" alt="Opportunity"><div class="jr-nogl"><p>${esc(tt("jr_nogl"))}</p></div>`;
}
function makeRenderer(stage) {
  const q = Q[G.q]; const r = new THREE.WebGLRenderer({antialias:q.aa, powerPreference:"high-performance"});
  r.setPixelRatio(Math.min(q.pr, window.devicePixelRatio || 1)); r.outputEncoding = THREE.sRGBEncoding; r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 1.0;
  r.shadowMap.enabled = !!q.shadow; r.shadowMap.type = THREE.PCFSoftShadowMap;
  r.domElement.className = "jr-canvas"; r.domElement.tabIndex = 0; stage.appendChild(r.domElement);
  return r;
}
function sizeTo() { if (!G.renderer || !G.canvas || !G.canvas.parentElement) return; const p = G.canvas.parentElement, w = p.clientWidth, h = p.clientHeight; if (!w || !h) return; G.renderer.setSize(w, h, false); G.camera.aspect = w / h; G.camera.updateProjectionMatrix(); }
function reattach() { const stage = $("#jr-stage"); if (!stage || !G.canvas) return; stage.innerHTML = ""; stage.appendChild(G.canvas); if (G.mode === "drive") stage.insertAdjacentHTML("beforeend", hudHTML()), bindHud(); else stage.insertAdjacentHTML("beforeend", hotsHTML()); if (G.ro) G.ro.disconnect(); G.ro = new ResizeObserver(sizeTo); G.ro.observe(stage); sizeTo(); updHud(true); }
function dispose3D(all) {
  G.active = false; if (G.raf) cancelAnimationFrame(G.raf); G.raf = 0; if (G.ro) { G.ro.disconnect(); G.ro = null; }
  if (G.controls) { G.controls.dispose(); G.controls = null; }
  if (G.scene) G.scene.traverse(o => { if (o.isMesh || o.isPoints || o.isInstancedMesh) { if (o.userData.shared) return; o.geometry && o.geometry.dispose(); const m = Array.isArray(o.material) ? o.material : [o.material]; m.forEach(x => { if (!x) return; for (const k in x) if (x[k] && x[k].isTexture) x[k].dispose(); x.dispose(); }); } });
  if (G.renderer) { G.renderer.dispose(); G.renderer.forceContextLoss && G.renderer.forceContextLoss(); }
  if (G.canvas && G.canvas.parentElement) G.canvas.remove();
  G.renderer = G.scene = G.camera = G.canvas = null; G.mode = null; G.paused = false; G.keys = {};
  if (all && modelP) { modelP.then(s => s.traverse(o => { if (o.isMesh) { o.geometry.dispose(); const m = o.material; for (const k in m) if (m[k] && m[k].isTexture) m[k].dispose(); m.dispose(); } })).catch(() => {}); modelP = null; }
}
function roverClone(src) { const r = src.clone(true); r.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; o.userData.shared = true; if (o.material) { o.material.envMapIntensity = 0.8; } } }); return r; }

/* ── studio (chapter 5) ── */
async function initStudio() {
  const stage = $("#jr-stage"); if (!stage) return;
  if (!glOK()) { fallback("studio"); return; }
  try { await libs(true); } catch (e) { fallback("studio"); return; }
  if (!alive || st.view !== "story" || st.ch !== 5) return;
  let model; try { model = await loadModel(); } catch (e) { fallback("studio"); return; }
  if (!alive || st.view !== "story" || st.ch !== 5 || !$("#jr-stage")) return;
  dispose3D(false);
  const S = $("#jr-stage"); S.innerHTML = "";
  G.mode = "studio"; G.renderer = makeRenderer(S); G.canvas = G.renderer.domElement;
  G.scene = new THREE.Scene(); G.scene.background = new THREE.Color(0x070b14);
  G.camera = new THREE.PerspectiveCamera(38, 1.6, 0.05, 80); G.camera.position.set(3.2, 2.0, 3.6);
  G.scene.add(new THREE.HemisphereLight(0xdfe8f5, 0x2a1d16, 0.8));
  const key = new THREE.DirectionalLight(0xfff1e0, 1.3); key.position.set(4, 7, 5); key.castShadow = !!Q[G.q].shadow; key.shadow.mapSize.set(1024, 1024); G.scene.add(key);
  const rim = new THREE.DirectionalLight(0x9cc0e8, 0.6); rim.position.set(-5, 3, -4); G.scene.add(rim);
  const floor = new THREE.Mesh(new THREE.CircleGeometry(4, 64), new THREE.MeshStandardMaterial({color:0x2a1d16, roughness:0.95})); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; G.scene.add(floor);
  const ring = new THREE.Mesh(new THREE.RingGeometry(1.9, 1.94, 96), new THREE.MeshBasicMaterial({color:0x5599d5, transparent:true, opacity:0.5})); ring.rotation.x = -Math.PI / 2; ring.position.y = 0.005; G.scene.add(ring);
  G.rover = roverClone(model); G.scene.add(G.rover);
  G.controls = new THREE.OrbitControls(G.camera, G.canvas); G.controls.target.set(0, 0.7, 0); G.controls.enableDamping = true; G.controls.minDistance = 1.6; G.controls.maxDistance = 9; G.controls.maxPolarAngle = Math.PI * 0.49; G.controls.enablePan = false; G.controls.update();
  G.anchors = J.HW.map(h => new THREE.Vector3(...h.a));
  S.insertAdjacentHTML("beforeend", hotsHTML());
  G.ro = new ResizeObserver(sizeTo); G.ro.observe(S); sizeTo();
  G.active = true; G.tgt = null; loop();
  if (G.sel) pickHw(G.sel);
}
function hotsHTML() { return `<div class="jr-hots">${J.HW.map((h, i) => `<button class="jr-hot ${G.sel === h.k ? "on" : ""}" data-hw="${h.k}" aria-label="${esc(tt("jr_" + h.k))}"><span>${i + 1}</span></button>`).join("")}</div><p class="jr-hint mono">${esc(tt("jr_c5_lede"))}</p>`; }
function pickHw(k) {
  G.sel = k; const p = $("#jr-hwpanel"); if (p) p.innerHTML = hwPanel(k);
  $$(".jr-hot").forEach(b => b.classList.toggle("on", b.dataset.hw === k));
  const h = J.HW.find(x => x.k === k); if (h && G.controls) G.tgt = new THREE.Vector3(h.a[0] * 0.6, Math.max(0.35, h.a[1] * 0.85), h.a[2] * 0.6);
  if (window.matchMedia("(max-width:900px)").matches && p) p.scrollIntoView({block:"nearest", behavior:C.reduced ? "auto" : "smooth"});
}
function studioFrame() {
  if (G.tgt) { G.controls.target.lerp(G.tgt, 0.08); if (G.controls.target.distanceTo(G.tgt) < 0.01) G.tgt = null; }
  G.controls.update();
  const w = G.canvas.clientWidth, h = G.canvas.clientHeight, cam = G.camera.position, ctr = new THREE.Vector3(0, 0.7, 0);
  const dc = cam.distanceTo(ctr), v = new THREE.Vector3();
  $$(".jr-hot").forEach((b, i) => { const a = G.anchors[i]; v.copy(a).project(G.camera);
    const behind = cam.distanceTo(a) > dc + 0.25; b.style.transform = `translate(${(v.x * 0.5 + 0.5) * w}px,${(-v.y * 0.5 + 0.5) * h}px)`; b.classList.toggle("far", behind); });
}

/* ── drive (chapter 3) ── */
const OBJ = [{k:1, p:[0, 0]}, {k:2, p:[-2.5, 9.0]}, {k:3, p:[7, 16]}, {k:4, p:[28, 34]}, {k:5, p:null}];
const CRATERS = [{x:0, z:0, r:11, d:1.5, rim:0.35}, {x:58, z:-64, r:26, d:6, rim:1.2}, {x:-40, z:40, r:6, d:0.8, rim:0.2}, {x:-70, z:-20, r:9, d:1.2, rim:0.3}, {x:35, z:75, r:4, d:0.5, rim:0.15}, {x:90, z:20, r:12, d:1.4, rim:0.35}];
function heightAt(x, z) {
  let h = 0.45 * Math.sin(x * 0.021 + 1.3) * Math.cos(z * 0.017) + 0.25 * Math.sin(x * 0.047 + z * 0.031) + 0.12 * Math.sin(z * 0.09 - x * 0.02);
  let rip = 1;
  for (const c of CRATERS) { const dx = x - c.x, dz = z - c.z, r = Math.hypot(dx, dz), R = c.r;
    if (r < R) h -= c.d * (1 - (r / R) * (r / R)), rip *= Math.min(1, Math.max(0, (r / R - 0.6) * 2.5));
    const q = (r - R) / (0.3 * R); h += c.rim * Math.exp(-q * q); }
  h += 0.07 * Math.sin((x * 0.8 + z * 0.6) * 1.9) * rip * (0.6 + 0.4 * Math.sin(x * 0.05));
  return h;
}
function noiseTex(size, a, b) {
  const c = document.createElement("canvas"); c.width = c.height = size; const g = c.getContext("2d"), d = g.createImageData(size, size);
  for (let i = 0; i < size * size; i++) { const n = Math.random(); const v = a + (b - a) * n; d.data[i * 4] = v; d.data[i * 4 + 1] = v * 0.92; d.data[i * 4 + 2] = v * 0.86; d.data[i * 4 + 3] = 255; }
  g.putImageData(d, 0, 0); const t2 = new THREE.CanvasTexture(c); t2.wrapS = t2.wrapT = THREE.RepeatWrapping; return t2;
}
function layerTex() {
  const c = document.createElement("canvas"); c.width = 64; c.height = 256; const g = c.getContext("2d");
  g.fillStyle = "#b39a80"; g.fillRect(0, 0, 64, 256); for (let y = 0; y < 256; y += 5) { const v = 165 + Math.random() * 22; g.fillStyle = `rgba(${v},${v * 0.86},${v * 0.72},.7)`; g.fillRect(0, y, 64, 1 + Math.random() * 2); }
  const t2 = new THREE.CanvasTexture(c); t2.wrapS = t2.wrapT = THREE.RepeatWrapping; t2.encoding = THREE.sRGBEncoding; return t2;
}
async function initDrive() {
  const stage = $("#jr-stage"); if (!stage) return;
  if (!glOK()) { fallback("drive"); return; }
  const cov = $("#jr-cover"); if (cov) cov.innerHTML = `<div class="jr-loadbox"><span class="mono">${esc(tt("jr_loading"))}</span><i></i></div>`;
  try { await libs(false); } catch (e) { fallback("drive"); return; }
  let model; try { model = await loadModel(); } catch (e) { fallback("drive"); return; }
  if (!alive || st.view !== "story" || st.ch !== 3 || !$("#jr-stage")) return;
  buildDrive(model);
}
function buildDrive(model) {
  const keep = G.state; dispose3D(false);
  const S = $("#jr-stage"); S.innerHTML = ""; S.classList.add("live");
  const q = Q[G.q];
  G.mode = "drive"; G.renderer = makeRenderer(S); G.canvas = G.renderer.domElement;
  const scene = G.scene = new THREE.Scene(); const sky = new THREE.Color(0xc79a74); scene.background = sky; scene.fog = new THREE.Fog(0xc79a74, 60, 210);
  G.camera = new THREE.PerspectiveCamera(55, 1.6, 0.05, 400);
  scene.add(new THREE.HemisphereLight(0xf7dcc2, 0x4a3022, 0.95));
  const sun = new THREE.DirectionalLight(0xfff0dc, 1.3); sun.position.set(-30, 55, -40); scene.add(sun); scene.add(sun.target); G.sun = sun;
  if (q.shadow) { sun.castShadow = true; sun.shadow.mapSize.set(q.shadow, q.shadow); Object.assign(sun.shadow.camera, {left:-14, right:14, top:14, bottom:-14, near:1, far:150}); sun.shadow.bias = -0.0008; }
  /* sky dome gradient */
  const dome = new THREE.Mesh(new THREE.SphereGeometry(300, 24, 12), new THREE.ShaderMaterial({side:THREE.BackSide, depthWrite:false, fog:false, uniforms:{}, vertexShader:"varying vec3 p;void main(){p=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}", fragmentShader:"varying vec3 p;void main(){float h=clamp(p.y,0.,1.);vec3 a=vec3(.86,.66,.5),b=vec3(.42,.36,.38);gl_FragColor=vec4(mix(a,b,pow(h,.6)),1.);}"}));
  scene.add(dome);
  /* terrain */
  const N = q.seg, SZ = 300, geo = new THREE.PlaneGeometry(SZ, SZ, N, N); geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position, col = new Float32Array(pos.count * 3);
  for (let i = 0; i < pos.count; i++) { const x = pos.getX(i), z = pos.getZ(i), y = heightAt(x, z); pos.setY(i, y);
    const s = 0.15 + 0.035 * Math.sin(x * 0.3) * Math.cos(z * 0.27) + 0.03 * Math.random(); let r = s * 1.05, g = s * 0.76, b = s * 0.6;
    for (const c of CRATERS) { const d = Math.hypot(x - c.x, z - c.z) / c.r; if (d > 0.55 && d < 1.15) { const k = Math.max(0, 1 - Math.abs(d - 0.9) / 0.3) * 0.5; r += k * 0.3; g += k * 0.23; b += k * 0.16; } }
    col[i * 3] = r; col[i * 3 + 1] = g; col[i * 3 + 2] = b; }
  geo.setAttribute("color", new THREE.BufferAttribute(col, 3)); geo.computeVertexNormals();
  const grain = noiseTex(128, 175, 255); grain.repeat.set(120, 120);
  const ground = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({vertexColors:true, map:grain, roughness:0.97, metalness:0})); ground.receiveShadow = true; scene.add(ground);
  /* rocks */
  const rg = new THREE.DodecahedronGeometry(1, 0), rm = new THREE.MeshStandardMaterial({color:0x5a4234, roughness:0.9, flatShading:true});
  const rocks = new THREE.InstancedMesh(rg, rm, q.rocks); const m4 = new THREE.Matrix4(), qt = new THREE.Quaternion(), sc = new THREE.Vector3(), p3 = new THREE.Vector3(); let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < q.rocks; i++) { let x, z; do { x = (rnd() - 0.5) * 220; z = (rnd() - 0.5) * 220; } while (Math.hypot(x, z) < 6 || Math.hypot(x - 28, z - 34) < 4);
    const s = 0.04 + Math.pow(rnd(), 3) * 0.45; qt.setFromEuler(new THREE.Euler(rnd() * 3, rnd() * 3, rnd() * 3)); sc.set(s * (1 + rnd()), s * 0.6, s); p3.set(x, heightAt(x, z) + s * 0.2, z); m4.compose(p3, qt, sc); rocks.setMatrixAt(i, m4); }
  rocks.castShadow = !!q.shadow; rocks.receiveShadow = true; scene.add(rocks);
  /* layered outcrop on the crater wall (objective 2) */
  const lt = layerTex(); const om = new THREE.MeshStandardMaterial({map:lt, roughness:0.95, color:0xd9c3a8});
  for (let i = 0; i < 16; i++) { const a = -0.6 + i * 0.075 + Math.PI / 2 + (rnd() - 0.5) * 0.05, rr = 8.6 + rnd() * 1.1; const x = Math.cos(a) * rr - 2.4, z = Math.sin(a) * rr * 0.98;
    const w = 0.8 + rnd() * 1.4, hh = 0.07 + rnd() * 0.09, dd = 0.7 + rnd() * 0.9;
    const slab = new THREE.Mesh(new THREE.BoxGeometry(w, hh, dd), om); slab.position.set(x, heightAt(x, z) + hh * 0.15, z); slab.rotation.set(-0.18 + (rnd() - 0.5) * 0.2, -a + Math.PI / 2 + (rnd() - 0.5) * 0.5, (rnd() - 0.5) * 0.25); slab.castShadow = !!q.shadow; slab.receiveShadow = true; scene.add(slab); }
  /* spherules (objective 3), drawn larger than life so they are visible */
  const bg = new THREE.SphereGeometry(0.018, 6, 4), bm = new THREE.MeshStandardMaterial({color:0x585c66, roughness:0.6, metalness:0.2});
  const nb = G.q === "low" ? 500 : 1400, berries = new THREE.InstancedMesh(bg, bm, nb);
  for (let i = 0; i < nb; i++) { const a = rnd() * 6.283, r = Math.sqrt(rnd()) * 3.2, x = 7 + Math.cos(a) * r, z = 16 + Math.sin(a) * r; p3.set(x, heightAt(x, z) + 0.01, z); sc.set(1, 1, 1); m4.compose(p3, qt.identity(), sc); berries.setMatrixAt(i, m4); }
  scene.add(berries);
  /* heat-shield debris and iron meteorite (objective 4) — simplified shapes */
  const hs = new THREE.Mesh(new THREE.ConeGeometry(1.3, 0.35, 18, 1, true), new THREE.MeshStandardMaterial({color:0x8d8a86, roughness:0.6, metalness:0.4, side:THREE.DoubleSide}));
  hs.position.set(25.5, heightAt(25.5, 31.5) + 0.12, 31.5); hs.rotation.set(0.5, 0.3, 2.6); hs.castShadow = !!q.shadow; scene.add(hs);
  const met = new THREE.Mesh(new THREE.IcosahedronGeometry(0.16, 1), new THREE.MeshStandardMaterial({color:0x4a4644, roughness:0.35, metalness:0.85, flatShading:true}));
  met.position.set(28, heightAt(28, 34) + 0.12, 34); met.castShadow = !!q.shadow; scene.add(met);
  /* landing platform with deflated airbags (objective 1) — simplified shapes */
  const lander = new THREE.Group(); const pm = new THREE.MeshStandardMaterial({color:0x55524f, roughness:0.75, metalness:0.3}), am = new THREE.MeshStandardMaterial({color:0x7d7264, roughness:1});
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.08, 3), pm); base.rotation.y = Math.PI / 6; lander.add(base);
  for (let i = 0; i < 3; i++) { const a = i * 2.094 + Math.PI / 2; const petal = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.04, 0.9), pm); petal.position.set(Math.cos(a) * 1.05, -0.02, Math.sin(a) * 1.05); petal.rotation.y = -a + Math.PI / 2; lander.add(petal);
    const bag = new THREE.Mesh(new THREE.SphereGeometry(0.55, 10, 6), am); bag.scale.set(1.2, 0.16, 0.9); bag.position.set(Math.cos(a + 1.05) * 1.35, 0.02, Math.sin(a + 1.05) * 1.35); lander.add(bag); }
  lander.position.set(0, heightAt(0, 0) + 0.05, 0); lander.traverse(o => { if (o.isMesh) { o.castShadow = !!q.shadow; o.receiveShadow = true; } }); scene.add(lander);
  /* objective 5: rim of the large crater, on the side facing the start */
  const big = CRATERS[1], ang = Math.atan2(-big.z, -big.x); OBJ[4].p = [big.x + Math.cos(ang) * (big.r + 1.5), big.z + Math.sin(ang) * (big.r + 1.5)];
  /* beacon */
  const bc = new THREE.Mesh(new THREE.OctahedronGeometry(0.28, 0), new THREE.MeshBasicMaterial({color:0x9ccbf4, transparent:true, opacity:0.9, fog:false})); scene.add(bc); G.beacon = bc;
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 6, 6, 1, true), new THREE.MeshBasicMaterial({color:0x9ccbf4, transparent:true, opacity:0.25, fog:false})); scene.add(beam); G.beam = beam;
  /* rover */
  G.rover = roverClone(model); scene.add(G.rover);
  G.state = keep || {x:0, z:0, h:0, v:0, odo:0, power:820, done:{}};
  G.cam = G.cam || 0; G.yaw = G.yaw || 0; G.pitch = G.pitch || 0.32; G.dist = G.dist || 8; G.paused = false; G.free = null; G.last = performance.now();
  S.insertAdjacentHTML("beforeend", hudHTML()); bindHud();
  G.ro = new ResizeObserver(sizeTo); G.ro.observe(S); sizeTo();
  G.active = true; placeRover(0); updHud(true); loop(); G.canvas.focus({preventScroll:true});
}
function hudHTML() {
  const touch = matchMedia("(pointer:coarse)").matches;
  return `<div class="jr-hud" id="jr-hud">
   <div class="jr-obj"><span class="mono">${esc(tt("jr_objectives"))}</span><ol>${OBJ.map(o => `<li data-o="${o.k}" class="${G.state && G.state.done[o.k] ? "done" : ""}">${esc(tt("jr_o" + o.k))}</li>`).join("")}</ol><p class="jr-objdone" hidden>${esc(tt("jr_obj_done"))} <button class="btn small primary" data-a="next4">${esc(tt("jr_next"))}: ${esc(tt("jr_c4"))}</button></p></div>
   <div class="jr-tel mono"><b>${esc(tt("jr_simtel"))}</b><span>${esc(tt("jr_power"))} <i id="jr-pw">—</i></span><span>${esc(tt("jr_odo"))} <i id="jr-od">—</i></span><span>${esc(tt("jr_speed"))} <i id="jr-sp">—</i></span><span>${esc(tt("jr_tilt"))} <i id="jr-tl">—</i></span><small>${esc(tt("jr_timewarp"))}</small></div>
   <div class="jr-ctl"><button class="jr-ib" data-a="cam" title="C">${esc(tt("jr_cam"))}: <span id="jr-camn">${esc(tt(["jr_cam_chase","jr_cam_front","jr_cam_free"][G.cam]))}</span></button><button class="jr-ib" data-a="reset" title="R">${esc(tt("jr_reset"))}</button><button class="jr-ib" data-a="pause" title="Esc">${esc(tt("jr_pause"))}</button>
    <label class="sr" for="jr-qsel">${esc(tt("jr_quality"))}</label><select id="jr-qsel" class="jr-sel" title="${esc(tt("jr_quality"))}">${["low","med","high"].map(k => `<option value="${k}" ${G.q === k ? "selected" : ""}>${esc(tt("jr_quality"))}: ${esc(tt("jr_q_" + k))}</option>`).join("")}</select></div>
   <p class="jr-near" id="jr-near" hidden>${esc(tt(touch ? "jr_near_touch" : "jr_near"))}</p>
   <p class="jr-help mono">${esc(tt(touch ? "jr_help_touch" : "jr_help_keys"))}</p>
   <span class="jr-recon mono">${esc(tt("jr_recon"))}<em> · ${esc(tt("jr_recon_note"))}</em></span>
   <div class="jr-touch"><div class="jr-joy" id="jr-joy" aria-label="${esc(tt("jr_drive_title"))}"><i></i></div><div class="jr-tbtn"><button data-a="interact" class="pri">${esc(tt("jr_interact"))}</button><button data-joyb="brake">${esc(tt("jr_brake"))}</button><button data-a="zin" aria-label="${esc(tt("jr_zoom_in"))}">+</button><button data-a="zout" aria-label="${esc(tt("jr_zoom_out"))}">−</button></div></div>
   <div class="jr-card-ov" id="jr-cardov" hidden></div>
   <div class="jr-pause" id="jr-pause" hidden><div><h3>${esc(tt("jr_paused"))}</h3><button class="btn primary" data-a="resume">${esc(tt("jr_resume"))}</button><button class="btn" data-a="reset">${esc(tt("jr_reset"))}</button><a class="btn" href="#journey/opportunity/4">${esc(tt("jr_next"))}: ${esc(tt("jr_c4"))}</a><a class="btn" href="#journey">${esc(tt("jr_back_select"))}</a></div></div></div>`;
}
function bindHud() {
  const cv = G.canvas; if (!cv || cv._jrBound) { bindJoy(); return; } cv._jrBound = true;
  let drag = null; const ptrs = new Map(); let pinch = 0;
  cv.addEventListener("pointerdown", e => { try { cv.setPointerCapture(e.pointerId); } catch (x) {} ptrs.set(e.pointerId, [e.clientX, e.clientY]); drag = [e.clientX, e.clientY]; if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; pinch = Math.hypot(a[0] - b[0], a[1] - b[1]); } });
  cv.addEventListener("pointermove", e => { if (!ptrs.has(e.pointerId)) return; const pr = ptrs.get(e.pointerId); const dx = e.clientX - pr[0], dy = e.clientY - pr[1]; ptrs.set(e.pointerId, [e.clientX, e.clientY]);
    if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; const d = Math.hypot(a[0] - b[0], a[1] - b[1]); if (pinch) G.dist = Math.min(26, Math.max(3, G.dist * pinch / d)); pinch = d; return; }
    G.yaw -= dx * 0.006; G.pitch = Math.max(G.cam === 1 ? -0.6 : 0.05, Math.min(1.25, G.pitch + dy * 0.004)); });
  const up = e => { ptrs.delete(e.pointerId); if (ptrs.size < 2) pinch = 0; };
  cv.addEventListener("pointerup", up); cv.addEventListener("pointercancel", up);
  cv.addEventListener("wheel", e => { e.preventDefault(); G.dist = Math.min(26, Math.max(3, G.dist * (1 + Math.sign(e.deltaY) * 0.1))); }, {passive:false});
  bindJoy();
}
function bindJoy() {
  const j = $("#jr-joy"); if (!j) return; const knob = j.querySelector("i"); let id = null;
  const set = e => { const r = j.getBoundingClientRect(); let x = (e.clientX - r.left - r.width / 2) / (r.width / 2), y = (e.clientY - r.top - r.height / 2) / (r.height / 2); const l = Math.hypot(x, y); if (l > 1) { x /= l; y /= l; } G.joy = {x, y}; knob.style.transform = `translate(${x * 34}px,${y * 34}px)`; };
  j.addEventListener("pointerdown", e => { id = e.pointerId; try { j.setPointerCapture(id); } catch (x) {} set(e); });
  j.addEventListener("pointermove", e => { if (e.pointerId === id) set(e); });
  const end = e => { if (e.pointerId !== id) return; id = null; G.joy = {x:0, y:0}; knob.style.transform = ""; };
  j.addEventListener("pointerup", end); j.addEventListener("pointercancel", end);
}
function joyButton(k) { if (k === "brake" && G.state) G.state.v = 0; }
function onKey(e) {
  if (!alive || st.view !== "story" || st.ch !== 3 || !G.active || G.mode !== "drive") return;
  if (/INPUT|SELECT|TEXTAREA/.test(document.activeElement && document.activeElement.tagName)) return;
  const k = e.key.toLowerCase();
  if (k === "escape") { e.preventDefault(); if (!$("#jr-cardov").hidden) closeCard(); else setPause(!G.paused); return; }
  if (G.paused) return;
  if (["w","a","s","d","arrowup","arrowdown","arrowleft","arrowright"," "].includes(k)) e.preventDefault();
  G.keys[k] = true;
  if (k === "c" && !e.repeat) cycleCam(); else if (k === "r" && !e.repeat) resetRover(); else if (k === "e" && !e.repeat) interact();
}
function onKeyUp(e) { G.keys[e.key.toLowerCase()] = false; }
function cycleCam() { G.cam = (G.cam + 1) % 3; G.pitch = G.cam === 1 ? 0.05 : 0.32; G.yaw = 0; if (G.cam === 2 && G.state) G.free = new THREE.Vector3(G.state.x, heightAt(G.state.x, G.state.z) + 0.8, G.state.z); const n = $("#jr-camn"); if (n) n.textContent = tt(["jr_cam_chase","jr_cam_front","jr_cam_free"][G.cam]); }
function resetRover() { if (!G.state) return; Object.assign(G.state, {x:0, z:0, h:0, v:0}); G.yaw = 0; placeRover(0); }
function setPause(p) { G.paused = p; const el = $("#jr-pause"); if (el) el.hidden = !p; if (!p) { G.last = performance.now(); if (!G.raf && G.active) loop(); G.canvas && G.canvas.focus({preventScroll:true}); } }
function setQuality(q) { if (!Q[q]) return; G.q = q; C.store.set("jr_q", q); if (G.mode === "drive") loadModel().then(buildDrive); else if (G.mode === "studio") initStudio(); }
function nearest() { const s = G.state; let best = null; for (const o of OBJ) { if (!o.p || s.done[o.k]) continue; const d = Math.hypot(s.x - o.p[0], s.z - o.p[1]); if (o.k === 1) continue; if (d < 3.2 && (!best || d < best.d)) best = {o, d}; } return best; }
function interact() { const s = G.state; if (!s || G.paused) return; if (!s.done[5] && OBJ[4].p && Math.hypot(s.x - OBJ[4].p[0], s.z - OBJ[4].p[1]) < 3.2) { complete(5); return; } const n = nearest(); if (n) complete(n.o.k); }
function complete(k) {
  const s = G.state; if (s.done[k]) return; s.done[k] = true;
  const li = host.querySelector(`.jr-obj li[data-o="${k}"]`); if (li) li.classList.add("done");
  if (k === 1) { updHud(); return; }
  const imgK = {2:"burns", 3:"berries", 4:null, 5:"eagle"}[k];
  const ov = $("#jr-cardov"); ov.innerHTML = `<div class="jr-icard" role="dialog" aria-label="${esc(tt("jr_i" + k + "_t"))}">${imgK ? `<img src="${img(imgK)}" alt="">` : ""}<div><span class="mono">✓ ${esc(tt("jr_o" + k))}</span><h3>${esc(tt("jr_i" + k + "_t"))}</h3><p>${esc(tt("jr_i" + k + "_b"))}</p>${imgK ? `<a class="mono" href="${esc(J.IMG[imgK].page)}" target="_blank" rel="noopener">${esc(J.IMG[imgK].f)} · ${esc(J.IMG[imgK].credit)} ↗</a>` : `<a class="mono" href="${esc(J.SRC.meteorite[1])}" target="_blank" rel="noopener">NASA/JPL ↗</a>`}<button class="btn small primary" data-a="closecard">${esc(tt("jr_continue"))}</button></div></div>`;
  ov.hidden = false; G.paused = true; updHud();
}
function closeCard() { const ov = $("#jr-cardov"); if (ov) ov.hidden = true; G.paused = false; G.last = performance.now(); if (!G.raf && G.active) loop(); }
function placeRover(dt) {
  const s = G.state, r = G.rover; if (!r) return;
  const fx = Math.sin(s.h), fz = Math.cos(s.h), rx = Math.cos(s.h), rz = -Math.sin(s.h);
  const hF = heightAt(s.x + fx * 0.7, s.z + fz * 0.7), hB = heightAt(s.x - fx * 0.7, s.z - fz * 0.7), hL = heightAt(s.x - rx * 0.6, s.z - rz * 0.6), hR = heightAt(s.x + rx * 0.6, s.z + rz * 0.6);
  const onPad = Math.hypot(s.x, s.z) < 1.0 ? 0.12 : 0;
  const y = (hF + hB + hL + hR) / 4 + onPad, pitch = Math.atan2(hB - hF, 1.4), roll = Math.atan2(hR - hL, 1.2);
  r.position.set(s.x, y, s.z); r.rotation.set(0, 0, 0); r.rotation.order = "YXZ"; r.rotation.y = s.h; r.rotation.x = pitch; r.rotation.z = roll;
  s.tilt = Math.max(Math.abs(pitch), Math.abs(roll)) * 57.3; s.y = y;
}
function driveFrame(dt) {
  const s = G.state, k = G.keys;
  let th = (k.w || k.arrowup ? 1 : 0) - (k.s || k.arrowdown ? 1 : 0) - G.joy.y, steer = (k.a || k.arrowleft ? 1 : 0) - (k.d || k.arrowright ? 1 : 0) - G.joy.x;
  th = Math.max(-1, Math.min(1, th)); steer = Math.max(-1, Math.min(1, steer));
  const brake = k[" "]; const VMAX = 2.2;
  /* uphill slows the rover (simplified) */
  const ahead = heightAt(s.x + Math.sin(s.h) * 1.2, s.z + Math.cos(s.h) * 1.2) - heightAt(s.x, s.z), slope = Math.atan2(ahead, 1.2);
  const lim = Math.max(0.15, 1 - Math.max(0, slope * Math.sign(s.v || th)) * 2.2);
  const target = brake ? 0 : th * VMAX * lim;
  s.v += (target - s.v) * Math.min(1, dt * (brake ? 6 : 1.6));
  s.h += steer * dt * (Math.abs(s.v) < 0.15 ? 0.9 : 0.75) * (s.v < -0.05 ? -1 : 1);
  const dx = Math.sin(s.h) * s.v * dt, dz = Math.cos(s.h) * s.v * dt;
  s.x = Math.max(-140, Math.min(140, s.x + dx)); s.z = Math.max(-140, Math.min(140, s.z + dz));
  const moved = Math.hypot(dx, dz); s.odo += moved; s.power = Math.max(0, s.power - moved * 0.9 - dt * 0.15);
  placeRover(dt);
  if (!s.done[1] && Math.hypot(s.x, s.z) > 4) complete(1);
  /* camera */
  const cam = G.camera, rp = G.rover.position;
  if (G.cam === 0) { const a = s.h + Math.PI + G.yaw; const d = G.dist; const want = new THREE.Vector3(rp.x + Math.sin(a) * d * Math.cos(G.pitch), rp.y + 0.9 + d * Math.sin(G.pitch), rp.z + Math.cos(a) * d * Math.cos(G.pitch));
    want.y = Math.max(want.y, heightAt(want.x, want.z) + 0.4); cam.position.lerp(want, Math.min(1, dt * 5)); cam.lookAt(rp.x, rp.y + 0.8, rp.z); }
  else if (G.cam === 1) { const m = new THREE.Vector3(-0.05, 1.5, 0.45).applyEuler(G.rover.rotation).add(rp); cam.position.copy(m); const a = s.h + G.yaw; cam.lookAt(m.x + Math.sin(a) * 10, m.y - 1.2 + Math.sin(-G.pitch + 0.05) * 6, m.z + Math.cos(a) * 10); }
  else { const c = G.free || rp; const a = G.yaw + 0.8, d = G.dist * 1.6; cam.position.set(c.x + Math.sin(a) * d * Math.cos(G.pitch), c.y + 1 + d * Math.sin(G.pitch), c.z + Math.cos(a) * d * Math.cos(G.pitch)); cam.position.y = Math.max(cam.position.y, heightAt(cam.position.x, cam.position.z) + 0.5); cam.lookAt(c.x, c.y + 0.5, c.z); }
  if (G.sun) { G.sun.position.set(rp.x - 30, rp.y + 55, rp.z - 40); G.sun.target.position.copy(rp); }
  /* beacon on next objective */
  const next = OBJ.find(o => !s.done[o.k] && o.p);
  if (next && G.beacon) { const by = heightAt(next.p[0], next.p[1]); G.beacon.visible = G.beam.visible = true; G.beacon.position.set(next.p[0], by + 2.3 + Math.sin(performance.now() / 500) * 0.15, next.p[1]); G.beacon.rotation.y += dt; G.beam.position.set(next.p[0], by + 3, next.p[1]); }
  else if (G.beacon) G.beacon.visible = G.beam.visible = false;
  updHud();
}
let hudT = 0;
function updHud(force) {
  const s = G.state; if (!s) return; const now = performance.now(); if (!force && now - hudT < 150) return; hudT = now;
  const set = (id, v) => { const el = host && host.querySelector(id); if (el) el.textContent = v; };
  set("#jr-pw", fmtN(s.power) + " Wh"); set("#jr-od", fmtN(s.odo, 1) + " m"); set("#jr-sp", fmtN(Math.abs(s.v) * 100 / 40, 1) + " cm/s ×40"); set("#jr-tl", fmtN(s.tilt || 0, 1) + "°");
  const n = nearest(), near = host && host.querySelector("#jr-near"); const atRim = !s.done[5] && OBJ[4].p && Math.hypot(s.x - OBJ[4].p[0], s.z - OBJ[4].p[1]) < 3.2;
  if (near) near.hidden = !(n || atRim);
  const all = OBJ.every(o => s.done[o.k]); const dn = host && host.querySelector(".jr-objdone"); if (dn) dn.hidden = !all;
  OBJ.forEach(o => { const li = host && host.querySelector(`.jr-obj li[data-o="${o.k}"]`); if (li) { li.classList.toggle("done", !!s.done[o.k]); li.classList.toggle("cur", !s.done[o.k] && o === OBJ.find(x => !s.done[x.k])); } });
}
function loop() {
  if (!G.active || !G.renderer) { G.raf = 0; return; }
  G.raf = requestAnimationFrame(loop);
  const now = performance.now(), dt = Math.min(0.05, (now - (G.last || now)) / 1000); G.last = now;
  if (G.mode === "drive") { if (G.paused) { cancelAnimationFrame(G.raf); G.raf = 0; G.renderer.render(G.scene, G.camera); return; } driveFrame(dt); }
  else if (G.mode === "studio") studioFrame();
  G.renderer.render(G.scene, G.camera);
}
return {start, stop, nav, _g:G, _interact:() => interact(), _complete:k => complete(k), _st:st, _place:(x, z) => { if (G.state) { G.state.x = x; G.state.z = z; placeRover(0); updHud(true); } }, _obj:OBJ};
})();
