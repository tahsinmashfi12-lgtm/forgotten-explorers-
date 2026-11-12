/* Heliocentric ecliptic J2000 positions from JPL approximate Keplerian elements (Standish). Valid 1800–2050. */
window.SS_EPHEM = (function () {
  const D = Math.PI / 180;
  function jd(date) { return date.getTime() / 86400000 + 2440587.5; }
  function kepler(M, e) { let E = M + e * Math.sin(M); for (let i = 0; i < 8; i++) E -= (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E)); return E; }
  function pos(id, date) {
    const el = window.SS_ELEMENTS[id]; if (!el) return null;
    const T = (jd(date) - 2451545.0) / 36525;
    const [a, e, I, L, wb, O] = el[0].map((v, i) => v + el[1][i] * T);
    const w = (wb - O) * D; let M = ((L - wb) % 360) * D;
    M = Math.atan2(Math.sin(M), Math.cos(M));
    const E = kepler(M, e);
    const xp = a * (Math.cos(E) - e), yp = a * Math.sqrt(1 - e * e) * Math.sin(E);
    const cw = Math.cos(w), sw = Math.sin(w), cO = Math.cos(O * D), sO = Math.sin(O * D), cI = Math.cos(I * D), sI = Math.sin(I * D);
    return { x: (cw * cO - sw * sO * cI) * xp + (-sw * cO - cw * sO * cI) * yp,
             y: (cw * sO + sw * cO * cI) * xp + (-sw * sO + cw * cO * cI) * yp,
             z: (sw * sI) * xp + (cw * sI) * yp, a, e, I, O, wb };
  }
  function orbitPoints(id, date, n) {
    const el = window.SS_ELEMENTS[id], T = (jd(date) - 2451545.0) / 36525;
    const [a, e, I, L, wb, O] = el[0].map((v, i) => v + el[1][i] * T);
    const w = (wb - O) * D, pts = [];
    const cw = Math.cos(w), sw = Math.sin(w), cO = Math.cos(O * D), sO = Math.sin(O * D), cI = Math.cos(I * D), sI = Math.sin(I * D);
    for (let k = 0; k <= n; k++) { const E = k / n * 2 * Math.PI; const xp = a * (Math.cos(E) - e), yp = a * Math.sqrt(1 - e * e) * Math.sin(E);
      pts.push([(cw * cO - sw * sO * cI) * xp + (-sw * cO - cw * sO * cI) * yp, (cw * sO + sw * cO * cI) * xp + (-sw * sO + cw * cO * cI) * yp, (sw * sI) * xp + (cw * sI) * yp]); }
    return pts;
  }
  const AU = 149597870.7;
  function distance(a, b, date) { // km between two bodies (sun at origin)
    const p = id => id === "sun" ? { x: 0, y: 0, z: 0 } : pos(id === "moon" ? "earth" : id, date);
    const A = p(a), B = p(b); if (!A || !B) return null;
    return Math.hypot(A.x - B.x, A.y - B.y, A.z - B.z) * AU;
  }
  return { pos, orbitPoints, distance, AU, jd };
})();
