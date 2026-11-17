import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import Clock from './Clock'
import { goToSection } from '../lib/motion'
import { site } from '../data/portfolio'

gsap.registerPlugin(DrawSVGPlugin)

const LINES = [
  { text: 'Sanny' },
  { text: 'Sabio,' },
  { text: 'Portfolio', accent: true },
]

// Geometric arc motif — concentric circles with one sweeping quarter-arc,
// drawn on load with DrawSVG. Purely decorative (aria-hidden).
export default function Hero() {
  const scope = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' }, delay: 0.1 })
      tl.from('.hero-art [data-draw]', {
          drawSVG: '0%',
          duration: 1.9,
          stagger: 0.16,
          ease: 'power2.inOut',
        })
        .from('.hero-art .hero-dot', {
          opacity: 0,
          scale: 0,
          transformOrigin: '50% 50%',
          duration: 0.7,
          ease: 'back.out(2.2)',
        }, 1.15)
        .from('.hero-name .line-inner', { yPercent: 115, duration: 1.3, stagger: 0.12 }, '-=1.5')
        .from('.hero-sub', { opacity: 0, y: 16, duration: 0.9 }, '-=0.8')
        .from('.hero-foot > *', { opacity: 0, y: 12, duration: 0.8, stagger: 0.1 }, '-=0.7')
    }, scope)
    return () => ctx.revert()
  }, [])

  return (
    <section id="top" className="panel panel-hero" data-theme="dark" ref={scope}>
      <svg className="hero-art" viewBox="0 0 640 640" aria-hidden="true" focusable="false">
        <circle className="arc a1" data-draw cx="320" cy="320" r="300" />
        <circle className="arc a2" data-draw cx="320" cy="320" r="226" />
        <circle className="arc a3" data-draw cx="320" cy="320" r="150" />
        <path className="arc sweep" data-draw d="M 320 20 A 300 300 0 0 1 620 320" />
        <circle className="hero-dot" cx="620" cy="320" r="7" />
      </svg>
      <h1 className="hero-name" data-parallax="260">
        {LINES.map((line) => (
          <span className="line" key={line.text}>
            <span className={`line-inner${line.accent ? ' line-accent' : ''}`}>{line.text}</span>
          </span>
        ))}
      </h1>
      <p className="hero-sub">{site.tagline}</p>
      <div className="hero-foot">
        <Clock />
        <p className="hero-status">{site.status}</p>
        <button type="button" className="scroll-cue" onClick={() => goToSection('intro')}>
          Scroll
          <span className="arrow arrow-h" aria-hidden="true">→</span>
          <span className="arrow arrow-v" aria-hidden="true">↓</span>
        </button>
      </div>
    </section>
  )
}
