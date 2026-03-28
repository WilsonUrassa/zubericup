# ⚽ Zuberi Cup 2025 — Full-Stack Website

> Mchuano wa Kilimanjaro · Next.js 14 + Supabase + Vercel

---

## 🗂 Project Structure

```
zubericup/
├── src/
│   ├── app/
│   │   ├── page.tsx              ← Home page (SSR)
│   │   ├── layout.tsx            ← Root layout
│   │   ├── globals.css           ← All styles
│   │   ├── makundi/page.tsx      ← Standings page (auto-calculated)
│   │   ├── meya/page.tsx         ← About the Mayor
│   │   ├── jazafomu/page.tsx     ← Team registration form
│   │   └── api/
│   │       ├── admin/route.ts    ← Login → issues signed JWT token
│   │       ├── matches/route.ts  ← GET all / POST new match
│   │       ├── matches/[id]/route.ts  ← PATCH / DELETE match
│   │       ├── scorers/route.ts  ← POST add goal / DELETE remove
│   │       └── registrations/route.ts ← POST team registration
│   ├── components/
│   │   ├── Nav.tsx               ← Fixed navbar + mobile menu
│   │   ├── Hero.tsx              ← Landing hero section
│   │   ├── LiveMatches.tsx       ← Realtime match cards (client)
│   │   ├── AdminPanel.tsx        ← Full admin panel (client)
│   │   ├── HomeClient.tsx        ← Home page client shell
│   │   └── Footer.tsx            ← Footer
│   └── lib/
│       ├── supabase.ts           ← Public Supabase client + types
│       └── supabase-server.ts    ← Service role client (server only)
├── supabase/
│   └── schema.sql               ← ⭐ Run this in Supabase SQL Editor first!
├── .env.example                  ← Copy to .env.local and fill in
└── README.md
```

---

## 🚀 Setup in 5 Steps

### Step 1 — Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) → **New Project**
2. Name it `zubericup`, choose a region close to Tanzania (e.g. **EU West**)
3. Set a strong database password
4. Wait ~2 minutes for the project to start

### Step 2 — Run the Database Schema

1. In your Supabase dashboard → **SQL Editor** → **New Query**
2. Paste the entire contents of `supabase/schema.sql`
3. Click **Run** (▶)
4. You should see tables created + seed data inserted

### Step 3 — Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in the values from your Supabase project (**Settings → API**):

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
ADMIN_PASSWORD=zuberi2025
ADMIN_SESSION_SECRET=pick-any-long-random-string-here-32chars
```

> ⚠️ **Never commit `.env.local` to git.** The `SUPABASE_SERVICE_ROLE_KEY` gives full database access.

### Step 4 — Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Step 5 — Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Or via the Vercel dashboard:
1. Push your code to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Add **all 5 environment variables** in Vercel → Settings → Environment Variables
4. Click **Deploy**

---

## 🔐 Admin Panel

The admin panel lets you control all live match data in real time.

| How to open | Action |
|---|---|
| Keyboard shortcut | `Ctrl + Shift + A` |
| Double-click nav logo | Works on all pages |

**Default password:** `zuberi2025`  
(Change `ADMIN_PASSWORD` in your env vars)

### What you can do:
- ✅ Add / remove matches
- ✅ Update scores, minute, match status (Live / FT / Upcoming)
- ✅ Log goal scorers (name + minute)
- ✅ Remove individual scorers (auto-decrements score)
- ✅ All changes sync to Supabase → pushed to all connected clients in real time

---

## ⚡ Real-time Updates

The site uses **Supabase Realtime** (PostgreSQL change subscriptions) + a **10-second polling fallback**.

When a goal is scored via the admin panel:
1. Database updates instantly
2. All open browser tabs receive the change via WebSocket
3. A **goal toast notification** appears on screen
4. The ticker bar updates with the new score

---

## 📊 Standings (Msimamo)

The `/makundi` page **auto-calculates** the standings table from all completed (`status = 'ft'`) matches in the database. No manual input needed — just mark matches as finished and the table updates.

---

## 📝 Team Registration (Jaza Fomu)

The `/jazafomu` page saves registrations to the `registrations` table in Supabase. You can view all submissions in:

**Supabase Dashboard → Table Editor → registrations**

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Database | Supabase (PostgreSQL) |
| Realtime | Supabase Realtime (WebSocket) |
| Auth | HMAC-signed admin tokens (no external service) |
| Hosting | Vercel |
| Styling | Pure CSS (no Tailwind needed) |
| Fonts | Bebas Neue + Barlow Condensed via Google Fonts |

---

## 🌍 Pages

| Route | Description |
|---|---|
| `/` | Home — hero, live matches, news, gallery, venue, sponsors |
| `/makundi` | Auto-calculated standings table |
| `/meya` | Mayor profile + photo gallery |
| `/jazafomu` | Team registration form |

---

## 💡 Tips

- **Add news:** directly in Supabase Table Editor → `news` table
- **Add photos:** change image URLs in `HomeClient.tsx` gallery section
- **Change champion:** edit the `champion-banner` div in `HomeClient.tsx`
- **Change admin password:** update `ADMIN_PASSWORD` env var (no code change needed)
