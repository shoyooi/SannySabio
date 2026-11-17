import { Link } from 'react-router-dom'
import { about, certificates, projects } from '../data/portfolio'

// True numbers, computed from the data file so they never drift.
const STATS = [
  { value: projects.length, label: 'Projects built' },
  { value: certificates.length, label: 'Certifications earned' },
  { value: 1, label: 'EDTECH system in campus use' },
]

export default function About() {
  return (
    <section id="about" className="panel panel-about" data-theme="light">
      <p className="chapter" data-reveal>Chapter IV</p>
      <div className="about-layout">
        <p className="about-quote" data-reveal>{about.quote}</p>
        <div className="about-copy">
          {about.short.map((p) => (
            <p className="about-body" key={p} data-reveal>{p}</p>
          ))}
          <Link className="more-link" to="/about" data-reveal>
            More about me <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
      <div className="about-stats" data-reveal>
        {STATS.map((s) => (
          <div className="stat" key={s.label}>
            <span className="stat-num" data-count={s.value} data-pad="2">{String(s.value).padStart(2, '0')}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
