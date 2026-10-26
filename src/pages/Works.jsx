import { useLayoutEffect } from 'react'
import { Link } from 'react-router-dom'
import { projects } from '../data/portfolio'
import { setTheme } from '../lib/motion'
import Footer from '../components/Footer'

export default function WorksPage() {
  useLayoutEffect(() => {
    setTheme('light')
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="works-page">
      <main className="works-content wrap">
        {/* Subtle, editorial return link */}
        <div className="works-nav-row">
          <Link to={{ pathname: '/', hash: '#work' }} className="works-back-link">
            <span className="back-arrow">←</span>
            <span>Back to Folio</span>
          </Link>
        </div>

        {/* Editorial Header matching Khanh Nguyen reference */}
        <header className="all-work-heading-row">
          <h1 className="all-work-title">ALL WORK</h1>
          <span className="all-work-count">({projects.length})</span>
        </header>

        {/* Horizontal Scrollable Gallery / Grid matching reference */}
        <div className="all-work-gallery">
          {projects.map((p, idx) => {
            const num = String(idx + 1).padStart(2, '0')
            return (
              <article key={p.id} className="all-work-card">
                <div
                  className="all-work-cover"
                  style={p.bg ? { background: p.bg } : undefined}
                >
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.title}
                      loading="lazy"
                    />
                  ) : (
                    <div className="cover-placeholder">{p.title.slice(0, 2)}</div>
                  )}
                  {p.status && <span className="card-status-badge">{p.status}</span>}
                </div>

                <div className="all-work-caption">
                  <span className="all-work-num">{num}.</span>
                  <div className="all-work-info">
                    <p className="all-work-category">
                      {p.category ? p.category.toUpperCase() : 'PROJECT'} — {p.year || '2026'}
                    </p>
                    <h2 className="all-work-item-title">{p.title}</h2>

                    <div className="all-work-links">
                      {p.demo && (
                        <a
                          href={p.demo}
                          target="_blank"
                          rel="noreferrer"
                          className="work-link-action"
                        >
                          Live Site ↗
                        </a>
                      )}
                      {p.github && (
                        <a
                          href={p.github}
                          target="_blank"
                          rel="noreferrer"
                          className="work-link-action"
                        >
                          Source Code ↗
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            )
          })}

          {/* Clean Upcoming Card */}
          <article className="all-work-card card-upcoming">
            <div className="all-work-cover upcoming-cover">
              <span className="upcoming-icon">+</span>
            </div>
            <div className="all-work-caption">
              <span className="all-work-num">0{projects.length + 1}.</span>
              <div className="all-work-info">
                <p className="all-work-category">IN DEVELOPMENT — 2026</p>
                <h2 className="all-work-item-title">More Projects Coming Soon</h2>
                <p className="upcoming-note">
                  Exploring Solidity smart contracts, AI interfaces, and interactive WebGL experiences.
                </p>
              </div>
            </div>
          </article>
        </div>
      </main>

      <footer className="works-footer wrap">
        <Footer />
      </footer>
    </div>
  )
}
