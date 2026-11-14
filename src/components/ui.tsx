import { motion, useReducedMotion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useEffect, useState } from 'react'
import { cn, hashString } from '../lib/utils'

export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
}: {
  children: React.ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function SectionHeader({
  index,
  label,
  title,
  aside,
}: {
  index: string
  label: string
  title: React.ReactNode
  aside?: React.ReactNode
}) {
  return (
    <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
      <Reveal>
        <div className="eyebrow mb-5 flex items-center gap-3">
          <span className="text-accent-ink">{index}</span>
          <span className="h-px w-8 bg-line" />
          <span>{label}</span>
        </div>
        <h2 className="max-w-3xl text-4xl font-medium leading-[1.02] tracking-tightest sm:text-5xl md:text-6xl">
          {title}
        </h2>
      </Reveal>
      {aside && <Reveal delay={0.1}>{aside}</Reveal>}
    </div>
  )
}

export function Serif({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn('font-serif font-normal italic tracking-normal', className)}>{children}</span>
}

export function Seo({ title, description, image }: { title?: string; description?: string; image?: string }) {
  const full = title ? `${title} — Layson Ndenza` : 'Layson Ndenza — Software Engineer'
  return (
    <Helmet>
      <title>{full}</title>
      {description && <meta name="description" content={description} />}
      <meta property="og:title" content={full} />
      {description && <meta property="og:description" content={description} />}
      {image && <meta property="og:image" content={image} />}
    </Helmet>
  )
}

export function Markdown({ children }: { children: string }) {
  return (
    <div className="prose-site">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) => (
            <a href={href} target={href?.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
              {children}
            </a>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}

/** Generated cover art for projects that don't have an image yet. */
export function Cover({
  title,
  src,
  className,
  variant: forced,
}: {
  title: string
  src?: string
  className?: string
  variant?: number
}) {
  if (src) return <img src={src} alt={title} loading="lazy" className={cn('h-full w-full object-cover', className)} />
  const variant = (forced ?? hashString(title)) % 3
  const initials = title
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
  return (
    <div className={cn('relative h-full w-full overflow-hidden bg-raised', className)} aria-hidden>
      <div className="grid-dots absolute inset-0 opacity-60" />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice">
        {variant === 0 &&
          Array.from({ length: 9 }).map((_, i) => (
            <circle key={i} cx={320} cy={220} r={30 + i * 26} fill="none" stroke="rgb(var(--accent))" strokeOpacity={0.5 - i * 0.05} />
          ))}
        {variant === 1 &&
          Array.from({ length: 14 }).map((_, i) => (
            <line key={i} x1={i * 34 - 60} y1={260} x2={i * 34 + 120} y2={0} stroke="rgb(var(--accent))" strokeOpacity={0.12 + (i % 4) * 0.08} />
          ))}
        {variant === 2 &&
          Array.from({ length: 6 }).map((_, r) =>
            Array.from({ length: 10 }).map((_, c) => (
              <rect
                key={`${r}-${c}`}
                x={170 + c * 24}
                y={40 + r * 34}
                width={14}
                height={(hashString(title + r + c) % 26) + 4}
                rx={2}
                fill="rgb(var(--accent))"
                fillOpacity={0.15 + ((r + c) % 5) * 0.12}
              />
            )),
          )}
      </svg>
      <span className="absolute bottom-5 left-6 font-serif text-7xl italic text-fg/90">{initials}</span>
    </div>
  )
}

export function LocalTime({ tz = 'Africa/Dar_es_Salaam' }: { tz?: string }) {
  const fmt = () =>
    new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: tz }).format(new Date())
  const [time, setTime] = useState(fmt)
  useEffect(() => {
    const id = setInterval(() => setTime(fmt()), 15_000)
    return () => clearInterval(id)
  }, [tz]) // eslint-disable-line react-hooks/exhaustive-deps
  return <span className="tabular-nums">{time}</span>
}

export function StatusDot({ className }: { className?: string }) {
  return (
    <span className={cn('relative inline-flex h-2 w-2', className)}>
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
    </span>
  )
}
