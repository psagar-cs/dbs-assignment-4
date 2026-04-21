# Weather Dashboard

Monorepo for a live weather dashboard using Next.js, a Railway worker, Supabase, and Open-Meteo.

## Apps

- `apps/web`: Next.js dashboard deployed to Vercel
- `apps/worker`: Railway polling worker
- `packages/shared`: shared types and weather helpers

## Quick start

1. Copy `apps/web/.env.local.example` to `apps/web/.env.local`
2. Copy `apps/worker/.env.example` to `apps/worker/.env`
3. Add your Supabase project URL plus the publishable key for the web app and the secret key for the worker.
4. Install dependencies with `npm install`
5. Run the web app with `npm run dev:web`
6. Run the worker with `npm run dev:worker`

## Database

Apply the SQL in `supabase/schema.sql` to your Supabase project, then enable Realtime for `public.weather_current`.
