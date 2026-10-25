import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Scrolls to #hash targets on route changes, or to the top for plain routes.
export default function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    const id = hash.replace('#', '')
    const timer = setTimeout(() => {
      const el = id ? document.getElementById(id) : null
      if (el) el.scrollIntoView({ behavior: 'smooth' })
      else window.scrollTo({ top: 0 })
    }, 0)
    return () => clearTimeout(timer)
  }, [pathname, hash])

  return null
}
