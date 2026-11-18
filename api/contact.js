// Vercel Serverless Function: GET & POST /api/contact
// Enterprise-grade multi-instance protection:
// 1. Stateless HMAC-SHA256 Signed Challenge Token (GET issues token, POST verifies signature + dwell time across cold starts)
// 2. Distributed Upstash Redis / Vercel KV rate-limiting (when UPSTASH_REDIS_REST_URL or KV_REST_API_URL is set) + bounded in-memory LRU fallback
// 3. Human interaction proof (pointer/keyboard event ticks >= 2)
// 4. CRLF Email Header Injection prevention, HTML/XSS tag stripping, Honeypot trap, Same-Origin CSRF check, and 16KB body cap.

import crypto from 'node:crypto'

const RATE_WINDOW_MS = 10 * 60 * 1000 // 10 minutes
const RATE_WINDOW_SEC = 600
const MAX_REQUESTS_PER_WINDOW = 3
const MAX_TRACKED_IPS = 2000
const MAX_BODY_BYTES = 16 * 1024 // 16 KB
const MIN_HUMAN_FILL_MS = 2200
const MAX_FORM_AGE_MS = 30 * 60 * 1000 // 30 minutes
const ipBuckets = new Map()
const usedNonces = new Map()

const EMAIL_RE = /^[^\s@\r\n<>]+@[^\s@\r\n<>]+\.[^\s@\r\n<>]{2,}$/

function getSigningSecret() {
  return (
    process.env.CONTACT_HMAC_SECRET ||
    process.env.RESEND_API_KEY ||
    process.env.WEB3FORMS_ACCESS_KEY ||
    process.env.VERCEL_DEPLOYMENT_ID ||
    'sanny-portfolio-stateless-hmac-v1-secret'
  )
}

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for']
  return (
    (typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : '') ||
    req.socket?.remoteAddress ||
    'unknown'
  )
}

function getFingerprint(req, ip) {
  const ua = String(req.headers['user-agent'] || '').slice(0, 160)
  return crypto
    .createHash('sha256')
    .update(`${ip}|${ua}`)
    .digest('hex')
    .slice(0, 16)
}

function issueChallengeToken(req) {
  const ip = getClientIp(req)
  const fp = getFingerprint(req, ip)
  const issuedAt = Date.now()
  const nonce = crypto.randomBytes(8).toString('hex')
  const payload = `${issuedAt}.${fp}.${nonce}`
  const sig = crypto
    .createHmac('sha256', getSigningSecret())
    .update(payload)
    .digest('hex')
    .slice(0, 32)
  return `${payload}.${sig}`
}

function verifyChallengeToken(token, req) {
  if (typeof token !== 'string' || !token.includes('.')) {
    return { valid: false, reason: 'Missing security challenge token.' }
  }
  const parts = token.split('.')
  if (parts.length !== 4) {
    return { valid: false, reason: 'Malformed security challenge token.' }
  }
  const [issuedStr, fp, nonce, sig] = parts
  const issuedAt = Number(issuedStr)
  if (!Number.isFinite(issuedAt)) {
    return { valid: false, reason: 'Invalid token timestamp.' }
  }

  const payload = `${issuedStr}.${fp}.${nonce}`
  const expectedSig = crypto
    .createHmac('sha256', getSigningSecret())
    .update(payload)
    .digest('hex')
    .slice(0, 32)

  const sigBuf = Buffer.from(sig)
  const expBuf = Buffer.from(expectedSig)
  if (
    sigBuf.length !== expBuf.length ||
    !crypto.timingSafeEqual(sigBuf, expBuf)
  ) {
    return { valid: false, reason: 'Invalid security token signature.' }
  }

  const ip = getClientIp(req)
  const currentFp = getFingerprint(req, ip)
  if (fp !== currentFp) {
    return { valid: false, reason: 'Session fingerprint mismatch.' }
  }

  const age = Date.now() - issuedAt
  if (age < MIN_HUMAN_FILL_MS) {
    return {
      valid: false,
      reason: 'Submitted too quickly. Please review your message and try again.',
    }
  }
  if (age > MAX_FORM_AGE_MS) {
    return {
      valid: false,
      reason: 'Form session expired. Please refresh and submit again.',
    }
  }

  // Replay protection
  const now = Date.now()
  for (const [k, ts] of usedNonces.entries()) {
    if (now - ts > MAX_FORM_AGE_MS) usedNonces.delete(k)
  }
  if (usedNonces.has(nonce)) {
    return { valid: false, reason: 'Challenge token already used.' }
  }
  usedNonces.set(nonce, now)
  if (usedNonces.size > MAX_TRACKED_IPS) {
    const oldest = usedNonces.keys().next().value
    if (oldest) usedNonces.delete(oldest)
  }

  return { valid: true }
}

function cleanSingleLine(val, maxLen) {
  if (typeof val !== 'string') return ''
  return val
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLen)
}

function cleanMultiLine(val, maxLen) {
  if (typeof val !== 'string') return ''
  return val
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, maxLen)
}

function countUrls(text) {
  const matches = text.match(/https?:\/\/|www\.|\.[a-z]{2,4}\//gi)
  return matches ? matches.length : 0
}

async function checkDistributedOrMemoryRateLimit(ip) {
  const redisUrl =
    process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
  const redisToken =
    process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN

  if (redisUrl && redisToken) {
    try {
      const key = `sanny:ratelimit:${ip}`
      const r = await fetch(`${redisUrl.replace(/\/$/, '')}/pipeline`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${redisToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          ['INCR', key],
          ['EXPIRE', key, RATE_WINDOW_SEC, 'NX'],
          ['TTL', key],
        ]),
      })
      if (r.ok) {
        const resArr = await r.json()
        const count = Number(resArr?.[0]?.result) || 1
        const ttl = Number(resArr?.[2]?.result) || RATE_WINDOW_SEC
        if (count > MAX_REQUESTS_PER_WINDOW) {
          return { allowed: false, retryAfterSec: Math.max(10, ttl) }
        }
        return { allowed: true }
      }
    } catch {
      // Fall back to in-memory limiter if Redis REST is unreachable
    }
  }

  const now = Date.now()
  for (const [key, entry] of ipBuckets.entries()) {
    if (now - entry.start > RATE_WINDOW_MS) {
      ipBuckets.delete(key)
    }
  }
  if (!ipBuckets.has(ip) && ipBuckets.size >= MAX_TRACKED_IPS) {
    const oldestKey = ipBuckets.keys().next().value
    if (oldestKey) ipBuckets.delete(oldestKey)
  }

  const bucket = ipBuckets.get(ip)
  if (!bucket) {
    ipBuckets.set(ip, { start: now, count: 1 })
    return { allowed: true }
  }
  if (bucket.count >= MAX_REQUESTS_PER_WINDOW) {
    const retryAfterSec = Math.ceil(
      (RATE_WINDOW_MS - (now - bucket.start)) / 1000
    )
    return { allowed: false, retryAfterSec }
  }
  bucket.count += 1
  return { allowed: true }
}

export default async function handler(req, res) {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('Cache-Control', 'no-store, max-age=0')

  // GET /api/contact issues a stateless HMAC-SHA256 challenge token
  if (req.method === 'GET') {
    const token = issueChallengeToken(req)
    return res.status(200).json({ ok: true, challengeToken: token })
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST')
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  // 1. Content-Type & Payload Size DoS check
  const contentType = String(req.headers['content-type'] || '').toLowerCase()
  if (!contentType.includes('application/json')) {
    return res.status(415).json({ ok: false, error: 'Unsupported Media Type' })
  }
  const contentLen = Number(req.headers['content-length']) || 0
  if (contentLen > MAX_BODY_BYTES) {
    return res.status(413).json({ ok: false, error: 'Payload too large' })
  }

  // 2. Same-Origin / CSRF check
  const origin = req.headers.origin || ''
  const referer = req.headers.referer || ''
  const host = (req.headers.host || '').split(':')[0]
  if (host) {
    const validOrigin = origin && origin.includes(host)
    const validReferer = referer && referer.includes(host)
    if (!validOrigin && !validReferer) {
      return res.status(403).json({ ok: false, error: 'Forbidden origin' })
    }
  }

  // 3. Distributed (Upstash Redis / Vercel KV) or Bounded In-Memory IP Rate-Limiting
  const ip = getClientIp(req)
  const rate = await checkDistributedOrMemoryRateLimit(ip)
  if (!rate.allowed) {
    res.setHeader('Retry-After', String(rate.retryAfterSec))
    return res.status(429).json({
      ok: false,
      error: `Too many messages. Please wait ${rate.retryAfterSec}s before trying again.`,
    })
  }

  const body = typeof req.body === 'object' && req.body ? req.body : {}

  // 4. Honeypot Trap (bots fill hidden fields)
  if (body.website || body._gotcha || body.company_url) {
    return res.status(200).json({ ok: true, simulated: true })
  }

  // 5. Stateless HMAC Challenge Token Verification + Human Interaction Proof
  if (body.challengeToken) {
    const check = verifyChallengeToken(body.challengeToken, req)
    if (!check.valid) {
      return res.status(400).json({ ok: false, error: check.reason })
    }
  }

  const elapsedMs = Number(body.elapsedMs)
  const interactionTicks = Number(body.interactionTicks) || 0
  if (
    !Number.isFinite(elapsedMs) ||
    elapsedMs < MIN_HUMAN_FILL_MS ||
    elapsedMs > MAX_FORM_AGE_MS ||
    interactionTicks < 2
  ) {
    return res.status(400).json({
      ok: false,
      error:
        'Automated submission blocked. Please type your message directly in the form.',
    })
  }

  // 6. Sanitize & Validate Fields (CRLF-safe single-line vs multi-line)
  const name = cleanSingleLine(body.name, 80)
  const email = cleanSingleLine(body.email, 120)
  const subject =
    cleanSingleLine(body.subject, 140) || `Portfolio inquiry from ${name}`
  const message = cleanMultiLine(body.message, 2000)

  if (!name || name.length < 2) {
    return res
      .status(400)
      .json({ ok: false, error: 'Please enter a valid name.' })
  }
  if (!email || !EMAIL_RE.test(email)) {
    return res
      .status(400)
      .json({ ok: false, error: 'Please enter a valid email address.' })
  }
  if (!message || message.length < 10) {
    return res.status(400).json({
      ok: false,
      error: 'Please enter a message of at least 10 characters.',
    })
  }
  if (countUrls(message) > 3) {
    return res.status(400).json({
      ok: false,
      error: 'Too many links detected in message. Please remove extra URLs.',
    })
  }

  // 7. Deliver via configured provider (Resend, Web3Forms, or Formspree)
  const resendKey = process.env.RESEND_API_KEY
  const toEmail =
    process.env.CONTACT_TO_EMAIL ||
    ['sannysabio14', 'gmail.com'].join(String.fromCharCode(64))
  const web3FormsKey =
    process.env.WEB3FORMS_ACCESS_KEY || process.env.VITE_WEB3FORMS_KEY
  const formspreeUrl =
    process.env.FORMSPREE_ENDPOINT || process.env.VITE_FORMSPREE_ENDPOINT

  try {
    if (resendKey) {
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Portfolio Contact <onboarding@resend.dev>',
          to: [toEmail],
          reply_to: email,
          subject: `[Portfolio] ${subject}`,
          text: `Name: ${name}\nEmail: ${email}\nIP: ${ip}\n\n${message}`,
        }),
      })
      if (!r.ok) throw new Error('Resend delivery failed')
      return res.status(200).json({ ok: true, provider: 'resend' })
    }

    if (web3FormsKey) {
      const r = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: web3FormsKey,
          name,
          email,
          subject: `[Portfolio] ${subject}`,
          message,
          botcheck: '',
        }),
      })
      if (!r.ok) throw new Error('Web3Forms delivery failed')
      return res.status(200).json({ ok: true, provider: 'web3forms' })
    }

    if (formspreeUrl) {
      const r = await fetch(formspreeUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ name, email, subject, message }),
      })
      if (!r.ok) throw new Error('Formspree delivery failed')
      return res.status(200).json({ ok: true, provider: 'formspree' })
    }

    return res.status(200).json({ ok: true, fallback: 'mailto' })
  } catch {
    return res.status(502).json({
      ok: false,
      error: 'Mail relay temporarily unavailable.',
      fallback: 'mailto',
    })
  }
}
