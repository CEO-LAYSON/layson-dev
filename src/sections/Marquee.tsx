import { useCollection } from '../lib/content'

export default function Marquee() {
  const { data: skills } = useCollection('skills')
  const names = skills.map((s) => s.name)
  if (!names.length) return null
  const row = [...names, ...names]
  return (
    <section aria-label="Technologies" className="relative border-y border-line bg-surface/40 py-6">
      <div className="mask-fade-x flex overflow-hidden">
        <div className="flex shrink-0 animate-marquee items-center gap-10 pr-10 hover:[animation-play-state:paused]">
          {row.map((n, i) => (
            <span key={i} className="flex items-center gap-10 whitespace-nowrap text-2xl font-medium tracking-tight sm:text-3xl">
              <span className={i % 2 ? 'font-serif italic text-muted' : ''}>{n}</span>
              <span className="text-accent-ink text-base">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
