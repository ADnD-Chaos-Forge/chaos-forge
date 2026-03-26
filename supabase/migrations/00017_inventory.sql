-- ═══════════════════════════════════════════════════════════════════════════════
-- PR 4: Allgemeines Inventar-System
-- ═══════════════════════════════════════════════════════════════════════════════

-- Reference table for general items (non-weapon, non-armor)
create table public.general_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_en text,
  weight numeric(5,1) not null default 0,
  cost_gp numeric(8,2) not null default 0,
  category text not null default 'general',
  is_custom boolean not null default false,
  created_by uuid references public.profiles(id) on delete set null
);

alter table public.general_items enable row level security;

create policy "Anyone can read general items"
  on public.general_items for select
  to authenticated
  using (true);

create policy "Users can create custom items"
  on public.general_items for insert
  to authenticated
  with check (is_custom = true and created_by = auth.uid());

-- Character inventory (junction table)
create table public.character_inventory (
  id uuid primary key default gen_random_uuid(),
  character_id uuid references public.characters(id) on delete cascade not null,
  item_id uuid references public.general_items(id) on delete set null,
  custom_name text,
  quantity integer not null default 1,
  notes text not null default ''
);

alter table public.character_inventory enable row level security;

create policy "Users can view inventory for readable characters"
  on public.character_inventory for select
  to authenticated
  using (true);

create policy "Users can manage their own inventory"
  on public.character_inventory for insert
  to authenticated
  with check (
    character_id in (select id from public.characters where user_id = auth.uid())
  );

create policy "Users can update their own inventory"
  on public.character_inventory for update
  to authenticated
  using (
    character_id in (select id from public.characters where user_id = auth.uid())
  )
  with check (
    character_id in (select id from public.characters where user_id = auth.uid())
  );

create policy "Users can delete their own inventory"
  on public.character_inventory for delete
  to authenticated
  using (
    character_id in (select id from public.characters where user_id = auth.uid())
  );
