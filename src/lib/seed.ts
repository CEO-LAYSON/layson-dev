/**
 * Starter content, taken from Layson's CV and GitHub.
 * The site shows this until Supabase is connected. After that, use
 * Admin → Dashboard → "Import starter content" to copy it into the
 * database, then edit everything from the admin panel.
 */
import type {
  Certification,
  CollectionMap,
  Experience,
  Post,
  Product,
  Profile,
  Project,
  Service,
  Skill,
} from './types'

export const seedProfile: Profile = {
  name: 'Layson Ndenza',
  headline: 'Software Engineer',
  tagline:
    'I build secure, scalable software, from core banking integrations to products people pay for.',
  bio: `I'm a software engineer based in **Dar es Salaam, Tanzania**. By day I build enterprise banking software at **Exim Bank**: Spring Boot microservices and integrations that connect Core Banking, Loan Management, Credit/Limit and Collateral systems, taken from development through UAT to production.

Before that I built inventory and business systems for pharmacies, auto workshops, butcheries and LPG distributors at Softlink Group. As an intern at Azania Bank I built a change-request management system the bank still uses today.

I care about software that holds up under load and at 3 a.m. when something breaks: clean APIs, solid data models and systems I can explain. In the evenings I build SaaS products for East African businesses and sharpen my fundamentals so I can work on problems at global scale.`,
  location: 'Dar es Salaam, Tanzania',
  timezone: 'Africa/Dar_es_Salaam',
  email: 'laysonndenza@gmail.com',
  phone: '+255 759 907 751',
  avatar_url: '/images/layson-formal.png',
  avatar_alt_url: '/images/layson-casual.png',
  cv_url: '/cv/Layson_Ndenza_CV.pdf',
  github: 'https://github.com/CEO-LAYSON',
  linkedin: 'https://www.linkedin.com/in/layson-ndenza-3399b8321/',
  twitter: '',
  tiktok: '',
  available: true,
  availability_text: 'Open to global opportunities',
  job_title: 'Software Engineer',
  company: 'Exim Bank',
  stats: [
    { value: '2', label: 'Banks I have built software for' },
    { value: '4+', label: 'Industries shipped to' },
    { value: '20+', label: 'Public repositories' },
  ],
}

export const seedExperiences: Experience[] = [
  {
    id: 'exp-exim',
    company: 'Exim Bank',
    role: 'Software Engineer · Full Stack',
    location: 'Dar es Salaam',
    kind: 'work',
    start_date: '2026-05-01',
    end_date: null,
    summary: 'Enterprise banking applications and integrations across critical systems.',
    highlights: [
      'Develop and maintain secure, scalable banking applications with Java, Spring Boot and modern frontend technologies.',
      'Design and integrate microservices and RESTful APIs for reliable communication across banking platforms.',
      'Integrate and support Core Banking, Loan Management (LMS), Credit/Limit Management and Collateral Management systems.',
      'Own delivery across Dev, UAT, Pre-Production and Production, including deployment, log analysis and production support.',
    ],
    tech: ['Java', 'Spring Boot', 'Microservices', 'REST', 'SQL'],
    sort_order: 1,
    published: true,
  },
  {
    id: 'exp-softlink',
    company: 'Softlink Group',
    role: 'Full Stack Software Developer',
    location: 'Dar es Salaam',
    kind: 'work',
    start_date: '2025-08-01',
    end_date: '2026-04-30',
    summary: 'Custom inventory and business management systems for SMEs.',
    highlights: [
      'Built inventory and business systems for pharmacies, auto workshops, butcheries and LPG gas distributors.',
      'Implemented inventory, sales, purchasing and reporting modules with automated stock tracking.',
      'Built role-based access control so each business could run its operations reliably.',
    ],
    tech: ['Laravel', 'PHP', 'MySQL', 'JavaScript'],
    sort_order: 2,
    published: true,
  },
  {
    id: 'exp-azania',
    company: 'Azania Bank PLC',
    role: 'Software Developer · Intern',
    location: 'Dar es Salaam HQ',
    kind: 'internship',
    start_date: '2024-07-01',
    end_date: '2024-09-30',
    summary: 'Built an internal system the bank still uses.',
    highlights: [
      'Built the Internal Systems Change Request Management System, which the bank still uses.',
      'Streamlined internal reporting and system maintenance processes with the IT team.',
    ],
    tech: ['Laravel', 'PHP', 'MySQL'],
    sort_order: 3,
    published: true,
  },
  {
    id: 'exp-tcaa',
    company: 'Tanzania Civil Aviation Authority',
    role: 'Software Developer · Intern',
    location: 'Dar es Salaam',
    kind: 'internship',
    start_date: '2023-07-01',
    end_date: '2023-09-30',
    summary: 'My first team-based engineering experience.',
    highlights: [
      'Developed a student portal in PHP, the first of its kind at the authority.',
      'Adopted Git for version control in a collaborative team.',
    ],
    tech: ['PHP', 'Git'],
    sort_order: 4,
    published: true,
  },
]

export const seedProjects: Project[] = [
  {
    id: 'prj-nbts',
    slug: 'national-blood-transfusion-platform',
    title: 'National Blood Transfusion Platform',
    summary:
      'A centralized microservices platform to modernize blood donation operations across Tanzania: donors, appointments, stock and inter-zone coordination.',
    content: `## The problem

Blood transfusion services in Tanzania coordinate donors, blood banks and hospitals across several zones. Records and stock levels were spread across systems, which made it hard to know where blood was available and to match supply with demand quickly.

## What I built

A **centralized, event-driven platform** made of Spring Boot microservices:

- **Donor registration** and profile management
- **Appointment scheduling** through a dedicated donor app
- **Real-time blood stock tracking** per zone and blood group
- **Inter-zone coordination**, so zones can request and transfer stock

## Architecture

- **Spring Boot** microservices, each owning its data in **PostgreSQL**
- **Apache Kafka** for asynchronous events between services (stock changes, appointment events)
- **Docker** images orchestrated with **Kubernetes** for availability and horizontal scaling
- **React.js** dashboard for zone administrators

## What I learned

Designing service boundaries, handling eventual consistency between services, and running a distributed system locally and in a cluster.

*Final year project, BSc Software Engineering, University of Dodoma (2025).*`,
    cover_url: '',
    tech: ['Spring Boot', 'Kafka', 'Kubernetes', 'Docker', 'PostgreSQL', 'React'],
    github_url: 'https://github.com/CEO-LAYSON/national-blood-management-system',
    live_url: '',
    role: 'Backend & architecture',
    year: '2025',
    featured: true,
    sort_order: 1,
    published: true,
  },
  {
    id: 'prj-crms',
    slug: 'change-request-management-system',
    title: 'Change Request Management System',
    summary:
      'An internal platform for raising, approving and tracking changes to bank systems. Built as an intern at Azania Bank, and still in use.',
    content: `## Context

Changes to the bank's internal systems were requested and tracked by hand, which slowed down reporting and made audits harder.

## What I built

A **Laravel** application where staff submit change requests that move through an approval workflow, with a clear history and status for every change.

## Impact

The bank still uses the system for its internal change management.`,
    cover_url: '',
    tech: ['Laravel', 'PHP', 'MySQL'],
    github_url: '',
    live_url: '',
    role: 'Full-stack developer',
    year: '2024',
    featured: true,
    sort_order: 2,
    published: true,
  },
  {
    id: 'prj-nbts-app',
    slug: 'donor-appointment-app',
    title: 'Donor Appointment App',
    summary:
      'The donor-facing app for the national blood platform. Donors book, reschedule and track their donation appointments.',
    content: `The donor-facing companion to the National Blood Transfusion Platform. Donors can book and manage appointments at their nearest zone.`,
    cover_url: '',
    tech: ['Mobile', 'REST APIs'],
    github_url: 'https://github.com/CEO-LAYSON/nbts-appointmentapp',
    live_url: '',
    role: 'Developer',
    year: '2025',
    featured: false,
    sort_order: 3,
    published: true,
  },
  {
    id: 'prj-branches',
    slug: 'bank-branches-management-api',
    title: 'Bank Branches Management API',
    summary: 'REST APIs for managing a bank’s branch network, built with Spring Boot.',
    content: `REST APIs for creating, updating and querying a bank's branches, built with **Spring Boot** and a layered architecture.`,
    cover_url: '',
    tech: ['Java', 'Spring Boot', 'REST'],
    github_url: 'https://github.com/CEO-LAYSON/Bank-branches-management-backend',
    live_url: '',
    role: 'Backend developer',
    year: '2025',
    featured: false,
    sort_order: 4,
    published: true,
  },
  {
    id: 'prj-bifx',
    slug: 'bifx-forex-learning-platform',
    title: 'BIFX: Forex E-learning Platform',
    summary: 'A web platform for forex trading education, with courses and learner flows.',
    content: `A forex trading e-learning web application.`,
    cover_url: '',
    tech: ['JavaScript', 'React'],
    github_url: 'https://github.com/CEO-LAYSON/bifx-web',
    live_url: '',
    role: 'Frontend developer',
    year: '2026',
    featured: false,
    sort_order: 5,
    published: true,
  },
  {
    id: 'prj-ec2',
    slug: 'containerized-deployment-on-aws-ec2',
    title: 'Containerized Deployment on AWS EC2',
    summary: 'Shipping a Dockerized API to AWS EC2, from container build to a running cloud service.',
    content: `Containerizing an API with **Docker** and deploying it to **AWS EC2**.`,
    cover_url: '',
    tech: ['AWS EC2', 'Docker', 'Linux', 'TypeScript'],
    github_url: 'https://github.com/CEO-LAYSON/EC2-DOCKER-PROJECT',
    live_url: '',
    role: 'Developer',
    year: '2025',
    featured: false,
    sort_order: 6,
    published: true,
  },
  {
    id: 'prj-wallet',
    slug: 'wallet-app',
    title: 'Wallet App',
    summary: 'A cross-platform mobile wallet app built with Flutter.',
    content: `A mobile wallet app built with **Flutter** and **Dart**.`,
    cover_url: '',
    tech: ['Flutter', 'Dart'],
    github_url: 'https://github.com/CEO-LAYSON/wallet_app',
    live_url: '',
    role: 'Mobile developer',
    year: '2026',
    featured: false,
    sort_order: 7,
    published: true,
  },
]

export const seedProducts: Product[] = []

export const seedServices: Service[] = [
  {
    id: 'svc-web',
    title: 'Web applications',
    description: 'Fast, secure web apps and dashboards built with React, Spring Boot or Laravel.',
    price_text: '',
    sort_order: 1,
    published: true,
  },
  {
    id: 'svc-business',
    title: 'Business systems',
    description: 'Inventory, sales, POS and reporting systems built around how your business actually runs.',
    price_text: '',
    sort_order: 2,
    published: true,
  },
  {
    id: 'svc-mobile',
    title: 'Mobile apps',
    description: 'Cross-platform Android and iOS apps with Flutter, from one codebase.',
    price_text: '',
    sort_order: 3,
    published: true,
  },
  {
    id: 'svc-api',
    title: 'APIs & integrations',
    description: 'REST APIs, microservices and integrations with payment and enterprise systems.',
    price_text: '',
    sort_order: 4,
    published: true,
  },
]

const skill = (name: string, category: string, i: number): Skill => ({
  id: `sk-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
  name,
  category,
  sort_order: i,
  published: true,
})

export const seedSkills: Skill[] = [
  ...['Java', 'JavaScript', 'TypeScript', 'Python', 'Dart', 'PHP', 'SQL'].map((n, i) => skill(n, 'Languages', i)),
  ...['Spring Boot', 'React', 'Vue.js', 'Node.js', 'Laravel', 'Flutter'].map((n, i) => skill(n, 'Frameworks', i)),
  ...['Docker', 'Kubernetes', 'Kafka', 'AWS EC2', 'Linux', 'Git'].map((n, i) => skill(n, 'Infrastructure', i)),
  ...['PostgreSQL', 'MySQL', 'Supabase'].map((n, i) => skill(n, 'Data', i)),
]

export const seedCertifications: Certification[] = [
  {
    id: 'cert-flutter',
    title: 'Flutter & Dart: The Complete Guide (2025 Edition)',
    issuer: 'Udemy',
    issued_on: '2025-04-01',
    url: '',
    description: 'Cross-platform app development, state management, UI design and Firebase integration.',
    sort_order: 1,
    published: true,
  },
]

export const seedPosts: Post[] = [
  {
    id: 'post-hello',
    slug: 'building-in-public',
    title: 'Building in public, from Dar es Salaam',
    excerpt: 'Why I started this site, and what I plan to share here.',
    content: `I write software for a bank by day. In the evenings I build my own products and work on my fundamentals.

This site is where I'll share that work in public:

- **Engineering notes** from building banking-grade systems with Spring Boot and microservices
- **Build logs** for the SaaS products I'm creating for East African businesses
- **What I'm learning**: data structures, algorithms and system design

Writing things down forces me to understand them, and it might help someone else on the same path.

Karibu, and welcome.`,
    cover_url: '',
    tags: ['journey', 'career'],
    published_at: '2026-11-15',
    sort_order: 0,
    published: true,
  },
]

export const seedCollections: { [K in keyof CollectionMap]: CollectionMap[K][] } = {
  experiences: seedExperiences,
  projects: seedProjects,
  products: seedProducts,
  posts: seedPosts,
  skills: seedSkills,
  certifications: seedCertifications,
  services: seedServices,
}
