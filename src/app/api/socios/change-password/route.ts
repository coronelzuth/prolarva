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
    const { code, currentPassword, newPassword } = await req.json();
    if (!code || !currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Datos requeridos' }, { status: 400 });
    }
    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'La nueva contraseña debe tener al menos 6 caracteres' }, { status: 400 });
    }

    const db = getSupabaseAdmin();
    if (!db) return NextResponse.json({ error: 'Error de configuración' }, { status: 500 });

    const { data, error } = await db
      .from('socios')
      .select('password')
      .eq('codigo', code)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Socio no encontrado' }, { status: 404 });
    }

    let currentOk = false;
    if (data.password.startsWith('$2')) {
      currentOk = await bcrypt.compare(currentPassword, data.password);
    } else {
      currentOk = data.password === currentPassword;
    }
    if (!currentOk) {
      return NextResponse.json({ error: 'Contraseña actual incorrecta' }, { status: 401 });
    }

    const hash = await bcrypt.hash(newPassword, 10);
    const { error: updateErr } = await db
      .from('socios')
      .update({ password: hash })
      .eq('codigo', code);

    if (updateErr) return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
