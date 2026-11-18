import { useEffect, useRef, useState } from 'react'
import Footer from './Footer'
import { site } from '../data/portfolio'

const INITIAL_FORM = {
  name: '',
  email: '',
  subject: '',
  message: '',
  website: '', // Honeypot trap field — must remain empty
}

const RATE_STORAGE_KEY = 'sanny-contact-log-v1'
const RATE_WINDOW_MS = 10 * 60 * 1000 // 10 minutes
const COOLDOWN_MS = 60 * 1000 // 60s cooldown between submissions
const MAX_PER_WINDOW = 3
const MIN_FILL_MS = 2200
const EMAIL_RE = /^[^\s@\r\n<>]+@[^\s@\r\n<>]+\.[^\s@\r\n<>]{2,}$/

function sanitizeSingleLine(str, maxLen) {
  if (typeof str !== 'string') return ''
  return str
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLen)
}

function sanitizeInput(str, maxLen) {
  if (typeof str !== 'string') return ''
  return str
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, maxLen)
}

function countLinks(str) {
  const m = str.match(/https?:\/\/|www\.|\.[a-z]{2,4}\//gi)
  return m ? m.length : 0
}

function checkClientRateLimit() {
  try {
    const now = Date.now()
    const raw = window.localStorage.getItem(RATE_STORAGE_KEY)
    const history = Array.isArray(raw ? JSON.parse(raw) : null)
      ? JSON.parse(raw).filter(
          (ts) => typeof ts === 'number' && now - ts < RATE_WINDOW_MS
        )
      : []

    if (history.length > 0) {
      const last = history[history.length - 1]
      if (now - last < COOLDOWN_MS) {
        const waitSec = Math.ceil((COOLDOWN_MS - (now - last)) / 1000)
        return {
          allowed: false,
          reason: `RATE LIMIT: PLEASE WAIT ${waitSec}S BEFORE SENDING ANOTHER MESSAGE.`,
        }
      }
    }

    if (history.length >= MAX_PER_WINDOW) {
      return {
        allowed: false,
        reason:
          'RATE LIMIT EXCEEDED (MAX 3 MESSAGES / 10 MIN). EMAIL DIRECTLY INSTEAD.',
      }
    }

    return { allowed: true, history }
  } catch {
    return { allowed: true, history: [] }
  }
}

function recordClientSubmission(history = []) {
  try {
    const next = [...history, Date.now()].slice(-MAX_PER_WINDOW)
    window.localStorage.setItem(RATE_STORAGE_KEY, JSON.stringify(next))
  } catch {
    // ignore storage errors
  }
}

/**
 * (06) CONTACT section:
 * Hardened against bot spam, multi-instance serverless cold starts, email harvesters,
 * CSRF, CRLF header injection, XSS injection, and link-flooding via:
 * 1. Stateless HMAC-SHA256 challenge token fetched from GET /api/contact + human interaction tick proof
 * 2. Anti-scraper DOM email obfuscation (CSS data-at guard + runtime assembly on click)
 * 3. Hidden Honeypot trap field (website) + 2.2s minimum human dwell-time gate
 * 4. Distributed Upstash Redis / Vercel KV + client/IP rate limiting + 60s cooldown
 * 5. CRLF single-line sanitization, HTML tag stripping, and URL flood rejection.
 */
export default function Contact() {
  const [copied, setCopied] = useState(false)
  const [form, setForm] = useState(INITIAL_FORM)
  const [status, setStatus] = useState({ type: 'idle', text: '' })
  const [challengeToken, setChallengeToken] = useState('')
  const timerRef = useRef(null)
  const mountTimeRef = useRef(Date.now())
  const interactionTicksRef = useRef(0)

  const tokenRequestedRef = useRef(false)

  const refreshChallenge = async (force = false) => {
    if (tokenRequestedRef.current && !force) return
    tokenRequestedRef.current = true
    try {
      const res = await fetch('/api/contact', {
        method: 'GET',
        headers: { Accept: 'application/json' },
      })
      if (res.ok) {
        const ct = res.headers.get('content-type') || ''
        if (ct.includes('application/json')) {
          const data = await res.json()
          if (data?.challengeToken) {
            setChallengeToken(data.challengeToken)
          }
        }
      }
    } catch {
      // Static preview without serverless host — handled gracefully on submit
    }
  }

  useEffect(() => {
    mountTimeRef.current = Date.now()
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const registerHumanInteraction = () => {
    interactionTicksRef.current = Math.min(999, interactionTicksRef.current + 1)
    refreshChallenge(false)
  }

  const socials = [
    site.github && { label: 'GITHUB (@SHOYOOI)', href: site.github },
    {
      label: 'CJC EDTECH (PRIVATE ORG REPO 🔒)',
      href: 'https://github.com/EDTECH-CJC/Edtech',
    },
    { label: 'CHAINBUDGET LIVE', href: 'https://chainbudget.vercel.app/' },
    site.linkedin && { label: 'LINKEDIN', href: site.linkedin },
    site.instagram && { label: 'INSTAGRAM', href: site.instagram },
  ].filter(Boolean)

  const handleCopy = async () => {
    const addr = site.email
    if (!addr) return
    try {
      await navigator.clipboard.writeText(addr)
      setCopied(true)
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setCopied(false), 2600)
    } catch {
      window.location.href = `mailto:${addr}`
    }
  }

  const updateField = (field) => (e) => {
    registerHumanInteraction()
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // 1. Honeypot trap check
    if (form.website && form.website.trim() !== '') {
      setForm(INITIAL_FORM)
      setStatus({ type: 'success', text: 'MESSAGE RECEIVED — THANK YOU.' })
      return
    }

    // 2. Minimum human fill-time & interaction check
    const elapsedMs = Date.now() - mountTimeRef.current
    if (elapsedMs < MIN_FILL_MS || interactionTicksRef.current < 2) {
      setStatus({
        type: 'error',
        text: 'ANTI-BOT GATE: SUBMITTED TOO QUICKLY. PLEASE TYPE YOUR MESSAGE & RETRY.',
      })
      return
    }

    // 3. Client Rate Limit & 60s Cooldown check
    const rate = checkClientRateLimit()
    if (!rate.allowed) {
      setStatus({ type: 'error', text: rate.reason })
      return
    }

    // 4. Input Sanitization & Spam Validation (CRLF-safe single-line for header fields)
    const name = sanitizeSingleLine(form.name, 80)
    const email = sanitizeSingleLine(form.email, 120)
    const subject =
      sanitizeSingleLine(form.subject, 140) || `Portfolio inquiry from ${name}`
    const message = sanitizeInput(form.message, 2000)

    if (name.length < 2) {
      setStatus({
        type: 'error',
        text: 'PLEASE ENTER A VALID NAME (MIN 2 CHARS).',
      })
      return
    }
    if (!EMAIL_RE.test(email)) {
      setStatus({ type: 'error', text: 'PLEASE ENTER A VALID EMAIL ADDRESS.' })
      return
    }
    if (message.length < 10) {
      setStatus({
        type: 'error',
        text: 'PLEASE ENTER A MESSAGE OF AT LEAST 10 CHARACTERS.',
      })
      return
    }
    if (countLinks(message) > 3) {
      setStatus({
        type: 'error',
        text: 'SPAM FILTER: TOO MANY URLS IN MESSAGE (MAX 3 LINKS ALLOWED).',
      })
      return
    }

    setStatus({ type: 'sending', text: 'VERIFYING & SENDING SECURELY...' })

    // 5. Try configured endpoint or Vercel Serverless /api/contact with HMAC token
    const endpoint = site.formEndpoint || '/api/contact'
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
          website: form.website,
          elapsedMs,
          interactionTicks: interactionTicksRef.current,
          challengeToken,
        }),
      })

      const data = await res.json().catch(() => ({}))

      if (res.status === 429 || res.status === 400 || res.status === 403) {
        setStatus({
          type: 'error',
          text: (data.error || 'SECURITY CHECK FAILED.').toUpperCase(),
        })
        refreshChallenge()
        return
      }

      if (res.ok && data.ok && !data.fallback) {
        recordClientSubmission(rate.history)
        setForm(INITIAL_FORM)
        mountTimeRef.current = Date.now()
        interactionTicksRef.current = 0
        refreshChallenge()
        setStatus({
          type: 'success',
          text: 'MESSAGE SENT SECURELY — THANK YOU!',
        })
        return
      }
    } catch {
      // Fall through to verified mailto + clipboard delivery if serverless relay isn't active
    }

    // 6. Verified Fallback Delivery (Sanitized Mailto + Clipboard Backup)
    recordClientSubmission(rate.history)
    const addr = site.email
    const body = `Hi ${site.name},\n\n${message}\n\n— ${name} (${email})`
    try {
      await navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`)
    } catch {
      // ignore clipboard error
    }
    const mailto = `mailto:${addr}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = mailto
    setForm(INITIAL_FORM)
    mountTimeRef.current = Date.now()
    interactionTicksRef.current = 0
    refreshChallenge()
    setStatus({
      type: 'success',
      text: 'VERIFIED — OPENING MAIL APP (& COPIED BACKUP TO CLIPBOARD).',
    })
  }

  return (
    <section id="contact" className="lyn-section lyn-contact-section">
      {/* Subtle Dotted World Map & Connection Arcs SVG */}
      <svg
        className="contact-world-map"
        viewBox="0 0 1200 560"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="world-dots"
            width="18"
            height="18"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="3" cy="3" r="1.5" fill="currentColor" opacity="0.24" />
          </pattern>
        </defs>
        <ellipse cx="260" cy="210" rx="145" ry="95" fill="url(#world-dots)" />
        <ellipse cx="350" cy="390" rx="85" ry="110" fill="url(#world-dots)" />
        <ellipse cx="610" cy="195" rx="110" ry="75" fill="url(#world-dots)" />
        <ellipse cx="630" cy="340" rx="95" ry="105" fill="url(#world-dots)" />
        <ellipse cx="890" cy="220" rx="190" ry="115" fill="url(#world-dots)" />
        <ellipse cx="990" cy="415" rx="85" ry="58" fill="url(#world-dots)" />
        <path
          d="M 270 215 Q 610 45 945 285"
          stroke="currentColor"
          strokeOpacity="0.22"
          strokeWidth="1.25"
          strokeDasharray="5 6"
        />
        <path
          d="M 615 190 Q 790 120 945 285"
          stroke="currentColor"
          strokeOpacity="0.22"
          strokeWidth="1.25"
          strokeDasharray="5 6"
        />
        <path
          d="M 945 285 Q 995 350 1005 415"
          stroke="currentColor"
          strokeOpacity="0.25"
          strokeWidth="1.25"
          strokeDasharray="4 5"
        />
        <circle cx="945" cy="285" r="4" fill="currentColor" opacity="0.65" />
        <circle
          cx="945"
          cy="285"
          r="11"
          stroke="currentColor"
          strokeOpacity="0.28"
        />
      </svg>

      <div className="lyn-container">
        <div className="lyn-sec-bar" data-reveal>
          <span className="lyn-sec-num">(06)</span>
          <h2 className="lyn-sec-label">CONTACT</h2>
          <span className="lyn-sec-rule" aria-hidden="true" />
        </div>

        <div className="lyn-contact-grid">
          {/* Left Column: Headline, Anti-Scraper Copyable Email, Socials */}
          <div className="lyn-contact-left">
            <h3 className="lyn-contact-title" data-reveal>
              Let's work
              <br />
              <em>together</em>
              <span className="sb-lime-dot is-inline" aria-hidden="true" />
            </h3>

            {site.emailUser && (
              <div className="lyn-direct-email" data-reveal>
                <span className="direct-email-label">DIRECT EMAIL</span>
                <button
                  type="button"
                  className="direct-email-btn"
                  onClick={handleCopy}
                  data-cursor="COPY"
                  aria-label="Copy direct email address to clipboard"
                >
                  <span className="direct-email-addr sb-email-obf">
                    <span>{site.emailUser}</span>
                    <i
                      className="sb-at-guard"
                      data-at="@"
                      aria-hidden="true"
                    />
                    <span>{site.emailDomain}</span>
                  </span>
                  <span className="direct-email-hint" aria-live="polite">
                    {copied ? 'COPIED TO CLIPBOARD ✓' : 'CLICK TO COPY'}
                  </span>
                </button>
              </div>
            )}

            <ul className="lyn-social-rows" data-reveal>
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>{s.label}</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column: Hardened 4-Field Contact Form Card */}
          <form
            className="lyn-contact-card"
            onSubmit={handleSubmit}
            onPointerDown={registerHumanInteraction}
            onKeyDown={registerHumanInteraction}
            noValidate={false}
            data-reveal
          >
            {/* Hidden Honeypot Anti-Bot Field */}
            <div className="lyn-hp-trap" aria-hidden="true">
              <label>
                Leave this field empty
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={updateField('website')}
                />
              </label>
            </div>

            <div className="lyn-form-row-2">
              <label className="lyn-field">
                <span>(01) YOUR NAME *</span>
                <input
                  type="text"
                  name="name"
                  required
                  minLength={2}
                  maxLength={80}
                  autoComplete="name"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={updateField('name')}
                />
              </label>

              <label className="lyn-field">
                <span>(02) YOUR EMAIL *</span>
                <input
                  type="email"
                  name="email"
                  required
                  maxLength={120}
                  autoComplete="email"
                  placeholder="john@example.com"
                  value={form.email}
                  onChange={updateField('email')}
                />
              </label>
            </div>

            <label className="lyn-field">
              <span>(03) SUBJECT</span>
              <input
                type="text"
                name="subject"
                maxLength={140}
                placeholder="Project inquiry, collaboration, etc."
                value={form.subject}
                onChange={updateField('subject')}
              />
            </label>

            <label className="lyn-field">
              <span>(04) MESSAGE *</span>
              <textarea
                name="message"
                rows={4}
                required
                minLength={10}
                maxLength={2000}
                placeholder="Tell me about your project, timeline, or idea..."
                value={form.message}
                onChange={updateField('message')}
              />
            </label>

            <div className="lyn-form-foot">
              <div className="lyn-form-meta">
                <span className="lyn-form-note" aria-live="polite">
                  {status.text || 'FIELDS MARKED WITH * ARE REQUIRED'}
                </span>
                <span className="lyn-security-badge">
                  <i aria-hidden="true" />
                  PROTECTED BY HMAC TOKEN · HONEYPOT · RATE-LIMIT · XSS/CRLF FILTER
                </span>
              </div>

              <button
                type="submit"
                className="lyn-send-btn"
                disabled={status.type === 'sending'}
                data-cursor="SEND"
              >
                <span>
                  {status.type === 'sending' ? 'SENDING...' : 'SEND MESSAGE'}
                </span>
                <span aria-hidden="true">✉</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </section>
  )
}
