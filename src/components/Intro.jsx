import { Fragment, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import SlashPortrait from './SlashPortrait'
import { site } from '../data/portfolio'

export default function Intro() {
  const [inView, setInView] = useState(false)
  const target = useRef(null)

  // Play the intro animation when the right-hand column scrolls into view,
  // and reset once it is fully out of view so it plays again next time.
  useEffect(() => {
    const el = target.current
    if (!el || !('IntersectionObserver' in window)) {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.4) setInView(true)
        else if (!entry.isIntersecting) setInView(false)
      },
      { threshold: [0, 0.4] }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const words = site.intro.split(' ')

  return (
    <section id="intro" className={`panel panel-intro${inView ? ' is-in' : ''}`} data-theme="light">
      <div className="intro-left">
        <p className="chapter" data-reveal>Chapter I</p>
        <p className="intro-aside" data-reveal>{site.aside}</p>
      </div>
      <div className="intro-right" ref={target}>
        <p className="label intro-label">Quick intro</p>
        <h2 className="intro-headline" aria-label={site.intro}>
          {words.map((word, i) => (
            <Fragment key={i}>
              <span className="word" aria-hidden="true" style={{ '--w': i }}>
                {word}
              </span>{' '}
            </Fragment>
          ))}
        </h2>
        <div className="intro-bottom">
          <Link className="more-link intro-link" to="/about">
            More about me <span aria-hidden="true">→</span>
          </Link>
          <SlashPortrait className="intro-portrait" />
        </div>
      </div>
    </section>
  )
}
