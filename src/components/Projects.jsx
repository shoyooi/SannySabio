import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ProjectCard from './ProjectCard'
import { projects } from '../data/portfolio'

gsap.registerPlugin(ScrollTrigger)

export default function Projects() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.project-card', {
        opacity: 0,
        y: 32,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.project-grid', start: 'top 80%' },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="work" ref={sectionRef}>
      <div className="wrap">
        <div className="section-head">
          <p className="section-label"><em className="chapter">Chapter I</em>Selected work</p>
          <p className="section-count">{String(projects.length).padStart(2, '0')}</p>
        </div>
        <div className="project-grid">
          {projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
