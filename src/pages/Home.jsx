import { useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Hero from '../components/Hero'
import Projects from '../components/Projects'
import About from '../components/About'
import Contact from '../components/Contact'

gsap.registerPlugin(ScrollTrigger)

const SECTIONS = ['top', 'work', 'about', 'contact']

export default function Home() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const triggers = SECTIONS.map((id, i) =>
      ScrollTrigger.create({
        trigger: `#${id}`,
        start: 'top center',
        end: 'bottom center',
        onToggle: (self) => {
          if (self.isActive) setActive(i)
        },
      })
    )
    return () => triggers.forEach((t) => t.kill())
  }, [])

  return (
    <>
      <Hero />
      <Projects />
      <About />
      <Contact />
      <div className="corner-index" aria-hidden="true">
        <span>{String(active + 1).padStart(2, '0')}</span> / {String(SECTIONS.length).padStart(2, '0')}
      </div>
    </>
  )
}
