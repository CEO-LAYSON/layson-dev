import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, DownloadCloud, Loader2, PenLine, Plus } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { invalidateContent } from '../lib/content'
import { seedCollections, seedProfile } from '../lib/seed'
import { resources } from './config'

export default function Dashboard() {
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [unread, setUnread] = useState(0)
  const [importing, setImporting] = useState(false)
  const [log, setLog] = useState<string[]>([])

  const load = async () => {
    if (!supabase) return
    const entries = await Promise.all(
      resources.map(async (r) => {
        const { count } = await supabase!.from(r.name).select('id', { count: 'exact', head: true })
        return [r.name, count ?? 0] as const
      }),
    )
    setCounts(Object.fromEntries(entries))
    const { count } = await supabase.from('messages').select('id', { count: 'exact', head: true }).eq('read', false)
    setUnread(count ?? 0)
  }

  useEffect(() => {
    load()
  }, [])

  const importSeed = async () => {
    if (!supabase) return
    if (!confirm('Import starter content into every EMPTY section? Sections that already have content are skipped.')) return
    setImporting(true)
    const out: string[] = []
    const { data: prof } = await supabase.from('profile').select('id').eq('id', 1).maybeSingle()
    if (!prof) {
      const { error } = await supabase.from('profile').insert({ id: 1, ...seedProfile })
      out.push(error ? `Profile: ${error.message}` : 'Profile: imported')
    } else out.push('Profile: already exists, skipped')

    for (const r of resources) {
      if ((counts[r.name] ?? 0) > 0) {
        out.push(`${r.label}: has content, skipped`)
        continue
      }
      const rows = seedCollections[r.name].map(({ id: _id, ...rest }) => rest)
      if (!rows.length) {
        out.push(`${r.label}: nothing to import`)
        continue
      }
      const { error } = await supabase.from(r.name).insert(rows)
      out.push(error ? `${r.label}: ${error.message}` : `${r.label}: ${rows.length} imported`)
    }
    setLog(out)
    invalidateContent()
    await load()
    setImporting(false)
  }

  const empty = Object.values(counts).every((c) => c === 0)
  const hour = Number(new Intl.DateTimeFormat('en-GB', { hour: 'numeric', timeZone: 'Africa/Dar_es_Salaam' }).format(new Date()))
  const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div>
      <p className="eyebrow">Dashboard</p>
      <h1 className="mt-2 text-4xl font-medium tracking-tight">{greet}, Layson.</h1>
      <p className="mt-2 text-muted">Everything on layson.dev is controlled from here.</p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/admin/posts/new" className="btn-primary"><PenLine size={16} /> Write a post</Link>
        <Link to="/admin/projects/new" className="btn-ghost"><Plus size={16} /> Add project</Link>
        <Link to="/admin/products/new" className="btn-ghost"><Plus size={16} /> Add SaaS product</Link>
        <a href="/" target="_blank" rel="noreferrer" className="btn-ghost">View site <ArrowUpRight size={15} /></a>
      </div>

      {empty && Object.keys(counts).length > 0 && (
        <div className="card mt-10 border-accent/40 bg-accent/5 p-6">
          <h2 className="text-lg font-medium">Your database is empty</h2>
          <p className="mt-1 text-sm text-muted">
            Import the starter content (from your CV and GitHub) so you have something to edit instead of starting from zero.
          </p>
          <button onClick={importSeed} disabled={importing} className="btn-primary mt-4">
            {importing ? <Loader2 size={16} className="animate-spin" /> : <DownloadCloud size={16} />} Import starter content
          </button>
        </div>
      )}
      {log.length > 0 && (
        <pre className="mt-4 overflow-x-auto rounded-xl border border-line bg-surface p-4 font-mono text-xs text-muted">{log.join('\n')}</pre>
      )}

      <div className="mt-10 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        <Link to="/admin/messages" className="bg-bg p-6 transition hover:bg-surface">
          <p className="eyebrow">Unread messages</p>
          <p className="mt-3 text-4xl font-medium tracking-tight">
            {unread}
            {unread > 0 && <span className="ml-2 inline-block h-2.5 w-2.5 rounded-full bg-accent align-middle" />}
          </p>
        </Link>
        {resources.map((r) => (
          <Link key={r.name} to={`/admin/${r.name}`} className="bg-bg p-6 transition hover:bg-surface">
            <p className="eyebrow">{r.label}</p>
            <p className="mt-3 text-4xl font-medium tracking-tight">{counts[r.name] ?? '–'}</p>
          </Link>
        ))}
      </div>

      {!empty && (
        <button onClick={importSeed} disabled={importing} className="mt-6 text-xs text-muted underline-offset-4 hover:underline">
          Import starter content into empty sections
        </button>
      )}
    </div>
  )
}
