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
    const { slug } = await req.json();
    if (!slug) return NextResponse.json({ error: 'slug requerido' }, { status: 400 });

    const db = getDb();
    if (!db) return NextResponse.json({ error: 'Error de configuración' }, { status: 500 });

    const { data: current } = await db
      .from('blog_views')
      .select('views')
      .eq('slug', slug)
      .maybeSingle();

    if (current) {
      await db
        .from('blog_views')
        .update({ views: current.views + 1, last_viewed_at: new Date().toISOString() })
        .eq('slug', slug);
    } else {
      await db
        .from('blog_views')
        .insert({ slug, views: 1, last_viewed_at: new Date().toISOString() });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
