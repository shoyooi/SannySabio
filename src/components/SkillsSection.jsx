import { skills } from '../data/portfolio'

const pad = (n) => String(n).padStart(2, '0')
const MARQUEE_ITEMS = skills.flatMap((group) => group.items)

/**
 * (03) SKILLS & STACK section matching lynard-dev.vercel.app:
 * Top infinite badge marquee + 4-column indexed directory with monochrome glyphs.
 */
export default function SkillsSection() {
  return (
    <section id="skills" className="lyn-section">
      <div className="lyn-container">
        <div className="lyn-sec-bar" data-reveal>
          <span className="lyn-sec-num">(03)</span>
          <h2 className="lyn-sec-label">SKILLS &amp; STACK</h2>
          <span className="lyn-sec-rule" aria-hidden="true" />
        </div>

        {/* Infinite Marquee Strip */}
        <div className="lyn-marquee" aria-hidden="true" data-reveal>
          <div className="lyn-marquee-track">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => (
              <span className="lyn-marquee-badge" key={`${item}-${idx}`}>
                <span className="badge-hex" />
                <span>{item.toUpperCase()}</span>
              </span>
            ))}
          </div>
        </div>

        {/* 4-Column Indexed Matrix */}
        <div className="lyn-skills-grid">
          {skills.map((group) => (
            <div className="lyn-skill-col" key={group.category} data-reveal>
              <h3 className="lyn-skill-cat">{group.category.toUpperCase()}</h3>
              <ul className="lyn-skill-list">
                {group.items.map((item, idx) => (
                  <li key={item} className="lyn-skill-row">
                    <span className="lyn-skill-left">
                      <span className="lyn-skill-glyph" aria-hidden="true">
                        {item.slice(0, 2).toUpperCase()}
                      </span>
                      <span className="lyn-skill-name">{item}</span>
                    </span>
                    <span className="lyn-skill-num">{pad(idx + 1)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
