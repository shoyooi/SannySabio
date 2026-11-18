import { useEffect, useRef, useState } from 'react'
import { certificates } from '../data/portfolio'
import { playUiSound, prefersReducedMotion } from '../lib/motion'
import Lightbox from './Lightbox'

const pad = (n) => String(n).padStart(2, '0')

/**
 * (04) CERTIFICATES section:
 * Clean, flat-aligned sticky stacked archive deck (DOC // 01 OF 05 · VERIFIED ARCHIVE)
 * with smooth scale + clean opacity fade as the next card slides over the current card
 * (zero 3D trapezoid warping or blurry background bleed-through).
 */
export default function Certificates() {
  const [lightbox, setLightbox] = useState(null)
  const lastTrigger = useRef(null)
  const cardRefs = useRef([])
  const total = certificates.length

  useEffect(() => {
    if (prefersReducedMotion()) return undefined

    let rafId = 0
    const updateDepth = () => {
      rafId = 0
      const cards = cardRefs.current.filter(Boolean)
      for (let i = 0; i < cards.length; i += 1) {
        const card = cards[i]
        const nextCard = cards[i + 1]
        if (!nextCard) {
          card.style.setProperty('--card-scale', '1')
          card.style.setProperty('--card-opacity', '1')
          card.style.setProperty('--card-y', '0px')
          continue
        }

        const rect = card.getBoundingClientRect()
        const nextRect = nextCard.getBoundingClientRect()
        const span = Math.max(120, rect.height * 0.85)
        const distance = nextRect.top - rect.top
        const progress = Math.max(0, Math.min(1, 1 - distance / span))

        // Smoothly recess scale (1 -> 0.96) and fade out completely once covered
        const scale = 1 - progress * 0.04
        const yOffset = -progress * 8
        const opacity =
          progress < 0.35
            ? 1
            : Math.max(0, 1 - ((progress - 0.35) / 0.62))

        card.style.setProperty('--card-scale', scale.toFixed(4))
        card.style.setProperty('--card-opacity', opacity.toFixed(3))
        card.style.setProperty('--card-y', `${yOffset.toFixed(1)}px`)
      }
    }

    const onScroll = () => {
      if (!rafId) {
        rafId = requestAnimationFrame(updateDepth)
      }
    }

    updateDepth()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <section id="certificates" className="lyn-section">
      <div className="lyn-container">
        <div className="lyn-sec-bar" data-reveal>
          <span className="lyn-sec-num">(04)</span>
          <h2 className="lyn-sec-label">CERTIFICATES</h2>
          <span className="lyn-sec-rule" aria-hidden="true" />
        </div>

        <div className="lyn-cert-stack">
          {certificates.map((c, idx) => (
            <article
              key={c.id}
              ref={(el) => {
                cardRefs.current[idx] = el
              }}
              className="lyn-cert-card"
              style={{
                '--stack-top': `${86 + idx * 10}px`,
                zIndex: idx + 1,
              }}
            >
              <header className="lyn-cert-top">
                <div className="lyn-cert-doc">
                  <span className="doc-code" data-scramble>
                    DOC // {pad(idx + 1)} OF {pad(total)}
                  </span>
                  <span className="doc-verified">VERIFIED ARCHIVE</span>
                </div>
                <div className="lyn-cert-issuer">
                  <span>{c.issuer.toUpperCase()}</span>
                  <span>{c.year}</span>
                </div>
              </header>

              <div className="lyn-cert-stage">
                <img
                  src={c.image}
                  alt={`${c.title} certificate from ${c.issuer}`}
                  loading={idx === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                />
                <button
                  type="button"
                  className="lyn-cert-stage-hit"
                  aria-label={`Inspect ${c.title} certificate`}
                  data-cursor="INSPECT"
                  onClick={(e) => {
                    playUiSound('open')
                    lastTrigger.current = e.currentTarget
                    setLightbox(idx)
                  }}
                />
              </div>

              <footer className="lyn-cert-bottom">
                <div className="lyn-cert-info">
                  <h3 className="lyn-cert-title">{c.title}</h3>
                  {c.tags?.length > 0 && (
                    <ul className="lyn-cert-tags" aria-label="Topics">
                      {c.tags.map((t) => (
                        <li key={t}>{t.toUpperCase()}</li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="lyn-cert-actions">
                  <button
                    type="button"
                    className="lyn-inspect-pill"
                    data-cursor="INSPECT"
                    onClick={(e) => {
                      playUiSound('open')
                      lastTrigger.current = e.currentTarget
                      setLightbox(idx)
                    }}
                  >
                    <span aria-hidden="true">⤢</span> Inspect
                  </button>
                  <a
                    href={c.image}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="lyn-cert-ext"
                    aria-label={`Open ${c.title} original image in new tab`}
                    title="Open full image"
                  >
                    ↗
                  </a>
                </div>
              </footer>
            </article>
          ))}
        </div>
      </div>

      <Lightbox
        items={certificates}
        index={lightbox}
        onClose={() => setLightbox(null)}
        onChange={setLightbox}
        triggerRef={lastTrigger}
        getSrc={(c) => c.image}
        getAlt={(c) => `${c.title} certificate from ${c.issuer}`}
        getLabel={(c) => `${c.title} certificate`}
        renderCaption={(c) => (
          <>
            <p className="certs-issuer">{c.issuer}</p>
            <h3 className="certs-name">{c.title}</h3>
            <p className="certs-detail">{c.detail}</p>
            <p className="certs-date">{c.date}</p>
          </>
        )}
      />
    </section>
  )
}
