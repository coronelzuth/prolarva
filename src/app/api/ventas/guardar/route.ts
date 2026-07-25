import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function POST(req: NextRequest) {
  try {
    const { adminCode, fecha, cliente, producto = 'Kit ProLarva 25/15', monto, canal = 'WhatsApp', notas = '' } = await req.json();
    if (!adminCode) return NextResponse.json({ error: 'adminCode requerido' }, { status: 400 });
    if (!fecha || !cliente || !monto) return NextResponse.json({ error: 'fecha, cliente y monto son requeridos' }, { status: 400 });

    const db = getDb();
    if (!db) return NextResponse.json({ error: 'Error de configuración' }, { status: 500 });

    const { data: admin } = await db
      .from('socios')
      .select('rol')
      .eq('codigo', adminCode)
      .single();

    if (!admin || admin.rol !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const id = crypto.randomUUID();
    const { error } = await db.from('ventas').insert({ id, fecha, cliente, producto, monto, canal, notas });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, id });
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
