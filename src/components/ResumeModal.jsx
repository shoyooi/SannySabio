import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { certificates, projects, site, skills, timeline } from '../data/portfolio'

/**
 * Interactive 2-Page Spread / Single-Page Curriculum Vitae viewer modal
 * matching lynard-dev.vercel.app's Resume Preview modal.
 */
export default function ResumeModal({ open, onClose }) {
  const [view, setView] = useState('spread') // 'spread' | 'page1' | 'page2'

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open) return null

  const eduEntry = timeline.find((t) => t.tag.toLowerCase().includes('education')) || timeline[2]
  const workEntries = timeline.filter((t) => t !== eduEntry)

  return createPortal(
    <div
      className="cv-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={`Curriculum Vitae — ${site.fullName}`}
      onClick={onClose}
    >
      <div className="cv-modal" onClick={(e) => e.stopPropagation()}>
        <header className="cv-modal-bar">
          <span className="cv-modal-title">
            CURRICULUM VITAE · {site.fullName.toUpperCase()}
          </span>

          <div className="cv-modal-tabs" role="tablist" aria-label="Resume layout view">
            <button
              type="button"
              role="tab"
              aria-selected={view === 'spread'}
              className={`cv-tab${view === 'spread' ? ' is-active' : ''}`}
              onClick={() => setView('spread')}
            >
              2-Page Spread
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={view === 'page1'}
              className={`cv-tab${view === 'page1' ? ' is-active' : ''}`}
              onClick={() => setView('page1')}
            >
              Page 01
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={view === 'page2'}
              className={`cv-tab${view === 'page2' ? ' is-active' : ''}`}
              onClick={() => setView('page2')}
            >
              Page 02
            </button>
          </div>

          <div className="cv-modal-actions">
            {site.resume && (
              <a
                href={site.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="cv-action-outline"
              >
                OPEN PDF ↗
              </a>
            )}
            <button
              type="button"
              className="cv-action-solid"
              onClick={() => window.print()}
            >
              PRINT / SAVE PDF ↓
            </button>
            <button type="button" className="cv-action-outline" onClick={onClose}>
              Close ✕
            </button>
          </div>
        </header>

        <div className={`cv-spread-stage view-${view}`}>
          {(view === 'spread' || view === 'page1') && (
            <article className="cv-sheet" aria-label="Resume Page 1">
              <div className="cv-sheet-head">
                <h2>{site.fullName}</h2>
                <p>
                  {site.location} ·{' '}
                  <span className="sb-email-obf">
                    <span>{site.emailUser}</span>
                    <i className="sb-at-guard" data-at="@" aria-hidden="true" />
                    <span>{site.emailDomain}</span>
                  </span>{' '}
                  · {site.github.replace('https://', '')}
                </p>
              </div>

              <section className="cv-sec">
                <h3>EDUCATION</h3>
                <div className="cv-entry">
                  <div className="cv-entry-top">
                    <strong>COR JESU COLLEGE — CJC</strong>
                    <span>{eduEntry?.period || '2023 — Present'}</span>
                  </div>
                  <div className="cv-entry-sub">
                    <span>Bachelor of Science in Information Technology</span>
                    <span>Digos City</span>
                  </div>
                  <p>{eduEntry?.detail}</p>
                </div>
              </section>

              <section className="cv-sec">
                <h3>EXPERIENCE &amp; SYSTEMS ENGINEERING</h3>
                {workEntries.map((w) => (
                  <div className="cv-entry" key={w.role}>
                    <div className="cv-entry-top">
                      <strong>{w.role}</strong>
                      <span>{w.period}</span>
                    </div>
                    <div className="cv-entry-sub">
                      <span>{w.org}</span>
                      <span>{w.tag}</span>
                    </div>
                    <p>{w.detail}</p>
                  </div>
                ))}
              </section>

              <section className="cv-sec">
                <h3>SELECTED PROJECTS</h3>
                {projects.slice(0, 3).map((p) => (
                  <div className="cv-entry" key={p.id}>
                    <div className="cv-entry-top">
                      <strong>
                        {p.title} ({p.category})
                      </strong>
                      <span>{p.year}</span>
                    </div>
                    <p>{p.description}</p>
                  </div>
                ))}
              </section>
            </article>
          )}

          {(view === 'spread' || view === 'page2') && (
            <article className="cv-sheet" aria-label="Resume Page 2">
              <section className="cv-sec">
                <h3>ADDITIONAL PROJECTS &amp; PROTOTYPES</h3>
                {projects.slice(3).map((p) => (
                  <div className="cv-entry" key={p.id}>
                    <div className="cv-entry-top">
                      <strong>
                        {p.fullTitle || p.title} ({p.category})
                      </strong>
                      <span>{p.year}</span>
                    </div>
                    <p>{p.description}</p>
                  </div>
                ))}
              </section>

              <section className="cv-sec">
                <h3>VERIFIED CERTIFICATIONS &amp; TRAINING</h3>
                {certificates.map((c) => (
                  <div className="cv-entry" key={c.id}>
                    <div className="cv-entry-top">
                      <strong>{c.title}</strong>
                      <span>{c.date}</span>
                    </div>
                    <div className="cv-entry-sub">
                      <span>{c.issuer}</span>
                    </div>
                    <p>{c.detail}</p>
                  </div>
                ))}
              </section>

              <section className="cv-sec">
                <h3>TECHNICAL SKILLS</h3>
                <ul className="cv-skill-list">
                  {skills.map((g) => (
                    <li key={g.category}>
                      <strong>{g.category}:</strong> {g.items.join(', ')}
                    </li>
                  ))}
                  <li>
                    <strong>Languages Spoken:</strong> English (Fluent), Cebuano / Filipino (Native)
                  </li>
                </ul>
              </section>
            </article>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}
