-- ============================================
-- Katsuyō no Ki — Database Migration
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Profiles table (auto-created on signup via trigger)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. User preferences
create table if not exists public.preferences (
  id uuid references auth.users on delete cascade primary key,
  input_mode text default 'romaji' check (input_mode in ('romaji', 'hiragana')),
  speech_level text default 'polite' check (speech_level in ('polite', 'casual')),
  updated_at timestamptz default now()
);

-- 3. Practice scores
create table if not exists public.scores (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  word text not null,
  word_type text not null,
  speech_level text not null,
  correct integer default 0,
  total integer default 0,
  streak integer default 0,
  best_streak integer default 0,
  leaves integer default 0,
  last_practiced_at timestamptz default now(),
  created_at timestamptz default now()
);

-- 4. Session history (optional, for tracking progress over time)
create table if not exists public.sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  words_practiced integer default 0,
  correct_answers integer default 0,
  total_answers integer default 0,
  leaves_earned integer default 0,
  duration_seconds integer default 0,
  created_at timestamptz default now()
);

-- Indexes
create index if not exists idx_scores_user on public.scores(user_id);
create index if not exists idx_scores_user_word on public.scores(user_id, word, speech_level);
create index if not exists idx_sessions_user on public.sessions(user_id);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.preferences enable row level security;
alter table public.scores enable row level security;
alter table public.sessions enable row level security;

-- RLS Policies: users can only access their own data
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

create policy "Users can view own preferences" on public.preferences for select using (auth.uid() = id);
create policy "Users can update own preferences" on public.preferences for update using (auth.uid() = id);
create policy "Users can insert own preferences" on public.preferences for insert with check (auth.uid() = id);

create policy "Users can view own scores" on public.scores for select using (auth.uid() = user_id);
create policy "Users can insert own scores" on public.scores for insert with check (auth.uid() = user_id);
create policy "Users can update own scores" on public.scores for update using (auth.uid() = user_id);

create policy "Users can view own sessions" on public.sessions for select using (auth.uid() = user_id);
create policy "Users can insert own sessions" on public.sessions for insert with check (auth.uid() = user_id);

-- Trigger: auto-create profile + preferences on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'Learner'),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', null)
  );
  insert into public.preferences (id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists, then create
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();