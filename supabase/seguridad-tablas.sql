-- ════════════════════════════════════════════════════════════════════════════
-- CIERRE DE SEGURIDAD — TABLAS SENSIBLES  (Supabase → SQL Editor)
-- ════════════════════════════════════════════════════════════════════════════
--
-- Estas tablas NO se tocan nunca desde el navegador — solo desde API routes del
-- servidor (que ya usan SUPABASE_SERVICE_ROLE_KEY). Hasta ahora la anon key
-- podía LEERLAS: cualquiera con la key (está en el bundle) podía sacar la lista
-- de leads con nombre + WhatsApp, los códigos de invitación sin usar, las
-- ventas, o los tokens de recuperación de contraseña.
--
-- Este script le quita a la anon key TODO acceso a estas tablas.
--
-- REQUISITO: `SUPABASE_SERVICE_ROLE_KEY` ya configurada en Vercel (hecho el
-- 2026-08-30) y el deploy con ese cambio ya en producción.
--
--   leads            → formulario de la Calculadora (API /api/leads/*)
--   invitaciones      → códigos de acceso a Socios (API /api/invitaciones/*, register)
--   ventas            → ventas del Kit registradas por el admin (API /api/ventas/*)
--   password_resets   → tokens de recuperación (API /api/socios/forgot|reset-password)
--   push_subscriptions→ suscripciones a notificaciones (API /api/push/*)
-- ════════════════════════════════════════════════════════════════════════════

do $$
declare t text;
declare pol text;
begin
  foreach t in array array[
    'leads', 'invitaciones', 'ventas', 'password_resets', 'push_subscriptions'
  ]
  loop
    -- si la tabla no existe, seguir con la próxima
    if not exists (select 1 from information_schema.tables
                   where table_schema = 'public' and table_name = t) then
      continue;
    end if;

    execute format('alter table public.%I enable row level security', t);

    -- borrar TODA policy previa
    for pol in select policyname from pg_policies
               where schemaname = 'public' and tablename = t
    loop
      execute format('drop policy if exists %I on public.%I', pol, t);
    end loop;

    -- sin policy para anon = sin acceso. Y quitamos los privilegios del rol.
    execute format('revoke all on public.%I from anon', t);
    execute format('revoke all on public.%I from authenticated', t);

    -- el servidor entra con service_role, que ignora RLS y conserva todo
    execute format('grant all on public.%I to service_role', t);
  end loop;
end $$;


-- ─── Verificación ──────────────────────────────────────────────────────────
-- 1) No debe haber NINGUNA policy para estas tablas:
select tablename, policyname, cmd
from pg_policies
where schemaname = 'public'
  and tablename in ('leads','invitaciones','ventas','password_resets','push_subscriptions');

-- 2) 'anon' no debe tener privilegios en estas tablas (0 filas = correcto):
select table_name, privilege_type, grantee
from information_schema.role_table_grants
where table_schema = 'public'
  and grantee = 'anon'
  and table_name in ('leads','invitaciones','ventas','password_resets','push_subscriptions');
