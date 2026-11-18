/**
 * Intentional editorial architectural preview for projects that do not yet have
 * an uploaded screenshot image.
 */
export default function ProjectFallbackCard({ project }) {
  const stackLine = project.stack?.slice(0, 3).join(' · ') || project.category || 'System Build'

  return (
    <div className="stage-img-fallback">
      <span className="fallback-eyebrow">{project.category || 'System'}</span>
      <strong className="fallback-title">{project.title}</strong>
      <span className="fallback-stack">{stackLine}</span>
    </div>
  )
}
