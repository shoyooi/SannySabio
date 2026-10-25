import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { site } from '../data/site'

gsap.registerPlugin(ScrollTrigger)

export default function Contact() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.contact-title, .contact-links a', {
        opacity: 0,
        y: 16,
        duration: 0.6,
        stagger: 0.07,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const links = [
    site.email && { href: `mailto:${site.email}`, label: site.email, external: false },
    site.github && { href: site.github, label: site.github.replace('https://', ''), external: true },
    site.linkedin && { href: site.linkedin, label: site.linkedin.replace('https://', ''), external: true },
  ].filter(Boolean)

  return (
    <section id="contact" className="contact" ref={sectionRef}>
      <div className="wrap">
        <div className="section-head">
          <p className="section-label">Get in touch</p>
          <p className="section-count">03</p>
        </div>
        <h2 className="contact-title">Let's build something that holds up.</h2>
        <div className="contact-links">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              {...(l.external ? { target: '_blank', rel: 'noreferrer' } : {})}
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
