export const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function monthYear(d: string | null | undefined) {
  if (!d) return 'Present'
  const [y, m] = d.split('-').map(Number)
  return `${MONTHS[(m || 1) - 1]} ${y}`
}

export function longDate(d: string | null | undefined) {
  if (!d) return ''
  const [y, m, day] = d.split('-').map(Number)
  return `${MONTHS[(m || 1) - 1]} ${day || 1}, ${y}`
}

export function duration(start: string | null, end: string | null) {
  if (!start) return ''
  const s = new Date(start)
  const e = end ? new Date(end) : new Date()
  let months = (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth()) + 1
  months = Math.max(1, months)
  const y = Math.floor(months / 12)
  const m = months % 12
  return [y && `${y} yr${y > 1 ? 's' : ''}`, m && `${m} mo${m > 1 ? 's' : ''}`].filter(Boolean).join(' ')
}

export function readingTime(text: string) {
  return Math.max(1, Math.round(text.trim().split(/\s+/).length / 220))
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

/** Deterministic hue from a string (used for generated project covers). */
export function hashString(s: string) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return Math.abs(h)
}
