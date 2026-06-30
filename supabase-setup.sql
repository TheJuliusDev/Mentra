-- ============================================================
-- Mentra Supabase Setup
-- Run this entire file in Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Core user data table (points, streak, notes, chat history, etc.)
create table if not exists public.mentra_user_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

alter table public.mentra_user_data enable row level security;

drop policy if exists "Users can read own data" on public.mentra_user_data;
create policy "Users can read own data"
  on public.mentra_user_data for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own data" on public.mentra_user_data;
create policy "Users can insert own data"
  on public.mentra_user_data for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own data" on public.mentra_user_data;
create policy "Users can update own data"
  on public.mentra_user_data for update
  using (auth.uid() = user_id);

-- 2. Public leaderboard view — exposes only id, name, points, level
--    (never exposes email or other private fields)
create or replace view public.mentra_leaderboard as
select
  u.id,
  coalesce(d.data->'profile'->>'name', u.raw_user_meta_data->>'name', 'Developer') as name,
  coalesce((d.data->>'points')::int, 0) as points,
  coalesce((d.data->>'level')::int, 1) as level
from auth.users u
join public.mentra_user_data d on d.user_id = u.id
order by points desc;

-- Allow both logged-in and anonymous users to read the leaderboard
grant select on public.mentra_leaderboard to anon, authenticated;

-- ============================================================
-- Done. After running this, the app's leaderboard, achievements,
-- notes, missions, and chat history will all persist for real.
-- ============================================================
