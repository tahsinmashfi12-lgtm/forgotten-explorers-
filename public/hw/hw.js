/* Forgotten Explorers — Moon & Mars Hardware Locator ("Humanity's Footprints Beyond Earth").
   Data: hw-data.js (sources, missions, hardware, events) + hw-geo.js (routes, regional maps, images).
   Globe: three.js r128 + OrbitControls. Regional maps: NASA Trek equirectangular mosaics with an SVG overlay. */
(function () {
"use strict";
let C, t, esc, host, R = null, raf = 0, alive = false, ro = null;
const $ = (s, r) => (r || host).querySelector(s), $$ = (s, r) => [...(r || host).querySelectorAll(s)];
const RAD = Math.PI / 180, KM = {moon:1737.4, mars:3389.5};
const CATS = {moon:["lander","rover","instrument","retroreflector","robotic","impact"], mars:["lander","rover","helicopter","landing-system","impact"]};
const COL = {lander:"#F2D27A", rover:"#6FD3A5", instrument:"#8EC5F5", retroreflector:"#FFF27A", robotic:"#C6A2FF", impact:"#F07A5C", helicopter:"#7FE3F0", "landing-system":"#F5A35C"};
const RCOL = {m20:"#6FD3A5", msl:"#F2D27A", heli:"#7FE3F0"};
const TONE = {successful:"g","partially-successful":"a",failed:"r",ongoing:"b",unknown:"n",present:"g",destroyed:"r",impacted:"r","not-located":"a",uncertain:"a",
  operational:"b",inactive:"n","no-longer-communicating":"a","not-applicable":"n",precise:"g",measured:"g",approximate:"a","landing-site-reference":"a","landing-ellipse":"a"};
const RING = new Set(["landing-site-reference","approximate","landing-ellipse","unknown"]);
const MUSEUM = {"a11-lm":"lm","a12-lm":"lm","a14-lm":"lm","a15-lm":"lm","a16-lm":"lm","a17-lm":"lm","viking-1":"viking","viking-2":"viking","perseverance":"perseverance","perseverance-landing":"perseverance","ingenuity":"ingenuity",
  "a13-sivb":"saturnv","a14-sivb":"saturnv","a15-sivb":"saturnv","a16-sivb":"saturnv","a17-sivb":"saturnv"};
const kk = v => String(v || "unknown").replace(/-/g, "_");
const lab = (p, v) => t("hw_" + p + "_" + kk(v));
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
let D, MIS, ITEM, FE;
const S = {dest:"moon", sel:null, q:"", cats:new Set(), mission:"", agency:"", outcome:"", phys:"", op:"", acc:"", layers:{impact:true, approx:true, routes:true, labels:false, grid:false},
  tm:false, year:2026, reg:null, side:false, intro:true, tab:"ov", sheet:null, cmp:["curiosity","perseverance"], modal:null};

/* ── data helpers ── */
const outcomeOf = i => i.outcome || MIS[i.mission]?.outcome || "unknown";
const agencyOf = i => MIS[i.mission]?.agency || "";
const yearOf = i => i.date ? +String(i.date).slice(0, 4) : null;
const feOf = i => FE[i.id] ? i.id : MIS[i.mission]?.fe && FE[MIS[i.mission].fe] ? MIS[i.mission].fe : null;
const imgOf = k => !k ? null : window.HW_IMG?.[k] ? {thumb:window.HW_IMG[k].path.replace("hw/img/", "hw/img/t/"), full:window.HW_IMG[k].path, title:window.HW_IMG[k].title, id:window.HW_IMG[k].id, page:window.HW_IMG[k].page, who:window.HW_IMG[k].photographer || "NASA"}
  : window.FE_MEDIA?.[k] ? {thumb:"img/t/" + k + ".webp", full:"img/" + k + ".webp", title:FE_MEDIA[k].title, id:FE_MEDIA[k].id, page:FE_MEDIA[k].page, who:FE_MEDIA[k].photographer || "NASA"} : null;
function hay(i) { const m = MIS[i.mission] || {}; return [i.name, i._name, i.id, m.name, m.agency, m.country, lab("c", i.cat), i.cat, i.what, i.happened].join(" ").toLowerCase(); }
function matchQ(i) { const q = S.q.trim().toLowerCase(); if (!q) return true; const h = hay(i); return q.split(/\s+/).every(w => h.includes(w)); }
function filtered(dest) {
  dest = dest || S.dest;
  return D.filter(i => i.dest === dest && (!S.cats.size || S.cats.has(i.cat)) && (!S.mission || i.mission === S.mission) && (!S.agency || agencyOf(i) === S.agency)
    && (!S.outcome || outcomeOf(i) === S.outcome) && (!S.phys || i.phys === S.phys) && (!S.op || i.op === S.op) && (!S.acc || i.acc === S.acc)
    && (S.layers.impact || i.cat !== "impact") && (S.layers.approx || !RING.has(i.acc)) && matchQ(i) && (!S.tm || (yearOf(i) !== null && yearOf(i) <= S.year)));
}
function fmtLat(v) { return Math.abs(v).toFixed(Math.abs(v) < 100 ? 4 : 3) + "° " + (v >= 0 ? "N" : "S"); }
function fmtLon(v) { return Math.abs(v).toFixed(4) + "° " + (v >= 0 ? "E" : "W"); }
const fmtLL = (lat, lon) => fmtLat(lat) + ", " + fmtLon(lon);
const nc = () => `<span class="hw-nc">${esc(t("hw_nc"))}</span>`;
const val = v => v === null || v === undefined || v === "" ? nc() : esc(v);
/* records are in English; NOVA can translate one record on request (cached per language, labelled as machine translation) */
const curLang = () => (C.lang ? C.lang() : "en");
const ENG_K = ["design","mass","power","mobility","instruments","comms","challenges"];
function hwSrc(i) { const m = MIS[i.mission] || {}, e = i.eng || {}; const o = {what:i.what, why:i.why || m.objective, happened:i.happened, dist:i.dist, objective:m.objective, discoveries:m.discoveries, end:m.end, significance:m.significance};
  for (const k of ENG_K) o["eng_" + k] = e[k]; for (const k in o) if (o[k] === null || o[k] === undefined || o[k] === "") delete o[k]; return o; }
function hwTr(i) { if (curLang() === "en") return {}; try { const o = JSON.parse(C.store.get("trh:" + curLang() + ":" + i.id) || "null"); return o && typeof o === "object" ? o : {}; } catch (e) { return {}; } }
async function translateItem(i) {
  const box = $("#hw-trbox"); if (box) box.innerHTML = `<span>${esc(t("translating"))}</span>`;
  const sample = C.getSample ? await C.getSample() : null;
  if (!sample) { if (box) box.innerHTML = `<span>${esc(t("nova_offline"))}</span>`; return; }
  const L = {en:"English",bn:"Bengali",es:"Spanish",fr:"French",ar:"Arabic"}[curLang()];
  try {
    const out = await sample.json(`Translate the string values of this JSON object about "${i._name || i.name}" (a human-made object on the ${i.dest === "mars" ? "Mars" : "Moon"}) into ${L} for a space-science museum website. Keep official mission, spacecraft, instrument and agency names and acronyms exactly as written, and keep numbers, units, coordinates and dates unchanged. Keep the same keys and array lengths. Return only the JSON object.\n\n${JSON.stringify(hwSrc(i))}`, {modelTier:"quick"});
    if (!out || typeof out !== "object") throw new Error("bad translation");
    C.store.set("trh:" + curLang() + ":" + i.id, JSON.stringify(out)); if (S.sel === i.id) renderDetail();
  } catch (e) { if (box) box.innerHTML = `<span>${esc(e && e.code === "not_granted" ? t("nova_offline") : t("nova_err"))}</span>`; }
}
const badge = (axis, v) => `<span class="hw-badge t-${TONE[v] || "n"}"><small>${esc(t("hw_" + axis))}</small>${esc(lab(axis === "acc" ? "a" : axis === "phys" ? "p" : axis === "outcome" ? "o" : "op", v))}</span>`;
const dot = c => `<i class="hw-dot" style="--c:${COL[c]}"></i>`;
function srcList(keys) { return `<ul class="hw-src">${[...new Set(keys || [])].map(k => window.HW_SRC[k]).filter(Boolean).map(s => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.title)} ↗</a> <span>${esc(s.org)}</span></li>`).join("")}</ul>`; }

/* ── geometry ── */
function ll2v(lat, lon, r) { r = r || 1; const a = lat * RAD, b = lon * RAD; return new THREE.Vector3(r * Math.cos(a) * Math.cos(b), r * Math.sin(a), -r * Math.cos(a) * Math.sin(b)); }
function v2ll(v) { const n = v.clone().normalize(); return [Math.asin(clamp(n.y, -1, 1)) / RAD, Math.atan2(-n.z, n.x) / RAD]; }

/* ── START ── */
function start(el, ctx) {
  C = ctx; t = ctx.t; esc = ctx.esc; host = el; alive = true;
  D = window.HW_ITEMS; MIS = Object.fromEntries(window.HW_MISSIONS.map(m => [m.id, m])); ITEM = Object.fromEntries(D.map(i => [i.id, i]));
  FE = Object.fromEntries((window.FE_MISSIONS || []).map(m => [m.id, m]));
  if (ctx.focus && ITEM[ctx.focus]) { S.dest = ITEM[ctx.focus].dest; S.intro = false; }
  else if (ctx.dest) { S.dest = ctx.dest; S.intro = false; }
  else S.intro = true;
  S.reg = null; S.modal = null; S.sheet = null; S.sel = null;
  host.innerHTML = shell();
  renderAll();
  const ok = initGL();
  if (!ok) $("#hw-stage").insertAdjacentHTML("afterbegin", `<div class="hw-nogl"><p>${esc(t("mu_nogl"))}</p></div>`);
  bind();
  if (ctx.focus && ITEM[ctx.focus]) setTimeout(() => select(ctx.focus, {fly:true}), 60);
  else if (!S.intro) setView("home", true);
}
function stop() {
  alive = false; cancelAnimationFrame(raf); if (ro) { ro.disconnect(); ro = null; }
  if (tmTimer) { clearInterval(tmTimer); tmTimer = 0; }
  document.removeEventListener("keydown", onKey, true);
  if (R) { try { R.scene.traverse(o => { o.geometry?.dispose?.(); if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => { m.map?.dispose?.(); m.dispose(); }); }); Object.values(R.tex).forEach(x => x.dispose()); R.controls.dispose(); R.renderer.dispose(); R.renderer.forceContextLoss?.(); } catch (e) {} R = null; }
  host = null;
}

/* ── shell ── */
function shell() {
  return `<div class="hw-top">
   <button class="hw-exit" data-a="exit" aria-label="${esc(t("hw_exit"))}"><span aria-hidden="true">←</span> <b>${esc(t("hw_exit"))}</b></button>
   <div class="hw-brand"><b>${esc(t("nav_hardware"))}</b><span>${esc(t("hw_title"))}</span></div>
   <div class="hw-seg" role="group" aria-label="${esc(t("hw_choose"))}" id="hw-seg"></div>
   <div class="hw-tools" id="hw-tools"></div>
  </div>
  <div class="hw-body">
   <aside class="hw-side" id="hw-side" aria-label="${esc(t("hw_filters"))}"></aside>
   <div class="hw-stage" id="hw-stage">
    <div class="hw-labels" id="hw-labels" aria-hidden="true"></div>
    <div class="hw-views" id="hw-views"></div>
    <div class="hw-readout mono" dir="ltr" id="hw-readout" aria-live="off"></div>
    <div class="hw-legend" id="hw-legend"></div>
    <div class="hw-tip" id="hw-tip" hidden></div>
    <div id="hw-regwrap"></div>
    <div id="hw-timewrap"></div>
   </div>
   <aside class="hw-detail" id="hw-detail" hidden aria-live="polite"></aside>
  </div>
  <button class="hw-sidebtn" data-a="side" id="hw-sidebtn"></button>
  <div class="hw-modal" id="hw-modal" hidden></div>
  <div class="hw-intro" id="hw-intro" ${S.intro ? "" : "hidden"}></div>`;
}
function renderAll() {
  $("#hw-seg").innerHTML = ["moon","mars"].map(d => `<button data-dest="${d}" aria-pressed="${S.dest === d}">${esc(t("hw_" + d + "_s"))}</button>`).join("");
  $("#hw-tools").innerHTML = `<button data-a="time" aria-pressed="${S.tm}">${clockIcon}<b>${esc(t("hw_time"))}</b></button><button data-a="compare">${cmpIcon}<b>${esc(t("hw_compare"))}</b></button><button data-a="left">${boxIcon}<b>${esc(t("hw_left"))}</b></button><a href="#${S.dest}" class="hw-wl" data-a="world">${esc(t("nav_" + S.dest))} ↗</a>`;
  $(".hw-brand span").textContent = t("hw_title");
  $("#hw-sidebtn").textContent = t("hw_filters");
  renderSide(); renderViews(); renderLegend();
  if (S.intro) renderIntro();
  if (S.sel || S.sheet) renderDetail();
  if (S.tm) renderTime();
  if (S.reg) renderRegion();
  if (S.modal) openModal(S.modal);
  host.classList.toggle("dest-mars", S.dest === "mars");
}
const clockIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3.5 2"/></svg>';
const cmpIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 7h11M11 3l4 4-4 4M20 17H9m4-4-4 4 4 4"/></svg>';
const boxIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3 8l9-4 9 4-9 4-9-4zm0 0v8l9 4 9-4V8M12 12v8"/></svg>';

/* ── intro ── */
function renderIntro() {
  const card = d => { const all = D.filter(i => i.dest === d), mapped = all.filter(i => i.loc); const img = d === "moon" ? imgOf("lrv15") : imgOf("heli_delta");
    return `<button class="hw-icard ${d}" data-pick="${d}"><span class="ph"><img src="${img.thumb}" alt="" loading="eager"></span><span class="tx"><span class="mono">${esc(t("hw_counts", {n:all.length, m:mapped.length}))}</span><b>${esc(t("hw_" + d))}</b><span class="d">${esc(t("hw_" + d + "_desc"))}</span><em>${esc(t("hw_" + d + "_ex"))}</em><span class="go">${esc(t("hw_explore_" + d))} →</span></span></button>`; };
  $("#hw-intro").innerHTML = `<div class="in"><span class="mono k">FORGOTTEN EXPLORERS · ${esc(t("nav_hardware").toUpperCase())}</span><h1>${esc(t("hw_title"))}</h1><p class="sub">${esc(t("hw_sub"))}</p><p class="kick">${esc(t("hw_intro_k"))}</p>
   <div class="cards">${card("moon")}${card("mars")}</div><p class="promise">${esc(t("hw_accuracy_promise"))}</p>
   <p class="hw-icred">${esc(imgOf("lrv15").id)} · NASA · <a href="${esc(imgOf("lrv15").page)}" target="_blank" rel="noopener">${esc(t("source_page"))}</a> &nbsp;·&nbsp; ${esc(imgOf("heli_delta").id)} · NASA/JPL-Caltech · <a href="${esc(imgOf("heli_delta").page)}" target="_blank" rel="noopener">${esc(t("source_page"))}</a></p></div>`;
}
function closeIntro(d) {
  S.intro = false; const el = $("#hw-intro"); el.classList.add("out"); setTimeout(() => { if (el) el.hidden = true; }, C.reduced ? 0 : 700);
  if (R) R.controls.autoRotate = false;
  setDest(d, true);
}

/* ── side panel ── */
function renderSide() {
  const items = D.filter(i => i.dest === S.dest);
  const missions = [...new Set(items.map(i => i.mission))].map(id => MIS[id]).filter(Boolean).sort((a, b) => (a.launch || "").localeCompare(b.launch || ""));
  const agencies = [...new Set(missions.map(m => m.agency))].sort();
  const sel = (id, label, opts, cur, fmt) => `<label class="hw-f"><span>${esc(label)}</span><select data-f="${id}"><option value="">${esc(t("hw_all"))}</option>${opts.map(o => `<option value="${esc(o)}" ${cur === o ? "selected" : ""}>${esc(fmt(o))}</option>`).join("")}</select></label>`;
  const cats = CATS[S.dest].filter(c => items.some(i => i.cat === c));
  $("#hw-side").innerHTML = `<div class="hw-sideh"><span class="mono">${esc(t("hw_filters"))}</span><button class="hw-x" data-a="side" aria-label="${esc(t("hw_close"))}">×</button></div>
   <div class="hw-q"><label class="sr" for="hw-q">${esc(t("hw_search"))}</label><input id="hw-q" type="search" autocomplete="off" placeholder="${esc(t("hw_search"))}" value="${esc(S.q)}"></div>
   <div class="hw-chips" role="group" aria-label="${esc(t("hw_category"))}">${cats.map(c => `<button data-cat="${c}" aria-pressed="${S.cats.has(c)}">${dot(c)}${esc(lab("c", c))} <small>${items.filter(i => i.cat === c).length}</small></button>`).join("")}</div>
   <details class="hw-more" ${S.mission || S.agency || S.outcome || S.phys || S.op || S.acc ? "open" : ""}><summary>${esc(t("filters"))}</summary>
    ${sel("mission", t("hw_mission"), missions.map(m => m.id), S.mission, id => MIS[id].name)}
    ${sel("agency", t("hw_agency"), agencies, S.agency, x => x)}
    ${sel("outcome", t("hw_outcome"), ["successful","partially-successful","failed","ongoing","unknown"], S.outcome, v => lab("o", v))}
    ${sel("phys", t("hw_phys"), ["present","destroyed","impacted","not-located","uncertain"], S.phys, v => lab("p", v))}
    ${sel("op", t("hw_op"), ["operational","inactive","no-longer-communicating","not-applicable","unknown"], S.op, v => lab("op", v))}
    ${sel("acc", t("hw_acc"), ["precise","measured","approximate","landing-site-reference","landing-ellipse","unknown"], S.acc, v => lab("a", v))}
   </details>
   <details class="hw-more"><summary>${esc(t("hw_layers"))}</summary><div class="hw-layers">
    ${["impact","approx","routes","labels","grid"].map(k => `<label><input type="checkbox" data-layer="${k}" ${S.layers[k] ? "checked" : ""}> ${esc(t("hw_l_" + k))}</label>`).join("")}</div></details>
   <div class="hw-listh"><span class="mono" id="hw-count"></span><button class="hw-link" data-a="reset">${esc(t("hw_reset"))}</button></div>
   <ul class="hw-list" id="hw-list"></ul>`;
  renderList();
}
function renderList() {
  const r = filtered().slice().sort((a, b) => (a.date || "9999").localeCompare(b.date || "9999"));
  const mapped = r.filter(i => i.loc), un = r.filter(i => !i.loc);
  const li = i => `<li><button data-item="${i.id}" aria-current="${S.sel === i.id}">${dot(i.cat)}<span><b>${esc(i.name)}</b><small>${esc(MIS[i.mission]?.name || "")} · ${i.date ? esc(String(i.date).slice(0, 4)) : "—"}${RING.has(i.acc) ? " · " + esc(lab("a", i.acc)) : ""}</small></span></button></li>`;
  $("#hw-count").textContent = t("hw_n_shown", {n:r.length});
  $("#hw-list").innerHTML = mapped.map(li).join("") + (un.length ? `<li class="hw-sep">${esc(t("hw_unmapped"))}</li>` + un.map(li).join("") : "") || `<li class="hw-sep">${esc(t("no_results"))}</li>`;
  if (R) { buildMarkers(); buildRoutes(); }
}
function renderViews() {
  const regs = Object.keys(window.HW_REG).filter(k => D.some(i => i.dest === S.dest && i.reg === k));
  const regName = k => [...new Set(D.filter(i => i.reg === k).map(i => MIS[i.mission]?.name))].slice(0, 2).join(" · ");
  $("#hw-views").innerHTML = `<div class="hw-vb">${S.dest === "moon" ? `<button data-view="near">${esc(t("hw_near"))}</button><button data-view="far">${esc(t("hw_far"))}</button><button data-view="spole">${esc(t("hw_spole"))}</button>`
     : `<button data-view="home" aria-pressed="${!S.reg}">${esc(t("hw_global"))}</button><button data-view="regional" aria-pressed="${!!S.reg}">${esc(t("hw_regional"))}</button><button data-view="npole">${esc(t("hw_npole"))}</button>`}</div>
   <label class="hw-regsel"><span class="sr">${esc(t("hw_reg_maps"))}</span><select id="hw-regsel"><option value="">${esc(t("hw_reg_maps"))}…</option>${regs.map(k => `<option value="${k}" ${S.reg?.key === k ? "selected" : ""}>${esc(regName(k))}</option>`).join("")}</select></label>
   <div class="hw-vb z"><button data-view="in" aria-label="+">+</button><button data-view="out" aria-label="−">−</button><button data-view="home" aria-label="${esc(t("hw_reset_view"))}" title="${esc(t("hw_reset_view"))}">⟲</button></div>`;
}
function renderLegend() {
  const cats = CATS[S.dest].filter(c => D.some(i => i.dest === S.dest && i.cat === c));
  const tex = S.dest === "moon" ? ["SVS 4720 · LROC", "https://svs.gsfc.nasa.gov/4720/"] : ["Viking MDIM 2.1 · Mars Trek", "https://trek.nasa.gov/mars/"];
  $("#hw-legend").innerHTML = `<details><summary class="mono">${esc(t("hw_legend"))}</summary><ul>${cats.map(c => `<li>${dot(c)}${esc(lab("c", c))}</li>`).join("")}
   ${S.dest === "mars" ? `<li><i class="hw-ln" style="--c:${RCOL.m20}"></i>${esc(t("hw_l_routes"))}</li>` : ""}
   <li><i class="hw-dot" style="--c:#ddd"></i>${esc(t("hw_filled"))}</li><li><i class="hw-dot ring" style="--c:#ddd"></i>${esc(t("hw_ring"))}</li></ul>
   <p>${esc(t("hw_frame"))}. ${esc(t("hw_globe_credit"))}: <a href="${tex[1]}" target="_blank" rel="noopener">${esc(tex[0])}</a></p></details>`;
}

/* ── GL ── */
function initGL() {
  if (!window.THREE || !THREE.OrbitControls) return false;
  const stage = $("#hw-stage"), canvas = document.createElement("canvas");
  canvas.className = "hw-gl"; canvas.tabIndex = 0; canvas.setAttribute("aria-label", t("hw_" + S.dest)); stage.prepend(canvas);
  let renderer; try { renderer = new THREE.WebGLRenderer({canvas, antialias:true, powerPreference:"high-performance"}); } catch (e) { canvas.remove(); return false; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)); renderer.outputEncoding = THREE.sRGBEncoding; renderer.setClearColor(0x020308, 1);
  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(38, 1, 0.002, 400);
  const controls = new THREE.OrbitControls(camera, canvas);
  Object.assign(controls, {enableDamping:true, dampingFactor:.08, rotateSpeed:.45, zoomSpeed:.8, panSpeed:.4, minDistance:1.04, maxDistance:8, screenSpacePanning:true});
  scene.add(new THREE.AmbientLight(0xffffff, .5));
  const dl = new THREE.DirectionalLight(0xffffff, .75); dl.position.set(-1.2, .9, 1); camera.add(dl); scene.add(camera);
  const globe = new THREE.Mesh(new THREE.SphereGeometry(1, 192, 96), new THREE.MeshPhongMaterial({color:0x777777, shininess:2, specular:0x111111}));
  scene.add(globe);
  const atm = new THREE.Mesh(new THREE.SphereGeometry(1.025, 64, 32), new THREE.MeshBasicMaterial({color:0xd8875a, transparent:true, opacity:.07, side:THREE.BackSide, depthWrite:false}));
  atm.visible = false; scene.add(atm);
  const sg = new THREE.BufferGeometry(), sp = [];
  for (let i = 0; i < 2600; i++) { const v = new THREE.Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1).normalize().multiplyScalar(120 + Math.random() * 60); sp.push(v.x, v.y, v.z); }
  sg.setAttribute("position", new THREE.Float32BufferAttribute(sp, 3));
  scene.add(new THREE.Points(sg, new THREE.PointsMaterial({color:0xaab6c8, size:.6, sizeAttenuation:true, transparent:true, opacity:.8, depthWrite:false})));
  const grid = new THREE.Group(), markers = new THREE.Group(), routes = new THREE.Group();
  scene.add(grid, markers, routes);
  R = {renderer, scene, camera, controls, globe, atm, grid, markers, routes, tex:{}, sprites:[], labels:new Map(), anim:null, loader:new THREE.TextureLoader(), maps:{}, canvas};
  buildGrid();
  camera.position.copy(ll2v(8, S.dest === "moon" ? 10 : 100).multiplyScalar(S.intro ? 3.6 : 3.1));
  controls.autoRotate = S.intro && !C.reduced; controls.autoRotateSpeed = .35;
  loadGlobe(S.dest);
  const resize = () => { if (!R) return; const w = stage.clientWidth, h = stage.clientHeight; if (!w || !h) return; renderer.setSize(w, h, false); camera.aspect = w / h; if (R.off) camera.setViewOffset(w, h, R.off, 0, w, h); camera.updateProjectionMatrix(); };
  ro = new ResizeObserver(resize); ro.observe(stage); resize();
  bindGL();
  buildMarkers(); buildRoutes();
  raf = requestAnimationFrame(frame);
  return true;
}
function loadGlobe(d) {
  R.atm.visible = d === "mars";
  const url = "ss/tex/" + d + ".jpg";
  const apply = tx => { if (!R || S.dest !== d) return; R.globe.material.map = tx; R.globe.material.color.set(0xffffff); R.globe.material.needsUpdate = true; };
  if (R.maps[d]) return apply(R.maps[d]);
  R.globe.material.map = null; R.globe.material.color.set(d === "moon" ? 0x8a8a8a : 0x9a5a3a); R.globe.material.needsUpdate = true;
  R.loader.load(url, tx => { tx.encoding = THREE.sRGBEncoding; tx.anisotropy = Math.min(8, R.renderer.capabilities.getMaxAnisotropy()); R.maps[d] = tx; apply(tx); });
}
function buildGrid() {
  const m = new THREE.LineBasicMaterial({color:0x9aa9ba, transparent:true, opacity:.22, depthWrite:false});
  for (let lat = -60; lat <= 60; lat += 30) { const p = []; for (let lon = -180; lon <= 180; lon += 3) p.push(ll2v(lat, lon, 1.0008)); R.grid.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(p), m)); }
  for (let lon = -180; lon < 180; lon += 30) { const p = []; for (let lat = -90; lat <= 90; lat += 3) p.push(ll2v(lat, lon, 1.0008)); R.grid.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(p), lon === 0 ? new THREE.LineBasicMaterial({color:0xd9a35b, transparent:true, opacity:.4}) : m)); }
  R.grid.visible = S.layers.grid;
}
function mtex(col, style) {
  const key = col + style; if (R.tex[key]) return R.tex[key];
  const c = document.createElement("canvas"); c.width = c.height = 64; const g = c.getContext("2d"); g.translate(32, 32);
  const shape = (r) => { g.beginPath(); if (style.startsWith("dia")) { g.moveTo(0, -r); g.lineTo(r, 0); g.lineTo(0, r); g.lineTo(-r, 0); g.closePath(); } else g.arc(0, 0, r, 0, Math.PI * 2); };
  if (style === "sel") { g.beginPath(); g.arc(0, 0, 27, 0, 7); g.lineWidth = 4; g.strokeStyle = "#ffffff"; g.stroke(); g.beginPath(); g.arc(0, 0, 30, 0, 7); g.lineWidth = 2; g.strokeStyle = "rgba(0,0,0,.6)"; g.stroke(); }
  else if (style.endsWith("ring")) { shape(16); g.lineWidth = 10; g.strokeStyle = "rgba(2,3,8,.85)"; g.stroke(); g.lineWidth = 5; g.strokeStyle = col; g.stroke(); g.beginPath(); g.arc(0, 0, 3.5, 0, 7); g.fillStyle = col; g.fill(); }
  else { shape(style.startsWith("dia") ? 19 : 16); g.fillStyle = col; g.fill(); g.lineWidth = 5; g.strokeStyle = "rgba(2,3,8,.9)"; g.stroke(); }
  const tx = new THREE.CanvasTexture(c); tx.encoding = THREE.sRGBEncoding; R.tex[key] = tx; return tx;
}
function clearGroup(g) { while (g.children.length) { const o = g.children.pop(); o.geometry?.dispose?.(); o.material?.dispose?.(); } }
function buildMarkers() {
  if (!R) return;
  clearGroup(R.markers); R.sprites = [];
  const list = filtered().filter(i => i.loc);
  for (const i of list) {
    const style = (i.cat === "impact" ? "dia" : "dot") + (RING.has(i.acc) ? "ring" : "");
    const s = new THREE.Sprite(new THREE.SpriteMaterial({map:mtex(COL[i.cat], style), sizeAttenuation:false, depthTest:true, depthWrite:false, transparent:true}));
    s.position.copy(ll2v(i.loc[0], i.loc[1], 1.003)); const sc = S.sel === i.id ? .036 : .026; s.scale.set(sc, sc, 1); s.renderOrder = 2; s.userData.item = i;
    R.markers.add(s); R.sprites.push(s);
  }
  const si = S.sel && ITEM[S.sel];
  if (si && si.loc && si.dest === S.dest && list.includes(si)) { const s = new THREE.Sprite(new THREE.SpriteMaterial({map:mtex("#fff", "sel"), sizeAttenuation:false, depthTest:true, depthWrite:false, transparent:true})); s.position.copy(ll2v(si.loc[0], si.loc[1], 1.003)); s.scale.set(.062, .062, 1); s.renderOrder = 3; R.markers.add(s); R.selSprite = s; }
  else R.selSprite = null;
  syncLabels(list);
}
function buildRoutes() {
  if (!R) return; clearGroup(R.routes);
  if (!S.layers.routes || S.dest !== "mars") return;
  const vis = new Set(filtered().map(i => i.route).filter(Boolean));
  for (const k of vis) {
    const rd = window.HW_ROUTEDATA[k]; if (!rd) continue;
    const pts = rd.pts.filter((p, j) => j % 2 === 0 || j === rd.pts.length - 1).map(p => ll2v(p[1], p[0], 1.0006));
    R.routes.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({color:RCOL[k], transparent:true, opacity:.95})));
  }
}
function syncLabels(list) {
  const box = $("#hw-labels"); if (!box) return;
  box.innerHTML = ""; R.labels.clear();
  const pri = {lander:0, rover:1, helicopter:1, retroreflector:2, robotic:2, instrument:3, "landing-system":3, impact:4};
  list.slice().sort((a, b) => (S.sel === b.id) - (S.sel === a.id) || pri[a.cat] - pri[b.cat]).forEach(i => { const el = document.createElement("span"); el.textContent = i.name.replace(/ \(.*\)$/, ""); el.className = S.sel === i.id ? "sel" : ""; box.appendChild(el); R.labels.set(i.id, {el, i, p:ll2v(i.loc[0], i.loc[1], 1.003)}); });
}
function project(p) { const v = p.clone().project(R.camera); const c = R.renderer.domElement; return [(v.x + 1) / 2 * c.clientWidth, (1 - v.y) / 2 * c.clientHeight, v.z]; }
function facing(p) { return p.dot(R.camera.position.clone().sub(p)) > 0; }
function updateLabels() {
  const placed = [], show = S.layers.labels;
  for (const [id, o] of R.labels) {
    const want = show || id === S.sel || id === R.hover;
    if (!want || !facing(o.p) || S.reg) { o.el.style.display = "none"; continue; }
    const [x, y] = project(o.p); const w = o.el.offsetWidth || o.i.name.length * 6.2, h = 16;
    const r = [x + 12, y - 8, x + 12 + w, y + 8];
    if (id !== S.sel && id !== R.hover && placed.some(q => !(r[2] < q[0] || r[0] > q[2] || r[3] < q[1] || r[1] > q[3]))) { o.el.style.display = "none"; continue; }
    placed.push(r); o.el.style.display = ""; o.el.style.transform = `translate(${x + 12}px,${y - 8}px)`;
  }
}
function pick(cx, cy) {
  const rc = R.canvas.getBoundingClientRect(), x = cx - rc.left, y = cy - rc.top;
  return R.sprites.map(s => { const p = s.position; if (!facing(p)) return null; const [sx, sy] = project(p); const d = Math.hypot(sx - x, sy - y); return d < 14 ? [d, s.userData.item, sx, sy] : null; }).filter(Boolean).sort((a, b) => a[0] - b[0]);
}
function surfaceLL(cx, cy) {
  const rc = R.canvas.getBoundingClientRect(); const ray = new THREE.Raycaster();
  ray.setFromCamera({x:(cx - rc.left) / rc.width * 2 - 1, y:-(cy - rc.top) / rc.height * 2 + 1}, R.camera);
  const hit = ray.intersectObject(R.globe)[0]; return hit ? v2ll(hit.point) : null;
}
let lastFrame = 0;
function frame(now) {
  if (!alive || !R) return; raf = requestAnimationFrame(frame);
  if (document.hidden) return;
  if (R.anim) stepAnim(now);
  const d = R.camera.position.distanceTo(R.controls.target);
  R.controls.rotateSpeed = clamp(.5 * (d - 1) / 2.1, .012, .55); R.controls.panSpeed = clamp(.4 * (d - 1) / 2.1, .01, .4);
  const wide = host.classList.contains("detail-open") && !S.reg && window.innerWidth > 760, want = (wide ? (window.innerWidth > 1100 ? 200 : 180) : 0) * (document.documentElement.dir === "rtl" ? -1 : 1);
  R.off = R.off || 0; if (Math.abs(R.off - want) > .5) { R.off += (want - R.off) * .12; if (Math.abs(R.off - want) < .5) R.off = want; const c = R.renderer.domElement, w = c.clientWidth, h = c.clientHeight; if (R.off) R.camera.setViewOffset(w, h, R.off, 0, w, h); else R.camera.clearViewOffset(); R.camera.updateProjectionMatrix(); }
  R.controls.update(); R.renderer.render(R.scene, R.camera);
  if (now - lastFrame > 30) { updateLabels(); lastFrame = now; }
}
function flyTo(dir, dist, dur, cb) {
  if (!R) { cb && cb(); return; }
  const c = R.controls, from = R.camera.position.clone().sub(c.target);
  R.anim = {t0:performance.now(), dur:C.reduced ? 1 : (dur || 1200), fromDir:from.clone().normalize(), toDir:dir.clone().normalize(), fromD:from.length(), toD:dist, fromT:c.target.clone(), cb};
  c.autoRotate = false;
}
function stepAnim(now) {
  const a = R.anim, k0 = clamp((now - a.t0) / a.dur, 0, 1), k = k0 < .5 ? 4 * k0 * k0 * k0 : 1 - Math.pow(-2 * k0 + 2, 3) / 2;
  const q = new THREE.Quaternion().setFromUnitVectors(a.fromDir, a.toDir), qi = new THREE.Quaternion().slerp(q, k);
  const dir = a.fromDir.clone().applyQuaternion(qi);
  const D0 = a.fromD + (a.toD - a.fromD) * k, lift = Math.sin(Math.PI * k) * Math.min(.6, a.fromDir.angleTo(a.toDir) * .35);
  R.controls.target.copy(a.fromT.clone().multiplyScalar(1 - k));
  R.camera.position.copy(R.controls.target).add(dir.multiplyScalar(D0 + lift));
  if (k0 >= 1) { const cb = a.cb; R.anim = null; cb && cb(); }
}
function setView(v, instant) {
  if (!R) return;
  const dist = () => R.camera.position.distanceTo(R.controls.target);
  const dirNow = () => R.camera.position.clone().sub(R.controls.target).normalize();
  const dur = instant ? 1 : 1200;
  if (v === "near") flyTo(ll2v(4, 0), 3, dur);
  else if (v === "far") flyTo(ll2v(4, 180), 3, dur);
  else if (v === "spole") flyTo(ll2v(-68, 10), 2.4, dur);
  else if (v === "npole") flyTo(ll2v(68, 100), 2.6, dur);
  else if (v === "home") { if (S.reg) closeRegion(); flyTo(ll2v(8, S.dest === "moon" ? 10 : 100), 3.1, dur); }
  else if (v === "in") flyTo(dirNow(), Math.max(R.controls.minDistance, 1 + (dist() - 1) * .6), 450);
  else if (v === "out") flyTo(dirNow(), Math.min(R.controls.maxDistance, 1 + (dist() - 1) * 1.6), 450);
}
function bindGL() {
  const cv = R.canvas; let down = null;
  cv.addEventListener("pointerdown", e => { down = [e.clientX, e.clientY]; R.controls.autoRotate = false; R.anim = null; });
  cv.addEventListener("pointerup", e => {
    if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 5) { down = null; return; } down = null;
    const hits = pick(e.clientX, e.clientY);
    if (!hits.length) { hideTip(); return; }
    const near = hits.filter(h => Math.hypot(h[2] - hits[0][2], h[3] - hits[0][3]) < 6);
    if (near.length > 1) showChooser(near.map(h => h[1]), e.clientX, e.clientY); else { hideTip(); select(hits[0][1].id, {fly:true}); }
  });
  cv.addEventListener("pointermove", e => {
    const ll = surfaceLL(e.clientX, e.clientY);
    $("#hw-readout").textContent = ll ? t("hw_cursor") + " · " + fmtLL(ll[0], ll[1]) : "";
    if (e.buttons) return;
    const hits = pick(e.clientX, e.clientY); const h = hits[0] ? hits[0][1].id : null;
    if (h !== R.hover) { R.hover = h; cv.style.cursor = h ? "pointer" : ""; }
  });
  cv.addEventListener("pointerleave", () => { R.hover = null; $("#hw-readout").textContent = ""; });
  cv.addEventListener("keydown", e => {
    const k = e.key; if (!/^(Arrow(Left|Right|Up|Down)|\+|-|=)$/.test(k)) return; e.preventDefault();
    const c = R.controls, off = R.camera.position.clone().sub(c.target);
    if (k === "ArrowLeft" || k === "ArrowRight") off.applyAxisAngle(new THREE.Vector3(0, 1, 0), (k === "ArrowLeft" ? -1 : 1) * .12 * clamp(off.length() - 1, .05, 1));
    else if (k === "ArrowUp" || k === "ArrowDown") { const ax = new THREE.Vector3().crossVectors(off, new THREE.Vector3(0, 1, 0)).normalize(); const n = off.clone().applyAxisAngle(ax, (k === "ArrowUp" ? 1 : -1) * .1 * clamp(off.length() - 1, .05, 1)); if (Math.abs(n.clone().normalize().y) < .97) off.copy(n); }
    else { setView(k === "-" ? "out" : "in"); return; }
    R.camera.position.copy(c.target).add(off);
  });
}
function showChooser(items, x, y) {
  const tip = $("#hw-tip"), rc = $("#hw-stage").getBoundingClientRect();
  tip.innerHTML = `<b class="mono">${esc(t("hw_several"))}</b>${items.map(i => `<button data-item="${i.id}">${dot(i.cat)}${esc(i.name)}</button>`).join("")}`;
  tip.hidden = false; tip.style.left = clamp(x - rc.left + 10, 8, rc.width - 280) + "px"; tip.style.top = clamp(y - rc.top + 10, 8, rc.height - 40 - items.length * 34) + "px";
}
function hideTip() { const t0 = $("#hw-tip"); if (t0) t0.hidden = true; }

/* ── selection & detail ── */
function select(id, {fly = true} = {}) {
  const i = ITEM[id]; if (!i) return;
  if (i.dest !== S.dest) setDest(i.dest, false);
  S.sel = id; S.sheet = null; S.tab = "ov"; hideTip();
  try { history.replaceState(null, "", "#hw-" + id); } catch (e) {}
  if (S.reg && !(i.loc && inBox(i.loc, window.HW_REG[S.reg.key].bbox))) closeRegion();
  renderDetail(); $$("#hw-list [data-item]").forEach(b => b.setAttribute("aria-current", b.dataset.item === id));
  buildMarkers();
  if (S.reg) drawRegion();
  else if (fly && i.loc && R) flyTo(ll2v(i.loc[0], i.loc[1]), clamp(R.camera.position.distanceTo(R.controls.target), 1.45, 2.1), 1300);
  if (window.matchMedia("(max-width:760px)").matches) toggleSide(false);
}
function deselect() { S.sel = null; S.sheet = null; $("#hw-detail").hidden = true; host.classList.remove("detail-open"); buildMarkers(); if (S.reg) drawRegion(); try { history.replaceState(null, "", "#hardware-" + S.dest); } catch (e) {} }
function renderDetail() {
  const el = $("#hw-detail"); el.hidden = false; host.classList.add("detail-open");
  if (S.sheet) { el.innerHTML = missionSheet(S.sheet); return; }
  const i = ITEM[S.sel], m = MIS[i.mission] || {}, img = imgOf(i.img), out = outcomeOf(i), fe = feOf(i), mus = MUSEUM[i.id] && (window.FE_MODELS || []).find(x => x.id === MUSEUM[i.id]);
  const sibs = D.filter(x => x.mission === i.mission && x.id !== i.id), routeData = i.route && window.HW_ROUTEDATA[i.route];
  const tabs = [["ov", "hw_overview"], ["eng", "hw_eng"], ["rec", "hw_record"]];
  const coordBox = `<div class="hw-coord"><span class="mono">${esc(t("hw_coords"))}</span><b class="mono" dir="ltr">${i.loc ? esc(fmtLL(i.loc[0], i.loc[1])) : esc(t("hw_unmapped"))}</b><small>${esc(t("hw_loctype"))}: ${esc(lab("lt", i.locType))} · ${esc(t("hw_acc"))}: ${esc(lab("a", i.acc))}</small></div>`;
  const X = hwTr(i), Lx = (k, en) => (typeof X[k] === "string" && X[k].trim()) ? X[k] : en, trd = Object.keys(X).length > 0;
  const e = Object.fromEntries(ENG_K.map(k => [k, Lx("eng_" + k, (i.eng || {})[k])]));
  const mDisc = Array.isArray(X.discoveries) && m.discoveries && X.discoveries.length === m.discoveries.length ? X.discoveries : m.discoveries;
  const trBox = curLang() === "en" ? "" : `<div class="notice hw-note" id="hw-trbox">${trd ? `<span>${esc(t("translated_note"))}</span>` : `<span>${esc(t("rec_english"))}</span> <button class="hw-btn" data-a="trhw">${esc(t("translate_rec"))}</button>`}</div>`;
  const ov = `<dl class="hw-dl"><div><dt>${esc(t("hw_what"))}</dt><dd>${val(Lx("what", i.what))}</dd></div><div><dt>${esc(t("hw_why"))}</dt><dd>${val(Lx("why", i.why || m.objective))}</dd></div><div><dt>${esc(t("hw_happened"))}</dt><dd>${val(Lx("happened", i.happened))}</dd></div>
    ${i.dist ? `<div><dt>${esc(t("hw_dist"))}</dt><dd>${esc(Lx("dist", i.dist))}</dd></div>` : ""}</dl>${coordBox}
    ${i.cat === "rover" || i.cat === "helicopter" ? `<p class="hw-note">${routeData ? esc(t("hw_route_note")) + " " + esc(t("hw_data_to", {s:routeData.pts[routeData.pts.length - 1][i.route === "heli" ? 3 : 2], d:window.HW_ROUTEDATA.retrieved})) : esc(t("hw_route_none"))}</p>` : ""}`;
  const eng = `<dl class="hw-dl two">${["design","mass","power","mobility","instruments","comms","challenges"].map(k => `<div><dt>${esc(t("hw_" + k))}</dt><dd>${val(e[k])}</dd></div>`).join("")}</dl>
    <dl class="hw-dl"><div><dt>${esc(t("hw_objective"))}</dt><dd>${val(Lx("objective", m.objective))}</dd></div><div><dt>${esc(t("hw_discoveries"))}</dt><dd>${mDisc && mDisc.length ? `<ul>${mDisc.map(x => `<li>${esc(x)}</li>`).join("")}</ul>` : nc()}</dd></div>
    <div><dt>${esc(t("hw_end"))}</dt><dd>${val(Lx("end", m.end))}</dd></div><div><dt>${esc(t("hw_significance"))}</dt><dd>${val(Lx("significance", m.significance))}</dd></div></dl>`;
  const fd = d => d ? esc(C.fmtDate(d)) : nc();
  const rows = [["hw_mission", esc(m.name || "")], ["hw_agency", val(m.agency)], ["hw_country", val(m.country)], ["hw_category", esc(lab("c", i.cat))], ["hw_dest", esc(t("hw_" + i.dest + "_s"))],
    ["hw_launch", fd(m.launch)], ["hw_landing", fd(m.landing)], ["hw_hw_date", fd(i.date)], ["hw_last", fd(m.lastContact)],
    ["hw_coords", i.loc ? `<span class="mono" dir="ltr">${esc(fmtLL(i.loc[0], i.loc[1]))}</span>` : `<span class="hw-nc">${esc(t("hw_na"))}</span>`], ["hw_loctype", esc(lab("lt", i.locType))], ["hw_acc", esc(lab("a", i.acc))],
    ["hw_outcome", esc(lab("o", out))], ["hw_phys", esc(lab("p", i.phys))], ["hw_op", esc(lab("op", i.op))],
    ["hw_what", val(Lx("what", i.what))], ["hw_why", val(Lx("why", i.why || m.objective))], ["hw_happened", val(Lx("happened", i.happened))], ["hw_dist", i.cat === "rover" || i.cat === "helicopter" ? val(Lx("dist", i.dist)) : esc(t("hw_op_not_applicable"))],
    ["hw_region", i.reg ? esc(window.HW_REG[i.reg].layer.split("/").pop()) : `<span class="hw-nc">${esc(t("hw_na"))}</span>`], ["hw_verified", esc(C.fmtDate(window.HW_VERIFIED))]];
  const rec = `<dl class="hw-dl rec">${rows.map(([k, v], n) => `<div><dt><span class="mono">${String(n + 1).padStart(2, "0")}</span> ${esc(t(k))}</dt><dd>${v}</dd></div>`).join("")}</dl>`;
  el.innerHTML = `<div class="hw-dh"><span class="hw-cat">${dot(i.cat)}${esc(lab("c", i.cat))}</span><button class="hw-x" data-a="deselect" aria-label="${esc(t("hw_close"))}">×</button></div>
   ${img ? `<figure class="hw-fig"><img src="${img.thumb}" alt="${esc(img.title)}" loading="lazy"><figcaption>${esc(img.title)} · ${esc(img.id)} · ${esc(img.who)} · <a href="${esc(img.page)}" target="_blank" rel="noopener">${esc(t("source_page"))}</a></figcaption></figure>` : ""}
   <h2>${esc(i.name)}</h2><p class="hw-sub">${esc(m.name || "")} · ${esc(m.agency || "")}${i.date ? " · " + esc(C.fmtDate(i.date)) : ""}</p>
   <div class="hw-badges">${badge("outcome", out)}${badge("phys", i.phys)}${badge("op", i.op)}${badge("acc", i.acc)}</div>
   <div class="hw-acts">${i.reg && i.loc ? `<button class="hw-btn pri" data-a="zih">${esc(t("hw_zih"))}</button>` : ""}${routeData ? `<button class="hw-btn" data-a="track">${esc(t("hw_track"))}</button>` : ""}
    <button class="hw-btn" data-a="mission">${esc(t("hw_explore_mission"))}</button>${mus ? `<button class="hw-btn" data-a="museum" data-model="${mus.id}" title="${esc(t("hw_museum_note"))}">${esc(t("hw_museum"))}</button>` : ""}
    ${window.HW_COMPARE[i.id] ? `<button class="hw-btn" data-a="cmpthis">${esc(t("hw_compare"))}</button>` : ""}<button class="hw-btn" data-a="ask">✦ ${esc(t("hw_ask"))}</button></div>
   ${mus ? `<p class="hw-note">${esc(mus.name)}: ${esc(t("hw_museum_note"))}</p>` : ""}
   ${trBox}
   <div class="hw-tabs" role="tablist">${tabs.map(([k, l]) => `<button role="tab" data-tab="${k}" aria-selected="${S.tab === k}">${esc(t(l))}</button>`).join("")}</div>
   <div class="hw-tabp">${S.tab === "eng" ? eng : S.tab === "rec" ? rec : ov}</div>
   <h3>${esc(t("hw_sources"))}</h3>${srcList([...(i.src || []), ...(m.src || [])])}
   ${fe ? `<p><a class="hw-link" href="#m-${fe}">${esc(t("hw_full_page"))}: ${esc(FE[fe].name)} →</a></p>` : ""}
   ${sibs.length ? `<h3>${esc(t("hw_more_from"))}</h3><div class="hw-sibs">${sibs.map(x => `<button data-item="${x.id}">${dot(x.cat)}${esc(x.name)}</button>`).join("")}</div>` : ""}
   <p class="hw-ver">${esc(t("hw_verified"))}: ${esc(C.fmtDate(window.HW_VERIFIED))}</p>`;
  el.scrollTop = 0;
}
function missionSheet(mid) {
  const m = MIS[mid], its = D.filter(i => i.mission === mid), fe = m.fe && FE[m.fe] ? m.fe : null, fd = d => d ? esc(C.fmtDate(d)) : nc();
  return `<div class="hw-dh"><button class="hw-link" data-a="sheetback">← ${esc(t("hw_back"))}</button><button class="hw-x" data-a="deselect" aria-label="${esc(t("hw_close"))}">×</button></div>
   <span class="mono hw-k">${esc(t("hw_mission_sheet"))}</span><h2>${esc(m.name)}</h2><p class="hw-sub">${esc(m.agency)} · ${esc(m.country)}</p>
   <div class="hw-badges">${badge("outcome", m.outcome || "unknown")}</div>
   <dl class="hw-dl two"><div><dt>${esc(t("hw_launch"))}</dt><dd>${fd(m.launch)}</dd></div><div><dt>${esc(t("hw_landing"))}</dt><dd>${fd(m.landing)}</dd></div><div><dt>${esc(t("hw_last"))}</dt><dd>${fd(m.lastContact)}</dd></div><div><dt>${esc(t("hw_dest"))}</dt><dd>${esc(t("hw_" + m.dest + "_s"))}</dd></div></dl>
   <dl class="hw-dl"><div><dt>${esc(t("hw_objective"))}</dt><dd>${val(m.objective)}</dd></div><div><dt>${esc(t("hw_discoveries"))}</dt><dd>${m.discoveries && m.discoveries.length ? `<ul>${m.discoveries.map(x => `<li>${esc(x)}</li>`).join("")}</ul>` : nc()}</dd></div><div><dt>${esc(t("hw_end"))}</dt><dd>${val(m.end)}</dd></div><div><dt>${esc(t("hw_significance"))}</dt><dd>${val(m.significance)}</dd></div></dl>
   <h3>${esc(t("hw_more_from"))}</h3><div class="hw-sibs">${its.map(x => `<button data-item="${x.id}">${dot(x.cat)}${esc(x.name)}</button>`).join("")}</div>
   ${fe ? `<p><a class="hw-btn pri" href="#m-${fe}">${esc(t("hw_full_page"))} →</a></p>` : ""}
   <h3>${esc(t("hw_sources"))}</h3>${srcList(m.src)}`;
}

/* ── destination ── */
function setDest(d, fly) {
  if (d !== S.dest) {
    S.dest = d; S.cats.clear(); S.mission = ""; S.agency = ""; if (S.reg) closeRegion(true);
    if (S.sel && ITEM[S.sel]?.dest !== d) { S.sel = null; S.sheet = null; $("#hw-detail").hidden = true; host.classList.remove("detail-open"); }
    if (R) { loadGlobe(d); R.canvas.setAttribute("aria-label", t("hw_" + d)); }
    renderAll(); if (S.tm) renderTime();
  }
  try { history.replaceState(null, "", S.sel ? "#hw-" + S.sel : "#hardware-" + d); } catch (e) {}
  if (fly !== false && R) { R.camera.position.copy(ll2v(8, d === "moon" ? 10 : 100).multiplyScalar(5)); setView("home"); }
}

/* ── ZOOM INTO HISTORY: regional maps ── */
const inBox = (ll, b) => ll[1] >= b[0] && ll[1] <= b[2] && ll[0] >= b[1] && ll[0] <= b[3];
function openRegion(key, track) {
  const reg = window.HW_REG[key]; if (!reg) return;
  const [lon0, lat0, lon1, lat1] = reg.bbox;
  S.reg = {key, s:1, tx:0, ty:0, track:track || null, idx:null};
  const go = () => { if (S.reg && S.reg.key === key) { renderRegion(); renderViews(); } };
  if (R && !C.reduced) flyTo(ll2v((lat0 + lat1) / 2, (lon0 + lon1) / 2), 1.16, 1300, go); else go();
}
function closeRegion(silent) {
  if (tPlay) { cancelAnimationFrame(tPlay); tPlay = 0; }
  S.reg = null; const w = $("#hw-regwrap"); if (w) w.innerHTML = ""; host.classList.remove("reg-open");
  if (!silent) { renderViews(); if (R) flyTo(R.camera.position.clone().sub(R.controls.target), 2.2, 900); }
}
function regTracks(key) { const b = window.HW_REG[key].bbox; return Object.keys(window.HW_ROUTEDATA).filter(k => window.HW_ROUTEDATA[k].pts && window.HW_ROUTEDATA[k].pts.some(p => inBox([p[1], p[0]], b))); }
function regItems(key) { const b = window.HW_REG[key].bbox; return D.filter(i => i.dest === S.dest && i.loc && inBox(i.loc, b)); }
function renderRegion() {
  const key = S.reg.key, reg = window.HW_REG[key], items = regItems(key), tracks = regTracks(key);
  if (tracks.length && !S.reg.track) S.reg.track = tracks[0];
  const names = [...new Set(D.filter(i => i.reg === key).map(i => MIS[i.mission]?.name))].join(" · ");
  const isMars = S.dest === "mars", layer = reg.layer.split("/").pop();
  host.classList.add("reg-open");
  $("#hw-regwrap").innerHTML = `<div class="hw-reg" role="region" aria-label="${esc(t("hw_zih"))}">
   <div class="hw-rhead"><div><span class="mono">${esc(t("hw_zih").toUpperCase())}</span><b>${esc(names)}</b></div><button class="hw-btn" data-a="regback">← ${esc(t("hw_back_globe"))}</button></div>
   <div class="hw-rv" id="hw-rv" tabindex="0" aria-label="${esc(names)}"><div class="hw-rin" id="hw-rin" style="width:${reg.w}px;height:${reg.h}px"><img src="hw/reg/${key}.jpg" width="${reg.w}" height="${reg.h}" alt="" draggable="false"><svg id="hw-rsvg" viewBox="0 0 ${reg.w} ${reg.h}" width="${reg.w}" height="${reg.h}"></svg></div></div>
   <div class="hw-rctl"><button data-rz="in" aria-label="+">+</button><button data-rz="out" aria-label="−">−</button><button data-rz="fit" aria-label="${esc(t("hw_reset_view"))}">⤢</button></div>
   <div class="hw-rinfo mono" dir="ltr"><span id="hw-rc"></span><span class="hw-scale"><i id="hw-sbar"></i><em id="hw-stxt"></em></span></div>
   <div class="hw-rlist"><span class="mono">${esc(t("hw_in_region"))}</span>${items.map(i => `<button data-item="${i.id}" aria-current="${S.sel === i.id}">${dot(i.cat)}${esc(i.name.replace(/ \(.*\)$/, ""))}</button>`).join("")}</div>
   ${tracks.length ? `<div class="hw-track"><div class="row"><b>${esc(t("hw_track"))}</b><select id="hw-tsel">${tracks.map(k => `<option value="${k}" ${S.reg.track === k ? "selected" : ""}>${esc(window.HW_ROUTEDATA[k].name || k)}</option>`).join("")}</select><button class="hw-btn" data-a="tplay" id="hw-tplay">▶ ${esc(t("hw_play"))}</button></div>
     <input type="range" id="hw-tr" min="0" value="0" aria-label="${esc(t("hw_track"))}"><div class="mono hw-tread" dir="ltr" id="hw-tread"></div>
     <p class="hw-note">${esc(t("hw_route_note"))} <a href="" id="hw-tsrc" target="_blank" rel="noopener">JPL MMGIS ↗</a> <span id="hw-tto"></span></p></div>` : ""}
   <p class="hw-rcred">${isMars ? "NASA Mars Trek" : "NASA Moon Trek"} · ${esc(layer)} · ${esc(t("hw_proj_note"))}</p></div>`;
  bindRegion(); fitRegion(true); if (tracks.length) setTrack(S.reg.track, true);
}
function fitRegion(focus) {
  const rv = $("#hw-rv"), reg = window.HW_REG[S.reg.key]; if (!rv) return;
  const W = rv.clientWidth, H = rv.clientHeight, s = Math.min(W / reg.w, H / reg.h);
  S.reg.fit = s; S.reg.s = s; S.reg.tx = (W - reg.w * s) / 2; S.reg.ty = (H - reg.h * s) / 2;
  const i = focus && S.sel && ITEM[S.sel]; if (i && i.loc && inBox(i.loc, reg.bbox)) { const [x, y] = ll2px(i.loc[0], i.loc[1]); const s2 = s * 1.6; S.reg.s = s2; S.reg.tx = W / 2 - x * s2; S.reg.ty = H / 2 - y * s2; }
  applyRegion();
}
function ll2px(lat, lon) { const reg = window.HW_REG[S.reg.key], [lon0, lat0, lon1, lat1] = reg.bbox; return [(lon - lon0) / (lon1 - lon0) * reg.w, (lat1 - lat) / (lat1 - lat0) * reg.h]; }
function px2ll(x, y) { const reg = window.HW_REG[S.reg.key], [lon0, lat0, lon1, lat1] = reg.bbox; return [lat1 - y / reg.h * (lat1 - lat0), lon0 + x / reg.w * (lon1 - lon0)]; }
let regRaf = 0;
function applyRegion() {
  const r = S.reg, rin = $("#hw-rin"), rv = $("#hw-rv"); if (!rin) return;
  const reg = window.HW_REG[r.key], W = rv.clientWidth, H = rv.clientHeight, iw = reg.w * r.s, ih = reg.h * r.s;
  r.tx = iw <= W ? (W - iw) / 2 : clamp(r.tx, W - iw, 0); r.ty = ih <= H ? (H - ih) / 2 : clamp(r.ty, H - ih, 0);
  rin.style.transform = `translate(${r.tx}px,${r.ty}px) scale(${r.s})`;
  cancelAnimationFrame(regRaf); regRaf = requestAnimationFrame(() => { drawRegion(); drawScale(); });
}
function drawScale() {
  const reg = window.HW_REG[S.reg.key], [, lat0, , lat1] = reg.bbox;
  const mPerImg = (lat1 - lat0) / reg.h * RAD * KM[S.dest] * 1000, mPerScr = mPerImg / S.reg.s;
  const target = 110 * mPerScr, p = Math.pow(10, Math.floor(Math.log10(target))), nice = [1, 2, 5, 10].map(x => x * p).filter(x => x <= target).pop() || p;
  $("#hw-sbar").style.width = (nice / mPerScr) + "px"; $("#hw-stxt").textContent = t("hw_scale_ns") + " · " + (nice >= 1000 ? (nice / 1000) + " km" : nice + " m");
}
function drawRegion() {
  const svg = $("#hw-rsvg"); if (!svg || !S.reg) return;
  const s = S.reg.s, items = regItems(S.reg.key), out = [];
  const tr = S.reg.track && window.HW_ROUTEDATA[S.reg.track];
  for (const k of regTracks(S.reg.key)) {
    const rd = window.HW_ROUTEDATA[k], pts = rd.pts.map(p => ll2px(p[1], p[0]).map(v => v.toFixed(1)).join(",")).join(" ");
    out.push(`<polyline points="${pts}" fill="none" stroke="#000" stroke-opacity=".5" stroke-width="${4 / s}" stroke-linejoin="round"/><polyline points="${pts}" fill="none" stroke="${RCOL[k]}" stroke-opacity="${k === S.reg.track ? .45 : .8}" stroke-width="${2 / s}" stroke-linejoin="round" ${k === "heli" ? `stroke-dasharray="${6 / s} ${4 / s}"` : ""}/>`);
  }
  if (tr) {
    const n = S.reg.idx ?? tr.pts.length - 1, done = tr.pts.slice(0, n + 1).map(p => ll2px(p[1], p[0]).map(v => v.toFixed(1)).join(",")).join(" ");
    out.push(`<polyline points="${done}" fill="none" stroke="#000" stroke-width="${6 / s}" stroke-linejoin="round" stroke-opacity=".7"/><polyline points="${done}" fill="none" stroke="${RCOL[S.reg.track]}" stroke-width="${3.5 / s}" stroke-linejoin="round"/>`);
    const [ax, ay] = ll2px(tr.pts[0][1], tr.pts[0][0]), [bx, by] = ll2px(tr.pts[n][1], tr.pts[n][0]);
    out.push(`<g><rect x="${ax - 5 / s}" y="${ay - 5 / s}" width="${10 / s}" height="${10 / s}" fill="#fff" stroke="#000" stroke-width="${1.5 / s}"/><text x="${ax + 9 / s}" y="${ay - 7 / s}" font-size="${11 / s}" class="hw-rt">${esc(t("hw_landing_pt"))}</text></g>`);
    S.reg.cur = [bx, by, (S.reg.track === "heli" ? t("hw_flight") + " " + tr.pts[n][2] : t("hw_sol") + " " + tr.pts[n][2])];
  }
  const placed = [];
  items.slice().sort((a, b) => (a.id === S.sel) - (b.id === S.sel)).forEach(i => {
    const [x, y] = ll2px(i.loc[0], i.loc[1]), r = (i.id === S.sel ? 9 : 7) / s, ring = RING.has(i.acc), c = COL[i.cat];
    const shape = i.cat === "impact" ? `<path d="M${x} ${y - r * 1.2}L${x + r * 1.2} ${y}L${x} ${y + r * 1.2}L${x - r * 1.2} ${y}Z"` : `<circle cx="${x}" cy="${y}" r="${r}"`;
    out.push(`<g class="hw-rm" data-item="${i.id}" tabindex="0" role="button" aria-label="${esc(i.name)}">${i.id === S.sel ? `<circle cx="${x}" cy="${y}" r="${r * 1.9}" fill="none" stroke="#fff" stroke-width="${2 / s}"/>` : ""}${shape} fill="${ring ? "rgba(2,3,8,.55)" : c}" stroke="${ring ? c : "#020308"}" stroke-width="${(ring ? 3 : 1.6) / s}"/>`
      + (ring && i.acc !== "unknown" ? "" : "") + `</g>`);
    const lx = x + r + 4 / s, ly = y + 4 / s, w = i.name.length * 6 / s;
    if (i.id === S.sel || !placed.some(q => Math.abs(q[1] - ly) < 13 / s && lx < q[0] + q[2] && q[0] < lx + w)) { placed.push([lx, ly, w]); out.push(`<text x="${lx}" y="${ly}" font-size="${(i.id === S.sel ? 13 : 11) / s}" class="hw-rt${i.id === S.sel ? " sel" : ""}">${esc(i.name.replace(/ \(.*\)$/, ""))}</text>`); }
  });
  if (tr && S.reg.cur) { const [bx, by, l] = S.reg.cur; out.push(`<circle cx="${bx}" cy="${by}" r="${11 / s}" fill="rgba(0,0,0,.35)" stroke="#fff" stroke-width="${3 / s}"/><circle cx="${bx}" cy="${by}" r="${4.5 / s}" fill="${RCOL[S.reg.track]}" stroke="#000" stroke-width="${1 / s}"/><text x="${bx + 15 / s}" y="${by + 5 / s}" font-size="${14 / s}" class="hw-rt sel">${esc(l)}</text>`); }
  svg.innerHTML = out.join("");
}
let tPlay = 0;
function setTrack(k, init) {
  const rd = window.HW_ROUTEDATA[k]; S.reg.track = k; const n = rd.pts.length;
  const r = $("#hw-tr"); r.max = n - 1; if (init || S.reg.idx === null || S.reg.idx > n - 1) S.reg.idx = n - 1; r.value = S.reg.idx;
  $("#hw-tsrc").href = rd.src; const last = rd.pts[n - 1];
  $("#hw-tto").textContent = t("hw_data_to", {s:k === "heli" ? last[3] : last[2], d:C.fmtDate(window.HW_ROUTEDATA.retrieved)});
  trackRead(); drawRegion();
}
function trackRead() {
  const k = S.reg.track, rd = window.HW_ROUTEDATA[k], p = rd.pts[S.reg.idx], km = v => (v / 1000).toLocaleString(C.locale ? C.locale() : undefined, {maximumFractionDigits:2}) + " km";
  $("#hw-tread").innerHTML = k === "heli"
    ? `${esc(t("hw_flight"))} <b>${p[2]}</b> · ${esc(t("hw_sol"))} ${p[3]} · ${esc(p[4])} · ${esc(p[6] || "")}${p[7] ? " → " + esc(p[7]) : ""} · Σ ${km(p[5])} · ${esc(fmtLL(p[1], p[0]))}`
    : `${esc(t("hw_sol"))} <b>${p[2]}</b> · Σ ${km(p[3])} · ${esc(fmtLL(p[1], p[0]))}`;
}
function bindRegion() {
  const rv = $("#hw-rv"), pts = new Map(); let pinch = null;
  const zoomAt = (f, cx, cy) => { const r = S.reg, s2 = clamp(r.s * f, r.fit * .8, Math.max(r.fit * 30, 6)); const k = s2 / r.s; r.tx = cx - (cx - r.tx) * k; r.ty = cy - (cy - r.ty) * k; r.s = s2; applyRegion(); };
  rv.addEventListener("wheel", e => { e.preventDefault(); const b = rv.getBoundingClientRect(); zoomAt(Math.exp(-e.deltaY * .0015), e.clientX - b.left, e.clientY - b.top); }, {passive:false});
  rv.addEventListener("pointerdown", e => { if (e.target.closest("[data-item]")) return; rv.setPointerCapture(e.pointerId); pts.set(e.pointerId, [e.clientX, e.clientY]); if (pts.size === 2) { const [a, b] = [...pts.values()]; pinch = Math.hypot(a[0] - b[0], a[1] - b[1]); } });
  rv.addEventListener("pointermove", e => {
    const b = rv.getBoundingClientRect(), x = (e.clientX - b.left - S.reg.tx) / S.reg.s, y = (e.clientY - b.top - S.reg.ty) / S.reg.s;
    const ll = px2ll(x, y); $("#hw-rc").textContent = t("hw_cursor") + " · " + fmtLL(ll[0], ll[1]);
    if (!pts.has(e.pointerId)) return;
    const prev = pts.get(e.pointerId); pts.set(e.pointerId, [e.clientX, e.clientY]);
    if (pts.size === 2) { const [p1, p2] = [...pts.values()], d = Math.hypot(p1[0] - p2[0], p1[1] - p2[1]); if (pinch) zoomAt(d / pinch, (p1[0] + p2[0]) / 2 - b.left, (p1[1] + p2[1]) / 2 - b.top); pinch = d; }
    else { S.reg.tx += e.clientX - prev[0]; S.reg.ty += e.clientY - prev[1]; applyRegion(); }
  });
  const up = e => { pts.delete(e.pointerId); if (pts.size < 2) pinch = null; };
  rv.addEventListener("pointerup", up); rv.addEventListener("pointercancel", up);
  rv.addEventListener("keydown", e => { const st = 60; if (e.key === "ArrowLeft") S.reg.tx += st; else if (e.key === "ArrowRight") S.reg.tx -= st; else if (e.key === "ArrowUp") S.reg.ty += st; else if (e.key === "ArrowDown") S.reg.ty -= st; else if (e.key === "+" || e.key === "=") return zoomAt(1.3, rv.clientWidth / 2, rv.clientHeight / 2); else if (e.key === "-") return zoomAt(1 / 1.3, rv.clientWidth / 2, rv.clientHeight / 2); else return; e.preventDefault(); applyRegion(); });
  $$("[data-rz]", $("#hw-regwrap")).forEach(b => b.addEventListener("click", () => { const z = b.dataset.rz; if (z === "fit") fitRegion(false); else zoomAt(z === "in" ? 1.4 : 1 / 1.4, rv.clientWidth / 2, rv.clientHeight / 2); }));
  const tr = $("#hw-tr"); if (tr) {
    tr.addEventListener("input", () => { S.reg.idx = +tr.value; trackRead(); drawRegion(); });
    $("#hw-tsel").addEventListener("change", e => { stopPlay(); setTrack(e.target.value, true); });
  }
}
function stopPlay() { if (tPlay) { cancelAnimationFrame(tPlay); tPlay = 0; } const b = $("#hw-tplay"); if (b) b.textContent = "▶ " + t("hw_play"); }
function togglePlay() {
  if (tPlay) return stopPlay();
  const rd = window.HW_ROUTEDATA[S.reg.track], n = rd.pts.length; if (S.reg.idx >= n - 1) S.reg.idx = 0;
  $("#hw-tplay").textContent = "❚❚ " + t("hw_pause"); const step = Math.max(1, Math.round(n / 360));
  const tick = () => { if (!S.reg || !$("#hw-tr")) return stopPlay(); S.reg.idx = Math.min(n - 1, S.reg.idx + step); $("#hw-tr").value = S.reg.idx; trackRead(); drawRegion(); if (S.reg.idx >= n - 1) return stopPlay(); tPlay = requestAnimationFrame(tick); };
  tPlay = requestAnimationFrame(tick);
}

/* ── TIME MACHINE ── */
let tmTimer = 0;
function events(dest) {
  const ev = [];
  for (const m of window.HW_MISSIONS.filter(m => m.dest === dest)) {
    const first = D.find(i => i.mission === m.id);
    if (m.launch) ev.push({date:m.launch, text:t("hw_launch") + ": " + m.name, item:first?.id});
    if (m.landing) ev.push({date:m.landing, text:t("hw_landing") + ": " + m.name, item:first?.id});
    if (m.lastContact) ev.push({date:m.lastContact, text:t("hw_last") + ": " + m.name, item:first?.id});
  }
  for (const e of window.HW_EVENTS.filter(e => e.dest === dest)) ev.push({date:e.date, text:e.text, item:e.item});
  const seen = new Set(); return ev.filter(e => { const k = e.date + e.text; if (seen.has(k)) return false; seen.add(k); return true; }).sort((a, b) => a.date.localeCompare(b.date));
}
function renderTime() {
  const ev = events(S.dest), y0 = Math.min(...ev.map(e => +e.date.slice(0, 4))), y1 = Math.max(new Date().getFullYear(), ...ev.map(e => +e.date.slice(0, 4)));
  S.year = clamp(S.year, y0, y1);
  const years = [...new Set(ev.map(e => +e.date.slice(0, 4)))];
  const und = D.filter(i => i.dest === S.dest && !i.date).length;
  $("#hw-timewrap").innerHTML = `<div class="hw-time" role="region" aria-label="${esc(t("hw_time"))}"><div class="row"><span class="mono">${esc(t("hw_time").toUpperCase())}</span><b class="yr" id="hw-yr">${S.year}</b>
    <button class="hw-btn" data-a="tmplay" id="hw-tmplay">${tmTimer ? "❚❚ " + esc(t("hw_pause")) : "▶ " + esc(t("hw_play"))}</button><button class="hw-x" data-a="time" aria-label="${esc(t("hw_close"))}">×</button></div>
    <div class="hw-tslide"><input type="range" id="hw-ty" min="${y0}" max="${y1}" value="${S.year}" aria-label="${esc(t("hw_cmp_year"))}"><div class="ticks" aria-hidden="true">${years.map(y => `<i style="left:${(y - y0) / (y1 - y0) * 100}%"></i>`).join("")}</div><div class="ends mono"><span>${y0}</span><span>${y1}</span></div></div>
    <div class="hw-evs" id="hw-evs"></div>${und ? `<p class="hw-note">${esc(t("hw_undated", {n:und}))}</p>` : ""}</div>`;
  $("#hw-ty").addEventListener("input", e => { S.year = +e.target.value; timeUpdate(); });
  timeUpdate();
}
function timeUpdate() {
  $("#hw-yr").textContent = S.year;
  const ev = events(S.dest).filter(e => +e.date.slice(0, 4) === S.year);
  $("#hw-evs").innerHTML = `<span class="mono">${esc(t("hw_events"))}</span>` + (ev.length ? ev.map(e => `<button ${e.item ? `data-item="${e.item}"` : ""}><time class="mono">${esc(C.fmtDate(e.date))}</time> ${esc(e.text)}</button>`).join("") : `<em>${esc(t("hw_no_events"))}</em>`);
  renderList();
}
function toggleTime() {
  S.tm = !S.tm; if (!S.tm) { clearInterval(tmTimer); tmTimer = 0; $("#hw-timewrap").innerHTML = ""; host.classList.remove("tm-open"); renderList(); }
  else { const ev = events(S.dest); S.year = +ev[0].date.slice(0, 4); host.classList.add("tm-open"); renderTime(); }
  $$('[data-a="time"]', $("#hw-tools")).forEach(b => b.setAttribute("aria-pressed", S.tm));
}
function tmPlay() {
  const b = $("#hw-tmplay");
  if (tmTimer) { clearInterval(tmTimer); tmTimer = 0; b.textContent = "▶ " + t("hw_play"); return; }
  const max = +$("#hw-ty").max; if (S.year >= max) S.year = +$("#hw-ty").min;
  b.textContent = "❚❚ " + t("hw_pause");
  tmTimer = setInterval(() => { if (!$("#hw-ty")) { clearInterval(tmTimer); tmTimer = 0; return; } S.year++; $("#hw-ty").value = S.year; timeUpdate(); if (S.year >= max) { clearInterval(tmTimer); tmTimer = 0; const bb = $("#hw-tmplay"); if (bb) bb.textContent = "▶ " + t("hw_play"); } }, C.reduced ? 1200 : 650);
}

/* ── modals: compare, what did we leave behind ── */
function openModal(kind) {
  S.modal = kind; const el = $("#hw-modal"); el.hidden = false;
  el.innerHTML = `<div class="hw-mbox" role="dialog" aria-modal="true" aria-labelledby="hw-mt">${kind === "compare" ? compareHTML() : leftHTML()}</div>`;
  if (kind === "compare") { $$("#hw-modal select").forEach((s, n) => s.addEventListener("change", e => { S.cmp[n] = e.target.value; openModal("compare"); })); }
  $("#hw-modal .hw-x").focus();
}
function closeModal() { S.modal = null; const el = $("#hw-modal"); el.hidden = true; el.innerHTML = ""; }
function compareHTML() {
  const CP = window.HW_COMPARE, keys = Object.keys(CP), [a, b] = S.cmp;
  const opt = cur => keys.map(k => `<option value="${k}" ${k === cur ? "selected" : ""}>${esc(CP[k].name)} (${CP[k].year})</option>`).join("");
  const rows = [["hw_agency","agency"],["hw_cmp_year","year"],["hw_mass","mass"],["hw_cmp_dims","dims"],["hw_power","power"],["hw_mobility","mobility"],["hw_instruments","instruments"],["hw_cmp_duration","duration"],["hw_dist","distance"],["hw_cmp_contrib","contribution"],["hw_outcome","outcome"]];
  const cell = (k, f) => f === "outcome" ? badge("outcome", CP[k][f]) : f === "distance" && CP[k][f] === "—" ? `<span class="hw-nc">${esc(t("hw_op_not_applicable"))}</span>` : val(CP[k][f]);
  return `<div class="hw-dh"><h2 id="hw-mt">${cmpIcon} ${esc(t("hw_compare"))}</h2><button class="hw-x" data-a="closemodal" aria-label="${esc(t("hw_close"))}">×</button></div>
   <div class="hw-pairs">${window.HW_PAIRS.map(([x, y]) => `<button data-pair="${x}|${y}" aria-pressed="${a === x && b === y}">${esc(CP[x].name)} <i>vs</i> ${esc(CP[y].name)}</button>`).join("")}</div>
   <div class="hw-picks"><label><span class="sr">A</span><select>${opt(a)}</select></label><span>vs</span><label><span class="sr">B</span><select>${opt(b)}</select></label></div>
   <div class="hw-tw"><table class="hw-cmp"><thead><tr><th></th>${[a, b].map(k => `<th><button class="hw-link" data-item="${k}" data-closemodal>${esc(CP[k].name)}</button><small>${esc(t("hw_" + CP[k].dest + "_s"))}</small></th>`).join("")}</tr></thead>
   <tbody>${rows.map(([l, f]) => `<tr><th>${esc(t(l))}</th><td>${cell(a, f)}</td><td>${cell(b, f)}</td></tr>`).join("")}</tbody></table></div>
   <p class="hw-note">${esc(t("hw_cmp_note"))}</p>`;
}
function leftHTML() {
  const col = d => {
    const all = D.filter(i => i.dest === d), dated = all.filter(i => i.date).sort((a, b) => a.date.localeCompare(b.date)), old = dated[0];
    const present = all.filter(i => i.phys === "present"), working = all.filter(i => i.op === "operational"), unk = all.filter(i => i.op === "unknown" && i.phys === "present");
    const silent = all.filter(i => i.op === "inactive" || i.op === "no-longer-communicating"), gone = all.filter(i => i.phys === "destroyed" || i.phys === "impacted");
    const unsure = all.filter(i => i.phys === "uncertain" || i.phys === "not-located" || !i.loc);
    const chips = l => `<div class="hw-sibs">${l.map(i => `<button data-item="${i.id}" data-closemodal>${dot(i.cat)}${esc(i.name)}</button>`).join("")}</div>`;
    const max = Math.max(...CATS[d].map(c => all.filter(i => i.cat === c).length));
    return `<section class="hw-lcol ${d}"><h3>${esc(t("hw_" + d + "_s"))}</h3>
     <div class="hw-big"><div><b>${all.length}</b><span>${esc(t("hw_stats_total"))}</span></div><div><b>${present.length}</b><span>${esc(t("hw_stats_present"))}</span></div><div><b>${gone.length}</b><span>${esc(lab("p", "impacted"))} / ${esc(lab("p", "destroyed"))}</span></div></div>
     <h4>${esc(t("hw_stats_oldest"))}</h4>${old ? `<button class="hw-old" data-item="${old.id}" data-closemodal>${dot(old.cat)}<b>${esc(old.name)}</b><span>${esc(C.fmtDate(old.date))}</span></button>` : ""}
     <h4>${esc(t("hw_stats_bycat"))}</h4><ul class="hw-bars">${CATS[d].map(c => { const n = all.filter(i => i.cat === c).length; return n ? `<li><span>${dot(c)}${esc(lab("c", c))}</span><i style="width:${n / max * 100}%;--c:${COL[c]}"></i><b>${n}</b></li>` : ""; }).join("")}</ul>
     <h4>${esc(t("hw_stats_working"))} · ${working.length + unk.length}</h4><p class="hw-note">${esc(lab("op", "operational"))}: ${working.length} · ${esc(lab("op", "unknown"))}: ${unk.length}</p>${chips([...working, ...unk])}
     <h4>${esc(t("hw_stats_silent"))} · ${silent.length}</h4>${chips(silent)}
     <h4>${esc(t("hw_stats_uncertain"))} · ${unsure.length}</h4>${chips(unsure)}</section>`;
  };
  return `<div class="hw-dh"><h2 id="hw-mt">${boxIcon} ${esc(t("hw_left"))}</h2><button class="hw-x" data-a="closemodal" aria-label="${esc(t("hw_close"))}">×</button></div>
   <p class="hw-note">${esc(t("hw_stats_note"))}</p><div class="hw-lgrid">${col("moon")}${col("mars")}</div><p class="hw-ver">${esc(t("hw_verified"))}: ${esc(C.fmtDate(window.HW_VERIFIED))}</p>`;
}

/* ── events ── */
function toggleSide(on) { S.side = on === undefined ? !S.side : on; host.classList.toggle("side-open", S.side); }
function resetFilters() { Object.assign(S, {q:"", mission:"", agency:"", outcome:"", phys:"", op:"", acc:""}); S.cats.clear(); Object.assign(S.layers, {impact:true, approx:true, routes:true}); renderSide(); }
function onKey(e) {
  if (!host || !document.body.contains(host)) return;
  if (e.key === "Escape") {
    if (!$("#hw-tip").hidden) { hideTip(); e.stopPropagation(); return; }
    if (S.modal) { closeModal(); e.stopPropagation(); return; }
    if (S.reg) { closeRegion(); e.stopPropagation(); return; }
    if (S.sel || S.sheet) { deselect(); e.stopPropagation(); return; }
    if (S.side) { toggleSide(false); e.stopPropagation(); return; }
  }
  if (e.key === "/" && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { e.preventDefault(); e.stopPropagation(); if (window.matchMedia("(max-width:760px)").matches) toggleSide(true); $("#hw-q")?.focus(); }
}
function bind() {
  document.addEventListener("keydown", onKey, true);
  host.addEventListener("click", e => {
    const it = e.target.closest("[data-item]"); if (it && !e.target.closest("select")) { if (it.hasAttribute("data-closemodal")) closeModal(); select(it.dataset.item, {fly:true}); return; }
    const pk = e.target.closest("[data-pick]"); if (pk) { closeIntro(pk.dataset.pick); return; }
    const ds = e.target.closest("[data-dest]"); if (ds) { setDest(ds.dataset.dest, true); return; }
    const vw = e.target.closest("[data-view]"); if (vw) { const v = vw.dataset.view; if (v === "regional") { if (S.reg) return; const i = S.sel && ITEM[S.sel]; const key = i && i.reg ? i.reg : Object.keys(window.HW_REG).find(k => D.some(x => x.dest === S.dest && x.reg === k && x.route)) || Object.keys(window.HW_REG).find(k => D.some(x => x.dest === S.dest && x.reg === k)); openRegion(key); } else setView(v); return; }
    const ct = e.target.closest("[data-cat]"); if (ct) { const c = ct.dataset.cat; S.cats.has(c) ? S.cats.delete(c) : S.cats.add(c); ct.setAttribute("aria-pressed", S.cats.has(c)); renderList(); return; }
    const tb = e.target.closest("[data-tab]"); if (tb) { S.tab = tb.dataset.tab; renderDetail(); return; }
    const pr = e.target.closest("[data-pair]"); if (pr) { S.cmp = pr.dataset.pair.split("|"); openModal("compare"); return; }
    const ev = e.target.closest("#hw-evs button"); if (ev) return;
    if (e.target.classList.contains("hw-modal")) { closeModal(); return; }
    const a = e.target.closest("[data-a]"); if (!a) return;
    const act = a.dataset.a, i = S.sel && ITEM[S.sel];
    switch (act) {
      case "exit": C.exit(); break;
      case "side": toggleSide(); break;
      case "reset": resetFilters(); break;
      case "time": toggleTime(); break;
      case "tmplay": tmPlay(); break;
      case "compare": openModal("compare"); break;
      case "left": openModal("left"); break;
      case "closemodal": closeModal(); break;
      case "deselect": deselect(); break;
      case "zih": if (i) openRegion(i.reg); break;
      case "track": if (i) openRegion(i.reg, i.route); break;
      case "regback": closeRegion(); break;
      case "tplay": togglePlay(); break;
      case "mission": if (i) { S.sheet = i.mission; renderDetail(); } break;
      case "sheetback": S.sheet = null; if (S.sel) renderDetail(); else deselect(); break;
      case "museum": e.preventDefault(); C.museum(a.dataset.model); break;
      case "cmpthis": if (i) { const pair = window.HW_PAIRS.find(p => p.includes(i.id)); S.cmp = pair ? pair.slice() : [i.id, Object.keys(window.HW_COMPARE).find(k => k !== i.id && window.HW_COMPARE[k].dest === i.dest)]; openModal("compare"); } break;
      case "ask": if (i) C.ask(t("hw_ask_q", {name:i.name, mission:MIS[i.mission]?.name || ""})); break;
      case "trhw": if (i) translateItem(i); break;
      case "world": break;
    }
  });
  host.addEventListener("input", e => { if (e.target.id === "hw-q") { S.q = e.target.value; renderList(); } });
  host.addEventListener("change", e => {
    const f = e.target.dataset.f; if (f) { S[f] = e.target.value; renderList(); return; }
    const l = e.target.dataset.layer; if (l) { S.layers[l] = e.target.checked; if (l === "grid" && R) R.grid.visible = S.layers.grid; renderList(); return; }
    if (e.target.id === "hw-regsel") { const k = e.target.value; if (k) openRegion(k); }
  });
}

window.FE_HW = {start, stop, refresh:() => { if (host) renderAll(); }, select:id => select(id, {fly:true}), setDest:d => { if (S.intro) closeIntro(d); else setDest(d, true); }};
})();
