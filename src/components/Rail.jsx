import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { goToSection } from '../lib/motion'
import { site } from '../data/portfolio'

const ITEMS = [
  { id: 'top', label: 'Index', to: { pathname: '/' } },
  { id: 'work', label: 'Work', to: { pathname: '/', hash: '#work' } },
  { id: 'works', label: 'All Works', to: { pathname: '/works' } },
  { id: 'certificates', label: 'Certificates', to: { pathname: '/', hash: '#certificates' } },
  { id: 'about', label: 'About', to: { pathname: '/about' } },
  { id: 'contact', label: 'Contact', to: { pathname: '/', hash: '#contact' } },
]

// Fixed side rail (top bar on small screens) with the menu overlay,
// plus a thin scroll-progress line along the top edge.
export default function Rail() {
  const [open, setOpen] = useState(false)
  const { pathname, hash } = useLocation()
  const bar = useRef(null)

  useEffect(() => setOpen(false), [pathname, hash])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Don't let the page scroll underneath the open menu.
  useEffect(() => {
    if (!open) return
    const stop = (e) => e.preventDefault()
    window.addEventListener('wheel', stop, { passive: false })
    window.addEventListener('touchmove', stop, { passive: false })
    return () => {
      window.removeEventListener('wheel', stop)
      window.removeEventListener('touchmove', stop)
    }
  }, [open])

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? window.scrollY / max : 0
      if (bar.current) bar.current.style.transform = `scaleX(${Math.min(1, Math.max(0, p))})`
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [pathname])

  const onNav = (e, item) => {
    setOpen(false)
    const sameSpot = pathname === '/' && hash === (item.to.hash || '') && item.to.pathname === '/'
    if (sameSpot) {
      e.preventDefault()
      goToSection(item.id)
    }
  }

  return (
    <>
      <div className="progress" aria-hidden="true">
        <span ref={bar} />
      </div>

      <aside className={`rail${open ? ' is-open' : ''}`}>
        <button
          type="button"
          className="rail-burger"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
        <span className="rail-text rail-edition" aria-hidden="true">Folio — Edition</span>
        <Link to="/" className="rail-text rail-name" aria-label={`${site.name} — home`}>
          {site.name.toUpperCase()}
        </Link>
        <span className="rail-text rail-year" aria-hidden="true">© {new Date().getFullYear()}</span>
      </aside>

      <nav id="site-menu" className={`menu${open ? ' is-open' : ''}`} aria-label="Primary" aria-hidden={!open}>
        <ul className="menu-list">
          {ITEMS.map((item, i) => (
            <li key={item.label}>
              <Link
                className="menu-link"
                style={{ '--i': i }}
                to={item.to}
                onClick={(e) => onNav(e, item)}
              >
                <span className="menu-num">{String(i + 1).padStart(2, '0')}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <p className="menu-foot">
          {site.github && (
            <a href={site.github} target="_blank" rel="noreferrer">GitHub ↗</a>
          )}
          {site.email && <a href={`mailto:${site.email}`}>{site.email}</a>}
        </p>
      </nav>
    </>
  )
}
