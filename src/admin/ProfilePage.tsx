import { useEffect, useState } from 'react'
import { Loader2, Save } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { invalidateContent } from '../lib/content'
import { seedProfile } from '../lib/seed'
import { profileFields } from './config'
import { cleanValues, FieldInput } from './fields'

export default function ProfilePage() {
  const [values, setValues] = useState<Record<string, unknown> | null>(null)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)

  useEffect(() => {
    supabase
      ?.from('profile')
      .select('*')
      .eq('id', 1)
      .maybeSingle()
      .then(({ data }) => setValues(data ?? { ...seedProfile }))
  }, [])

  if (!values) return <Loader2 className="animate-spin text-muted" />

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase) return
    setBusy(true)
    const payload = { id: 1, ...cleanValues(profileFields, values), updated_at: new Date().toISOString() }
    const { error } = await supabase.from('profile').upsert(payload)
    setBusy(false)
    setMsg(error ? { ok: false, text: error.message } : { ok: true, text: 'Profile saved ✓' })
    if (!error) invalidateContent()
  }

  return (
    <form onSubmit={save}>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-medium tracking-tight">Profile</h1>
          <p className="mt-1 text-muted">Your name, photos, bio, CV and links: everything about you.</p>
        </div>
        <button className="btn-primary" disabled={busy}>
          {busy ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save profile
        </button>
      </div>
      {msg && (
        <p className={`mb-6 rounded-xl border p-3 text-sm ${msg.ok ? 'border-accent/30 bg-accent/10 text-accent-ink' : 'border-red-500/30 bg-red-500/10 text-red-400'}`}>
          {msg.text}
        </p>
      )}
      <div className="card grid gap-6 p-6 md:grid-cols-2 md:p-8">
        {profileFields.map((f) => (
          <FieldInput key={f.name} field={f} values={values} onChange={(k, v) => setValues((s) => ({ ...s, [k]: v }))} />
        ))}
      </div>
      <div className="sticky bottom-4 mt-6 flex justify-end">
        <button className="btn-primary shadow-2xl" disabled={busy}>
          {busy ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save profile
        </button>
      </div>
    </form>
  )
}
