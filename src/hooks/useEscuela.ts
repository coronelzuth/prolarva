'use client';
import { useState, useEffect, useCallback } from 'react';
import { getSupabase } from '@/lib/supabase';

export interface Clase {
  id: string;
  semana: number;
  orden: number;
  titulo: string;
  descripcion?: string;
  resumen?: string;
  url_video?: string;
  activa: boolean;
  creado_en: string;
}

export interface Pregunta {
  id: string;
  socio_code: string;
  socio_nombre: string;
  semana: number | null;
  texto: string;
  respondida: boolean;
  respuesta: string | null;
  creado_en: string;
}

export interface ProgresoClase {
  socio_code: string;
  clase_id: string;
  completado: boolean;
  visto_en: string;
}

export interface Plantilla {
  id: string;
  semana: number;
  titulo: string;
  descripcion?: string;
  url_archivo: string;
  tamano_aprox?: string;
  orden: number;
  creado_en: string;
}

export interface ForoPost {
  id: string;
  parent_id?: string | null;
  socio_code: string;
  socio_nombre: string;
  contenido: string;
  creado_en: string;
  fijado?: boolean;
  reactions: { socio_code: string; tipo: string }[];
}

export interface SocioColonia {
  code: string;
  nombre: string;
  en_colonia: boolean;
  creado_en: string;
  ubicacion?: string;
  tipo_produccion?: string;
  whatsapp_pub?: string;
  instagram?: string;
  tiktok?: string;
  mostrar_directorio?: boolean;
}

export interface AnuncioEscuela {
  id: string;
  socio_code: string;
  socio_nombre: string;
  contenido: string;
  fijado: boolean;
  creado_en: string;
}

export interface Tarea {
  id: string;
  semana: number;
  pregunta: string;
  activa: boolean;
  creado_en: string;
}

export interface EntregaTarea {
  id: string;
  tarea_id: string;
  socio_code: string;
  socio_nombre: string;
  respuesta: string;
  entregado_en: string;
}

export type TipoDia = 'clase' | 'tarea' | 'reporte' | 'recurso' | 'libre';

export interface DiaCronograma {
  id: string;
  fecha: string;
  semana: number;
  tipo: TipoDia;
  titulo: string;
  descripcion?: string;
  orden: number;
  activo: boolean;
  creado_en: string;
}

export function useEscuela(socioCode: string) {
  const [clases,     setClases]     = useState<Clase[]>([]);
  const [progreso,   setProgreso]   = useState<ProgresoClase[]>([]);
  const [plantillas, setPlantillas] = useState<Plantilla[]>([]);
  const [posts,      setPosts]      = useState<ForoPost[]>([]);
  const [sociosColonia, setSociosColonia] = useState<SocioColonia[]>([]);
  const [anuncios,   setAnuncios]   = useState<AnuncioEscuela[]>([]);
  const [proxClase,  setProxClaseState] = useState<string | null>(null);
  const [urlReunion, setUrlReunionState] = useState<string | null>(null);
  const [tareas,      setTareas]      = useState<Tarea[]>([]);
  const [entregas,    setEntregas]    = useState<EntregaTarea[]>([]);
  const [cronograma,  setCronograma]  = useState<DiaCronograma[]>([]);
  const [preguntas,   setPreguntas]   = useState<Pregunta[]>([]);
  const [loaded,      setLoaded]      = useState(false);

  const load = useCallback(async () => {
    const sb = getSupabase();
    if (!sb || !socioCode) return;
    try {
      const [clasesRes, progresoRes, plantillasRes, postsRes, likesRes,
             anunciosRes, configRes, reunionRes, tareasRes, entregasRes, sociosRes, cronogramaRes, preguntasRes] = await Promise.all([
        sb.from('clases').select('*').order('semana').order('orden'),
        sb.from('progreso_clases').select('*').eq('socio_code', socioCode),
        sb.from('plantillas').select('*').order('semana').order('orden'),
        sb.from('foro_posts').select('*').order('creado_en', { ascending: false }).limit(100),
        sb.from('foro_likes').select('*'),
        sb.from('anuncios_escuela').select('*').order('fijado', { ascending: false }).order('creado_en', { ascending: false }),
        sb.from('config_escuela').select('*').eq('clave', 'proxima_clase').single(),
        sb.from('config_escuela').select('*').eq('clave', 'url_reunion').single(),
        sb.from('tareas').select('*').order('semana'),
        sb.from('entregas_tareas').select('*'),
        sb.from('socios').select('codigo,nombre,en_colonia,creado_en,ubicacion,tipo_produccion,whatsapp_pub,instagram,tiktok,mostrar_directorio').eq('estado', 'activo').order('nombre'),
        sb.from('cronograma_dias').select('*').order('fecha').order('orden'),
        sb.from('preguntas_escuela').select('*').order('creado_en', { ascending: false }),
      ]);
      const likesData: { post_id: string; socio_code: string; tipo: string }[] = likesRes.data ?? [];
      const postsWithLikes: ForoPost[] = (postsRes.data ?? []).map((p: Record<string, unknown>) => ({
        ...(p as object),
        reactions: likesData.filter(l => l.post_id === p.id).map(l => ({ socio_code: l.socio_code, tipo: l.tipo ?? 'heart' })),
      })) as ForoPost[];
      setSociosColonia((sociosRes.data ?? []).map((r: Record<string, unknown>) => ({ ...(r as object), code: (r as { codigo: string }).codigo })) as SocioColonia[]);
      setClases(clasesRes.data ?? []);
      setProgreso(progresoRes.data ?? []);
      setPlantillas(plantillasRes.data ?? []);
      setPosts(postsWithLikes);
      setAnuncios(anunciosRes.data ?? []);
      setProxClaseState(configRes.data?.valor ?? null);
      setUrlReunionState(reunionRes.data?.valor ?? null);
      setTareas(tareasRes.data ?? []);
      setEntregas(entregasRes.data ?? []);
      setCronograma(cronogramaRes.data ?? []);
      setPreguntas(preguntasRes.data ?? []);
    } finally {
      setLoaded(true);
    }
  }, [socioCode]);

  useEffect(() => { load(); }, [load]);

  // ── Escrituras de admin — pasan por /api/escuela (verifica rol en el servidor) ──
  const postAdmin = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (action: string, payload: Record<string, unknown> = {}): Promise<{ ok: boolean; data?: any }> => {
      try {
        const res = await fetch('/api/escuela', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ requesterCode: socioCode, action, payload }),
        });
        const json = await res.json().catch(() => ({}));
        return res.ok ? { ok: true, data: json.data } : { ok: false };
      } catch {
        return { ok: false };
      }
    },
    [socioCode],
  );

  // ── Clases ──────────────────────────────────────────────────────────────────

  const marcarVisto = async (claseId: string) => {
    const sb = getSupabase();
    if (!sb) return;
    await sb.from('progreso_clases').upsert(
      { socio_code: socioCode, clase_id: claseId, completado: true, visto_en: new Date().toISOString() },
      { onConflict: 'socio_code,clase_id' }
    );
    setProgreso(prev => {
      if (prev.some(p => p.clase_id === claseId)) {
        return prev.map(p => p.clase_id === claseId ? { ...p, completado: true } : p);
      }
      return [...prev, { socio_code: socioCode, clase_id: claseId, completado: true, visto_en: new Date().toISOString() }];
    });
  };

  const guardarClase = async (clase: Partial<Clase> & { semana: number; titulo: string }) => {
    if (clase.id) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { creado_en, ...rest } = clase as Clase;
      const { ok } = await postAdmin('clase.save', rest as Record<string, unknown>);
      if (ok) setClases(prev => prev.map(c => c.id === clase.id ? { ...c, ...rest } : c));
    } else {
      const { ok, data } = await postAdmin('clase.save', {
        semana: clase.semana, orden: clase.orden ?? 1, titulo: clase.titulo,
        descripcion: clase.descripcion ?? null, resumen: clase.resumen ?? null,
        url_video: clase.url_video ?? null, activa: clase.activa ?? false,
      });
      if (ok && data) setClases(prev => [...prev, data as Clase].sort((a, b) => a.semana - b.semana || a.orden - b.orden));
    }
  };

  const eliminarClase = async (id: string) => {
    const { ok } = await postAdmin('clase.delete', { id });
    if (ok) setClases(prev => prev.filter(c => c.id !== id));
  };

  // ── Plantillas ───────────────────────────────────────────────────────────────

  const guardarPlantilla = async (p: Partial<Plantilla> & { semana: number; titulo: string; url_archivo: string }) => {
    if (p.id) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { creado_en, ...rest } = p as Plantilla;
      const { ok } = await postAdmin('plantilla.save', rest as Record<string, unknown>);
      if (ok) setPlantillas(prev => prev.map(x => x.id === p.id ? { ...x, ...rest } : x));
    } else {
      const { ok, data } = await postAdmin('plantilla.save', {
        semana: p.semana, titulo: p.titulo, descripcion: p.descripcion ?? null,
        url_archivo: p.url_archivo, tamano_aprox: p.tamano_aprox ?? null, orden: p.orden ?? 1,
      });
      if (ok && data) setPlantillas(prev => [...prev, data as Plantilla]);
    }
  };

  const eliminarPlantilla = async (id: string) => {
    const { ok } = await postAdmin('plantilla.delete', { id });
    if (ok) setPlantillas(prev => prev.filter(p => p.id !== id));
  };

  // ── Foro ─────────────────────────────────────────────────────────────────────

  const publicarPost = async (contenido: string, socioNombre: string, parentId?: string): Promise<boolean> => {
    const sb = getSupabase();
    if (!sb || !contenido.trim()) return false;
    const { data, error } = await sb
      .from('foro_posts')
      .insert({ socio_code: socioCode, socio_nombre: socioNombre, contenido: contenido.trim(), parent_id: parentId ?? null })
      .select()
      .single();
    if (error || !data) return false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const post: ForoPost = { ...(data as any), reactions: [] };
    setPosts(prev => parentId ? [...prev, post] : [post, ...prev]);
    return true;
  };

  const toggleLike = async (postId: string, tipo = 'heart') => {
    const sb = getSupabase();
    if (!sb) return;
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    const existing = post.reactions.find(r => r.socio_code === socioCode);
    if (existing) {
      if (existing.tipo === tipo) {
        await sb.from('foro_likes').delete().eq('post_id', postId).eq('socio_code', socioCode);
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, reactions: p.reactions.filter(r => r.socio_code !== socioCode) } : p));
      } else {
        await sb.from('foro_likes').update({ tipo }).eq('post_id', postId).eq('socio_code', socioCode);
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, reactions: p.reactions.map(r => r.socio_code === socioCode ? { ...r, tipo } : r) } : p));
      }
    } else {
      await sb.from('foro_likes').insert({ post_id: postId, socio_code: socioCode, tipo });
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, reactions: [...p.reactions, { socio_code: socioCode, tipo }] } : p));
    }
  };

  const toggleColonia = async (code: string, en_colonia: boolean) => {
    const { ok } = await postAdmin('socio.colonia', { codigo: code, en_colonia });
    if (ok) setSociosColonia(prev => prev.map(s => s.code === code ? { ...s, en_colonia } : s));
  };

  const eliminarPost = async (id: string) => {
    const { ok } = await postAdmin('post.delete', { id });
    if (ok) setPosts(prev => prev.filter(p => p.id !== id && p.parent_id !== id));
  };

  const fijarPost = async (id: string, fijado: boolean) => {
    const { ok } = await postAdmin('post.fijar', { id, fijado });
    if (ok) setPosts(prev => prev.map(p => p.id === id ? { ...p, fijado } : p));
  };

  // ── Tablón ───────────────────────────────────────────────────────────────────

  const publicarAnuncio = async (contenido: string, socioNombre: string, fijado = false): Promise<boolean> => {
    if (!contenido.trim()) return false;
    const { ok, data } = await postAdmin('anuncio.create', { contenido: contenido.trim(), socio_nombre: socioNombre, fijado });
    if (!ok || !data) return false;
    setAnuncios(prev => [data as AnuncioEscuela, ...prev]);
    return true;
  };

  const eliminarAnuncio = async (id: string) => {
    const { ok } = await postAdmin('anuncio.delete', { id });
    if (ok) setAnuncios(prev => prev.filter(a => a.id !== id));
  };

  const toggleFijarAnuncio = async (id: string, fijado: boolean) => {
    const { ok } = await postAdmin('anuncio.fijar', { id, fijado });
    if (ok) setAnuncios(prev => prev.map(a => a.id === id ? { ...a, fijado } : a)
      .sort((a, b) => Number(b.fijado) - Number(a.fijado) || new Date(b.creado_en).getTime() - new Date(a.creado_en).getTime()));
  };

  // ── Countdown ────────────────────────────────────────────────────────────────

  const setProximaClase = async (datetime: string) => {
    const { ok } = await postAdmin('config.set', { clave: 'proxima_clase', valor: datetime });
    if (ok) setProxClaseState(datetime);
  };

  const borrarProximaClase = async () => {
    const { ok } = await postAdmin('config.delete', { clave: 'proxima_clase' });
    if (ok) setProxClaseState(null);
  };

  const setUrlReunion = async (url: string) => {
    const limpio = url.trim();
    if (!limpio) {
      const { ok } = await postAdmin('config.delete', { clave: 'url_reunion' });
      if (ok) setUrlReunionState(null);
      return;
    }
    const { ok } = await postAdmin('config.set', { clave: 'url_reunion', valor: limpio });
    if (ok) setUrlReunionState(limpio);
  };

  // ── Tareas ───────────────────────────────────────────────────────────────────

  const guardarTarea = async (t: Partial<Tarea> & { semana: number; pregunta: string }) => {
    if (t.id) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { creado_en, ...rest } = t as Tarea;
      const { ok } = await postAdmin('tarea.save', rest as Record<string, unknown>);
      if (ok) setTareas(prev => prev.map(x => x.id === t.id ? { ...x, ...rest } : x));
    } else {
      const { ok, data } = await postAdmin('tarea.save', { semana: t.semana, pregunta: t.pregunta, activa: t.activa ?? false });
      if (ok && data) setTareas(prev => [...prev, data as Tarea].sort((a, b) => a.semana - b.semana));
    }
  };

  const eliminarTarea = async (id: string) => {
    const { ok } = await postAdmin('tarea.delete', { id });
    if (ok) {
      setTareas(prev => prev.filter(t => t.id !== id));
      setEntregas(prev => prev.filter(e => e.tarea_id !== id));
    }
  };

  const entregarTarea = async (tareaId: string, respuesta: string, socioNombre: string): Promise<boolean> => {
    const sb = getSupabase();
    if (!sb || !respuesta.trim()) return false;
    const { data, error } = await sb
      .from('entregas_tareas')
      .upsert(
        { tarea_id: tareaId, socio_code: socioCode, socio_nombre: socioNombre, respuesta: respuesta.trim(), entregado_en: new Date().toISOString() },
        { onConflict: 'tarea_id,socio_code' }
      )
      .select()
      .single();
    if (error || !data) return false;
    setEntregas(prev => {
      const exists = prev.some(e => e.tarea_id === tareaId && e.socio_code === socioCode);
      if (exists) return prev.map(e => e.tarea_id === tareaId && e.socio_code === socioCode ? data as EntregaTarea : e);
      return [...prev, data as EntregaTarea];
    });
    return true;
  };

  // ── Cronograma ───────────────────────────────────────────────────────────────

  const guardarDia = async (dia: Partial<DiaCronograma> & { fecha: string; semana: number; tipo: TipoDia; titulo: string }) => {
    if (dia.id) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { creado_en, ...rest } = dia as DiaCronograma;
      const { ok } = await postAdmin('dia.save', rest as Record<string, unknown>);
      if (ok) setCronograma(prev => prev.map(d => d.id === dia.id ? { ...d, ...rest } : d));
    } else {
      const { ok, data } = await postAdmin('dia.save', {
        fecha: dia.fecha, semana: dia.semana, tipo: dia.tipo,
        titulo: dia.titulo, descripcion: dia.descripcion ?? null,
        orden: dia.orden ?? 0, activo: dia.activo ?? true,
      });
      if (ok && data) setCronograma(prev => [...prev, data as DiaCronograma].sort((a, b) => a.fecha.localeCompare(b.fecha) || a.orden - b.orden));
    }
  };

  const eliminarDia = async (id: string) => {
    const { ok } = await postAdmin('dia.delete', { id });
    if (ok) setCronograma(prev => prev.filter(d => d.id !== id));
  };

  // ── Cajita de Preguntas ──────────────────────────────────────────────────────

  const publicarPregunta = async (texto: string, semana: number | null, socioNombre: string): Promise<boolean> => {
    const sb = getSupabase();
    if (!sb || !texto.trim()) return false;
    const { data, error } = await sb
      .from('preguntas_escuela')
      .insert({ socio_code: socioCode, socio_nombre: socioNombre, semana, texto: texto.trim() })
      .select()
      .single();
    if (error || !data) return false;
    setPreguntas(prev => [data as Pregunta, ...prev]);
    return true;
  };

  const responderPregunta = async (id: string, respuesta: string): Promise<boolean> => {
    const upd = { respuesta: respuesta.trim() || null, respondida: !!respuesta.trim() };
    const { ok } = await postAdmin('pregunta.responder', { id, respuesta: respuesta.trim() });
    if (!ok) return false;
    setPreguntas(prev => prev.map(p => p.id === id ? { ...p, ...upd } : p));
    return true;
  };

  const eliminarPregunta = async (id: string) => {
    const { ok } = await postAdmin('pregunta.delete', { id });
    if (ok) setPreguntas(prev => prev.filter(p => p.id !== id));
  };

  // ── Computed ─────────────────────────────────────────────────────────────────

  const clasesPorSemana     = (s: number) => clases.filter(c => c.semana === s);
  const plantillasPorSemana = (s: number) => plantillas.filter(p => p.semana === s);
  const tareasPorSemana     = (s: number) => tareas.filter(t => t.semana === s);
  const estaVisto           = (claseId: string) => progreso.some(p => p.clase_id === claseId && p.completado);
  const miEntrega           = (tareaId: string) => entregas.find(e => e.tarea_id === tareaId && e.socio_code === socioCode);
  const entregasPorTarea    = (tareaId: string) => entregas.filter(e => e.tarea_id === tareaId);
  const totalClases         = clases.filter(c => c.activa).length;
  const totalVistos         = clases.filter(c => c.activa && estaVisto(c.id)).length;

  return {
    loaded, clases, progreso, plantillas, posts, anuncios, proxClase, urlReunion, tareas, entregas, sociosColonia, cronograma, preguntas,
    marcarVisto, publicarPost, toggleLike, eliminarPost, fijarPost, toggleColonia,
    guardarClase, eliminarClase,
    guardarPlantilla, eliminarPlantilla,
    publicarAnuncio, eliminarAnuncio, toggleFijarAnuncio,
    setProximaClase, borrarProximaClase, setUrlReunion,
    guardarTarea, eliminarTarea, entregarTarea,
    guardarDia, eliminarDia,
    publicarPregunta, responderPregunta, eliminarPregunta,
    clasesPorSemana, plantillasPorSemana, tareasPorSemana,
    estaVisto, miEntrega, entregasPorTarea,
    totalClases, totalVistos,
    reload: load,
  };
}
