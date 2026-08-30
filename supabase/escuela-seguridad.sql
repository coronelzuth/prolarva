-- ════════════════════════════════════════════════════════════════════════════
-- ESCUELA — CIERRE DE SEGURIDAD  (ejecutar en Supabase → SQL Editor)
-- ════════════════════════════════════════════════════════════════════════════
--
-- CONTEXTO
-- Hasta ahora las escrituras de admin de la Escuela (crear clases, tareas,
-- anuncios, responder preguntas, inscribir en la cohorte, cambiar
-- fases_aprobadas...) se hacían DIRECTO desde el navegador con la anon key.
-- Cualquier socio podía ejecutarlas desde la consola del navegador — incluso
-- ponerse `fases_aprobadas = 5` y desbloquear el Monitor.
--
-- El código ya se movió a /api/escuela y a las API routes de /api/socios, que
-- verifican el rol en el servidor. Este script cierra la puerta de atrás:
-- deja la anon key en SELECT (+ INSERT donde el socio publica contenido propio)
-- y nada más. Las escrituras privilegiadas pasan a necesitar la service_role.
--
-- ANTES DE EJECUTAR:
--   1. Supabase → Settings → API → copia la `service_role` key (secreta).
--   2. Vercel → prolarva → Settings → Environment Variables:
--        SUPABASE_SERVICE_ROLE_KEY = <esa key>   (Production + Preview)
--   3. Redeploy (`vercel --prod --yes`).
--   4. Recién entonces corre este SQL.
--
-- Si lo corres ANTES del paso 2-3, el panel de admin de la Escuela deja de
-- guardar (sin romper nada, solo no persiste) hasta que exista la env var.
-- ════════════════════════════════════════════════════════════════════════════


-- ─── 1. Tablas SOLO-LECTURA para anon ───────────────────────────────────────
-- Contenido que solo el admin edita. La app lo lee; las escrituras van por API.

do $$
declare t text;
declare pol text;
begin
  foreach t in array array[
    'socios', 'clases', 'plantillas', 'tareas',
    'cronograma_dias', 'anuncios_escuela', 'config_escuela'
  ]
  loop
    execute format('alter table public.%I enable row level security', t);

    -- borrar TODA policy previa de la tabla (cualquier nombre)
    for pol in select policyname from pg_policies
               where schemaname = 'public' and tablename = t
    loop
      execute format('drop policy if exists %I on public.%I', pol, t);
    end loop;

    -- solo lectura
    execute format('create policy "read_%s" on public.%I for select using (true)', t, t);

    -- privilegios del rol: quitar escritura al anon, dejar lectura
    execute format('revoke insert, update, delete on public.%I from anon', t);
    execute format('grant select on public.%I to anon', t);
    -- service_role ya tiene todo por defecto; lo reforzamos por si acaso
    execute format('grant select, insert, update, delete on public.%I to service_role', t);
  end loop;
end $$;


-- ─── 2. Tablas donde el socio publica contenido PROPIO ──────────────────────
-- Se permite INSERT (y UPDATE/DELETE acotado) desde anon. El borrado/edición
-- de admin o de terceros pasa por /api/escuela con la service_role.

do $$
declare t text;
declare pol text;
begin
  -- INSERT + SELECT
  foreach t in array array['foro_posts', 'preguntas_escuela']
  loop
    execute format('alter table public.%I enable row level security', t);
    for pol in select policyname from pg_policies where schemaname = 'public' and tablename = t
    loop execute format('drop policy if exists %I on public.%I', pol, t); end loop;
    execute format('create policy "read_%s"   on public.%I for select using (true)', t, t);
    execute format('create policy "insert_%s" on public.%I for insert with check (true)', t, t);
    execute format('revoke update, delete on public.%I from anon', t);
    execute format('grant select, insert on public.%I to anon', t);
    execute format('grant select, insert, update, delete on public.%I to service_role', t);
  end loop;

  -- INSERT + UPDATE + SELECT  (marcar clase vista / entregar tarea / reaccionar)
  foreach t in array array['progreso_clases', 'entregas_tareas', 'foro_likes']
  loop
    execute format('alter table public.%I enable row level security', t);
    for pol in select policyname from pg_policies where schemaname = 'public' and tablename = t
    loop execute format('drop policy if exists %I on public.%I', pol, t); end loop;
    execute format('create policy "rw_%s" on public.%I for all using (true) with check (true)', t, t);
    execute format('grant select, insert, update, delete on public.%I to anon', t);
    execute format('grant select, insert, update, delete on public.%I to service_role', t);
  end loop;
end $$;


-- ─── 3. Verificación ───────────────────────────────────────────────────────
-- Debe mostrar SOLO 'SELECT' para las 7 tablas del bloque 1.
select tablename, cmd, policyname
from pg_policies
where schemaname = 'public'
  and tablename in ('socios','clases','plantillas','tareas','cronograma_dias','anuncios_escuela','config_escuela')
order by tablename, cmd;
