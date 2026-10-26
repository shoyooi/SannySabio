import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { certificates } from '../data/portfolio'

const INTERVAL = 4500 // ms each certificate stays on screen
const POP_MS = 1100 // pop-in animation must finish before autoplay starts

const pad = (n) => String(n).padStart(2, '0')

export default function Certificates() {
  const total = certificates.length
  const [index, setIndex] = useState(0)
  const [prev, setPrev] = useState(null)
  const [dir, setDir] = useState('next')
  const [visible, setVisible] = useState(false) // stage is on screen
  const [armed, setArmed] = useState(false) // pop-in finished, slideshow may run
  const [hovered, setHovered] = useState(false)
  const [userPaused, setUserPaused] = useState(false)
  const [lightbox, setLightbox] = useState(false)
  const [reduce] = useState(
    () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  )

  const stageWrap = useRef(null)
  const openBtn = useRef(null)
  const indexRef = useRef(0)
  indexRef.current = index

  const go = useCallback(
    (to, direction) => {
      const next = ((to % total) + total) % total
      const cur = indexRef.current
      if (next === cur) return
      setDir(direction ?? (to > cur ? 'next' : 'back'))
      setPrev(cur)
      setIndex(next)
    },
    [total]
  )

  // Pop in when the stage scrolls into view; reset once it is fully out of view
  // so the animation plays again next time.
  useEffect(() => {
    const el = stageWrap.current
    if (!el || !('IntersectionObserver' in window)) {
      setVisible(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.5) setVisible(true)
        else if (!entry.isIntersecting) setVisible(false)
      },
      { threshold: [0, 0.5] }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Slideshow only starts once the pop-in has finished.
  useEffect(() => {
    if (!visible) {
      setArmed(false)
      return
    }
    const t = setTimeout(() => setArmed(true), reduce ? 0 : POP_MS)
    return () => clearTimeout(t)
  }, [visible, reduce])

  const running = armed && !hovered && !userPaused && !lightbox && !reduce

  useEffect(() => {
    if (!running) return
    const t = setTimeout(() => go(indexRef.current + 1, 'next'), INTERVAL)
    return () => clearTimeout(t)
  }, [running, index, go])

  // Lightbox: Esc closes, page scroll is blocked, focus returns to the stage.
  useEffect(() => {
    if (!lightbox) return
    const onKey = (e) => e.key === 'Escape' && setLightbox(false)
    const stop = (e) => e.preventDefault()
    window.addEventListener('keydown', onKey)
    window.addEventListener('wheel', stop, { passive: false })
    window.addEventListener('touchmove', stop, { passive: false })
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('wheel', stop)
      window.removeEventListener('touchmove', stop)
      openBtn.current?.focus({ preventScroll: true })
    }
  }, [lightbox])

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') go(index + 1, 'next')
    if (e.key === 'ArrowLeft') go(index - 1, 'back')
  }

  const current = certificates[index]

  return (
    <section
      id="certificates"
      className={`panel panel-certs${visible ? ' is-in' : ''}`}
      data-theme="light"
    >
      <div className="certs-left">
        <div
          className="certs-stage-wrap"
          ref={stageWrap}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocus={() => setHovered(true)}
          onBlur={() => setHovered(false)}
          onKeyDown={onKeyDown}
        >
          <div className="certs-stage" data-dir={dir}>
            {certificates.map((c, i) => (
              <img
                key={c.id}
                className={`certs-slide${i === index ? ' is-active' : ''}${i === prev && i !== index ? ' is-leaving' : ''}`}
                src={c.image}
                alt={`${c.title} certificate from ${c.issuer}`}
                draggable="false"
              />
            ))}
            <button
              type="button"
              ref={openBtn}
              className="certs-open"
              aria-label={`View ${current.title} certificate larger`}
              onClick={() => setLightbox(true)}
            />
            {running && (
              <span className="certs-progress" aria-hidden="true">
                <span key={index} style={{ animationDuration: `${INTERVAL}ms` }} />
              </span>
            )}
          </div>
        </div>

        <ul className="certs-thumbs" aria-label="Choose a certificate">
          {certificates.map((c, i) => (
            <li key={c.id} style={{ '--i': i }}>
              <button
                type="button"
                className={`certs-thumb${i === index ? ' is-active' : ''}`}
                aria-label={`Show ${c.title}`}
                aria-current={i === index ? 'true' : undefined}
                onClick={() => go(i)}
              >
                <img src={c.image} alt="" draggable="false" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="certs-right">
        <div className="certs-head">
          <p className="chapter" data-reveal>Chapter III</p>
          <h2 className="certs-title" data-reveal>Certificates</h2>
        </div>

        <div className="certs-info">
          <p className="certs-count">
            {pad(index + 1)} <span>/ {pad(total)}</span>
          </p>
          <div className="certs-caption" key={current.id}>
            <p className="certs-issuer">{current.issuer}</p>
            <h3 className="certs-name">{current.title}</h3>
            <p className="certs-detail">{current.detail}</p>
            <p className="certs-date">{current.date}</p>
          </div>
          <div className="certs-controls">
            <button type="button" onClick={() => go(index - 1, 'back')} aria-label="Previous certificate">
              ←
            </button>
            <button type="button" onClick={() => go(index + 1, 'next')} aria-label="Next certificate">
              →
            </button>
            {!reduce && (
              <button
                type="button"
                className="certs-play"
                onClick={() => setUserPaused((v) => !v)}
                aria-pressed={userPaused}
              >
                {userPaused ? 'Play' : 'Pause'}
              </button>
            )}
          </div>
        </div>
      </div>

      {lightbox &&
        createPortal(
          <div
            className="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={`${current.title} certificate`}
            onClick={() => setLightbox(false)}
          >
            <button type="button" className="lightbox-close" autoFocus onClick={() => setLightbox(false)}>
              Close ✕
            </button>
            <img src={current.image} alt={`${current.title} certificate from ${current.issuer}`} />
          </div>,
          document.body
        )}
    </section>
  )
}
