# AGENTS.md

## Project Purpose

Weather Dashboard is a monorepo app for tracking live weather conditions in favorite cities. Users sign in with Supabase Auth, save favorite cities, and watch current weather update live through Supabase Realtime. A worker deployed on Railway polls Open-Meteo every 30 seconds and writes fresh data into Supabase.

## Repo Layout

- `apps/web`: Next.js App Router frontend, Tailwind UI, auth flows, dashboard, geocoding search, favorites, and Realtime subscriptions
- `apps/worker`: Node worker process for polling Open-Meteo and upserting weather data
- `packages/shared`: shared TypeScript types, weather-code labels, and helper utilities
- `supabase/schema.sql`: database schema, RLS policies, and Realtime publication changes

## Architecture and Data Flow

1. The frontend authenticates users with Supabase Auth.
2. Users search cities through the Open-Meteo geocoding API and save favorites in Supabase.
3. The Railway worker queries unique favorited cities from Supabase every 30 seconds.
4. The worker fetches current weather for those cities from Open-Meteo.
5. The worker upserts `weather_current` rows in Supabase.
6. Supabase Realtime pushes `weather_current` updates to subscribed dashboard clients.
7. The browser re-renders weather cards without a full refresh.

## Service Ownership

- Vercel hosts `apps/web`
- Railway hosts `apps/worker`
- Supabase provides Postgres, Auth, and Realtime
- Open-Meteo provides geocoding and forecast data

## Core Data Model

- `profiles`: mirrors auth users for profile metadata
- `cities`: canonical city records keyed by normalized geocoding results
- `user_favorites`: join table from user to city
- `weather_current`: one latest weather snapshot per city

## Expected Environment Variables

### `apps/web`

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

### `apps/worker`

- `SUPABASE_URL`
- `SUPABASE_SECRET_KEY`
- `OPEN_METEO_BASE_URL` optional, defaults to `https://api.open-meteo.com`
- `POLL_INTERVAL_MS` optional, defaults to `30000`

## Local Development

1. Install dependencies from the repo root with `npm install`.
2. Apply `supabase/schema.sql` to a Supabase project.
3. Add environment variables for the web app and worker.
4. Start the web app with `npm run dev:web`.
5. Start the worker with `npm run dev:worker`.

## Guardrails

- Keep weather data city-centric. Do not duplicate `weather_current` per user.
- Add new weather fields to shared types and SQL together so the web and worker stay aligned.
- Prefer server-side Supabase access for protected data-loading paths.
- If schema or deployment details change, update this file so it stays operational rather than aspirational.
