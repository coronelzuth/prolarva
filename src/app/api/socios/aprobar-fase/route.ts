import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function POST(req: NextRequest) {
  try {
    const { adminCode, code, fase } = await req.json();
    if (!adminCode || !code || !fase) return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });

    const db = getDb();
    if (!db) return NextResponse.json({ error: 'Error de config' }, { status: 500 });

    const { data: admin } = await db.from('socios').select('rol').eq('codigo', adminCode).single();
    if (!admin || admin.rol !== 'admin') return NextResponse.json({ error: 'No autorizado' }, { status: 403 });

    const { error } = await db
      .from('socios')
      .update({ fases_aprobadas: fase, fase_en_revision: 0 })
      .eq('codigo', code);

    if (error) return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
