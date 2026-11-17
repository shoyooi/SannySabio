import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { certificates } from '../data/portfolio'
import { H_QUERY } from '../lib/motion'

gsap.registerPlugin(ScrollTrigger)

const pad = (n) => String(n).padStart(2, '0')
const clamp01 = (v) => Math.min(1, Math.max(0, v))

// Linear interpolation through stop points (Lynard-style deck mapping).
function mapStops(p, stops, values) {
  if (p <= stops[0]) return values[0]
  for (let k = 1; k < stops.length; k++) {
    if (p <= stops[k]) {
      const t = (p - stops[k - 1]) / (stops[k] - stops[k - 1] || 1)
      return values[k - 1] + (values[k] - values[k - 1]) * t
    }
  }
  return values[values.length - 1]
}

// Scroll-driven certificate deck. Wide screens: the top card flies up and
// folds away as you scroll, revealing the next card peeking beneath —
// one card per scroll step, fully reversible. Small screens / reduced
// motion: a stacked gallery that reveals as you scroll.
export default function Certificates() {
  const total = certificates.length
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(false) // stage is on screen (pop-in)
  const [lightbox, setLightbox] = useState(null) // certificate shown enlarged

  const sectionRef = useRef(null)
  const stageWrap = useRef(null)
  const stickyRef = useRef(null) // content column (counter-translated)
  const openBtn = useRef(null)
  const itemTrigger = useRef(null) // last clicked "enlarge" button on mobile
  const slidesRef = useRef([]) // deck cards (horizontal mode)
  const trigRef = useRef(null) // horizontal-mode ScrollTrigger
  const visibleRef = useRef(false)
  const indexRef = useRef(0)
  indexRef.current = index

  // Pop-in gate; called by both the IntersectionObserver and the scroll
  // trigger so the stage can never stay hidden.
  const show = useCallback(() => {
    if (!visibleRef.current) {
      visibleRef.current = true
      setVisible(true)
    }
  }, [])

  // Pop in when the stage slides into view (horizontal mode); reset once
  // fully out of view so it plays again next time.
  useEffect(() => {
    const el = stageWrap.current
    if (!el || !('IntersectionObserver' in window)) {
      setVisible(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.5) show()
        else if (!entry.isIntersecting) {
          visibleRef.current = false
          setVisible(false)
        }
      },
      { threshold: [0, 0.5] }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [show])

  // Scroll progress drives the active slide (horizontal mode only).
  useEffect(() => {
    const section = sectionRef.current
    const mm = gsap.matchMedia()

    mm.add({ h: H_QUERY, any: 'all' }, (ctx) => {
      if (!ctx.conditions.h) return // vertical page uses the stacked list

      const onProgress = (self) => {
        show() // never leave the stage hidden if the observer misses it
        const p = clamp01(self.progress)

        // The panel is two screens wide: for the first half of its crossing
        // the content column is counter-translated so it stays perfectly
        // still while the deck scrubs — the deck therefore completes with
        // only the certificates on screen, before the next chapter slides
        // in. The second half hands the content back to the track, which
        // carries it off left as the next panel arrives.
        const DECK_END = 0.5
        const sticky = stickyRef.current
        if (sticky) {
          gsap.set(sticky, { x: Math.min(p, DECK_END) * section.offsetWidth })
        }

        const dp = clamp01(p / DECK_END)
        const u = 0.88 / Math.max(1, total - 1) // scroll span per card

        // Deck scrub: each card peeks, rises into place, then flies up and
        // folds away as the next is revealed (reverses when scrolling up).
        slidesRef.current.forEach((el, i) => {
          if (!el) return
          const first = i === 0
          const last = i === total - 1
          const f = first ? 0 : (i - 1) * u + 0.03
          const reveal = first ? 0 : i * u
          const m = last ? 1 : i * u + 0.03
          const h = last ? 1 : (i + 1) * u
          const stops = first ? [0, m, h, 1] : last ? [0, f, reveal, 1] : [0, f, reveal, m, h, 1]
          const y = mapStops(dp, stops, first ? [0, 0, -120, -120] : last ? [2.5, 2.5, 0, 0] : [2.5, 2.5, 0, 0, -120, -120])
          const scale = mapStops(dp, stops, first ? [1, 1, 0.97, 0.97] : last ? [0.96, 0.96, 1, 1] : [0.96, 0.96, 1, 1, 0.97, 0.97])
          const rotateX = mapStops(dp, stops, first ? [0, 0, -14, -14] : last ? [0, 0, 0, 0] : [0, 0, 0, 0, -14, -14])
          // The flying card fades fast so it never ghosts over the card
          // being revealed beneath it.
          const oStops = last ? [0, 1] : [0, m, Math.max(m, h - 0.02), h, 1]
          const opacity = mapStops(dp, oStops, last ? [1, 1] : [1, 1, 0.18, 0, 0])
          const covered = !last && dp >= h
          gsap.set(el, {
            yPercent: y,
            scale,
            rotateX,
            opacity,
            pointerEvents: covered ? 'none' : 'auto',
            visibility: covered ? 'hidden' : 'visible',
          })
        })

        // Active card = the one currently in place (drives caption, counter,
        // thumbs, and the enlarge button).
        const idx = Math.min(total - 1, Math.max(0, Math.floor(dp / u)))
        if (idx !== indexRef.current) setIndex(idx)
      }

      // The 'hs' trigger is created by Home's effect, which runs after this
      // one, so set up lazily if it doesn't exist yet.
      let timer = null
      const setup = () => {
        const hs = ScrollTrigger.getById('hs')
        if (!hs) return false
        // Seed the deck at progress 0 so cards start in their resting pose.
        onProgress({ progress: 0 })
        trigRef.current = ScrollTrigger.create({
          trigger: section,
          containerAnimation: hs.animation,
          start: 'left left',
          end: 'right left',
          onUpdate: onProgress,
        })
        return true
      }
      if (!setup()) {
        timer = setTimeout(() => {
          if (setup()) ScrollTrigger.refresh()
        }, 50)
      }
      return () => {
        clearTimeout(timer)
        trigRef.current?.kill()
        trigRef.current = null
      }
    })

    return () => mm.revert()
  }, [show, total])

  // Jump to a card by scrolling to its activation point in the pinned
  // track, so the deck state stays in sync instead of skipping ahead.
  const goTo = useCallback(
    (i) => {
      const step = ((i % total) + total) % total
      const trig = trigRef.current
      if (!trig) return
      const u = 0.88 / Math.max(1, total - 1)
      // Card i is active at deck progress i * u; the deck occupies the
      // first half of the panel's crossing (see onProgress).
      const within = Math.min(1, step * u) * 0.5
      window.scrollTo({
        top: trig.start + within * (trig.end - trig.start),
        behavior: 'smooth',
      })
    },
    [total]
  )

  // Lightbox: Esc closes, arrows navigate, Tab is trapped inside, page
  // scroll is blocked, and focus returns to the trigger when it closes.
  useEffect(() => {
    if (lightbox == null) return
    const onKey = (e) => {
      if (e.key === 'Escape') setLightbox(null)
      if (e.key === 'ArrowRight') setLightbox((v) => ((v ?? 0) + 1) % total)
      if (e.key === 'ArrowLeft') setLightbox((v) => ((v ?? 0) + total - 1) % total)
      if (e.key === 'Tab') e.preventDefault()
    }
    const stop = (e) => e.preventDefault()
    window.addEventListener('keydown', onKey)
    window.addEventListener('wheel', stop, { passive: false })
    window.addEventListener('touchmove', stop, { passive: false })
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('wheel', stop)
      window.removeEventListener('touchmove', stop)
      ;(openBtn.current || itemTrigger.current)?.focus?.({ preventScroll: true })
    }
  }, [lightbox, total])

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') goTo(index + 1)
    if (e.key === 'ArrowLeft') goTo(index - 1)
  }

  const current = certificates[index]

  return (
    <section
      id="certificates"
      ref={sectionRef}
      className={`panel panel-certs${visible ? ' is-in' : ''}`}
      data-theme="light"
    >
      {/* ============ Wide screens: pinned scroll-driven stage ============ */}
      <div className="certs-scrolly">
        <div className="certs-sticky" ref={stickyRef}>
          <div className="certs-left">
            <div className="certs-stage-wrap" ref={stageWrap} onKeyDown={onKeyDown}>
              <div className="certs-stage">
                {certificates.map((c, i) => (
                  <img
                    key={c.id}
                    ref={(el) => (slidesRef.current[i] = el)}
                    className={`certs-slide${i === index ? ' is-active' : ''}`}
                    style={{ zIndex: (total - i) * 10 }}
                    src={c.image}
                    alt={`${c.title} certificate from ${c.issuer}`}
                    draggable="false"
                    loading={i === 0 ? 'eager' : 'lazy'}
                  />
                ))}
                <button
                  type="button"
                  ref={openBtn}
                  className="certs-open"
                  aria-label={`View ${current.title} certificate larger`}
                  onClick={() => setLightbox(index)}
                />
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
                    onClick={() => goTo(i)}
                  >
                    <img src={c.image} alt="" draggable="false" loading="lazy" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ========= Small screens / reduced motion: stacked gallery ========= */}
      <div className="certs-list">
        <div className="certs-head">
          <p className="chapter" data-reveal>Chapter III</p>
          <h2 className="certs-title" data-reveal>Certificates</h2>
        </div>

        {certificates.map((c, i) => (
          <div className="certs-item" key={c.id} data-reveal>
            <div className="certs-item-stage">
              <img
                src={c.image}
                alt={`${c.title} certificate from ${c.issuer}`}
                draggable="false"
                loading={i === 0 ? 'eager' : 'lazy'}
              />
              <button
                type="button"
                className="certs-open"
                aria-label={`View ${c.title} certificate larger`}
                onClick={(e) => {
                  itemTrigger.current = e.currentTarget
                  setLightbox(i)
                }}
              />
            </div>
            <div className="certs-item-caption">
              <p className="certs-count">
                {pad(i + 1)} <span>/ {pad(total)}</span>
              </p>
              <p className="certs-issuer">{c.issuer}</p>
              <h3 className="certs-name">{c.title}</h3>
              <p className="certs-detail">{c.detail}</p>
              <p className="certs-date">{c.date}</p>
            </div>
          </div>
        ))}
      </div>

      {lightbox != null &&
        createPortal(
          <div
            className="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={`${certificates[lightbox].title} certificate`}
            onClick={() => setLightbox(null)}
          >
            <button
              type="button"
              className="lightbox-back"
              autoFocus
              onClick={() => setLightbox(null)}
            >
              ← Back
            </button>
            <button type="button" className="lightbox-close" onClick={() => setLightbox(null)}>
              Close ✕
            </button>

            <figure className="lightbox-body" onClick={(e) => e.stopPropagation()}>
              <img
                src={certificates[lightbox].image}
                alt={`${certificates[lightbox].title} certificate from ${certificates[lightbox].issuer}`}
              />
              <figcaption className="lightbox-caption">
                <p className="lightbox-count">
                  {pad(lightbox + 1)} <span>/ {pad(total)}</span>
                </p>
                <p className="certs-issuer">{certificates[lightbox].issuer}</p>
                <h3 className="certs-name">{certificates[lightbox].title}</h3>
                <p className="certs-detail">{certificates[lightbox].detail}</p>
                <p className="certs-date">{certificates[lightbox].date}</p>
              </figcaption>
            </figure>

            <div className="lightbox-nav" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => setLightbox((v) => ((v ?? 0) + total - 1) % total)}
                aria-label="Previous certificate"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => setLightbox((v) => ((v ?? 0) + 1) % total)}
                aria-label="Next certificate"
              >
                →
              </button>
            </div>
          </div>,
          document.body
        )}
    </section>
  )
}
