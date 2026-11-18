import { site } from '../data/portfolio'
import { goToSection, scrollToTop } from '../lib/motion'

const EXPLORE_LINKS = [
  { id: 'top', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'certificates', label: 'Certificates' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
]

/**
 * Editorial footer matching lynard-dev.vercel.app:
 * "Go beyond the last page.", EXPLORE & ELSEWHERE columns,
 * atmospheric monochrome mountain-ridge artwork, and BACK TO TOP ↑.
 */
export default function Footer() {
  const elsewhere = [
    site.github && { label: 'GitHub (@shoyooi) ↗', href: site.github, external: true },
    { label: 'EDTECH Repo (CJC Org 🔒) ↗', href: 'https://github.com/EDTECH-CJC/Edtech', external: true },
    { label: 'ChainBudget ↗', href: 'https://chainbudget.vercel.app/', external: true },
    site.emailUser && { label: 'Direct Email ↗', href: '#contact', isEmail: true },
  ].filter(Boolean)

  const handleJump = (e, id) => {
    e.preventDefault()
    goToSection(id)
  }

  const handleEmailClick = (e) => {
    e.preventDefault()
    window.location.href = `mailto:${site.email}`
  }

  return (
    <footer className="lyn-footer">
      {/* Atmospheric Mountain / Great Wall Ridge Monochrome Engraving SVG */}
      <svg
        className="footer-mountain-art"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="mountain-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.16" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.03" />
          </linearGradient>
        </defs>
        <path
          d="M0 240 L110 190 L215 215 L340 135 L460 185 L590 110 L720 175 L865 95 L990 160 L1130 85 L1270 150 L1380 115 L1440 140 L1440 320 L0 320 Z"
          fill="url(#mountain-fade)"
        />
        <path
          d="M0 240 L110 190 L215 215 L340 135 L460 185 L590 110 L720 175 L865 95 L990 160 L1130 85 L1270 150 L1380 115 L1440 140"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.22"
          strokeWidth="1.2"
        />
        <path
          d="M0 278 L160 232 L290 258 L430 192 L575 235 L740 168 L890 220 L1055 154 L1215 208 L1350 172 L1440 198 L1440 320 L0 320 Z"
          fill="url(#mountain-fade)"
        />
      </svg>

      <div className="lyn-container lyn-footer-inner">
        <div className="lyn-footer-top">
          <div className="lyn-footer-brand-col">
            <p className="lyn-footer-badge">
              <span className="status-dot" aria-hidden="true" />
              {site.name.toUpperCase()} ©
            </p>
            <h2 className="lyn-footer-headline">
              Go beyond
              <br />
              <em>the last page.</em>
            </h2>
            <p className="lyn-footer-sub">
              A little space for what comes next. Available for select engineering,
              architecture, and full-stack partnerships worldwide.
            </p>
          </div>

          <nav className="lyn-footer-nav" aria-label="Footer Navigation">
            <div className="lyn-footer-col">
              <span className="lyn-footer-col-title">EXPLORE</span>
              <ul>
                {EXPLORE_LINKS.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`/#${item.id}`}
                      onClick={(e) => handleJump(e, item.id)}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lyn-footer-col">
              <span className="lyn-footer-col-title">ELSEWHERE</span>
              <ul>
                {elsewhere.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      onClick={item.isEmail ? handleEmailClick : undefined}
                      target={item.external ? '_blank' : undefined}
                      rel={item.external ? 'noopener noreferrer' : undefined}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        <div className="lyn-footer-bottom">
          <span>
            © {new Date().getFullYear()} {site.fullName.toUpperCase()} — ALL RIGHTS RESERVED.
          </span>

          <button type="button" className="lyn-back-top" onClick={scrollToTop}>
            BACK TO TOP <span aria-hidden="true">↑</span>
          </button>
        </div>
      </div>
    </footer>
  )
}
