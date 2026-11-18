import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../lib/motion'
import { site } from '../data/portfolio'

/**
 * Interactive Halftone Dot-Matrix Bust Portrait with Vermilion Sun Halo (#d94625)
 * and Magnetic Moiré Lens Hover Distortion (matching the user's 3rd & 4th reference images).
 * Crops /profile.webp to an oversized sculptural head-and-shoulders bust so facial features,
 * glasses, hair, and hand render at high dot density with concentric moiré ripple distortion.
 */
export default function HalftonePortrait() {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined

    let unmounted = false
    let rafId = 0

    // Logical canvas dimensions (CSS pixels)
    const W = 480
    const H = 560
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = W * dpr
    canvas.height = H * dpr

    // High-density halftone matrix (~88x102 = ~8,976 cells)
    const COLS = 88
    const ROWS = 102
    const cellW = W / COLS
    const cellH = H / ROWS
    const maxDotR = Math.min(cellW, cellH) * 0.52

    // Vermilion sun disc parameters (overlapping crown & forehead like 3rd/4th image)
    const sunBaseX = W * 0.51
    const sunBaseY = H * 0.22
    const sunRadius = W * 0.215

    const pointer = {
      x: -9999,
      y: -9999,
      targetX: -9999,
      targetY: -9999,
      inside: false,
      phase: 0,
    }

    let dots = []

    const buildDotsFromImage = (img) => {
      const off = document.createElement('canvas')
      off.width = COLS
      off.height = ROWS
      const octx = off.getContext('2d', { willReadFrequently: true })
      if (!octx) return

      octx.clearRect(0, 0, COLS, ROWS)

      // Crop to upper 66% of /profile.webp (head, glasses, hand, shoulders bust)
      const srcX = 0
      const srcY = 0
      const srcW = img.width
      const srcH = Math.round(img.height * 0.66)

      const bustAspect = srcW / srcH
      const targetH = ROWS * 0.94
      const targetW = targetH * bustAspect
      const drawX = (COLS - targetW) * 0.5
      const drawY = ROWS - targetH

      octx.drawImage(
        img,
        srcX,
        srcY,
        srcW,
        srcH,
        drawX,
        drawY,
        targetW,
        targetH
      )
      const imgData = octx.getImageData(0, 0, COLS, ROWS)
      const data = imgData.data

      // Compute raw luminance buffer for local unsharp contrast enhancement
      const lumBuf = new Float32Array(COLS * ROWS)
      for (let i = 0; i < COLS * ROWS; i += 1) {
        const idx = i * 4
        lumBuf[i] =
          (0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2]) /
          255
      }

      const nextDots = []
      for (let r = 0; r < ROWS; r += 1) {
        for (let c = 0; c < COLS; c += 1) {
          const cellIdx = r * COLS + c
          const idx = cellIdx * 4
          const a = data[idx + 3]
          if (a < 28) continue

          // Local 3x3 average for unsharp mask detail enhancement (glasses, eyes, hair strands, fingers)
          let sum = 0
          let count = 0
          for (let dr = -1; dr <= 1; dr += 1) {
            const nr = r + dr
            if (nr < 0 || nr >= ROWS) continue
            for (let dc = -1; dc <= 1; dc += 1) {
              const nc = c + dc
              if (nc < 0 || nc >= COLS) continue
              sum += lumBuf[nr * COLS + nc]
              count += 1
            }
          }
          const avg = sum / Math.max(1, count)
          const rawLum = lumBuf[cellIdx]
          const sharpened = rawLum + (rawLum - avg) * 1.85

          // Sculptural directional rim light so dark hair/shirt still have 3D relief
          const nx = (c / COLS - 0.5) * 2
          const ny = (r / ROWS - 0.42) * 2
          const studioLight = Math.max(
            0,
            1 - Math.hypot(nx - 0.16, ny + 0.18) * 0.78
          )
          const lum = Math.min(
            1,
            Math.max(0, sharpened * 1.25 + studioLight * 0.24 - 0.04)
          )

          const hx = (c + 0.5) * cellW
          const hy = (r + 0.5) * cellH
          const alphaNorm = a / 255

          // Continuous 4-tier halftone sizing & value
          let tone = 2
          let baseR = maxDotR * 0.65
          if (lum < 0.24) {
            tone = 0 // Deep shadow
            baseR = maxDotR * (0.78 + (0.24 - lum) * 0.85) * alphaNorm
          } else if (lum < 0.46) {
            tone = 1 // Dark midtone
            baseR = maxDotR * (0.58 + (0.46 - lum) * 0.75) * alphaNorm
          } else if (lum < 0.7) {
            tone = 2 // Light midtone
            baseR = maxDotR * (0.52 + (lum - 0.46) * 0.8) * alphaNorm
          } else {
            tone = 3 // Highlight
            baseR = maxDotR * (0.64 + (lum - 0.7) * 1.1) * alphaNorm
          }

          nextDots.push({
            hx,
            hy,
            x: hx,
            y: hy,
            vx: 0,
            vy: 0,
            baseR: Math.max(0.8, Math.min(maxDotR * 1.04, baseR)),
            curR: baseR,
            lum,
            tone,
          })
        }
      }
      dots = nextDots
      setLoaded(true)
    }

    const renderFrame = () => {
      if (unmounted) return
      const isLight = document.documentElement.dataset.theme === 'light'

      ctx.save()
      ctx.scale(dpr, dpr)
      ctx.clearRect(0, 0, W, H)

      if (pointer.inside) {
        pointer.x += (pointer.targetX - pointer.x) * 0.24
        pointer.y += (pointer.targetY - pointer.y) * 0.24
        pointer.phase += 0.1
      }

      const sunOffsetX = pointer.inside ? ((pointer.x - W * 0.5) / W) * 12 : 0
      const sunOffsetY = pointer.inside ? ((pointer.y - H * 0.5) / H) * 9 : 0
      const sunX = sunBaseX + sunOffsetX
      const sunY = sunBaseY + sunOffsetY

      // 1. Draw base Vermilion Sun Disc (#d94625)
      ctx.beginPath()
      ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2)
      ctx.fillStyle = '#d94625'
      ctx.fill()

      // Small satellite dot on the left (matching 3rd & 4th reference images)
      ctx.beginPath()
      ctx.arc(W * 0.08, H * 0.22, 3.2, 0, Math.PI * 2)
      ctx.fillStyle = '#d94625'
      ctx.fill()

      // 2. Update & draw each halftone dot with 4th-image Concentric Moiré Lens Distortion
      const influenceR = 108
      const influenceR2 = influenceR * influenceR
      const reduced = prefersReducedMotion()
      let stillMoving = pointer.inside

      for (let i = 0; i < dots.length; i += 1) {
        const d = dots[i]
        let tx = d.hx
        let ty = d.hy
        let targetR = d.baseR

        if (pointer.inside && !reduced) {
          const dx = d.hx - pointer.x
          const dy = d.hy - pointer.y
          const dist2 = dx * dx + dy * dy
          if (dist2 < influenceR2 && dist2 > 0.001) {
            const dist = Math.sqrt(dist2)
            const t = 1 - dist / influenceR
            const falloff = t * t

            // Spherical magnetic lens + concentric moiré wave rings (4th image effect)
            const wave = Math.sin(dist * 0.32 - pointer.phase) * 6.5 * falloff
            const lensPush = falloff * 17 + wave
            const ux = dx / dist
            const uy = dy / dist
            const swirl = falloff * 3.5

            tx = d.hx + ux * lensPush - uy * swirl
            ty = d.hy + uy * lensPush + ux * swirl

            const ringMod =
              1 + Math.cos(dist * 0.34 - pointer.phase) * 0.36 * falloff
            targetR = Math.max(
              0.65,
              Math.min(maxDotR * 1.24, d.baseR * ringMod)
            )
          }
        }

        d.vx = (d.vx + (tx - d.x) * 0.22) * 0.75
        d.vy = (d.vy + (ty - d.y) * 0.22) * 0.75
        d.x += d.vx
        d.y += d.vy
        d.curR += (targetR - d.curR) * 0.25

        if (
          Math.abs(d.vx) > 0.02 ||
          Math.abs(d.vy) > 0.02 ||
          Math.abs(tx - d.x) > 0.04
        ) {
          stillMoving = true
        }

        const sdx = d.x - sunX
        const sdy = d.y - sunY
        const inSun = sdx * sdx + sdy * sdy <= sunRadius * sunRadius

        if (inSun) {
          if (d.tone === 0) {
            ctx.fillStyle = '#331109'
          } else if (d.tone === 1) {
            ctx.fillStyle = '#6e1e0d'
          } else if (d.tone === 2) {
            ctx.fillStyle = '#b9381c'
          } else {
            ctx.fillStyle = '#f5cab8'
          }
        } else if (isLight) {
          if (d.tone === 0) {
            ctx.fillStyle = '#141415'
          } else if (d.tone === 1) {
            ctx.fillStyle = '#4e4d49'
          } else if (d.tone === 2) {
            ctx.fillStyle = '#8b8982'
          } else {
            ctx.fillStyle = '#c9c7bf'
          }
        } else {
          if (d.tone === 0) {
            ctx.fillStyle = '#2d2d31'
          } else if (d.tone === 1) {
            ctx.fillStyle = '#636368'
          } else if (d.tone === 2) {
            ctx.fillStyle = '#a9a8a2'
          } else {
            ctx.fillStyle = '#efeee8'
          }
        }

        ctx.beginPath()
        ctx.arc(d.x, d.y, d.curR, 0, Math.PI * 2)
        ctx.fill()
      }

      // 3. Translucent Vermilion Sun Glaze over the upper hair/forehead (matching 3rd/4th image)
      ctx.beginPath()
      ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(217, 70, 37, 0.22)'
      ctx.fill()

      // 4. Thin Vermilion Cursor Lens Ring when hovering (matching 4th image)
      if (pointer.inside && !reduced) {
        ctx.beginPath()
        ctx.arc(pointer.x, pointer.y, 15, 0, Math.PI * 2)
        ctx.strokeStyle = 'rgba(217, 70, 37, 0.78)'
        ctx.lineWidth = 1.15
        ctx.stroke()
      }

      ctx.restore()

      if (stillMoving) {
        rafId = requestAnimationFrame(renderFrame)
      } else {
        rafId = 0
      }
    }

    const kick = () => {
      if (!rafId && !unmounted) {
        rafId = requestAnimationFrame(renderFrame)
      }
    }

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      if (unmounted) return
      buildDotsFromImage(img)
      renderFrame()
    }
    img.src = site.portrait || '/profile.webp'

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      const sx = W / rect.width
      const sy = H / rect.height
      const nx = (e.clientX - rect.left) * sx
      const ny = (e.clientY - rect.top) * sy
      if (!pointer.inside) {
        pointer.x = nx
        pointer.y = ny
      }
      pointer.targetX = nx
      pointer.targetY = ny
      pointer.inside = true
      kick()
    }

    const onLeave = () => {
      pointer.inside = false
      pointer.targetX = -9999
      pointer.targetY = -9999
      kick()
    }

    const mo = new MutationObserver(() => kick())
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    canvas.addEventListener('pointerdown', onMove)
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerenter', onMove)
    canvas.addEventListener('pointerleave', onLeave)

    return () => {
      unmounted = true
      if (rafId) cancelAnimationFrame(rafId)
      mo.disconnect()
      canvas.removeEventListener('pointerdown', onMove)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerenter', onMove)
      canvas.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <div className="halftone-stage" ref={wrapRef} data-cursor="LENS">
      <div className="halftone-canvas-wrap">
        <canvas
          ref={canvasRef}
          className={`halftone-canvas${loaded ? ' is-ready' : ''}`}
          aria-label={`Interactive halftone dot-matrix portrait of ${site.fullName}`}
          role="img"
        />
      </div>
      <div className="halftone-caption" aria-hidden="true">
        <span>[ FIG. 01 — {site.fullName.toUpperCase()} ]</span>
        <span>HALFTONE MATRIX // HOVER TO DISTORT</span>
      </div>
    </div>
  )
}
