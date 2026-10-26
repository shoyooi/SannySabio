import Footer from './Footer'
import { site } from '../data/portfolio'

export default function Contact({ theme = 'dark', label = 'Get in touch' }) {
  const links = [
    site.email && { href: `mailto:${site.email}`, label: site.email, external: false },
    site.github && { href: site.github, label: site.github.replace('https://', ''), external: true },
    site.linkedin && { href: site.linkedin, label: site.linkedin.replace('https://', ''), external: true },
  ].filter(Boolean)

  return (
    <section id="contact" className="panel panel-contact" data-theme={theme}>
      <p className="chapter" data-reveal>{label}</p>
      <div className="contact-main">
        <h2 className="contact-title" data-reveal>Let's build something that holds up.</h2>
        <div className="contact-links">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              data-reveal
              {...(l.external ? { target: '_blank', rel: 'noreferrer' } : {})}
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
      <Footer />
    </section>
  )
}
