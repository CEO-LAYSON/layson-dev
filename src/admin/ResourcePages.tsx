import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Eye, EyeOff, Loader2, Plus, Save, Trash2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { invalidateContent } from '../lib/content'
import { resources } from './config'
import { cleanValues, FieldInput } from './fields'

type Row = Record<string, unknown> & { id: string }

export function useResource() {
  const { resource } = useParams()
  return resources.find((r) => r.name === resource)
}

export function ResourceList() {
  const res = useResource()
  const [rows, setRows] = useState<Row[] | null>(null)
  const [err, setErr] = useState('')

  useEffect(() => {
    if (!res || !supabase) return
    setRows(null)
    supabase
      .from(res.name)
      .select('*')
      .order(res.orderBy.column, { ascending: res.orderBy.ascending })
      .then(({ data, error }) => {
        if (error) setErr(error.message)
        setRows((data as Row[]) ?? [])
      })
  }, [res])

  if (!res) return <p className="text-muted">Unknown section.</p>

  const togglePublished = async (row: Row) => {
    if (!supabase) return
    const published = !row.published
    setRows((rs) => rs?.map((r) => (r.id === row.id ? { ...r, published } : r)) ?? null)
    await supabase.from(res.name).update({ published }).eq('id', row.id)
    invalidateContent()
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-medium tracking-tight">{res.label}</h1>
          <p className="mt-1 text-muted">{res.description}</p>
        </div>
        <Link to={`/admin/${res.name}/new`} className="btn-primary">
          <Plus size={16} /> New {res.singular}
        </Link>
      </div>

      {err && <p className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">{err}</p>}

      {!rows ? (
        <Loader2 className="animate-spin text-muted" />
      ) : rows.length === 0 ? (
        <div className="card p-10 text-center text-muted">
          Nothing here yet. Create your first {res.singular}, or import the starter content from the Dashboard.
        </div>
      ) : (
        <div className="card divide-y divide-line overflow-hidden">
          {rows.map((r) => (
            <div key={r.id} className="flex items-center gap-4 px-5 py-4 transition hover:bg-surface/60">
              <Link to={`/admin/${res.name}/${r.id}`} className="min-w-0 flex-1">
                <p className="truncate font-medium">{String(r[res.titleField] ?? '(untitled)')}</p>
                <p className="truncate text-sm text-muted">{res.subtitle(r)}</p>
              </Link>
              <button
                onClick={() => togglePublished(r)}
                title={r.published ? 'Published, click to hide' : 'Hidden, click to publish'}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-wider ${
                  r.published ? 'bg-accent/15 text-accent-ink' : 'bg-surface text-muted'
                }`}
              >
                {r.published ? <Eye size={12} /> : <EyeOff size={12} />}
                {r.published ? 'Live' : 'Hidden'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function ResourceEditor() {
  const res = useResource()
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = id === 'new'
  const [values, setValues] = useState<Record<string, unknown> | null>(null)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)

  useEffect(() => {
    if (!res || !supabase) return
    if (isNew) {
      setValues({ ...res.defaults })
      return
    }
    supabase
      .from(res.name)
      .select('*')
      .eq('id', id)
      .maybeSingle()
      .then(({ data }) => setValues(data ?? {}))
  }, [res, id, isNew])

  if (!res) return <p className="text-muted">Unknown section.</p>
  if (!values) return <Loader2 className="animate-spin text-muted" />

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase) return
    setBusy(true)
    setMsg(null)
    const payload = cleanValues(res.fields, values)
    const q = isNew
      ? supabase.from(res.name).insert(payload).select('id').single()
      : supabase.from(res.name).update(payload).eq('id', id).select('id').single()
    const { data, error } = await q
    setBusy(false)
    if (error) return setMsg({ ok: false, text: error.message })
    invalidateContent()
    setMsg({ ok: true, text: 'Saved ✓' })
    if (isNew && data) navigate(`/admin/${res.name}/${data.id}`, { replace: true })
  }

  const remove = async () => {
    if (!supabase || isNew) return
    if (!confirm(`Delete this ${res.singular}? This cannot be undone.`)) return
    const { error } = await supabase.from(res.name).delete().eq('id', id)
    if (error) return setMsg({ ok: false, text: error.message })
    invalidateContent()
    navigate(`/admin/${res.name}`)
  }

  return (
    <form onSubmit={save}>
      <Link to={`/admin/${res.name}`} className="inline-flex items-center gap-2 text-sm text-muted hover:text-fg">
        <ArrowLeft size={15} /> {res.label}
      </Link>
      <div className="mb-8 mt-4 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-medium tracking-tight">
          {isNew ? `New ${res.singular}` : String(values[res.titleField] || `Edit ${res.singular}`)}
        </h1>
        <div className="flex items-center gap-2">
          {!isNew && (
            <button type="button" onClick={remove} className="btn-ghost !px-3 text-red-400">
              <Trash2 size={16} />
            </button>
          )}
          <button className="btn-primary" disabled={busy}>
            {busy ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save
          </button>
        </div>
      </div>

      {msg && (
        <p className={`mb-6 rounded-xl border p-3 text-sm ${msg.ok ? 'border-accent/30 bg-accent/10 text-accent-ink' : 'border-red-500/30 bg-red-500/10 text-red-400'}`}>
          {msg.text}
        </p>
      )}

      <div className="card grid gap-6 p-6 md:grid-cols-2 md:p-8">
        {res.fields.map((f) => (
          <FieldInput key={f.name} field={f} values={values} onChange={(k, v) => setValues((s) => ({ ...s, [k]: v }))} />
        ))}
      </div>

      <div className="sticky bottom-4 mt-6 flex justify-end">
        <button className="btn-primary shadow-2xl" disabled={busy}>
          {busy ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save {res.singular}
        </button>
      </div>
    </form>
  )
}
