import { Link } from 'react-router-dom'
import { Seo, Serif } from '../components/ui'

export default function NotFound() {
  return (
    <div className="grid min-h-[80vh] place-items-center px-4 pt-24 text-center">
      <Seo title="Not found" />
      <div>
        <p className="font-mono text-sm text-accent-ink">404</p>
        <h1 className="mt-4 text-6xl font-semibold tracking-tightest md:text-8xl">
          Lost in <Serif>production</Serif>.
        </h1>
        <p className="mt-6 text-muted">This page doesn’t exist, or it was moved.</p>
        <Link to="/" className="btn-primary mt-10">
          Back home
        </Link>
      </div>
    </div>
  )
}
