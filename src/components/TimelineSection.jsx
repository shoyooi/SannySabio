import { timeline } from '../data/portfolio'

/**
 * (05) EXPERIENCE & EDUCATION section:
 * - Equipped with Sandra Bamboo's scroll-triggered surface relighting ([data-relight]),
 *   smoothly cross-fading between Carbon (#121213) and Warm Bone (#ebe9e3) as it enters view
 * - Sibling row focus dimming on hover + cipher-decode period labels (2023 — PRESENT).
 */
export default function TimelineSection() {
  return (
    <section
      id="experience"
      className="lyn-section sb-relight-section"
      data-relight="contrast"
      data-shown="base"
    >
      <div className="lyn-container">
        <div className="lyn-sec-bar" data-reveal>
          <span className="lyn-sec-num">(05)</span>
          <h2 className="lyn-sec-label">EXPERIENCE &amp; EDUCATION</h2>
          <span className="lyn-sec-rule" aria-hidden="true" />
        </div>

        <div className="lyn-exp-header" data-reveal>
          <p className="sb-eyebrow">METHOD &amp; CREDENTIALS</p>
          <h3 className="sb-relight-heading">
            Depth turns into decisions
            <span className="sb-lime-dot is-inline" aria-hidden="true" />
          </h3>
        </div>

        <div className="lyn-exp-list sb-focus-list">
          {timeline.map((entry) => (
            <article
              className="lyn-exp-row"
              key={`${entry.period}-${entry.role}`}
              data-reveal
              data-cursor="READ"
            >
              <div className="lyn-exp-when">
                <span className="exp-period" data-scramble>
                  {entry.period}
                </span>
                <span className="exp-tag">{entry.tag.toUpperCase()}</span>
              </div>

              <div className="lyn-exp-role-col">
                <h3 className="exp-role">
                  <span className="lyn-editorial-hover-title">
                    {entry.role}
                  </span>
                </h3>
                <p className="exp-org">{entry.org.toUpperCase()}</p>
              </div>

              <p className="lyn-exp-detail">{entry.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
