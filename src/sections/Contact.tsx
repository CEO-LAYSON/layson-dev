import { useState } from 'react'
import { ArrowUpRight, Check, Copy, Loader2, Send } from 'lucide-react'
import { useProfile } from '../lib/content'
import { supabase } from '../lib/supabase'
import { Reveal, Serif, StatusDot } from '../components/ui'

export default function Contact() {
  const { data: p } = useProfile()
  const [copied, setCopied] = useState(false)
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [form, setForm] = useState({ name: '', email: '', subject: '', body: '', website: '' })

  const copy = () => {
    navigator.clipboard?.writeText(p.email)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.website) return // honeypot: bots fill hidden fields
    if (!supabase) {
      const subject = encodeURIComponent(form.subject || `Hello from ${form.name}`)
      const body = encodeURIComponent(`${form.body}\n\n— ${form.name} (${form.email})`)
      window.location.href = `mailto:${p.email}?subject=${subject}&body=${body}`
      return
    }
    setState('sending')
    const { error } = await supabase.from('messages').insert({
      name: form.name,
      email: form.email,
      subject: form.subject,
      body: form.body,
    })
    setState(error ? 'error' : 'sent')
    if (!error) setForm({ name: '', email: '', subject: '', body: '', website: '' })
  }

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  return (
    <section id="contact" className="relative scroll-mt-24 overflow-hidden py-24 md:py-32">
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-accent/10 blur-[140px]" />
      <div className="container-x relative">
        <Reveal>
          <div className="eyebrow mb-8 flex items-center gap-3">
            <span className="text-accent-ink">08</span>
            <span className="h-px w-8 bg-line" />
            <span>Contact</span>
          </div>
          <h2 className="text-[13vw] font-semibold leading-[0.9] tracking-tightest md:text-[8.5rem]">
            Let’s build
            <br />
            <Serif>something</Serif> <span className="text-accent-ink">great.</span>
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <p className="max-w-md text-lg text-muted">
              Recruiters, founders and teams: I’m open to engineering roles anywhere in the world, and to building products for
              your business.
            </p>
            <button
              onClick={copy}
              className="group mt-8 flex w-full max-w-md items-center justify-between gap-4 rounded-2xl border border-line p-5 text-left transition hover:border-accent/50"
            >
              <span>
                <span className="eyebrow block">Email</span>
                <span className="mt-1 block break-all text-lg font-medium sm:text-xl">{p.email}</span>
              </span>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-surface transition group-hover:bg-accent group-hover:text-accent-fg">
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </span>
            </button>
            <div className="mt-4 flex flex-wrap gap-3">
              <a href={p.linkedin} target="_blank" rel="noreferrer" className="btn-ghost">
                LinkedIn <ArrowUpRight size={15} />
              </a>
              <a href={p.github} target="_blank" rel="noreferrer" className="btn-ghost">
                GitHub <ArrowUpRight size={15} />
              </a>
            </div>
            {p.available && (
              <p className="mt-8 flex items-center gap-2.5 text-sm text-muted">
                <StatusDot /> {p.availability_text}. I usually reply within a day.
              </p>
            )}
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-7">
            <form onSubmit={submit} className="card space-y-4 p-6 md:p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label" htmlFor="c-name">Name</label>
                  <input id="c-name" required maxLength={150} value={form.name} onChange={set('name')} className="input" placeholder="Your name" />
                </div>
                <div>
                  <label className="label" htmlFor="c-email">Email</label>
                  <input id="c-email" required type="email" maxLength={190} value={form.email} onChange={set('email')} className="input" placeholder="you@company.com" />
                </div>
              </div>
              <div>
                <label className="label" htmlFor="c-subject">Subject</label>
                <input id="c-subject" maxLength={200} value={form.subject} onChange={set('subject')} className="input" placeholder="Job opportunity, project, or just hello" />
              </div>
              <div>
                <label className="label" htmlFor="c-body">Message</label>
                <textarea id="c-body" required rows={5} maxLength={5000} value={form.body} onChange={set('body')} className="input resize-none" placeholder="Tell me a bit about it…" />
              </div>
              <input type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} className="hidden" aria-hidden />
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <p className="text-sm text-muted">
                  {state === 'sent' && <span className="text-accent-ink">Message sent. Talk soon! ✓</span>}
                  {state === 'error' && <span className="text-red-400">Couldn’t send. Please email me directly.</span>}
                </p>
                <button type="submit" disabled={state === 'sending'} className="btn-primary">
                  {state === 'sending' ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  Send message
                </button>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
