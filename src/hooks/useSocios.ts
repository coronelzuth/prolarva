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

// ─── Auth types ──────────────────────────────────────────────────────────────

export interface AuthError {
  message: string;
  code?: string;
}

// ─── Storage keys ─────────────────────────────────────────────────────────────

const KEYS = {
  session:  'prl-session',
  lotes:    'prl-lotes',
  feeds:    'prl-feeds',
  cosechas: 'prl-cosechas',
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

// ─── Supabase sync helpers ────────────────────────────────────────────────────

async function syncFromSupabase(
  db: ReturnType<typeof getSupabase>,
  code: string,
  localLotes: Lote[],
  localFeeds: FeedLog[],
  localCosechas: Cosecha[],
): Promise<{ lotes: Lote[] | null; feeds: FeedLog[] | null; cosechas: Cosecha[] | null }> {
  if (!db) return { lotes: null, feeds: null, cosechas: null };

  const [{ data: dbLotes }, { data: dbFeeds }, { data: dbCosechas }] = await Promise.all([
    db.from('lotes').select('*').eq('socio_code', code),
    db.from('feed_logs').select('*').eq('socio_code', code),
    db.from('cosechas').select('*').eq('socio_code', code),
  ]);

  let lotes: Lote[] | null = null;
  let feeds: FeedLog[] | null = null;
  let cosechas: Cosecha[] | null = null;

  // Lotes: si Supabase tiene datos, úsalos; si está vacío pero local tiene datos, empuja local a Supabase
  if (dbLotes !== null) {
    if (dbLotes.length > 0) {
      lotes = dbLotes.map(loteFromRow);
    } else if (localLotes.length > 0) {
      // Recuperar: subir datos locales a Supabase
      await Promise.all(localLotes.map(l => db.from('lotes').upsert(loteToRow(code, l))));
      lotes = localLotes; // mantener datos locales
    } else {
      lotes = [];
    }
  }

  // Feeds
  if (dbFeeds !== null) {
    if (dbFeeds.length > 0) {
      feeds = dbFeeds.map(feedFromRow);
    } else if (localFeeds.length > 0) {
      await Promise.all(localFeeds.map(f => db.from('feed_logs').upsert(feedToRow(code, f))));
      feeds = localFeeds;
    } else {
      feeds = [];
    }
  }

  // Cosechas
  if (dbCosechas !== null) {
    if (dbCosechas.length > 0) {
      cosechas = dbCosechas.map(cosechaFromRow);
    } else if (localCosechas.length > 0) {
      await Promise.all(localCosechas.map(c => db.from('cosechas').upsert(cosechaToRow(code, c))));
      cosechas = localCosechas;
    } else {
      cosechas = [];
    }
  }

  return { lotes, feeds, cosechas };
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useSocios() {
  const [session,   setSession]  = useState<SocioSession | null>(null);
  const [lotes,     setLotes]    = useState<Lote[]>([]);
  const [feeds,     setFeeds]    = useState<FeedLog[]>([]);
  const [cosechas,  setCosechas] = useState<Cosecha[]>([]);
  const [loaded,    setLoaded]   = useState(false);

  useEffect(() => {
    async function init() {
      const sess = load<SocioSession | null>(KEYS.session, null);
      setSession(sess);

      // Cargar de localStorage primero (respuesta inmediata)
      const localLotes    = load<Lote[]>(KEYS.lotes, []);
      const localFeeds    = load<FeedLog[]>(KEYS.feeds, []);
      const localCosechas = load<Cosecha[]>(KEYS.cosechas, []);
      setLotes(localLotes);
      setFeeds(localFeeds);
      setCosechas(localCosechas);

      // Sincronizar con Supabase si hay sesión activa
      const db = getSupabase();
      if (db && sess) {
        const { lotes: dbL, feeds: dbF, cosechas: dbC } = await syncFromSupabase(
          db, sess.code, localLotes, localFeeds, localCosechas
        );

        // Solo actualizar estado si Supabase devolvió datos (no null)
        if (dbL !== null) { setLotes(dbL); localSave(KEYS.lotes, dbL); }
        if (dbF !== null) { setFeeds(dbF); localSave(KEYS.feeds, dbF); }
        if (dbC !== null) { setCosechas(dbC); localSave(KEYS.cosechas, dbC); }
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

      // Cargar datos de Supabase inmediatamente después del login
      const db = getSupabase();
      if (db) {
        const localLotes    = load<Lote[]>(KEYS.lotes, []);
        const localFeeds    = load<FeedLog[]>(KEYS.feeds, []);
        const localCosechas = load<Cosecha[]>(KEYS.cosechas, []);
        const { lotes: dbL, feeds: dbF, cosechas: dbC } = await syncFromSupabase(
          db, s.code, localLotes, localFeeds, localCosechas
        );
        if (dbL !== null) { setLotes(dbL); localSave(KEYS.lotes, dbL); }
        if (dbF !== null) { setFeeds(dbF); localSave(KEYS.feeds, dbF); }
        if (dbC !== null) { setCosechas(dbC); localSave(KEYS.cosechas, dbC); }
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

        if (!res.ok) {
          return { success: false, error: data.error ?? 'Error al registrar' };
        }

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
    setLotes(prev => {
      const arr = [...prev, next];
      localSave(KEYS.lotes, arr);
      return arr;
    });
    const db = getSupabase();
    if (db && session) {
      const { error } = await db.from('lotes').upsert(loteToRow(session.code, next));
      if (error) console.error('[ProLarva] Error guardando lote en Supabase:', error.message);
    }
  }, [session]);

  const deleteLote = useCallback(async (id: string) => {
    setLotes(prev => {
      const arr = prev.filter(l => l.id !== id);
      localSave(KEYS.lotes, arr);
      return arr;
    });
    setFeeds(prev => {
      const arr = prev.filter(f => f.loteId !== id);
      localSave(KEYS.feeds, arr);
      return arr;
    });
    setCosechas(prev => {
      const arr = prev.filter(c => c.loteId !== id);
      localSave(KEYS.cosechas, arr);
      return arr;
    });
    const db = getSupabase();
    if (db) {
      const { error } = await db.from('lotes').delete().eq('id', id);
      if (error) console.error('[ProLarva] Error eliminando lote en Supabase:', error.message);
    }
  }, []);

  const updateLote = useCallback(async (id: string, updates: Partial<Pick<Lote, 'nombre' | 'fecha'>>) => {
    setLotes(prev => {
      const arr = prev.map(l => l.id === id ? { ...l, ...updates } : l);
      localSave(KEYS.lotes, arr);
      return arr;
    });
    const db = getSupabase();
    if (db && session) {
      const { error } = await db.from('lotes').update(updates).eq('id', id);
      if (error) console.error('[ProLarva] Error actualizando lote en Supabase:', error.message);
    }
  }, [session]);

  // ─── Feeds ─────────────────────────────────────────────────────────────────

  const addFeed = useCallback(async (feed: Omit<FeedLog, 'id'>) => {
    const next: FeedLog = { ...feed, id: uid() };
    setFeeds(prev => {
      const arr = [...prev, next];
      localSave(KEYS.feeds, arr);
      return arr;
    });
    const db = getSupabase();
    if (db && session) {
      const { error } = await db.from('feed_logs').upsert(feedToRow(session.code, next));
      if (error) console.error('[ProLarva] Error guardando alimentación en Supabase:', error.message);
    }
  }, [session]);

  // ─── Cosechas ──────────────────────────────────────────────────────────────

  const addCosecha = useCallback(async (cosecha: Omit<Cosecha, 'id'>) => {
    const next: Cosecha = { ...cosecha, id: uid() };
    setCosechas(prev => {
      const arr = [...prev, next];
      localSave(KEYS.cosechas, arr);
      return arr;
    });
    const db = getSupabase();
    if (db && session) {
      const { error } = await db.from('cosechas').upsert(cosechaToRow(session.code, next));
      if (error) console.error('[ProLarva] Error guardando cosecha en Supabase:', error.message);
    }
  }, [session]);

  // ─── Computed ──────────────────────────────────────────────────────────────

  const activeLotes = lotes.filter(l => daysSince(l.fecha) <= 32);
  const readyLotes  = lotes.filter(l => { const d = daysSince(l.fecha); return d >= 22 && d <= 32; });
  const totalKg     = cosechas.reduce((a, c) => a + c.peso, 0);
  const convs       = cosechas.filter(c => c.sustratoTotal > 0).map(c => (c.peso / c.sustratoTotal) * 100);
  const avgConv     = convs.length ? convs.reduce((a, b) => a + b, 0) / convs.length : null;

  return {
    loaded, session, login, logout, register,
    lotes, feeds, cosechas,
    addLote, deleteLote, updateLote, addFeed, addCosecha,
    activeLotes, readyLotes, totalKg, avgConv,
  };
}
