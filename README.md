# layson.dev

Personal site and business hub for Layson Ndenza, built with **React + Vite + TypeScript + Tailwind + Supabase**.

- **Public site:** hero, about, experience, projects (with case-study pages), toolbox, SaaS "Lab", services, blog and contact form
- **Admin panel** at `/admin`: edit everything (profile, photos, CV, projects, blog posts, products, skills, services) and read messages
- **Command menu:** press `Ctrl K` anywhere on the site
- Dark and light themes, mobile-first, reduced-motion friendly

---

## Run it on your computer

```bash
npm install
npm run dev        # open http://localhost:5173
```

Without Supabase keys, the site runs on the **starter content** in `src/lib/seed.ts` (taken from your CV and GitHub).

---

## Step 1: Set up Supabase (your database, about 10 minutes)

1. Go to **supabase.com** → sign up → **New project**. Name it `layson-dev`, choose a strong database password, and pick the region closest to you (for example *West EU* or *South Africa*, if offered).
2. Open **SQL Editor → New query**, paste the whole of [`supabase/schema.sql`](supabase/schema.sql), then click **Run**.
3. Go to **Authentication → Users → Add user → Create new user**. Enter the email and password you'll log in with, and tick **Auto confirm user**.
4. Back in **SQL Editor**, run this line with that same email to make yourself the admin:
   ```sql
   insert into public.admins (user_id) select id from auth.users where email = 'YOUR-LOGIN-EMAIL';
   ```
5. **Authentication → Sign In / Providers →** turn **off** "Allow new users to sign up". (Only you need an account.)
6. **Project Settings → API**: copy the **Project URL** and the **anon public** key.
7. In this folder, copy `.env.example` to `.env.local` and paste both values in.
8. Run `npm run dev`, open `http://localhost:5173/admin`, sign in, then click **Import starter content**.

From then on, everything is editable from `/admin`.

---

## Step 2: Buy the domain `layson.dev`

`.dev` domains cost about **USD 12–15 per year**. Good registrars:

| Registrar | Why |
|---|---|
| **Cloudflare Registrar** (dash.cloudflare.com → Domain Registration) | Sells at cost with no markup, includes free DNS. Needs a card. |
| **Namecheap** / **Porkbun** | Simple to use. Namecheap also accepts PayPal. |

**Paying from Tanzania:** use a Visa or Mastercard **debit card** from your bank (enable online/international payments in your banking app), or a virtual card from your mobile-money provider if it offers one.

Search for `layson.dev`, buy it, and turn on **auto-renew** so you never lose it.

> `.dev` domains always require HTTPS. Vercel handles this for you automatically.

---

## Step 3: Put it online (Vercel, free)

1. Push this folder to a **GitHub** repo:
   ```bash
   git init && git add . && git commit -m "layson.dev v1"
   # create an empty repo on github.com, then:
   git remote add origin https://github.com/CEO-LAYSON/layson-dev.git
   git push -u origin main
   ```
2. Go to **vercel.com** → sign in with GitHub → **Add New → Project** → import `layson-dev`.
3. Under **Environment Variables**, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (the same values as in `.env.local`). Click **Deploy**.
4. **Project → Settings → Domains** → add `layson.dev` and `www.layson.dev`. Vercel will show you the DNS records to add.
5. At your registrar's DNS settings, add exactly the records Vercel shows. They are usually:
   - `A` record, name `@` → `76.76.21.21`
   - `CNAME` record, name `www` → `cname.vercel-dns.com`

   (If you use Cloudflare DNS, set these records to **DNS only**, which shows a grey cloud.)
6. Wait a few minutes to an hour, and https://layson.dev is live. 🎉

Every `git push` now redeploys the site automatically. Content changes made in `/admin` go live **instantly**, with no redeploy needed.

---

## Everyday use

| I want to… | Go to |
|---|---|
| Write a blog post | `/admin` → Blog posts → New (leave *Published* off to save a draft) |
| Add a project / case study | `/admin` → Projects → New (turn on *Featured* for a big card) |
| Launch a SaaS product | `/admin` → SaaS products → New (status: idea → building → beta → live) |
| Change photo, bio or CV | `/admin` → Profile (upload new files directly) |
| Update my job | `/admin` → Experience (leave *End date* empty for your current job) |
| Read messages | `/admin` → Messages |

Blog posts and case studies use **Markdown**: `## Heading`, `**bold**`, `- list`, `[link](https://…)`. Use the **Image** button in the editor to upload images inline, and the **Preview** tab to check how a post looks.

---

## Project structure

```
src/
  admin/        Admin panel (login, dashboard, generic editors, messages)
  components/   Navbar, Footer, Command menu, shared UI
  sections/     Homepage sections (Hero, About, Experience, Work, …)
  pages/        Home, Project page, Blog index, Blog post, 404
  lib/          Supabase client, content hooks, types, starter content
supabase/schema.sql   Tables + security rules (run once)
```

## Security notes

- Row Level Security is on for every table: the public can only **read published** content and **send** messages.
- Only users listed in `public.admins` can write. The anon key is safe to expose in the browser; never put the `service_role` key in this project.
