import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ArrowUpRight, Github } from 'lucide-react'
import { useCollection } from '../lib/content'
import { Cover, Markdown, Reveal, Seo } from '../components/ui'
import NotFound from './NotFound'

export default function ProjectPage() {
  const { slug } = useParams()
  const { data: projects, loading } = useCollection('projects')
  const idx = projects.findIndex((p) => p.slug === slug)
  const x = projects[idx]

  if (!x) return loading ? <div className="min-h-screen" /> : <NotFound />
  const next = projects[(idx + 1) % projects.length]

  return (
    <article className="pb-20 pt-32">
      <Seo title={x.title} description={x.summary} image={x.cover_url || undefined} />
      <div className="container-x">
        <Reveal>
          <Link to="/#work" className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-fg">
            <ArrowLeft size={15} /> All work
          </Link>
          <h1 className="mt-10 max-w-5xl text-5xl font-semibold leading-[0.95] tracking-tightest md:text-7xl lg:text-8xl">
            {x.title}
          </h1>
          <p className="mt-8 max-w-2xl text-xl text-muted">{x.summary}</p>
        </Reveal>

        <Reveal delay={0.1}>
          <dl className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-4">
            {[
              ['Year', x.year || '—'],
              ['Role', x.role || '—'],
              ['Stack', x.tech.slice(0, 3).join(', ') || '—'],
            ].map(([k, v]) => (
              <div key={k} className="bg-bg p-5">
                <dt className="eyebrow">{k}</dt>
                <dd className="mt-2 text-sm">{v}</dd>
              </div>
            ))}
            <div className="flex flex-col justify-center gap-2 bg-bg p-5">
              {x.live_url && (
                <a href={x.live_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm text-accent-ink">
                  Live site <ArrowUpRight size={14} />
                </a>
              )}
              {x.github_url && (
                <a href={x.github_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm">
                  <Github size={14} /> Source code
                </a>
              )}
              {!x.live_url && !x.github_url && <span className="text-sm text-muted">Private / internal</span>}
            </div>
          </dl>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-6 aspect-[16/8] overflow-hidden rounded-[2rem] border border-line">
            <Cover title={x.title} src={x.cover_url} />
          </div>
        </Reveal>

        <div className="mx-auto mt-20 max-w-3xl">
          <Markdown>{x.content || x.summary}</Markdown>
          {x.tech.length > 0 && (
            <div className="mt-12 flex flex-wrap gap-2 border-t border-line pt-8">
              {x.tech.map((t) => (
                <span key={t} className="chip">{t}</span>
              ))}
            </div>
          )}
        </div>

        {next && next.id !== x.id && (
          <Link to={`/projects/${next.slug}`} className="group mt-28 block border-t border-line pt-10">
            <p className="eyebrow">Next project</p>
            <p className="mt-4 flex items-center justify-between gap-6 text-4xl font-medium tracking-tightest transition group-hover:text-accent-ink md:text-6xl">
              {next.title}
              <ArrowRight className="shrink-0 transition group-hover:translate-x-2" size={40} />
            </p>
          </Link>
        )}
      </div>
    </article>
  )
}
