-- ═══════════════════════════════════════════════════════════════════════════════
-- Epic 4: Die Chronik des Chaos — Session Log
-- ═══════════════════════════════════════════════════════════════════════════════

-- ─── SESSIONS ──────────────────────────────────────────────────────────────────

create table public.sessions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  session_date date not null default current_date,
  summary text not null default '',
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── SESSION ENTRIES (one per character per session) ───────────────────────────

create table public.session_entries (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.sessions(id) on delete cascade not null,
  character_id uuid references public.characters(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  content text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (session_id, character_id)
);

-- ─── TAGS ──────────────────────────────────────────────────────────────────────

create table public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  type text not null check (type in ('npc', 'location', 'item', 'quest')),
  color text not null default '#b08d57'
);

-- ─── SESSION TAGS (n:m) ────────────────────────────────────────────────────────

create table public.session_tags (
  session_id uuid references public.sessions(id) on delete cascade not null,
  tag_id uuid references public.tags(id) on delete cascade not null,
  primary key (session_id, tag_id)
);

-- ─── UPDATED_AT TRIGGERS ───────────────────────────────────────────────────────

create trigger sessions_updated_at
  before update on public.sessions
  for each row execute function public.update_updated_at();

create trigger session_entries_updated_at
  before update on public.session_entries
  for each row execute function public.update_updated_at();

-- ─── RLS ───────────────────────────────────────────────────────────────────────

alter table public.sessions enable row level security;
alter table public.session_entries enable row level security;
alter table public.tags enable row level security;
alter table public.session_tags enable row level security;

-- Sessions: all authenticated users can read, any can create, creator can update
create policy "Sessions are visible to all authenticated users"
  on public.sessions for select
  using (auth.role() = 'authenticated');

create policy "Authenticated users can create sessions"
  on public.sessions for insert
  with check (auth.role() = 'authenticated');

create policy "Session creators can update their sessions"
  on public.sessions for update
  using (auth.uid() = created_by);

-- Session entries: all can read, own entries can be created/updated
create policy "Session entries are visible to all authenticated users"
  on public.session_entries for select
  using (auth.role() = 'authenticated');

create policy "Users can create their own session entries"
  on public.session_entries for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own session entries"
  on public.session_entries for update
  using (auth.uid() = user_id);

-- Tags: all authenticated users can read and create
create policy "Tags are visible to all authenticated users"
  on public.tags for select
  using (auth.role() = 'authenticated');

create policy "Authenticated users can create tags"
  on public.tags for insert
  with check (auth.role() = 'authenticated');

-- Session tags: all can read, session creator can manage
create policy "Session tags are visible to all authenticated users"
  on public.session_tags for select
  using (auth.role() = 'authenticated');

create policy "Authenticated users can add session tags"
  on public.session_tags for insert
  with check (auth.role() = 'authenticated');

create policy "Authenticated users can remove session tags"
  on public.session_tags for delete
  using (auth.role() = 'authenticated');
