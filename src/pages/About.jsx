import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import Portrait from '../components/Portrait'
import Contact from '../components/Contact'
import { revealVertical, setTheme, trackThemes } from '../lib/motion'
import { about, site } from '../data/portfolio'

export default function AboutPage() {
  const scope = useRef(null)

  useLayoutEffect(() => {
    setTheme('light')
    const ctx = gsap.context(() => {
      revealVertical(scope.current)
      trackThemes(gsap.utils.toArray('.panel', scope.current))
    }, scope)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={scope}>
      <section className="panel page-hero" data-theme="light">
        <div className="wrap about-hero-grid">
          <div className="about-hero-left">
            <p className="chapter" data-reveal>About</p>
            <h1 className="page-title" data-reveal>
              Hello, I'm<br /><em>{site.name}</em>.
            </h1>
            {about.short.map((p) => (
              <p className="about-body" key={p} data-reveal>{p}</p>
            ))}
            <Link className="more-link" to={{ pathname: '/', hash: '#work' }} data-reveal>
              See the work <span aria-hidden="true">→</span>
            </Link>
          </div>
          <Portrait className="about-portrait" />
        </div>
      </section>

      <section className="panel" data-theme="light">
        <div className="wrap">
          <div className="section-head">
            <p className="chapter" data-reveal>What I work on</p>
            <p className="section-count">{String(about.focus.length).padStart(2, '0')}</p>
          </div>
          <ol className="focus-list">
            {about.focus.map((f, i) => (
              <li className="focus-item" key={f.title} data-reveal>
                <span className="focus-num">{String(i + 1).padStart(2, '0')}</span>
                <h2 className="focus-title">{f.title}</h2>
                <p className="focus-text">{f.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="panel" data-theme="light">
        <div className="wrap">
          <div className="section-head">
            <p className="chapter" data-reveal>Currently learning</p>
          </div>
          <ul className="learning-list">
            {about.learning.map((l) => (
              <li key={l} data-reveal>{l}</li>
            ))}
          </ul>
        </div>
      </section>

      <Contact theme="dark" />
    </div>
  )
}
