import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../lib/motion'

export default function CustomCursor() {
  const dotRef = useRef(null)
  const [label, setLabel] = useState('')
  const [active, setActive] = useState(false)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || prefersReducedMotion()) return
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const update = () => setEnabled(mq.matches && window.innerWidth > 900)
    update()
    mq.addEventListener?.('change', update)
    window.addEventListener('resize', update)
    return () => {
      mq.removeEventListener?.('change', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  useEffect(() => {
    if (!enabled || !dotRef.current) return undefined
    const dot = dotRef.current
    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let curX = mouseX
    let curY = mouseY
    let rafId = null

    const updateTargetAt = (x, y, fallbackTarget = null) => {
      const el = fallbackTarget || document.elementFromPoint(x, y)
      const cursorHost = el?.closest?.('[data-cursor]')
      const interactiveHost = el?.closest?.('a, button, [role="button"]')
      const customLabel = cursorHost?.getAttribute?.('data-cursor') || ''
      setLabel(customLabel)
      setActive(Boolean(cursorHost || interactiveHost))
    }

    const onMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      document.documentElement.style.setProperty('--spot-x', `${mouseX}px`)
      document.documentElement.style.setProperty('--spot-y', `${mouseY}px`)
      updateTargetAt(mouseX, mouseY, e.target)
    }

    const onScrollOrClick = () => {
      updateTargetAt(mouseX, mouseY)
    }

    const tick = () => {
      curX += (mouseX - curX) * 0.28
      curY += (mouseY - curY) * 0.28
      dot.style.transform = `translate3d(${curX.toFixed(1)}px, ${curY.toFixed(1)}px, 0)`
      rafId = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', onScrollOrClick, {
      passive: true,
      capture: true,
    })
    window.addEventListener('pointerdown', onScrollOrClick, { passive: true })
    rafId = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', onScrollOrClick, { capture: true })
      window.removeEventListener('pointerdown', onScrollOrClick)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <>
      <div className="sb-grain" aria-hidden="true" />
      <div className="dot-grid-spotlight" aria-hidden="true" />
      <div
        ref={dotRef}
        className={`custom-cursor sb-cursor${active ? ' is-active' : ''}${label ? ' has-label' : ''}`}
        aria-hidden="true"
      >
        <span className="sb-cursor-box">
          {label && <span className="custom-cursor-label">{label}</span>}
        </span>
      </div>
    </>
  )
}
