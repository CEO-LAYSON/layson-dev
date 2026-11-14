import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight, FileDown, MapPin } from 'lucide-react'
import { useProfile } from '../lib/content'
import { LocalTime, StatusDot } from '../components/ui'

const ease = [0.16, 1, 0.3, 1] as const

function Line({ children, delay }: { children: React.ReactNode; delay: number }) {
  const reduce = useReducedMotion()
  return (
    <span className="block overflow-hidden pb-[0.06em]">
      <motion.span
        className="block"
        initial={reduce ? false : { y: '105%' }}
        animate={{ y: 0 }}
        transition={{ duration: 1.1, delay, ease }}
      >
        {children}
      </motion.span>
    </span>
  )
}

export default function Hero() {
  const { data: p } = useProfile()
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()

  // Cursor spotlight
  const mx = useMotionValue(-1000)
  const my = useMotionValue(-1000)
  const sx = useSpring(mx, { stiffness: 120, damping: 20 })
  const sy = useSpring(my, { stiffness: 120, damping: 20 })
  const bg = useTransform([sx, sy], ([x, y]) => `radial-gradient(520px circle at ${x}px ${y}px, rgb(var(--accent) / 0.10), transparent 60%)`)

  // Photo tilt
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 150, damping: 15 })
  const sry = useSpring(ry, { stiffness: 150, damping: 15 })

  useEffect(() => {
    const el = ref.current
    if (!el || reduce) return
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      mx.set(e.clientX - r.left)
      my.set(e.clientY - r.top)
    }
    el.addEventListener('pointermove', onMove)
    return () => el.removeEventListener('pointermove', onMove)
  }, [mx, my, reduce])

  const [first, ...rest] = p.name.split(' ')
  const last = rest.join(' ')

  return (
    <section ref={ref} className="relative flex min-h-[100svh] items-center overflow-hidden pb-16 pt-32 lg:pt-28">
      <div className="grid-dots pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,#000_30%,transparent_75%)]" />
      <motion.div className="pointer-events-none absolute inset-0" style={{ background: bg }} />
      <div className="pointer-events-none absolute -right-40 top-20 h-[480px] w-[480px] rounded-full bg-accent/10 blur-[120px]" />

      <div className="container-x relative grid items-center gap-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
            className="mb-8 flex flex-wrap items-center gap-3"
          >
            {p.available && (
              <span className="inline-flex items-center gap-2.5 rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1.5 text-xs font-medium text-accent-ink">
                <StatusDot /> {p.availability_text}
              </span>
            )}
            <span className="chip">
              <MapPin size={11} className="mr-1" /> {p.location}
            </span>
          </motion.div>

          <h1 className="text-[17vw] font-semibold leading-[0.86] tracking-tightest sm:text-[13vw] lg:text-[9.6rem]">
            <Line delay={0.1}>{first}</Line>
            <Line delay={0.22}>
              <span className="font-serif font-normal italic tracking-[-0.02em]">{last}</span>
              <span className="text-accent-ink">.</span>
            </Line>
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.55, ease }}
            className="mt-10 grid gap-8 md:grid-cols-[1fr_auto] md:items-end"
          >
            <p className="max-w-xl text-lg leading-relaxed text-muted sm:text-xl">
              <span className="text-fg">{p.headline}.</span> {p.tagline}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/#work" className="btn-primary group">
                See my work <ArrowDownRight size={16} className="transition group-hover:rotate-[-45deg]" />
              </Link>
              <a href={p.cv_url} target="_blank" rel="noreferrer" className="btn-ghost">
                <FileDown size={16} /> CV
              </a>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="relative mx-auto w-full max-w-[340px] lg:col-span-4 lg:max-w-none"
          initial={{ opacity: 0, scale: 0.94, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease }}
          style={{ perspective: 1000 }}
        >
          <motion.div
            style={{ rotateX: srx, rotateY: sry, transformStyle: 'preserve-3d' }}
            onPointerMove={(e) => {
              if (reduce) return
              const r = e.currentTarget.getBoundingClientRect()
              ry.set(((e.clientX - r.left) / r.width - 0.5) * 10)
              rx.set(-((e.clientY - r.top) / r.height - 0.5) * 10)
            }}
            onPointerLeave={() => {
              rx.set(0)
              ry.set(0)
            }}
            className="group relative"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-line bg-surface">
              <img
                src={p.avatar_url}
                alt={`Portrait of ${p.name}`}
                className="h-full w-full scale-[1.03] object-cover object-top grayscale-[35%] transition duration-700 group-hover:scale-100 group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">Currently</p>
                <p className="mt-1 text-[15px] font-medium">
                  {p.job_title} <span className="text-white/60">@</span> {p.company}
                </p>
              </div>
            </div>
            <div
              className="absolute -left-4 top-8 hidden rounded-2xl border border-line bg-bg/85 px-4 py-3 shadow-xl backdrop-blur-md sm:block"
              style={{ transform: 'translateZ(40px)' }}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Dar es Salaam</p>
              <p className="mt-0.5 font-mono text-lg">
                <LocalTime tz={p.timezone} /> <span className="text-xs text-muted">EAT</span>
              </p>
            </div>
            <a
              href={p.github}
              target="_blank"
              rel="noreferrer"
              className="absolute -right-3 bottom-24 hidden items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-xs font-semibold text-accent-fg shadow-xl sm:inline-flex"
              style={{ transform: 'translateZ(60px)' }}
            >
              GitHub <ArrowUpRight size={13} />
            </a>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="container-x absolute inset-x-0 bottom-6 hidden items-center justify-between font-mono text-[11px] text-muted lg:flex"
      >
        <span>Scroll to explore ↓</span>
        <span>Press Ctrl K to jump anywhere</span>
      </motion.div>
    </section>
  )
}
