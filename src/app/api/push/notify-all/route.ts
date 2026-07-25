import { NextRequest, NextResponse } from 'next/server';
import webpush from 'web-push';
import { createClient } from '@supabase/supabase-js';

function getDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

function configureVapid() {
  const pub  = process.env.VAPID_PUBLIC_KEY;
  const priv = process.env.VAPID_PRIVATE_KEY;
  const sub  = process.env.VAPID_SUBJECT ?? 'mailto:juliana10zuli@gmail.com';
  if (!pub || !priv) return false;
  webpush.setVapidDetails(sub, pub, priv);
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const { adminCode, titulo, cuerpo } = await req.json();
    if (!adminCode) return NextResponse.json({ error: 'adminCode requerido' }, { status: 400 });
    if (!titulo || !cuerpo) return NextResponse.json({ error: 'titulo y cuerpo requeridos' }, { status: 400 });

    const db = getDb();
    if (!db) return NextResponse.json({ error: 'DB no configurada' }, { status: 500 });

    const { data: admin } = await db.from('socios').select('rol').eq('codigo', adminCode).single();
    if (!admin || admin.rol !== 'admin') return NextResponse.json({ error: 'No autorizado' }, { status: 403 });

    if (!configureVapid()) return NextResponse.json({ error: 'VAPID no configurado' }, { status: 500 });

    const { data: subs } = await db.from('push_subscriptions').select('*');
    if (!subs?.length) return NextResponse.json({ success: true, sent: 0, info: 'Sin suscripciones activas' });

    const payload = JSON.stringify({ title: `🌿 ProLarva — ${titulo}`, body: cuerpo, url: '/socios', tag: 'admin-broadcast' });

    let sent = 0;
    const stale: string[] = [];
    for (const sub of subs) {
      try {
        await webpush.sendNotification({ endpoint: sub.endpoint, keys: { auth: sub.auth, p256dh: sub.p256dh } }, payload);
        sent++;
      } catch (err: unknown) {
        const status = (err as { statusCode?: number }).statusCode;
        if (status === 410 || status === 404) stale.push(sub.endpoint);
      }
    }
    if (stale.length) await db.from('push_subscriptions').delete().in('endpoint', stale);

    return NextResponse.json({ success: true, sent, stale: stale.length });
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
