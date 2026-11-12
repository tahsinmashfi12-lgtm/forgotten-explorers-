/**
 * Forgotten Explorers — AI proxy (Vercel Function, Node.js runtime).
 *
 * The browser never sees the Anthropic API key. NOVA (the archive assistant) and the
 * "translate" buttons call this endpoint; it forwards a bounded request to the
 * Anthropic Messages API and returns the response.
 *
 *   GET  /api/claude  -> { enabled: boolean }   (the site uses this to choose AI mode or archive mode)
 *   POST /api/claude  -> Anthropic Messages API response (content, stop_reason)
 *
 * Environment variables: see .env.example. Without ANTHROPIC_API_KEY the endpoint reports
 * enabled:false and the site keeps working in its offline "archive mode".
 */

const API_URL = "https://api.anthropic.com/v1/messages";
const API_VERSION = "2023-06-01";
const MAX_BODY_BYTES = 400_000;      // NOVA prompt + history + tool results, or a translation payload
const MAX_MESSAGES = 40;
const MAX_TOOLS = 10;

const env = name => (typeof process !== "undefined" && process.env ? process.env[name] : undefined);
const num = (v, d) => { const n = parseInt(v, 10); return Number.isFinite(n) && n > 0 ? n : d; };

function config() {
  const key = (env("ANTHROPIC_API_KEY") || "").trim();
  const flag = (env("AI_ENABLED") || "true").trim().toLowerCase();
  return {
    key,
    enabled: !!key && flag !== "false" && flag !== "0",
    model: (env("ANTHROPIC_MODEL") || "claude-sonnet-5-5").trim(),
    maxTokens: num(env("MAX_OUTPUT_TOKENS"), 4000),
    perMinute: num(env("RATE_LIMIT_PER_MINUTE"), 20),
    origins: (env("ALLOWED_ORIGINS") || "").split(",").map(s => s.trim().replace(/\/$/, "")).filter(Boolean)
  };
}

const json = (status, body, extra = {}) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...extra } });

/* Best-effort per-instance rate limit (each warm function instance keeps its own window).
   For stronger protection use Vercel Firewall rate-limiting rules or a shared store. */
const hits = new Map();
function limited(ip, perMinute) {
  const now = Date.now(), win = 60_000;
  const list = (hits.get(ip) || []).filter(t => now - t < win);
  if (list.length >= perMinute) { hits.set(ip, list); return true; }
  list.push(now); hits.set(ip, list);
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.length || now - v[v.length - 1] > win) hits.delete(k);
  return false;
}

function originAllowed(request, origins) {
  if (!origins.length) return true;
  const o = (request.headers.get("origin") || "").replace(/\/$/, "");
  if (!o) { // same-origin GET/fetch from some browsers omits Origin; fall back to Referer
    const r = request.headers.get("referer") || "";
    return origins.some(a => r.startsWith(a + "/") || r === a);
  }
  return origins.includes(o);
}

/* Only pass through the shapes the site actually sends. */
function cleanContent(c) {
  if (typeof c === "string") return c.slice(0, 120_000);
  if (!Array.isArray(c)) return "";
  return c.slice(0, 50).map(b => {
    if (!b || typeof b !== "object") return null;
    if (b.type === "text") return { type: "text", text: String(b.text || "").slice(0, 120_000) };
    if (b.type === "tool_use") return { type: "tool_use", id: String(b.id), name: String(b.name), input: b.input && typeof b.input === "object" ? b.input : {} };
    if (b.type === "tool_result") return { type: "tool_result", tool_use_id: String(b.tool_use_id), content: String(b.content ?? "").slice(0, 40_000), ...(b.is_error ? { is_error: true } : {}) };
    return null;
  }).filter(Boolean);
}

async function handleGet(request) {
  const c = config();
  return json(200, { enabled: c.enabled && originAllowed(request, c.origins) });
}

async function handlePost(request) {
  const c = config();
  if (!c.enabled) return json(503, { error: "AI mode is not configured on this deployment." });
  if (!originAllowed(request, c.origins)) return json(403, { error: "Origin not allowed." });

  const ip = (request.headers.get("x-forwarded-for") || "").split(",")[0].trim() || request.headers.get("x-real-ip") || "unknown";
  if (limited(ip, c.perMinute)) return json(429, { error: "Too many requests. Please wait a minute." }, { "retry-after": "60" });

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return json(413, { error: "Request too large." });
  let body;
  try { body = JSON.parse(raw); } catch { return json(400, { error: "Invalid JSON." }); }

  const messages = Array.isArray(body.messages) ? body.messages.slice(-MAX_MESSAGES) : [];
  const clean = messages
    .filter(m => m && (m.role === "user" || m.role === "assistant"))
    .map(m => ({ role: m.role, content: cleanContent(m.content) }))
    .filter(m => (typeof m.content === "string" ? m.content.length : m.content.length));
  if (!clean.length || clean[0].role !== "user") return json(400, { error: "messages must start with a user message." });

  const tools = Array.isArray(body.tools) ? body.tools.slice(0, MAX_TOOLS).map(t => ({
    name: String(t.name || "").slice(0, 64),
    description: String(t.description || "").slice(0, 1000),
    input_schema: t.input_schema && typeof t.input_schema === "object" ? t.input_schema : { type: "object", properties: {} }
  })).filter(t => /^[a-zA-Z0-9_-]{1,64}$/.test(t.name)) : [];

  const payload = {
    model: c.model,
    max_tokens: Math.min(num(body.max_tokens, 1200), c.maxTokens),
    messages: clean,
    ...(tools.length ? { tools } : {})
  };

  let upstream;
  try {
    upstream = await fetch(API_URL, {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": c.key, "anthropic-version": API_VERSION },
      body: JSON.stringify(payload)
    });
  } catch (e) {
    return json(502, { error: "Could not reach the AI service." });
  }
  let data = null;
  try { data = await upstream.json(); } catch {}
  if (!upstream.ok || !data) {
    const msg = data && data.error && data.error.message ? data.error.message : "AI service error (" + upstream.status + ")";
    // never echo request headers or the key; only the upstream error message
    return json(upstream.status === 429 ? 429 : 502, { error: msg });
  }
  return json(200, { content: data.content || [], stop_reason: data.stop_reason || null, model: data.model || c.model });
}

/* Vercel Function entry point (Web-standard fetch handler; no framework needed). */
export default {
  async fetch(request) {
    if (request.method === "GET" || request.method === "HEAD") return handleGet(request);
    if (request.method === "POST") return handlePost(request);
    return json(405, { error: "Method not allowed." }, { allow: "GET, POST" });
  }
};
