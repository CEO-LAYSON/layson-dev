import { Link } from 'react-router-dom'
import { ArrowUp, ArrowUpRight } from 'lucide-react'
import { useProfile } from '../lib/content'
import { LocalTime } from './ui'

export default function Footer() {
  const { data: p } = useProfile()
  const socials = [
    { label: 'GitHub', href: p.github },
    { label: 'LinkedIn', href: p.linkedin },
    { label: 'X / Twitter', href: p.twitter },
    { label: 'TikTok', href: p.tiktok },
  ].filter((s) => s.href)

  return (
    <footer className="relative mt-10 border-t border-line">
      <div className="container-x grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="text-2xl font-medium tracking-tight">
            Building from <span className="font-serif italic">Dar es Salaam</span>,
            <br /> for the world.
          </p>
          <p className="mt-4 font-mono text-xs text-muted">
            Local time · <LocalTime tz={p.timezone} /> EAT
          </p>
        </div>
        <div className="md:col-span-3">
          <p className="eyebrow mb-4">Elsewhere</p>
          <ul className="space-y-2 text-sm">
            {socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer" className="link-u inline-flex items-center gap-1 text-muted hover:text-fg">
                  {s.label} <ArrowUpRight size={13} />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-2">
          <p className="eyebrow mb-4">Site</p>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link className="link-u hover:text-fg" to="/#work">Work</Link></li>
            <li><Link className="link-u hover:text-fg" to="/blog">Writing</Link></li>
            <li><a className="link-u hover:text-fg" href={p.cv_url} target="_blank" rel="noreferrer">CV</a></li>
          </ul>
        </div>
        <div className="flex items-start md:col-span-2 md:justify-end">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group grid h-12 w-12 place-items-center rounded-full border border-line transition hover:border-accent hover:bg-accent hover:text-accent-fg"
            aria-label="Back to top"
          >
            <ArrowUp size={16} className="transition group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>

      <div className="container-x overflow-hidden">
        <p
          aria-hidden
          className="select-none whitespace-nowrap text-center text-[12.5vw] font-semibold leading-[0.85] tracking-tightest text-outline lg:text-[10.2rem]"
        >
          Layson Ndenza
        </p>
      </div>

      <div className="container-x flex flex-col gap-2 border-t border-line py-6 text-xs text-muted sm:flex-row sm:justify-between">
        <span>© {new Date().getFullYear()} {p.name}. All rights reserved.</span>
        <span className="font-mono">Built with React + Supabase · press Ctrl K</span>
      </div>
    </footer>
  )
}
