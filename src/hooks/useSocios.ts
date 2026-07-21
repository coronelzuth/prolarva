'use client';

import { useState, useEffect, useCallback } from 'react';
import { getSupabase } from '@/lib/supabase';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Lote {
  id: string;
  nombre: string;
  fecha: string;
  sustrato: number;
  tipoSustrato: string;
  huevos: string;
  temp: number | null;
  notas: string;
  creadoEn: string;
  objetivo?: 'cosechar' | 'continuar';
}

export interface FeedLog {
  id: string;
  loteId: string;
  fecha: string;
  cantidad: number;
  tipo: string;
  rechazo: 'ninguno' | 'leve' | 'moderado' | 'alto';
  notas: string;
}

export interface Cosecha {
  id: string;
  loteId: string;
  fecha: string;
  peso: number;
  sustratoTotal: number;
  calidad: 'excelente' | 'buena' | 'regular' | 'baja';
  notas: string;
}

export interface Recordatorio {
  id: string;
  loteId: string;
  dia: number;
  titulo: string;
  completado: boolean;
  creadoEn: string;
}

export interface Foto {
  id: string;
  loteId: string;
  data: string;        // base64 JPEG comprimido
  descripcion: string;
  creadoEn: string;
}

export interface SocioSession {
  code: string;
  name: string;
  rol: 'admin' | 'socio';
}

// ─── BSF Cycle ───────────────────────────────────────────────────────────────

export const BSF_STAGES = [
  { key: 'huevo',    name: 'Huevo',        icon: '🥚', days: [0, 4]   },
  { key: 'larvaJ',  name: 'Larva joven',  icon: '🐛', days: [5, 14]  },
  { key: 'larvaM',  name: 'Larva madura', icon: '🦟', days: [15, 21] },
  { key: 'prepupa', name: 'Prepupa',       icon: '⭐', days: [22, 28] },
  { key: 'cosecha', name: 'Cosecha',       icon: '⚖️', days: [29, 99] },
] as const;

export function daysSince(dateStr: string): number {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86_400_000);
}

export function getStage(days: number) {
  for (let i = 0; i < BSF_STAGES.length; i++) {
    const s = BSF_STAGES[i];
    if (days >= s.days[0] && days <= s.days[1]) return { ...s, idx: i };
  }
  return { ...BSF_STAGES[BSF_STAGES.length - 1], idx: BSF_STAGES.length - 1 };
}

export function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export interface AuthError {
  message: string;
  code?: string;
}

// ─── Storage keys ─────────────────────────────────────────────────────────────

const KEYS = {
  session:        'prl-session',
  lotes:          'prl-lotes',
  feeds:          'prl-feeds',
  cosechas:       'prl-cosechas',
  recordatorios:  'prl-recordatorios',
  fotos:          'prl-fotos',
};

function load<T>(key: string, def: T): T {
  try { return JSON.parse(localStorage.getItem(key) ?? '') ?? def; } catch { return def; }
}
function localSave<T>(key: string, val: T) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

// ─── Supabase row converters ──────────────────────────────────────────────────

function loteToRow(socioCode: string, l: Lote) {
  return {
    id: l.id, socio_code: socioCode,
    nombre: l.nombre, fecha: l.fecha,
    sustrato: l.sustrato, tipo_sustrato: l.tipoSustrato,
    huevos: l.huevos, temp: l.temp,
    notas: l.notas, creado_en: l.creadoEn,
    objetivo: l.objetivo ?? 'cosechar',
  };
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function loteFromRow(r: any): Lote {
  return {
    id: r.id, nombre: r.nombre, fecha: r.fecha,
    sustrato: r.sustrato ?? 0, tipoSustrato: r.tipo_sustrato ?? '',
    huevos: r.huevos ?? '', temp: r.temp ?? null,
    notas: r.notas ?? '', creadoEn: r.creado_en,
    objetivo: r.objetivo ?? 'cosechar',
  };
}

function feedToRow(socioCode: string, f: FeedLog) {
  return {
    id: f.id, lote_id: f.loteId, socio_code: socioCode,
    fecha: f.fecha, cantidad: f.cantidad, tipo: f.tipo,
    rechazo: f.rechazo, notas: f.notas,
  };
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function feedFromRow(r: any): FeedLog {
  return {
    id: r.id, loteId: r.lote_id, fecha: r.fecha,
    cantidad: r.cantidad, tipo: r.tipo,
    rechazo: r.rechazo ?? 'ninguno', notas: r.notas ?? '',
  };
}

function cosechaToRow(socioCode: string, c: Cosecha) {
  return {
    id: c.id, lote_id: c.loteId, socio_code: socioCode,
    fecha: c.fecha, peso: c.peso,
    sustrato_total: c.sustratoTotal, calidad: c.calidad, notas: c.notas,
  };
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function cosechaFromRow(r: any): Cosecha {
  return {
    id: r.id, loteId: r.lote_id, fecha: r.fecha,
    peso: r.peso, sustratoTotal: r.sustrato_total ?? 0,
    calidad: r.calidad ?? 'buena', notas: r.notas ?? '',
  };
}

function recToRow(socioCode: string, r: Recordatorio) {
  return {
    id: r.id, lote_id: r.loteId, socio_code: socioCode,
    dia: r.dia, titulo: r.titulo,
    completado: r.completado, creado_en: r.creadoEn,
  };
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function recFromRow(r: any): Recordatorio {
  return {
    id: r.id, loteId: r.lote_id, dia: r.dia,
    titulo: r.titulo, completado: r.completado ?? false,
    creadoEn: r.creado_en,
  };
}

function fotoToRow(socioCode: string, f: Foto) {
  return {
    id: f.id, lote_id: f.loteId, socio_code: socioCode,
    data: f.data, descripcion: f.descripcion, creado_en: f.creadoEn,
  };
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fotoFromRow(r: any): Foto {
  return {
    id: r.id, loteId: r.lote_id,
    data: r.data, descripcion: r.descripcion ?? '',
    creadoEn: r.creado_en,
  };
}

// ─── Supabase sync ────────────────────────────────────────────────────────────

async function syncFromSupabase(
  db: ReturnType<typeof getSupabase>,
  code: string,
  local: {
    lotes: Lote[]; feeds: FeedLog[]; cosechas: Cosecha[];
    recordatorios: Recordatorio[]; fotos: Foto[];
  }
) {
  if (!db) return null;

  const [
    { data: dbLotes },
    { data: dbFeeds },
    { data: dbCosechas },
    { data: dbRecs },
    { data: dbFotos },
  ] = await Promise.all([
    db.from('lotes').select('*').eq('socio_code', code),
    db.from('feed_logs').select('*').eq('socio_code', code),
    db.from('cosechas').select('*').eq('socio_code', code),
    db.from('recordatorios').select('*').eq('socio_code', code),
    db.from('fotos_lotes').select('*').eq('socio_code', code),
  ]);

  // db is guaranteed non-null here (checked above)
  const safeDb = db!;

  async function resolveTable<T>(
    dbRows: unknown[] | null,
    localRows: T[],
    toRow: (item: T) => object,
    fromRow: (r: unknown) => T,
    table: string,
  ): Promise<T[] | null> {
    if (dbRows === null) return null;
    if (dbRows.length > 0) return (dbRows as unknown[]).map(fromRow);
    if (localRows.length > 0) {
      await Promise.all(localRows.map(item => safeDb.from(table).upsert(toRow(item))));
      return localRows;
    }
    return [];
  }

  const [lotes, feeds, cosechas, recordatorios, fotos] = await Promise.all([
    resolveTable(dbLotes, local.lotes, l => loteToRow(code, l as Lote), loteFromRow, 'lotes'),
    resolveTable(dbFeeds, local.feeds, f => feedToRow(code, f as FeedLog), feedFromRow, 'feed_logs'),
    resolveTable(dbCosechas, local.cosechas, c => cosechaToRow(code, c as Cosecha), cosechaFromRow, 'cosechas'),
    resolveTable(dbRecs, local.recordatorios, r => recToRow(code, r as Recordatorio), recFromRow, 'recordatorios'),
    resolveTable(dbFotos, local.fotos, f => fotoToRow(code, f as Foto), fotoFromRow, 'fotos_lotes'),
  ]);

  return { lotes, feeds, cosechas, recordatorios, fotos };
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useSocios() {
  const [session,        setSession]        = useState<SocioSession | null>(null);
  const [lotes,          setLotes]          = useState<Lote[]>([]);
  const [feeds,          setFeeds]          = useState<FeedLog[]>([]);
  const [cosechas,       setCosechas]       = useState<Cosecha[]>([]);
  const [recordatorios,  setRecordatorios]  = useState<Recordatorio[]>([]);
  const [fotos,          setFotos]          = useState<Foto[]>([]);
  const [loaded,         setLoaded]         = useState(false);

  useEffect(() => {
    async function init() {
      const sess = load<SocioSession | null>(KEYS.session, null);
      setSession(sess);

      const local = {
        lotes:         load<Lote[]>(KEYS.lotes, []),
        feeds:         load<FeedLog[]>(KEYS.feeds, []),
        cosechas:      load<Cosecha[]>(KEYS.cosechas, []),
        recordatorios: load<Recordatorio[]>(KEYS.recordatorios, []),
        fotos:         load<Foto[]>(KEYS.fotos, []),
      };
      setLotes(local.lotes);
      setFeeds(local.feeds);
      setCosechas(local.cosechas);
      setRecordatorios(local.recordatorios);
      setFotos(local.fotos);

      const db = getSupabase();
      if (db && sess) {
        const result = await syncFromSupabase(db, sess.code, local);
        if (result) {
          if (result.lotes)         { setLotes(result.lotes);                       localSave(KEYS.lotes, result.lotes); }
          if (result.feeds)         { setFeeds(result.feeds);                       localSave(KEYS.feeds, result.feeds); }
          if (result.cosechas)      { setCosechas(result.cosechas);                 localSave(KEYS.cosechas, result.cosechas); }
          if (result.recordatorios) { setRecordatorios(result.recordatorios);       localSave(KEYS.recordatorios, result.recordatorios); }
          if (result.fotos)         { setFotos(result.fotos);                       localSave(KEYS.fotos, result.fotos); }
        }
      }

      setLoaded(true);
    }
    init();
  }, []);

  // ─── Auth ──────────────────────────────────────────────────────────────────

  const login = useCallback(async (code: string, pass: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/socios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, password: pass }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) return false;

      const s: SocioSession = { code: data.codigo, name: data.nombre, rol: data.rol ?? 'socio' };
      setSession(s);
      localSave(KEYS.session, s);

      const db = getSupabase();
      if (db) {
        const local = {
          lotes:         load<Lote[]>(KEYS.lotes, []),
          feeds:         load<FeedLog[]>(KEYS.feeds, []),
          cosechas:      load<Cosecha[]>(KEYS.cosechas, []),
          recordatorios: load<Recordatorio[]>(KEYS.recordatorios, []),
          fotos:         load<Foto[]>(KEYS.fotos, []),
        };
        const result = await syncFromSupabase(db, s.code, local);
        if (result) {
          if (result.lotes)         { setLotes(result.lotes);                 localSave(KEYS.lotes, result.lotes); }
          if (result.feeds)         { setFeeds(result.feeds);                 localSave(KEYS.feeds, result.feeds); }
          if (result.cosechas)      { setCosechas(result.cosechas);           localSave(KEYS.cosechas, result.cosechas); }
          if (result.recordatorios) { setRecordatorios(result.recordatorios); localSave(KEYS.recordatorios, result.recordatorios); }
          if (result.fotos)         { setFotos(result.fotos);                 localSave(KEYS.fotos, result.fotos); }
        }
      }

      return true;
    } catch {
      return false;
    }
  }, []);

  const register = useCallback(
    async (email: string, nombre: string, password: string, codigoInvitacion: string): Promise<{ success: boolean; error?: string }> => {
      try {
        const res = await fetch('/api/socios/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, nombre, password, codigoInvitacion }),
        });
        const data = await res.json();
        if (!res.ok) return { success: false, error: data.error ?? 'Error al registrar' };
        const loginSuccess = await login(email, password);
        return { success: loginSuccess, error: loginSuccess ? undefined : 'No se pudo iniciar sesión' };
      } catch {
        return { success: false, error: 'Error de conexión' };
      }
    },
    [login]
  );

  const logout = useCallback(() => {
    setSession(null);
    localSave(KEYS.session, null);
  }, []);

  // ─── Lotes ─────────────────────────────────────────────────────────────────

  const addLote = useCallback(async (lote: Omit<Lote, 'id' | 'creadoEn'>) => {
    const next: Lote = { ...lote, id: uid(), creadoEn: new Date().toISOString() };
    setLotes(prev => { const arr = [...prev, next]; localSave(KEYS.lotes, arr); return arr; });
    const db = getSupabase();
    if (db && session) {
      const { error } = await db.from('lotes').upsert(loteToRow(session.code, next));
      if (error) console.error('[ProLarva] addLote:', error.message);
    }
  }, [session]);

  const deleteLote = useCallback(async (id: string) => {
    setLotes(prev => { const arr = prev.filter(l => l.id !== id); localSave(KEYS.lotes, arr); return arr; });
    setFeeds(prev => { const arr = prev.filter(f => f.loteId !== id); localSave(KEYS.feeds, arr); return arr; });
    setCosechas(prev => { const arr = prev.filter(c => c.loteId !== id); localSave(KEYS.cosechas, arr); return arr; });
    setRecordatorios(prev => { const arr = prev.filter(r => r.loteId !== id); localSave(KEYS.recordatorios, arr); return arr; });
    setFotos(prev => { const arr = prev.filter(f => f.loteId !== id); localSave(KEYS.fotos, arr); return arr; });
    const db = getSupabase();
    if (db) {
      const { error } = await db.from('lotes').delete().eq('id', id);
      if (error) console.error('[ProLarva] deleteLote:', error.message);
    }
  }, []);

  const updateLote = useCallback(async (id: string, updates: Partial<Pick<Lote, 'nombre' | 'fecha'>>) => {
    setLotes(prev => { const arr = prev.map(l => l.id === id ? { ...l, ...updates } : l); localSave(KEYS.lotes, arr); return arr; });
    const db = getSupabase();
    if (db && session) {
      const { error } = await db.from('lotes').update(updates).eq('id', id);
      if (error) console.error('[ProLarva] updateLote:', error.message);
    }
  }, [session]);

  // ─── Feeds ─────────────────────────────────────────────────────────────────

  const addFeed = useCallback(async (feed: Omit<FeedLog, 'id'>) => {
    const next: FeedLog = { ...feed, id: uid() };
    setFeeds(prev => { const arr = [...prev, next]; localSave(KEYS.feeds, arr); return arr; });
    const db = getSupabase();
    if (db && session) {
      const { error } = await db.from('feed_logs').upsert(feedToRow(session.code, next));
      if (error) console.error('[ProLarva] addFeed:', error.message);
    }
  }, [session]);

  // ─── Cosechas ──────────────────────────────────────────────────────────────

  const addCosecha = useCallback(async (cosecha: Omit<Cosecha, 'id'>) => {
    const next: Cosecha = { ...cosecha, id: uid() };
    setCosechas(prev => { const arr = [...prev, next]; localSave(KEYS.cosechas, arr); return arr; });
    const db = getSupabase();
    if (db && session) {
      const { error } = await db.from('cosechas').upsert(cosechaToRow(session.code, next));
      if (error) console.error('[ProLarva] addCosecha:', error.message);
    }
  }, [session]);

  // ─── Recordatorios ─────────────────────────────────────────────────────────

  const addRecordatorio = useCallback(async (rec: Omit<Recordatorio, 'id' | 'completado' | 'creadoEn'>) => {
    const next: Recordatorio = { ...rec, id: uid(), completado: false, creadoEn: new Date().toISOString() };
    setRecordatorios(prev => { const arr = [...prev, next]; localSave(KEYS.recordatorios, arr); return arr; });
    const db = getSupabase();
    if (db && session) {
      const { error } = await db.from('recordatorios').upsert(recToRow(session.code, next));
      if (error) console.error('[ProLarva] addRecordatorio:', error.message);
    }
  }, [session]);

  const toggleRecordatorio = useCallback(async (id: string) => {
    let completado = false;
    setRecordatorios(prev => {
      const arr = prev.map(r => r.id === id ? { ...r, completado: !r.completado } : r);
      completado = arr.find(r => r.id === id)?.completado ?? false;
      localSave(KEYS.recordatorios, arr);
      return arr;
    });
    const db = getSupabase();
    if (db) {
      const { error } = await db.from('recordatorios').update({ completado }).eq('id', id);
      if (error) console.error('[ProLarva] toggleRecordatorio:', error.message);
    }
  }, []);

  const deleteRecordatorio = useCallback(async (id: string) => {
    setRecordatorios(prev => { const arr = prev.filter(r => r.id !== id); localSave(KEYS.recordatorios, arr); return arr; });
    const db = getSupabase();
    if (db) {
      const { error } = await db.from('recordatorios').delete().eq('id', id);
      if (error) console.error('[ProLarva] deleteRecordatorio:', error.message);
    }
  }, []);

  // ─── Fotos ─────────────────────────────────────────────────────────────────

  const addFoto = useCallback(async (foto: Omit<Foto, 'id' | 'creadoEn'>) => {
    const next: Foto = { ...foto, id: uid(), creadoEn: new Date().toISOString() };
    setFotos(prev => { const arr = [...prev, next]; localSave(KEYS.fotos, arr); return arr; });
    const db = getSupabase();
    if (db && session) {
      const { error } = await db.from('fotos_lotes').upsert(fotoToRow(session.code, next));
      if (error) console.error('[ProLarva] addFoto:', error.message);
    }
  }, [session]);

  const deleteFoto = useCallback(async (id: string) => {
    setFotos(prev => { const arr = prev.filter(f => f.id !== id); localSave(KEYS.fotos, arr); return arr; });
    const db = getSupabase();
    if (db) {
      const { error } = await db.from('fotos_lotes').delete().eq('id', id);
      if (error) console.error('[ProLarva] deleteFoto:', error.message);
    }
  }, []);

  // ─── Computed ──────────────────────────────────────────────────────────────

  const activeLotes = lotes.filter(l => daysSince(l.fecha) <= 32);
  const readyLotes  = lotes.filter(l => { const d = daysSince(l.fecha); return d >= 22 && d <= 28; });
  const totalKg     = cosechas.reduce((a, c) => a + c.peso, 0);
  const convs       = cosechas.filter(c => c.sustratoTotal > 0).map(c => (c.peso / c.sustratoTotal) * 100);
  const avgConv     = convs.length ? convs.reduce((a, b) => a + b, 0) / convs.length : null;

  return {
    loaded, session, login, logout, register,
    lotes, feeds, cosechas, recordatorios, fotos,
    addLote, deleteLote, updateLote,
    addFeed,
    addCosecha,
    addRecordatorio, toggleRecordatorio, deleteRecordatorio,
    addFoto, deleteFoto,
    activeLotes, readyLotes, totalKg, avgConv,
  };
}
