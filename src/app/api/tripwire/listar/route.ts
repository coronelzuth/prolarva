import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase, esAdmin } from '@/lib/supabaseServer';

export async function POST(req: NextRequest) {
  try {
    const { adminCode } = await req.json();
    if (!adminCode) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const db = getServerSupabase();
    if (!db) return NextResponse.json({ error: 'Error de configuración' }, { status: 500 });

    if (!(await esAdmin(db, adminCode))) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const { data, error } = await db
      .from('tripwire_alumnos')
      .select('id, codigo, nombre, whatsapp, leccion1_vista, leccion2_vista, leccion3_vista, colonia_canjeado, creado_en')
      .order('creado_en', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true, alumnos: data ?? [] });
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
