import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { about, site } from '../data/portfolio'
import { prefersReducedMotion } from '../lib/motion'
import HalftonePortrait from './HalftonePortrait'

gsap.registerPlugin(ScrollTrigger)

/**
 * (01) ABOUT section featuring:
 * - Left: Interactive Halftone Dot-Matrix Portrait with Vermilion Sun Halo & Magnetic Moiré Hover Distortion
 * - Right: Continuous word-by-word scroll-scrubbed manifesto, bio paragraphs, animated KPI counters, and Resume actions
 */
export default function About({ onOpenResume }) {
  const sectionRef = useRef(null)

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.manifesto-word',
        {
          opacity: 0.18,
          y: 4,
          filter: 'blur(1.2px)',
        },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          stagger: 0.06,
          ease: 'none',
          scrollTrigger: {
            trigger: '.about-manifesto',
            start: 'top 86%',
            end: 'bottom 48%',
            scrub: 0.3,
          },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const words = about.lead.split(' ')

  return (
    <section id="about" className="lyn-section" ref={sectionRef}>
      <div className="lyn-container">
        <div className="lyn-sec-bar" data-reveal>
          <span className="lyn-sec-num">(01)</span>
          <h2 className="lyn-sec-label">ABOUT</h2>
          <span className="lyn-sec-rule" aria-hidden="true" />
        </div>

        <div className="lyn-about-grid">
          {/* LEFT: Interactive Halftone Dot-Matrix Portrait (replaces Lanyard ID Card) */}
          <div className="lanyard-col halftone-col" data-reveal>
            <HalftonePortrait />
          </div>

          {/* RIGHT: Manifesto, Bio, Counters, Resume CTAs */}
          <div className="about-content-col">
            <h3 className="about-manifesto" aria-label={about.lead}>
              {words.map((w, i) => (
                <span key={i} className="manifesto-word" aria-hidden="true">
                  {w}{' '}
                </span>
              ))}
            </h3>

            <div className="about-bio-stack">
              {about.short.map((p) => (
                <p key={p} className="about-bio-p" data-reveal>
                  {p}
                </p>
              ))}
            </div>

            <div className="about-metrics-row" data-reveal>
              {about.stats.map((s) => (
                <div className="about-metric" key={s.label}>
                  <span
                    className="about-metric-val"
                    data-count={s.value}
                    data-suffix={s.suffix}
                  >
                    {s.value}
                    {s.suffix}
                  </span>
                  <span className="about-metric-label">
                    {s.label.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>

            <div className="about-cta-row" data-reveal>
              <button
                type="button"
                className="lyn-btn-solid"
                onClick={onOpenResume}
                data-cursor="PREVIEW"
              >
                Preview Resume <span aria-hidden="true">↗</span>
              </button>

              {site.resume ? (
                <a href={site.resume} download className="lyn-btn-outline">
                  DOWNLOAD CV <span aria-hidden="true">↓</span>
                </a>
              ) : (
                <button
                  type="button"
                  className="lyn-btn-outline"
                  onClick={onOpenResume}
                >
                  DOWNLOAD CV <span aria-hidden="true">↓</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
