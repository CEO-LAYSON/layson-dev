import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCollection } from '../lib/content'
import { Reveal, SectionHeader, Serif } from '../components/ui'

export default function Services() {
  const { data: services } = useCollection('services')
  if (!services.length) return null

  return (
    <section id="services" className="scroll-mt-24 py-24 md:py-28">
      <div className="container-x">
        <SectionHeader
          index="06"
          label="Work with me"
          title={
            <>
              Need something <Serif>built</Serif>?
            </>
          }
          aside={
            <Link to="/#contact" className="btn-ghost">
              Start a project <ArrowUpRight size={16} />
            </Link>
          }
        />
        <div className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-2">
          {services.map((s, i) => (
            <Reveal key={s.id} delay={i * 0.06} className="group relative bg-bg p-8 transition hover:bg-surface md:p-10">
              <span className="font-mono text-xs text-accent-ink">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-10 text-2xl font-medium tracking-tight md:text-3xl">{s.title}</h3>
              <p className="mt-3 max-w-md text-muted">{s.description}</p>
              {s.price_text && <p className="mt-6 font-mono text-xs text-muted">{s.price_text}</p>}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
