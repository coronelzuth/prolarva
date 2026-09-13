import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase, esAdmin } from '@/lib/supabaseServer';

export async function GET() {
  try {
    const db = getServerSupabase();
    if (!db) return NextResponse.json({ lecciones: [] });

    const { data } = await db
      .from('tripwire_lecciones')
      .select('n, titulo, duracion, video_url, disponible')
      .order('n', { ascending: true });

    return NextResponse.json({ lecciones: data ?? [] });
  } catch {
    return NextResponse.json({ lecciones: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { adminCode, n, titulo, duracion, video_url, disponible } = await req.json();
    if (!adminCode) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    if (![1, 2, 3].includes(n)) return NextResponse.json({ error: 'Lección inválida' }, { status: 400 });
    if (!titulo?.trim() || !duracion?.trim()) return NextResponse.json({ error: 'Título y duración son requeridos' }, { status: 400 });

    const db = getServerSupabase();
    if (!db) return NextResponse.json({ error: 'Error de configuración' }, { status: 500 });

    if (!(await esAdmin(db, adminCode))) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const { error } = await db
      .from('tripwire_lecciones')
      .update({ titulo: titulo.trim(), duracion: duracion.trim(), video_url: video_url?.trim() ?? '', disponible: !!disponible })
      .eq('n', n);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
