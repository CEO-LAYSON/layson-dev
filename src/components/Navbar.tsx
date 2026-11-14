import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Command, Menu, Moon, Sun, X } from 'lucide-react'
import { useTheme } from '../lib/useTheme'
import { cn } from '../lib/utils'
import { openPalette } from './CommandPalette'

const links = [
  { href: '/#about', label: 'About' },
  { href: '/#experience', label: 'Experience' },
  { href: '/#work', label: 'Work' },
  { href: '/blog', label: 'Writing' },
]

export function ThemeButton() {
  const { theme, toggle } = useTheme()
  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className="grid h-9 w-9 place-items-center rounded-full border border-line text-muted transition hover:border-fg/30 hover:text-fg"
    >
      {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4">
      <nav
        className={cn(
          'mx-auto flex max-w-[1240px] items-center justify-between rounded-full border px-3 py-2 pl-5 transition-all duration-500',
          scrolled || open ? 'border-line bg-bg/75 shadow-[0_8px_30px_rgb(0_0_0/0.12)] backdrop-blur-xl' : 'border-transparent',
        )}
      >
        <Link to="/" className="group text-[15px] font-semibold tracking-tight">
          layson<span className="text-accent-ink">.</span>dev
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link key={l.href} to={l.href} className="rounded-full px-4 py-2 text-sm text-muted transition hover:text-fg">
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={openPalette}
            className="hidden h-9 items-center gap-1.5 rounded-full border border-line px-3 font-mono text-[11px] text-muted transition hover:border-fg/30 hover:text-fg sm:flex"
            aria-label="Open command menu"
          >
            <Command size={12} /> K
          </button>
          <ThemeButton />
          <Link to="/#contact" className="btn-primary hidden !py-2 sm:inline-flex">
            Let’s talk
          </Link>
          <button
            className="grid h-9 w-9 place-items-center rounded-full border border-line md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            aria-expanded={open}
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mx-auto mt-2 max-w-[1240px] rounded-3xl border border-line bg-bg/95 p-3 backdrop-blur-xl md:hidden"
          >
            {[...links, { href: '/#contact', label: 'Contact' }].map((l) => (
              <Link key={l.href} to={l.href} className="block rounded-2xl px-4 py-3 text-lg tracking-tight hover:bg-surface">
                {l.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
