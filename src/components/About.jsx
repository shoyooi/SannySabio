import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Portrait from './Portrait'
import { site } from '../data/site'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.about-quote, .about-body, .about-portrait', {
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
          <p className="section-label">About</p>
          <p className="section-count">02</p>
        </div>
        <div className="about-grid">
          <div>
            <p className="about-quote">
              Most of what I build sits between two or three disciplines at once.
            </p>
            <p className="about-body">
              I'm <strong>{site.name}</strong>, a BS Information Technology
              student at the College of Computing and Information Sciences,
              Cor Jesu College, based in <strong>{site.location}</strong>. My
              work spans a blockchain capstone, an AR learning app, and a
              venture prototype for local discovery — projects that each need
              a working build and a clear case for why it matters.
            </p>
            <p className="about-body">
              Right now I'm learning front-end animation with React and GSAP,
              smart-contract development with Solidity, and the information
              assurance and data privacy side of building software people can
              trust.
            </p>
          </div>
          <Portrait className="about-portrait" />
        </div>
      </div>
    </section>
  )
}
