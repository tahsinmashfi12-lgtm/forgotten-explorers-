#!/usr/bin/env node
/**
 * Forgotten Explorers — production build check (runs as `npm run build` on Vercel).
 *
 * The site is a hand-written static app (no bundler), so "building" means verifying that what
 * will be served from /public is complete and valid. The build FAILS if:
 *   - public/index.html is missing or is not a complete HTML document
 *   - any JavaScript file in /public has a syntax error
 *   - a local asset referenced by HTML, CSS or JavaScript is missing
 *   - something that looks like a secret/API key is found in served files
 *   - the API function cannot be loaded
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUB = path.join(ROOT, "public");
const errors = [], warnings = [];
const rel = p => path.relative(ROOT, p).split(path.sep).join("/");

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out); else out.push(p);
  }
  return out;
}

/* 1 · entry document */
const indexPath = path.join(PUB, "index.html");
if (!fs.existsSync(indexPath)) errors.push("public/index.html is missing");
const indexHtml = fs.existsSync(indexPath) ? fs.readFileSync(indexPath, "utf8") : "";
if (indexHtml && !/^<!doctype html>/i.test(indexHtml.trimStart())) errors.push("public/index.html must start with <!doctype html>");
if (indexHtml && !/<meta[^>]+name="viewport"/i.test(indexHtml)) errors.push("public/index.html has no viewport meta tag");
if (indexHtml && !/<meta charset="utf-8">/i.test(indexHtml)) errors.push("public/index.html has no UTF-8 charset declaration");

const files = walk(PUB);
const exists = new Set(files.map(f => path.relative(PUB, f).split(path.sep).join("/")));
const totalBytes = files.reduce((a, f) => a + fs.statSync(f).size, 0);

/* 2 · JavaScript syntax (site scripts are classic <script> files) */
const jsFiles = files.filter(f => f.endsWith(".js"));
for (const f of jsFiles) {
  const src = fs.readFileSync(f, "utf8");
  try { new vm.Script(src, { filename: rel(f) }); }
  catch (e) { errors.push(`syntax error in ${rel(f)}: ${e.message}`); }
}

/* 3 · local asset references */
const EXT = "js|css|jpg|jpeg|png|webp|gif|svg|ico|mp3|mp4|webm|glb|gltf|bin|json|vtt|txt|woff2?|html";
const strRe = new RegExp(String.raw`["'\`]((?:\./)?[A-Za-z0-9_\-][A-Za-z0-9_\-./]*\.(?:${EXT}))(?:[?#][^"'\`]*)?["'\`]`, "g");
const attrRe = /\b(?:src|href|poster|data-src)=["']([^"'#?]+)["']/gi;
const urlRe = /url\(\s*["']?([^"')?#]+)["']?\s*\)/gi;
const missing = new Map();
/* Credit-only metadata: these records document the two source halves of the Venus map that was merged
   into ss/tex/venus.jpg; they are shown on the Credits page as text and are never loaded as files. */
const METADATA_ONLY = new Set(["ss/tex/venusW.jpg", "ss/tex/venusE.jpg"]);
const isExternal = s => /^(?:[a-z][a-z0-9+.-]*:|\/\/|#|data:|mailto:)/i.test(s);
function check(ref, baseDir, from) {
  if (!ref || isExternal(ref) || ref.includes("${") || ref.includes("{")) return;
  let p = ref.replace(/^\.\//, "");
  const abs = p.startsWith("/") ? path.join(PUB, p) : path.join(baseDir, p);
  const key = path.relative(PUB, abs).split(path.sep).join("/");
  if (key.startsWith("..")) return;
  if (METADATA_ONLY.has(key)) return;
  if (!exists.has(key) && !(fs.existsSync(abs) && fs.statSync(abs).isDirectory())) {
    if (!missing.has(key)) missing.set(key, new Set());
    missing.get(key).add(rel(from));
  }
}
for (const f of files) {
  const ext = path.extname(f).toLowerCase();
  if (![".html", ".css", ".js"].includes(ext)) continue;
  if (/\/lib\//.test(f.split(path.sep).join("/"))) continue; // third-party bundles (three.js etc.)
  const src = fs.readFileSync(f, "utf8");
  if (ext === ".html") {
    for (const m of src.matchAll(attrRe)) check(m[1], PUB, f);
    for (const m of src.matchAll(urlRe)) check(m[1], PUB, f);
    for (const m of src.matchAll(strRe)) check(m[1], PUB, f);
  } else if (ext === ".css") {
    for (const m of src.matchAll(urlRe)) check(m[1], path.dirname(f), f);
  } else {
    // JS paths are resolved against the document (index.html), not the script's folder
    for (const m of src.matchAll(strRe)) check(m[1], PUB, f);
  }
}
for (const [k, from] of missing) errors.push(`missing asset "${k}" (referenced in ${[...from].slice(0, 3).join(", ")})`);

/* 4 · secrets must never be served */
const SECRET = [/sk-ant-[A-Za-z0-9_-]{10,}/, /(?<![A-Za-z0-9+/])AKIA[0-9A-Z]{16}(?![A-Za-z0-9+/=])/, /-----BEGIN [A-Z ]*PRIVATE KEY-----/, /ghp_[A-Za-z0-9]{30,}/, /xox[baprs]-[A-Za-z0-9-]{10,}/];
for (const f of files.concat(walk(path.join(ROOT, "api")))) {
  if (fs.statSync(f).size > 20e6 || !/\.(js|html|css|json|txt|vtt|md)$/i.test(f)) continue;
  const src = fs.readFileSync(f, "utf8");
  for (const re of SECRET) if (re.test(src)) errors.push(`possible secret in ${rel(f)} (${re})`);
}
for (const envf of [".env", ".env.local"]) if (fs.existsSync(path.join(PUB, envf))) errors.push(`public/${envf} must not exist (it would be served)`);

/* 5 · API function */
try {
  const mod = await import(pathToFileURL(path.join(ROOT, "api", "claude.js")).href);
  if (!mod.default || typeof mod.default.fetch !== "function") errors.push("api/claude.js must export default { fetch }");
  else {
    const saved = process.env.ANTHROPIC_API_KEY; delete process.env.ANTHROPIC_API_KEY;
    const r = await mod.default.fetch(new Request("http://localhost/api/claude"));
    const j = await r.json();
    if (r.status !== 200 || j.enabled !== false) errors.push("api/claude.js GET without a key should return {enabled:false}");
    const p = await mod.default.fetch(new Request("http://localhost/api/claude", { method: "POST", body: "{}" }));
    if (p.status !== 503) errors.push("api/claude.js POST without a key should return 503");
    if (saved !== undefined) process.env.ANTHROPIC_API_KEY = saved;
  }
} catch (e) { errors.push("api/claude.js failed to load: " + e.message); }

/* 6 · config + size notes */
try { JSON.parse(fs.readFileSync(path.join(ROOT, "vercel.json"), "utf8")); } catch (e) { errors.push("vercel.json is not valid JSON: " + e.message); }
const mb = totalBytes / 1048576;
if (mb > 100) warnings.push(`public/ is ${mb.toFixed(1)} MB. Deploying with the Vercel CLI on the Hobby plan is limited to 100 MB of source files — deploy from a Git repository instead (see README).`);
for (const f of files) { const s = fs.statSync(f).size; if (s > 95 * 1048576) warnings.push(`${rel(f)} is ${(s / 1048576).toFixed(0)} MB — GitHub rejects files over 100 MB`); }

console.log(`Forgotten Explorers build check: ${files.length} files, ${mb.toFixed(1)} MB in public/, ${jsFiles.length} scripts checked, ${exists.size} assets indexed.`);
for (const w of warnings) console.warn("WARN  " + w);
if (errors.length) { for (const e of errors) console.error("ERROR " + e); console.error(`\nBuild check failed with ${errors.length} error(s).`); process.exit(1); }
console.log("Build check passed — public/ is ready to deploy.");
