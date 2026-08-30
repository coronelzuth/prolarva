import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabaseServer';
import { socioDeToken, borrarSesion } from '@/lib/sesion';

/**
 * Datos de producción del socio (lotes, alimentaciones, cosechas, recordatorios,
 * fotos, ventas). Antes se leían/escribían directo desde el navegador con la
 * anon key filtrando por `socio_code` — spoofable. Ahora todo pasa por aquí:
 * el `socio_code` sale del token de sesión, nunca del body.
 *
 * Body: { token, action, payload }
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

const bad = (error: string, status = 400) => NextResponse.json({ error }, { status });
const ok  = (data?: unknown) => NextResponse.json({ ok: true, data });

// ─── Converters (camelCase cliente <-> snake_case fila) ─────────────────────

const loteToRow = (code: string, l: any) => ({
  id: l.id, socio_code: code, nombre: l.nombre, fecha: l.fecha,
  sustrato: l.sustrato, tipo_sustrato: l.tipoSustrato, huevos: l.huevos,
  temp: l.temp, notas: l.notas, creado_en: l.creadoEn, objetivo: l.objetivo ?? 'cosechar',
});
const loteFromRow = (r: any) => ({
  id: r.id, nombre: r.nombre, fecha: r.fecha, sustrato: r.sustrato ?? 0,
  tipoSustrato: r.tipo_sustrato ?? '', huevos: r.huevos ?? '', temp: r.temp ?? null,
  notas: r.notas ?? '', creadoEn: r.creado_en, objetivo: r.objetivo ?? 'cosechar',
});

const feedToRow = (code: string, f: any) => ({
  id: f.id, lote_id: f.loteId, socio_code: code, fecha: f.fecha,
  cantidad: f.cantidad, tipo: f.tipo, rechazo: f.rechazo, notas: f.notas,
});
const feedFromRow = (r: any) => ({
  id: r.id, loteId: r.lote_id, fecha: r.fecha, cantidad: r.cantidad,
  tipo: r.tipo, rechazo: r.rechazo ?? 'ninguno', notas: r.notas ?? '',
});

const cosechaToRow = (code: string, c: any) => ({
  id: c.id, lote_id: c.loteId, socio_code: code, fecha: c.fecha, peso: c.peso,
  sustrato_total: c.sustratoTotal, calidad: c.calidad, notas: c.notas,
});
const cosechaFromRow = (r: any) => ({
  id: r.id, loteId: r.lote_id, fecha: r.fecha, peso: r.peso,
  sustratoTotal: r.sustrato_total ?? 0, calidad: r.calidad ?? 'buena', notas: r.notas ?? '',
});

const recToRow = (code: string, r: any) => ({
  id: r.id, lote_id: r.loteId, socio_code: code, dia: r.dia,
  titulo: r.titulo, completado: r.completado ?? false, creado_en: r.creadoEn,
});
const recFromRow = (r: any) => ({
  id: r.id, loteId: r.lote_id, dia: r.dia, titulo: r.titulo,
  completado: r.completado ?? false, creadoEn: r.creado_en,
});

const fotoToRow = (code: string, f: any) => ({
  id: f.id, lote_id: f.loteId, socio_code: code,
  data: f.data, descripcion: f.descripcion, creado_en: f.creadoEn,
});
const fotoFromRow = (r: any) => ({
  id: r.id, loteId: r.lote_id, data: r.data,
  descripcion: r.descripcion ?? '', creadoEn: r.creado_en,
});

const ventaToRow = (code: string, v: any) => ({
  id: v.id, socio_code: code, fecha: v.fecha, producto: v.producto, kg: v.kg,
  precio_cop_kg: v.precioCopKg, total_cop: v.totalCop, comprador: v.comprador,
  notas: v.notas, creado_en: v.creadoEn,
});
const ventaFromRow = (r: any) => ({
  id: r.id, fecha: r.fecha, producto: r.producto, kg: r.kg,
  precioCopKg: r.precio_cop_kg, totalCop: r.total_cop,
  comprador: r.comprador ?? '', notas: r.notas ?? '', creadoEn: r.creado_en,
});

const TABLAS_DATOS = ['lotes', 'feed_logs', 'cosechas', 'recordatorios', 'fotos_lotes', 'ventas_socios'] as const;

export async function POST(req: NextRequest) {
  let body: { token?: string; action?: string; payload?: any };
  try { body = await req.json(); } catch { return bad('Body inválido'); }

  const { token, action, payload = {} } = body;
  if (!action) return bad('Falta action');

  const db = getServerSupabase();
  if (!db) return bad('Error de configuración del servidor', 500);

  if (action === 'logout') {
    await borrarSesion(db, token);
    return ok();
  }

  const code = await socioDeToken(db, token);
  if (!code) return bad('Sesión inválida', 401);

  switch (action) {

    // ── Sincronizar todo ──────────────────────────────────────────────────
    case 'sync': {
      const [lo, fe, co, re, fo, ve] = await Promise.all(
        TABLAS_DATOS.map(t => db.from(t).select('*').eq('socio_code', code)),
      );
      const local = payload.local ?? {};

      // Recuperación: si una tabla está vacía en la DB pero el cliente trae
      // datos locales, se suben (mismo comportamiento que el sync viejo).
      async function resolver(rows: any[] | null, localRows: any[], toRow: (x: any) => any, fromRow: (r: any) => any, table: string) {
        if (rows === null) return null;
        if (rows.length > 0) return rows.map(fromRow);
        if (Array.isArray(localRows) && localRows.length > 0) {
          await db!.from(table).upsert(localRows.map(toRow));
          return localRows;
        }
        return [];
      }

      const [lotes, feeds, cosechas, recordatorios, fotos, ventasSocios] = await Promise.all([
        resolver(lo.data, local.lotes,         (x) => loteToRow(code, x),    loteFromRow,    'lotes'),
        resolver(fe.data, local.feeds,         (x) => feedToRow(code, x),    feedFromRow,    'feed_logs'),
        resolver(co.data, local.cosechas,      (x) => cosechaToRow(code, x), cosechaFromRow, 'cosechas'),
        resolver(re.data, local.recordatorios, (x) => recToRow(code, x),     recFromRow,     'recordatorios'),
        resolver(fo.data, local.fotos,         (x) => fotoToRow(code, x),    fotoFromRow,    'fotos_lotes'),
        resolver(ve.data, local.ventasSocios,  (x) => ventaToRow(code, x),   ventaFromRow,   'ventas_socios'),
      ]);

      return ok({ lotes, feeds, cosechas, recordatorios, fotos, ventasSocios });
    }

    // ── Lotes ─────────────────────────────────────────────────────────────
    case 'lote.add': {
      const { error } = await db.from('lotes').upsert(loteToRow(code, payload));
      return error ? bad(error.message, 500) : ok();
    }
    case 'lote.update': {
      const { id, updates } = payload;
      const safe: Record<string, unknown> = {};
      if (typeof updates?.nombre === 'string') safe.nombre = updates.nombre;
      if (typeof updates?.fecha === 'string')  safe.fecha = updates.fecha;
      const { error } = await db.from('lotes').update(safe).eq('id', id).eq('socio_code', code);
      return error ? bad(error.message, 500) : ok();
    }
    case 'lote.delete': {
      const { id } = payload;
      // verificar propiedad y borrar en cascada
      const { data: lote } = await db.from('lotes').select('id').eq('id', id).eq('socio_code', code).single();
      if (!lote) return bad('No encontrado', 404);
      await Promise.all([
        db.from('feed_logs').delete().eq('lote_id', id).eq('socio_code', code),
        db.from('cosechas').delete().eq('lote_id', id).eq('socio_code', code),
        db.from('recordatorios').delete().eq('lote_id', id).eq('socio_code', code),
        db.from('fotos_lotes').delete().eq('lote_id', id).eq('socio_code', code),
      ]);
      const { error } = await db.from('lotes').delete().eq('id', id).eq('socio_code', code);
      return error ? bad(error.message, 500) : ok();
    }

    // ── Alimentaciones / cosechas ─────────────────────────────────────────
    case 'feed.add': {
      const { error } = await db.from('feed_logs').upsert(feedToRow(code, payload));
      return error ? bad(error.message, 500) : ok();
    }
    case 'cosecha.add': {
      const { error } = await db.from('cosechas').upsert(cosechaToRow(code, payload));
      return error ? bad(error.message, 500) : ok();
    }

    // ── Recordatorios ─────────────────────────────────────────────────────
    case 'recordatorio.add': {
      const { error } = await db.from('recordatorios').upsert(recToRow(code, payload));
      return error ? bad(error.message, 500) : ok();
    }
    case 'recordatorio.toggle': {
      const { error } = await db.from('recordatorios')
        .update({ completado: !!payload.completado }).eq('id', payload.id).eq('socio_code', code);
      return error ? bad(error.message, 500) : ok();
    }
    case 'recordatorio.delete': {
      const { error } = await db.from('recordatorios').delete().eq('id', payload.id).eq('socio_code', code);
      return error ? bad(error.message, 500) : ok();
    }

    // ── Fotos ─────────────────────────────────────────────────────────────
    case 'foto.add': {
      const { error } = await db.from('fotos_lotes').upsert(fotoToRow(code, payload));
      return error ? bad(error.message, 500) : ok();
    }
    case 'foto.delete': {
      const { error } = await db.from('fotos_lotes').delete().eq('id', payload.id).eq('socio_code', code);
      return error ? bad(error.message, 500) : ok();
    }

    // ── Ventas del socio ──────────────────────────────────────────────────
    case 'venta.add': {
      const { error } = await db.from('ventas_socios').upsert(ventaToRow(code, payload));
      return error ? bad(error.message, 500) : ok();
    }
    case 'venta.delete': {
      const { error } = await db.from('ventas_socios').delete().eq('id', payload.id).eq('socio_code', code);
      return error ? bad(error.message, 500) : ok();
    }

    // ── Reset total ───────────────────────────────────────────────────────
    case 'reset': {
      await Promise.all(TABLAS_DATOS.map(t => db.from(t).delete().eq('socio_code', code)));
      return ok();
    }

    default:
      return bad(`Acción desconocida: ${action}`);
  }
}
