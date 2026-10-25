import { useState } from 'react'
import { site } from '../data/portfolio'

// Shows /profile.jpg, falling back to an initial if the file isn't there.
export default function Portrait({ className }) {
  const [failed, setFailed] = useState(false)

  return (
    <div className={`portrait ${className || ''}`}>
      {failed ? (
        <span className="portrait-fallback" aria-hidden="true">
          {site.initial}
        </span>
      ) : (
        <img
          src="/profile.jpg"
          alt={`Portrait of ${site.name}`}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  )
}
