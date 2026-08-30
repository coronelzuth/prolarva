import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function GET() {
  try {
    const db = getDb();
    if (!db) return NextResponse.json({ anuncio: null });

    const { data } = await db
      .from('anuncios')
      .select('texto')
      .eq('activo', true)
      .order('creado_en', { ascending: false })
      .limit(1)
      .single();

    return NextResponse.json({ anuncio: data?.texto ?? null });
  } catch {
    return NextResponse.json({ anuncio: null });
  }
}
