import type { CollectionName } from '../lib/types'

export type FieldType =
  | 'text'
  | 'textarea'
  | 'markdown'
  | 'image'
  | 'file'
  | 'url'
  | 'date'
  | 'boolean'
  | 'number'
  | 'select'
  | 'tags'
  | 'lines'
  | 'stats'
  | 'slug'

export type Field = {
  name: string
  label: string
  type: FieldType
  required?: boolean
  help?: string
  options?: string[]
  /** for 'slug': which field to generate from */
  from?: string
  /** layout: take the full row width */
  full?: boolean
}

export type Resource = {
  name: CollectionName
  label: string
  singular: string
  description: string
  titleField: string
  subtitle: (row: Record<string, unknown>) => string
  orderBy: { column: string; ascending: boolean }
  fields: Field[]
  defaults: Record<string, unknown>
}

const order: Field = { name: 'sort_order', label: 'Order (lower shows first)', type: 'number' }
const published: Field = { name: 'published', label: 'Published (visible on site)', type: 'boolean' }

export const resources: Resource[] = [
  {
    name: 'projects',
    label: 'Projects',
    singular: 'project',
    description: 'Case studies shown in “Selected work”.',
    titleField: 'title',
    subtitle: (r) => [r.year, (r.tech as string[])?.slice(0, 3).join(', ')].filter(Boolean).join(' · '),
    orderBy: { column: 'sort_order', ascending: true },
    defaults: { tech: [], featured: false, published: true, sort_order: 10 },
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'slug', label: 'URL slug', type: 'slug', from: 'title', required: true, help: 'layson.dev/projects/<slug>' },
      { name: 'summary', label: 'Summary (1–2 sentences)', type: 'textarea', full: true },
      { name: 'cover_url', label: 'Cover image', type: 'image', full: true, help: 'Optional. Without one, a cover is generated.' },
      { name: 'content', label: 'Case study', type: 'markdown', full: true },
      { name: 'tech', label: 'Tech stack', type: 'tags' },
      { name: 'role', label: 'Your role', type: 'text' },
      { name: 'year', label: 'Year', type: 'text' },
      { name: 'github_url', label: 'GitHub URL', type: 'url' },
      { name: 'live_url', label: 'Live URL', type: 'url' },
      { name: 'featured', label: 'Featured (large card)', type: 'boolean' },
      order,
      published,
    ],
  },
  {
    name: 'posts',
    label: 'Blog posts',
    singular: 'post',
    description: 'Articles shown on /blog. Leave “Published” off to keep a draft.',
    titleField: 'title',
    subtitle: (r) => `${r.published ? 'Published' : 'Draft'} · ${r.published_at ?? ''}`,
    orderBy: { column: 'published_at', ascending: false },
    defaults: { tags: [], published: false, published_at: new Date().toISOString().slice(0, 10) },
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'slug', label: 'URL slug', type: 'slug', from: 'title', required: true, help: 'layson.dev/blog/<slug>' },
      { name: 'excerpt', label: 'Excerpt', type: 'textarea', full: true },
      { name: 'cover_url', label: 'Cover image', type: 'image', full: true },
      { name: 'content', label: 'Content', type: 'markdown', full: true },
      { name: 'tags', label: 'Tags', type: 'tags' },
      { name: 'published_at', label: 'Publish date', type: 'date' },
      published,
    ],
  },
  {
    name: 'experiences',
    label: 'Experience',
    singular: 'experience',
    description: 'Jobs, internships and major projects on your timeline.',
    titleField: 'company',
    subtitle: (r) => `${r.role ?? ''} · ${r.start_date ?? ''} → ${r.end_date ?? 'Present'}`,
    orderBy: { column: 'sort_order', ascending: true },
    defaults: { kind: 'work', highlights: [], tech: [], published: true, sort_order: 0 },
    fields: [
      { name: 'company', label: 'Company', type: 'text', required: true },
      { name: 'role', label: 'Role / title', type: 'text', required: true },
      { name: 'location', label: 'Location', type: 'text' },
      { name: 'kind', label: 'Type', type: 'select', options: ['work', 'internship', 'project'] },
      { name: 'start_date', label: 'Start date', type: 'date' },
      { name: 'end_date', label: 'End date', type: 'date', help: 'Leave empty if you still work here' },
      { name: 'summary', label: 'One-line summary', type: 'textarea', full: true },
      { name: 'highlights', label: 'Highlights (one per line)', type: 'lines', full: true },
      { name: 'tech', label: 'Tech', type: 'tags' },
      order,
      published,
    ],
  },
  {
    name: 'products',
    label: 'SaaS products',
    singular: 'product',
    description: 'Your products, shown in “The Lab”.',
    titleField: 'name',
    subtitle: (r) => `${r.status ?? ''} · ${r.url ?? ''}`,
    orderBy: { column: 'sort_order', ascending: true },
    defaults: { status: 'building', published: true, sort_order: 0 },
    fields: [
      { name: 'name', label: 'Product name', type: 'text', required: true },
      { name: 'tagline', label: 'Tagline', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea', full: true },
      { name: 'logo_url', label: 'Logo', type: 'image', full: true },
      { name: 'url', label: 'Product URL', type: 'url', help: 'e.g. https://stock.layson.dev' },
      { name: 'status', label: 'Status', type: 'select', options: ['idea', 'building', 'beta', 'live'] },
      { name: 'price_text', label: 'Pricing text', type: 'text', help: 'e.g. From TSh 25,000 / month' },
      order,
      published,
    ],
  },
  {
    name: 'services',
    label: 'Services',
    singular: 'service',
    description: 'What clients can hire you for.',
    titleField: 'title',
    subtitle: (r) => String(r.price_text ?? ''),
    orderBy: { column: 'sort_order', ascending: true },
    defaults: { published: true, sort_order: 0 },
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'price_text', label: 'Pricing text', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea', full: true },
      order,
      published,
    ],
  },
  {
    name: 'skills',
    label: 'Skills',
    singular: 'skill',
    description: 'Shown in the scrolling marquee and the Toolbox.',
    titleField: 'name',
    subtitle: (r) => String(r.category ?? ''),
    orderBy: { column: 'category', ascending: true },
    defaults: { category: 'Languages', published: true, sort_order: 0 },
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'category', label: 'Category', type: 'select', options: ['Languages', 'Frameworks', 'Infrastructure', 'Data', 'Other'] },
      order,
      published,
    ],
  },
  {
    name: 'certifications',
    label: 'Certifications',
    singular: 'certification',
    description: 'Courses and certificates.',
    titleField: 'title',
    subtitle: (r) => `${r.issuer ?? ''} · ${r.issued_on ?? ''}`,
    orderBy: { column: 'sort_order', ascending: true },
    defaults: { published: true, sort_order: 0 },
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'issuer', label: 'Issuer', type: 'text' },
      { name: 'issued_on', label: 'Date', type: 'date' },
      { name: 'url', label: 'Credential URL', type: 'url' },
      { name: 'description', label: 'Description', type: 'textarea', full: true },
      order,
      published,
    ],
  },
]

export const profileFields: Field[] = [
  { name: 'name', label: 'Full name', type: 'text', required: true },
  { name: 'headline', label: 'Headline', type: 'text', help: 'e.g. Software Engineer' },
  { name: 'tagline', label: 'Tagline (hero sentence)', type: 'textarea', full: true },
  { name: 'job_title', label: 'Current job title', type: 'text' },
  { name: 'company', label: 'Current company', type: 'text' },
  { name: 'available', label: 'Show “available” badge', type: 'boolean' },
  { name: 'availability_text', label: 'Availability text', type: 'text' },
  { name: 'bio', label: 'About me', type: 'markdown', full: true },
  { name: 'stats', label: 'Stats (About section)', type: 'stats', full: true },
  { name: 'avatar_url', label: 'Main photo (hero)', type: 'image' },
  { name: 'avatar_alt_url', label: 'Second photo (about)', type: 'image' },
  { name: 'cv_url', label: 'CV (PDF)', type: 'file', full: true },
  { name: 'location', label: 'Location', type: 'text' },
  { name: 'timezone', label: 'Timezone', type: 'text', help: 'IANA name, e.g. Africa/Dar_es_Salaam' },
  { name: 'email', label: 'Public email', type: 'text' },
  { name: 'phone', label: 'Phone', type: 'text' },
  { name: 'github', label: 'GitHub URL', type: 'url' },
  { name: 'linkedin', label: 'LinkedIn URL', type: 'url' },
  { name: 'twitter', label: 'X / Twitter URL', type: 'url' },
  { name: 'tiktok', label: 'TikTok URL', type: 'url' },
]
