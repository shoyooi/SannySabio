import { Link } from 'react-router-dom'
import { site } from '../data/site'

export default function Nav() {
  return (
    <nav className="nav" aria-label="Primary">
      <Link to="/" className="nav-mark">{site.name}</Link>
      <div className="nav-links">
        <Link to={{ pathname: '/', hash: '#work' }}><span>01</span>Work</Link>
        <Link to={{ pathname: '/', hash: '#about' }}><span>02</span>About</Link>
        <Link to={{ pathname: '/', hash: '#contact' }}><span>03</span>Contact</Link>
      </div>
    </nav>
  )
}
