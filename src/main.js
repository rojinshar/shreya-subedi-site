// Mobile nav, brand carousel and copy-email. Everything else is static HTML.

const NAV_WIDE = 760
const ADVANCE_MS = 5000

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

/* ---------- Nav ---------- */

function initNav() {
  const nav = document.querySelector('.nav')
  const toggle = nav?.querySelector('.nav-toggle')
  const menu = nav?.querySelector('.nav-menu')
  const icon = toggle?.querySelector('.nav-toggle-icon')
  if (!nav || !toggle || !menu || !icon) return

  const setOpen = (open) => {
    nav.classList.toggle('is-open', open)
    menu.hidden = !open
    toggle.setAttribute('aria-expanded', String(open))
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu')
    icon.setAttribute('d', open ? 'M6 6l12 12M18 6L6 18' : 'M4 7h16M4 12h16M4 17h16')
  }

  toggle.addEventListener('click', () => setOpen(menu.hidden))
  menu.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false)
  })
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !menu.hidden) {
      setOpen(false)
      toggle.focus()
    }
  })

  // The inline links take over once the bar is wide enough.
  new ResizeObserver(([entry]) => {
    if (entry.contentRect.width >= NAV_WIDE && !menu.hidden) setOpen(false)
  }).observe(nav)
}

/* ---------- Brand carousel ---------- */

// Logos per page and columns, by track width.
function layoutFor(width) {
  if (width < 560) return { per: 4, cols: 2 }
  if (width < 1000) return { per: 4, cols: 4 }
  return { per: 8, cols: 8 }
}

function initCarousel() {
  const region = document.querySelector('.carousel')
  const track = region?.querySelector('.carousel-track')
  const dotsWrap = region?.querySelector('.carousel-dots')
  if (!region || !track || !dotsWrap) return

  const items = [...track.querySelectorAll('li')]
  let page = 0
  let pageCount = 0
  let per = 0
  let paused = false
  let lastTouch = 0

  const dots = () => [...dotsWrap.children]

  const markCurrent = () => {
    dots().forEach((dot, i) => dot.setAttribute('aria-current', String(i === page)))
  }

  const goTo = (index) => {
    page = ((index % pageCount) + pageCount) % pageCount
    track.scrollTo({ left: page * track.clientWidth, behavior: reduceMotion.matches ? 'auto' : 'smooth' })
    markCurrent()
  }

  // Rebuild the pages (and dots) for the current track width.
  const regroup = () => {
    const layout = layoutFor(track.clientWidth)
    if (layout.per === per && track.children.length) {
      track.scrollLeft = 0
      page = 0
      markCurrent()
      return
    }
    per = layout.per
    pageCount = Math.ceil(items.length / per)
    track.replaceChildren()
    for (let i = 0; i < pageCount; i++) {
      const ul = document.createElement('ul')
      ul.className = 'brand-page'
      ul.setAttribute('aria-label', `Brands, page ${i + 1} of ${pageCount}`)
      ul.style.setProperty('--cols', layout.cols)
      ul.append(...items.slice(i * per, (i + 1) * per))
      track.append(ul)
    }
    dotsWrap.replaceChildren(
      ...Array.from({ length: pageCount }, (_, i) => {
        const dot = document.createElement('button')
        dot.type = 'button'
        dot.className = 'carousel-dot'
        dot.setAttribute('aria-label', `Show brands page ${i + 1}`)
        dot.append(document.createElement('span'))
        dot.addEventListener('click', () => {
          lastTouch = Date.now()
          goTo(i)
        })
        return dot
      }),
    )
    page = 0
    track.scrollLeft = 0
    markCurrent()
  }

  let lastWidth = -1
  new ResizeObserver(([entry]) => {
    const width = entry.contentRect.width
    if (Math.abs(width - lastWidth) > 1) {
      lastWidth = width
      regroup()
    }
  }).observe(track)

  track.addEventListener(
    'scroll',
    () => {
      if (!track.clientWidth) return
      const current = Math.round(track.scrollLeft / track.clientWidth)
      if (current !== page) {
        page = current
        markCurrent()
      }
    },
    { passive: true },
  )

  const touched = () => {
    lastTouch = Date.now()
  }
  track.addEventListener('pointerdown', touched, { passive: true })
  track.addEventListener('touchstart', touched, { passive: true })
  track.addEventListener('wheel', touched, { passive: true })

  region.addEventListener('mouseenter', () => (paused = true))
  region.addEventListener('mouseleave', () => (paused = false))
  region.addEventListener('focusin', () => (paused = true))
  region.addEventListener('focusout', (event) => {
    if (!region.contains(event.relatedTarget)) paused = false
  })

  setInterval(() => {
    if (reduceMotion.matches || paused || document.hidden) return
    if (Date.now() - lastTouch < ADVANCE_MS) return
    if (pageCount > 1) goTo(page + 1)
  }, ADVANCE_MS)
}

/* ---------- Copy email ---------- */

// Fallback for browsers that block the async clipboard API.
function legacyCopy(text) {
  const field = document.createElement('textarea')
  field.value = text
  field.setAttribute('readonly', '')
  field.style.position = 'fixed'
  field.style.opacity = '0'
  document.body.append(field)
  field.select()
  const ok = document.execCommand('copy')
  field.remove()
  if (!ok) throw new Error('copy failed')
}

function initCopyEmail() {
  const button = document.querySelector('.copy-email')
  const status = document.querySelector('.copy-status')
  if (!button || !status) return

  let timer
  button.addEventListener('click', async () => {
    const email = button.dataset.email
    try {
      try {
        await navigator.clipboard.writeText(email)
      } catch {
        legacyCopy(email)
      }
      status.textContent = 'Email address copied'
    } catch {
      status.textContent = `Copy failed. The address is ${email}`
      return
    }
    button.classList.add('is-copied')
    button.setAttribute('aria-label', 'Email address copied')
    clearTimeout(timer)
    timer = setTimeout(() => {
      button.classList.remove('is-copied')
      button.setAttribute('aria-label', 'Copy email address')
      status.textContent = ''
    }, 2000)
  })
}

initNav()
initCarousel()
initCopyEmail()
