import { useState } from 'react'

export default function ProjectCard({ project, index }) {
  const [imgFailed, setImgFailed] = useState(false)
  const { title, status, description, stack, image, bg, github, demo } = project
  const showImage = image && !imgFailed
  const num = String(index + 1).padStart(2, '0')

  return (
    <article className="project-card" data-reveal>
      <p className="project-meta">
        <span>{num}</span>
        <span>{status}</span>
      </p>
      <div
        className={`project-cover${showImage ? '' : ' is-empty'}`}
        style={showImage && bg ? { background: bg } : undefined}
      >
        {showImage && (
          <img
            src={image}
            alt={`Screenshot of ${title}`}
            loading="lazy"
            onError={() => setImgFailed(true)}
          />
        )}
      </div>
      <h3 className="project-title">{title}</h3>
      <p className="project-desc">{description}</p>
      <ul className="project-stack" aria-label="Tech used">
        {stack.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
      {(github || demo) && (
        <div className="project-links">
          {github && (
            <a href={github} target="_blank" rel="noreferrer">GitHub ↗</a>
          )}
          {demo && (
            <a href={demo} target="_blank" rel="noreferrer">Live demo ↗</a>
          )}
        </div>
      )}
    </article>
  )
}