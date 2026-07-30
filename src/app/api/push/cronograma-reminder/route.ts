import { NextResponse } from 'next/server';
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

const TIPO_EMOJI: Record<string, string> = {
  clase:   '🎥',
  tarea:   '📝',
  reporte: '📊',
  recurso: '📄',
  libre:   '🗓️',
};

export async function POST() {
  try {
    const db = getDb();
    if (!db) return NextResponse.json({ error: 'DB no configurada' }, { status: 500 });

    if (!configureVapid()) return NextResponse.json({ error: 'VAPID no configurado' }, { status: 500 });

    // Buscar la próxima actividad activa desde hoy en adelante
    const hoy = new Date().toISOString().split('T')[0];
    const { data: dias } = await db
      .from('cronograma_dias')
      .select('*')
      .eq('activo', true)
      .gte('fecha', hoy)
      .order('fecha')
      .order('orden')
      .limit(1);

    const dia = dias?.[0];

    const titulo = dia
      ? `${TIPO_EMOJI[dia.tipo] ?? '📅'} ${dia.titulo}`
      : '📅 Revisa el cronograma del programa';

    const cuerpo = dia
      ? `${new Date(dia.fecha + 'T12:00:00').toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })}${dia.descripcion ? ` — ${dia.descripcion}` : ''}`
      : 'Entra a la Escuela ProLarva para ver tus próximas actividades.';

    const { data: subs } = await db.from('push_subscriptions').select('*');
    if (!subs?.length) return NextResponse.json({ success: true, sent: 0, info: 'Sin suscripciones activas' });

    const payload = JSON.stringify({
      title: `🌿 ProLarva — ${titulo}`,
      body: cuerpo,
      url: '/socios',
      tag: 'cronograma-reminder',
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
    if (stale.length) await db.from('push_subscriptions').delete().in('endpoint', stale);

    return NextResponse.json({ success: true, sent, stale: stale.length, dia: dia?.titulo ?? null });
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
