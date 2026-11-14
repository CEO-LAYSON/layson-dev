import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { useCollection } from '../lib/content'
import { longDate, readingTime } from '../lib/utils'
import { Reveal, SectionHeader, Serif } from '../components/ui'

export default function Writing() {
  const { data: posts } = useCollection('posts')
  if (!posts.length) return null

  return (
    <section id="writing" className="scroll-mt-24 py-24 md:py-28">
      <div className="container-x">
        <SectionHeader
          index="07"
          label="Writing"
          title={
            <>
              Notes from the <Serif>build</Serif>.
            </>
          }
          aside={
            <Link to="/blog" className="btn-ghost">
              All posts <ArrowUpRight size={16} />
            </Link>
          }
        />
        <div className="border-t border-line">
          {posts.slice(0, 4).map((x, i) => (
            <Reveal key={x.id} delay={i * 0.05}>
              <Link
                to={`/blog/${x.slug}`}
                className="group grid gap-2 border-b border-line py-8 md:grid-cols-[180px_1fr_auto] md:items-center md:gap-8"
              >
                <span className="font-mono text-xs text-muted">{longDate(x.published_at)}</span>
                <span>
                  <span className="block text-2xl font-medium tracking-tight transition group-hover:text-accent-ink">{x.title}</span>
                  {x.excerpt && <span className="mt-1 block text-muted">{x.excerpt}</span>}
                </span>
                <span className="flex items-center gap-3 font-mono text-xs text-muted">
                  {readingTime(x.content)} min read
                  <ArrowUpRight size={16} className="transition group-hover:rotate-45 group-hover:text-accent-ink" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
