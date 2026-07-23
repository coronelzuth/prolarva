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
  const pub = process.env.VAPID_PUBLIC_KEY;
  const priv = process.env.VAPID_PRIVATE_KEY;
  const sub = process.env.VAPID_SUBJECT ?? 'mailto:juliana10zuli@gmail.com';
  if (!pub || !priv) return false;
  webpush.setVapidDetails(sub, pub, priv);
  return true;
}

// Enviar notificación de prueba a un socio específico
export async function POST(req: NextRequest) {
  if (!configureVapid()) {
    return NextResponse.json({ error: 'VAPID no configurado' }, { status: 500 });
  }
  const db = getDb();
  if (!db) return NextResponse.json({ error: 'DB no configurada' }, { status: 500 });

  const { socio_code } = await req.json();
  if (!socio_code) return NextResponse.json({ error: 'socio_code requerido' }, { status: 400 });

  const { data: subs } = await db
    .from('push_subscriptions')
    .select('*')
    .eq('socio_code', socio_code);

  if (!subs?.length) return NextResponse.json({ error: 'Sin subscripción activa' }, { status: 404 });

  const payload = JSON.stringify({
    title: '🌿 ProLarva — Prueba de notificación',
    body: '¡Funciona! Las alertas de cosecha llegarán así.',
    url: '/socios',
    tag: 'test',
  });

  let sent = 0;
  const stale: string[] = [];
  for (const sub of subs) {
    try {
      await webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { auth: sub.auth, p256dh: sub.p256dh } },
        payload
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

// Vercel cron llama a este endpoint diariamente
export async function GET(req: NextRequest) {
  // Validar que viene del cron de Vercel (o llamada directa con secret)
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  if (!configureVapid()) {
    return NextResponse.json({ error: 'VAPID no configurado' }, { status: 500 });
  }

  const db = getDb();
  if (!db) return NextResponse.json({ error: 'DB no configurada' }, { status: 500 });

  // Leer todos los lotes activos
  const { data: lotes } = await db
    .from('lotes')
    .select('id, socio_code, nombre, fecha')
    .gte('fecha', new Date(Date.now() - 35 * 86_400_000).toISOString().slice(0, 10));

  if (!lotes?.length) return NextResponse.json({ sent: 0 });

  // Calcular qué lotes necesitan alerta hoy
  const ahora = Date.now();
  const alertas: Record<string, { lotes: string[]; tipo: string }> = {};

  for (const l of lotes) {
    const dias = Math.floor((ahora - new Date(l.fecha).getTime()) / 86_400_000);
    let tipo = '';
    if (dias === 7)  tipo = '🌿 Momento de revisar la temperatura y humedad';
    if (dias === 14) tipo = '📈 Tus larvas están en crecimiento máximo — revisa la alimentación';
    if (dias === 21) tipo = '⚠️ Se acerca la ventana de cosecha — alista tu báscula';
    if (dias === 22) tipo = '⚖️ ¡Ventana de cosecha abierta! Ideal para cosechar hoy';
    if (dias === 25) tipo = '🚨 Quedan 3 días en la ventana óptima de cosecha';
    if (!tipo) continue;

    if (!alertas[l.socio_code]) alertas[l.socio_code] = { lotes: [], tipo };
    alertas[l.socio_code].lotes.push(l.nombre);
  }

  if (!Object.keys(alertas).length) return NextResponse.json({ sent: 0 });

  // Leer subscripciones de los socios con alertas
  const codes = Object.keys(alertas);
  const { data: subs } = await db
    .from('push_subscriptions')
    .select('*')
    .in('socio_code', codes);

  if (!subs?.length) return NextResponse.json({ sent: 0, info: 'Sin subscripciones activas' });

  let sent = 0;
  const stale: string[] = [];

  for (const sub of subs) {
    const alerta = alertas[sub.socio_code];
    if (!alerta) continue;

    const loteNames = alerta.lotes.join(', ');
    const payload = JSON.stringify({
      title: `ProLarva — ${alerta.lotes[0]}`,
      body: alerta.lotes.length > 1
        ? `${alerta.tipo} · Lotes: ${loteNames}`
        : `${alerta.tipo}`,
      url: '/socios',
      tag: `lote-${sub.socio_code}`,
    });

    try {
      await webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { auth: sub.auth, p256dh: sub.p256dh } },
        payload
      );
      sent++;
    } catch (err: unknown) {
      const status = (err as { statusCode?: number }).statusCode;
      if (status === 410 || status === 404) stale.push(sub.endpoint);
    }
  }

  // Eliminar subscripciones caducadas
  if (stale.length) {
    await db.from('push_subscriptions').delete().in('endpoint', stale);
  }

  return NextResponse.json({ sent, stale: stale.length });
}
