import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useCollection } from '../lib/content'
import { cn, duration, monthYear } from '../lib/utils'
import { Reveal, SectionHeader, Serif } from '../components/ui'

export default function Experience() {
  const { data: items } = useCollection('experiences')
  const [open, setOpen] = useState<string | null>(null)
  const openId = open ?? items[0]?.id ?? null

  return (
    <section id="experience" className="scroll-mt-24 py-24 md:py-28">
      <div className="container-x">
        <SectionHeader
          index="02"
          label="Experience"
          title={
            <>
              Where I’ve been <Serif>shipping</Serif>.
            </>
          }
        />

        <div className="border-t border-line">
          {items.map((x, i) => {
            const isOpen = openId === x.id
            const current = !x.end_date
            return (
              <Reveal key={x.id} delay={i * 0.05}>
                <div className="border-b border-line">
                  <button
                    onClick={() => setOpen(isOpen ? '' : x.id)}
                    aria-expanded={isOpen}
                    className="group grid w-full grid-cols-[1fr_auto] items-center gap-4 py-7 text-left md:grid-cols-[200px_1fr_auto] md:gap-8"
                  >
                    <span className="order-2 col-span-2 font-mono text-xs text-muted md:order-none md:col-span-1">
                      {monthYear(x.start_date)} — {monthYear(x.end_date)}
                      <span className="ml-2 text-muted/60">· {duration(x.start_date, x.end_date)}</span>
                    </span>
                    <span>
                      <span className="flex flex-wrap items-center gap-3">
                        <span className="text-2xl font-medium tracking-tight transition group-hover:text-accent-ink md:text-3xl">
                          {x.company}
                        </span>
                        {current && (
                          <span className="rounded-full bg-accent px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-accent-fg">
                            Now
                          </span>
                        )}
                        {x.kind !== 'work' && <span className="chip capitalize">{x.kind}</span>}
                      </span>
                      <span className="mt-1 block text-muted">{x.role}</span>
                    </span>
                    <span
                      className={cn(
                        'grid h-10 w-10 place-items-center rounded-full border border-line transition duration-500',
                        isOpen && 'rotate-45 border-accent bg-accent text-accent-fg',
                      )}
                    >
                      <Plus size={16} />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="grid gap-6 pb-10 md:grid-cols-[200px_1fr_auto] md:gap-8">
                          <p className="hidden font-mono text-xs text-muted md:block">{x.location}</p>
                          <div>
                            {x.summary && <p className="mb-5 text-lg text-fg/90">{x.summary}</p>}
                            <ul className="space-y-3">
                              {x.highlights.map((h) => (
                                <li key={h} className="flex gap-3 text-muted">
                                  <span className="mt-2.5 h-1 w-3 shrink-0 bg-accent" />
                                  <span>{h}</span>
                                </li>
                              ))}
                            </ul>
                            {x.tech.length > 0 && (
                              <div className="mt-6 flex flex-wrap gap-2">
                                {x.tech.map((t) => (
                                  <span key={t} className="chip">{t}</span>
                                ))}
                              </div>
                            )}
                          </div>
                          <span className="hidden w-10 md:block" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
