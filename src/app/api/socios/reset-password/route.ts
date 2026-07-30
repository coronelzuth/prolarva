import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function POST(req: NextRequest) {
  try {
    const { token, newPassword } = await req.json();
    if (!token || !newPassword) {
      return NextResponse.json({ error: 'Datos requeridos' }, { status: 400 });
    }
    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'La contraseña debe tener al menos 6 caracteres' }, { status: 400 });
    }

    const db = getSupabaseAdmin();
    if (!db) return NextResponse.json({ error: 'Error de configuración' }, { status: 500 });

    const { data: reset, error } = await db
      .from('password_resets')
      .select('*')
      .eq('token', token)
      .eq('used', false)
      .single();

    if (error || !reset) {
      return NextResponse.json({ error: 'El enlace no es válido o ya fue usado' }, { status: 400 });
    }
    if (new Date(reset.expires_at) < new Date()) {
      return NextResponse.json({ error: 'El enlace expiró. Solicita uno nuevo.' }, { status: 400 });
    }

    const hash = await bcrypt.hash(newPassword, 10);

    const [{ error: updErr }, { error: markErr }] = await Promise.all([
      db.from('socios').update({ password: hash }).eq('codigo', reset.socio_code),
      db.from('password_resets').update({ used: true }).eq('token', token),
    ]);

    if (updErr || markErr) {
      return NextResponse.json({ error: 'Error al actualizar la contraseña' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
