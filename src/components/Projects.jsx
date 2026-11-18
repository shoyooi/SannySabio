import { useEffect, useRef, useState } from 'react'
import { projects } from '../data/portfolio'
import { prefersReducedMotion } from '../lib/motion'
import Lightbox from './Lightbox'
import ProjectFallbackCard from './ProjectFallbackCard'

const pad = (n) => String(n).padStart(2, '0')

/**
 * (02) SELECTED PROJECTS section matching lynard-dev.vercel.app:
 * - Full-width numbered editorial rows with italic hover shift & underline sweep
 * - Floating cursor-following preview thumbnail on collapsed row hover
 * - Show Preview ↓ / Hide Preview ↑ expandable drawer with browser mockup + Project Brief
 */
export default function Projects() {
  const [expanded, setExpanded] = useState(() => ({ [projects[0]?.id]: false }))
  const [imgFailed, setImgFailed] = useState({})
  const [lightboxIdx, setLightboxIdx] = useState(null)
  const [hoveredId, setHoveredId] = useState(null)
  const triggerRef = useRef(null)
  const floatRef = useRef(null)
  const floatPos = useRef({
    targetX: 0,
    targetY: 0,
    curX: 0,
    curY: 0,
    tilt: 0,
    rafId: 0,
    initialized: false,
  })

  const inspectable = projects.filter((p) => p.image && !imgFailed[p.id])

  const toggleDrawer = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  useEffect(() => {
    if (prefersReducedMotion()) return undefined
    const fp = floatPos.current

    const tick = () => {
      const vx = (fp.targetX - fp.curX) * 0.2
      const vy = (fp.targetY - fp.curY) * 0.2
      fp.curX += vx
      fp.curY += vy
      fp.tilt += (Math.max(-7, Math.min(7, vx * 0.35)) - fp.tilt) * 0.18

      if (floatRef.current) {
        floatRef.current.style.transform = `translate3d(${fp.curX.toFixed(1)}px, ${fp.curY.toFixed(1)}px, 0) translate(-50%, -50%) rotate(${fp.tilt.toFixed(2)}deg)`
      }
      fp.rafId = requestAnimationFrame(tick)
    }

    fp.rafId = requestAnimationFrame(tick)
    return () => {
      if (fp.rafId) cancelAnimationFrame(fp.rafId)
    }
  }, [])

  const handleRowPointerMove = (e, project, isOpen) => {
    if (isOpen) {
      if (hoveredId) setHoveredId(null)
      return
    }
    const fp = floatPos.current
    fp.targetX = e.clientX + 26
    fp.targetY = e.clientY - 18
    if (!fp.initialized) {
      fp.curX = fp.targetX
      fp.curY = fp.targetY
      fp.initialized = true
    }
    if (hoveredId !== project.id) {
      setHoveredId(project.id)
    }
  }

  const hoveredProject =
    hoveredId && !expanded[hoveredId]
      ? projects.find((p) => p.id === hoveredId)
      : null

  return (
    <section id="projects" className="lyn-section">
      <div className="lyn-container">
        <div className="lyn-sec-bar" data-reveal>
          <span className="lyn-sec-num">(02)</span>
          <h2 className="lyn-sec-label">SELECTED PROJECTS</h2>
          <span className="lyn-sec-rule" aria-hidden="true" />
        </div>

        <div className="lyn-projects-list sb-focus-list">
          {projects.map((p, idx) => {
            const isOpen = Boolean(expanded[p.id])
            const targetUrl = p.demo || p.github
            const displayUrl = (
              targetUrl || `https://github.com/shoyooi/${p.id}`
            ).toUpperCase()
            const inspectIdx = inspectable.findIndex((item) => item.id === p.id)
            const hasImage = inspectIdx !== -1

            return (
              <article
                key={p.id}
                className={`lyn-project-row${isOpen ? ' is-open' : ''}`}
                data-reveal
                data-cursor={isOpen ? '' : 'VIEW'}
                onPointerMove={(e) => handleRowPointerMove(e, p, isOpen)}
                onPointerLeave={() =>
                  setHoveredId((prev) => (prev === p.id ? null : prev))
                }
              >
                <div className="lyn-project-summary">
                  <span className="lyn-project-idx" data-scramble>
                    {pad(idx + 1)}
                  </span>

                  <div className="lyn-project-main">
                    <h3 className="lyn-project-title">
                      <span className="lyn-editorial-hover-title">
                        {p.title}
                      </span>
                    </h3>
                    <p className="lyn-project-desc">{p.description}</p>
                  </div>

                  <div className="lyn-project-meta">
                    <p className="lyn-project-cat">
                      {p.category.toUpperCase()} · {p.year}
                    </p>
                    <ul className="lyn-project-stack" aria-label="Tech stack">
                      {p.stack.map((t) => (
                        <li key={t}>{t.toUpperCase()}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="lyn-project-toggle">
                    <button
                      type="button"
                      className={`lyn-preview-btn${isOpen ? ' is-active' : ''}`}
                      aria-expanded={isOpen}
                      onClick={() => {
                        setHoveredId(null)
                        toggleDrawer(p.id)
                      }}
                      data-cursor={isOpen ? 'HIDE' : 'PREVIEW'}
                    >
                      {isOpen ? 'Hide Preview ↑' : 'Show Preview ↓'}
                    </button>
                  </div>
                </div>

                {isOpen && (
                  <div className="lyn-project-drawer">
                    {/* Left: Browser Window Mockup */}
                    <div className="drawer-browser-card">
                      <div className="browser-chrome">
                        <div className="browser-dots" aria-hidden="true">
                          <span />
                          <span />
                          <span />
                        </div>
                        <span className="browser-url">{displayUrl}</span>
                        {targetUrl && (
                          <a
                            href={targetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="browser-open-link"
                          >
                            {p.privateRepo ? 'CJC ORG REPO 🔒 ↗' : 'OPEN ↗'}
                          </a>
                        )}
                      </div>

                      <div
                        className="browser-viewport"
                        style={p.bg ? { background: p.bg } : undefined}
                      >
                        {hasImage ? (
                          <>
                            <img
                              src={p.image}
                              alt={p.title}
                              loading="lazy"
                              decoding="async"
                              className={
                                p.fit === 'contain' ? 'is-contain' : undefined
                              }
                              onError={() =>
                                setImgFailed((prev) => ({
                                  ...prev,
                                  [p.id]: true,
                                }))
                              }
                            />
                            <button
                              type="button"
                              className="browser-zoom-btn"
                              aria-label={`Inspect ${p.title} screenshot larger`}
                              onClick={(e) => {
                                triggerRef.current = e.currentTarget
                                setLightboxIdx(inspectIdx)
                              }}
                            >
                              <span>Inspect ↗</span>
                            </button>
                          </>
                        ) : (
                          <ProjectFallbackCard project={p} />
                        )}
                      </div>
                    </div>

                    {/* Right: Structured Project Brief */}
                    {p.brief && (
                      <div className="drawer-brief-card">
                        <p className="brief-eyebrow">
                          PROJECT BRIEF · {p.category.toUpperCase()}
                        </p>
                        <h4 className="brief-headline">{p.brief.headline}</h4>
                        <p className="brief-summary">{p.brief.summary}</p>

                        <div className="brief-metrics">
                          {p.brief.metrics.map((m) => (
                            <div className="brief-metric-cell" key={m.label}>
                              <span>{m.label}</span>
                              <strong>{m.value}</strong>
                            </div>
                          ))}
                        </div>

                        <ol className="brief-highlights">
                          {p.brief.highlights.map((h, hIdx) => (
                            <li key={h}>
                              <span className="brief-h-num">
                                {pad(hIdx + 1)}
                              </span>
                              <span>{h}</span>
                            </li>
                          ))}
                        </ol>

                        <div className="brief-actions">
                          {p.demo && (
                            <a
                              href={p.demo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="lyn-btn-solid"
                            >
                              Visit Live Site ↗
                            </a>
                          )}
                          {p.github && (
                            <a
                              href={p.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="lyn-btn-outline"
                              title={
                                p.privateRepo
                                  ? p.privateRepoNote
                                  : 'Open Source Repository'
                              }
                            >
                              {p.privateRepo
                                ? 'Private Campus Repo (CJC Org 🔒) ↗'
                                : 'Source Repository ↗'}
                            </a>
                          )}
                          {p.privateRepo && (
                            <a
                              href="https://github.com/shoyooi"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="lyn-btn-outline"
                            >
                              Author GitHub (@shoyooi) ↗
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </article>
            )
          })}
        </div>
      </div>

      {/* Floating Cursor-Tracked Project Preview on Collapsed Row Hover */}
      <div
        ref={floatRef}
        className={`lyn-floating-preview${hoveredProject ? ' is-visible' : ''}`}
        aria-hidden="true"
      >
        {hoveredProject && (
          <div className="lyn-floating-preview-inner">
            <div className="lyn-floating-preview-head">
              <span>{hoveredProject.category.toUpperCase()}</span>
              <span>{hoveredProject.year}</span>
            </div>
            <div
              className="lyn-floating-preview-media"
              style={
                hoveredProject.bg ? { background: hoveredProject.bg } : undefined
              }
            >
              {hoveredProject.image && !imgFailed[hoveredProject.id] ? (
                <img
                  src={hoveredProject.image}
                  alt=""
                  className={
                    hoveredProject.fit === 'contain' ? 'is-contain' : undefined
                  }
                />
              ) : (
                <ProjectFallbackCard project={hoveredProject} />
              )}
            </div>
            <div className="lyn-floating-preview-foot">
              <span>{hoveredProject.title}</span>
              <span>SHOW PREVIEW ↓</span>
            </div>
          </div>
        )}
      </div>

      <Lightbox
        items={inspectable}
        index={lightboxIdx}
        onClose={() => setLightboxIdx(null)}
        onChange={setLightboxIdx}
        triggerRef={triggerRef}
        getSrc={(p) => p.image}
        getAlt={(p) => p.title}
        getLabel={(p) => `${p.title} preview`}
        renderCaption={(p) => (
          <>
            <p className="certs-issuer">
              {p.category} · {p.year}
            </p>
            <h3 className="certs-name">{p.title}</h3>
            {p.description && <p className="certs-detail">{p.description}</p>}
          </>
        )}
      />
    </section>
  )
}
