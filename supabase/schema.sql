create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.cities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  country text not null,
  admin1 text,
  latitude double precision not null,
  longitude double precision not null,
  timezone text not null,
  created_at timestamptz not null default timezone('utc', now()),
  unique (name, country, latitude, longitude)
);

create table if not exists public.user_favorites (
  user_id uuid not null references auth.users (id) on delete cascade,
  city_id uuid not null references public.cities (id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (user_id, city_id)
);

create table if not exists public.weather_current (
  city_id uuid primary key references public.cities (id) on delete cascade,
  temperature double precision,
  apparent_temperature double precision,
  wind_speed double precision,
  precipitation double precision,
  weather_code integer,
  observed_at timestamptz,
  last_polled_at timestamptz,
  fetch_status text not null default 'ok' check (fetch_status in ('ok', 'error')),
  error_message text
);

alter table public.profiles enable row level security;
alter table public.cities enable row level security;
alter table public.user_favorites enable row level security;
alter table public.weather_current enable row level security;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (auth.uid() = id);

drop policy if exists "cities_select_authenticated" on public.cities;
create policy "cities_select_authenticated"
on public.cities
for select
to authenticated
using (true);

drop policy if exists "cities_insert_authenticated" on public.cities;
create policy "cities_insert_authenticated"
on public.cities
for insert
to authenticated
with check (true);

drop policy if exists "user_favorites_select_own" on public.user_favorites;
create policy "user_favorites_select_own"
on public.user_favorites
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "user_favorites_insert_own" on public.user_favorites;
create policy "user_favorites_insert_own"
on public.user_favorites
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "user_favorites_delete_own" on public.user_favorites;
create policy "user_favorites_delete_own"
on public.user_favorites
for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "weather_current_select_authenticated" on public.weather_current;
create policy "weather_current_select_authenticated"
on public.weather_current
for select
to authenticated
using (true);

alter publication supabase_realtime add table public.weather_current;
