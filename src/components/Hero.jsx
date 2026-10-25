import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import Portrait from './Portrait'
import Clock from './Clock'
import { site } from '../data/portfolio'

const LINES = [
  { text: 'Sho —' },
  { text: 'systems,' },
  { text: 'shipped.', accent: true },
]

export default function Hero() {
  const scope = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })

      tl.to('.hero .portrait', { opacity: 1, scale: 1, duration: 0.8 })
        .to('.hero-eyebrow span', { y: '0%', duration: 0.7 }, '-=0.5')
        .to('.hero-name .line-inner', { y: '0%', duration: 1.1, stagger: 0.1 }, '-=0.4')
        .to('.hero-sub', { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
        .to('.hero-cta .btn', { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 }, '-=0.4')
    }, scope)

    return () => ctx.revert()
  }, [])

  return (
    <section id="top" className="hero" ref={scope}>
      <div className="wrap">
        <Portrait className="hero-portrait" />
        <p className="hero-eyebrow">
          <span><em className="chapter">Prologue</em>{site.role}</span>
        </p>
        <h1 className="hero-name">
          {LINES.map((line) => (
            <span className="line" key={line.text}>
              <span className={`line-inner${line.accent ? ' line-accent' : ''}`}>{line.text}</span>
            </span>
          ))}
        </h1>
        <p className="hero-sub">{site.tagline}</p>
        <div className="hero-cta">
          <Link className="btn btn-primary" to={{ pathname: '/', hash: '#work' }}>
            View my work
          </Link>
          <Link className="btn btn-ghost" to={{ pathname: '/', hash: '#contact' }}>
            Contact me
          </Link>
        </div>
        <Clock />
      </div>
    </section>
  )
}
