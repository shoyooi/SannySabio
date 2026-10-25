import { useState } from 'react'

export default function ProjectCard({ project, index }) {
  const [imgFailed, setImgFailed] = useState(false)
  const { title, status, description, stack, image, github, demo } = project
  const showImage = image && !imgFailed

  return (
    <article className="project-card">
      <div className="project-cover">
        {showImage ? (
          <img
            src={image}
            alt={`Screenshot of ${title}`}
            loading="lazy"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <span className="project-cover-fallback" aria-hidden="true">
            {String(index + 1).padStart(2, '0')}
          </span>
        )}
      </div>
      <div className="project-body">
        <p className="project-status">{status}</p>
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
              <a href={github} target="_blank" rel="noreferrer">
                GitHub ↗
              </a>
            )}
            {demo && (
              <a href={demo} target="_blank" rel="noreferrer">
                Live demo ↗
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  )
}
