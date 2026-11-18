import { useEffect, useState } from 'react'
import { site } from '../data/portfolio'

function readClock() {
  const now = new Date()
  let time = new Intl.DateTimeFormat('en-GB', {
    timeZone: site.timezone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(now)
  if (time.startsWith('24:')) time = `00:${time.slice(3)}`
  const offset =
    new Intl.DateTimeFormat('en-US', {
      timeZone: site.timezone,
      timeZoneName: 'shortOffset',
    })
      .formatToParts(now)
      .find((p) => p.type === 'timeZoneName')?.value ?? 'GMT+8'
  return `${time} ${offset}`
}

export default function Clock() {
  const [value, setValue] = useState(readClock)

  useEffect(() => {
    const id = setInterval(() => setValue(readClock()), 15000)
    return () => clearInterval(id)
  }, [])

  return <time className="telemetry-time">{value}</time>
}
