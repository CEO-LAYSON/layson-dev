export type Stat = { value: string; label: string }

export type Profile = {
  id?: number
  name: string
  headline: string
  tagline: string
  bio: string
  location: string
  timezone: string
  email: string
  phone: string
  avatar_url: string
  avatar_alt_url: string
  cv_url: string
  github: string
  linkedin: string
  twitter: string
  tiktok: string
  available: boolean
  availability_text: string
  job_title: string
  company: string
  stats: Stat[]
}

type Base = { id: string; sort_order?: number; published?: boolean }

export type Experience = Base & {
  company: string
  role: string
  location: string
  kind: 'work' | 'internship' | 'project'
  start_date: string | null
  end_date: string | null
  summary: string
  highlights: string[]
  tech: string[]
}

export type Project = Base & {
  slug: string
  title: string
  summary: string
  content: string
  cover_url: string
  tech: string[]
  github_url: string
  live_url: string
  role: string
  year: string
  featured: boolean
}

export type Product = Base & {
  name: string
  tagline: string
  description: string
  url: string
  logo_url: string
  status: 'idea' | 'building' | 'beta' | 'live'
  price_text: string
}

export type Post = Base & {
  slug: string
  title: string
  excerpt: string
  content: string
  cover_url: string
  tags: string[]
  published_at: string
}

export type Skill = Base & { name: string; category: string }

export type Certification = Base & {
  title: string
  issuer: string
  issued_on: string | null
  url: string
  description: string
}

export type Service = Base & { title: string; description: string; price_text: string }

export type Message = {
  id: string
  name: string
  email: string
  subject: string
  body: string
  read: boolean
  created_at: string
}

export type CollectionMap = {
  experiences: Experience
  projects: Project
  products: Product
  posts: Post
  skills: Skill
  certifications: Certification
  services: Service
}

export type CollectionName = keyof CollectionMap
