import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  Briefcase,
  Copy,
  FileDown,
  Github,
  Home,
  Linkedin,
  Mail,
  PenLine,
  Search,
  SunMoon,
  User,
} from 'lucide-react'
import { useCollection, useProfile } from '../lib/content'
import { useTheme } from '../lib/useTheme'
import { cn } from '../lib/utils'

const EVENT = 'open-command-palette'
export const openPalette = () => window.dispatchEvent(new Event(EVENT))

type Item = { id: string; label: string; group: string; icon: React.ReactNode; run: () => void; hint?: string }

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [active, setActive] = useState(0)
  const [toast, setToast] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const { toggle } = useTheme()
  const { data: profile } = useProfile()
  const { data: projects } = useCollection('projects')
  const { data: posts } = useCollection('posts')

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    const onOpen = () => setOpen(true)
    window.addEventListener('keydown', onKey)
    window.addEventListener(EVENT, onOpen)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener(EVENT, onOpen)
    }
  }, [])

  useEffect(() => {
    if (open) {
      setQ('')
      setActive(0)
      setTimeout(() => inputRef.current?.focus(), 20)
    }
  }, [open])

  const items: Item[] = useMemo(() => {
    const go = (to: string) => () => navigate(to)
    const ext = (url: string) => () => window.open(url, '_blank', 'noopener')
    const base: Item[] = [
      { id: 'home', label: 'Home', group: 'Navigate', icon: <Home size={15} />, run: go('/') },
      { id: 'about', label: 'About me', group: 'Navigate', icon: <User size={15} />, run: go('/#about') },
      { id: 'exp', label: 'Experience', group: 'Navigate', icon: <Briefcase size={15} />, run: go('/#experience') },
      { id: 'work', label: 'Selected work', group: 'Navigate', icon: <ArrowRight size={15} />, run: go('/#work') },
      { id: 'blog', label: 'Writing', group: 'Navigate', icon: <PenLine size={15} />, run: go('/blog') },
      { id: 'contact', label: 'Contact', group: 'Navigate', icon: <Mail size={15} />, run: go('/#contact') },
      {
        id: 'copy',
        label: 'Copy email address',
        group: 'Actions',
        icon: <Copy size={15} />,
        hint: profile.email,
        run: () => {
          navigator.clipboard?.writeText(profile.email)
          setToast('Email copied')
          setTimeout(() => setToast(''), 1800)
        },
      },
      { id: 'cv', label: 'Download CV', group: 'Actions', icon: <FileDown size={15} />, run: ext(profile.cv_url) },
      { id: 'theme', label: 'Toggle theme', group: 'Actions', icon: <SunMoon size={15} />, run: toggle },
      { id: 'gh', label: 'GitHub', group: 'Social', icon: <Github size={15} />, run: ext(profile.github) },
      { id: 'li', label: 'LinkedIn', group: 'Social', icon: <Linkedin size={15} />, run: ext(profile.linkedin) },
    ]
    const proj = projects.map<Item>((p) => ({
      id: `p-${p.id}`,
      label: p.title,
      group: 'Projects',
      icon: <ArrowRight size={15} />,
      run: go(`/projects/${p.slug}`),
    }))
    const blog = posts.map<Item>((p) => ({
      id: `b-${p.id}`,
      label: p.title,
      group: 'Writing',
      icon: <PenLine size={15} />,
      run: go(`/blog/${p.slug}`),
    }))
    return [...base, ...proj, ...blog]
  }, [navigate, toggle, profile, projects, posts])

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    return s ? items.filter((i) => `${i.label} ${i.group}`.toLowerCase().includes(s)) : items
  }, [items, q])

  const run = (item?: Item) => {
    if (!item) return
    item.run()
    if (item.id !== 'copy') setOpen(false)
  }

  const groups = [...new Set(filtered.map((i) => i.group))]

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-start justify-center bg-black/50 px-4 pt-[14vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={() => setOpen(false)}
        >
          <motion.div
            role="dialog"
            aria-label="Command menu"
            className="w-full max-w-lg overflow-hidden rounded-2xl border border-line bg-bg shadow-2xl"
            initial={{ opacity: 0, scale: 0.97, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-line px-4">
              <Search size={16} className="text-muted" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => {
                  setQ(e.target.value)
                  setActive(0)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault()
                    setActive((a) => Math.min(a + 1, filtered.length - 1))
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault()
                    setActive((a) => Math.max(a - 1, 0))
                  } else if (e.key === 'Enter') {
                    run(filtered[active])
                  }
                }}
                placeholder="Type a command or search…"
                className="h-14 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted/70"
              />
              <kbd className="chip">ESC</kbd>
            </div>
            <div className="max-h-[50vh] overflow-y-auto p-2">
              {filtered.length === 0 && <p className="px-3 py-8 text-center text-sm text-muted">No results.</p>}
              {groups.map((g) => (
                <div key={g} className="mb-1">
                  <p className="eyebrow px-3 pb-1 pt-3">{g}</p>
                  {filtered
                    .filter((i) => i.group === g)
                    .map((item) => {
                      const idx = filtered.indexOf(item)
                      return (
                        <button
                          key={item.id}
                          onMouseEnter={() => setActive(idx)}
                          onClick={() => run(item)}
                          className={cn(
                            'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition',
                            idx === active ? 'bg-surface text-fg' : 'text-muted',
                          )}
                        >
                          <span className={idx === active ? 'text-accent-ink' : ''}>{item.icon}</span>
                          <span className="flex-1 truncate">{item.label}</span>
                          {item.hint && <span className="hidden font-mono text-[11px] text-muted sm:inline">{item.hint}</span>}
                        </button>
                      )
                    })}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between border-t border-line px-4 py-2.5 font-mono text-[11px] text-muted">
              <span>↑↓ navigate · ↵ select</span>
              <AnimatePresence>
                {toast && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-accent-ink">
                    {toast} ✓
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
