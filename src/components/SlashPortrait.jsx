import { useState } from 'react'
import { site } from '../data/portfolio'

// The portrait is drawn twice, cut along a diagonal. When the Intro panel
// comes into view the two halves slide in from opposite corners and meet,
// then a thin accent line flashes along the cut (see .slash-* in index.css).
export default function SlashPortrait({ className = '' }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className={`portrait ${className}`}>
        <span className="portrait-fallback" aria-hidden="true">{site.initial}</span>
      </div>
    )
  }

  return (
    <div className={`portrait slash ${className}`} role="img" aria-label={`Portrait of ${site.name}`}>
      <img
        className="slash-piece slash-a"
        src="/profile.jpg"
        alt=""
        draggable="false"
        onError={() => setFailed(true)}
      />
      <img className="slash-piece slash-b" src="/profile.jpg" alt="" draggable="false" />
      <span className="slash-line" aria-hidden="true" />
    </div>
  )
}
