# ⚽ Zuberi Cup 2026 — Full-Stack Website

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

Copy `.env.example` to `.env.local` and fill in your Supabase values.

### Step 4 — Run Locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

### Step 5 — Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Or import the repository through the Vercel dashboard and add the required environment variables.

---

## 🔐 Admin Panel

The admin panel lets you control all live match data in real time.

| How to open | Action |
|---|---|
| Keyboard shortcut | `Ctrl + Shift + A` |
| Double-click nav logo | Works on all pages |

### What you can do:
- ✅ Add / remove matches
- ✅ Update scores, minute, match status (Live / FT / Upcoming)
- ✅ Log goal scorers (name + minute)
- ✅ Remove individual scorers
- ✅ All changes sync to Supabase in real time

---

## ⚡ Real-time Updates

The site uses Supabase Realtime (PostgreSQL change subscriptions) plus a polling fallback.

## 📊 Standings (Msimamo)

The `/makundi` page auto-calculates the standings table from completed matches in the database.

## 📝 Team Registration (Jaza Fomu)

The `/jazafomu` page saves registrations to the `registrations` table in Supabase.

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Database | Supabase (PostgreSQL) |
| Realtime | Supabase Realtime (WebSocket) |
| Auth | HMAC-signed admin tokens |
| Hosting | Vercel |
| Styling | Pure CSS |
| Fonts | Bebas Neue + Barlow Condensed |

## 🌍 Pages

| Route | Description |
|---|---|
| `/` | Home — hero, live matches, news, gallery, venue, sponsors |
| `/makundi` | 2026 standings table |
| `/meya` | Mayor profile + photo gallery |
| `/jazafomu` | 2026 team registration form |
