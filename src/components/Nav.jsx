import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { site } from '../data/portfolio'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`nav${scrolled ? ' nav-scrolled' : ''}`} aria-label="Primary">
      <div className="wrap nav-inner">
        <Link to="/" className="nav-mark">{site.name}</Link>
        <div className="nav-links">
          <Link to={{ pathname: '/', hash: '#work' }}><span>01</span>Work</Link>
          <Link to="/about"><span>02</span>About</Link>
          <Link to={{ pathname: '/', hash: '#contact' }}><span>03</span>Contact</Link>
        </div>
      </div>
    </nav>
  )
}
