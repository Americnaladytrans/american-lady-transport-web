# American Lady Transport

Marketing website for American Lady Transportation LLC — a freight brokerage and 3PL company based in Willis, TX.

**Live URL:** https://americanladytrans.com

## Stack

- Vite + React 18 + TypeScript
- Tailwind CSS + shadcn/ui
- Supabase (database, auth, edge functions)
- React Router

## Local development

```sh
npm install
npm run dev
```

App runs on http://localhost:8080

## Build

```sh
npm run build
```

Output is written to `dist/`.

## Environment

Create a `.env` file with:

```
VITE_SUPABASE_PROJECT_ID="..."
VITE_SUPABASE_PUBLISHABLE_KEY="..."
VITE_SUPABASE_URL="..."
```

## Project structure

- `src/components` — page sections (Hero, About, Services, etc.)
- `src/pages` — route pages
- `src/integrations/supabase` — Supabase client and types
- `supabase/functions` — edge functions (contact email, RSS feed, blog ingest)
- `supabase/migrations` — database migrations
