import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import { seedCollections, seedProfile } from './seed'
import type { CollectionMap, CollectionName, Profile } from './types'

const cache = new Map<string, unknown>()
const inflight = new Map<string, Promise<unknown>>()

const orderFor = (name: CollectionName) =>
  name === 'posts' ? { column: 'published_at', ascending: false } : { column: 'sort_order', ascending: true }

async function fetchCollection<K extends CollectionName>(name: K): Promise<CollectionMap[K][]> {
  if (!supabase) return seedCollections[name] as CollectionMap[K][]
  const { column, ascending } = orderFor(name)
  const { data, error } = await supabase
    .from(name)
    .select('*')
    .eq('published', true)
    .order(column, { ascending })
  if (error) {
    console.error(`[content] ${name}:`, error.message)
    return seedCollections[name] as CollectionMap[K][]
  }
  return (data ?? []) as CollectionMap[K][]
}

async function fetchProfile(): Promise<Profile> {
  if (!supabase) return seedProfile
  const { data, error } = await supabase.from('profile').select('*').eq('id', 1).maybeSingle()
  if (error || !data) return seedProfile
  return { ...seedProfile, ...data, stats: Array.isArray(data.stats) ? data.stats : [] } as Profile
}

function load<T>(key: string, fn: () => Promise<T>): Promise<T> {
  if (!inflight.has(key)) {
    inflight.set(
      key,
      fn().then((v) => {
        cache.set(key, v)
        inflight.delete(key)
        return v
      }),
    )
  }
  return inflight.get(key) as Promise<T>
}

function useCached<T>(key: string, fn: () => Promise<T>, fallback: T) {
  const [data, setData] = useState<T>(() => (cache.get(key) as T) ?? fallback)
  const [loading, setLoading] = useState(!cache.has(key))
  useEffect(() => {
    let live = true
    load(key, fn).then((v) => {
      if (live) {
        setData(v)
        setLoading(false)
      }
    })
    return () => {
      live = false
    }
  }, [key]) // eslint-disable-line react-hooks/exhaustive-deps
  return { data, loading }
}

export function useProfile() {
  // Seed data is the first paint, so the page never looks empty.
  return useCached('profile', fetchProfile, seedProfile)
}

export function useCollection<K extends CollectionName>(name: K) {
  const fallback = (supabase ? [] : seedCollections[name]) as CollectionMap[K][]
  return useCached(name, () => fetchCollection(name), fallback)
}

/** Clears cached content after an admin edit. */
export function invalidateContent() {
  cache.clear()
}
