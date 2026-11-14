import { useEffect, useState } from 'react'
import { Link, NavLink, Route, Routes, useNavigate } from 'react-router-dom'
import type { Session } from '@supabase/supabase-js'
import { Helmet } from 'react-helmet-async'
import { ExternalLink, Inbox, LayoutDashboard, Loader2, LogOut, Menu, UserRound, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { cn } from '../lib/utils'
import { ThemeButton } from '../components/Navbar'
import { resources } from './config'
import Dashboard from './Dashboard'
import { ResourceEditor, ResourceList } from './ResourcePages'
import ProfilePage from './ProfilePage'
import MessagesPage from './MessagesPage'

export default function Admin() {
  const [session, setSession] = useState<Session | null>(null)
  const [ready, setReady] = useState(false)
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)

  useEffect(() => {
    if (!supabase) return setReady(true)
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setReady(true)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!supabase || !session) return setIsAdmin(null)
    supabase
      .from('admins')
      .select('user_id')
      .eq('user_id', session.user.id)
      .maybeSingle()
      .then(({ data }) => setIsAdmin(!!data))
  }, [session])

  return (
    <>
      <Helmet>
        <title>Admin — layson.dev</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      {!supabase ? (
        <SetupNeeded />
      ) : !ready ? (
        <Centered><Loader2 className="animate-spin text-muted" /></Centered>
      ) : !session ? (
        <Login />
      ) : isAdmin === null ? (
        <Centered><Loader2 className="animate-spin text-muted" /></Centered>
      ) : !isAdmin ? (
        <NotAdmin email={session.user.email ?? ''} />
      ) : (
        <Shell email={session.user.email ?? ''} />
      )}
    </>
  )
}

function Centered({ children }: { children: React.ReactNode }) {
  return <div className="grid min-h-screen place-items-center bg-bg px-4">{children}</div>
}

function SetupNeeded() {
  return (
    <Centered>
      <div className="card max-w-lg p-8">
        <p className="eyebrow">Admin</p>
        <h1 className="mt-3 text-3xl font-medium tracking-tight">Connect Supabase first</h1>
        <p className="mt-4 text-muted">
          The site is running on starter content. To edit it from here, create a Supabase project, run
          <code className="mx-1 rounded bg-surface px-1.5 py-0.5 text-fg">supabase/schema.sql</code>, then add your keys to
          <code className="mx-1 rounded bg-surface px-1.5 py-0.5 text-fg">.env.local</code>. See the README for the full steps.
        </p>
        <Link to="/" className="btn-ghost mt-8">← Back to site</Link>
      </div>
    </Centered>
  )
}

function NotAdmin({ email }: { email: string }) {
  return (
    <Centered>
      <div className="card max-w-lg p-8">
        <h1 className="text-2xl font-medium tracking-tight">Not authorized</h1>
        <p className="mt-3 text-muted">
          You are signed in as <span className="text-fg">{email}</span>, but this account isn’t an admin yet. Run the final
          SQL line from <code className="rounded bg-surface px-1.5 py-0.5 text-fg">supabase/schema.sql</code> with this email, then reload.
        </p>
        <button className="btn-ghost mt-6" onClick={() => supabase?.auth.signOut()}>Sign out</button>
      </div>
    </Centered>
  )
}

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase) return
    setBusy(true)
    setErr('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setErr(error.message)
    setBusy(false)
  }

  return (
    <Centered>
      <div className="grid-dots pointer-events-none fixed inset-0 [mask-image:radial-gradient(ellipse_at_center,#000_20%,transparent_70%)]" />
      <form onSubmit={submit} className="card relative w-full max-w-sm space-y-4 bg-bg p-8">
        <Link to="/" className="text-[15px] font-semibold tracking-tight">
          layson<span className="text-accent-ink">.</span>dev
        </Link>
        <h1 className="pt-2 text-2xl font-medium tracking-tight">Welcome back, boss.</h1>
        <div>
          <label className="label" htmlFor="l-email">Email</label>
          <input id="l-email" type="email" required autoComplete="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="l-pass">Password</label>
          <input id="l-pass" type="password" required autoComplete="current-password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {err && <p className="text-sm text-red-400">{err}</p>}
        <button className="btn-primary w-full" disabled={busy}>
          {busy && <Loader2 size={16} className="animate-spin" />} Sign in
        </button>
      </form>
    </Centered>
  )
}

function Shell({ email }: { email: string }) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const item = 'flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition'
  const cls = ({ isActive }: { isActive: boolean }) =>
    cn(item, isActive ? 'bg-surface text-fg' : 'text-muted hover:bg-surface/60 hover:text-fg')

  const nav = (
    <nav className="flex h-full flex-col gap-1 p-4" onClick={() => setOpen(false)}>
      <Link to="/" className="mb-6 px-3 text-[15px] font-semibold tracking-tight">
        layson<span className="text-accent-ink">.</span>dev <span className="ml-1 font-mono text-[10px] font-normal text-muted">admin</span>
      </Link>
      <NavLink end to="/admin" className={cls}><LayoutDashboard size={16} /> Dashboard</NavLink>
      <NavLink to="/admin/profile" className={cls}><UserRound size={16} /> Profile</NavLink>
      <NavLink to="/admin/messages" className={cls}><Inbox size={16} /> Messages</NavLink>
      <p className="eyebrow mb-1 mt-6 px-3">Content</p>
      {resources.map((r) => (
        <NavLink key={r.name} to={`/admin/${r.name}`} className={cls}>
          <span className="h-1.5 w-1.5 rounded-full bg-current opacity-50" /> {r.label}
        </NavLink>
      ))}
      <div className="mt-auto space-y-1 border-t border-line pt-4">
        <a href="/" target="_blank" rel="noreferrer" className={cn(item, 'text-muted hover:text-fg')}>
          <ExternalLink size={16} /> View site
        </a>
        <button
          onClick={async () => {
            await supabase?.auth.signOut()
            navigate('/admin')
          }}
          className={cn(item, 'w-full text-muted hover:text-fg')}
        >
          <LogOut size={16} /> Sign out
        </button>
        <p className="truncate px-3 pt-2 font-mono text-[10px] text-muted">{email}</p>
      </div>
    </nav>
  )

  return (
    <div className="min-h-screen bg-bg lg:grid lg:grid-cols-[250px_1fr]">
      <aside className="sticky top-0 hidden h-screen border-r border-line lg:block">{nav}</aside>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 lg:hidden" onClick={() => setOpen(false)}>
          <aside className="h-full w-72 border-r border-line bg-bg" onClick={(e) => e.stopPropagation()}>{nav}</aside>
        </div>
      )}

      <div className="min-w-0">
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-line bg-bg/80 px-4 py-3 backdrop-blur-xl sm:px-8">
          <button className="grid h-9 w-9 place-items-center rounded-full border border-line lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
          <span className="font-mono text-xs text-muted">Signed in · {email}</span>
          <ThemeButton />
        </header>
        <main className="mx-auto max-w-5xl px-4 py-10 sm:px-8">
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="messages" element={<MessagesPage />} />
            <Route path=":resource" element={<ResourceList />} />
            <Route path=":resource/:id" element={<ResourceEditor />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
