import { useEffect, useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import Hero from '../components/Hero'
import About from '../components/About'
import Projects from '../components/Projects'
import SkillsSection from '../components/SkillsSection'
import Certificates from '../components/Certificates'
import TimelineSection from '../components/TimelineSection'
import Contact from '../components/Contact'
import { site } from '../data/portfolio'
import {
  goToSection,
  initCipherScramble,
  initMagneticElements,
  initSurfaceRelight,
  revealVertical,
  statCounters,
} from '../lib/motion'

export default function Home({ initialSection, onOpenResume }) {
  const scopeRef = useRef(null)

  useLayoutEffect(() => {
    document.title = `${site.name} — Portfolio`
    const ctx = gsap.context(() => {
      revealVertical(scopeRef.current)
      statCounters(scopeRef.current)
    }, scopeRef)
    const cleanupRelight = initSurfaceRelight(scopeRef.current)
    const cleanupScramble = initCipherScramble(scopeRef.current)
    const cleanupMagnetic = initMagneticElements(scopeRef.current)
    return () => {
      ctx.revert()
      cleanupRelight()
      cleanupScramble()
      cleanupMagnetic()
    }
  }, [])

  useEffect(() => {
    if (!initialSection) return
    const id = setTimeout(() => goToSection(initialSection), 90)
    return () => clearTimeout(id)
  }, [initialSection])

  return (
    <div className="lyn-page" ref={scopeRef}>
      <Hero onOpenResume={onOpenResume} />
      <About onOpenResume={onOpenResume} />
      <Projects />
      <SkillsSection />
      <Certificates />
      <TimelineSection />
      <Contact />
    </div>
  )
}
