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
    const { codigo, email, nombre, password } = await req.json();

    if (!codigo || !email || !nombre || !password) {
      return NextResponse.json({ error: 'Completa todos los campos' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'La contraseña debe tener al menos 6 caracteres' }, { status: 400 });
    }

    const db = getSupabaseAdmin();
    if (!db) {
      return NextResponse.json({ error: 'Error de configuración del servidor' }, { status: 500 });
    }

    // Verificar que código y email no existan
    const { data: existing } = await db
      .from('socios')
      .select('id')
      .or(`codigo.eq.${codigo},email.eq.${email}`)
      .limit(1);

    if (existing && existing.length > 0) {
      return NextResponse.json({ error: 'Código o email ya registrado' }, { status: 409 });
    }

    // Hashear contraseña
    const hash = await bcrypt.hash(password, 10);

    // Insertar nuevo socio
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    const { error: insertError } = await db.from('socios').insert({
      id,
      codigo,
      email,
      nombre,
      password: hash,
      estado: 'activo',
    });

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, codigo, nombre });
  } catch {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
