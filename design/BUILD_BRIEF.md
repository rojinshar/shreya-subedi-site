# shreyasubedi.net — build brief for Claude Code

Build a **static, single-page, fully responsive** portfolio site for Shreya Subedi, a Nepali content creator (POV and relatable comedy) and marketing analyst. The **exact visual reference** is the attached `Main.dc.html`. Its markup and inline styles are the source of truth for every size, color, radius and spacing value. Reproduce them faithfully. Don't round or "improve" them.

## How to read `Main.dc.html`
It's a design-tool file, not production HTML. Convert it like this:
- Drop `<x-dc>`, `<helmet>`, `<script type="text/x-dc">` and the `support.js` line.
- `<sc-for list="{{brands}}" as="b">…{{b}}…</sc-for>` is a loop. The data arrays are in `renderVals()` at the bottom of the file. Render them statically: write them out by hand, or loop at build time.
- Move the repeated inline styles into CSS classes or tokens (below), keeping every value. The output should be semantic HTML plus one stylesheet.

## Stack
Plain HTML + CSS (or Astro if you prefer components). No JS framework. Small vanilla JS is allowed only for the mobile nav and the "copy email" action. It has to deploy as static files to the existing domain.

## Tokens
```css
:root{
  --paper:#F2F0EB; --white:#FFFFFF; --ink:#151515; --ink-2:#4F4D48; --muted:#5C5A55;
  --line:#E6E3DC; --pink:#F5A3E4; --pink-tint:#FBD9F3; --lilac:#A99CF5; --green:#97E283;
  --magenta:#A3106F; --night:#1F1F1F;
  --font-display:"Inter Tight", "Arial Narrow", sans-serif;
  --font-body:Inter, system-ui, -apple-system, "Segoe UI", sans-serif;
  --font-mono:"JetBrains Mono", ui-monospace, monospace;
  --r-pill:999px; --r-xl:32px; --r-lg:24px; --r-md:16px;
  --container:1200px; --gutter:clamp(16px,4cqi,40px); --section-y:clamp(56px,8cqi,104px);
}
```
Google Fonts: Inter Tight 600/700/800, Inter 400/500/600, JetBrains Mono 500 (`display=swap`).

## Responsive approach (most important)
- Put `container-type:inline-size` on the page wrapper (`<body>` child). All fluid sizes use `cqi` inside `clamp()`, exactly as in the file. Using `vw` instead gives the same result on a real page.
- Every multi-column layout is `grid-template-columns: repeat(auto-fit, minmax(min(MINpx,100%),1fr))`. MIN values: 440 for the hero, about, research and case-study splits; 300 for campaign cards; 280 for services and off-feed cards; 180 for the stat bar; 140 for hero stats; 160 for video thumbnails (`auto-fill`).
- Nav: when the nav bar is 760px wide or more, it's a single row in one dark pill: name, then the centred links, then the CTA. Below that, show the name, the CTA and a round 44px menu button (hamburger that turns into an X). The button opens the links inside the same dark bar as a stacked list in 22px bold type. The bar's radius changes from pill to 28px while it's open, and tapping a link closes it. Don't ever show the links as a second row.
- Test at 360, 390, 768, 834, 1024, 1280 and 1440 wide, with no horizontal scroll at any width. Every tap target is ≥44px.

## Sections (in order, with anchors)
1. Sticky nav: `#about #results #research #work #services`, plus a "Work with me" link to `#contact`
2. Hero: eyebrow, H1 "Content Nepal can’t scroll past.", intro, 4 chips, 2 CTAs, 3 stats, a stack of 3 rotated 9:16 video covers
3. Featured on (Kantipur Television, News24, BBC Media Action) and a **brand logo carousel** (spec below)
4. `#about`: portrait with "2.8×" sticker, story, education and toolkit, CV download, dark 4-stat bar
5. `#results`: 3 campaign cards (Wai Wai 1.47M, top campaign; inDrive "Dream It, Do It" 859K+, 2:38, her longest video; eSewa 561K, digital payments) and a ranked bar list (Fonepoints 557.1K, Ultima 368.1K, Gazzabko Noodles 358.6K, Fasto 312.2K, Daraz 86.3K). Bar widths are relative to 1,469,575.
6. Case studies: Mid Valley College (Facebook 500 → 27K+, 54×; TikTok 100 → 6K+, 60×; all bars on one 27,000 scale) and Praavi Pahiran (1M+ organic views → +35% sales, zero ad spend)
7. `#research`: dark band, 55-video analysis, median-views bar chart (62,350 for humor-first, 46 videos; 22,208 for direct, 6 videos), plus the Clip 44 timeline (48s video; average viewer watched 14s; brand appeared at 31s). The GitHub button links to https://github.com/subedishreya17-create/branded-content-performance-analysis
8. `#work`: 9:16 thumbnails in 2 groups. Each thumbnail is a link to one reel on TikTok, Instagram or Facebook, opening in a new tab (`target="_blank" rel="noopener"`). No embeds. Keep the videos in one data file (`videos.json` or a JS array) so adding a reel means adding one entry: `{ "group": "brand"|"original", "brand": "Wai Wai", "title": "…", "views": "1.47M", "platform": "TikTok"|"Instagram"|"Facebook", "url": "https://…", "thumb": "/assets/img/thumbs/waiwai.webp" }`. Show "<platform> ↗" under each title, and use `aria-label="Watch on <platform>: <title>"`. The same pattern applies to the "Watch the video" links on the campaign cards.
9. Off the feed: TV, BBC Media Action, Shreya Simplifies
10. `#services`: pink, lilac and green cards
11. `#contact`: dark CTA block with "Open to marketing analytics roles, brand collaborations and research conversations." It has an email link (subedishreya17@gmail.com) with a copy-to-clipboard button, LinkedIn, and GitHub (https://github.com/subedishreya17-create)
12. Footer: pink block, links, social icons, the name huge (`clamp(54px,15.5cqi,220px)`, one line)

## Brand logo carousel
- **Behavior:** it pages through the logos (no continuous marquee). It's swipeable on touch and trackpad, advances one page every **5s**, and loops.
- **Structure:** a horizontal track with `overflow-x:auto; scroll-snap-type:x mandatory; scrollbar-width:none`. Each page is a `ul` with `flex:0 0 100%; scroll-snap-align:start; scroll-snap-stop:always` and a grid inside. Native scroll-snap gives you swiping for free.
- **Logos per page:** 8 in one row at ≥1000px, 4 in one row at 560–999px, and a 2×2 grid below 560px. Regroup the pages when the track resizes (a ResizeObserver on the track; snap back to page 1).
- **Auto-advance:** `track.scrollTo({left: page*track.clientWidth, behavior:'smooth'})`. Pause on hover and on focus within. Skip a tick if the user swiped or tapped in the last 5s. Disable it under `prefers-reduced-motion`.
- **Dots:** buttons with ≥44px hit areas, `aria-label="Show brands page N"` and `aria-current` on the active one. The active dot is a 24×8 pill in `--ink`, the rest are 8×8 in `#C9C5BD`. Update the active page from `scroll` events (`Math.round(scrollLeft/clientWidth)`).
- **Edges:** fade both sides with `mask-image: linear-gradient(90deg, transparent 0, #000 5%, #000 95%, transparent 100%)`.
- **Logo files:** the design shows grey wordmark placeholders. Use her real logo files (from the brands or their press kits) as SVG in `/assets/logos/`, each 40px tall with `max-width:100%`. Style them `filter:grayscale(1); opacity:.55`, going to `opacity:.9` on hover, and give each an `alt="<Brand> logo"`. The region gets `role="region" aria-roledescription="carousel" aria-label="Brands I’ve worked with"`.
- **Order:** inDrive, eSewa, Wai Wai, Daraz, Royal Enfield, vivo, Colgate, Sunsilk, Ncell, Ultima, Fonepoints, Joy Papaya, Fasto, Big Mart, British Council Nepal, Nepal Life Insurance, Jeevee, IDP Nepal, Gazzabko Noodles. (She's worked with 45+ brands; add more as logos arrive. The pages regroup automatically.)

## Images
Placeholders are labelled IMG-xx in the file. Put the images in `/assets/img/` as WebP with a JPG fallback, set explicit `width`/`height` attributes, and use `loading="lazy"` for everything below the hero. Sizes: IMG-01 at 4:5 1200×1500; IMG-02 and the 2 stack covers at 9:16 1080×1920; IMG-03–05 at 4:3 1200×900; IMG-06–13 at 9:16 720×1280; IMG-20–22 at 4:3 1200×900; plus a 1200×630 OG image. Until real photos exist, keep the striped placeholder.

## Placeholders still to fill
(Confirmed: 60M+ organic views and 45+ brands, already in the design.) `[VIDEO-URL]` + platform ×11 · `[TIKTOK-PROFILE-URL]`, `[TIKTOK-URL]`, `[INSTAGRAM-URL]`, `[YOUTUBE-URL]`, `[LINKEDIN-URL]`, `[CV-PDF-URL]` · Ultima and Fasto categories · one-line idea for each featured campaign · video titles.

## Quality bar
- Semantic landmarks (`header`, `nav`, `main`, `section[aria-labelledby]`, `footer`). Decorative SVGs get `aria-hidden`. Charts get an `aria-label` with the numbers.
- Contrast ≥4.5:1 for all text. A visible focus ring: 2px `--magenta` outline, 3px offset.
- Respect `prefers-reduced-motion`. The only motion is a subtle hover lift on cards and thumbnails (translateY(-2px), 150ms).
- Meta: title "Shreya Subedi · Nepali POV & Relatable Comedy", a description, and OG/Twitter tags with `/og-image.jpg`.
- Lighthouse ≥95 for performance and accessibility on mobile.
