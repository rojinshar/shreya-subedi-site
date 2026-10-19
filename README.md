# Shreya Subedi — portfolio site

A static, single-page site at shreyasubedi.net: plain HTML, one stylesheet and
a little vanilla JS (mobile nav, brand carousel, copy email). Vite is only the
build step. Deployed to Cloudflare Pages from GitHub.

The visual reference is [`design/Main.dc.html`](design/Main.dc.html) and the
spec is [`design/BUILD_BRIEF.md`](design/BUILD_BRIEF.md).

## Where things live

| File | What's in it |
| ---- | ------------ |
| `index.html` | All page copy and markup |
| `src/styles.css` | Every style, with the design tokens at the top |
| `src/main.js` | Nav menu, carousel, copy-to-clipboard |
| `src/data/videos.json` | The "Watch the work" thumbnails |
| `src/data/brands.json` | The brand logo carousel, in order |
| `public/` | Files served as-is (favicon, `og-image.jpg`, images, logos, CV) |

`vite.config.js` renders the two JSON files into the page at build time, so the
live site is plain HTML.

### Adding a video

Add one entry to `src/data/videos.json`:

```json
{ "group": "brand", "brand": "Wai Wai", "title": "…", "views": "1.47M", "platform": "TikTok", "url": "https://…", "thumb": "/assets/img/thumbs/waiwai.webp" }
```

`group` is `"brand"` or `"original"`. `platform` is `TikTok`, `Instagram` or
`Facebook`. Put the thumbnail (720×1280) in `public/assets/img/thumbs/` as
`.webp` with a `.jpg` of the same name beside it. Leave `thumb` empty to keep
the striped placeholder.

### Adding a brand logo

Put the SVG in `public/assets/logos/` and set its `logo` path in
`src/data/brands.json`, e.g. `"logo": "/assets/logos/wai-wai.svg"`. Entries
without a logo show the brand name as grey text. The carousel regroups its pages
automatically.

## Running locally

Requires Node 22 (`nvm use` reads `.nvmrc`).

```sh
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs dist/
```

## Deploying

Cloudflare Pages builds from the `main` branch on GitHub:

| Setting          | Value           |
| ---------------- | --------------- |
| Framework preset | None            |
| Build command    | `npm run build` |
| Output directory | `dist`          |

Every push to `main` redeploys the site.
