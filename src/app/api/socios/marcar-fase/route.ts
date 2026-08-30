import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabaseServer';
import { socioDeToken } from '@/lib/sesion';

export async function POST(req: NextRequest) {
  try {
    const { token, fase } = await req.json();
    if (!token || !fase) return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });

    const db = getServerSupabase();
    if (!db) return NextResponse.json({ error: 'Error de config' }, { status: 500 });

    const code = await socioDeToken(db, token);
    if (!code) return NextResponse.json({ error: 'Sesión inválida' }, { status: 401 });

    const { data: socio } = await db
      .from('socios')
      .select('fases_aprobadas,fase_en_revision')
      .eq('codigo', code)
      .single();

    if (!socio) return NextResponse.json({ error: 'Socio no encontrado' }, { status: 404 });
    if (fase !== (socio.fases_aprobadas ?? 0) + 1) return NextResponse.json({ error: 'Fase inválida' }, { status: 400 });
    if ((socio.fase_en_revision ?? 0) > 0) return NextResponse.json({ error: 'Ya tienes una fase en revisión' }, { status: 400 });

    const { error } = await db.from('socios').update({ fase_en_revision: fase }).eq('codigo', code);
    if (error) return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
