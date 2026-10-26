import { useEffect, useState } from 'react'
import { site } from '../data/portfolio'

function read() {
  const now = new Date()
  const time = new Intl.DateTimeFormat('en-GB', {
    timeZone: site.timezone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(now)
  const offset =
    new Intl.DateTimeFormat('en-US', { timeZone: site.timezone, timeZoneName: 'shortOffset' })
      .formatToParts(now)
      .find((p) => p.type === 'timeZoneName')?.value ?? ''
  return { time, offset }
}

// Location plus live local time, e.g. "(GMT+8) 09:51".
export default function Clock() {
  const [{ time, offset }, setNow] = useState(read)

  useEffect(() => {
    const id = setInterval(() => setNow(read()), 15000)
    return () => clearInterval(id)
  }, [])

  return (
    <p className="hero-meta">
      <span>{site.location}</span>
      <span>
        ({offset}) <time>{time}</time>
      </span>
    </p>
  )
}
