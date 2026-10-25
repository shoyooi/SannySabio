import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="not-found">
      <div className="wrap">
        <p className="section-label">404</p>
        <h1 className="contact-title">This page doesn't exist.</h1>
        <Link className="btn btn-primary" to="/">Back to home</Link>
      </div>
    </section>
  )
}
