import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase, esAdmin } from '@/lib/supabaseServer';

function generarCodigo(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'ARR-';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export async function POST(req: NextRequest) {
  try {
    const { adminCode, nombre, whatsapp } = await req.json();
    if (!adminCode) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    if (!nombre?.trim()) return NextResponse.json({ error: 'El nombre es requerido' }, { status: 400 });

    const db = getServerSupabase();
    if (!db) return NextResponse.json({ error: 'Error de configuración' }, { status: 500 });

    if (!(await esAdmin(db, adminCode))) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    let codigo = generarCodigo();
    let intentos = 0;
    while (intentos < 5) {
      const { data: existing } = await db.from('tripwire_alumnos').select('id').eq('codigo', codigo).single();
      if (!existing) break;
      codigo = generarCodigo();
      intentos++;
    }

    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    const { error } = await db.from('tripwire_alumnos').insert({
      id, codigo, nombre: nombre.trim(), whatsapp: whatsapp?.trim() || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true, codigo });
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
