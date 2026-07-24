-- Tabla para registrar visitas a artículos del blog
-- Ejecutar en Supabase → SQL Editor

create table if not exists blog_views (
  slug           text primary key,
  views          integer not null default 0,
  last_viewed_at timestamptz default now()
);

alter table blog_views enable row level security;

create policy "anon_select" on blog_views for select using (true);
create policy "anon_insert" on blog_views for insert with check (true);
create policy "anon_update" on blog_views for update using (true);
