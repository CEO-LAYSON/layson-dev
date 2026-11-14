import { Award, ArrowUpRight } from 'lucide-react'
import { useCollection } from '../lib/content'
import { monthYear } from '../lib/utils'
import { Reveal, SectionHeader, Serif } from '../components/ui'

export default function Toolbox() {
  const { data: skills } = useCollection('skills')
  const { data: certs } = useCollection('certifications')
  const groups = [...new Set(skills.map((s) => s.category))]

  return (
    <section id="toolbox" className="scroll-mt-24 py-24 md:py-28">
      <div className="container-x">
        <SectionHeader
          index="04"
          label="Toolbox"
          title={
            <>
              The tools I <Serif>reach for</Serif>.
            </>
          }
        />
        <div className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {groups.map((g, i) => (
            <Reveal key={g} delay={i * 0.06} className="bg-bg p-7">
              <p className="eyebrow mb-6">{g}</p>
              <ul className="space-y-2.5">
                {skills
                  .filter((s) => s.category === g)
                  .map((s) => (
                    <li key={s.id} className="group flex items-center gap-3 text-lg tracking-tight">
                      <span className="h-1.5 w-1.5 rounded-full bg-line transition group-hover:bg-accent" />
                      {s.name}
                    </li>
                  ))}
              </ul>
            </Reveal>
          ))}
        </div>

        {certs.length > 0 && (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {certs.map((c, i) => {
              const Body = (
                <div className="card group flex h-full items-start gap-5 p-6 transition hover:border-fg/20">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-accent/15 text-accent-ink">
                    <Award size={18} />
                  </span>
                  <div className="flex-1">
                    <p className="font-medium">{c.title}</p>
                    <p className="mt-1 text-sm text-muted">
                      {c.issuer}
                      {c.issued_on && ` · ${monthYear(c.issued_on)}`}
                    </p>
                    {c.description && <p className="mt-3 text-sm text-muted">{c.description}</p>}
                  </div>
                  {c.url && <ArrowUpRight size={16} className="text-muted transition group-hover:rotate-45" />}
                </div>
              )
              return (
                <Reveal key={c.id} delay={i * 0.06}>
                  {c.url ? (
                    <a href={c.url} target="_blank" rel="noreferrer">
                      {Body}
                    </a>
                  ) : (
                    Body
                  )}
                </Reveal>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
