-- Cajita de Preguntas de la Escuela
-- Los alumnos dejan preguntas durante la semana; se responden en la 2ª sesión (Preguntas y Respuestas).

create table if not exists preguntas_escuela (
  id          uuid primary key default gen_random_uuid(),
  socio_code  text not null,
  socio_nombre text not null,
  semana      int,
  texto       text not null,
  respondida  boolean not null default false,
  respuesta   text,
  creado_en   timestamptz not null default now()
);

create index if not exists idx_preguntas_escuela_semana on preguntas_escuela (semana);

alter table preguntas_escuela enable row level security;

-- Capa 1: privilegios del rol anon
grant select, insert, update, delete on table preguntas_escuela to anon;

-- Capa 2: política RLS (ver bug conocido — RLS silencioso sin SELECT+resto)
drop policy if exists "allow_all_preguntas_escuela" on preguntas_escuela;
create policy "allow_all_preguntas_escuela" on preguntas_escuela for all using (true) with check (true);

-- ── Resumen de clase (post-sesión) ──────────────────────────────────────────
alter table clases add column if not exists resumen text;
