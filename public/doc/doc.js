/* Forgotten Explorers — THE SILENT LEGACY documentary player.
   Narration (7 MP3s) is the timing reference; the original score is a separate track with ducking mixed in.
   Visuals are authentic NASA photographs and footage composed in real time (crossfades, slow camera moves). */
(function () {
"use strict";
const D = window.FE_DOCDATA;
const XF = 1.0;                       // crossfade length (s)
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const ease = p => 0.5 - 0.5 * Math.cos(Math.PI * clamp(p, 0, 1));
const fmt = s => { s = Math.max(0, Math.floor(s)); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); };
let C, t, esc, host, $, raf = 0, last = 0, W = 1280, H = 720, ro = null;
const st = {t:0, playing:false, started:false, ended:false, cc:true, vol:0.9, muted:false, buffering:false, seeking:false, uiTimer:0};
let narr = [], music = null, layers = new Map(), curCue = -1, curWordsOn = -1, curLabel = "", volSettable = true;

function start(el, ctx) {
  C = ctx; t = ctx.t; esc = ctx.esc; host = el; $ = s => host.querySelector(s);
  Object.assign(st, {t:0, playing:false, started:false, ended:false, buffering:false});
  st.cc = ctx.store.get("doc_cc") !== "0";
  const v = parseFloat(ctx.store.get("doc_vol")); st.vol = isNaN(v) ? 0.9 : clamp(v, 0, 1);
  try { window.speechSynthesis && speechSynthesis.cancel(); } catch (e) {}
  host.innerHTML = shell();
  // audio: narration files are the master timing reference
  narr = D.audio.map((src, i) => { const a = new Audio(); a.preload = i === 0 ? "auto" : "metadata"; a.src = src; return a; });
  music = new Audio(); music.preload = "auto"; music.src = D.music; music.loop = false;
  try { music.volume = 0.5; volSettable = Math.abs(music.volume - 0.5) < 0.01; } catch (e) { volSettable = false; }
  if (!volSettable) $(".dc-volr").hidden = true;
  applyVol();
  bind();
  ro = new ResizeObserver(resize); ro.observe($(".dc-frame")); ro.observe(host); resize();
  render(0);
  last = performance.now(); raf = requestAnimationFrame(tick);
  $(".dc-bigplay").focus({preventScroll:true});
}
function stop() {
  cancelAnimationFrame(raf); raf = 0;
  narr.forEach(a => { try { a.pause(); a.removeAttribute("src"); a.load(); } catch (e) {} });
  if (music) { try { music.pause(); music.removeAttribute("src"); music.load(); } catch (e) {} }
  layers.forEach(l => l.el.querySelectorAll("video").forEach(v => { try { v.pause(); v.removeAttribute("src"); v.load(); } catch (e) {} }));
  layers.clear(); narr = []; music = null;
  if (ro) { ro.disconnect(); ro = null; }
  document.removeEventListener("keydown", onKey, true);
  document.removeEventListener("fullscreenchange", onFs); document.removeEventListener("webkitfullscreenchange", onFs);
  if (document.fullscreenElement === host) { try { document.exitFullscreen(); } catch (e) {} }
  host = null;
}

/* ── markup ── */
function shell() {
  const poster = D.assets.aldrin ? "img/aldrin.webp" : "img/hero_lrv.webp";
  const marks = D.B.map((b, i) => `<i style="left:${b / D.total * 100}%" title="${esc(title(i))}"></i>`).join("");
  const fsOK = !!(host.requestFullscreen || host.webkitRequestFullscreen);
  return `<div class="dc-frame"><div class="dc-stage" id="dc-stage"></div><div class="dc-vig"></div><div class="dc-black" id="dc-black"></div>
   <div class="dc-label" id="dc-label" aria-hidden="true"></div>
   <div class="dc-stitle" id="dc-stitle" aria-hidden="true"><small></small><b></b></div>
   <div class="dc-final" id="dc-final"><h2>THE SILENT LEGACY</h2><p>${esc(t("doc_sub"))}</p></div>
   <div class="dc-cap" id="dc-cap" aria-hidden="true"></div>
   <div class="dc-sr" aria-live="polite" id="dc-sr"></div>
   <div class="dc-buf" id="dc-buf" hidden><span></span></div>
   <div class="dc-poster" id="dc-poster"><img src="${poster}" alt=""><div class="in"><span class="mono">${esc(t("doc_label"))}</span><h2>THE SILENT LEGACY</h2><p>${esc(t("doc_sub"))}</p>
     <button class="dc-bigplay" data-d="play" aria-label="${esc(t("doc_play"))}"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="currentColor"/></svg></button><em>${fmt(D.total)} · ${esc(t("doc_meta"))}</em></div></div>
   <div class="dc-end" id="dc-end" hidden><a href="#hardware" data-d="link">${esc(t("doc_end_hw"))} →</a><a href="#museum" data-d="link">${esc(t("doc_end_mu"))} →</a><button data-d="restart">↺ ${esc(t("doc_again"))}</button></div>
  </div>
  <div class="dc-top"><span class="mono">THE SILENT LEGACY</span><button class="dc-x" data-d="close" aria-label="${esc(t("close"))}">✕</button></div>
  <div class="dc-ctl" role="group" aria-label="${esc(t("doc_controls"))}">
   <div class="dc-prog"><div class="dc-marks">${marks}</div><input type="range" id="dc-seek" min="0" max="${D.total}" step="0.1" value="0" aria-label="${esc(t("doc_seek"))}"></div>
   <div class="dc-row">
    <button data-d="play" class="dc-pp" aria-label="${esc(t("doc_play"))}"><svg class="i-play" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="currentColor"/></svg><svg class="i-pause" viewBox="0 0 24 24"><path d="M7 5h4v14H7zM13 5h4v14h-4z" fill="currentColor"/></svg></button>
    <button data-d="restart" aria-label="${esc(t("doc_restart"))}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 12a8 8 0 1 0 2.3-5.6M4 4v4h4"/></svg></button>
    <span class="dc-time mono" id="dc-time">0:00 / ${fmt(D.total)}</span>
    <span class="dc-scene mono" id="dc-scene"></span>
    <span class="dc-sp"></span>
    <button data-d="mute" class="dc-mute" aria-label="${esc(t("doc_mute"))}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" stroke="none"/><path class="w" d="M16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11"/><path class="x" d="M16 9l5 6M21 9l-5 6"/></svg></button>
    <input type="range" class="dc-volr" id="dc-vol" min="0" max="1" step="0.05" value="${st.vol}" aria-label="${esc(t("doc_volume"))}">
    <button data-d="cc" class="dc-cc" aria-pressed="${st.cc}" aria-label="${esc(t("captions"))}"${C.lang && C.lang() !== "en" ? ` title="${esc(t("doc_cc_tr"))}"` : ""}>CC</button>
    ${fsOK ? `<button data-d="fs" aria-label="${esc(t("doc_fullscreen"))}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg></button>` : ""}
   </div></div>`;
}

/* ── layout ── */
function resize() {
  const s = $("#dc-stage"); if (!s) return;
  W = s.clientWidth || 1280; H = s.clientHeight || 720;
  layers.forEach(l => sizeLayer(l));
  const fr = $(".dc-frame").getBoundingClientRect(), ct = host.querySelector(".dc-ctl").getBoundingClientRect();
  host.style.setProperty("--capui", Math.max(fr.height * 0.08, fr.bottom - ct.top + 10) + "px");
  render(st.t, true);
}
function baseSize(a, fit) { const k = fit === "contain" ? Math.min(W / a.w, H / a.h) : Math.max(W / a.w, H / a.h); return [a.w * k, a.h * k]; }
function sizeLayer(l) {
  if (l.media) { const [bw, bh] = baseSize(l.asset, l.asset.fit); l.bw = bw; l.bh = bh; l.media.style.width = bw + "px"; l.media.style.height = bh + "px"; }
}

/* ── shot layers (created just ahead of time, removed after) ── */
function makeLayer(i) {
  const s = D.shots[i], el = document.createElement("div"); el.className = "dc-shot"; el.style.opacity = 0;
  const l = {i, s, el, media:null, asset:null, panels:null};
  if (s.a === "grid") {
    el.classList.add("grid");
    l.panels = s.items.map(([k, at, lab]) => { const a = D.assets[k]; const p = document.createElement("div"); p.className = "gp"; p.style.opacity = 0;
      p.innerHTML = `<img src="${a.src}" alt="" decoding="async"><span>${esc(lab)}</span>`; el.appendChild(p); return {p, at}; });
  } else if (s.a === "duo") {
    el.classList.add("duo");
    el.innerHTML = s.items.map(k => `<div class="dp"><img src="${D.assets[k].src}" alt="" decoding="async"></div>`).join("") + `<div class="dshade"></div>`;
  } else {
    const a = D.assets[s.a]; l.asset = a;
    if (a.k === "vid") {
      const v = document.createElement("video"); v.muted = true; v.playsInline = true; v.setAttribute("playsinline", ""); v.setAttribute("muted", ""); v.preload = "auto"; v.src = a.src; v.disablePictureInPicture = true;
      l.media = v;
    } else { const im = new Image(); im.decoding = "async"; im.alt = ""; im.src = a.src; l.media = im; }
    l.media.className = "m"; el.appendChild(l.media); sizeLayer(l);
  }
  $("#dc-stage").appendChild(el); layers.set(i, l); return l;
}
function dropLayer(l) {
  if (l.media && l.media.tagName === "VIDEO") { try { l.media.pause(); l.media.removeAttribute("src"); l.media.load(); } catch (e) {} }
  l.el.remove(); layers.delete(l.i);
}

/* ── render one frame for time T ── */
function render(T, force) {
  const S = D.shots, reduced = C.reduced;
  for (let i = 0; i < S.length; i++) {
    const s = S[i], a0 = s.t - XF / 2, a1 = s.e + XF / 2;
    const near = T > a0 - 4 && T < a1 + 0.5;
    let l = layers.get(i);
    if (!near) { if (l) dropLayer(l); continue; }
    if (!l) l = makeLayer(i);
    let op = clamp((T - a0) / XF, 0, 1) * clamp((a1 - T) / XF, 0, 1);
    if (i === 0) op = clamp(T / 1.8, 0, 1);
    if (i === S.length - 1) op = clamp((T - a0) / 1.6, 0, 1);
    l.el.style.opacity = op.toFixed(3);
    l.el.style.visibility = op > 0 ? "visible" : "hidden";
    const p = ease((T - a0) / (a1 - a0));
    if (s.a === "grid") {
      l.panels.forEach(({p: el, at}) => { const o = clamp((T - at + 0.15) / 0.6, 0, 1); el.style.opacity = o.toFixed(3); el.firstChild.style.transform = `scale(${(1.04 + (reduced ? 0 : 0.06 * clamp((T - at) / 7, 0, 1))).toFixed(4)})`; });
    } else if (s.a === "duo") {
      const k = reduced ? 1 : 1 + 0.05 * p; l.el.querySelectorAll(".dp img").forEach(im => im.style.transform = `scale(${k.toFixed(4)})`);
      l.el.querySelector(".dshade").style.opacity = clamp((T - D.final) / 2.2, 0, 1) * 0.4;
    } else if (l.media) {
      const f = s.f || [0.5, 0.5, 1], to = reduced ? f : (s.to || f);
      const fx = f[0] + (to[0] - f[0]) * p, fy = f[1] + (to[1] - f[1]) * p, sc = f[2] + (to[2] - f[2]) * p;
      let w = l.bw * sc, h = l.bh * sc, tx = W / 2 - fx * w, ty = H / 2 - fy * h;
      tx = w >= W ? clamp(tx, W - w, 0) : (W - w) / 2;
      ty = h >= H ? clamp(ty, H - h, 0) : (H - h) / 2;
      l.media.style.transform = `translate3d(${tx.toFixed(1)}px,${ty.toFixed(1)}px,0) scale(${sc.toFixed(4)})`;
      if (l.media.tagName === "VIDEO") syncVideo(l, T, a0);
    }
  }
  // black: opening fade-in and final fade to black
  $("#dc-black").style.opacity = Math.max(clamp(1 - T / 1.2, 0, 1), clamp((T - (D.total - 2.4)) / 2.4, 0, 1)).toFixed(3);
  // scene title
  let si = -1; for (let i = 0; i < 7; i++) { const a = i === 0 ? 1.0 : D.B[i] - 1.1, b = D.B[i] + (i === 0 ? 2.4 : 2.6); if (T >= a && T <= b) si = i; }
  const stt = $("#dc-stitle");
  if (si >= 0) { const a = si === 0 ? 1.0 : D.B[si] - 1.1, b = D.B[si] + (si === 0 ? 2.4 : 2.6); stt.style.opacity = (clamp((T - a) / 0.8, 0, 1) * clamp((b - T) / 0.8, 0, 1)).toFixed(3);
    if (stt.dataset.i !== String(si)) { stt.dataset.i = si; stt.firstChild.textContent = "0" + (si + 1); stt.lastChild.textContent = title(si); } }
  else stt.style.opacity = 0;
  // final title
  $("#dc-final").style.opacity = (clamp((T - D.final - 0.4) / 1.6, 0, 1) * clamp((D.total - 1.0 - T) / 1.6, 0, 1)).toFixed(3);
  // source label of the dominant shot
  let lab = ""; layers.forEach(l => { if (l.asset && parseFloat(l.el.style.opacity) > 0.65 && T > l.s.t + 0.4 && T < l.s.e - 0.3) lab = l.asset.label; });
  if (lab !== curLabel) { curLabel = lab; const el = $("#dc-label"); el.classList.remove("on"); if (lab) { el.textContent = lab; requestAnimationFrame(() => el.classList.add("on")); } }
  captions(T);
  // ui text
  if (!st.seeking) $("#dc-seek").value = T.toFixed(1);
  $("#dc-seek").style.setProperty("--p", (T / D.total * 100).toFixed(2) + "%");
  $("#dc-time").textContent = fmt(T) + " / " + fmt(D.total);
  let sc = 0; for (let i = 0; i < 7; i++) if (T >= D.B[i] - 1.1) sc = i;
  $("#dc-scene").textContent = "0" + (sc + 1) + " · " + title(sc);
}
function syncVideo(l, T, a0) {
  const v = l.media, rel = (l.s.off || 0) + (T - a0), dur = v.duration || 99;
  const target = clamp(rel, 0, dur - 0.05), visible = parseFloat(l.el.style.opacity) > 0;
  if (!visible || !st.playing || rel >= dur - 0.05) { if (!v.paused) v.pause(); if (v.readyState >= 1 && Math.abs(v.currentTime - target) > 0.15) { try { v.currentTime = target; } catch (e) {} } return; }
  if (v.readyState >= 1 && Math.abs(v.currentTime - target) > 0.35) { try { v.currentTime = target; } catch (e) {} }
  if (v.paused) { const pr = v.play(); if (pr && pr.catch) pr.catch(() => {}); }
}

/* ── captions: progressive, word by word in English; other languages show the translated line for the same cue ── */
const LG = () => (C.lang ? C.lang() : "en"), TRD = () => { const x = window.FE_DOC_TR; const l = LG(); return l !== "en" && x && x.cues[l] && x.cues[l].length === D.cues.length ? x : null; };
function title(i) { const x = window.FE_DOC_TR, l = LG(); return (l !== "en" && x && x.titles[l] && x.titles[l][i]) || D.titles[i]; }
function captions(T) {
  const cap = $("#dc-cap"); let ci = -1;
  for (let i = 0; i < D.cues.length; i++) { const w = D.cues[i].w, a = w[0][1] - 0.18, nx = D.cues[i + 1] ? D.cues[i + 1].w[0][1] - 0.2 : 1e9, b = Math.min(w[w.length - 1][2] + 0.6, nx); if (T >= a && T <= b) ci = i; }
  cap.classList.toggle("hide", !st.cc);
  if (ci !== curCue) {
    curCue = ci; curWordsOn = -1;
    const tr = TRD();
    cap.innerHTML = ci < 0 ? "" : tr ? `<p class="tr" lang="${LG()}">${esc(tr.cues[LG()][ci])}</p>` : `<p>${D.cues[ci].w.map(w => `<span>${esc(w[0])}</span>`).join(" ")}</p>`;
    if (ci >= 0) $("#dc-sr").textContent = st.cc ? (tr ? tr.cues[LG()][ci] : D.cues[ci].w.map(w => w[0]).join(" ")) : "";
  }
  if (ci >= 0 && !TRD()) { const ws = D.cues[ci].w; let n = 0; while (n < ws.length && T >= ws[n][1] - 0.04) n++;
    if (n !== curWordsOn) { curWordsOn = n; cap.querySelectorAll("span").forEach((s, k) => s.classList.toggle("on", k < n)); } }
}

/* ── clock + audio sync ── */
function sceneAt(T) { for (let i = 0; i < 7; i++) if (T >= D.B[i] && T < D.B[i] + D.dur[i] - 0.03) return i; return -1; }
function tick(now) {
  raf = requestAnimationFrame(tick);
  const dt = Math.min(0.1, (now - last) / 1000); last = now;
  if (!st.playing) { return; }
  const i = sceneAt(st.t);
  let waiting = false;
  narr.forEach((a, j) => {
    if (j === i) {
      const target = st.t - D.B[i];
      if (a.paused) { if (a.readyState >= 2) { try { a.currentTime = target; } catch (e) {} playA(a); } else { a.preload = "auto"; waiting = true; } }
      else {
        if (a.readyState < 3 && !a.ended) waiting = true;
        const drift = a.currentTime - target;
        if (Math.abs(drift) > 0.35) { try { a.currentTime = target; } catch (e) {} }
        else st.t += drift * 0.08; /* follow the narration clock gently */
      }
    } else if (!a.paused) a.pause();
    if (j === i + 1 || (i < 0 && j === nextScene(st.t))) if (a.preload !== "auto") a.preload = "auto";
  });
  if (music) {
    if (st.t < D.total - 0.05) {
      if (music.paused && music.readyState >= 2) { try { music.currentTime = st.t; } catch (e) {} playA(music); }
      else if (!music.paused) {
        const md = music.currentTime - st.t;
        if (Math.abs(md) > 0.6) { try { music.currentTime = st.t; } catch (e) {} music.playbackRate = 1; }
        else { const r = md > 0.05 ? 0.97 : md < -0.05 ? 1.03 : 1; if (music.playbackRate !== r) music.playbackRate = r; }
      }
    } else if (!music.paused) music.pause();
  }
  st.buffering = waiting; $("#dc-buf").hidden = !waiting;
  if (!waiting) st.t += dt;
  if (st.t >= D.total) { st.t = D.total; finish(); }
  render(st.t);
}
function nextScene(T) { for (let i = 0; i < 7; i++) if (D.B[i] > T) return i; return -1; }
function playA(a) { const p = a.play(); if (p && p.catch) p.catch(() => {}); }
function applyVol() {
  const v = st.muted ? 0 : st.vol;
  narr.forEach(a => { a.muted = st.muted; if (volSettable) a.volume = v; });
  if (music) { music.muted = st.muted; if (volSettable) music.volume = v; }
  host.classList.toggle("muted", st.muted || st.vol === 0);
}

/* ── transport ── */
function play() {
  if (st.ended) restart();
  if (!st.started) {
    st.started = true; $("#dc-poster").classList.add("gone"); setTimeout(() => { const p = $("#dc-poster"); if (p) p.hidden = true; }, 900);
    // unlock every narration element inside this user gesture (iOS)
    narr.forEach((a, j) => { if (j > 0) { a.muted = true; const p = a.play(); if (p && p.then) p.then(() => { a.pause(); a.muted = st.muted; }).catch(() => { a.muted = st.muted; }); } });
  }
  st.playing = true; last = performance.now(); host.classList.add("playing");
  if (music && st.t < D.total) { try { music.currentTime = st.t; } catch (e) {} playA(music); }
  const i = sceneAt(st.t); if (i >= 0) { const a = narr[i]; try { a.currentTime = st.t - D.B[i]; } catch (e) {} playA(a); }
  $(".dc-pp").setAttribute("aria-label", t("doc_pause")); pokeUI();
}
function pause() {
  st.playing = false; host.classList.remove("playing");
  narr.forEach(a => a.pause()); if (music) music.pause();
  layers.forEach(l => { if (l.media && l.media.tagName === "VIDEO") l.media.pause(); });
  $(".dc-pp").setAttribute("aria-label", t("doc_play")); showUI();
}
function toggle() { st.playing ? pause() : play(); }
function seek(T) {
  st.t = clamp(T, 0, D.total - 0.05); st.ended = false; $("#dc-end").hidden = true;
  narr.forEach(a => a.pause()); if (music) { try { music.currentTime = st.t; } catch (e) {} }
  const i = sceneAt(st.t); if (i >= 0) { try { narr[i].currentTime = st.t - D.B[i]; } catch (e) {} }
  curCue = -1; render(st.t, true);
  if (st.playing) { if (music) playA(music); if (i >= 0) playA(narr[i]); }
}
function restart() { st.ended = false; $("#dc-end").hidden = true; seek(0); if (!st.playing) play(); }
function finish() {
  if (st.ended) return; st.ended = true; pause();
  const e = $("#dc-end"); e.hidden = false; requestAnimationFrame(() => e.classList.add("on"));
}
function toggleFs() {
  const d = document;
  if (d.fullscreenElement || d.webkitFullscreenElement) { (d.exitFullscreen || d.webkitExitFullscreen).call(d); return; }
  const f = host.requestFullscreen || host.webkitRequestFullscreen; if (f) { try { const r = f.call(host); if (r && r.catch) r.catch(() => {}); } catch (e) {} }
}
function onFs() { host.classList.toggle("fs", !!(document.fullscreenElement || document.webkitFullscreenElement)); }
function showUI() { host.classList.add("ui"); clearTimeout(st.uiTimer); }
function pokeUI() { showUI(); st.uiTimer = setTimeout(() => { if (st.playing) host.classList.remove("ui"); }, 2600); }
function onKey(e) {
  if (!host) return;
  const tag = document.activeElement && document.activeElement.tagName;
  if (e.key === " " || e.key === "k") { if (tag === "BUTTON" && e.key === " ") return; e.preventDefault(); e.stopPropagation(); toggle(); }
  else if (e.key === "ArrowRight" && tag !== "INPUT") { e.preventDefault(); seek(st.t + 5); pokeUI(); }
  else if (e.key === "ArrowLeft" && tag !== "INPUT") { e.preventDefault(); seek(st.t - 5); pokeUI(); }
  else if (e.key === "c" || e.key === "C") { setCC(!st.cc); }
  else if (e.key === "f" || e.key === "F") { toggleFs(); }
  else if (e.key === "m" || e.key === "M") { st.muted = !st.muted; applyVol(); }
  else if (e.key === "Escape" && !(document.fullscreenElement || document.webkitFullscreenElement)) { e.stopPropagation(); C.exit(); }
}
function setCC(on) { st.cc = on; C.store.set("doc_cc", on ? "1" : "0"); $(".dc-cc").setAttribute("aria-pressed", on); curCue = -1; captions(st.t); }
function bind() {
  host.addEventListener("click", e => {
    const b = e.target.closest("[data-d]");
    if (!b) { if (e.target.closest(".dc-stage,.dc-vig,.dc-cap,.dc-black,.dc-final") && st.started) toggle(); return; }
    const d = b.dataset.d;
    if (d === "play") toggle(); else if (d === "restart") restart(); else if (d === "close") C.exit();
    else if (d === "mute") { st.muted = !st.muted; applyVol(); } else if (d === "cc") setCC(!st.cc); else if (d === "fs") toggleFs();
    else if (d === "link") { /* normal navigation */ }
    pokeUI();
  });
  const sk = $("#dc-seek");
  sk.addEventListener("input", () => { st.seeking = true; seek(parseFloat(sk.value)); });
  sk.addEventListener("change", () => { st.seeking = false; pokeUI(); });
  $("#dc-vol").addEventListener("input", e => { st.vol = parseFloat(e.target.value); st.muted = st.vol === 0; C.store.set("doc_vol", String(st.vol)); applyVol(); });
  host.addEventListener("pointermove", pokeUI, {passive:true});
  host.addEventListener("touchstart", pokeUI, {passive:true});
  document.addEventListener("keydown", onKey, true);
  document.addEventListener("fullscreenchange", onFs); document.addEventListener("webkitfullscreenchange", onFs);
  narr.forEach(a => a.addEventListener("error", () => { $("#dc-buf").hidden = false; $("#dc-buf").innerHTML = `<p>${esc(t("doc_audio_err"))}</p>`; }));
  showUI();
}
window.FE_DOC = {start, stop, _state:() => ({t:st.t, playing:st.playing, buffering:st.buffering, ended:st.ended, narr:narr.map(a => [a.paused, +a.currentTime.toFixed(2), a.readyState]), music:music ? [music.paused, +music.currentTime.toFixed(2), music.readyState] : null, layers:layers.size})};
})();
