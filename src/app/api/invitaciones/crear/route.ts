import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

function generarCodigo(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'PRL-';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export async function POST(req: NextRequest) {
  try {
    const { adminCode } = await req.json();
    if (!adminCode) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const db = getDb();
    if (!db) return NextResponse.json({ error: 'Error de configuración' }, { status: 500 });

    // Verificar que el solicitante es admin
    const { data: admin } = await db
      .from('socios')
      .select('rol')
      .or(`codigo.eq.${adminCode},email.eq.${adminCode}`)
      .single();

    if (!admin || admin.rol !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    // Generar código único
    let codigo = generarCodigo();
    let intentos = 0;
    while (intentos < 5) {
      const { data: existing } = await db.from('invitaciones').select('id').eq('codigo', codigo).single();
      if (!existing) break;
      codigo = generarCodigo();
      intentos++;
    }

    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    const { error } = await db.from('invitaciones').insert({ id, codigo, usado: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true, codigo });
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
