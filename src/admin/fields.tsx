import { useRef, useState } from 'react'
import { ImagePlus, Loader2, Plus, Trash2, Upload } from 'lucide-react'
import { uploadMedia } from '../lib/supabase'
import { cn, slugify } from '../lib/utils'
import { Markdown } from '../components/ui'
import type { Field } from './config'
import type { Stat } from '../lib/types'

type Values = Record<string, unknown>

export function FieldInput({
  field,
  values,
  onChange,
}: {
  field: Field
  values: Values
  onChange: (name: string, value: unknown) => void
}) {
  const v = values[field.name]
  const set = (val: unknown) => onChange(field.name, val)
  const id = `f-${field.name}`

  const control = (() => {
    switch (field.type) {
      case 'text':
      case 'url':
        return (
          <input id={id} className="input" type={field.type === 'url' ? 'url' : 'text'} required={field.required} value={(v as string) ?? ''} onChange={(e) => set(e.target.value)} />
        )
      case 'slug':
        return (
          <div className="flex gap-2">
            <input id={id} className="input font-mono" required={field.required} value={(v as string) ?? ''} onChange={(e) => set(slugify(e.target.value))} />
            <button type="button" className="btn-ghost shrink-0 !px-3 !py-2 text-xs" onClick={() => set(slugify(String(values[field.from ?? 'title'] ?? '')))}>
              Generate
            </button>
          </div>
        )
      case 'textarea':
        return <textarea id={id} className="input min-h-[90px]" value={(v as string) ?? ''} onChange={(e) => set(e.target.value)} />
      case 'number':
        return <input id={id} className="input" type="number" value={(v as number) ?? 0} onChange={(e) => set(Number(e.target.value))} />
      case 'date':
        return <input id={id} className="input" type="date" value={(v as string) ?? ''} onChange={(e) => set(e.target.value || null)} />
      case 'boolean':
        return (
          <button
            type="button"
            role="switch"
            aria-checked={!!v}
            onClick={() => set(!v)}
            className={cn('relative h-7 w-12 rounded-full border transition', v ? 'border-accent bg-accent' : 'border-line bg-surface')}
          >
            <span className={cn('absolute top-0.5 h-5 w-5 rounded-full transition-all', v ? 'left-6 bg-accent-fg' : 'left-0.5 bg-muted')} />
          </button>
        )
      case 'select':
        return (
          <select id={id} className="input" value={(v as string) ?? ''} onChange={(e) => set(e.target.value)}>
            {field.options?.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        )
      case 'tags':
        return <TagsInput value={(v as string[]) ?? []} onChange={set} />
      case 'lines':
        return (
          <textarea
            id={id}
            className="input min-h-[140px]"
            value={((v as string[]) ?? []).join('\n')}
            onChange={(e) => set(e.target.value.split('\n'))}
            placeholder="One item per line"
          />
        )
      case 'stats':
        return <StatsInput value={(v as Stat[]) ?? []} onChange={set} />
      case 'image':
      case 'file':
        return <MediaInput value={(v as string) ?? ''} onChange={set} kind={field.type} />
      case 'markdown':
        return <MarkdownInput value={(v as string) ?? ''} onChange={set} />
    }
  })()

  return (
    <div className={cn(field.full && 'md:col-span-2')}>
      <label className="label" htmlFor={id}>
        {field.label} {field.required && <span className="text-accent-ink">*</span>}
      </label>
      {control}
      {field.help && <p className="mt-1.5 text-xs text-muted/80">{field.help}</p>}
    </div>
  )
}

function TagsInput({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [draft, setDraft] = useState('')
  const add = () => {
    const parts = draft.split(',').map((s) => s.trim()).filter(Boolean)
    if (parts.length) onChange([...value, ...parts.filter((p) => !value.includes(p))])
    setDraft('')
  }
  return (
    <div className="input flex min-h-[48px] flex-wrap items-center gap-1.5 !py-2">
      {value.map((t) => (
        <span key={t} className="inline-flex items-center gap-1 rounded-full bg-surface px-2.5 py-1 text-xs">
          {t}
          <button type="button" onClick={() => onChange(value.filter((x) => x !== t))} className="text-muted hover:text-fg" aria-label={`Remove ${t}`}>
            ×
          </button>
        </span>
      ))}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()
            add()
          } else if (e.key === 'Backspace' && !draft && value.length) onChange(value.slice(0, -1))
        }}
        onBlur={add}
        placeholder={value.length ? '' : 'Type and press Enter'}
        className="min-w-[120px] flex-1 bg-transparent text-sm outline-none"
      />
    </div>
  )
}

function StatsInput({ value, onChange }: { value: Stat[]; onChange: (v: Stat[]) => void }) {
  const update = (i: number, k: keyof Stat, val: string) => onChange(value.map((s, j) => (j === i ? { ...s, [k]: val } : s)))
  return (
    <div className="space-y-2">
      {value.map((s, i) => (
        <div key={i} className="flex gap-2">
          <input className="input w-28" placeholder="Value" value={s.value} onChange={(e) => update(i, 'value', e.target.value)} />
          <input className="input flex-1" placeholder="Label" value={s.label} onChange={(e) => update(i, 'label', e.target.value)} />
          <button type="button" className="grid w-12 place-items-center rounded-xl border border-line text-muted hover:text-red-400" onClick={() => onChange(value.filter((_, j) => j !== i))} aria-label="Remove stat">
            <Trash2 size={15} />
          </button>
        </div>
      ))}
      <button type="button" className="btn-ghost !py-2 text-xs" onClick={() => onChange([...value, { value: '', label: '' }])}>
        <Plus size={14} /> Add stat
      </button>
    </div>
  )
}

function MediaInput({ value, onChange, kind }: { value: string; onChange: (v: string) => void; kind: 'image' | 'file' }) {
  const ref = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const upload = async (file?: File) => {
    if (!file) return
    setBusy(true)
    setErr('')
    try {
      onChange(await uploadMedia(file, kind === 'image' ? 'images' : 'files'))
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex items-start gap-3">
      {kind === 'image' && (
        <div className="grid h-[76px] w-[76px] shrink-0 place-items-center overflow-hidden rounded-xl border border-line bg-surface">
          {value ? <img src={value} alt="" className="h-full w-full object-cover" /> : <ImagePlus size={18} className="text-muted" />}
        </div>
      )}
      <div className="flex-1 space-y-2">
        <input className="input" value={value} onChange={(e) => onChange(e.target.value)} placeholder="Paste a URL or upload →" />
        <div className="flex gap-2">
          <button type="button" className="btn-ghost !py-2 text-xs" onClick={() => ref.current?.click()} disabled={busy}>
            {busy ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />} Upload
          </button>
          {value && (
            <button type="button" className="btn-ghost !py-2 text-xs" onClick={() => onChange('')}>
              Clear
            </button>
          )}
        </div>
        {err && <p className="text-xs text-red-400">{err}</p>}
        <input
          ref={ref}
          type="file"
          className="hidden"
          accept={kind === 'image' ? 'image/*' : 'application/pdf,image/*'}
          onChange={(e) => upload(e.target.files?.[0])}
        />
      </div>
    </div>
  )
}

function MarkdownInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [tab, setTab] = useState<'write' | 'preview'>('write')
  const [busy, setBusy] = useState(false)
  const taRef = useRef<HTMLTextAreaElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const insertImage = async (file?: File) => {
    if (!file) return
    setBusy(true)
    try {
      const url = await uploadMedia(file, 'images')
      const ta = taRef.current
      const pos = ta?.selectionStart ?? value.length
      const snippet = `\n![${file.name.replace(/\.[^.]+$/, '')}](${url})\n`
      onChange(value.slice(0, pos) + snippet + value.slice(pos))
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-line">
      <div className="flex items-center justify-between border-b border-line bg-surface/60 px-2 py-1.5">
        <div className="flex gap-1">
          {(['write', 'preview'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn('rounded-lg px-3 py-1 text-xs capitalize', tab === t ? 'bg-bg text-fg' : 'text-muted')}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden font-mono text-[10px] text-muted sm:inline">**bold** · ## heading · - list · [link](url)</span>
          <button type="button" onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-muted hover:text-fg" disabled={busy}>
            {busy ? <Loader2 size={13} className="animate-spin" /> : <ImagePlus size={13} />} Image
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => insertImage(e.target.files?.[0])} />
        </div>
      </div>
      {tab === 'write' ? (
        <textarea
          ref={taRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="block min-h-[320px] w-full resize-y bg-bg p-4 font-mono text-[13px] leading-relaxed outline-none"
          placeholder="Write in Markdown…"
        />
      ) : (
        <div className="min-h-[320px] bg-bg p-6">{value ? <Markdown>{value}</Markdown> : <p className="text-sm text-muted">Nothing to preview.</p>}</div>
      )}
    </div>
  )
}

/** Normalizes form values before saving to the database. */
export function cleanValues(fields: Field[], values: Values) {
  const out: Values = {}
  for (const f of fields) {
    let v = values[f.name]
    if (f.type === 'lines' || f.type === 'tags') v = ((v as string[]) ?? []).map((s) => s.trim()).filter(Boolean)
    if (f.type === 'stats') v = ((v as Stat[]) ?? []).filter((s) => s.value || s.label)
    if (f.type === 'date') v = v || null
    if (f.type === 'number') v = Number(v ?? 0)
    if (f.type === 'boolean') v = !!v
    out[f.name] = v ?? (['text', 'textarea', 'markdown', 'url', 'image', 'file', 'slug'].includes(f.type) ? '' : v)
  }
  return out
}
