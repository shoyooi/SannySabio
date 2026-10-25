import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Portrait from './Portrait'
import { about } from '../data/portfolio'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.about-quote, .about-body, .text-link, .about-portrait', {
        opacity: 0,
        y: 20,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="about" ref={sectionRef}>
      <div className="wrap">
        <div className="section-head">
          <p className="section-label"><em className="chapter">Chapter II</em>About</p>
          <p className="section-count">02</p>
        </div>
        <div className="about-grid">
          <div>
            <p className="about-quote">{about.quote}</p>
            {about.short.map((p) => (
              <p className="about-body" key={p}>{p}</p>
            ))}
            <Link className="text-link" to="/about">More about me →</Link>
          </div>
          <Portrait className="about-portrait" />
        </div>
      </div>
    </section>
  )
}
