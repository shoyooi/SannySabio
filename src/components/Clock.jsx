import { useEffect, useState } from 'react'
import { site } from '../data/portfolio'

function formatTime() {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: site.timezone,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date())
}

// Live local time for the city I'm based in.
export default function Clock() {
  const [time, setTime] = useState(formatTime)

  useEffect(() => {
    const id = setInterval(() => setTime(formatTime()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <p className="hero-meta">
      <span className="live-dot" aria-hidden="true" />
      <span>
        {site.location.split(',')[0]} · <time>{time}</time> local time
      </span>
    </p>
  )
}
