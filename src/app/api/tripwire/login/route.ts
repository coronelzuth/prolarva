import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabaseServer';

export async function POST(req: NextRequest) {
  try {
    const { codigo } = await req.json();
    if (!codigo?.trim()) return NextResponse.json({ error: 'Ingresa tu código de acceso' }, { status: 400 });

    const db = getServerSupabase();
    if (!db) return NextResponse.json({ error: 'Error de configuración del servidor' }, { status: 500 });

    const { data, error } = await db
      .from('tripwire_alumnos')
      .select('codigo, nombre, leccion1_vista, leccion2_vista, leccion3_vista, colonia_canjeado')
      .eq('codigo', codigo.trim().toUpperCase())
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Código inválido. Revisa que esté bien escrito.' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      codigo: data.codigo,
      nombre: data.nombre,
      l1: data.leccion1_vista,
      l2: data.leccion2_vista,
      l3: data.leccion3_vista,
      coloniaCanjeado: data.colonia_canjeado,
    });
  } catch {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
