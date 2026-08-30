import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabaseServer';
import { socioDeToken } from '@/lib/sesion';

export async function POST(req: NextRequest) {
  try {
    const { token, nombre, ubicacion, tipo_produccion, whatsapp_pub, instagram, tiktok, mostrar_directorio } = await req.json();

    const db = getServerSupabase();
    if (!db) return NextResponse.json({ error: 'Error de configuración' }, { status: 500 });

    const code = await socioDeToken(db, token);
    if (!code) return NextResponse.json({ error: 'Sesión inválida' }, { status: 401 });

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
