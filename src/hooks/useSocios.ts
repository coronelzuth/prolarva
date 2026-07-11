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

      // Load from localStorage first
      const localLotes    = load<Lote[]>(KEYS.lotes, []);
      const localFeeds    = load<FeedLog[]>(KEYS.feeds, []);
      const localCosechas = load<Cosecha[]>(KEYS.cosechas, []);
      setLotes(localLotes);
      setFeeds(localFeeds);
      setCosechas(localCosechas);

      // Pull from Supabase if logged in
      const db = getSupabase();
      if (db && sess) {
        const code = sess.code;
        const [{ data: dbLotes }, { data: dbFeeds }, { data: dbCosechas }] = await Promise.all([
          db.from('lotes').select('*').eq('socio_code', code),
          db.from('feed_logs').select('*').eq('socio_code', code),
          db.from('cosechas').select('*').eq('socio_code', code),
        ]);

        if (dbLotes) {
          const arr = dbLotes.map(loteFromRow);
          setLotes(arr); localSave(KEYS.lotes, arr);
        }
        if (dbFeeds) {
          const arr = dbFeeds.map(feedFromRow);
          setFeeds(arr); localSave(KEYS.feeds, arr);
        }
        if (dbCosechas) {
          const arr = dbCosechas.map(cosechaFromRow);
          setCosechas(arr); localSave(KEYS.cosechas, arr);
        }
      }

      setLoaded(true);
    }
    init();
  }, []);

  // ─── Auth ──────────────────────────────────────────────────────────────────

  const login = useCallback(async (code: string, pass: string): Promise<boolean> => {
    const db = getSupabase();
    if (!db) {
      console.error('Supabase not configured');
      return false;
    }

    // Buscar por código o email
    const { data, error } = await db
      .from('socios')
      .select('*')
      .or(`codigo.eq.${code},email.eq.${code}`)
      .single();

    if (error || !data) return false;

    // Validar contraseña (comparar directamente por ahora)
    // TODO: Usar bcrypt o similar en producción
    if (data.password !== pass) return false;

    // Crear sesión
    const s = { code: data.codigo, name: data.nombre };
    setSession(s);
    localSave(KEYS.session, s);
    return true;
  }, []);

  const register = useCallback(
    async (codigo: string, email: string, nombre: string, password: string): Promise<{ success: boolean; error?: string }> => {
      const db = getSupabase();
      if (!db) return { success: false, error: 'Supabase no configurado' };

      // Validar campos
      if (!codigo || !email || !nombre || !password) {
        return { success: false, error: 'Completa todos los campos' };
      }

      if (password.length < 6) {
        return { success: false, error: 'La contraseña debe tener al menos 6 caracteres' };
      }

      // Verificar que código y email no existan
      const { data: existing } = await db
        .from('socios')
        .select('id')
        .or(`codigo.eq.${codigo},email.eq.${email}`)
        .limit(1);

      if (existing && existing.length > 0) {
        return { success: false, error: 'Código o email ya registrado' };
      }

      // Crear nuevo socio
      const { error: insertError } = await db.from('socios').insert({
        id: uid(),
        codigo,
        email,
        nombre,
        password, // TODO: hashear en producción
        estado: 'activo',
      });

      if (insertError) {
        return { success: false, error: insertError.message };
      }

      // Login automático
      const loginSuccess = await login(codigo, password);
      return { success: loginSuccess, error: loginSuccess ? undefined : 'No se pudo iniciar sesión' };
    },
    [login]
  );

  const logout = useCallback(() => {
    setSession(null);
    localSave(KEYS.session, null);
  }, []);

  // ─── Lotes ─────────────────────────────────────────────────────────────────

  const addLote = useCallback((lote: Omit<Lote, 'id' | 'creadoEn'>) => {
    const next: Lote = { ...lote, id: uid(), creadoEn: new Date().toISOString() };
    setLotes(prev => {
      const arr = [...prev, next];
      localSave(KEYS.lotes, arr);
      const db = getSupabase();
      if (db && session) db.from('lotes').upsert(loteToRow(session.code, next));
      return arr;
    });
  }, [session]);

  const deleteLote = useCallback((id: string) => {
    setLotes(prev => {
      const arr = prev.filter(l => l.id !== id);
      localSave(KEYS.lotes, arr);
      const db = getSupabase();
      if (db) db.from('lotes').delete().eq('id', id);
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
  }, []);

  const updateLote = useCallback((id: string, updates: Partial<Pick<Lote, 'nombre' | 'fecha'>>) => {
    setLotes(prev => {
      const arr = prev.map(l => l.id === id ? { ...l, ...updates } : l);
      localSave(KEYS.lotes, arr);
      const db = getSupabase();
      const updated = arr.find(l => l.id === id);
      if (db && session && updated) db.from('lotes').upsert(loteToRow(session.code, updated));
      return arr;
    });
  }, [session]);

  // ─── Feeds ─────────────────────────────────────────────────────────────────

  const addFeed = useCallback((feed: Omit<FeedLog, 'id'>) => {
    const next: FeedLog = { ...feed, id: uid() };
    setFeeds(prev => {
      const arr = [...prev, next];
      localSave(KEYS.feeds, arr);
      const db = getSupabase();
      if (db && session) db.from('feed_logs').upsert(feedToRow(session.code, next));
      return arr;
    });
  }, [session]);

  // ─── Cosechas ──────────────────────────────────────────────────────────────

  const addCosecha = useCallback((cosecha: Omit<Cosecha, 'id'>) => {
    const next: Cosecha = { ...cosecha, id: uid() };
    setCosechas(prev => {
      const arr = [...prev, next];
      localSave(KEYS.cosechas, arr);
      const db = getSupabase();
      if (db && session) db.from('cosechas').upsert(cosechaToRow(session.code, next));
      return arr;
    });
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
