import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const THEME_KEY = 'sanny-theme'
const SOUND_KEY = 'sanny-sound'
const CIPHER_CHARS = '0123456789ABCDEF/#_-+•'

let audioCtx = null
let soundEnabled = false

try {
  soundEnabled = window.localStorage.getItem(SOUND_KEY) === 'on'
} catch {
  soundEnabled = false
}

export function isSoundEnabled() {
  return soundEnabled
}

export function toggleSound() {
  soundEnabled = !soundEnabled
  try {
    window.localStorage.setItem(SOUND_KEY, soundEnabled ? 'on' : 'off')
  } catch {
    // ignore
  }
  if (soundEnabled) {
    playUiSound('open')
  }
  return soundEnabled
}

export function playUiSound(kind = 'tick') {
  if (!soundEnabled || typeof window === 'undefined') return
  const Ctx = window.AudioContext || window.webkitAudioContext
  if (!Ctx) return
  try {
    if (!audioCtx) audioCtx = new Ctx()
    if (audioCtx.state === 'suspended') audioCtx.resume()

    const now = audioCtx.currentTime
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()

    if (kind === 'relight') {
      osc.type = 'sine'
      osc.frequency.setValueAtTime(320, now)
      osc.frequency.exponentialRampToValueAtTime(640, now + 0.14)
      gain.gain.setValueAtTime(0.035, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16)
      osc.connect(gain)
      gain.connect(audioCtx.destination)
      osc.start(now)
      osc.stop(now + 0.17)
    } else if (kind === 'open') {
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(440, now)
      osc.frequency.exponentialRampToValueAtTime(587.33, now + 0.09)
      gain.gain.setValueAtTime(0.03, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.11)
      osc.connect(gain)
      gain.connect(audioCtx.destination)
      osc.start(now)
      osc.stop(now + 0.12)
    } else {
      osc.type = 'sine'
      osc.frequency.setValueAtTime(720, now)
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.035)
      gain.gain.setValueAtTime(0.022, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04)
      osc.connect(gain)
      gain.connect(audioCtx.destination)
      osc.start(now)
      osc.stop(now + 0.045)
    }
  } catch {
    // ignore audio errors
  }
}

export function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

export function getTheme() {
  try {
    const saved = window.localStorage.getItem(THEME_KEY)
    return saved === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

export function setTheme(theme, { animate = false, event = null } = {}) {
  const next = theme === 'light' ? 'light' : 'dark'
  try {
    window.localStorage.setItem(THEME_KEY, next)
  } catch {
    // ignore storage errors
  }

  const applyThemeDom = () => {
    document.documentElement.dataset.theme = next
    document.body.dataset.theme = next
  }

  if (animate && !prefersReducedMotion()) {
    playUiSound('relight')
    const yPct =
      typeof event?.clientY === 'number'
        ? Math.round((event.clientY / window.innerHeight) * 100)
        : 50
    document.documentElement.style.setProperty('--relight-y', `${yPct}%`)

    if (typeof document.startViewTransition === 'function') {
      try {
        document.documentElement.classList.add('vt-theme-wipe')
        const vt = document.startViewTransition(() => {
          applyThemeDom()
        })
        vt.finished.finally(() => {
          document.documentElement.classList.remove('vt-theme-wipe')
        })
        return next
      } catch {
        document.documentElement.classList.remove('vt-theme-wipe')
      }
    }

    document.documentElement.classList.add('theme-transitioning')
    window.setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning')
    }, 820)
  }

  applyThemeDom()
  return next
}

/**
 * Clean vertical reveal without 3D rotateX perspective warping (fixes sticky card trapezoid distortion).
 */
export function revealVertical(scope = document) {
  if (prefersReducedMotion()) return
  gsap.utils.toArray('[data-reveal]', scope).forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      y: 22,
      duration: 0.78,
      ease: 'power3.out',
      clearProps: 'opacity,transform',
      scrollTrigger: { trigger: el, start: 'top 92%', once: true },
    })
  })
}

/**
 * Sandra Bamboo-inspired Scroll-Triggered Surface Relighting ([data-relight]).
 * Smoothly cross-fades section surfaces between Carbon (#121213) and Warm Bone (#ebe9e3)
 * as the user scrolls into and out of designated contrast chapters.
 */
export function initSurfaceRelight(scope = document) {
  const root = scope && scope.querySelectorAll ? scope : document
  const sections = Array.from(root.querySelectorAll('[data-relight]'))
  if (!sections.length) return () => {}

  const update = () => {
    const vh = window.innerHeight || 900
    sections.forEach((sec) => {
      const rect = sec.getBoundingClientRect()
      const inZone = rect.top <= vh * 0.68 && rect.bottom >= vh * 0.22
      sec.dataset.shown = inZone ? 'contrast' : 'base'
    })
  }

  update()
  window.addEventListener('scroll', update, { passive: true })
  window.addEventListener('resize', update)
  return () => {
    window.removeEventListener('scroll', update)
    window.removeEventListener('resize', update)
  }
}

export function statCounters(scope = document) {
  const reduced = prefersReducedMotion()
  gsap.utils.toArray('[data-count]', scope).forEach((el) => {
    const target = Number(el.dataset.count) || 0
    const suffix = el.dataset.suffix || ''
    const format = (val) => `${Math.round(val)}${suffix}`
    if (reduced) {
      el.textContent = format(target)
      return
    }
    const state = { val: 0 }
    el.textContent = format(0)
    gsap.to(state, {
      val: target,
      duration: 1.35,
      ease: 'power2.out',
      onUpdate: () => {
        el.textContent = format(state.val)
      },
      scrollTrigger: {
        trigger: el,
        start: 'top 92%',
        once: true,
      },
    })
  })
}

/**
 * Monospace Scramble / Cipher Decode Effect for technical metadata labels,
 * section numbers, coordinates, and timeline dates.
 */
export function initCipherScramble(scope = document) {
  if (prefersReducedMotion()) return () => {}
  const root = scope && scope.querySelectorAll ? scope : document
  const nodes = Array.from(
    root.querySelectorAll(
      '[data-scramble], .lyn-sec-num, .lyn-sec-label, .doc-code, .exp-period, .telemetry-coords'
    )
  )

  const timers = new Map()

  const runScramble = (el) => {
    const original = el.dataset.originalText || el.textContent || ''
    if (!original.trim()) return
    el.dataset.originalText = original

    if (timers.has(el)) {
      clearInterval(timers.get(el))
    }

    const totalSteps = 10
    let step = 0
    const id = window.setInterval(() => {
      step += 1
      if (step >= totalSteps) {
        el.textContent = original
        clearInterval(id)
        timers.delete(el)
        return
      }
      const revealCount = Math.floor((step / totalSteps) * original.length)
      let next = ''
      for (let i = 0; i < original.length; i += 1) {
        const ch = original[i]
        if (ch === ' ' || i < revealCount) {
          next += ch
        } else {
          next += CIPHER_CHARS[(i * 7 + step * 3) % CIPHER_CHARS.length]
        }
      }
      el.textContent = next
    }, 26)

    timers.set(el, id)
  }

  const io =
    typeof IntersectionObserver !== 'undefined'
      ? new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                runScramble(entry.target)
                io.unobserve(entry.target)
              }
            })
          },
          { threshold: 0.4 }
        )
      : null

  const cleanups = []
  nodes.forEach((el) => {
    if (!el.dataset.originalText) {
      el.dataset.originalText = el.textContent || ''
    }
    const onEnter = () => runScramble(el)
    el.addEventListener('pointerenter', onEnter)
    if (io) io.observe(el)
    cleanups.push(() => {
      el.removeEventListener('pointerenter', onEnter)
      if (el.dataset.originalText) {
        el.textContent = el.dataset.originalText
      }
    })
  })

  return () => {
    if (io) io.disconnect()
    timers.forEach((id) => clearInterval(id))
    timers.clear()
    cleanups.forEach((fn) => fn())
  }
}

/**
 * Magnetic cursor attraction for pill buttons and interactive triggers on desktop.
 */
export function initMagneticElements(scope = document) {
  if (prefersReducedMotion()) return () => {}
  const finePointer =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches
  if (!finePointer) return () => {}

  const root = scope && scope.querySelectorAll ? scope : document
  const nodes = Array.from(
    root.querySelectorAll(
      '[data-magnetic], .lyn-pill-btn, .lyn-btn-solid, .lyn-btn-outline, .lyn-preview-btn, .lyn-inspect-pill'
    )
  )

  const cleanups = nodes.map((el) => {
    const onMove = (e) => {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = Math.max(-7, Math.min(7, (e.clientX - cx) * 0.2))
      const dy = Math.max(-5, Math.min(5, (e.clientY - cy) * 0.24))
      gsap.to(el, {
        x: dx,
        y: dy,
        duration: 0.24,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    }

    const onLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.45)',
        overwrite: 'auto',
      })
    }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      gsap.set(el, { clearProps: 'x,y' })
    }
  })

  return () => cleanups.forEach((fn) => fn())
}

export function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
  })
}

export function goToSection(id) {
  const behavior = prefersReducedMotion() ? 'auto' : 'smooth'
  if (!id || id === 'top') {
    window.scrollTo({ top: 0, behavior })
    return
  }
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior, block: 'start' })
  }
}
