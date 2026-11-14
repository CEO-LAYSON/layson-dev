import { useProfile } from '../lib/content'
import { Markdown, Reveal, SectionHeader, Serif } from '../components/ui'

export default function About() {
  const { data: p } = useProfile()
  return (
    <section id="about" className="scroll-mt-24 py-24 md:py-28">
      <div className="container-x">
        <SectionHeader
          index="01"
          label="About"
          title={
            <>
              Engineer by trade, <Serif>builder</Serif> by nature.
            </>
          }
        />

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <figure className="group relative overflow-hidden rounded-[2rem] border border-line">
              <img
                src={p.avatar_alt_url || p.avatar_url}
                alt={`${p.name}, off the clock`}
                loading="lazy"
                className="aspect-[4/5] w-full object-cover object-top transition duration-[1.2s] group-hover:scale-[1.04]"
              />
              <figcaption className="absolute bottom-4 left-4 rounded-full bg-bg/80 px-3 py-1.5 font-mono text-[11px] text-muted backdrop-blur">
                Off the clock · {p.location.split(',')[0]}
              </figcaption>
            </figure>
          </Reveal>

          <div className="lg:col-span-7">
            <Reveal>
              <Markdown>{p.bio}</Markdown>
            </Reveal>

            {p.stats.length > 0 && (
              <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-3">
                {p.stats.map((s, i) => (
                  <Reveal key={s.label} delay={i * 0.08} className="bg-bg p-6">
                    <p className="text-5xl font-medium tracking-tightest">
                      {s.value}
                      <span className="text-accent-ink">.</span>
                    </p>
                    <p className="mt-3 text-sm text-muted">{s.label}</p>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
