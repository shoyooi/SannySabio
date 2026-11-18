import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import Clock from './Clock'
import {
  getTheme,
  goToSection,
  playUiSound,
  prefersReducedMotion,
  setTheme,
} from '../lib/motion'
import { projects, site } from '../data/portfolio'

/**
 * Hero section combining:
 * - Vexoo Frosted Bento Hub (top meta strip with interactive theme-toggle dot ● on the far right,
 *   giant backdrop wordmark refracting through frosted glass About & Portfolio cards, Contact card,
 *   monochrome studio Portrait tile, glowing 3-icon Tech Dock card, and Resume trigger card)
 * - Sandra Bamboo Carbon/Bone editorial typography & lime square period accent (#bccf3f).
 */
export default function Hero({ onOpenResume }) {
  const scope = useRef(null)
  const [imgFailed, setImgFailed] = useState(false)
  const [theme, setThemeState] = useState(() => getTheme())

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
      tl.from(
        '.vex-topbar > *',
        {
          opacity: 0,
          y: 10,
          duration: 0.6,
          stagger: 0.06,
        },
        0.04
      )
        .from(
          '.vex-backdrop-word',
          {
            yPercent: 45,
            opacity: 0,
            duration: 0.95,
          },
          0.08
        )
        .from(
          '.vex-card',
          {
            opacity: 0,
            y: 24,
            duration: 0.78,
            stagger: 0.06,
            clearProps: 'transform,opacity',
          },
          0.18
        )
    }, scope)
    return () => ctx.revert()
  }, [])

  const handleCardJump = (id) => {
    playUiSound('tick')
    goToSection(id)
  }

  const handleToggleTheme = (e) => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setThemeState(setTheme(next, { animate: true, event: e }))
  }

  const nextThemeLabel = theme === 'dark' ? 'light' : 'dark'

  return (
    <section id="top" className="lyn-hero vex-hero" ref={scope}>
      <div className="lyn-container vex-hero-inner">
        {/* Top Vexoo Editorial Meta Bar (Flush at Top, with Theme Toggle Dot on Far Right) */}
        <div className="vex-topbar lyn-telemetry">
          <span className="vex-meta-name">{site.fullName}</span>
          <span className="vex-meta-role">{site.role}</span>
          <span className="telemetry-coords" data-scramble>
            {site.coordinates}
          </span>
          <div className="vex-meta-right">
            <span className="telemetry-loc">Digos City</span>
            <span className="vex-meta-sep" aria-hidden="true">
              •
            </span>
            <Clock />
            <button
              type="button"
              className="vex-status-dot lyn-theme-toggle"
              onClick={handleToggleTheme}
              title={`Switch to ${nextThemeLabel} mode`}
              aria-label={`Switch to ${nextThemeLabel} mode`}
              data-cursor="RELIGHT"
            />
          </div>
        </div>

        {/* Frosted Bento Stage with Giant Refracted Backdrop Wordmark */}
        <div className="vex-stage">
          {/* Monumental Wordmark Positioned Behind Top Edge of Bento Row 1 */}
          <div className="vex-backdrop-title-wrap">
            <h1
              className="vex-backdrop-word lyn-wordmark"
              aria-label={`${site.fullName} — ${site.role}`}
            >
              <span>{site.fullName}</span>
              <span className="sb-lime-dot" aria-hidden="true" />
            </h1>
          </div>

          {/* 5-Region Vexoo Bento Grid */}
          <div className="vex-bento-grid">
            {/* 1. Top-Left: About Card */}
            <button
              type="button"
              className="vex-card vex-card-about"
              onClick={() => handleCardJump('about')}
              data-cursor="READ"
            >
              <div className="vex-card-eyebrow">
                <span className="sb-square-bullet" aria-hidden="true" />
                <span>(01) PROFILE</span>
              </div>
              <p className="vex-card-hint">
                BS Information Technology at Cor Jesu College · Full-stack,
                Web3 &amp; AR systems.
              </p>
              <div className="vex-card-foot">
                <span className="vex-card-label">About</span>
                <span className="vex-card-arrow" aria-hidden="true">
                  ↗
                </span>
              </div>
            </button>

            {/* 2. Top-Right: Wide Frosted Portfolio Card (Refracts Backdrop Wordmark) */}
            <div
              className="vex-card vex-card-portfolio"
              role="button"
              tabIndex={0}
              onClick={() => handleCardJump('projects')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleCardJump('projects')
                }
              }}
              data-cursor="VIEW"
            >
              <div className="vex-portfolio-chips">
                {projects.map((p, i) => (
                  <span key={p.id} className="vex-project-chip">
                    <em>{String(i + 1).padStart(2, '0')}</em> {p.title}
                  </span>
                ))}
              </div>

              <div className="vex-card-foot">
                <span className="vex-card-label">Portfolio</span>
                <span className="vex-card-arrow" aria-hidden="true">
                  ↗
                </span>
              </div>
            </div>

            {/* 3. Bottom-Left: Contact Card */}
            <button
              type="button"
              className="vex-card vex-card-contact"
              onClick={() => handleCardJump('contact')}
              data-cursor="WRITE"
            >
              <div className="vex-contact-top">
                <span className="vex-avail-pill">
                  <span className="status-dot" aria-hidden="true" />
                  {site.status}
                </span>
                <span className="vex-contact-email sb-email-obf">
                  <span>{site.emailUser}</span>
                  <i className="sb-at-guard" data-at="@" aria-hidden="true" />
                  <span>{site.emailDomain}</span>
                </span>
              </div>
              <div className="vex-card-foot">
                <span className="vex-card-label">Contact</span>
                <span className="vex-card-arrow" aria-hidden="true">
                  ↗
                </span>
              </div>
            </button>

            {/* 4. Bottom-Center: Studio Monochrome Portrait Card */}
            <button
              type="button"
              className="vex-card vex-card-portrait"
              onClick={() => handleCardJump('about')}
              aria-label={`About ${site.fullName}`}
              data-cursor="FIG 01"
            >
              {!imgFailed ? (
                <img
                  src={site.portrait || '/profile.webp'}
                  alt={`Portrait of ${site.fullName}`}
                  loading="eager"
                  decoding="async"
                  onError={() => setImgFailed(true)}
                />
              ) : (
                <span className="lanyard-fallback">{site.initial}</span>
              )}
            </button>

            {/* 5. Bottom-Right: Stacked Tools Dock + Resume Card */}
            <div className="vex-right-stack">
              {/* 5a. Tech Stack Squircle Dock */}
              <button
                type="button"
                className="vex-card vex-card-dock"
                onClick={() => handleCardJump('skills')}
                aria-label="View Skills & Tech Stack"
                data-cursor="STACK"
              >
                <div className="vex-dock-icons" aria-hidden="true">
                  <span
                    className="vex-app-icon vex-icon-blue"
                    title="React & Next.js"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M5 4h14v7h-7l7 7H12l-7-7V4zm0 11h7v5L5 15z" />
                    </svg>
                  </span>
                  <span
                    className="vex-app-icon vex-icon-multi"
                    title="Figma & UI Engineering"
                  >
                    <svg viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 3H8.5A3.5 3.5 0 0 0 8.5 10H12V3Z"
                        fill="#F24E1E"
                      />
                      <path
                        d="M12 3H15.5A3.5 3.5 0 1 1 15.5 10H12V3Z"
                        fill="#FF7262"
                      />
                      <path
                        d="M12 10H15.5A3.5 3.5 0 1 1 12 13.5V10Z"
                        fill="#1ABCFE"
                      />
                      <path
                        d="M12 10H8.5A3.5 3.5 0 0 0 8.5 17H12V10Z"
                        fill="#A259FF"
                      />
                      <path
                        d="M8.5 17A3.5 3.5 0 1 0 12 20.5V17H8.5Z"
                        fill="#0ACF83"
                      />
                    </svg>
                  </span>
                  <span
                    className="vex-app-icon vex-icon-warm"
                    title="Laravel, Electron & Web3"
                  >
                    <svg viewBox="0 0 24 24" fill="none">
                      <defs>
                        <linearGradient
                          id="vexWarmGrad"
                          x1="0"
                          y1="0"
                          x2="1"
                          y2="1"
                        >
                          <stop offset="0%" stopColor="#FF7A45" />
                          <stop offset="55%" stopColor="#FF3D77" />
                          <stop offset="100%" stopColor="#8A3FFC" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M8 5a4 4 0 0 1 4 4v2h3a4 4 0 1 1 0 8H8a4 4 0 0 1-4-4V9a4 4 0 0 1 4-4z"
                        fill="url(#vexWarmGrad)"
                      />
                    </svg>
                  </span>
                </div>
              </button>

              {/* 5b. Resume Trigger Card */}
              <button
                type="button"
                className="vex-card vex-card-resume"
                onClick={() => {
                  playUiSound('open')
                  onOpenResume?.()
                }}
                data-cursor="CV"
              >
                <div className="vex-card-foot">
                  <span className="vex-card-label">Resume</span>
                  <span className="vex-card-arrow" aria-hidden="true">
                    ↗
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Editorial Positioning Bar */}
        <div className="lyn-hero-bottom">
          <p className="lyn-hero-tagline">
            From useful campus platforms to{' '}
            <strong>expressive full-stack &amp; Web3 systems</strong>
            <span className="sb-lime-dot is-inline" aria-hidden="true" />
          </p>

          <p className="lyn-hero-role">{site.role}</p>

          <button
            type="button"
            className="lyn-scroll-btn"
            data-magnetic
            onClick={() => handleCardJump('about')}
          >
            <span>SCROLL</span>
            <span className="scroll-line" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  )
}
