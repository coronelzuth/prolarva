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
    const body = await req.json();
    const {
      nombre, whatsapp, fuente = 'calculadora', especie = '', n_animales = 0, perdida_cop = 0, tipo_cta = '',
      precio_bulto = 0, bulto_kg = 0, dias_ciclo = 0, precio_venta = 0, mortalidad = 0, pct_bsf = 0,
      perdida_anual_cop = 0, datos_ajustados = false,
    } = body;

    if (!nombre && !whatsapp) {
      return NextResponse.json({ error: 'nombre o whatsapp requerido' }, { status: 400 });
    }

    const db = getDb();
    if (!db) return NextResponse.json({ error: 'Error de configuración' }, { status: 500 });

    const id = crypto.randomUUID();
    const base = { id, nombre, whatsapp, fuente, especie, n_animales, perdida_cop, tipo_cta };
    const full = {
      ...base,
      precio_bulto, bulto_kg, dias_ciclo, precio_venta, mortalidad, pct_bsf, perdida_anual_cop, datos_ajustados,
    };

    let { error } = await db.from('leads').insert(full);
    if (error) {
      // Las columnas nuevas quizás aún no existen — reintenta con lo básico.
      ({ error } = await db.from('leads').insert(base));
    }

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, id });
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
