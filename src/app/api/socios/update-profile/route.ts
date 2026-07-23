import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function POST(req: NextRequest) {
  try {
    const { code, nombre } = await req.json();
    if (!code || !nombre?.trim()) {
      return NextResponse.json({ error: 'Datos requeridos' }, { status: 400 });
    }
    const db = getSupabaseAdmin();
    if (!db) return NextResponse.json({ error: 'Error de configuración' }, { status: 500 });

    const { error } = await db
      .from('socios')
      .update({ nombre: nombre.trim() })
      .eq('codigo', code);

    if (error) return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 });

    return NextResponse.json({ success: true, nombre: nombre.trim() });
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
