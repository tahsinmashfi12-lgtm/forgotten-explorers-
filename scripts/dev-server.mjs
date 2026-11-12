#!/usr/bin/env node
/**
 * Local preview server — no dependencies. Serves /public like Vercel does and routes
 * /api/claude to the same function file Vercel deploys (api/claude.js).
 *
 *   npm run dev            -> http://localhost:3000
 *   PORT=8080 npm run dev  -> custom port
 *
 * Reads .env.local (then .env) for ANTHROPIC_API_KEY etc. Without a key, NOVA runs in archive mode.
 * (`vercel dev` from the Vercel CLI works too, if you prefer.)
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUB = path.join(ROOT, "public");

for (const f of [".env.local", ".env"]) {
  const p = path.join(ROOT, f);
  if (!fs.existsSync(p)) continue;
  for (const line of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !line.trim().startsWith("#") && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const api = (await import(pathToFileURL(path.join(ROOT, "api", "claude.js")).href)).default;
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json", ".vtt": "text/vtt; charset=utf-8", ".txt": "text/plain; charset=utf-8",
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".gif": "image/gif", ".svg": "image/svg+xml", ".ico": "image/x-icon",
  ".mp3": "audio/mpeg", ".mp4": "video/mp4", ".webm": "video/webm", ".glb": "model/gltf-binary", ".gltf": "model/gltf+json", ".bin": "application/octet-stream", ".woff2": "font/woff2", ".woff": "font/woff" };

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  try {
    if (url.pathname === "/api/claude") {
      const chunks = []; for await (const c of req) chunks.push(c);
      const request = new Request(url.href, { method: req.method, headers: req.headers, body: ["GET", "HEAD"].includes(req.method) ? undefined : Buffer.concat(chunks) });
      const r = await api.fetch(request);
      res.writeHead(r.status, Object.fromEntries(r.headers)); res.end(Buffer.from(await r.arrayBuffer())); return;
    }
    let p = decodeURIComponent(url.pathname); if (p.endsWith("/")) p += "index.html";
    const file = path.join(PUB, p);
    if (!file.startsWith(PUB) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404, { "content-type": "text/plain" }); res.end("Not found"); return; }
    const stat = fs.statSync(file), type = TYPES[path.extname(file).toLowerCase()] || "application/octet-stream";
    const range = req.headers.range && /^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
    if (range) { // audio/video seeking
      const start = range[1] ? +range[1] : 0, end = range[2] ? +range[2] : stat.size - 1;
      res.writeHead(206, { "content-type": type, "content-range": `bytes ${start}-${end}/${stat.size}`, "accept-ranges": "bytes", "content-length": end - start + 1 });
      fs.createReadStream(file, { start, end }).pipe(res); return;
    }
    res.writeHead(200, { "content-type": type, "content-length": stat.size, "accept-ranges": "bytes" });
    fs.createReadStream(file).pipe(res);
  } catch (e) { res.writeHead(500, { "content-type": "text/plain" }); res.end("Server error: " + e.message); }
});
const port = +process.env.PORT || 3000;
server.listen(port, () => console.log(`Forgotten Explorers running at http://localhost:${port}  (AI mode: ${process.env.ANTHROPIC_API_KEY ? "key found" : "off — archive mode"})`));
