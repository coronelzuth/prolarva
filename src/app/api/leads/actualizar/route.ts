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
    const { adminCode, leadId, estado, notas_crm } = await req.json();
    if (!adminCode || !leadId) return NextResponse.json({ error: 'adminCode y leadId requeridos' }, { status: 400 });

    const db = getDb();
    if (!db) return NextResponse.json({ error: 'Error de configuración' }, { status: 500 });

    const { data: admin } = await db.from('socios').select('rol').eq('codigo', adminCode).single();
    if (!admin || admin.rol !== 'admin') return NextResponse.json({ error: 'No autorizado' }, { status: 403 });

    const update: Record<string, string> = {};
    if (estado !== undefined) update.estado = estado;
    if (notas_crm !== undefined) update.notas_crm = notas_crm;

    const { error } = await db.from('leads').update(update).eq('id', leadId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
