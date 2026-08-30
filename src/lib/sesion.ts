import crypto from 'crypto';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Sesiones de socio — token opaco guardado en la tabla `sesiones`.
 * El servidor resuelve el `socio_code` desde el token; el cliente nunca
 * decide de quién son los datos que toca.
 *
 * Solo para uso en el servidor (API routes).
 */

const NOVENTA_DIAS = 90 * 24 * 60 * 60 * 1000;

export function nuevoToken(): string {
  return crypto.randomBytes(32).toString('base64url');
}

/** Crea una sesión y devuelve el token. */
export async function crearSesion(db: SupabaseClient, socioCode: string): Promise<string> {
  const token = nuevoToken();
  await db.from('sesiones').insert({ token, socio_code: socioCode });
  return token;
}

/** Devuelve el `socio_code` si el token es válido y no expiró; si no, null. */
export async function socioDeToken(db: SupabaseClient, token: unknown): Promise<string | null> {
  if (typeof token !== 'string' || !token) return null;
  const { data } = await db
    .from('sesiones')
    .select('socio_code, creado_en')
    .eq('token', token)
    .single();
  if (!data) return null;
  if (Date.now() - new Date(data.creado_en).getTime() > NOVENTA_DIAS) {
    await db.from('sesiones').delete().eq('token', token);
    return null;
  }
  // refrescar ultimo_uso sin bloquear
  void db.from('sesiones').update({ ultimo_uso: new Date().toISOString() }).eq('token', token);
  return data.socio_code as string;
}

export async function borrarSesion(db: SupabaseClient, token: unknown): Promise<void> {
  if (typeof token !== 'string' || !token) return;
  await db.from('sesiones').delete().eq('token', token);
}
