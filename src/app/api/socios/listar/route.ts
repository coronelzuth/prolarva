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
    const { adminCode } = await req.json();
    if (!adminCode) return NextResponse.json({ error: 'adminCode requerido' }, { status: 400 });

    const db = getDb();
    if (!db) return NextResponse.json({ error: 'Error de configuración' }, { status: 500 });

    const { data: admin } = await db
      .from('socios')
      .select('rol')
      .eq('codigo', adminCode)
      .single();

    if (!admin || admin.rol !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const [sociosRes, lotesRes, feedsRes, cosechasRes] = await Promise.all([
      db.from('socios').select('id, codigo, email, nombre, estado, rol, creado_en').order('creado_en', { ascending: false }),
      db.from('lotes').select('socio_code, creado_en'),
      db.from('feed_logs').select('socio_code, fecha'),
      db.from('cosechas').select('socio_code, fecha'),
    ]);

    // Calcular última actividad por socio_code
    const activityMap: Record<string, string> = {};
    for (const r of (lotesRes.data ?? [])) {
      const cur = activityMap[r.socio_code];
      if (!cur || r.creado_en > cur) activityMap[r.socio_code] = r.creado_en;
    }
    for (const r of (feedsRes.data ?? [])) {
      const cur = activityMap[r.socio_code];
      if (!cur || r.fecha > cur) activityMap[r.socio_code] = r.fecha;
    }
    for (const r of (cosechasRes.data ?? [])) {
      const cur = activityMap[r.socio_code];
      if (!cur || r.fecha > cur) activityMap[r.socio_code] = r.fecha;
    }

    const socios = (sociosRes.data ?? []).map(s => ({
      ...s,
      last_activity: activityMap[s.codigo] ?? null,
    }));

    if (sociosRes.error) return NextResponse.json({ error: sociosRes.error.message }, { status: 500 });
    return NextResponse.json({ success: true, socios });
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
