import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Horizontal (scroll-down = slide-left) mode is only used on roomy screens
// where the visitor hasn't asked for reduced motion.
export const H_QUERY =
  '(min-width: 900px) and (min-height: 560px) and (prefers-reduced-motion: no-preference)'

// The side rail / top bar follows the theme of whichever panel is in view.
export function setTheme(theme) {
  document.body.dataset.theme = theme
}

export function trackThemes(panels) {
  panels.forEach((panel) =>
    ScrollTrigger.create({
      trigger: panel,
      start: 'top 40px',
      end: 'bottom 40px',
      onToggle: (self) => {
        if (self.isActive) setTheme(panel.dataset.theme || 'light')
      },
    })
  )
}

// Vertical fade-up reveal used on small screens and on regular pages.
export function revealVertical(scope) {
  gsap.utils.toArray('[data-reveal]', scope).forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      y: 28,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    })
  })
}

// Jump to a section by id. In horizontal mode the page is a pinned track, so
// we translate the panel's x-offset into the matching vertical scroll position.
export function goToSection(id) {
  const el = document.getElementById(id)
  if (!el) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }
  const st = ScrollTrigger.getById('hs')
  const track = el.closest('.hs-track')
  if (st && track) {
    const dist = track.scrollWidth - track.parentElement.clientWidth
    const p = dist > 0 ? Math.min(1, el.offsetLeft / dist) : 0
    window.scrollTo({ top: st.start + p * (st.end - st.start), behavior: 'smooth' })
  } else {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}
