import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

const pad = (n) => String(n).padStart(2, '0')

/**
 * Shared accessible full-screen lightbox modal with keyboard navigation,
 * focus trapping, background scroll lock, and trigger focus restoration.
 */
export default function Lightbox({
  items,
  index,
  onClose,
  onChange,
  triggerRef,
  getSrc,
  getAlt,
  getLabel,
  renderCaption,
}) {
  const lightboxRef = useRef(null)
  const total = items.length
  const item = index != null ? items[index] : null

  useEffect(() => {
    if (index == null || total === 0) return

    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (total > 1 && e.key === 'ArrowRight') onChange((index + 1) % total)
      if (total > 1 && e.key === 'ArrowLeft') onChange((index + total - 1) % total)
      if (e.key === 'Tab') {
        const container = lightboxRef.current
        if (!container) return
        const focusables = [
          ...container.querySelectorAll('button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'),
        ]
        if (focusables.length === 0) return
        e.preventDefault()
        const curIdx = focusables.indexOf(document.activeElement)
        const nextIdx = e.shiftKey
          ? curIdx <= 0
            ? focusables.length - 1
            : curIdx - 1
          : curIdx === -1 || curIdx >= focusables.length - 1
            ? 0
            : curIdx + 1
        focusables[nextIdx]?.focus()
      }
    }

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
      triggerRef?.current?.focus?.({ preventScroll: true })
    }
  }, [index, total, onClose, onChange, triggerRef])

  if (index == null || !item) return null

  return createPortal(
    <div
      ref={lightboxRef}
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={getLabel(item)}
      onClick={onClose}
    >
      <button type="button" className="lightbox-back" autoFocus onClick={onClose}>
        ← Back
      </button>
      <button type="button" className="lightbox-close" onClick={onClose}>
        Close ✕
      </button>

      <figure className="lightbox-body" onClick={(e) => e.stopPropagation()}>
        <img src={getSrc(item)} alt={getAlt(item)} />
        <figcaption className="lightbox-footer">
          <div className="lightbox-caption">
            <p className="lightbox-count">
              {pad(index + 1)} <span>/ {pad(total)}</span>
            </p>
            <div className="lightbox-details">
              {renderCaption(item)}
            </div>
          </div>

          {total > 1 && (
            <div className="lightbox-nav">
              <button
                type="button"
                onClick={() => onChange((index + total - 1) % total)}
                aria-label="Previous item"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => onChange((index + 1) % total)}
                aria-label="Next item"
              >
                →
              </button>
            </div>
          )}
        </figcaption>
      </figure>
    </div>,
    document.body
  )
}
