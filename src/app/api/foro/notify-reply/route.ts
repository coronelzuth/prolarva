import { NextRequest, NextResponse } from 'next/server';
import webpush from 'web-push';
import { createClient } from '@supabase/supabase-js';

function getDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
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
  const { to_code, from_name, preview } = await req.json();
  if (!to_code || !from_name) {
    return NextResponse.json({ error: 'to_code y from_name son requeridos' }, { status: 400 });
  }

  if (!configureVapid()) return NextResponse.json({ sent: 0, reason: 'vapid_missing' });

  const db = getDb();
  if (!db) return NextResponse.json({ sent: 0, reason: 'db_missing' });

  const { data: subs } = await db
    .from('push_subscriptions')
    .select('*')
    .eq('socio_code', to_code);

  if (!subs?.length) return NextResponse.json({ sent: 0, reason: 'no_subs' });

  const body = preview
    ? `${preview.slice(0, 80)}${preview.length > 80 ? '…' : ''}`
    : 'Mira la respuesta en el foro.';

  const payload = JSON.stringify({
    title: `💬 ${from_name} te respondió en el foro`,
    body,
    url: '/socios',
    tag: `foro-reply-${to_code}`,
  });

  let sent = 0;
  const stale: string[] = [];

  for (const sub of subs) {
    try {
      await webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { auth: sub.auth, p256dh: sub.p256dh } },
        payload,
        { urgency: 'high' }
      );
      sent++;
    } catch (err: unknown) {
      const status = (err as { statusCode?: number }).statusCode;
      if (status === 410 || status === 404) stale.push(sub.endpoint);
    }
  }

  if (stale.length) {
    await db.from('push_subscriptions').delete().in('endpoint', stale);
  }

  return NextResponse.json({ sent });
}
