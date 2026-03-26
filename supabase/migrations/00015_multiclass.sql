-- ═══════════════════════════════════════════════════════════════════════════════
-- PR 2: Echtes Multiclass-System — Junction-Tabelle für Charakter-Klassen
-- ═══════════════════════════════════════════════════════════════════════════════

-- Junction-Tabelle: Ein Charakter kann mehrere Klassen haben
create table public.character_classes (
  id uuid primary key default gen_random_uuid(),
  character_id uuid references public.characters(id) on delete cascade not null,
  class_id text references public.classes(id) not null,
  level integer not null default 1,
  xp_current integer not null default 0,
  is_active boolean not null default true,  -- für Dualclass: false nach Wechsel
  unique(character_id, class_id)
);

-- RLS
alter table public.character_classes enable row level security;

create policy "Authenticated users can view all character classes"
  on public.character_classes for select
  to authenticated
  using (true);

create policy "Users can insert their own character classes"
  on public.character_classes for insert
  to authenticated
  with check (
    character_id in (select id from public.characters where user_id = auth.uid())
  );

create policy "Users can update their own character classes"
  on public.character_classes for update
  to authenticated
  using (
    character_id in (select id from public.characters where user_id = auth.uid())
  )
  with check (
    character_id in (select id from public.characters where user_id = auth.uid())
  );

create policy "Users can delete their own character classes"
  on public.character_classes for delete
  to authenticated
  using (
    character_id in (select id from public.characters where user_id = auth.uid())
  );

-- Bestehende Daten migrieren: class_id → character_classes
insert into public.character_classes (character_id, class_id, level, xp_current)
select id, class_id, level, xp_current
from public.characters
where class_id is not null;

-- Deprecated-Kommentare auf alten Feldern
comment on column public.characters.class_id is 'DEPRECATED: Use character_classes table';
comment on column public.characters.level is 'DEPRECATED: Use character_classes table';
comment on column public.characters.xp_current is 'DEPRECATED: Use character_classes table';
