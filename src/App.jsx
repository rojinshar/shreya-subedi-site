import { useEffect, useState } from 'react'
import { site } from './content.js'
import Icon from './Icon.jsx'
import './App.css'

const year = new Date().getFullYear()
const numerals = ['I', 'II', 'III', 'IV', 'V', 'VI']

const sections = [
  { href: '#about', label: 'About' },
  { href: '#work', label: 'Work with me' },
  { href: '#contact', label: 'Contact' },
]

// Renders "plain *italic* plain".
function Rich({ text }) {
  return text.split('*').map((part, i) => (i % 2 ? <em key={i}>{part}</em> : part))
}

function ExternalLink({ href, children, ...props }) {
  const external = href.startsWith('http')
  return (
    <a href={href} {...(external && { target: '_blank', rel: 'noreferrer' })} {...props}>
      {children}
    </a>
  )
}

function Button({ cta }) {
  return (
    <ExternalLink href={cta.url} className="button">
      {cta.label}
    </ExternalLink>
  )
}

function Eyebrow({ children }) {
  return <p className="eyebrow">{children}</p>
}

function SocialIcons({ size = 15 }) {
  return (
    <ul className="social-icons">
      {site.socials.map((social) => (
        <li key={social.url}>
          <ExternalLink href={social.url} aria-label={social.label}>
            <Icon name={social.icon} size={size} />
          </ExternalLink>
        </li>
      ))}
    </ul>
  )
}

function Header() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (event) => event.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className="header">
      <div className="header-bar">
        <button
          type="button"
          className="menu-button"
          aria-expanded={open}
          aria-controls="menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen(!open)}
        >
          <span className={open ? 'menu-icon menu-icon--open' : 'menu-icon'} aria-hidden="true" />
        </button>
        <a href="#top" className="wordmark">
          {site.name}
        </a>
        <nav className="header-nav" aria-label="Sections">
          {sections.map((section) => (
            <a key={section.href} href={section.href}>
              {section.label}
            </a>
          ))}
        </nav>
        <div className="header-social">
          <SocialIcons size={14} />
        </div>
      </div>

      <div id="menu" className="menu" hidden={!open}>
        <nav aria-label="Menu">
          {sections.map((section) => (
            <a key={section.href} href={section.href} onClick={() => setOpen(false)}>
              {section.label}
            </a>
          ))}
        </nav>
        <SocialIcons size={20} />
      </div>
    </header>
  )
}

export default function App() {
  const { hero, intro, about, work, contact } = site

  return (
    <>
      <Header />

      <main id="top">
        <section className="hero">
          <div className="hero-photo">
            <img src={hero.photo} alt={hero.photoAlt} width="1280" height="1495" fetchPriority="high" />
          </div>
          <div className="hero-card reveal">
            <h1 className="display">
              <Rich text={hero.heading} />
            </h1>
            <p className="kicker">{hero.subheading}</p>
            <Button cta={hero.cta} />
          </div>
        </section>

        <section className="intro container">
          <Eyebrow>{intro.eyebrow}</Eyebrow>
          <p className="intro-text">
            <Rich text={intro.text} />
          </p>
        </section>

        <section id="about" className="about container">
          <div className="about-side">
            <img src={about.photos.side.src} alt={about.photos.side.alt} width="1040" height="760" loading="lazy" />
          </div>
          <div className="about-card">
            <p className="eyebrow eyebrow--left">{about.eyebrow}</p>
            <h2 className="heading">{about.heading}</h2>
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph} className="body">
                {paragraph}
              </p>
            ))}
            <Button cta={about.cta} />
          </div>
          <div className="about-main">
            <img src={about.photos.main.src} alt={about.photos.main.alt} width="1040" height="1300" loading="lazy" />
          </div>
        </section>

        <section id="work" className="work container">
          <Eyebrow>{work.eyebrow}</Eyebrow>
          <ul className="work-list">
            {work.items.map((item, i) => (
              <li key={item.title} className="work-item">
                <div className="work-text">
                  <p className="numeral">{numerals[i]}.</p>
                  <h3 className="heading">{item.title}</h3>
                  <p className="body">{item.text}</p>
                  <Button cta={item.cta} />
                </div>
                <div className="work-photo">
                  <img src={item.photo} alt={item.photoAlt} width="1320" height="1727" loading="lazy" />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section id="contact" className="contact">
          <div className="container contact-inner">
            <Eyebrow>{contact.eyebrow}</Eyebrow>
            <h2 className="display contact-heading">
              <Rich text={contact.heading} />
            </h2>
            <Button cta={contact.cta} />
            {contact.email && (
              <a className="contact-email" href={`mailto:${contact.email}`}>
                {contact.email}
              </a>
            )}
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <a href="#top" className="wordmark">
            {site.name}
          </a>
          <SocialIcons size={16} />
          <ul className="footer-elsewhere">
            {site.elsewhere.map((link) => (
              <li key={link.url}>
                <ExternalLink href={link.url}>{link.label}</ExternalLink>
              </li>
            ))}
          </ul>
          <p className="footer-copy">
            © {year} {site.name}
          </p>
        </div>
      </footer>
    </>
  )
}
