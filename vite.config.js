import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

// The brand carousel and the video grid are rendered into index.html at
// build time from these files, so adding a reel or a logo means adding one
// entry. The page itself ships as static HTML.
const dataFiles = {
  brands: fileURLToPath(new URL('./src/data/brands.json', import.meta.url)),
  videos: fileURLToPath(new URL('./src/data/videos.json', import.meta.url)),
}

// Logos per carousel page at desktop widths; src/main.js regroups the pages
// for narrower tracks.
const BRANDS_PER_PAGE = 8

const groups = [
  { key: 'brand', title: 'Brand campaigns' },
  { key: 'original', title: 'Comedy &amp; POV' },
]

const escape = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')

const readJson = (file) => JSON.parse(readFileSync(file, 'utf8'))

const playIcon = (size) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="#151515" aria-hidden="true"><path d="M8 5v14l11-7z"></path></svg>`

// WebP with a JPG fallback next to it (same name, .jpg).
function picture(src, { width, height, className }) {
  const img = `<img class="${className}" src="${escape(src.replace(/\.webp$/, '.jpg'))}" alt="" width="${width}" height="${height}" loading="lazy" decoding="async">`
  if (!src.endsWith('.webp')) return img
  return `<picture><source type="image/webp" srcset="${escape(src)}">${img}</picture>`
}

function renderBrands() {
  const brands = readJson(dataFiles.brands)
  const pageCount = Math.ceil(brands.length / BRANDS_PER_PAGE)
  const pages = []
  for (let i = 0; i < pageCount; i++) {
    const items = brands
      .slice(i * BRANDS_PER_PAGE, (i + 1) * BRANDS_PER_PAGE)
      .map(({ name, logo }) => {
        const label = `${escape(name)} logo`
        const mark = logo
          ? `<img class="brand-logo brand-logo--file" src="${escape(logo)}" alt="${label}" height="40" loading="lazy" decoding="async">`
          : `<span class="brand-logo" role="img" aria-label="${label}">${escape(name)}</span>`
        return `<li>${mark}</li>`
      })
      .join('')
    pages.push(
      `<ul class="brand-page" aria-label="Brands, page ${i + 1} of ${pageCount}" style="--cols: ${BRANDS_PER_PAGE}">${items}</ul>`,
    )
  }
  const dots = Array.from(
    { length: pageCount },
    (_, i) =>
      `<button type="button" class="carousel-dot" aria-label="Show brands page ${i + 1}" aria-current="${i === 0}"><span></span></button>`,
  ).join('')
  return { pages: pages.join('\n'), dots }
}

function renderVideos() {
  const videos = readJson(dataFiles.videos)
  return groups
    .map(({ key, title }) => {
      const items = videos
        .filter((video) => video.group === key)
        .map((video) => {
          const cover = video.thumb
            ? picture(video.thumb, { width: 720, height: 1280, className: 'video-img' })
            : ''
          const placeholder = video.thumb
            ? ''
            : `<span class="video-placeholder">${escape(video.placeholder ?? '9:16')}</span>`
          return `<li class="video">
  <a class="video-thumb" href="${escape(video.url)}" target="_blank" rel="noopener" aria-label="Watch on ${escape(video.platform)}: ${escape(video.title)}">
    ${cover}
    <span class="video-badges"><span class="video-brand">${escape(video.brand)}</span><span class="video-views">${escape(video.views)}</span></span>
    <span class="video-play" aria-hidden="true">${playIcon(16)}</span>
    ${placeholder}
  </a>
  <span class="video-meta"><span class="video-title">${escape(video.title)}</span><span class="video-platform">${escape(video.platform)} ↗</span></span>
</li>`
        })
        .join('\n')
      return `<div class="video-group">
  <h3 class="video-group-title">${title} <span aria-hidden="true">→</span></h3>
  <ul class="video-grid">
${items}
  </ul>
</div>`
    })
    .join('\n')
}

function staticData() {
  return {
    name: 'static-data',
    transformIndexHtml(html) {
      const brands = renderBrands()
      return html
        .replace('<!-- @brand-pages -->', brands.pages)
        .replace('<!-- @brand-dots -->', brands.dots)
        .replace('<!-- @videos -->', renderVideos())
    },
    configureServer(server) {
      const files = Object.values(dataFiles)
      server.watcher.add(files)
      server.watcher.on('change', (file) => {
        if (files.includes(file)) server.ws.send({ type: 'full-reload' })
      })
    },
  }
}

export default defineConfig({
  plugins: [staticData()],
})
