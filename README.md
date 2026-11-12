# Forgotten Explorers

An independent educational archive of humanity's space-exploration missions, built for the **NASA Space Apps Challenge 2026**.
Built by **heisenberg.exe**.

It's a static single-page app with hand-written HTML, CSS and JavaScript. It has no framework and needs no bundler.
Vercel serves it as static files, plus **one serverless function** (`api/claude.js`) that powers the optional AI features.

---

## What's inside

```
Forgotten-Explorers-Vercel/
├─ public/                 ← the website (served as-is)
│  ├─ index.html           ← entry document (hash-based routing: #home, #nasa, #moon, #mars, #international …)
│  ├─ app.js               ← router, pages, NOVA assistant, UI
│  ├─ i18n.js …            ← translations (English, বাংলা, Español, Français, العربية)
│  ├─ data.js, media.js    ← mission archive + image metadata
│  ├─ md/  mx/             ← Moon and Mars documentaries (audio, clips, captions)
│  ├─ wm/                  ← "Why Mars?" interactive science page
│  ├─ jr/                  ← The Last Journey (Opportunity)
│  ├─ doc/                 ← The Silent Legacy documentary
│  ├─ hw/                  ← Hardware Locator (Moon & Mars)
│  ├─ ss/                  ← 3D Solar System explorer
│  ├─ museum.js, models/   ← 3D Museum (glTF models)
│  ├─ veh/                 ← spacecraft engineering pages
│  ├─ lib/                 ← vendored libraries (three.js)
│  └─ img/ media/ audio/   ← images, video, sound
├─ api/claude.js           ← Vercel Function: server-side proxy to the Anthropic Claude API
├─ scripts/verify.mjs      ← production build check (`npm run build`)
├─ scripts/dev-server.mjs  ← local preview server (`npm run dev`)
├─ dev-tools/              ← authoring scripts and tests (not deployed, see below)
├─ vercel.json             ← Vercel settings: output dir, function limits, cache and security headers
├─ package.json
├─ .env.example            ← environment variables to set (no real values)
└─ README.md
```

**Routes.** All navigation uses URL hashes (`/#nasa`, `/#moon/apollo`, `/#international/esa`, `/#why-mars`, `/#m-perseverance` …), so no server rewrites are needed. Deep links and refreshes work on any static host.

**Fonts.** The site uses Montserrat (400–800) for all text and interface elements and DM Mono for technical data (mission IDs, dates, coordinates, specifications), with Anek Bangla and IBM Plex Sans Arabic for Bengali and Arabic. They load from Google Fonts, linked in `index.html`, and are set once as the `--font-primary` and `--font-technical` tokens.

**Dependencies.** None at runtime. The function uses the built-in `fetch` from Node.js 20 or later. `npm install` still works and simply installs nothing.

---

## Run locally

Requirements: **Node.js 20 or later** and npm (Vercel builds with Node.js 22, as set in `package.json`).

```bash
npm install
cp .env.example .env.local     # optional: add ANTHROPIC_API_KEY to enable AI mode
npm run dev                    # → http://localhost:3000
```

Without a key, the whole site works and NOVA answers in **archive mode** straight from the mission records.
You can also use the Vercel CLI instead: `npx vercel dev`.

Run the production check at any time:

```bash
npm run build
```

It fails if any of these are true:

- `index.html` is incomplete
- any JavaScript file has a syntax error
- a referenced image, audio, video, model, caption or script file is missing
- anything that looks like an API key or secret is found in the served files
- the API function doesn't load

---

## Deploy to Vercel

> **Use Git deployment.** `public/` is about **114 MB**. On the Hobby plan, Vercel limits **CLI** uploads to 100 MB of source files. Deploying from a Git repository avoids that limit. The largest single file is under 7 MB, so GitHub accepts every file.

1. Create a new GitHub (or GitLab / Bitbucket) repository and push this folder:
   ```bash
   git init
   git add .
   git commit -m "Forgotten Explorers"
   git branch -M main
   git remote add origin https://github.com/<you>/forgotten-explorers.git
   git push -u origin main
   ```
2. In Vercel: **Add New → Project**, then import the repository.
3. Vercel reads `vercel.json` automatically. The settings should be:
   - Framework Preset: **Other**
   - Install Command: `npm install`
   - Build Command: `npm run build`
   - Output Directory: `public`
4. *(Optional, for AI mode)* Go to **Settings → Environment Variables** and add `ANTHROPIC_API_KEY`. Also set `ALLOWED_ORIGINS` to your site URL, for example `https://forgotten-explorers.vercel.app`. Apply them to Production, then redeploy.
5. Deploy. Check that the deployment works:
   - `/` loads the homepage.
   - `/api/claude` returns `{"enabled":true}`, or `false` if no key is set.

**Pro plan or a small CLI deploy:** `npx vercel --prod` works from this folder if your plan's upload limit allows 114 MB.

---

## Images and performance

- **Formats.** Photos are served as WebP. A few files stay JPEG because WebP was not at least 15% smaller for them:
  - Solar System textures (`ss/tex`)
  - Hardware Locator maps (`hw/reg`)
  - The Last Journey images (`jr/img`)
  - Hardware photos (`hw/img`)
  - A handful of very detailed photos
- **Sizes.** Every gallery photo has a 760-pixel version in `img/t/` for cards and plates. Full-width backgrounds use `srcset`/`sizes`, so phones never download a larger file than their screen needs.
- **Small icons.** Timeline rows, search results and credits use one sprite sheet (`img/icons.webp`) instead of dozens of photos. The documentary archives use their own sprite sheets (`md/img/sprite.webp`, `mx/img/sprite.webp`).
- **Loading order.**
  - A small script in `<head>` preloads the first visible photo of the page you land on.
  - Every other photo is `loading="lazy"`.
  - A shared `IntersectionObserver` in `app.js` (`IMGPRIME`) switches a photo to eager loading when it comes within about 1.5 screens (more on slow connections), and pre-decodes it.
  - Space is always reserved by `width`/`height` or the container, so nothing shifts.
- **Caching** (`vercel.json`):
  - Images and media: 1 day, then revalidated in the background for up to 7 days.
  - JS, CSS and HTML: always revalidated with ETags.
  - `lib/`: 30 days.
  - File names are not content-hashed, so images are deliberately not marked `immutable`. If you replace an image, give it a new file name to bypass browser caches immediately.
- **Regenerating.** `dev-tools/webpify.py` (WebP conversion and thumbnails) and `dev-tools/sprites.py` (sprite sheets) are the scripts used to build these files.

---

## Environment variables

See `.env.example`. **Never commit real values.** `.gitignore` and `.vercelignore` already exclude `.env` and `.env.local`.

| Variable | Required | Default | Purpose |
|---|---|---|---|
| `ANTHROPIC_API_KEY` | for AI mode | — | Server-side key for the Claude API. It never reaches the browser. |
| `ANTHROPIC_MODEL` | no | `claude-sonnet-5-5` | Model used by NOVA and the translation buttons. |
| `AI_ENABLED` | no | `true` | Set to `false` to turn AI off without deleting the key. |
| `ALLOWED_ORIGINS` | recommended | *(any)* | Comma-separated site origins allowed to call `/api/claude`. |
| `RATE_LIMIT_PER_MINUTE` | no | `20` | Best-effort limit per visitor IP, counted separately by each function instance. |
| `MAX_OUTPUT_TOKENS` | no | `4000` | Maximum output tokens per AI call. |

### How the AI features work

- **On claude.ai** (the original artifact), NOVA and the translation buttons use Claude through the viewer's claude.ai account.
- **On Vercel**, the same features call `/api/claude`. That function adds the API key on the server and forwards a size-limited request to the Anthropic Messages API.
- **Archive mode:** if neither is available, the site automatically uses archive mode. Nothing breaks.

Mission tools (archive search, hardware lookup) still run in the browser against the local archive. The function only relays messages.

**Cost and abuse.** The endpoint is public, so anyone who finds it could send requests that you pay for. Before going live:

- Set `ALLOWED_ORIGINS`.
- Set a monthly spend limit in the Anthropic Console.
- Consider a **Vercel Firewall rate-limit rule** on `/api/claude`. The built-in limiter applies per function instance only.

---

## Authoring tools (`dev-tools/`)

These were used to build the site's generated files. They are **not needed to deploy** and are excluded from deployment by `.vercelignore`.

- **Translation sources and generators:**
  - Moon documentary: `md/`
  - Mars documentary: `mx/`
  - Why Mars?: `wm/`
  - The Last Journey: `jr/`
  - The Silent Legacy: `doc/`
- **Tests** (`tests/`):
  - `i18n-check.js` validates all five languages. Run it with `node dev-tools/tests/i18n-check.js public` after `npm i -D acorn acorn-walk`.
  - Playwright end-to-end scripts.

Some of these scripts contain absolute paths from the original build machine. Adjust the paths before running them.

---

## Credits and licences

- **Images and video** come from NASA, ESA and other space agencies through their public archives. Each item is credited on the **Credits** page (`/#credits`) and in each feature's sources panel, with links to the original records. Illustrations and concept art are labelled as such.
- **three.js** (MIT licence) is vendored in `public/lib/`.
- This project is **not affiliated with or endorsed by NASA** or any other space agency.
