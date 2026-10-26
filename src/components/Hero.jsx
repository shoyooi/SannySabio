import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import Clock from './Clock'
import { goToSection } from '../lib/motion'
import { site } from '../data/portfolio'

const LINES = [
  { text: 'Sanny' },
  { text: 'Sabio,' },
  { text: 'Portfolio', accent: true },
]

export default function Hero() {
  const scope = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' }, delay: 0.1 })
      tl.from('.hero-name .line-inner', { yPercent: 115, duration: 1.3, stagger: 0.12 })
        .from('.hero-sub', { opacity: 0, y: 16, duration: 0.9 }, '-=0.8')
        .from('.hero-foot > *', { opacity: 0, y: 12, duration: 0.8, stagger: 0.1 }, '-=0.7')
    }, scope)
    return () => ctx.revert()
  }, [])

  return (
    <section id="top" className="panel panel-hero" data-theme="dark" ref={scope}>
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
