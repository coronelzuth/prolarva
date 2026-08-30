import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Cliente Supabase para uso EXCLUSIVO en el servidor (API routes).
 *
 * Usa la `service_role` key si está disponible (`SUPABASE_SERVICE_ROLE_KEY`),
 * que ignora las políticas RLS. Si no está configurada, cae a la anon key —
 * así la app sigue funcionando igual que antes hasta que se agregue la key
 * en Vercel y se apliquen las políticas RLS de `supabase/escuela-seguridad.sql`.
 *
 * NUNCA importar este archivo desde un componente cliente.
 */
export function getServerSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

/** true si el `codigo` corresponde a un socio con rol admin. */
export async function esAdmin(db: SupabaseClient, codigo: string): Promise<boolean> {
  if (!codigo) return false;
  const { data } = await db.from('socios').select('rol').eq('codigo', codigo).single();
  return data?.rol === 'admin';
}
