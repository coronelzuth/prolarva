-- ════════════════════════════════════════════════════════════════════════════
-- AISLAMIENTO DE DATOS POR SOCIO — PASO 1 de 2  (Supabase → SQL Editor)
-- ════════════════════════════════════════════════════════════════════════════
--
-- Crea la tabla de sesiones. Es inofensivo: no bloquea nada todavía.
-- Corre ESTE archivo PRIMERO, luego deploya, luego corre `sesiones-2-lockdown.sql`.
--
-- Así no hay ni un segundo de caída: mientras el deploy sube, el código viejo
-- sigue funcionando (la anon key todavía puede leer/escribir), y el código
-- nuevo ya puede crear sesiones.
-- ════════════════════════════════════════════════════════════════════════════

create table if not exists public.sesiones (
  token       text primary key,
  socio_code  text not null,
  creado_en   timestamptz not null default now(),
  ultimo_uso  timestamptz not null default now()
);

create index if not exists sesiones_socio_code_idx on public.sesiones (socio_code);

-- RLS activado pero SIN policy para anon = la anon key no puede tocar sesiones.
-- El servidor entra con service_role (ignora RLS).
alter table public.sesiones enable row level security;
revoke all on public.sesiones from anon;
revoke all on public.sesiones from authenticated;
grant all on public.sesiones to service_role;

select 'tabla sesiones lista — ahora deploya y corre sesiones-2-lockdown.sql' as siguiente_paso;
