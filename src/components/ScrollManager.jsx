import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { goToSection, prefersReducedMotion } from '../lib/motion'

// Scrolls to #hash targets on route changes, or to the top for plain routes.
export default function ScrollManager() {
  const { pathname, hash } = useLocation()
  const prevPath = useRef(pathname)

  useEffect(() => {
    const samePage = prevPath.current === pathname
    prevPath.current = pathname
    const id = hash.replace('#', '')
    const timer = setTimeout(() => {
      if (id) {
        goToSection(id)
      } else if (samePage && !prefersReducedMotion()) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' })
      }
    }, 80)
    return () => clearTimeout(timer)
  }, [pathname, hash])

  return null
}
