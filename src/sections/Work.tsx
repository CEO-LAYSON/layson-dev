import { Link } from 'react-router-dom'
import { ArrowUpRight, Github } from 'lucide-react'
import { useCollection, useProfile } from '../lib/content'
import { Cover, Reveal, SectionHeader, Serif } from '../components/ui'

export default function Work() {
  const { data: projects } = useCollection('projects')
  const { data: p } = useProfile()
  const featured = projects.filter((x) => x.featured)
  const rest = projects.filter((x) => !x.featured)

  return (
    <section id="work" className="scroll-mt-24 py-24 md:py-28">
      <div className="container-x">
        <SectionHeader
          index="03"
          label="Selected work"
          title={
            <>
              Systems I’ve <Serif>designed</Serif> & built.
            </>
          }
          aside={
            <a href={p.github} target="_blank" rel="noreferrer" className="btn-ghost">
              <Github size={16} /> All repositories
            </a>
          }
        />

        <div className="grid gap-6 md:grid-cols-2">
          {featured.map((x, i) => (
            <Reveal key={x.id} delay={i * 0.08}>
              <Link to={`/projects/${x.slug}`} className="group block">
                <div className="card overflow-hidden p-2 transition duration-500 group-hover:border-fg/20">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-[1.4rem]">
                    <div className="h-full w-full transition duration-[1.2s] ease-out group-hover:scale-[1.04]">
                      <Cover title={x.title} src={x.cover_url} variant={i} />
                    </div>
                    <span className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-bg/80 backdrop-blur transition duration-500 group-hover:rotate-45 group-hover:bg-accent group-hover:text-accent-fg">
                      <ArrowUpRight size={18} />
                    </span>
                    {x.year && <span className="absolute left-4 top-4 chip bg-bg/70 backdrop-blur">{x.year}</span>}
                  </div>
                  <div className="p-5 pt-6">
                    <h3 className="text-2xl font-medium tracking-tight">{x.title}</h3>
                    <p className="mt-2 line-clamp-2 text-muted">{x.summary}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {x.tech.slice(0, 5).map((t) => (
                        <span key={t} className="chip">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        {rest.length > 0 && (
          <div className="mt-20">
            <Reveal>
              <p className="eyebrow mb-6">More projects</p>
            </Reveal>
            <div className="border-t border-line">
              {rest.map((x, i) => (
                <Reveal key={x.id} delay={i * 0.04}>
                  <Link
                    to={`/projects/${x.slug}`}
                    className="group relative grid grid-cols-[1fr_auto] items-center gap-4 border-b border-line py-6 transition md:grid-cols-[80px_1.2fr_1fr_auto] md:gap-8"
                  >
                    <span className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-surface transition-transform duration-500 group-hover:scale-y-100" />
                    <span className="hidden font-mono text-xs text-muted md:block">{x.year}</span>
                    <span>
                      <span className="block text-xl font-medium tracking-tight transition group-hover:translate-x-2">{x.title}</span>
                      <span className="mt-1 block text-sm text-muted md:hidden">{x.tech.slice(0, 3).join(' · ')}</span>
                    </span>
                    <span className="hidden truncate text-sm text-muted md:block">{x.tech.join(' · ')}</span>
                    <ArrowUpRight size={18} className="text-muted transition group-hover:rotate-45 group-hover:text-accent-ink" />
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
