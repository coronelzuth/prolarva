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
    const { email, nombre, password, codigoInvitacion } = await req.json();

    // Generar código automático desde el nombre: "Carlos Martínez" → "CARLOS-X4F2"
    const base = (nombre as string).trim().split(' ')[0].toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
    const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
    const codigo = `${base}-${suffix}`;

    if (!email || !nombre || !password || !codigoInvitacion) {
      return NextResponse.json({ error: 'Completa todos los campos' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'La contraseña debe tener al menos 6 caracteres' }, { status: 400 });
    }

    const db = getSupabaseAdmin();
    if (!db) {
      return NextResponse.json({ error: 'Error de configuración del servidor' }, { status: 500 });
    }

    // Validar código de invitación
    const { data: inv, error: invError } = await db
      .from('invitaciones')
      .select('*')
      .eq('codigo', codigoInvitacion.toUpperCase().trim())
      .single();

    if (invError || !inv) {
      return NextResponse.json({ error: 'Código de invitación inválido' }, { status: 400 });
    }
    if (inv.usado) {
      return NextResponse.json({ error: 'Este código de invitación ya fue usado' }, { status: 400 });
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
      rol: 'socio',
    });

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    // Marcar invitación como usada
    await db.from('invitaciones').update({
      usado: true,
      usado_en: new Date().toISOString(),
      usado_por: email,
    }).eq('id', inv.id);

    return NextResponse.json({ success: true, codigo, nombre });
  } catch {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
