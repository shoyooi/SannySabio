import { useEffect, useRef } from 'react'
import { getTheme, setTheme } from '../lib/motion'

/**
 * Minimal scroll-progress hairline tracks (top & Sandra Bamboo bottom track with 7px lime point).
 * The fixed top navigation header has been removed per user request so the Vexoo Bento Hub
 * topbar sits flush at the top of the page.
 */
export default function Rail() {
  const barRef = useRef(null)
  const bottomBarRef = useRef(null)
  const bottomPointRef = useRef(null)

  useEffect(() => {
    setTheme(getTheme())
  }, [])

  useEffect(() => {
    const update = () => {
      const y = window.scrollY
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${p})`
      }
      if (bottomBarRef.current) {
        bottomBarRef.current.style.transform = `scaleX(${p})`
      }
      if (bottomPointRef.current) {
        bottomPointRef.current.style.left = `${(p * 100).toFixed(2)}%`
      }
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <>
      <div className="lyn-progress" aria-hidden="true">
        <span ref={barRef} />
      </div>

      <div className="sb-case-progress" aria-hidden="true">
        <span ref={bottomBarRef} className="sb-case-progress-fill" />
        <span ref={bottomPointRef} className="sb-case-progress-point" />
      </div>
    </>
  )
}
