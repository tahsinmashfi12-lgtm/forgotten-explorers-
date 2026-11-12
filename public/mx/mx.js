/* MARS: THE JOURNEY, THE MACHINES & THE LEGACY — cinematic documentary player (one continuous timeline),
   Mars mission archive and media inventory. Narration and score are separate <audio> elements on the same clock. */
window.FE_MXP = (function () {
"use strict";
let C, host, D, Q, S = null, raf = 0, keyH = null, fsH = null;
const $ = (s, r) => (r || host).querySelector(s), $$ = (s, r) => [...(r || host).querySelectorAll(s)];
const t = (k, v) => C.t(k, v), esc = s => C.esc(String(s == null ? "" : s)), L = () => C.lang();
const fmt = s => { s = Math.max(0, s || 0); const m = Math.floor(s / 60), x = Math.floor(s % 60); return m + ":" + String(x).padStart(2, "0"); };
const ICO = {
  play:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>',
  pause:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h4v14H7zM13 5h4v14h-4z" fill="currentColor"/></svg>',
  replay:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5V2L7 6l5 4V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7z" fill="currentColor"/></svg>',
  prev:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5h2v14H6zM20 5v14L9 12z" fill="currentColor"/></svg>',
  next:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 5h2v14h-2zM4 5v14l11-7z" fill="currentColor"/></svg>',
  fs:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" stroke="currentColor" stroke-width="2" fill="none"/></svg>',
  tr:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 10h16M4 14h10M4 18h12" stroke="currentColor" stroke-width="2" fill="none"/></svg>',
  close:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2"/></svg>',
  note:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18V5l11-2v13" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="6" cy="18" r="3" fill="currentColor"/><circle cx="17" cy="16" r="3" fill="currentColor"/></svg>',
  noteoff:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18V5l11-2v13" stroke="currentColor" stroke-width="2" fill="none" opacity=".45"/><circle cx="6" cy="18" r="3" fill="currentColor" opacity=".45"/><path d="M3 3l18 18" stroke="currentColor" stroke-width="2"/></svg>',
  ext:'<svg viewBox="0 0 24 24" aria-hidden="true" width="13" height="13"><path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6" stroke="currentColor" stroke-width="2" fill="none"/></svg>'
};
const OUTS = ["success","partial","active","ended","unk","failed","lost","cancelled","planned","enroute"], TYPES = ["flyby","orbiter","multi","lander","rover","helicopter","sample"];
let MB = {};
/* timeline helpers: chapter i spans [off[i]-gap, off[i+1]-gap); the opening is [0, off[0]) */
const OFF = () => Q.off, GAP = 3;
function chAt(tm) { let c = 0; for (let i = 0; i < 7; i++) if (tm >= Q.off[i] - GAP + 0.01) c = i; return c; }
function shotsFlat() {
  if (S.flat) return S.flat;
  const f = [{t:0, intro:1, c:0}];
  D.CH.forEach((ch, i) => ch.shots.forEach(sh => f.push(Object.assign({t:Q.off[i] + sh.s, c:i}, sh))));
  f.sort((a, b) => a.t - b.t); S.flat = f; return f;
}

function start(h, ctx) {
  host = h; C = ctx; D = window.FE_MX; Q = window.FE_MX_CUES; MB = {}; D.M.forEach(m => MB[m.id] = m);
  S = {view:null, shot:-1, cue:-1, playing:false, cc:C.store.get("mx:cc") || (L() === "en" ? "en" : L()), trOpen:false, music:C.store.get("mx:music") !== "0",
       nv:+(C.store.get("mx:nv") || 1), mv:+(C.store.get("mx:mv") || 0.5), rate:+(C.store.get("mx:rate") || 1), duck:1, ar:{q:"", ty:"", ou:"", ag:""}};
  if (S.cc !== "off" && S.cc !== "en" && S.cc !== L()) S.cc = L();
  host.innerHTML = `<div class="mx-top"><div class="mx-brand"><b>${esc(t("mx_title"))}</b><span>${esc(t("mx_title2"))}</span></div>
    <nav class="mx-tabs"><a href="#mars-doc" data-tab="watch">${esc(t("md_watch"))}</a><a href="#mars-doc/archive" data-tab="archive">${esc(t("mx_archive_btn"))}</a><a href="#mars-doc/sources" data-tab="sources">${esc(t("md_sources"))}</a></nav>
    <button class="mx-ib mx-x" data-a="exit" aria-label="${esc(t("md_close"))}" title="${esc(t("md_close"))}">${ICO.close}</button></div>
    <div class="mx-body"></div><div class="mx-drawer" hidden></div>
    <audio class="mx-narr" preload="metadata" src="mx/audio/mars_narration.mp3"></audio><audio class="mx-music" preload="metadata" src="mx/audio/mars_score.mp3"></audio>`;
  S.na = $(".mx-narr"); S.mu = $(".mx-music");
  host.addEventListener("click", onClick); host.addEventListener("input", onInput); host.addEventListener("change", onInput);
  keyH = onKey; document.addEventListener("keydown", keyH);
  fsH = () => { host.classList.toggle("mx-isfs", document.fullscreenElement === host); fitAll(); }; document.addEventListener("fullscreenchange", fsH);
  window.addEventListener("resize", fitAll);
  S.na.addEventListener("play", () => { if (!S) return; S.playing = true; S.started = true; syncMusic(true); playVideos(true); paint(); });
  S.na.addEventListener("pause", () => { if (!S) return; S.playing = false; S.mu.pause(); playVideos(false); paint(); });
  S.na.addEventListener("ended", () => { if (!S) return; S.playing = false; S.ended = true; paint(); showEnd(); });
  S.na.addEventListener("error", () => { if (S && S.na.getAttribute("src")) toast(t("md_audio_err")); });
  S.na.playbackRate = S.mu.playbackRate = S.rate; applyVol();
  nav(ctx.arg || ""); loop();
}
function stop() {
  cancelAnimationFrame(raf); raf = 0;
  if (S) { try { S.na.pause(); S.mu.pause(); S.na.removeAttribute("src"); S.mu.removeAttribute("src"); S.na.load(); S.mu.load(); } catch (e) {} }
  document.removeEventListener("keydown", keyH); document.removeEventListener("fullscreenchange", fsH); window.removeEventListener("resize", fitAll);
  if (document.fullscreenElement === host) { try { document.exitFullscreen(); } catch (e) {} }
  S = null;
}
function nav(arg) {
  arg = (arg || "").replace(/^\//, ""); closeDrawer();
  if (arg === "archive") return showArchive();
  if (arg === "sources") return showSources();
  const n = +arg; showWatch();
  if (n >= 1 && n <= 7) { seek(n === 1 ? 0 : Q.off[n - 1] - GAP + 0.05); if (S.started) play(); }
}
function setTab(k) { $$(".mx-tabs a").forEach(a => a.toggleAttribute("aria-current", a.dataset.tab === k)); }

/* ── WATCH ── */
function showWatch() {
  setTab("watch"); if (S.view === "watch") return; S.view = "watch"; S.shot = -1; S.cue = -1;
  const marks = Q.off.map((o, i) => `<i style="left:${((o - GAP) / Q.total * 100).toFixed(2)}%" title="${esc(t("mx_c" + (i + 1)))}"></i>`).join("");
  $(".mx-body").innerHTML = `<div class="mx-watch">
    <div class="mx-stage"><div class="mx-vis"></div><div class="mx-dark"></div><div class="mx-card" hidden></div><div class="mx-chap" hidden></div>
      <div class="mx-meta"></div><div class="mx-cap" aria-live="off" hidden></div><div class="mx-intro"></div></div>
    <aside class="mx-side" hidden><div class="mx-side-h"><b>${esc(t("md_tr"))}</b><small>${esc(t("md_tr_hint"))}</small><button class="mx-ib" data-a="tr" aria-label="${esc(t("md_close"))}">${ICO.close}</button></div><div class="mx-trl"></div></aside>
    <div class="mx-hot"><span class="mono">${esc(t("mx_in_scene"))}</span><div class="mx-chips"></div></div>
    <div class="mx-ctl">
      <div class="mx-seekw"><input type="range" class="mx-seek" min="0" max="1000" value="0" aria-label="${esc(t("md_seek"))}"><div class="mx-marks">${marks}</div></div>
      <div class="mx-row">
        <button class="mx-ib" data-a="prev" aria-label="${esc(t("md_prev"))}" title="${esc(t("md_prev"))}">${ICO.prev}</button>
        <button class="mx-ib mx-pp" data-a="pp" aria-label="${esc(t("md_play"))}" title="${esc(t("md_play"))}">${ICO.play}</button>
        <button class="mx-ib" data-a="next" aria-label="${esc(t("md_next"))}" title="${esc(t("md_next"))}">${ICO.next}</button>
        <button class="mx-ib" data-a="restart" aria-label="${esc(t("mx_restart"))}" title="${esc(t("mx_restart"))}">${ICO.replay}</button>
        <span class="mx-time mono"><span class="mx-cur">0:00</span> / ${fmt(Q.total)}</span>
        <span class="mx-chname"></span><span class="mx-sp"></span>
        <label class="mx-vol"><span>${esc(t("md_narr"))}</span><input type="range" class="mx-nv" min="0" max="1" step="0.05" value="${S.nv}" aria-label="${esc(t("md_narr"))}"></label>
        <button class="mx-ib mx-mt" data-a="music" aria-pressed="${S.music}"></button>
        <label class="mx-vol"><span>${esc(t("md_music"))}</span><input type="range" class="mx-mv" min="0" max="1" step="0.05" value="${S.mv}" aria-label="${esc(t("md_music"))}"></label>
        <label class="mx-sel"><span>${esc(t("md_speed"))}</span><select class="mx-rate" aria-label="${esc(t("md_speed"))}">${[0.75,1,1.25,1.5].map(r => `<option value="${r}"${r === S.rate ? " selected" : ""}>${r}×</option>`).join("")}</select></label>
        <label class="mx-sel"><span>${esc(t("md_cc"))}</span><select class="mx-ccs" aria-label="${esc(t("md_cc"))}">${ccOptions()}</select></label>
        <button class="mx-ib" data-a="tr" aria-label="${esc(t("md_tr"))}" title="${esc(t("md_tr"))}">${ICO.tr}</button>
        <button class="mx-ib" data-a="fs" aria-label="${esc(t("md_fs"))}" title="${esc(t("md_fs"))}">${ICO.fs}</button>
      </div>
      <div class="mx-chbar">${D.CH.map((c, i) => `<button data-a="ch" data-ch="${i}"><b>${i + 1}</b><span>${esc(t("mx_c" + (i + 1)))}</span></button>`).join("")}</div>
      <p class="mx-keys mono">${esc(t("md_kb"))}</p>
    </div></div>`;
  paintMusic(); buildTranscript(); update(true); paint();
  if (!S.started) showIntroPanel();
}
function ccOptions() {
  const o = [["off", t("md_off")], ["en", "English"]];
  if (L() !== "en") o.push([L(), (C.langs.find(l => l.code === L()) || {}).label || L()]);
  return o.map(([v, l]) => `<option value="${v}"${v === S.cc ? " selected" : ""}>${esc(l)}</option>`).join("");
}
function showIntroPanel() {
  const el = $(".mx-intro"); el.hidden = false; el.className = "mx-intro mx-pre";
  el.innerHTML = `<div class="mx-stars"></div><div class="mx-pre-in"><span class="mono mx-k">${esc(t("mx_kicker"))} · ${esc(t("md_mins", {m:Math.round(Q.total / 60)}))}</span>
    <h1><span>${esc(t("mx_title"))}</span><small>${esc(t("mx_title2"))}</small></h1><p class="mx-desc">${esc(t("mx_desc"))}</p>
    <div class="mx-ibtns"><button class="btn primary" data-a="begin">${ICO.play} ${esc(t("mx_btn"))}</button><a class="btn" href="#mars-doc/archive">${esc(t("mx_archive_btn"))}</a></div>
    <ol class="mx-chlist">${D.CH.map((c, i) => { const a = D.A[(c.shots.find(x => x.a && !D.A[x.a].vid) || {a:"vm"}).a]; return `<li><button data-a="ch" data-ch="${i}">${icon(a.f)}<span><small class="mono">${esc(t("mx_ch", {n:i + 1}))} · ${fmt(Q.durs[i])}</small><b>${esc(t("mx_c" + (i + 1)))}</b></span></button></li>`; }).join("")}</ol>
    <p class="mx-hint mono">${esc(t("md_start_hint"))}</p></div>`;
}
function hideIntroPanel() { const el = $(".mx-intro"); if (el && el.classList.contains("mx-pre")) { el.hidden = true; el.innerHTML = ""; el.className = "mx-intro"; } }
function thumb(f, a) { return /^(img|hw\/img|jr\/img)\/[^/]+\.(jpg|webp)$/.test(f) ? f.replace(/\/([^/]+)$/, "/t/$1") : f; }
/*SPRITE*/const SPR = {cols:6, rows:5, i:{"mx/img/curiosity_mount_sharp.webp":0,"mx/img/esa_global_mars.webp":1,"mx/img/hubble_mars_1997.webp":2,"mx/img/hubble_mars_2001.webp":3,"mx/img/humans_on_mars_concept.webp":4,"mx/img/huygens_1659.webp":5,"mx/img/ingenuity_final_airfield.webp":6,"mx/img/ingenuity_rotor_shadow.jpg":7,"mx/img/jezero_mars_express.webp":8,"mx/img/lowell_canals.jpg":9,"mx/img/mariner4_to_hirise.jpg":10,"mx/img/mariner9_olympus_mons.jpg":11,"mx/img/mars3_candidate_hirise.webp":12,"mx/img/mgs_sees_odyssey.webp":13,"mx/img/mom_spacecraft.webp":14,"mx/img/mom_syrtis_major.webp":15,"mx/img/msr_campaign_concept.webp":16,"mx/img/opportunity_legacy_pan.webp":17,"mx/img/oxia_planum_hirise.jpg":18,"mx/img/perseverance_33_tubes.webp":19,"mx/img/perseverance_tube_drill.webp":20,"mx/img/phoenix_ice.jpg":21,"mx/img/schiaparelli_1888.jpg":22,"mx/img/spirit_troy_panorama.webp":23,"mx/img/viking1_launch_pad.webp":24,"mx/img/viking_orbiter_clouds.webp":25,"mx/img/viking_valles_marineris.webp":26}};/*/SPRITE*/
/* small list icons come from one sprite sheet instead of full-size photographs (archive lists load ~200 KB instead of several MB) */
function icon(f, extra) {
  const i = SPR.i && SPR.i[f];
  if (i == null) return `<img src="${esc(thumb(f))}" alt="" loading="lazy" decoding="async"${extra || ""}>`;
  const x = SPR.cols > 1 ? (i % SPR.cols) / (SPR.cols - 1) * 100 : 0, y = SPR.rows > 1 ? Math.floor(i / SPR.cols) / (SPR.rows - 1) * 100 : 0;
  return `<span class="mx-spr" aria-hidden="true" style="background-size:${SPR.cols * 100}% ${SPR.rows * 100}%;background-position:${x.toFixed(4)}% ${y.toFixed(4)}%"></span>`;
}

function capList() {
  const lang = S.cc === "off" ? (L() === "en" ? "en" : L()) : S.cc, out = [];
  for (let i = 0; i < 7; i++) Q.en[i].forEach((c, j) => out.push({s:Q.off[i] + c[0], e:Q.off[i] + c[1], t:lang !== "en" && Q[lang] ? Q[lang][i][j] : c[2], en:c[2], c:i, j}));
  return out;
}
function buildTranscript() {
  const tl = $(".mx-trl"); if (!tl) return; const list = capList(); S.caps = list;
  const translated = S.cc !== "en" && !(S.cc === "off" && L() === "en");
  let h = translated ? `<p class="mx-trnote">${esc(t("md_tr_note"))}</p>` : "";
  for (let i = 0; i < 7; i++) h += `<h4><button data-a="ch" data-ch="${i}">${esc(t("mx_ch", {n:i + 1}))} · ${esc(t("mx_c" + (i + 1)))}</button></h4><ol>` + list.filter(c => c.c === i).map(c => `<li><button data-a="cue" data-s="${c.s}" data-k="${c.c}-${c.j}"><time class="mono">${fmt(c.s)}</time><span>${esc(c.t)}</span></button></li>`).join("") + "</ol>";
  tl.innerHTML = h; tl.dir = (S.cc === "ar" || (S.cc === "off" && L() === "ar")) ? "rtl" : "ltr";
}
function play() { hideIntroPanel(); S.ended = false; const p = S.na.play(); if (p && p.catch) p.catch(() => { S.playing = false; paint(); }); }
function pause() { S.na.pause(); }
function seek(x) { S.na.currentTime = Math.max(0, Math.min(Q.total - 0.1, x)); syncMusic(true); update(true); }
function syncMusic(force) {
  if (!S) return; const tgt = S.na.currentTime;
  if (!S.music) { S.mu.pause(); return; }
  if (force || Math.abs(S.mu.currentTime - tgt) > 0.3) { try { S.mu.currentTime = tgt; } catch (e) {} }
  if (S.playing && S.mu.paused) { const p = S.mu.play(); if (p && p.catch) p.catch(() => {}); }
}
function applyVol() { if (!S) return; S.na.volume = S.nv; S.mu.volume = Math.min(1, S.mv * S.duck); }
function paint() {
  const b = $(".mx-pp"); if (!b) return; b.innerHTML = S.playing ? ICO.pause : ICO.play; const l = t(S.playing ? "md_pause" : "md_play"); b.setAttribute("aria-label", l); b.title = l;
  host.classList.toggle("mx-playing", S.playing);
}
function paintMusic() { const b = $(".mx-mt"); if (!b) return; b.innerHTML = S.music ? ICO.note : ICO.noteoff; const l = t(S.music ? "mx_music_on" : "mx_music_off"); b.title = l; b.setAttribute("aria-label", l); b.setAttribute("aria-pressed", String(S.music)); }
function loop() { raf = requestAnimationFrame(loop); if (S && S.view === "watch") update(false); }
function update(force) {
  const tm = S.na.currentTime || 0, F = shotsFlat();
  let si = 0; for (let k = 0; k < F.length; k++) if (tm >= F[k].t - 0.02) si = k;
  if (force || si !== S.shot) renderShot(si, force);
  const caps = S.caps || capList(); let ci = -1; for (let k = 0; k < caps.length; k++) if (tm >= caps[k].s - 0.05 && tm <= caps[k].e + 0.45) ci = k;
  if (force || ci !== S.cue) renderCue(ci, caps);
  /* chapter title during the gap before each chapter */
  const c = chAt(tm), ch = $(".mx-chap"); const showT = tm > Q.off[c] - GAP + 0.15 && tm < Q.off[c] + 2.4 && (c > 0 || tm > Q.off[0] - 1.8);
  if (ch && (force || ch.dataset.c !== String(c) || ch.hidden === showT)) { ch.dataset.c = c; ch.hidden = !showT; if (showT) ch.innerHTML = `<span class="mono">${esc(t("mx_ch", {n:c + 1}))}</span><b>${esc(t("mx_c" + (c + 1)))}</b>`; }
  const cn = $(".mx-chname"); if (cn && cn.dataset.c !== String(c)) { cn.dataset.c = c; cn.textContent = t("mx_ch", {n:c + 1}) + " · " + t("mx_c" + (c + 1)); $$(".mx-chbar button").forEach(b => b.toggleAttribute("aria-current", +b.dataset.ch === c)); }
  /* opening sequence (before chapter 1 narration) */
  const intro = $(".mx-intro");
  if (intro && !intro.classList.contains("mx-pre")) { const on = tm < Q.off[0] - 0.4 && S.started; if (on !== !intro.hidden) { intro.hidden = !on; if (on) openingHTML(intro); } if (on) intro.style.setProperty("--p", (tm / Q.off[0]).toFixed(3)); }
  const now = performance.now(), dt = Math.min(0.5, ((now - (S.lt || now)) / 1000)); S.lt = now; const want = ci >= 0 ? 0.42 : 1; S.duck += (want - S.duck) * Math.min(1, dt * 2.5); applyVol();
  if (S.playing) syncMusic(false);
  const cu = $(".mx-cur"); if (cu) cu.textContent = fmt(tm);
  const sk = $(".mx-seek"); if (sk && !S.seeking) { sk.value = Math.round(tm / Q.total * 1000); sk.style.setProperty("--p", (tm / Q.total * 100).toFixed(2) + "%"); sk.setAttribute("aria-valuetext", fmt(tm) + " / " + fmt(Q.total)); }
}
function openingHTML(el) {
  el.className = "mx-intro mx-open";
  el.innerHTML = `<div class="mx-stars"></div><div class="mx-stars mx-s2"></div><img class="mx-planet" src="${esc(D.A.vm.f)}" alt=""><div class="mx-otitle"><b>${esc(t("mx_title"))}</b><span>${esc(t("mx_title2"))}</span></div>`;
}
function renderCue(ci, caps) {
  S.cue = ci; const cap = $(".mx-cap");
  if (cap) { if (S.cc === "off" || ci < 0) { cap.hidden = true; cap.innerHTML = ""; } else { cap.hidden = false; cap.dir = S.cc === "ar" ? "rtl" : "ltr"; cap.innerHTML = `<span>${esc(caps[ci].t)}</span>`; } }
  const k = ci >= 0 ? caps[ci].c + "-" + caps[ci].j : "";
  $$(".mx-trl li button").forEach(b => { const on = b.dataset.k === k; b.classList.toggle("on", on); if (on && S.trOpen) { const p = b.closest(".mx-trl"); p.scrollTo({top:b.offsetTop - p.clientHeight / 3, behavior:C.reduced ? "auto" : "smooth"}); } });
}
function renderShot(si, instant) {
  const F = shotsFlat(), sh = F[si]; S.shot = si; const vis = $(".mx-vis"); if (!vis) return;
  const len = Math.max(2, (si + 1 < F.length ? F[si + 1].t : Q.total) - sh.t);
  const old = $$(".mx-slot", vis), slot = document.createElement("div"); slot.className = "mx-slot";
  if (sh.intro) { /* black: opening handles itself */ }
  else if (sh.card) { if (sh.bg) slot.appendChild(frameFor(D.A[sh.bg], [1.04, 1.14, 50, 50], len, true)); }
  else if (sh.pair || sh.tri) { slot.classList.add("mx-multi"); (sh.pair || sh.tri).forEach(k => { const cell = document.createElement("div"); cell.className = "mx-cell"; cell.appendChild(frameFor(D.A[k], [1.0, 1.08, 50, 50], len)); const lb = document.createElement("span"); lb.className = "mx-celll"; lb.textContent = D.A[k].n; cell.appendChild(lb); slot.appendChild(cell); }); }
  else slot.appendChild(frameFor(D.A[sh.a], sh.z, len, false, sh.pan));
  vis.appendChild(slot); requestAnimationFrame(() => slot.classList.add("in"));
  old.forEach(o => { o.classList.remove("in"); o.classList.add("out"); o.querySelectorAll("video").forEach(v => v.pause()); setTimeout(() => o.remove(), instant ? 0 : 1500); });
  fitAll();
  const dk = $(".mx-dark"); dk.className = "mx-dark" + (sh.dark ? " on" : ""); if (sh.dark) dk.style.animationDuration = len + "s";
  const card = $(".mx-card");
  if (sh.card) { card.hidden = false; card.className = "mx-card mx-card-" + sh.card; card.innerHTML = sh.card === "end" ? `<div class="mx-endcard"><b>${esc(t("mx_end_t"))}</b><span>${esc(t("mx_end_d"))}</span><small class="mono">${esc(t("md_end_d"))}</small></div>` : `<div class="mx-cardin"><span class="mono mx-k">${esc(t("mx_k_card"))}</span><h3>${esc(t("mx_card_" + sh.card + "_t"))}</h3><p>${esc(t("mx_card_" + sh.card + "_d"))}</p></div>`; }
  else { card.hidden = true; card.innerHTML = ""; }
  const meta = $(".mx-meta");
  if (sh.intro || sh.card === "end") meta.innerHTML = "";
  else if (sh.card) meta.innerHTML = `<span class="mx-kind mx-kc">${esc(t("mx_k_card"))}</span>` + (sh.bg ? `<span class="mx-cr">${esc(D.A[sh.bg].n)} · ${esc(D.A[sh.bg].cr)}</span>` : "");
  else { const ks = (sh.pair || sh.tri || [sh.a]).map(k => D.A[k]), a = ks[0];
    meta.innerHTML = `<span class="mx-kind mx-k-${a.k}">${esc(t("mx_k_" + a.k))}</span><span class="mx-cr">${ks.map(x => esc(x.n + " · " + x.y)).join(" | ")} · <a href="${esc(a.page)}" target="_blank" rel="noopener">${esc(ks.map(x => x.cr).filter((v, i, r) => r.indexOf(v) === i).join(" / "))}</a></span>`; }
  const ms = [...new Set((sh.pair || sh.tri || [sh.a || sh.bg]).filter(Boolean).flatMap(k => D.A[k].m || []))].filter(id => MB[id]);
  if (sh.card === "fail") ["mars-1960","mars-1","mariner-3","zond-2"].forEach(x => ms.push(x));
  if (sh.card === "mars23") ["mars-2","mars-3"].forEach(x => { if (!ms.includes(x)) ms.push(x); });
  if (sh.card === "fates") ["viking-1","phoenix","spirit","opportunity","mgs","maven","mars-2","mpl","beagle-2","exomars-2016"].forEach(x => { if (!ms.includes(x)) ms.push(x); });
  if (sh.card === "future") ["rosalind-franklin","tianwen-3","escapade","mmx","msr"].forEach(x => { if (!ms.includes(x)) ms.push(x); });
  $(".mx-chips").innerHTML = ms.length ? ms.map(id => `<button class="mx-chip" data-a="mis" data-id="${id}"><i class="mx-dot mx-o-${MB[id].out}"></i>${esc(MB[id].n)}</button>`).join("") : `<span class="mx-none">—</span>`;
  $(".mx-hot").classList.toggle("empty", !ms.length);
  if (S.playing) playVideos(true);
}
function frameFor(a, z, len, dim, pan) {
  const f = document.createElement("div"); f.className = "mx-frame" + (dim ? " mx-dim" : "") + (a.fit === "contain" && !pan ? " mx-contain" : "") + (pan ? " mx-panf" : "");
  let el;
  if (a.vid) { el = document.createElement("video"); el.muted = true; el.playsInline = true; el.setAttribute("playsinline", ""); el.loop = true; el.preload = "auto"; el.src = a.f; el.setAttribute("aria-hidden", "true");
    el.addEventListener("loadedmetadata", () => { f.dataset.w = el.videoWidth; f.dataset.h = el.videoHeight; fit(f); });
    el.addEventListener("error", () => { const fb = D.A[a.fb]; if (!fb) return; const im = document.createElement("img"); im.alt = fb.n; im.src = fb.f; im.onload = () => { f.dataset.w = im.naturalWidth; f.dataset.h = im.naturalHeight; fit(f); }; el.replaceWith(im); }); }
  else { el = document.createElement("img"); el.alt = a.n; el.decoding = "async"; el.src = a.f; el.addEventListener("load", () => { f.dataset.w = el.naturalWidth; f.dataset.h = el.naturalHeight; fit(f); }); if (el.complete && el.naturalWidth) { f.dataset.w = el.naturalWidth; f.dataset.h = el.naturalHeight; } }
  f.appendChild(el);
  if (pan && !C.reduced) { f.dataset.pan = 1; f.style.animationDuration = (len + 1.5) + "s"; f.classList.add("mx-pan"); }
  else if (z && !C.reduced) { f.style.setProperty("--s0", z[0]); f.style.setProperty("--s1", z[1]); f.style.transformOrigin = z[2] + "% " + z[3] + "%"; f.style.animationDuration = (len + 1.5) + "s"; f.classList.add("mx-kb"); }
  return f;
}
function fit(f) {
  const box = f.parentElement; if (!box || !f.dataset.w) return;
  const W = box.clientWidth, H = box.clientHeight, w = +f.dataset.w, h = +f.dataset.h;
  let sc = f.classList.contains("mx-contain") ? Math.min(W / w, H / h) * 0.9 : Math.max(W / w, H / h);
  if (f.dataset.pan) sc = Math.max(H / h, W / w);
  const fw = Math.round(w * sc), fh = Math.round(h * sc);
  f.style.width = fw + "px"; f.style.height = fh + "px"; f.style.top = Math.round((H - fh) / 2) + "px";
  if (f.dataset.pan) { f.style.left = "0px"; f.style.setProperty("--dx", Math.min(0, W - fw) + "px"); } else f.style.left = Math.round((W - fw) / 2) + "px";
}
function fitAll() { if (host) $$(".mx-frame").forEach(fit); }
function playVideos(on) { $$(".mx-slot.in video, .mx-slot:last-child video").forEach(v => { if (on) { v.playbackRate = S.rate; const p = v.play(); if (p && p.catch) p.catch(() => {}); } else v.pause(); }); }
function showEnd() {
  const el = $(".mx-intro"); if (!el) return; el.hidden = false; el.className = "mx-intro mx-pre";
  el.innerHTML = `<div class="mx-stars"></div><div class="mx-pre-in mx-end"><span class="mono mx-k">${esc(t("md_ended"))}</span><h1><span>${esc(t("mx_end_t"))}</span><small>${esc(t("mx_end_d"))}</small></h1>
   <div class="mx-ibtns"><button class="btn primary" data-a="restart">${esc(t("md_restart"))}</button><a class="btn" href="#mars-doc/archive">${esc(t("mx_archive_btn"))}</a><a class="btn" href="#mars-doc/sources">${esc(t("md_sources"))}</a><a class="btn" href="#mars">${esc(t("md_close"))}</a></div></div>`;
}

/* ── mission drawer ── */
function trRec(m) { if (L() === "en") return null; try { return JSON.parse(C.store.get("trmx:" + L() + ":" + m.id) || "null"); } catch (e) { return null; } }
function outBadge(m) { return `<span class="mx-out mx-o-${m.out}">${esc(t("mx_o_" + m.out))}</span>`; }
function openMis(id) {
  const m = MB[id]; if (!m) return; S.resumeAfter = S.playing; if (S.playing) pause();
  const a = m.img && D.A[m.img], src = D.SRC[m.src], tr = trRec(m), dr = $(".mx-drawer");
  dr.hidden = false;
  dr.innerHTML = `<div class="mx-dr" role="dialog" aria-label="${esc(m.n)}"><div class="mx-dr-h"><span class="mono">${esc(t("mx_ar_title"))}</span><button class="mx-ib" data-a="dclose" aria-label="${esc(t("md_close"))}">${ICO.close}</button></div>
   ${a ? `<figure class="mx-dr-img"><img src="${esc(thumb(a.f, a))}" alt="${esc(a.n)}"><figcaption class="mono">${esc(t("mx_k_" + a.k))} · ${esc(a.id)} · ${esc(a.cr)}</figcaption></figure>` : ""}
   <h3>${esc(m.n)}</h3><p class="mx-dr-sub mono">${esc(m.ag)} · ${m.y ? esc(t("mx_launch")) + " " + m.y : "—"} · ${esc(t("mx_t_" + m.type))}</p>${outBadge(m)}
   <p class="mx-dr-d"${tr ? "" : ' lang="en"'}>${esc((tr && tr.d) || m.d)}</p>
   ${L() !== "en" ? `<p class="mx-trbox notice" id="mx-trbox">${tr ? esc(t("translated_note")) : `<span>${esc(t("rec_english"))}</span> <button class="mx-lb" data-a="trmis" data-id="${m.id}">${esc(t("translate_rec"))}</button>`}</p>` : ""}
   ${src ? `<div class="mx-dr-src"><b class="mono">${esc(t("md_src"))}</b><a href="${esc(src.u)}" target="_blank" rel="noopener">${esc(src.t)} ${ICO.ext}</a></div>` : ""}
   <div class="mx-dr-btns">${m.site && C.byId[m.site] ? `<a class="btn" href="#m-${esc(m.site)}">${esc(t("mx_site_page"))}</a>` : ""}${S.resumeAfter ? `<button class="btn primary" data-a="dresume">${ICO.play} ${esc(t("md_resume"))}</button>` : ""}</div></div>`;
  setTimeout(() => { const b = $(".mx-dr [data-a=dclose]"); if (b) b.focus(); }, 30);
}
function closeDrawer() { const d = host && $(".mx-drawer"); if (d) { d.hidden = true; d.innerHTML = ""; } }
async function translateMis(id) {
  const m = MB[id], box = $("#mx-trbox"); if (!m) return; if (box) box.textContent = t("translating");
  const sample = C.getSample ? await C.getSample() : null; if (!sample) { if (box) box.textContent = t("nova_offline"); return; }
  const LN = {bn:"Bengali", es:"Spanish", fr:"French", ar:"Arabic"}[L()];
  try {
    const out = await sample.json(`Translate the string value of this JSON object about the Mars mission "${m.n}" into ${LN} for a space-science museum website. Keep mission, spacecraft and agency names exactly as written, and keep numbers and dates unchanged. Return only the JSON object.\n\n${JSON.stringify({d:m.d})}`, {modelTier:"quick"});
    if (!out || typeof out.d !== "string") throw new Error("bad");
    C.store.set("trmx:" + L() + ":" + m.id, JSON.stringify({d:out.d})); if (S.view === "archive") renderArchive(); openMis(id);
  } catch (e) { if (box) box.textContent = t(e && e.code === "not_granted" ? "nova_offline" : "nova_err"); }
}

/* ── ARCHIVE ── */
function showArchive() {
  if (S.view === "watch") pause(); S.view = "archive"; setTab("archive");
  const ags = [...new Set(D.M.map(m => m.ag))].sort(), opt = (v, l, c) => `<option value="${esc(v)}"${v === c ? " selected" : ""}>${esc(l)}</option>`;
  $(".mx-body").innerHTML = `<div class="mx-page"><div class="mx-wrap">
   <header class="mx-ph"><span class="mono mx-k">${esc(t("mx_title"))} · ${esc(t("mx_title2"))}</span><h2>${esc(t("mx_ar_title"))}</h2><p>${esc(t("mx_ar_desc"))}</p></header>
   <div class="mx-typebar" role="group">${["", ...TYPES].map(ty => `<button data-a="ty" data-v="${ty}" aria-pressed="${S.ar.ty === ty}">${esc(ty ? t("mx_t_" + ty) : t("md_all"))} <b>${ty ? D.M.filter(m => m.type === ty).length : D.M.length}</b></button>`).join("")}</div>
   <div class="mx-filt"><input type="search" class="mx-q" placeholder="${esc(t("mx_search"))}" aria-label="${esc(t("mx_search"))}" value="${esc(S.ar.q)}">
    <label><span>${esc(t("md_f_agency"))}</span><select data-f="ag">${opt("", t("md_all"), S.ar.ag)}${ags.map(a => opt(a, a, S.ar.ag)).join("")}</select></label>
    <label><span>${esc(t("md_col_status"))}</span><select data-f="ou">${opt("", t("md_all"), S.ar.ou)}${OUTS.map(o => opt(o, t("mx_o_" + o), S.ar.ou)).join("")}</select></label>
    <button class="btn" data-a="reset">${esc(t("md_reset"))}</button></div>
   <p class="mx-count mono" aria-live="polite"></p><div class="mx-tl"></div></div></div>`;
  renderArchive();
}
function renderArchive() {
  const q = S.ar.q.trim().toLowerCase();
  const list = D.M.filter(m => (!S.ar.ty || m.type === S.ar.ty) && (!S.ar.ou || m.out === S.ar.ou) && (!S.ar.ag || m.ag === S.ar.ag) && (!q || [m.n, m.ag, m.y, m.d, t("mx_t_" + m.type), t("mx_o_" + m.out)].join(" ").toLowerCase().includes(q)));
  $(".mx-count").textContent = t("mx_count", {n:list.length});
  $(".mx-tl").innerHTML = list.length ? list.map(m => { const a = m.img && D.A[m.img], tr = trRec(m); return `<article class="mx-item">
    <div class="mx-yr mono">${m.y || "—"}</div>
    <div class="mx-ic">${a ? icon(a.f) : `<span class="mx-noimg mono">${esc(t("mx_t_" + m.type))}</span>`}</div>
    <div class="mx-it"><div class="mx-it-h">${outBadge(m)}<span class="mono">${esc(t("mx_t_" + m.type))} · ${esc(m.ag)}</span></div><h3><button data-a="mis" data-id="${m.id}">${esc(m.n)}</button></h3><p${tr ? "" : ' lang="en"'}>${esc((tr && tr.d) || m.d)}</p></div></article>`; }).join("") : `<p class="mx-none">${esc(t("md_none"))}</p>`;
  $$(".mx-typebar button").forEach(b => b.setAttribute("aria-pressed", String(S.ar.ty === b.dataset.v)));
}

/* ── SOURCES ── */
function showSources() {
  if (S.view === "watch") pause(); S.view = "sources"; setTab("sources");
  const used = {}; D.CH.forEach((c, i) => c.shots.forEach(sh => (sh.pair || sh.tri || [sh.a || sh.bg]).filter(Boolean).forEach(k => (used[k] = used[k] || new Set()).add(i + 1))));
  used.vm = (used.vm || new Set()); used.vm.add(t("mx_opening"));
  const keys = Object.keys(used), vid = keys.filter(k => D.A[k].vid), img = keys.filter(k => !D.A[k].vid);
  const row = k => { const a = D.A[k]; return `<tr><td>${[...used[k]].join(", ")}</td><td>${esc(a.n)}</td><td>${esc(t("mx_k_" + a.k))} · ${esc(a.id)} · ${a.y}</td><td><a href="${esc(a.page)}" target="_blank" rel="noopener">${esc(a.page.replace(/^https?:\/\//, "").slice(0, 44))}</a></td><td><a class="mono" href="${esc(a.f)}" target="_blank" rel="noopener">${esc(a.f)}</a></td><td>${esc(a.cr)}</td></tr>`; };
  const head = `<tr><th>${esc(t("mx_used"))}</th><th>${esc(t("md_col_veh"))}</th><th>${esc(t("md_col_desc"))}</th><th>${esc(t("md_col_src"))}</th><th>${esc(t("md_col_asset"))}</th><th>${esc(t("md_col_attr"))}</th></tr>`;
  $(".mx-body").innerHTML = `<div class="mx-page"><div class="mx-wrap">
   <header class="mx-ph"><span class="mono mx-k">${esc(t("mx_title"))} · ${esc(t("mx_title2"))}</span><h2>${esc(t("mx_inv"))}</h2><p>${esc(t("mx_gen_note"))}</p></header>
   <section><h3>${esc(t("md_inv_narr"))}</h3><p>${esc(t("mx_narr_note"))}</p><p class="mx-fact">${esc(t("mx_cap_note"))}</p>
    <div class="tablewrap"><table class="mx-tbl"><thead><tr><th>${esc(t("md_col_ch"))}</th><th>${esc(t("md_col_desc"))}</th><th>${esc(t("md_dur"))}</th><th>${esc(t("md_col_status"))}</th></tr></thead><tbody>
    ${D.CH.map((c, i) => `<tr><td>${i + 1}</td><td>${esc(t("mx_c" + (i + 1)))}</td><td>${fmt(Q.durs[i])} (${fmt(Q.off[i])}–${fmt(Q.off[i] + Q.durs[i])})</td><td>${esc(t("md_st_int"))}</td></tr>`).join("")}</tbody></table></div>
    <p><a class="mono" href="mx/audio/mars_narration.mp3" target="_blank" rel="noopener">mars_narration.mp3</a> · ${fmt(Q.total)} · ${["en","bn","es","fr","ar"].map(l => `<a class="mono" href="mx/vtt/mars.${l}.vtt" target="_blank" rel="noopener">${l}.vtt</a>`).join(" · ")}</p></section>
   <section><h3>${esc(t("md_inv_foot"))}</h3><div class="tablewrap"><table class="mx-tbl"><thead>${head}</thead><tbody>${vid.map(row).join("")}</tbody></table></div></section>
   <section><h3>${esc(t("md_inv_photo"))}</h3><div class="tablewrap"><table class="mx-tbl"><thead>${head}</thead><tbody>${img.map(row).join("")}</tbody></table></div></section>
   <section><h3>${esc(t("md_inv_music"))}</h3><p>${esc(t("mx_music_note"))}</p><p><a class="mono" href="mx/audio/mars_score.mp3" target="_blank" rel="noopener">mars_score.mp3</a> · ${fmt(Q.total)} · Forgotten Explorers (heisenberg.exe)</p></section>
   <section><h3>${esc(t("md_inv_ni"))}</h3><div class="tablewrap"><table class="mx-tbl"><thead><tr><th>${esc(t("md_col_desc"))}</th><th>${esc(t("md_col_src"))}</th><th>${esc(t("md_col_why"))}</th></tr></thead><tbody>
    ${D.NOTINT.map(n => `<tr><td lang="en">${esc(n.what)}</td><td>${/^https?:/.test(n.src) ? `<a href="${esc(n.src)}" target="_blank" rel="noopener">${esc(n.src.replace(/^https?:\/\//, "").slice(0, 46))}</a>` : esc(n.src)}</td><td lang="en">${esc(n.why)}</td></tr>`).join("")}</tbody></table></div></section>
   <section><h3>${esc(t("md_src"))}</h3><ul class="mx-srcl">${Object.values(D.SRC).map(s => `<li><a href="${esc(s.u)}" target="_blank" rel="noopener">${esc(s.t)} ${ICO.ext}</a></li>`).join("")}</ul></section></div></div>`;
}

/* ── events ── */
function onClick(e) {
  const b = e.target.closest("[data-a]"); if (!b || !host.contains(b)) return;
  switch (b.dataset.a) {
    case "exit": C.exit(); break;
    case "begin": if (S.view !== "watch") showWatch(); seek(0); play(); break;
    case "pp": if (S.ended) { seek(0); play(); break; } S.playing ? pause() : play(); break;
    case "restart": if (S.view !== "watch") C.go(""); seek(0); play(); break;
    case "prev": { const tm = S.na.currentTime, c = chAt(tm), st = i => i === 0 ? 0 : Q.off[i] - GAP + 0.05; seek(tm - st(c) > 4 || c === 0 ? st(c) : st(c - 1)); break; }
    case "next": { const c = chAt(S.na.currentTime); if (c < 6) seek(Q.off[c + 1] - GAP + 0.05); break; }
    case "ch": { const c = +b.dataset.ch; if (S.view !== "watch") showWatch(); seek(c === 0 ? 0 : Q.off[c] - GAP + 0.05); play(); break; }
    case "music": S.music = !S.music; C.store.set("mx:music", S.music ? "1" : "0"); paintMusic(); if (S.music) syncMusic(true); else S.mu.pause(); break;
    case "fs": toggleFs(); break;
    case "tr": toggleTr(); break;
    case "cue": seek(+b.dataset.s + 0.01); break;
    case "mis": openMis(b.dataset.id); break;
    case "dclose": closeDrawer(); break;
    case "dresume": closeDrawer(); play(); break;
    case "trmis": translateMis(b.dataset.id); break;
    case "ty": S.ar.ty = b.dataset.v; renderArchive(); break;
    case "reset": S.ar = {q:"", ty:"", ou:"", ag:""}; S.view = null; showArchive(); break;
  }
}
function onInput(e) {
  const el = e.target;
  if (el.classList.contains("mx-seek")) { S.seeking = e.type === "input"; seek(el.value / 1000 * Q.total); if (e.type === "change") S.seeking = false; }
  else if (el.classList.contains("mx-nv")) { S.nv = +el.value; C.store.set("mx:nv", S.nv); applyVol(); }
  else if (el.classList.contains("mx-mv")) { S.mv = +el.value; C.store.set("mx:mv", S.mv); applyVol(); }
  else if (el.classList.contains("mx-rate") && e.type === "change") { S.rate = +el.value; C.store.set("mx:rate", S.rate); S.na.playbackRate = S.mu.playbackRate = S.rate; $$("video", host).forEach(v => v.playbackRate = S.rate); }
  else if (el.classList.contains("mx-ccs") && e.type === "change") { S.cc = el.value; C.store.set("mx:cc", S.cc); S.caps = null; buildTranscript(); update(true); }
  else if (el.classList.contains("mx-q") && e.type === "input") { S.ar.q = el.value; renderArchive(); }
  else if (el.dataset.f && el.tagName === "SELECT" && e.type === "change") { S.ar[el.dataset.f] = el.value; renderArchive(); }
}
function onKey(e) {
  if (!S || !host.isConnected) return;
  if (e.key === "Escape") { if (!$(".mx-drawer").hidden) { closeDrawer(); e.preventDefault(); return; } if (document.fullscreenElement) return; C.exit(); return; }
  if (S.view !== "watch" || (/INPUT|SELECT|TEXTAREA/.test(e.target.tagName) && e.target.type !== "range")) return;
  const k = e.key.toLowerCase();
  if (k === " " || k === "k") { e.preventDefault(); onClick({target:$(".mx-pp")}); }
  else if (k === "arrowright" && e.target.type !== "range") seek(S.na.currentTime + 5);
  else if (k === "arrowleft" && e.target.type !== "range") seek(S.na.currentTime - 5);
  else if (k === "n") onClick({target:$('[data-a="next"]')});
  else if (k === "p") onClick({target:$('[data-a="prev"]')});
  else if (k === "f") toggleFs();
  else if (k === "t") toggleTr();
  else if (k === "m") onClick({target:$('[data-a="music"]')});
  else if (k === "c") { const s = $(".mx-ccs"), o = [...s.options].map(x => x.value); S.cc = o[(o.indexOf(S.cc) + 1) % o.length]; s.value = S.cc; C.store.set("mx:cc", S.cc); S.caps = null; buildTranscript(); update(true); }
}
function toggleTr() { S.trOpen = !S.trOpen; const s = $(".mx-side"); if (s) s.hidden = !S.trOpen; host.classList.toggle("mx-tropen", S.trOpen); setTimeout(fitAll, 30); if (S.trOpen) update(true); }
function toggleFs() { try { if (document.fullscreenElement) document.exitFullscreen(); else host.requestFullscreen && host.requestFullscreen(); } catch (e) {} }
function toast(msg) { const c = $(".mx-cap"); if (c) { c.hidden = false; c.innerHTML = `<span class="mx-err">${esc(msg)}</span>`; } }
return {start, stop, nav, _s:() => S};
})();
