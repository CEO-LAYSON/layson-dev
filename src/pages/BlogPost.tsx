import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion, useScroll, useSpring } from 'framer-motion'
import { ArrowLeft, Check, Link2 } from 'lucide-react'
import { useCollection, useProfile } from '../lib/content'
import { longDate, readingTime } from '../lib/utils'
import { Markdown, Seo } from '../components/ui'
import NotFound from './NotFound'

export default function BlogPost() {
  const { slug } = useParams()
  const { data: posts, loading } = useCollection('posts')
  const { data: profile } = useProfile()
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30 })
  const [copied, setCopied] = useState(false)
  const x = posts.find((p) => p.slug === slug)

  useEffect(() => setCopied(false), [slug])

  if (!x) return loading ? <div className="min-h-screen" /> : <NotFound />

  return (
    <article className="pb-20 pt-36">
      <Seo title={x.title} description={x.excerpt} image={x.cover_url || undefined} />
      <motion.div className="fixed inset-x-0 top-0 z-[55] h-0.5 origin-left bg-accent" style={{ scaleX: progress }} />
      <div className="container-x">
        <div className="mx-auto max-w-3xl">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-fg">
            <ArrowLeft size={15} /> All writing
          </Link>
          <div className="mt-10 flex flex-wrap items-center gap-3 font-mono text-xs text-muted">
            <span>{longDate(x.published_at)}</span>
            <span>·</span>
            <span>{readingTime(x.content)} min read</span>
            {x.tags.map((t) => (
              <span key={t} className="chip">#{t}</span>
            ))}
          </div>
          <h1 className="mt-6 text-5xl font-semibold leading-[1] tracking-tightest md:text-6xl">{x.title}</h1>
          {x.excerpt && <p className="mt-6 text-xl text-muted">{x.excerpt}</p>}

          <div className="mt-10 flex items-center justify-between border-y border-line py-5">
            <div className="flex items-center gap-3">
              <img src={profile.avatar_url} alt="" className="h-10 w-10 rounded-full object-cover object-top" />
              <div>
                <p className="text-sm font-medium">{profile.name}</p>
                <p className="text-xs text-muted">{profile.headline}</p>
              </div>
            </div>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href)
                setCopied(true)
              }}
              className="btn-ghost !px-4 !py-2 text-xs"
            >
              {copied ? <Check size={14} /> : <Link2 size={14} />} {copied ? 'Copied' : 'Share'}
            </button>
          </div>
        </div>

        {x.cover_url && (
          <img src={x.cover_url} alt="" className="mx-auto mt-12 max-h-[560px] w-full max-w-5xl rounded-[2rem] border border-line object-cover" />
        )}

        <div className="mx-auto mt-14 max-w-3xl">
          <Markdown>{x.content}</Markdown>
        </div>
      </div>
    </article>
  )
}
