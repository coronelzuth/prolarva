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

    const [lotesRes, cosechasRes, leadsRes, ventasRes, sociosRes] = await Promise.all([
      db.from('lotes').select('id', { count: 'exact', head: true }),
      db.from('cosechas').select('peso'),
      db.from('leads').select('id', { count: 'exact', head: true }),
      db.from('ventas').select('monto'),
      db.from('socios').select('id', { count: 'exact', head: true }).eq('rol', 'socio'),
    ]);

    const totalLotes       = lotesRes.count ?? 0;
    const totalKg          = (cosechasRes.data ?? []).reduce((s, r) => s + (r.peso || 0), 0);
    const totalLeads       = leadsRes.count ?? 0;
    const totalVentasCOP   = (ventasRes.data ?? []).reduce((s, r) => s + (r.monto || 0), 0);
    const totalVentasCount = (ventasRes.data ?? []).length;
    const totalSocios      = sociosRes.count ?? 0;
    const conversionPct    = totalLeads > 0 ? Math.round((totalSocios / totalLeads) * 100) : 0;

    return NextResponse.json({ success: true, stats: { totalLotes, totalKg, totalLeads, totalVentasCOP, totalVentasCount, totalSocios, conversionPct } });
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
