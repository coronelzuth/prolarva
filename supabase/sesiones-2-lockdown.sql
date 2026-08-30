-- ════════════════════════════════════════════════════════════════════════════
-- AISLAMIENTO DE DATOS POR SOCIO — PASO 2 de 2  (Supabase → SQL Editor)
-- ════════════════════════════════════════════════════════════════════════════
--
-- Corre esto DESPUÉS de:
--   1. haber corrido `sesiones-1-tabla.sql`
--   2. haber deployado el código nuevo a producción
--   3. haber entrado a prolarva.co/socios y confirmado que carga tus lotes
--      (eso te re-loguea con el token nuevo)
--
-- Este paso le quita a la anon key TODO acceso a los datos de producción de
-- los socios. A partir de aquí, esas tablas solo se tocan desde
-- /api/socios/data, que resuelve el socio_code desde el token de sesión.
--
-- Antes: cualquiera con la anon key (está en el bundle) podía leer o borrar
-- los lotes/cosechas/ventas de otro socio cambiando el socio_code en la consola.
-- ════════════════════════════════════════════════════════════════════════════

do $$
declare t text;
declare pol text;
begin
  foreach t in array array[
    'lotes', 'feed_logs', 'cosechas', 'recordatorios', 'fotos_lotes', 'ventas_socios'
  ]
  loop
    if not exists (select 1 from information_schema.tables
                   where table_schema = 'public' and table_name = t) then
      continue;
    end if;

    execute format('alter table public.%I enable row level security', t);

    for pol in select policyname from pg_policies
               where schemaname = 'public' and tablename = t
    loop
      execute format('drop policy if exists %I on public.%I', pol, t);
    end loop;

    execute format('revoke all on public.%I from anon', t);
    execute format('revoke all on public.%I from authenticated', t);
    execute format('grant all on public.%I to service_role', t);
  end loop;
end $$;


-- ─── Verificación ──────────────────────────────────────────────────────────
-- (a) Ninguna policy para estas tablas:
select tablename, policyname, cmd
from pg_policies
where schemaname = 'public'
  and tablename in ('lotes','feed_logs','cosechas','recordatorios','fotos_lotes','ventas_socios','sesiones');

-- (b) 'anon' sin privilegios (0 filas = correcto):
select table_name, privilege_type
from information_schema.role_table_grants
where table_schema = 'public' and grantee = 'anon'
  and table_name in ('lotes','feed_logs','cosechas','recordatorios','fotos_lotes','ventas_socios','sesiones');
