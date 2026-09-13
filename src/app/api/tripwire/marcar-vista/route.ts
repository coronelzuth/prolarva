import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabaseServer';

const COLUMNA: Record<number, string> = {
  1: 'leccion1_vista',
  2: 'leccion2_vista',
  3: 'leccion3_vista',
};

export async function POST(req: NextRequest) {
  try {
    const { codigo, leccion } = await req.json();
    const columna = COLUMNA[leccion];
    if (!codigo?.trim() || !columna) {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
    }

    const db = getServerSupabase();
    if (!db) return NextResponse.json({ error: 'Error de configuración' }, { status: 500 });

    const { error } = await db
      .from('tripwire_alumnos')
      .update({ [columna]: true })
      .eq('codigo', codigo.trim().toUpperCase());

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
