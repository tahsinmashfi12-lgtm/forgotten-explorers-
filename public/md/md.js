/* THE MOON: HUMANITY'S JOURNEY TO ANOTHER WORLD — interactive documentary player, lunar hardware archive and media inventory.
   Narration and score are separate <audio> tracks with independent volume. Visuals, captions, transcript and hotspots follow
   the narration clock. All strings come from FE_T (md-i18n.js); captions from FE_MD_CUES. */
window.FE_MDX = (function () {
"use strict";
let C, host, D, CUES, S = null, raf = 0, keyH = null, fsH = null;
const $ = (s, r) => (r || host).querySelector(s), $$ = (s, r) => [...(r || host).querySelectorAll(s)];
const t = (k, v) => C.t(k, v), esc = s => C.esc(String(s == null ? "" : s));
const L = () => C.lang();
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
  pin:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="5" fill="currentColor"/><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>',
  ext:'<svg viewBox="0 0 24 24" aria-hidden="true" width="13" height="13"><path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6" stroke="currentColor" stroke-width="2" fill="none"/></svg>'
};
const FATES = ["left","done","lost","unk","crash","impact"];

/* ── data helpers ── */
let ITEMS = [], BYID = {}, MIS = {};
function prepData() {
  const hw = (window.HW_ITEMS || []).filter(i => i.dest === "moon");
  ITEMS = hw.concat(D.EXTRA);
  BYID = {}; ITEMS.forEach(i => BYID[i.id] = i);
  MIS = {}; (window.HW_MISSIONS || []).forEach(m => MIS[m.id] = m);
}
const iname = i => C.tc ? C.tc("hwn", i.id, i.name) : i.name;
const agencyOf = i => D.AGENCY[i.id] || (MIS[i.mission] && MIS[i.mission].agency) || (i.id.startsWith("lev") ? "JAXA" : "—");
const misName = i => (MIS[i.mission] && MIS[i.mission].name) || (i.mission === "slim" ? "SLIM" : i.mission || "");
const catLabel = c => c === "robot" ? t("md_c_robot") : (C.T["hw_c_" + c] ? t("hw_c_" + c) : c);
const fateOf = id => D.FATE[id] || "unk";
const fateBadge = id => { const f = fateOf(id); return `<span class="md-fate md-f-${f}">${esc(t("md_f_" + f))}</span>`; };
function trRec(i) { if (L() === "en") return {}; try { const o = JSON.parse(C.store.get("trh:" + L() + ":" + i.id) || "null"); return o && typeof o === "object" ? o : {}; } catch (e) { return {}; } }
const kindLabel = k => t("md_k_" + k);
function shotAssets(sh) { return sh.pair || sh.tri || (sh.a ? [sh.a] : sh.bg ? [sh.bg] : []); }
function shotVehicles(sh) {
  if (sh.v) return sh.v;
  const s = new Set(); shotAssets(sh).forEach(k => (D.A[k].v || []).forEach(x => s.add(x))); return [...s];
}

/* ── shell ── */
function start(h, ctx) {
  host = h; C = ctx; D = window.FE_MD; CUES = window.FE_MD_CUES; prepData();
  S = {view:null, ch:0, shot:-1, cue:-1, playing:false, ended:false, cc:C.store.get("md:cc") || (L() === "en" ? "en" : L()), trOpen:false,
       nv:+(C.store.get("md:nv") || 1), mv:+(C.store.get("md:mv") || 0.55), rate:+(C.store.get("md:rate") || 1), ar:{q:"", ag:"", mi:"", ty:"", fa:""}};
  if (S.cc !== "off" && S.cc !== "en" && S.cc !== L()) S.cc = L();
  host.innerHTML = `<div class="md-top"><div class="md-brand"><b>${esc(t("md_title"))}</b><span>${esc(t("md_sub"))}</span></div>
    <nav class="md-tabs" aria-label="${esc(t("md_title"))}"><a href="#moon-doc" data-tab="watch">${esc(t("md_watch"))}</a><a href="#moon-doc/archive" data-tab="archive">${esc(t("md_archive_btn"))}</a><a href="#moon-doc/sources" data-tab="sources">${esc(t("md_sources"))}</a></nav>
    <button class="md-ib md-x" data-a="exit" aria-label="${esc(t("md_close"))}" title="${esc(t("md_close"))}">${ICO.close}</button></div>
    <div class="md-body"></div><div class="md-drawer" hidden></div>
    <audio class="md-narr" preload="metadata"></audio><audio class="md-music" preload="metadata"></audio>`;
  S.na = $(".md-narr"); S.mu = $(".md-music");
  host.addEventListener("click", onClick);
  host.addEventListener("input", onInput);
  host.addEventListener("change", onInput);
  keyH = onKey; document.addEventListener("keydown", keyH);
  fsH = () => { host.classList.toggle("md-isfs", document.fullscreenElement === host); fitAll(); };
  document.addEventListener("fullscreenchange", fsH);
  window.addEventListener("resize", fitAll);
  S.na.addEventListener("ended", onEnded);
  S.na.addEventListener("error", () => { if (S && S.na.getAttribute("src")) toast(t("md_audio_err")); });
  S.na.addEventListener("play", () => { if (!S) return; S.playing = true; syncMusic(true); playVideos(true); paintPlay(); });
  S.na.addEventListener("pause", () => { if (!S) return; S.playing = false; S.mu.pause(); playVideos(false); paintPlay(); });
  S.na.addEventListener("loadedmetadata", () => { if (S) paintTime(); });
  nav(ctx.arg || "");
  loop();
}
function stop() {
  cancelAnimationFrame(raf); raf = 0;
  if (S) { try { S.na.pause(); S.mu.pause(); S.na.removeAttribute("src"); S.mu.removeAttribute("src"); S.na.load(); S.mu.load(); } catch (e) {} }
  document.removeEventListener("keydown", keyH); document.removeEventListener("fullscreenchange", fsH);
  window.removeEventListener("resize", fitAll);
  if (document.fullscreenElement === host) { try { document.exitFullscreen(); } catch (e) {} }
  S = null;
}
function nav(arg) {
  arg = (arg || "").replace(/^\//, "");
  closeDrawer();
  if (arg === "archive") return showArchive();
  if (arg === "sources") return showSources();
  const n = +arg;
  if (n >= 1 && n <= 6) return showWatch(n - 1, false);
  showWatch(null);
}
function setTab(k) { $$(".md-tabs a").forEach(a => a.toggleAttribute("aria-current", a.dataset.tab === k)); }

/* ── WATCH ── */
function showWatch(ch, autoplay) {
  setTab("watch");
  if (S.view !== "watch") {
    S.view = "watch";
    $(".md-body").innerHTML = `<div class="md-watch">
      <div class="md-stage" tabindex="-1"><div class="md-vis"></div><div class="md-card" hidden></div>
        <div class="md-pins"></div><div class="md-meta"></div><div class="md-cap" aria-live="off"></div>
        <div class="md-intro"></div></div>
      <aside class="md-side" hidden><div class="md-side-h"><b>${esc(t("md_tr"))}</b><small>${esc(t("md_tr_hint"))}</small><button class="md-ib" data-a="tr" aria-label="${esc(t("md_close"))}">${ICO.close}</button></div><ol class="md-trl"></ol></aside>
      <div class="md-hot"><span class="mono">${esc(t("md_hot"))}</span><div class="md-chips"></div></div>
      <div class="md-ctl">
        <input type="range" class="md-seek" min="0" max="1000" value="0" step="1" aria-label="${esc(t("md_seek"))}">
        <div class="md-row">
          <button class="md-ib" data-a="prev" aria-label="${esc(t("md_prev"))}" title="${esc(t("md_prev"))}">${ICO.prev}</button>
          <button class="md-ib md-pp" data-a="pp" aria-label="${esc(t("md_play"))}" title="${esc(t("md_play"))}">${ICO.play}</button>
          <button class="md-ib" data-a="next" aria-label="${esc(t("md_next"))}" title="${esc(t("md_next"))}">${ICO.next}</button>
          <button class="md-ib" data-a="replay" aria-label="${esc(t("md_replay"))}" title="${esc(t("md_replay"))}">${ICO.replay}</button>
          <span class="md-time mono"><span class="md-cur">0:00</span> / <span class="md-dur">0:00</span></span>
          <span class="md-chname"></span>
          <span class="md-sp"></span>
          <label class="md-vol"><span>${esc(t("md_narr"))}</span><input type="range" class="md-nv" min="0" max="1" step="0.05" value="${S.nv}" aria-label="${esc(t("md_narr"))}"></label>
          <label class="md-vol"><span>${esc(t("md_music"))}</span><input type="range" class="md-mv" min="0" max="1" step="0.05" value="${S.mv}" aria-label="${esc(t("md_music"))}"></label>
          <label class="md-sel"><span>${esc(t("md_speed"))}</span><select class="md-rate" aria-label="${esc(t("md_speed"))}">${[0.75,1,1.25,1.5].map(r => `<option value="${r}"${r === S.rate ? " selected" : ""}>${r}×</option>`).join("")}</select></label>
          <label class="md-sel"><span>${esc(t("md_cc"))}</span><select class="md-ccs" aria-label="${esc(t("md_cc"))}">${ccOptions()}</select></label>
          <button class="md-ib" data-a="tr" aria-label="${esc(t("md_tr"))}" title="${esc(t("md_tr"))}">${ICO.tr}</button>
          <button class="md-ib" data-a="fs" aria-label="${esc(t("md_fs"))}" title="${esc(t("md_fs"))}">${ICO.fs}</button>
        </div>
        <div class="md-chbar">${D.CH.map((c, i) => `<a href="#moon-doc/${i + 1}" data-ch="${i}"><b>${i + 1}</b><span>${esc(t("md_c" + (i + 1)))}</span></a>`).join("")}</div>
        <p class="md-keys mono">${esc(t("md_kb"))}</p>
      </div></div>`;
    S.slots = []; S.shot = -1; S.cue = -1;
  }
  if (ch == null) { if (S.loaded == null) { loadChapter(0); showIntro(); } return; }
  loadChapter(ch); hideIntro();
  if (autoplay !== false || S.wasPlaying) play();
}
function ccOptions() {
  const o = [["off", t("md_off")], ["en", "English"]];
  if (L() !== "en") o.push([L(), (C.langs.find(l => l.code === L()) || {}).label || L()]);
  return o.map(([v, l]) => `<option value="${v}"${v === S.cc ? " selected" : ""}>${esc(l)}</option>`).join("");
}
function showIntro() {
  const el = $(".md-intro"); el.hidden = false;
  const tot = D.CH.reduce((a, c) => a + c.dur, 0);
  el.innerHTML = `<div class="md-intro-in"><span class="mono md-k">${esc(t("md_kicker"))} · ${esc(t("md_mins", {m:Math.round(tot / 60)}))}</span>
    <h1>${esc(t("md_title"))}</h1><p class="md-sub">${esc(t("md_sub"))}</p><p class="md-desc">${esc(t("md_desc"))}</p>
    <div class="md-ibtns"><button class="btn primary" data-a="begin">${ICO.play} ${esc(t("md_btn"))}</button><a class="btn" href="#moon-doc/archive">${esc(t("md_archive_btn"))}</a></div>
    <ol class="md-chlist">${D.CH.map((c, i) => { const a = D.A[c.shots[0].a || c.shots[0].bg || "fullmoon"]; return `<li><a href="#moon-doc/${i + 1}">${icon(a.f)}<span><small class="mono">${esc(t("md_ch", {n:i + 1}))} · ${fmt(c.dur)}</small><b>${esc(t("md_c" + (i + 1)))}</b></span></a></li>`; }).join("")}</ol>
    <p class="md-hint mono">${esc(t("md_start_hint"))}</p></div>`;
}
function hideIntro() { const el = $(".md-intro"); if (el) { el.hidden = true; el.innerHTML = ""; } }
function thumb(f) { return /^(img|hw\/img)\/[^/]+\.(jpg|webp)$/.test(f) ? f.replace(/\/([^/]+)$/, "/t/$1") : f; }
/*SPRITE*/const SPR = {cols:6, rows:4, i:{"md/img/csm15.webp":0,"md/img/isro_p11.webp":1,"md/img/isro_p8.webp":2,"md/img/lroc_01.webp":3,"md/img/lroc_02.webp":4,"md/img/lroc_03.webp":5,"md/img/lroc_04.webp":6,"md/img/lroc_05.webp":7,"md/img/lroc_06.webp":8,"md/img/lroc_07.webp":9,"md/img/lroc_09.jpg":10,"md/img/lroc_10.webp":11,"md/img/lroc_11.webp":12,"md/img/lroc_12.webp":13,"md/img/lroc_13.webp":14,"md/img/lroc_14.webp":15,"md/img/lroc_15.webp":16,"md/img/lroc_16.webp":17,"md/img/lroc_17.webp":18,"md/img/lroc_18.webp":19,"md/img/lroc_19.jpg":20,"md/img/s1shadow.webp":21}};/*/SPRITE*/
/* small list icons come from one sprite sheet instead of full-size photographs (archive lists load ~200 KB instead of several MB) */
function icon(f, extra) {
  const i = SPR.i && SPR.i[f];
  if (i == null) return `<img src="${esc(thumb(f))}" alt="" loading="lazy" decoding="async"${extra || ""}>`;
  const x = SPR.cols > 1 ? (i % SPR.cols) / (SPR.cols - 1) * 100 : 0, y = SPR.rows > 1 ? Math.floor(i / SPR.cols) / (SPR.rows - 1) * 100 : 0;
  return `<span class="md-spr" aria-hidden="true" style="background-size:${SPR.cols * 100}% ${SPR.rows * 100}%;background-position:${x.toFixed(4)}% ${y.toFixed(4)}%"></span>`;
}

function loadChapter(i) {
  const c = D.CH[i]; S.ch = i; S.loaded = i; S.shot = -1; S.cue = -1; S.ended = false;
  S.na.src = c.audio; S.mu.src = c.score; S.mu.loop = false;
  S.na.playbackRate = S.mu.playbackRate = S.rate;
  applyVol();
  $(".md-chname").textContent = t("md_ch", {n:i + 1}) + " · " + t("md_c" + (i + 1));
  $(".md-dur").textContent = fmt(c.dur);
  $$(".md-chbar a").forEach(a => a.toggleAttribute("aria-current", +a.dataset.ch === i));
  buildTranscript(); update(true);
  preload(i);
}
function preload(i) {
  const c = D.CH[i]; const seen = new Set();
  c.shots.forEach(sh => shotAssets(sh).forEach(k => { const a = D.A[k]; if (!a.vid && !seen.has(a.f)) { seen.add(a.f); const im = new Image(); im.src = a.f; } }));
}
function capList(i) { const lang = S.cc === "off" ? (L() === "en" ? "en" : L()) : S.cc; const en = CUES.en[i]; const tr = lang !== "en" && CUES[lang] ? CUES[lang][i] : null; return en.map((c, j) => ({s:c[0], e:c[1], t:tr ? tr[j] : c[2], en:c[2]})); }
function buildTranscript() {
  const list = capList(S.ch);
  const tl = $(".md-trl"); if (!tl) return;
  const translated = list.length && list[0].t !== list[0].en;
  tl.innerHTML = (translated ? `<li class="md-trnote">${esc(t("md_tr_note"))}</li>` : "") + list.map((c, j) => `<li><button data-a="cue" data-i="${j}" data-s="${c.s}"><time class="mono">${fmt(c.s)}</time><span>${esc(c.t)}</span></button></li>`).join("");
  tl.dir = S.cc === "ar" || (S.cc === "off" && L() === "ar") ? "rtl" : "ltr";
}
function play() {
  hideIntro();
  const p = S.na.play(); if (p && p.catch) p.catch(() => { S.playing = false; paintPlay(); });
}
function pause() { S.na.pause(); }
function syncMusic(force) {
  if (!S || !S.mu.src) return;
  const tgt = S.na.currentTime;
  if (tgt >= S.mu.duration - 0.05) { S.mu.pause(); return; }
  if (force || Math.abs(S.mu.currentTime - tgt) > 0.35) { try { S.mu.currentTime = tgt; } catch (e) {} }
  if (S.playing && S.mu.paused) { const p = S.mu.play(); if (p && p.catch) p.catch(() => {}); }
}
function applyVol() { if (!S) return; S.na.volume = S.nv; S.mu.volume = S.mv * (S.duck == null ? 1 : S.duck); }
function onEnded() {
  if (!S) return;
  S.playing = false; paintPlay();
  if (S.ch < 5) { S.wasPlaying = true; setTimeout(() => { if (S && S.view === "watch" && S.na.ended) C.go(String(S.ch + 2)); }, 1400); }
  else { S.ended = true; S.wasPlaying = false; showEnd(); }
}
function showEnd() {
  const el = $(".md-intro"); el.hidden = false;
  el.innerHTML = `<div class="md-intro-in md-end"><span class="mono md-k">${esc(t("md_ended"))}</span><h1>${esc(t("md_end_t"))}</h1><p class="md-desc">${esc(t("md_end_d"))}</p>
   <div class="md-ibtns"><a class="btn primary" href="#moon-doc/1">${esc(t("md_restart"))}</a><a class="btn" href="#moon-doc/archive">${esc(t("md_archive_btn"))}</a><a class="btn" href="#moon-doc/sources">${esc(t("md_sources"))}</a><a class="btn" href="#moon">${esc(t("md_close"))}</a></div></div>`;
}
function paintPlay() {
  const b = $(".md-pp"); if (!b) return;
  b.innerHTML = S.playing ? ICO.pause : ICO.play; const l = t(S.playing ? "md_pause" : "md_play"); b.setAttribute("aria-label", l); b.title = l;
  host.classList.toggle("md-playing", S.playing);
}
function paintTime() {
  const c = D.CH[S.ch], cur = S.na.currentTime || 0, d = S.na.duration || c.dur;
  const cu = $(".md-cur"); if (cu) cu.textContent = fmt(cur);
  const sk = $(".md-seek"); if (sk && !S.seeking) { sk.value = Math.round(cur / d * 1000); sk.style.setProperty("--p", (cur / d * 100).toFixed(2) + "%"); sk.setAttribute("aria-valuetext", fmt(cur) + " / " + fmt(d)); }
}
function loop() {
  raf = requestAnimationFrame(loop);
  if (!S || S.view !== "watch") return;
  update(false);
}
function update(force) {
  const c = D.CH[S.ch]; const tm = S.na.currentTime || 0;
  let si = 0; for (let k = 0; k < c.shots.length; k++) if (tm >= c.shots[k].s - 0.02) si = k;
  if (force || si !== S.shot) renderShot(si, force);
  const list = capList(S.ch); let ci = -1;
  for (let k = 0; k < list.length; k++) if (tm >= list[k].s - 0.05 && tm <= list[k].e + 0.45) ci = k;
  if (force || ci !== S.cue) renderCue(ci, list);
  /* gentle ducking of the score under speech */
  const want = ci >= 0 ? 0.72 : 1; S.duck = S.duck == null ? want : S.duck + (want - S.duck) * 0.06; applyVol();
  if (S.playing) syncMusic(false);
  paintTime();
}
function renderCue(ci, list) {
  S.cue = ci;
  const cap = $(".md-cap");
  if (cap) {
    if (S.cc === "off" || ci < 0) { cap.innerHTML = ""; cap.hidden = true; }
    else { cap.hidden = false; cap.dir = S.cc === "ar" ? "rtl" : "ltr"; cap.innerHTML = `<span>${esc(list[ci].t)}</span>`; }
  }
  $$(".md-trl button").forEach(b => { const on = +b.dataset.i === ci; b.classList.toggle("on", on); if (on && S.trOpen) { const p = b.closest(".md-trl"); const top = b.offsetTop - p.clientHeight / 3; p.scrollTo({top, behavior:C.reduced ? "auto" : "smooth"}); } });
}

/* visuals: two slots crossfade */
function renderShot(si, instant) {
  const c = D.CH[S.ch], sh = c.shots[si]; S.shot = si;
  const vis = $(".md-vis"); if (!vis) return;
  const nextT = si + 1 < c.shots.length ? c.shots[si + 1].s : c.dur; const len = Math.max(2, nextT - sh.s);
  const old = $$(".md-slot", vis);
  const slot = document.createElement("div"); slot.className = "md-slot";
  if (sh.card) {
    if (sh.bg) slot.appendChild(frameFor(D.A[sh.bg], [1.05, 1.15, 50, 50], len, true));
  } else if (sh.pair || sh.tri) {
    slot.classList.add("md-multi"); (sh.pair || sh.tri).forEach(k => { const cell = document.createElement("div"); cell.className = "md-cell"; cell.appendChild(frameFor(D.A[k], [1.0, 1.08, 50, 50], len)); const lb = document.createElement("span"); lb.className = "md-celll"; lb.textContent = D.A[k].n; cell.appendChild(lb); slot.appendChild(cell); });
  } else slot.appendChild(frameFor(D.A[sh.a], sh.z, len));
  vis.appendChild(slot);
  requestAnimationFrame(() => { slot.classList.add("in"); });
  old.forEach(o => { o.classList.remove("in"); o.classList.add("out"); o.querySelectorAll("video").forEach(v => v.pause()); setTimeout(() => o.remove(), instant ? 0 : 1300); });
  fitAll();
  /* card */
  const card = $(".md-card");
  if (sh.card) { card.hidden = false; card.innerHTML = cardHTML(sh.card); card.className = "md-card md-card-" + sh.card; }
  else { card.hidden = true; card.innerHTML = ""; }
  /* meta: kind · name · year · credit */
  const meta = $(".md-meta");
  if (sh.card) meta.innerHTML = sh.card === "end" ? "" : `<span class="md-kind md-kcard">${esc(t("md_k_card"))}</span>` + (sh.bg ? `<span class="md-cr">${esc(D.A[sh.bg].n)} · ${esc(D.A[sh.bg].cr)}</span>` : "");
  else { const ks = shotAssets(sh).map(k => D.A[k]); const a = ks[0];
    meta.innerHTML = `<span class="md-kind md-k-${a.k}">${esc(kindLabel(a.k))}</span><span class="md-cr">${ks.map(x => esc(x.n + " · " + x.y)).join(" | ")} · <a href="${esc(a.page)}" target="_blank" rel="noopener">${esc(ks.map(x => x.cr).filter((v, i, r) => r.indexOf(v) === i).join(" / "))}</a></span>`; }
  /* hotspots */
  const vs = shotVehicles(sh).filter(id => BYID[id]);
  $(".md-chips").innerHTML = vs.length ? vs.map(id => `<button class="md-chip" data-a="veh" data-id="${id}"><i class="md-dot md-f-${fateOf(id)}"></i>${esc(iname(BYID[id]))}</button>`).join("") : `<span class="md-none">—</span>`;
  $(".md-hot").classList.toggle("empty", !vs.length);
  if (S.playing) playVideos(true);
}
function frameFor(a, z, len, dim) {
  const f = document.createElement("div"); f.className = "md-frame" + (dim ? " md-dim" : "") + (a.fit === "contain" ? " md-contain" : "");
  f.dataset.k = Object.keys(D.A).find(k => D.A[k] === a);
  let el;
  if (a.vid) { el = document.createElement("video"); el.muted = true; el.playsInline = true; el.setAttribute("playsinline", ""); el.loop = true; el.preload = "auto"; el.src = a.f; el.setAttribute("aria-hidden", "true"); el.addEventListener("loadedmetadata", () => { f.dataset.w = el.videoWidth; f.dataset.h = el.videoHeight; fit(f); }); }
  else { el = document.createElement("img"); el.alt = a.n; el.decoding = "async"; el.src = a.f; el.addEventListener("load", () => { f.dataset.w = el.naturalWidth; f.dataset.h = el.naturalHeight; fit(f); }); if (el.complete && el.naturalWidth) { f.dataset.w = el.naturalWidth; f.dataset.h = el.naturalHeight; } }
  f.appendChild(el);
  if (!dim && a.p) a.p.forEach(([id, x, y]) => { if (!BYID[id]) return; const b = document.createElement("button"); b.className = "md-pin md-f-" + fateOf(id); b.style.left = x + "%"; b.style.top = y + "%"; b.dataset.a = "veh"; b.dataset.id = id; b.innerHTML = ICO.pin + `<span>${esc(iname(BYID[id]))}</span>`; b.setAttribute("aria-label", iname(BYID[id])); f.appendChild(b); });
  if (z && !C.reduced) { f.style.setProperty("--s0", z[0]); f.style.setProperty("--s1", z[1]); f.style.transformOrigin = z[2] + "% " + z[3] + "%"; f.style.animationDuration = (len + 1.4) + "s"; f.classList.add("md-kb"); }
  return f;
}
function fit(f) {
  const box = f.parentElement; if (!box || !f.dataset.w) return;
  const W = box.clientWidth, H = box.clientHeight, w = +f.dataset.w, h = +f.dataset.h;
  const sc = f.classList.contains("md-contain") ? Math.min(W / w, H / h) * 0.92 : Math.max(W / w, H / h);
  const fw = Math.round(w * sc), fh = Math.round(h * sc);
  f.style.width = fw + "px"; f.style.height = fh + "px"; f.style.left = Math.round((W - fw) / 2) + "px"; f.style.top = Math.round((H - fh) / 2) + "px";
}
function fitAll() { if (host) $$(".md-frame").forEach(fit); }
function playVideos(on) { $$(".md-slot.in video, .md-slot:last-child video").forEach(v => { if (on) { v.playbackRate = S.rate; const p = v.play(); if (p && p.catch) p.catch(() => {}); } else v.pause(); }); }
function cardHTML(k) {
  if (k === "end") return `<div class="md-endcard"><b>${esc(t("md_end_t"))}</b><span class="mono">${esc(t("md_end_d"))}</span></div>`;
  if (k === "crash") {
    const ids = ["surveyor-2","vikram-2","beresheet","hakuto-m1","luna-25","hakuto-m2"].filter(i => BYID[i]);
    return `<div class="md-cardin"><span class="mono md-k">${esc(t("md_k_card"))}</span><h3>${esc(t("md_card_crash_t"))}</h3><p>${esc(t("md_card_crash_d"))}</p><ul>${ids.map(i => `<li><button data-a="veh" data-id="${i}">${esc(iname(BYID[i]))} <small class="mono">${esc((BYID[i].date || "").slice(0, 4))} · ${esc(agencyOf(BYID[i]))}</small></button></li>`).join("")}</ul></div>`;
  }
  return `<div class="md-cardin"><span class="mono md-k">${esc(t("md_k_card"))}</span><h3>${esc(t("md_card_" + k + "_t"))}</h3><p>${esc(t("md_card_" + k + "_d"))}</p></div>`;
}

/* ── vehicle drawer (hotspot target) ── */
function openVeh(id) {
  const i = BYID[id]; if (!i) return;
  S.resumeAfter = S.playing; if (S.playing) pause();
  const tr = trRec(i), dr = $(".md-drawer");
  const m = C.byId && C.byId[i.mission] ? i.mission : (i.mission === "luna-17" && C.byId["lunokhod-1"]) ? "lunokhod-1" : (i.mission === "luna-21" && C.byId["lunokhod-2"]) ? "lunokhod-2" : null;
  const srcs = (i.src || []).map(s => (window.HW_SRC && window.HW_SRC[s]) || D.SRC[s]).filter(Boolean);
  const eng = i.eng ? Object.entries(i.eng).filter(([k, v]) => v) : [];
  dr.hidden = false;
  dr.innerHTML = `<div class="md-dr" role="dialog" aria-modal="false" aria-label="${esc(t("md_info"))}">
    <div class="md-dr-h"><span class="mono">${esc(t("md_info"))}</span><button class="md-ib" data-a="dclose" aria-label="${esc(t("md_close"))}">${ICO.close}</button></div>
    ${imgFor(i)}
    <h3>${esc(iname(i))}</h3>
    <p class="md-dr-sub mono">${esc(misName(i))} · ${esc(agencyOf(i))} · ${esc(catLabel(i.cat))}</p>
    ${fateBadge(i.id)}
    <dl class="md-dl">${i.date ? `<div><dt>${esc(t("md_date"))}</dt><dd>${esc(C.fmtDate ? C.fmtDate(i.date) : i.date)}</dd></div>` : ""}
     ${i.op ? `<div><dt>${esc(t("md_col_status"))}</dt><dd>${esc(t("hw_op_" + i.op.replace(/-/g, "_")))}</dd></div>` : ""}
     ${i.what ? `<div><dt>${esc(t("md_what"))}</dt><dd>${esc(tr.what || i.what)}</dd></div>` : ""}
     ${i.why ? `<div><dt>${esc(t("md_why"))}</dt><dd>${esc(tr.why || i.why)}</dd></div>` : ""}
     ${i.happened ? `<div><dt>${esc(t("md_happened"))}</dt><dd>${esc(tr.happened || i.happened)}</dd></div>` : ""}</dl>
    ${eng.length ? `<details class="md-eng"><summary>${esc(t("md_eng"))}</summary><dl class="md-dl">${eng.map(([k, v]) => `<div><dt>${esc(C.T["hw_" + k] ? t("hw_" + k) : k)}</dt><dd>${esc((tr.eng && tr.eng[k]) || v)}</dd></div>`).join("")}</dl></details>` : ""}
    ${L() !== "en" ? `<p class="md-trbox notice" id="md-trbox">${Object.keys(tr).length ? esc(t("translated_note")) : `<span>${esc(t("rec_english"))}</span> <button class="md-lb" data-a="trveh" data-id="${i.id}">${esc(t("translate_rec"))}</button>`}</p>` : ""}
    <div class="md-dr-src"><b class="mono">${esc(t("md_src"))}</b>${srcs.map(s => `<a href="${esc(s.url || s.u)}" target="_blank" rel="noopener">${esc(s.title || s.t)} ${ICO.ext}</a>`).join("")}</div>
    <div class="md-dr-btns">${i.loc && !i.id.startsWith("lev") ? `<a class="btn" href="#hw-${esc(i.id)}">${esc(t("md_open_hw"))}</a>` : ""}${m ? `<a class="btn" href="#m-${esc(m)}">${esc(t("md_open_m"))}</a>` : ""}${S.resumeAfter ? `<button class="btn primary" data-a="dresume">${ICO.play} ${esc(t("md_resume"))}</button>` : ""}</div>
  </div>`;
  host.classList.add("md-dropen");
  setTimeout(() => { const b = $(".md-dr [data-a=dclose]"); if (b) b.focus(); }, 30);
}
function imgFor(i) {
  const k = Object.keys(D.A).find(k => !D.A[k].vid && (D.A[k].p || []).some(p => p[0] === i.id)) || Object.keys(D.A).find(k => !D.A[k].vid && (D.A[k].v || [])[0] === i.id);
  if (!k) return "";
  const a = D.A[k];
  return `<figure class="md-dr-img"><img src="${esc(thumb(a.f))}" alt="${esc(a.n)}" loading="lazy"><figcaption class="mono">${esc(kindLabel(a.k))} · ${esc(a.id)} · ${esc(a.cr)}</figcaption></figure>`;
}
function closeDrawer() { const d = host && $(".md-drawer"); if (d) { d.hidden = true; d.innerHTML = ""; } if (host) host.classList.remove("md-dropen"); }
async function translateVeh(id) {
  const i = BYID[id], box = $("#md-trbox"); if (!i) return;
  if (box) box.textContent = t("translating");
  const sample = C.getSample ? await C.getSample() : null;
  if (!sample) { if (box) box.textContent = t("nova_offline"); return; }
  const LN = {bn:"Bengali", es:"Spanish", fr:"French", ar:"Arabic"}[L()];
  const rec = {what:i.what || "", why:i.why || "", happened:i.happened || ""}; if (i.eng) rec.eng = i.eng;
  try {
    const out = await sample.json(`Translate the string values of this JSON object about "${i.name}" (a human-made object on the Moon) into ${LN} for a space-science museum website. Keep official mission, spacecraft, instrument and agency names and acronyms exactly as written, and keep numbers, units, coordinates and dates unchanged. Keep the same keys. Return only the JSON object.\n\n${JSON.stringify(rec)}`, {modelTier:"quick"});
    if (!out || typeof out !== "object") throw new Error("bad");
    const prev = trRec(i); C.store.set("trh:" + L() + ":" + i.id, JSON.stringify(Object.assign(prev, out)));
    if (S.view === "archive") renderArchive(); openVeh(id);
  } catch (e) { if (box) box.textContent = t(e && e.code === "not_granted" ? "nova_offline" : "nova_err"); }
}

/* ── ARCHIVE ── */
function showArchive() {
  if (S.view === "watch") { S.wasPlaying = false; pause(); }
  S.view = "archive"; setTab("archive");
  const ags = [...new Set(ITEMS.map(agencyOf))].sort(), mis = [...new Set(ITEMS.map(i => i.mission))].sort((a, b) => misName(BYID[ITEMS.find(i => i.mission === a).id]).localeCompare(misName(BYID[ITEMS.find(i => i.mission === b).id])));
  const cats = [...new Set(ITEMS.map(i => i.cat))];
  const opt = (v, l, cur) => `<option value="${esc(v)}"${v === cur ? " selected" : ""}>${esc(l)}</option>`;
  $(".md-body").innerHTML = `<div class="md-page"><div class="md-wrap">
    <header class="md-ph"><span class="mono md-k">${esc(t("md_title"))}</span><h2>${esc(t("md_ar_title"))}</h2><p>${esc(t("md_ar_desc"))}</p></header>
    <div class="md-fatebar" role="group" aria-label="${esc(t("md_fates"))}">${FATES.map(f => `<button data-a="fate" data-f="${f}" aria-pressed="${S.ar.fa === f}"><i class="md-dot md-f-${f}"></i>${esc(t("md_f_" + f))} <b>${ITEMS.filter(i => fateOf(i.id) === f).length}</b></button>`).join("")}</div>
    <div class="md-filt">
      <input type="search" class="md-q" placeholder="${esc(t("md_search"))}" aria-label="${esc(t("md_search"))}" value="${esc(S.ar.q)}">
      <label><span>${esc(t("md_f_agency"))}</span><select data-f="ag">${opt("", t("md_all"), S.ar.ag)}${ags.map(a => opt(a, a, S.ar.ag)).join("")}</select></label>
      <label><span>${esc(t("md_f_mission"))}</span><select data-f="mi">${opt("", t("md_all"), S.ar.mi)}${mis.map(m => opt(m, misName(ITEMS.find(i => i.mission === m)), S.ar.mi)).join("")}</select></label>
      <label><span>${esc(t("md_f_type"))}</span><select data-f="ty">${opt("", t("md_all"), S.ar.ty)}${cats.map(c => opt(c, catLabel(c), S.ar.ty)).join("")}</select></label>
      <label><span>${esc(t("md_f_fate"))}</span><select data-f="fa">${opt("", t("md_all"), S.ar.fa)}${FATES.map(f => opt(f, t("md_f_" + f), S.ar.fa)).join("")}</select></label>
      <button class="btn" data-a="reset">${esc(t("md_reset"))}</button>
    </div>
    <p class="md-count mono" aria-live="polite"></p>
    <div class="md-grid"></div>
    <p class="md-note">${esc(t("hw_world_link"))} <a href="#hardware-moon">${esc(t("hw_moon"))} →</a></p>
  </div></div>`;
  renderArchive();
}
function renderArchive() {
  const q = S.ar.q.trim().toLowerCase();
  const list = ITEMS.filter(i => (!S.ar.ag || agencyOf(i) === S.ar.ag) && (!S.ar.mi || i.mission === S.ar.mi) && (!S.ar.ty || i.cat === S.ar.ty) && (!S.ar.fa || fateOf(i.id) === S.ar.fa)
    && (!q || [i.name, iname(i), misName(i), agencyOf(i), i.what, i.happened, catLabel(i.cat), t("md_f_" + fateOf(i.id))].join(" ").toLowerCase().includes(q)))
    .sort((a, b) => FATES.indexOf(fateOf(a.id)) - FATES.indexOf(fateOf(b.id)) || (a.date || "9").localeCompare(b.date || "9"));
  $(".md-count").textContent = t("md_count", {n:list.length});
  $(".md-grid").innerHTML = list.length ? list.map(i => { const tr = trRec(i); return `<article class="md-item">
    <div class="md-item-h">${fateBadge(i.id)}<small class="mono">${esc((i.date || "").slice(0, 4))}</small></div>
    <h3><button data-a="veh" data-id="${i.id}">${esc(iname(i))}</button></h3>
    <p class="mono md-item-m">${esc(misName(i))} · ${esc(agencyOf(i))} · ${esc(catLabel(i.cat))}</p>
    <p>${esc(tr.happened || i.happened || "")}</p></article>`; }).join("") : `<p class="md-none">${esc(t("md_none"))}</p>`;
  $$(".md-fatebar button").forEach(b => b.setAttribute("aria-pressed", String(S.ar.fa === b.dataset.f)));
}

/* ── SOURCES / INVENTORIES ── */
function showSources() {
  if (S.view === "watch") { S.wasPlaying = false; pause(); }
  S.view = "sources"; setTab("sources");
  const used = {}; D.CH.forEach((c, ci) => c.shots.forEach(sh => shotAssets(sh).forEach(k => { (used[k] = used[k] || new Set()).add(ci + 1); })));
  Object.keys(D.A).forEach(k => { if (!used[k] && D.A[k].ar) used[k] = new Set([t("md_archive_btn")]); });
  const keys = Object.keys(used);
  const foot = keys.filter(k => D.A[k].vid), photo = keys.filter(k => !D.A[k].vid);
  const chs = k => [...used[k]].sort().join(", ");
  const row = k => { const a = D.A[k]; return `<tr><td>${chs(k)}</td><td>${esc(a.n)}</td><td>${esc(kindLabel(a.k))} · ${esc(a.id)} · ${a.y}</td><td><a href="${esc(a.page)}" target="_blank" rel="noopener">${esc(a.page.replace(/^https?:\/\//, "").slice(0, 46))}</a></td><td><a href="${esc(a.f)}" target="_blank" rel="noopener" class="mono">${esc(a.f)}</a></td><td>${esc(t("md_st_int"))}</td><td>${esc(a.cr)}</td><td>${esc(t("md_ver"))}</td></tr>`; };
  const head = `<tr><th>${esc(t("md_col_ch"))}</th><th>${esc(t("md_col_veh"))}</th><th>${esc(t("md_col_desc"))}</th><th>${esc(t("md_col_src"))}</th><th>${esc(t("md_col_asset"))}</th><th>${esc(t("md_col_status"))}</th><th>${esc(t("md_col_attr"))}</th><th>${esc(t("md_col_ver"))}</th></tr>`;
  $(".md-body").innerHTML = `<div class="md-page"><div class="md-wrap">
    <header class="md-ph"><span class="mono md-k">${esc(t("md_title"))}</span><h2>${esc(t("md_inv"))}</h2></header>
    <section><h3>${esc(t("md_inv_narr"))}</h3><p>${esc(t("md_narr_note"))}</p><p class="md-fact">${esc(t("md_narr_fact"))}</p>
     <div class="tablewrap"><table class="md-tbl"><thead><tr><th>${esc(t("md_col_ch"))}</th><th>${esc(t("md_col_desc"))}</th><th>${esc(t("md_file"))}</th><th>${esc(t("md_dur"))}</th><th>${esc(t("md_cc"))}</th></tr></thead><tbody>
     ${D.CH.map((c, i) => `<tr><td>${i + 1}</td><td>${esc(t("md_c" + (i + 1)))}</td><td><a class="mono" href="${esc(c.audio)}" target="_blank" rel="noopener">${esc(c.audio.split("/").pop())}</a></td><td>${fmt(c.dur)}</td><td>${i === 0 ? ["en","bn","es","fr","ar"].map(l => `<a class="mono" href="md/vtt/moon.${l}.vtt" target="_blank" rel="noopener">${l}</a>`).join(" ") : "↑"}</td></tr>`).join("")}</tbody></table></div></section>
    <section><h3>${esc(t("md_inv_foot"))}</h3><div class="tablewrap"><table class="md-tbl"><thead>${head}</thead><tbody>${foot.map(row).join("")}</tbody></table></div></section>
    <section><h3>${esc(t("md_inv_photo"))}</h3><div class="tablewrap"><table class="md-tbl"><thead>${head}</thead><tbody>${photo.map(row).join("")}</tbody></table></div></section>
    <section><h3>${esc(t("md_inv_music"))}</h3><p>${esc(t("md_music_note"))}</p><div class="tablewrap"><table class="md-tbl"><thead><tr><th>${esc(t("md_col_ch"))}</th><th>${esc(t("md_mood"))}</th><th>${esc(t("md_file"))}</th><th>${esc(t("md_dur"))}</th><th>${esc(t("md_col_attr"))}</th></tr></thead><tbody>
     ${D.CH.map((c, i) => `<tr><td>${i + 1}</td><td>${esc(t(c.mood))}</td><td><a class="mono" href="${esc(c.score)}" target="_blank" rel="noopener">${esc(c.score.split("/").pop())}</a></td><td>${fmt(c.dur + 2.5)}</td><td>Forgotten Explorers (heisenberg.exe)</td></tr>`).join("")}</tbody></table></div></section>
    <section><h3>${esc(t("md_inv_ni"))}</h3><div class="tablewrap"><table class="md-tbl"><thead><tr><th>${esc(t("md_col_ch"))}</th><th>${esc(t("md_col_desc"))}</th><th>${esc(t("md_col_src"))}</th><th>${esc(t("md_col_why"))}</th></tr></thead><tbody>
     ${D.NOTINT.map(n => `<tr><td>${n.ch}</td><td lang="en">${esc(n.what)}</td><td>${/^https?:/.test(n.src) ? `<a href="${esc(n.src)}" target="_blank" rel="noopener">${esc(n.src.replace(/^https?:\/\//, "").slice(0, 48))}</a>` : esc(n.src)}</td><td lang="en">${esc(n.why)}</td></tr>`).join("")}</tbody></table></div></section>
    <section><h3>${esc(t("md_src"))}</h3><ul class="md-srcl">${Object.values(D.SRC).map(s => `<li><a href="${esc(s.u)}" target="_blank" rel="noopener">${esc(s.t)} ${ICO.ext}</a></li>`).join("")}</ul></section>
  </div></div>`;
}

/* ── events ── */
function onClick(e) {
  const b = e.target.closest("[data-a]"); if (!b || !host.contains(b)) return;
  const a = b.dataset.a;
  switch (a) {
    case "exit": C.exit(); break;
    case "begin": S.wasPlaying = true; C.go("1"); if (S.loaded === 0 && location.hash === "#moon-doc/1") play(); break;
    case "pp": if (S.ended) { C.go("1"); break; } if (S.playing) { S.wasPlaying = false; pause(); } else { S.wasPlaying = true; play(); } break;
    case "replay": S.na.currentTime = 0; syncMusic(true); S.wasPlaying = true; play(); break;
    case "prev": S.wasPlaying = S.playing; if (S.na.currentTime > 4 || S.ch === 0) { S.na.currentTime = 0; syncMusic(true); } else C.go(String(S.ch)); break;
    case "next": S.wasPlaying = S.playing; if (S.ch < 5) C.go(String(S.ch + 2)); break;
    case "fs": toggleFs(); break;
    case "tr": toggleTr(); break;
    case "cue": S.na.currentTime = +b.dataset.s + 0.01; syncMusic(true); update(true); break;
    case "veh": openVeh(b.dataset.id); break;
    case "dclose": closeDrawer(); break;
    case "dresume": closeDrawer(); S.wasPlaying = true; play(); break;
    case "trveh": translateVeh(b.dataset.id); break;
    case "fate": S.ar.fa = S.ar.fa === b.dataset.f ? "" : b.dataset.f; const sel = $('select[data-f="fa"]'); if (sel) sel.value = S.ar.fa; renderArchive(); break;
    case "reset": S.ar = {q:"", ag:"", mi:"", ty:"", fa:""}; showArchive(); break;
  }
}
function onInput(e) {
  const el = e.target;
  if (el.classList.contains("md-seek")) {
    const d = S.na.duration || D.CH[S.ch].dur; S.seeking = e.type === "input";
    S.na.currentTime = el.value / 1000 * d; el.style.setProperty("--p", (el.value / 10) + "%"); syncMusic(true); update(true); if (e.type === "change") S.seeking = false;
  } else if (el.classList.contains("md-nv")) { S.nv = +el.value; C.store.set("md:nv", S.nv); applyVol(); }
  else if (el.classList.contains("md-mv")) { S.mv = +el.value; C.store.set("md:mv", S.mv); applyVol(); }
  else if (el.classList.contains("md-rate") && e.type === "change") { S.rate = +el.value; C.store.set("md:rate", S.rate); S.na.playbackRate = S.mu.playbackRate = S.rate; $$("video", host).forEach(v => v.playbackRate = S.rate); }
  else if (el.classList.contains("md-ccs") && e.type === "change") { S.cc = el.value; C.store.set("md:cc", S.cc); buildTranscript(); update(true); }
  else if (el.classList.contains("md-q") && e.type === "input") { S.ar.q = el.value; renderArchive(); }
  else if (el.dataset.f && el.tagName === "SELECT" && e.type === "change") { S.ar[el.dataset.f] = el.value; renderArchive(); }
}
function onKey(e) {
  if (!S || !host.isConnected) return;
  if (e.key === "Escape") { if (!$(".md-drawer").hidden) { closeDrawer(); e.preventDefault(); return; } if (document.fullscreenElement) return; C.exit(); return; }
  if (S.view !== "watch" || /INPUT|SELECT|TEXTAREA/.test(e.target.tagName) && e.target.type !== "range") return;
  const k = e.key.toLowerCase();
  if (k === " " || k === "k") { e.preventDefault(); onClick({target:$(".md-pp")}); }
  else if (k === "arrowright" && e.target.type !== "range") { S.na.currentTime = Math.min((S.na.duration || 1) - 0.1, S.na.currentTime + 5); syncMusic(true); }
  else if (k === "arrowleft" && e.target.type !== "range") { S.na.currentTime = Math.max(0, S.na.currentTime - 5); syncMusic(true); }
  else if (k === "n") onClick({target:$('[data-a="next"]')});
  else if (k === "p") onClick({target:$('[data-a="prev"]')});
  else if (k === "f") toggleFs();
  else if (k === "t") toggleTr();
  else if (k === "c") { const s = $(".md-ccs"); const o = [...s.options].map(x => x.value); S.cc = o[(o.indexOf(S.cc) + 1) % o.length]; s.value = S.cc; C.store.set("md:cc", S.cc); buildTranscript(); update(true); }
}
function toggleTr() { S.trOpen = !S.trOpen; const s = $(".md-side"); if (s) s.hidden = !S.trOpen; host.classList.toggle("md-tropen", S.trOpen); setTimeout(fitAll, 30); if (S.trOpen) update(true); }
function toggleFs() { try { if (document.fullscreenElement) document.exitFullscreen(); else host.requestFullscreen && host.requestFullscreen(); } catch (e) {} }
function toast(msg) { const c = $(".md-cap"); if (c) { c.hidden = false; c.innerHTML = `<span class="md-err">${esc(msg)}</span>`; } }

return {start, stop, nav, _s:() => S};
})();
