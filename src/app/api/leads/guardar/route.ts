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
    const { nombre, whatsapp, fuente = 'calculadora', especie = '', n_animales = 0, perdida_cop = 0, tipo_cta = '' } = body;

    if (!nombre && !whatsapp) {
      return NextResponse.json({ error: 'nombre o whatsapp requerido' }, { status: 400 });
    }

    const db = getDb();
    if (!db) return NextResponse.json({ error: 'Error de configuración' }, { status: 500 });

    const id = crypto.randomUUID();
    const { error } = await db.from('leads').insert({
      id, nombre, whatsapp, fuente, especie, n_animales, perdida_cop, tipo_cta,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, id });
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
