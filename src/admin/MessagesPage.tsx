import { useEffect, useState } from 'react'
import { Loader2, Mail, Trash2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { cn } from '../lib/utils'
import type { Message } from '../lib/types'

export default function MessagesPage() {
  const [rows, setRows] = useState<Message[] | null>(null)
  const [openId, setOpenId] = useState<string | null>(null)

  useEffect(() => {
    supabase
      ?.from('messages')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => setRows((data as Message[]) ?? []))
  }, [])

  const open = async (m: Message) => {
    setOpenId(openId === m.id ? null : m.id)
    if (!m.read && supabase) {
      setRows((rs) => rs?.map((r) => (r.id === m.id ? { ...r, read: true } : r)) ?? null)
      await supabase.from('messages').update({ read: true }).eq('id', m.id)
    }
  }

  const remove = async (id: string) => {
    if (!supabase || !confirm('Delete this message?')) return
    await supabase.from('messages').delete().eq('id', id)
    setRows((rs) => rs?.filter((r) => r.id !== id) ?? null)
  }

  return (
    <div>
      <h1 className="text-3xl font-medium tracking-tight">Messages</h1>
      <p className="mb-8 mt-1 text-muted">What people send through your contact form.</p>
      {!rows ? (
        <Loader2 className="animate-spin text-muted" />
      ) : rows.length === 0 ? (
        <div className="card p-10 text-center text-muted">No messages yet. They’ll appear here.</div>
      ) : (
        <div className="card divide-y divide-line overflow-hidden">
          {rows.map((m) => (
            <div key={m.id}>
              <button onClick={() => open(m)} className="flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-surface/60">
                <span className={cn('h-2 w-2 shrink-0 rounded-full', m.read ? 'bg-transparent' : 'bg-accent')} />
                <span className="min-w-0 flex-1">
                  <span className={cn('block truncate', !m.read && 'font-semibold')}>
                    {m.name} <span className="font-normal text-muted">· {m.subject || 'No subject'}</span>
                  </span>
                  <span className="block truncate text-sm text-muted">{m.body}</span>
                </span>
                <span className="shrink-0 font-mono text-[11px] text-muted">{new Date(m.created_at).toLocaleDateString()}</span>
              </button>
              {openId === m.id && (
                <div className="border-t border-line bg-surface/40 px-5 py-6 sm:px-11">
                  <p className="font-mono text-xs text-muted">{m.email}</p>
                  <p className="mt-4 whitespace-pre-wrap leading-relaxed">{m.body}</p>
                  <div className="mt-6 flex gap-2">
                    <a href={`mailto:${m.email}?subject=${encodeURIComponent('Re: ' + (m.subject || 'your message'))}`} className="btn-primary !py-2 text-xs">
                      <Mail size={14} /> Reply
                    </a>
                    <button onClick={() => remove(m.id)} className="btn-ghost !py-2 text-xs text-red-400">
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
