import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { projects } from '../data/portfolio'

export default function Projects() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [showcaseActive, setShowcaseActive] = useState(false)
  const [imgFailed, setImgFailed] = useState({})
  const panelRef = useRef(null)

  const activeProject = projects[activeIdx] || projects[0]

  const handleImgError = (id) => {
    setImgFailed((prev) => ({ ...prev, [id]: true }))
  }

  return (
    <section
      id="work"
      ref={panelRef}
      className={`panel panel-work-unified${showcaseActive ? ' is-showcase-view' : ''}`}
      data-theme="light"
    >
      {/* ==========================================================
          STAGE 1 & 2: FULL-SCREEN "THE WORK" WITH ZOOMING PREVIEW BOX
          ========================================================== */}
      <div className="work-splash-layer">
        <div className="the-work-title-wrap">
          <span className="the-work-word the-work-the">THE</span>

          {/* Interactive Zooming Preview Box in between the words */}
          <div
            className="the-work-preview-box is-popped"
            title="Click or scroll to open showcase"
            onClick={() => setShowcaseActive(true)}
          >
            <div className="preview-grid-collage">
              {projects.map((p, i) => (
                <div
                  key={p.id}
                  className={`preview-mini-thumb thumb-${i + 1}`}
                  style={p.bg ? { background: p.bg } : undefined}
                >
                  {p.image && !imgFailed[p.id] ? (
                    <img
                      src={p.image}
                      alt=""
                      aria-hidden="true"
                      onError={() => handleImgError(p.id)}
                    />
                  ) : (
                    <span className="mini-thumb-fallback">{p.title.slice(0, 2)}</span>
                  )}
                </div>
              ))}
              <div className="preview-mini-thumb thumb-extra-1">
                <span className="mini-thumb-code">&lt;/&gt;</span>
              </div>
              <div className="preview-mini-thumb thumb-extra-2">
                <span className="mini-thumb-code badge-web3">WEB3</span>
              </div>
              <div className="preview-mini-thumb thumb-extra-3">
                <span className="mini-thumb-code badge-folio">2026</span>
              </div>
            </div>
            <span className="preview-glow-ring" aria-hidden="true" />
          </div>

          <span className="the-work-word the-work-work">WORK</span>
        </div>

        <div
          className="the-work-hint-btn"
          role="button"
          tabIndex={0}
          onClick={() => setShowcaseActive(true)}
          onKeyDown={(e) => e.key === 'Enter' && setShowcaseActive(true)}
        >
          <span className="hint-arrow">→</span>
          <span>Scroll or click to view showcase</span>
        </div>
      </div>

      {/* ==========================================================
          STAGE 3 & 4: ROTATE LEFT 3D VISUAL + RELATED WORK SHOWCASE
          ========================================================== */}
      <div className="work-showcase-layer">
        <div className="showcase-inner">
          {/* LEFT: 3D Rotated Perspective Visual Card */}
          <div className="showcase-visual-col">
            <div className="visual-stage-card">
              <div
                className="visual-stage-img-wrap"
                style={activeProject.bg ? { background: activeProject.bg } : undefined}
              >
                {activeProject.image && !imgFailed[activeProject.id] ? (
                  <img
                    key={activeProject.id}
                    src={activeProject.image}
                    alt={activeProject.title}
                    className="stage-featured-img"
                    onError={() => handleImgError(activeProject.id)}
                  />
                ) : (
                  <div className="stage-img-fallback">
                    <span>{activeProject.title}</span>
                  </div>
                )}
              </div>

              <div className="stage-caption">
                <span className="stage-meta-category">
                  {activeProject.category || 'PROJECT'} — {activeProject.year || '2026'}
                </span>
                <h4 className="stage-meta-title">{activeProject.title}</h4>
                {(activeProject.demo || activeProject.github) && (
                  <div className="stage-meta-links">
                    {activeProject.demo && (
                      <a
                        href={activeProject.demo}
                        target="_blank"
                        rel="noreferrer"
                        className="stage-card-link"
                      >
                        Live Site ↗
                      </a>
                    )}
                    {activeProject.github && (
                      <a
                        href={activeProject.github}
                        target="_blank"
                        rel="noreferrer"
                        className="stage-card-link"
                      >
                        Source Code ↗
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Rotated background perspective cards */}
            <div className="visual-perspective-stack" aria-hidden="true">
              <div className="persp-card card-1" />
              <div className="persp-card card-2" />
            </div>

            {/* Quick back to THE WORK cover button */}
            <button
              type="button"
              className="showcase-cover-back"
              onClick={() => setShowcaseActive(false)}
            >
              ← THE WORK
            </button>
          </div>

          {/* RIGHT: Chapter II Header, Related Work List, View All Work */}
          <div className="showcase-content-col">
            <div className="showcase-head">
              <p className="chapter">CHAPTER II</p>
              <p className="related-work-badge">RELATED WORK</p>
            </div>

            {/* Typographic Project Switcher */}
            <div className="related-work-list" role="list">
              {projects.map((p, idx) => {
                const isActive = idx === activeIdx
                const targetUrl = p.demo || p.github
                return (
                  <div
                    key={p.id}
                    role="button"
                    tabIndex={0}
                    className={`related-work-item${isActive ? ' is-active' : ''}`}
                    onMouseEnter={() => setActiveIdx(idx)}
                    onMouseOver={() => setActiveIdx(idx)}
                    onPointerEnter={() => setActiveIdx(idx)}
                    onClick={() => setActiveIdx(idx)}
                    onFocus={() => setActiveIdx(idx)}
                  >
                    <div className="item-row">
                      <span className="item-title">
                        {p.title}
                        {isActive && targetUrl && (
                          <a
                            href={targetUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="item-arrow"
                            title="Open project link"
                            onClick={(e) => e.stopPropagation()}
                          >
                            ↗
                          </a>
                        )}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Footer with Disclaimer & View All Work Link */}
            <div className="showcase-footer">
              <p className="showcase-note">
                ✻ Live site / repo links are available for completed and active builds
              </p>

              <Link to="/works" className="view-all-work-link">
                <span>View All Work</span>
                <span className="arrow-icon">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
