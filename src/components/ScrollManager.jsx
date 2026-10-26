import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { goToSection } from '../lib/motion'

// Scrolls to #hash targets on route changes, or to the top for plain routes.
export default function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    const id = hash.replace('#', '')
    const timer = setTimeout(() => {
      if (id) goToSection(id)
      else window.scrollTo({ top: 0, behavior: 'instant' })
    }, 80)
    return () => clearTimeout(timer)
  }, [pathname, hash])

  return null
}
