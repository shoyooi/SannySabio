import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Hero from '../components/Hero'
import Intro from '../components/Intro'
import Projects from '../components/Projects'
import Certificates from '../components/Certificates'
import About from '../components/About'
import Contact from '../components/Contact'
import { H_QUERY, revealVertical, setTheme, trackThemes } from '../lib/motion'

gsap.registerPlugin(ScrollTrigger)

export default function Home() {
  const wrapRef = useRef(null)
  const trackRef = useRef(null)

  useLayoutEffect(() => {
    const wrap = wrapRef.current
    const track = trackRef.current
    const panels = gsap.utils.toArray('.panel', track)
    setTheme('dark')

    const mm = gsap.matchMedia()
    mm.add({ h: H_QUERY, any: 'all' }, (ctx) => {
      // Small screens / reduced motion: ordinary vertical page.
      if (!ctx.conditions.h) {
        revealVertical(track)
        trackThemes(panels)

        const zoomBox = track.querySelector('.the-work-preview-box')
        const splashPanel = track.querySelector('.panel-work-splash')
        if (zoomBox && splashPanel) {
          gsap.fromTo(
            zoomBox,
            { scale: 0.85, transformOrigin: 'center center' },
            {
              scale: 1.35,
              ease: 'power1.out',
              scrollTrigger: {
                trigger: splashPanel,
                start: 'top 85%',
                end: 'bottom 25%',
                scrub: true,
              },
            }
          )
        }
        return
      }

      // Wide screens: scrolling down slides the whole page to the left.
      wrap.classList.add('is-horizontal')
      const setWidth = () => track.style.setProperty('--pw', `${wrap.clientWidth}px`)
      setWidth()
      ScrollTrigger.addEventListener('refreshInit', setWidth)

      const dist = () => Math.max(0, track.scrollWidth - wrap.clientWidth)

      const syncTheme = () => {
        const x = -gsap.getProperty(track, 'x')
        let idx = 0
        panels.forEach((p, i) => {
          if (p.offsetLeft <= x + 4) idx = i
        })
        setTheme(panels[idx].dataset.theme || 'light')
      }

      const slide = gsap.to(track, {
        x: () => -dist(),
        ease: 'none',
        onUpdate: syncTheme,
        scrollTrigger: {
          id: 'hs',
          trigger: wrap,
          pin: true,
          scrub: 0.7,
          start: 'top top',
          end: () => `+=${dist()}`,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      })

      panels.forEach((panel, i) => {
        // Elements glide in from the right as their panel slides into view.
        panel.querySelectorAll('[data-reveal]').forEach((el) => {
          gsap.from(el, {
            opacity: 0,
            x: 90,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              containerAnimation: slide,
              start: 'left 92%',
              toggleActions: 'play none none reverse',
            },
          })
        })

        // Parallax: positive values drift left faster than the page, negative slower.
        panel.querySelectorAll('[data-parallax]').forEach((el) => {
          const v = parseFloat(el.dataset.parallax) || 0
          gsap.fromTo(el, { x: i === 0 ? 0 : v }, {
            x: -v,
            ease: 'none',
            scrollTrigger: {
              trigger: panel,
              containerAnimation: slide,
              start: i === 0 ? 'left left' : 'left right',
              end: 'right left',
              scrub: true,
            },
          })
        })
      })

      // Scrub zoom-in & morph animation for "THE WORK" unified fullscreen panel
      const workUnified = track.querySelector('.panel-work-unified')
      const zoomBox = track.querySelector('.the-work-preview-box')
      const theWord = track.querySelector('.the-work-the')
      const workWord = track.querySelector('.the-work-work')
      const splashLayer = track.querySelector('.work-splash-layer')
      const showcaseLayer = track.querySelector('.work-showcase-layer')

      if (workUnified && zoomBox) {
        // 1. Zoom in preview box as panel enters & centers
        gsap.fromTo(
          zoomBox,
          { scale: 0.85, transformOrigin: 'center center' },
          {
            scale: 2.2,
            ease: 'power1.inOut',
            scrollTrigger: {
              trigger: workUnified,
              containerAnimation: slide,
              start: 'left 80%',
              end: 'left 20%',
              scrub: 0.4,
            },
          }
        )

        if (theWord && workWord) {
          gsap.to(theWord, {
            x: -75,
            opacity: 0.15,
            ease: 'power1.out',
            scrollTrigger: {
              trigger: workUnified,
              containerAnimation: slide,
              start: 'left 80%',
              end: 'left 25%',
              scrub: 0.4,
            },
          })
          gsap.to(workWord, {
            x: 75,
            opacity: 0.15,
            ease: 'power1.out',
            scrollTrigger: {
              trigger: workUnified,
              containerAnimation: slide,
              start: 'left 80%',
              end: 'left 25%',
              scrub: 0.4,
            },
          })
        }

        // 2. Smoothly transition from THE WORK splash to Related Work showcase
        if (splashLayer && showcaseLayer) {
          gsap.fromTo(
            showcaseLayer,
            { opacity: 0, pointerEvents: 'none' },
            {
              opacity: 1,
              pointerEvents: 'auto',
              ease: 'power1.out',
              scrollTrigger: {
                trigger: workUnified,
                containerAnimation: slide,
                start: 'left 25%',
                end: 'left 5%',
                scrub: 0.3,
                onUpdate: (self) => {
                  if (self.progress > 0.3) {
                    showcaseLayer.style.pointerEvents = 'auto'
                    splashLayer.style.pointerEvents = 'none'
                  } else {
                    showcaseLayer.style.pointerEvents = 'none'
                    splashLayer.style.pointerEvents = 'auto'
                  }
                },
              },
            }
          )

          gsap.to(splashLayer, {
            opacity: 0,
            scale: 1.05,
            scrollTrigger: {
              trigger: workUnified,
              containerAnimation: slide,
              start: 'left 30%',
              end: 'left 10%',
              scrub: 0.3,
            },
          })
        }
      }

      return () => {
        ScrollTrigger.removeEventListener('refreshInit', setWidth)
        wrap.classList.remove('is-horizontal')
        track.style.removeProperty('--pw')
      }
    })

    document.fonts?.ready.then(() => ScrollTrigger.refresh())

    return () => mm.revert()
  }, [])

  return (
    <div className="hs" ref={wrapRef}>
      <div className="hs-track" ref={trackRef}>
        <Hero />
        <Intro />
        <Projects />
        <Certificates />
        <About />
        <Contact theme="dark" label="Chapter V" />
      </div>
    </div>
  )
}
