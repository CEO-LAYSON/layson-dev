import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { useCollection } from '../lib/content'
import { cn, longDate, readingTime } from '../lib/utils'
import { Reveal, Seo, Serif } from '../components/ui'

export default function BlogIndex() {
  const { data: posts, loading } = useCollection('posts')
  const [tag, setTag] = useState<string | null>(null)
  const tags = useMemo(() => [...new Set(posts.flatMap((p) => p.tags))], [posts])
  const shown = tag ? posts.filter((p) => p.tags.includes(tag)) : posts

  return (
    <div className="min-h-screen pb-20 pt-36">
      <Seo title="Writing" description="Notes on engineering, building products and the journey from Dar es Salaam." />
      <div className="container-x">
        <Reveal>
          <p className="eyebrow">Writing</p>
          <h1 className="mt-6 text-6xl font-semibold leading-[0.95] tracking-tightest md:text-8xl">
            Notes from <Serif>the build</Serif>
            <span className="text-accent-ink">.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted">
            Engineering lessons, product build logs and what I’m learning along the way.
          </p>
        </Reveal>

        {tags.length > 0 && (
          <div className="mt-12 flex flex-wrap gap-2">
            {[null, ...tags].map((t) => (
              <button
                key={t ?? 'all'}
                onClick={() => setTag(t)}
                className={cn(
                  'rounded-full border px-4 py-1.5 text-sm transition',
                  tag === t ? 'border-accent bg-accent text-accent-fg' : 'border-line text-muted hover:text-fg',
                )}
              >
                {t ?? 'All'}
              </button>
            ))}
          </div>
        )}

        <div className="mt-10 border-t border-line">
          {!loading && shown.length === 0 && <p className="py-16 text-muted">No posts yet. Check back soon.</p>}
          {shown.map((x, i) => (
            <Reveal key={x.id} delay={i * 0.04}>
              <Link
                to={`/blog/${x.slug}`}
                className="group grid gap-3 border-b border-line py-10 md:grid-cols-[180px_1fr_auto] md:gap-8"
              >
                <span className="font-mono text-xs text-muted">{longDate(x.published_at)}</span>
                <span>
                  <span className="block text-3xl font-medium tracking-tight transition group-hover:text-accent-ink">{x.title}</span>
                  {x.excerpt && <span className="mt-2 block max-w-2xl text-muted">{x.excerpt}</span>}
                  <span className="mt-4 flex flex-wrap gap-2">
                    {x.tags.map((t) => (
                      <span key={t} className="chip">#{t}</span>
                    ))}
                  </span>
                </span>
                <span className="flex items-start gap-3 font-mono text-xs text-muted">
                  {readingTime(x.content)} min
                  <ArrowUpRight size={16} className="transition group-hover:rotate-45 group-hover:text-accent-ink" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  )
}
