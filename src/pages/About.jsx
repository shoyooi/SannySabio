import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Portrait from '../components/Portrait'
import Contact from '../components/Contact'
import { about, site } from '../data/portfolio'

gsap.registerPlugin(ScrollTrigger)

export default function AboutPage() {
  const scope = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.page-title, .page-hero .about-body, .page-hero .about-portrait', {
        opacity: 0,
        y: 24,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
      })
      gsap.from('.focus-item', {
        opacity: 0,
        y: 24,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.focus-list', start: 'top 80%' },
      })
    }, scope)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={scope}>
      <section className="page-hero">
        <div className="wrap">
          <p className="section-label">About</p>
          <h1 className="page-title">
            Hello, I'm <em>{site.name}</em>.
          </h1>
          <div className="about-grid">
            <div>
              {about.short.map((p) => (
                <p className="about-body" key={p}>{p}</p>
              ))}
              <Link className="text-link" to={{ pathname: '/', hash: '#work' }}>See the work →</Link>
            </div>
            <Portrait className="about-portrait" />
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="section-head">
            <p className="section-label">What I work on</p>
            <p className="section-count">{String(about.focus.length).padStart(2, '0')}</p>
          </div>
          <ol className="focus-list">
            {about.focus.map((f, i) => (
              <li className="focus-item" key={f.title}>
                <span className="focus-num">{String(i + 1).padStart(2, '0')}</span>
                <h2 className="focus-title">{f.title}</h2>
                <p className="focus-text">{f.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="section-head">
            <p className="section-label">Currently learning</p>
          </div>
          <ul className="learning-list">
            {about.learning.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </div>
      </section>

      <Contact />
    </div>
  )
}
