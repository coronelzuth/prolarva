-- Tabla para leads del formulario de acceso al Programa Colonia
-- Ejecutar en Supabase → SQL Editor

create table if not exists leads_colonia (
  id               text primary key,
  nombre           text not null,
  email            text not null unique,
  whatsapp         text,
  codigo_invitacion text,
  created_at       timestamptz default now()
);

alter table leads_colonia enable row level security;

grant select, insert, update, delete on table leads_colonia to anon;

create policy "allow_all_anon" on leads_colonia
  for all using (true) with check (true);
