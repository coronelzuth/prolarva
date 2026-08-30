import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function POST(req: NextRequest) {
  try {
    const { code, nombre, ubicacion, tipo_produccion, whatsapp_pub, instagram, tiktok, mostrar_directorio } = await req.json();
    if (!code) return NextResponse.json({ error: 'Código requerido' }, { status: 400 });

    const db = getSupabaseAdmin();
    if (!db) return NextResponse.json({ error: 'Error de configuración' }, { status: 500 });

    const update: Record<string, unknown> = {};
    if (nombre?.trim())                   update.nombre              = nombre.trim();
    if (ubicacion  !== undefined)         update.ubicacion           = ubicacion;
    if (tipo_produccion !== undefined)    update.tipo_produccion     = tipo_produccion;
    if (whatsapp_pub !== undefined)       update.whatsapp_pub        = whatsapp_pub;
    if (instagram !== undefined)          update.instagram           = instagram;
    if (tiktok !== undefined)             update.tiktok              = tiktok;
    if (mostrar_directorio !== undefined) update.mostrar_directorio  = mostrar_directorio;

    const { error } = await db.from('socios').update(update).eq('codigo', code);
    if (error) return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
