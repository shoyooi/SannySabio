import { Link } from 'react-router-dom'
import { about } from '../data/portfolio'

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
    </section>
  )
}
