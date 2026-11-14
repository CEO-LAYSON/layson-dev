-- =====================================================================
--  layson.dev — database schema
--  Run this whole file once in: Supabase → SQL Editor → New query → Run
-- =====================================================================

-- ---------- Admins (only these users can edit content) ---------------
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.admins enable row level security;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

drop policy if exists "admins read self" on public.admins;
create policy "admins read self" on public.admins for select using (user_id = auth.uid());

-- ---------- Profile (single row, id = 1) -----------------------------
create table if not exists public.profile (
  id int primary key default 1 check (id = 1),
  name text not null default '',
  headline text default '',
  tagline text default '',
  bio text default '',
  location text default '',
  timezone text default 'Africa/Dar_es_Salaam',
  email text default '',
  phone text default '',
  avatar_url text default '',
  avatar_alt_url text default '',
  cv_url text default '',
  github text default '',
  linkedin text default '',
  twitter text default '',
  tiktok text default '',
  available boolean default true,
  availability_text text default '',
  job_title text default '',
  company text default '',
  stats jsonb default '[]'::jsonb,
  updated_at timestamptz default now()
);

-- ---------- Collections ---------------------------------------------
create table if not exists public.experiences (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  role text not null,
  location text default '',
  kind text default 'work',          -- work | internship | project
  start_date date,
  end_date date,                     -- null = present
  summary text default '',
  highlights text[] default '{}',
  tech text[] default '{}',
  sort_order int default 0,
  published boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  summary text default '',
  content text default '',           -- markdown case study
  cover_url text default '',
  tech text[] default '{}',
  github_url text default '',
  live_url text default '',
  role text default '',
  year text default '',
  featured boolean default false,
  sort_order int default 0,
  published boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  tagline text default '',
  description text default '',
  url text default '',
  logo_url text default '',
  status text default 'building',    -- idea | building | beta | live
  price_text text default '',
  sort_order int default 0,
  published boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text default '',
  content text default '',           -- markdown
  cover_url text default '',
  tags text[] default '{}',
  published_at date default current_date,
  published boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text default 'Other',
  sort_order int default 0,
  published boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.certifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text default '',
  issued_on date,
  url text default '',
  description text default '',
  sort_order int default 0,
  published boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text default '',
  price_text text default '',
  sort_order int default 0,
  published boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text default '',
  body text not null,
  read boolean default false,
  created_at timestamptz default now()
);

-- ---------- Row Level Security --------------------------------------
-- Public: read published content.  Admin: full control.
do $$
declare t text;
begin
  foreach t in array array['experiences','projects','products','posts','skills','certifications','services'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "public read" on public.%I', t);
    execute format('create policy "public read" on public.%I for select using (published or public.is_admin())', t);
    execute format('drop policy if exists "admin write" on public.%I', t);
    execute format('create policy "admin write" on public.%I for all using (public.is_admin()) with check (public.is_admin())', t);
  end loop;
end $$;

alter table public.profile enable row level security;
drop policy if exists "public read" on public.profile;
create policy "public read" on public.profile for select using (true);
drop policy if exists "admin write" on public.profile;
create policy "admin write" on public.profile for all using (public.is_admin()) with check (public.is_admin());

-- Messages: anyone can send, only admin can read/manage
alter table public.messages enable row level security;
drop policy if exists "anyone can send" on public.messages;
create policy "anyone can send" on public.messages for insert with check (
  char_length(body) between 1 and 5000 and char_length(email) < 200 and char_length(name) < 200
);
drop policy if exists "admin manage" on public.messages;
create policy "admin manage" on public.messages for all using (public.is_admin()) with check (public.is_admin());

-- ---------- Storage bucket for images, CV, etc. ---------------------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "media public read" on storage.objects;
create policy "media public read" on storage.objects for select using (bucket_id = 'media');
drop policy if exists "media admin write" on storage.objects;
create policy "media admin write" on storage.objects for insert with check (bucket_id = 'media' and public.is_admin());
drop policy if exists "media admin update" on storage.objects;
create policy "media admin update" on storage.objects for update using (bucket_id = 'media' and public.is_admin());
drop policy if exists "media admin delete" on storage.objects;
create policy "media admin delete" on storage.objects for delete using (bucket_id = 'media' and public.is_admin());

-- =====================================================================
--  AFTER creating your login user (Authentication → Users → Add user),
--  run this ONE line to make yourself the admin (use your real email):
--
--  insert into public.admins (user_id)
--  select id from auth.users where email = 'YOUR-LOGIN-EMAIL';
-- =====================================================================
