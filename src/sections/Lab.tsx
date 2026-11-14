import { ArrowUpRight, FlaskConical } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCollection } from '../lib/content'
import { cn } from '../lib/utils'
import { Reveal, SectionHeader, Serif } from '../components/ui'
import type { Product } from '../lib/types'

const statusStyle: Record<Product['status'], string> = {
  live: 'bg-accent text-accent-fg',
  beta: 'bg-fg text-bg',
  building: 'border border-line text-muted',
  idea: 'border border-dashed border-line text-muted',
}

export default function Lab() {
  const { data: products } = useCollection('products')

  return (
    <section id="lab" className="scroll-mt-24 py-24 md:py-28">
      <div className="container-x">
        <SectionHeader
          index="05"
          label="The Lab"
          title={
            <>
              Products I’m <Serif>building</Serif>.
            </>
          }
        />

        {products.length === 0 ? (
          <Reveal>
            <div className="card relative overflow-hidden p-8 md:p-14">
              <div className="grid-dots absolute inset-0 opacity-50 [mask-image:linear-gradient(to_left,#000,transparent_70%)]" />
              <div className="relative grid items-center gap-10 md:grid-cols-[1fr_auto]">
                <div>
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-accent text-accent-fg">
                    <FlaskConical size={22} />
                  </span>
                  <h3 className="mt-8 max-w-xl text-3xl font-medium tracking-tight md:text-4xl">
                    SaaS for East African businesses, <Serif className="text-muted">in the works.</Serif>
                  </h3>
                  <p className="mt-4 max-w-lg text-muted">
                    I’m building subscription software that helps businesses run their operations: stock, sales and
                    payments, built for how business works here. The first launch is on its way.
                  </p>
                </div>
                <Link to="/#contact" className="btn-primary">
                  Get early access <ArrowUpRight size={16} />
                </Link>
              </div>
            </div>
          </Reveal>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((x, i) => (
              <Reveal key={x.id} delay={i * 0.06}>
                <a
                  href={x.url || undefined}
                  target="_blank"
                  rel="noreferrer"
                  className="card group flex h-full flex-col p-7 transition hover:-translate-y-1 hover:border-fg/20"
                >
                  <div className="flex items-start justify-between">
                    {x.logo_url ? (
                      <img src={x.logo_url} alt="" className="h-12 w-12 rounded-2xl object-cover" />
                    ) : (
                      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent font-serif text-2xl italic text-accent-fg">
                        {x.name[0]}
                      </span>
                    )}
                    <span className={cn('rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider', statusStyle[x.status])}>
                      {x.status}
                    </span>
                  </div>
                  <h3 className="mt-8 text-2xl font-medium tracking-tight">{x.name}</h3>
                  <p className="mt-1 text-muted">{x.tagline}</p>
                  {x.description && <p className="mt-4 text-sm text-muted">{x.description}</p>}
                  <div className="mt-auto flex items-center justify-between pt-8 text-sm">
                    <span className="font-mono text-xs text-muted">{x.price_text}</span>
                    {x.url && (
                      <span className="inline-flex items-center gap-1 text-accent-ink">
                        Visit <ArrowUpRight size={14} className="transition group-hover:rotate-45" />
                      </span>
                    )}
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
