/* Forgotten Explorers — 3D museum. Loaded only when a visitor enters the museum. Uses NASA 3D resources (GLB). */
window.FE_Museum = (() => {
  let state = null;
  const LAYOUT = {
    perseverance:{pos:[-6.5,0,-2.5], h:2.2, ped:0.5, rot:0.6, year:2020},
    ingenuity:{pos:[-3.4,0,-5], h:1.1, ped:0.9, rot:0.3, year:2020},
    saturnv:{pos:[0,0,-11], h:10.5, ped:0.3, rot:0, year:1967},
    lm:{pos:[3.4,0,-5], h:3.0, ped:0.5, rot:-0.4, year:1969},
    viking:{pos:[6.5,0,-2.5], h:2.0, ped:0.5, rot:-0.7, year:1975}
  };
  function plaque(text, sub) {
    const c = document.createElement("canvas"); c.width = 1024; c.height = 256; const g = c.getContext("2d");
    g.fillStyle = "#0B1424"; g.fillRect(0, 0, 1024, 256); g.strokeStyle = "rgba(154,169,186,.5)"; g.lineWidth = 4; g.strokeRect(8, 8, 1008, 240);
    g.fillStyle = "#EAF0F7"; g.font = "700 72px 'Montserrat', 'Anek Bangla', 'IBM Plex Sans Arabic', sans-serif"; g.textBaseline = "middle"; g.fillText(text, 48, 100);
    g.fillStyle = "#5599D5"; g.font = "500 40px 'DM Mono', monospace"; g.fillText(sub, 48, 182);
    const tx = new THREE.CanvasTexture(c); tx.encoding = THREE.sRGBEncoding; tx.anisotropy = 4; return tx;
  }
  function start(host, ctx) {
    const {t, esc, byId, models, focus, exit, stLabel, fmtDate} = ctx;
    let renderer;
    try { renderer = new THREE.WebGLRenderer({antialias:true, powerPreference:"high-performance"}); }
    catch (e) { throw new Error("webgl"); }
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.outputEncoding = THREE.sRGBEncoding; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    host.insertBefore(renderer.domElement, host.firstChild);
    renderer.domElement.tabIndex = 0; renderer.domElement.setAttribute("aria-label", t("mu_hall"));
    const scene = new THREE.Scene(); scene.background = new THREE.Color(0x03050a); scene.fog = new THREE.Fog(0x03050a, 18, 46);
    const pmrem = new THREE.PMREMGenerator(renderer); scene.environment = pmrem.fromScene(new THREE.RoomEnvironment(), 0.04).texture;
    const camera = new THREE.PerspectiveCamera(62, 1, 0.05, 200);
    // UI
    const ui = document.createElement("div"); ui.className = "mu-ui";
    ui.innerHTML = `<div class="mu-top"><span class="brand"><b>FORGOTTEN EXPLORERS</b><span>${esc(t("nav_museum"))}</span></span>
      <div class="btnrow"><button class="btn small" data-mu="full">⛶ ${esc(t("mu_full"))}</button><button class="btn small" data-mu="exit">✕ ${esc(t("mu_exit"))}</button></div></div>
      <div class="crosshair" id="mu-cross"></div><div class="mu-help" id="mu-help">${esc(t("mu_help"))}</div>
      <div class="mu-panel" id="mu-panel" hidden></div>
      <nav class="mu-dir" aria-label="${esc(t("mu_directory"))}">${models.map(m => `<button data-goto="${m.id}" aria-pressed="false">${esc(m.name)}<small>${esc(byId[m.mission]?.agency[0] || "NASA")} · ${LAYOUT[m.id].year}</small></button>`).join("")}</nav>`;
    host.appendChild(ui);
    // hall
    const floor = new THREE.Mesh(new THREE.CircleGeometry(30, 64), new THREE.MeshStandardMaterial({color:0x070b14, roughness:0.55, metalness:0.15, envMapIntensity:0.25}));
    floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
    const grid = new THREE.GridHelper(60, 60, 0x14243a, 0x0d1626); grid.position.y = 0.002; grid.material.transparent = true; grid.material.opacity = 0.35; scene.add(grid);
    const stars = new THREE.BufferGeometry(); const sp = []; for (let i = 0; i < 2500; i++) { const r = 70 + Math.random() * 40, th = Math.random() * Math.PI * 2, ph = Math.acos(Math.random() * 1.6 - 0.6); sp.push(r * Math.sin(ph) * Math.cos(th), r * Math.cos(ph) + 5, r * Math.sin(ph) * Math.sin(th)); }
    stars.setAttribute("position", new THREE.Float32BufferAttribute(sp, 3));
    scene.add(new THREE.Points(stars, new THREE.PointsMaterial({color:0xbfd0e6, size:0.18, sizeAttenuation:true, fog:false})));
    scene.add(new THREE.HemisphereLight(0x8fb4dd, 0x05070c, 0.35));
    const key = new THREE.DirectionalLight(0xfff1e0, 0.9); key.position.set(6, 14, 8); key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
    Object.assign(key.shadow.camera, {left:-14, right:14, top:14, bottom:-14, far:40}); scene.add(key);
    // photo banners (NASA images)
    const tl = new THREE.TextureLoader();
    [["img/webb_carina.webp", -13, -9, 0.5, 8], ["img/gale.webp", 0, -17, 0, 0], ["img/orion_earth_moon.webp", 13, -9, -0.5, 8]].forEach(([src, x, z, ry, w], i) => {
      tl.load(src, tx => { tx.encoding = THREE.sRGBEncoding; const a = tx.image.width / tx.image.height; const W = i === 1 ? 26 : w, H = W / a;
        const p = new THREE.Mesh(new THREE.PlaneGeometry(W, H), new THREE.MeshBasicMaterial({map:tx, toneMapped:false, color:0x8a8a8a}));
        p.position.set(x, H / 2 + (i === 1 ? 0.3 : 0.6), z); p.rotation.y = ry; scene.add(p); });
    });
    // pedestals + models
    const loader = new THREE.GLTFLoader(); const draco = new THREE.DRACOLoader(); draco.setDecoderPath("lib/draco/"); draco.setDecoderConfig({type:"wasm"}); loader.setDRACOLoader(draco); const pickables = []; const exhibits = {};
    let loaded = 0; const bar = document.getElementById("mubar");
    models.forEach(m => {
      const L = LAYOUT[m.id]; const grp = new THREE.Group(); grp.position.set(...L.pos); scene.add(grp);
      const ped = new THREE.Mesh(new THREE.CylinderGeometry(m.id === "saturnv" ? 2.2 : 1.25, m.id === "saturnv" ? 2.4 : 1.35, L.ped, 48), new THREE.MeshStandardMaterial({color:0x111b2c, roughness:0.45, metalness:0.5, envMapIntensity:0.4}));
      ped.position.y = L.ped / 2; ped.receiveShadow = true; ped.castShadow = true; grp.add(ped);
      const ring = new THREE.Mesh(new THREE.RingGeometry(m.id === "saturnv" ? 2.5 : 1.45, m.id === "saturnv" ? 2.56 : 1.5, 64), new THREE.MeshBasicMaterial({color:0x5599d5, transparent:true, opacity:0.55}));
      ring.rotation.x = -Math.PI / 2; ring.position.y = 0.01; grp.add(ring);
      const spot = new THREE.SpotLight(0xeaf0f7, m.id === "saturnv" ? 2.2 : 1.6, 30, 0.5, 0.6, 1.2); spot.position.set(L.pos[0] * 0.6, m.id === "saturnv" ? 16 : 8, L.pos[2] + 4); spot.target = grp; scene.add(spot);
      const pl = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.4), new THREE.MeshBasicMaterial({map:plaque(m.name, (byId[m.mission]?.agency[0] || "NASA") + " · " + L.year), toneMapped:false}));
      pl.position.set(0, 0.32, (m.id === "saturnv" ? 2.45 : 1.4)); pl.rotation.x = -0.35; grp.add(pl);
      exhibits[m.id] = {grp, L, m, obj:null};
      loader.load(m.file, gltf => {
        const o = gltf.scene; o.traverse(n => { if (n.isMesh) { n.castShadow = true; n.receiveShadow = true; if (n.material) n.material.envMapIntensity = 0.9; } });
        const box = new THREE.Box3().setFromObject(o); const size = box.getSize(new THREE.Vector3());
        const s = L.h / size.y; o.scale.setScalar(s);
        const b2 = new THREE.Box3().setFromObject(o); const c = b2.getCenter(new THREE.Vector3());
        const holder = new THREE.Group(); o.position.set(-c.x, -b2.min.y, -c.z); holder.add(o); holder.position.y = L.ped; holder.rotation.y = L.rot; grp.add(holder);
        holder.userData.id = m.id; exhibits[m.id].obj = holder; pickables.push(holder);
        done();
      }, xhr => { if (bar && xhr.total) bar.style.width = Math.min(100, (loaded + xhr.loaded / xhr.total) / models.length * 100) + "%"; }, () => done());
    });
    function done() { loaded++; if (bar) bar.style.width = (loaded / models.length * 100) + "%"; if (loaded === models.length) { document.getElementById("muload")?.remove(); if (focus && exhibits[focus]) inspect(focus); } }
    // controls
    const S = state = {running:true, raf:0, yaw:0, pitch:-0.05, pos:new THREE.Vector3(0, 1.65, 9), keys:{}, mode:"walk", orbit:{target:new THREE.Vector3(), th:0, ph:1.2, r:5}, camGoal:null};
    const panel = ui.querySelector("#mu-panel"), help = ui.querySelector("#mu-help"), cross = ui.querySelector("#mu-cross");
    setTimeout(() => help && (help.style.opacity = "0"), 6000);
    function inspect(id) {
      const E = exhibits[id]; if (!E) return;
      S.mode = "inspect"; cross.hidden = true; help.style.opacity = "0";
      const tgt = new THREE.Vector3(E.L.pos[0], E.L.ped + E.L.h * 0.5, E.L.pos[2]);
      S.orbit.target.copy(tgt); S.orbit.r = Math.max(3, E.L.h * 1.7); S.orbit.th = Math.atan2(S.pos.x - tgt.x, S.pos.z - tgt.z); S.orbit.ph = 1.25;
      const mi = byId[E.m.mission];
      panel.hidden = false;
      panel.innerHTML = `<span class="mono" style="color:var(--blue)">${esc(t("mu_inspect"))}</span><h3 style="font-size:1.4rem">${esc(E.m.name)}</h3>
        ${mi ? `<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center"><span class="pill ${mi.status}"><i></i>${esc(stLabel(mi.status))}</span><span class="mono" style="color:var(--silver)">${esc(mi.agency.join(", "))} · ${esc(fmtDate(mi.launch))}</span></div><p>${esc(mi.summary)}</p>` : ""}
        <p class="mono" style="color:var(--silver);font-size:.68rem">${esc(t("mu_rotate"))}</p>
        <div class="btnrow">${mi ? `<a class="btn small primary" href="#m-${mi.id}">${esc(t("read_story"))}</a>` : ""}<button class="btn small" data-mu="walk">${esc(t("mu_back_walk"))}</button></div>
        <a class="mono" style="color:var(--silver);font-size:.64rem" href="${esc(E.m.src)}" target="_blank" rel="noopener">${esc(t("mu_model_credit"))} · science.nasa.gov/3d-resources ↗</a>`;
      ui.querySelectorAll("[data-goto]").forEach(b => b.setAttribute("aria-pressed", b.dataset.goto === id));
    }
    function walk() { S.mode = "walk"; panel.hidden = true; cross.hidden = false; S.pitch = -0.05; ui.querySelectorAll("[data-goto]").forEach(b => b.setAttribute("aria-pressed", "false")); }
    ui.addEventListener("click", e => {
      const b = e.target.closest("[data-mu],[data-goto]"); if (!b) return;
      if (b.dataset.goto) inspect(b.dataset.goto);
      else if (b.dataset.mu === "exit") exit();
      else if (b.dataset.mu === "walk") walk();
      else if (b.dataset.mu === "full") { (document.fullscreenElement ? document.exitFullscreen() : host.requestFullscreen?.())?.catch?.(() => {}); }
    });
    const cv = renderer.domElement; let drag = null; const pointers = new Map(); let pinch0 = 0;
    const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
    cv.addEventListener("pointerdown", e => { cv.setPointerCapture(e.pointerId); pointers.set(e.pointerId, [e.clientX, e.clientY]); drag = {x:e.clientX, y:e.clientY, moved:0}; if (pointers.size === 2) { const [a, b] = [...pointers.values()]; pinch0 = Math.hypot(a[0] - b[0], a[1] - b[1]); } });
    cv.addEventListener("pointermove", e => {
      if (!drag || !pointers.has(e.pointerId)) return;
      const prev = pointers.get(e.pointerId); const dx = e.clientX - prev[0], dy = e.clientY - prev[1]; pointers.set(e.pointerId, [e.clientX, e.clientY]); drag.moved += Math.abs(dx) + Math.abs(dy);
      if (pointers.size === 2) { const [a, b] = [...pointers.values()]; const d = Math.hypot(a[0] - b[0], a[1] - b[1]); if (pinch0) { if (S.mode === "inspect") S.orbit.r = Math.min(30, Math.max(1.2, S.orbit.r * pinch0 / d)); else S.pos.addScaledVector(forward(), (d - pinch0) * 0.02); } pinch0 = d; return; }
      if (S.mode === "walk") { S.yaw -= dx * 0.004; S.pitch = Math.max(-1.2, Math.min(1.2, S.pitch - dy * 0.004)); }
      else { S.orbit.th -= dx * 0.008; S.orbit.ph = Math.max(0.2, Math.min(1.7, S.orbit.ph - dy * 0.006)); }
    });
    const up = e => { pointers.delete(e.pointerId); if (pointers.size < 2) pinch0 = 0; if (drag && drag.moved < 6 && pointers.size === 0) pick(e); if (!pointers.size) drag = null; };
    cv.addEventListener("pointerup", up); cv.addEventListener("pointercancel", up);
    cv.addEventListener("wheel", e => { e.preventDefault(); if (S.mode === "inspect") S.orbit.r = Math.min(30, Math.max(1.2, S.orbit.r * (1 + Math.sign(e.deltaY) * 0.1))); else S.pos.addScaledVector(forward(), -Math.sign(e.deltaY) * 0.6); }, {passive:false});
    function pick(e) {
      const r = cv.getBoundingClientRect(); ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ndc, camera); const hit = ray.intersectObjects(pickables, true)[0];
      if (hit) { let o = hit.object; while (o && !o.userData.id) o = o.parent; if (o) inspect(o.userData.id); }
    }
    const kd = e => { if (/INPUT|SELECT|TEXTAREA/.test(document.activeElement?.tagName)) return; S.keys[e.key.toLowerCase()] = e.type === "keydown"; if (e.type === "keydown" && e.key === "Escape") { S.mode === "inspect" ? walk() : exit(); } if (["arrowup","arrowdown","arrowleft","arrowright"," "].includes(e.key.toLowerCase())) e.preventDefault(); };
    window.addEventListener("keydown", kd); window.addEventListener("keyup", kd);
    function forward() { return new THREE.Vector3(-Math.sin(S.yaw), 0, -Math.cos(S.yaw)); }
    const ro = new ResizeObserver(() => { const w = host.clientWidth, h = host.clientHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }); ro.observe(host);
    const clock = new THREE.Clock(); const tmp = new THREE.Vector3();
    function loop() {
      if (!S.running) return; S.raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, clock.getDelta()); const k = S.keys;
      if (S.mode === "walk") {
        const f = forward(), rgt = new THREE.Vector3(-f.z, 0, f.x), sp = 4 * dt;
        if (k.w || k.arrowup) S.pos.addScaledVector(f, sp); if (k.s || k.arrowdown) S.pos.addScaledVector(f, -sp);
        if (k.a) S.pos.addScaledVector(rgt, -sp); if (k.d) S.pos.addScaledVector(rgt, sp);
        if (k.arrowleft) S.yaw += 1.6 * dt; if (k.arrowright) S.yaw -= 1.6 * dt;
        S.pos.x = Math.max(-16, Math.min(16, S.pos.x)); S.pos.z = Math.max(-14, Math.min(16, S.pos.z));
        for (const id in exhibits) { const p = exhibits[id].L.pos; const rr = id === "saturnv" ? 3.2 : 1.9; const dx = S.pos.x - p[0], dz = S.pos.z - p[2], d = Math.hypot(dx, dz); if (d < rr) { S.pos.x = p[0] + dx / d * rr; S.pos.z = p[2] + dz / d * rr; } }
        camera.position.lerp(S.pos, 0.25);
        tmp.set(camera.position.x - Math.sin(S.yaw) * Math.cos(S.pitch), camera.position.y + Math.sin(S.pitch), camera.position.z - Math.cos(S.yaw) * Math.cos(S.pitch)); camera.lookAt(tmp);
      } else {
        const o = S.orbit; const goal = new THREE.Vector3(o.target.x + o.r * Math.sin(o.ph) * Math.sin(o.th), o.target.y + o.r * Math.cos(o.ph), o.target.z + o.r * Math.sin(o.ph) * Math.cos(o.th));
        goal.y = Math.max(0.3, goal.y); camera.position.lerp(goal, 0.12); camera.lookAt(o.target);
        S.pos.set(camera.position.x, 1.65, camera.position.z); S.yaw = Math.atan2(-(o.target.x - camera.position.x), -(o.target.z - camera.position.z));
      }
      renderer.render(scene, camera);
    }
    camera.position.copy(S.pos); loop();
    S.cleanup = () => { S.running = false; cancelAnimationFrame(S.raf); ro.disconnect(); window.removeEventListener("keydown", kd); window.removeEventListener("keyup", kd); renderer.dispose(); pmrem.dispose(); if (document.fullscreenElement) document.exitFullscreen().catch(() => {}); };
    cv.focus();
  }
  function stop() { if (state && state.cleanup) state.cleanup(); state = null; }
  return {start, stop};
})();
