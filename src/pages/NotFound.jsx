import { useLayoutEffect } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import { setTheme } from '../lib/motion'

export default function NotFound() {
  useLayoutEffect(() => setTheme('light'), [])

  return (
    <section className="panel not-found" data-theme="light">
      <div className="not-found-body">
        <p className="chapter">404</p>
        <h1 className="contact-title">This page doesn't exist.</h1>
        <Link className="more-link" to="/">Back to home <span aria-hidden="true">→</span></Link>
      </div>
      <Footer />
    </section>
  )
}
