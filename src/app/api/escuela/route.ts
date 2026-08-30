import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase, esAdmin } from '@/lib/supabaseServer';

/**
 * Endpoint único para las escrituras de la Escuela que exigen rol admin
 * (o autoría, en el caso de borrar un post / pregunta propios).
 *
 * Antes estas operaciones se hacían directo desde el navegador con la anon key:
 * cualquier socio podía editarlas desde la consola. Ahora pasan por aquí y el
 * servidor verifica el rol contra la tabla `socios`.
 */

type Ok = { ok: true; data?: unknown };
const bad  = (error: string, status = 400) => NextResponse.json({ error }, { status });
const ok   = (data?: unknown) => NextResponse.json({ ok: true, data } as Ok);

// Columnas permitidas por entidad — evita que el payload escriba columnas raras
const pick = (obj: Record<string, unknown>, keys: string[]) => {
  const out: Record<string, unknown> = {};
  for (const k of keys) if (obj[k] !== undefined) out[k] = obj[k];
  return out;
};

const COLS = {
  clase:     ['semana', 'orden', 'titulo', 'descripcion', 'resumen', 'url_video', 'activa'],
  plantilla: ['semana', 'titulo', 'descripcion', 'url_archivo', 'tamano_aprox', 'orden'],
  tarea:     ['semana', 'pregunta', 'activa'],
  dia:       ['fecha', 'semana', 'tipo', 'titulo', 'descripcion', 'orden', 'activo'],
};

export async function POST(req: NextRequest) {
  let body: { requesterCode?: string; action?: string; payload?: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    return bad('Body inválido');
  }

  const { requesterCode, action, payload = {} } = body;
  if (!requesterCode || !action) return bad('Faltan datos');

  const db = getServerSupabase();
  if (!db) return bad('Error de configuración del servidor', 500);

  const isAdmin = await esAdmin(db, requesterCode);

  // ── Acciones que permiten autoría (post / pregunta propios) ────────────────
  if (action === 'post.delete') {
    const id = String(payload.id ?? '');
    if (!id) return bad('Falta id');
    if (!isAdmin) {
      const { data: post } = await db.from('foro_posts').select('socio_code').eq('id', id).single();
      if (!post || post.socio_code !== requesterCode) return bad('No autorizado', 403);
    }
    // borra el post y sus respuestas anidadas
    await db.from('foro_posts').delete().eq('parent_id', id);
    const { error } = await db.from('foro_posts').delete().eq('id', id);
    return error ? bad('Error al eliminar', 500) : ok();
  }

  if (action === 'pregunta.delete') {
    const id = String(payload.id ?? '');
    if (!id) return bad('Falta id');
    if (!isAdmin) {
      const { data: q } = await db.from('preguntas_escuela').select('socio_code, respondida').eq('id', id).single();
      if (!q || q.socio_code !== requesterCode || q.respondida) return bad('No autorizado', 403);
    }
    const { error } = await db.from('preguntas_escuela').delete().eq('id', id);
    return error ? bad('Error al eliminar', 500) : ok();
  }

  // ── A partir de aquí, solo admin ──────────────────────────────────────────
  if (!isAdmin) return bad('No autorizado', 403);

  switch (action) {
    // ── Clases ──────────────────────────────────────────────
    case 'clase.save': {
      const p = payload as Record<string, unknown>;
      if (p.id) {
        const { error } = await db.from('clases').update(pick(p, COLS.clase)).eq('id', String(p.id));
        return error ? bad('Error al guardar', 500) : ok();
      }
      const row = { ...pick(p, COLS.clase), orden: p.orden ?? 1, activa: p.activa ?? false };
      const { data, error } = await db.from('clases').insert(row).select().single();
      return error ? bad('Error al crear', 500) : ok(data);
    }
    case 'clase.delete': {
      const { error } = await db.from('clases').delete().eq('id', String(payload.id ?? ''));
      return error ? bad('Error al eliminar', 500) : ok();
    }

    // ── Plantillas ──────────────────────────────────────────
    case 'plantilla.save': {
      const p = payload as Record<string, unknown>;
      if (p.id) {
        const { error } = await db.from('plantillas').update(pick(p, COLS.plantilla)).eq('id', String(p.id));
        return error ? bad('Error al guardar', 500) : ok();
      }
      const { data, error } = await db.from('plantillas').insert({ ...pick(p, COLS.plantilla), orden: p.orden ?? 1 }).select().single();
      return error ? bad('Error al crear', 500) : ok(data);
    }
    case 'plantilla.delete': {
      const { error } = await db.from('plantillas').delete().eq('id', String(payload.id ?? ''));
      return error ? bad('Error al eliminar', 500) : ok();
    }

    // ── Tareas ──────────────────────────────────────────────
    case 'tarea.save': {
      const p = payload as Record<string, unknown>;
      if (p.id) {
        const { error } = await db.from('tareas').update(pick(p, COLS.tarea)).eq('id', String(p.id));
        return error ? bad('Error al guardar', 500) : ok();
      }
      const { data, error } = await db.from('tareas').insert({ ...pick(p, COLS.tarea), activa: p.activa ?? false }).select().single();
      return error ? bad('Error al crear', 500) : ok(data);
    }
    case 'tarea.delete': {
      const { error } = await db.from('tareas').delete().eq('id', String(payload.id ?? ''));
      return error ? bad('Error al eliminar', 500) : ok();
    }

    // ── Cronograma ──────────────────────────────────────────
    case 'dia.save': {
      const p = payload as Record<string, unknown>;
      if (p.id) {
        const { error } = await db.from('cronograma_dias').update(pick(p, COLS.dia)).eq('id', String(p.id));
        return error ? bad('Error al guardar', 500) : ok();
      }
      const { data, error } = await db.from('cronograma_dias').insert({ ...pick(p, COLS.dia), orden: p.orden ?? 0, activo: p.activo ?? true }).select().single();
      return error ? bad('Error al crear', 500) : ok(data);
    }
    case 'dia.delete': {
      const { error } = await db.from('cronograma_dias').delete().eq('id', String(payload.id ?? ''));
      return error ? bad('Error al eliminar', 500) : ok();
    }

    // ── Anuncios ────────────────────────────────────────────
    case 'anuncio.create': {
      const contenido = String(payload.contenido ?? '').trim().slice(0, 600);
      if (!contenido) return bad('Anuncio vacío');
      const { data, error } = await db.from('anuncios_escuela')
        .insert({ socio_code: requesterCode, socio_nombre: String(payload.socio_nombre ?? 'ProLarva'), contenido, fijado: !!payload.fijado })
        .select().single();
      return error ? bad('Error al publicar', 500) : ok(data);
    }
    case 'anuncio.delete': {
      const { error } = await db.from('anuncios_escuela').delete().eq('id', String(payload.id ?? ''));
      return error ? bad('Error al eliminar', 500) : ok();
    }
    case 'anuncio.fijar': {
      const { error } = await db.from('anuncios_escuela').update({ fijado: !!payload.fijado }).eq('id', String(payload.id ?? ''));
      return error ? bad('Error al fijar', 500) : ok();
    }

    // ── Config (countdown + enlace de reunión) ──────────────
    case 'config.set': {
      const clave = String(payload.clave ?? '');
      const valor = String(payload.valor ?? '');
      if (!clave || !valor) return bad('Faltan datos');
      const { error } = await db.from('config_escuela').upsert(
        { clave, valor, actualizado_en: new Date().toISOString() }, { onConflict: 'clave' },
      );
      return error ? bad('Error al guardar', 500) : ok();
    }
    case 'config.delete': {
      const { error } = await db.from('config_escuela').delete().eq('clave', String(payload.clave ?? ''));
      return error ? bad('Error al borrar', 500) : ok();
    }

    // ── Preguntas ───────────────────────────────────────────
    case 'pregunta.responder': {
      const id = String(payload.id ?? '');
      const respuesta = String(payload.respuesta ?? '').trim();
      const { error } = await db.from('preguntas_escuela')
        .update({ respuesta: respuesta || null, respondida: !!respuesta })
        .eq('id', id);
      return error ? bad('Error al responder', 500) : ok();
    }

    // ── Foro ────────────────────────────────────────────────
    case 'post.fijar': {
      const { error } = await db.from('foro_posts').update({ fijado: !!payload.fijado }).eq('id', String(payload.id ?? ''));
      return error ? bad('Error al fijar', 500) : ok();
    }

    // ── Directorio / cohorte ────────────────────────────────
    case 'socio.colonia': {
      const { error } = await db.from('socios').update({ en_colonia: !!payload.en_colonia }).eq('codigo', String(payload.codigo ?? ''));
      return error ? bad('Error al actualizar', 500) : ok();
    }

    default:
      return bad(`Acción desconocida: ${action}`);
  }
}
