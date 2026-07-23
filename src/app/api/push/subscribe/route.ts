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
    const { socioCode, subscription } = await req.json();
    if (!socioCode || !subscription?.endpoint) {
      return NextResponse.json({ error: 'Datos requeridos' }, { status: 400 });
    }

    const db = getDb();
    if (!db) return NextResponse.json({ error: 'Error de configuración' }, { status: 500 });

    await db.from('push_subscriptions').upsert({
      socio_code: socioCode,
      endpoint: subscription.endpoint,
      auth: subscription.keys?.auth ?? '',
      p256dh: subscription.keys?.p256dh ?? '',
    }, { onConflict: 'socio_code,endpoint' });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { socioCode, endpoint } = await req.json();
    if (!socioCode) return NextResponse.json({ error: 'Datos requeridos' }, { status: 400 });

    const db = getDb();
    if (!db) return NextResponse.json({ error: 'Error de configuración' }, { status: 500 });

    const query = db.from('push_subscriptions').delete().eq('socio_code', socioCode);
    if (endpoint) query.eq('endpoint', endpoint);
    await query;

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
