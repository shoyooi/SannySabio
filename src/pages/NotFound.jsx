import { useLayoutEffect } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import { site } from '../data/portfolio'

export default function NotFound() {
  useLayoutEffect(() => {
    document.title = `404 — ${site.name}`
  }, [])

  return (
    <section className="lyn-section not-found">
      <div className="lyn-container not-found-body">
        <span className="lyn-sec-num">(404)</span>
        <h1 className="lyn-contact-title">
          This page
          <br />
          <em>doesn't exist.</em>
        </h1>
        <Link className="lyn-btn-solid" to="/">
          Back to home <span aria-hidden="true">→</span>
        </Link>
      </div>
      <Footer />
    </section>
  )
}
